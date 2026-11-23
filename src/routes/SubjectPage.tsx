import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, ArrowRight, Play, CheckCircle2, Clock } from 'lucide-react';
import { Breadcrumbs } from '../components/chrome/Breadcrumbs';
import {
  getSubjectBySlug,
  getUnitsBySubject,
  getStudentUnitStatus,
  getUnitCuriosityQuestion,
} from '../utils/curriculumStore';
import type { SocialStrand, CurriculumUnit } from '../types/curriculum';
import { NotFoundPage } from './NotFoundPage';
import { WorldConceptIslandMap } from '../components/universe/WorldConceptIslandMap';
import { UNIVERSE_WORLDS } from '../data/universeWorlds';

export function SubjectPage({
  subjectOverride,
  strandOverride,
}: {
  subjectOverride?: string;
  strandOverride?: SocialStrand;
} = {}) {
  const params = useParams<{ subject: string; strand?: string }>();
  const subject = subjectOverride ?? params.subject ?? '';
  const strand = strandOverride ?? params.strand;
  const subjectMeta = getSubjectBySlug(subject);

  const [query, setQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<
    'all' | 'interactive_now' | 'coming_soon'
  >('all');
  const [showIslandMap, setShowIslandMap] = useState(true);

  if (!subjectMeta) {
    return <NotFoundPage />;
  }

  const validStrands = ['history', 'geography', 'civics', 'economics'];
  if (strand && (subject !== 'social_science' || !validStrands.includes(strand))) {
    return <NotFoundPage />;
  }

  const activeStrand = strand as SocialStrand | undefined;
  const units = getUnitsBySubject(subjectMeta.slug, activeStrand);
  const activeWorld = UNIVERSE_WORLDS.find((w) => w.id === subjectMeta.slug);

  const interactiveUnitsCount = units.filter((u) =>
    u.sections.some((s) => Boolean(s.demo_id)),
  ).length;
  const firstInteractiveUnit =
    units.find((u) => u.sections.some((s) => Boolean(s.demo_id))) ?? units[0];
  const firstInteractiveRoute =
    firstInteractiveUnit?.sections.find((s) => Boolean(s.demo_id))?.route ??
    firstInteractiveUnit?.route ??
    '/class-10';

  const filteredUnits = units.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      u.title.toLowerCase().includes(q) ||
      u.code_label.toLowerCase().includes(q) ||
      (u.tamil_subtitle ?? '').toLowerCase().includes(q) ||
      u.hero_interaction_title.toLowerCase().includes(q) ||
      u.sections.some(
        (s) =>
          s.title.toLowerCase().includes(q) || s.section_number.toLowerCase().includes(q),
      );

    if (!matchesQuery) return false;
    const hasInteractive = u.sections.some((s) => Boolean(s.demo_id));
    if (availabilityFilter === 'interactive_now') return hasInteractive;
    if (availabilityFilter === 'coming_soon') return !hasInteractive;
    return true;
  });

  const breadcrumbItems: { label: string; to?: string; lang?: string }[] = [
    { label: 'Class 10', to: '/class-10' },
    {
      label: subjectMeta.title,
      to: activeStrand ? `/class-10/${subjectMeta.slug}` : undefined,
      lang: subjectMeta.slug === 'tamil' ? 'ta' : undefined,
    },
  ];
  if (activeStrand) {
    const strandObj = subjectMeta.strands?.find((s) => s.slug === activeStrand);
    breadcrumbItems.push({ label: strandObj?.title ?? activeStrand });
  }

  const renderChapterCard = (unit: CurriculumUnit) => {
    const unitStatus = getStudentUnitStatus(unit);
    const curiosityQuestion = getUnitCuriosityQuestion(unit);
    const isInteractive = unitStatus.kind === 'interactive_ready';

    return (
      <article
        key={unit.id}
        className={`rounded-[20px] border bg-[var(--surface)] p-6 flex flex-col justify-between gap-5 transition-all shadow-[var(--shadow-card)] ${
          isInteractive
            ? 'border-[var(--primary)]/50 hover:border-[var(--primary)]'
            : 'border-[var(--line)] hover:border-[var(--primary)]/60'
        }`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
              {unit.code_label}
              {unit.strand ? ` • ${unit.strand}` : ''}
            </span>

            {isInteractive ? (
              <span className="px-2.5 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)] text-xs font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Interactive lesson ready</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] text-xs font-semibold inline-flex items-center gap-1 border border-[var(--line)]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Lesson in preparation</span>
              </span>
            )}
          </div>

          <h3
            lang={unit.subject === 'tamil' ? 'ta' : undefined}
            className={`text-xl font-extrabold text-[var(--ink)] leading-snug ${
              unit.subject === 'tamil' ? 'font-tamil' : ''
            }`}
          >
            <Link to={unit.route} className="hover:text-[var(--primary)] hover:underline">
              {unit.title}
            </Link>
            {unit.tamil_subtitle && (
              <span className="block text-sm font-medium text-[var(--text-muted)] mt-1">
                {unit.tamil_subtitle}
              </span>
            )}
          </h3>

          <p
            lang={unit.subject === 'tamil' ? 'ta' : undefined}
            className={`text-sm sm:text-base text-[var(--text)] leading-relaxed ${
              unit.subject === 'tamil' ? 'font-tamil' : ''
            }`}
          >
            {curiosityQuestion}
          </p>

          <p className="text-xs text-[var(--text-muted)]">
            Focus activity: <strong className="text-[var(--ink)]">{unit.hero_interaction_title}</strong>
          </p>
        </div>

        <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Textbook pp. {unit.printed_page}–{unit.printed_page_end}
          </span>

          <div className="flex items-center gap-2">
            {isInteractive && unitStatus.readySection && (
              <Link
                to={unitStatus.readySection.route}
                className="px-4 py-2 min-h-[42px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start lesson</span>
              </Link>
            )}
            <Link
              to={unit.route}
              className={`px-4 py-2 min-h-[42px] rounded-[12px] text-sm font-bold inline-flex items-center gap-1.5 transition-colors ${
                isInteractive
                  ? 'border border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--ink)] hover:border-[var(--primary)]'
                  : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white'
              }`}
            >
              <span>{isInteractive ? 'Chapter overview' : 'Explore chapter'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-14 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Oversized Subject Hero */}
      <div
        style={{ backgroundColor: subjectMeta.tint_token }}
        className="rounded-[24px] border border-[var(--line)] p-6 sm:p-8 lg:p-10 space-y-5 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-[var(--ink)]">
            Class 10 • Tamil Nadu State Board
          </span>
          <span className="px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--success)] inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {interactiveUnitsCount} interactive{' '}
              {interactiveUnitsCount === 1 ? 'chapter' : 'chapters'} available now · {units.length}{' '}
              total chapters
            </span>
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <h1
              lang={subjectMeta.slug === 'tamil' ? 'ta' : undefined}
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ink)] ${
                subjectMeta.slug === 'tamil' ? 'font-tamil' : ''
              }`}
            >
              {subjectMeta.title}
              {activeStrand
                ? ` — ${subjectMeta.strands?.find((s) => s.slug === activeStrand)?.title}`
                : ''}
            </h1>

            <p
              lang={subjectMeta.slug === 'tamil' ? 'ta' : undefined}
              className={`text-base sm:text-lg text-[var(--text)] leading-relaxed ${
                subjectMeta.slug === 'tamil' ? 'font-tamil' : ''
              }`}
            >
              {activeStrand
                ? subjectMeta.strands?.find((s) => s.slug === activeStrand)?.description
                : subjectMeta.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to={firstInteractiveRoute}
              className="px-5 py-3 min-h-[48px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-base font-bold inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start learning</span>
            </Link>
          </div>
        </div>

        {/* Social Science Strand Navigation */}
        {subjectMeta.strands && (
          <div className="pt-3 border-t border-[var(--line)]/70 flex flex-wrap gap-2">
            <Link
              to="/class-10/social_science"
              className={`px-4 py-2 min-h-[44px] inline-flex items-center rounded-[12px] text-sm font-bold border transition-colors ${
                !activeStrand
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
              }`}
            >
              All 4 Strands (27 Chapters)
            </Link>
            {subjectMeta.strands.map((st) => (
              <Link
                key={st.slug}
                to={`/class-10/social_science/${st.slug}`}
                className={`px-4 py-2 min-h-[44px] inline-flex items-center rounded-[12px] text-sm font-bold border transition-colors ${
                  activeStrand === st.slug
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                {st.title} ({st.unit_count})
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Interactive 2D Concept Island Map for this Subject World (Toggleable ↔ Ordered Textbook List) */}
      {activeWorld && !activeStrand && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
              {activeWorld.worldName} · Concept Island Explorer
            </span>
            <button
              type="button"
              onClick={() => setShowIslandMap((v) => !v)}
              aria-expanded={showIslandMap}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)] hover:border-[var(--primary)]"
            >
              {showIslandMap ? 'Hide Concept Island Map (List Only)' : 'Show Concept Island Map'}
            </button>
          </div>
          {showIslandMap && <WorldConceptIslandMap world={activeWorld} />}
        </section>
      )}

      {/* Clean Search & Availability Filters (All | Interactive now | Coming soon) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="subject-unit-search" className="sr-only">
            Search chapters and topics in {subjectMeta.title}
          </label>
          <Search className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="subject-unit-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search chapters or topics in ${subjectMeta.title}...`}
            className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-base text-[var(--ink)]"
          />
        </div>

        <div
          role="group"
          aria-label="Filter chapters by availability"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-[14px] bg-[var(--surface)] border border-[var(--line)]"
        >
          {(
            [
              ['all', `All (${units.length})`],
              ['interactive_now', `Interactive now (${interactiveUnitsCount})`],
              ['coming_soon', `In preparation (${units.length - interactiveUnitsCount})`],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setAvailabilityFilter(val)}
              aria-pressed={availabilityFilter === val}
              className={`px-3.5 py-2 min-h-[42px] rounded-[10px] text-sm font-bold transition-colors whitespace-nowrap ${
                availabilityFilter === val
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Cards — Grouped by Strand if viewing Social Science All Strands */}
      {subjectMeta.slug === 'social_science' && !activeStrand ? (
        <div className="space-y-10">
          {subjectMeta.strands?.map((st) => {
            const strandUnits = filteredUnits.filter((u) => u.strand === st.slug);
            if (strandUnits.length === 0) return null;
            return (
              <section key={st.slug} aria-labelledby={`strand-${st.slug}`} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[var(--line)] pb-3">
                  <div>
                    <h2 id={`strand-${st.slug}`} className="text-2xl font-extrabold text-[var(--ink)]">
                      {st.title}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)]">{st.description}</p>
                  </div>
                  <Link
                    to={`/class-10/social_science/${st.slug}`}
                    className="text-sm font-bold text-[var(--primary)] hover:underline"
                  >
                    Open {st.title} view ({st.unit_count} chapters) →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {strandUnits.map((unit) => renderChapterCard(unit))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredUnits.map((unit) => renderChapterCard(unit))}
        </div>
      )}
    </div>
  );
}
