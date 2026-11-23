import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  Eye,
  HelpCircle,
  Layers,
  Lightbulb,
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
import { UnifiedSubsectionPlayer } from '../components/curriculum/UnifiedSubsectionPlayer';
import { ConceptFirstLessonPlayer } from '../components/curriculum/ConceptFirstLessonPlayer';
import { EngineShell } from '../components/engines/EngineShell';
import { VisualFlashcardDeck } from '../components/engines/VisualFlashcardDeck';
import {
  getSubjectBySlug,
  getSectionById,
  getUnitCuriosityQuestion,
  formatSourceStatusLabel,
} from '../utils/curriculumStore';
import { getLessonContentBySectionId } from '../data/lesson_content';
import { getSubsectionLessonById } from '../data/history_unit4_index';
import { getExactLessonExperienceById } from '../data/exactSectionManifest';
import { getChapterConceptChecks } from '../data/chapterQuizzes';
import { getChapterMindMap } from '../data/chapterMindMaps';
import { useProgress } from '../features/local-progress/ProgressContext';
import { getSectionProgressStage } from '../features/local-progress/progressStore';
import { NotFoundPage } from './NotFoundPage';

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
    markSectionExplored,
    markSectionPractised,
    markDemoCompleted,
    markUnderstoodCheckpoint,
    recordQuizCheckpoint,
    toggleBookmarkSection,
  } = useProgress();

  // Default chapter outline collapsed on desktop so the Concept-First stage owns full width without crowding!
  const [outlineOpenDesktop, setOutlineOpenDesktop] = useState(false);
  const [outlineDrawerMobile, setOutlineDrawerMobile] = useState(false);
  const [showReviewSubtopicsInOutline, setShowReviewSubtopicsInOutline] = useState(false);
  const [sourceDetailsOpen, setSourceDetailsOpen] = useState(false);

  // Unified Concept-First Explain depth + Tamil help state (for ALL 694 routes!)
  const [explainDepth, setExplainDepth] = useState<'simple' | 'exam'>('simple');
  const [showTamilHelp, setShowTamilHelp] = useState(false);

  // Untimed concept check state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showCheckHint, setShowCheckHint] = useState(false);

  useEffect(() => {
    if (resolved) {
      markSectionVisited(resolved.section.id, resolved.section.route, {
        title: `${resolved.section.section_number} ${resolved.section.title}`,
        unitTitle: `${resolved.unit.code_label}: ${resolved.unit.title}`,
        step: 'Explore',
      });
      setExplainDepth('simple');
      setShowTamilHelp(false);
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
  const conceptFirstSpec = getExactLessonExperienceById(section.id);
  const unifiedLesson = getSubsectionLessonById(section.id);
  const hasCustomConceptPlayer = Boolean(conceptFirstSpec || unifiedLesson);
  const lessonPkg = getLessonContentBySectionId(section.id);
  const chapterMindMap = getChapterMindMap(unit.id);
  const sourceStatusMeta = formatSourceStatusLabel(section.source_status);
  const isUnderReview = section.source_status === 'auto_extracted_review_required';
  const isBookmarked = record.bookmarkedSections.includes(section.id);
  const progressStage = getSectionProgressStage(record, section.id);
  const isTamil = unit.subject === 'tamil';
  const isEnglish = unit.subject === 'english';

  const curiosityQuestion =
    conceptFirstSpec?.spark.question ??
    unifiedLesson?.goalOneLiner ??
    lessonPkg?.curiosity_hook ??
    getUnitCuriosityQuestion(unit);

  // Subject-intuitive 7-Stage Jump Navigation (mirrors 17.8 Gametogenesis across ALL 694 routes!)
  const jumpLinks = isTamil
    ? [
        { id: 'u-explain', label: '1. எளிய விளக்கம்' },
        { id: 'u-mindmap', label: '2. மனவரைபடம்' },
        { id: 'u-lab', label: '3. மொழிப் பயிற்சி' },
        { id: 'u-why', label: '4. முக்கியக் குறிப்புகள்' },
        { id: 'u-check', label: '5. சுயமதிப்பீடு' },
        { id: 'u-flashcards', label: '6. நினைவு அட்டைகள்' },
        { id: 'u-textbook', label: '7. பாடநூல்' },
      ]
    : isEnglish
      ? [
          { id: 'u-explain', label: '1. Overview & Theme' },
          { id: 'u-mindmap', label: '2. Mind Map' },
          { id: 'u-lab', label: '3. Language Studio' },
          { id: 'u-why', label: '4. Craft & Vocabulary' },
          { id: 'u-check', label: '5. Practice Check' },
          { id: 'u-flashcards', label: '6. Flashcards' },
          { id: 'u-textbook', label: '7. Textbook' },
        ]
      : [
          { id: 'u-explain', label: '1. Explain' },
          { id: 'u-mindmap', label: '2. Mind Map' },
          { id: 'u-lab', label: '3. Interactive Lab' },
          { id: 'u-why', label: '4. Key Ideas' },
          { id: 'u-check', label: '5. Solve & Check' },
          { id: 'u-flashcards', label: '6. Flashcards' },
          { id: 'u-textbook', label: '7. Textbook' },
        ];

  const verifiedSections = unit.sections.filter(
    (s) =>
      s.source_status !== 'auto_extracted_review_required' ||
      Boolean(getExactLessonExperienceById(s.id)) ||
      Boolean(getSubsectionLessonById(s.id)),
  );
  const reviewSections = unit.sections.filter(
    (s) =>
      s.source_status === 'auto_extracted_review_required' &&
      !getExactLessonExperienceById(s.id) &&
      !getSubsectionLessonById(s.id),
  );
  const reviewOutlineExpanded =
    showReviewSubtopicsInOutline || isUnderReview || verifiedSections.length === 0;

  const breadcrumbs: { label: string; to?: string; lang?: string }[] = [
    { label: 'Class 10', to: '/class-10' },
    {
      label: subjectMeta.title,
      to: `/class-10/${subjectMeta.slug}`,
      lang: isTamil ? 'ta' : undefined,
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
    lang: isTamil ? 'ta' : undefined,
  });
  breadcrumbs.push({
    label: `${section.section_number} ${section.title}`,
    lang: isTamil ? 'ta' : undefined,
  });

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

  // Build graphical flashcards for EVERY route (uses verified lessonPkg cards OR synthesizes from chapterMindMap!)
  const cardTypes: ('term' | 'diagram_label' | 'why' | 'apply')[] = ['term', 'why', 'diagram_label', 'apply'];
  const sectionFlashcards =
    lessonPkg?.flashcards && lessonPkg.flashcards.length > 0
      ? lessonPkg.flashcards
      : chapterMindMap.branches.map((b, i) => ({
          id: `${section.id}-fc-${i}`,
          card_type: cardTypes[i % cardTypes.length],
          front: `${b.title}: What is the key principle or exam rule in ${unit.title}?`,
          back: `${b.summary} Exam cue: ${b.examCue}`,
          hint: chapterMindMap.formulaOrKeyFact,
        }));

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
        markUnderstoodCheckpoint(section.id, correctCount, questionBank.length, 'concept_first_transfer');
      }
    }
  };

  const progressBadge =
    progressStage === 'completed'
      ? {
          label: 'Understood ✓',
          className: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/30',
        }
      : progressStage === 'practised'
        ? {
            label: 'Practised',
            className: 'bg-[var(--info-bg)] text-[var(--primary)] border-[var(--primary)]/30',
          }
        : progressStage === 'explored'
          ? {
              label: 'Explored',
              className: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-400/40',
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
            className={`block px-3 py-2.5 rounded-xl text-xs transition-colors ${
              isCurrent
                ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
                : 'text-[var(--text)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span lang={isTamil ? 'ta' : undefined} className={`leading-snug ${isTamil ? 'font-tamil' : ''}`}>
                {sec.section_number} {sec.title}
              </span>
              {secStage === 'completed' && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCurrent ? 'text-white' : 'text-[var(--success)]'}`}
                />
              )}
            </div>
            <div className={`text-[11px] mt-0.5 ${isCurrent ? 'text-white/85' : 'text-[var(--text-muted)]'}`}>
              p. {sec.printed_page} · Interactive lesson
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
              <span>More chapter subtopics ({reviewSections.length})</span>
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
                    className={`block px-3 py-2 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? 'bg-[var(--primary)] text-white font-bold'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <div lang={isTamil ? 'ta' : undefined} className={isTamil ? 'font-tamil' : ''}>
                      {sec.section_number} {sec.title}
                    </div>
                    <div className={`text-[10px] ${isCurrent ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                      p. {sec.printed_page} · Book topic
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

      {/* Streamlined Single-Card Header (Unified Across ALL 694 Routes!) */}
      <header className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 sm:px-5 sm:py-4 shadow-[var(--shadow-card)] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <Link
                to={unit.route}
                lang={isTamil ? 'ta' : undefined}
                className={`font-bold text-[var(--primary)] hover:underline ${isTamil ? 'font-tamil' : ''}`}
              >
                {unit.code_label} · {unit.title}
              </Link>
              <span aria-hidden="true">·</span>
              <span>p. {section.printed_page}</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${progressBadge.className}`}>
                {progressBadge.label}
              </span>
            </div>

            <h1
              lang={isTamil ? 'ta' : undefined}
              className={`text-xl sm:text-2xl font-extrabold text-[var(--ink)] tracking-tight leading-snug ${isTamil ? 'font-tamil' : ''}`}
            >
              {section.section_number} {section.title}
            </h1>
            <p
              lang={isTamil ? 'ta' : undefined}
              className={`text-xs sm:text-sm text-[var(--text-muted)] ${isTamil ? 'font-tamil' : ''}`}
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
                className={`hidden lg:inline-flex min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold items-center gap-1.5 transition-colors ${
                  outlineOpenDesktop
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>{outlineOpenDesktop ? 'Hide topics' : `Chapter topics (${unit.sections.length})`}</span>
              </button>
            )}

            {!hasCustomConceptPlayer && (
              <button
                type="button"
                onClick={() => updatePreferences({ prefer2DPathway: !preferences.prefer2DPathway })}
                aria-pressed={preferences.prefer2DPathway}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                  preferences.prefer2DPathway
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2D view</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => updatePreferences({ focusMode: !preferences.focusMode })}
              aria-pressed={preferences.focusMode}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                preferences.focusMode
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
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
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
                <h2 lang={isTamil ? 'ta' : undefined} className={`text-sm font-extrabold text-[var(--ink)] mt-0.5 ${isTamil ? 'font-tamil' : ''}`}>
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {showSidebarDesktop && (
          <aside
            aria-label="Chapter outline"
            className="hidden lg:block lg:col-span-3 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            <div className="pb-2.5 border-b border-[var(--line)]">
              <Link to={unit.route} className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{unit.code_label} overview</span>
              </Link>
              <h2 lang={isTamil ? 'ta' : undefined} className={`text-sm font-extrabold text-[var(--ink)] mt-1 ${isTamil ? 'font-tamil' : ''}`}>
                {unit.title}
              </h2>
            </div>
            {renderSidebarLinks(false)}
          </aside>
        )}

        <div className={`${showSidebarDesktop ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
          {conceptFirstSpec ? (
            <ConceptFirstLessonPlayer
              key={conceptFirstSpec.sectionId}
              spec={conceptFirstSpec}
              prevRoute={
                prevSection
                  ? { label: `${prevSection.section_number} ${prevSection.title}`, to: prevSection.route }
                  : undefined
              }
              nextRoute={
                nextSection
                  ? { label: `${nextSection.section_number} ${nextSection.title}`, to: nextSection.route }
                  : undefined
              }
              progressStage={progressStage}
              isReviewLater={isBookmarked}
              onExplore={() => markSectionExplored(section.id)}
              onPractise={() => markSectionPractised(section.id)}
              onMasteryVerified={(score, total) =>
                markUnderstoodCheckpoint(section.id, score, total, 'concept_first_transfer')
              }
              onToggleReviewLater={() => toggleBookmarkSection(section.id)}
            />
          ) : unifiedLesson ? (
            <UnifiedSubsectionPlayer
              key={unifiedLesson.id}
              pkg={unifiedLesson}
              prevRoute={
                prevSection
                  ? { label: `${prevSection.section_number} ${prevSection.title}`, to: prevSection.route }
                  : undefined
              }
              nextRoute={
                nextSection
                  ? { label: `${nextSection.section_number} ${nextSection.title}`, to: nextSection.route }
                  : undefined
              }
              isCompleted={progressStage === 'completed'}
              isReviewLater={isBookmarked}
              onMarkPractised={() => markSectionPractised(section.id)}
              onMarkCompleted={() => markDemoCompleted(section.id)}
              onToggleReviewLater={() => toggleBookmarkSection(section.id)}
            />
          ) : (
            /* UNIVERSAL CONCEPT-FIRST 7-STAGE PLAYER (Unified intuitive UX across ALL remaining routes & languages!) */
            <div className="space-y-6">
              {/* Non-linear 7-Stage Jump Bar + Prev/Next */}
              <nav
                aria-label="Jump to any lesson stage"
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs"
              >
                <div className={`flex flex-wrap gap-1.5 ${isTamil ? 'font-tamil' : ''}`}>
                  {jumpLinks.map((j) => (
                    <a
                      key={j.id}
                      href={`#${j.id}`}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--primary)] hover:text-white border border-[var(--line)] text-xs font-bold text-[var(--ink)] inline-flex items-center transition-colors"
                    >
                      {j.label}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {prevSection && (
                    <Link
                      to={prevSection.route}
                      className="min-h-[34px] px-2.5 py-1 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </Link>
                  )}
                  {nextSection && (
                    <Link
                      to={nextSection.route}
                      className="min-h-[34px] px-2.5 py-1 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </nav>

              {/* STAGE 1: THE SPARK & EXPLAIN IT SIMPLY (With Simple / Exam-Ready / தமிழ் உதவி Toggles!) */}
              <section
                id="u-explain"
                lang={isTamil ? 'ta' : undefined}
                className={`rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)] ${isTamil ? 'font-tamil' : ''}`}
              >
                <div className="p-4 rounded-2xl border border-[var(--primary)]/25 bg-[var(--info-bg)] space-y-1">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isTamil ? 'ஆர்வ வினா · மையக் கருத்து' : 'The Spark · Curiosity Question'}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[var(--ink)] leading-snug">
                    {curiosityQuestion}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span>{isTamil ? 'எளிய விளக்கம்' : isEnglish ? 'Theme & Plain Overview' : 'Explain It Simply'}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExplainDepth('simple')}
                      aria-pressed={explainDepth === 'simple'}
                      className={`min-h-[36px] px-3 py-1 rounded-xl border text-xs font-bold ${
                        explainDepth === 'simple'
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                          : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                      }`}
                    >
                      {isTamil ? 'எளிய வடிவம்' : 'Simple (ELI5)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExplainDepth('exam')}
                      aria-pressed={explainDepth === 'exam'}
                      className={`min-h-[36px] px-3 py-1 rounded-xl border text-xs font-bold ${
                        explainDepth === 'exam'
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                          : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                      }`}
                    >
                      {isTamil ? 'தேர்வுக் குறிப்பு' : 'Exam-Ready Points'}
                    </button>
                    {!isTamil && (
                      <button
                        type="button"
                        onClick={() => setShowTamilHelp((v) => !v)}
                        aria-pressed={showTamilHelp}
                        className={`min-h-[36px] px-3 py-1 rounded-xl border text-xs font-bold font-tamil ${
                          showTamilHelp
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                        }`}
                      >
                        தமிழ் உதவி
                      </button>
                    )}
                  </div>
                </div>

                {explainDepth === 'simple' ? (
                  <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">
                    {lessonPkg?.concept_outline[0]?.summary ??
                      `${section.section_number} ${section.title}: ${section.learning_goal_placeholder} ${chapterMindMap.mnemonic}`}
                  </p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--ink)]">
                    {(lessonPkg?.learning_objectives ?? chapterMindMap.branches.map((b) => `${b.title}: ${b.examCue}`)).map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}

                {showTamilHelp && !isTamil && (
                  <div lang="ta" className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-400/40 font-tamil text-sm text-[var(--ink)] leading-relaxed">
                    <strong>தமிழ் வழிகாட்டி:</strong> &ldquo;{section.title}&rdquo; ({unit.title}, பக்கம் {section.printed_page}) — முதலில் கீழே உள்ள மனவரைபடத்தைப் பார்த்து, பின்னர் செயல்முறைப் பயிற்சியில் மதிப்புகளை மாற்றிப் புரிந்துகொண்டு சுயமதிப்பீட்டைச் செய்க!
                  </div>
                )}
              </section>

              {/* STAGE 2: INTERACTIVE VISUAL MIND MAP */}
              <section id="u-mindmap">
                <ChapterMindMapCard
                  unitId={unit.id}
                  unitTitle={`${unit.code_label}: ${unit.title}`}
                  isTamil={isTamil}
                />
              </section>

              {/* STAGE 3: INTERACTIVE LAB / ACCURATE 2D MAP / 3D CHEMICAL PROCESS / LANGUAGE STUDIO */}
              <section id="u-lab" className="space-y-2">
                <EngineShell
                  key={`${section.id}-unified-${section.activity_template}`}
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
              </section>

              {/* STAGE 4: KEY IDEAS, CONCEPT OUTLINE & TERMINOLOGY */}
              <section
                id="u-why"
                lang={isTamil ? 'ta' : undefined}
                className={`rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)] ${isTamil ? 'font-tamil' : ''}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[var(--primary)]" />
                    <span>{isTamil ? 'முக்கியக் கருத்துகள் & சான்றுகள்' : isEnglish ? 'Literary Craft & Key Vocabulary' : 'Why It Works & Key Concepts'}</span>
                  </h2>
                  <span className="font-mono-tabular text-xs font-bold text-[var(--primary)] px-2.5 py-1 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)]">
                    {chapterMindMap.formulaOrKeyFact}
                  </span>
                </div>

                {lessonPkg ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lessonPkg.concept_outline.map((block) => (
                        <div key={block.heading} className="rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-4 space-y-1.5">
                          <h3 className="text-sm font-extrabold text-[var(--ink)]">{block.heading}</h3>
                          <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">{block.summary}</p>
                          {block.worked_example && (
                            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)]">
                              <strong>Example / Evidence:</strong> {block.worked_example}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {lessonPkg.key_terms.map((kt) => (
                        <div key={kt.term} className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--canvas)] text-xs sm:text-sm">
                          <strong className="text-[var(--ink)]">{kt.term}:</strong>{' '}
                          <span className="text-[var(--text)]">{kt.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapterMindMap.branches.map((br) => (
                      <div key={br.title} className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-1.5">
                        <div className="text-sm font-extrabold text-[var(--ink)]">{br.title}</div>
                        <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">{br.summary}</p>
                        <div className="text-xs font-semibold text-[var(--primary)]">Exam Cue: {br.examCue}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* STAGE 5: CHECK YOURSELF (Untimed Mastery Verification Gate!) */}
              <section
                id="u-check"
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]"
              >
                {activeQuestion && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                          {isTamil ? 'சுயமதிப்பீடு · கால வரம்பற்ற பயிற்சி' : `Untimed Concept Check · Question ${activeQuestionIdx + 1} of ${questionBank.length}`}
                        </div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ink)] mt-0.5">
                          {isTamil ? 'உங்கள் புரிதலைச் சரிபார்க்கவும்' : 'Check your understanding'}
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
                              onClick={() => { setActiveQuestionIdx(idx); setShowCheckHint(false); }}
                              aria-pressed={activeQuestionIdx === idx}
                              className={`min-w-[38px] min-h-[38px] px-2.5 rounded-lg border text-xs font-bold ${
                                activeQuestionIdx === idx
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

                    <p lang={isTamil ? 'ta' : undefined} className={`text-base font-bold text-[var(--ink)] leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>
                      {activeQuestion.prompt}
                    </p>

                    <div className="space-y-2.5" role="radiogroup" aria-label="Concept check options">
                      {activeQuestion.options.map((opt) => {
                        const isSelected = selectedOptId === opt.id;
                        const borderStyle = isSelected
                          ? opt.is_correct
                            ? 'border-[var(--success)] bg-[var(--success-bg)]'
                            : 'border-[var(--warning)] bg-[var(--warning-bg)]'
                          : 'border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)]';
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectAnswer(activeQuestion.id, opt.id)}
                            aria-pressed={isSelected}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${borderStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs font-extrabold text-[var(--ink)] inline-flex items-center justify-center shrink-0 mt-0.5 uppercase">
                              {opt.id}
                            </span>
                            <span lang={isTamil ? 'ta' : undefined} className={`text-sm font-semibold text-[var(--ink)] ${isTamil ? 'font-tamil' : ''}`}>
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
                      {activeQuestionIdx < questionBank.length - 1 && (
                        <button
                          type="button"
                          onClick={() => { setActiveQuestionIdx((i) => i + 1); setShowCheckHint(false); }}
                          className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <span>Next Question (Q{activeQuestionIdx + 2})</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {showCheckHint && (
                      <div lang={isTamil ? 'ta' : undefined} className={`p-3.5 rounded-xl bg-[var(--warning-bg)] border border-[var(--warning)]/30 text-xs sm:text-sm text-[var(--ink)] ${isTamil ? 'font-tamil' : ''}`}>
                        <strong>Hint:</strong> {activeQuestion.hint}
                      </div>
                    )}

                    {selectedOption && (
                      <div
                        role="status"
                        lang={isTamil ? 'ta' : undefined}
                        className={`p-4 rounded-2xl border text-sm space-y-1 ${isTamil ? 'font-tamil' : ''} ${
                          selectedOption.is_correct
                            ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
                            : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'
                        }`}
                      >
                        <div className="font-extrabold">
                          {selectedOption.is_correct ? '✓ Correct! Great conceptual reasoning.' : 'Not quite — read the explanation and try again.'}
                        </div>
                        <p>{selectedOption.feedback}</p>
                        <p className="text-xs text-[var(--text-muted)] pt-1">
                          <strong>Worked basis:</strong> {activeQuestion.worked_explanation}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </section>

              {/* STAGE 6: INTERACTIVE GRAPHICAL FLASHCARDS */}
              <section
                id="u-flashcards"
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[var(--primary)]" />
                    <span>{isTamil ? 'நினைவு அட்டைகள் (Flashcards)' : 'Active-Recall Flashcards'}</span>
                  </h2>
                  <span className="text-xs text-[var(--text-muted)]">Flip to test memory — saved locally</span>
                </div>
                <VisualFlashcardDeck
                  cards={sectionFlashcards}
                  subjectHint={unit.subject}
                  lessonTitleHint={`${section.section_number} ${section.title}`}
                  compact
                />
              </section>

              {/* STAGE 7: TEXTBOOK READING ANCHOR & PREV/NEXT NAVIGATION */}
              <section
                id="u-textbook"
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[var(--ink)] inline-flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                      <span>{isTamil ? 'பாடநூல் குறிப்பு' : 'Textbook Reference & Accessible Summary'}</span>
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      {unit.book} ({unit.edition}) · Printed page <strong>{section.printed_page}</strong> (PDF p. <strong>{section.pdf_page}</strong>)
                    </p>
                  </div>
                  <SourcePageDrawer unit={unit} />
                </div>
                <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                  {section.accessibility_fallback}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line)]">
                  {prevSection ? (
                    <Link
                      to={prevSection.route}
                      className="min-h-[42px] px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs sm:text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{prevSection.section_number} {prevSection.title}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {(nextSection ?? nextVerifiedSection) && (
                    <Link
                      to={(nextSection ?? nextVerifiedSection)!.route}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                    >
                      <span>Next: {(nextSection ?? nextVerifiedSection)!.section_number} {(nextSection ?? nextVerifiedSection)!.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* Editorial Provenance Disclosure */}
          <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <button
              type="button"
              onClick={() => setSourceDetailsOpen((o) => !o)}
              aria-expanded={sourceDetailsOpen}
              className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-[var(--surface-subtle)] transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold text-[var(--text-muted)] inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                <span>Textbook provenance, Pass 0 audit &amp; page reference (p. {section.printed_page})</span>
              </span>
              {sourceDetailsOpen ? <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />}
            </button>

            {sourceDetailsOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-[var(--line)] space-y-3 text-xs text-[var(--text-muted)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="text-[var(--ink)]">Textbook:</strong> {unit.book} ({unit.edition}) · Printed page {section.printed_page} (PDF page {section.pdf_page}) · Canonical ID:{' '}
                    <code className="font-mono-tabular">{section.id}</code>
                  </div>
                  <SourcePageDrawer unit={unit} />
                </div>
                {section.original_extracted_title && (
                  <p>
                    <strong className="text-[var(--ink)]">Pass 0 PDF Heading Recovery:</strong> Recovered full heading from PDF (original raw extract:{' '}
                    <em>&ldquo;{section.original_extracted_title}&rdquo;</em>). {section.pass0_audit_note}
                  </p>
                )}
                <p>
                  <strong className="text-[var(--ink)]">Index status:</strong> {sourceStatusMeta.label}.{' '}
                  <strong className="text-[var(--ink)]">Visual representation:</strong> {section.representation_status}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
