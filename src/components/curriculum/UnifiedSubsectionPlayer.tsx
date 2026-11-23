import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { SubsectionLessonPackage } from '../../types/subsectionLesson';
import { SubsectionConceptMap } from './SubsectionConceptMap';
import { HistoryUnit4Interactive2D } from '../engines/HistoryUnit4Interactive2D';

interface UnifiedSubsectionPlayerProps {
  pkg: SubsectionLessonPackage;
  prevRoute?: { label: string; to: string };
  nextRoute?: { label: string; to: string };
  isCompleted: boolean;
  isReviewLater: boolean;
  onMarkPractised: () => void;
  onMarkCompleted: () => void;
  onToggleReviewLater: () => void;
}

/**
 * Unified 9-Stage Understanding-First Subsection Player (Katrio 360° Section D Contract).
 * Stages:
 * 0. Orientation + "Jump to textbook"
 * 1. Understand simply (ELI5 + Tamil toggle + Analogy + Simple->Detailed->Exam layers + optional Listen)
 * 2. See the big picture (Accessible Interactive SVG Concept Map)
 * 3. Explore (Purpose-built 2D Historical Interactive)
 * 4. Why did that happen? (Step-by-step causal reveal separating fact vs interpretation)
 * 5. Easy-to-remember links
 * 6. Try it yourself (Low-stakes active challenge with calm "why" feedback)
 * 7. Practise for exams (Optional Exam Bridge — Textbook Exercise vs Original Practice)
 * 8. Read the book, chunk by chunk (#textbook-reading — rights-safe summaries + glossary + recall)
 * 9. Finish & next (Takeaway, Can you explain it?, genuine completion trigger, Review later, Next)
 */
export function UnifiedSubsectionPlayer({
  pkg,
  prevRoute,
  nextRoute,
  isCompleted,
  isReviewLater,
  onMarkPractised,
  onMarkCompleted,
  onToggleReviewLater,
}: UnifiedSubsectionPlayerProps) {
  const [depthLayer, setDepthLayer] = useState<'simple' | 'detailed' | 'exam'>('simple');
  const [showTamil, setShowTamil] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [revealedStep, setRevealedStep] = useState(0);
  const [showMisconceptions, setShowMisconceptions] = useState(false);

  // Stage 6: Active challenge state (sequence / match / misconception)
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});
  const [challengeChecked, setChallengeChecked] = useState(false);

  // Stage 7: Optional exam bridge state
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [openModelPoints, setOpenModelPoints] = useState<Record<string, boolean>>({});

  // Stage 8: Chunked textbook reader state
  const [openChunkExplain, setOpenChunkExplain] = useState<Record<string, boolean>>({});
  const [openChunkRecall, setOpenChunkRecall] = useState<Record<string, boolean>>({});
  const [activeGlossary, setActiveGlossary] = useState<{ term: string; tamil?: string; meaning: string } | null>(null);

  // Stage 9: Can you explain it? self-check
  const [showExplainGuide, setShowExplainGuide] = useState(false);
  const [userEngaged, setUserEngaged] = useState(false);

  const uniqueTargets = Array.from(new Set(pkg.activeChallenge.items.map((it) => it.targetOrOrder)));

  const toggleListen = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text =
      depthLayer === 'simple'
        ? pkg.explain.simple
        : depthLayer === 'detailed'
          ? pkg.explain.detailed
          : pkg.explain.examReadyPoints.join('. ');
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const handleCheckChallenge = () => {
    setChallengeChecked(true);
    setUserEngaged(true);
    onMarkPractised();
    const allCorrect = pkg.activeChallenge.items.every(
      (it) => challengeAnswers[it.id] === it.targetOrOrder,
    );
    if (allCorrect) onMarkCompleted();
  };

  const allChallengeRight =
    challengeChecked &&
    pkg.activeChallenge.items.every((it) => challengeAnswers[it.id] === it.targetOrOrder);

  return (
    <div className="space-y-6">
      {/* STAGE 0: QUICK ORIENTATION & JUMP LINKS */}
      <div className="rounded-[20px] border border-[var(--primary)]/25 bg-[var(--info-bg)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--primary)]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pkg.estimatedMinutes} (self-paced)</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Book pp. {pkg.source.printedPages.join(', ')}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-[var(--ink)]">{pkg.goalOneLiner}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="#textbook-reading"
            className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)] hover:border-[var(--primary)] inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Jump to textbook</span>
          </a>
          <button
            type="button"
            onClick={onToggleReviewLater}
            aria-pressed={isReviewLater}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${
              isReviewLater
                ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-200'
                : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)]'
            }`}
          >
            <span>{isReviewLater ? '✓ Saved for review later' : 'Review later'}</span>
          </button>
        </div>
      </div>

      {/* STAGE 1: "EXPLAIN IT SIMPLY" — ELI5 FIRST */}
      <section
        aria-label="Explain it simply"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
              1. Understand Simply
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ink)] mt-0.5">
              {pkg.sectionNumber} {pkg.title.en}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <div
              role="group"
              aria-label="Choose explanation depth"
              className="inline-flex p-0.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]"
            >
              {(
                [
                  ['simple', 'Simple'],
                  ['detailed', 'Detailed'],
                  ['exam', 'Exam-ready'],
                ] as const
              ).map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDepthLayer(k)}
                  aria-pressed={depthLayer === k}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg font-bold ${
                    depthLayer === k ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink)]'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {pkg.explain.simpleTamil && (
              <button
                type="button"
                onClick={() => setShowTamil((t) => !t)}
                aria-pressed={showTamil}
                className={`px-3 py-1.5 min-h-[38px] rounded-xl border font-bold font-tamil ${
                  showTamil
                    ? 'bg-[var(--tamil)] text-white border-[var(--tamil)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                {showTamil ? '✓ தமிழ்' : 'தமிழ் விளக்கம்'}
              </button>
            )}

            <button
              type="button"
              onClick={toggleListen}
              aria-pressed={speaking}
              className="px-3 py-1.5 min-h-[38px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
            >
              {speaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--primary)]" />}
              <span>{speaking ? 'Stop audio' : 'Listen'}</span>
            </button>
          </div>
        </div>

        {/* Active Layer Text (Transcript always visible for accessibility!) */}
        <div className="max-w-3xl space-y-3">
          {depthLayer === 'simple' && (
            <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">{pkg.explain.simple}</p>
          )}
          {depthLayer === 'detailed' && (
            <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">{pkg.explain.detailed}</p>
          )}
          {depthLayer === 'exam' && (
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-[var(--ink)] leading-relaxed">
              {pkg.explain.examReadyPoints.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          )}

          {showTamil && pkg.explain.simpleTamil && (
            <div lang="ta" className="font-tamil p-4 rounded-2xl bg-rose-500/8 border border-rose-500/25 text-sm text-[var(--ink)] leading-relaxed">
              <div className="text-xs font-extrabold text-[var(--tamil)] mb-1">எளிய தமிழ் விளக்கம்</div>
              {pkg.explain.simpleTamil}
            </div>
          )}

          {/* Labelled Analogy + 1-Sentence Textbook-Standard Anchor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-[var(--ink)]">
              <div className="font-extrabold text-amber-800 dark:text-amber-300 uppercase text-[11px] mb-1">
                Everyday Analogy (Not literal history)
              </div>
              <p className="leading-relaxed">{pkg.explain.analogy}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs sm:text-sm text-[var(--ink)]">
              <div className="font-extrabold text-[var(--primary)] uppercase text-[11px] mb-1">
                Textbook-Standard Summary
              </div>
              <p className="leading-relaxed">{pkg.explain.textbookStandard}</p>
            </div>
          </div>

          {/* Collapsible Common Misconceptions Guard */}
          {pkg.explain.misconceptions.length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowMisconceptions((m) => !m)}
                aria-expanded={showMisconceptions}
                className="text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1 hover:underline"
              >
                {showMisconceptions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Common misconceptions to watch out for ({pkg.explain.misconceptions.length})</span>
              </button>
              {showMisconceptions && (
                <div className="mt-2.5 space-y-2">
                  {pkg.explain.misconceptions.map((mc) => (
                    <div key={mc.myth} className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs sm:text-sm space-y-1">
                      <div className="text-rose-700 dark:text-rose-300 font-bold">Common mix-up: {mc.myth}</div>
                      <div className="text-[var(--ink)]"><strong>Actual history:</strong> {mc.reality}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* STAGE 2: VISUAL CONCEPT / MIND MAP */}
      <SubsectionConceptMap
        title={pkg.conceptMap.title}
        nodes={pkg.conceptMap.nodes}
        edges={pkg.conceptMap.edges}
        textFallback={pkg.conceptMap.textFallback}
        onExploreNode={() => {
          setUserEngaged(true);
          onMarkPractised();
        }}
      />

      {/* STAGE 3: PURPOSE-BUILT 2D HISTORICAL INTERACTIVE */}
      <HistoryUnit4Interactive2D
        variant={pkg.interactive.variantKey}
        questionToInvestigate={pkg.interactive.questionToInvestigate}
        whatToNotice={pkg.interactive.whatToNotice}
        onExploreStep={() => {
          setUserEngaged(true);
          onMarkPractised();
        }}
        onFinishAllSteps={() => {
          setUserEngaged(true);
          onMarkPractised();
        }}
      />

      {/* STAGE 4: "WHY DID THAT HAPPEN?" — STEP-BY-STEP CAUSAL REVEAL */}
      <section
        aria-label="Why did that happen"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--social)]">
              4. Why Did That Happen? · Step-by-Step Reasoning
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[var(--ink)] mt-0.5">
              Trace Cause → Mechanism → Evidence → Consequence
            </h3>
          </div>
          <div className="flex gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setRevealedStep(pkg.stepByStep.length - 1)}
              className="px-3 py-1.5 min-h-[36px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] font-bold text-[var(--ink)]"
            >
              Show all steps
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {pkg.stepByStep.map((st, idx) => {
            const unlocked = idx <= revealedStep;
            return (
              <div
                key={st.stepNumber}
                className={`p-4 rounded-2xl border transition-colors ${
                  unlocked
                    ? 'border-[var(--line)] bg-[var(--surface-subtle)]'
                    : 'border-dashed border-[var(--line)] bg-[var(--canvas)] opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--social)]">
                    Step {st.stepNumber} · {st.phase}
                  </span>
                  {!unlocked && (
                    <button
                      type="button"
                      onClick={() => setRevealedStep(idx)}
                      className="px-3 py-1 rounded-lg bg-[var(--primary)] text-white text-xs font-bold"
                    >
                      Reveal step {st.stepNumber}
                    </button>
                  )}
                </div>
                {unlocked && (
                  <div className="mt-1.5 space-y-1.5">
                    <h4 className="text-sm sm:text-base font-extrabold text-[var(--ink)]">{st.heading}</h4>
                    <p className="text-sm text-[var(--text)] leading-relaxed">{st.explanation}</p>
                    {st.factVsInterpretationNote && (
                      <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)]">
                        <strong>Fact vs. Interpretation:</strong> {st.factVsInterpretationNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={revealedStep === 0}
            onClick={() => setRevealedStep((s) => Math.max(0, s - 1))}
            className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)] disabled:opacity-40"
          >
            ← Earlier step
          </button>
          <button
            type="button"
            disabled={revealedStep >= pkg.stepByStep.length - 1}
            onClick={() => setRevealedStep((s) => Math.min(pkg.stepByStep.length - 1, s + 1))}
            className="px-4 py-2 min-h-[40px] rounded-xl bg-[var(--primary)] text-white text-xs font-bold disabled:opacity-40"
          >
            Next causal step →
          </button>
        </div>
      </section>

      {/* STAGE 5: EASY-TO-REMEMBER LINKS */}
      <section
        aria-label="Easy to remember links"
        className="rounded-[22px] border border-amber-500/35 bg-amber-500/8 p-5 sm:p-6 space-y-3"
      >
        <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 inline-flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4" />
          <span>5. Remember Through Understanding</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pkg.memoryLinks.map((ml) => (
            <div key={ml.cue} className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
              <div className="text-[11px] font-extrabold uppercase text-[var(--primary)]">{ml.kind}</div>
              <div className="text-sm font-extrabold text-[var(--ink)]">{ml.cue}</div>
              <p className="text-xs text-[var(--text)] leading-relaxed">{ml.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STAGE 6: "YOU TRY" — LOW-STAKES ACTIVE CHALLENGE */}
      <section
        aria-label="Try it yourself challenge"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>6. Try It Yourself · Untimed Concept Challenge</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-[var(--ink)] mt-1">{pkg.activeChallenge.prompt}</p>
        </div>

        <div className="space-y-3">
          {pkg.activeChallenge.items.map((item) => {
            const picked = challengeAnswers[item.id] ?? '';
            const isRight = challengeChecked && picked === item.targetOrOrder;
            const isWrong = challengeChecked && picked !== item.targetOrOrder;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  isRight
                    ? 'border-[var(--success)] bg-[var(--success-bg)]'
                    : isWrong
                      ? 'border-[var(--warning)] bg-[var(--warning-bg)]'
                      : 'border-[var(--line)] bg-[var(--surface-subtle)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-sm font-bold text-[var(--ink)]">{item.label}</span>
                  <select
                    aria-label={`Select answer for ${item.label}`}
                    value={picked}
                    onChange={(e) => {
                      setChallengeAnswers((prev) => ({ ...prev, [item.id]: e.target.value }));
                      setChallengeChecked(false);
                    }}
                    className="min-h-[42px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs sm:text-sm font-semibold text-[var(--ink)]"
                  >
                    <option value="">Choose match / order…</option>
                    {uniqueTargets.map((opt) => (
                      <option key={opt} value={opt}>
                        {pkg.activeChallenge.kind === 'sequence' ? `Order #${opt}` : opt}
                      </option>
                    ))}
                  </select>
                </div>
                {challengeChecked && (
                  <p className="text-xs text-[var(--ink)]">
                    <strong>{isRight ? 'Good observation — ' : 'Look closely — '}</strong>
                    {item.whyFeedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCheckChallenge}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold"
          >
            Check my reasoning
          </button>
          {challengeChecked && (
            <span role="status" className="text-xs sm:text-sm font-bold text-[var(--ink)]">
              {allChallengeRight
                ? pkg.activeChallenge.successMessage
                : 'Review the quiet explanations above and adjust any choice — no timer or penalty.'}
            </span>
          )}
        </div>
      </section>

      {/* STAGE 7: OPTIONAL EXAM BRIDGE */}
      <section
        aria-label="Practise for exams"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            7. Practise for Exams (Optional · After Concept Understanding)
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Textbook exercise references and original practice are labelled separately. Practice builds confidence; it never predicts exact exam papers.
          </p>
        </div>

        <div className="space-y-4">
          {pkg.examBridge.map((ex) => {
            const picked = examAnswers[ex.id];
            const pickedOpt = ex.options?.find((o) => o.id === picked);
            return (
              <div key={ex.id} className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary-tint)] text-[var(--primary)]">
                    {ex.labelType} · {ex.format}
                  </span>
                  <span className="text-[var(--text-muted)]">{ex.sourceRef}</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[var(--ink)]">{ex.prompt}</p>

                {ex.options && (
                  <div className="space-y-2">
                    {ex.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setExamAnswers((prev) => ({ ...prev, [ex.id]: opt.id }));
                          setUserEngaged(true);
                          onMarkPractised();
                        }}
                        aria-pressed={picked === opt.id}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold ${
                          picked === opt.id
                            ? opt.isCorrect
                              ? 'border-[var(--success)] bg-[var(--success-bg)] text-[var(--ink)]'
                              : 'border-[var(--warning)] bg-[var(--warning-bg)] text-[var(--ink)]'
                            : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--primary)]'
                        }`}
                      >
                        <strong className="uppercase mr-2">{opt.id})</strong>
                        {opt.text}
                      </button>
                    ))}
                    {pickedOpt && (
                      <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)]">
                        <strong>{pickedOpt.isCorrect ? '✓ Good reasoning: ' : 'Check again: '}</strong>
                        {pickedOpt.why}
                      </div>
                    )}
                  </div>
                )}

                {ex.modelPoints && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setOpenModelPoints((p) => ({ ...p, [ex.id]: !p[ex.id] }))}
                      className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)]"
                    >
                      {openModelPoints[ex.id] ? 'Hide structured answer points' : 'View structured answer points'}
                    </button>
                    {openModelPoints[ex.id] && (
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--ink)] bg-[var(--surface)] p-3.5 rounded-xl border border-[var(--line)]">
                        {ex.modelPoints.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setOpenHints((h) => ({ ...h, [ex.id]: !h[ex.id] }))}
                  className="text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{openHints[ex.id] ? 'Hide hint' : 'Show hint'}</span>
                </button>
                {openHints[ex.id] && (
                  <p className="text-xs text-[var(--text)] bg-[var(--canvas)] p-2.5 rounded-lg border border-[var(--line)]">
                    <strong>Hint:</strong> {ex.hint}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* STAGE 8: READ THE BOOK, CHUNK BY CHUNK (RIGHTS-SAFE LOWER SECTION) */}
      <section
        id="textbook-reading"
        aria-label="Read the textbook chunk by chunk"
        className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>8. Read the Book, Chunk by Chunk</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[var(--ink)] mt-0.5">
              Structured Source Guide · Printed pp. {pkg.source.printedPages.join(', ')} (PDF pp. {pkg.source.pdfPages.join(', ')})
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Respecting TNSCERT copyright, each chunk presents an original section-ordered summary alongside official page references and bilingual glossary terms.
            </p>
          </div>
          <a
            href={pkg.source.officialPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Official TN Textbooks Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Active Glossary Popover Strip */}
        {activeGlossary && (
          <div className="p-3.5 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/30 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            <div>
              <strong className="text-[var(--ink)]">{activeGlossary.term}</strong>
              {activeGlossary.tamil && (
                <span lang="ta" className="font-tamil text-[var(--tamil)] font-bold ml-2">
                  ({activeGlossary.tamil})
                </span>
              )}
              <span className="text-[var(--text)]"> — {activeGlossary.meaning}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveGlossary(null)}
              className="text-xs font-bold text-[var(--primary)] underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-4 max-w-3xl">
          {pkg.readingChunks.map((chunk) => (
            <article
              key={chunk.id}
              className="p-4 sm:p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[var(--ink)]">{chunk.subheading}</h4>
                <span className="text-[11px] font-bold text-[var(--text-muted)] font-mono-tabular">
                  Book p. {chunk.printedPage} · PDF p. {chunk.pdfPage}
                </span>
              </div>

              <p className="text-sm text-[var(--ink)] leading-relaxed">{chunk.originalSummary}</p>

              <div className="p-3 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-xs sm:text-sm font-semibold text-[var(--ink)]">
                Key idea: {chunk.keySentenceHighlight}
              </div>

              {chunk.glossaryTerms.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-[var(--text-muted)]">Glossary:</span>
                  {chunk.glossaryTerms.map((g) => (
                    <button
                      key={g.term}
                      type="button"
                      onClick={() => setActiveGlossary(g)}
                      className="px-2.5 py-1 rounded-lg border border-[var(--primary)]/30 bg-[var(--surface)] font-bold text-[var(--primary)] hover:bg-[var(--primary-tint)]"
                    >
                      {g.term}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setOpenChunkExplain((p) => ({ ...p, [chunk.id]: !p[chunk.id] }))}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold text-[var(--ink)]"
                >
                  {openChunkExplain[chunk.id] ? 'Hide plain explanation' : 'Explain this chunk'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenChunkRecall((p) => ({ ...p, [chunk.id]: !p[chunk.id] }))}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold text-[var(--primary)]"
                >
                  {openChunkRecall[chunk.id] ? 'Hide recall check' : 'What did I just read?'}
                </button>
              </div>

              {openChunkExplain[chunk.id] && (
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--text)]">
                  <strong>Plain meaning:</strong> {chunk.plainExplanation}
                </div>
              )}

              {openChunkRecall[chunk.id] && (
                <div className="p-3 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/25 text-xs sm:text-sm text-[var(--ink)] space-y-1">
                  <div className="font-bold">{chunk.recallPrompt}</div>
                  <div><strong>Answer:</strong> {chunk.recallAnswer}</div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Rule A7: Clearly Labelled Updated / Historical Context Note */}
        {pkg.updatedContextNote && (
          <div className="p-4 rounded-2xl border border-sky-500/35 bg-sky-500/10 text-xs sm:text-sm space-y-1 max-w-3xl">
            <div className="font-extrabold text-sky-900 dark:text-sky-200">{pkg.updatedContextNote.label}</div>
            <p className="text-[var(--text)]"><strong>Textbook note:</strong> {pkg.updatedContextNote.textbookStatement}</p>
            <p className="text-[var(--ink)]"><strong>Updated context:</strong> {pkg.updatedContextNote.updatedContext}</p>
            <div className="text-[11px] text-[var(--text-muted)]">Source: {pkg.updatedContextNote.datedSource}</div>
          </div>
        )}
      </section>

      {/* STAGE 9: FINISH & NEXT */}
      <section
        aria-label="Finish and next subsection"
        className="rounded-[22px] border border-[var(--primary)]/35 bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
          9. Finish &amp; Continue
        </div>
        <p className="text-sm sm:text-base font-bold text-[var(--ink)] leading-relaxed">{pkg.finish.takeaway}</p>

        <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2">
          <div className="text-xs font-extrabold text-[var(--ink)]">Can you explain it in your own words?</div>
          <p className="text-sm text-[var(--text)]">{pkg.finish.canYouExplainPrompt}</p>
          <button
            type="button"
            onClick={() => {
              setShowExplainGuide((g) => !g);
              setUserEngaged(true);
            }}
            className="text-xs font-bold text-[var(--primary)] underline"
          >
            {showExplainGuide ? 'Hide sample explanation' : 'Compare with a sample explanation'}
          </button>
          {showExplainGuide && (
            <p className="text-xs sm:text-sm text-[var(--ink)] pt-1">{pkg.finish.canYouExplainGuide}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {prevRoute && (
              <Link
                to={prevRoute.to}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs sm:text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{prevRoute.label}</span>
              </Link>
            )}
            <button
              type="button"
              onClick={onMarkCompleted}
              disabled={!userEngaged && !isCompleted}
              title={
                !userEngaged && !isCompleted
                  ? 'Explore the interactive or check your reasoning first, or click again after interacting'
                  : 'Save this subsection as understood on this device'
              }
              className={`px-4 py-2.5 min-h-[44px] rounded-xl border text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)]'
                  : userEngaged
                    ? 'bg-[var(--science)] text-white border-[var(--science)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--line)] cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCompleted
                  ? 'Understood & saved locally'
                  : userEngaged
                    ? 'Mark as understood'
                    : 'Explore or try challenge to mark complete'}
              </span>
            </button>
          </div>

          {nextRoute && (
            <Link
              to={nextRoute.to}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
            >
              <span>Next: {nextRoute.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
