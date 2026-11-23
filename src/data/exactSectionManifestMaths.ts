import type { LessonExperienceSpec } from '../types/lessonExperience';

const MATH_PORTAL = 'https://textbookcorp.tn.gov.in/';
const MATH_BOOK = 'TN State Board Class 10 Mathematics';
const MATH_EDITION = 'Revised Edition 2025';
const MATH_PDF = 'Class_10_Mathematics_English_2025_Edition-www.tntextbooks.in.pdf';

const THALES_AND_BISECTOR_SPEC: LessonExperienceSpec = {
  sectionId: 'maths-04-03',
  subject: 'mathematics',
  unitId: 'maths-04',
  sectionNumber: '4.3',
  title: { en: 'Thales Theorem and Angle Bisector Theorem', ta: 'தேல்ஸ் தேற்றம் & கோண இருசமவெட்டித் தேற்றம்' },
  estimatedMinutes: '10–12 min',
  textbookAnchor: {
    book: MATH_BOOK,
    edition: MATH_EDITION,
    pdf: MATH_PDF,
    printedPages: [171, 172, 173, 174, 175, 176],
    pdfPages: [177, 178, 179, 180, 181, 182],
    figures: ['Fig. 4.29 Thales Theorem (p. 172)', 'Fig. 4.33 Angle Bisector Theorem (p. 174)', 'Fig. 4.36 Example 4.12 (p. 176)'],
    exercises: ['Example 4.12 (p. 176)', 'Example 4.13 (p. 176)', 'Exercise 4.2'],
    officialPortalUrl: MATH_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: 'Thales Theorem (BPT): a line DE ∥ BC splits AB and AC in equal ratios (AD/DB = AE/EC). Angle Bisector Theorem: an internal ray AD bisecting ∠BAC splits opposite side BC in the ratio of adjacent sides (BD/DC = AB/AC).',
  learningObjective: 'Verify and prove both Thales Theorem (BPT) and Angle Bisector Theorem on accurately labelled 2D triangles (A/B/C/D/E) and solve algebraic side-length problems.',
  misconception: 'Students often confuse the parallel-line BPT ratio (AD/DB = AE/EC) with the Angle Bisector ratio (BD/DC = AB/AC), or forget that DE MUST be parallel to BC for Thales Theorem to hold.',
  primaryMode: '2d-svg',
  engineId: 'MathsChapter4GeometryLabs2D',
  variantId: 'thales_and_bisector',
  modelAssumptions: [
    'Strict 2D Euclidean planar geometry — eliminates 3D camera perspective distortion.',
    'Every vertex A, B, C, D, E carries a permanent, high-contrast, non-overlapping label pill.',
    'Note: Tangent–Radius Theorem belongs exclusively to Section 4.5 Circles & Tangents and is intentionally NOT mixed into Section 4.3.',
  ],
  variables: [
    { id: 'theorem43', label: 'Theorem Switcher (Thales BPT vs Angle Bisector)' },
    { id: 'splitT', label: 'Parallel Cut Position DE along AB', validRange: [0.2, 0.8] },
    { id: 'sideAB', label: 'Adjacent Side AB (Angle Bisector)', unit: 'cm', validRange: [4, 16] },
    { id: 'sideAC', label: 'Adjacent Side AC (Angle Bisector)', unit: 'cm', validRange: [4, 16] },
  ],
  expectedObservations: [
    'In Thales mode, sliding DE parallel to BC always maintains AD/DB = AE/EC identically.',
    'In Angle Bisector mode, changing AB and AC shifts point D along BC so BD/DC always equals AB/AC.',
  ],
  spark: {
    question: 'Over 2,500 years ago, how did Greek mathematician Thales measure the height of Egypt’s Great Pyramid using only a wooden stick and shadows — without climbing a single stone?',
    teaser: 'Parallel sun rays create proportional triangle segments — the exact engine behind Basic Proportionality Theorem!',
  },
  explanations: {
    simple:
      'Section 4.3 teaches TWO distinct proportional-triangle superpowers. First, in Thales Theorem (BPT), slice triangle ABC with a line DE strictly parallel to the base BC: it splits the left side (AD : DB) and right side (AE : EC) into the EXACT same fraction. Second, in the Angle Bisector Theorem, split the top angle ∠BAC into two equal halves with a ray AD hitting the base BC: the base gets divided (BD : DC) in the EXACT ratio of the two sides touching that angle (AB : AC)!',
    simpleTamil:
      'தேல்ஸ் தேற்றம் (BPT): முக்கோணம் ABC-ல் BC-க்கு இணையாக DE வரைந்தால் AD/DB = AE/EC. கோண இருசமவெட்டித் தேற்றம்: ∠A-ன் உட்புற இருசமவெட்டி AD, எதிர்ப்பக்கம் BC-ஐ AB/AC = BD/DC என்ற விகிதத்தில் பிரிக்கும்.',
    analogy: 'Analogy: Thales is like cutting a ladder horizontally between two parallel rungs — both rails split in the same fraction. Angle Bisector is like balancing a seesaw beam according to the lengths of the two arms above it.',
    detailed:
      'Theorem 1 (Thales / BPT, p. 172): In △ABC, if DE ∥ BC with D on AB and E on AC, then △ADE ∼ △ABC by AAA similarity, yielding AB/AD = AC/AE and hence AD/DB = AE/EC. Theorem 3 (Angle Bisector Theorem, pp. 174–175): If ray AD bisects ∠BAC internally, constructing CE ∥ AB meeting extended AD at E forms isosceles △ACE (AC = CE) and similar △ABD ∼ △ECD, proving AB/AC = BD/CD.',
    examReady: [
      'Thales (Theorem 1, p. 172): DE ∥ BC ⇒ AD/DB = AE/EC (plus Corollaries AB/AD = AC/AE and AB/DB = AC/EC).',
      'Converse of Thales (Theorem 2, p. 174): AD/DB = AE/EC ⇒ DE ∥ BC.',
      'Angle Bisector (Theorem 3, pp. 174–175): AD bisects ∠BAC ⇒ AB/AC = BD/DC (Proof construction: draw CE ∥ AB).',
    ],
    misconceptions: [
      {
        myth: 'Any straight line DE cutting sides AB and AC satisfies AD/DB = AE/EC.',
        reality: 'False! DE MUST be parallel to the third side BC (DE ∥ BC) for BPT to apply.',
      },
      {
        myth: 'An angle bisector always hits the exact midpoint of the opposite side BC.',
        reality: 'Only if AB = AC (isosceles triangle)! In general, BD/DC = AB/AC, so D shifts closer to the shorter adjacent side.',
      },
    ],
  },
  mindMap: {
    title: 'Section 4.3 · Thales & Angle Bisector Concept Map',
    nodes: [
      { id: 'bpt', label: 'Thales / BPT (DE ∥ BC)', role: 'core', summary: 'AD/DB = AE/EC', detail: 'Proved via AAA similarity of △ADE ∼ △ABC (p. 172, Fig. 4.29).', x: 145, y: 75 },
      { id: 'cbpt', label: 'Converse of BPT', role: 'mechanism', summary: 'Equal ratios ⇒ DE ∥ BC', detail: 'Used to test whether a segment is parallel to the base (Example 4.13).', x: 145, y: 195 },
      { id: 'abt', label: 'Angle Bisector (Ray AD)', role: 'core', summary: 'BD/DC = AB/AC', detail: 'Internal bisector splits opposite base in ratio of adjacent sides (p. 174, Fig. 4.33).', x: 435, y: 75 },
      { id: 'proof', label: 'Proof Helper (CE ∥ AB)', role: 'application', summary: 'Isosceles △ACE', detail: 'Drawing CE ∥ AB gives AC = CE and △ABD ∼ △ECD by AA similarity.', x: 435, y: 195 },
    ],
    edges: [
      { from: 'bpt', to: 'cbpt', relation: 'converse' },
      { from: 'bpt', to: 'abt', relation: 'sister theorem in 4.3' },
      { from: 'abt', to: 'proof', relation: 'proved via' },
    ],
  },
  predictPrompt: {
    question: 'Predict before exploring: In Angle Bisector mode, if side AB = 4 cm and side AC = 12 cm (three times longer), where will the angle bisector AD land on base BC?',
    options: [
      { id: 'closerB', label: 'Closer to vertex B (so BD is one-third of DC)', feedback: 'Exact geometric intuition! Switch to "Theorem 3 · Angle Bisector" below and set AB = 4, AC = 12 to watch D shift toward B!', isExpected: true },
      { id: 'midpoint', label: 'Always at the exact midpoint of BC', feedback: 'Only when AB = AC! Test AB = 4, AC = 12 below to see BD/DC = 4/12 = 1/3.' },
      { id: 'closerC', label: 'Closer to vertex C', feedback: 'Try setting AB = 4, AC = 12 below — notice BD matches the shorter side AB!' },
    ],
  },
  microMission: 'Mission: Test both Theorem 1 (verify AD/DB = AE/EC at 25%, 50%, 67%) AND Theorem 3 (toggle the CE ∥ AB proof line and test AB = 8, AC = 12)!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Thales Proof (AAA Similarity)', detail: 'Because DE ∥ BC, corresponding angles ∠ADE = ∠ABC and ∠AED = ∠ACB, plus common ∠A ⇒ △ADE ∼ △ABC ⇒ AB/AD = AC/AE ⇒ AD/DB = AE/EC.' },
      { heading: 'Step 2 · Angle Bisector Proof Construction', detail: 'Draw CE ∥ AB and extend bisector AD to meet it at E. Alternate angles give ∠AEC = ∠BAE = ∠CAE, so △ACE is isosceles (AC = CE).' },
      { heading: 'Step 3 · Conclude by AA Similarity', detail: 'Since △ABD ∼ △ECD, AB/CE = BD/CD. Replacing CE with AC yields AB/AC = BD/CD!' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Mathematics Example 4.12 (p. 176, Fig. 4.36)',
      problem: 'In △ABC, DE ∥ BC with AD = x, DB = x − 2, AE = x + 2, and EC = x − 1. Find the lengths of AB and AC.',
      given: ['DE ∥ BC in △ABC', 'AD = x, DB = x − 2, AE = x + 2, EC = x − 1'],
      steps: [
        'By Thales Theorem (BPT): AD / DB = AE / EC ⇒ x / (x − 2) = (x + 2) / (x − 1)',
        'Cross-multiply: x(x − 1) = (x − 2)(x + 2) ⇒ x² − x = x² − 4 ⇒ x = 4',
        'Substitute x = 4: AD = 4, DB = 2 ⇒ AB = 6; AE = 6, EC = 3 ⇒ AC = 9',
      ],
      finalAnswer: 'AB = 6 units and AC = 9 units (Check: 4/2 = 6/3 = 2 ✓).',
    },
  },
  solveChallenges: [
    {
      id: 'm43-q1',
      level: 'Supported',
      prompt: 'In △ABC, DE ∥ BC. If AD = 3 cm, DB = 6 cm, and AE = 4 cm, find EC.',
      options: [
        { id: 'a', text: '6 cm', isCorrect: false, why: 'Check the ratio: AD/DB = 3/6 = 1/2, so AE/EC = 4/EC must also equal 1/2.' },
        { id: 'b', text: '8 cm', isCorrect: true, why: 'Correct! 3/6 = 4/EC ⇒ EC = 8 cm by Thales Theorem.' },
        { id: 'c', text: '2 cm', isCorrect: false, why: 'Since DB is double AD, EC must be double AE (2 × 4 = 8 cm).' },
      ],
      hint: 'Set up AD / DB = AE / EC and cross-multiply.',
    },
    {
      id: 'm43-q2',
      level: 'Independent',
      prompt: 'TN Textbook Exercise 4.5 Q.7 (p. 199): In △ABC, AD is the internal bisector of ∠BAC. If AB = 8 cm, BD = 6 cm, and DC = 3 cm, find AC.',
      options: [
        { id: 'a', text: '4 cm', isCorrect: true, why: 'Spot on! By Angle Bisector Theorem: AB/AC = BD/DC ⇒ 8/AC = 6/3 = 2 ⇒ AC = 4 cm!' },
        { id: 'b', text: '16 cm', isCorrect: false, why: 'Notice BD (6) is double DC (3), so AB (8) must be double AC — making AC smaller, not larger!' },
        { id: 'c', text: '6 cm', isCorrect: false, why: 'Solve 8/AC = 6/3 carefully.' },
      ],
      hint: 'Use AB / AC = BD / DC.',
    },
    {
      id: 'm43-q3',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge (Converse of BPT, Example 4.13): On △ABC, AB = 5.6 cm, AD = 1.4 cm, AC = 7.2 cm, and AE = 1.8 cm. Is DE parallel to BC?',
      options: [
        { id: 'a', text: 'Yes — DB = 4.2 cm and EC = 5.4 cm, giving AD/DB = 1.4/4.2 = 1/3 and AE/EC = 1.8/5.4 = 1/3, so DE ∥ BC by Converse of BPT.', isCorrect: true, why: 'Complete mastery! Both side ratios equal 1/3 identically.' },
        { id: 'b', text: 'No — because AD ≠ AE.', isCorrect: false, why: 'BPT compares RATIOS (AD/DB vs AE/EC), not raw segment lengths.' },
        { id: 'c', text: 'Cannot tell without knowing ∠B.', isCorrect: false, why: 'Converse of Thales Theorem (Theorem 2, p. 174) proves DE ∥ BC directly from equal side ratios!' },
      ],
      hint: 'Subtract first: DB = AB − AD and EC = AC − AE, then compare AD/DB with AE/EC.',
    },
  ],
  remember: {
    takeaways: [
      'Thales Theorem (BPT): DE ∥ BC ⇒ AD/DB = AE/EC (proved via AAA similarity).',
      'Converse of BPT: Equal ratios AD/DB = AE/EC prove DE ∥ BC.',
      'Angle Bisector Theorem: Internal bisector AD of ∠BAC gives AB/AC = BD/DC.',
    ],
    flashcards: [
      { id: 'm43-fc1', front: 'Thales Theorem (BPT) Statement & Ratio', back: 'A line drawn parallel to one side of a triangle divides the other two sides in the same ratio: AD/DB = AE/EC.', tag: 'Theorem 1' },
      { id: 'm43-fc2', front: 'Angle Bisector Theorem Ratio', back: 'Internal bisector AD of ∠BAC divides opposite side BC internally in ratio of adjacent sides: BD/DC = AB/AC.', tag: 'Theorem 3' },
      { id: 'm43-fc3', front: 'Key Proof Construction for Angle Bisector Theorem', back: 'Draw CE ∥ AB and extend AD to meet it at E → △ACE is isosceles (AC = CE) and △ABD ∼ △ECD.', tag: '5-Mark Proof' },
    ],
    funFact: {
      fact: 'Thales of Miletus (640–540 BCE) is celebrated as the first of the Seven Sages of Greece and used shadow triangles to calculate the height of the Great Pyramid of Giza!',
      source: 'TN Class 10 Mathematics 2025 Edition (p. 171, Fig. 4.27)',
    },
  },
  readingChunks: [
    {
      id: 'm43-chunk-1',
      heading: '4.3.1 Thales Theorem (BPT) & Converse (Theorems 1–2)',
      printedPage: 172,
      pdfPage: 178,
      summary: 'Presents Activity 2 on ruled paper, full 2-column AAA similarity proof of Theorem 1 (AD/DB = AE/EC), Corollaries, and Converse proof (p. 174).',
      plainExplanation: 'In board exams, write Given, To Prove, Construction, and Statement–Reason table clearly with a neat labelled A-B-C-D-E figure.',
      glossary: [
        { term: 'Basic Proportionality Theorem', tamil: 'அடிப்படை விகிதாசார தேற்றம்', meaning: 'Another name for Thales Theorem (DE ∥ BC ⇒ AD/DB = AE/EC).' },
      ],
      relatedExerciseRef: 'TN Maths Examples 4.12–4.13 (p. 176) & Exercise 4.2.',
    },
    {
      id: 'm43-chunk-2',
      heading: 'Theorem 3: Angle Bisector Theorem & Theorem 4: Converse',
      printedPage: 174,
      pdfPage: 180,
      summary: 'Proves internal angle bisector AD divides opposite side BC in ratio AB/AC = BD/CD via parallel construction CE ∥ AB and AA similarity.',
      plainExplanation: 'Always match BD (the segment next to B) with AB (the side touching B), and DC with AC!',
      glossary: [
        { term: 'Internal Angle Bisector', tamil: 'உட்புற கோண இருசமவெட்டி', meaning: 'Ray dividing an interior triangle angle into two equal halves.' },
      ],
      relatedExerciseRef: 'TN Maths Exercise 4.2 & Exercise 4.5 Q.7 (p. 199).',
    },
  ],
  selfCheckPrompt: 'In your own words, state the difference between what Thales Theorem requires/proves and what Angle Bisector Theorem requires/proves.',
  selfCheckGuide: 'Thales requires DE ∥ BC and proves AD/DB = AE/EC on the two cut sides; Angle Bisector requires equal half-angles ∠BAD = ∠CAD and proves BD/DC = AB/AC on the opposite base.',
  alternative2D: 'Native 2D SVG geometric constructions with permanent pill vertex labels and keyboard controls.',
  accessibleText: 'Interactive 2D triangles verify AD/DB = AE/EC under DE ∥ BC and BD/DC = AB/AC under ray AD bisecting ∠BAC.',
  reviewGate: ['PDF Verified (Maths 2025 pp. 171–176)', 'Pending TN Class 10 Maths Teacher Sign-off'],
};

const SIMILARITY_SPEC: LessonExperienceSpec = {
  ...THALES_AND_BISECTOR_SPEC,
  sectionId: 'maths-04-02',
  sectionNumber: '4.2',
  title: { en: 'Similarity of Triangles', ta: 'வடிவொத்த முக்கோணங்கள் (Similarity)' },
  textbookAnchor: {
    ...THALES_AND_BISECTOR_SPEC.textbookAnchor,
    printedPages: [162, 163, 164, 165],
    pdfPages: [168, 169, 170, 171],
    figures: ['Fig. 4.4 Congruent vs Fig. 4.5 Similar Triangles (p. 163)'],
    exercises: ['Example 4.1 (p. 165)', 'Exercise 4.1 (pp. 170–171)'],
  },
  concept: 'Two triangles are similar (△ABC ∼ △PQR) when corresponding angles are equal and corresponding sides are proportional (scale factor k); area ratio equals k².',
  learningObjective: 'Distinguish congruence (k = 1) from similarity (same shape, proportional size), apply AA/SAS/SSS similarity criteria, and compute side vs area ratios.',
  misconception: 'Students often think doubling side lengths doubles triangle area, when area actually quadruples (k² = 2² = 4)!',
  variantId: 'similarity',
  variables: [{ id: 'scaleK', label: 'Scale Factor k', validRange: [0.5, 1.8] }],
  spark: {
    question: 'Why does a 2× zoomed photo of a triangle keep the exact same corner angles — while needing 4× as much paper area?',
    teaser: 'Similarity scales lengths by k, but scales area by k²!',
  },
  explanations: {
    simple:
      'Two triangles are similar when they have the exact same shape (equal corresponding angles) even if one is a scaled-up or shrunk copy of the other. Every side multiplies by the same scale factor k, while the area multiplies by k²! When k = 1, the triangles are congruent (exact twins).',
    analogy: 'Analogy: Like zooming a map on your phone — road angles never change, every road length scales by k, and screen area scales by k².',
    detailed:
      'Per TN Maths 4.2 (pp. 162–164), △ABC ∼ △PQR via AA, SAS, or SSS criteria. Corresponding altitudes and perimeters scale by k, while Area(△PQR)/Area(△ABC) = k².',
    examReady: [
      'Similarity criteria: AA (AAA), SAS (included angle equal + sides proportional), SSS (all 3 sides proportional).',
      'Congruency is the special case of similarity with k = 1.',
      'Area ratio = square of corresponding side ratio: Area(△ABC)/Area(△DEF) = (BC/EF)².',
    ],
    misconceptions: [
      { myth: 'All rectangles or all right triangles are automatically similar.', reality: 'False! A square and a long rectangle have 90° angles, but their sides are not proportional.' },
    ],
  },
  predictPrompt: {
    question: 'Predict before sliding k: If every side of △ABC is multiplied by k = 1.5, what is the ratio of Area(△PQR) to Area(△ABC)?',
    options: [
      { id: 'sq', label: 'k² = 2.25 times larger', feedback: 'Exact! Slide k to 1.5 below to verify Area ratio = 2.25.', isExpected: true },
      { id: 'lin', label: 'k = 1.5 times larger', feedback: 'Perimeter scales by 1.5, but area scales by k²! Test k = 1.5 below.' },
    ],
  },
  microMission: 'Mission: Slide k = 1.0 to verify congruence (△ABC ≅ △PQR), then slide k = 1.5 and check why Area ratio becomes 2.25!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Equal Angles Preserve Shape', detail: 'Matching corresponding angles (AA/AAA) forces sides to scale uniformly by k.' },
      { heading: 'Step 2 · Base × Height Both Scale by k', detail: 'Since Area = ½ × base × height, scaling both by k multiplies area by k × k = k².' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Maths Exercise 4.1 Q.8 (p. 171)',
      problem: 'If △ABC ∼ △DEF such that Area(△ABC) = 9 cm², Area(△DEF) = 16 cm², and BC = 2.1 cm, find EF.',
      given: ['Area(△ABC) = 9 cm²', 'Area(△DEF) = 16 cm²', 'BC = 2.1 cm'],
      steps: ['Area ratio = (BC/EF)² ⇒ 9/16 = (2.1/EF)²', 'Take square roots: 3/4 = 2.1/EF', 'EF = (2.1 × 4) / 3 = 2.8 cm'],
      finalAnswer: 'EF = 2.8 cm.',
    },
  },
  solveChallenges: [
    {
      id: 'm42-q1',
      level: 'Supported',
      prompt: 'When does similarity △ABC ∼ △PQR become congruency △ABC ≅ △PQR?',
      options: [
        { id: 'a', text: 'When scale factor k = 1 (corresponding sides are equal)', isCorrect: true, why: 'Correct! Congruency is the special k = 1 case of similarity (p. 163).' },
        { id: 'b', text: 'When k = 2', isCorrect: false, why: 'At k = 2 the second triangle has double side lengths (similar, not congruent).' },
      ],
      hint: 'Click the k = 1 button in the lab above.',
    },
    {
      id: 'm42-q2',
      level: 'Apply to New Situation',
      prompt: 'TN Maths Ex 4.1 Q.3 (p. 170): A vertical 6 m stick casts a 4 m shadow. At the same instant a tower casts a 28 m shadow. Using similar triangles, find the tower height.',
      options: [
        { id: 'a', text: '42 m', isCorrect: true, why: 'Spot on! Height/6 = 28/4 = 7 ⇒ Height = 6 × 7 = 42 m.' },
        { id: 'b', text: '18.7 m', isCorrect: false, why: 'Check the proportion: tower shadow (28 m) is 7× stick shadow (4 m), so tower height is 7 × 6 m.' },
      ],
      hint: 'Parallel sun rays create similar right triangles: h / 6 = 28 / 4.',
    },
  ],
  remember: {
    takeaways: [
      'Similar triangles have equal corresponding angles and proportional sides (scale factor k).',
      'AA, SAS, and SSS criteria prove two triangles are similar.',
      'Ratio of areas of similar triangles equals the square of the ratio of their corresponding sides (k²).',
    ],
    flashcards: [
      { id: 'm42-fc1', front: 'Similarity vs Congruency (p. 163)', back: 'Congruent: same shape AND same size (k=1). Similar: same shape, proportional size (k > 0).', tag: 'Concept' },
      { id: 'm42-fc2', front: 'Area Ratio of Similar Triangles', back: 'Area(△ABC)/Area(△PQR) = (AB/PQ)² = (BC/QR)² = (CA/RP)².', tag: 'Formula' },
    ],
    funFact: {
      fact: 'Ancient Greek astronomer Eratosthenes used similar circles and shadow angles to calculate Earth’s circumference over 2,200 years ago!',
      source: 'TN Class 10 Mathematics 2025 Edition (p. 161)',
    },
  },
  readingChunks: [
    {
      id: 'm42-chunk-1',
      heading: '4.2 Similarity & 4.2.2 Criteria of Similarity (AA, SAS, SSS)',
      printedPage: 163,
      pdfPage: 169,
      summary: 'Compares congruent vs similar triangles, defines AA/SAS/SSS criteria, and lists five key results including perimeter and squared area ratios (p. 164).',
      plainExplanation: 'Always write triangle vertices in matching angle order (e.g., △ABC ∼ △PQR means ∠A=∠P, ∠B=∠Q, ∠C=∠R).',
      glossary: [{ term: 'Equiangular Triangles', tamil: 'சமகோண முக்கோணங்கள்', meaning: 'Triangles whose three corresponding angles are equal.' }],
      relatedExerciseRef: 'TN Maths Example 4.1 (p. 165) & Exercise 4.1 (pp. 170–171).',
    },
  ],
};

const PYTHAGORAS_SPEC: LessonExperienceSpec = {
  ...THALES_AND_BISECTOR_SPEC,
  sectionId: 'maths-04-04',
  sectionNumber: '4.4',
  title: { en: 'Pythagoras Theorem (Baudhayana Theorem)', ta: 'பிதாகரஸ் தேற்றம் (போதாயனார் தேற்றம்)' },
  textbookAnchor: {
    ...THALES_AND_BISECTOR_SPEC.textbookAnchor,
    printedPages: [183, 184, 185, 186],
    pdfPages: [189, 190, 191, 192],
    figures: ['Fig. 4.46 Proof of Pythagoras Theorem (p. 184)', 'Fig. 4.47 Example 4.20 (p. 185)'],
    exercises: ['Example 4.20 (p. 185)', 'Example 4.21 (p. 186)', 'Exercise 4.3'],
  },
  concept: 'In any right-angled triangle, the area of the square on the hypotenuse equals the sum of the areas of the squares on the other two legs (a² + b² = c²).',
  learningObjective: 'Visualize and prove Pythagoras Theorem using similar right triangles (altitude to hypotenuse) and solve real-world right-triangle distance problems.',
  misconception: 'Students sometimes add the raw leg lengths (a + b = c) instead of adding their SQUARES (a² + b² = c²), or misidentify which side is the hypotenuse.',
  variantId: 'pythagoras',
  variables: [
    { id: 'legA', label: 'Leg a', validRange: [2, 12] },
    { id: 'legB', label: 'Leg b', validRange: [2, 15] },
  ],
  spark: {
    question: 'Why did ancient Indian Sulbasutra builders (Baudhayana) tie knots at lengths 3, 4, and 5 on a rope to guarantee a perfect 90° temple corner?',
    teaser: 'Because 3² + 4² = 9 + 16 = 25 = 5² works ONLY when the corner angle is an exact 90°!',
  },
  explanations: {
    simple:
      'Build a square on each of the three sides of a right-angled triangle. Pythagoras (known in India as the Baudhayana Theorem, p. 185) proves that the two smaller squares on the perpendicular legs ALWAYS add up to the exact area of the largest square on the hypotenuse (the longest side opposite 90°): a² + b² = c².',
    analogy: 'Analogy: Two square tiles of areas 9 and 16 fit together seamlessly into one 25-unit square tile on the diagonal!',
    detailed:
      'Theorem 5 (pp. 184–185): In right △ABC (∠A = 90°), dropping altitude AD ⟂ BC creates △ABC ∼ △DBA (AB² = BC·BD) and △ABC ∼ △DAC (AC² = BC·DC). Adding gives AB² + AC² = BC(BD + DC) = BC².',
    examReady: [
      'Hypotenuse is ALWAYS the longest side opposite the 90° right angle.',
      'Proof method in TN Maths p. 184: Drop altitude AD ⟂ BC → use AA similarity twice → add AB² + AC² = BC².',
      'Common Pythagorean triplets: (3,4,5), (5,12,13), (6,8,10), (8,15,17).',
    ],
    misconceptions: [
      { myth: 'a² + b² = c² works for all triangles.', reality: 'Only for RIGHT-ANGLED triangles (90°)! For other triangles, the squares do not balance.' },
    ],
  },
  predictPrompt: {
    question: 'Predict before testing: If legs are a = 5 and b = 12, what is the exact hypotenuse c?',
    options: [
      { id: '13', label: 'c = 13 (because 25 + 144 = 169 = 13²)', feedback: 'Exact Pythagorean triplet! Click Triplet (5, 12, 13) below to see the three square areas.', isExpected: true },
      { id: '17', label: 'c = 17 (5 + 12)', feedback: 'Remember we add SQUARES of legs, not raw lengths! Test (5, 12) below.' },
    ],
  },
  microMission: 'Mission: Test all four Pythagorean triplet presets and observe how a² + b² always equals c² identically.',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Drop Altitude AD ⟂ BC', detail: 'Splits right △ABC into two smaller similar right triangles (△DBA and △DAC).' },
      { heading: 'Step 2 · Extract Two Products', detail: 'From △ABC ∼ △DBA: AB² = BC × BD; from △ABC ∼ △DAC: AC² = BC × DC.' },
      { heading: 'Step 3 · Add Both Equations', detail: 'AB² + AC² = BC(BD + DC) = BC × BC = BC².' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Maths Exercise 4.5 Q.9 (p. 199)',
      problem: 'Two poles of heights 6 m and 11 m stand vertically on flat ground 12 m apart. Find the distance between their tops.',
      given: ['Height difference a = 11 − 6 = 5 m', 'Horizontal ground distance b = 12 m'],
      steps: ['c² = a² + b² = 5² + 12² = 25 + 144 = 169', 'c = √169 = 13 m'],
      finalAnswer: 'Distance between their tops = 13 m.',
    },
  },
  solveChallenges: [
    {
      id: 'm44-q1',
      level: 'Supported',
      prompt: 'A right triangle has legs 6 cm and 8 cm. What is the length of its hypotenuse?',
      options: [
        { id: 'a', text: '10 cm', isCorrect: true, why: 'Correct! √(6² + 8²) = √(36 + 64) = √100 = 10 cm.' },
        { id: 'b', text: '14 cm', isCorrect: false, why: 'Do not add 6 + 8 directly; square them first!' },
      ],
      hint: 'Compute 6² + 8² and take the square root.',
    },
    {
      id: 'm44-q2',
      level: 'Apply to New Situation',
      prompt: 'Converse Check: A triangle has sides 8 cm, 15 cm, and 17 cm. Is it a right-angled triangle?',
      options: [
        { id: 'a', text: 'Yes — 8² + 15² = 64 + 225 = 289 = 17², satisfying the Converse of Pythagoras Theorem.', isCorrect: true, why: 'Spot on! Since the square of the longest side equals the sum of squares of the other two, the angle opposite 17 cm is 90°.' },
        { id: 'b', text: 'No — 8 + 15 ≠ 17.', isCorrect: false, why: 'We check the SUM OF SQUARES (8² + 15² vs 17²), never raw sums!' },
      ],
      hint: 'Compare 8² + 15² with 17².',
    },
  ],
  remember: {
    takeaways: [
      'Pythagoras (Baudhayana) Theorem: In a right triangle, Hypotenuse² = Leg₁² + Leg₂².',
      'Proved in TN Class 10 via altitude-to-hypotenuse AA similarity (p. 184).',
      'Converse: If c² = a² + b², the triangle is right-angled opposite longest side c.',
    ],
    flashcards: [
      { id: 'm44-fc1', front: 'Indian Historical Name (p. 185)', back: 'Baudhayana Theorem (stated in ancient Indian Sulbasutras).', tag: 'History' },
      { id: 'm44-fc2', front: 'Key Proof Construction (p. 184)', back: 'Draw altitude AD ⟂ hypotenuse BC to get △ABC ∼ △DBA and △ABC ∼ △DAC.', tag: '5-Mark Proof' },
    ],
    funFact: {
      fact: 'In India, Pythagoras Theorem is also referred to as the "Baudhayana Theorem", documented centuries earlier in the Baudhayana Sulbasutra (noted directly on TN Maths p. 185).',
      source: 'TN Class 10 Mathematics 2025 Edition (p. 185)',
    },
  },
  readingChunks: [
    {
      id: 'm44-chunk-1',
      heading: '4.4 Pythagoras Theorem (Theorem 5) & Converse',
      printedPage: 184,
      pdfPage: 190,
      summary: 'Proves AB² + AC² = BC² using AA similarity via altitude AD ⟂ BC, states the Converse, and solves Example 4.20 (lamp post & insect).',
      plainExplanation: 'Always check which vertex carries the 90° angle before identifying the hypotenuse!',
      glossary: [{ term: 'Hypotenuse', tamil: 'கர்ணம்', meaning: 'Longest side of a right-angled triangle, directly opposite the 90° angle.' }],
      relatedExerciseRef: 'TN Maths Examples 4.20–4.21 (pp. 185–186) & Exercise 4.3.',
    },
  ],
};

const CIRCLES_TANGENTS_SPEC: LessonExperienceSpec = {
  ...THALES_AND_BISECTOR_SPEC,
  sectionId: 'maths-04-05',
  sectionNumber: '4.5',
  title: { en: 'Circles and Tangents', ta: 'வட்டங்கள் மற்றும் தொடுகோடுகள்' },
  textbookAnchor: {
    ...THALES_AND_BISECTOR_SPEC.textbookAnchor,
    printedPages: [188, 189, 190, 191, 192, 193],
    pdfPages: [194, 195, 196, 197, 198, 199],
    figures: ['Fig. 4.54–4.56 Radius ⟂ Tangent & Equal Tangents (p. 189)', 'Fig. 4.62 Example 4.24 (p. 191)'],
    exercises: ['Example 4.24 (p. 191)', 'Example 4.26 (p. 192)', 'Exercise 4.4 (p. 198)'],
  },
  concept: 'A tangent touches a circle at exactly one point P, is ALWAYS perpendicular (90°) to radius OP at the point of contact, and two tangents drawn from an external point T are equal in length (TP = TQ).',
  learningObjective: 'Verify OP ⟂ PT (90°) and TP = TQ, compute tangent length using Pythagoras PT = √(OT² − r²), and distinguish tangent vs secant vs chord.',
  misconception: 'Students sometimes put OT as a leg instead of the hypotenuse of right △OPT — remember the 90° angle is at contact point P, so OT is ALWAYS the hypotenuse!',
  variantId: 'circles_tangents',
  variables: [
    { id: 'radiusR', label: 'Circle Radius r (OP)', unit: 'cm', validRange: [2, 10] },
    { id: 'distOT', label: 'External Distance OT', unit: 'cm', validRange: [3, 15] },
  ],
  spark: {
    question: 'When a bicycle wheel rolls smoothly along a flat road, why is the spoke pointing straight down to the ground ALWAYS at a 90° right angle to the road?',
    teaser: 'Because the road is a tangent touching the circular wheel at just one point — and radius OP is always perpendicular to the tangent!',
  },
  explanations: {
    simple:
      'A tangent (from Latin "tangere", to touch) kisses a circle at just ONE single point P without crossing inside. Two golden rules govern every tangent problem: (1) The radius OP to the contact point ALWAYS meets the tangent at 90° (OP ⟂ PT), forming a right triangle △OPT where OT is the hypotenuse! (2) From any external point T outside the circle, you can draw exactly TWO tangents, and they are always equal in length (TP = TQ).',
    analogy: 'Analogy: Like a stone swung on a string — the instant you let go, it flies straight along the 90° tangent line perpendicular to the radius string (TN Maths p. 189).',
    detailed:
      'Per TN Maths 4.5 (pp. 189–191): No tangent exists from an interior point; 1 tangent at a point on the circle; 2 equal tangents from an exterior point (proved via SAS congruence △OAP ≅ △OBP). Combined with Pythagoras in right △OPT: PT = √(OT² − r²).',
    examReady: [
      'Radius through point of contact is perpendicular to tangent (∠OPT = 90°).',
      'Number of tangents: Interior point = 0; On circle = 1; Exterior point = 2 (and TP = TQ).',
      'Hypotenuse in tangent triangle △OPT is OT (center to external point), so PT = √(OT² − r²).',
    ],
    misconceptions: [
      { myth: 'You can draw a tangent from a point inside the circle.', reality: 'Any straight line through an interior point cuts the circle at TWO points — making it a secant, never a tangent!' },
    ],
  },
  predictPrompt: {
    question: 'Predict before testing Example 4.24: A circle has radius r = 3 cm and external point T is OT = 5 cm from the centre O. What is tangent length PT?',
    options: [
      { id: '4', label: 'PT = 4 cm (√(5² − 3²) = √16 = 4)', feedback: 'Spot on! Load Example 4.24 below and watch ∠OPT = 90° form the 3-4-5 right triangle.', isExpected: true },
      { id: '5.8', label: 'PT = √(5² + 3²) ≈ 5.83 cm', feedback: 'Watch out! OT (5 cm) is the HYPOTENUSE opposite the 90° angle at P, so we SUBTRACT r² from OT²!' },
    ],
  },
  microMission: 'Mission: Load Example 4.24 (r = 3, OT = 5 → PT = 4 cm), then test what happens when OT ≤ r (interior point error)!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Shortest Distance Rule', detail: 'Every point on the tangent except P lies outside the circle (distance > r), so OP is the shortest segment from O to the tangent ⇒ OP ⟂ PT (90°).' },
      { heading: 'Step 2 · Right Triangle △OPT', detail: 'Since ∠OPT = 90°, OT is the hypotenuse ⇒ OT² = OP² + PT² ⇒ PT = √(OT² − r²).' },
      { heading: 'Step 3 · Equal Tangents TP = TQ', detail: 'In △OPT and △OQT, OP = OQ = r, OT is common, and both have 90° angles ⇒ congruent ⇒ PT = QT.' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Mathematics Example 4.24 (p. 191, Fig. 4.62)',
      problem: 'Find the length of the tangent drawn from a point whose distance from the centre of a circle is 5 cm and radius of the circle is 3 cm.',
      given: ['OT = 5 cm', 'Radius r = OP = 3 cm', '∠OPT = 90° (radius ⟂ tangent)'],
      steps: ['By Pythagoras Theorem: OT² = OP² + PT²', '5² = 3² + PT² ⇒ PT² = 25 − 9 = 16', 'PT = √16 = 4 cm'],
      finalAnswer: 'Length of tangent PT = 4 cm.',
    },
  },
  solveChallenges: [
    {
      id: 'm45-q1',
      level: 'Supported',
      prompt: 'TN Maths Ex 4.5 Q.11 (p. 200): A tangent is perpendicular to the radius at the ______.',
      options: [
        { id: 'a', text: 'Point of contact', isCorrect: true, why: 'Correct! Radius OP meets tangent at 90° strictly at the point of contact P (p. 189).' },
        { id: 'b', text: 'Centre of the circle', isCorrect: false, why: 'The tangent never passes through the centre O.' },
      ],
      hint: 'Look at the 90° marker on point P in the diagram above.',
    },
    {
      id: 'm45-q2',
      level: 'Apply to New Situation',
      prompt: 'TN Maths Ex 4.4 Q.1 (p. 198): The length of a tangent from point P, which is 25 cm away from centre O, is 24 cm. Find the radius of the circle.',
      options: [
        { id: 'a', text: '7 cm', isCorrect: true, why: 'Mastery! r = √(25² − 24²) = √(625 − 576) = √49 = 7 cm.' },
        { id: 'b', text: '1 cm', isCorrect: false, why: 'Use squares: 25² − 24² = 49, then take √49 = 7 cm.' },
      ],
      hint: 'In right △OTP, hypotenuse OP = 25 cm and tangent PT = 24 cm; find r = √(25² − 24²).',
    },
  ],
  remember: {
    takeaways: [
      'A tangent touches a circle at exactly one point and is perpendicular (90°) to the radius there.',
      'From an external point T, exactly two equal tangents (TP = TQ) can be drawn.',
      'Tangent length formula: PT = √(OT² − r²) — OT is always the hypotenuse.',
    ],
    flashcards: [
      { id: 'm45-fc1', front: 'How many tangents from Interior / On / Exterior point?', back: 'Interior = 0; On circle = 1; Exterior = 2 (and both have equal length!).', tag: 'Exam Key' },
      { id: 'm45-fc2', front: 'Origin of the word "Tangent" (p. 188)', back: 'From Latin "tangere" ("to touch"), introduced by Thomas Fineko in 1583.', tag: 'History' },
    ],
    funFact: {
      fact: 'The word "tangent" comes from the Latin "tangere" meaning "to touch", first introduced by Danish mathematician Thomas Fineko in 1583 (TN Maths p. 188).',
      source: 'TN Class 10 Mathematics 2025 Edition (p. 188)',
    },
  },
  readingChunks: [
    {
      id: 'm45-chunk-1',
      heading: '4.5 Circles and Tangents — Radius ⟂ Tangent & Equal Tangents',
      printedPage: 189,
      pdfPage: 195,
      summary: 'Defines tangent, gives cycling/stone-on-string daily examples, proves equal tangent lengths from external point, and solves Example 4.24.',
      plainExplanation: 'This is where Tangent–Radius belongs (Section 4.5), cleanly separated from Thales Theorem in Section 4.3!',
      glossary: [{ term: 'Tangent', tamil: 'தொடுகோடு', meaning: 'Straight line touching a circle at exactly one point of contact.' }],
      relatedExerciseRef: 'TN Maths Example 4.24 (p. 191) & Exercise 4.4 (p. 198).',
    },
  ],
};

const CONCURRENCY_SPEC: LessonExperienceSpec = {
  ...THALES_AND_BISECTOR_SPEC,
  sectionId: 'maths-04-06',
  sectionNumber: '4.6',
  title: { en: 'Concurrency Theorems (Ceva’s & Menelaus’s)', ta: 'ஒரு புள்ளி வழிச் செல்லும் தேற்றங்கள்' },
  textbookAnchor: {
    ...THALES_AND_BISECTOR_SPEC.textbookAnchor,
    printedPages: [195, 196, 197],
    pdfPages: [201, 202, 203],
    figures: ['Fig. 4.71–4.73 Ceva’s Theorem (pp. 196–197)', 'Fig. 4.74 Menelaus’s Theorem (p. 197)'],
    exercises: ['Example 4.33 (p. 197)', 'Example 4.34 (p. 197)'],
  },
  concept: 'Three cevians AD, BE, CF of △ABC meet at a single concurrent point if and only if Ceva’s cyclic ratio product equals 1: (BD/DC) × (CE/EA) × (AF/FB) = 1.',
  learningObjective: 'Verify concurrency using Ceva’s Theorem (including medians meeting at the Centroid) and solve missing side-segment problems like Example 4.33.',
  misconception: 'Students sometimes break the cyclic vertex order (B→D→C→E→A→F→B) when multiplying the three fractions in Ceva’s Theorem.',
  variantId: 'concurrency',
  variables: [
    { id: 'cevaMode', label: 'Mode (Example 4.33 vs Centroid Medians)' },
    { id: 'cevaBD', label: 'Segment BD on BC = 15', validRange: [3, 14] },
  ],
  spark: {
    question: 'Why do all three medians of ANY triangle always balance at one single exact pinpoint (the Centroid), never forming a messy gap?',
    teaser: 'Ceva’s Theorem proves the universal product-equals-1 test for concurrency!',
  },
  explanations: {
    simple:
      'A line from a triangle vertex to the opposite side is called a cevian (medians, altitudes, and angle bisectors are all cevians!). Three lines that pass through the exact same point are called concurrent. Ceva’s Theorem gives a crisp numerical test: walk around the perimeter of △ABC multiplying the three split ratios (BD/DC) × (CE/EA) × (AF/FB). If the product equals 1, all three cevians meet at ONE exact point!',
    analogy: 'Analogy: Like three tightropes tied across a triangular tent — only when their anchor ratios balance to product 1 do all three ropes cross at one central pole.',
    detailed:
      'Per TN Maths 4.6 (pp. 196–197): Ceva’s Theorem states that cevians AD, BE, CF are concurrent iff (BD/DC)(CE/EA)(AF/FB) = 1. For medians, BD=DC, CE=EA, AF=FB ⇒ 1 × 1 × 1 = 1, instantly proving medians are concurrent at the Centroid.',
    examReady: [
      'Ceva’s Theorem: (BD/DC) × (CE/EA) × (AF/FB) = 1 ⇔ cevians AD, BE, CF are concurrent.',
      'Menelaus’s Theorem: Tests whether three points on triangle sides/extensions are COLLINEAR (lie on one straight line, Example 4.34).',
    ],
    misconceptions: [
      { myth: 'Ceva’s Theorem and Menelaus’s Theorem test the same property.', reality: 'Ceva’s tests CONCURRENCY (3 lines meeting at 1 point); Menelaus’s tests COLLINEARITY (3 points lying on 1 straight line)!' },
    ],
  },
  predictPrompt: {
    question: 'Predict before sliding BD in Example 4.33 (BC = 15, CE/EA = 5/8, AF/FB = 2/5): What value of BD makes Ceva’s product equal 1?',
    options: [
      { id: '12', label: 'BD = 12 (so DC = 3 and (12/3) × (5/8) × (2/5) = 4 × 1/4 = 1)', feedback: 'Spot on! Slide BD to 12 below to see all three cevians lock onto one concurrent point!', isExpected: true },
      { id: '7.5', label: 'BD = 7.5 (midpoint of 15)', feedback: 'Try sliding BD = 7 vs 12 below — since CE/EA and AF/FB are not 1, BD cannot be the midpoint!' },
    ],
  },
  microMission: 'Mission: Slide BD in Example 4.33 to see the product break away from 1, then lock BD = 12 to verify concurrency!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Walk Cyclically Around △ABC', detail: 'Start at B → D → C → E → A → F → B so each side gives one ratio.' },
      { heading: 'Step 2 · Multiply the Three Ratios', detail: 'Compute (BD/DC) × (CE/EA) × (AF/FB).' },
      { heading: 'Step 3 · Product = 1 Means Concurrency', detail: 'Exact balance to 1 guarantees AD, BE, CF intersect at a single concurrent point O.' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Mathematics Example 4.33 (p. 197, Fig. 4.73)',
      problem: 'In △ABC, AB = 13, AC = 14, BC = 15. If AF/FB = 2/5 and CE/EA = 5/8 and cevians AD, BE, CF are concurrent, find BD and DC.',
      given: ['BC = BD + DC = 15', 'AF/FB = 2/5, CE/EA = 5/8'],
      steps: [
        'By Ceva’s Theorem: (BD/DC) × (5/8) × (2/5) = 1 ⇒ (BD/DC) × (1/4) = 1 ⇒ BD/DC = 4',
        'Let DC = y, then BD = 4y. Since 4y + y = 15 ⇒ 5y = 15 ⇒ y = 3',
        'Hence BD = 12 and DC = 3.',
      ],
      finalAnswer: 'BD = 12 units and DC = 3 units.',
    },
  },
  solveChallenges: [
    {
      id: 'm46-q1',
      level: 'Supported',
      prompt: 'For the three medians of a triangle (where D, E, F are midpoints of the sides), what is Ceva’s product?',
      options: [
        { id: 'a', text: '1 × 1 × 1 = 1 (proving all three medians are concurrent at the Centroid)', isCorrect: true, why: 'Correct! Midpoints make every ratio 1, so the product is trivially 1 (p. 196).' },
        { id: 'b', text: '3', isCorrect: false, why: 'Ceva’s Theorem MULTIPLIES the three ratios (1 × 1 × 1 = 1), never adds them.' },
      ],
      hint: 'Click "Centroid (Medians)" in the lab above.',
    },
    {
      id: 'm46-q2',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: Three concurrent cevians divide two sides as AF/FB = 3/2 and CE/EA = 4/3. What must BD/DC equal?',
      options: [
        { id: 'a', text: '1/2 (since (1/2) × (4/3) × (3/2) = 1)', isCorrect: true, why: 'Exact! (4/3) × (3/2) = 2, so BD/DC must be the reciprocal 1/2.' },
        { id: 'b', text: '2', isCorrect: false, why: 'Check: 2 × (4/3) × (3/2) = 4 ≠ 1.' },
      ],
      hint: 'Multiply (4/3) × (3/2) first, then take its reciprocal.',
    },
  ],
  remember: {
    takeaways: [
      'A cevian connects a triangle vertex to a point on the opposite side.',
      'Ceva’s Theorem: (BD/DC) × (CE/EA) × (AF/FB) = 1 proves three cevians are concurrent.',
      'Menelaus’s Theorem uses a cyclic ratio product to prove three points are collinear (Example 4.34).',
    ],
    flashcards: [
      { id: 'm46-fc1', front: 'Ceva’s vs Menelaus’s Theorem', back: 'Ceva’s tests CONCURRENCY of 3 cevians; Menelaus’s tests COLLINEARITY of 3 points.', tag: 'Compare' },
      { id: 'm46-fc2', front: 'Point of concurrence of medians?', back: 'Centroid (proved concurrent via Ceva’s Theorem: 1 × 1 × 1 = 1, p. 196).', tag: 'Definition' },
    ],
    funFact: {
      fact: 'Italian mathematician Giovanni Ceva published his concurrency theorem in 1678 — though scholars later discovered Yusuf Al-Mu’taman ibn Hud, king of Zaragoza, had proved it six centuries earlier in the 11th century!',
      source: 'History of Geometry & TN Class 10 Mathematics (p. 196)',
    },
  },
  readingChunks: [
    {
      id: 'm46-chunk-1',
      heading: '4.6 Concurrency Theorems — Ceva’s & Menelaus’s Theorem',
      printedPage: 196,
      pdfPage: 202,
      summary: 'Introduces cevians, Ceva’s Theorem proving concurrency of medians and angle bisectors, and Menelaus’s Theorem for collinearity (Examples 4.33–4.34).',
      plainExplanation: 'Trace vertices in one continuous loop around the triangle so you never accidentally flip a fraction upside down.',
      glossary: [{ term: 'Cevian', tamil: 'சீவியன்', meaning: 'Line segment joining any vertex of a triangle to a point on the opposite side.' }],
      relatedExerciseRef: 'TN Maths Examples 4.33–4.34 (p. 197) & Exercise 4.4 Q.9–10 (p. 198).',
    },
  ],
};

// Also bind key subheadings in Chapter 4 directly to their exact mathematical theorem!
export const MATHS_CH4_CONCEPT_FIRST_SPECS: LessonExperienceSpec[] = [
  SIMILARITY_SPEC,
  { ...SIMILARITY_SPEC, sectionId: 'maths-04-auto-4-2-1-similar-triangles', sectionNumber: '4.2.1', title: { en: 'Similar Triangles', ta: 'வடிவொத்த முக்கோணங்கள்' } },
  { ...SIMILARITY_SPEC, sectionId: 'maths-04-auto-4-2-2-criteria-of-similarity', sectionNumber: '4.2.2', title: { en: 'Criteria of Similarity (AA, SAS, SSS)', ta: 'வடிவொத்த முக்கோணங்களின் விதிமுறைகள்' } },
  THALES_AND_BISECTOR_SPEC,
  { ...THALES_AND_BISECTOR_SPEC, sectionId: 'maths-04-auto-4-3-1-introduction', sectionNumber: '4.3.1', title: { en: 'Thales Theorem (BPT) & Angle Bisector Introduction', ta: 'தேல்ஸ் தேற்றம் அறிமுகம்' } },
  PYTHAGORAS_SPEC,
  CIRCLES_TANGENTS_SPEC,
  { ...CIRCLES_TANGENTS_SPEC, sectionId: 'maths-04-auto-4-5-1-construction', sectionNumber: '4.5.1', title: { en: 'Construction of Tangents to a Circle', ta: 'வட்டத்திற்கு தொடுகோடுகள் வரைதல்' } },
  CONCURRENCY_SPEC,
];
