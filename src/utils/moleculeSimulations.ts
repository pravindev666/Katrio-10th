/**
 * Canonical 3D molecular geometry, atomic mass & carbon-bonding data/calculator for
 * Science Unit 7 (Atoms and Molecules, pp. 91–99) &
 * Science Unit 11 (Carbon and its Compounds, pp. 155–165).
 */

export type ElementSymbol = 'H' | 'C' | 'N' | 'O' | 'Cl' | 'S';

export const TABLE_7_1_ATOMIC_MASS: Record<ElementSymbol, { name: string; mass: number; color: string; radius: number }> = {
  H: { name: 'Hydrogen', mass: 1, color: '#F1F5F9', radius: 0.24 },
  C: { name: 'Carbon', mass: 12, color: '#334155', radius: 0.42 },
  N: { name: 'Nitrogen', mass: 14, color: '#2563EB', radius: 0.38 },
  O: { name: 'Oxygen', mass: 16, color: '#DC2626', radius: 0.38 },
  S: { name: 'Sulphur', mass: 32, color: '#EAB308', radius: 0.44 },
  Cl: { name: 'Chlorine', mass: 35.5, color: '#16A34A', radius: 0.42 },
};

export interface AtomNode3D {
  id: string;
  element: ElementSymbol;
  position: [number, number, number];
  role: string;
}

export interface BondSpec3D {
  from: string;
  to: string;
  order: 1 | 2 | 3;
}

export interface MoleculeSpec3D {
  id: string;
  name: string;
  formula: string;
  iupacName: string;
  unitFocus: 'science-07' | 'science-11' | 'both';
  textbookPages: string;
  geometryLabel: string;
  bondAngle: string;
  classification: string;
  saturation: 'Inorganic / Elemental' | 'Saturated (Single C–C / C–H)' | 'Unsaturated (Double C=C)' | 'Unsaturated (Triple C≡C)' | 'Functional Group Derivative';
  bromineWaterTest: string;
  atoms: AtomNode3D[];
  bonds: BondSpec3D[];
  summary: string;
}

export const CLASS10_MOLECULES_3D: MoleculeSpec3D[] = [
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    iupacName: 'Oxidane (Water)',
    unitFocus: 'science-07',
    textbookPages: 'Unit 7, pp. 94–97',
    geometryLabel: 'Bent (Angular)',
    bondAngle: '104.5°',
    classification: 'Heteroatomic Triatomic Molecule (Atomicity = 3)',
    saturation: 'Inorganic / Elemental',
    bromineWaterTest: 'Not an organic hydrocarbon',
    atoms: [
      { id: 'O1', element: 'O', position: [0, 0.25, 0], role: 'Central Oxygen atom (Ar = 16)' },
      { id: 'H1', element: 'H', position: [-0.92, -0.42, 0], role: 'Hydrogen atom 1 (Ar = 1)' },
      { id: 'H2', element: 'H', position: [0.92, -0.42, 0], role: 'Hydrogen atom 2 (Ar = 1)' },
    ],
    bonds: [
      { from: 'O1', to: 'H1', order: 1 },
      { from: 'O1', to: 'H2', order: 1 },
    ],
    summary: 'Two hydrogen atoms covalently bonded to one oxygen atom. Gram molecular mass = 2(1) + 16 = 18 g.',
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    iupacName: 'Carbon dioxide',
    unitFocus: 'science-07',
    textbookPages: 'Unit 7, pp. 94–97',
    geometryLabel: 'Linear',
    bondAngle: '180°',
    classification: 'Heteroatomic Triatomic Molecule (Atomicity = 3)',
    saturation: 'Inorganic / Elemental',
    bromineWaterTest: 'Not an organic hydrocarbon',
    atoms: [
      { id: 'C1', element: 'C', position: [0, 0, 0], role: 'Central Carbon atom (Ar = 12)' },
      { id: 'O1', element: 'O', position: [-1.35, 0, 0], role: 'Left double-bonded Oxygen (Ar = 16)' },
      { id: 'O2', element: 'O', position: [1.35, 0, 0], role: 'Right double-bonded Oxygen (Ar = 16)' },
    ],
    bonds: [
      { from: 'C1', to: 'O1', order: 2 },
      { from: 'C1', to: 'O2', order: 2 },
    ],
    summary: 'Linear O=C=O molecule with two covalent double bonds. Gram molecular mass = 12 + 2(16) = 44 g.',
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    iupacName: 'Methane (Alkane, n = 1)',
    unitFocus: 'both',
    textbookPages: 'Unit 7 p. 95 & Unit 11 p. 157',
    geometryLabel: 'Tetrahedral',
    bondAngle: '109.5°',
    classification: 'Simplest Alkane (CnH2n+2) · Polyatomic (Atomicity = 5)',
    saturation: 'Saturated (Single C–C / C–H)',
    bromineWaterTest: 'Does NOT decolourise bromine water (saturated)',
    atoms: [
      { id: 'C1', element: 'C', position: [0, 0, 0], role: 'Tetravalent central Carbon (4 single bonds)' },
      { id: 'H1', element: 'H', position: [0, 1.15, 0], role: 'Apical Hydrogen' },
      { id: 'H2', element: 'H', position: [1.08, -0.38, 0], role: 'Base Hydrogen 1' },
      { id: 'H3', element: 'H', position: [-0.54, -0.38, 0.94], role: 'Base Hydrogen 2' },
      { id: 'H4', element: 'H', position: [-0.54, -0.38, -0.94], role: 'Base Hydrogen 3' },
    ],
    bonds: [
      { from: 'C1', to: 'H1', order: 1 },
      { from: 'C1', to: 'H2', order: 1 },
      { from: 'C1', to: 'H3', order: 1 },
      { from: 'C1', to: 'H4', order: 1 },
    ],
    summary: 'Carbon forms 4 equivalent single covalent bonds arranged in a 3D tetrahedron (109.5°), NOT a flat cross.',
  },
  {
    id: 'c2h4',
    name: 'Ethene (Ethylene)',
    formula: 'C₂H₄',
    iupacName: 'Ethene (Alkene, n = 2)',
    unitFocus: 'science-11',
    textbookPages: 'Unit 11, pp. 157–158',
    geometryLabel: 'Trigonal Planar',
    bondAngle: '120°',
    classification: 'Simplest Alkene (CnH2n) · Unsaturated Hydrocarbon',
    saturation: 'Unsaturated (Double C=C)',
    bromineWaterTest: 'Decolourises reddish-brown bromine water (unsaturated)',
    atoms: [
      { id: 'C1', element: 'C', position: [-0.72, 0, 0], role: 'Carbon 1 (double bonded)' },
      { id: 'C2', element: 'C', position: [0.72, 0, 0], role: 'Carbon 2 (double bonded)' },
      { id: 'H1', element: 'H', position: [-1.42, 0.85, 0], role: 'Hydrogen 1' },
      { id: 'H2', element: 'H', position: [-1.42, -0.85, 0], role: 'Hydrogen 2' },
      { id: 'H3', element: 'H', position: [1.42, 0.85, 0], role: 'Hydrogen 3' },
      { id: 'H4', element: 'H', position: [1.42, -0.85, 0], role: 'Hydrogen 4' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', order: 2 },
      { from: 'C1', to: 'H1', order: 1 },
      { from: 'C1', to: 'H2', order: 1 },
      { from: 'C2', to: 'H3', order: 1 },
      { from: 'C2', to: 'H4', order: 1 },
    ],
    summary: 'Contains a C=C covalent double bond keeping all 6 atoms coplanar at ~120°. Unsaturated and more reactive than ethane.',
  },
  {
    id: 'c2h2',
    name: 'Ethyne (Acetylene)',
    formula: 'C₂H₂',
    iupacName: 'Ethyne (Alkyne, n = 2)',
    unitFocus: 'science-11',
    textbookPages: 'Unit 11, pp. 157–158',
    geometryLabel: 'Linear',
    bondAngle: '180°',
    classification: 'Simplest Alkyne (CnH2n−2) · Unsaturated Hydrocarbon',
    saturation: 'Unsaturated (Triple C≡C)',
    bromineWaterTest: 'Decolourises reddish-brown bromine water rapidly',
    atoms: [
      { id: 'C1', element: 'C', position: [-0.62, 0, 0], role: 'Carbon 1 (triple bonded)' },
      { id: 'C2', element: 'C', position: [0.62, 0, 0], role: 'Carbon 2 (triple bonded)' },
      { id: 'H1', element: 'H', position: [-1.65, 0, 0], role: 'Terminal Hydrogen 1' },
      { id: 'H2', element: 'H', position: [1.65, 0, 0], role: 'Terminal Hydrogen 2' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', order: 3 },
      { from: 'C1', to: 'H1', order: 1 },
      { from: 'C2', to: 'H2', order: 1 },
    ],
    summary: 'Contains a C≡C triple bond making the molecule completely linear (180°) and the most reactive of the three hydrocarbon classes.',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'CH₃CH₂OH',
    iupacName: 'Ethanol (Alcohol, –OH group)',
    unitFocus: 'science-11',
    textbookPages: 'Unit 11, pp. 163–164 (Section 11.6)',
    geometryLabel: 'Tetrahedral Chain + Hydroxyl',
    bondAngle: '109.5° (C) / 104.5° (O)',
    classification: 'Alcohol Functional Group (–OH) · Root: Eth- + -an- + -ol',
    saturation: 'Functional Group Derivative',
    bromineWaterTest: 'No C=C / C≡C bond; reacts with Na releasing H₂ gas',
    atoms: [
      { id: 'C1', element: 'C', position: [-1.15, -0.2, 0], role: 'Methyl Carbon (–CH₃)' },
      { id: 'C2', element: 'C', position: [0.15, 0.3, 0], role: 'Methylene Carbon (–CH₂–)' },
      { id: 'O1', element: 'O', position: [1.22, -0.35, 0], role: 'Hydroxyl Oxygen (–OH functional group)' },
      { id: 'H1', element: 'H', position: [-1.85, 0.55, 0], role: 'Methyl H1' },
      { id: 'H2', element: 'H', position: [-1.25, -0.82, 0.85], role: 'Methyl H2' },
      { id: 'H3', element: 'H', position: [-1.25, -0.82, -0.85], role: 'Methyl H3' },
      { id: 'H4', element: 'H', position: [0.22, 0.95, 0.82], role: 'CH₂ Hydrogen 1' },
      { id: 'H5', element: 'H', position: [0.22, 0.95, -0.82], role: 'CH₂ Hydrogen 2' },
      { id: 'H6', element: 'H', position: [1.95, 0.15, 0], role: 'Hydroxyl Hydrogen (–OH)' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', order: 1 },
      { from: 'C2', to: 'O1', order: 1 },
      { from: 'O1', to: 'H6', order: 1 },
      { from: 'C1', to: 'H1', order: 1 },
      { from: 'C1', to: 'H2', order: 1 },
      { from: 'C1', to: 'H3', order: 1 },
      { from: 'C2', to: 'H4', order: 1 },
      { from: 'C2', to: 'H5', order: 1 },
    ],
    summary: 'Two-carbon chain attached to a hydroxyl (–OH) group. Molecular mass = 2(12) + 6(1) + 16 = 46 g/mol.',
  },
  {
    id: 'ethanoic_acid',
    name: 'Ethanoic Acid (Acetic Acid)',
    formula: 'CH₃COOH',
    iupacName: 'Ethanoic acid (Carboxylic acid, –COOH)',
    unitFocus: 'science-11',
    textbookPages: 'Unit 11, p. 165 (Section 11.7)',
    geometryLabel: 'Tetrahedral CH₃ + Planar –COOH',
    bondAngle: '109.5° (C1) / 120° (C2)',
    classification: 'Carboxylic Acid Functional Group (–COOH)',
    saturation: 'Functional Group Derivative',
    bromineWaterTest: 'Turns blue litmus red; reacts with NaHCO₃ giving CO₂ brisk effervescence',
    atoms: [
      { id: 'C1', element: 'C', position: [-1.1, 0, 0], role: 'Methyl Carbon (–CH₃)' },
      { id: 'C2', element: 'C', position: [0.25, 0.1, 0], role: 'Carboxyl Carbon (C=O and –OH)' },
      { id: 'O1', element: 'O', position: [0.85, 1.15, 0], role: 'Carbonyl Oxygen (=O)' },
      { id: 'O2', element: 'O', position: [0.95, -1.0, 0], role: 'Hydroxyl Oxygen (–OH)' },
      { id: 'H1', element: 'H', position: [-1.55, 0.9, 0.4], role: 'Methyl H1' },
      { id: 'H2', element: 'H', position: [-1.55, -0.8, 0.55], role: 'Methyl H2' },
      { id: 'H3', element: 'H', position: [-1.45, -0.1, -0.98], role: 'Methyl H3' },
      { id: 'H4', element: 'H', position: [1.85, -0.82, 0], role: 'Acidic Hydrogen (released as H⁺)' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', order: 1 },
      { from: 'C2', to: 'O1', order: 2 },
      { from: 'C2', to: 'O2', order: 1 },
      { from: 'O2', to: 'H4', order: 1 },
      { from: 'C1', to: 'H1', order: 1 },
      { from: 'C1', to: 'H2', order: 1 },
      { from: 'C1', to: 'H3', order: 1 },
    ],
    summary: 'Contains the –COOH carboxylic acid group (vinegar is a 5–8% aqueous solution). Molecular mass = 2(12) + 4(1) + 2(16) = 60 g/mol.',
  },
];

export interface MolecularMassAnalysis {
  atomicity: number;
  molecularMass: number;
  composition: {
    symbol: ElementSymbol;
    name: string;
    count: number;
    massContribution: number;
    percentByMass: number;
  }[];
}

export function analyzeMoleculeMass(mol: MoleculeSpec3D): MolecularMassAnalysis {
  const counts: Partial<Record<ElementSymbol, number>> = {};
  for (const atom of mol.atoms) {
    counts[atom.element] = (counts[atom.element] ?? 0) + 1;
  }

  let totalMass = 0;
  for (const [sym, count] of Object.entries(counts) as [ElementSymbol, number][]) {
    totalMass += TABLE_7_1_ATOMIC_MASS[sym].mass * count;
  }

  const composition = (Object.entries(counts) as [ElementSymbol, number][]).map(([symbol, count]) => {
    const massContribution = TABLE_7_1_ATOMIC_MASS[symbol].mass * count;
    return {
      symbol,
      name: TABLE_7_1_ATOMIC_MASS[symbol].name,
      count,
      massContribution: Number(massContribution.toFixed(2)),
      percentByMass: Number(((massContribution / totalMass) * 100).toFixed(2)),
    };
  });

  return {
    atomicity: mol.atoms.length,
    molecularMass: Number(totalMass.toFixed(2)),
    composition,
  };
}

export function calculateAverageAtomicMass(
  isotopes: { massAmu: number; abundancePercent: number }[],
): { valid: boolean; averageAmu: number; totalPercent: number; error?: string } {
  const totalPercent = Number(isotopes.reduce((acc, i) => acc + i.abundancePercent, 0).toFixed(4));
  if (Math.abs(totalPercent - 100) > 0.1) {
    return {
      valid: false,
      averageAmu: NaN,
      totalPercent,
      error: `Isotope abundances must sum to 100% (currently ${totalPercent}%).`,
    };
  }
  const avg = isotopes.reduce((acc, i) => acc + i.massAmu * (i.abundancePercent / 100), 0);
  return {
    valid: true,
    averageAmu: Number(avg.toFixed(3)),
    totalPercent,
  };
}
