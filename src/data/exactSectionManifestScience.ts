import type { LessonExperienceSpec } from '../types/lessonExperience';

const SCI_PORTAL = 'https://textbookcorp.tn.gov.in/';
const SCI_BOOK = 'TN State Board Class 10 Science';
const SCI_EDITION = '2024 Reprint (First Ed. 2019; Revised 2020, 2022, 2023)';
const SCI_PDF = 'Class_10_Science_English_2024_Edition-www.tntextbooks.in.pdf';

const ELECTRIC_POTENTIAL_SPEC: LessonExperienceSpec = {
  sectionId: 'science-04-auto-4-3-1-electric-potential',
  subject: 'science',
  unitId: 'science-04',
  sectionNumber: '4.3.1',
  title: { en: 'Electric Potential', ta: 'மின்னழுத்தம் (Electric Potential)' },
  estimatedMinutes: '8–10 min',
  textbookAnchor: {
    book: SCI_BOOK,
    edition: SCI_EDITION,
    pdf: SCI_PDF,
    printedPages: [44, 45],
    pdfPages: [52, 53],
    figures: ['Figure 4.3 Electric potential (p. 44)'],
    exercises: ['Solved Problem-2 (pp. 44–45)', 'Unit 4 Evaluation Short/Numerical Problems'],
    officialPortalUrl: SCI_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: 'Electric potential is work done per unit positive charge moved from infinity against electric force (V = W/Q); potential difference drives charge flow.',
  learningObjective: 'Distinguish electric potential at a point from potential difference between two points and compute V = W/Q with exact SI units (1 V = 1 J/C).',
  misconception: 'Students often confuse total work W (in joules) with electric potential V (in joules per coulomb), assuming more total work always means higher voltage even when more charge is moved.',
  primaryMode: '2d-svg',
  engineId: 'ElectricPotentialLab2D',
  variantId: 'electric_potential_sandbox_2d',
  modelAssumptions: [
    'Reference zero potential is placed at infinity (V∞ = 0 V), matching TN Science p. 44.',
    '2D concentric circles schematically indicate higher potential near +Q and lower potential further away; not a full 3D electrostatic field solver.',
  ],
  variables: [
    { id: 'workJ', label: 'Work Done (W)', unit: 'J', validRange: [10, 120] },
    { id: 'chargeC', label: 'Test Charge (Q)', unit: 'C', validRange: [1, 10] },
    { id: 'targetPoint', label: 'Selected Point (A or B)' },
  ],
  expectedObservations: [
    'Doubling Q while keeping W constant halves V = W/Q.',
    'Point A (closer to +Q) has a higher electric potential than Point B, creating a potential difference VA − VB.',
  ],
  spark: {
    question: 'Why does water flow down a pipe only when one tank is higher than the other — and what plays the role of "height" for electric charges in a wire?',
    teaser: 'Just as heat needs a temperature difference to flow, electric charges need an electric potential difference!',
  },
  explanations: {
    simple:
      'Electric potential tells you how much energy (work) is packed into each single coulomb of positive charge at a spot. Imagine carrying buckets of water uphill from sea level: lifting 2 buckets takes twice the work of lifting 1 bucket, yet the hill height stays the same! In electricity, work per coulomb is voltage (V = W / Q). Potential difference is simply the "electric height gap" between two points A and B that pushes charges to flow.',
    simpleTamil:
      'மின்னழுத்தம் (Electric Potential) என்பது ஒரு கூலூம் நேர் மின்னூட்டத்தை முடிவிலாத் தொலைவிலிருந்து ஒரு புள்ளிக்கு நகர்த்தச் செய்யப்படும் வேலை (V = W / Q) ஆகும். உயர வேறுபாடு இருந்தால் மட்டுமே நீர் ஓடுவது போல, இரு புள்ளிகளுக்கு இடையே மின்னழுத்த வேறுபாடு இருந்தால் மட்டுமே மின்னோட்டம் பாயும்.',
    analogy: 'Analogy: Electric potential is like gravitational height per kilogram, whereas total work is the total effort to lift all the bags together.',
    detailed:
      'Per TN Class 10 Science (4.3.1 & 4.3.2, p. 44), the electric potential at a point is the work done in moving a unit positive charge from infinity to that point against the electric force. The electric potential difference between points A and B is the work done moving a unit positive charge from A to B: V = W / Q = VA − VB (when VA > VB). Its SI unit is the volt (1 V = 1 J / 1 C).',
    examReady: [
      '4.3.1 Electric Potential: Work done in moving a unit positive charge from infinity to a point against electric force.',
      '4.3.2 Potential Difference: V = W / Q = VA − VB (if VA > VB).',
      '4.3.3 Volt: Potential difference is 1 volt when 1 joule of work moves 1 coulomb of charge (1 V = 1 J/C).',
    ],
    misconceptions: [
      {
        myth: 'More total work W always means higher electric potential V.',
        reality: 'False! Potential is work PER UNIT CHARGE (V = W/Q). Moving 4 C with 24 J gives only 6 V, whereas moving 2 C with 24 J gives 12 V.',
      },
      {
        myth: 'Charges flow even if both ends of a wire have the exact same potential.',
        reality: 'False! When VA = VB, potential difference is 0 V, so there is no net push for electric current.',
      },
    ],
  },
  mindMap: {
    title: 'Electric Potential & Potential Difference Map',
    nodes: [
      { id: 'ref', label: 'Reference (∞ = 0 V)', role: 'cause', summary: 'Zero-potential starting point', detail: 'Work is measured starting from infinity where electric force is negligible.', x: 95, y: 120 },
      { id: 'pot', label: 'Electric Potential V = W/Q', role: 'core', summary: 'Work per 1 coulomb', detail: 'Energy needed per unit positive charge to reach a point (SI unit: volt, 1 V = 1 J/C).', x: 280, y: 75 },
      { id: 'pdiff', label: 'Potential Diff (VA − VB)', role: 'mechanism', summary: 'Drives charge flow', detail: 'Difference in potential between two points A and B creates the push for current.', x: 470, y: 75 },
      { id: 'flow', label: 'Current Flow (High → Low)', role: 'application', summary: 'Battery maintains ΔV', detail: 'Positive convention flows from higher potential to lower potential (electrons move opposite).', x: 470, y: 190 },
      { id: 'caution', label: 'Not Total Work!', role: 'caution', summary: 'Always divide W by Q', detail: 'Equal work on double charge yields half the potential.', x: 240, y: 195 },
    ],
    edges: [
      { from: 'ref', to: 'pot', relation: 'move +1 C against force' },
      { from: 'pot', to: 'pdiff', relation: 'compare A and B' },
      { from: 'pdiff', to: 'flow', relation: 'pushes charges' },
      { from: 'pot', to: 'caution', relation: 'divide by Q' },
    ],
  },
  predictPrompt: {
    question: 'Before testing in the sandbox: If you spend the EXACT SAME 24 J of work to move 2 C of charge in Case 1 and 4 C of charge in Case 2, which case has the HIGHER electric potential?',
    options: [
      { id: 'case1', label: 'Case 1 (24 J moving 2 C) has higher potential', feedback: 'Spot on! 24 J / 2 C = 12 V is twice as high as 24 J / 4 C = 6 V. Verify it using the Compare button below!', isExpected: true },
      { id: 'case2', label: 'Case 2 (24 J moving 4 C) has higher potential', feedback: 'Good hypothesis to test! Click "Compare Equal Work" in the sandbox below and watch what happens when 24 J is split across 4 coulombs.' },
      { id: 'same', label: 'Both have the exact same potential because work is 24 J', feedback: 'Common trap! Test it below — notice V divides work by charge Q.' },
    ],
  },
  microMission: 'Mission: Load Solved Problem 2 (100 J, 10 C) to confirm 10 V, then toggle Equal-Work Comparison to see why 24 J on 2 C produces double the voltage of 24 J on 4 C.',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Identify Work (W) and Charge (Q)', detail: 'Work is measured in joules (J) and electric charge in coulombs (C).' },
      { heading: 'Step 2 · Divide to get Work per Unit Charge', detail: 'V = W / Q gives joules per coulomb, defined as volts (1 V = 1 J/C).' },
      { heading: 'Step 3 · Compare Two Points for Flow', detail: 'Only a non-zero potential difference (VA − VB ≠ 0) drives continuous charge flow.' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Science Solved Problem-2 (pp. 44–45)',
      problem: 'The work done in moving a charge of 10 C across two points in a circuit is 100 J. What is the potential difference between the points?',
      given: ['Charge Q = 10 C', 'Work done W = 100 J'],
      steps: ['Formula: V = W / Q', 'Substitute values: V = 100 J / 10 C', 'Simplify: V = 10 J/C = 10 volt'],
      finalAnswer: 'Potential difference V = 10 V',
    },
  },
  solveChallenges: [
    {
      id: 'ep-q1',
      level: 'Supported',
      prompt: 'What is the SI unit of electric potential, and what is it equal to?',
      options: [
        { id: 'a', text: 'Ampere (1 C/s)', isCorrect: false, why: 'Ampere (1 C/s) measures electric current (rate of charge flow), not potential.' },
        { id: 'b', text: 'Volt (1 J/C)', isCorrect: true, why: 'Correct! 1 volt = 1 joule of work done per 1 coulomb of charge moved (p. 44).' },
        { id: 'c', text: 'Ohm (1 V/A)', isCorrect: false, why: 'Ohm measures electrical resistance.' },
      ],
      hint: 'Check the formula V = W / Q: joules divided by coulombs.',
    },
    {
      id: 'ep-q2',
      level: 'Independent',
      prompt: 'Moving a charge of 5 C between two points requires 60 J of work. What is the potential difference between the two points?',
      options: [
        { id: 'a', text: '300 V', isCorrect: false, why: 'Multiplying W × Q gives J·C, not volts. Remember V = W / Q.' },
        { id: 'b', text: '12 V', isCorrect: true, why: 'Correct! V = W / Q = 60 J / 5 C = 12 V.' },
        { id: 'c', text: '0.083 V', isCorrect: false, why: 'That is Q / W instead of W / Q.' },
      ],
      hint: 'Divide Work (60 J) by Charge (5 C).',
    },
    {
      id: 'ep-q3',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: Situation X uses 24 J to move 2 C, while Situation Y uses 24 J to move 4 C. Which situation has higher potential, and why?',
      options: [
        { id: 'a', text: 'Situation X (12 V > 6 V), because each coulomb receives twice as much work/energy.', isCorrect: true, why: 'Exactly right! VX = 24/2 = 12 V while VY = 24/4 = 6 V. Potential is work per unit charge.' },
        { id: 'b', text: 'Situation Y, because moving 4 C is heavier than moving 2 C.', isCorrect: false, why: 'Sharing the same 24 J across more coulombs means LESS work per individual coulomb (6 V).' },
        { id: 'c', text: 'Both are equal because 24 J of work is done in both cases.', isCorrect: false, why: 'Equal total work does not mean equal potential when the charges differ.' },
      ],
      hint: 'Compute V = W / Q separately for Situation X and Situation Y.',
    },
  ],
  remember: {
    takeaways: [
      'Electric potential at a point is work done per unit positive charge from infinity: V = W / Q.',
      '1 volt = 1 joule / 1 coulomb (1 V = 1 J/C).',
      'Potential difference (VA − VB) between two points is what drives electric current through a conductor.',
    ],
    flashcards: [
      { id: 'ep-fc1', front: 'Define Electric Potential (4.3.1)', back: 'Work done in moving a unit positive charge from infinity to that point against the electric force.', tag: 'Definition' },
      { id: 'ep-fc2', front: 'Formula & SI Unit of Potential Difference', back: 'V = W / Q = VA − VB; SI unit is Volt (1 V = 1 J/C).', tag: 'Formula' },
      { id: 'ep-fc3', front: 'Equal Work Trap: 24 J on 2 C vs 4 C?', back: '2 C gives 12 V; 4 C gives 6 V. More charge for the same work means lower potential.', tag: 'Misconception' },
    ],
    funFact: {
      fact: 'The SI unit "volt" is named after Italian physicist Alessandro Volta (1745–1827), who built the first chemical battery (voltaic pile) in 1800 to maintain a steady potential difference.',
      source: 'SI Base/Derived Unit History & TN Class 10 Science Unit 4 (p. 44)',
    },
  },
  readingChunks: [
    {
      id: 'ep-chunk-1',
      heading: '4.3.1 Electric Potential & 4.3.2 Potential Difference (Fig. 4.3)',
      printedPage: 44,
      pdfPage: 52,
      summary: 'Introduces the analogy between water/heat flow and electric charge flow, defining electric potential from infinity and potential difference between points A and B via V = W/Q.',
      plainExplanation: 'Read p. 44 focusing on the difference between one single point (potential relative to infinity) and two points A and B (potential difference VA − VB).',
      glossary: [
        { term: 'Electric Potential', tamil: 'மின்னழுத்தம்', meaning: 'Work done per unit positive charge brought from infinity to a point.' },
        { term: 'Volt (V)', tamil: 'வோல்ட்', meaning: '1 joule of work per 1 coulomb of charge (1 J/C).' },
      ],
      relatedExerciseRef: 'TN Science Unit 4 Solved Problem-2 (pp. 44–45) & Numerical Problems (p. 56).',
    },
  ],
  selfCheckPrompt: 'In 1–2 sentences of your own words, explain the difference between electric potential at a point and potential difference between two points.',
  selfCheckGuide: 'Check that your answer mentions: (1) potential at a point is work per unit positive charge from infinity, and (2) potential difference is the difference VA − VB between two points that causes charges to flow.',
  alternative2D: 'Fully native accessible 2D SVG sandbox with keyboard-selectable points A/B and numeric readouts.',
  accessibleText: 'At point A with W = 24 J and Q = 2 C, V = 12 V. Doubling Q to 4 C lowers V to 6 V.',
  reviewGate: ['PDF Verified (Science 2024 pp. 44–45)', 'Pending TN Class 10 Physics Teacher Sign-off'],
};

const JOULES_LAW_SPEC: LessonExperienceSpec = {
  sectionId: 'science-04-auto-4-8-1-joule-s-law-of-heating',
  subject: 'science',
  unitId: 'science-04',
  sectionNumber: '4.8.1',
  title: { en: "Joule's Law of Heating", ta: 'ஜூல் வெப்ப விதி (Joule’s Law of Heating)' },
  estimatedMinutes: '8–10 min',
  textbookAnchor: {
    book: SCI_BOOK,
    edition: SCI_EDITION,
    pdf: SCI_PDF,
    printedPages: [50, 51],
    pdfPages: [58, 59],
    figures: ['Eq. 4.19 (H = VIt) & Eq. 4.20 (H = I²Rt)'],
    exercises: ['Solved Problem-6 (p. 51)', 'Applications: Nichrome, Fuse Wire, Tungsten Filament'],
    officialPortalUrl: SCI_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: "Heat produced in a resistor obeys H = I²Rt — proportional to the SQUARE of current, directly to resistance, and directly to time.",
  learningObjective: "Derive and apply H = I²Rt, explain why doubling current quadruples heat (4×), and connect Nichrome/fuse/tungsten properties to Joule heating.",
  misconception: 'Students frequently expect doubling current I to merely double heat H (linear intuition), forgetting the squared I² factor.',
  primaryMode: '2d-svg',
  engineId: 'JoulesLawLab2D',
  variantId: 'joules_law_heating_2d',
  modelAssumptions: [
    'Exact Joule energy formula H = I²Rt in joules (SI units: A, Ω, s).',
    'Optional coil ΔT display assumes adiabatic simplified ΔT = H/(mc) with fixed m = 0.25 kg, c = 450 J/(kg·K), and no heat loss.',
  ],
  variables: [
    { id: 'currentA', label: 'Current (I)', unit: 'A', validRange: [1, 10] },
    { id: 'resistanceOhm', label: 'Resistance (R)', unit: 'Ω', validRange: [1, 20] },
    { id: 'timeSec', label: 'Time (t)', unit: 's', validRange: [5, 300] },
  ],
  expectedObservations: [
    'Doubling I while locking R and t multiplies H by exactly 4×.',
    'Doubling R or doubling t multiplies H by 2× (linear).',
    'Setting I = 6 A, R = 5 Ω, t = 300 s reproduces Solved Problem-6: H = 54,000 J.',
  ],
  spark: {
    question: 'Why does the motor casing of a ceiling fan or an electric iron coil get hot — and why can doubling the current overheat a house wire FOUR times faster?',
    teaser: 'Because current enters the heating law SQUARED (I²), not linearly!',
  },
  explanations: {
    simple:
      'When electric current pushes through a resistor like a toaster coil, electrons collide with atoms in the metal and turn electrical energy into heat. Joule discovered that this heat follows H = I²Rt. Resistance R and time t scale heat linearly (double R → double heat), but current I is SQUARED! That means doubling current sends twice as many electrons AND requires twice the voltage push across the resistor — making 2 × 2 = 4 times as much heat!',
    simpleTamil:
      'ஒரு மின்தடையின் வழியே மின்னோட்டம் பாயும்போது உருவாகும் வெப்பம் (H = I²Rt) மின்னோட்டத்தின் இருமடிக்கு (I²), மின்தடைக்கு (R) மற்றும் காலத்திற்கு (t) நேர்விகிதத்தில் இருக்கும். மின்னோட்டத்தை இருமடங்காக்கினால் வெப்பம் நான்கு மடங்காகும்!',
    analogy: 'Analogy: Like kinetic energy (½mv²) of a moving bicycle, doubling speed quadruples stopping heat — doubling electric current quadruples resistor heating!',
    detailed:
      'From work done W = VQ, substituting Q = It gives H = VIt (Eq. 4.19). Applying Ohm’s Law (V = IR) yields Joule’s Law of Heating: H = I²Rt (Eq. 4.20, TN Science p. 50). Heating devices use Nichrome (Nickel + Chromium alloy) because it has high resistivity, high melting point, and does not oxidize easily. Fuse wires have low melting point to melt safely during surges.',
    examReady: [
      'Joule’s Law (H = I²Rt): Heat produced is directly proportional to I², R, and t.',
      'Nichrome properties (p. 50): (i) high resistivity, (ii) high melting point, (iii) not easily oxidized.',
      'Fuse wire (in series): low melting point melts on excess current; Bulb filament (Tungsten): very high melting point.',
    ],
    misconceptions: [
      {
        myth: 'Doubling the current through a fixed resistor doubles the heat produced.',
        reality: 'False! Because V = IR also doubles when I doubles across fixed R, power P = VI = I²R becomes (2I)²R = 4I²R — FOUR times the heat!',
      },
      {
        myth: 'Time in minutes can be plugged directly into H = I²Rt.',
        reality: 'Always convert minutes into SI seconds first (e.g., 5 minutes = 300 s, Solved Problem-6 p. 51).',
      },
    ],
  },
  mindMap: {
    title: "Joule's Law of Heating Concept Map",
    nodes: [
      { id: 'w', label: 'Work W = VQ = VIt', role: 'cause', summary: 'Electrical energy spent', detail: 'Source spends energy VQ moving charge Q = It across resistor.', x: 95, y: 120 },
      { id: 'law', label: 'H = I²Rt (Joule’s Law)', role: 'core', summary: 'Quadratic in I!', detail: 'Substituting V = IR yields H = I²Rt in joules.', x: 280, y: 75 },
      { id: 'quad', label: 'Double I → 4× Heat', role: 'caution', summary: '(2I)² = 4I²', detail: 'Current has the strongest impact on wire heating and overload fire risk.', x: 280, y: 195 },
      { id: 'nichrome', label: 'Nichrome Heater', role: 'application', summary: 'High ρ, High m.p.', detail: 'Alloy of Nickel + Chromium resists oxidation in irons, toasters, geysers.', x: 475, y: 75 },
      { id: 'fuse', label: 'Series Fuse Wire', role: 'mechanism', summary: 'Low melting point', detail: 'Melts first during overcurrent to protect household appliances.', x: 475, y: 195 },
    ],
    edges: [
      { from: 'w', to: 'law', relation: 'Ohm’s Law V = IR' },
      { from: 'law', to: 'quad', relation: 'I squared' },
      { from: 'law', to: 'nichrome', relation: 'useful heat' },
      { from: 'law', to: 'fuse', relation: 'safety cutoff' },
    ],
  },
  predictPrompt: {
    question: 'Predict before testing: If resistance R and time t stay fixed, what happens to the heat H when you DOUBLE the current from 3 A to 6 A?',
    options: [
      { id: '2x', label: 'Heat doubles (2×)', feedback: 'Very common intuition! Click "Test Mission: Double Current" below and watch the parabolic graph jump!' },
      { id: '4x', label: 'Heat becomes four times larger (4×)', feedback: 'Spot on! (2I)² = 4I². Click the Double Current toggle below to see both points on the H vs I parabola!', isExpected: true },
      { id: 'half', label: 'Heat drops by half (0.5×)', feedback: 'Try raising I in the virtual coil below — more current creates dramatically more heat.' },
    ],
  },
  microMission: 'Mission: Lock R = 5 Ω and t = 20 s, click "Double Current (I → 2I)" to verify the 4× jump, then load Solved Problem 6 to check 54,000 J!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Start from Work Done', detail: 'Work done moving charge Q across potential difference V is W = VQ (energy dissipated as heat H).' },
      { heading: 'Step 2 · Substitute Q = It', detail: 'Since current I = Q / t, replacing Q gives H = VIt (Eq. 4.19).' },
      { heading: 'Step 3 · Apply Ohm’s Law V = IR', detail: 'Replacing V with IR gives H = (IR)It = I²Rt (Eq. 4.20) — revealing the quadratic I² dependence!' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Science Solved Problem-6 (p. 51)',
      problem: 'An electric heater of resistance 5 Ω is connected to an electric source. If a current of 6 A flows through the heater, find the amount of heat produced in 5 minutes.',
      given: ['Resistance R = 5 Ω', 'Current I = 6 A', 'Time t = 5 minutes = 5 × 60 = 300 s'],
      steps: ['Formula: H = I²Rt', 'Substitute SI values: H = 6² × 5 × 300', 'Calculate: H = 36 × 1500 = 54,000 J'],
      finalAnswer: 'Heat produced H = 54,000 J (54 kJ)',
    },
  },
  solveChallenges: [
    {
      id: 'jl-q1',
      level: 'Supported',
      prompt: 'If a resistor of 4 Ω carries a current of 2 A for 10 s, how much heat is produced?',
      options: [
        { id: 'a', text: '80 J', isCorrect: false, why: '80 J came from I × R × t without squaring I! Square the current: 2² = 4.' },
        { id: 'b', text: '160 J', isCorrect: true, why: 'Correct! H = I²Rt = (2²) × 4 × 10 = 4 × 40 = 160 J.' },
        { id: 'c', text: '320 J', isCorrect: false, why: 'Check 2² × 4 × 10 = 160 J.' },
      ],
      hint: 'Compute I² first (2² = 4), then multiply by R (4) and t (10).',
    },
    {
      id: 'jl-q2',
      level: 'Independent',
      prompt: 'Why is Nichrome preferred over Copper as the heating element in electric irons and toasters (p. 50)?',
      options: [
        { id: 'a', text: 'Nichrome has very low melting point so it melts quickly.', isCorrect: false, why: 'That describes a fuse wire! A heater coil must NOT melt.' },
        { id: 'b', text: 'Nichrome has high resistivity, high melting point, and resists oxidation.', isCorrect: true, why: 'Exact textbook reason (p. 50)! High resistivity generates strong heat while high melting point prevents burning out.' },
        { id: 'c', text: 'Nichrome has zero electrical resistance.', isCorrect: false, why: 'Zero resistance would produce H = I²(0)t = 0 J of heat.' },
      ],
      hint: 'Recall the three textbook properties of Nichrome (p. 50).',
    },
    {
      id: 'jl-q3',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: A heater produces 900 J in 10 s at 3 A. If the current increases to 6 A (doubled) while R and t stay unchanged, how much heat is produced and why?',
      options: [
        { id: 'a', text: '1,800 J (doubles because current doubled)', isCorrect: false, why: 'Linear trap! Heat scales with I², not I.' },
        { id: 'b', text: '3,600 J (4× larger because H ∝ I², so doubling I multiplies H by 2² = 4)', isCorrect: true, why: 'Mastery achieved! 4 × 900 J = 3,600 J because H = I²Rt is quadratic in current.' },
        { id: 'c', text: '2,700 J (3× larger)', isCorrect: false, why: 'Check the factor (6/3)² = 2² = 4, so 4 × 900 J = 3,600 J.' },
      ],
      hint: 'Since R and t are constant, H₂ / H₁ = (I₂ / I₁)² = (6 / 3)².',
    },
  ],
  remember: {
    takeaways: [
      "Joule's Law: H = I²Rt (SI unit: joule; convert minutes to seconds first!).",
      'Doubling current I quadruples heat (4×), whereas doubling R or t only doubles heat (2×).',
      'Nichrome (high resistivity & melting point) heats appliances; Fuse wire (low melting point in series) breaks unsafe surges.',
    ],
    flashcards: [
      { id: 'jl-fc1', front: 'Formula for Joule’s Law of Heating', back: 'H = I²Rt (derived from H = VIt and Ohm’s law V = IR).', tag: 'Formula' },
      { id: 'jl-fc2', front: 'What happens to H if I doubles (R, t constant)?', back: 'Heat becomes 4 times larger because (2I)² = 4I².', tag: 'Key Concept' },
      { id: 'jl-fc3', front: 'Nichrome vs Fuse Wire melting point?', back: 'Nichrome heater coil = HIGH melting point; Fuse wire = LOW melting point (connected in series).', tag: 'Application' },
    ],
    funFact: {
      fact: 'James Prescott Joule (1818–1889) carefully measured the tiny temperature rise of water stirred by falling weights and electric coils, proving heat is a form of mechanical/electrical energy — which is why energy is measured in joules (J).',
      source: 'SI Unit History & TN Class 10 Science Unit 4 (p. 50)',
    },
  },
  readingChunks: [
    {
      id: 'jl-chunk-1',
      heading: "4.8 Heating Effect of Current & 4.8.1 Joule's Law of Heating",
      printedPage: 50,
      pdfPage: 58,
      summary: 'Derives H = I²Rt from W = VQ, Q = It, and V = IR, and states the three proportionalities of Joule’s Law plus Nichrome heating appliances.',
      plainExplanation: 'Trace each substitution carefully: W = VQ → H = VIt → H = I²Rt. Never skip converting minutes to seconds in numericals.',
      glossary: [
        { term: 'Nichrome', tamil: 'நிக்ரோம்', meaning: 'Alloy of Nickel and Chromium with high resistivity and high melting point.' },
        { term: 'Fuse Wire', tamil: 'மின் உருகு இழை', meaning: 'Low-melting-point safety wire wired in series to melt during excess current.' },
      ],
      relatedExerciseRef: 'TN Science Solved Problem-6 (p. 51) & Unit 4 Evaluation Numericals (p. 56).',
    },
  ],
  selfCheckPrompt: 'Explain in your own words why doubling the current through a resistor makes it produce four times as much heat instead of double.',
  selfCheckGuide: 'Check that your explanation links H = I²Rt (or both doubled charge flow AND doubled voltage V = IR) to the 2² = 4 factor.',
  alternative2D: 'Native 2D SVG Nichrome coil and live parabolic H(I) curve with keyboard slider and preset controls.',
  accessibleText: 'At I = 3 A, R = 5 Ω, t = 20 s, H = 900 J. Doubling I to 6 A yields H = 3,600 J (4×).',
  reviewGate: ['PDF Verified (Science 2024 pp. 50–51)', 'Pending TN Class 10 Physics Teacher Sign-off'],
};

const ETHYLENE_SPEC: LessonExperienceSpec = {
  sectionId: 'science-16-auto-16-1-5-ethylene',
  subject: 'science',
  unitId: 'science-16',
  sectionNumber: '16.1.5',
  title: { en: 'Ethylene (Gaseous Plant Hormone)', ta: 'எத்திலின் (வாயு நிலைத் தாவர ஹார்மோன்)' },
  estimatedMinutes: '7–9 min',
  textbookAnchor: {
    book: SCI_BOOK,
    edition: SCI_EDITION,
    pdf: SCI_PDF,
    printedPages: [232],
    pdfPages: [240],
    figures: ['Figure 16.6 Ethylene (p. 232)', 'Textbook Activity: Unripe Tomatoes + Ripe Banana in Paper Bag (p. 232)'],
    exercises: ['Unit 16 Evaluation — Plant Hormones & Growth Inhibitors (pp. 239–241)'],
    officialPortalUrl: SCI_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: 'Ethylene is a gaseous growth-inhibiting plant hormone that promotes fruit ripening, hastens senescence, triggers abscission, and breaks bud/seed dormancy.',
  learningObjective: 'Explain why placing a ripe banana with unripe tomatoes in a closed paper bag accelerates ripening and state the five textbook physiological roles of ethylene.',
  misconception: 'Students often assume all plant hormones are liquids moving only inside vascular sap, or confuse ethylene (a growth inhibitor/ripening gas) with growth promoters like auxin.',
  primaryMode: '2d-svg',
  engineId: 'EthyleneRipeningLab2D',
  variantId: 'ethylene_ripening_bag_2d',
  modelAssumptions: [
    'Directly models the TN Class 10 Science p. 232 Activity (unripe tomatoes alone vs tomatoes + ripe banana in rolled brown paper bags).',
    'The Day 0–5 ripeness transition is a conceptual textbook illustration, not empirically calibrated reaction kinetics.',
  ],
  variables: [
    { id: 'day', label: 'Conceptual Time', unit: 'Days', validRange: [0, 5] },
    { id: 'bananaInBagB', label: 'Ripe Banana Ethylene Source' },
    { id: 'bagSealed', label: 'Paper Bag Seal (Traps vs Vents Gas)' },
  ],
  expectedObservations: [
    'Bag B (sealed with a ripe banana) ripens significantly faster than Bag A (control tomatoes alone).',
    'Opening the bag lets gaseous ethylene escape, slowing ripening compared to a sealed bag.',
  ],
  spark: {
    question: 'Why does one ripe banana placed inside a closed paper bag turn hard green tomatoes bright red in just a few days — without even touching them?',
    teaser: 'Because plants communicate through the AIR using a gaseous hormone!',
  },
  explanations: {
    simple:
      'Unlike most hormones that travel inside fluids, Ethylene (C₂H₄) is a GAS! Ripening fruits like bananas, apples, and melons release tiny invisible puffs of ethylene into the air around them. When you trap a ripe banana and green tomatoes together inside a closed paper bag, the trapped ethylene gas signals the green tomatoes to soften, break down green chlorophyll, and ripen rapidly. Even though it ripens fruit, textbooks classify ethylene as a growth inhibitor because it slows stem/root elongation and speeds up leaf ageing and shedding.',
    simpleTamil:
      'எத்திலின் ஒரு வாயு நிலைத் தாவர ஹார்மோன் (வளர்ச்சி அடக்கி) ஆகும். பழுத்த வாழைப்பழத்திலிருந்து வெளிவரும் எத்திலின் வாயு, மூடிய காகிதப் பையில் உள்ள பச்சைத் தக்காளிகளை வேகமாகப் பழுக்கச் செய்கிறது (பக்கம் 232).',
    analogy: 'Analogy: Like a ripe fruit sending an invisible scent signal through a closed room telling nearby green fruits "time to ripen now!"',
    detailed:
      'Per TN Class 10 Science (16.1.5, p. 232), Ethylene is a gaseous plant hormone and growth inhibitor synthesized maximally during the ripening of apples, bananas, and melons. Its five textbook physiological effects are: (1) promotes ripening of fruits (tomato, apple, mango, banana), (2) inhibits elongation of stem and root in dicots, (3) hastens senescence of leaves and flowers, (4) stimulates abscission zone formation leading to premature shedding, and (5) breaks dormancy of buds, seeds, and storage organs.',
    examReady: [
      'Gaseous plant hormone & growth inhibitor (paired with ABA as the two growth inhibitors; Auxin, Cytokinin, Gibberellin are growth promoters, p. 230).',
      'Textbook Paper Bag Activity (p. 232): Ripe banana emits ethylene gas → trapped in closed bag → ripens unripe tomatoes faster than control bag.',
      'Remember all 5 physiological effects: Fruit ripening, Dicot elongation inhibition, Senescence, Abscission zone, Breaks bud/seed dormancy.',
    ],
    misconceptions: [
      {
        myth: 'Ethylene is a growth promoter because it makes fruits sweet and ripe.',
        reality: 'TN Class 10 Science (pp. 230, 232) classifies Ethylene as a GROWTH INHIBITOR because it inhibits stem/root elongation in dicots and hastens ageing (senescence).',
      },
      {
        myth: 'The ripe banana must physically touch the tomatoes to pass ethylene.',
        reality: 'Ethylene is a gas — it diffuses through air inside the closed paper bag.',
      },
    ],
  },
  mindMap: {
    title: 'Ethylene (Gaseous Plant Hormone) Concept Map',
    nodes: [
      { id: 'gas', label: 'Ethylene (C₂H₄ Gas)', role: 'core', summary: 'Gaseous growth inhibitor', detail: 'Only gaseous phytohormone in the five major plant hormone classes (p. 232).', x: 270, y: 75 },
      { id: 'ripe', label: 'Fruit Ripening', role: 'application', summary: 'Banana, Tomato, Mango, Apple', detail: 'Maximum synthesis occurs during fruit ripening; trapped gas accelerates nearby fruit.', x: 100, y: 185 },
      { id: 'inhib', label: 'Inhibits Dicot Elongation', role: 'mechanism', summary: 'Stem & root growth slowed', detail: 'Suppresses elongation of stem and root in dicot plants.', x: 270, y: 205 },
      { id: 'abs', label: 'Senescence & Abscission', role: 'caution', summary: 'Ageing & shedding', detail: 'Hastens leaf/flower ageing and stimulates abscission zone formation.', x: 455, y: 185 },
      { id: 'dorm', label: 'Breaks Dormancy', role: 'cause', summary: 'Buds, seeds, storage organs', detail: 'Triggers dormant buds, seeds, and tubers to resume activity.', x: 455, y: 75 },
    ],
    edges: [
      { from: 'gas', to: 'ripe', relation: 'promotes' },
      { from: 'gas', to: 'inhib', relation: 'inhibits growth' },
      { from: 'gas', to: 'abs', relation: 'hastens' },
      { from: 'gas', to: 'dorm', relation: 'breaks' },
    ],
  },
  predictPrompt: {
    question: 'Predict before testing: Bag A has unripe green tomatoes alone. Bag B has unripe green tomatoes plus one ripe banana, both rolled closed. After 5 days, which bag ripens faster?',
    options: [
      { id: 'bagB', label: 'Bag B (Tomatoes + Ripe Banana) ripens faster', feedback: 'Correct prediction! Slide Day 0 → Day 5 below and also test what happens if you leave the bag open!', isExpected: true },
      { id: 'bagA', label: 'Bag A (Tomatoes alone) ripens faster', feedback: 'Test it in the comparison lab below — notice how trapped ethylene gas from the banana changes Bag B!' },
      { id: 'equal', label: 'Both ripen at the exact same speed', feedback: 'Try advancing the Day slider below and compare the two bags side by side.' },
    ],
  },
  microMission: 'Mission: Advance the slider to Day 5 with bags closed, then toggle "Bags: Left Open" to observe why trapping the ethylene gas matters!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Gaseous Emission', detail: 'The already-ripe banana continuously synthesizes and releases gaseous ethylene (C₂H₄).' },
      { heading: 'Step 2 · Containment in Closed Bag', detail: 'Rolling the brown paper bag shut traps ethylene molecules so their concentration builds around the unripe tomatoes.' },
      { heading: 'Step 3 · Hormonal Ripening Cascade', detail: 'Tomato cells detect ethylene, triggering ripening enzymes (colour change, softening) — while Bag A (control without banana) stays mostly green.' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Science Unit 16 Activity (p. 232)',
      problem: 'A farmer wants to ripen harvested green mangoes naturally and evenly without using harmful synthetic chemicals. How does the paper-bag banana principle explain natural ripening?',
      given: ['Unripe fruits (green mangoes/tomatoes)', 'Ripe climacteric fruit (ripe banana/apple)', 'Closed breathable paper enclosure'],
      steps: [
        'Ripe bananas naturally emit ethylene gas (C₂H₄).',
        'Enclosing unripe fruits with a ripe fruit traps ethylene around them.',
        'Ethylene triggers natural fruit maturation and ripening enzymes.',
      ],
      finalAnswer: 'Trapped natural ethylene gas emitted by a ripe fruit accelerates ripening of nearby unripe fruits.',
    },
  },
  solveChallenges: [
    {
      id: 'eth-q1',
      level: 'Supported',
      prompt: 'Which of the five plant hormones is a GASEOUS hormone classified as a growth inhibitor?',
      options: [
        { id: 'a', text: 'Auxin', isCorrect: false, why: 'Auxins (like IAA) are growth promoters produced at stem/root tips.' },
        { id: 'b', text: 'Ethylene', isCorrect: true, why: 'Correct! Ethylene is a gaseous plant hormone and growth inhibitor (p. 232).' },
        { id: 'c', text: 'Gibberellin', isCorrect: false, why: 'Gibberellins are growth promoters that cause internodal elongation and bolting.' },
      ],
      hint: 'Think of the hormone released into the air by a ripening banana.',
    },
    {
      id: 'eth-q2',
      level: 'Independent',
      prompt: 'Why did the textbook activity (p. 232) instruct students to roll the top of the brown paper bag CLOSED?',
      options: [
        { id: 'a', text: 'To trap the gaseous ethylene released by the ripe banana around the unripe tomatoes.', isCorrect: true, why: 'Exactly! Because ethylene is a gas, an open bag lets it diffuse away.' },
        { id: 'b', text: 'To stop sunlight from melting the banana.', isCorrect: false, why: 'The key variable is keeping ethylene gas concentrated around the tomatoes.' },
        { id: 'c', text: 'To keep water inside so the banana dissolves.', isCorrect: false, why: 'Ethylene acts in the gaseous phase, not by dissolving the banana.' },
      ],
      hint: 'What physical state is ethylene in at room temperature?',
    },
    {
      id: 'eth-q3',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: Besides fruit ripening, which pair of effects is ALSO caused by ethylene according to TN Class 10 Science p. 232?',
      options: [
        { id: 'a', text: 'Stimulates abscission zone formation AND breaks bud/seed dormancy.', isCorrect: true, why: 'Well done! Ethylene promotes abscission shedding, hastens senescence, inhibits dicot elongation, and breaks dormancy of buds/seeds.' },
        { id: 'b', text: 'Causes Richmond–Lang delay of ageing AND induces bolting in rosette plants.', isCorrect: false, why: 'Delaying ageing is Cytokinin (p. 231) and bolting is Gibberellin (p. 231).' },
        { id: 'c', text: 'Causes apical dominance AND prevents abscission layer formation.', isCorrect: false, why: 'Those are functions of Auxin (p. 231) — ethylene does the opposite regarding abscission!' },
      ],
      hint: 'Check the 5 numbered physiological effects of ethylene in the interactive panel above.',
    },
  ],
  remember: {
    takeaways: [
      'Ethylene is a gaseous plant hormone and growth inhibitor concerned with fruit maturation and ripening.',
      'Trapping a ripe banana with unripe tomatoes in a closed bag concentrates ethylene gas and speeds up ripening (p. 232).',
      'Other roles: inhibits stem/root elongation in dicots, hastens senescence, stimulates abscission, and breaks bud/seed dormancy.',
    ],
    flashcards: [
      { id: 'eth-fc1', front: 'Which plant hormone is gaseous?', back: 'Ethylene (growth inhibitor; synthesized maximally in ripening apples, bananas, melons).', tag: 'Fact' },
      { id: 'eth-fc2', front: 'Growth Promoters vs Growth Inhibitors (p. 230)', back: 'Promoters: Auxins, Cytokinins, Gibberellins. Inhibitors: Abscisic Acid (ABA) and Ethylene.', tag: 'Classification' },
      { id: 'eth-fc3', front: 'Why keep one rotten/overripe fruit away from fresh fruits?', back: 'Overripe fruit emits high ethylene gas, accelerating ripening and spoilage of neighboring fresh fruits.', tag: 'Everyday Life' },
    ],
    funFact: {
      fact: 'The old proverb "one bad apple spoils the barrel" has real plant biochemistry behind it: an overripe or bruised apple releases ethylene gas that triggers neighboring apples to ripen and soften faster!',
      source: 'TN Class 10 Science Unit 16.1.5 (p. 232) & Plant Physiology',
    },
  },
  readingChunks: [
    {
      id: 'eth-chunk-1',
      heading: '16.1.5 Ethylene & Tomato–Banana Paper Bag Activity (Fig. 16.6)',
      printedPage: 232,
      pdfPage: 240,
      summary: 'Defines ethylene as a gaseous growth-inhibiting phytohormone, lists its five physiological effects, and describes the controlled two-bag tomato ripening activity.',
      plainExplanation: 'Pay special attention to the comparison between the two bags: Bag 2 (tomatoes only) is the control that proves the banana’s ethylene gas caused the difference.',
      glossary: [
        { term: 'Senescence', tamil: 'மூப்படைதல்', meaning: 'Natural ageing process in plant leaves, flowers, and organs.' },
        { term: 'Abscission', tamil: 'உதிர்தல்', meaning: 'Formation of a separation layer causing leaves, flowers, or fruits to shed.' },
      ],
      relatedExerciseRef: 'TN Science Unit 16 Evaluation — Plant Hormones & Fill-in-the-blanks (pp. 239–241).',
    },
  ],
  selfCheckPrompt: 'Explain in your own words why unripe tomatoes ripen faster in a closed bag with a ripe banana than in a bag by themselves.',
  selfCheckGuide: 'Confirm you mention: (1) the ripe banana emits gaseous ethylene, (2) the closed bag traps the gas, and (3) ethylene signals fruit ripening.',
  alternative2D: 'Native 2D SVG controlled bag experiment with keyboard toggles and role cards.',
  accessibleText: 'Bag A (tomatoes only) remains unripe green; sealed Bag B (tomatoes + ripe banana) traps ethylene gas and turns tomatoes ripe red by Day 5.',
  reviewGate: ['PDF Verified (Science 2024 p. 232)', 'Pending TN Class 10 Biology Teacher Sign-off'],
};

const PITUITARY_SPEC: LessonExperienceSpec = {
  sectionId: 'science-16-auto-16-2-1-pituitary-gland',
  subject: 'science',
  unitId: 'science-16',
  sectionNumber: '16.2.1',
  title: { en: 'Pituitary Gland ("Master Gland")', ta: 'பிட்யூட்டரி சுரப்பி (தலைமைச் சுரப்பி)' },
  estimatedMinutes: '9–11 min',
  textbookAnchor: {
    book: SCI_BOOK,
    edition: SCI_EDITION,
    pdf: SCI_PDF,
    printedPages: [233, 234],
    pdfPages: [241, 242],
    figures: ['Figure 16.7 Pituitary Gland (p. 233)', 'Human Endocrine Glands Concept Map (p. 242)'],
    exercises: ['Unit 16 Evaluation — Match the following, Short & Long Answers on Pituitary Hormones (pp. 239–241)'],
    officialPortalUrl: SCI_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: 'The pea-shaped pituitary gland at the base of the midbrain (attached to the hypothalamus) coordinates other endocrine glands via bloodstream hormones from its anterior and posterior lobes.',
  learningObjective: 'Distinguish Anterior (Adenohypophysis) vs Posterior (Neurohypophysis) pituitary hormones, map each to its target organ and disorder, and contrast endocrine vs nervous communication.',
  misconception: 'Students often mix up Diabetes insipidus (posterior pituitary ADH deficiency → excess water loss in urine) with Diabetes mellitus (pancreatic insulin deficiency → high blood sugar), or assume hormones travel through nerves.',
  primaryMode: '2d-svg',
  engineId: 'PituitaryEndocrineLab2D',
  variantId: 'pituitary_endocrine_map_2d',
  modelAssumptions: [
    'Schematic 2D human outline highlights relative endocrine target positions and bloodstream signalling pathways.',
    'Explicitly follows TN Class 10 Science p. 233: intermediate lobe is non-existent in humans; pituitary has two functional lobes.',
  ],
  variables: [
    { id: 'selectedHormone', label: 'Pituitary Hormone (GH, TSH, ACTH, FSH/LH, PRL, ADH, Oxytocin)' },
  ],
  expectedObservations: [
    'Anterior lobe secretes trophic & growth hormones (GH, TSH, ACTH, FSH/LH, PRL); Posterior lobe secretes ADH (Vasopressin) and Oxytocin.',
    'All pituitary hormones travel via the bloodstream (ductless gland) to distant specific target organs.',
  ],
  spark: {
    question: 'How does a tiny pea-sized gland tucked beneath your brain control bone height, your neck’s thyroid gland, AND how much water your kidneys keep?',
    teaser: 'It works like a chemical orchestra conductor sending coded messages through the bloodstream!',
  },
  explanations: {
    simple:
      'The pituitary gland (hypophysis) is a pea-sized "Master Gland" sitting at the base of the midbrain, linked to the hypothalamus by a short stalk. Because it is an endocrine (ductless) gland, it has no tubes — it releases tiny amounts of chemical messengers called hormones directly into the blood. It has two lobes in humans: the Anterior lobe (Adenohypophysis) directs growth and other endocrine glands (GH, TSH, ACTH, FSH/LH, Prolactin), while the Posterior lobe (Neurohypophysis) releases ADH (water balance in kidneys) and Oxytocin (childbirth and milk ejection).',
    simpleTamil:
      'பிட்யூட்டரி சுரப்பி மூளையின் அடிப்பகுதியில் ஹைப்போதலாமஸுடன் இணைந்துள்ள பட்டாணி அளவு சுரப்பியாகும். மற்ற நாளமில்லாச் சுரப்பிகளைக் கட்டுப்படுத்துவதால் இது "தலைமைச் சுரப்பி" எனப்படுகிறது. முன் கதுப்பு (GH, TSH, ACTH, FSH, LH, PRL) மற்றும் பின் கதுப்பு (ADH, ஆக்ஸிடோசின்) ஹார்மோன்களை இரத்தத்தில் சுரக்கின்றன.',
    analogy: 'Analogy: If the nervous system is a fast telephone wire to one room, the pituitary endocrine system is a radio broadcast sent through the bloodstream that only organs with the matching receiver respond to.',
    detailed:
      'Per TN Class 10 Science (16.2.1, pp. 233–234), the pituitary gland is attached to the hypothalamus by the pituitary stalk and consists of the Anterior lobe (Adenohypophysis: GH, TSH, ACTH, GTH [FSH & LH], PRL) and Posterior lobe (Neurohypophysis: Vasopressin/ADH, Oxytocin). The intermediate lobe is non-existent in humans. GH imbalance causes Dwarfism (low in children), Gigantism (excess in children), or Acromegaly (excess in adults). ADH deficiency causes polyuria (Diabetes insipidus).',
    examReady: [
      'Location & nickname: Pea-shaped gland at base of midbrain attached to hypothalamus; called "Master Gland".',
      'Anterior Lobe (Adenohypophysis): GH, TSH, ACTH, GTH (FSH & LH), Prolactin (PRL).',
      'Posterior Lobe (Neurohypophysis): Vasopressin (ADH → kidney water reabsorption; deficiency = Diabetes insipidus) & Oxytocin.',
    ],
    misconceptions: [
      {
        myth: 'Diabetes insipidus is caused by lack of insulin and high blood sugar.',
        reality: 'False! Diabetes insipidus is caused by deficiency of Posterior Pituitary ADH (Vasopressin), causing excess dilute urine (polyuria). Insulin deficiency causes Diabetes mellitus!',
      },
      {
        myth: 'Pituitary hormones travel through neurons because the pituitary sits near the brain.',
        reality: 'False! Endocrine glands are ductless and release hormones into the BLOODSTREAM to reach distant target organs.',
      },
    ],
  },
  mindMap: {
    title: 'Pituitary Gland (Master Gland) Concept Map',
    nodes: [
      { id: 'hypo', label: 'Hypothalamus + Stalk', role: 'cause', summary: 'Base of midbrain', detail: 'Connects brain control to the pea-shaped pituitary gland (Fig. 16.7).', x: 100, y: 120 },
      { id: 'ant', label: 'Anterior Lobe (Adenohypophysis)', role: 'core', summary: 'GH, TSH, ACTH, FSH/LH, PRL', detail: 'Directs growth, thyroid, adrenal cortex, gonads, and mammary milk production.', x: 300, y: 65 },
      { id: 'post', label: 'Posterior Lobe (Neurohypophysis)', role: 'mechanism', summary: 'ADH & Oxytocin', detail: 'Controls kidney water reabsorption and uterine contraction / milk ejection.', x: 300, y: 190 },
      { id: 'ghd', label: 'GH Imbalances', role: 'application', summary: 'Dwarfism / Gigantism / Acromegaly', detail: 'Low GH in kids → Dwarfism; High in kids → Gigantism; High in adults → Acromegaly.', x: 500, y: 65 },
      { id: 'adh', label: 'ADH Deficiency', role: 'caution', summary: 'Diabetes insipidus', detail: 'Reduced water reabsorption in kidney tubules leads to excessive urine output (polyuria).', x: 500, y: 190 },
    ],
    edges: [
      { from: 'hypo', to: 'ant', relation: 'regulates' },
      { from: 'hypo', to: 'post', relation: 'pituitary stalk' },
      { from: 'ant', to: 'ghd', relation: 'GH level' },
      { from: 'post', to: 'adh', relation: 'ADH lack' },
    ],
  },
  predictPrompt: {
    question: 'Predict before exploring: If a patient’s kidney tubules fail to reabsorb enough water, leading to excessive dilute urine (Diabetes insipidus), WHICH pituitary lobe and hormone is deficient?',
    options: [
      { id: 'adh', label: 'Posterior lobe — Vasopressin / ADH', feedback: 'Exact match! Click ADH in the Posterior Lobe panel below to trace its bloodstream path to the kidneys.', isExpected: true },
      { id: 'tsh', label: 'Anterior lobe — Thyroid Stimulating Hormone (TSH)', feedback: 'Check TSH in the body map below — TSH targets the thyroid gland in the neck, not the kidneys.' },
      { id: 'gh', label: 'Anterior lobe — Growth Hormone (GH)', feedback: 'Inspect GH below — GH targets long bones and body tissues, not kidney water reabsorption.' },
    ],
  },
  microMission: 'Mission: Inspect at least 2 Anterior Lobe hormones (like GH and TSH) and both Posterior Lobe hormones (ADH and Oxytocin) on the body map to trace each target organ!',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Ductless Secretion into Blood', detail: 'Unlike exocrine glands (salivary/sweat glands with ducts), the pituitary diffuses minute quantities of hormone straight into capillaries.' },
      { heading: 'Step 2 · Specific Target Organ Receptors', detail: 'Blood carries the hormone everywhere, but only the matching target organ (e.g., thyroid for TSH, kidney tubules for ADH) responds.' },
      { heading: 'Step 3 · Master Coordination', detail: 'Because anterior pituitary hormones control the thyroid, adrenal cortex, and gonads, it earns the title "Master Gland".' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Science Unit 16.2.1 Clinical Matching (pp. 233–234)',
      problem: 'Distinguish between Gigantism and Acromegaly caused by excess Growth Hormone (GH).',
      given: ['Both disorders stem from oversecretion of Anterior Pituitary Growth Hormone (GH).'],
      steps: [
        'In children (while long-bone growth plates are open), excess GH causes proportionate overgrowth of all tissues → Gigantism.',
        'In adults (after height growth stops), excess GH causes abnormal enlargement of head, face, hands, and feet → Acromegaly.',
      ],
      finalAnswer: 'Gigantism occurs from excess GH in children; Acromegaly occurs from excess GH in adults.',
    },
  },
  solveChallenges: [
    {
      id: 'pit-q1',
      level: 'Supported',
      prompt: 'Which hormone is secreted by the POSTERIOR lobe (Neurohypophysis) of the pituitary gland?',
      options: [
        { id: 'a', text: 'Thyroid Stimulating Hormone (TSH)', isCorrect: false, why: 'TSH is secreted by the Anterior lobe (Adenohypophysis).' },
        { id: 'b', text: 'Vasopressin / Antidiuretic Hormone (ADH)', isCorrect: true, why: 'Correct! Posterior pituitary releases Vasopressin (ADH) and Oxytocin (p. 234).' },
        { id: 'c', text: 'Adrenocorticotropic Hormone (ACTH)', isCorrect: false, why: 'ACTH is secreted by the Anterior lobe to act on the adrenal cortex.' },
      ],
      hint: 'Posterior pituitary secretes only TWO hormones: ADH and Oxytocin.',
    },
    {
      id: 'pit-q2',
      level: 'Independent',
      prompt: 'Match the hormone to its exact textbook target organ: ACTH targets the ______, while Prolactin (PRL) targets the ______.',
      options: [
        { id: 'a', text: 'Adrenal cortex; Mammary glands', isCorrect: true, why: 'Spot on! ACTH stimulates the adrenal cortex and Prolactin stimulates mammary gland development & milk production (p. 234).' },
        { id: 'b', text: 'Thyroid gland; Kidney tubules', isCorrect: false, why: 'Thyroid is targeted by TSH; kidney tubules are targeted by ADH.' },
        { id: 'c', text: 'Bones; Uterus', isCorrect: false, why: 'Bones are targeted by GH; uterus smooth muscle is targeted by Oxytocin.' },
      ],
      hint: 'Check the full name: Adreno-Cortico-Tropic Hormone!',
    },
    {
      id: 'pit-q3',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: How does pituitary endocrine signalling fundamentally differ from electrical nerve impulses in the nervous system?',
      options: [
        { id: 'a', text: 'Endocrine glands are ductless and send chemical hormones via the bloodstream to specific distant target organs, giving slower, longer-lasting coordination.', isCorrect: true, why: 'Excellent conceptual mastery! That is why a neuron model cannot teach pituitary endocrine signalling.' },
        { id: 'b', text: 'Pituitary hormones travel exclusively through salivary ducts.', isCorrect: false, why: 'Salivary glands are exocrine (with ducts); endocrine glands are ductless.' },
        { id: 'c', text: 'Pituitary hormones act only inside the brain and never reach other organs.', isCorrect: false, why: 'Pituitary hormones travel in blood to the thyroid, adrenal cortex, kidneys, bones, and gonads.' },
      ],
      hint: 'Compare transport route (blood vs axon) and gland type (ductless endocrine).',
    },
  ],
  remember: {
    takeaways: [
      'Pituitary ("Master Gland") sits at the base of the midbrain attached to the hypothalamus; intermediate lobe is absent in humans.',
      'Anterior Lobe (Adenohypophysis): GH, TSH, ACTH, GTH (FSH & LH), Prolactin (PRL).',
      'Posterior Lobe (Neurohypophysis): Vasopressin/ADH (deficiency → Diabetes insipidus) and Oxytocin.',
    ],
    flashcards: [
      { id: 'pit-fc1', front: 'Why is the Pituitary called the "Master Gland"?', back: 'It regulates and controls the hormone secretions of other major endocrine glands (thyroid, adrenal cortex, gonads).', tag: 'Concept' },
      { id: 'pit-fc2', front: 'Diabetes insipidus vs Diabetes mellitus?', back: 'Diabetes insipidus = ADH deficiency (posterior pituitary, excess dilute urine). Diabetes mellitus = Insulin deficiency (pancreas, high blood glucose).', tag: 'Exam Trap' },
      { id: 'pit-fc3', front: 'Who is the Father of Endocrinology (p. 233)?', back: 'Thomas Addison; W.M. Bayliss and E.H. Starling coined "hormone" in 1909 (first discovered secretin).', tag: 'History' },
    ],
    funFact: {
      fact: 'English physiologists W.M. Bayliss and E.H. Starling introduced the word "hormone" in 1909 from the Greek "hormon" meaning "to excite", after discovering secretin.',
      source: 'TN Class 10 Science Unit 16 (pp. 229, 233)',
    },
  },
  readingChunks: [
    {
      id: 'pit-chunk-1',
      heading: '16.2 Human Endocrine Glands & 16.2.1 Pituitary Gland (Fig. 16.7)',
      printedPage: 233,
      pdfPage: 241,
      summary: 'Explains ductless endocrine vs ducted exocrine glands, pituitary location attached to the hypothalamus, and anterior Growth Hormone disorders (Dwarfism, Gigantism, Acromegaly).',
      plainExplanation: 'Memorize the two lobe names carefully: Adenohypophysis (Anterior) and Neurohypophysis (Posterior).',
      glossary: [
        { term: 'Endocrine Gland', tamil: 'நாளமில்லாச் சுரப்பி', meaning: 'Ductless gland whose hormones diffuse straight into the bloodstream.' },
        { term: 'Target Organ', tamil: 'இலக்கு உறுப்பு', meaning: 'Specific distant organ that responds to a particular hormone.' },
      ],
      relatedExerciseRef: 'TN Science Unit 16 Evaluation (pp. 239–241).',
    },
    {
      id: 'pit-chunk-2',
      heading: 'Anterior (TSH, ACTH, FSH/LH, PRL) & Posterior (ADH, Oxytocin) Hormones',
      printedPage: 234,
      pdfPage: 242,
      summary: 'Details each anterior trophic hormone and the two posterior pituitary hormones (Vasopressin/ADH causing water reabsorption and Oxytocin).',
      plainExplanation: 'Group Anterior hormones by target organ (Neck→TSH, Adrenal→ACTH, Gonads→FSH/LH, Mammary→PRL, Bones→GH) so recall becomes effortless.',
      glossary: [
        { term: 'Polyuria', tamil: 'அதிக சிறுநீர் வெளியேற்றம்', meaning: 'Excessive urine output caused by ADH deficiency in Diabetes insipidus.' },
      ],
      relatedExerciseRef: 'TN Science Unit 16 Match the Following & Long Answer Q.3 (pp. 240–241).',
    },
  ],
  selfCheckPrompt: 'Name two hormones from the Anterior Pituitary and two from the Posterior Pituitary, along with one target organ for each.',
  selfCheckGuide: 'Anterior examples: GH (bones/muscles), TSH (thyroid), ACTH (adrenal cortex), FSH/LH (gonads), PRL (mammary glands). Posterior: ADH (kidney tubules), Oxytocin (uterus/mammary glands).',
  alternative2D: 'Native 2D SVG endocrine system map with keyboard-selectable hormone buttons and organ pathways.',
  accessibleText: 'Hypothalamus connects via stalk to Anterior lobe (GH, TSH, ACTH, FSH, LH, PRL) and Posterior lobe (ADH, Oxytocin).',
  reviewGate: ['PDF Verified (Science 2024 pp. 233–234)', 'Pending TN Class 10 Biology Teacher Sign-off'],
};

const SPERM_SPEC: LessonExperienceSpec = {
  sectionId: 'science-17-auto-17-8-1-structure-of-human',
  subject: 'science',
  unitId: 'science-17',
  sectionNumber: '17.8.1',
  title: { en: 'Structure of Human Sperm', ta: 'மனித விந்தணுவின் அமைப்பு' },
  estimatedMinutes: '6–8 min',
  textbookAnchor: {
    book: SCI_BOOK,
    edition: SCI_EDITION,
    pdf: SCI_PDF,
    printedPages: [250],
    pdfPages: [258],
    figures: ['Figure 17.15 Structure of sperm (p. 250)'],
    exercises: ['Unit 17 Evaluation — Neat labelled diagram of human sperm & function of acrosome/middle piece'],
    officialPortalUrl: SCI_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: 'The human spermatozoan is a microscopic motile haploid male gamete (n = 23) organized into three specialized regions: Head (acrosome + nucleus), Middle Piece (mitochondria), and Tail.',
  learningObjective: 'Identify every labelled part of Fig. 17.15 (acrosome, nucleus, neck, middle piece mitochondria, tail) and explain how each structure supports fertilization.',
  misconception: 'Students often think mitochondria are located in the tail itself, whereas mitochondria are packed in the MIDDLE PIECE to supply ATP energy for tail movement.',
  primaryMode: '2d-svg',
  engineId: 'ReproductionDiagrams2D',
  variantId: 'sperm',
  modelAssumptions: [
    'Calm, neutral-palette 2D medical textbook schematic aligned directly to Fig. 17.15 (p. 250).',
    'Enlarged for structural clarity; actual human sperm head is ~5 µm wide and total length ~50–60 µm.',
  ],
  variables: [{ id: 'selectedPart', label: 'Anatomical Label Selector (Acrosome, Nucleus, Neck, Middle Piece, Tail)' }],
  expectedObservations: [
    'Acrosome sits at the anterior tip of the head containing hyaluronidase enzyme.',
    'Middle piece houses mitochondria for ATP energy; the tail executes motility.',
  ],
  spark: {
    question: 'Why does a microscopic sperm cell pack almost all of its mitochondria right behind its head instead of storing yolk like an egg cell?',
    teaser: 'Every structure in a sperm cell is streamlined for two jobs: carrying 23 chromosomes safely and swimming to reach the ovum!',
  },
  explanations: {
    simple:
      'A human sperm (spermatozoan) is a microscopic haploid cell (n = 23 chromosomes) divided cleanly into three parts: Head, Middle Piece, and Tail. The elongated Head carries the condensed genetic nucleus capped at the front by the Acrosome (which contains hyaluronidase enzyme to help enter the ovum). A short Neck with centrioles joins the head to the Middle Piece, which is packed with mitochondria — tiny biological powerhouses supplying ATP energy so the slender Tail can move.',
    simpleTamil:
      'மனித விந்தணு தலை, நடுப்பகுதி மற்றும் வால் என மூன்று பகுதிகளைக் கொண்டது. தலையில் உள்ள அக்ரோசோம் கருவுறுதலுக்கு உதவும் ஹயலூரோனிடேஸ் நொதியையும், நடுப்பகுதியில் உள்ள மைட்டோகாண்ட்ரியா வால் இயக்கத்திற்கான ஆற்றலையும் வழங்குகின்றன (பக்கம் 250).',
    analogy: 'Analogy: Like a tiny streamlined cargo vessel — the head carries the genetic blueprint, the middle piece is the engine room (mitochondria), and the tail is the propeller.',
    detailed:
      'Per TN Class 10 Science (17.8.1, p. 250, Fig. 17.15), the spermatozoan consists of an elongated head formed by nuclear condensation with an anterior cap-like acrosome containing hyaluronidase enzyme, a short neck comprising centrioles, a middle piece containing mitochondria that supply energy for motility, and a long tail essential for movement during fertilization.',
    examReady: [
      'Three main regions: Head (Acrosome + condensed haploid Nucleus), Middle Piece (Mitochondria), and Tail.',
      'Acrosome enzyme: Hyaluronidase — helps sperm enter the ovum during fertilization.',
      'Neck contains centrioles; Middle piece mitochondria supply energy for tail movement.',
    ],
    misconceptions: [
      {
        myth: 'Energy-producing mitochondria are found inside the sperm tail.',
        reality: 'Mitochondria are concentrated in the MIDDLE PIECE (not the tail); the ATP they produce powers tail motility.',
      },
    ],
  },
  mindMap: {
    title: 'Structure of Human Sperm (Fig. 17.15)',
    nodes: [
      { id: 'sperm', label: 'Human Sperm (n = 23)', role: 'core', summary: 'Haploid male gamete', detail: 'Formed by spermatogenesis in seminiferous tubules of testes (pp. 249–250).', x: 265, y: 65 },
      { id: 'acro', label: 'Head: Acrosome + Nucleus', role: 'cause', summary: 'Hyaluronidase + DNA', detail: 'Acrosome cap assists entry into ovum; condensed nucleus holds 23 chromosomes.', x: 100, y: 185 },
      { id: 'neck', label: 'Neck (Centrioles)', role: 'mechanism', summary: 'Links Head & Midpiece', detail: 'Short connecting region housing centrioles.', x: 265, y: 195 },
      { id: 'mid', label: 'Middle Piece + Tail', role: 'application', summary: 'Mitochondria → Motility', detail: 'Mitochondria generate ATP energy enabling tail movement.', x: 455, y: 185 },
    ],
    edges: [
      { from: 'sperm', to: 'acro', relation: 'anterior' },
      { from: 'sperm', to: 'neck', relation: 'connects' },
      { from: 'sperm', to: 'mid', relation: 'propulsion' },
    ],
  },
  predictPrompt: {
    question: 'Predict before inspecting the diagram: Which region of the human sperm contains the mitochondria that power movement?',
    options: [
      { id: 'mid', label: 'Middle Piece', feedback: 'Correct! Inspect the calm labelled diagram below to see how the middle piece sits right between the neck and tail.', isExpected: true },
      { id: 'acro', label: 'Acrosome cap at the tip', feedback: 'Check the diagram below — the acrosome holds hyaluronidase enzyme, not mitochondria.' },
      { id: 'tail', label: 'Tip of the tail', feedback: 'Common guess! Inspect the labelled diagram below to see where the mitochondria actually sit.' },
    ],
  },
  microMission: 'Mission: Inspect all 5 textbook labels on Fig. 17.15 (Acrosome, Nucleus, Neck, Middle Piece, Tail) and note the microscopic scale comparison.',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Condensed Genetic Delivery', detail: 'Shedding excess cytoplasm makes the head compact and streamlined around the haploid nucleus (n = 23).' },
      { heading: 'Step 2 · Enzymatic Entry Tool', detail: 'The anterior acrosome carries hyaluronidase to help penetrate outer egg coverings during fertilization.' },
      { heading: 'Step 3 · Dedicated Energy & Motility', detail: 'Middle-piece mitochondria generate ATP directly adjacent to the flagellar tail.' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Science Unit 17 Short Answer Guide (p. 250)',
      problem: 'State the exact function of (a) Acrosome and (b) Middle piece in a human sperm.',
      given: ['Structure of human spermatozoan (Fig. 17.15, p. 250)'],
      steps: [
        '(a) Acrosome contains hyaluronidase enzyme, which helps the sperm enter the ovum during fertilization.',
        '(b) Middle piece contains mitochondria, which provide energy (ATP) for movement of the tail (sperm motility).',
      ],
      finalAnswer: 'Acrosome → hyaluronidase for ovum entry; Middle piece → mitochondria for tail motility.',
    },
  },
  solveChallenges: [
    {
      id: 'sp-q1',
      level: 'Supported',
      prompt: 'Which enzyme present in the acrosome cap helps the sperm enter the ovum during fertilization?',
      options: [
        { id: 'a', text: 'Amylase', isCorrect: false, why: 'Amylase digests starch in saliva, not egg membranes.' },
        { id: 'b', text: 'Hyaluronidase', isCorrect: true, why: 'Exact textbook fact (p. 250)! Acrosome contains hyaluronidase enzyme.' },
        { id: 'c', text: 'Pepsin', isCorrect: false, why: 'Pepsin digests proteins in the stomach.' },
      ],
      hint: 'Check the Acrosome label description in the diagram above.',
    },
    {
      id: 'sp-q2',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: If a genetic defect impaired the mitochondria inside the middle piece of a sperm cell, which function would be directly lost?',
      options: [
        { id: 'a', text: 'ATP energy supply for tail motility, preventing the sperm from swimming to the ovum.', isCorrect: true, why: 'Correct! Without mitochondrial energy in the middle piece, tail motility cannot occur.' },
        { id: 'b', text: 'Storage of 23 chromosomes in the nucleus.', isCorrect: false, why: 'Chromosomes are stored in the head nucleus, not in mitochondria.' },
        { id: 'c', text: 'Formation of the outer corona radiata.', isCorrect: false, why: 'Corona radiata belongs to the human ovum (Fig. 17.16), not the sperm.' },
      ],
      hint: 'Link mitochondria → ATP energy → which sperm part moves?',
    },
  ],
  remember: {
    takeaways: [
      'Human sperm is a haploid male gamete (n = 23) with Head, Neck, Middle Piece, and Tail.',
      'Acrosome (anterior cap on head) contains hyaluronidase enzyme to aid fertilization.',
      'Middle piece houses mitochondria supplying energy for tail motility; neck contains centrioles.',
    ],
    flashcards: [
      { id: 'sp-fc1', front: 'Enzyme in Sperm Acrosome (p. 250)', back: 'Hyaluronidase — assists the sperm in entering the ovum during fertilization.', tag: 'Exam Key' },
      { id: 'sp-fc2', front: 'Role of Neck & Middle Piece', back: 'Neck contains centrioles; Middle piece contains mitochondria generating ATP for tail movement.', tag: 'Structure' },
      { id: 'sp-fc3', front: 'Chromosome number in Human Sperm', back: 'Haploid (n = 23 chromosomes); fuses with haploid ovum (n = 23) to form diploid zygote (2n = 46).', tag: 'Genetics' },
    ],
    funFact: {
      fact: 'A mature human ovum (~100–120 µm diameter) is roughly 20 times wider than a human sperm head (~5 µm), making the ovum one of the largest human cells and the sperm one of the smallest!',
      source: 'Human Cellular Histology & TN Class 10 Science Unit 17 (p. 250)',
    },
  },
  readingChunks: [
    {
      id: 'sp-chunk-1',
      heading: '17.8 Gametogenesis & 17.8.1 Structure of Human Sperm (Fig. 17.15)',
      printedPage: 250,
      pdfPage: 258,
      summary: 'Defines gametogenesis (spermatogenesis + oogenesis) and describes the head, acrosome (hyaluronidase), short neck (centrioles), middle piece (mitochondria), and tail of the spermatozoan.',
      plainExplanation: 'Practice sketching Fig. 17.15 cleanly with five straight horizontal leader lines on one side for full board-exam diagram marks.',
      glossary: [
        { term: 'Acrosome', tamil: 'அக்ரோசோம்', meaning: 'Enzyme-containing cap at the front of the sperm head.' },
        { term: 'Haploid (n)', tamil: 'ஒற்றைமயம்', meaning: 'Single set of 23 chromosomes present in mature gametes.' },
      ],
      relatedExerciseRef: 'TN Science Unit 17 Evaluation — Draw & label human sperm (p. 257).',
    },
  ],
  selfCheckPrompt: 'List the three main parts of a human sperm in order from front to back and name the key job of each.',
  selfCheckGuide: 'Head (acrosome enzyme + haploid nucleus), Middle Piece (mitochondria for ATP energy, joined by neck with centrioles), Tail (motility).',
  alternative2D: 'Calm, static, neutral-palette labelled 2D medical SVG diagram with keyboard-selectable labels.',
  accessibleText: 'Human sperm (Fig. 17.15) has Head (acrosome + nucleus), Neck (centrioles), Middle piece (mitochondria), and Tail.',
  reviewGate: ['PDF Verified (Science 2024 p. 250)', 'Pending TN Class 10 Biology Teacher Sign-off'],
};

const OVUM_SPEC: LessonExperienceSpec = {
  sectionId: 'science-17-auto-17-8-2-structure-of-human-ovum',
  subject: 'science',
  unitId: 'science-17',
  sectionNumber: '17.8.2',
  title: { en: 'Structure of Human Ovum', ta: 'மனித அண்ட செல்லின் அமைப்பு' },
  estimatedMinutes: '6–8 min',
  textbookAnchor: {
    book: SCI_BOOK,
    edition: SCI_EDITION,
    pdf: SCI_PDF,
    printedPages: [250],
    pdfPages: [258],
    figures: ['Figure 17.16 Structure of ovum (p. 250)'],
    exercises: ['Unit 17 Evaluation — Neat labelled diagram of human ovum & its three protective membranes'],
    officialPortalUrl: SCI_PORTAL,
  },
  editorialStatus: 'provisional',
  concept: 'The mature human ovum is a spherical, non-motile, nearly yolk-free haploid cell (n = 23) enclosed by three protective layers: vitelline membrane, zona pellucida, and outer corona radiata.',
  learningObjective: 'Identify all six labelled structures of Fig. 17.16 from outside to inside and distinguish the ovum’s protective layers from the sperm’s motile adaptations.',
  misconception: 'Students often reverse the order of the protective membranes (confusing outer corona radiata with inner zona pellucida) or assume human eggs contain large yolk like bird eggs.',
  primaryMode: '2d-svg',
  engineId: 'ReproductionDiagrams2D',
  variantId: 'ovum',
  modelAssumptions: [
    'Calm, neutral-palette 2D medical textbook cross-section aligned directly to Fig. 17.16 (p. 250).',
    'Human ovum diameter is ~100–120 µm; diagram is enlarged for clear visual inspection of each concentric membrane.',
  ],
  variables: [{ id: 'selectedPart', label: 'Layer Inspector (Corona Radiata → Zona Pellucida → Perivitelline Space → Vitelline Membrane → Cytoplasm → Nucleus)' }],
  expectedObservations: [
    'Order from outside to inside: Corona radiata (follicle cells) → Zona pellucida → Perivitelline space → Vitelline membrane → Cytoplasm → Nucleus.',
    'The mature human ovum is almost free of yolk (alecithal), unlike bird eggs.',
  ],
  spark: {
    question: 'Why does a hen’s egg have a giant yellow yolk, whereas a human ovum is microscopic and almost completely free of yolk?',
    teaser: 'Because in humans, nourishment soon comes via the placenta — so the ovum focuses on protective membranes and abundant cytoplasm!',
  },
  explanations: {
    simple:
      'The mature human ovum (egg cell) is a spherical, non-motile haploid cell (n = 23 chromosomes) that is almost free of yolk and filled with nourishing cytoplasm around a central nucleus. To protect the egg safely until fertilization, it is wrapped in three concentric coverings from inside to outside: (1) the surface Vitelline (plasma) membrane, separated by a fluid-filled Perivitelline space from (2) the thin transparent Zona pellucida, surrounded externally by (3) a thick halo of follicle cells called the Corona radiata.',
    simpleTamil:
      'முதிர்ந்த மனித அண்ட செல் கோள வடிவமானது; கருவுணவு (yolk) அற்றது. இதன் மையத்தில் ஒற்றைமய உட்கருவும், சுற்றி வைட்டலின் சவ்வு, சோனா பெலூசிடா மற்றும் வெளிப்புற ஃபாலிக்கிள் செல்களாலான கரோனா ரேடியேட்டா படலங்களும் உள்ளன (பக்கம் 250).',
    analogy: 'Analogy: Like a delicate seed wrapped in three nested protective coats — an inner skin (vitelline), a clear cushion shell (zona pellucida), and an outer guard layer of cells (corona radiata).',
    detailed:
      'Per TN Class 10 Science (17.8.2, p. 250, Fig. 17.16), the mature ovum is spherical, almost yolk-free, and contains abundant cytoplasm and a haploid nucleus. It is surrounded by three membranes: the surface plasma (vitelline) membrane, an inner thin zona pellucida separated by the fluid-filled perivitelline space, and an outer thick corona radiata formed of follicle cells.',
    examReady: [
      'Shape & yolk: Spherical, non-motile, almost free of yolk, abundant cytoplasm + haploid nucleus (n = 23).',
      'Outside → Inside order: Corona radiata (follicle cells) → Zona pellucida → Perivitelline space → Vitelline membrane → Cytoplasm → Nucleus.',
      'Perivitelline space: Fluid-filled space lying between zona pellucida and surface vitelline membrane.',
    ],
    misconceptions: [
      {
        myth: 'Zona pellucida is the outermost covering of the human ovum.',
        reality: 'Corona radiata (follicle cells) is the OUTER thick layer; Zona pellucida is the inner thin translucent layer beneath it (p. 250).',
      },
    ],
  },
  mindMap: {
    title: 'Structure of Human Ovum (Fig. 17.16)',
    nodes: [
      { id: 'ovum', label: 'Human Ovum (n = 23)', role: 'core', summary: 'Spherical, yolk-free egg', detail: 'Female haploid gamete formed by oogenesis in the ovary (p. 250).', x: 265, y: 60 },
      { id: 'cr', label: '1. Corona Radiata (Outer)', role: 'cause', summary: 'Follicle cell halo', detail: 'Thick outermost protective layer composed of follicle cells.', x: 95, y: 185 },
      { id: 'zp', label: '2. Zona Pellucida + Space', role: 'mechanism', summary: 'Translucent + fluid gap', detail: 'Thin protective coat separated from the egg surface by the perivitelline space.', x: 270, y: 205 },
      { id: 'vit', label: '3. Vitelline + Cytoplasm', role: 'application', summary: 'Surface + Nucleus', detail: 'Vitelline plasma membrane encloses abundant yolk-free cytoplasm and haploid nucleus.', x: 465, y: 185 },
    ],
    edges: [
      { from: 'ovum', to: 'cr', relation: 'outer layer' },
      { from: 'ovum', to: 'zp', relation: 'middle coat' },
      { from: 'ovum', to: 'vit', relation: 'inner cell' },
    ],
  },
  predictPrompt: {
    question: 'Predict before inspecting Fig. 17.16: Going from OUTSIDE toward the central nucleus, which membrane comes FIRST?',
    options: [
      { id: 'cr', label: 'Corona radiata (outer follicle cells)', feedback: 'Spot on! Click through each layer from outer Corona radiata inward to the Nucleus below.', isExpected: true },
      { id: 'vit', label: 'Vitelline membrane', feedback: 'Inspect the cross-section below — the vitelline membrane is the innermost surface layer right around the cytoplasm.' },
      { id: 'zp', label: 'Zona pellucida', feedback: 'Close! Zona pellucida lies just INSIDE the outer corona radiata — verify it on the diagram below.' },
    ],
  },
  microMission: 'Mission: Trace all 6 layers from outside to inside on the calm 2D cross-section and locate the fluid-filled perivitelline space.',
  whyItWorks: {
    steps: [
      { heading: 'Step 1 · Outer Follicle Protection', detail: 'Corona radiata follicle cells surround and cushion the released ovum.' },
      { heading: 'Step 2 · Selective Barrier & Fluid Cushion', detail: 'Zona pellucida and the fluid-filled perivitelline space sit right outside the vitelline surface membrane.' },
      { heading: 'Step 3 · Cytoplasm & Haploid Nucleus', detail: 'Abundant cytoplasm supports early cleavage divisions after fertilization restores the diploid state (2n = 46).' },
    ],
    workedExample: {
      sourceRef: 'TN Class 10 Science Unit 17.8.2 Layer Ordering (p. 250)',
      problem: 'List the three protective membranes of a human ovum in order from outer to inner, and define the perivitelline space.',
      given: ['Figure 17.16 Structure of human ovum (p. 250)'],
      steps: [
        '1. Outer thick layer: Corona radiata (formed of follicle cells).',
        '2. Middle inner thin layer: Zona pellucida.',
        '3. Innermost surface layer: Vitelline (plasma) membrane.',
        'Perivitelline space = fluid-filled space between zona pellucida and the surface (vitelline membrane) of the egg.',
      ],
      finalAnswer: 'Corona radiata → Zona pellucida → (Perivitelline space) → Vitelline membrane.',
    },
  },
  solveChallenges: [
    {
      id: 'ov-q1',
      level: 'Supported',
      prompt: 'Which layer of the human ovum is formed by outer radiating follicle cells?',
      options: [
        { id: 'a', text: 'Corona radiata', isCorrect: true, why: 'Correct! Corona radiata is the outer thick layer formed of follicle cells (p. 250).' },
        { id: 'b', text: 'Vitelline membrane', isCorrect: false, why: 'Vitelline membrane is the inner surface plasma membrane of the ovum.' },
        { id: 'c', text: 'Acrosome', isCorrect: false, why: 'Acrosome is the anterior cap on a sperm head, not an ovum layer.' },
      ],
      hint: '"Corona" means crown/halo — look at the outermost cell ring on Fig. 17.16.',
    },
    {
      id: 'ov-q2',
      level: 'Apply to New Situation',
      prompt: 'Transfer Challenge: Which statement accurately compares a mature human ovum (17.8.2) with a human sperm (17.8.1)?',
      options: [
        { id: 'a', text: 'Both are haploid (n = 23), but the ovum is larger, spherical, non-motile, and enclosed by protective membranes whereas the sperm is streamlined and motile.', isCorrect: true, why: 'Excellent synthesis! Structure directly matches each gamete’s biological role.' },
        { id: 'b', text: 'The ovum is diploid (2n = 46) and swims using a flagellum.', isCorrect: false, why: 'Both gametes are haploid (n = 23), and the ovum is non-motile.' },
        { id: 'c', text: 'The human ovum contains a huge yellow yolk just like a bird egg.', isCorrect: false, why: 'TN Science p. 250 explicitly states the human ovum is almost free of yolk.' },
      ],
      hint: 'Check chromosome ploidy (n vs 2n), motility, and yolk content.',
    },
  ],
  remember: {
    takeaways: [
      'Mature human ovum is spherical, non-motile, haploid (n = 23), and almost free of yolk.',
      'Outer → Inner layers: Corona radiata → Zona pellucida → Perivitelline space → Vitelline membrane → Cytoplasm → Nucleus.',
      'Corona radiata consists of follicle cells; perivitelline space is fluid-filled.',
    ],
    flashcards: [
      { id: 'ov-fc1', front: 'Outer → Inner Membranes of Human Ovum (p. 250)', back: 'Corona radiata (follicle cells) → Zona pellucida → Vitelline membrane.', tag: 'Order' },
      { id: 'ov-fc2', front: 'What is the Perivitelline Space?', back: 'Fluid-filled space between the zona pellucida and the vitelline surface membrane of the ovum.', tag: 'Definition' },
      { id: 'ov-fc3', front: 'Does the human ovum have abundant yolk?', back: 'No — it is almost free of yolk and contains abundant cytoplasm around the haploid nucleus.', tag: 'Exam Key' },
    ],
    funFact: {
      fact: 'According to TN Class 10 Science p. 249 (Info bits), a female is born with millions of primordial follicles, about 60,000–70,000 remain at puberty, and only 300–400 mature eggs are ovulated during a lifetime.',
      source: 'TN Class 10 Science Unit 17 Info bits (p. 249)',
    },
  },
  readingChunks: [
    {
      id: 'ov-chunk-1',
      heading: '17.8.2 Structure of Human Ovum (Fig. 17.16)',
      printedPage: 250,
      pdfPage: 258,
      summary: 'Describes the spherical yolk-free human ovum, its abundant cytoplasm, central nucleus, and the three surrounding membranes (vitelline membrane, zona pellucida, corona radiata) plus perivitelline space.',
      plainExplanation: 'Draw concentric circles smoothly and label from top to bottom on the right side for neat textbook clarity.',
      glossary: [
        { term: 'Corona radiata', tamil: 'கரோனா ரேடியேட்டா', meaning: 'Thick outermost protective layer of follicle cells around the ovum.' },
        { term: 'Zona pellucida', tamil: 'சோனா பெலூசிடா', meaning: 'Inner translucent protective glycoprotein membrane surrounding the egg.' },
      ],
      relatedExerciseRef: 'TN Science Unit 17 Evaluation — Structure of human ovum diagram (p. 257).',
    },
  ],
  selfCheckPrompt: 'Trace the path from outside the human ovum to its nucleus, naming each layer in order.',
  selfCheckGuide: 'Corona radiata → Zona pellucida → Perivitelline space → Vitelline membrane → Cytoplasm → Haploid Nucleus.',
  alternative2D: 'Calm, static, neutral-palette labelled 2D medical SVG cross-section with keyboard-selectable layers.',
  accessibleText: 'Human ovum (Fig. 17.16) layers from outside to inside: corona radiata, zona pellucida, perivitelline space, vitelline membrane, cytoplasm, and nucleus.',
  reviewGate: ['PDF Verified (Science 2024 p. 250)', 'Pending TN Class 10 Biology Teacher Sign-off'],
};

// Also bind sibling container headings directly to their exact calm counterpart so 4.3, 4.8, and 17.8 open the right concept!
const ELECTRIC_POTENTIAL_PARENT: LessonExperienceSpec = {
  ...ELECTRIC_POTENTIAL_SPEC,
  sectionId: 'science-04-auto-4-3-electric-potential-and',
  sectionNumber: '4.3',
  title: { en: 'Electric Potential and Potential Difference', ta: 'மின்னழுத்தம் மற்றும் மின்னழுத்த வேறுபாடு' },
};

const JOULES_PARENT: LessonExperienceSpec = {
  ...JOULES_LAW_SPEC,
  sectionId: 'science-04-auto-4-8-heating-effect',
  sectionNumber: '4.8',
  title: { en: 'Heating Effect of Current', ta: 'மின்னோட்டத்தின் வெப்ப விளைவு' },
};

const GAMETOGENESIS_COMPARE: LessonExperienceSpec = {
  ...SPERM_SPEC,
  sectionId: 'science-17-auto-17-8-gametogenesis',
  sectionNumber: '17.8',
  title: { en: 'Gametogenesis (Human Sperm & Ovum Comparison)', ta: 'இனச்செல் உருவாக்கம் (Gametogenesis)' },
  variantId: 'gametogenesis_compare',
  concept: 'Gametogenesis produces haploid male (sperm) and female (ovum) gametes via spermatogenesis and oogenesis so fertilization restores diploid chromosome number (2n = 46).',
};

export const SCIENCE_CONCEPT_FIRST_SPECS: LessonExperienceSpec[] = [
  ELECTRIC_POTENTIAL_SPEC,
  ELECTRIC_POTENTIAL_PARENT,
  JOULES_LAW_SPEC,
  JOULES_PARENT,
  ETHYLENE_SPEC,
  PITUITARY_SPEC,
  SPERM_SPEC,
  OVUM_SPEC,
  GAMETOGENESIS_COMPARE,
];
