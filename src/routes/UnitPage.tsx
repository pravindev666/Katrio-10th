import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Breadcrumbs } from '../components/chrome/Breadcrumbs';
import { SourcePageDrawer } from '../components/curriculum/SourcePageDrawer';
import {
  getSubjectBySlug,
  getUnitById,
  getStudentSectionStatus,
  getUnitCuriosityQuestion,
} from '../utils/curriculumStore';
import { getSubsectionLessonById } from '../data/history_unit4_index';
import { getExactLessonExperienceById } from '../data/exactSectionManifest';
import { useProgress } from '../features/local-progress/ProgressContext';
import { getSectionProgressStage } from '../features/local-progress/progressStore';
import { NotFoundPage } from './NotFoundPage';

export function UnitPage() {
  const { subject = '', unitId = '' } = useParams<{ subject: string; unitId: string }>();
  const subjectMeta = getSubjectBySlug(subject);
  const unit = getUnitById(subject, unitId);
  const { record } = useProgress();

  const [topicQuery, setTopicQuery] = useState('');
  const [showReviewTopics, setShowReviewTopics] = useState(false);

  if (!subjectMeta || !unit) {
    return <NotFoundPage />;
  }

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

  const recommendedSection =
    unit.sections.find((s) => Boolean(getExactLessonExperienceById(s.id))) ??
    unit.sections.find((s) => Boolean(getSubsectionLessonById(s.id))) ??
    unit.sections.find((s) => Boolean(s.lesson_content_id || s.demo_id)) ??
    verifiedSections.find((s) => getSectionProgressStage(record, s.id) !== 'completed') ??
    unit.sections[0];

  const isRecommendedReady = Boolean(
    recommendedSection &&
    (getExactLessonExperienceById(recommendedSection.id) ||
      getSubsectionLessonById(recommendedSection.id) ||
      recommendedSection.lesson_content_id ||
      recommendedSection.demo_id),
  );

  const curiosityQuestion = getUnitCuriosityQuestion(unit);
  const normalizedQuery = topicQuery.trim().toLowerCase();

  const matchingVerified = verifiedSections.filter(
    (s) =>
      !normalizedQuery ||
      s.title.toLowerCase().includes(normalizedQuery) ||
      s.section_number.toLowerCase().includes(normalizedQuery),
  );
  const matchingReview = reviewSections.filter(
    (s) =>
      !normalizedQuery ||
      s.title.toLowerCase().includes(normalizedQuery) ||
      s.section_number.toLowerCase().includes(normalizedQuery),
  );

  // When a unit has only auto-extracted numbered headings (Science / Social Science), expand by default
  const isReviewExpanded =
    showReviewTopics || Boolean(normalizedQuery) || verifiedSections.length === 0;

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
    lang: unit.subject === 'tamil' ? 'ta' : undefined,
  });

  const renderProgressPill = (secId: string) => {
    const stage = getSectionProgressStage(record, secId);
    if (stage === 'completed') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] text-xs font-bold">
          ✓ Completed
        </span>
      );
    }
    if (stage === 'practised') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary-tint)] text-[var(--primary)] text-xs font-bold">
          Practised
        </span>
      );
    }
    if (stage === 'explored') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-400/35">
          Explored
        </span>
      );
    }
    if (stage === 'started') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] text-xs font-semibold border border-[var(--line)]">
          Started
        </span>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-14 space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* 1. Chapter Hero & Recommended Next Card */}
      <div
        style={{ backgroundColor: subjectMeta.tint_token }}
        className="rounded-[24px] border border-[var(--line)] p-6 sm:p-8 space-y-6 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="font-bold text-[var(--ink)]">
            <span>{unit.code_label}</span>
            <span aria-hidden="true"> • </span>
            <span>Class 10 {subjectMeta.title}</span>
            <span aria-hidden="true"> • </span>
            <span className="text-[var(--text-muted)] font-medium">
              Textbook pp. {unit.printed_page}–{unit.printed_page_end}
            </span>
          </div>

          <SourcePageDrawer
            unit={unit}
            buttonLabel={`Textbook pages (${unit.printed_page}–${unit.printed_page_end})`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <h1
              lang={unit.subject === 'tamil' ? 'ta' : undefined}
              className={`text-3xl sm:text-4xl font-extrabold text-[var(--ink)] leading-tight ${unit.subject === 'tamil' ? 'font-tamil' : ''
                }`}
            >
              {unit.title}
              {unit.tamil_subtitle && (
                <span className="block text-lg font-semibold text-[var(--text-muted)] mt-1">
                  {unit.tamil_subtitle}
                </span>
              )}
            </h1>

            <p
              lang={unit.subject === 'tamil' ? 'ta' : undefined}
              className={`text-base sm:text-lg font-semibold text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                }`}
            >
              {curiosityQuestion}
            </p>

            <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
              <strong>What you will explore:</strong> {unit.hero_interaction_title} —{' '}
              {unit.learning_evidence_summary}.
            </p>
          </div>

          {/* Recommended Next Card */}
          {recommendedSection && (
            <div className="lg:col-span-5 rounded-[20px] bg-[var(--surface)] border border-[var(--line)] p-5 space-y-3.5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommended next</span>
                </span>
                {isRecommendedReady ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] text-xs font-bold">
                    Interactive lesson ready
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] text-xs font-semibold">
                    In preparation
                  </span>
                )}
              </div>

              <div>
                <h2
                  lang={unit.subject === 'tamil' ? 'ta' : undefined}
                  className={`text-lg font-extrabold text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                    }`}
                >
                  {recommendedSection.section_number} {recommendedSection.title}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {isRecommendedReady
                    ? 'Simple explanation, interactive visuals, textbook-linked study notes, and untimed practice ready now.'
                    : 'Textbook topic linked to printed pages; interactive lesson package queued for authoring.'}
                </p>
              </div>

              <Link
                to={recommendedSection.route}
                className="w-full px-5 py-3 min-h-[48px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {isRecommendedReady
                    ? 'Start interactive lesson'
                    : 'Open topic'}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. Available Activities Row */}
      <section aria-labelledby="unit-activities-heading" className="space-y-3">
        <h2 id="unit-activities-heading" className="text-lg font-extrabold text-[var(--ink)]">
          Ways to learn in this chapter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to={recommendedSection?.route ?? unit.route}
            className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 flex items-start gap-3.5 hover:border-[var(--primary)] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-tint)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--ink)]">
                Visual Model &amp; Simulation
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {unit.hero_interaction_title} (with 2D &amp; text option)
              </p>
            </div>
          </Link>

          <Link
            to="/flashcards"
            className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 flex items-start gap-3.5 hover:border-[var(--primary)] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--ink)] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--ink)]">
                Self-Rated Flashcards
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Review key terms and explanations at your own pace
              </p>
            </div>
          </Link>

          <Link
            to="/quizzes"
            className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 flex items-start gap-3.5 hover:border-[var(--primary)] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--ink)] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--ink)]">
                Untimed Concept Check
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Practice with optional hints and step-by-step feedback
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Ordered Topic List with Progressive Disclosure */}
      <section aria-labelledby="chapter-topics-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 id="chapter-topics-heading" className="text-2xl font-extrabold text-[var(--ink)]">
              Chapter Topics ({unit.sections.length})
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Select a topic below to open its lesson player.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <label htmlFor="unit-topic-search" className="sr-only">
              Search topics in this chapter
            </label>
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="unit-topic-search"
              type="search"
              value={topicQuery}
              onChange={(e) => setTopicQuery(e.target.value)}
              placeholder="Find topic in this chapter..."
              className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink)]"
            />
          </div>
        </div>

        {/* Main Verified Chapter Topics */}
        {matchingVerified.length > 0 && (
          <div className="border border-[var(--line)] rounded-[20px] divide-y divide-[var(--line)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-card)]">
            {matchingVerified.map((sec) => {
              const status = getStudentSectionStatus(sec);
              const isInteractive = status.kind === 'interactive_ready';

              return (
                <Link
                  key={sec.id}
                  to={sec.route}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-subtle)] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono-tabular font-bold text-[var(--ink)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded border border-[var(--line)]">
                        {sec.section_number}
                      </span>
                      <span className="text-[var(--text-muted)] font-medium">
                        Book p. {sec.printed_page}
                      </span>
                      {isInteractive ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{status.badgeLabel}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] font-semibold inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{status.badgeLabel}</span>
                        </span>
                      )}
                      {renderProgressPill(sec.id)}
                    </div>

                    <h3
                      lang={unit.subject === 'tamil' ? 'ta' : undefined}
                      className={`text-lg font-extrabold text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                        }`}
                    >
                      {sec.title}
                    </h3>

                    <p className="text-sm text-[var(--text)]">{status.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-4 py-2.5 min-h-[44px] rounded-[12px] text-sm font-bold inline-flex items-center gap-1.5 whitespace-nowrap ${isInteractive
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--surface-subtle)] text-[var(--primary)] border border-[var(--line)]'
                        }`}
                    >
                      <span>{status.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Progressive Disclosure for Additional Subtopics Under Editorial Review */}
        {matchingReview.length > 0 && (
          <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowReviewTopics((prev) => !prev)}
              aria-expanded={isReviewExpanded}
              aria-controls="unit-review-subtopics"
              className="w-full p-5 text-left bg-[var(--surface-subtle)]/70 hover:bg-[var(--surface-subtle)] flex items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-0.5">
                <span className="text-base font-extrabold text-[var(--ink)] block">
                  {isReviewExpanded
                    ? `Hide additional textbook subtopics (${matchingReview.length})`
                    : `View all ${matchingReview.length} additional textbook subtopics in this chapter`}
                </span>
                <span className="text-xs text-[var(--text-muted)] block">
                  Numbered textbook subtopics matched to printed pages — select any topic to explore.
                </span>
              </div>
              <span className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5 shrink-0">
                <span>{isReviewExpanded ? 'Collapse list' : 'Show subtopics'}</span>
                {isReviewExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            </button>

            {isReviewExpanded && (
              <div id="unit-review-subtopics" className="divide-y divide-[var(--line)]">
                {matchingReview.map((sec) => {
                  const status = getStudentSectionStatus(sec);
                  const isInteractive = status.kind === 'interactive_ready';
                  return (
                    <Link
                      key={sec.id}
                      to={sec.route}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[var(--surface-subtle)] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono-tabular font-bold text-[var(--ink)]">
                            {sec.section_number}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[var(--text-muted)]">
                            Book p. {sec.printed_page}
                          </span>
                          <span aria-hidden="true">·</span>
                          {isInteractive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{status.badgeLabel}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--line)] font-semibold">
                              {status.badgeLabel}
                            </span>
                          )}
                          {renderProgressPill(sec.id)}
                        </div>

                        <h3
                          lang={unit.subject === 'tamil' ? 'ta' : undefined}
                          className={`text-base font-bold text-[var(--ink)] ${unit.subject === 'tamil' ? 'font-tamil' : ''
                            }`}
                        >
                          {sec.title}
                        </h3>
                      </div>

                      <span
                        className={`text-sm font-bold inline-flex items-center gap-1 whitespace-nowrap ${isInteractive
                          ? 'px-4 py-2 min-h-[40px] rounded-[12px] bg-[var(--primary)] text-white'
                          : 'text-[var(--primary)]'
                          }`}
                      >
                        <span>{isInteractive ? 'Start interactive pilot' : 'Open topic'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
