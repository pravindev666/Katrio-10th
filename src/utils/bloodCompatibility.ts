/**
 * Canonical ABO & Rh Blood Group Compatibility + 0.8 s Cardiac Cycle module
 * for Science Unit 14 (Sections 14.15.2–14.18, TN Class 10, pp. 209–212).
 */

export type AboGroup = 'A' | 'B' | 'AB' | 'O';
export type RhFactor = '+' | '-';

export interface BloodProfile {
  group: AboGroup;
  rbcAntigens: string[];
  plasmaAntibodies: string[];
  specialRole?: string;
}

export const ABO_PROFILES: Record<AboGroup, BloodProfile> = {
  A: {
    group: 'A',
    rbcAntigens: ['Antigen A'],
    plasmaAntibodies: ['anti-b'],
  },
  B: {
    group: 'B',
    rbcAntigens: ['Antigen B'],
    plasmaAntibodies: ['anti-a'],
  },
  AB: {
    group: 'AB',
    rbcAntigens: ['Antigen A', 'Antigen B'],
    plasmaAntibodies: [],
    specialRole: 'Universal Recipient (ABO)',
  },
  O: {
    group: 'O',
    rbcAntigens: [],
    plasmaAntibodies: ['anti-a', 'anti-b'],
    specialRole: 'Universal Donor (ABO)',
  },
};

export interface TransfusionResult {
  compatible: boolean;
  aboCompatible: boolean;
  rhCompatible: boolean;
  reason: string;
}

/**
 * Evaluates RBC transfusion safety per TN Class 10 Science Table 14.2 (pp. 211–212):
 * Donor RBC antigens must not trigger agglutination against recipient plasma antibodies,
 * and an Rh- recipient must not receive Rh+ donor blood.
 */
export function evaluateBloodTransfusion(
  donorGroup: AboGroup,
  donorRh: RhFactor,
  recipientGroup: AboGroup,
  recipientRh: RhFactor,
): TransfusionResult {
  const donorAntigens = ABO_PROFILES[donorGroup].rbcAntigens;
  const recipientAbs = ABO_PROFILES[recipientGroup].plasmaAntibodies;

  const hasAConflict = donorAntigens.includes('Antigen A') && recipientAbs.includes('anti-a');
  const hasBConflict = donorAntigens.includes('Antigen B') && recipientAbs.includes('anti-b');
  const aboCompatible = !hasAConflict && !hasBConflict;
  const rhCompatible = !(donorRh === '+' && recipientRh === '-');
  const compatible = aboCompatible && rhCompatible;

  if (compatible) {
    return {
      compatible: true,
      aboCompatible: true,
      rhCompatible: true,
      reason: `Compatible: ${donorGroup}${donorRh} donor RBCs carry no antigen attacked by ${recipientGroup}${recipientRh} recipient plasma antibodies.`,
    };
  }

  const reasons: string[] = [];
  if (hasAConflict) reasons.push('Donor RBC Antigen A clashes with recipient anti-a antibodies (agglutination risk).');
  if (hasBConflict) reasons.push('Donor RBC Antigen B clashes with recipient anti-b antibodies (agglutination risk).');
  if (!rhCompatible) reasons.push('Donor Rh+ antigen triggers anti-Rh antibody response in an Rh− recipient.');

  return {
    compatible: false,
    aboCompatible,
    rhCompatible,
    reason: reasons.join(' '),
  };
}

export interface CardiacCyclePhase {
  id: 'atrial_systole' | 'ventricular_systole' | 'ventricular_diastole';
  title: string;
  durationSec: number;
  startSec: number;
  endSec: number;
  heartSound: string;
  valveState: string;
  summary: string;
}

export const CARDIAC_CYCLE_PHASES: CardiacCyclePhase[] = [
  {
    id: 'atrial_systole',
    title: 'Atrial Systole',
    durationSec: 0.1,
    startSec: 0.0,
    endSec: 0.1,
    heartSound: 'Quiet filling impulse from SA node',
    valveState: 'Tricuspid & Bicuspid valves OPEN; Semilunar valves CLOSED',
    summary: 'The SA node (pacemaker) fires in the right atrium; both atria contract for 0.1 s, pushing blood into the ventricles.',
  },
  {
    id: 'ventricular_systole',
    title: 'Ventricular Systole',
    durationSec: 0.3,
    startSec: 0.1,
    endSec: 0.4,
    heartSound: 'First sound “LUBB” (longer duration)',
    valveState: 'Tricuspid & Bicuspid valves SNAP SHUT (LUBB); Semilunar valves OPEN',
    summary: 'Impulse passes via AV node, Bundle of His, and Purkinje fibres. Ventricles contract for 0.3 s, ejecting blood into pulmonary trunk & aorta.',
  },
  {
    id: 'ventricular_diastole',
    title: 'Ventricular Diastole',
    durationSec: 0.4,
    startSec: 0.4,
    endSec: 0.8,
    heartSound: 'Second sound “DUPP” (shorter duration)',
    valveState: 'Semilunar valves SNAP SHUT (DUPP); AV valves reopen for passive filling',
    summary: 'Ventricles relax for 0.4 s; semilunar valves close to prevent arterial backflow while chambers refill for the next 0.8 s beat.',
  },
];
