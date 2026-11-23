import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Breadcrumbs } from '../components/chrome/Breadcrumbs';
import { EngineShell } from '../components/engines/EngineShell';
import { VisualFlashcardDeck } from '../components/engines/VisualFlashcardDeck';
import {
  curriculumRegistry,
  getSubjects,
  getUnitsBySubject,
} from '../utils/curriculumStore';
import { useProgress } from '../features/local-progress/ProgressContext';
import {
  createInitialProgressRecord,
  getCompletedSectionCount,
} from '../features/local-progress/progressStore';
import type { EngineType } from '../types/curriculum';
import { GATE2_WORKING_PILOTS } from '../data/universeWorlds';

const ALL_ENGINES: {
  engine: EngineType;
  title: string;
  subjectLabel: string;
  sampleRoute: string;
  description: string;
}[] = [
    {
      engine: 'ModelExplorer3D',
      title: '3D Anatomical & Solid Cutaway Explorer',
      subjectLabel: 'Science Unit 14 (Pilot) · Maths Chapter 7',
      sampleRoute: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
      description: 'Rotate, zoom, isolate layers, adjust cutaway cross-section or switch to 2D diagram.',
    },
    {
      engine: 'JourneyThrough',
      title: 'Station-by-Station Circulation & Transport Journey',
      subjectLabel: 'Science Units 14, 15, 16',
      sampleRoute: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
      description: 'Step forward and backward through biological and resource pathways at your own pace.',
    },
    {
      engine: 'SafeVirtualLab',
      title: 'Chemical Reaction & Conservation Lab',
      subjectLabel: 'Science Unit 10 (Pilot) · Units 8, 9, 18',
      sampleRoute: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
      description: 'Predict reaction types, balance equations, run safe conceptual experiments and verify atom conservation.',
    },
    {
      engine: 'PhysicsWorkbench',
      title: 'Cause-and-Effect Physics Workbench',
      subjectLabel: 'Science Units 1, 2, 3, 4, 5',
      sampleRoute: '/class-10/science/science-01/science-01-auto-1-1-force-and-motion',
      description: 'Adjust force, mass or circuit values and see live vector and formula updates.',
    },
    {
      engine: 'GraphSandbox',
      title: 'Algebra & Function Graph Explorer',
      subjectLabel: 'Mathematics Chapters 1, 2, 3, 5, 8',
      sampleRoute: '/class-10/mathematics/maths-03/maths-03-07',
      description: 'Change quadratic and linear coefficients to see real-time coordinate curves and roots.',
    },
    {
      engine: 'GeometryWorkbench',
      title: 'Heights, Distances & Geometry Explorer',
      subjectLabel: 'Mathematics Chapter 6 (Pilot) · Chapter 4',
      sampleRoute: '/class-10/mathematics/maths-06/maths-06-03',
      description: 'Adjust clinometer angle of elevation or depression and horizontal distance with step-by-step derivations.',
    },
    {
      engine: 'TimelineMap',
      title: 'Historical Cause & Consequence Timeline',
      subjectLabel: 'Social Science History Unit 1 (Pilot) · Units 1–10',
      sampleRoute: '/class-10/social_science/social-history-01/social-history-01-auto-1-3-causes-course-and',
      description: 'Explore historical turning points, causes, consequences, and schematic theatres in chronological order.',
    },
    {
      engine: 'GeoMap',
      title: 'Layered Terrain, River & Monsoon Map',
      subjectLabel: 'Social Science Geography Units 1–7',
      sampleRoute: '/class-10/social_science/social-geography-01/social-geography-01-auto-1-2-major-physiographic',
      description: 'Toggle landforms, drainage and climate layers with zero location tracking.',
    },
    {
      engine: 'StoryStage',
      title: 'English Prose, Poem & Character Stage',
      subjectLabel: 'English Unit 1 (Pilot) · Units 1–7',
      sampleRoute: '/class-10/english/english-01/english-01-prose',
      description: 'Sequence narrative turning points, compare character perspectives and practice vocabulary in context.',
    },
    {
      engine: 'TamilLanguageStudio',
      title: 'தமிழ் மொழி, இலக்கியம் மற்றும் இலக்கணக் கூடம்',
      subjectLabel: 'தமிழ் இயல் 4 (Pilot) · இயல்கள் 1–7',
      sampleRoute: '/class-10/tamil/tamil-04/tamil-04-01',
      description: 'First-class Tamil typography, திணை-பால்-எண்-இடம் grammar builder and translation studio.',
    },
    {
      engine: 'Flashcards',
      title: 'Self-Paced Flashcard Deck',
      subjectLabel: 'All 5 Subjects',
      sampleRoute: '/flashcards',
      description: 'Flip cards and mark Know or Review Again locally on your device.',
    },
    {
      engine: 'QuizEngine',
      title: 'Untimed Concept Check',
      subjectLabel: 'All 5 Subjects',
      sampleRoute: '/quizzes',
      description: 'Practice with optional hints and clear explanations of why each answer works.',
    },
    {
      engine: 'ConceptGame',
      title: 'Concept Sorting Challenge',
      subjectLabel: 'All 5 Subjects · Civics · Science',
      sampleRoute: '/arcade',
      description: 'Sort and match curriculum concepts using accessible click or keyboard controls.',
    },
  ];

export function ArcadePage() {
  const [selectedEngine, setSelectedEngine] = useState<EngineType>('ModelExplorer3D');
  const activeMeta =
    ALL_ENGINES.find((e) => e.engine === selectedEngine) ?? ALL_ENGINES[0];

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Games & Practice Arcade' }]} />

      <div
        style={{ backgroundColor: 'var(--arcade-tint)' }}
        className="rounded-[24px] border border-[var(--line)] p-6 sm:p-8 space-y-4"
      >
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--arcade)]">
          Cross-Subject Challenge Arcade · Zero Timers · Zero Leaderboards
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--ink)]">
          Practice without the pressure
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl">
          Connect Maths, Science, Geography, Economics, and English/Tamil in our flagship untimed
          capstone mission, launch any subject pilot, or try interactive tools live below.
        </p>

        {/* Flagship Cross-Subject Capstone Card */}
        <div className="rounded-[20px] border-2 border-[var(--arcade)]/40 bg-[var(--surface)] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-[var(--shadow-card)]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--arcade-tint)] text-[var(--arcade)] text-xs font-extrabold">
              <span>★ Flagship Capstone Quest · 4 Untimed Stages · Local Save &amp; Resume</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--ink)]">
              Design a Sustainable Tamil Nadu Town
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
              Choose a TN climate zone (Cauvery Delta, Rain-Shadow Coimbatore, or Coastal Chennai),
              size a cylinder/hemisphere overhead tank (Maths Ch. 7, π = 22/7), plan LED + wind
              energy (Science U4 &amp; U22), balance a 100-unit municipal budget (Economics U4
              educational model), and write a bilingual citizen proposal!
            </p>
          </div>
          <Link
            to="/arcade/sustainable-tn-town"
            className="px-5 py-3 min-h-[48px] rounded-[14px] bg-[var(--arcade)] hover:opacity-95 text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shrink-0"
          >
            <span>Play Sustainable TN Town</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Showcase Subject Pilots */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--ink)]">
              Flagship Interactive Pilots Across All 5 Subjects
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Jump directly into verified concept-first lessons with working models, transfer checks, and zero timers.
            </p>
          </div>
          <div className="flex gap-3 text-xs font-bold">
            <Link to="/flashcards" className="text-[var(--primary)] hover:underline">
              Flashcards →
            </Link>
            <Link to="/quizzes" className="text-[var(--primary)] hover:underline">
              Concept Quizzes →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GATE2_WORKING_PILOTS.map((pilot) => (
            <Link
              key={pilot.id}
              to={pilot.route}
              className="p-4 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] flex flex-col justify-between gap-2 transition-colors"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-[var(--primary)]">
                  {pilot.pilotCode}
                </div>
                <div className="text-sm font-extrabold text-[var(--ink)] leading-snug">
                  {pilot.title}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{pilot.microMissionGoal}</p>
              </div>
              <span className="text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1 pt-1">
                <span>Open mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_ENGINES.map((item) => (
          <button
            key={item.engine}
            type="button"
            onClick={() => setSelectedEngine(item.engine)}
            aria-pressed={selectedEngine === item.engine}
            className={`p-4 rounded-[18px] border text-left transition-all flex flex-col justify-between gap-2 ${selectedEngine === item.engine
              ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
              : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
              }`}
          >
            <div>
              <div className="text-sm font-bold">{item.title}</div>
            </div>
            <div
              className={`text-xs ${selectedEngine === item.engine ? 'text-white/90' : 'text-[var(--text-muted)]'
                }`}
            >
              {item.subjectLabel}
            </div>
          </button>
        ))}
      </div>

      {/* Live Working Activity */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--ink)]">
              Try Now: {activeMeta.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text)]">{activeMeta.description}</p>
          </div>
          <Link
            to={activeMeta.sampleRoute}
            className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
          >
            <span>Open full lesson</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <EngineShell
          key={activeMeta.engine}
          engine={activeMeta.engine}
          sectionId={`arcade-${activeMeta.engine}`}
          sectionTitle={activeMeta.title}
          unitTitle={activeMeta.subjectLabel}
          printedPage={1}
          representationStatus="Conceptual schematic"
          accessibilityFallbackText={`Complete 2D/Text equivalent for ${activeMeta.title}.`}
          defaultMode="demo"
          hasPilotDemo={true}
        />
      </div>
    </div>
  );
}

export function FlashcardsPage() {
  const { record } = useProgress();
  const ratedCount = Object.keys(record.flashcardRatings).length;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-14 space-y-6">
      <Breadcrumbs items={[{ label: 'Flashcards' }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            Visual 3D-Flip Study Cards · Saved Locally
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            Class 10 Flashcard Decks
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Tap any card to flip it over, inspect the visual cue, and rate Know or Review Again.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] shrink-0">
          Cards reviewed on this device: {ratedCount}
        </span>
      </div>

      <VisualFlashcardDeck />
    </div>
  );
}

export function QuizzesPage() {
  const { record } = useProgress();
  const completedCount = Object.keys(record.quizCheckpoints).length;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Quizzes' }]} />

      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Untimed Concept Checks · With Hints &amp; Explanations
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          Low-Pressure Concept Quizzes
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl">
          Every concept check in Katrio is untimed, offers an optional hint when you get stuck, and
          explains <em>why</em> an answer is right or wrong.
        </p>
        <p className="text-xs font-semibold text-[var(--text-muted)]">
          Concept checks completed on this device: {completedCount}
        </p>
      </div>

      <EngineShell
        engine="QuizEngine"
        sectionId="global-quiz-demo"
        sectionTitle="Class 10 Concept Check"
        unitTitle="Interactive Practice"
        printedPage={241}
        representationStatus="Equation-based simulation"
        accessibilityFallbackText="Untimed accessible multiple-choice concept verification with hints."
        defaultMode="demo"
        hasPilotDemo={true}
      />
    </div>
  );
}

export function TeachersPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'For Teachers & Parents' }]} />

      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--science)]">
          Classroom Projection · Textbook Page Alignment · Zero Student Accounts
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          Built for curiosity. Ready for classrooms.
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl">
          Every unit in Katrio is aligned to its Tamil Nadu State Board Class 10 textbook edition
          and printed page numbers. Teachers can project interactive models in front of the class,
          open the Textbook Pages drawer to match printed books, and switch to high-contrast or
          large-text mode for back-row visibility.
        </p>
      </div>

      <section aria-labelledby="blueprint-heading" className="space-y-4">
        <h2 id="blueprint-heading" className="text-xl font-extrabold text-[var(--ink)]">
          All 72 Class 10 Units &amp; Interactive Models
        </h2>

        <div className="border border-[var(--line)] rounded-[20px] overflow-x-auto bg-[var(--surface)]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--surface-subtle)] border-b border-[var(--line)] text-[var(--ink)]">
                <th className="py-3.5 px-4 font-bold">Chapter</th>
                <th className="py-3.5 px-4 font-bold">Interactive Focus</th>
                <th className="py-3.5 px-4 font-bold">Activity Type</th>
                <th className="py-3.5 px-4 font-bold">Textbook Pages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {curriculumRegistry.units.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--surface-subtle)]/50">
                  <td
                    lang={u.subject === 'tamil' ? 'ta' : undefined}
                    className={`py-3 px-4 font-bold text-[var(--ink)] ${u.subject === 'tamil' ? 'font-tamil' : ''
                      }`}
                  >
                    <Link to={u.route} className="text-[var(--primary)] hover:underline">
                      {u.code_label}: {u.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-[var(--text)]">{u.hero_interaction_title}</td>
                  <td className="py-3 px-4 font-mono-tabular text-xs text-[var(--primary)]">
                    {u.activity_template}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-xs text-[var(--text-muted)]">
                    pp. {u.printed_page}–{u.printed_page_end}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AccessibilityPage() {
  const { preferences, updatePreferences } = useProgress();

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Learning Settings & Accessibility' }]} />

      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Inclusive by Design · Customise Your Study View
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          Learning works differently for everyone.
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl">
          Choose your preferred colour theme, text size, motion behaviour, and 2D/text view below.
          Your preferences apply immediately across all 72 chapters and stay saved on this device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-[var(--ink)]">
            1. Colour Theme &amp; Contrast
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text)]">
            Choose warm daylight ivory, low-glare dark slate, or maximum high-contrast mode.
          </p>
          <div className="flex flex-wrap gap-2">
            {(['light', 'dark', 'high-contrast'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updatePreferences({ theme: t })}
                aria-pressed={preferences.theme === t}
                className={`px-4 py-2.5 min-h-[44px] rounded-[12px] text-xs font-bold border capitalize ${preferences.theme === t
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                  }`}
              >
                {t} Mode
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-[var(--ink)]">
            2. Text Size &amp; Tamil Script Scaling
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text)]">
            Scale English and Tamil typography comfortably without horizontal scroll traps.
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['normal', 'Standard (100%)'],
                ['large', 'Large (112.5%)'],
                ['xlarge', 'Extra Large (125%)'],
              ] as const
            ).map(([scale, label]) => (
              <button
                key={scale}
                type="button"
                onClick={() => updatePreferences({ fontScale: scale })}
                aria-pressed={preferences.fontScale === scale}
                className={`px-4 py-2.5 min-h-[44px] rounded-[12px] text-xs font-bold border ${preferences.fontScale === scale
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-[var(--ink)]">
            3. Motion &amp; Focus View
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] cursor-pointer">
              <div>
                <div className="text-sm font-bold text-[var(--ink)]">Reduce Motion</div>
                <div className="text-xs text-[var(--text-muted)]">
                  Turns off automatic 3D rotation and smooth camera transitions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.reducedMotion}
                onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
                className="w-5 h-5 accent-[var(--primary)]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] cursor-pointer">
              <div>
                <div className="text-sm font-bold text-[var(--ink)]">Distraction-Free Focus View</div>
                <div className="text-xs text-[var(--text-muted)]">
                  Hides chapter sidebars and footer navigation while you study a lesson.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.focusMode}
                onChange={(e) => updatePreferences({ focusMode: e.target.checked })}
                className="w-5 h-5 accent-[var(--primary)]"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-[var(--ink)]">
            4. 2D &amp; Text Study Pathway
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text)]">
            Prefer structured 2D diagrams and step-by-step tables instead of loading 3D scenes by
            default.
          </p>
          <button
            type="button"
            onClick={() => updatePreferences({ prefer2DPathway: !preferences.prefer2DPathway })}
            aria-pressed={preferences.prefer2DPathway}
            className={`px-4 py-2.5 min-h-[44px] rounded-[12px] text-xs font-bold border ${preferences.prefer2DPathway
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
              }`}
          >
            {preferences.prefer2DPathway
              ? '✓ Defaulting to 2D / Text View'
              : 'Use 2D / Text View by Default'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  const {
    record,
    exportProgressJsonString,
    importProgressJsonString,
    resetDeviceProgress,
  } = useProgress();

  const [jsonText, setJsonText] = useState(() => exportProgressJsonString());
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportDownload = () => {
    const current = exportProgressJsonString();
    setJsonText(current);
    try {
      const blob = new Blob([current], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `katrio-device-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: textarea updated
    }
    setFeedback({
      type: 'success',
      message: 'Exported your device study progress file (schemaVersion: "katrio-device-v1").',
    });
  };

  const handleImport = () => {
    const res = importProgressJsonString(jsonText);
    if (res.valid) {
      setFeedback({
        type: 'success',
        message: 'Successfully restored your study progress on this device.',
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.error ?? 'Invalid progress file.',
      });
    }
  };

  const handleReset = () => {
    resetDeviceProgress();
    setJsonText(JSON.stringify(createInitialProgressRecord(), null, 2));
    setConfirmReset(false);
    setFeedback({
      type: 'success',
      message: 'All local progress and preferences on this device have been reset.',
    });
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Privacy & Your Device Progress' }]} />

      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">
          No Accounts · No Tracking · Saved Only on Your Device
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          Your privacy &amp; local study progress
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl">
          Katrio never asks for your name, phone number, email, or location. Your study progress and
          display settings stay in your browser on this device. You can back up your progress to a
          file or clear it anytime.
        </p>
      </div>

      {/* Honest 4-Stage Local Progress Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="text-2xl font-extrabold text-[var(--ink)]">
            {record.visitedSections.length}
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] mt-0.5">
            1. Visited
          </div>
        </div>
        <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="text-2xl font-extrabold text-[var(--math)]">
            {(record.exploredSections ?? []).length}
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] mt-0.5">
            2. Explored Lab
          </div>
        </div>
        <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="text-2xl font-extrabold text-[var(--primary)]">
            {(record.practisedSections ?? []).length}
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] mt-0.5">
            3. Practised
          </div>
        </div>
        <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="text-2xl font-extrabold text-[var(--success)]">
            {getCompletedSectionCount(record)}
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] mt-0.5">
            4. Understood (Verified)
          </div>
        </div>
        <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 col-span-2 sm:col-span-1">
          <div className="text-2xl font-extrabold text-[var(--arcade)]">
            {(record.discoveryStamps ?? []).length}
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] mt-0.5">
            Discovery Stamps
          </div>
        </div>
      </div>

      {/* Local Discovery Stamps, Capstone Mission Status & Teach-It-Back Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-[var(--ink)]">
              Discovery Stamps &amp; Capstone Mission
            </h2>
            <Link
              to="/arcade/sustainable-tn-town"
              className="text-xs font-bold text-[var(--primary)] hover:underline"
            >
              Open TN Town Capstone →
            </Link>
          </div>
          {record.capstoneProgress?.['sustainable-tn-town'] ? (
            <div className="p-3.5 rounded-xl bg-[var(--arcade-tint)] border border-[var(--arcade)]/30 text-xs space-y-1">
              <div className="font-extrabold text-[var(--ink)]">
                Sustainable Tamil Nadu Town ·{' '}
                {record.capstoneProgress['sustainable-tn-town'].completed
                  ? '✓ Capstone Completed'
                  : `Stage ${record.capstoneProgress['sustainable-tn-town'].stage} / 4 in progress`}
              </div>
              {record.capstoneProgress['sustainable-tn-town'].summary && (
                <div className="text-[var(--text)]">
                  {record.capstoneProgress['sustainable-tn-town'].summary}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              You have not started the Sustainable Tamil Nadu Town capstone yet. Try it untimed anytime!
            </p>
          )}
          {(record.discoveryStamps ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {(record.discoveryStamps ?? []).map((stamp) => (
                <span
                  key={stamp}
                  className="px-3 py-1 rounded-full bg-[var(--success-bg)] border border-[var(--success)]/30 text-xs font-bold text-[var(--success)]"
                >
                  ★ {stamp}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              Complete untimed missions or verified checkpoints to earn calm concept stamps on this device.
            </p>
          )}
        </div>

        <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-[var(--ink)]">
              Your Saved “Teach It Back” Notes ({Object.keys(record.teachBackNotes ?? {}).length})
            </h2>
            <span className="text-[11px] font-bold text-[var(--text-muted)]">
              Stored privately in browser
            </span>
          </div>
          {Object.keys(record.teachBackNotes ?? {}).length > 0 ? (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {Object.entries(record.teachBackNotes ?? {}).map(([secId, note]) => (
                <div key={secId} className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs space-y-1">
                  <div className="font-mono-tabular text-[11px] font-bold text-[var(--primary)]">
                    {secId}
                  </div>
                  <p className="text-[var(--ink)] whitespace-pre-wrap">{note}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              When you write a short explanation in your own words inside any lesson’s “Connect &amp; Remember” tab, it appears here for quick revision.
            </p>
          )}
        </div>
      </div>

      {/* Functional Export / Import / Reset Controls */}
      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--ink)]">
              Back up, restore, or clear device data
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Format: <code className="font-mono-tabular">katrio-device-v1</code> JSON
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportDownload}
              className="min-h-[44px] px-4 py-2 rounded-[12px] bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export progress</span>
            </button>

            <button
              type="button"
              onClick={handleImport}
              className="min-h-[44px] px-4 py-2 rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-[var(--ink)] text-xs font-bold inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import progress</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[44px] px-4 py-2 rounded-[12px] border border-[var(--error)]/40 bg-[var(--error-bg)] text-[var(--error)] text-xs font-bold inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset my device progress</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] px-4 py-2 rounded-[12px] bg-[var(--error)] text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Confirm Reset All Device Data</span>
              </button>
            )}
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${feedback.type === 'success'
              ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
              : 'bg-[var(--error-bg)] border-[var(--error)]/40 text-[var(--error)]'
              }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[var(--error)] shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="progress-json-editor"
            className="block text-xs font-bold text-[var(--ink)]"
          >
            Device Progress Backup JSON (paste a backup here to import):
          </label>
          <textarea
            id="progress-json-editor"
            rows={10}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full p-4 rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] font-mono-tabular text-xs text-[var(--ink)]"
          />
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  const subjects = getSubjects();
  const totals = curriculumRegistry.audit_totals;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'About, Curriculum & Sources' }]} />

      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          About Katrio · Curriculum &amp; Source Governance
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          Independent visual learning for Tamil Nadu Class 10
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl leading-relaxed">
          Katrio (working brand) is a free, no-login interactive learning resource aligned to the
          Tamil Nadu State Board Class 10 syllabus across Mathematics, Science, English, Tamil, and
          Social Science.
        </p>
        <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs sm:text-sm space-y-2">
          <p className="font-bold text-[var(--ink)]">
            Independent Educational Resource &amp; Attribution Notice
          </p>
          <p className="text-[var(--text)]">
            Independent educational resource inspired by the Tamil Nadu State Board syllabus. Not an
            official government website. Chapter titles, section numbers, and printed page anchors
            are used strictly for curricular indexing and textbook cross-reference. No verbatim
            textbook prose, copyrighted poems, or scanned textbook figures are reproduced without
            verified rights clearance.
          </p>
        </div>
      </div>

      {/* Relocated Curriculum & Source Audit Table */}
      <section aria-labelledby="curriculum-audit-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="curriculum-audit-heading" className="text-xl font-extrabold text-[var(--ink)]">
              Curriculum &amp; Source Coverage Summary
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Complete breakdown of all {totals.units} chapters, {totals.toc_verified_sections}{' '}
              table-of-contents verified topics, {totals.auto_extracted_candidates} additional
              subtopics in editorial review ({totals.pass0_corrected_headings ?? 0} multi-line
              headings recovered in Pass 0 PDF audit), {totals.pilot_lessons_count ?? 7} interactive
              pilot lesson packages, and {totals.source_page_anchors.toLocaleString()} textbook page
              anchors.
            </p>
          </div>
          <Link
            to="/roadmap"
            className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
          >
            <span>View editorial roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="border border-[var(--line)] rounded-[20px] overflow-x-auto bg-[var(--surface)]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--surface-subtle)] border-b border-[var(--line)] text-[var(--ink)]">
                <th className="py-3.5 px-4 font-bold">Subject</th>
                <th className="py-3.5 px-4 font-bold">Textbook Edition</th>
                <th className="py-3.5 px-4 font-bold">Units</th>
                <th className="py-3.5 px-4 font-bold">Verified Core Topics</th>
                <th className="py-3.5 px-4 font-bold">Subtopics Under Review</th>
                <th className="py-3.5 px-4 font-bold">Total Topics</th>
                <th className="py-3.5 px-4 font-bold">Page Anchors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {subjects.map((sub) => {
                const subUnits = getUnitsBySubject(sub.slug);
                const sampleEdition = subUnits[0]?.edition ?? '2024 Edition';
                return (
                  <tr key={sub.slug} className="hover:bg-[var(--surface-subtle)]/50">
                    <td
                      lang={sub.slug === 'tamil' ? 'ta' : undefined}
                      className={`py-3 px-4 font-bold text-[var(--ink)] ${sub.slug === 'tamil' ? 'font-tamil' : ''
                        }`}
                    >
                      <Link
                        to={`/class-10/${sub.slug}`}
                        className="text-[var(--primary)] hover:underline"
                      >
                        {sub.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{sampleEdition}</td>
                    <td className="py-3 px-4 font-mono-tabular font-semibold">{sub.unit_count}</td>
                    <td className="py-3 px-4 font-mono-tabular text-[var(--success)] font-bold">
                      {sub.toc_verified_section_count}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-[var(--text-muted)]">
                      {sub.auto_extracted_section_count}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular font-bold">
                      {sub.toc_verified_section_count + sub.auto_extracted_section_count}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-[var(--text-muted)]">
                      {sub.source_page_anchor_count}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-[var(--surface-subtle)] font-extrabold text-[var(--ink)]">
                <td className="py-3.5 px-4">Total (5 Subjects)</td>
                <td className="py-3.5 px-4 text-xs font-normal text-[var(--text-muted)]">
                  TN State Board Class 10
                </td>
                <td className="py-3.5 px-4 font-mono-tabular">{totals.units}</td>
                <td className="py-3.5 px-4 font-mono-tabular text-[var(--success)]">
                  {totals.toc_verified_sections}
                </td>
                <td className="py-3.5 px-4 font-mono-tabular">
                  {totals.auto_extracted_candidates}
                </td>
                <td className="py-3.5 px-4 font-mono-tabular">{totals.total_sections}</td>
                <td className="py-3.5 px-4 font-mono-tabular">
                  {totals.source_page_anchors.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function RoadmapPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Editorial Status & Roadmap' }]} />

      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Transparent Lesson Status · Quality Over Guesswork
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          Growing one verified lesson at a time
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl">
          We clearly label which chapters have live interactive lessons today and which subtopics
          are in editorial preparation, rather than filling pages with unreviewed placeholder prose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            pass: 'Pass 0 — Canonical Registry & Full 5-Textbook PDF Audit',
            status: '100% Automated Complete',
            detail:
              '5 subjects, 72 chapters, 113 TOC-verified topics, 578/578 auto-extracted subheadings resolved against all 5 supplied TN Class 10 PDFs (176 recovered/visually verified; 0 unresolved), and 1,387 page anchors.',
          },
          {
            pass: 'Pass 1 & All 6/6 Handover 3D Labs',
            status: 'Available to Play',
            detail:
              'All 6 P0 pilots PLUS all 6/6 handover 3D interactive Three.js models live (with 2D/text fallback): Heart Cutaway, Mensuration Solids & Nets, Atoms & Molecules, Carbon Bonds, Dicot Root & Chloroplast, and India Relief Atlas.',
          },
          {
            pass: 'Pass 2 — 1 Complete Chapter Per Subject (5 Full Chapters)',
            status: 'Available to Play',
            detail:
              '25 validated lesson packages covering 100% of Science Unit 14 (23/23), Maths Ch. 6 (6/6), English Unit 1 (3/3), Tamil இயல் 4 (4/4), and History Unit 1 (3/3), plus Maths Ch. 7 & Geography Unit 1.',
          },
          {
            pass: 'Pass 3 — Remaining 67 Chapters & Subject Depth',
            status: 'Planned',
            detail:
              'Authoring dedicated visual models, unit-tested simulations, flashcards, and untimed concept checks across all remaining Class 10 units without fabricated placeholders.',
          },
          {
            pass: 'Editorial Gate — Subject Teacher, Tamil & Rights Sign-Off',
            status: 'Pending Human Review',
            detail:
              'All 7 Pass 1 pilots and 578 Pass 0 audited headings currently carry explicit pending-review badges until human Tamil Nadu Class 10 educators and rights reviewers sign off.',
          },
          {
            pass: 'Classroom & Printable Study Packs',
            status: 'Planned',
            detail:
              'Teacher projection guides, offline-friendly static bundles, and printable one-page concept summaries for revision.',
          },
        ].map((p) => (
          <div
            key={p.pass}
            className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-2.5 shadow-[var(--shadow-card)]"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--info-bg)] text-xs font-bold text-[var(--primary)]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{p.status}</span>
            </div>
            <h2 className="text-base font-extrabold text-[var(--ink)]">{p.pass}</h2>
            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">{p.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
