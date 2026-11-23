import type { QualityTier, UniversePilotMeta, UniverseWorldDefinition } from '../types/universe';
import { isDirectPilotLessonId, getLessonContentBySectionId } from './lesson_content';
import { getExactLessonExperienceById } from './exactSectionManifest';
import { getSubsectionLessonById } from './history_unit4_index';
import type { CurriculumSection } from '../types/curriculum';

export const UNIVERSE_WORLDS: UniverseWorldDefinition[] = [
  {
    id: 'science',
    subjectSlug: 'science',
    worldName: 'Science Discovery World',
    shortTitle: 'Science',
    tagline: 'Physics experiment hangar, bright chemistry reaction studio, clinical anatomy theatre & living systems.',
    bigQuestion: 'How do forces, electricity, atoms, reactions, and living systems work?',
    accentToken: 'var(--science)',
    tintToken: 'var(--science-tint)',
    route: '/class-10/science',
    featuredPilotRoute: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
    featuredPilotTitle: '10.1 Safe 3D + 2D Chemical Reactions Studio',
    signatureAction: 'Mix safe reagents in bright 3D glassware, watch atom bars turn green, and predict outcomes',
    islands: [
      {
        id: 'sci-physics',
        title: 'Physics Hangar',
        subtitle: 'Units 1–6 · Motion, Optics, Heat, Electricity, Sound & Nuclear',
        x: 135,
        y: 88,
        unitIds: ['science-01', 'science-02', 'science-03', 'science-04', 'science-05', 'science-06'],
        featuredRoute: '/class-10/science/science-04/science-04-auto-4-8-1-joule-s-law-of-heating',
        featuredLabel: '4.8.1 Joule’s Law Bench',
      },
      {
        id: 'sci-chem',
        title: 'Chemistry Studio',
        subtitle: 'Units 7–11 · Molecules, Metallurgy Flowcharts, Solutions, Reactions & Carbon',
        x: 415,
        y: 82,
        unitIds: ['science-07', 'science-08', 'science-09', 'science-10', 'science-11'],
        featuredRoute: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
        featuredLabel: '10.1 Reactions 3D+2D',
      },
      {
        id: 'sci-bio',
        title: 'Living Systems Theatre',
        subtitle: 'Units 12–18 · Plant Tissues, Heart 3D+2D, Brain, Hormones, Reproduction & Genetics',
        x: 205,
        y: 222,
        unitIds: ['science-12', 'science-13', 'science-14', 'science-15', 'science-16', 'science-17', 'science-18'],
        featuredRoute: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
        featuredLabel: '14.15 3D+2D Human Heart',
      },
      {
        id: 'sci-planet',
        title: 'Evolution, Health & Planet Lab',
        subtitle: 'Units 19–23 · Fossils, Biotech, Clinical Health, Environment & Scratch',
        x: 485,
        y: 222,
        unitIds: ['science-19', 'science-20', 'science-21', 'science-22', 'science-23'],
        featuredRoute: '/class-10/science/science-22/science-22-auto-22-7-rainwater-harvesting',
        featuredLabel: '22.7 Rainwater Harvesting',
      },
    ],
    islandConnections: [
      { from: 'sci-physics', to: 'sci-chem', label: 'Energy & atomic forces' },
      { from: 'sci-chem', to: 'sci-bio', label: 'Biochemistry & pH' },
      { from: 'sci-bio', to: 'sci-planet', label: 'Genetics → Evolution & Health' },
      { from: 'sci-physics', to: 'sci-planet', label: 'Electricity → Clean Energy' },
    ],
  },
  {
    id: 'mathematics',
    subjectSlug: 'mathematics',
    worldName: 'Mathematics Workshop',
    shortTitle: 'Mathematics',
    tagline: 'Constrained 2D geometric proofs, 3D mensuration solids & unfolded nets, algebra machines & surveys.',
    bigQuestion: 'How do patterns, proofs, trigonometry, and 3D solids solve real engineering problems?',
    accentToken: 'var(--math)',
    tintToken: 'var(--math-tint)',
    route: '/class-10/mathematics',
    featuredPilotRoute: '/class-10/mathematics/maths-04/maths-04-03',
    featuredPilotTitle: '4.3 Thales & Angle Bisector Constrained 2D Proof',
    signatureAction: 'Drag constrained triangle theorems in 2D and unfold 3D water-tank solids into flat 2D nets',
    islands: [
      {
        id: 'math-alg',
        title: 'Functions, Numbers & Algebra',
        subtitle: 'Ch. 1–3 · Mappings, Euclid/Modulo, AP/GP, Quadratics & Matrices',
        x: 145,
        y: 110,
        unitIds: ['maths-01', 'maths-02', 'maths-03'],
        featuredRoute: '/class-10/mathematics/maths-03/maths-03-09',
        featuredLabel: '3.9 Matrices Workbench',
      },
      {
        id: 'math-geo',
        title: 'Geometry & Coordinate Proof Table',
        subtitle: 'Ch. 4–5 · Thales, Angle Bisector, Pythagoras, Tangents & Slopes',
        x: 345,
        y: 195,
        unitIds: ['maths-04', 'maths-05'],
        featuredRoute: '/class-10/mathematics/maths-04/maths-04-03',
        featuredLabel: '4.3 Thales & ABT Lab',
      },
      {
        id: 'math-3d',
        title: 'Surveying, 3D Solids & Data Lab',
        subtitle: 'Ch. 6–8 · Clinometer Survey, 3D Mensuration + 2D Nets, σ & Probability',
        x: 525,
        y: 105,
        unitIds: ['maths-06', 'maths-07', 'maths-08'],
        featuredRoute: '/class-10/mathematics/maths-07/maths-07-02',
        featuredLabel: '7.2 3D Solids & 2D Nets',
      },
    ],
    islandConnections: [
      { from: 'math-alg', to: 'math-geo', label: 'Equations → Coordinate lines' },
      { from: 'math-geo', to: 'math-3d', label: 'Similar triangles → Trig & Nets' },
    ],
  },
  {
    id: 'english',
    subjectSlug: 'english',
    worldName: 'English Story Universe',
    shortTitle: 'English',
    tagline: 'Illustrated 2D story worlds, character conflict investigations, poetic-device studio & memoriter trainer.',
    bigQuestion: 'How do stories, poems, and language choices reveal human courage and perspective?',
    accentToken: 'var(--english)',
    tintToken: 'var(--english-tint)',
    route: '/class-10/english',
    featuredPilotRoute: '/class-10/english/english-01/english-01-prose',
    featuredPilotTitle: 'His First Flight — Illustrated 2D Story Mission',
    signatureAction: 'Investigate character viewpoints, sequence story beats, master word forms & craft alternate scenes',
    islands: [
      {
        id: 'eng-prose',
        title: 'Courage & Discovery Stories',
        subtitle: 'Units 1–3 · His First Flight, The Night the Ghost Got In, Empowered Women',
        x: 155,
        y: 115,
        unitIds: ['english-01', 'english-02', 'english-03'],
        featuredRoute: '/class-10/english/english-01/english-01-prose',
        featuredLabel: 'His First Flight (2D)',
      },
      {
        id: 'eng-verse',
        title: 'Verse & Memoriter Salon',
        subtitle: '4 Board-Exam Memoriter Poems (*) · Poetic Devices & Recall',
        x: 345,
        y: 200,
        unitIds: ['english-01', 'english-03', 'english-05', 'english-06'],
        featuredRoute: '/class-10/english/english-01/english-01-poem',
        featuredLabel: 'Life (*) Sonnet Studio',
      },
      {
        id: 'eng-craft',
        title: 'Reflections, Tech & Mystery',
        subtitle: 'Units 4–7 · The Attic, Tech Bloomers, The Last Lesson, Dying Detective',
        x: 520,
        y: 115,
        unitIds: ['english-04', 'english-05', 'english-06', 'english-07'],
        featuredRoute: '/class-10/english/english-05/english-05-poem',
        featuredLabel: 'Secret of the Machines (*)',
      },
    ],
    islandConnections: [
      { from: 'eng-prose', to: 'eng-verse', label: 'Theme & imagery links' },
      { from: 'eng-verse', to: 'eng-craft', label: 'Grammar & voice mastery' },
    ],
  },
  {
    id: 'tamil',
    subjectSlug: 'tamil',
    worldName: 'Tamil Language & Literature World',
    shortTitle: 'தமிழ்',
    tagline: 'தெளிவான தமிழ் எழுத்துருவில் செய்யுள், உரைநடை, மொழிபெயர்ப்பு மற்றும் காட்சி இலக்கணப் பயிற்சியகம்.',
    bigQuestion: 'மொழிவளம், இலக்கிய நயம் மற்றும் இலக்கணக் கட்டமைப்பை இயல்பாகக் கற்பது எப்படி?',
    accentToken: 'var(--tamil)',
    tintToken: 'var(--tamil-tint)',
    route: '/class-10/tamil',
    featuredPilotRoute: '/class-10/tamil/tamil-04/tamil-04-04',
    featuredPilotTitle: 'இயல் 4 மணற்கேணி — 2D மொழிபெயர்ப்பு & இலக்கணம்',
    signatureAction: 'மொழிபெயர்ப்புச் செம்மை, இருதிணை–ஐம்பால் காட்சி மரம் மற்றும் வழுவமைதி 2D பயிற்சிகள்',
    islands: [
      {
        id: 'tam-1-3',
        title: 'இயல்கள் 1–3 · மொழி, இயற்கை & பண்பாடு',
        subtitle: 'அமுதஊற்று · உயிரின் ஓசை · கூட்டாஞ்சோறு',
        x: 150,
        y: 120,
        unitIds: ['tamil-01', 'tamil-02', 'tamil-03'],
        featuredRoute: '/class-10/tamil/tamil-01',
        featuredLabel: 'இயல் 1 அமுதஊற்று',
      },
      {
        id: 'tam-4',
        title: 'இயல் 4 · மணற்கேணி (Pilot)',
        subtitle: 'மொழிபெயர்ப்புக் கல்வி · திருவிளையாடற் புராணம் · இலக்கணம் – பொது',
        x: 345,
        y: 195,
        unitIds: ['tamil-04'],
        featuredRoute: '/class-10/tamil/tamil-04/tamil-04-01',
        featuredLabel: 'மணற்கேணி 2D கூடம்',
      },
      {
        id: 'tam-5-7',
        title: 'இயல்கள் 5–7 · அறிவியல், கலை & மனிதம்',
        subtitle: 'திருப்புமுனை · நிலா முற்றம் · விதைநெல் (மனப்பாடப் பகுதிகள்)',
        x: 525,
        y: 120,
        unitIds: ['tamil-05', 'tamil-06', 'tamil-07'],
        featuredRoute: '/class-10/tamil/tamil-05',
        featuredLabel: 'இயல் 5–7 இலக்கியம்',
      },
    ],
    islandConnections: [
      { from: 'tam-1-3', to: 'tam-4', label: 'சொல்வளம் → மொழிபெயர்ப்பு' },
      { from: 'tam-4', to: 'tam-5-7', label: 'பொது இலக்கணம் → பொருள் & யாப்பு' },
    ],
  },
  {
    id: 'social_science',
    subjectSlug: 'social_science',
    worldName: 'Social Science Time & Earth World',
    shortTitle: 'Social Science',
    tagline: 'Dated NASA 2D historical maps & timelines, India/Tamil Nadu satellite geography, democracy & economics.',
    bigQuestion: 'How do historical turning points, geography, laws, and economics shape India and Tamil Nadu?',
    accentToken: 'var(--social)',
    tintToken: 'var(--social-tint)',
    route: '/class-10/social_science',
    featuredPilotRoute: '/class-10/social_science/social-history-04/social-history-04-auto-4-2-cold-war-rivalry',
    featuredPilotTitle: 'History Unit 4 — Dated 2D Cold War Maps & Choices',
    signatureAction: 'Inspect dated NASA 2D maps, weigh historical & civic choices, and compare physical terrain layers',
    islands: [
      {
        id: 'soc-hist',
        title: 'History Time Portal',
        subtitle: 'Units 1–10 · World Wars, Cold War (4.1–4.10), Reform & Freedom Movement',
        x: 140,
        y: 88,
        unitIds: ['social-history-01', 'social-history-02', 'social-history-03', 'social-history-04', 'social-history-05', 'social-history-06', 'social-history-07', 'social-history-08', 'social-history-09', 'social-history-10'],
        featuredRoute: '/class-10/social_science/social-history-04/social-history-04-auto-4-2-cold-war-rivalry',
        featuredLabel: '4.2–4.8 Cold War Maps',
      },
      {
        id: 'soc-geo',
        title: 'India & TN Satellite Atlas',
        subtitle: 'Units 1–7 · Relief + SRTM 3D, Monsoon, Soils, Resources & Tamil Nadu',
        x: 455,
        y: 88,
        unitIds: ['social-geography-01', 'social-geography-02', 'social-geography-03', 'social-geography-04', 'social-geography-05', 'social-geography-06', 'social-geography-07'],
        featuredRoute: '/class-10/social_science/social-geography-01/social-geography-01-auto-1-2-major-physiographic',
        featuredLabel: 'India Relief 2D+SRTM',
      },
      {
        id: 'soc-civ',
        title: 'Constitutional Democracy Hall',
        subtitle: 'Units 1–5 · Constitution, Parliament, State Govt & Foreign Policy',
        x: 195,
        y: 222,
        unitIds: ['social-civics-01', 'social-civics-02', 'social-civics-03', 'social-civics-04', 'social-civics-05'],
        featuredRoute: '/class-10/social_science/social-civics-04/social-civics-04-auto-4-2-panchsheel',
        featuredLabel: '4.2 Panchsheel & NAM',
      },
      {
        id: 'soc-econ',
        title: 'Economy & Development Ledger',
        subtitle: 'Units 1–5 · GDP, Globalization, Food Security, Taxes & TN Clusters',
        x: 490,
        y: 222,
        unitIds: ['social-economics-01', 'social-economics-02', 'social-economics-03', 'social-economics-04', 'social-economics-05'],
        featuredRoute: '/class-10/social_science/social-economics-04/social-economics-04-auto-4-3-types-of-taxes',
        featuredLabel: '4.3 Direct & Indirect Taxes',
      },
    ],
    islandConnections: [
      { from: 'soc-hist', to: 'soc-civ', label: 'Freedom struggle → Constitution' },
      { from: 'soc-geo', to: 'soc-econ', label: 'Resources → Industry & GDP' },
      { from: 'soc-civ', to: 'soc-econ', label: 'Public policy & taxation' },
    ],
  },
  {
    id: 'arcade',
    worldName: 'Cross-Subject Challenge Arcade',
    shortTitle: 'Challenge Arcade',
    tagline: 'Untimed Tamil Nadu capstone quests & concept micro-games linking multiple textbook chapters.',
    bigQuestion: 'Can you combine Maths, Science, Geography, Economics & Language to solve real problems?',
    accentToken: 'var(--arcade)',
    tintToken: 'var(--arcade-tint)',
    route: '/arcade',
    featuredPilotRoute: '/arcade/sustainable-tn-town',
    featuredPilotTitle: 'Design a Sustainable Tamil Nadu Town',
    signatureAction: 'Engineer rainwater tanks, clean electricity, monsoon readiness & municipal budgets with zero timers',
    islands: [
      {
        id: 'arc-town',
        title: 'Sustainable Tamil Nadu Town',
        subtitle: 'Capstone · Maths Ch. 7 + Science U4/U22 + Geo U6 + Economics U4 + English/Tamil',
        x: 330,
        y: 145,
        unitIds: ['maths-07', 'science-04', 'science-22', 'social-geography-06', 'social-economics-04'],
        featuredRoute: '/arcade/sustainable-tn-town',
        featuredLabel: 'Launch Capstone Mission',
      },
    ],
    islandConnections: [],
  },
];

/**
 * Six Gate 2 Showcase Pilots (including dual Science showcase: 4.8.1 + 10.1, and linked Maths 4.3 + 7.2)
 */
export const GATE2_WORKING_PILOTS: UniversePilotMeta[] = [
  {
    id: 'pilot-science-joules',
    pilotCode: 'Pilot 1A · Science',
    worldId: 'science',
    sectionId: 'science-04-auto-4-8-1-joule-s-law-of-heating',
    route: '/class-10/science/science-04/science-04-auto-4-8-1-joule-s-law-of-heating',
    title: '4.8.1 Joule’s Law of Heating (Electricity → Heat)',
    subjectLabel: 'Science · Unit 4',
    representation: 'interactive-2d',
    oneLinePurpose: 'Discover why doubling current quadruples heat (H = I²Rt) with a nichrome coil, live parabola & appliance context.',
    sourceBook: 'TN Class 10 Science (2024 Reprint)',
    printedPages: 'pp. 50–51',
    microMissionGoal: 'Quadruple baseline heat (200 J → 800 J) by changing current I only.',
    transferSummary: 'Predict new heat when I halves and R doubles simultaneously.',
    beyondSyllabusBadge: 'High-voltage transmission I²R loss reduction',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-science-reactions',
    pilotCode: 'Pilot 1B · Science',
    worldId: 'science',
    sectionId: 'science-10-auto-10-1-types-of-chemical',
    route: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
    title: '10.1 Safe Chemical Reactions (3D Glassware + 2D Process Flowchart)',
    subjectLabel: 'Science · Unit 10',
    representation: 'synchronized-2d-3d',
    oneLinePurpose: 'Pour safe reagents in bright 3D flasks while a synchronized 2D flowchart traces reactants, conditions, observations & balanced atom bars.',
    sourceBook: 'TN Class 10 Science (2024 Reprint)',
    printedPages: 'pp. 138–144',
    microMissionGoal: 'Predict Cu vs Zn in HCl, trigger yellow PbI₂ precipitate, and balance every element bar to green.',
    transferSummary: 'Predict Fe + CuSO₄ vs Ag + FeSO₄ using the reactivity series.',
    beyondSyllabusBadge: 'Green chemistry atom economy',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-maths-thales',
    pilotCode: 'Pilot 2A · Mathematics',
    worldId: 'mathematics',
    sectionId: 'maths-04-03',
    route: '/class-10/mathematics/maths-04/maths-04-03',
    title: '4.3 Thales Theorem & Angle Bisector Theorem (Constrained 2D)',
    subjectLabel: 'Mathematics · Ch. 4',
    representation: 'interactive-2d',
    oneLinePurpose: 'Move constrained points A, B, C, D, E to verify AD/DB = AE/EC (Thales) and switch to the distinct Angle Bisector proof AB/AC = BD/DC.',
    sourceBook: 'TN Class 10 Mathematics (2025 Revised)',
    printedPages: 'pp. 171–180',
    microMissionGoal: 'Set AD/DB = 2.00 while preserving DE ∥ BC, then test AB = 1.5·AC in Angle Bisector mode.',
    transferSummary: 'Find exact QS and SR on an unseen triangle with an internal angle bisector.',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-maths-mensuration',
    pilotCode: 'Pilot 2B · Mathematics',
    worldId: 'mathematics',
    sectionId: 'maths-07-02',
    route: '/class-10/mathematics/maths-07/maths-07-02',
    title: '7.2–7.3 Mensuration 3D Solids + Live Unfolding 2D Nets',
    subjectLabel: 'Mathematics · Ch. 7',
    representation: 'synchronized-2d-3d',
    oneLinePurpose: 'Unfold 3D cylinders, cones, spheres & frustums into synchronized 2D nets to see CSA/TSA/Volume invariants (π = 22/7).',
    sourceBook: 'TN Class 10 Mathematics (2025 Revised)',
    printedPages: 'pp. 270–289',
    microMissionGoal: 'Engineer a village water tank with Volume ≥ 1,000 m³ while keeping outer TSA ≤ 580 m².',
    transferSummary: 'Compute conical tent slant height, canvas area & cost (explaining why base area is excluded).',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-english-flight',
    pilotCode: 'Pilot 3 · English',
    worldId: 'english',
    sectionId: 'english-01-prose',
    route: '/class-10/english/english-01/english-01-prose',
    title: 'His First Flight — Illustrated 2D Story Studio (0% 3D)',
    subjectLabel: 'English · Unit 1 Prose',
    representation: 'interactive-language',
    oneLinePurpose: 'Investigate the young seagull’s fear and family strategy through a 5-scene illustrated 2D storyboard, word-form micro-game & creative ending.',
    sourceBook: 'TN Class 10 English (2024 Reprint)',
    printedPages: 'pp. 2–7',
    microMissionGoal: 'Compare character viewpoints, reconstruct all 5 plot beats & transform Parts of Speech.',
    transferSummary: 'Analyze an unseen short passage on overcoming fear and cite textual evidence.',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-tamil-manarkeni',
    pilotCode: 'Pilot 4 · தமிழ்',
    worldId: 'tamil',
    sectionId: 'tamil-04-04',
    route: '/class-10/tamil/tamil-04/tamil-04-04',
    title: 'இயல் 4 மணற்கேணி — 2D மொழிபெயர்ப்பு & இலக்கணம் (0% 3D)',
    subjectLabel: 'தமிழ் · இயல் 4',
    representation: 'interactive-language',
    oneLinePurpose: 'பிறமொழி மொழிபெயர்ப்புச் செம்மை, இருதிணை–ஐம்பால் காட்சி மரம் மற்றும் வழு→வழாநிலை→வழுவமைதி 2D பயிற்சிகள்.',
    sourceBook: 'TN Class 10 Tamil (2025 Revised)',
    printedPages: 'pp. 72–88',
    microMissionGoal: 'வடம் vs ஒட்டகம் மொழிபெயர்ப்புச் செம்மை & திணை–பால்–வழுவமைதி 5 வகைப் பயிற்சி.',
    transferSummary: 'புதிய வழுத் தொடர்களை வழாநிலையாக மாற்றி, சூழலுக்கு ஏற்ற மொழிபெயர்ப்பைத் தேர்ந்தெடுக்க.',
    provisionalNotice: 'Provisional — pending Tamil educator proofreading before educator_approved promotion.',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-social-coldwar',
    pilotCode: 'Pilot 5 · Social Science',
    worldId: 'social_science',
    sectionId: 'social-history-04-auto-4-2-cold-war-rivalry',
    route: '/class-10/social_science/social-history-04/social-history-04-auto-4-2-cold-war-rivalry',
    title: 'History Unit 4 — Cold War Dated 2D Maps & Causal Choices',
    subjectLabel: 'Social Science · History Unit 4',
    representation: 'interactive-2d',
    oneLinePurpose: 'Compare dated 1947–1975 NASA 2D theatre maps (Europe, Alliances, NAM, Cuba, Vietnam) and weigh historical choices.',
    sourceBook: 'TN Class 10 Social Science (2025 Revised)',
    printedPages: 'pp. 43–48',
    microMissionGoal: 'Navigate Bandung/Belgrade NAM choices and distinguish documented facts from historical interpretations.',
    transferSummary: 'Explain why Korea and Vietnam became hot proxy conflicts during a Cold War.',
    qualityTier: 'assessed',
  },
  {
    id: 'pilot-capstone-tntown',
    pilotCode: 'Pilot 6 · Cross-Subject Capstone',
    worldId: 'arcade',
    sectionId: 'arcade-sustainable-tn-town',
    route: '/arcade/sustainable-tn-town',
    title: 'Design a Sustainable Tamil Nadu Town',
    subjectLabel: 'Challenge Arcade · 5 Subjects',
    representation: 'scenario-game',
    oneLinePurpose: 'Combine Maths Ch. 7 tanks, Science electricity/rainwater/wind, TN Geography monsoon & Economics budgets in one real-world town quest.',
    sourceBook: 'Multi-Book Anchor (Maths 7.2/7.3 · Sci 4.9/22.6/22.7 · Geo 6.1/6.7 · Econ 4.1/4.3)',
    printedPages: 'Cross-referenced',
    microMissionGoal: 'Meet water storage, clean LED/wind power & balanced municipal funding across 4 stages.',
    transferSummary: 'Solve 3 cross-subject transfer checks and export your personal "What Did I Learn?" report.',
    beyondSyllabusBadge: 'Real-world rainfall & municipal planning values clearly tagged Explore Further',
    qualityTier: 'assessed',
  },
];

/**
 * Honest Quality Tier Resolver (Gate 3 / Product Bible Section 5).
 * NEVER returns 'educator_approved' automatically until human educator metadata exists!
 */
export function resolveSectionQualityTier(section: CurriculumSection): QualityTier {
  const sid = section.id;
  if (
    Boolean(getExactLessonExperienceById(sid)) ||
    Boolean(getSubsectionLessonById(sid)) ||
    isDirectPilotLessonId(sid)
  ) {
    return 'assessed';
  }
  if (Boolean(getLessonContentBySectionId(sid))) {
    return 'interactive';
  }
  if (section.source_status !== 'auto_extracted_review_required') {
    return 'explained';
  }
  return 'indexed';
}

export function getQualityTierDisplay(tier: QualityTier): {
  label: string;
  shortLabel: string;
  toneClass: string;
} {
  switch (tier) {
    case 'educator_approved':
      return {
        label: 'Educator Approved',
        shortLabel: 'Approved',
        toneClass: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/35',
      };
    case 'assessed':
      return {
        label: 'Full Interactive Quest (Assessed)',
        shortLabel: 'Assessed Quest',
        toneClass: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/35',
      };
    case 'interactive':
      return {
        label: 'Interactive Activity Ready',
        shortLabel: 'Interactive',
        toneClass: 'bg-[var(--info-bg)] text-[var(--primary)] border-[var(--primary)]/35',
      };
    case 'explained':
      return {
        label: 'Explained · Visual Lab Active',
        shortLabel: 'Explained',
        toneClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-400/35',
      };
    default:
      return {
        label: 'Syllabus Indexed · Interactive Preview',
        shortLabel: 'Indexed',
        toneClass: 'bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--line)]',
      };
  }
}
