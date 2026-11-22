/**
 * Canonical, unit-tested mathematical computation engine for
 * Mathematics Chapter 6 — 6.3 Heights and Distances (TN Class 10).
 * Keeps all trigonometry formulas, unit handling, exact surds, and edge-case
 * validation separated from UI rendering.
 */

export type ClinometerMode = 'elevation' | 'depression';

export interface ClinometerInput {
  mode: ClinometerMode;
  distanceM: number; // Horizontal ground distance d (metres)
  angleDeg: number; // Angle of elevation or depression θ (degrees)
  observerEyeM: number; // Observer eye height h0 above ground (elevation mode) or cliff/tower height (depression mode)
}

export interface ClinometerResult {
  valid: boolean;
  error?: string;
  warning?: string;
  mode: ClinometerMode;
  distanceM: number;
  angleDeg: number;
  observerEyeM: number;
  tanTheta: number;
  tanExactLabel: string | null;
  verticalDeltaM: number; // d * tan(theta)
  totalHeightM: number; // Elevation: d*tan(theta) + h0; Depression: height of cliff = d*tan(theta) (or distance from height)
  lineOfSightM: number; // Hypotenuse: sqrt(d^2 + verticalDelta^2)
  exactSurdFormula: string | null;
  latexDerivation: string;
}

const SQRT3 = Math.sqrt(3);

export function getExactTanLabel(angleDeg: number): string | null {
  if (angleDeg === 30) return '\\frac{1}{\\sqrt{3}}';
  if (angleDeg === 45) return '1';
  if (angleDeg === 60) return '\\sqrt{3}';
  return null;
}

export function solveClinometer(input: ClinometerInput): ClinometerResult {
  const { mode, distanceM, angleDeg, observerEyeM } = input;

  if (!Number.isFinite(distanceM) || distanceM <= 0) {
    return {
      valid: false,
      error: 'Horizontal distance (d) must be strictly greater than 0 metres.',
      mode,
      distanceM,
      angleDeg,
      observerEyeM,
      tanTheta: NaN,
      tanExactLabel: null,
      verticalDeltaM: NaN,
      totalHeightM: NaN,
      lineOfSightM: NaN,
      exactSurdFormula: null,
      latexDerivation: '\\text{Invalid: } d \\le 0\\text{ m}',
    };
  }

  if (!Number.isFinite(observerEyeM) || observerEyeM < 0) {
    return {
      valid: false,
      error: 'Observer eye height (h₀) cannot be negative.',
      mode,
      distanceM,
      angleDeg,
      observerEyeM,
      tanTheta: NaN,
      tanExactLabel: null,
      verticalDeltaM: NaN,
      totalHeightM: NaN,
      lineOfSightM: NaN,
      exactSurdFormula: null,
      latexDerivation: '\\text{Invalid: } h_0 < 0\\text{ m}',
    };
  }

  if (!Number.isFinite(angleDeg) || angleDeg <= 0) {
    return {
      valid: false,
      error:
        angleDeg === 0
          ? 'At θ = 0°, the line of sight is completely horizontal (tan 0° = 0), so there is no elevation or depression triangle.'
          : 'Angle θ must be strictly between 0° and 90° for a right triangle.',
      mode,
      distanceM,
      angleDeg,
      observerEyeM,
      tanTheta: angleDeg === 0 ? 0 : NaN,
      tanExactLabel: angleDeg === 0 ? '0' : null,
      verticalDeltaM: 0,
      totalHeightM: mode === 'elevation' ? observerEyeM : 0,
      lineOfSightM: distanceM,
      exactSurdFormula: null,
      latexDerivation: '\\theta = 0^\\circ \\implies \\tan(0^\\circ) = 0\\text{ (horizontal line of sight)}',
    };
  }

  if (angleDeg >= 90) {
    return {
      valid: false,
      error:
        angleDeg === 90
          ? 'At θ = 90°, tan(90°) is undefined (vertical line of sight directly overhead/below with zero horizontal offset).'
          : 'Angle θ cannot reach or exceed 90° inside a right-angled triangle.',
      mode,
      distanceM,
      angleDeg,
      observerEyeM,
      tanTheta: Infinity,
      tanExactLabel: '\\text{undefined}',
      verticalDeltaM: Infinity,
      totalHeightM: Infinity,
      lineOfSightM: Infinity,
      exactSurdFormula: null,
      latexDerivation: '\\theta = 90^\\circ \\implies \\tan(90^\\circ) = \\text{undefined}',
    };
  }

  const rad = (angleDeg * Math.PI) / 180;
  const tanTheta =
    angleDeg === 30 ? 1 / SQRT3 : angleDeg === 45 ? 1 : angleDeg === 60 ? SQRT3 : Math.tan(rad);

  const verticalDeltaM = Number((distanceM * tanTheta).toFixed(2));
  const totalHeightM =
    mode === 'elevation'
      ? Number((distanceM * tanTheta + observerEyeM).toFixed(2))
      : verticalDeltaM;
  const lineOfSightM = Number(
    Math.sqrt(distanceM * distanceM + (distanceM * tanTheta) ** 2).toFixed(2),
  );

  const tanExactLabel = getExactTanLabel(angleDeg);

  let exactSurdFormula: string | null = null;
  if (angleDeg === 30) {
    const simplified =
      distanceM % 3 === 0 ? `${distanceM / 3}\\sqrt{3}` : `\\frac{${distanceM}}{\\sqrt{3}}`;
    exactSurdFormula =
      mode === 'elevation' && observerEyeM > 0
        ? `${simplified} + ${observerEyeM}\\text{ m}`
        : `${simplified}\\text{ m}`;
  } else if (angleDeg === 45) {
    exactSurdFormula =
      mode === 'elevation' && observerEyeM > 0
        ? `${distanceM} + ${observerEyeM} = ${distanceM + observerEyeM}\\text{ m}`
        : `${distanceM}\\text{ m}`;
  } else if (angleDeg === 60) {
    exactSurdFormula =
      mode === 'elevation' && observerEyeM > 0
        ? `${distanceM}\\sqrt{3} + ${observerEyeM}\\text{ m}`
        : `${distanceM}\\sqrt{3}\\text{ m}`;
  }

  const warning =
    angleDeg >= 80
      ? 'Steep angle (≥ 80°): small measurement errors in θ cause large swings in computed height.'
      : undefined;

  const tanTerm = tanExactLabel ? `\\tan(${angleDeg}^\\circ) = ${tanExactLabel}` : `\\tan(${angleDeg}^\\circ) \\approx ${tanTheta.toFixed(4)}`;

  const latexDerivation =
    mode === 'elevation'
      ? `H = d \\cdot \\tan(\\theta) + h_0 = ${distanceM} \\cdot (${tanTerm.split('=').pop()?.trim()}) + ${observerEyeM} = ${totalHeightM}\\text{ m}`
      : `\\text{By alternate interior angles, } \\theta_{\\text{dep}} = \\theta_{\\text{elev}} = ${angleDeg}^\\circ \\implies H_{\\text{cliff}} = d \\cdot \\tan(${angleDeg}^\\circ) = ${totalHeightM}\\text{ m}`;

  return {
    valid: true,
    warning,
    mode,
    distanceM,
    angleDeg,
    observerEyeM,
    tanTheta: Number(tanTheta.toFixed(6)),
    tanExactLabel,
    verticalDeltaM,
    totalHeightM,
    lineOfSightM,
    exactSurdFormula,
    latexDerivation,
  };
}

/**
 * Given a cliff/lighthouse height H and angle of depression theta, compute horizontal distance d = H / tan(theta).
 */
export function solveDistanceFromDepression(heightM: number, angleDeg: number): {
  valid: boolean;
  distanceM: number;
  error?: string;
} {
  if (heightM <= 0 || angleDeg <= 0 || angleDeg >= 90) {
    return {
      valid: false,
      distanceM: NaN,
      error: 'Height must be > 0 m and angle of depression must be strictly between 0° and 90°.',
    };
  }
  const rad = (angleDeg * Math.PI) / 180;
  const tanTheta =
    angleDeg === 30 ? 1 / SQRT3 : angleDeg === 45 ? 1 : angleDeg === 60 ? SQRT3 : Math.tan(rad);
  return {
    valid: true,
    distanceM: Number((heightM / tanTheta).toFixed(2)),
  };
}
