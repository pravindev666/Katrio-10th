/**
 * Canonical deterministic stoichiometry & activity-series engine for
 * Science Unit 10 — 10.1 Types of Chemical Reactions (TN Class 10, pp. 137–144).
 * Enforces conservation of atoms and activity-series feasibility by construction.
 */

export type ReactionCategory =
  | 'Combination Reaction'
  | 'Thermal Decomposition Reaction'
  | 'Single Displacement Reaction'
  | 'Double Displacement (Precipitation)'
  | 'Double Displacement (Neutralization)'
  | 'Combustion Reaction'
  | 'No Reaction (Activity Series Limit)';

export interface SpeciesSpec {
  formula: string;
  latex: string;
  name: string;
  phase: 's' | 'l' | 'g' | 'aq';
  atoms: Record<string, number>;
  balancedCoeff: number;
}

export interface TextbookReactionSpec {
  id: string;
  title: string;
  textbookPage: number;
  category: ReactionCategory;
  energyProfile: 'Exothermic (releases heat)' | 'Endothermic (absorbs heat)' | 'No net chemical change';
  conditionLabel?: string;
  feasible: boolean;
  reactants: SpeciesSpec[];
  products: SpeciesSpec[];
  observation: string;
  explanation: string;
  safetyBoundary: string;
  visualEffect: 'bright_solid' | 'gas_release' | 'yellow_precipitate' | 'neutral_clear' | 'flame_heat' | 'no_change';
}

/**
 * Class 10 Science p. 141 Activity Series (most reactive -> least reactive).
 */
export const ACTIVITY_SERIES: { symbol: string; name: string; rank: number }[] = [
  { symbol: 'K', name: 'Potassium', rank: 1 },
  { symbol: 'Na', name: 'Sodium', rank: 2 },
  { symbol: 'Li', name: 'Lithium', rank: 3 },
  { symbol: 'Ca', name: 'Calcium', rank: 4 },
  { symbol: 'Mg', name: 'Magnesium', rank: 5 },
  { symbol: 'Al', name: 'Aluminium', rank: 6 },
  { symbol: 'Zn', name: 'Zinc', rank: 7 },
  { symbol: 'Fe', name: 'Iron', rank: 8 },
  { symbol: 'Pb', name: 'Lead', rank: 9 },
  { symbol: 'H', name: 'Hydrogen (non-metal reference)', rank: 10 },
  { symbol: 'Cu', name: 'Copper', rank: 11 },
  { symbol: 'Ag', name: 'Silver', rank: 12 },
  { symbol: 'Au', name: 'Gold', rank: 13 },
  { symbol: 'Pt', name: 'Platinum', rank: 14 },
];

export const HALOGEN_ACTIVITY_SERIES = ['F', 'Cl', 'Br', 'I'] as const;

export function canDisplaceMetal(incomingSymbol: string, displacedSymbol: string): boolean {
  const incoming = ACTIVITY_SERIES.find((e) => e.symbol === incomingSymbol);
  const displaced = ACTIVITY_SERIES.find((e) => e.symbol === displacedSymbol);
  if (!incoming || !displaced) return false;
  return incoming.rank < displaced.rank;
}

export function canDisplaceHalogen(
  incomingHalogen: (typeof HALOGEN_ACTIVITY_SERIES)[number],
  displacedHalogen: (typeof HALOGEN_ACTIVITY_SERIES)[number],
): boolean {
  return (
    HALOGEN_ACTIVITY_SERIES.indexOf(incomingHalogen) <
    HALOGEN_ACTIVITY_SERIES.indexOf(displacedHalogen)
  );
}

export const UNIT10_REACTIONS: TextbookReactionSpec[] = [
  {
    id: 'combination-h2-cl2',
    title: 'Hydrogen + Chlorine → Hydrogen Chloride',
    textbookPage: 139,
    category: 'Combination Reaction',
    energyProfile: 'Exothermic (releases heat)',
    feasible: true,
    reactants: [
      { formula: 'H2', latex: '\\text{H}_{2(g)}', name: 'Hydrogen gas', phase: 'g', atoms: { H: 2 }, balancedCoeff: 1 },
      { formula: 'Cl2', latex: '\\text{Cl}_{2(g)}', name: 'Chlorine gas', phase: 'g', atoms: { Cl: 2 }, balancedCoeff: 1 },
    ],
    products: [
      { formula: 'HCl', latex: '\\text{HCl}_{(g)}', name: 'Hydrogen chloride gas', phase: 'g', atoms: { H: 1, Cl: 1 }, balancedCoeff: 2 },
    ],
    observation: 'Two elemental gases combine directly (A + B → AB) to form a single compound, hydrogen chloride gas.',
    explanation: 'Because two reactants synthesize a single product and release bond-formation energy, this is an exothermic Element + Element combination reaction.',
    safetyBoundary: 'Conceptual virtual simulation only. Chlorine and HCl gases are toxic and corrosive and are never handled outside a certified fume hood.',
    visualEffect: 'gas_release',
  },
  {
    id: 'decomposition-caco3',
    title: 'Thermal Decomposition of Calcium Carbonate',
    textbookPage: 140,
    category: 'Thermal Decomposition Reaction',
    energyProfile: 'Endothermic (absorbs heat)',
    conditionLabel: 'Heat (Δ)',
    feasible: true,
    reactants: [
      { formula: 'CaCO3', latex: '\\text{CaCO}_{3(s)}', name: 'Calcium carbonate', phase: 's', atoms: { Ca: 1, C: 1, O: 3 }, balancedCoeff: 1 },
    ],
    products: [
      { formula: 'CaO', latex: '\\text{CaO}_{(s)}', name: 'Calcium oxide (Quick lime)', phase: 's', atoms: { Ca: 1, O: 1 }, balancedCoeff: 1 },
      { formula: 'CO2', latex: '\\text{CO}_{2(g)}', name: 'Carbon dioxide gas', phase: 'g', atoms: { C: 1, O: 2 }, balancedCoeff: 1 },
    ],
    observation: 'Heating a single solid compound (CaCO₃) breaks bonds to produce solid quick lime (CaO) and colourless CO₂ gas.',
    explanation: 'Thermolysis absorbs thermal energy to split one compound into two simpler compounds (AB → A + B). Total atoms (1 Ca, 1 C, 3 O) remain strictly conserved.',
    safetyBoundary: 'Virtual model only; strong laboratory heating requires heat-resistant apparatus and teacher supervision.',
    visualEffect: 'gas_release',
  },
  {
    id: 'displacement-zn-hcl',
    title: 'Zinc + Dilute Hydrochloric Acid',
    textbookPage: 141,
    category: 'Single Displacement Reaction',
    energyProfile: 'Exothermic (releases heat)',
    feasible: true,
    reactants: [
      { formula: 'Zn', latex: '\\text{Zn}_{(s)}', name: 'Zinc metal', phase: 's', atoms: { Zn: 1 }, balancedCoeff: 1 },
      { formula: 'HCl', latex: '\\text{HCl}_{(aq)}', name: 'Dilute hydrochloric acid', phase: 'aq', atoms: { H: 1, Cl: 1 }, balancedCoeff: 2 },
    ],
    products: [
      { formula: 'ZnCl2', latex: '\\text{ZnCl}_{2(aq)}', name: 'Zinc chloride solution', phase: 'aq', atoms: { Zn: 1, Cl: 2 }, balancedCoeff: 1 },
      { formula: 'H2', latex: '\\text{H}_{2(g)}\\uparrow', name: 'Hydrogen gas', phase: 'g', atoms: { H: 2 }, balancedCoeff: 1 },
    ],
    observation: 'Effervescence (bubbles of H₂ gas) appears around the zinc as aqueous zinc chloride forms.',
    explanation: 'Zinc sits above Hydrogen in the activity series (rank 7 vs rank 10), so Zn displaces H from HCl (A + BC → AC + B).',
    safetyBoundary: 'Virtual laboratory model only. Dilute acids are corrosive and hydrogen gas is flammable; real experiments belong only in supervised school labs.',
    visualEffect: 'gas_release',
  },
  {
    id: 'double-displacement-precip',
    title: 'Lead (II) Nitrate + Potassium Iodide',
    textbookPage: 142,
    category: 'Double Displacement (Precipitation)',
    energyProfile: 'Exothermic (releases heat)',
    feasible: true,
    reactants: [
      { formula: 'Pb(NO3)2', latex: '\\text{Pb(NO}_3)_2{}_{(aq)}', name: 'Lead (II) nitrate', phase: 'aq', atoms: { Pb: 1, N: 2, O: 6 }, balancedCoeff: 1 },
      { formula: 'KI', latex: '\\text{KI}_{(aq)}', name: 'Potassium iodide', phase: 'aq', atoms: { K: 1, I: 1 }, balancedCoeff: 2 },
    ],
    products: [
      { formula: 'PbI2', latex: '\\text{PbI}_{2(s)}\\downarrow', name: 'Lead (II) iodide (yellow ppt)', phase: 's', atoms: { Pb: 1, I: 2 }, balancedCoeff: 1 },
      { formula: 'KNO3', latex: '\\text{KNO}_{3(aq)}', name: 'Potassium nitrate', phase: 'aq', atoms: { K: 1, N: 1, O: 3 }, balancedCoeff: 2 },
    ],
    observation: 'Mixing two clear aqueous solutions immediately produces an insoluble bright-yellow precipitate of Lead (II) iodide.',
    explanation: 'Cations (Pb²⁺ and K⁺) exchange partners in a metathesis reaction (AB + CD → AD + CB), forming an insoluble precipitate (PbI₂).',
    safetyBoundary: 'Virtual model only. Lead salts are toxic heavy-metal compounds and must never be handled without laboratory safety controls.',
    visualEffect: 'yellow_precipitate',
  },
  {
    id: 'neutralization-naoh-hcl',
    title: 'Sodium Hydroxide + Hydrochloric Acid',
    textbookPage: 143,
    category: 'Double Displacement (Neutralization)',
    energyProfile: 'Exothermic (releases heat)',
    feasible: true,
    reactants: [
      { formula: 'NaOH', latex: '\\text{NaOH}_{(aq)}', name: 'Sodium hydroxide (Base)', phase: 'aq', atoms: { Na: 1, O: 1, H: 1 }, balancedCoeff: 1 },
      { formula: 'HCl', latex: '\\text{HCl}_{(aq)}', name: 'Hydrochloric acid (Acid)', phase: 'aq', atoms: { H: 1, Cl: 1 }, balancedCoeff: 1 },
    ],
    products: [
      { formula: 'NaCl', latex: '\\text{NaCl}_{(aq)}', name: 'Sodium chloride (Salt)', phase: 'aq', atoms: { Na: 1, Cl: 1 }, balancedCoeff: 1 },
      { formula: 'H2O', latex: '\\text{H}_2\\text{O}_{(l)}', name: 'Water', phase: 'l', atoms: { H: 2, O: 1 }, balancedCoeff: 1 },
    ],
    observation: 'Acid and base neutralize each other to form a neutral clear solution of soluble salt (NaCl) and water, with gentle warming.',
    explanation: 'Acid + Base → Salt + Water is a classic double displacement neutralization reaction conserving every Na, O, H, and Cl atom.',
    safetyBoundary: 'Virtual model only. Strong acids and alkalis cause chemical burns and require lab PPE under educator supervision.',
    visualEffect: 'neutral_clear',
  },
  {
    id: 'infeasible-naf-cl2',
    title: 'Sodium Fluoride + Chlorine (Feasibility Test)',
    textbookPage: 141,
    category: 'No Reaction (Activity Series Limit)',
    energyProfile: 'No net chemical change',
    feasible: false,
    reactants: [
      { formula: 'NaF', latex: '\\text{NaF}_{(aq)}', name: 'Sodium fluoride', phase: 'aq', atoms: { Na: 1, F: 1 }, balancedCoeff: 2 },
      { formula: 'Cl2', latex: '\\text{Cl}_{2(g)}', name: 'Chlorine gas', phase: 'g', atoms: { Cl: 2 }, balancedCoeff: 1 },
    ],
    products: [],
    observation: 'No displacement occurs — the mixture remains unreacted.',
    explanation: 'Textbook p. 141 test case: Fluorine is more reactive than Chlorine (higher in Group 17), so Chlorine cannot displace Fluorine from NaF. Only the reverse (2NaCl + F₂ → 2NaF + Cl₂) is feasible.',
    safetyBoundary: 'Conceptual reactivity-series demonstration only; fluorine and chlorine gases are hazardous.',
    visualEffect: 'no_change',
  },
];

export interface AtomConservationReport {
  balanced: boolean;
  reactantCounts: Record<string, number>;
  productCounts: Record<string, number>;
  elements: {
    symbol: string;
    reactantCount: number;
    productCount: number;
    matches: boolean;
  }[];
}

export function evaluateAtomConservation(
  reaction: TextbookReactionSpec,
  reactantCoeffs: number[],
  productCoeffs: number[],
): AtomConservationReport {
  const reactantCounts: Record<string, number> = {};
  const productCounts: Record<string, number> = {};

  reaction.reactants.forEach((sp, idx) => {
    const c = Math.max(0, Math.floor(reactantCoeffs[idx] ?? 0));
    for (const [el, count] of Object.entries(sp.atoms)) {
      reactantCounts[el] = (reactantCounts[el] ?? 0) + count * c;
    }
  });

  reaction.products.forEach((sp, idx) => {
    const c = Math.max(0, Math.floor(productCoeffs[idx] ?? 0));
    for (const [el, count] of Object.entries(sp.atoms)) {
      productCounts[el] = (productCounts[el] ?? 0) + count * c;
    }
  });

  const allSymbols = Array.from(
    new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)]),
  ).sort();

  const elements = allSymbols.map((symbol) => {
    const r = reactantCounts[symbol] ?? 0;
    const p = productCounts[symbol] ?? 0;
    return { symbol, reactantCount: r, productCount: p, matches: r === p && r > 0 };
  });

  const allPositive =
    reactantCoeffs.every((c) => c >= 1) && productCoeffs.every((c) => c >= 1);
  const balanced = reaction.feasible && allPositive && elements.length > 0 && elements.every((e) => e.matches);

  return { balanced, reactantCounts, productCounts, elements };
}

/**
 * Interactive Free-Mix Lab Bench reagents for Science Unit 10 (pp. 137–144).
 * Lets visual learners freely combine pairs of reagents and see genuine textbook outcomes
 * (including realistic "No Reaction" explanations rooted in the Activity Series).
 */
export type LabReagentId =
  | 'Zn'
  | 'Cu'
  | 'HCl'
  | 'NaOH'
  | 'PbNO3_2'
  | 'KI'
  | 'CaCO3'
  | 'Heat'
  | 'NaF'
  | 'Cl2';

export interface LabReagentOption {
  id: LabReagentId;
  formula: string;
  name: string;
  state: 'solid' | 'liquid' | 'gas' | 'energy';
  colorHex: string;
}

export const LAB_REAGENTS: LabReagentOption[] = [
  { id: 'Zn', formula: 'Zn(s)', name: 'Zinc Granules', state: 'solid', colorHex: '#94A3B8' },
  { id: 'Cu', formula: 'Cu(s)', name: 'Copper Turnings', state: 'solid', colorHex: '#C2410C' },
  { id: 'HCl', formula: 'HCl(aq)', name: 'Dilute Hydrochloric Acid', state: 'liquid', colorHex: '#E0F2FE' },
  { id: 'NaOH', formula: 'NaOH(aq)', name: 'Sodium Hydroxide (Base)', state: 'liquid', colorHex: '#EEF2FF' },
  { id: 'PbNO3_2', formula: 'Pb(NO₃)₂(aq)', name: 'Lead (II) Nitrate', state: 'liquid', colorHex: '#F8FAFC' },
  { id: 'KI', formula: 'KI(aq)', name: 'Potassium Iodide', state: 'liquid', colorHex: '#FEFCE8' },
  { id: 'CaCO3', formula: 'CaCO₃(s)', name: 'Calcium Carbonate', state: 'solid', colorHex: '#F1F5F9' },
  { id: 'Heat', formula: 'Heat (Δ)', name: 'Bunsen Thermal Energy', state: 'energy', colorHex: '#F97316' },
  { id: 'NaF', formula: 'NaF(aq)', name: 'Sodium Fluoride', state: 'liquid', colorHex: '#E0E7FF' },
  { id: 'Cl2', formula: 'Cl₂(g)', name: 'Chlorine Gas', state: 'gas', colorHex: '#BEF264' },
];

export interface CustomMixOutcome {
  occurs: boolean;
  equation: string;
  category: string;
  visualEffect: 'gas_release' | 'yellow_precipitate' | 'neutral_clear' | 'flame_heat' | 'no_change';
  liquidColorHex: string;
  observation: string;
  whyItHappens: string;
}

export function mixCustomReagents(a: LabReagentId, b: LabReagentId): CustomMixOutcome {
  if (a === b) {
    return {
      occurs: false,
      equation: `${a} + ${b} → No new compound`,
      category: 'Same Substance',
      visualEffect: 'no_change',
      liquidColorHex: '#DBEAFE',
      observation: 'Mixing a substance with itself produces no chemical reaction.',
      whyItHappens: 'Pick two different reactants (for example, Lead (II) Nitrate + Potassium Iodide, or Zinc + Dilute HCl).',
    };
  }
  const pair = new Set<LabReagentId>([a, b]);

  if (pair.has('Zn') && pair.has('HCl')) {
    return {
      occurs: true,
      equation: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑',
      category: 'Single Displacement Reaction (Exothermic)',
      visualEffect: 'gas_release',
      liquidColorHex: '#BAE6FD',
      observation: 'Brisk effervescence! Streams of colourless Hydrogen (H₂) bubbles rise rapidly from the zinc granules.',
      whyItHappens: 'Zinc sits ABOVE Hydrogen in the Activity Series (rank 7 vs 10), so Zn displaces H from dilute HCl.',
    };
  }
  if (pair.has('Cu') && pair.has('HCl')) {
    return {
      occurs: false,
      equation: 'Cu(s) + HCl(aq) → No Reaction',
      category: 'Activity Series Limit (No Reaction)',
      visualEffect: 'no_change',
      liquidColorHex: '#E0F2FE',
      observation: 'Zero bubbles — the copper turnings sit calmly at the bottom of the flask.',
      whyItHappens: 'Copper sits BELOW Hydrogen in the Activity Series (rank 11 vs 10), so Cu cannot displace H from dilute HCl!',
    };
  }
  if (pair.has('PbNO3_2') && pair.has('KI')) {
    return {
      occurs: true,
      equation: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq)',
      category: 'Double Displacement (Precipitation)',
      visualEffect: 'yellow_precipitate',
      liquidColorHex: '#FACC15',
      observation: 'Instant golden-yellow clouds swirl and settle as solid Lead (II) iodide precipitate!',
      whyItHappens: 'Pb²⁺ and K⁺ exchange anions in water; PbI₂ is insoluble and precipitates immediately (textbook p. 142).',
    };
  }
  if (pair.has('NaOH') && pair.has('HCl')) {
    return {
      occurs: true,
      equation: 'NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l) + Heat',
      category: 'Double Displacement (Neutralization)',
      visualEffect: 'neutral_clear',
      liquidColorHex: '#A7F3D0',
      observation: 'Solution stays crystal clear while the flask warms noticeably (exothermic neutralization to pH 7 salt water).',
      whyItHappens: 'H⁺ from acid combines with OH⁻ from base to form neutral water (H₂O) and soluble NaCl salt (p. 143).',
    };
  }
  if (pair.has('CaCO3') && pair.has('Heat')) {
    return {
      occurs: true,
      equation: 'CaCO₃(s) —[Δ]→ CaO(s) + CO₂(g)↑',
      category: 'Thermal Decomposition (Endothermic)',
      visualEffect: 'flame_heat',
      liquidColorHex: '#FED7AA',
      observation: 'Strong heating splits white limestone into quick lime (CaO) and rising Carbon Dioxide (CO₂) gas.',
      whyItHappens: 'Thermal energy breaks chemical bonds in a single compound (AB → A + B, textbook p. 140).',
    };
  }
  if (pair.has('CaCO3') && pair.has('HCl')) {
    return {
      occurs: true,
      equation: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑',
      category: 'Acid–Carbonate Reaction (Gas Evolution)',
      visualEffect: 'gas_release',
      liquidColorHex: '#E0F2FE',
      observation: 'Vigorous fizzing! Carbon dioxide (CO₂) gas bubbles out as calcium carbonate dissolves.',
      whyItHappens: 'Acids react with metal carbonates to produce salt, water, and CO₂ gas.',
    };
  }
  if (pair.has('NaF') && pair.has('Cl2')) {
    return {
      occurs: false,
      equation: '2NaF(aq) + Cl₂(g) → No Reaction',
      category: 'Halogen Activity Series Limit (p. 141)',
      visualEffect: 'no_change',
      liquidColorHex: '#ECFCCB',
      observation: 'No displacement occurs — the flask remains unreacted.',
      whyItHappens: 'Fluorine is more reactive than Chlorine (F > Cl > Br > I), so Cl₂ cannot displace F⁻ from NaF (textbook p. 141)!',
    };
  }
  if (pair.has('KI') && pair.has('Cl2')) {
    return {
      occurs: true,
      equation: '2KI(aq) + Cl₂(g) → 2KCl(aq) + I₂(aq)',
      category: 'Halogen Single Displacement',
      visualEffect: 'yellow_precipitate',
      liquidColorHex: '#B45309',
      observation: 'Clear KI solution turns amber-brown as free Iodine (I₂) is displaced!',
      whyItHappens: 'Chlorine sits ABOVE Iodine in Group 17 (F > Cl > Br > I), so Cl₂ easily displaces I⁻ from KI.',
    };
  }

  return {
    occurs: false,
    equation: `${a} + ${b} → Physical mixture (no Class 10 Unit 10 reaction)`,
    category: 'No Significant Reaction',
    visualEffect: 'no_change',
    liquidColorHex: '#E2E8F0',
    observation: 'The two reagents mix without forming a precipitate, gas, or major heat change under standard classroom conditions.',
    whyItHappens: 'Try classic pairs: Zn + HCl, Cu + HCl (compare!), Pb(NO₃)₂ + KI, NaOH + HCl, CaCO₃ + Heat, KI + Cl₂, or NaF + Cl₂.',
  };
}
