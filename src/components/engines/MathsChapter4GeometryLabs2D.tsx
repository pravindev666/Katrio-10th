import React, { useState } from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import {
  computeAngleBisectorTheorem,
  computeCevaProduct,
  computeCircleTangent,
  computePythagoras,
  computeSimilarityTriangle,
  computeThalesBPT,
} from '../../utils/conceptFirstSimulations';

export type MathsCh4Variant =
  | 'similarity'
  | 'thales_and_bisector'
  | 'pythagoras'
  | 'circles_tangents'
  | 'concurrency';

interface MathsChapter4GeometryLabs2DProps {
  variant: MathsCh4Variant;
  onExplore: () => void;
}

/** High-contrast non-overlapping vertex pill label for 2D mathematical precision */
function VertexBadge({ x, y, text, color = '#1e293b' }: { x: number; y: number; text: string; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="#ffffff" stroke={color} strokeWidth="2" />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>
        {text}
      </text>
    </g>
  );
}

/**
 * Mathematics Chapter 4 — Five Distinct, Mathematically Constrained 2D SVG Geometry Workbenches
 * (TN Class 10 Mathematics 2025 Edition, pp. 161–200).
 * Replaces the single unlabelled 3D Thales triangle that previously served all 12 Ch. 4 subsections!
 */
export function MathsChapter4GeometryLabs2D({
  variant,
  onExplore,
}: MathsChapter4GeometryLabs2DProps) {
  // 4.2 Similarity state
  const [scaleK, setScaleK] = useState(1.4);

  // 4.3 Thales + Angle Bisector state
  const [theorem43, setTheorem43] = useState<'thales' | 'bisector'>('thales');
  const [splitT, setSplitT] = useState(0.5);
  const [sideAB, setSideAB] = useState(8);
  const [sideAC, setSideAC] = useState(12);
  const [showBisectorProofLine, setShowBisectorProofLine] = useState(false);

  // 4.4 Pythagoras state
  const [legA, setLegA] = useState(3);
  const [legB, setLegB] = useState(4);

  // 4.5 Circles & Tangents state
  const [radiusR, setRadiusR] = useState(3);
  const [distOT, setDistOT] = useState(5);

  // 4.6 Concurrency (Ceva) state
  const [cevaMode, setCevaMode] = useState<'centroid' | 'ceva_example'>('ceva_example');
  const [cevaBD, setCevaBD] = useState(12);

  if (variant === 'similarity') {
    const sim = computeSimilarityTriangle(4, 5, 3.6, scaleK);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 overflow-x-auto">
          <svg viewBox="0 0 540 270" role="img" aria-label="Similar triangles ABC and PQR with equal corresponding angles and proportional sides" className="w-full h-auto min-w-[300px]">
            {/* Triangle ABC */}
            <polygon points="110,75 45,215 190,215" fill="#eff6ff" stroke="#2563eb" strokeWidth="3" />
            <VertexBadge x={110} y={55} text="A" color="#1d4ed8" />
            <VertexBadge x={30} y={226} text="B" color="#1d4ed8" />
            <VertexBadge x={205} y={226} text="C" color="#1d4ed8" />
            <text x="64" y="142" fontSize="11.5" fontWeight="800" fill="#1e3a8a">4</text>
            <text x="116" y="236" fontSize="11.5" fontWeight="800" fill="#1e3a8a">5</text>
            <text x="160" y="142" fontSize="11.5" fontWeight="800" fill="#1e3a8a">3.6</text>

            {/* Similarity Symbol */}
            <text x="242" y="152" textAnchor="middle" fontSize="28" fontWeight="800" fill="#7c3aed">∼</text>
            <text x="242" y="174" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b21b6">k = {scaleK}</text>

            {/* Scaled Triangle PQR */}
            {(() => {
              const s = 0.65 + (scaleK - 0.5) * 0.45;
              const px = 385;
              const py = 215 - 140 * s;
              const qx = 385 - 65 * s;
              const rx = 385 + 80 * s;
              return (
                <g>
                  <polygon points={`${px},${py} ${qx},215 ${rx},215`} fill="#f5f3ff" stroke="#7c3aed" strokeWidth="3" />
                  <VertexBadge x={px} y={Math.max(22, py - 18)} text="P" color="#6d28d9" />
                  <VertexBadge x={qx - 14} y={226} text="Q" color="#6d28d9" />
                  <VertexBadge x={rx + 14} y={226} text="R" color="#6d28d9" />
                  <text x={(px + qx) / 2 - 22} y={(py + 215) / 2} fontSize="11.5" fontWeight="800" fill="#5b21b6">{sim.pq}</text>
                  <text x={(qx + rx) / 2} y="236" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#5b21b6">{sim.qr}</text>
                  <text x={(px + rx) / 2 + 12} y={(py + 215) / 2} fontSize="11.5" fontWeight="800" fill="#5b21b6">{sim.rp}</text>
                </g>
              );
            })()}
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">
            4.2 Similar Triangles (△ABC ∼ △PQR · pp. 162–165)
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Scale Factor k: {scaleK.toFixed(1)} ({scaleK === 1 ? 'Congruent!' : scaleK > 1 ? 'Enlarged' : 'Reduced'})
            <input
              type="range"
              min={0.5}
              max={1.8}
              step={0.1}
              value={scaleK}
              onChange={(e) => { setScaleK(Number(e.target.value)); onExplore(); }}
              className="w-full accent-[var(--math)] mt-1"
            />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular space-y-1">
            <div>∠A = ∠P, ∠B = ∠Q, ∠C = ∠R (AA / AAA Equality)</div>
            <div className="font-bold text-[var(--math)]">
              PQ/AB = QR/BC = RP/CA = {sim.sideRatio}
            </div>
            <div>Area(△PQR) / Area(△ABC) = k² = <strong>{sim.areaRatio}</strong></div>
          </div>
          <button
            type="button"
            onClick={() => { setScaleK(1.0); onExplore(); }}
            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold text-[var(--ink)]"
          >
            Test Special Case: k = 1 (Congruent △ABC ≅ △PQR)
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'thales_and_bisector') {
    // THALES COORDINATES (Permanent non-overlapping A, B, C, D, E labels!)
    const th = computeThalesBPT(10, 12, splitT);
    const Ax = 265, Ay = 48;
    const Bx = 95, By = 258;
    const Cx = 445, Cy = 258;
    const Dx = Ax + (Bx - Ax) * splitT;
    const Dy = Ay + (By - Ay) * splitT;
    const Ex = Ax + (Cx - Ax) * splitT;
    const Ey = Ay + (Cy - Ay) * splitT;

    // ANGLE BISECTOR COORDINATES (Exact analytical bisector point D on BC!)
    const baseBC = 10;
    const bis = computeAngleBisectorTheorem(sideAB, sideAC, baseBC);
    // Construct visual triangle whose top vertex shifts smoothly as AB vs AC changes
    const bBx = 95, bBy = 248;
    const bCx = 445, bCy = 248;
    const frac = sideAB / (sideAB + sideAC); // BD / BC = AB / (AB + AC)
    const bDx = bBx + (bCx - bBx) * frac;
    const bAx = 155 + (1 - frac) * 230;
    const bAy = 54;
    // Proof construction point E: extend AD to meet line through C parallel to AB
    const bEx = bDx + (bDx - bAx) * (1 - frac) / Math.max(0.25, frac) * 0.45;
    const bEy = Math.min(295, bBy + 42);

    return (
      <div className="space-y-4">
        {/* Clean Theorem Switcher within Section 4.3 (Zero Tangent–Radius filler!) */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setTheorem43('thales'); onExplore(); }}
            aria-pressed={theorem43 === 'thales'}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-extrabold ${
              theorem43 === 'thales'
                ? 'bg-[var(--math)] text-white border-[var(--math)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Theorem 1 · Thales / BPT (DE ∥ BC)
          </button>
          <button
            type="button"
            onClick={() => { setTheorem43('bisector'); onExplore(); }}
            aria-pressed={theorem43 === 'bisector'}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-extrabold ${
              theorem43 === 'bisector'
                ? 'bg-[var(--math)] text-white border-[var(--math)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Theorem 3 · Angle Bisector Theorem (Ray AD)
          </button>
        </div>

        {theorem43 === 'thales' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 overflow-x-auto">
              <svg
                viewBox="0 0 540 300"
                role="img"
                aria-label={`Thales Basic Proportionality Theorem triangle ABC with labelled vertices A, B, C, D, E where DE is parallel to BC and AD/DB equals AE/EC equals ${th.ratioLeft}`}
                className="w-full h-auto min-w-[300px]"
              >
                {/* Triangle ABC */}
                <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="#f8fafc" stroke="#2563eb" strokeWidth="3" />
                {/* Parallel line DE || BC */}
                <line x1={Dx} y1={Dy} x2={Ex} y2={Ey} stroke="#d97706" strokeWidth="3.5" />
                {/* Parallel Chevron Markers on DE and BC */}
                <polyline points={`${(Dx + Ex) / 2 - 6},${Dy - 5} ${(Dx + Ex) / 2 + 4},${Dy} ${(Dx + Ex) / 2 - 6},${Dy + 5}`} fill="none" stroke="#b45309" strokeWidth="2.5" />
                <polyline points={`${(Bx + Cx) / 2 - 6},${By - 5} ${(Bx + Cx) / 2 + 4},${By} ${(Bx + Cx) / 2 - 6},${By + 5}`} fill="none" stroke="#15803d" strokeWidth="2.5" />
                <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#16a34a" strokeWidth="3.5" />

                {/* Segment Length Labels */}
                <text x={(Ax + Dx) / 2 - 36} y={(Ay + Dy) / 2} fontSize="11.5" fontWeight="800" fill="#1d4ed8">
                  AD = {th.AD}
                </text>
                <text x={(Dx + Bx) / 2 - 38} y={(Dy + By) / 2} fontSize="11.5" fontWeight="800" fill="#1e40af">
                  DB = {th.DB}
                </text>
                <text x={(Ax + Ex) / 2 + 12} y={(Ay + Ey) / 2} fontSize="11.5" fontWeight="800" fill="#7c3aed">
                  AE = {th.AE}
                </text>
                <text x={(Ex + Cx) / 2 + 12} y={(Ey + Cy) / 2} fontSize="11.5" fontWeight="800" fill="#6d28d9">
                  EC = {th.EC}
                </text>

                {/* Permanent High-Contrast Vertex Labels A, B, C, D, E */}
                <VertexBadge x={Ax} y={Ay - 22} text="A" color="#1d4ed8" />
                <VertexBadge x={Bx - 20} y={By + 14} text="B" color="#15803d" />
                <VertexBadge x={Cx + 20} y={Cy + 14} text="C" color="#15803d" />
                <VertexBadge x={Dx - 24} y={Dy} text="D" color="#b45309" />
                <VertexBadge x={Ex + 24} y={Ey} text="E" color="#b45309" />

                {/* Vertex dots right on the edges */}
                {[[Ax, Ay], [Bx, By], [Cx, Cy], [Dx, Dy], [Ex, Ey]].map(([px, py], i) => (
                  <circle key={i} cx={px} cy={py} r="4.5" fill="#0f172a" />
                ))}
              </svg>
            </div>
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase tracking-wider text-[var(--math)]">
                  Thales Theorem (p. 172, Fig. 4.29)
                </span>
                <button
                  type="button"
                  onClick={() => setSplitT(0.5)}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-bold inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
              <label className="block font-bold text-[var(--ink)]">
                Move Parallel Line DE along AB (DE ∥ BC): {Math.round(splitT * 100)}%
                <input
                  type="range"
                  min={0.2}
                  max={0.8}
                  step={0.05}
                  value={splitT}
                  onChange={(e) => { setSplitT(Number(e.target.value)); onExplore(); }}
                  className="w-full accent-[var(--math)] mt-1"
                />
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0.25, 0.5, 0.67].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setSplitT(preset); onExplore(); }}
                    className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-bold"
                  >
                    Ratio {preset === 0.25 ? '1 : 3' : preset === 0.5 ? '1 : 1' : '2 : 1'}
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular space-y-1.5">
                <div>AD / DB = {th.AD} / {th.DB} = <strong className="text-[var(--math)]">{th.ratioLeft}</strong></div>
                <div>AE / EC = {th.AE} / {th.EC} = <strong className="text-[var(--math)]">{th.ratioRight}</strong></div>
                <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                  ✓ Equal Ratio Verified (△ADE ∼ △ABC by AAA)
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                <strong>Converse (Theorem 2, p. 174):</strong> If a line divides AB and AC in the same ratio (AD/DB = AE/EC), then DE ∥ BC.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 overflow-x-auto">
              <svg
                viewBox="0 0 540 310"
                role="img"
                aria-label={`Angle Bisector Theorem triangle ABC where ray AD bisects angle BAC and BD/DC equals AB/AC equals ${bis.ratioSides}`}
                className="w-full h-auto min-w-[300px]"
              >
                <polygon points={`${bAx},${bAy} ${bBx},${bBy} ${bCx},${bCy}`} fill="#f8fafc" stroke="#2563eb" strokeWidth="3" />
                {/* Internal Angle Bisector Ray AD */}
                <line x1={bAx} y1={bAy} x2={bDx} y2={bBy} stroke="#dc2626" strokeWidth="3.5" />
                {/* Equal angle arc markers at A */}
                <path d={`M ${bAx - 18} ${bAy + 24} A 26 26 0 0 0 ${bAx} ${bAy + 30}`} fill="none" stroke="#dc2626" strokeWidth="2.5" />
                <path d={`M ${bAx} ${bAy + 30} A 26 26 0 0 0 ${bAx + 18} ${bAy + 24}`} fill="none" stroke="#dc2626" strokeWidth="2.5" />
                <text x={bAx - 18} y={bAy + 44} fontSize="10.5" fontWeight="800" fill="#b91c1c">∠1</text>
                <text x={bAx + 8} y={bAy + 44} fontSize="10.5" fontWeight="800" fill="#b91c1c">∠1</text>

                {/* Optional Textbook Proof Construction (p. 174: CE || AB meeting extended AD at E) */}
                {showBisectorProofLine && (
                  <g>
                    <line x1={bDx} y1={bBy} x2={bEx} y2={bEy} stroke="#dc2626" strokeWidth="2" strokeDasharray="5 4" />
                    <line x1={bCx} y1={bCy} x2={bEx} y2={bEy} stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="5 4" />
                    <VertexBadge x={bEx + 16} y={bEy} text="E" color="#6d28d9" />
                    <text x={(bCx + bEx) / 2 + 12} y={(bCy + bEy) / 2} fontSize="10.5" fontWeight="700" fill="#6d28d9">
                      CE ∥ AB (△ACE isosceles)
                    </text>
                  </g>
                )}

                {/* Side & Base Segment Readouts */}
                <text x={(bAx + bBx) / 2 - 42} y={(bAy + bBy) / 2} fontSize="12" fontWeight="800" fill="#1d4ed8">
                  AB = {sideAB}
                </text>
                <text x={(bAx + bCx) / 2 + 14} y={(bAy + bCy) / 2} fontSize="12" fontWeight="800" fill="#7c3aed">
                  AC = {sideAC}
                </text>
                <text x={(bBx + bDx) / 2} y={bBy + 22} textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f766e">
                  BD = {bis.BD}
                </text>
                <text x={(bDx + bCx) / 2} y={bBy + 22} textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309">
                  DC = {bis.DC}
                </text>

                <VertexBadge x={bAx} y={bAy - 22} text="A" color="#1d4ed8" />
                <VertexBadge x={bBx - 18} y={bBy + 12} text="B" color="#0f766e" />
                <VertexBadge x={bCx + 18} y={bCy + 12} text="C" color="#0f766e" />
                <VertexBadge x={bDx} y={bBy + 42} text="D" color="#dc2626" />
                <circle cx={bDx} cy={bBy} r="4.5" fill="#dc2626" />
              </svg>
            </div>
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
              <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">
                Angle Bisector Theorem (pp. 174–175, Fig. 4.33)
              </div>
              <label className="block font-bold text-[var(--ink)]">
                Side AB: {sideAB} cm
                <input type="range" min={4} max={16} step={1} value={sideAB} onChange={(e) => { setSideAB(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Side AC: {sideAC} cm
                <input type="range" min={4} max={16} step={1} value={sideAC} onChange={(e) => { setSideAC(Number(e.target.value)); onExplore(); }} className="w-full accent-purple-600 mt-1" />
              </label>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular space-y-1.5">
                <div>AB / AC = {sideAB} / {sideAC} = <strong className="text-[var(--math)]">{bis.ratioSides}</strong></div>
                <div>BD / DC = {bis.BD} / {bis.DC} = <strong className="text-[var(--math)]">{bis.ratioSegments}</strong></div>
                <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                  ✓ Internal bisector AD splits BC in exact ratio AB : AC!
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowBisectorProofLine((v) => !v); onExplore(); }}
                className="min-h-[40px] w-full px-3 py-2 rounded-xl border border-[var(--math)] bg-[var(--surface)] text-[var(--math)] font-bold"
              >
                {showBisectorProofLine ? 'Hide Proof Construction (CE ∥ AB)' : 'Show Textbook Proof Construction (Draw CE ∥ AB)'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'pythagoras') {
    const py = computePythagoras(legA, legB);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 overflow-x-auto">
          <svg viewBox="0 0 540 290" role="img" aria-label={`Pythagoras Theorem right triangle with legs ${legA} and ${legB} and hypotenuse ${py.hypotenuse}`} className="w-full h-auto min-w-[300px]">
            {/* Visual Square on leg a (left) */}
            <rect x="108" y="95" width="90" height="90" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <text x="153" y="144" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e3a8a">a² = {py.areaA}</text>
            {/* Visual Square on leg b (bottom) */}
            <rect x="198" y="185" width="120" height="82" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <text x="258" y="230" textAnchor="middle" fontSize="13" fontWeight="800" fill="#166534">b² = {py.areaB}</text>
            {/* Right Triangle ABC right-angled at C */}
            <polygon points="198,95 198,185 318,185" fill="#fef3c7" stroke="#0f172a" strokeWidth="3" />
            {/* 90-degree square marker at C */}
            <polyline points="198,169 214,169 214,185" fill="none" stroke="#dc2626" strokeWidth="2.5" />
            {/* Hypotenuse area badge */}
            <rect x="292" y="56" width="150" height="58" rx="12" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2.5" />
            <text x="367" y="80" textAnchor="middle" fontSize="13" fontWeight="800" fill="#5b21b6">c² = {py.areaC}</text>
            <text x="367" y="99" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#6d28d9">
              c = √{py.areaC} = {py.hypotenuse}
            </text>
            <VertexBadge x={198} y={76} text="A" color="#1d4ed8" />
            <VertexBadge x={336} y={185} text="B" color="#15803d" />
            <VertexBadge x={182} y={202} text="C" color="#dc2626" />
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">
            4.4 Pythagoras / Baudhayana Theorem (pp. 184–185)
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Leg a (AC): {legA} units
            <input type="range" min={2} max={12} step={1} value={legA} onChange={(e) => { setLegA(Number(e.target.value)); onExplore(); }} className="w-full accent-blue-600 mt-1" />
          </label>
          <label className="block font-bold text-[var(--ink)]">
            Leg b (BC): {legB} units
            <input type="range" min={2} max={15} step={1} value={legB} onChange={(e) => { setLegB(Number(e.target.value)); onExplore(); }} className="w-full accent-emerald-600 mt-1" />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {([[3, 4], [5, 12], [6, 8], [8, 15]] as const).map(([a, b]) => (
              <button key={`${a}-${b}`} type="button" onClick={() => { setLegA(a); setLegB(b); onExplore(); }} className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-bold">
                Triplet ({a}, {b}, {Math.hypot(a, b)})
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular">
            a² + b² = {py.areaA} + {py.areaB} = <strong>{py.areaC}</strong> = c² → c = <strong>{py.hypotenuse}</strong>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'circles_tangents') {
    const tan = computeCircleTangent(radiusR, distOT);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 overflow-x-auto">
          <svg viewBox="0 0 540 285" role="img" aria-label={`Circle with center O, radius ${radiusR} cm perpendicular to tangent at P, and equal tangents TP and TQ from external point T`} className="w-full h-auto min-w-[300px]">
            {/* Circle center O */}
            <circle cx="190" cy="145" r="82" fill="#eff6ff" stroke="#2563eb" strokeWidth="3" />
            {/* Radius OP */}
            <line x1="190" y1="145" x2="236" y2="77" stroke="#1d4ed8" strokeWidth="3" />
            {/* Radius OQ */}
            <line x1="190" y1="145" x2="236" y2="213" stroke="#1d4ed8" strokeWidth="2.5" strokeDasharray="4 3" />
            {/* Center to external point OT */}
            <line x1="190" y1="145" x2="430" y2="145" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 4" />
            {/* Tangent TP & TQ */}
            <line x1="236" y1="77" x2="430" y2="145" stroke="#dc2626" strokeWidth="3.5" />
            <line x1="236" y1="213" x2="430" y2="145" stroke="#16a34a" strokeWidth="3" />
            {/* Right Angle 90° indicator at P */}
            <text x="236" y="106" fontSize="11" fontWeight="800" fill="#dc2626">90° (OP ⟂ PT)</text>
            {/* Labels */}
            <VertexBadge x={174} y={145} text="O" color="#1d4ed8" />
            <VertexBadge x={236} y={56} text="P" color="#dc2626" />
            <VertexBadge x={236} y={234} text="Q" color="#15803d" />
            <VertexBadge x={450} y={145} text="T" color="#0f172a" />
            <text x="195" y="110" fontSize="11.5" fontWeight="800" fill="#1e3a8a">r = {radiusR}</text>
            <text x="310" y="138" fontSize="11.5" fontWeight="800" fill="#334155">OT = {distOT}</text>
            <text x="345" y="96" fontSize="12" fontWeight="800" fill="#b91c1c">PT = {tan.valid ? tan.tangentLengthPT : '—'}</text>
            <text x="345" y="202" fontSize="12" fontWeight="800" fill="#15803d">QT = {tan.valid ? tan.tangentLengthPT : '—'}</text>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>4.5 Circles &amp; Tangents (pp. 188–193)</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Circle Radius r (OP): {radiusR} cm
            <input type="range" min={2} max={10} step={1} value={radiusR} onChange={(e) => { setRadiusR(Number(e.target.value)); onExplore(); }} className="w-full accent-blue-600 mt-1" />
          </label>
          <label className="block font-bold text-[var(--ink)]">
            External Point Distance OT: {distOT} cm
            <input type="range" min={3} max={15} step={1} value={distOT} onChange={(e) => { setDistOT(Number(e.target.value)); onExplore(); }} className="w-full accent-rose-600 mt-1" />
          </label>
          {tan.valid ? (
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular space-y-1">
              <div>In right △OPT (∠OPT = 90°):</div>
              <div>PT = √(OT² − r²) = √({distOT}² − {radiusR}²) = <strong>{tan.tangentLengthPT} cm</strong></div>
              <div className="text-emerald-700 dark:text-emerald-300 font-bold">Two tangents from T are equal: PT = QT!</div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-400 text-amber-800 dark:text-amber-200 font-semibold">
              {tan.error}
            </div>
          )}
          <button
            type="button"
            onClick={() => { setRadiusR(3); setDistOT(5); onExplore(); }}
            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold"
          >
            Load Textbook Example 4.24 (r = 3, OT = 5 → PT = 4)
          </button>
        </div>
      </div>
    );
  }

  // 4.6 Concurrency — Ceva's Theorem (p. 196–197, Example 4.33)
  const dc = Math.max(1, 15 - cevaBD);
  const ceva =
    cevaMode === 'centroid'
      ? computeCevaProduct(1, 1, 1, 1, 1, 1)
      : computeCevaProduct(cevaBD, dc, 5, 8, 2, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 overflow-x-auto">
        <svg viewBox="0 0 540 285" role="img" aria-label="Ceva Concurrency Theorem triangle ABC with cevians AD, BE, CF" className="w-full h-auto min-w-[300px]">
          <polygon points="260,44 90,248 440,248" fill="#f8fafc" stroke="#2563eb" strokeWidth="3" />
          {/* Cevians AD, BE, CF */}
          {(() => {
            const dX = cevaMode === 'centroid' ? 265 : 90 + (cevaBD / 15) * 350;
            const eX = cevaMode === 'centroid' ? 350 : 440 + (260 - 440) * (5 / 13);
            const eY = cevaMode === 'centroid' ? 146 : 248 + (44 - 248) * (5 / 13);
            const fX = cevaMode === 'centroid' ? 175 : 260 + (90 - 260) * (2 / 7);
            const fY = cevaMode === 'centroid' ? 146 : 44 + (248 - 44) * (2 / 7);
            return (
              <g>
                <line x1="260" y1="44" x2={dX} y2="248" stroke="#dc2626" strokeWidth="2.5" />
                <line x1="90" y1="248" x2={eX} y2={eY} stroke="#16a34a" strokeWidth="2.5" />
                <line x1="440" y1="248" x2={fX} y2={fY} stroke="#7c3aed" strokeWidth="2.5" />
                <VertexBadge x={dX} y={266} text="D" color="#dc2626" />
                <VertexBadge x={eX + 18} y={eY} text="E" color="#15803d" />
                <VertexBadge x={fX - 18} y={fY} text="F" color="#6d28d9" />
              </g>
            );
          })()}
          <VertexBadge x={260} y={24} text="A" color="#1d4ed8" />
          <VertexBadge x={72} y={258} text="B" color="#1d4ed8" />
          <VertexBadge x={458} y={258} text="C" color="#1d4ed8" />
        </svg>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">
          4.6 Concurrency &amp; Ceva&apos;s Theorem (pp. 195–197)
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setCevaMode('ceva_example'); setCevaBD(12); onExplore(); }} className={`min-h-[40px] flex-1 rounded-xl border font-bold ${cevaMode === 'ceva_example' ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
            Example 4.33
          </button>
          <button type="button" onClick={() => { setCevaMode('centroid'); onExplore(); }} className={`min-h-[40px] flex-1 rounded-xl border font-bold ${cevaMode === 'centroid' ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
            Centroid (Medians)
          </button>
        </div>
        {cevaMode === 'ceva_example' && (
          <label className="block font-bold text-[var(--ink)]">
            Adjust BD on BC = 15 (AF/FB = 2/5, CE/EA = 5/8): BD = {cevaBD}, DC = {dc}
            <input type="range" min={3} max={14} step={1} value={cevaBD} onChange={(e) => { setCevaBD(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
          </label>
        )}
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular space-y-1">
          <div>(BD/DC) × (CE/EA) × (AF/FB) = <strong>{ceva.product}</strong></div>
          <div className={ceva.isConcurrent ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-amber-700 dark:text-amber-300 font-bold'}>
            {ceva.isConcurrent ? '✓ Product = 1 → Cevians AD, BE, CF are CONCURRENT!' : 'Product ≠ 1 → Cevians do NOT meet at a single point!'}
          </div>
        </div>
      </div>
    </div>
  );
}
