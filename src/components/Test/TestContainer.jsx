import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTest } from '../../data';
import { useTestSubmission } from '../../hooks/useTestSubmission';
import DisclaimerModal from '../Common/DisclaimerModal';
import InstructionsBanner from './InstructionsBanner';
import SectionHeader from './SectionHeader';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import ResultsView from './ResultsView';
import DatInput from './DatInput';
import FasTask from './FasTask';
import SocialScenariosTask from './SocialScenariosTask';
import SelfDiscrepancyTask from './SelfDiscrepancyTask';
import FERTask from './FERTask';
import SARTTask from './SARTTask';
import DigitSpanTask from './DigitSpanTask';
import FlankerTask from './FlankerTask';
import NavonTask from './NavonTask';
import RMETTask from './RMETTask';
import SwitchTask from './SwitchTask';
import SensoryThresholdTask from './SensoryThresholdTask';
import AuditoryDistractionTask from './AuditoryDistractionTask';
import { FAS_LETTERS } from '../../data/fasConfig';
import './TestContainer.css';

const TASK_TYPES = ['dat', 'fas', 'social-scenarios', 'self-discrepancy', 'fer', 'sart', 'flanker', 'digit-span', 'navon', 'rmet', 'switch-task', 'sensory-threshold', 'auditory-distraction'];

function randomFasLetter() {
  return FAS_LETTERS[Math.floor(Math.random() * FAS_LETTERS.length)];
}

function makeEmptyAnswers(count) {
  return new Array(count).fill(null);
}

function storageKey(testId) {
  return `evalumind_${testId}_state`;
}

function loadState(testId) {
  try {
    const raw = localStorage.getItem(storageKey(testId));
    if (raw) return JSON.parse(raw);
  } catch { /* corrupt data */ }
  return null;
}

function TestContainer() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const test = getTest(testId);

  const saved = loadState(testId);
  const questionCount = test?.questions?.length ?? 0;

  const [accepted, setAccepted] = useState(saved?.accepted ?? false);
  const [answers, setAnswers] = useState(saved?.answers ?? makeEmptyAnswers(questionCount));
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex ?? 0);
  const [finished, setFinished] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(!saved?.accepted);
  const [taskResult, setTaskResult] = useState(null);
  const [fasLetter, setFasLetter] = useState(() => randomFasLetter());

  const {
    loading,
    error,
    saved: submissionSaved,
    remoteSaved,
    saveResponse,
  } = useTestSubmission();

  const persist = useCallback(
    (overrides) => {
      try {
        const state = { accepted, answers, currentIndex, ...overrides };
        localStorage.setItem(storageKey(testId), JSON.stringify(state));
      } catch { /* storage full or private */ }
    },
    [accepted, answers, currentIndex, testId],
  );

  useEffect(() => {
    if (finished || submissionSaved) {
      localStorage.removeItem(storageKey(testId));
    }
  }, [finished, submissionSaved, testId]);

  useEffect(() => {
    const existing = loadState(testId);
    if (!existing) {
      setAccepted(false);
      setAnswers(makeEmptyAnswers(questionCount));
      setCurrentIndex(0);
      setFinished(false);
      setShowDisclaimer(true);
      setTaskResult(null);
    }
  }, [testId, questionCount]);

  const handleAccept = () => {
    setAccepted(true);
    setShowDisclaimer(false);
    persist({ accepted: true });
  };

  const handleSelect = (index, value) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    persist({ answers: next });
  };

  const handleNext = () => { const next = currentIndex + 1; setCurrentIndex(next); persist({ currentIndex: next }); };
  const handlePrev = () => { const prev = currentIndex - 1; setCurrentIndex(prev); persist({ currentIndex: prev }); };

  const handleFinish = () => {
    const result = test.scoringFn(answers);
    setFinished(true);
    saveResponse(test.testId, answers, result);
  };

  // Generic task complete handler
  const handleTaskComplete = useCallback((result) => {
    setTaskResult(result);
    setAnswers(result.words || []);
    setFinished(true);
    saveResponse(test.testId, result.words || [], result);
  }, [test, saveResponse]);

  // DAT handler (needs to pass words to scoringFn)
  const handleDatComplete = (words) => {
    const result = test.scoringFn(words);
    setTaskResult(result);
    setAnswers(words);
    setFinished(true);
    saveResponse(test.testId, words, result);
  };

  if (!test) {
    return (
      <div className="test-container">
        <div className="question-card" data-testid="test-not-found">
          <h2>Test no encontrado</h2>
          <p>El test solicitado no está disponible.</p>
        </div>
      </div>
    );
  }

  const isTask = TASK_TYPES.includes(test.type);

  if (showDisclaimer) {
    return <DisclaimerModal onAccept={handleAccept} disclaimerText={test.disclaimerText} />;
  }

  if (finished) {
    const result = isTask ? taskResult : test.scoringFn(answers);
    return (
      <ResultsView
        result={result}
        testId={test.testId}
        loading={loading}
        error={error}
        saved={submissionSaved}
        remoteSaved={remoteSaved}
        onRestart={() => {
          setTaskResult(null);
          setAnswers([]);
          setCurrentIndex(0);
          setFinished(false);
          setShowDisclaimer(true);
          setAccepted(false);
          setFasLetter(randomFasLetter());
          localStorage.removeItem(storageKey(testId));
        }}
      />
    );
  }

  // ─── Task routing ───────────────────────────────
  const taskProps = { onComplete: handleTaskComplete };

  switch (test.type) {
    case 'dat':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <DatInput onComplete={handleDatComplete} />
        </div>
      );
    case 'fas':
      return (
          <div className="test-container">
            <InstructionsBanner instructions={test.instructions} />
          <FasTask letter={fasLetter} onComplete={handleTaskComplete} />
          </div>
      );
    case 'social-scenarios':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <SocialScenariosTask {...taskProps} />
        </div>
      );
    case 'self-discrepancy':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <SelfDiscrepancyTask {...taskProps} />
        </div>
      );
    case 'fer':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <FERTask {...taskProps} />
        </div>
      );
    case 'sart':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <SARTTask {...taskProps} />
        </div>
      );
    case 'flanker':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <FlankerTask {...taskProps} />
        </div>
      );
    case 'digit-span':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <DigitSpanTask {...taskProps} />
        </div>
      );
    case 'navon':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <NavonTask {...taskProps} />
        </div>
      );
    case 'rmet':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <RMETTask {...taskProps} />
        </div>
      );
    case 'switch-task':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <SwitchTask {...taskProps} />
        </div>
      );
    case 'sensory-threshold':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <SensoryThresholdTask {...taskProps} />
        </div>
      );
    case 'auditory-distraction':
      return (
        <div className="test-container">
          <InstructionsBanner instructions={test.instructions} />
          <AuditoryDistractionTask {...taskProps} />
        </div>
      );
    default:
      break;
  }

  // ─── Likert flow ─────────────────────────────────
  const allAnswered = answers.every((a) => a !== null);
  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === questionCount - 1;
  const question = test.questions[currentIndex];

  const currentSection = test.sections.find(
    (s) => currentIndex >= s.range[0] && currentIndex <= s.range[1],
  );
  const isFirstInSection = currentSection && currentIndex === currentSection.range[0];

  const prevQuestion = currentIndex > 0 ? test.questions[currentIndex - 1] : null;
  const sectionChanged = prevQuestion && prevQuestion.section !== question.section;

  return (
    <div className="test-container">
      <InstructionsBanner instructions={test.instructions} />
      <ProgressBar current={currentIndex + 1} total={questionCount} />
      {(sectionChanged || (!prevQuestion && currentSection)) && (
        <SectionHeader sectionId={question.section} title={question.sectionTitle} />
      )}
      <QuestionCard
        question={question}
        selectedValue={currentAnswer}
        onSelect={handleSelect}
        currentIndex={currentIndex}
        totalQuestions={questionCount}
        isFirstInSection={isFirstInSection}
      />
      <div style={{ textAlign: 'right', marginBottom: '4px' }}>
        <button className="btn btn-ghost" data-testid="test-exit" onClick={() => { if (window.confirm('¿Salir del test? Perderás el progreso actual.')) navigate('/'); }} style={{ fontSize: '0.8125rem', padding: '4px 8px' }}>
          Salir
        </button>
      </div>

      <div className="test-nav">
        <button className="btn btn-secondary" data-testid="test-prev" onClick={handlePrev} disabled={currentIndex === 0} aria-label="Pregunta anterior">
          Anterior
        </button>
        <span className="test-nav-hint">
          {currentAnswer === null && 'Selecciona una opción para continuar'}
        </span>
        {isLast ? (
          <button className="btn btn-primary" data-testid="test-finish" onClick={handleFinish} disabled={!allAnswered} aria-label="Finalizar test y ver resultados">
            Finalizar y ver resultados
          </button>
        ) : (
          <button className="btn btn-primary" data-testid="test-next" onClick={handleNext} disabled={currentAnswer === null} aria-label="Siguiente pregunta">
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export default TestContainer;
