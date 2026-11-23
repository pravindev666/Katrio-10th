import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Play, CheckCircle2, Clock } from 'lucide-react';
import { Breadcrumbs } from '../components/chrome/Breadcrumbs';
import {
  getSubjects,
  searchCurriculum,
} from '../utils/curriculumStore';
import { useProgress } from '../features/local-progress/ProgressContext';
import { getCompletedSectionCount } from '../features/local-progress/progressStore';
import { WorldConceptIslandMap } from '../components/universe/WorldConceptIslandMap';
import { GATE2_WORKING_PILOTS } from '../data/universeWorlds';

export function Class10HubPage() {
  const subjects = getSubjects();
  const { record } = useProgress();
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'interactive' | 'verified'>('all');
  const [hubView, setHubView] = useState<'map' | 'cards'>('map');

  const results = searchCurriculum(query, {
    onlyDemos: filterMode === 'interactive',
    sourceStatus: filterMode === 'verified' ? 'toc_verified' : 'all',
    limit: 24,
  });

  const featuredLessons = [
    {
      subject: 'Science · Unit 14',
      title: '14.15 Human Heart 3D Cutaway & Circulation',
      question: 'How does the heart pump blood through two separate loops?',
      route: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
      tint: 'var(--science-tint)',
    },
    {
      subject: 'Science · Unit 10',
      title: '10.1 Types of Chemical Reactions Lab',
      question: 'How are atoms conserved when reactants combine, split, or displace?',
      route: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
      tint: 'var(--science-tint)',
    },
    {
      subject: 'Mathematics · Chapter 6',
      title: '6.3 Heights and Distances Clinometer',
      question: 'How can you measure a tall building from the ground?',
      route: '/class-10/mathematics/maths-06/maths-06-03',
      tint: 'var(--math-tint)',
    },
    {
      subject: 'English · Unit 1',
      title: 'His First Flight — Story Stage',
      question: 'How does courage overcome hesitation at the edge of the cliff?',
      route: '/class-10/english/english-01/english-01-prose',
      tint: 'var(--english-tint)',
    },
    {
      subject: 'தமிழ் · இயல் 4',
      title: 'மணற்கேணி — மொழிபெயர்ப்பு & இலக்கணம்',
      question: 'பிறமொழி கருத்துகளைத் தமிழில் மொழிபெயர்ப்பது எப்படி?',
      route: '/class-10/tamil/tamil-04/tamil-04-01',
      tint: 'var(--tamil-tint)',
    },
    {
      subject: 'History · Unit 1',
      title: 'Outbreak of World War I — TimeMap',
      question: 'How did rival alliances turn the 1914 Sarajevo crisis into a global war?',
      route: '/class-10/social_science/social-history-01/social-history-01-auto-1-3-causes-course-and',
      tint: 'var(--social-tint)',
    },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-14 space-y-12">
      <Breadcrumbs items={[{ label: 'Class 10' }]} />

      {/* Hero Header & Continue Card */}
      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-[var(--shadow-card)]">
        <div className="space-y-3 max-w-2xl">
          <div className="text-sm font-bold text-[var(--primary)]">
            Class 10 • Tamil Nadu State Board
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--ink)] leading-tight">
            Explore Class 10 subjects &amp; interactive lessons
          </h1>
          <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed">
            Choose a subject below to browse chapters, try hands-on 2D and 3D visual experiments, or
            practice with untimed concept questions.
          </p>
        </div>

        <div className="p-5 rounded-[18px] bg-[var(--surface-subtle)] border border-[var(--line)] space-y-3 min-w-[280px] lg:max-w-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Clock className="w-4 h-4" />
            <span>Your Study Session</span>
          </div>
          <p className="text-sm text-[var(--text)]">
            Visited: <strong>{record.visitedSections.length}</strong> · Explored:{' '}
            <strong>{(record.exploredSections ?? []).length}</strong> · Practised:{' '}
            <strong>{(record.practisedSections ?? []).length}</strong> · Understood:{' '}
            <strong>{getCompletedSectionCount(record)}</strong>
          </p>
          {record.lastVisitedRoute ? (
            <Link
              to={record.lastVisitedRoute}
              className="w-full px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>Continue where I left off</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart"
              className="w-full px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Try Heart 3D Pilot</span>
            </Link>
          )}
        </div>
      </div>

      {/* Ready-Now Interactive Lessons */}
      <section aria-labelledby="ready-now-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="ready-now-heading" className="text-2xl font-extrabold text-[var(--ink)]">
              Interactive lessons ready right now
            </h2>
            <p className="text-sm sm:text-base text-[var(--text)]">
              Jump straight into a working visual simulation with explanations and concept checks.
            </p>
          </div>
          <Link
            to="/arcade"
            className="text-sm font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
          >
            <span>See all 13 interactive tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredLessons.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              style={{ backgroundColor: item.tint }}
              className="rounded-[18px] border border-[var(--line)] p-5 flex flex-col justify-between space-y-4 hover:border-[var(--primary)] transition-colors shadow-[var(--shadow-card)]"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--success)] bg-[var(--surface)] px-2.5 py-1 rounded-full border border-[var(--line)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.subject}</span>
                </div>
                <h3 className="text-base font-extrabold text-[var(--ink)]">{item.title}</h3>
                <p className="text-sm text-[var(--text)]">{item.question}</p>
              </div>
              <span className="text-sm font-bold text-[var(--primary)] inline-flex items-center gap-1.5">
                <span>Start lesson</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6 Subject Worlds + Interactive Universe Map Toggle */}
      <section aria-labelledby="hub-subjects-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="hub-subjects-heading" className="text-2xl font-extrabold text-[var(--ink)]">
              All Class 10 Worlds &amp; Subjects
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Explore visually on the 2D Universe Map or browse the textbook subject cards below.
            </p>
          </div>
          <div className="inline-flex p-1 rounded-[14px] bg-[var(--surface)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setHubView('map')}
              aria-pressed={hubView === 'map'}
              className={`px-3.5 py-1.5 min-h-[38px] rounded-[10px] text-xs font-bold ${
                hubView === 'map' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink)]'
              }`}
            >
              2D Universe Map
            </button>
            <button
              type="button"
              onClick={() => setHubView('cards')}
              aria-pressed={hubView === 'cards'}
              className={`px-3.5 py-1.5 min-h-[38px] rounded-[10px] text-xs font-bold ${
                hubView === 'cards' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink)]'
              }`}
            >
              Subject Cards
            </button>
          </div>
        </div>

        {hubView === 'map' && <WorldConceptIslandMap />}

        {/* Featured Capstone Mission Strip */}
        <div
          style={{ backgroundColor: 'var(--arcade-tint)' }}
          className="rounded-[20px] border border-[var(--arcade)]/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--arcade)]">
              Cross-Subject Capstone Mission · Zero Timers · {GATE2_WORKING_PILOTS.length} Flagship Pilots Live
            </div>
            <h3 className="text-lg font-extrabold text-[var(--ink)]">
              Design a Sustainable Tamil Nadu Town (Maths + Science + Geography + Economics + English/Tamil)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text)]">
              Apply cylinder/hemisphere water tanks (π = 22/7), LED &amp; wind power, monsoon rain-shadow planning, and a municipal budget in one untimed capstone quest.
            </p>
          </div>
          <Link
            to="/arcade/sustainable-tn-town"
            className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--arcade)] hover:opacity-95 text-white text-sm font-bold inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Launch Town Mission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div
              key={sub.slug}
              style={{ backgroundColor: sub.tint_token }}
              className="rounded-[20px] border border-[var(--line)] p-6 flex flex-col justify-between space-y-5 shadow-[var(--shadow-card)]"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[var(--text-muted)]">
                  <span>{sub.world_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                    {sub.unit_count} Chapters
                  </span>
                </div>

                <h3
                  lang={sub.slug === 'tamil' ? 'ta' : undefined}
                  className={`text-2xl font-extrabold text-[var(--ink)] ${sub.slug === 'tamil' ? 'font-tamil' : ''
                    }`}
                >
                  <Link to={`/class-10/${sub.slug}`} className="hover:underline">
                    {sub.title}
                  </Link>
                </h3>

                <p
                  lang={sub.slug === 'tamil' ? 'ta' : undefined}
                  className={`text-sm sm:text-base text-[var(--text)] leading-relaxed ${sub.slug === 'tamil' ? 'font-tamil' : ''
                    }`}
                >
                  {sub.tagline}
                </p>

                {sub.strands && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {sub.strands.map((st) => (
                      <Link
                        key={st.slug}
                        to={`/class-10/social_science/${st.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] hover:border-[var(--primary)]"
                      >
                        {st.title} ({st.unit_count})
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--line)]/80 flex items-center justify-between">
                <Link
                  to={`/class-10/${sub.slug}`}
                  className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white border border-[var(--line)] text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Browse {sub.unit_count} chapters</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {/* Games & Practice Card */}
          <div
            style={{ backgroundColor: 'var(--arcade-tint)' }}
            className="rounded-[20px] border border-[var(--line)] p-6 flex flex-col justify-between space-y-5 shadow-[var(--shadow-card)]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-[var(--arcade)]">
                <span>Cross-Subject Practice</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                  Untimed
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--ink)]">
                <Link to="/arcade" className="hover:underline">
                  Games, Flashcards &amp; Quizzes
                </Link>
              </h3>
              <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
                Practice concepts across all five subjects with interactive tools, self-rated
                flashcards, and low-pressure quizzes with hints.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--line)]/80 flex flex-wrap items-center gap-2">
              <Link
                to="/arcade"
                className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white border border-[var(--line)] text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Open Arcade</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/flashcards"
                className="px-3 py-2 text-sm font-bold text-[var(--primary)] hover:underline"
              >
                Flashcards
              </Link>
              <Link
                to="/quizzes"
                className="px-3 py-2 text-sm font-bold text-[var(--primary)] hover:underline"
              >
                Quizzes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bilingual Topic Search */}
      <section aria-labelledby="hub-search-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="hub-search-heading" className="text-2xl font-extrabold text-[var(--ink)]">
              Find any Class 10 chapter or topic
            </h2>
            <p className="text-sm sm:text-base text-[var(--text)]">
              Search in English or Tamil across all 72 chapters.
            </p>
          </div>
          <Link to="/about" className="text-xs font-semibold text-[var(--text-muted)] hover:underline">
            View curriculum source audit &amp; textbook editions →
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <label htmlFor="hub-search-input" className="sr-only">
              Search chapters and topics
            </label>
            <Search className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="hub-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by chapter, topic, or Tamil title (e.g. மணற்கேணி, Trigonometry, Circulation)..."
              className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-base text-[var(--ink)]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['all', 'All topics'],
                ['interactive', 'Interactive now'],
                ['verified', 'Main chapter topics'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setFilterMode(val)}
                className={`px-3.5 py-2 min-h-[44px] rounded-[12px] text-sm font-semibold border whitespace-nowrap ${filterMode === val
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text)] border-[var(--line)]'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[var(--line)] rounded-[18px] divide-y divide-[var(--line)] bg-[var(--surface)] overflow-hidden">
          {results.map((item) => {
            const statusLabel = item.hasDemo
              ? 'Interactive lesson ready'
              : item.sourceStatus === 'auto_extracted_review_required'
                ? 'Title under review'
                : 'Lesson in preparation';
            return (
              <Link
                key={`${item.kind}-${item.id}`}
                to={item.route}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--surface-subtle)] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="text-[var(--ink)]">{item.subjectTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        item.hasDemo
                          ? 'text-[var(--success)] font-bold'
                          : 'text-[var(--text-muted)]'
                      }
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p
                    lang={item.subject === 'tamil' ? 'ta' : undefined}
                    className={`text-base font-bold text-[var(--ink)] ${item.subject === 'tamil' ? 'font-tamil' : ''
                      }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">{item.subtitle}</p>
                </div>
                <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap inline-flex items-center gap-1">
                  <span>{item.hasDemo ? 'Start lesson' : 'Open'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
