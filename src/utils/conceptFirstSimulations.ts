/**
 * Deterministic, unit-tested mathematical & scientific simulation kernels for Katrio's
 * Concept-First Interactive Learning Rebuild (TN Class 10 2024 Science & 2025 Maths PDFs).
 */

export interface ElectricPotentialResult {
  valid: boolean;
  potentialV: number;
  workJ: number;
  chargeC: number;
  error?: string;
}

/** Science 4.3.1 / 4.3.2 (p. 44): V = W / Q (1 volt = 1 joule / 1 coulomb) */
export function computeElectricPotential(workJ: number, chargeC: number): ElectricPotentialResult {
  if (!Number.isFinite(workJ) || !Number.isFinite(chargeC) || chargeC <= 0) {
    return {
      valid: false,
      potentialV: 0,
      workJ,
      chargeC,
      error: 'Test charge Q must be a positive non-zero value (Q > 0 C).',
    };
  }
  const potentialV = Number((workJ / chargeC).toFixed(3));
  return { valid: true, potentialV, workJ, chargeC };
}

export function computePotentialDifference(vA: number, vB: number): {
  deltaV: number;
  directionText: string;
} {
  const deltaV = Number(Math.abs(vA - vB).toFixed(3));
  if (Math.abs(vA - vB) < 1e-6) {
    return { deltaV: 0, directionText: 'No potential difference (VA = VB): zero net positive charge flow.' };
  }
  return {
    deltaV,
    directionText:
      vA > vB
        ? 'Positive charge flows spontaneously from A (higher potential) → B (lower potential).'
        : 'Positive charge flows spontaneously from B (higher potential) → A (lower potential).',
  };
}

export interface JoulesHeatingResult {
  valid: boolean;
  heatJ: number;
  heatKJ: number;
  powerW: number;
  deltaTC: number;
  doubleCurrentHeatJ: number;
  doubleCurrentMultiplier: number;
  error?: string;
}

/**
 * Science 4.8.1 (pp. 50–51, Eq. 4.20): H = I² R t.
 * Simplified adiabatic temperature rise ΔT = H / (m c) with explicit fixed mass & specific heat assumption.
 */
export function computeJoulesHeating(
  currentA: number,
  resistanceOhm: number,
  timeSec: number,
  massKg = 0.25,
  specificHeatJPerKgK = 450,
): JoulesHeatingResult {
  if (currentA < 0 || resistanceOhm <= 0 || timeSec < 0) {
    return {
      valid: false,
      heatJ: 0,
      heatKJ: 0,
      powerW: 0,
      deltaTC: 0,
      doubleCurrentHeatJ: 0,
      doubleCurrentMultiplier: 4,
      error: 'Current I ≥ 0 A, Resistance R > 0 Ω, and Time t ≥ 0 s are required.',
    };
  }
  const heatJ = Number((currentA * currentA * resistanceOhm * timeSec).toFixed(2));
  const powerW = Number((currentA * currentA * resistanceOhm).toFixed(2));
  const doubleCurrentHeatJ = Number(((2 * currentA) * (2 * currentA) * resistanceOhm * timeSec).toFixed(2));
  const deltaTC = Number((heatJ / Math.max(1e-6, massKg * specificHeatJPerKgK)).toFixed(2));
  return {
    valid: true,
    heatJ,
    heatKJ: Number((heatJ / 1000).toFixed(3)),
    powerW,
    deltaTC,
    doubleCurrentHeatJ,
    doubleCurrentMultiplier: heatJ > 0 ? Number((doubleCurrentHeatJ / heatJ).toFixed(2)) : 4,
  };
}

export type SolubilityClassification =
  | 'unsaturated'
  | 'saturated'
  | 'saturated_with_excess'
  | 'supersaturated_metastable';

export interface SolubilityModelResult {
  classification: SolubilityClassification;
  solubilityLimitG: number;
  dissolvedG: number;
  undissolvedExcessG: number;
  headline: string;
  explanation: string;
}

/**
 * Science Unit 9 (pp. 126–128): Scientifically accurate solubility state machine for KNO3-like solid solute
 * in 100 g water (solubility rises strongly with temperature: 25 °C -> 36 g, 60 °C -> 78 g, 80 °C -> 102 g).
 * CRITICAL SCIENTIFIC GUARANTEE: Adding excess solute at constant temperature NEVER produces a
 * supersaturated solution — it creates a SATURATED solution with undissolved excess solid at the bottom!
 * Genuine supersaturation requires dissolving at a higher temperature and cooling calmly without disturbance.
 */
export function evaluateSolubilityState(
  totalAddedG: number,
  tempC: number,
  maxDissolvedAchievedG: number,
  disturbedOrSeeded: boolean,
): SolubilityModelResult {
  // Linear conceptual solubility curve calibrated at 36 g / 100 g water at 25 °C (TN Science p. 126–128)
  const solubilityLimitG = Math.round(36 + (tempC - 25) * 1.2);
  const clampedLimit = Math.max(18, solubilityLimitG);

  // Genuine metastable supersaturation ONLY if totalAddedG was previously dissolved at a higher T,
  // now exceeds current solubilityLimitG after cooling, and has NOT been disturbed/seeded.
  const canBeSupersaturated =
    !disturbedOrSeeded &&
    maxDissolvedAchievedG >= totalAddedG &&
    totalAddedG > clampedLimit;

  if (canBeSupersaturated) {
    return {
      classification: 'supersaturated_metastable',
      solubilityLimitG: clampedLimit,
      dissolvedG: totalAddedG,
      undissolvedExcessG: 0,
      headline: 'Supersaturated Solution (Metastable — Temporarily Holds Extra Dissolved Solute)',
      explanation: `Because ${totalAddedG} g was dissolved at a higher temperature and cooled gently without disturbance, the solution temporarily holds ${totalAddedG - clampedLimit} g more dissolved solute than the ${clampedLimit} g limit at ${tempC} °C. Dropping a seed crystal or stirring will immediately precipitate the excess!`,
    };
  }

  if (totalAddedG < clampedLimit) {
    return {
      classification: 'unsaturated',
      solubilityLimitG: clampedLimit,
      dissolvedG: totalAddedG,
      undissolvedExcessG: 0,
      headline: 'Unsaturated Solution (More Solute Can Still Dissolve)',
      explanation: `At ${tempC} °C, 100 g of water can dissolve up to ${clampedLimit} g. Only ${totalAddedG} g is present, so ${clampedLimit - totalAddedG} g more can dissolve.`,
    };
  }

  if (totalAddedG === clampedLimit) {
    return {
      classification: 'saturated',
      solubilityLimitG: clampedLimit,
      dissolvedG: clampedLimit,
      undissolvedExcessG: 0,
      headline: 'Saturated Solution (Exact Solubility Limit Reached)',
      explanation: `At ${tempC} °C, exactly ${clampedLimit} g of solute is dissolved in 100 g of water. No additional solute will dissolve at this temperature.`,
    };
  }

  const excess = totalAddedG - clampedLimit;
  return {
    classification: 'saturated_with_excess',
    solubilityLimitG: clampedLimit,
    dissolvedG: clampedLimit,
    undissolvedExcessG: excess,
    headline: 'Saturated Solution + Undissolved Excess Solid (NOT Supersaturated!)',
    explanation: `Only ${clampedLimit} g is dissolved in the liquid at ${tempC} °C; the remaining ${excess} g sits undissolved at the bottom. Simply adding excess solid at constant temperature creates a saturated solution with undissolved excess — NOT a supersaturated solution (TN Science p. 126–127).`,
  };
}

/** Maths 4.3 Thales / Basic Proportionality Theorem (p. 172): DE || BC => AD/DB = AE/EC */
export function computeThalesBPT(sideAB: number, sideAC: number, splitT: number) {
  const t = Math.max(0.15, Math.min(0.85, splitT));
  const AD = Number((sideAB * t).toFixed(2));
  const DB = Number((sideAB * (1 - t)).toFixed(2));
  const AE = Number((sideAC * t).toFixed(2));
  const EC = Number((sideAC * (1 - t)).toFixed(2));
  const ratioLeft = Number((AD / DB).toFixed(3));
  const ratioRight = Number((AE / EC).toFixed(3));
  return { AD, DB, AE, EC, ratioLeft, ratioRight, diff: Math.abs(ratioLeft - ratioRight) };
}

/** Maths 4.3 Angle Bisector Theorem (p. 174–175): Ray AD bisects ∠BAC => BD/DC = AB/AC */
export function computeAngleBisectorTheorem(sideAB: number, sideAC: number, baseBC: number) {
  const sum = sideAB + sideAC;
  const BD = Number(((baseBC * sideAB) / sum).toFixed(2));
  const DC = Number(((baseBC * sideAC) / sum).toFixed(2));
  const ratioSides = Number((sideAB / sideAC).toFixed(3));
  const ratioSegments = Number((BD / DC).toFixed(3));
  return { BD, DC, ratioSides, ratioSegments, diff: Math.abs(ratioSides - ratioSegments) };
}

/** Maths 4.4 Pythagoras Theorem (p. 184–185): a² + b² = c² */
export function computePythagoras(legA: number, legB: number) {
  const areaA = Number((legA * legA).toFixed(2));
  const areaB = Number((legB * legB).toFixed(2));
  const areaC = Number((areaA + areaB).toFixed(2));
  const hypotenuse = Number(Math.sqrt(areaC).toFixed(3));
  return { legA, legB, hypotenuse, areaA, areaB, areaC };
}

/** Maths 4.5 Circles & Tangents (p. 189–191, Example 4.24): OP ⟂ PT => PT = sqrt(OT² - r²) */
export function computeCircleTangent(radiusR: number, distanceOT: number) {
  if (radiusR <= 0 || distanceOT <= radiusR) {
    return {
      valid: false,
      tangentLengthPT: 0,
      error: 'External point T must lie outside the circle (OT > radius r) for a tangent to exist.',
    };
  }
  const tangentLengthPT = Number(Math.sqrt(distanceOT * distanceOT - radiusR * radiusR).toFixed(3));
  return { valid: true, tangentLengthPT };
}

/** Maths 4.6 Concurrency — Ceva's Theorem (p. 196–197, Example 4.33): (BD/DC)*(CE/EA)*(AF/FB) = 1 */
export function computeCevaProduct(bd: number, dc: number, ce: number, ea: number, af: number, fb: number) {
  const product = Number(((bd / dc) * (ce / ea) * (af / fb)).toFixed(4));
  return { product, isConcurrent: Math.abs(product - 1) < 0.015 };
}

/** Maths 4.2 Similarity (p. 162–165): ΔABC ~ ΔPQR with scale factor k */
export function computeSimilarityTriangle(ab: number, bc: number, ca: number, scaleK: number) {
  const pq = Number((ab * scaleK).toFixed(2));
  const qr = Number((bc * scaleK).toFixed(2));
  const rp = Number((ca * scaleK).toFixed(2));
  return {
    pq,
    qr,
    rp,
    sideRatio: Number(scaleK.toFixed(2)),
    areaRatio: Number((scaleK * scaleK).toFixed(2)),
  };
}
