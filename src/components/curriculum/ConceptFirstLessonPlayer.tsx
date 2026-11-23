import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  ExternalLink,
  HelpCircle,
  Layers,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import type { LessonExperienceSpec } from '../../types/lessonExperience';
import { useProgress } from '../../features/local-progress/ProgressContext';
import { ElectricPotentialLab2D } from '../engines/ElectricPotentialLab2D';
import { JoulesLawLab2D } from '../engines/JoulesLawLab2D';
import { EthyleneRipeningLab2D } from '../engines/EthyleneRipeningLab2D';
import { PituitaryEndocrineLab2D } from '../engines/PituitaryEndocrineLab2D';
import {
  MathsChapter4GeometryLabs2D,
  type MathsCh4Variant,
} from '../engines/MathsChapter4GeometryLabs2D';
import {
  ReproductionDiagrams2D,
  type ReproductionDiagramVariant,
} from '../engines/ReproductionDiagrams2D';

interface ConceptFirstLessonPlayerProps {
  spec: LessonExperienceSpec;
  prevRoute?: { label: string; to: string };
  nextRoute?: { label: string; to: string };
  progressStage: 'not_started' | 'started' | 'explored' | 'practised' | 'completed';
  isReviewLater: boolean;
  onExplore: () => void;
  onPractise: () => void;
  onMasteryVerified: (score: number, total: number) => void;
  onToggleReviewLater: () => void;
}

type ConceptTabId = 'discover' | 'connect' | 'solve' | 'book' | 'all';

const CONCEPT_TABS: { id: Exclude<ConceptTabId, 'all'>; label: string; icon: typeof Compass }[] = [
  { id: 'discover', label: '1. Discover & Explore', icon: Compass },
  { id: 'connect', label: '2. Connect & Remember', icon: Brain },
  { id: 'solve', label: '3. Solve & Apply', icon: Target },
  { id: 'book', label: '4. Book & Revision', icon: BookOpen },
];

/**
 * Gate 4 & Gate 5 Concept-First 10-Stage Lesson Experience Player.
 * Philosophy: Understand → Predict → Experiment → Explain → Solve → Remember → Textbook Reading.
 * Non-linear jump navigation, honest mastery verification (never completes on slider/click!),
 * zero manipulative streaks/timers, calm WCAG 2.2 AA accessible design.
 */
export function ConceptFirstLessonPlayer({
  spec,
  prevRoute,
  nextRoute,
  progressStage,
  isReviewLater,
  onExplore,
  onPractise,
  onMasteryVerified,
  onToggleReviewLater,
}: ConceptFirstLessonPlayerProps) {
  const { record, saveTeachBackNote } = useProgress();
  const [activeTab, setActiveTab] = useState<ConceptTabId>('discover');
  const [depth, setDepth] = useState<'simple' | 'detailed' | 'exam'>('simple');
  const [showTamil, setShowTamil] = useState(false);
  const [showMisconceptions, setShowMisconceptions] = useState(false);

  // Mind Map state (compact, expandable + text list view)
  const [selectedNodeId, setSelectedNodeId] = useState(spec.mindMap.nodes[0]?.id ?? '');
  const [mindMapTextMode, setMindMapTextMode] = useState(false);

  // Predict state
  const [selectedPredict, setSelectedPredict] = useState<string | null>(null);

  // Progressive Solve state (real mastery check!)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [masteryJustUnlocked, setMasteryJustUnlocked] = useState(false);

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Textbook glossary popover + local-only self-check scratchpad (persisted in katrio-device-v1)
  const [activeGlossary, setActiveGlossary] = useState<{ term: string; tamil?: string; meaning: string } | null>(null);
  const selfNote = record.teachBackNotes?.[spec.sectionId] ?? '';
  const [showSelfGuide, setShowSelfGuide] = useState(false);
  const [confidence, setConfidence] = useState<'still_learning' | 'getting_there' | 'can_teach' | null>(null);

  useEffect(() => {
    setActiveTab('discover');
    setSelectedNodeId(spec.mindMap.nodes[0]?.id ?? '');
    setSelectedPredict(null);
    setAnswers({});
    setMasteryJustUnlocked(false);
  }, [spec.sectionId, spec.mindMap.nodes]);

  const showTab = (t: Exclude<ConceptTabId, 'all'>) => activeTab === 'all' || activeTab === t;

  const selectedNode =
    spec.mindMap.nodes.find((n) => n.id === selectedNodeId) ?? spec.mindMap.nodes[0];

  const handleSelectSolveOption = (qId: string, optId: string) => {
    const next = { ...answers, [qId]: optId };
    setAnswers(next);
    onPractise();

    // Gate 8 mastery rule: mark understood_checkpoint ONLY when learner gets all progressive checks right!
    const correctCount = spec.solveChallenges.reduce((acc, q) => {
      const picked = next[q.id];
      const ok = q.options.some((o) => o.id === picked && o.isCorrect);
      return acc + (ok ? 1 : 0);
    }, 0);

    if (correctCount === spec.solveChallenges.length) {
      onMasteryVerified(correctCount, spec.solveChallenges.length);
      setMasteryJustUnlocked(true);
    }
  };

  const renderInteractiveLab = () => {
    switch (spec.engineId) {
      case 'ElectricPotentialLab2D':
        return <ElectricPotentialLab2D onExplore={onExplore} />;
      case 'JoulesLawLab2D':
        return <JoulesLawLab2D onExplore={onExplore} />;
      case 'EthyleneRipeningLab2D':
        return <EthyleneRipeningLab2D onExplore={onExplore} />;
      case 'PituitaryEndocrineLab2D':
        return <PituitaryEndocrineLab2D onExplore={onExplore} />;
      case 'MathsChapter4GeometryLabs2D':
        return (
          <MathsChapter4GeometryLabs2D
            variant={spec.variantId as MathsCh4Variant}
            onExplore={onExplore}
          />
        );
      case 'ReproductionDiagrams2D':
        return (
          <ReproductionDiagrams2D
            variant={spec.variantId as ReproductionDiagramVariant}
            onExplore={onExplore}
          />
        );
    }
  };

  const roleColors: Record<string, { fill: string; stroke: string; text: string }> = {
    core: { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
    cause: { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
    mechanism: { fill: '#f3e8ff', stroke: '#7c3aed', text: '#5b21b6' },
    application: { fill: '#dcfce7', stroke: '#15803d', text: '#166534' },
    caution: { fill: '#ffe4e6', stroke: '#be123c', text: '#9f1239' },
  };

  return (
    <div className="space-y-6">
      {/* Calm 4-Tab Concept Quest Bar + Honest Progress Stage Indicator */}
      <nav
        aria-label="Lesson workspace tabs"
        className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs"
      >
        <div role="tablist" className="flex flex-wrap gap-1.5">
          {CONCEPT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'all' ? 'discover' : 'all')}
            aria-pressed={activeTab === 'all'}
            className={`min-h-[40px] px-3 py-2 rounded-xl border text-xs font-bold ${
              activeTab === 'all'
                ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            {activeTab === 'all' ? '✓ Showing All' : 'Show All'}
          </button>
        </div>
        <div className="text-[11px] font-bold text-[var(--text-muted)] px-2">
          Stage:{' '}
          <span className="text-[var(--primary)] capitalize">
            {progressStage === 'completed'
              ? '✓ Understood (Verified)'
              : progressStage === 'practised'
                ? 'Practised'
                : progressStage === 'explored'
                  ? 'Explored Lab'
                  : 'Started'}
          </span>
        </div>
      </nav>

      {/* TAB 1: DISCOVER & EXPLORE (Spark + Explain Simply + Predict & Lab) */}
      {showTab('discover') && (
        <div className="space-y-6">
      {/* STAGE 1: THE SPARK */}
      <section className="rounded-[22px] border border-[var(--primary)]/25 bg-[var(--info-bg)] p-5 space-y-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>The Spark · Curiosity Question ({spec.estimatedMinutes})</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ink)] leading-snug">
          {spec.spark.question}
        </h2>
        <p className="text-sm text-[var(--text)]">{spec.spark.teaser}</p>
      </section>

      {/* STAGE 2: ELI5 / EXPLAIN SIMPLY */}
      <section
        id="cf-explain"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Explain It Simply</span>
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(['simple', 'detailed', 'exam'] as const).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setDepth(layer)}
                aria-pressed={depth === layer}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  depth === layer
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                {layer === 'simple' ? 'Simple (ELI5)' : layer === 'detailed' ? 'Detailed' : 'Exam-Ready'}
              </button>
            ))}
            {spec.explanations.simpleTamil && (
              <button
                type="button"
                onClick={() => setShowTamil((v) => !v)}
                aria-pressed={showTamil}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-bold font-tamil ${
                  showTamil
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                தமிழ் உதவி
              </button>
            )}
          </div>
        </div>

        {depth === 'simple' && (
          <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">
            {spec.explanations.simple}
          </p>
        )}
        {depth === 'detailed' && (
          <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">
            {spec.explanations.detailed}
          </p>
        )}
        {depth === 'exam' && (
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--ink)]">
            {spec.explanations.examReady.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        )}

        {showTamil && spec.explanations.simpleTamil && (
          <div lang="ta" className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-400/40 font-tamil text-sm text-[var(--ink)] leading-relaxed">
            {spec.explanations.simpleTamil}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs sm:text-sm text-[var(--ink)]">
          <strong>Everyday Analogy:</strong> {spec.explanations.analogy.replace(/^Analogy:\s*/i, '')}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowMisconceptions((v) => !v)}
            aria-expanded={showMisconceptions}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-amber-400/50 bg-amber-50 dark:bg-amber-950/30 text-xs font-extrabold text-amber-900 dark:text-amber-200"
          >
            {showMisconceptions ? 'Hide Common Misconceptions' : 'Watch Out: Common Mistakes Students Make'}
          </button>
          {showMisconceptions && (
            <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {spec.explanations.misconceptions.map((m) => (
                <div key={m.myth} className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-1">
                  <div className="font-extrabold text-rose-700 dark:text-rose-300">Myth: {m.myth}</div>
                  <div className="text-[var(--ink)] leading-relaxed"><strong>Reality:</strong> {m.reality}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
        </div>
      )}

      {/* TAB 2: CONNECT & REMEMBER (Mind Map) */}
      {showTab('connect') && (
      <section
        id="cf-mindmap"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--ink)]">{spec.mindMap.title}</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Tap or press Enter on any concept node to expand its idea.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMindMapTextMode((v) => !v)}
            className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)]"
          >
            {mindMapTextMode ? 'Show Visual Diagram' : 'Text List View (A11y)'}
          </button>
        </div>

        {!mindMapTextMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-2 overflow-x-auto">
              <svg viewBox="0 0 600 250" role="img" aria-label={spec.mindMap.title} className="w-full h-auto min-w-[320px]">
                {spec.mindMap.edges.map((e) => {
                  const a = spec.mindMap.nodes.find((n) => n.id === e.from);
                  const b = spec.mindMap.nodes.find((n) => n.id === e.to);
                  if (!a || !b) return null;
                  return (
                    <g key={`${e.from}-${e.to}`}>
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth="2" />
                      <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 5} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#475569">
                        {e.relation}
                      </text>
                    </g>
                  );
                })}
                {spec.mindMap.nodes.map((n) => {
                  const c = roleColors[n.role] ?? roleColors.core;
                  const active = n.id === selectedNode?.id;
                  return (
                    <g
                      key={n.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${n.label}: ${n.summary}`}
                      onClick={() => setSelectedNodeId(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedNodeId(n.id);
                        }
                      }}
                      className="cursor-pointer focus:outline-none"
                    >
                      <rect
                        x={n.x - 86}
                        y={n.y - 26}
                        width="172"
                        height="52"
                        rx="12"
                        fill={active ? c.stroke : c.fill}
                        stroke={c.stroke}
                        strokeWidth={active ? 3 : 2}
                      />
                      <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={active ? '#ffffff' : c.text}>
                        {n.label}
                      </text>
                      <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={active ? '#f8fafc' : '#334155'}>
                        {n.summary}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {selectedNode && (
              <div className="lg:col-span-4 p-4 rounded-2xl border border-[var(--primary)]/30 bg-[var(--info-bg)] space-y-1.5 text-xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                  Selected Concept Node
                </div>
                <div className="text-sm font-extrabold text-[var(--ink)]">{selectedNode.label}</div>
                <p className="text-[var(--text)] leading-relaxed">{selectedNode.detail}</p>
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-2 text-xs sm:text-sm">
            {spec.mindMap.nodes.map((n) => (
              <li key={n.id} className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                <strong className="text-[var(--ink)]">{n.label}</strong> ({n.summary}): {n.detail}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      {/* STAGES 4 & 5: PREDICT FIRST + BESPOKE INTERACTIVE LAB (Part of Tab 1: Discover & Explore) */}
      {showTab('discover') && (
      <section
        id="cf-lab"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]"
      >
        {/* Predict Before You Experiment */}
        <div className="p-4 rounded-2xl border border-amber-400/40 bg-amber-50/70 dark:bg-amber-950/25 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Predict First · Think Before You Move a Control
          </div>
          <p className="text-sm font-bold text-[var(--ink)]">{spec.predictPrompt.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {spec.predictPrompt.options.map((opt) => {
              const picked = selectedPredict === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setSelectedPredict(opt.id); onExplore(); }}
                  aria-pressed={picked}
                  className={`min-h-[44px] p-3 rounded-xl border text-left text-xs font-bold transition-colors ${
                    picked
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {selectedPredict && (
            <div role="status" className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)]">
              {spec.predictPrompt.options.find((o) => o.id === selectedPredict)?.feedback}
            </div>
          )}
        </div>

        {/* Micro-Mission & Interactive Lab */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--primary)]" />
              <span>Interactive Concept Lab</span>
            </h2>
            <span className="px-3 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] text-[11px] font-bold text-[var(--text-muted)]">
              Exploring logs “Explored” · Passing Stage 5 verifies Mastery
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/25 text-xs font-semibold text-[var(--ink)]">
            <strong>Mini-Mission:</strong> {spec.microMission}
          </div>

          {renderInteractiveLab()}
        </div>
      </section>
      )}

      {/* TAB 3: SOLVE & APPLY (Why It Works + Worked Example + Validated Mastery Checkpoint) */}
      {showTab('solve') && (
        <div className="space-y-6">
      {/* STAGE 6: WHY IT WORKS + WORKED TEXTBOOK EXAMPLE */}
      <section
        id="cf-why"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]"
      >
        <h2 className="text-lg font-extrabold text-[var(--ink)]">Why It Works &amp; Solved Textbook Example</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {spec.whyItWorks.steps.map((st, idx) => (
            <div key={st.heading} className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-1.5">
              <div className="text-xs font-extrabold text-[var(--primary)]">Reason {idx + 1}</div>
              <div className="text-sm font-extrabold text-[var(--ink)]">{st.heading}</div>
              <p className="text-xs text-[var(--text)] leading-relaxed">{st.detail}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl border border-[var(--primary)]/30 bg-[var(--info-bg)] space-y-3 text-sm">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            Worked Example · {spec.whyItWorks.workedExample.sourceRef}
          </div>
          <p className="font-bold text-[var(--ink)]">{spec.whyItWorks.workedExample.problem}</p>
          <div className="text-xs space-y-1">
            <div className="font-bold text-[var(--ink)]">Given:</div>
            <ul className="list-disc pl-5 text-[var(--text)]">
              {spec.whyItWorks.workedExample.given.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-[var(--ink)]">
            {spec.whyItWorks.workedExample.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-extrabold text-[var(--primary)] text-xs sm:text-sm">
            Answer: {spec.whyItWorks.workedExample.finalAnswer}
          </div>
        </div>
      </section>

      {/* STAGE 7: SOLVE IT YOURSELF (VALIDATED MASTERY CHECKPOINT!) */}
      <section
        id="cf-solve"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
              <span>Solve It Yourself · Verify Real Understanding</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Untimed, zero penalty for hints. Solving all checks unlocks verified mastery on this device.
            </p>
          </div>
          {progressStage === 'completed' && (
            <span className="px-3 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)] text-xs font-extrabold inline-flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Understood Checkpoint Passed</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          {spec.solveChallenges.map((q, idx) => {
            const pickedId = answers[q.id];
            const pickedOpt = q.options.find((o) => o.id === pickedId);
            return (
              <div key={q.id} className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[11px] font-extrabold text-[var(--primary)]">
                    Q{idx + 1} · {q.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenHints((h) => ({ ...h, [q.id]: !h[q.id] }))}
                    className="text-xs font-bold text-[var(--primary)] underline"
                  >
                    {openHints[q.id] ? 'Hide hint' : 'Need a hint?'}
                  </button>
                </div>
                <p className="text-sm font-bold text-[var(--ink)]">{q.prompt}</p>
                {openHints[q.id] && (
                  <div className="p-2.5 rounded-xl bg-[var(--info-bg)] text-xs text-[var(--ink)]">
                    <strong>Hint:</strong> {q.hint}
                  </div>
                )}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isPicked = pickedId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectSolveOption(q.id, opt.id)}
                        className={`w-full min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-colors ${
                          isPicked
                            ? opt.isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-[var(--ink)]'
                              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-[var(--ink)]'
                            : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--primary)]'
                        }`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
                {pickedOpt && (
                  <div
                    role="status"
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      pickedOpt.isCorrect
                        ? 'bg-[var(--success-bg)] text-[var(--ink)]'
                        : 'bg-[var(--warning-bg)] text-[var(--ink)]'
                    }`}
                  >
                    <strong>{pickedOpt.isCorrect ? '✓ Why this works: ' : 'Try rethinking: '}</strong>
                    {pickedOpt.why}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {masteryJustUnlocked && (
          <div role="status" className="p-4 rounded-2xl bg-[var(--success-bg)] border border-[var(--success)]/40 text-sm font-bold text-[var(--ink)] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0" />
            <span>
              Checkpoint verified! You solved both concept checks and the new transfer problem — this subsection is now marked Understood on your device.
            </span>
          </div>
        )}
      </section>
        </div>
      )}

      {/* STAGE 8: REMEMBER IT (KEY TAKEAWAYS, FLASHCARDS & VERIFIED FUN FACT — Part of Tab 2: Connect & Remember) */}
      {showTab('connect') && (
      <section
        id="cf-remember"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]"
      >
        <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--primary)]" />
          <span>Remember It · Key Ideas, Flashcards &amp; Verified Fun Fact</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {spec.remember.takeaways.map((t, i) => (
            <div key={t} className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs sm:text-sm text-[var(--ink)]">
              <div className="text-[11px] font-extrabold text-[var(--primary)] mb-1">Key Idea {i + 1}</div>
              {t}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {spec.remember.flashcards.map((fc) => {
            const flipped = Boolean(flippedCards[fc.id]);
            return (
              <button
                key={fc.id}
                type="button"
                onClick={() => setFlippedCards((prev) => ({ ...prev, [fc.id]: !prev[fc.id] }))}
                aria-pressed={flipped}
                className="min-h-[120px] p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-left flex flex-col justify-between transition-colors"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                  {fc.tag} · {flipped ? 'Answer (Tap to flip)' : 'Tap to reveal'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[var(--ink)] mt-2">
                  {flipped ? fc.back : fc.front}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-400/40 text-xs sm:text-sm text-[var(--ink)] space-y-1">
          <div className="font-extrabold text-amber-900 dark:text-amber-200">Verified Did You Know?</div>
          <p>{spec.remember.funFact.fact}</p>
          <div className="text-[11px] text-[var(--text-muted)]">Source: {spec.remember.funFact.source}</div>
        </div>
      </section>
      )}

      {/* TAB 4: BOOK & REVISION (Source-Linked Textbook Reading) */}
      {showTab('book') && (
      <section
        id="textbook-reading"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--primary)]" />
              <span>Read the Textbook, Chunk by Chunk</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {spec.textbookAnchor.book} ({spec.textbookAnchor.edition}) · Printed pp.{' '}
              {spec.textbookAnchor.printedPages.join(', ')} (PDF pp. {spec.textbookAnchor.pdfPages.join(', ')})
            </p>
          </div>
          <a
            href={spec.textbookAnchor.officialPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1.5"
          >
            <span>Official TNSCERT Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-3">
          {spec.readingChunks.map((ch) => (
            <div key={ch.id} className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-extrabold text-[var(--ink)]">{ch.heading}</div>
                <span className="font-mono-tabular text-[11px] font-bold text-[var(--text-muted)]">
                  Book p. {ch.printedPage} (PDF p. {ch.pdfPage})
                </span>
              </div>
              <p className="text-[var(--ink)] leading-relaxed">{ch.summary}</p>
              <p className="text-xs text-[var(--text-muted)]">
                <strong>Study Tip:</strong> {ch.plainExplanation}
              </p>
              {ch.glossary.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ch.glossary.map((g) => (
                    <button
                      key={g.term}
                      type="button"
                      onClick={() => setActiveGlossary(g)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--primary)]/35 text-xs font-bold text-[var(--primary)]"
                    >
                      {g.term} {g.tamil ? `(${g.tamil})` : ''}
                    </button>
                  ))}
                </div>
              )}
              <div className="text-[11px] font-semibold text-[var(--text-muted)]">
                <strong>Related Textbook Exercises:</strong> {ch.relatedExerciseRef}
              </div>
            </div>
          ))}
        </div>

        {activeGlossary && (
          <div className="p-3.5 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/35 flex items-start justify-between gap-3 text-xs">
            <div>
              <strong className="text-[var(--ink)]">
                {activeGlossary.term} {activeGlossary.tamil ? `· ${activeGlossary.tamil}` : ''}:
              </strong>{' '}
              <span className="text-[var(--text)]">{activeGlossary.meaning}</span>
            </div>
            <button type="button" onClick={() => setActiveGlossary(null)} className="font-bold underline text-[var(--primary)]">
              Close
            </button>
          </div>
        )}
      </section>
      )}

      {/* STAGE 10: LOCAL SELF-CHECK & NEXT SUBSECTION (Part of Tab 2: Connect & Remember + Always-available Next bar) */}
      {showTab('connect') && (
      <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-extrabold text-[var(--ink)]">Explain It in Your Own Words (Saved Locally on This Device)</h2>
        <p className="text-xs sm:text-sm text-[var(--text)]">{spec.selfCheckPrompt}</p>
        <textarea
          rows={2}
          value={selfNote}
          onChange={(e) => saveTeachBackNote(spec.sectionId, e.target.value)}
          placeholder="Type your own explanation here (auto-saved privately on this device — never sent to any server)..."
          className="w-full p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)]"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSelfGuide((v) => !v)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[var(--primary)] text-xs font-bold text-[var(--primary)] bg-[var(--surface)]"
          >
            {showSelfGuide ? 'Hide Check Points' : 'Compare Against Key Check Points'}
          </button>
          <button
            type="button"
            onClick={onToggleReviewLater}
            aria-pressed={isReviewLater}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${
              isReviewLater
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isReviewLater ? 'Marked for Review Later' : 'Flag to Review Later'}</span>
          </button>
        </div>

        {showSelfGuide && (
          <div className="p-3.5 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/30 text-xs text-[var(--ink)]">
            <strong>Self-Check Guide:</strong> {spec.selfCheckGuide}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--line)] text-xs">
          <span className="font-bold text-[var(--text-muted)]">Confidence check (self-assessment only):</span>
          {([
            ['still_learning', 'Still exploring'],
            ['getting_there', 'Mostly clear'],
            ['can_teach', 'Ready to explain it'],
          ] as const).map(([cid, label]) => (
            <button
              key={cid}
              type="button"
              onClick={() => setConfidence(cid)}
              aria-pressed={confidence === cid}
              className={`min-h-[36px] px-3 py-1 rounded-xl border font-bold ${
                confidence === cid
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      )}

      {/* Always-visible Calm Tab Progression & Prev/Next Subsection Bar */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {prevRoute && (
            <Link to={prevRoute.to} className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>{prevRoute.label}</span>
            </Link>
          )}
          {activeTab !== 'book' && activeTab !== 'all' && (
            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  activeTab === 'discover' ? 'connect' : activeTab === 'connect' ? 'solve' : 'book',
                )
              }
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary-tint)] border border-[var(--primary)]/30 text-xs font-extrabold text-[var(--primary)] inline-flex items-center gap-1.5"
            >
              <span>
                Next Tab:{' '}
                {activeTab === 'discover'
                  ? '2. Connect & Remember'
                  : activeTab === 'connect'
                    ? '3. Solve & Apply'
                    : '4. Book & Revision'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {nextRoute && (
          <Link to={nextRoute.to} className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold inline-flex items-center gap-1.5">
            <span>Next Topic: {nextRoute.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
