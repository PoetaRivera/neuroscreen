// ═══════════════════════════════════════════════════
// DAT Embeddings Loader
// Basado en Olson et al. (2021). PNAS, 118(25), e2022340118.
// DOI: 10.1073/pnas.2022340118
// Vectores: GloVe SBWC (Spanish Billion Words Corpus)
// Fuente: Universidad de Chile, CC-BY-4.0
// https://github.com/dccuchile/spanish-word-embeddings
// ═══════════════════════════════════════════════════

const EMBEDDINGS_URL = '/data/glove-es-20k.json.gz';
const CACHE_KEY = 'evalumind_dat_embeddings';

let embeddingsPromise = null;

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function magnitude(v) {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

/**
 * Cosine distance between two vectors.
 * Returns 0 (identical) to 1 (orthogonal) to 2 (opposite).
 */
export function cosineDistance(a, b) {
  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);

  if (magA === 0 || magB === 0) return 1;

  const similarity = dot / (magA * magB);
  return 1 - similarity;
}

async function decompressGzip(arrayBuffer) {
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  const reader = ds.readable.getReader();

  writer.write(arrayBuffer);
  writer.close();

  const chunks = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(result);
}

/**
 * Carga los embeddings desde el archivo comprimido o sessionStorage.
 * Retorna Map<string, Float32Array>.
 */
export async function loadEmbeddings() {
  if (embeddingsPromise) return embeddingsPromise;

  embeddingsPromise = (async () => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const raw = JSON.parse(cached);
        const map = new Map();
        for (const [word, vec] of Object.entries(raw)) {
          map.set(word, new Float32Array(vec));
        }
        return map;
      }
    } catch {
      // Cache corrupto o no disponible, cargar desde red
    }

    const response = await fetch(EMBEDDINGS_URL);
    if (!response.ok) {
      throw new Error(`Error al cargar embeddings: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const json = await decompressGzip(arrayBuffer);
    const raw = JSON.parse(json);

    const map = new Map();
    for (const [word, vec] of Object.entries(raw)) {
      map.set(word, new Float32Array(vec));
    }

    try {
      sessionStorage.setItem(CACHE_KEY, json);
    } catch {
      // sessionStorage lleno, los embeddings se recargarán de red
    }

    return map;
  })();

  return embeddingsPromise;
}

/**
 * Busca un vector para una palabra. Prueba:
 * 1. Palabra exacta (lowercase)
 * 2. Singular si termina en 's' o 'es'
 * Retorna null si no se encuentra.
 */
export function findVector(embeddings, word) {
  const lower = word.toLowerCase().trim();

  if (embeddings.has(lower)) return embeddings.get(lower);

  // Intentar singular: quitar 's' o 'es' final
  if (lower.endsWith('es') && lower.length > 4) {
    const singular = lower.slice(0, -2);
    if (embeddings.has(singular)) return embeddings.get(singular);
  } else if (lower.endsWith('s') && lower.length > 4) {
    const singular = lower.slice(0, -1);
    if (embeddings.has(singular)) return embeddings.get(singular);
  }

  return null;
}
