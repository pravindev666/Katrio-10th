import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Compass,
  SlidersHorizontal,
} from 'lucide-react';
import {
  getSubjects,
  searchCurriculum,
  getStudentSectionStatus,
  getStudentUnitStatus,
} from '../utils/curriculumStore';
import { useProgress } from '../features/local-progress/ProgressContext';

export function LandingPage() {
  const subjects = getSubjects();
  const { preferences, updatePreferences, record } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'all' | string>('all');
  const [activeShowcaseId, setActiveShowcaseId] = useState<
    'heart' | 'trig' | 'chem' | 'tamil'
  >('heart');

  // Mini interactive clinometer angle for the home page live preview
  const [previewAngle, setPreviewAngle] = useState(45);
  const previewDistance = 40;
  const previewHeight = Number(
    (previewDistance * Math.tan((previewAngle * Math.PI) / 180) + 1.5).toFixed(1),
  );

  const searchResults = searchCurriculum(searchQuery, {
    subject: selectedSubjectFilter as any,
    onlyDemos: !searchQuery.trim(),
    limit: 6,
  });

  const showcases = {
    heart: {
      subject: 'Science · Unit 14 (14.15)',
      title: 'How does the human heart pump blood without mixing oxygen-rich and oxygen-poor loops?',
      lessonTitle: 'Human Heart 3D Cutaway & Double Circulation',
      description:
        'Rotate a 3D cutaway model of the heart, open the anterior wall to inspect all four chambers, major vessels, and one-way valves, or trace double circulation in a full 2D diagram.',
      route: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
      accent: 'var(--science)',
      tint: 'var(--science-tint)',
      highlights: ['3D rotatable cutaway', '4 chambers + 4 valves', 'Full interactive 2D diagram'],
    },
    trig: {
      subject: 'Mathematics · Chapter 6 (6.3)',
      title: 'How can you measure the height of a lighthouse or building without climbing it?',
      lessonTitle: 'Heights and Distances — Clinometer Workbench',
      description:
        'Explore angles of elevation and depression with a virtual clinometer, inspect exact surd values (30°, 45°, 60°), and test boundary cases with step-by-step KaTeX derivations.',
      route: '/class-10/mathematics/maths-06/maths-06-03',
      accent: 'var(--math)',
      tint: 'var(--math-tint)',
      highlights: ['Elevation & depression modes', 'Live right-triangle visual', 'Step-by-step formula'],
    },
    chem: {
      subject: 'Science · Unit 10 (10.1)',
      title: 'What happens to atoms when substances combine, split apart, or swap places?',
      lessonTitle: 'Types of Chemical Reactions Virtual Lab',
      description:
        'Predict the reaction type, run a safe virtual experiment, balance stoichiometric coefficients, and verify atom conservation particle by particle.',
      route: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
      accent: 'var(--science)',
      tint: 'var(--science-tint)',
      highlights: ['Safe virtual experiment', 'Interactive equation balancer', 'Particle conservation view'],
    },
    tamil: {
      subject: 'தமிழ் · இயல் 4 (மணற்கேணி)',
      title: 'பிறமொழி அறிவியல் மற்றும் இலக்கியக் கருத்துகளைத் தமிழில் மொழிபெயர்ப்பது எப்படி?',
      lessonTitle: 'மொழிபெயர்ப்புக் கல்வி & இலக்கணம் – பொது',
      description:
        'தெளிவான தமிழ் எழுத்துருவில் மொழிபெயர்ப்புக் கல்வி, திணை-பால்-எண்-இடம் இலக்கணப் பயிற்சிகள் மற்றும் வழாநிலை/வழுவமைதி சோதனைகளை ஆராயுங்கள்.',
      route: '/class-10/tamil/tamil-04/tamil-04-01',
      accent: 'var(--tamil)',
      tint: 'var(--tamil-tint)',
      highlights: ['தெளிவான தமிழ் எழுத்துரு', 'இலக்கண வகைப்பாடு பயிற்சி', 'மொழிபெயர்ப்பு ஒப்பீடு'],
    },
  };

  const subjectDescriptions: Record<
    string,
    { question: string; summary: string; readyLabel: string; sampleRoute: string }
  > = {
    science: {
      question: 'How do forces, light, chemical reactions, and living systems work?',
      summary:
        'Explore full Unit 14 (Heart 3D + Plant/Blood labs), safe chemistry reactions, and 3D Molecules & Plant Anatomy.',
      readyLabel: 'Full Unit 14 + 3D Labs (Units 7, 10, 11, 12, 14) ready',
      sampleRoute: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
    },
    mathematics: {
      question: 'How do functions, algebra, and geometry solve real-world problems?',
      summary:
        'Master full Chapter 6 Trigonometry (identities + clinometer) and interactive 3D Mensuration solids & nets (Chapter 7).',
      readyLabel: 'Full Ch. 6 Trigonometry + Ch. 7 3D Mensuration ready',
      sampleRoute: '/class-10/mathematics/maths-07/maths-07-02',
    },
    english: {
      question: 'How do stories, poems, and viewpoints shape meaning and empathy?',
      summary:
        'Sequence narrative turning points, analyze sonnet structure, and compare perspectives across all 3 Unit 1 texts.',
      readyLabel: 'Full Unit 1 ready (His First Flight, Life, The Tempest)',
      sampleRoute: '/class-10/english/english-01/english-01-prose',
    },
    tamil: {
      question: 'மொழி, இலக்கியம் மற்றும் கற்கண்டு இலக்கணத்தை எளிமையாகக் கற்பது எப்படி?',
      summary:
        'செய்யுள், உரைநடை, விரிவானம் மற்றும் திணை-பால்-எண்-இடம் இலக்கணப் பயிற்சிகள்.',
      readyLabel: 'இயல் 4 மணற்கேணி முழுவதும் (4/4 பாடங்கள்) தயார்',
      sampleRoute: '/class-10/tamil/tamil-04/tamil-04-01',
    },
    social_science: {
      question: 'How do history, geography, civics, and economics connect our world?',
      summary:
        'Explore full History Unit 1 (WWI, Russian Revolution, League of Nations) plus the 3D India Relief & Drainage Atlas.',
      readyLabel: 'Full History Unit 1 + 3D Geography Unit 1 Atlas ready',
      sampleRoute: '/class-10/social_science/social-geography-01/social-geography-01-auto-1-2-major-physiographic',
    },
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-12">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear Promise & 2 Primary Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-tint)] text-[var(--primary)] text-sm font-bold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Class 10 · Tamil Nadu State Board</span>
            </div>

            <div className="space-y-3">
              <h1
                style={{ textWrap: 'balance' }}
                className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[var(--ink)] leading-[1.12]"
              >
                Learn by seeing. Understand by doing.
              </h1>
              <p className="text-lg sm:text-xl font-bold text-[var(--primary)]">
                Don&apos;t just read the lesson. Step inside it.
              </p>
            </div>

            <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed max-w-[60ch]">
              Explore Tamil Nadu Class 10 with hands-on science, visual maths, interactive stories,
              Tamil language practice and more. Free to explore. No account needed.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                to="/class-10"
                className="px-6 py-3.5 min-h-[48px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Explore Class 10</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart"
                className="px-6 py-3.5 min-h-[48px] rounded-[12px] border-2 border-[var(--primary)] bg-[var(--surface)] hover:bg-[var(--primary-tint)] text-[var(--primary)] font-bold text-base inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Try a pilot lesson</span>
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-muted)] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                100% free &amp; no login
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                Learn at your own pace (no timers)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                3D + 2D &amp; text options
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Visual Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--viewer-bg)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold text-[var(--ink)]">
                  Step inside a Class 10 lesson
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)] text-xs font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Interactive lessons ready
                </span>
              </div>

              {/* Purposeful Educational Illustration & Live Mini-Control */}
              <div className="rounded-[18px] bg-[var(--surface)] border border-[var(--line)] p-4 sm:p-5 space-y-4">
                <svg
                  viewBox="0 0 540 230"
                  className="w-full h-auto rounded-[12px]"
                  role="img"
                  aria-label="Interactive learning preview showing Science 3D Heart Cutaway, Mathematics Heights and Distances right triangle, Tamil Manarkeni, and English His First Flight"
                >
                  {/* Subtle studio grid */}
                  <g stroke="var(--line)" strokeWidth="1" opacity="0.6">
                    <line x1="0" y1="60" x2="540" y2="60" />
                    <line x1="0" y1="120" x2="540" y2="120" />
                    <line x1="0" y1="180" x2="540" y2="180" />
                    <line x1="180" y1="0" x2="180" y2="230" />
                    <line x1="360" y1="0" x2="360" y2="230" />
                  </g>

                  {/* Left Panel: Science 3D/2D Heart Cutaway */}
                  <rect
                    x="14"
                    y="14"
                    width="162"
                    height="202"
                    rx="14"
                    fill="#E8F6F4"
                    stroke="#0B7773"
                    strokeWidth="2"
                  />
                  <text x="28" y="36" fill="#0B7773" fontSize="11" fontWeight="bold">
                    SCIENCE · UNIT 14
                  </text>
                  <circle cx="95" cy="112" r="46" fill="#FFFFFF" stroke="#0B7773" strokeWidth="2" />
                  <path
                    d="M73 104 C73 82, 95 82, 95 100 C95 82, 117 82, 117 104 C117 126, 95 144, 95 150 C95 144, 73 126, 73 104 Z"
                    fill="#C83E4D"
                    fillOpacity="0.22"
                    stroke="#C83E4D"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M86 80 L86 60 M104 80 L104 56"
                    stroke="#2B6CB0"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <text x="28" y="182" fill="#13213A" fontSize="12" fontWeight="bold">
                    Human Heart 3D/2D
                  </text>
                  <text x="28" y="199" fill="#2C3E55" fontSize="10.5">
                    Rotate &amp; trace blood flow
                  </text>

                  {/* Center Panel: Live Responsive Trigonometry Triangle */}
                  <rect
                    x="188"
                    y="14"
                    width="164"
                    height="202"
                    rx="14"
                    fill="#F0ECFC"
                    stroke="#7155C8"
                    strokeWidth="2"
                  />
                  <text x="202" y="36" fill="#7155C8" fontSize="11" fontWeight="bold">
                    MATHS · CHAPTER 6
                  </text>
                  <polygon
                    points={`208,158 326,158 326,${Math.max(54, 158 - Math.min(98, previewHeight * 1.15))}`}
                    fill="#7155C8"
                    fillOpacity="0.2"
                    stroke="#7155C8"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="314"
                    y="146"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="#7155C8"
                    strokeWidth="1.5"
                  />
                  <text x="202" y="180" fill="#13213A" fontSize="11.5" fontWeight="bold">
                    θ = {previewAngle}° → H = {previewHeight} m
                  </text>
                  <text x="202" y="198" fill="#2C3E55" fontSize="10.5">
                    6.3 Heights &amp; Distances
                  </text>

                  {/* Right Panel: Tamil & English Cards */}
                  <rect
                    x="364"
                    y="14"
                    width="162"
                    height="95"
                    rx="14"
                    fill="#FDECF2"
                    stroke="#C04F75"
                    strokeWidth="2"
                  />
                  <text
                    x="376"
                    y="36"
                    fill="#C04F75"
                    fontSize="10.5"
                    fontWeight="bold"
                    lang="ta"
                    className="font-tamil"
                  >
                    தமிழ் · இயல் 4
                  </text>
                  <text
                    x="376"
                    y="60"
                    fill="#13213A"
                    fontSize="12.5"
                    fontWeight="bold"
                    lang="ta"
                    className="font-tamil"
                  >
                    மணற்கேணி
                  </text>
                  <text
                    x="376"
                    y="80"
                    fill="#2C3E55"
                    fontSize="9.2"
                    lang="ta"
                    className="font-tamil"
                  >
                    மொழிபெயர்ப்பு · இலக்கணம்
                  </text>
                  <text x="376" y="97" fill="#C04F75" fontSize="10" fontWeight="bold">
                    Interactive Tamil Studio
                  </text>

                  <rect
                    x="364"
                    y="121"
                    width="162"
                    height="95"
                    rx="14"
                    fill="#E9F3FC"
                    stroke="#3478C0"
                    strokeWidth="2"
                  />
                  <text x="378" y="143" fill="#3478C0" fontSize="11" fontWeight="bold">
                    ENGLISH · UNIT 1
                  </text>
                  <text x="378" y="165" fill="#13213A" fontSize="12.5" fontWeight="bold">
                    His First Flight
                  </text>
                  <text x="378" y="184" fill="#2C3E55" fontSize="10.5">
                    Life · The Tempest
                  </text>
                  <text x="378" y="202" fill="#3478C0" fontSize="10" fontWeight="bold">
                    Interactive Story Stage
                  </text>
                </svg>

                {/* Try-it-right-here slider + quick lesson links */}
                <div className="pt-2 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <label
                      htmlFor="hero-angle-slider"
                      className="text-xs font-bold text-[var(--ink)] whitespace-nowrap"
                    >
                      Try angle (θ): {previewAngle}°
                    </label>
                    <input
                      id="hero-angle-slider"
                      type="range"
                      min={20}
                      max={65}
                      step={5}
                      value={previewAngle}
                      onChange={(e) => setPreviewAngle(Number(e.target.value))}
                      className="w-full max-w-[140px] accent-[var(--math)]"
                    />
                    <span className="text-xs font-mono-tabular font-semibold text-[var(--math)]">
                      H = {previewHeight} m
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart"
                      className="px-3 py-1.5 min-h-[38px] rounded-lg bg-[var(--science-tint)] text-[var(--science)] font-bold text-xs inline-flex items-center gap-1 hover:underline"
                    >
                      <span>3D Heart</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/class-10/mathematics/maths-06/maths-06-03"
                      className="px-3 py-1.5 min-h-[38px] rounded-lg bg-[var(--math-tint)] text-[var(--math)] font-bold text-xs inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Trigonometry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTINUE LEARNING (Rendered only if the student has actual local history) */}
      {record.visitedSections.length > 0 && record.lastVisitedRoute && (
        <section
          aria-label="Continue your study session"
          className="max-w-[1240px] mx-auto px-4 sm:px-6 -mt-8"
        >
          <div className="rounded-[20px] border-2 border-[var(--primary)]/30 bg-[var(--surface)] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[var(--shadow-card)]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                <Clock className="w-4 h-4" />
                <span>Continue where you left off</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ink)]">
                {record.lastLessonState?.title ?? 'Resume your last Class 10 topic'}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {record.lastLessonState?.unitTitle
                  ? `${record.lastLessonState.unitTitle} · Step: ${record.lastLessonState.step}`
                  : `You have explored ${record.visitedSections.length} topic${record.visitedSections.length === 1 ? '' : 's'
                  } on this device.`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={record.lastVisitedRoute}
                className="px-5 py-3 min-h-[44px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors"
              >
                <span>Resume lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. REAL PLAYABLE LESSON SHOWCASE ("Step inside an interactive lesson") */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              Try an interactive lesson right now
            </h2>
            <p className="text-base text-[var(--text)]">
              Pick a question below to jump straight into a working Class 10 visual experiment.
            </p>
          </div>
          <div
            role="group"
            aria-label="Choose a featured interactive lesson"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-[14px] bg-[var(--surface)] border border-[var(--line)]"
          >
            {(
              [
                ['heart', 'Science: 3D Heart'],
                ['trig', 'Maths: Trigonometry'],
                ['chem', 'Science: Reactions Lab'],
                ['tamil', 'தமிழ்: மணற்கேணி'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveShowcaseId(key)}
                aria-pressed={activeShowcaseId === key}
                className={`px-3.5 py-2 min-h-[42px] rounded-[10px] text-sm font-bold transition-colors whitespace-nowrap ${activeShowcaseId === key
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)]'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{ backgroundColor: showcases[activeShowcaseId].tint }}
          className="rounded-[24px] border border-[var(--line)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>{showcases[activeShowcaseId].subject} · Interactive lesson ready</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--ink)]">
              {showcases[activeShowcaseId].title}
            </h3>
            <p className="text-base text-[var(--text)] leading-relaxed">
              {showcases[activeShowcaseId].description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {showcases[activeShowcaseId].highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 rounded-lg bg-[var(--surface)]/90 border border-[var(--line)] text-xs font-semibold text-[var(--ink)]"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Link
              to={showcases[activeShowcaseId].route}
              className="px-6 py-3.5 min-h-[48px] rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start this lesson</span>
            </Link>
            <Link
              to="/arcade"
              className="px-5 py-3 min-h-[44px] rounded-[12px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--ink)] font-semibold text-sm inline-flex items-center justify-center gap-1.5"
            >
              <span>Explore all interactive tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FIVE SUBJECT WORLDS + GAMES & PRACTICE */}
      <section id="subject-worlds" className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              Choose your Class 10 subject
            </h2>
            <p className="text-base text-[var(--text)]">
              Every subject combines visual models, clear explanations, and low-pressure practice.
            </p>
          </div>
          <Link
            to="/class-10"
            className="text-sm font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
          >
            <span>View full Class 10 overview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const desc = subjectDescriptions[sub.slug];
            return (
              <div
                key={sub.slug}
                style={{ backgroundColor: sub.tint_token }}
                className="rounded-[20px] border border-[var(--line)] p-6 flex flex-col justify-between space-y-5 transition-all hover:border-[var(--primary)] shadow-[var(--shadow-card)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {sub.world_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)]">
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

                  <p className="text-sm font-bold text-[var(--ink)]">
                    {desc?.question}
                  </p>

                  <p
                    lang={sub.slug === 'tamil' ? 'ta' : undefined}
                    className={`text-sm text-[var(--text)] leading-relaxed ${sub.slug === 'tamil' ? 'font-tamil' : ''
                      }`}
                  >
                    {desc?.summary ?? sub.tagline}
                  </p>

                  {sub.strands && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {sub.strands.map((st) => (
                        <Link
                          key={st.slug}
                          to={`/class-10/social_science/${st.slug}`}
                          className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:border-[var(--primary)]"
                        >
                          {st.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--line)]/80 flex items-center justify-between gap-2">
                  <Link
                    to={`/class-10/${sub.slug}`}
                    className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white text-[var(--ink)] border border-[var(--line)] text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Explore {sub.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {desc?.sampleRoute && (
                    <Link
                      to={desc.sampleRoute}
                      className="text-xs font-bold text-[var(--primary)] hover:underline px-2 py-2"
                    >
                      Try sample lesson →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* 6th Card: Games & Practice Arcade */}
          <div
            style={{ backgroundColor: 'var(--arcade-tint)' }}
            className="rounded-[20px] border border-[var(--line)] p-6 flex flex-col justify-between space-y-5 transition-all hover:border-[var(--primary)] shadow-[var(--shadow-card)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--arcade)]">
                  Games &amp; Practice
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)]">
                  Untimed
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-[var(--ink)]">
                <Link to="/arcade" className="hover:underline">
                  Learning Arcade
                </Link>
              </h3>

              <p className="text-sm font-bold text-[var(--ink)]">
                Want to test your understanding without countdown timers or pressure?
              </p>

              <p className="text-sm text-[var(--text)] leading-relaxed">
                Play concept-sorting challenges, flip self-rated flashcards, and explore all 13
                interactive science, maths, language and map tools in one place.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--line)]/80 flex items-center justify-between gap-2">
              <Link
                to="/arcade"
                className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white text-[var(--ink)] border border-[var(--line)] text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Open Arcade</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/flashcards"
                className="text-xs font-bold text-[var(--primary)] hover:underline px-2 py-2"
              >
                Flashcards &amp; Quizzes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4B. ALL 9 INTERACTIVE 3D LABS ACROSS ALL 5 SUBJECTS */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            All 5 Subjects in 3D · Visual &amp; Hands-On First (With 2D/Text Fallback)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
            Step inside 9 Class 10 3D visual labs — understand without rote memorising
          </h2>
          <p className="text-base text-[var(--text)]">
            Every subject — Science, Mathematics, English, Tamil, and Social Science — features
            interactive 3D dioramas and virtual mixing labs that stay fast, calm, and keyboard-accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              tag: 'Science Unit 10 · Mixing Lab',
              title: '3D Chemistry Mixing Bench',
              desc: 'Pick any 2 reagents (Zn, Cu, HCl, Pb(NO₃)₂, KI, NaOH, Heat) and pour into a 3D flask to watch bubbles, yellow precipitates, or activity-series limits.',
              route: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
            },
            {
              tag: 'Science Unit 14',
              title: '3D Human Heart Cutaway',
              desc: 'Four chambers, septum, valves, vena cava, pulmonary vessels & 6-station double circulation.',
              route: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
            },
            {
              tag: 'Mathematics Ch. 6',
              title: '3D Trigonometry Lighthouse Survey',
              desc: 'Move the surveyor & laser line-of-sight beam in 3D to see why tan(θ) = Opposite / Adjacent.',
              route: '/class-10/mathematics/maths-06/maths-06-03',
            },
            {
              tag: 'Mathematics Ch. 7',
              title: '3D Mensuration Solids & Nets',
              desc: 'Slice & orbit Cylinder, Hollow Cylinder, Cone, Sphere, Hemisphere, Frustum & Combined Solid (π = 22/7).',
              route: '/class-10/mathematics/maths-07/maths-07-02',
            },
            {
              tag: 'English Unit 1',
              title: '3D Story & Verse Diorama',
              desc: 'Watch the young seagull leap from the cliff (His First Flight), Prospero’s island (The Tempest) & Life’s winding hilltop in 3D.',
              route: '/class-10/english/english-01/english-01-prose',
            },
            {
              tag: 'தமிழ் இயல் 4',
              title: '3D தமிழ் ஐம்பால் & மொழிபெயர்ப்பு அரங்கு',
              desc: 'உயர்திணை (3) + அஃறிணை (2) 3D தூண்கள் மற்றும் மொழிபெயர்ப்புப் பாலத்தின் வழியாக இலக்கணத்தை உடனே புரிந்துகொள்ளுங்கள்.',
              route: '/class-10/tamil/tamil-04/tamil-04-04',
            },
            {
              tag: 'Science Unit 7',
              title: '3D Atoms & Molecules Builder',
              desc: 'Orbit H₂O, CO₂ & CH₄ ball-and-stick geometries with Table 7.1 atomic mass & % composition.',
              route: '/class-10/science/science-07/science-07-auto-7-2-molecule-and',
            },
            {
              tag: 'Science Unit 11 & 12',
              title: '3D Carbon Bonds & Plant Anatomy',
              desc: 'Inspect C=C / C≡C molecules, 3D Dicot Root Casparian strips & Chloroplast grana/stroma.',
              route: '/class-10/science/science-12/science-12-auto-12-3-internal-structure-of',
            },
            {
              tag: 'Geography Unit 1',
              title: '3D India Relief & Drainage Atlas',
              desc: 'Schematic 3D Himalayas, Great Plains, Deccan Plateau, Coasts, Islands & toggleable river flows.',
              route: '/class-10/social_science/social-geography-01/social-geography-01-auto-1-2-major-physiographic',
            },
          ].map((lab) => (
            <Link
              key={lab.route}
              to={lab.route}
              className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] p-5 flex flex-col justify-between gap-3 transition-colors shadow-[var(--shadow-card)]"
            >
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--primary-tint)] text-[var(--primary)] text-xs font-bold">
                  {lab.tag} · 3D + 2D
                </span>
                <h3 className="text-lg font-extrabold text-[var(--ink)]">{lab.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">{lab.desc}</p>
              </div>
              <span className="text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1">
                <span>Launch 3D lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS IN 3 SIMPLE STEPS */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
            How Katrio works
          </h2>
          <p className="text-base text-[var(--text)]">
            A calm, predictable learning flow designed so you can focus on one idea at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: 'Step 1 · Explore',
              title: 'See the concept in action',
              text: 'Open your Class 10 chapter and manipulate a 3D model, geometry diagram, story timeline, or virtual lab bench.',
              icon: Compass,
            },
            {
              step: 'Step 2 · Understand & Try',
              title: 'Change one variable and observe',
              text: 'Read a clear explanation with units and formulas, pause or replay any step, or switch to a 2D diagram whenever you prefer.',
              icon: BookOpen,
            },
            {
              step: 'Step 3 · Check yourself',
              title: 'Practice without pressure',
              text: 'Answer an untimed concept question with helpful hints and clear explanations of why each answer works.',
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3 shadow-[var(--shadow-card)]"
              >
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  <Icon className="w-4 h-4" />
                  <span>{item.step}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[var(--ink)]">{item.title}</h3>
                <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BILINGUAL TOPIC FINDER ("Find a chapter or topic") */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
                Find a chapter or topic
              </h2>
              <p className="text-sm sm:text-base text-[var(--text)]">
                Search in English or Tamil (for example:{' '}
                <button
                  type="button"
                  onClick={() => setSearchQuery('Heights and Distances')}
                  className="text-[var(--primary)] underline font-semibold"
                >
                  Heights and Distances
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => setSearchQuery('His First Flight')}
                  className="text-[var(--primary)] underline font-semibold"
                >
                  His First Flight
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => setSearchQuery('மணற்கேணி')}
                  className="text-[var(--primary)] underline font-semibold font-tamil"
                  lang="ta"
                >
                  மணற்கேணி
                </button>
                ).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <label htmlFor="landing-curriculum-search" className="sr-only">
                Search Class 10 chapters and topics
              </label>
              <Search className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="landing-curriculum-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by chapter name, topic, or Tamil title..."
                className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] text-base text-[var(--ink)]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {[
                { id: 'all', label: 'All Subjects' },
                { id: 'science', label: 'Science' },
                { id: 'mathematics', label: 'Maths' },
                { id: 'english', label: 'English' },
                { id: 'tamil', label: 'தமிழ்' },
                { id: 'social_science', label: 'Social' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSubjectFilter(tab.id)}
                  className={`px-3.5 py-2 min-h-[44px] rounded-[12px] text-sm font-semibold border transition-colors whitespace-nowrap ${selectedSubjectFilter === tab.id
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text)] border-[var(--line)] hover:text-[var(--ink)]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-[16px] overflow-hidden">
            {searchResults.map((item) => {
              const badgeText = item.hasDemo
                ? 'Interactive lesson ready'
                : item.sourceStatus === 'auto_extracted_review_required'
                  ? 'Title under review'
                  : 'Lesson in preparation';
              return (
                <Link
                  key={`${item.kind}-${item.id}`}
                  to={item.route}
                  className="p-4 sm:p-5 bg-[var(--surface)] hover:bg-[var(--surface-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
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
                        {badgeText}
                      </span>
                    </div>
                    <h3
                      lang={item.subject === 'tamil' ? 'ta' : undefined}
                      className={`text-base font-bold text-[var(--ink)] ${item.subject === 'tamil' ? 'font-tamil' : ''
                        }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">{item.subtitle}</p>
                  </div>
                  <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap inline-flex items-center gap-1.5">
                    <span>{item.hasDemo ? 'Start lesson' : 'Open topic'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. ACCESSIBILITY & TEACHER HIGHLIGHTS */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-[var(--shadow-card)]">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Inclusive &amp; Attention-Friendly by Design</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--ink)]">
              Learning works differently for everyone.
            </h2>
            <p className="text-base text-[var(--text)] leading-relaxed">
              Every 3D activity has a complete 2D diagram and text pathway teaching the exact same
              concept. Turn on Focus view to hide sidebars, reduce motion, or scale English and
              Tamil text sizes anytime.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => updatePreferences({ prefer2DPathway: !preferences.prefer2DPathway })}
              aria-pressed={preferences.prefer2DPathway}
              className="px-4 py-2.5 min-h-[44px] rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--ink)] hover:border-[var(--primary)]"
            >
              {preferences.prefer2DPathway ? '✓ 2D / Text Default On' : 'Prefer 2D / Text Mode'}
            </button>
            <button
              type="button"
              onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
              aria-pressed={preferences.reducedMotion}
              className="px-4 py-2.5 min-h-[44px] rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--ink)] hover:border-[var(--primary)]"
            >
              {preferences.reducedMotion ? '✓ Reduced Motion On' : 'Reduce Motion'}
            </button>
            <Link
              to="/accessibility"
              className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--primary)] text-white text-sm font-bold inline-flex items-center"
            >
              All Learning Settings →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-[var(--shadow-card)]">
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--science)]">
              For Teachers, Schools &amp; Families
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--ink)]">
              Built for curiosity. Useful in classrooms.
            </h2>
            <p className="text-base text-[var(--text)] leading-relaxed">
              Project interactive diagrams in class, jump to any textbook page number, and see clear
              status indicators showing which lessons are live now versus in preparation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/teachers"
              className="px-4 py-2.5 min-h-[44px] rounded-[12px] bg-[var(--primary)] text-white text-sm font-bold inline-flex items-center gap-1.5"
            >
              <span>Teacher Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/roadmap"
              className="px-4 py-2.5 min-h-[44px] rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--ink)] inline-flex items-center"
            >
              Lesson availability &amp; roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* 8. COMPACT FAQ */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
          Common questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: 'Do I need an account or login?',
              a: 'No. Katrio requires zero sign-up, zero email, and zero personal profile. Your preferences and study progress stay on your device only.',
            },
            {
              q: 'Is it completely free?',
              a: 'Yes. Student and teacher access to Katrio is completely free with no subscriptions or advertisements.',
            },
            {
              q: 'Does it work on budget phones or without 3D?',
              a: 'Yes. 3D models load only when you open them, and every lesson includes a full 2D diagram and text mode that works on any device.',
            },
            {
              q: 'Are all Class 10 chapters interactive right now?',
              a: 'All 72 chapters and 691 textbook topics are organized and searchable today. Flagship interactive lessons are live now, and topics still in preparation are clearly labelled.',
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5 space-y-1.5"
            >
              <h3 className="text-base font-extrabold text-[var(--ink)]">{faq.q}</h3>
              <p className="text-sm text-[var(--text)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
