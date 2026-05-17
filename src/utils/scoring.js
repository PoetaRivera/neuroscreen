// ═══════════════════════════════════════════════════
// Factory para tests Likert
// ═══════════════════════════════════════════════════

function createLikertScorer({ maxScores, thresholds, dimensionConfig, profileMap, categoryRules, childhoodNote }) {
  return (answers) => {
    const dimensions = dimensionConfig.map((dim) => {
      const slice = answers.slice(dim.start, dim.start + dim.count);
      const score = slice.reduce((a, b) => a + b, 0);
      return { key: dim.key, label: dim.label, score, max: maxScores[dim.key] };
    });

    const total = dimensions.reduce((sum, d) => sum + d.score, 0);

    const profiles = [];
    for (const d of dimensions) {
      if (d.score >= thresholds[d.key]) {
        profiles.push({
          id: profileMap[d.key],
          label: d.label,
          dimension: d.key,
        });
      }
    }

    let category = categoryRules.default || '';
    let description = '';
    const profileLabels = profiles.map((p) => p.label.toLowerCase());

    for (const rule of categoryRules.rules) {
      if (total <= rule.max) {
        category = rule.category;
        description = rule.description(profiles, profileLabels);
        break;
      }
    }

    return {
      total,
      dimensions,
      maxScores,
      profiles,
      category,
      description,
      childhoodNote,
    };
  };
}

// ═══════════════════════════════════════════════════
// TDAH ADULTO
// ═══════════════════════════════════════════════════

const TDAH_MAX = {
  inattention: 32,
  hyperactivityPhysical: 12,
  impulsivityVerbal: 20,
  total: 64,
};

const TDAH_THRESHOLDS = {
  inattention: 16,
  hyperactivityPhysical: 6,
  impulsivityVerbal: 10,
};

export const calculateTdahScore = createLikertScorer({
  maxScores: TDAH_MAX,
  thresholds: TDAH_THRESHOLDS,
  profileMap: {
    inattention: 'inatencion-marcada',
    hyperactivityPhysical: 'hiperactividad-marcada',
    impulsivityVerbal: 'impulsividad-marcada',
  },
  dimensionConfig: [
    { key: 'inattention', label: 'Inatención', start: 0, count: 8 },
    { key: 'hyperactivityPhysical', label: 'Hiperactividad física', start: 8, count: 3 },
    { key: 'impulsivityVerbal', label: 'Impulsividad verbal', start: 11, count: 5 },
  ],
  categoryRules: {
    default: 'baja-probabilidad',
    rules: [
      {
        max: 22,
        category: 'baja-probabilidad',
        description: () =>
          'Tus respuestas no sugieren de forma destacada un patrón consistente con TDAH. ' +
          'Algunos síntomas aislados pueden deberse a estrés, ansiedad, agotamiento (burnout) o ' +
          'alteraciones del estado de ánimo. Si estos síntomas aparecieron recientemente, ' +
          'considera también estas posibilidades.',
      },
      {
        max: 36,
        category: 'moderada-probabilidad',
        description: (_p, labels) =>
          `Presentas un patrón ${labels.length > 0 ? labels.join(' y ') : 'moderado'} ` +
          'que merece exploración profesional. Te recomendamos consultar con un psicólogo o psiquiatra ' +
          'para una evaluación diferencial, especialmente si estos síntomas han estado presentes desde la infancia.',
      },
      {
        max: 64,
        category: 'alta-probabilidad',
        description: (_p, labels) =>
          `Tus respuestas indican un patrón significativo ${labels.length > 0 ? 'de ' + labels.join(' y ') : 'de rasgos de TDAH'} ` +
          '. Es altamente recomendable que busques evaluación profesional para descartar o confirmar TDAH ' +
          'y descartar otras condiciones (ansiedad, TEA, trastorno del estado de ánimo). ' +
          'Recuerda que el TDAH requiere que estos síntomas estén presentes desde la infancia.',
      },
    ],
  },
  childhoodNote:
    'El TDAH requiere que los síntomas estén presentes desde la infancia (antes de los 12 años). Si estos patrones aparecieron solo en los últimos meses, el agotamiento (burnout), la ansiedad o la depresión pueden causar síntomas similares.',
});

// ═══════════════════════════════════════════════════
// TEA ADULTO
// ═══════════════════════════════════════════════════

const TEA_MAX = {
  socialCommunication: 16,
  relationships: 16,
  routinesFlexibility: 16,
  sensoryInterests: 16,
  total: 64,
};

const TEA_THRESHOLDS = {
  socialCommunication: 8,
  relationships: 9,
  routinesFlexibility: 9,
  sensoryInterests: 9,
};

export const calculateTeaScore = createLikertScorer({
  maxScores: TEA_MAX,
  thresholds: TEA_THRESHOLDS,
  profileMap: {
    socialCommunication: 'comunicacion-social',
    relationships: 'relaciones-interpersonales',
    routinesFlexibility: 'rutinas-flexibilidad',
    sensoryInterests: 'intereses-sensorialidad',
  },
  dimensionConfig: [
    { key: 'socialCommunication', label: 'Comunicación social', start: 0, count: 4 },
    { key: 'relationships', label: 'Relaciones interpersonales', start: 4, count: 4 },
    { key: 'routinesFlexibility', label: 'Rutinas y flexibilidad', start: 8, count: 4 },
    { key: 'sensoryInterests', label: 'Intereses y sensorialidad', start: 12, count: 4 },
  ],
  categoryRules: {
    default: 'baja-probabilidad',
    rules: [
      {
        max: 24,
        category: 'baja-probabilidad',
        description: () =>
          'Tus respuestas no sugieren un patrón consistente con rasgos del espectro autista. ' +
          'Algunas dificultades puntuales pueden deberse a timidez, ansiedad social o agotamiento.',
      },
      {
        max: 40,
        category: 'moderada-probabilidad',
        description: (_p, labels) =>
          `Presentas un patrón ${labels.length > 0 ? 'destacado en ' + labels.join(' y ') : 'moderado'} ` +
          'que merece exploración profesional. Te recomendamos consultar con un psicólogo o neurólogo ' +
          'especializado en diagnóstico de adultos.',
      },
      {
        max: 64,
        category: 'alta-probabilidad',
        description: (_p, labels) =>
          `Tus respuestas indican un patrón significativo ${labels.length > 0 ? 'en ' + labels.join(', ') : 'de rasgos del espectro autista'} ` +
          '. Es altamente recomendable que busques evaluación profesional especializada en TEA en adultos, ' +
          'preferiblemente con experiencia en mujeres y personas con masking si aplica a tu caso.',
      },
    ],
  },
  childhoodNote:
    'El TEA es una condición del neurodesarrollo presente desde la infancia. Si estos patrones aparecieron solo en la adultez, la ansiedad social, el agotamiento (burnout) o la depresión pueden causar síntomas similares. Un profesional especializado en TEA en adultos puede ayudarte a diferenciarlos, incluso si has aprendido a camuflar estos rasgos.',
});

// ═══════════════════════════════════════════════════
// ALTA SENSIBILIDAD (HSP)
// ═══════════════════════════════════════════════════

const HSP_MAX = {
  deepProcessing: 16,
  overStimulation: 16,
  emotionalIntensity: 16,
  sensorySensitivity: 16,
  total: 64,
};

const HSP_THRESHOLDS = {
  deepProcessing: 9,
  overStimulation: 9,
  emotionalIntensity: 9,
  sensorySensitivity: 9,
};

export const calculateHspScore = createLikertScorer({
  maxScores: HSP_MAX,
  thresholds: HSP_THRESHOLDS,
  profileMap: {
    deepProcessing: 'procesamiento-profundo',
    overStimulation: 'sobrestimulacion',
    emotionalIntensity: 'intensidad-emocional',
    sensorySensitivity: 'sensibilidad-sensorial',
  },
  dimensionConfig: [
    { key: 'deepProcessing', label: 'Procesamiento profundo', start: 0, count: 4 },
    { key: 'overStimulation', label: 'Sobrestimulación', start: 4, count: 4 },
    { key: 'emotionalIntensity', label: 'Intensidad emocional', start: 8, count: 4 },
    { key: 'sensorySensitivity', label: 'Sensibilidad sensorial', start: 12, count: 4 },
  ],
  categoryRules: {
    default: 'sensibilidad-promedio',
    rules: [
      {
        max: 28,
        category: 'sensibilidad-promedio',
        description: () =>
          'Tu perfil sugiere un procesamiento de información de intensidad media. Probablemente toleras bien la sobrecarga sensorial ' +
          'y social, y recuperas energía rápidamente de los estímulos. La alta sensibilidad no parece ser un rasgo dominante en tu temperamento.',
      },
      {
        max: 44,
        category: 'alta-sensibilidad-moderada',
        description: (_p, labels) =>
          `Presentas un perfil de alta sensibilidad ${labels.length > 0 ? 'con énfasis en ' + labels.join(' y ') : 'moderado'}. ` +
          'Esto explica por qué ciertos entornos te agotan más que a otros, y por qué necesitas tiempo de procesamiento. ' +
          'La alta sensibilidad es un temperamento presente en ~20-30 % de la población, no una debilidad ni un trastorno.',
      },
      {
        max: 64,
        category: 'alta-sensibilidad-marcada',
        description: (_p, labels) =>
          `Tu perfil indica una alta sensibilidad muy pronunciada ${labels.length > 0 ? 'en ' + labels.join(', ') : ''}. ` +
          'Es fundamental que aprendas a gestionar tu entorno, tus límites y tus ritmos de descanso. ' +
          'Considera leer sobre el rasgo HSP (Highly Sensitive Person) o consultar con un terapeuta familiarizado con este temperamento. ' +
          'Recuerda: no es un trastorno, es una forma de procesar el mundo más profundamente.',
      },
    ],
  },
  childhoodNote:
    'La alta sensibilidad es un temperamento presente desde la infancia. Si estos patrones solo aparecen en contextos de estrés reciente, pueden deberse a agotamiento o ansiedad. La alta sensibilidad no es un trastorno: es una característica de temperamento que afecta aproximadamente al 20-30 % de la población y tiene ventajas adaptativas junto con sus desafíos.',
});

// ═══════════════════════════════════════════════════
// ALEXITIMIA
// ═══════════════════════════════════════════════════

const ALEXITHYMIA_MAX = {
  identifyingFeelings: 16,
  describingFeelings: 16,
  externallyOriented: 16,
  somaticConfusion: 16,
  total: 64,
};

const ALEXITHYMIA_THRESHOLDS = {
  identifyingFeelings: 9,
  describingFeelings: 9,
  externallyOriented: 9,
  somaticConfusion: 9,
};

export const calculateAlexithymiaScore = createLikertScorer({
  maxScores: ALEXITHYMIA_MAX,
  thresholds: ALEXITHYMIA_THRESHOLDS,
  profileMap: {
    identifyingFeelings: 'identificacion-emocional',
    describingFeelings: 'descripcion-emocional',
    externallyOriented: 'pensamiento-externo',
    somaticConfusion: 'confusion-somatica',
  },
  dimensionConfig: [
    { key: 'identifyingFeelings', label: 'Identificación emocional', start: 0, count: 4 },
    { key: 'describingFeelings', label: 'Descripción emocional', start: 4, count: 4 },
    { key: 'externallyOriented', label: 'Pensamiento externo', start: 8, count: 4 },
    { key: 'somaticConfusion', label: 'Confusión somática', start: 12, count: 4 },
  ],
  categoryRules: {
    default: 'alexitimia-baja',
    rules: [
      {
        max: 24,
        category: 'alexitimia-baja',
        description: () =>
          'Tienes un acceso fluido a tus emociones, las identificas con relativa claridad y puedes describirlas. ' +
          'Esto no significa que no tengas dificultades emocionales, pero la alexitimia no parece ser tu patrón predominante.',
      },
      {
        max: 40,
        category: 'alexitimia-moderada',
        description: (_p, labels) =>
          `Presentas un perfil de alexitimia ${labels.length > 0 ? 'con énfasis en ' + labels.join(' y ') : 'moderado'}. ` +
          'Esto puede dificultar la comunicación emocional en relaciones o la regulación del estrés. ' +
          'La terapia focalizada en conciencia emocional y corporal puede ser útil.',
      },
      {
        max: 64,
        category: 'alexitimia-marcada',
        description: (_p, labels) =>
          `Tu perfil sugiere una alexitimia significativa ${labels.length > 0 ? 'en ' + labels.join(', ') : ''}. ` +
          'Esto puede estar asociado a TEA, TDAH, trauma o ser un estilo de procesamiento propio. ' +
          'Te recomendamos evaluación con un terapeuta especializado en regulación emocional o psicosomática. ' +
          'No es una enfermedad, pero sí un patrón que puede mejorarse con intervención.',
      },
    ],
  },
  childhoodNote:
    'La alexitimia puede tener raíces en la infancia: entornos familiares donde no se hablaba de emociones, trauma temprano, o características del neurodesarrollo como el TEA. No es un trastorno: es un estilo de procesamiento emocional que puede modificarse con intervención terapéutica.',
});

// ═══════════════════════════════════════════════════
// RSD
// ═══════════════════════════════════════════════════

const RSD_MAX = {
  rejectionPerception: 16,
  emotionalIntensity: 16,
  anticipatoryAvoidance: 16,
  rumination: 16,
  total: 64,
};

const RSD_THRESHOLDS = {
  rejectionPerception: 9,
  emotionalIntensity: 9,
  anticipatoryAvoidance: 9,
  rumination: 9,
};

export const calculateRsdScore = createLikertScorer({
  maxScores: RSD_MAX,
  thresholds: RSD_THRESHOLDS,
  profileMap: {
    rejectionPerception: 'hipersensibilidad-percibida',
    emotionalIntensity: 'intensidad-emocional-rsd',
    anticipatoryAvoidance: 'evitacion-anticipatoria',
    rumination: 'rumia-autocritica',
  },
  dimensionConfig: [
    { key: 'rejectionPerception', label: 'Hipersensibilidad al rechazo', start: 0, count: 4 },
    { key: 'emotionalIntensity', label: 'Intensidad emocional', start: 4, count: 4 },
    { key: 'anticipatoryAvoidance', label: 'Evitación anticipatoria', start: 8, count: 4 },
    { key: 'rumination', label: 'Rumia y autocrítica', start: 12, count: 4 },
  ],
  categoryRules: {
    default: 'baja-probabilidad',
    rules: [
      {
        max: 24,
        category: 'baja-probabilidad',
        description: () =>
          'Tus respuestas no sugieren un patrón destacado de Rejection Sensitive Dysphoria. ' +
          'Experimentas el rechazo de forma similar a la mayoría de las personas: dolorosa pero manejable.',
      },
      {
        max: 40,
        category: 'rsd-moderada',
        description: (_p, labels) =>
          `Presentas un patrón significativo de RSD ${labels.length > 0 ? 'con énfasis en ' + labels.join(' y ') : ''}. ` +
          'Esto puede estar drenando tu energía emocional y dificultando tus relaciones o tu desarrollo profesional. ' +
          'Te recomendamos explorar esta dinámica con un terapeuta, especialmente si ya tienes un diagnóstico de TDAH o TEA.',
      },
      {
        max: 64,
        category: 'rsd-marcada',
        description: (_p, labels) =>
          `Tu perfil indica una RSD muy pronunciada ${labels.length > 0 ? 'en ' + labels.join(', ') : ''}. ` +
          'Es probable que esta dinámica esté impactando seriamente tu bienestar, tus relaciones y tu funcionamiento diario. ' +
          'Buscar apoyo terapéutico especializado (DBT, ACT o terapia enfocada en trauma complejo) puede ser transformador.',
      },
    ],
  },
  childhoodNote:
    'La RSD no es un trastorno separado en el DSM-5, sino un fenómeno emocional que frecuentemente coexiste con el TDAH y el TEA. Muchas personas adultas no se identifican con la "hiperactividad física" del TDAH infantil, pero sí con esta tormenta emocional ante el rechazo. Si también obtuviste puntuación alta en TDAH, estos fenómenos probablemente están conectados.',
});

// ═══════════════════════════════════════════════════
// BURNOUT POR MASKING
// ═══════════════════════════════════════════════════

const MASKING_MAX = {
  physicalExhaustion: 16,
  identityLoss: 12,
  emotionalDisconnect: 8,
  collapseRecovery: 16,
  total: 52,
};

const MASKING_THRESHOLDS = {
  physicalExhaustion: 9,
  identityLoss: 7,
  emotionalDisconnect: 5,
  collapseRecovery: 9,
};

export const calculateMaskingBurnoutScore = createLikertScorer({
  maxScores: MASKING_MAX,
  thresholds: MASKING_THRESHOLDS,
  profileMap: {
    physicalExhaustion: 'agotamiento-postsocial',
    identityLoss: 'perdida-identidad',
    emotionalDisconnect: 'desconexion-emocional',
    collapseRecovery: 'colapso-recuperacion',
  },
  dimensionConfig: [
    { key: 'physicalExhaustion', label: 'Agotamiento físico', start: 0, count: 4 },
    { key: 'identityLoss', label: 'Pérdida de identidad', start: 4, count: 3 },
    { key: 'emotionalDisconnect', label: 'Desconexión emocional', start: 7, count: 2 },
    { key: 'collapseRecovery', label: 'Colapso y recuperación', start: 9, count: 4 },
  ],
  categoryRules: {
    default: 'bajo-burnout-masking',
    rules: [
      {
        max: 18,
        category: 'bajo-burnout-masking',
        description: () =>
          'Tu nivel de agotamiento por camuflaje parece manejable. Es posible que tu entorno sea relativamente compatible ' +
          'o que no dependas tanto del masking para funcionar en tu día a día.',
      },
      {
        max: 35,
        category: 'burnout-masking-moderado',
        description: (_p, labels) =>
          `Presentas un agotamiento significativo por enmascaramiento ${labels.length > 0 ? 'con énfasis en ' + labels.join(' y ') : ''}. ` +
          'Es urgente que busques espacios donde puedas ser tú mismo/a y evalúes si tu entorno actual es sostenible a largo plazo.',
      },
      {
        max: 52,
        category: 'burnout-masking-severo',
        description: (_p, labels) =>
          `Tu nivel de burnout por masking es muy alto ${labels.length > 0 ? 'en ' + labels.join(', ') : ''}. ` +
          'Esto no es sostenible. Considera buscar apoyo terapéutico, evaluar cambios de entorno y, si es posible, ' +
          'buscar espacios neuroafirmativos donde el camuflaje no sea necesario.',
      },
    ],
  },
  childhoodNote:
    'El burnout por masking no aparece de la noche a la mañana: es el resultado de años o décadas de ocultar quién eres para sobrevivir en entornos que no están diseñados para tu neurotipo. Si este patrón resuena contigo, no es que estés "roto/a": es que has estado corriendo una maratón con una máscara puesta.',
});

// ═══════════════════════════════════════════════════
// FUNCIONES EJECUTIVAS
// ═══════════════════════════════════════════════════

const EXECUTIVE_MAX = {
  inhibition: 16,
  workingMemory: 20,
  planning: 20,
  flexibility: 16,
  total: 72,
};

const EXECUTIVE_THRESHOLDS = {
  inhibition: 9,
  workingMemory: 11,
  planning: 11,
  flexibility: 9,
};

export const calculateExecutiveScore = createLikertScorer({
  maxScores: EXECUTIVE_MAX,
  thresholds: EXECUTIVE_THRESHOLDS,
  profileMap: {
    inhibition: 'inhibicion',
    workingMemory: 'memoria-trabajo',
    planning: 'planificacion',
    flexibility: 'flexibilidad',
  },
  dimensionConfig: [
    { key: 'inhibition', label: 'Inhibición', start: 0, count: 4 },
    { key: 'workingMemory', label: 'Memoria de trabajo', start: 4, count: 5 },
    { key: 'planning', label: 'Planificación', start: 9, count: 5 },
    { key: 'flexibility', label: 'Flexibilidad cognitiva', start: 14, count: 4 },
  ],
  categoryRules: {
    default: 'funciones-ejecutivas-preservadas',
    rules: [
      {
        max: 30,
        category: 'funciones-ejecutivas-preservadas',
        description: () =>
          'Percibes tu funcionamiento ejecutivo como relativamente sólido. Las dificultades puntuales ' +
          'pueden deberse a estrés, cansancio o contexto actual más que a un patrón estable.',
      },
      {
        max: 50,
        category: 'dificultades-ejecutivas-moderadas',
        description: (_p, labels) =>
          `Presentas dificultades ejecutivas ${labels.length > 0 ? 'en ' + labels.join(' y ') : 'en varias áreas'}. ` +
          'Esto es común en TDAH, TEA, ansiedad o agotamiento. Estrategias externas (agendas, recordatorios, rutinas) ' +
          'pueden compensar significativamente estas áreas.',
      },
      {
        max: 72,
        category: 'dificultades-ejecutivas-significativas',
        description: (_p, labels) =>
          `Tus respuestas sugieren dificultades ejecutivas importantes ${labels.length > 0 ? 'en ' + labels.join(', ') : ''}. ` +
          'Considera una evaluación neuropsicológica formal, especialmente si esto impacta tu trabajo, estudios o relaciones. ' +
          'Estas dificultades no reflejan tu inteligencia ni tu valor como persona.',
      },
    ],
  },
  childhoodNote:
    'Las funciones ejecutivas tienen una base neurológica y pueden verse afectadas por condiciones del neurodesarrollo como el TDAH o el TEA. No son una medida de inteligencia: muchas personas con dificultades ejecutivas desarrollan sistemas externos de compensación altamente efectivos. La evaluación neuropsicológica puede ayudarte a entender tu perfil específico.',
});

// ═══════════════════════════════════════════════════
// DAT
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// DAT — Divergent Association Task
// Algoritmo: Olson et al. (2021). PNAS, 118(25), e2022340118.
// DOI: 10.1073/pnas.2022340118
// Vectores: GloVe SBWC, CC-BY-4.0, Univ. de Chile
// ═══════════════════════════════════════════════════

import { cosineDistance, findVector } from './datEmbeddings';

export const calculateDatScore = (words, embeddings) => {
  const cleanWords = [...new Set(words.map((w) => w.toLowerCase().trim()))];

  if (cleanWords.length < 7) {
    return {
      total: 0,
      finalScore: 0,
      error: 'Se requieren al menos 7 palabras válidas',
      wordsUsed: cleanWords,
      unknownWords: [],
      distinctCategories: 0,
      pairCount: 0,
      pairwiseDistances: [],
      dimensions: [],
      maxScores: { total: 100 },
      profiles: [],
      category: 'convergente',
      description: '',
      childhoodNote: '',
    };
  }

  // Buscar vectores para cada palabra
  const wordVectors = [];
  const unknownWords = [];

  for (const word of cleanWords) {
    const vector = embeddings ? findVector(embeddings, word) : null;
    if (vector) {
      wordVectors.push({ word, vector });
    } else {
      unknownWords.push(word);
    }
  }

  const validWords = wordVectors.length;

  if (validWords < 4) {
    return {
      total: 0,
      finalScore: 0,
      error: `Solo ${validWords} palabra(s) reconocida(s). Se necesitan al menos 4 palabras con vectores disponibles.`,
      wordsUsed: cleanWords,
      unknownWords,
      distinctCategories: 0,
      pairCount: 0,
      pairwiseDistances: [],
      dimensions: [],
      maxScores: { total: 100 },
      profiles: [],
      category: 'convergente',
      description: '',
      childhoodNote: '',
    };
  }

  // Calcular distancias coseno entre todos los pares
  let totalDistance = 0;
  let pairs = 0;
  const pairwiseDistances = [];

  for (let i = 0; i < wordVectors.length; i++) {
    for (let j = i + 1; j < wordVectors.length; j++) {
      const dist = cosineDistance(wordVectors[i].vector, wordVectors[j].vector);
      totalDistance += dist;
      pairs++;
      pairwiseDistances.push({
        wordA: wordVectors[i].word,
        wordB: wordVectors[j].word,
        distance: parseFloat(dist.toFixed(4)),
      });
    }
  }

  const averageDistance = totalDistance / pairs;

  // Score DAT: distancia coseno promedio × 100
  // Rango teórico: 0-200. Rango práctico: 50-95 (Olson et al., 2021)
  const finalScore = Math.round(averageDistance * 100);

  let category;
  let description;

  if (finalScore < 50) {
    category = 'convergente';
    description =
      'Tus palabras tendieron a ser semánticamente cercanas. ' +
      'Esto sugiere un pensamiento asociativo dentro de dominios familiares.';
  } else if (finalScore < 75) {
    category = 'moderadamente-divergente';
    description =
      'Mostraste una buena capacidad para generar palabras de dominios semánticos distantes. ' +
      'Es un perfil balanceado entre coherencia y flexibilidad.';
  } else {
    category = 'altamente-divergente';
    description =
      'Tus palabras provinieron de dominios semánticos muy lejanos entre sí. ' +
      'Esto sugiere alta flexibilidad cognitiva y capacidad para conectar ideas remotas, un patrón asociado a la creatividad (Olson et al., 2021).';
  }

  return {
    total: finalScore,
    finalScore,
    averageDistance: parseFloat(averageDistance.toFixed(4)),
    wordsUsed: wordVectors.map((wv) => wv.word),
    unknownWords,
    distinctCategories: validWords,
    pairCount: pairs,
    pairwiseDistances: pairwiseDistances.sort((a, b) => a.distance - b.distance),
    dimensions: [],
    maxScores: { total: 100 },
    profiles: [],
    category,
    description,
    childhoodNote:
      'El pensamiento divergente es un estilo cognitivo, no una medida de inteligencia. ' +
      'Un resultado convergente no indica menor capacidad intelectual, sino un estilo de procesamiento más focalizado. ' +
      'Investigación de referencia: Olson, Nahas, Chmoulevitch, Cropper & Webb (2021). ' +
      'Naming unrelated words predicts creativity. PNAS, 118(25), e2022340118.',
  };
};
