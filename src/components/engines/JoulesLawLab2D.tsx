import React, { useState } from 'react';
import { Flame, RotateCcw, ShieldAlert } from 'lucide-react';
import { computeJoulesHeating } from '../../utils/conceptFirstSimulations';

interface JoulesLawLab2DProps {
  onExplore: () => void;
}

/**
 * Science 4.8.1 — Joule's Law of Heating (TN Class 10 Science pp. 50–51, Eq. 4.20, Solved Problem 6).
 * Interactive 2D Nichrome resistor heating workbench + live parabolic H vs I graph + 2I -> 4H compare mode.
 */
export function JoulesLawLab2D({ onExplore }: JoulesLawLab2DProps) {
  const [currentA, setCurrentA] = useState(3);
  const [resistanceOhm, setResistanceOhm] = useState(5);
  const [timeSec, setTimeSec] = useState(20);
  const [compareDoubleI, setCompareDoubleI] = useState(false);
  const [applianceContext, setApplianceContext] = useState<'none' | 'iron' | 'fuse' | 'bulb'>('none');

  const sim = computeJoulesHeating(currentA, resistanceOhm, timeSec);
  const doubledI = Math.min(10, currentA * 2);
  const doubledSim = computeJoulesHeating(doubledI, resistanceOhm, timeSec);

  // Build parabolic curve H(I) = I² * R * t for I in 0..10 A
  const maxI = 10;
  const maxH = Math.max(100, maxI * maxI * resistanceOhm * timeSec);
  const plotLeft = 58;
  const plotRight = 278;
  const plotTop = 26;
  const plotBottom = 182;

  const toX = (iVal: number) => plotLeft + (iVal / maxI) * (plotRight - plotLeft);
  const toY = (hVal: number) => plotBottom - (Math.min(hVal, maxH) / maxH) * (plotBottom - plotTop);

  const curvePts = Array.from({ length: 41 }, (_, idx) => {
    const iVal = (idx / 40) * maxI;
    const hVal = iVal * iVal * resistanceOhm * timeSec;
    return `${toX(iVal).toFixed(1)},${toY(hVal).toFixed(1)}`;
  }).join(' ');

  // Coil glow colour proportional to power dissipation
  const glowIntensity = Math.min(1, sim.powerW / 400);
  const coilColor =
    glowIntensity < 0.25
      ? '#64748b'
      : glowIntensity < 0.55
        ? '#ea580c'
        : '#ef4444';

  const handleReset = () => {
    setCurrentA(3);
    setResistanceOhm(5);
    setTimeSec(20);
    setCompareDoubleI(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: 2D Nichrome Heating Coil + Live Parabolic H vs I Graph */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nichrome Coil Schematic */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 mb-1">
                Nichrome Heating Coil (Safe Virtual Bench)
              </div>
              <svg
                viewBox="0 0 260 205"
                role="img"
                aria-label={`Nichrome coil with resistance ${resistanceOhm} ohms carrying ${currentA} amperes for ${timeSec} seconds producing ${sim.heatJ} joules of heat`}
                className="w-full h-auto"
              >
                {/* Ceramic insulator mount */}
                <rect x="24" y="148" width="212" height="24" rx="8" fill="#e2e8f0" stroke="#94a3b8" />
                <text x="130" y="164" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#334155">
                  Insulated Ceramic Base
                </text>

                {/* Heat waves above coil */}
                {glowIntensity > 0.12 && (
                  <g stroke="#f97316" strokeWidth="2" fill="none" opacity={0.35 + glowIntensity * 0.65}>
                    <path d="M 75 68 Q 70 55 78 44 Q 84 35 76 24" />
                    <path d="M 130 62 Q 124 49 132 38 Q 138 28 130 18" />
                    <path d="M 185 68 Q 180 55 188 44 Q 194 35 186 24" />
                  </g>
                )}

                {/* Terminals + Wire Leads */}
                <line x1="20" y1="112" x2="54" y2="112" stroke="#334155" strokeWidth="4" />
                <line x1="206" y1="112" x2="240" y2="112" stroke="#334155" strokeWidth="4" />
                <circle cx="54" cy="112" r="5" fill="#0f172a" />
                <circle cx="206" cy="112" r="5" fill="#0f172a" />

                {/* Zigzag Nichrome Resistor Coil */}
                <polyline
                  points="54,112 68,84 86,136 104,84 122,136 140,84 158,136 176,84 194,136 206,112"
                  fill="none"
                  stroke={coilColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Readout pills */}
                <rect x="28" y="178" width="204" height="22" rx="6" fill="#fff7ed" stroke="#fb923c" />
                <text x="130" y="193" textAnchor="middle" fontSize="11" fontWeight="800" fill="#9a3412">
                  Power P = I²R = {sim.powerW} W · ΔT ≈ +{sim.deltaTC} °C*
                </text>
              </svg>
            </div>

            {/* Live Parabolic H vs I Graph */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] mb-1">
                Quadratic Graph: H = I²Rt (R={resistanceOhm} Ω, t={timeSec} s)
              </div>
              <svg
                viewBox="0 0 300 205"
                role="img"
                aria-label={`Parabolic curve of Heat H versus Current I showing H equals ${sim.heatJ} joules at ${currentA} amperes`}
                className="w-full h-auto"
              >
                {/* Axes */}
                <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke="#475569" strokeWidth="2" />
                <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="#475569" strokeWidth="2" />
                <text x={(plotLeft + plotRight) / 2} y="199" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#334155">
                  Current I (Amperes, 0 → 10 A)
                </text>
                <text x="16" y="106" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#334155" transform="rotate(-90 16 106)">
                  Heat H (Joules)
                </text>

                {/* Parabolic H(I) curve */}
                <polyline points={curvePts} fill="none" stroke="#2563eb" strokeWidth="3" />

                {/* Active Point (I, H) */}
                <line x1={toX(currentA)} y1={plotBottom} x2={toX(currentA)} y2={toY(sim.heatJ)} stroke="#0284c7" strokeDasharray="3 3" />
                <line x1={plotLeft} y1={toY(sim.heatJ)} x2={toX(currentA)} y2={toY(sim.heatJ)} stroke="#0284c7" strokeDasharray="3 3" />
                <circle cx={toX(currentA)} cy={toY(sim.heatJ)} r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x={Math.min(235, toX(currentA) + 8)} y={Math.max(38, toY(sim.heatJ) - 6)} fontSize="10" fontWeight="800" fill="#1d4ed8">
                  I={currentA}A → {sim.heatJ} J
                </text>

                {/* Doubled Current Comparison Point (2I, 4H) */}
                {compareDoubleI && currentA <= 5 && (
                  <g>
                    <line x1={toX(doubledI)} y1={plotBottom} x2={toX(doubledI)} y2={toY(doubledSim.heatJ)} stroke="#dc2626" strokeDasharray="3 3" />
                    <line x1={plotLeft} y1={toY(doubledSim.heatJ)} x2={toX(doubledI)} y2={toY(doubledSim.heatJ)} stroke="#dc2626" strokeDasharray="3 3" />
                    <circle cx={toX(doubledI)} cy={toY(doubledSim.heatJ)} r="6.5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                    <text x={Math.min(185, toX(doubledI) - 10)} y={Math.max(20, toY(doubledSim.heatJ) - 8)} fontSize="10" fontWeight="800" fill="#b91c1c">
                      2I={doubledI}A → {doubledSim.heatJ} J (4×!)
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Live Exact Joule Formula Bar */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono-tabular font-extrabold text-sm text-[var(--ink)]">
              H = I²Rt = ({currentA})² × {resistanceOhm} × {timeSec} ={' '}
              <span className="text-orange-600">{sim.heatJ.toLocaleString()} J</span> ({sim.heatKJ} kJ)
            </span>
            <span className="font-bold text-[var(--text-muted)]">
              Notice I² = {currentA * currentA}
            </span>
          </div>

          {/* Optional Real-World Physical Appliance Context (TN Science p. 51) */}
          <div className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-extrabold uppercase tracking-wider text-[var(--primary)]">
                Where Is Joule Heating Used? (TN Science p. 51 · Optional Context)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {([
                  ['iron', 'Electric Iron / Toaster'],
                  ['fuse', 'Safety Fuse Wire'],
                  ['bulb', 'Tungsten Filament Bulb'],
                ] as const).map(([key, lbl]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setApplianceContext((prev) => (prev === key ? 'none' : key));
                      onExplore();
                    }}
                    aria-pressed={applianceContext === key}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg border font-bold ${
                      applianceContext === key
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            {applianceContext === 'iron' && (
              <p className="text-[var(--ink)] leading-relaxed bg-[var(--surface-subtle)] p-3 rounded-xl border border-[var(--line)]">
                <strong>Nichrome (Ni + Cr + Fe alloy):</strong> Chosen for electric irons and toasters because it has{' '}
                <strong>high resistivity</strong> (large R → more I²Rt heat), a <strong>high melting point</strong>,
                and does not oxidise easily when red-hot.
              </p>
            )}
            {applianceContext === 'fuse' && (
              <p className="text-[var(--ink)] leading-relaxed bg-[var(--surface-subtle)] p-3 rounded-xl border border-[var(--line)]">
                <strong>Fuse Wire (Lead–Tin alloy in series):</strong> Has high resistance and a{' '}
                <strong>low melting point</strong>. If a short circuit causes a sudden surge in current I,{' '}
                H = I²Rt spikes rapidly, melting the fuse wire first to break the circuit and save appliances.
              </p>
            )}
            {applianceContext === 'bulb' && (
              <p className="text-[var(--ink)] leading-relaxed bg-[var(--surface-subtle)] p-3 rounded-xl border border-[var(--line)]">
                <strong>Tungsten Filament (W):</strong> Has an extremely high melting point (~3380 °C) inside an inert
                nitrogen/argon bulb so Joule heating heats it to white-hot incandescence. Modern LEDs avoid this wasted
                heat!
              </p>
            )}
          </div>
        </div>

        {/* Right: Controls + Double-Current Comparison Mission */}
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold uppercase tracking-wider text-orange-600 inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>Adjust I, R, and t (H = I²Rt)</span>
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

          <label className="block font-bold text-[var(--ink)] space-y-1">
            <div className="flex justify-between">
              <span>Current (I) — Squared effect!</span>
              <span className="font-mono-tabular text-[var(--primary)]">{currentA} A</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={currentA}
              onChange={(e) => { setCurrentA(Number(e.target.value)); onExplore(); }}
              className="w-full accent-[var(--primary)]"
            />
          </label>

          <label className="block font-bold text-[var(--ink)] space-y-1">
            <div className="flex justify-between">
              <span>Resistance (R) — Linear effect</span>
              <span className="font-mono-tabular text-orange-600">{resistanceOhm} Ω</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={resistanceOhm}
              onChange={(e) => { setResistanceOhm(Number(e.target.value)); onExplore(); }}
              className="w-full accent-orange-500"
            />
          </label>

          <label className="block font-bold text-[var(--ink)] space-y-1">
            <div className="flex justify-between">
              <span>Time (t) — Linear effect</span>
              <span className="font-mono-tabular text-teal-700 dark:text-teal-300">{timeSec} s</span>
            </div>
            <input
              type="range"
              min={5}
              max={300}
              step={5}
              value={timeSec}
              onChange={(e) => { setTimeSec(Number(e.target.value)); onExplore(); }}
              className="w-full accent-teal-600"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (currentA > 5) setCurrentA(3);
                setCompareDoubleI((v) => !v);
                onExplore();
              }}
              aria-pressed={compareDoubleI}
              className={`min-h-[44px] flex-1 px-3 py-2 rounded-xl border font-bold ${
                compareDoubleI
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-[var(--primary)] text-white border-[var(--primary)]'
              }`}
            >
              {compareDoubleI ? '✓ Comparing I vs 2I (4× Heat!)' : 'Test Mission: Double Current (I → 2I)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentA(6);
                setResistanceOhm(5);
                setTimeSec(300);
                setCompareDoubleI(false);
                onExplore();
              }}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold text-[var(--ink)]"
            >
              Textbook Solved Problem 6
            </button>
          </div>

          {compareDoubleI && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-400/50 space-y-1 text-[var(--ink)]">
              <div className="font-extrabold text-rose-700 dark:text-rose-300">
                Locked R = {resistanceOhm} Ω, t = {timeSec} s: Doubling I Multiplies Heat by 4×!
              </div>
              <div className="font-mono-tabular">
                • At I = {currentA} A → H₁ = <strong>{sim.heatJ.toLocaleString()} J</strong>
              </div>
              <div className="font-mono-tabular">
                • At 2I = {currentA * 2} A → H₂ = <strong>{sim.doubleCurrentHeatJ.toLocaleString()} J</strong> (= 4 × H₁)
              </div>
              <p className="text-[11px] text-[var(--text)]">
                Because heat depends on <strong>I²</strong>, doubling current makes (2I)² = 4I² — quadrupling the heat produced!
              </p>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[11px] text-[var(--text-muted)] space-y-1">
            <div>
              <strong>*Model Assumption:</strong> Estimated ΔT uses simplified ΔT = H/(mc) assuming m = 0.25 kg, c = 450 J/(kg·K), and zero heat loss to air.
            </div>
            <div className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Safety: Never conduct DIY heating experiments using 220 V household mains sockets.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
