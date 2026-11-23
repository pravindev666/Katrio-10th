import React, { useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import {
  computeElectricPotential,
  computePotentialDifference,
} from '../../utils/conceptFirstSimulations';

interface ElectricPotentialLab2DProps {
  onExplore: () => void;
}

/**
 * Science 4.3.1 — Electric Potential & Potential Difference (TN Class 10 Science p. 44, Fig. 4.3).
 * Purpose-built 2D SVG sandbox with reference infinity, source charge +Q, selectable points A & B,
 * work (W) and charge (Q) controls, equal-work comparison mode, and explicit model assumptions.
 */
export function ElectricPotentialLab2D({ onExplore }: ElectricPotentialLab2DProps) {
  const [workJ, setWorkJ] = useState(24);
  const [chargeC, setChargeC] = useState(2);
  const [targetPoint, setTargetPoint] = useState<'A' | 'B'>('A');
  const [compareEqualWork, setCompareEqualWork] = useState(false);

  // Point B is further from +Q than Point A, so moving unit positive charge to A takes more work than to B
  const potAtSelected = computeElectricPotential(workJ, chargeC);
  const vA = targetPoint === 'A' ? potAtSelected.potentialV : Number((potAtSelected.potentialV * 1.5).toFixed(2));
  const vB = targetPoint === 'B' ? potAtSelected.potentialV : Number((potAtSelected.potentialV * 0.5).toFixed(2));
  const diff = computePotentialDifference(vA, vB);

  const cmp1 = computeElectricPotential(24, 2); // 12 V
  const cmp2 = computeElectricPotential(24, 4); // 6 V

  const chargeX = targetPoint === 'A' ? 235 : 375;

  const handleReset = () => {
    setWorkJ(24);
    setChargeC(2);
    setTargetPoint('A');
    setCompareEqualWork(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Crisp 2D SVG Potential Field Schematic */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4 overflow-x-auto">
            <svg
              viewBox="0 0 560 270"
              role="img"
              aria-labelledby="ep-svg-title ep-svg-desc"
              className="w-full h-auto min-w-[300px]"
            >
              <title id="ep-svg-title">2D Electric Potential Sandbox</title>
              <desc id="ep-svg-desc">
                Source charge +Q on the left with concentric equipotential rings, point A closer at {vA} volts,
                point B further at {vB} volts, reference point at infinity on the right at 0 volts, and movable
                test charge +{chargeC} coulombs at point {targetPoint}.
              </desc>

              {/* Soft radial potential zones */}
              <circle cx="95" cy="135" r="240" fill="none" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth="1.2" />
              <circle cx="95" cy="135" r="145" fill="#e0f2fe" fillOpacity="0.35" stroke="#38bdf8" strokeDasharray="4 4" strokeWidth="1.5" />
              <circle cx="95" cy="135" r="78" fill="#bae6fd" fillOpacity="0.4" stroke="#0284c7" strokeWidth="1.5" />

              {/* Axis line from +Q to Infinity */}
              <line x1="125" y1="135" x2="510" y2="135" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" />

              {/* Work Arrow from Reference ∞ -> Target Point */}
              <line x1="490" y1="84" x2={chargeX + 14} y2="84" stroke="#d97706" strokeWidth="3" />
              <polygon points={`${chargeX + 4},84 ${chargeX + 18},77 ${chargeX + 18},91`} fill="#d97706" />
              <rect x={(490 + chargeX) / 2 - 78} y="54" width="156" height="24" rx="8" fill="#fef3c7" stroke="#f59e0b" />
              <text x={(490 + chargeX) / 2} y="70" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">
                Work W = {workJ} J against force
              </text>

              {/* Source Charge +Q */}
              <circle cx="95" cy="135" r="30" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
              <text x="95" y="140" textAnchor="middle" fontSize="16" fontWeight="800" fill="#ffffff">
                +Q
              </text>
              <text x="95" y="184" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" className="text-[var(--ink)]">
                Source Charge
              </text>

              {/* Point A (Higher Potential) */}
              <g
                role="button"
                tabIndex={0}
                aria-label={`Select Point A, electric potential ${vA} volts`}
                onClick={() => { setTargetPoint('A'); onExplore(); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setTargetPoint('A');
                    onExplore();
                  }
                }}
                className="cursor-pointer focus:outline-none"
              >
                <circle
                  cx="235"
                  cy="135"
                  r={targetPoint === 'A' ? 16 : 11}
                  fill={targetPoint === 'A' ? '#2563eb' : '#ffffff'}
                  stroke="#1d4ed8"
                  strokeWidth="3"
                />
                <text x="235" y="139" textAnchor="middle" fontSize="12" fontWeight="800" fill={targetPoint === 'A' ? '#ffffff' : '#1e3a8a'}>
                  A
                </text>
                <rect x="190" y="162" width="90" height="36" rx="8" fill="#eff6ff" stroke="#3b82f6" />
                <text x="235" y="177" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a">
                  Point A (Higher)
                </text>
                <text x="235" y="192" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#2563eb">
                  VA = {vA} V
                </text>
              </g>

              {/* Point B (Lower Potential) */}
              <g
                role="button"
                tabIndex={0}
                aria-label={`Select Point B, electric potential ${vB} volts`}
                onClick={() => { setTargetPoint('B'); onExplore(); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setTargetPoint('B');
                    onExplore();
                  }
                }}
                className="cursor-pointer focus:outline-none"
              >
                <circle
                  cx="375"
                  cy="135"
                  r={targetPoint === 'B' ? 16 : 11}
                  fill={targetPoint === 'B' ? '#0d9488' : '#ffffff'}
                  stroke="#0f766e"
                  strokeWidth="3"
                />
                <text x="375" y="139" textAnchor="middle" fontSize="12" fontWeight="800" fill={targetPoint === 'B' ? '#ffffff' : '#134e4a'}>
                  B
                </text>
                <rect x="330" y="162" width="90" height="36" rx="8" fill="#f0fdfa" stroke="#14b8a6" />
                <text x="375" y="177" textAnchor="middle" fontSize="11" fontWeight="800" fill="#115e59">
                  Point B (Lower)
                </text>
                <text x="375" y="192" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0d9488">
                  VB = {vB} V
                </text>
              </g>

              {/* Movable Test Charge Badge above active point */}
              <g>
                <circle cx={chargeX} cy="108" r="11" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
                <text x={chargeX} y="112" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff">
                  +q
                </text>
              </g>

              {/* Reference Point Infinity */}
              <rect x="472" y="116" width="76" height="38" rx="10" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
              <text x="510" y="133" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">
                Ref (∞)
              </text>
              <text x="510" y="147" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                V∞ = 0 V
              </text>

              {/* Potential Difference Bracket between A and B */}
              <line x1="235" y1="224" x2="375" y2="224" stroke="#7c3aed" strokeWidth="2.5" />
              <line x1="235" y1="216" x2="235" y2="232" stroke="#7c3aed" strokeWidth="2.5" />
              <line x1="375" y1="216" x2="375" y2="232" stroke="#7c3aed" strokeWidth="2.5" />
              <rect x="215" y="232" width="180" height="26" rx="8" fill="#f5f3ff" stroke="#8b5cf6" />
              <text x="305" y="249" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#5b21b6">
                Potential Diff: VA − VB = {diff.deltaV} V
              </text>
            </svg>
          </div>

          {/* Live Readout Strip */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-1.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-tabular font-extrabold text-sm text-[var(--primary)]">
                V = W / Q = {workJ} J / {chargeC} C = {potAtSelected.potentialV} V (1 V = 1 J/C)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--info-bg)] text-[var(--primary)] font-bold">
                Active Point: {targetPoint}
              </span>
            </div>
            <p className="text-[var(--text)]">{diff.directionText}</p>
          </div>
        </div>

        {/* Right: Controls + Equal-Work Comparison Challenge */}
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>Move Test Charge &amp; Measure V = W/Q</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-bold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['A', 'B'] as const).map((pt) => (
              <button
                key={pt}
                type="button"
                onClick={() => { setTargetPoint(pt); onExplore(); }}
                aria-pressed={targetPoint === pt}
                className={`min-h-[44px] px-3 py-2 rounded-xl border font-bold transition-colors ${
                  targetPoint === pt
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                Place +q at Point {pt}
              </button>
            ))}
          </div>

          <label className="block font-bold text-[var(--ink)] space-y-1">
            <div className="flex justify-between">
              <span>Work Done (W):</span>
              <span className="font-mono-tabular text-[var(--primary)]">{workJ} J (joules)</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={2}
              value={workJ}
              onChange={(e) => { setWorkJ(Number(e.target.value)); onExplore(); }}
              className="w-full accent-[var(--primary)]"
            />
          </label>

          <label className="block font-bold text-[var(--ink)] space-y-1">
            <div className="flex justify-between">
              <span>Charge Moved (Q):</span>
              <span className="font-mono-tabular text-[var(--science)]">{chargeC} C (coulombs)</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={chargeC}
              onChange={(e) => { setChargeC(Number(e.target.value)); onExplore(); }}
              className="w-full accent-[var(--science)]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setWorkJ(100); setChargeC(10); setTargetPoint('A'); onExplore(); }}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] font-bold text-[var(--ink)]"
            >
              Load Textbook Solved Problem 2 (100 J, 10 C)
            </button>
            <button
              type="button"
              onClick={() => { setCompareEqualWork((c) => !c); onExplore(); }}
              aria-pressed={compareEqualWork}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl border font-bold ${
                compareEqualWork
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              {compareEqualWork ? 'Hide Equal-Work Comparison' : 'Compare Equal Work (24 J on 2 C vs 4 C)'}
            </button>
          </div>

          {compareEqualWork && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-400/50 space-y-1.5 text-[var(--ink)]">
              <div className="font-extrabold text-amber-800 dark:text-amber-300">
                Equal Work, Different Charge Comparison
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono-tabular">
                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
                  <div>Case 1: W = 24 J, Q = 2 C</div>
                  <div className="text-sm font-extrabold text-[var(--primary)]">V₁ = {cmp1.potentialV} V</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
                  <div>Case 2: W = 24 J, Q = 4 C</div>
                  <div className="text-sm font-extrabold text-[var(--science)]">V₂ = {cmp2.potentialV} V</div>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text)]">
                Same 24 J of work shared across twice the charge (4 C) gives <strong>half the work per coulomb</strong> (6 V vs 12 V). Potential measures <em>energy per unit charge</em>, not total work!
              </p>
            </div>
          )}

          <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[11px] text-[var(--text-muted)]">
            <strong>Model Note:</strong> This 2D diagram is a conceptual schematic illustrating work per unit charge (V = W/Q) relative to a zero-potential reference at infinity — not a full 3D electrostatic field solver.
          </p>
        </div>
      </div>
    </div>
  );
}
