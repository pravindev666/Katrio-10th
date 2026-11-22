/**
 * Pure, unit-tested Class 10 Physics & STEM simulation math functions
 * aligned with TN SCERT Class 10 Science (Units 1–6) & Maths formulas.
 */

export interface EchoSimulationResult {
  roundTripDistanceM: number;
  echoTimeSec: number;
  minEchoDistanceM: number;
  isDistinctEcho: boolean;
}

/**
 * Class 10 Science Unit 5 (Acoustics, p. 64):
 * Minimum persistence of hearing = 0.1 s.
 * 2d = v * t => d_min = (v * 0.1) / 2 (17.2 m in air at 344 m/s).
 */
export function computeEchoSimulation(
  wallDistanceM: number,
  speedOfSoundMs = 344,
): EchoSimulationResult {
  const roundTripDistanceM = Number((2 * wallDistanceM).toFixed(2));
  const echoTimeSec = Number((roundTripDistanceM / speedOfSoundMs).toFixed(3));
  const minEchoDistanceM = Number(((speedOfSoundMs * 0.1) / 2).toFixed(1));
  return {
    roundTripDistanceM,
    echoTimeSec,
    minEchoDistanceM,
    isDistinctEcho: echoTimeSec >= 0.1,
  };
}

/**
 * Doppler Effect (Class 10 Science Unit 5, p. 66):
 * Source moving toward (+1) or away (-1) from stationary listener:
 * n' = n * (v / (v -/+ v_s))
 */
export function computeDopplerFrequency(
  sourceFreqHz: number,
  sourceSpeedMs: number,
  approaching: boolean,
  soundSpeedMs = 344,
): number {
  const denom = approaching
    ? Math.max(10, soundSpeedMs - sourceSpeedMs)
    : soundSpeedMs + sourceSpeedMs;
  return Number((sourceFreqHz * (soundSpeedMs / denom)).toFixed(1));
}

export interface LensSimulationResult {
  imageDistanceCm: number | null; // null when object is at F (image at infinity)
  magnification: number | null;
  nature: string;
  sizeRelation: string;
}

/**
 * Cartesian Sign Convention Thin Lens Formula (Class 10 Science Unit 2, Optics):
 * 1/f = 1/v - 1/u  =>  1/v = 1/f + 1/u   (with object distance u < 0)
 */
export function computeThinLensImage(
  lensType: 'convex' | 'concave',
  focalLengthMagCm: number,
  objectDistanceMagCm: number,
): LensSimulationResult {
  const f = lensType === 'convex' ? focalLengthMagCm : -focalLengthMagCm;
  const u = -Math.abs(objectDistanceMagCm);
  const invV = 1 / f + 1 / u;

  if (Math.abs(invV) < 1e-6) {
    return {
      imageDistanceCm: null,
      magnification: null,
      nature: 'Parallel rays — Image formed at Infinity',
      sizeRelation: 'Infinitely magnified',
    };
  }

  const v = Number((1 / invV).toFixed(1));
  const m = Number((v / u).toFixed(2));
  const absM = Math.abs(m);
  const isReal = v > 0;
  const orientation = m < 0 ? 'Inverted' : 'Erect';
  const sizeRelation =
    absM > 1.05 ? 'Magnified' : absM < 0.95 ? 'Diminished' : 'Same Size';

  return {
    imageDistanceCm: v,
    magnification: m,
    nature: `${isReal ? 'Real' : 'Virtual'} & ${orientation}`,
    sizeRelation,
  };
}

export interface CircuitSimulationResult {
  equivalentResistanceOhm: number;
  totalCurrentAmp: number;
  totalPowerWatt: number;
  bulbBrightnessPct: number;
}

/**
 * Class 10 Science Unit 4 (Electricity — Ohm's Law & Resistor Combinations):
 */
export function computeCircuitSimulation(
  voltageV: number,
  r1Ohm: number,
  r2Ohm: number,
  topology: 'series' | 'parallel',
): CircuitSimulationResult {
  const eqR =
    topology === 'series'
      ? r1Ohm + r2Ohm
      : (r1Ohm * r2Ohm) / Math.max(0.01, r1Ohm + r2Ohm);
  const current = voltageV / Math.max(0.01, eqR);
  const power = voltageV * current;
  return {
    equivalentResistanceOhm: Number(eqR.toFixed(2)),
    totalCurrentAmp: Number(current.toFixed(2)),
    totalPowerWatt: Number(power.toFixed(2)),
    bulbBrightnessPct: Math.min(100, Math.round((power / 72) * 100)),
  };
}
