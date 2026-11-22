import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import type { LessonFlashcard } from '../../types/lessonContent';
import { ALL_PILOT_LESSONS } from '../../data/lesson_content';
import { useProgress } from '../../features/local-progress/ProgressContext';

export interface EnrichedFlashcard extends LessonFlashcard {
  subject: string;
  unitLabel: string;
  lessonTitle: string;
}

interface VisualFlashcardDeckProps {
  /** Pass lesson-specific flashcards when embedded inside a lesson; omit on /flashcards for full Class 10 decks */
  cards?: LessonFlashcard[];
  subjectHint?: string;
  lessonTitleHint?: string;
  compact?: boolean;
}

const SUBJECT_THEMES: Record<
  string,
  { label: string; gradient: string; badgeBg: string; accent: string; border: string }
> = {
  science: {
    label: 'Science',
    gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    badgeBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    accent: '#0d9488',
    border: 'border-teal-500/35',
  },
  mathematics: {
    label: 'Mathematics',
    gradient: 'from-indigo-600 via-violet-600 to-purple-700',
    badgeBg: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
    accent: '#7c3aed',
    border: 'border-violet-500/35',
  },
  english: {
    label: 'English',
    gradient: 'from-rose-600 via-pink-600 to-amber-600',
    badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    accent: '#e11d48',
    border: 'border-rose-500/35',
  },
  tamil: {
    label: 'தமிழ்',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    badgeBg: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
    accent: '#d97706',
    border: 'border-amber-500/35',
  },
  social_science: {
    label: 'Social Science',
    gradient: 'from-sky-600 via-blue-600 to-indigo-700',
    badgeBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    accent: '#0284c7',
    border: 'border-sky-500/35',
  },
};

function CardArtworkSVG({ subject, cardType }: { subject: string; cardType: string }) {
  if (subject === 'science') {
    if (cardType === 'diagram_label') {
      // Stylized Heart / Organelle anatomical graphic
      return (
        <svg viewBox="0 0 96 64" className="w-20 h-14 drop-shadow-sm" aria-hidden="true">
          <circle cx="48" cy="32" r="26" fill="rgba(255,255,255,0.14)" />
          <path
            d="M48 50 C34 40 24 31 24 22 C24 15 30 11 36 11 C41 11 45 14 48 18 C51 14 55 11 60 11 C66 11 72 15 72 22 C72 31 62 40 48 50 Z"
            fill="#fda4af"
            stroke="#fff"
            strokeWidth="2.5"
          />
          <path d="M48 18 L48 48" stroke="#fff" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="38" cy="24" r="3.5" fill="#38bdf8" />
          <circle cx="58" cy="24" r="3.5" fill="#fbbf24" />
        </svg>
      );
    }
    // Stylized Glowing Chemistry Flask + Atoms
    return (
      <svg viewBox="0 0 96 64" className="w-20 h-14 drop-shadow-sm" aria-hidden="true">
        <circle cx="48" cy="32" r="26" fill="rgba(255,255,255,0.14)" />
        <path
          d="M41 12 L55 12 L55 24 L67 48 Q69 52 64 52 L32 52 Q27 52 29 48 L41 24 Z"
          fill="rgba(255,255,255,0.22)"
          stroke="#fff"
          strokeWidth="2.5"
        />
        <path d="M35 38 L61 38 L65 49 Q66 51 63 51 L33 51 Q30 51 31 49 Z" fill="#fde047" />
        <circle cx="45" cy="31" r="2.8" fill="#fff" />
        <circle cx="53" cy="26" r="2.2" fill="#bae6fd" />
        <circle cx="49" cy="44" r="2.5" fill="#fff" opacity="0.85" />
      </svg>
    );
  }

  if (subject === 'mathematics') {
    // Stylized 3D Right-Triangle / Geometric Cone + Angle Arc
    return (
      <svg viewBox="0 0 96 64" className="w-20 h-14 drop-shadow-sm" aria-hidden="true">
        <circle cx="48" cy="32" r="26" fill="rgba(255,255,255,0.14)" />
        <polygon points="24,50 74,50 74,16" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="65" y="41" width="9" height="9" fill="none" stroke="#fde047" strokeWidth="2" />
        <path d="M38 50 A14 14 0 0 0 34 42" fill="none" stroke="#fde047" strokeWidth="2.5" />
        <text x="41" y="46" fill="#fff" fontSize="11" fontWeight="bold">θ</text>
      </svg>
    );
  }

  if (subject === 'english') {
    // Stylized Open Story Book + Rising Wings / Ship Crest
    return (
      <svg viewBox="0 0 96 64" className="w-20 h-14 drop-shadow-sm" aria-hidden="true">
        <circle cx="48" cy="32" r="26" fill="rgba(255,255,255,0.14)" />
        <path d="M22 46 Q35 39 48 46 Q61 39 74 46 L74 22 Q61 15 48 22 Q35 15 22 22 Z" fill="rgba(255,255,255,0.22)" stroke="#fff" strokeWidth="2.2" />
        <line x1="48" y1="22" x2="48" y2="46" stroke="#fff" strokeWidth="2" />
        <path d="M36 16 Q48 8 60 16" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (subject === 'tamil') {
    // Stylized Classical Tamil Olai Chuvadi (Palm-leaf Manuscript) & Lamp
    return (
      <svg viewBox="0 0 96 64" className="w-20 h-14 drop-shadow-sm" aria-hidden="true">
        <circle cx="48" cy="32" r="26" fill="rgba(255,255,255,0.14)" />
        <rect x="20" y="20" width="56" height="24" rx="12" fill="rgba(255,255,255,0.22)" stroke="#fff" strokeWidth="2.2" />
        <circle cx="31" cy="32" r="3.5" fill="#fde047" />
        <circle cx="65" cy="32" r="3.5" fill="#fde047" />
        <text x="48" y="37" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">த</text>
      </svg>
    );
  }

  // Social Science: Compass Globe & Relief Peaks
  return (
    <svg viewBox="0 0 96 64" className="w-20 h-14 drop-shadow-sm" aria-hidden="true">
      <circle cx="48" cy="32" r="22" fill="rgba(255,255,255,0.16)" stroke="#fff" strokeWidth="2.2" />
      <ellipse cx="48" cy="32" rx="10" ry="22" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
      <line x1="26" y1="32" x2="70" y2="32" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
      <polygon points="48,14 52,32 48,36 44,32" fill="#fde047" />
    </svg>
  );
}

export function VisualFlashcardDeck({
  cards,
  subjectHint,
  lessonTitleHint,
  compact = false,
}: VisualFlashcardDeckProps) {
  const { record, rateFlashcard } = useProgress();
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [onlyReview, setOnlyReview] = useState(false);
  const [shuffledSeed, setShuffledSeed] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState<string>('');

  const fullPool: EnrichedFlashcard[] = useMemo(() => {
    if (cards && cards.length > 0) {
      return cards.map((c) => ({
        ...c,
        subject: subjectHint ?? 'science',
        unitLabel: 'This Lesson',
        lessonTitle: lessonTitleHint ?? 'Study Deck',
      }));
    }
    return ALL_PILOT_LESSONS.flatMap((lesson) =>
      lesson.flashcards.map((fc) => ({
        ...fc,
        subject: lesson.subject,
        unitLabel: lesson.unit_id.replace(/-/g, ' ').toUpperCase(),
        lessonTitle: lesson.title,
      })),
    );
  }, [cards, subjectHint, lessonTitleHint]);

  const filteredDeck = useMemo(() => {
    let list = fullPool.filter((c) => {
      if (subjectFilter !== 'all' && c.subject !== subjectFilter) return false;
      if (onlyReview && record.flashcardRatings[c.id] !== 'review_again') return false;
      return true;
    });
    if (shuffledSeed > 0) {
      list = [...list].sort((a, b) => {
        const ha = (a.id.charCodeAt(0) * 31 + shuffledSeed * 17 + a.id.length) % 97;
        const hb = (b.id.charCodeAt(0) * 31 + shuffledSeed * 17 + b.id.length) % 97;
        return ha - hb;
      });
    }
    return list;
  }, [fullPool, subjectFilter, onlyReview, record.flashcardRatings, shuffledSeed]);

  const safeIdx = filteredDeck.length > 0 ? cardIndex % filteredDeck.length : 0;
  const currentCard = filteredDeck[safeIdx];
  const currentRating = currentCard ? record.flashcardRatings[currentCard.id] : undefined;

  const knownCount = useMemo(
    () => fullPool.filter((c) => record.flashcardRatings[c.id] === 'know').length,
    [fullPool, record.flashcardRatings],
  );
  const reviewCount = useMemo(
    () => fullPool.filter((c) => record.flashcardRatings[c.id] === 'review_again').length,
    [fullPool, record.flashcardRatings],
  );

  const goNext = () => {
    setFlipped(false);
    setToast('');
    setCardIndex((i) => (filteredDeck.length > 0 ? (i + 1) % filteredDeck.length : 0));
  };

  const goPrev = () => {
    setFlipped(false);
    setToast('');
    setCardIndex((i) =>
      filteredDeck.length > 0 ? (i - 1 + filteredDeck.length) % filteredDeck.length : 0,
    );
  };

  const handleRate = (rating: 'know' | 'review_again') => {
    if (!currentCard) return;
    rateFlashcard(currentCard.id, rating);
    setToast(rating === 'know' ? 'Marked as Known ✓' : 'Saved to Review Again deck');
    window.setTimeout(() => {
      goNext();
    }, 360);
  };

  // Keyboard shortcuts (Space to flip, Left/Right arrows to step)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === ' ' && !compact) {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight' && !compact) {
        goNext();
      } else if (e.key === 'ArrowLeft' && !compact) {
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filteredDeck.length, compact]);

  const theme =
    SUBJECT_THEMES[currentCard?.subject ?? 'science'] ?? SUBJECT_THEMES.science;

  return (
    <div className="space-y-5">
      {/* Subject Filter & Mastery Strip (shown on full /flashcards hub) */}
      {!cards && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter flashcards by subject">
            {(
              [
                ['all', `All Decks (${fullPool.length})`],
                ['science', 'Science'],
                ['mathematics', 'Mathematics'],
                ['english', 'English'],
                ['tamil', 'தமிழ்'],
                ['social_science', 'Social Science'],
              ] as const
            ).map(([slug, label]) => (
              <button
                key={slug}
                type="button"
                onClick={() => {
                  setSubjectFilter(slug);
                  setOnlyReview(false);
                  setCardIndex(0);
                  setFlipped(false);
                }}
                aria-pressed={subjectFilter === slug && !onlyReview}
                className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold border transition-colors ${
                  subjectFilter === slug && !onlyReview
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setOnlyReview((r) => !r);
                setCardIndex(0);
                setFlipped(false);
              }}
              aria-pressed={onlyReview}
              className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold border transition-colors ${
                onlyReview
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-amber-500'
              }`}
            >
              Review Again ({reviewCount})
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-muted)]">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--success-bg)] text-[var(--success)] font-bold">
              Known: {knownCount} / {fullPool.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setShuffledSeed((s) => s + 1);
                setCardIndex(0);
                setFlipped(false);
              }}
              className="px-3 py-1.5 min-h-[36px] rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] text-[var(--ink)] font-bold inline-flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      )}

      {!currentCard ? (
        <div className="p-8 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] text-center space-y-3">
          <p className="text-base font-extrabold text-[var(--ink)]">
            No cards in this filter yet!
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Mark any card as &ldquo;Review Again&rdquo; while studying, or switch back to All Decks.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubjectFilter('all');
              setOnlyReview(false);
            }}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold"
          >
            Show All Flashcards
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Progress Pill & Card Counter */}
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] px-1">
            <span>
              Card {safeIdx + 1} of {filteredDeck.length} ·{' '}
              <span className="text-[var(--ink)]">{currentCard.lessonTitle}</span>
            </span>
            <span className="uppercase tracking-wider font-mono-tabular">
              {currentCard.card_type.replace('_', ' ')}
            </span>
          </div>

          {/* 3D Stacked Tactile Card Container */}
          <div className="relative pt-1 pb-4">
            {/* Layered Physical Deck Stack Depth Cards Behind */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-4 bottom-0 rounded-[26px] border border-[var(--line)] bg-[var(--surface-subtle)] opacity-60 transform translate-y-2 scale-[0.95]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-3 top-2.5 bottom-2 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] opacity-85 transform translate-y-1 scale-[0.98]"
            />

            {/* Clickable 3D Flip Card */}
            <div
              style={{ perspective: '1200px' }}
              className="relative w-full min-h-[320px] sm:min-h-[340px]"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setFlipped((f) => !f)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFlipped((f) => !f);
                  }
                }}
                aria-label={flipped ? 'Flashcard answer side. Press to flip back to prompt.' : 'Flashcard question side. Press to flip and reveal answer.'}
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                className="relative w-full min-h-[320px] sm:min-h-[340px] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[26px]"
              >
                {/* FRONT FACE (Question + Graphical Header) */}
                <div
                  style={{ backfaceVisibility: 'hidden' }}
                  className={`absolute inset-0 rounded-[26px] border-2 ${theme.border} bg-[var(--surface)] shadow-xl overflow-hidden flex flex-col`}
                >
                  {/* Visual Graphical Card Header Banner */}
                  <div className={`bg-gradient-to-r ${theme.gradient} px-6 py-4 text-white flex items-center justify-between gap-4`}>
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>{theme.label}</span>
                      </span>
                      <div className="text-xs font-semibold text-white/90">
                        QUESTION · TAP CARD TO FLIP
                      </div>
                    </div>
                    <CardArtworkSVG subject={currentCard.subject} cardType={currentCard.card_type} />
                  </div>

                  {/* Card Prompt Body */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <p
                      lang={currentCard.subject === 'tamil' ? 'ta' : undefined}
                      className="text-lg sm:text-2xl font-extrabold text-[var(--ink)] leading-snug font-tamil max-w-xl"
                    >
                      {currentCard.front}
                    </p>
                  </div>

                  {/* Card Footer Cue */}
                  <div className="px-6 py-3 border-t border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="font-semibold">Think of the answer first, then tap to flip ↻</span>
                    {currentRating && (
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold ${
                          currentRating === 'know'
                            ? 'bg-[var(--success-bg)] text-[var(--success)]'
                            : 'bg-[var(--warning-bg)] text-[var(--warning)]'
                        }`}
                      >
                        {currentRating === 'know' ? 'Known ✓' : 'In Review'}
                      </span>
                    )}
                  </div>
                </div>

                {/* BACK FACE (Answer / Explanation) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 rounded-[26px] border-2 border-[var(--primary)] bg-[var(--surface)] shadow-xl overflow-hidden flex flex-col"
                >
                  <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold uppercase tracking-wider">
                        Concept Explanation
                      </span>
                      <div className="text-xs text-slate-300 font-medium">
                        {currentCard.lessonTitle}
                      </div>
                    </div>
                    <CardArtworkSVG subject={currentCard.subject} cardType={currentCard.card_type} />
                  </div>

                  <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                    <p
                      lang={currentCard.subject === 'tamil' ? 'ta' : undefined}
                      className="text-base sm:text-xl font-bold text-[var(--ink)] leading-relaxed font-tamil max-w-xl"
                    >
                      {currentCard.back}
                    </p>
                  </div>

                  <div className="px-6 py-3 border-t border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Rate honestly below — saved locally on your device</span>
                    <span className="font-bold text-[var(--primary)]">Tap card to flip back ↺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Feedback Toast */}
          {toast && (
            <div
              role="status"
              className="text-center text-xs font-extrabold text-[var(--success)] py-1"
            >
              {toast}
            </div>
          )}

          {/* Crisp Tactile Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous flashcard"
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] text-xs sm:text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleRate('review_again')}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Again</span>
              </button>
              <button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-extrabold shadow-xs"
              >
                {flipped ? 'Show Question' : 'Flip Card'}
              </button>
              <button
                type="button"
                onClick={() => handleRate('know')}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>I Know This</span>
              </button>
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next flashcard"
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] text-xs sm:text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!compact && (
            <p className="text-center text-[11px] text-[var(--text-muted)]">
              Shortcuts: <kbd className="px-1.5 py-0.5 rounded border border-[var(--line)] bg-[var(--surface)]">Space</kbd> Flip ·{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-[var(--line)] bg-[var(--surface)]">←</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-[var(--line)] bg-[var(--surface)]">→</kbd> Navigate
            </p>
          )}
        </div>
      )}
    </div>
  );
}
