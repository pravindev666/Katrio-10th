import React, { useMemo, useState } from 'react';
import { BarChart3, Grid3X3, Sigma } from 'lucide-react';

export type MathsExtVariant = 'algebra_gcd_rational' | 'matrices_ops' | 'statistics_dispersion';

interface MathsExtensions2DProps {
  variant: MathsExtVariant;
  onExplore: () => void;
}

/**
 * Pure deterministic Mathematics helpers (unit-tested in conceptFirstRebuild.test.ts)
 */
export function computeMatrixOps2x2(a: number[][], b: number[][]) {
  const sum = [
    [a[0][0] + b[0][0], a[0][1] + b[0][1]],
    [a[1][0] + b[1][0], a[1][1] + b[1][1]],
  ];
  const transposeA = [
    [a[0][0], a[1][0]],
    [a[0][1], a[1][1]],
  ];
  const productAB = [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
  ];
  return { sum, transposeA, productAB };
}

export function computeDispersionMetrics(values: number[]) {
  const n = values.length;
  if (n === 0) {
    return { n: 0, min: 0, max: 0, range: 0, coeffOfRange: 0, mean: 0, variance: 0, stdDev: 0, cvPct: 0 };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Number((max - min).toFixed(2));
  const coeffOfRange = max + min !== 0 ? Number(((max - min) / (max + min)).toFixed(4)) : 0;
  const mean = Number((values.reduce((acc, v) => acc + v, 0) / n).toFixed(2));
  const sqDevSum = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const variance = Number((sqDevSum / n).toFixed(2));
  const stdDev = Number(Math.sqrt(sqDevSum / n).toFixed(2));
  const cvPct = mean !== 0 ? Number(((stdDev / mean) * 100).toFixed(2)) : 0;
  return { n, min, max, range, coeffOfRange, mean, variance, stdDev, cvPct };
}

/**
 * Eliminates Mathematics Chapter 3 (Matrices, GCD/LCM, Rational Expressions) and
 * Chapter 8 (Measures of Dispersion, Variance, Standard Deviation, CV) mismatches!
 * Grounded in TN Class 10 Mathematics (2025 Edition pp. 90–145 & pp. 302–316).
 */
export function MathsExtensions2D({ variant, onExplore }: MathsExtensions2DProps) {
  // Matrices (3.9)
  const [matOp, setMatOp] = useState<'add' | 'transpose' | 'multiply'>('multiply');
  const [a00, setA00] = useState(2);
  const [a01, setA01] = useState(1);
  const [a10, setA10] = useState(0);
  const [a11, setA11] = useState(3);
  const [b00, setB00] = useState(1);
  const [b01, setB01] = useState(4);
  const [b10, setB10] = useState(2);
  const [b11, setB11] = useState(5);

  // Algebra GCD / Excluded Values (3.2–3.5)
  const [rootR, setRootR] = useState(3);
  const [rootS, setRootS] = useState(-2);
  const [testX, setTestX] = useState(3);

  // Statistics Dispersion (8.2–8.3)
  const [preset, setPreset] = useState<'tv_ex84' | 'rain_ex85' | 'tight'>('tv_ex84');
  const [outlierShift, setOutlierShift] = useState(0);

  const matRes = useMemo(
    () =>
      computeMatrixOps2x2(
        [
          [a00, a01],
          [a10, a11],
        ],
        [
          [b00, b01],
          [b10, b11],
        ],
      ),
    [a00, a01, a10, a11, b00, b01, b10, b11],
  );

  const statsData = useMemo(() => {
    const base =
      preset === 'tv_ex84'
        ? [13, 8, 4, 9, 7, 12, 10] // TN Maths Example 8.4 (p. 306): mean=9, σ≈2.83!
        : preset === 'rain_ex85'
          ? [11.4, 12.5, 12.8, 16.3, 17.8, 19.2] // TN Maths Example 8.5 (p. 306): mean=15!
          : [9, 9, 8, 10, 9, 9, 9];
    return base.map((v, i) => (i === 0 ? Number((v + outlierShift).toFixed(1)) : v));
  }, [preset, outlierShift]);

  const disp = useMemo(() => computeDispersionMetrics(statsData), [statsData]);

  // 1. MATRICES (3.9, 3.9.1, 3.9.2, 3.9.3 — NEVER shows a 3D Parabola!)
  if (variant === 'matrices_ops') {
    const result = matOp === 'add' ? matRes.sum : matOp === 'transpose' ? matRes.transposeA : matRes.productAB;
    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {([
            ['multiply', 'Matrix Multiplication (A × B)'],
            ['add', 'Matrix Addition (A + B)'],
            ['transpose', 'Transpose (Aᵀ · Rows ↔ Columns)'],
          ] as const).map(([k, lbl]) => (
            <button key={k} type="button" onClick={() => { setMatOp(k); onExplore(); }} className={`px-3.5 py-2 rounded-xl border font-bold ${matOp === k ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              {lbl}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-4">
            <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
              <Grid3X3 className="w-4 h-4" />
              <span>Interactive 2 × 2 Matrix Workbench (Order m × n · pp. 138–145)</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 font-mono-tabular">
              {/* Matrix A */}
              <div className="space-y-1 text-center">
                <div className="font-bold text-[var(--ink)]">Matrix A (2 × 2)</div>
                <div className="grid grid-cols-2 gap-1.5 p-2.5 rounded-xl border-x-4 border-[var(--math)] bg-[var(--surface-subtle)]">
                  {[
                    [a00, setA00, 'a₁₁'],
                    [a01, setA01, 'a₁₂'],
                    [a10, setA10, 'a₂₁'],
                    [a11, setA11, 'a₂₂'],
                  ].map(([val, setter, lbl]) => (
                    <label key={lbl as string} className="flex flex-col items-center">
                      <span className="text-[9px] text-[var(--text-muted)]">{lbl as string}</span>
                      <input
                        type="number"
                        min={-9}
                        max={9}
                        value={val as number}
                        onChange={(e) => { (setter as (n: number) => void)(Number(e.target.value)); onExplore(); }}
                        className="w-12 text-center font-extrabold py-1 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-xl font-black text-[var(--math)]">
                {matOp === 'add' ? '+' : matOp === 'multiply' ? '×' : '→ Aᵀ'}
              </div>

              {/* Matrix B */}
              {matOp !== 'transpose' && (
                <div className="space-y-1 text-center">
                  <div className="font-bold text-[var(--ink)]">Matrix B (2 × 2)</div>
                  <div className="grid grid-cols-2 gap-1.5 p-2.5 rounded-xl border-x-4 border-sky-600 bg-[var(--surface-subtle)]">
                    {[
                      [b00, setB00, 'b₁₁'],
                      [b01, setB01, 'b₁₂'],
                      [b10, setB10, 'b₂₁'],
                      [b11, setB11, 'b₂₂'],
                    ].map(([val, setter, lbl]) => (
                      <label key={lbl as string} className="flex flex-col items-center">
                        <span className="text-[9px] text-[var(--text-muted)]">{lbl as string}</span>
                        <input
                          type="number"
                          min={-9}
                          max={9}
                          value={val as number}
                          onChange={(e) => { (setter as (n: number) => void)(Number(e.target.value)); onExplore(); }}
                          className="w-12 text-center font-extrabold py-1 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xl font-black text-[var(--ink)]">=</div>

              {/* Result Matrix */}
              <div className="space-y-1 text-center">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">Result</div>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border-x-4 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                  <div className="px-2 py-1">{result[0][0]}</div>
                  <div className="px-2 py-1">{result[0][1]}</div>
                  <div className="px-2 py-1">{result[1][0]}</div>
                  <div className="px-2 py-1">{result[1][1]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
            <div className="font-extrabold text-[var(--ink)]">Step-by-Step Verification</div>
            {matOp === 'multiply' ? (
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular space-y-1 text-[11px]">
                <div>c₁₁ = (Row 1 · Col 1) = ({a00}×{b00}) + ({a01}×{b10}) = <strong>{result[0][0]}</strong></div>
                <div>c₁₂ = (Row 1 · Col 2) = ({a00}×{b01}) + ({a01}×{b11}) = <strong>{result[0][1]}</strong></div>
                <div>c₂₁ = (Row 2 · Col 1) = ({a10}×{b00}) + ({a11}×{b10}) = <strong>{result[1][0]}</strong></div>
                <div>c₂₂ = (Row 2 · Col 2) = ({a10}×{b01}) + ({a11}×{b11}) = <strong>{result[1][1]}</strong></div>
              </div>
            ) : matOp === 'transpose' ? (
              <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
                Interchanging rows and columns gives Aᵀ: entry a₁₂ ({a01}) swaps places with a₂₁ ({a10}), while diagonal entries ({a00}, {a11}) stay fixed. Note: (Aᵀ)ᵀ = A!
              </p>
            ) : (
              <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
                Matrices of the same order add element-by-element: cᵢⱼ = aᵢⱼ + bᵢⱼ.
              </p>
            )}
            <p className="text-[11px] text-[var(--text-muted)]">
              <strong>Remember:</strong> Matrix multiplication is NOT commutative in general (AB ≠ BA), and requires Columns(A) = Rows(B)!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. POLYNOMIAL GCD/LCM & RATIONAL EXPRESSION EXCLUDED VALUES (3.2–3.5)
  if (variant === 'algebra_gcd_rational') {
    const denomVal = (testX - rootR) * (testX - rootS);
    const isExcluded = denomVal === 0;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-7 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
            <Sigma className="w-4 h-4" />
            <span>Polynomial GCD/LCM &amp; Rational Excluded Values (pp. 94–108)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] font-mono-tabular text-sm text-center">
            R(x) = (x + 1) / [ (x − ({rootR})) · (x − ({rootS})) ]
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Test Input x = {testX} → Denominator Q({testX}) = {denomVal}
            <input type="range" min={-5} max={5} step={1} value={testX} onChange={(e) => { setTestX(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
          </label>
          <div className={`p-3 rounded-xl border font-extrabold ${isExcluded ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-emerald-50 border-emerald-400 text-emerald-800'}`}>
            {isExcluded
              ? `✗ EXCLUDED VALUE FOUND! At x = ${testX}, denominator Q(x) = 0, making R(x) UNDEFINED!`
              : `✓ Valid input: R(${testX}) = ${testX + 1} / ${denomVal} = ${Number(((testX + 1) / denomVal).toFixed(3))}`}
          </div>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-bold text-[var(--ink)]">Adjust Denominator Zeroes (Excluded Values):</div>
          <label className="block font-semibold">
            First Excluded Root r₁ = {rootR}
            <input type="range" min={-4} max={4} step={1} value={rootR} onChange={(e) => { setRootR(Number(e.target.value)); onExplore(); }} className="w-full accent-indigo-600 mt-1" />
          </label>
          <label className="block font-semibold">
            Second Excluded Root r₂ = {rootS}
            <input type="range" min={-4} max={4} step={1} value={rootS} onChange={(e) => { setRootS(Number(e.target.value)); onExplore(); }} className="w-full accent-indigo-600 mt-1" />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>Identity (3.3.3):</strong> For any two polynomials, f(x) × g(x) = GCD(f, g) × LCM(f, g). Reduce a rational expression to lowest form <em>before</em> finding excluded values!
          </div>
        </div>
      </div>
    );
  }

  // 3. STATISTICS: MEASURES OF DISPERSION, VARIANCE, STANDARD DEVIATION & CV (8.2–8.3 — NEVER shows a Rolling Die!)
  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap gap-2">
        {([
          ['tv_ex84', 'Textbook Example 8.4 (TVs Sold · p. 306)'],
          ['rain_ex85', 'Textbook Example 8.5 (Rainfall · p. 306)'],
          ['tight', 'Consistent Data (Low σ & Low CV)'],
        ] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => { setPreset(k); setOutlierShift(0); onExplore(); }} className={`px-3 py-2 rounded-xl border font-bold ${preset === k ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>Live Deviation &amp; Standard Deviation Visualizer (pp. 303–315)</span>
          </div>
          <svg viewBox="0 0 480 185" role="img" aria-label="Dot plot showing observations and deviations from the arithmetic mean" className="w-full h-auto">
            {/* Number line */}
            <line x1="35" y1="145" x2="450" y2="145" stroke="#475569" strokeWidth="2" />
            {(() => {
              const scaleMin = Math.min(0, disp.min - 2);
              const scaleMax = Math.max(22, disp.max + 2);
              const toX = (v: number) => 45 + ((v - scaleMin) / (scaleMax - scaleMin)) * 395;
              const meanX = toX(disp.mean);
              return (
                <g>
                  {/* Mean vertical line */}
                  <line x1={meanX} y1="24" x2={meanX} y2="155" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="5 4" />
                  <text x={meanX} y="18" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626">Mean x̄ = {disp.mean}</text>
                  {/* Standard deviation band */}
                  <rect
                    x={Math.max(35, toX(disp.mean - disp.stdDev))}
                    y="32"
                    width={Math.min(415, toX(disp.mean + disp.stdDev) - toX(disp.mean - disp.stdDev))}
                    height="112"
                    fill="#ede9fe"
                    opacity="0.55"
                  />
                  {/* Observations & deviation bars */}
                  {statsData.map((val, idx) => {
                    const cx = toX(val);
                    const cy = 48 + idx * 14;
                    return (
                      <g key={idx}>
                        <line x1={meanX} y1={cy} x2={cx} y2={cy} stroke="#7c3aed" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r="5" fill={idx === 0 && outlierShift !== 0 ? '#d97706' : '#4f46e5'} />
                        <text x={cx + (cx >= meanX ? 8 : -8)} y={cy + 3.5} textAnchor={cx >= meanX ? 'start' : 'end'} fontSize="9.5" fontWeight="700" fill="#1e293b">
                          {val}
                        </text>
                      </g>
                    );
                  })}
                  <text x="240" y="172" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#4c1d95">
                    Shaded purple zone shows x̄ ± σ ({Number((disp.mean - disp.stdDev).toFixed(1))} to {Number((disp.mean + disp.stdDev).toFixed(1))})
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <label className="block font-bold text-[var(--ink)]">
            Shift First Observation (See Spread &amp; σ Grow!): {outlierShift >= 0 ? `+${outlierShift}` : outlierShift}
            <input type="range" min={-6} max={12} step={1} value={outlierShift} onChange={(e) => { setOutlierShift(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
          </label>
          <div className="grid grid-cols-2 gap-2 font-mono-tabular">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <div className="text-[10px] text-[var(--text-muted)]">Range (L − S)</div>
              <div className="font-extrabold text-[var(--ink)]">{disp.range} (Coeff: {disp.coeffOfRange})</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <div className="text-[10px] text-[var(--text-muted)]">Variance (σ²)</div>
              <div className="font-extrabold text-[var(--ink)]">{disp.variance}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <div className="text-[10px] text-[var(--text-muted)]">Standard Deviation (σ)</div>
              <div className="font-extrabold text-[var(--math)] text-sm">{disp.stdDev}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <div className="text-[10px] text-[var(--text-muted)]">Coeff. of Variation (CV)</div>
              <div className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">{disp.cvPct}%</div>
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            <strong>Consistency Rule (8.3):</strong> Lower Coefficient of Variation (CV = (σ / x̄) × 100%) means more consistent / less variable performance!
          </p>
        </div>
      </div>
    </div>
  );
}
