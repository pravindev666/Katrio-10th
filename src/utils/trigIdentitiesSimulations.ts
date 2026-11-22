/**
 * Canonical, unit-tested Trigonometric Ratios, Complementary Angles &
 * Pythagorean Identities engine for Mathematics Chapter 6 (Sections 6.1–6.2, pp. 239–249).
 */

export interface TrigEvaluation {
  valid: boolean;
  angleDeg: number;
  complementDeg: number;
  sin: number;
  cos: number;
  tan: number;
  cosec: number;
  sec: number;
  cot: number;
  identities: {
    id: 'pythagorean_1' | 'pythagorean_2' | 'pythagorean_3';
    labelLatex: string;
    lhs: number;
    rhs: number;
    holds: boolean;
  }[];
  complementaryCheck: {
    sinTheta: number;
    cosComplement: number;
    tanTheta: number;
    cotComplement: number;
    matches: boolean;
  };
}

export function evaluateTrigIdentities(angleDeg: number): TrigEvaluation {
  if (!Number.isFinite(angleDeg) || angleDeg <= 0 || angleDeg >= 90) {
    return {
      valid: false,
      angleDeg,
      complementDeg: 90 - angleDeg,
      sin: NaN,
      cos: NaN,
      tan: NaN,
      cosec: NaN,
      sec: NaN,
      cot: NaN,
      identities: [],
      complementaryCheck: {
        sinTheta: NaN,
        cosComplement: NaN,
        tanTheta: NaN,
        cotComplement: NaN,
        matches: false,
      },
    };
  }

  const rad = (angleDeg * Math.PI) / 180;
  const compRad = ((90 - angleDeg) * Math.PI) / 180;

  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const tan = sin / cos;
  const cosec = 1 / sin;
  const sec = 1 / cos;
  const cot = cos / sin;

  const id1Lhs = sin * sin + cos * cos;
  const id2Lhs = 1 + tan * tan;
  const id2Rhs = sec * sec;
  const id3Lhs = 1 + cot * cot;
  const id3Rhs = cosec * cosec;

  const cosComp = Math.cos(compRad);
  const cotComp = Math.cos(compRad) / Math.sin(compRad);

  const r4 = (v: number) => Number(v.toFixed(4));

  return {
    valid: true,
    angleDeg,
    complementDeg: 90 - angleDeg,
    sin: r4(sin),
    cos: r4(cos),
    tan: r4(tan),
    cosec: r4(cosec),
    sec: r4(sec),
    cot: r4(cot),
    identities: [
      {
        id: 'pythagorean_1',
        labelLatex: '\\sin^2\\theta + \\cos^2\\theta = 1',
        lhs: r4(id1Lhs),
        rhs: 1,
        holds: Math.abs(id1Lhs - 1) < 1e-9,
      },
      {
        id: 'pythagorean_2',
        labelLatex: '1 + \\tan^2\\theta = \\sec^2\\theta',
        lhs: r4(id2Lhs),
        rhs: r4(id2Rhs),
        holds: Math.abs(id2Lhs - id2Rhs) < 1e-9,
      },
      {
        id: 'pythagorean_3',
        labelLatex: '1 + \\cot^2\\theta = \\csc^2\\theta',
        lhs: r4(id3Lhs),
        rhs: r4(id3Rhs),
        holds: Math.abs(id3Lhs - id3Rhs) < 1e-9,
      },
    ],
    complementaryCheck: {
      sinTheta: r4(sin),
      cosComplement: r4(cosComp),
      tanTheta: r4(tan),
      cotComplement: r4(cotComp),
      matches: Math.abs(sin - cosComp) < 1e-9 && Math.abs(tan - cotComp) < 1e-9,
    },
  };
}
