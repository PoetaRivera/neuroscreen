import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllTestCards } from '../data/testMetadata';
import './HomePage.css';

const LIKERT_IDS = ['tdah-adulto', 'tea-adulto', 'hsp-adulto', 'alexitimia-adulto', 'rsd-adulto', 'burnout-masking', 'funciones-ejecutivas'];
const TASK_IDS = ['dat', 'fas', 'social-scenarios', 'self-discrepancy', 'fer', 'sart', 'flanker', 'digit-span', 'navon', 'rmet', 'switch-task', 'sensory-threshold', 'auditory-distraction'];

function TestCard({ test, navigate }) {
  return (
    <div className="test-card" data-testid={`test-card-${test.id}`}>
      <h3>{test.title}</h3>
      <p className="test-card-desc">{test.description}</p>
      <div className="test-card-meta">
        <span>{test.isTask ? 'Tarea interactiva' : `${test.questionCount} preguntas`}</span>
        <span>~{test.estimatedMinutes || (test.isTask ? 5 : Math.max(4, Math.ceil(test.questionCount / 2.5)))} min</span>
      </div>
      <button className="btn btn-primary" data-testid={`start-test-${test.id}`} onClick={() => navigate(`/test/${test.id}`)}>
        {test.isTask ? 'Comenzar tarea' : 'Comenzar'}
      </button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const tests = getAllTestCards();
  const likertTests = useMemo(() => tests.filter((t) => LIKERT_IDS.includes(t.id)), [tests]);
  const taskTests = useMemo(() => tests.filter((t) => TASK_IDS.includes(t.id)), [tests]);

  return (
    <div className="home-page">
      {/* ─── Hero ─── */}
      <section className="home-hero">
        <div className="home-hero-badge">Evaluación cognitiva</div>
        <h1 className="home-hero-title">Conoce cómo funciona tu mente</h1>
        <p className="home-hero-subtitle">
          Tests gratuitos que combinan preguntas de auto-observación con ejercicios interactivos.
          Resultados claros en menos de 10 minutos, sin registro ni datos personales.
        </p>
        <div className="home-hero-actions">
          <a href="#tests" className="btn btn-primary btn-lg">Comenzar evaluación</a>
          <Link to="/perfil" className="btn btn-secondary btn-lg">Ver mi perfil</Link>
        </div>
        <div className="home-hero-trust">
          <span>Gratuito</span>
          <span>Sin registro</span>
          <span>Resultados inmediatos</span>
          <span>Privado</span>
        </div>
      </section>

      {/* ─── Cómo funciona ─── */}
      <section className="home-how">
        <div className="home-how-inner">
          <span className="home-section-label">Tu experiencia</span>
          <h2 className="home-section-title">Tres pasos. Sin curva de aprendizaje.</h2>
          <div className="home-steps">
            <div className="home-step">
              <div className="home-step-num">1</div>
              <div className="home-step-content">
                <h3>Elige un área</h3>
                <p>Atención, memoria, sensibilidad, emociones o cognición social. Empieza por lo que te intrigue.</p>
              </div>
            </div>
            <div className="home-step">
              <div className="home-step-num">2</div>
              <div className="home-step-content">
                <h3>Responde y ejercita</h3>
                <p>Cuestionarios sobre tu experiencia diaria y ejercicios breves que miden tu rendimiento real.</p>
              </div>
            </div>
            <div className="home-step">
              <div className="home-step-num">3</div>
              <div className="home-step-content">
                <h3>Descubre tu perfil</h3>
                <p>Resultados claros por área, mapa combinado, y notas que conectan tus patrones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Confianza ─── */}
      <section className="home-trust">
        <div className="home-trust-inner">
          <div className="home-trust-item">
            <h4>Dos tipos de prueba</h4>
            <p>Combinamos lo que tú percibes (cuestionarios) con lo que mide el sistema (tareas interactivas). La combinación de ambas perspectivas ofrece una visión más completa.</p>
          </div>
          <div className="home-trust-item">
            <h4>Resultados orientativos</h4>
            <p>Ningún test constituye un diagnóstico. Son herramientas de auto-conocimiento basadas en criterios científicos. Si algo te preocupa, consulta con un profesional.</p>
          </div>
          <div className="home-trust-item">
            <h4>Privacidad real</h4>
            <p>No pedimos datos personales ni usamos cookies de seguimiento. Tu perfil local vive en la sesión del navegador; si el envío está activo, solo se guarda una copia anónima de respuestas para mejorar la herramienta.</p>
          </div>
        </div>
      </section>

      {/* ─── Tests ─── */}
      <div id="tests">
        <section className="home-section">
          <span className="home-section-label">Cuestionarios</span>
          <h2 className="home-section-title">Preguntas sobre tu experiencia</h2>
          <p className="home-section-desc">Responde según lo que vives cotidianamente. No hay respuestas correctas o incorrectas.</p>
          <div className="tests-grid">
            {likertTests.map((t) => <TestCard key={t.id} test={t} navigate={navigate} />)}
          </div>
        </section>

        <section className="home-section">
          <span className="home-section-label">Tareas interactivas</span>
          <h2 className="home-section-title">Ejercicios que miden tu rendimiento</h2>
          <p className="home-section-desc">Tareas breves que evalúan tu atención, memoria, velocidad de procesamiento y más. Algunas requieren teclado.</p>
          <div className="tests-grid">
            {taskTests.map((t) => <TestCard key={t.id} test={t} navigate={navigate} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
