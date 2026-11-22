/**
 * Canonical anatomical pathway data & validator for
 * Science Unit 14 — 14.15 Structure of Human Heart & Double Circulation (TN Class 10, pp. 207–210).
 */

export interface CirculationStation {
  id: string;
  order: number;
  structure: string;
  circuit: 'Systemic return' | 'Pulmonary circuit' | 'Systemic delivery';
  oxygenation: 'Deoxygenated (Low O₂, High CO₂)' | 'Gas Exchange (CO₂ out, O₂ in)' | 'Oxygenated (High O₂)';
  valveOrVessel: string;
  detail: string;
}

export const DOUBLE_CIRCULATION_PATHWAY: CirculationStation[] = [
  {
    id: 'vena-cava-ra',
    order: 1,
    structure: 'Vena Cava → Right Atrium',
    circuit: 'Systemic return',
    oxygenation: 'Deoxygenated (Low O₂, High CO₂)',
    valveOrVessel: 'Superior & Inferior Vena Cava (plus Coronary Sinus)',
    detail:
      'Deoxygenated blood from the upper and lower body enters the thin-walled Right Atrium.',
  },
  {
    id: 'tricuspid-rv',
    order: 2,
    structure: 'Tricuspid Valve → Right Ventricle',
    circuit: 'Pulmonary circuit',
    oxygenation: 'Deoxygenated (Low O₂, High CO₂)',
    valveOrVessel: 'Right Atrioventricular (Tricuspid) Valve — 3 flaps',
    detail:
      'Blood passes one way through the tricuspid valve (anchored by chordae tendineae) into the Right Ventricle.',
  },
  {
    id: 'pulmonary-artery-lungs',
    order: 3,
    structure: 'Pulmonary Semilunar Valve → Pulmonary Artery → Lungs',
    circuit: 'Pulmonary circuit',
    oxygenation: 'Gas Exchange (CO₂ out, O₂ in)',
    valveOrVessel: 'Pulmonary Semilunar Valve & Pulmonary Trunk',
    detail:
      'Right Ventricle pumps deoxygenated blood through the pulmonary trunk to both lungs, where CO₂ is released and O₂ is absorbed.',
  },
  {
    id: 'pulmonary-vein-la',
    order: 4,
    structure: 'Pulmonary Veins → Left Atrium',
    circuit: 'Pulmonary circuit',
    oxygenation: 'Oxygenated (High O₂)',
    valveOrVessel: 'Left & Right Pulmonary Veins',
    detail:
      'Freshly oxygenated blood returns from the lungs into the Left Atrium.',
  },
  {
    id: 'bicuspid-lv',
    order: 5,
    structure: 'Bicuspid (Mitral) Valve → Left Ventricle',
    circuit: 'Systemic delivery',
    oxygenation: 'Oxygenated (High O₂)',
    valveOrVessel: 'Left Atrioventricular (Bicuspid / Mitral) Valve — 2 cusps',
    detail:
      'Blood enters the Left Ventricle, whose muscular wall is ~3× thicker than the Right Ventricle to pump blood to the whole body.',
  },
  {
    id: 'aortic-valve-aorta',
    order: 6,
    structure: 'Aortic Semilunar Valve → Aorta → Body Organs',
    circuit: 'Systemic delivery',
    oxygenation: 'Oxygenated (High O₂)',
    valveOrVessel: 'Aortic Semilunar Valve & Systemic Aorta',
    detail:
      'High-pressure oxygenated blood leaves via the Aorta to supply organs (and coronary arteries feed the cardiac muscle itself).',
  },
];

export function validateCirculationSequence(submittedIds: string[]): {
  isComplete: boolean;
  isExactOrder: boolean;
  correctCount: number;
  firstMismatchIndex: number | null;
} {
  const expected = DOUBLE_CIRCULATION_PATHWAY.map((s) => s.id);
  let correctCount = 0;
  let firstMismatchIndex: number | null = null;

  for (let i = 0; i < expected.length; i++) {
    if (submittedIds[i] === expected[i]) {
      correctCount++;
    } else if (firstMismatchIndex === null) {
      firstMismatchIndex = i;
    }
  }

  return {
    isComplete: submittedIds.length === expected.length,
    isExactOrder:
      submittedIds.length === expected.length && correctCount === expected.length,
    correctCount,
    firstMismatchIndex,
  };
}
