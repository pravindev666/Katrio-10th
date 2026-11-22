/**
 * Canonical, unit-tested 3D Mensuration computation module for
 * Mathematics Chapter 7 — Mensuration (TN Class 10, pp. 269–293).
 * Uses π = 22/7 by default per TN State Board Class 10 textbook convention (p. 271 Note).
 */

export type SolidKind =
  | 'cylinder'
  | 'hollow_cylinder'
  | 'cone'
  | 'sphere'
  | 'hemisphere'
  | 'frustum'
  | 'combined_capsule';

export interface SolidParams {
  kind: SolidKind;
  radius: number; // r (or inner radius for hollow_cylinder / top radius for frustum), cm
  outerRadius?: number; // R (outer radius for hollow_cylinder / bottom radius for frustum), cm
  height?: number; // h (cm)
  useExact22Over7?: boolean; // default true per TN Class 10 Maths p. 271
}

export interface SolidMeasurementResult {
  valid: boolean;
  error?: string;
  kind: SolidKind;
  label: string;
  textbookSection: string;
  slantHeight?: number; // l for cone / frustum
  csa: number; // cm²
  tsa: number; // cm²
  volume: number; // cm³
  csaFormulaLatex: string;
  tsaFormulaLatex: string;
  volumeFormulaLatex: string;
  netDescription: string;
}

const PI_22_7 = 22 / 7;

function round2(n: number): number {
  return Number(n.toFixed(2));
}

export function computeSolidMeasurements(params: SolidParams): SolidMeasurementResult {
  const pi = params.useExact22Over7 === false ? Math.PI : PI_22_7;
  const r = params.radius;
  const R = params.outerRadius ?? r + 3;
  const h = params.height ?? 10;

  const invalid = (error: string, label: string, textbookSection: string): SolidMeasurementResult => ({
    valid: false,
    error,
    kind: params.kind,
    label,
    textbookSection,
    csa: NaN,
    tsa: NaN,
    volume: NaN,
    csaFormulaLatex: '',
    tsaFormulaLatex: '',
    volumeFormulaLatex: '',
    netDescription: '',
  });

  if (!Number.isFinite(r) || r <= 0) {
    return invalid('Radius r must be strictly greater than 0 cm.', params.kind, '7.2');
  }

  switch (params.kind) {
    case 'cylinder': {
      if (!Number.isFinite(h) || h <= 0) {
        return invalid('Height h must be > 0 cm for a right circular cylinder.', 'Right Circular Cylinder', '7.2.1 / 7.3.1');
      }
      const csa = 2 * pi * r * h;
      const tsa = 2 * pi * r * (h + r);
      const volume = pi * r * r * h;
      return {
        valid: true,
        kind: 'cylinder',
        label: 'Right Circular Cylinder',
        textbookSection: '7.2.1 & 7.3.1 (pp. 270–271, 282)',
        csa: round2(csa),
        tsa: round2(tsa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{CSA} = 2\\pi r h',
        tsaFormulaLatex: '\\text{TSA} = 2\\pi r (h + r)',
        volumeFormulaLatex: 'V = \\pi r^2 h',
        netDescription: `Unfolds into 1 rectangle of width 2πr (${round2(2 * pi * r)} cm) × height h (${h} cm) plus 2 circular bases of radius ${r} cm.`,
      };
    }

    case 'hollow_cylinder': {
      if (!Number.isFinite(h) || h <= 0) {
        return invalid('Height h must be > 0 cm.', 'Hollow Cylinder', '7.2.2 / 7.3.2');
      }
      if (!Number.isFinite(R) || R <= r) {
        return invalid('Outer radius R must be strictly greater than inner radius r (R > r).', 'Hollow Cylinder', '7.2.2 / 7.3.2');
      }
      const csa = 2 * pi * (R + r) * h;
      const tsa = 2 * pi * (R + r) * (R - r + h);
      const volume = pi * (R * R - r * r) * h;
      return {
        valid: true,
        kind: 'hollow_cylinder',
        label: 'Hollow Cylinder',
        textbookSection: '7.2.2 & 7.3.2 (pp. 272, 283)',
        csa: round2(csa),
        tsa: round2(tsa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{CSA} = 2\\pi (R + r) h',
        tsaFormulaLatex: '\\text{TSA} = 2\\pi (R + r)(R - r + h)',
        volumeFormulaLatex: 'V = \\pi (R^2 - r^2) h',
        netDescription: `Consists of an outer curved rectangle (2πRh), inner curved rectangle (2πrh), and two annular rings of area π(R² − r²) each.`,
      };
    }

    case 'cone': {
      if (!Number.isFinite(h) || h <= 0) {
        return invalid('Height h must be > 0 cm for a right circular cone.', 'Right Circular Cone', '7.2.3 / 7.3.3');
      }
      const l = Math.sqrt(r * r + h * h);
      const csa = pi * r * l;
      const tsa = pi * r * (l + r);
      const volume = (1 / 3) * pi * r * r * h;
      return {
        valid: true,
        kind: 'cone',
        label: 'Right Circular Cone',
        textbookSection: '7.2.3 & 7.3.3 (pp. 273–275, 285)',
        slantHeight: round2(l),
        csa: round2(csa),
        tsa: round2(tsa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{CSA} = \\pi r l,\\;\\; l = \\sqrt{r^2 + h^2}',
        tsaFormulaLatex: '\\text{TSA} = \\pi r (l + r)',
        volumeFormulaLatex: 'V = \\frac{1}{3}\\pi r^2 h',
        netDescription: `Unfolds into a circular sector of radius l = ${round2(l)} cm (arc length 2πr) plus 1 circular base of radius ${r} cm.`,
      };
    }

    case 'sphere': {
      const csa = 4 * pi * r * r;
      const volume = (4 / 3) * pi * r * r * r;
      return {
        valid: true,
        kind: 'sphere',
        label: 'Solid Sphere',
        textbookSection: '7.2.4 & 7.3.4 (pp. 276, 286)',
        csa: round2(csa),
        tsa: round2(csa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{CSA} = 4\\pi r^2',
        tsaFormulaLatex: '\\text{TSA} = 4\\pi r^2',
        volumeFormulaLatex: 'V = \\frac{4}{3}\\pi r^3',
        netDescription: `A sphere has no flat faces — its curved surface equals 4 times the area of a great circle (πr²).`,
      };
    }

    case 'hemisphere': {
      const csa = 2 * pi * r * r;
      const tsa = 3 * pi * r * r;
      const volume = (2 / 3) * pi * r * r * r;
      return {
        valid: true,
        kind: 'hemisphere',
        label: 'Solid Hemisphere',
        textbookSection: '7.2.5 & 7.3.6 (pp. 277, 287)',
        csa: round2(csa),
        tsa: round2(tsa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{CSA} = 2\\pi r^2',
        tsaFormulaLatex: '\\text{TSA} = 3\\pi r^2',
        volumeFormulaLatex: 'V = \\frac{2}{3}\\pi r^3',
        netDescription: `Half a sphere's curved dome (2πr²) plus the newly exposed flat circular base (πr²) = 3πr² total surface area.`,
      };
    }

    case 'frustum': {
      if (!Number.isFinite(h) || h <= 0) {
        return invalid('Height h must be > 0 cm for a frustum.', 'Frustum of a Cone', '7.2.7 / 7.3.8');
      }
      if (!Number.isFinite(R) || R <= r) {
        return invalid('Bottom radius R must be strictly greater than top radius r (R > r).', 'Frustum of a Cone', '7.2.7 / 7.3.8');
      }
      const l = Math.sqrt(h * h + (R - r) * (R - r));
      const csa = pi * (R + r) * l;
      const tsa = csa + pi * R * R + pi * r * r;
      const volume = (1 / 3) * pi * h * (R * R + R * r + r * r);
      return {
        valid: true,
        kind: 'frustum',
        label: 'Frustum of a Right Circular Cone',
        textbookSection: '7.2.7 & 7.3.8 (pp. 280–281, 289)',
        slantHeight: round2(l),
        csa: round2(csa),
        tsa: round2(tsa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{CSA} = \\pi(R + r)l,\\;\\; l = \\sqrt{h^2 + (R - r)^2}',
        tsaFormulaLatex: '\\text{TSA} = \\pi(R + r)l + \\pi R^2 + \\pi r^2',
        volumeFormulaLatex: 'V = \\frac{1}{3}\\pi h(R^2 + Rr + r^2)',
        netDescription: `Formed by slicing a cone parallel to its base: 1 curved band of slant height l = ${round2(l)} cm plus top circle (πr²) and bottom circle (πR²).`,
      };
    }

    case 'combined_capsule': {
      // Medicine capsule: cylinder (radius r, height h) capped with two hemispheres (radius r)
      if (!Number.isFinite(h) || h <= 0) {
        return invalid('Cylindrical middle length h must be > 0 cm.', 'Combined Solid (Cylinder + 2 Hemispheres)', '7.4');
      }
      const cylCsa = 2 * pi * r * h;
      const twoHemiCsa = 4 * pi * r * r;
      const tsa = cylCsa + twoHemiCsa; // Joined internal circular faces are NOT exposed!
      const volume = pi * r * r * h + (4 / 3) * pi * r * r * r;
      return {
        valid: true,
        kind: 'combined_capsule',
        label: 'Combined Solid (Cylinder + Two Hemispheres)',
        textbookSection: '7.4 Combined Solids (pp. 290–292)',
        csa: round2(tsa),
        tsa: round2(tsa),
        volume: round2(volume),
        csaFormulaLatex: '\\text{TSA} = \\text{CSA}_{\\text{cyl}} + 2 \\times \\text{CSA}_{\\text{hemi}} = 2\\pi r h + 4\\pi r^2',
        tsaFormulaLatex: '\\text{TSA} = 2\\pi r (h + 2r)',
        volumeFormulaLatex: 'V = \\pi r^2 h + \\frac{4}{3}\\pi r^3',
        netDescription: `Key Section 7.4 rule: volumes add directly (V_cyl + V_sphere), but joined circular faces sit INSIDE the solid and are excluded from exposed TSA!`,
      };
    }
  }
}
