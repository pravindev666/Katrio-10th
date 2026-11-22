import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  Eye,
  HelpCircle,
  Layers,
  ListFilter,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { Breadcrumbs } from '../components/chrome/Breadcrumbs';
import { SourcePageDrawer } from '../components/curriculum/SourcePageDrawer';
import { ChapterMindMapCard } from '../components/curriculum/ChapterMindMapCard';
import { EngineShell } from '../components/engines/EngineShell';
import { VisualFlashcardDeck } from '../components/engines/VisualFlashcardDeck';
import {
  getSubjectBySlug,
  getSectionById,
  getStudentSectionStatus,
  getUnitCuriosityQuestion,
  formatSourceStatusLabel,
} from '../utils/curriculumStore';
import { getLessonContentBySectionId } from '../data/lesson_content';
import { getChapterConceptChecks } from '../data/chapterQuizzes';
import { useProgress } from '../features/local-progress/ProgressContext';
import { getSectionProgressStage } from '../features/local-progress/progressStore';
import { NotFoundPage } from './NotFoundPage';

type LessonStepId = 'explore' | 'understand' | 'try' | 'check';

interface LessonStepMeta {
  id: LessonStepId;
  stepNumber: number;
  label: string;
  subtitle: string;
}

const LESSON_STEPS: LessonStepMeta[] = [
  { id: 'explore', stepNumber: 1, label: 'Explore', subtitle: 'Guided visual model' },
  { id: 'understand', stepNumber: 2, label: 'Understand', subtitle: 'Concept & key terms' },
  { id: 'try', stepNumber: 3, label: 'Try it', subtitle: 'Open sandbox mode' },
  { id: 'check', stepNumber: 4, label: 'Check yourself', subtitle: 'Untimed concept check' },
];

const SUBJECT_PILOT_SUGGESTION: Record<string, { label: string; route: string }> = {
  science: {
    label: 'Science Unit 14: Structure of Human Heart (Pilot)',
    route: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
  },
  mathematics: {
    label: 'Maths Chapter 6: 6.3 Heights & Distances (Pilot)',
    route: '/class-10/mathematics/maths-06/maths-06-03',
  },
  english: {
    label: 'English Unit 1: His First Flight (Pilot)',
    route: '/class-10/english/english-01/english-01-prose',
  },
  tamil: {
    label: 'தமிழ் இயல் 4: மொழிபெயர்ப்புக் கல்வி (Pilot)',
    route: '/class-10/tamil/tamil-04/tamil-04-01',
  },
  social_science: {
    label: 'History Unit 1: Outbreak of World War I (Pilot)',
    route: '/class-10/social_science/social-history-01/social-history-01-auto-1-3-causes-course-and',
  },
};

export function SectionPlayerPage() {
  const {
    subject = '',
    unitId = '',
    sectionId = '',
  } = useParams<{ subject: string; unitId: string; sectionId: string }>();

  const subjectMeta = getSubjectBySlug(subject);
  const resolved = getSectionById(subject, unitId, sectionId);
  const {
    record,
    preferences,
    updatePreferences,
    markSectionVisited,
    markSectionPractised,
    markDemoCompleted,
    recordQuizCheckpoint,
    toggleBookmarkSection,
  } = useProgress();

  const [activeStep, setActiveStep] = useState<LessonStepId>('explore');
  // Default chapter outline collapsed on desktop so the 3D/interactive lab owns the full viewport without crowding!
  const [outlineOpenDesktop, setOutlineOpenDesktop] = useState(false);
  const [outlineDrawerMobile, setOutlineDrawerMobile] = useState(false);
  const [showReviewSubtopicsInOutline, setShowReviewSubtopicsInOutline] = useState(false);
  const [extraToolOpen, setExtraToolOpen] = useState<'none' | 'flashcards' | 'summary'>('none');
  const [sourceDetailsOpen, setSourceDetailsOpen] = useState(false);

  // Multi-question untimed concept check state (only active when real LessonContentPackage exists!)
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showCheckHint, setShowCheckHint] = useState(false);

  const tabRefs = useRef<Record<LessonStepId, HTMLButtonElement | null>>({
    explore: null,
    understand: null,
    try: null,
    check: null,
  });

  useEffect(() => {
    if (resolved) {
      markSectionVisited(resolved.section.id, resolved.section.route, {
        title: `${resolved.section.section_number} ${resolved.section.title}`,
        unitTitle: `${resolved.unit.code_label}: ${resolved.unit.title}`,
        step: 'Explore',
      });
      setActiveStep('explore');
      setActiveQuestionIdx(0);
      setSelectedAnswers({});
      setShowCheckHint(false);
      setOutlineDrawerMobile(false);
    }
  }, [resolved?.section.id, resolved?.section.route, markSectionVisited]);

  if (!subjectMeta || !resolved) {
    return <NotFoundPage />;
  }

  const { unit, section, prevSection, nextSection, nextVerifiedSection } = resolved;
  const lessonPkg = getLessonContentBySectionId(section.id);
  const studentStatus = getStudentSectionStatus(section);
  const sourceStatusMeta = formatSourceStatusLabel(section.source_status);
  const isUnderReview = section.source_status === 'auto_extracted_review_required';
  const isBookmarked = record.bookmarkedSections.includes(section.id);
  const progressStage = getSectionProgressStage(record, section.id);
  const curiosityQuestion = lessonPkg?.curiosity_hook ?? getUnitCuriosityQuestion(unit);

  const verifiedSections = unit.sections.filter(
    (s) => s.source_status !== 'auto_extracted_review_required',
  );
  const reviewSections = unit.sections.filter(
    (s) => s.source_status === 'auto_extracted_review_required',
  );
  const reviewOutlineExpanded =
    showReviewSubtopicsInOutline || isUnderReview || verifiedSections.length === 0;

  const breadcrumbs: { label: string; to?: string; lang?: string }[] = [
    { label: 'Class 10', to: '/class-10' },
    {
      label: subjectMeta.title,
      to: `/class-10/${subjectMeta.slug}`,
      lang: subjectMeta.slug === 'tamil' ? 'ta' : undefined,
    },
  ];
  if (unit.strand) {
    const strandObj = subjectMeta.strands?.find((s) => s.slug === unit.strand);
    breadcrumbs.push({
      label: strandObj?.title ?? unit.strand,
      to: `/class-10/social_science/${unit.strand}`,
    });
  }
  breadcrumbs.push({
    label: `${unit.code_label}: ${unit.title}`,
    to: unit.route,
    lang: unit.subject === 'tamil' ? 'ta' : undefined,
  });
  breadcrumbs.push({
    label: `${section.section_number} ${section.title}`,
    lang: unit.subject === 'tamil' ? 'ta' : undefined,
  });

  const handleStepSelect = (stepId: LessonStepId, focusElement = false) => {
    setActiveStep(stepId);
    const stepCap =
      stepId === 'explore'
        ? 'Explore'
        : stepId === 'understand'
          ? 'Understand'
          : stepId === 'try'
            ? 'Try'
            : 'Check';
    markSectionVisited(section.id, section.route, {
      title: `${section.section_number} ${section.title}`,
      unitTitle: `${unit.code_label}: ${unit.title}`,
      step: stepCap,
    });
    if (stepId === 'try' || stepId === 'understand') {
      markSectionPractised(section.id);
    }
    if (focusElement) {
      tabRefs.current[stepId]?.focus();
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = LESSON_STEPS.length;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % count;
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + count) % count;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = count - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      handleStepSelect(LESSON_STEPS[nextIndex].id, true);
    }
  };

  const questionBank =
    lessonPkg?.assessment.question_bank ??
    getChapterConceptChecks(
      unit.id,
      unit.title,
      section.section_number,
      section.title,
      section.printed_page,
    );
  const activeQuestion = questionBank[activeQuestionIdx];
  const selectedOptId = activeQuestion ? selectedAnswers[activeQuestion.id] : undefined;
  const selectedOption = activeQuestion?.options.find((o) => o.id === selectedOptId);

  const handleSelectAnswer = (qId: string, optionId: string) => {
    const next = { ...selectedAnswers, [qId]: optionId };
    setSelectedAnswers(next);
    markSectionPractised(section.id);

    const correctCount = questionBank.reduce((acc, q) => {
      const picked = next[q.id];
      const ok = q.options.some((o) => o.id === picked && o.is_correct);
      return acc + (ok ? 1 : 0);
    }, 0);

    if (correctCount > 0) {
      recordQuizCheckpoint(section.id, correctCount, questionBank.length);
      if (correctCount === questionBank.length) {
        markDemoCompleted(section.id);
      }
    }
  };

  const progressBadge =
    progressStage === 'completed'
      ? {
        label: 'Completed',
        className: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/30',
      }
      : progressStage === 'practised'
        ? {
          label: 'Practised',
          className: 'bg-[var(--info-bg)] text-[var(--primary)] border-[var(--primary)]/30',
        }
        : {
          label: 'Started',
          className: 'bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--line)]',
        };

  const showSidebarDesktop = !preferences.focusMode && outlineOpenDesktop;

  const renderSidebarLinks = (closeOnClick = false) => (
    <nav aria-label="Chapter sections" className="space-y-1">
      {verifiedSections.map((sec) => {
        const isCurrent = sec.id === section.id;
        const secStage = getSectionProgressStage(record, sec.id);
        return (
          <Link
            key={sec.id}
            to={sec.route}
            onClick={closeOnClick ? () => setOutlineDrawerMobile(false) : undefined}
            aria-current={isCurrent ? 'page' : undefined}
            className={`block px-3 py-2.5 rounded-xl text-xs transition-colors ${isCurrent
              ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
              : 'text-[var(--text)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]'
              }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                lang={unit.subject === 'tamil' ? 'ta' : undefined}
                className={`leading-snug ${unit.subject === 'tamil' ? 'font-tamil' : ''}`}
              >
                {sec.section_number} {sec.title}
              </span>
              {secStage === 'completed' && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCurrent ? 'text-white' : 'text-[var(--success)]'
                    }`}
                />
              )}
            </div>
            <div
              className={`text-[11px] mt-0.5 ${isCurrent ? 'text-white/85' : 'text-[var(--text-muted)]'
                }`}
            >
              p. {sec.printed_page} · {sec.lesson_content_id ? 'Pilot ready' : 'TOC verified'}
            </div>
          </Link>
        );
      })}

      {reviewSections.length > 0 && (
        <div className={verifiedSections.length > 0 ? 'pt-2 mt-2 border-t border-[var(--line)]' : ''}>
          {verifiedSections.length > 0 && (
            <button
              type="button"
              onClick={() => setShowReviewSubtopicsInOutline((v) => !v)}
              aria-expanded={reviewOutlineExpanded}
              className="w-full px-2 py-1.5 text-left text-xs font-bold text-[var(--text-muted)] hover:text-[var(--ink)] flex items-center justify-between gap-1"
            >
              <span>Subheadings in audit ({reviewSections.length})</span>
              {reviewOutlineExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              )}
            </button>
          )}

          {reviewOutlineExpanded && (
            <div className="space-y-1 mt-1">
              {reviewSections.map((sec) => {
                const isCurrent = sec.id === section.id;
                return (
                  <Link
                    key={sec.id}
                    to={sec.route}
                    onClick={closeOnClick ? () => setOutlineDrawerMobile(false) : undefined}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`block px-3 py-2 rounded-lg text-xs transition-colors ${isCurrent
                      ? 'bg-[var(--primary)] text-white font-bold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]'
                      }`}
                  >
                    <div
                      lang={unit.subject === 'tamil' ? 'ta' : undefined}
                      className={unit.subject === 'tamil' ? 'font-tamil' : ''}
                    >
                      {sec.section_number} {sec.title}
                    </div>
                    <div
                      className={`text-[10px] ${isCurrent ? 'text-white/80' : 'text-[var(--text-muted)]'
                        }`}
                    >
                      p. {sec.printed_page} ·{' '}
                      {sec.lesson_content_id ? '★ Pilot ready' : 'Awaiting editorial review'}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 pb-14 space-y-4">
      <Breadcrumbs items={breadcrumbs} />

      {/* Streamlined, Airy Single-Card Lesson Header (Puts Interactive 3D Lab Immediately Above the Fold!) */}
      <header className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 sm:px-5 sm:py-4 shadow-[var(--shadow-card)] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <Link
                to={unit.route}
                lang={unit.subject === 'tamil' ? 'ta' : undefined}
                className={`font-bold text-[var(--primary)] hover:underline ${unit.subject === 'tamil' ? 'font-tamil' : ''}`}
              >
                {unit.code_label} · {unit.title}
              </Link>
              <span aria-hidden="true">·</span>
              <span>p. {section.printed_page}</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${progressBadge.className}`}>
                {progressBadge.label}
              </span>
              {isUnderReview && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/30">
                  {sourceStatusMeta.shortLabel}
                </span>
              )}
            </div>

            <h1
              lang={unit.subject === 'tamil' ? 'ta' : undefined}
              className={`text-xl sm:text-2xl font-extrabold text-[var(--ink)] tracking-tight leading-snug ${unit.subject === 'tamil' ? 'font-tamil' : ''}`}
            >
              {section.section_number} {section.title}
            </h1>
            <p
              lang={unit.subject === 'tamil' ? 'ta' : undefined}
              className={`text-xs sm:text-sm text-[var(--text-muted)] ${unit.subject === 'tamil' ? 'font-tamil' : ''}`}
            >
              {curiosityQuestion}
            </p>
          </div>

          {/* Crisp Compact Player Controls */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setOutlineDrawerMobile(true)}
              className="lg:hidden min-h-[36px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
            >
              <ListFilter className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Topics ({unit.sections.length})</span>
            </button>

            {!preferences.focusMode && (
              <button
                type="button"
                onClick={() => setOutlineOpenDesktop((o) => !o)}
                aria-pressed={outlineOpenDesktop}
                className={`hidden lg:inline-flex min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold items-center gap-1.5 transition-colors ${outlineOpenDesktop
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                  }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>{outlineOpenDesktop ? 'Hide topics' : `Chapter topics (${unit.sections.length})`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => updatePreferences({ prefer2DPathway: !preferences.prefer2DPathway })}
              aria-pressed={preferences.prefer2DPathway}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${preferences.prefer2DPathway
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2D view</span>
            </button>

            <button
              type="button"
              onClick={() => updatePreferences({ focusMode: !preferences.focusMode })}
              aria-pressed={preferences.focusMode}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${preferences.focusMode
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
            >
              {preferences.focusMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit focus</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Focus</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleBookmarkSection(section.id)}
              aria-pressed={isBookmarked}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${isBookmarked
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Clean Single-Row 4-Step Pill Tabs + Prev/Next Topic */}
        <div className="pt-2.5 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div
            role="tablist"
            aria-label="Lesson learning steps"
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 flex-1"
          >
            {LESSON_STEPS.map((step, idx) => {
              const isSelected = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  ref={(el) => {
                    tabRefs.current[step.id] = el;
                  }}
                  id={`lesson-tab-${step.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`lesson-panel-${step.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleStepSelect(step.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl border text-left transition-all flex items-center gap-2 ${isSelected
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-extrabold inline-flex items-center justify-center shrink-0 ${isSelected
                      ? 'bg-white text-[var(--primary)]'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--line)]'
                      }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold leading-tight">{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {prevSection && (
              <Link
                to={prevSection.route}
                className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Link>
            )}
            {nextSection && (
              <Link
                to={nextSection.route}
                className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Chapter Outline Drawer */}
      {outlineDrawerMobile && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOutlineDrawerMobile(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chapter outline"
            className="w-full max-w-xs bg-[var(--surface)] h-full p-5 overflow-y-auto space-y-4 border-r border-[var(--line)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <Link
                  to={unit.route}
                  onClick={() => setOutlineDrawerMobile(false)}
                  className="text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  ← Back to {unit.code_label}
                </Link>
                <h2
                  lang={unit.subject === 'tamil' ? 'ta' : undefined}
                  className={`text-sm font-extrabold text-[var(--ink)] mt-0.5 ${unit.subject === 'tamil' ? 'font-tamil' : ''
                    }`}
                >
                  {unit.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOutlineDrawerMobile(false)}
                aria-label="Close chapter outline"
                className="p-2 rounded-xl border border-[var(--line)] text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderSidebarLinks(true)}
          </div>
        </div>
      )}

      {/* Main 2-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {showSidebarDesktop && (
          <aside
            aria-label="Chapter outline"
            className="hidden lg:block lg:col-span-3 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            <div className="pb-2.5 border-b border-[var(--line)]">
              <Link
                to={unit.route}
                className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{unit.code_label} overview</span>
              </Link>
              <h2
                lang={unit.subject === 'tamil' ? 'ta' : undefined}
                className={`text-sm font-extrabold text-[var(--ink)] mt-1 ${unit.subject === 'tamil' ? 'font-tamil' : ''
                  }`}
              >
                {unit.title}
              </h2>
            </div>
            {renderSidebarLinks(false)}
          </aside>
        )}

        <div className={`${showSidebarDesktop ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
          <div
            id={`lesson-panel-${activeStep}`}
            role="tabpanel"
            aria-labelledby={`lesson-tab-${activeStep}`}
            className="space-y-5"
          >
            {/* STEP 1: EXPLORE — Interactive Lab Immediately Front & Center! */}
            {activeStep === 'explore' && (
              <div className="space-y-4">
                <EngineShell
                  key={`${section.id}-explore-${section.activity_template}`}
                  engine={section.activity_template}
                  sectionId={section.id}
                  sectionTitle={`${section.section_number} ${section.title}`}
                  unitTitle={`${unit.code_label}: ${unit.title}`}
                  printedPage={section.printed_page}
                  representationStatus={section.representation_status}
                  accessibilityFallbackText={section.accessibility_fallback}
                  lesson={lessonPkg}
                  defaultMode={lessonPkg ? 'demo' : 'scaffold'}
                  hasPilotDemo={Boolean(lessonPkg)}
                  unitRoute={unit.route}
                  isUnderReview={isUnderReview}
                />

                {/* Interactive Chapter Mind Map & Memory Trick right below the 3D/2D lab for fast recall! */}
                <ChapterMindMapCard
                  unitId={unit.id}
                  unitTitle={`${unit.code_label}: ${unit.title}`}
                  isTamil={unit.subject === 'tamil'}
                />
              </div>
            )}

            {/* STEP 2: UNDERSTAND */}
            {activeStep === 'understand' && (
              <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-[var(--shadow-card)]">
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                    Step 2 · Understand the Core Idea
                  </div>
                  <h2
                    lang={unit.subject === 'tamil' ? 'ta' : undefined}
                    className={`text-xl sm:text-2xl font-extrabold text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                      }`}
                  >
                    {lessonPkg ? lessonPkg.title : `${section.title} (${unit.title})`}
                  </h2>
                </div>

                {/* Universal Interactive Chapter Mind Map & Fast Memory Studio (ALL 72 Chapters!) */}
                <ChapterMindMapCard
                  unitId={unit.id}
                  unitTitle={`${unit.code_label}: ${unit.title}`}
                  isTamil={unit.subject === 'tamil'}
                />

                {lessonPkg ? (
                  <>
                    {/* Learning Objectives */}
                    <div className="rounded-2xl border border-[var(--primary)]/25 bg-[var(--info-bg)] p-5 space-y-2">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
                        Learning Objectives (Textbook pp. {lessonPkg.source_printed_pages.join(', ')})
                      </div>
                      <ul
                        lang={unit.subject === 'tamil' ? 'ta' : undefined}
                        className={`list-disc pl-5 space-y-1.5 text-sm text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                          }`}
                      >
                        {lessonPkg.learning_objectives.map((obj) => (
                          <li key={obj}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Concept Outline Blocks */}
                    <div className="space-y-4">
                      {lessonPkg.concept_outline.map((block) => (
                        <div
                          key={block.heading}
                          lang={unit.subject === 'tamil' ? 'ta' : undefined}
                          className={`rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-5 space-y-2 ${unit.subject === 'tamil' ? 'font-tamil' : ''
                            }`}
                        >
                          <h3 className="text-base font-extrabold text-[var(--ink)]">
                            {block.heading}
                          </h3>
                          <p className="text-sm text-[var(--text)] leading-relaxed">
                            {block.summary}
                          </p>
                          {block.worked_example && (
                            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--ink)]">
                              <strong>Worked Example / Evidence:</strong> {block.worked_example}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Key Terms Glossary */}
                    <div className="space-y-2.5">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--ink)]">
                        Key Terminology
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lessonPkg.key_terms.map((kt) => (
                          <div
                            key={kt.term}
                            lang={unit.subject === 'tamil' ? 'ta' : undefined}
                            className={`p-4 rounded-xl border border-[var(--line)] bg-[var(--canvas)] space-y-1 text-sm ${unit.subject === 'tamil' ? 'font-tamil' : ''
                              }`}
                          >
                            <div className="font-extrabold text-[var(--ink)]">{kt.term}</div>
                            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                              {kt.definition}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-5 space-y-2.5">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
                        Subtopic Study Focus · {section.section_number} {section.title} (Book p. {section.printed_page})
                      </div>
                      <p className="text-sm text-[var(--ink)] leading-relaxed font-medium">
                        {section.learning_goal_placeholder}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        <strong>Accessible 2D / Text Guide:</strong> {section.accessibility_fallback}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-4 text-xs sm:text-sm text-[var(--text)]">
                      Anchored directly to <strong className="text-[var(--ink)]">{unit.book}</strong> (
                      {unit.edition}), printed p. <strong>{section.printed_page}</strong> (PDF p.{' '}
                      <strong>{section.pdf_page}</strong>). Click any node on the Mind Map above or jump straight to{' '}
                      <strong>Step 4: Check yourself</strong> to test your recall!
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStepSelect('explore')}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs sm:text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Explore</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepSelect('try')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2"
                  >
                    <span>Step 3: Try it yourself</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TRY IT */}
            {activeStep === 'try' && (
              <div className="space-y-4">
                <div className="rounded-[20px] border border-[var(--primary)]/30 bg-[var(--info-bg)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Step 3 · Free Exploration</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-[var(--ink)]">
                      {lessonPkg
                        ? 'Manipulate the variables, test edge cases, or complete the built-in interactive task below before checking your understanding.'
                        : 'Try the general subject engine preview or switch to the 2D/Text view while this topic’s custom lab is prepared.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStepSelect('check')}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                  >
                    <span>Step 4: Check yourself</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <EngineShell
                  key={`${section.id}-try-${section.activity_template}`}
                  engine={section.activity_template}
                  sectionId={section.id}
                  sectionTitle={`${section.section_number} ${section.title}`}
                  unitTitle={`${unit.code_label}: ${unit.title}`}
                  printedPage={section.printed_page}
                  representationStatus={section.representation_status}
                  accessibilityFallbackText={section.accessibility_fallback}
                  lesson={lessonPkg}
                  defaultMode={lessonPkg ? 'demo' : 'scaffold'}
                  hasPilotDemo={Boolean(lessonPkg)}
                  unitRoute={unit.route}
                  isUnderReview={isUnderReview}
                />

                {/* Interactive Chapter Mind Map & Memory Trick right below the 3D/2D lab for fast recall! */}
                <ChapterMindMapCard
                  unitId={unit.id}
                  unitTitle={`${unit.code_label}: ${unit.title}`}
                  isTamil={unit.subject === 'tamil'}
                />
              </div>
            )}

            {/* STEP 4: CHECK YOURSELF (Verified Multi-Question Concept Checks across ALL 72 Chapters & 691 Subtopics!) */}
            {activeStep === 'check' && (
              <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-[var(--shadow-card)]">
                {activeQuestion ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                          Step 4 · Untimed Concept Check · Question {activeQuestionIdx + 1} of{' '}
                          {questionBank.length}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--ink)] mt-0.5">
                          Check your understanding
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {questionBank.map((q, idx) => {
                          const picked = selectedAnswers[q.id];
                          const solved = q.options.some((o) => o.id === picked && o.is_correct);
                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => {
                                setActiveQuestionIdx(idx);
                                setShowCheckHint(false);
                              }}
                              aria-pressed={activeQuestionIdx === idx}
                              className={`min-w-[38px] min-h-[38px] px-2.5 rounded-lg border text-xs font-bold ${activeQuestionIdx === idx
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : solved
                                  ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/40'
                                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                                }`}
                            >
                              {solved ? '✓ ' : ''}Q{idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p
                      lang={unit.subject === 'tamil' ? 'ta' : undefined}
                      className={`text-base sm:text-lg font-bold text-[var(--ink)] leading-relaxed ${unit.subject === 'tamil' ? 'font-tamil' : ''
                        }`}
                    >
                      {activeQuestion.prompt}
                    </p>

                    <div className="space-y-3" role="radiogroup" aria-label="Concept check options">
                      {activeQuestion.options.map((opt) => {
                        const isSelected = selectedOptId === opt.id;
                        let borderStyle =
                          'border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)]';
                        if (isSelected) {
                          borderStyle = opt.is_correct
                            ? 'border-[var(--success)] bg-[var(--success-bg)]'
                            : 'border-[var(--warning)] bg-[var(--warning-bg)]';
                        }
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectAnswer(activeQuestion.id, opt.id)}
                            aria-pressed={isSelected}
                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${borderStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs font-extrabold text-[var(--ink)] inline-flex items-center justify-center shrink-0 mt-0.5 uppercase">
                              {opt.id}
                            </span>
                            <span
                              lang={unit.subject === 'tamil' ? 'ta' : undefined}
                              className={`text-sm sm:text-base font-semibold text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                                }`}
                            >
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCheckHint((h) => !h)}
                        aria-expanded={showCheckHint}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-4 h-4 text-[var(--primary)]" />
                        <span>{showCheckHint ? 'Hide hint' : 'Need a hint?'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2">
                        {activeQuestionIdx < questionBank.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveQuestionIdx((i) => i + 1);
                              setShowCheckHint(false);
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2"
                          >
                            <span>Next Question (Q{activeQuestionIdx + 2})</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {nextVerifiedSection && (
                          <Link
                            to={nextVerifiedSection.route}
                            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                          >
                            <span>Next topic: {nextVerifiedSection.section_number}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {showCheckHint && (
                      <div
                        lang={unit.subject === 'tamil' ? 'ta' : undefined}
                        className={`p-4 rounded-xl bg-[var(--warning-bg)] border border-[var(--warning)]/30 text-xs sm:text-sm text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                          }`}
                      >
                        <strong>Hint:</strong> {activeQuestion.hint}
                      </div>
                    )}

                    {selectedOption && (
                      <div
                        role="status"
                        lang={unit.subject === 'tamil' ? 'ta' : undefined}
                        className={`p-4 rounded-2xl border text-sm space-y-1.5 ${unit.subject === 'tamil' ? 'font-tamil' : ''
                          } ${selectedOption.is_correct
                            ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
                            : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'
                          }`}
                      >
                        <div className="font-extrabold">
                          {selectedOption.is_correct
                            ? '✓ Correct! Great conceptual reasoning.'
                            : 'Not quite — inspect the explanation and try another choice.'}
                        </div>
                        <p>{selectedOption.feedback}</p>
                        <p className="text-xs text-[var(--text-muted)] pt-1">
                          <strong>Worked basis:</strong> {activeQuestion.worked_explanation}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  /* HONEST PLANNED STATE — ZERO OFF-TOPIC OR FAKE QUIZZES */
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Step 4 · Concept Check — Planned
                    </div>
                    <h2 className="text-xl font-extrabold text-[var(--ink)]">
                      Topic-specific concept check is in preparation
                    </h2>
                    <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
                      We are authoring verified, textbook-aligned questions for{' '}
                      <strong>{section.title}</strong> ({unit.code_label}, p. {section.printed_page}).
                      To protect learning accuracy, Katrio never substitutes unrelated questions from
                      other chapters.
                    </p>
                    {SUBJECT_PILOT_SUGGESTION[unit.subject] && (
                      <div className="pt-2 flex flex-wrap gap-3">
                        <Link
                          to={SUBJECT_PILOT_SUGGESTION[unit.subject].route}
                          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2"
                        >
                          <span>Try live {subjectMeta.title} pilot check</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to={unit.route}
                          className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs sm:text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to {unit.code_label}</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Optional Study Tools Below (Flashcards & Recap) */}
          {lessonPkg && (
            <section
              aria-label="Additional study tools"
              className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-[var(--ink)]">
                    Practice flashcards &amp; one-page recap
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                    {lessonPkg.flashcards.length} topic-specific flashcards and key takeaways for this pilot lesson.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExtraToolOpen((cur) => (cur === 'flashcards' ? 'none' : 'flashcards'))
                    }
                    aria-expanded={extraToolOpen === 'flashcards'}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${extraToolOpen === 'flashcards'
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                      }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Flashcards ({lessonPkg.flashcards.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setExtraToolOpen((cur) => (cur === 'summary' ? 'none' : 'summary'))
                    }
                    aria-expanded={extraToolOpen === 'summary'}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${extraToolOpen === 'summary'
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                      }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Quick recap &amp; limitations</span>
                  </button>
                </div>
              </div>

              {extraToolOpen === 'flashcards' && (
                <div className="pt-4 border-t border-[var(--line)]">
                  <VisualFlashcardDeck
                    cards={lessonPkg.flashcards}
                    subjectHint={unit.subject}
                    lessonTitleHint={lessonPkg.title}
                    compact
                  />
                </div>
              )}

              {extraToolOpen === 'summary' && (
                <div className="pt-3 border-t border-[var(--line)] space-y-3 text-sm">
                  <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2">
                    <div className="font-bold text-[var(--ink)]">
                      Key Takeaways · {lessonPkg.title}
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--text)]">
                      {lessonPkg.assessment.worked_feedback.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--canvas)] border border-[var(--line)] space-y-1 text-xs text-[var(--text-muted)]">
                    <div className="font-bold text-[var(--ink)]">Model Scope &amp; Limitations</div>
                    {lessonPkg.interaction.limitations.map((lim) => (
                      <p key={lim}>• {lim}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Editorial Provenance & Source Page Drawer Disclosure */}
          <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <button
              type="button"
              onClick={() => setSourceDetailsOpen((o) => !o)}
              aria-expanded={sourceDetailsOpen}
              className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-[var(--surface-subtle)] transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold text-[var(--text-muted)] inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                <span>
                  Textbook provenance, Pass 0 audit &amp; page reference (p. {section.printed_page})
                </span>
              </span>
              {sourceDetailsOpen ? (
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>

            {sourceDetailsOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-[var(--line)] space-y-3 text-xs text-[var(--text-muted)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="text-[var(--ink)]">Textbook:</strong> {unit.book} (
                    {unit.edition}) · Printed page {section.printed_page} (PDF page{' '}
                    {section.pdf_page}) · Canonical ID:{' '}
                    <code className="font-mono-tabular">{section.id}</code>
                  </div>
                  <SourcePageDrawer unit={unit} />
                </div>
                {section.original_extracted_title && (
                  <p>
                    <strong className="text-[var(--ink)]">Pass 0 PDF Heading Recovery:</strong>{' '}
                    Recovered full heading from PDF (original raw extract:{' '}
                    <em>&ldquo;{section.original_extracted_title}&rdquo;</em>).{' '}
                    {section.pass0_audit_note}
                  </p>
                )}
                {lessonPkg && (
                  <p>
                    <strong className="text-[var(--ink)]">Editorial Gate:</strong> Status{' '}
                    <code>{lessonPkg.editorial_status}</code> · Verified by{' '}
                    {lessonPkg.source_verified_by} · Subject review:{' '}
                    {lessonPkg.subject_review_passed ? 'Passed' : 'Pending human educator sign-off'}{' '}
                    · Rights review: {lessonPkg.rights_reviewed ? 'Cleared' : 'Pending'}
                  </p>
                )}
                <p>
                  <strong className="text-[var(--ink)]">Visual representation:</strong>{' '}
                  {section.representation_status}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
