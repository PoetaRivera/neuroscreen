const SESSION_KEY = 'evalumind_completed_tests';

function loadAll() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    /* storage lleno */
  }
}

export function saveCompletedTest(testId, result) {
  const all = loadAll();
  all[testId] = {
    testId,
    total: result.total,
    category: result.category,
    maxScores: result.maxScores || {},
    dimensions: (result.dimensions || []).map((d) => ({
      key: d.key,
      label: d.label,
      score: d.score,
      max: d.max,
    })),
    profiles: (result.profiles || []).map((p) => p.id),
    completedAt: Date.now(),
  };
  saveAll(all);
}

export function getCompletedTests() {
  return loadAll();
}

export function getCompletedTestIds() {
  return Object.keys(loadAll());
}

export function getCompletedTest(testId) {
  return loadAll()[testId] || null;
}

export function clearCompletedTests() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ═══════════════════════════════════════════════════
// Reglas de complementariedad
// ═══════════════════════════════════════════════════

const COMPLEMENTARITY_RULES = [
  {
    id: 'tdah-rsd',
    tests: ['tdah-adult-v2', 'rsd-adult-v1'],
    condition: (tdah, rsd) => {
      const tdahModerate = tdah.category === 'moderada-probabilidad' || tdah.category === 'alta-probabilidad';
      const rsdModerate = rsd.category === 'rsd-moderada' || rsd.category === 'rsd-marcada';
      return tdahModerate && rsdModerate;
    },
    note:
      'Tu puntuación alta en TDAH y RSD sugiere que estos fenómenos pueden estar conectados. ' +
      'La RSD frecuentemente coexiste con el TDAH y explica por qué algunas personas no se identifican ' +
      'con la hiperactividad física pero sí con tormentas emocionales ante el rechazo.',
  },
  {
    id: 'tea-alexitimia',
    tests: ['tea-adult-v1', 'alexitimia-adult-v1'],
    condition: (tea, alex) => {
      const teaModerate = tea.category === 'moderada-probabilidad' || tea.category === 'alta-probabilidad';
      const alexModerate = alex.category === 'alexitimia-moderada' || alex.category === 'alexitimia-marcada';
      return teaModerate && alexModerate;
    },
    note:
      'La combinación de rasgos autistas con alexitimia es común. No significa que no sientas, ' +
      'sino que tu procesamiento emocional puede ser más somático que verbal. Muchas personas con TEA ' +
      'experimentan las emociones primero en el cuerpo y luego les ponen nombre.',
  },
  {
    id: 'hsp-rsd',
    tests: ['hsp-adult-v1', 'rsd-adult-v1'],
    condition: (hsp, rsd) => {
      const hspModerate = hsp.category === 'alta-sensibilidad-moderada' || hsp.category === 'alta-sensibilidad-marcada';
      const rsdModerate = rsd.category === 'rsd-moderada' || rsd.category === 'rsd-marcada';
      return hspModerate && rsdModerate;
    },
    note:
      'La alta sensibilidad (HSP) combinada con RSD sugiere que tu sistema nervioso procesa profundamente ' +
      'tanto los estímulos sensoriales como los sociales. Las personas con este perfil suelen necesitar ' +
      'más tiempo de procesamiento después de interacciones sociales y ambientes estimulantes.',
  },
  {
    id: 'tdah-tea',
    tests: ['tdah-adult-v2', 'tea-adult-v1'],
    condition: (tdah, tea) => {
      const tdahModerate = tdah.category === 'moderada-probabilidad' || tdah.category === 'alta-probabilidad';
      const teaModerate = tea.category === 'moderada-probabilidad' || tea.category === 'alta-probabilidad';
      return tdahModerate && teaModerate;
    },
    note:
      'Tus resultados sugieren rasgos tanto de TDAH como de TEA. Esta co-ocurrencia es frecuente: ' +
      'muchas personas tienen ambos perfiles (a veces llamado AuDHD). Un profesional especializado ' +
      'puede ayudarte a entender cómo interactúan estas dos condiciones en tu caso particular.',
  },
  {
    id: 'tea-hsp',
    tests: ['tea-adult-v1', 'hsp-adult-v1'],
    condition: (tea, hsp) => {
      const teaModerate = tea.category === 'moderada-probabilidad' || tea.category === 'alta-probabilidad';
      const hspModerate = hsp.category === 'alta-sensibilidad-moderada' || hsp.category === 'alta-sensibilidad-marcada';
      return teaModerate && hspModerate;
    },
    note:
      'El TEA y la alta sensibilidad comparten la sensibilidad sensorial y la necesidad de procesamiento ' +
      'profundo. La diferencia clave es que el TEA incluye aspectos de comunicación social y rutinas ' +
      'que no forman parte del rasgo HSP. Un profesional puede ayudarte a distinguir si tienes uno, otro, o ambos.',
  },
  {
    id: 'rsd-burnout',
    tests: ['rsd-adult-v1', 'burnout-masking-v1'],
    condition: (rsd, burnout) => {
      const rsdModerate = rsd.category === 'rsd-moderada' || rsd.category === 'rsd-marcada';
      const burnoutModerate = burnout.category === 'burnout-masking-moderado' || burnout.category === 'burnout-masking-severo';
      return rsdModerate && burnoutModerate;
    },
    note:
      'La RSD y el burnout por masking suelen retroalimentarse: el miedo al rechazo alimenta el camuflaje, ' +
      'y el camuflaje constante genera agotamiento. Romper este ciclo requiere entornos donde puedas ' +
      'bajar la máscara sin miedo a las consecuencias sociales.',
  },
  {
    id: 'ejecutivas-tdah',
    tests: ['funciones-ejecutivas-v1', 'tdah-adult-v2'],
    condition: (ejecutivas, tdah) => {
      const ejModerate = ejecutivas.category === 'dificultades-ejecutivas-moderadas' || ejecutivas.category === 'dificultades-ejecutivas-significativas';
      const tdahModerate = tdah.category === 'moderada-probabilidad' || tdah.category === 'alta-probabilidad';
      return ejModerate && tdahModerate;
    },
    note:
      'Las dificultades ejecutivas y el TDAH están estrechamente vinculados. Las funciones ejecutivas ' +
      '(memoria de trabajo, inhibición, planificación) son precisamente las áreas más afectadas por el TDAH. ' +
      'Si ambos resultados son altos, una evaluación neuropsicológica puede ayudarte a mapear tus fortalezas y desafíos específicos.',
  },
  {
    id: 'ejecutivas-tea',
    tests: ['funciones-ejecutivas-v1', 'tea-adult-v1'],
    condition: (ejecutivas, tea) => {
      const ejModerate = ejecutivas.category === 'dificultades-ejecutivas-moderadas' || ejecutivas.category === 'dificultades-ejecutivas-significativas';
      const teaModerate = tea.category === 'moderada-probabilidad' || tea.category === 'alta-probabilidad';
      return ejModerate && teaModerate;
    },
    note:
      'Las personas con TEA frecuentemente experimentan desafíos ejecutivos, especialmente en flexibilidad ' +
      'cognitiva y planificación. Esto no es un déficit de inteligencia: es una forma diferente de procesar ' +
      'que puede beneficiarse de apoyos visuales, rutinas externas y estrategias de organización personalizadas.',
  },
  {
    id: 'alexitimia-burnout',
    tests: ['alexitimia-adult-v1', 'burnout-masking-v1'],
    condition: (alex, burnout) => {
      const alexModerate = alex.category === 'alexitimia-moderada' || alex.category === 'alexitimia-marcada';
      const burnoutModerate = burnout.category === 'burnout-masking-moderado' || burnout.category === 'burnout-masking-severo';
      return alexModerate && burnoutModerate;
    },
    note:
      'La alexitimia puede hacer que no detectes el agotamiento hasta que es severo, porque las señales ' +
      'de alarma del cuerpo (fatiga, tensión, malestar) no se traducen claramente en "necesito descansar". ' +
      'Aprender a leer las señales corporales como datos puede ayudarte a prevenir el burnout.',
  },
];

export function getComplementarityNotes(currentTestId) {
  const allTests = loadAll();
  const notes = [];

  for (const rule of COMPLEMENTARITY_RULES) {
    const involvesCurrent = rule.tests.includes(currentTestId);
    if (!involvesCurrent) continue;

    const testDatas = rule.tests.map((tid) => allTests[tid]).filter(Boolean);
    if (testDatas.length < rule.tests.length) continue;

    if (rule.condition(...testDatas)) {
      notes.push(rule);
    }
  }

  return notes;
}
