import { useState, useRef, useCallback, useMemo } from 'react';
import { DAT_EXAMPLES, DAT_STRATEGIES, VALIDATION_RULES, SEMANTIC_CATEGORIES } from '../../data/datConfig';
import { validateWord } from '../../utils/wordValidation';

// Índice palabra → categoría para detección rápida
const wordToCategory = new Map();
for (const [catName, catData] of Object.entries(SEMANTIC_CATEGORIES)) {
  for (const word of catData.words) {
    wordToCategory.set(word.toLowerCase(), catName);
  }
}
// Nombres legibles de categorías para advertencias
const categoryNames = Object.fromEntries(
  Object.entries(SEMANTIC_CATEGORIES).map(([key, val]) => [key, val.words[0]]),
);

function getWordCategory(word) {
  return wordToCategory.get(word.toLowerCase().trim()) || null;
}

function ExampleAccordion({ example, type }) {
  const [open, setOpen] = useState(false);

  const colors = {
    narrative: { bg: 'var(--color-danger-bg)', border: '#fca5a5', tag: 'var(--color-danger)' },
    convergent: { bg: 'var(--color-danger-bg)', border: '#fca5a5', tag: 'var(--color-danger)' },
    semiDivergent: { bg: 'var(--color-warning-bg)', border: '#fcd34d', tag: 'var(--color-warning)' },
    highlyDivergent: { bg: 'var(--color-success-bg)', border: '#86efac', tag: 'var(--color-success)' },
  };

  const style = colors[type] || colors.convergent;

  return (
    <div
      className="dat-example-accordion"
      style={{ border: `1px solid ${style.border}`, borderRadius: '8px', marginBottom: '12px', overflow: 'hidden' }}
    >
      <button
        className="dat-example-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: '100%', padding: '12px 16px', background: style.bg, border: 'none',
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.95rem', fontWeight: 600, textAlign: 'left',
        }}
      >
        <span>
          <span aria-hidden="true" style={{ color: style.tag, marginRight: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
            {type === 'narrative' || type === 'convergent' ? '❌' : type === 'semiDivergent' ? '⚠️' : '✅'}
          </span>
          {example.label}
        </span>
        <span aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>
      {open && (
        <div style={{ padding: '16px' }}>
          <div className="dat-example-words" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {example.words.map((w, i) => (
              <span key={i} className="dat-word-chip readonly" style={{
                background: 'var(--color-border-light)', padding: '4px 12px', borderRadius: '16px',
                fontSize: '0.85rem', color: 'var(--color-text)',
              }}>
                {w}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>{example.explanation}</p>
        </div>
      )}
    </div>
  );
}

function StrategyAccordion({ strategy }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: '100%', padding: '10px 14px', background: 'var(--color-task-key-bg)', border: 'none',
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.9rem', fontWeight: 500, textAlign: 'left',
        }}
      >
        {strategy.title}
        <span aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>
      {open && (
        <ul style={{ padding: '8px 14px 14px 32px', margin: 0, fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          {strategy.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DatInput({ onComplete, loading }) {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [categoryWarning, setCategoryWarning] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);
  const inputRef = useRef(null);

  // Detectar categorías de palabras actuales
  const wordCategories = useMemo(() => {
    const cats = new Map();
    for (const w of words) {
      const cat = getWordCategory(w);
      if (cat) cats.set(w.toLowerCase(), cat);
    }
    return cats;
  }, [words]);

  const handleAdd = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const result = validateWord(trimmed, words);
    if (!result.valid) {
      setError(result.error);
      setCategoryWarning(null);
      return;
    }

    // Detectar misma categoría semántica
    const newCat = getWordCategory(trimmed);
    let sameCategoryPair = null;
    if (newCat) {
      for (const [existingWord, existingCat] of wordCategories) {
        if (existingCat === newCat) {
          sameCategoryPair = existingWord;
          break;
        }
      }
    }

    setError(null);
    setWords((prev) => [...prev, trimmed]);
    setInputValue('');

    if (sameCategoryPair) {
      const catLabel = categoryNames[newCat] || newCat;
      setCategoryWarning(
        `"${sameCategoryPair}" y "${trimmed}" pertenecen al mismo dominio (${catLabel}). Intenta saltar a otro departamento completamente distinto.`,
      );
    } else {
      setCategoryWarning(null);
    }

    inputRef.current?.focus();
  }, [inputValue, words, wordCategories]);

  const handleRemove = useCallback((index) => {
    setWords((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  const canAdd = words.length < VALIDATION_RULES.maxWords && inputValue.trim().length > 0;
  const canSubmit = words.length >= VALIDATION_RULES.minWords;
  const remaining = VALIDATION_RULES.maxWords - words.length;

  return (
    <div className="dat-input">
      {/* Consigna */}
      <div className="dat-consigna" style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>
          Escribe 10 palabras que NO tengan nada que ver entre sí.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Ninguna conexión. Ninguna historia. Ningún hilo narrativo.
          Imagina 10 cajones de un almacén, cada uno de una tienda distinta.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', margin: 0 }}>
          Abres uno, sacas una palabra. Lo cierras. Abres otro completamente diferente. Sin mirar atrás.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
          Basado en Olson, Nahas, Chmoulevitch, Cropper & Webb (2021). PNAS.
        </p>
      </div>

      {/* Carga de modelo de embeddings */}
      {loading && (
        <div style={{
          textAlign: 'center', padding: '16px', marginBottom: '16px',
          background: 'var(--color-accent-subtle)', borderRadius: 'var(--radius-md)',
          color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: 500,
        }}>
          Cargando modelo de lenguaje… (aproximadamente 3.6 MB)
        </div>
      )}

      {/* Ejemplos desplegables */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="btn btn-link"
          onClick={() => setShowExamples(!showExamples)}
          aria-expanded={showExamples}
          style={{ fontSize: '0.9rem', padding: 0, marginBottom: showExamples ? '12px' : 0 }}
        >
          {showExamples ? '▲ Ocultar ejemplos' : '▼ Ver ejemplos orientativos'}
        </button>
        {showExamples && (
          <div>
            <ExampleAccordion example={DAT_EXAMPLES.narrative} type="narrative" />
            <ExampleAccordion example={DAT_EXAMPLES.convergent} type="convergent" />
            <ExampleAccordion example={DAT_EXAMPLES.semiDivergent} type="semiDivergent" />
            <ExampleAccordion example={DAT_EXAMPLES.highlyDivergent} type="highlyDivergent" />
          </div>
        )}
      </div>

      {/* Estrategias */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="btn btn-link"
          onClick={() => setShowStrategies(!showStrategies)}
          aria-expanded={showStrategies}
          style={{ fontSize: '0.9rem', padding: 0, marginBottom: showStrategies ? '8px' : 0 }}
        >
          {showStrategies ? '▲ Ocultar estrategias' : '▼ ¿No se te ocurren palabras? Estrategias sugeridas'}
        </button>
        {showStrategies && (
          <div style={{ marginTop: '8px' }}>
            {DAT_STRATEGIES.map((s, i) => (
              <StrategyAccordion key={i} strategy={s} />
            ))}
          </div>
        )}
      </div>

      {/* Input + botón Agregar */}
      <div className="dat-input-row" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={remaining > 0 ? `Escribe una palabra... (${remaining} por agregar)` : 'Ya tienes 10 palabras'}
          disabled={!remaining}
          aria-label="Escribe una palabra"
          className="dat-text-input"
          style={{
            flex: 1, padding: '10px 14px', fontSize: '1rem', border: '1px solid #d1d5db',
            borderRadius: '8px', outline: 'none',
          }}
          autoComplete="off"
        />
        <button
          className="btn btn-secondary"
          onClick={handleAdd}
          disabled={!canAdd}
          aria-label="Agregar palabra"
          style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}
        >
          Agregar
        </button>
      </div>

      {/* Error de validación */}
      {error && (
        <p className="dat-validation-error" style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: '0 0 12px 0' }} role="alert">
          {error}
        </p>
      )}

      {/* Advertencia de misma categoría */}
      {categoryWarning && !error && (
        <p className="dat-category-warning" style={{
          color: 'var(--color-warning)', fontSize: '0.85rem', margin: '0 0 12px 0',
          background: 'var(--color-warning-bg)', padding: '8px 12px', borderRadius: '6px',
          border: '1px solid #fcd34d',
        }} role="alert">
          <span aria-hidden="true">⚠️</span> {categoryWarning}
        </p>
      )}

      {/* Chips de palabras */}
      {words.length > 0 && (
        <div className="dat-words-container" style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            {words.length} de {VALIDATION_RULES.maxWords} palabras
            {words.length >= VALIDATION_RULES.minWords && ' — mínimo alcanzado'}
          </p>
          <div className="dat-word-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {words.map((word, i) => (
              <span key={i} className="dat-word-chip" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'var(--color-accent-subtle)', color: 'var(--color-accent-deep)', padding: '6px 8px 6px 14px',
                borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500,
                border: '1px solid #bfdbfe',
              }}>
                {word}
                <button
                  onClick={() => handleRemove(i)}
                  aria-label={`Eliminar ${word}`}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: '1.1rem', lineHeight: 1, padding: '0 4px', color: 'var(--color-text-tertiary)',
                    borderRadius: '50%',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-tertiary)'; }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botón Calcular */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        {!canSubmit && words.length > 0 && (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
            Agrega al menos {VALIDATION_RULES.minWords} palabras para calcular tu resultado
            (te {VALIDATION_RULES.minWords - words.length > 1 ? 'faltan' : 'falta'} {VALIDATION_RULES.minWords - words.length})
          </p>
        )}
        <button
          className="btn btn-primary"
          onClick={() => onComplete(words)}
          disabled={!canSubmit}
          aria-label="Calcular resultado"
          style={{ padding: '14px 40px', fontSize: '1.05rem' }}
        >
          Calcular resultado
        </button>
      </div>
    </div>
  );
}
