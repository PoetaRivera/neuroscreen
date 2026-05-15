import { useNavigate } from 'react-router-dom';
import './RecursosPage.css';

function RecursosPage() {
  const navigate = useNavigate();

  return (
    <div className="recursos-page">
      <h2>Recursos y orientación profesional</h2>
      <p>
        Si alguno de tus resultados sugiere rasgos significativos, el siguiente paso es buscar una
        evaluación con un profesional de la salud mental. EvaluMind no diagnostica: solo te ayuda a
        identificar patrones que merecen exploración.
      </p>

      <section className="recursos-section">
        <h3>Profesionales que pueden ayudarte</h3>
        <ul>
          <li><strong>Psicólogo/a clínico:</strong> evaluación psicológica, terapia cognitivo-conductual, DBT, ACT.</li>
          <li><strong>Psiquiatra:</strong> evaluación médica y tratamiento farmacológico si corresponde.</li>
          <li><strong>Neuropsicólogo/a:</strong> evaluación neuropsicológica detallada de funciones cognitivas.</li>
          <li><strong>Terapeuta ocupacional:</strong> estrategias de integración sensorial y adaptación del entorno.</li>
        </ul>
      </section>

      <section className="recursos-section">
        <h3>Qué decir en tu consulta</h3>
        <p>
          Puedes comentar: "Hice unos screenings orientativos sobre [TDAH / TEA / alta sensibilidad / RSD]
          y me gustaría una evaluación profesional para entender mejor estos patrones en mi caso."
        </p>
      </section>

      <section className="recursos-section">
        <h3>Recursos por condición</h3>
        <ul>
          <li><strong>TDAH:</strong> <a href="https://chadd.org" target="_blank" rel="noopener noreferrer">CHADD</a> · <a href="https://www.tdah.org.es" target="_blank" rel="noopener noreferrer">Fundación TDAH</a></li>
          <li><strong>TEA:</strong> <a href="https://autism.org" target="_blank" rel="noopener noreferrer">Autism Society</a> · <a href="https://www.autismo.org.es" target="_blank" rel="noopener noreferrer">Confederación Autismo España</a></li>
          <li><strong>Alta Sensibilidad:</strong> <a href="https://hsperson.com" target="_blank" rel="noopener noreferrer">HSPerson (Dra. Elaine Aron)</a></li>
          <li><strong>Alexitimia:</strong> <a href="https://www.alexithymia.org" target="_blank" rel="noopener noreferrer">Alexithymia.org</a></li>
          <li><strong>RSD / Rechazo:</strong> busca terapeutas especializados en DBT o ACT</li>
          <li><strong>Burnout / Masking:</strong> busca profesionales con enfoque neuroafirmativo</li>
        </ul>
      </section>

      <section className="recursos-section">
        <h3>Enfoques terapéuticos que suelen ayudar</h3>
        <ul>
          <li><strong>DBT (Terapia Dialéctica Conductual):</strong> regulación emocional, tolerancia al malestar.</li>
          <li><strong>ACT (Terapia de Aceptación y Compromiso):</strong> flexibilidad psicológica, valores.</li>
          <li><strong>Terapia cognitivo-conductual:</strong> reestructuración de pensamientos, estrategias prácticas.</li>
          <li><strong>Coaching neurodivergente:</strong> estrategias de funcionamiento ejecutivo personalizadas.</li>
        </ul>
      </section>

      <button
        className="btn btn-secondary"
        onClick={() => navigate('/')}
        aria-label="Volver al inicio"
        style={{ marginTop: '16px' }}
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default RecursosPage;
