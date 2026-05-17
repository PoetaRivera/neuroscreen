import { describe, it, expect } from 'vitest';
import {
  calculateTdahScore,
  calculateTeaScore,
  calculateHspScore,
  calculateAlexithymiaScore,
  calculateRsdScore,
  calculateMaskingBurnoutScore,
  calculateExecutiveScore,
  calculateDatScore,
} from './scoring';

// ─── Helpers ─────────────────────────────────────

const all = (n, value) => new Array(n).fill(value);

// ─── TDAH ────────────────────────────────────────

describe('calculateTdahScore', () => {
  it('all zeros → baja probabilidad, score 0', () => {
    const r = calculateTdahScore(all(16, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('baja-probabilidad');
    expect(r.profiles).toHaveLength(0);
  });

  it('all max (4) → alta probabilidad, score 64, 3 profiles', () => {
    const r = calculateTdahScore(all(16, 4));
    expect(r.total).toBe(64);
    expect(r.category).toBe('alta-probabilidad');
    expect(r.profiles).toHaveLength(3);
  });

  it('detects inattention profile at threshold ≥16', () => {
    // 8 inattention questions at value 2 each = 16 (threshold)
    const answers = [...all(8, 2), ...all(8, 0)];
    const r = calculateTdahScore(answers);
    expect(r.dimensions[0].score).toBe(16);
    expect(r.profiles.some((p) => p.id === 'inatencion-marcada')).toBe(true);
  });

  it('inattention at 15 → no profile detected', () => {
    const answers = [2, 2, 2, 2, 2, 2, 2, 1, ...all(8, 0)];
    const r = calculateTdahScore(answers);
    expect(r.profiles.some((p) => p.id === 'inatencion-marcada')).toBe(false);
  });

  it('dimensions have correct keys and max values', () => {
    const r = calculateTdahScore(all(16, 2));
    expect(r.dimensions).toHaveLength(3);
    expect(r.dimensions[0]).toEqual({ key: 'inattention', label: 'Inatención', score: 16, max: 32 });
    expect(r.dimensions[1]).toEqual({ key: 'hyperactivityPhysical', label: 'Hiperactividad física', score: 6, max: 12 });
    expect(r.dimensions[2]).toEqual({ key: 'impulsivityVerbal', label: 'Impulsividad verbal', score: 10, max: 20 });
  });

  it('moderada at boundary ≤36', () => {
    // 9 questions at value 4 = 36 (exactly the boundary)
    const answers = [...all(9, 4), ...all(7, 0)];
    const r = calculateTdahScore(answers);
    expect(r.total).toBe(36);
    expect(r.category).toBe('moderada-probabilidad');
  });

  it('alta at 37+', () => {
    const answers = [...all(9, 4), 1, ...all(6, 0)];
    const r = calculateTdahScore(answers);
    expect(r.total).toBe(37);
    expect(r.category).toBe('alta-probabilidad');
  });

  it('childhoodNote is present', () => {
    const r = calculateTdahScore(all(16, 2));
    expect(r.childhoodNote).toBeTruthy();
    expect(r.childhoodNote).toContain('12 años');
  });

  it('maxScores matches expected', () => {
    const r = calculateTdahScore(all(16, 0));
    expect(r.maxScores).toEqual({
      inattention: 32,
      hyperactivityPhysical: 12,
      impulsivityVerbal: 20,
      total: 64,
    });
  });
});

// ─── TEA ─────────────────────────────────────────

describe('calculateTeaScore', () => {
  it('all zeros → baja probabilidad', () => {
    const r = calculateTeaScore(all(16, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('baja-probabilidad');
  });

  it('all 4 → alta probabilidad, 4 profiles', () => {
    const r = calculateTeaScore(all(16, 4));
    expect(r.total).toBe(64);
    expect(r.category).toBe('alta-probabilidad');
    expect(r.profiles).toHaveLength(4);
  });

  it('social communication threshold ≥8 (lower due to masking)', () => {
    const answers = [...all(4, 2), ...all(12, 0)]; // 4 × 2 = 8
    const r = calculateTeaScore(answers);
    expect(r.profiles.some((p) => p.id === 'comunicacion-social')).toBe(true);
  });

  it('other dimensions threshold ≥9', () => {
    // routines: 3 × 3 = 9 (threshold)
    const answers = [...all(8, 0), 3, 3, 3, 0, ...all(4, 0)];
    const r = calculateTeaScore(answers);
    expect(r.profiles.some((p) => p.id === 'rutinas-flexibilidad')).toBe(true);
  });

  it('other dimension at 8 → no profile', () => {
    const answers = [...all(8, 0), 2, 2, 2, 2, ...all(4, 0)];
    const r = calculateTeaScore(answers);
    expect(r.profiles.some((p) => p.id === 'rutinas-flexibilidad')).toBe(false);
  });

  it('childhoodNote mentions neurodesarrollo', () => {
    const r = calculateTeaScore(all(16, 2));
    expect(r.childhoodNote).toContain('neurodesarrollo');
  });
});

// ─── HSP ─────────────────────────────────────────

describe('calculateHspScore', () => {
  it('all zeros → sensibilidad-promedio', () => {
    const r = calculateHspScore(all(16, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('sensibilidad-promedio');
  });

  it('all 4 → alta-sensibilidad-marcada', () => {
    const r = calculateHspScore(all(16, 4));
    expect(r.total).toBe(64);
    expect(r.category).toBe('alta-sensibilidad-marcada');
    expect(r.profiles).toHaveLength(4);
  });

  it('threshold ≥9 per dimension', () => {
    // deepProcessing: 4 questions at 2, 3, 2, 2 = 9
    const answers = [2, 3, 2, 2, ...all(12, 0)];
    const r = calculateHspScore(answers);
    expect(r.profiles.some((p) => p.id === 'procesamiento-profundo')).toBe(true);
  });

  it('moderada category at boundary ≤44', () => {
    // 11 questions at value 4 = 44
    const answers = [...all(11, 4), ...all(5, 0)];
    const r = calculateHspScore(answers);
    expect(r.total).toBe(44);
    expect(r.category).toBe('alta-sensibilidad-moderada');
  });

  it('childhoodNote mentions temperamento', () => {
    const r = calculateHspScore(all(16, 2));
    expect(r.childhoodNote).toContain('temperamento');
    expect(r.childhoodNote).toContain('20-30 %');
  });
});

// ─── ALEXITIMIA ──────────────────────────────────

describe('calculateAlexithymiaScore', () => {
  it('all zeros → alexitimia-baja', () => {
    const r = calculateAlexithymiaScore(all(16, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('alexitimia-baja');
  });

  it('all 4 → alexitimia-marcada', () => {
    const r = calculateAlexithymiaScore(all(16, 4));
    expect(r.total).toBe(64);
    expect(r.category).toBe('alexitimia-marcada');
  });

  it('categorías no usan "probabilidad"', () => {
    const r = calculateAlexithymiaScore(all(16, 4));
    expect(r.category).not.toContain('probabilidad');
    expect(r.category).toContain('alexitimia');
  });

  it('childhoodNote mentions TEA', () => {
    const r = calculateAlexithymiaScore(all(16, 2));
    expect(r.childhoodNote).toContain('TEA');
  });
});

// ─── RSD ─────────────────────────────────────────

describe('calculateRsdScore', () => {
  it('all zeros → baja-probabilidad', () => {
    const r = calculateRsdScore(all(16, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('baja-probabilidad');
  });

  it('all 4 → rsd-marcada, 4 profiles', () => {
    const r = calculateRsdScore(all(16, 4));
    expect(r.total).toBe(64);
    expect(r.category).toBe('rsd-marcada');
    expect(r.profiles).toHaveLength(4);
  });

  it('moderada at boundary ≤40', () => {
    const answers = [...all(10, 4), ...all(6, 0)];
    const r = calculateRsdScore(answers);
    expect(r.total).toBe(40);
    expect(r.category).toBe('rsd-moderada');
  });

  it('childhoodNote mentions TDAH and TEA', () => {
    const r = calculateRsdScore(all(16, 2));
    expect(r.childhoodNote).toContain('TDAH');
    expect(r.childhoodNote).toContain('TEA');
  });
});

// ─── BURNOUT MASKING ─────────────────────────────

describe('calculateMaskingBurnoutScore', () => {
  it('all zeros → bajo-burnout-masking', () => {
    const r = calculateMaskingBurnoutScore(all(13, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('bajo-burnout-masking');
  });

  it('all 4 → burnout-masking-severo, 4 profiles, max 52', () => {
    const r = calculateMaskingBurnoutScore(all(13, 4));
    expect(r.total).toBe(52);
    expect(r.category).toBe('burnout-masking-severo');
    expect(r.profiles).toHaveLength(4);
    expect(r.maxScores.total).toBe(52);
  });

  it('max per dimension is irregular', () => {
    const r = calculateMaskingBurnoutScore(all(13, 4));
    expect(r.dimensions[0].max).toBe(16); // physicalExhaustion: 4 items
    expect(r.dimensions[1].max).toBe(12); // identityLoss: 3 items
    expect(r.dimensions[2].max).toBe(8);  // emotionalDisconnect: 2 items
    expect(r.dimensions[3].max).toBe(16); // collapseRecovery: 4 items
  });

  it('identityLoss threshold ≥7 (3 items)', () => {
    // identityLoss: items at indices 4-6 (3 questions). 2+2+3 = 7
    const answers = [...all(4, 0), 2, 2, 3, ...all(6, 0)];
    const r = calculateMaskingBurnoutScore(answers);
    expect(r.profiles.some((p) => p.id === 'perdida-identidad')).toBe(true);
  });

  it('moderado at boundary ≤35', () => {
    // 9 questions at 4 = 36, but we need 35. 8 × 4 + 3 = 35
    const answers = [...all(8, 4), 3, ...all(4, 0)];
    const r = calculateMaskingBurnoutScore(answers);
    expect(r.total).toBe(35);
    expect(r.category).toBe('burnout-masking-moderado');
  });

  it('childhoodNote mentions máscara', () => {
    const r = calculateMaskingBurnoutScore(all(13, 2));
    expect(r.childhoodNote).toContain('máscara');
  });
});

// ─── FUNCIONES EJECUTIVAS ────────────────────────

describe('calculateExecutiveScore', () => {
  it('all zeros → funciones-ejecutivas-preservadas', () => {
    const r = calculateExecutiveScore(all(18, 0));
    expect(r.total).toBe(0);
    expect(r.category).toBe('funciones-ejecutivas-preservadas');
  });

  it('all 4 → dificultades-significativas, max 72', () => {
    const r = calculateExecutiveScore(all(18, 4));
    expect(r.total).toBe(72);
    expect(r.category).toBe('dificultades-ejecutivas-significativas');
    expect(r.maxScores.total).toBe(72);
  });

  it('dimensions have correct lengths (4/5/5/4)', () => {
    const r = calculateExecutiveScore(all(18, 4));
    expect(r.dimensions[0].max).toBe(16); // inhibition: 4 items
    expect(r.dimensions[1].max).toBe(20); // workingMemory: 5 items
    expect(r.dimensions[2].max).toBe(20); // planning: 5 items
    expect(r.dimensions[3].max).toBe(16); // flexibility: 4 items
  });

  it('working memory threshold ≥11 (5 items, ~55%)', () => {
    // workingMemory: indices 4-8 (5 questions). 2+2+2+3+2 = 11
    const answers = [...all(4, 0), 2, 2, 2, 3, 2, ...all(9, 0)];
    const r = calculateExecutiveScore(answers);
    expect(r.profiles.some((p) => p.id === 'memoria-trabajo')).toBe(true);
  });

  it('moderadas at boundary ≤50', () => {
    // 12 questions at 4 = 48, plus 2 = 50
    const answers = [...all(12, 4), 2, ...all(5, 0)];
    const r = calculateExecutiveScore(answers);
    expect(r.total).toBe(50);
    expect(r.category).toBe('dificultades-ejecutivas-moderadas');
  });

  it('childhoodNote mentions TDAH and TEA', () => {
    const r = calculateExecutiveScore(all(18, 2));
    expect(r.childhoodNote).toContain('TDAH');
    expect(r.childhoodNote).toContain('neurodesarrollo');
  });
});

// ─── DAT ─────────────────────────────────────────

describe('calculateDatScore', () => {
  // Mock embeddings: palabras similares → vectores cercanos, palabras diversas → vectores lejanos
  function makeMockEmbeddings(wordVectors) {
    const map = new Map();
    for (const [word, vec] of Object.entries(wordVectors)) {
      map.set(word, new Float32Array(vec));
    }
    return map;
  }

  // Vectores cercanos (misma región semántica): simulan palabras similares
  const closeWords = makeMockEmbeddings({
    perro: [0.1, 0.2, 0.3, 0.1, 0.2],
    gato: [0.15, 0.22, 0.28, 0.12, 0.18],
    pez: [0.12, 0.18, 0.32, 0.08, 0.22],
    caballo: [0.13, 0.21, 0.29, 0.11, 0.19],
    pajaro: [0.14, 0.19, 0.31, 0.09, 0.21],
    conejo: [0.11, 0.23, 0.27, 0.13, 0.17],
    tortuga: [0.16, 0.2, 0.3, 0.1, 0.2],
  });

  // Vectores diversos: cada uno en una región diferente del espacio
  const diverseVectors = makeMockEmbeddings({
    democracia: [0.9, 0.1, 0.05, 0.02, 0.03],
    hidrogeno: [0.02, 0.95, 0.1, 0.05, 0.08],
    melancolia: [0.05, 0.03, 0.88, 0.12, 0.04],
    espagueti: [0.1, 0.08, 0.05, 0.92, 0.06],
    vertigo: [0.03, 0.06, 0.04, 0.02, 0.91],
    algebra: [0.88, 0.02, 0.06, 0.01, 0.07],
    tundra: [0.04, 0.09, 0.07, 0.03, 0.89],
    pecado: [0.07, 0.04, 0.85, 0.06, 0.05],
    catedral: [0.06, 0.05, 0.03, 0.88, 0.04],
    eon: [0.08, 0.07, 0.05, 0.04, 0.86],
  });

  it('less than 7 words → error', () => {
    const r = calculateDatScore(['perro', 'gato', 'pez'], closeWords);
    expect(r.error).toBeTruthy();
    expect(r.total).toBe(0);
  });

  it('7 valid words → returns result with all fields', () => {
    const words = ['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'];
    const r = calculateDatScore(words, diverseVectors);
    expect(r.error).toBeUndefined();
    expect(r.total).toBeGreaterThan(0);
    expect(r.total).toBeLessThanOrEqual(200);
    expect(r.finalScore).toBeGreaterThan(0);
    expect(r.averageDistance).toBeGreaterThan(0);
    expect(r.pairwiseDistances).toHaveLength(21); // 7 choose 2 = 21
    expect(r.wordsUsed).toHaveLength(7);
    expect(r.maxScores.total).toBe(100);
    expect(r.dimensions).toEqual([]);
    expect(r.profiles).toEqual([]);
  });

  it('similar words → lower score (convergente)', () => {
    const words = ['perro', 'gato', 'pez', 'caballo', 'pajaro', 'conejo', 'tortuga'];
    const r = calculateDatScore(words, closeWords);
    expect(r.total).toBeLessThan(50);
  });

  it('diverse words → higher score', () => {
    const words = ['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'];
    const r = calculateDatScore(words, diverseVectors);
    expect(r.total).toBeGreaterThan(50);
  });

  it('pairwise distances are sorted ascending', () => {
    const words = ['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'];
    const r = calculateDatScore(words, diverseVectors);
    for (let i = 1; i < r.pairwiseDistances.length; i++) {
      expect(r.pairwiseDistances[i].distance).toBeGreaterThanOrEqual(r.pairwiseDistances[i - 1].distance);
    }
  });

  it('result includes childhoodNote', () => {
    const r = calculateDatScore(['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'], diverseVectors);
    expect(r.childhoodNote).toBeTruthy();
    expect(r.childhoodNote).toContain('Olson');
  });

  it('wordsUsed only includes words with embeddings', () => {
    const r = calculateDatScore(
      ['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra', 'xyz_inventada_123'],
      diverseVectors
    );
    expect(r.wordsUsed).toHaveLength(7);
    expect(r.unknownWords).toContain('xyz_inventada_123');
  });

  it('word count in wordsUsed equals distinctCategories (new naming)', () => {
    const words = ['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'];
    const r = calculateDatScore(words, diverseVectors);
    expect(r.distinctCategories).toBe(7); // now equals word count
  });
});

// ─── Unified interface ───────────────────────────

describe('unified scoring interface', () => {
  // Mock embeddings para las pruebas unificadas del DAT
  const mockDatEmbeddings = new Map();
  ['arbol', 'democracia', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'].forEach((w, i) => {
    const v = new Float32Array(5);
    v[i % 5] = 0.9;
    mockDatEmbeddings.set(w, v);
  });

  const allFunctions = [
    { name: 'TDAH', fn: calculateTdahScore, input: all(16, 2) },
    { name: 'TEA', fn: calculateTeaScore, input: all(16, 2) },
    { name: 'HSP', fn: calculateHspScore, input: all(16, 2) },
    { name: 'Alexitimia', fn: calculateAlexithymiaScore, input: all(16, 2) },
    { name: 'RSD', fn: calculateRsdScore, input: all(16, 2) },
    { name: 'Burnout', fn: calculateMaskingBurnoutScore, input: all(13, 2) },
    { name: 'Ejecutivas', fn: calculateExecutiveScore, input: all(18, 2) },
    { name: 'DAT', fn: (words) => calculateDatScore(words, mockDatEmbeddings), input: ['arbol', 'democracia', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'] },
  ];

  allFunctions.forEach(({ name, fn, input }) => {
    it(`${name}: returns object with required keys`, () => {
      const r = fn(input);
      expect(r).toHaveProperty('total');
      expect(r).toHaveProperty('category');
      expect(r).toHaveProperty('description');
      expect(r).toHaveProperty('childhoodNote');
      expect(r).toHaveProperty('dimensions');
      expect(r).toHaveProperty('maxScores');
      expect(r).toHaveProperty('profiles');
      expect(typeof r.total).toBe('number');
      expect(typeof r.category).toBe('string');
      expect(typeof r.description).toBe('string');
      expect(Array.isArray(r.dimensions)).toBe(true);
      expect(Array.isArray(r.profiles)).toBe(true);
    });

    it(`${name}: description is non-empty`, () => {
      const r = fn(input);
      expect(r.description.length).toBeGreaterThan(10);
    });

    it(`${name}: childhoodNote is non-empty`, () => {
      const r = fn(input);
      expect(r.childhoodNote.length).toBeGreaterThan(20);
    });
  });
});
