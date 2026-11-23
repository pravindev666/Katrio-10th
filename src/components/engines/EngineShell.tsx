import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import katex from 'katex';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Play,
  Sparkles,
} from 'lucide-react';
import type { EngineType, RepresentationStatus } from '../../types/curriculum';
import type { LessonContentPackage } from '../../types/lessonContent';
import { useProgress } from '../../features/local-progress/ProgressContext';
import { getSectionProgressStage } from '../../features/local-progress/progressStore';
import { HeartCirculationEngine } from './HeartCirculationEngine';
import { ReactionLabEngine } from './ReactionLabEngine';
import { TrigonometryClinometerEngine } from './TrigonometryClinometerEngine';
import { StoryStageEngine } from './StoryStageEngine';
import { TamilLanguageStudioEngine } from './TamilLanguageStudioEngine';
import { HistoryTimeMapEngine } from './HistoryTimeMapEngine';
import { Mensuration3DEngine } from './Mensuration3DEngine';
import { MoleculeBuilder3DEngine } from './MoleculeBuilder3DEngine';
import { PlantAnatomy3DEngine } from './PlantAnatomy3DEngine';
import { IndiaRelief3DEngine } from './IndiaRelief3DEngine';
import { TrigIdentitiesEngine } from './TrigIdentitiesEngine';
import { Unit14BiologyEngine } from './Unit14BiologyEngine';
import { VisualFlashcardDeck } from './VisualFlashcardDeck';
import {
  AcousticsEchoLab,
  getTopicAwareLabLabel,
  renderTopicAwareInteractiveLab,
} from './TopicInteractiveLabs';
import { DOUBLE_CIRCULATION_PATHWAY } from '../../utils/heartCirculation';
import { ALL_PILOT_LESSONS } from '../../data/lesson_content';

export interface EngineShellProps {
  engine: EngineType;
  sectionId: string;
  sectionTitle: string;
  unitTitle: string;
  unitRoute?: string;
  printedPage: number;
  representationStatus: RepresentationStatus;
  accessibilityFallbackText: string;
  lesson?: LessonContentPackage;
  defaultMode?: 'scaffold' | 'demo' | '2d_text';
  hasPilotDemo?: boolean;
  isUnderReview?: boolean;
}

const ENGINE_LABELS: Record<EngineType, { name: string; summary: string; hint: string }> = {
  ModelExplorer3D: {
    name: '3D / 2D Anatomical Cutaway Explorer',
    summary:
      'Explore the four heart chambers, septum, major vessels, and one-way valves in 3D or an equivalent interactive 2D SVG cutaway.',
    hint: 'Slide the Anterior Cutaway control past 50% or switch to the 2D SVG view to inspect every valve.',
  },
  JourneyThrough: {
    name: 'Step-by-Step Circulation Journey',
    summary:
      'Trace deoxygenated and oxygenated blood through all 6 physiological stations of human double circulation.',
    hint: 'Step through all 6 stations in order from Vena Cava through Lungs to the Aorta.',
  },
  SafeVirtualLab: {
    name: 'Safe Virtual Chemistry Reaction Lab',
    summary:
      'Predict reaction classes, run safe conceptual reactions, test activity-series limits, and balance coefficients to verify atom conservation.',
    hint: 'Choose a reaction, predict its type, run the virtual bench, and balance every element bar to green.',
  },
  PhysicsWorkbench: {
    name: 'Force, Mass & Acceleration Workbench',
    summary:
      'By Newton’s Second Law (a = F / m), increasing net force increases acceleration proportionally while larger mass reduces acceleration.',
    hint: 'Double cart mass while holding force constant to observe acceleration halve.',
  },
  GraphSandbox: {
    name: 'Quadratic & Function Graph Explorer',
    summary:
      'Inspect how coefficients a, b, and c transform y = ax² + bx + c and how discriminant Δ = b² − 4ac predicts real roots.',
    hint: 'Set a = 1, b = -2, c = -3 to see two distinct x-intercepts where y = 0.',
  },
  GeometryWorkbench: {
    name: 'Heights & Distances Clinometer Workbench',
    summary:
      'Measure heights and distances using Angle of Elevation and Angle of Depression with exact surd ratios (30°, 45°, 60°) and boundary diagnostics.',
    hint: 'Compare 30°, 45°, and 60° presets, then test the invalid 0° and 90° boundary buttons.',
  },
  TimelineMap: {
    name: 'Evidence-Led Historical TimeMap',
    summary:
      'Connect dated turning points (1882–1919), schematic alliance theatres, and documented cause-and-consequence chains.',
    hint: 'Step through each period from 1882 to 1919 and complete the cause-consequence matcher below.',
  },
  GeoMap: {
    name: 'India Physiographic & River Basin Atlas',
    summary:
      'Toggle relief divisions, major river basins, and monsoon wind layers on a schematic regional diagram.',
    hint: 'Enable both Relief Divisions and Major River Basins to see where perennial rivers originate.',
  },
  StoryStage: {
    name: 'Interactive Narrative & Perspective Stage',
    summary:
      'Compare character perspectives, reconstruct the 5-stage causal sequence, and practice contextual glossary terms.',
    hint: 'Switch between Young Seagull and Mother/Family viewpoints, then complete the sequence puzzle.',
  },
  TamilLanguageStudio: {
    name: 'தமிழ் மொழிபெயர்ப்பு & இலக்கண ஆராய்வகம்',
    summary:
      'தெளிவான தமிழ் எழுத்துருவில் மொழிபெயர்ப்புச் செம்மை, ஐம்பால், வழு–வழாநிலை மற்றும் ஐந்து வகை வழுவமைதிப் பயிற்சிகள்.',
    hint: 'நான்கு பயிற்சித் தாவல்களையும் பயன்படுத்தி எடுத்துக்காட்டுகளைப் பயிற்சி செய்க.',
  },
  Flashcards: {
    name: 'Self-Rated Concept Flashcards',
    summary:
      'Active recall strengthens durable understanding. Think of the answer first, flip to check, and rate Know or Review Again locally.',
    hint: 'Click Reveal Explanation before rating each card.',
  },
  QuizEngine: {
    name: 'Untimed Concept Check',
    summary:
      'Low-pressure conceptual questions with optional hints and immediate explanations of why each option works.',
    hint: 'Read the optional hint whenever you are unsure — there is no timer or penalty.',
  },
  ConceptGame: {
    name: 'Concept Sorting Challenge',
    summary:
      'Classify fundamental physics quantities as Scalar (magnitude only) or Vector (magnitude and direction) with keyboard parity.',
    hint: 'Ask whether direction in space matters for each quantity.',
  },
};

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

export function EngineShell({
  engine,
  sectionId,
  sectionTitle,
  unitTitle,
  unitRoute,
  printedPage,
  accessibilityFallbackText,
  lesson,
  defaultMode = 'scaffold',
  hasPilotDemo = false,
  isUnderReview = false,
}: EngineShellProps) {
  const {
    preferences,
    updatePreferences,
    markSectionExplored,
    markSectionPractised,
    recordQuizCheckpoint,
    record,
  } = useProgress();

  const isRealPilot = Boolean(lesson) || hasPilotDemo;
  const topicAwareLabName = getTopicAwareLabLabel(sectionId);
  const hasInteractiveLab =
    isRealPilot ||
    Boolean(topicAwareLabName) ||
    sectionId.startsWith('science-07') ||
    sectionId.startsWith('science-10') ||
    sectionId.startsWith('science-11') ||
    sectionId.startsWith('science-12') ||
    sectionId.startsWith('science-14') ||
    sectionId.startsWith('maths-06') ||
    sectionId.startsWith('maths-07') ||
    sectionId.startsWith('english-') ||
    sectionId.startsWith('tamil-') ||
    engine === 'GeoMap' ||
    engine === 'TimelineMap';

  const [viewMode, setViewMode] = useState<'planned' | 'guided' | 'explore' | '2d_text'>(() => {
    if (preferences.prefer2DPathway) return '2d_text';
    if (defaultMode === '2d_text') return '2d_text';
    if (hasInteractiveLab || defaultMode === 'demo') return 'guided';
    return 'planned';
  });

  useEffect(() => {
    if (preferences.prefer2DPathway) {
      setViewMode('2d_text');
    } else if (defaultMode !== '2d_text') {
      setViewMode(hasInteractiveLab || defaultMode === 'demo' ? 'guided' : 'planned');
    }
  }, [preferences.prefer2DPathway, defaultMode, hasInteractiveLab]);

  const [showHint, setShowHint] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  // Lightweight state for non-pilot arcade previews
  const [stationIdx, setStationIdx] = useState(0);
  const [coefA, setCoefA] = useState(1);
  const [coefB, setCoefB] = useState(-2);
  const [coefC, setCoefC] = useState(-3);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [classifiedItems, setClassifiedItems] = useState<Record<string, 'vector' | 'scalar'>>({});

  const progressStage = getSectionProgressStage(record, sectionId);
  const engineMeta = ENGINE_LABELS[engine];
  const displayEngineName = topicAwareLabName ?? engineMeta.name;

  const handleInteraction = () => {
    markSectionExplored(sectionId);
  };

  const handleCompleteMilestone = (reason: string) => {
    // Gate 8 mastery fix: moving a slider or inspecting a visual records 'explored',
    // never 'completed/mastered'. True completion requires passing a validated checkpoint.
    markSectionExplored(sectionId);
    setStatusAnnouncement(`${reason} (Exploration logged — complete the Check step to verify mastery.)`);
  };

  // Build Quiz pool from active lesson OR aggregated pilot checks (for /quizzes)
  const quizPool =
    lesson?.assessment?.question_bank && lesson.assessment.question_bank.length > 0
      ? lesson.assessment.question_bank
      : ALL_PILOT_LESSONS.flatMap((p) => p.assessment.question_bank.slice(0, 1));

  const currentQuestion = quizPool[quizIndex % quizPool.length];

  const discriminant = coefB * coefB - 4 * coefA * coefC;
  const vertexX = coefA !== 0 ? Number((-coefB / (2 * coefA)).toFixed(2)) : 0;
  const vertexY = Number((coefA * vertexX * vertexX + coefB * vertexX + coefC).toFixed(2));

  const gameConcepts = [
    { id: 'disp', name: 'Displacement (m)', correct: 'vector' as const },
    { id: 'mass', name: 'Mass (kg)', correct: 'scalar' as const },
    { id: 'force', name: 'Force (N)', correct: 'vector' as const },
    { id: 'temp', name: 'Temperature (K)', correct: 'scalar' as const },
  ];

  const activeEngineMode: 'guided' | 'explore' | '2d_text' =
    viewMode === '2d_text' ? '2d_text' : viewMode === 'explore' ? 'explore' : 'guided';

  const topicLabElement = renderTopicAwareInteractiveLab({
    sectionId,
    sectionTitle,
    unitTitle,
    reducedMotion: preferences.reducedMotion,
    onInteract: handleInteraction,
    onComplete: handleCompleteMilestone,
  });

  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* Slim, Uncluttered Lab Toolbar */}
      <div className="px-4 py-3 border-b border-[var(--line)] bg-[var(--surface-subtle)] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--primary)]">
          <span className="text-[var(--ink)] text-sm font-extrabold">{displayEngineName}</span>
          <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
          <span className="text-[var(--text-muted)] font-medium">p. {printedPage}</span>
          {progressStage === 'completed' && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </span>
          )}
          {lesson?.storyboard && lesson.storyboard.length > 0 && viewMode !== '2d_text' && (
            <button
              type="button"
              onClick={() => setShowStoryboard((s) => !s)}
              aria-expanded={showStoryboard}
              className="px-2.5 py-1 rounded-lg bg-[var(--primary-tint)] text-[var(--primary)] hover:underline text-[11px] font-bold"
            >
              {showStoryboard ? 'Hide 3-step guide' : '3-step guide'}
            </button>
          )}
        </div>

        {/* Mode Switcher */}
        <div
          role="group"
          aria-label="Choose how to view this activity"
          className="inline-flex flex-wrap items-center gap-1 p-0.5 rounded-[10px] bg-[var(--surface)] border border-[var(--line)]"
        >
          {!hasInteractiveLab && (
            <button
              type="button"
              onClick={() => setViewMode('planned')}
              aria-pressed={viewMode === 'planned'}
              className={`px-2.5 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${viewMode === 'planned'
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--text)] hover:text-[var(--ink)]'
                }`}
            >
              Topic status
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setViewMode('guided');
              if (preferences.prefer2DPathway) updatePreferences({ prefer2DPathway: false });
            }}
            aria-pressed={viewMode === 'guided' || viewMode === 'explore'}
            className={`px-3 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${viewMode === 'guided' || viewMode === 'explore'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--text)] hover:text-[var(--ink)]'
              }`}
          >
            Interactive Lab
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d_text')}
            aria-pressed={viewMode === '2d_text'}
            className={`px-3 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${viewMode === '2d_text'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--text)] hover:text-[var(--ink)]'
              }`}
          >
            2D &amp; Text
          </button>
        </div>
      </div>

      {/* Live Status Banner */}
      {statusAnnouncement && (
        <div
          role="status"
          aria-live="polite"
          className="px-5 py-2.5 bg-[var(--success-bg)] border-b border-[var(--success)]/30 text-sm font-semibold text-[var(--ink)] flex items-center justify-between gap-2"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
            <span>{statusAnnouncement}</span>
          </span>
          <button
            type="button"
            onClick={() => setStatusAnnouncement('')}
            className="text-xs underline text-[var(--text-muted)]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: HONEST PLANNED STATE (Zero faux sliders) */}
      {viewMode === 'planned' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="rounded-[20px] border border-[var(--line)] bg-[var(--viewer-bg)] p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--text-muted)]">
              {isUnderReview
                ? 'Title awaiting editorial verification · Interactive experience planned'
                : 'Verified textbook topic · Interactive experience planned'}
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-[var(--ink)] max-w-xl">
              Custom interactive lesson for this topic is in editorial preparation.
            </h4>
            <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed max-w-2xl">
              <strong>{sectionTitle}</strong> ({unitTitle}, printed p. {printedPage}) is indexed to
              the Class 10 textbook and scheduled for the <strong>{engineMeta.name}</strong> engine.
              Katrio never fabricates fake sliders or unverified lesson prose.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewMode('guided')}
                className="px-5 py-3 min-h-[48px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Try general {engineMeta.name} demo</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d_text')}
                className="px-4 py-3 min-h-[48px] rounded-[12px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--ink)]"
              >
                Read 2D / Text pathway plan
              </button>
              {unitRoute && (
                <Link
                  to={unitRoute}
                  className="px-4 py-3 min-h-[48px] rounded-[12px] text-sm font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to chapter</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GUIDED / EXPLORE INTERACTIVE ENGINE */}
      {(viewMode === 'guided' || viewMode === 'explore') && (
        <div className="p-4 sm:p-5 space-y-4">
          {!isRealPilot && !topicLabElement && (
            <div className="p-3 rounded-[14px] bg-[var(--primary-tint)] border border-[var(--primary)]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>
                  <strong>Interactive Engine Preview:</strong> Demonstrating <strong>{displayEngineName}</strong>{' '}
                  for <em>{sectionTitle}</em>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('planned')}
                className="text-xs font-bold text-[var(--primary)] underline whitespace-nowrap"
              >
                Topic status
              </button>
            </div>
          )}

          {/* Collapsible 3-step Guided Storyboard Bar (keeps 3D canvas immediately visible above the fold!) */}
          {showStoryboard && lesson?.storyboard && lesson.storyboard.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3 rounded-[14px] bg-[var(--primary-tint)]/70 border border-[var(--primary)]/25">
              {lesson.storyboard.map((sb) => (
                <div
                  key={`${sb.mode}-${sb.step}`}
                  className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1 text-xs"
                >
                  <div className="font-extrabold text-[var(--primary)]">
                    Step {sb.step} · {sb.title}
                  </div>
                  <p className="text-[var(--text)] leading-snug">{sb.learner_action}</p>
                </div>
              ))}
            </div>
          )}

          {/* TOPIC-AWARE 3D + 2D INTERACTIVE SIMULATOR (Guarantees 100% subject-accurate 3D/2D labs across ALL 72 chapters!) */}
          {topicLabElement ? (
            topicLabElement
          ) : sectionId.startsWith('tamil-') ? (
            <TamilLanguageStudioEngine
              sectionId={sectionId}
              lesson={lesson}
              mode={activeEngineMode}
              reducedMotion={preferences.reducedMotion}
              onInteract={handleInteraction}
              onComplete={handleCompleteMilestone}
            />
          ) : sectionId.startsWith('english-') ? (
            <StoryStageEngine
              sectionId={sectionId}
              lesson={lesson}
              mode={activeEngineMode}
              reducedMotion={preferences.reducedMotion}
              onInteract={handleInteraction}
              onComplete={handleCompleteMilestone}
            />
          ) : sectionId.startsWith('science-12') ? (
            <PlantAnatomy3DEngine
              sectionId={sectionId}
              lesson={lesson}
              mode={activeEngineMode}
              reducedMotion={preferences.reducedMotion}
              onInteract={handleInteraction}
              onComplete={handleCompleteMilestone}
            />
          ) : sectionId.startsWith('science-07') || sectionId.startsWith('science-11') ? (
            <MoleculeBuilder3DEngine
              sectionId={sectionId}
              lesson={lesson}
              mode={activeEngineMode}
              reducedMotion={preferences.reducedMotion}
              onInteract={handleInteraction}
              onComplete={handleCompleteMilestone}
            />
          ) : sectionId.startsWith('maths-07') ? (
            <Mensuration3DEngine
              sectionId={sectionId}
              lesson={lesson}
              mode={activeEngineMode}
              reducedMotion={preferences.reducedMotion}
              onInteract={handleInteraction}
              onComplete={handleCompleteMilestone}
            />
          ) : (
            <>

              {/* BESPOKE MODULAR 3D & 2D ENGINES (All 6 Handover 3D Blueprints + Pass 2 Chapters) */}
              {engine === 'ModelExplorer3D' &&
                (lesson?.interaction.scene_id === 'mensuration-3d-solids' ||
                  sectionId.startsWith('maths-07') ? (
                  <Mensuration3DEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ) : lesson?.interaction.scene_id?.startsWith('molecule-builder-3d') ||
                  sectionId.startsWith('science-07') ||
                  sectionId.startsWith('science-11') ? (
                  <MoleculeBuilder3DEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ) : lesson?.interaction.scene_id === 'plant-anatomy-3d' ||
                  sectionId.startsWith('science-12') ? (
                  <PlantAnatomy3DEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ) : (
                  <HeartCirculationEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ))}

              {engine === 'SafeVirtualLab' && (
                <ReactionLabEngine
                  sectionId={sectionId}
                  lesson={lesson}
                  mode={activeEngineMode}
                  reducedMotion={preferences.reducedMotion}
                  onInteract={handleInteraction}
                  onComplete={handleCompleteMilestone}
                />
              )}

              {engine === 'GeometryWorkbench' &&
                (lesson?.interaction.scene_id === 'maths-06-trig-identities' ||
                  sectionId === 'maths-06-01' ||
                  sectionId === 'maths-06-02' ? (
                  <TrigIdentitiesEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ) : (
                  <TrigonometryClinometerEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ))}

              {engine === 'StoryStage' && (
                <StoryStageEngine
                  sectionId={sectionId}
                  lesson={lesson}
                  mode={activeEngineMode}
                  reducedMotion={preferences.reducedMotion}
                  onInteract={handleInteraction}
                  onComplete={handleCompleteMilestone}
                />
              )}

              {engine === 'TamilLanguageStudio' && (
                <TamilLanguageStudioEngine
                  sectionId={sectionId}
                  lesson={lesson}
                  mode={activeEngineMode}
                  reducedMotion={preferences.reducedMotion}
                  onInteract={handleInteraction}
                  onComplete={handleCompleteMilestone}
                />
              )}

              {engine === 'TimelineMap' && (
                <HistoryTimeMapEngine
                  sectionId={sectionId}
                  lesson={lesson}
                  mode={activeEngineMode}
                  reducedMotion={preferences.reducedMotion}
                  onInteract={handleInteraction}
                  onComplete={handleCompleteMilestone}
                />
              )}

              {/* REMAINING REUSABLE ENGINES (Unit14Biology, JourneyThrough, Physics, Graph, GeoMap 3D/2D, Flashcards, Quiz, ConceptGame) */}
              {engine === 'JourneyThrough' &&
                (sectionId.startsWith('science-14') ||
                  lesson?.interaction.scene_id?.startsWith('unit14-') ? (
                  <Unit14BiologyEngine
                    sectionId={sectionId}
                    lesson={lesson}
                    mode={activeEngineMode}
                    reducedMotion={preferences.reducedMotion}
                    onInteract={handleInteraction}
                    onComplete={handleCompleteMilestone}
                  />
                ) : (
                  <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--viewer-bg)] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                      <span className="font-mono-tabular text-[var(--primary)]">
                        STATION {DOUBLE_CIRCULATION_PATHWAY[stationIdx].order} OF {DOUBLE_CIRCULATION_PATHWAY.length}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                        {DOUBLE_CIRCULATION_PATHWAY[stationIdx].oxygenation}
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[var(--ink)]">
                      {DOUBLE_CIRCULATION_PATHWAY[stationIdx].structure}
                    </h4>
                    <p className="text-xs font-semibold text-[var(--text-muted)]">
                      {DOUBLE_CIRCULATION_PATHWAY[stationIdx].valveOrVessel}
                    </p>
                    <p className="text-sm text-[var(--text)] leading-relaxed">
                      {DOUBLE_CIRCULATION_PATHWAY[stationIdx].detail}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        disabled={stationIdx === 0}
                        onClick={() => {
                          setStationIdx((i) => Math.max(0, i - 1));
                          handleInteraction();
                        }}
                        className="px-4 py-2 min-h-[42px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold disabled:opacity-40"
                      >
                        ← Previous station
                      </button>
                      <button
                        type="button"
                        disabled={stationIdx === DOUBLE_CIRCULATION_PATHWAY.length - 1}
                        onClick={() => {
                          const next = Math.min(DOUBLE_CIRCULATION_PATHWAY.length - 1, stationIdx + 1);
                          setStationIdx(next);
                          handleInteraction();
                          if (next === DOUBLE_CIRCULATION_PATHWAY.length - 1) {
                            handleCompleteMilestone('Completed all 6 double-circulation stations!');
                          }
                        }}
                        className="px-4 py-2 min-h-[42px] rounded-xl bg-[var(--primary)] text-white text-xs font-bold disabled:opacity-40"
                      >
                        Next station →
                      </button>
                    </div>
                  </div>
                ))}

              {engine === 'PhysicsWorkbench' && (
                <AcousticsEchoLab
                  sectionId={sectionId}
                  sectionTitle={sectionTitle}
                  reducedMotion={preferences.reducedMotion}
                  onInteract={handleInteraction}
                  onComplete={handleCompleteMilestone}
                />
              )}

              {engine === 'GraphSandbox' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)]">
                  <div className="space-y-3">
                    <div
                      className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]"
                      dangerouslySetInnerHTML={{
                        __html: renderLatex(
                          `f(x) = ${coefA}x^2 ${coefB >= 0 ? '+' : ''}${coefB}x ${coefC >= 0 ? '+' : ''}${coefC}`,
                        ),
                      }}
                    />
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      a = {coefA}
                      <input type="range" min={-3} max={3} step={0.5} value={coefA} onChange={(e) => { setCoefA(Number(e.target.value)); handleInteraction(); }} className="w-full accent-[var(--math)]" />
                    </label>
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      b = {coefB}
                      <input type="range" min={-6} max={6} step={1} value={coefB} onChange={(e) => { setCoefB(Number(e.target.value)); handleInteraction(); }} className="w-full accent-[var(--math)]" />
                    </label>
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      c = {coefC}
                      <input type="range" min={-6} max={6} step={1} value={coefC} onChange={(e) => { setCoefC(Number(e.target.value)); handleInteraction(); }} className="w-full accent-[var(--math)]" />
                    </label>
                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-mono-tabular">
                      Vertex: ({vertexX}, {vertexY}) · Δ = {discriminant}
                    </div>
                  </div>
                  <div className="bg-[var(--surface)] rounded-xl border border-[var(--line)] p-4 flex items-center justify-center">
                    <svg viewBox="-120 -120 240 240" className="w-full max-w-[240px] h-[220px]" role="img" aria-label="Quadratic function plot">
                      <line x1="-110" y1="0" x2="110" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="0" y1="-110" x2="0" y2="110" stroke="#94A3B8" strokeWidth="1.5" />
                      <polyline
                        fill="none"
                        stroke="#7155C8"
                        strokeWidth="3"
                        points={Array.from({ length: 41 }, (_, idx) => {
                          const x = -5 + idx * 0.25;
                          const y = coefA * x * x + coefB * x + coefC;
                          return `${x * 18},${Math.max(-110, Math.min(110, -y * 12))}`;
                        }).join(' ')}
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* GeoMap ALWAYS launches our interactive 3D India Relief, Rivers & SW Monsoon Atlas (including on /arcade!) */}
              {engine === 'GeoMap' && (
                <IndiaRelief3DEngine
                  sectionId={sectionId}
                  lesson={lesson}
                  mode={activeEngineMode}
                  reducedMotion={preferences.reducedMotion}
                  onInteract={handleInteraction}
                  onComplete={handleCompleteMilestone}
                />
              )}

              {engine === 'Flashcards' && (
                <VisualFlashcardDeck
                  cards={lesson?.flashcards}
                  subjectHint={lesson?.subject}
                  lessonTitleHint={lesson?.title}
                  compact
                />
              )}

              {engine === 'QuizEngine' && currentQuestion && (
                <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono-tabular font-bold text-[var(--text-muted)]">
                    <span>
                      Question {(quizIndex % quizPool.length) + 1} of {quizPool.length}
                    </span>
                    <span className="capitalize">Level: {currentQuestion.difficulty}</span>
                  </div>
                  <p className="text-base font-extrabold text-[var(--ink)] font-tamil">
                    {currentQuestion.prompt}
                  </p>
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedOptionId(opt.id);
                          handleInteraction();
                          if (opt.is_correct) {
                            recordQuizCheckpoint(sectionId, 1, 1);
                            handleCompleteMilestone('Concept check answered accurately!');
                          }
                        }}
                        className={`w-full text-left p-4 min-h-[48px] rounded-xl border text-sm font-semibold font-tamil transition-colors ${selectedOptionId === opt.id
                          ? opt.is_correct
                            ? 'bg-[var(--success-bg)] border-[var(--success)] text-[var(--ink)] font-bold'
                            : 'bg-[var(--warning-bg)] border-[var(--warning)] text-[var(--ink)]'
                          : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text)] hover:border-[var(--primary)]'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {selectedOptionId && (
                    <div role="status" className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm space-y-1 font-tamil">
                      <p className="font-bold text-[var(--ink)]">
                        {currentQuestion.options.find((o) => o.id === selectedOptionId)?.feedback}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {currentQuestion.worked_explanation}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOptionId(null);
                        setQuizIndex((i) => (i + 1) % quizPool.length);
                      }}
                      className="px-4 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)]"
                    >
                      Next question →
                    </button>
                  </div>
                </div>
              )}

              {engine === 'ConceptGame' && (
                <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5">
                  <h4 className="text-base font-extrabold text-[var(--ink)]">
                    Sort each quantity: Vector (has direction) vs Scalar (size only)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gameConcepts.map((item) => {
                      const chosen = classifiedItems[item.id];
                      const isCorrect = chosen && chosen === item.correct;
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-between gap-2 text-sm"
                        >
                          <div>
                            <p className="font-bold text-[var(--ink)]">{item.name}</p>
                            {chosen && (
                              <span
                                className={
                                  isCorrect
                                    ? 'text-[var(--success)] text-xs font-bold'
                                    : 'text-[var(--warning)] text-xs font-semibold'
                                }
                              >
                                {isCorrect ? `✓ Correct (${chosen})` : 'Try again'}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1.5">
                            {(['vector', 'scalar'] as const).map((kind) => (
                              <button
                                key={kind}
                                type="button"
                                onClick={() => {
                                  const next = { ...classifiedItems, [item.id]: kind };
                                  setClassifiedItems(next);
                                  handleInteraction();
                                  if (gameConcepts.every((g) => next[g.id] === g.correct)) {
                                    handleCompleteMilestone('All 4 quantities classified accurately!');
                                  }
                                }}
                                className="px-3 py-1.5 min-h-[38px] rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--primary)] hover:text-white text-xs font-bold capitalize"
                              >
                                {kind}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Contextual Hint & Expected Observations */}
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)]/70 p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-[var(--ink)]">
                What to observe
              </h4>
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                aria-expanded={showHint}
                className="px-3 py-1.5 min-h-[38px] rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide tip' : 'Need a tip?'}</span>
              </button>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed">
              {topicLabElement
                ? `Explore ${sectionTitle} directly inside the ${displayEngineName} above. Try switching presets or variables, then verify your understanding in the Check Yourself section.`
                : (lesson?.interaction.expected_observations[0] ?? engineMeta.summary)}
            </p>
            {showHint && (
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--primary)]/30 text-xs sm:text-sm text-[var(--ink)]">
                <strong>Tip: </strong>
                {topicLabElement
                  ? `Compare two settings in ${displayEngineName} and trace how the diagram or formula updates immediately — anchored to ${unitTitle}, printed p. ${printedPage}.`
                  : (lesson?.interaction.expected_observations[1] ?? engineMeta.hint)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: 2D & TEXT ACCESSIBLE EQUIVALENT (Zero WebGL / Zero Drag Required) */}
      {viewMode === '2d_text' && (
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-[14px] bg-[var(--success-bg)] border border-[var(--success)]/30 text-sm text-[var(--ink)]">
            <p className="font-bold">
              Accessible 2D &amp; Text Pathway (Same learning objective · Works without WebGL or dragging)
            </p>
            <p className="mt-1 text-[var(--text)]">
              {lesson?.accessible_equivalent.summary ?? accessibilityFallbackText}
            </p>
          </div>

          {/* For Heart 3D, also embed the full interactive 2D SVG directly inside 2D mode */}
          {engine === 'ModelExplorer3D' && (
            <HeartCirculationEngine
              sectionId={sectionId}
              lesson={lesson}
              mode="2d_text"
              reducedMotion={preferences.reducedMotion}
              onInteract={handleInteraction}
              onComplete={handleCompleteMilestone}
            />
          )}

          {lesson?.accessible_equivalent.steps && lesson.accessible_equivalent.steps.length > 0 ? (
            <ol className="space-y-3">
              {lesson.accessible_equivalent.steps.map((step) => (
                <li
                  key={step.step_number}
                  className="p-4 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] space-y-1.5"
                >
                  <div className="text-xs font-mono-tabular font-bold text-[var(--primary)]">
                    STEP {step.step_number}
                  </div>
                  <h4 className="text-base font-extrabold text-[var(--ink)] font-tamil">
                    {step.heading}
                  </h4>
                  <p className="text-sm text-[var(--text)] leading-relaxed font-tamil">
                    {step.description}
                  </p>
                  <p className="text-xs font-bold text-[var(--success)] font-tamil">
                    Key takeaway: {step.key_takeaway}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
              <h4 className="text-base font-extrabold text-[var(--ink)]">
                Planned 2D / Text Alternative ({sectionTitle})
              </h4>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {accessibilityFallbackText}
              </p>
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={() =>
                handleCompleteMilestone('Completed 2D & text concept walkthrough!')
              }
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-white text-sm font-bold inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I&apos;ve reviewed this 2D &amp; text guide</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
