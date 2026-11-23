import React, { useState } from 'react';
import { Leaf, RotateCcw } from 'lucide-react';

interface EthyleneRipeningLab2DProps {
  onExplore: () => void;
}

const ETHYLENE_ROLES = [
  {
    id: 'ripening',
    title: '1. Fruit Ripening',
    detail: 'Promotes rapid maturation and ripening of climacteric fruits such as tomato, apple, mango, and banana (TN Science p. 232).',
  },
  {
    id: 'elongation',
    title: '2. Inhibits Elongation in Dicots',
    detail: 'Acts as a growth inhibitor by suppressing stem and root elongation in dicot plants.',
  },
  {
    id: 'senescence',
    title: '3. Hastens Senescence',
    detail: 'Speeds up ageing (senescence) of leaves and flowers by accelerating chlorophyll breakdown.',
  },
  {
    id: 'abscission',
    title: '4. Abscission Zone Formation',
    detail: 'Stimulates formation of an abscission layer at the base of leaves, flowers, and fruits, leading to shedding.',
  },
  {
    id: 'dormancy',
    title: '5. Breaks Bud & Seed Dormancy',
    detail: 'Helps break dormancy in buds, seeds, and underground storage organs under suitable cues.',
  },
];

/**
 * Science 16.1.5 — Ethylene (Gaseous Plant Hormone, TN Class 10 Science p. 232 Activity & Fig. 16.6).
 * Controlled 2D comparison of Unripe Tomatoes alone (Control) vs Unripe Tomatoes + Ripe Banana in a paper bag.
 * ZERO human neuron or brain imagery!
 */
export function EthyleneRipeningLab2D({ onExplore }: EthyleneRipeningLab2DProps) {
  const [day, setDay] = useState(0);
  const [bananaInBagB, setBananaInBagB] = useState(true);
  const [bagSealed, setBagSealed] = useState(true);
  const [activeRole, setActiveRole] = useState(ETHYLENE_ROLES[0].id);

  // Conceptual ripeness score (0 = unripe green, 1 = fully ripe red)
  const bagARipeness = Math.min(0.28, day * 0.055);
  const ethyleneBoost = bananaInBagB ? (bagSealed ? 0.2 : 0.09) : 0.055;
  const bagBRipeness = Math.min(1, day * ethyleneBoost);

  const tomatoColor = (r: number) => {
    if (r < 0.25) return { fill: '#65a30d', stroke: '#3f6212', label: 'Unripe Green' };
    if (r < 0.55) return { fill: '#eab308', stroke: '#a16207', label: 'Turning Yellow-Orange' };
    if (r < 0.8) return { fill: '#f97316', stroke: '#c2410c', label: 'Ripening Orange-Red' };
    return { fill: '#dc2626', stroke: '#991b1b', label: 'Ripe Red' };
  };

  const colA = tomatoColor(bagARipeness);
  const colB = tomatoColor(bagBRipeness);

  const handleReset = () => {
    setDay(0);
    setBananaInBagB(true);
    setBagSealed(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Controlled Two-Bag Comparison SVG */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4 overflow-x-auto">
            <svg
              viewBox="0 0 560 285"
              role="img"
              aria-labelledby="eth-title eth-desc"
              className="w-full h-auto min-w-[300px]"
            >
              <title id="eth-title">Ethylene Fruit-Ripening Controlled Bag Comparison</title>
              <desc id="eth-desc">
                Side-by-side paper bags on Day {day}. Bag A (Control) contains unripe tomatoes alone ({colA.label}).
                Bag B (Test) contains unripe tomatoes {bananaInBagB ? 'with a ripe banana releasing ethylene gas' : 'without a banana'} ({colB.label}).
              </desc>

              {/* BAG A — CONTROL */}
              <g>
                <text x="140" y="24" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                  Bag A · Control (Tomatoes Only)
                </text>
                {/* Brown Paper Bag */}
                <path d="M 55 58 L 225 58 L 238 232 L 42 232 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                {bagSealed ? (
                  <rect x="52" y="42" width="176" height="18" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="2" />
                ) : (
                  <path d="M 55 58 L 45 38 L 235 38 L 225 58" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="4 3" />
                )}
                <text x="140" y="55" textAnchor="middle" fontSize="10" fontWeight="800" fill={bagSealed ? '#ffffff' : '#92400e'}>
                  {bagSealed ? 'Rolled Closed (Sealed)' : 'Left Open (Ventilated)'}
                </text>

                {/* 3 Tomatoes in Bag A */}
                {[95, 140, 185].map((cx, i) => (
                  <g key={cx}>
                    <circle cx={cx} cy={186 - (i === 1 ? 10 : 0)} r="22" fill={colA.fill} stroke={colA.stroke} strokeWidth="2.5" />
                    <path d={`M ${cx - 6} ${164 - (i === 1 ? 10 : 0)} Q ${cx} ${158 - (i === 1 ? 10 : 0)} ${cx + 6} ${164 - (i === 1 ? 10 : 0)}`} stroke="#15803d" strokeWidth="3" fill="none" />
                  </g>
                ))}

                <rect x="52" y="244" width="176" height="28" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="140" y="262" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#334155">
                  Day {day}: {colA.label}
                </text>
              </g>

              {/* BAG B — TEST WITH RIPE BANANA */}
              <g>
                <text x="415" y="24" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                  Bag B · Test ({bananaInBagB ? 'Tomatoes + Ripe Banana' : 'No Banana Added'})
                </text>
                <path d="M 330 58 L 500 58 L 513 232 L 317 232 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                {bagSealed ? (
                  <rect x="327" y="42" width="176" height="18" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="2" />
                ) : (
                  <path d="M 330 58 L 320 38 L 510 38 L 500 58" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="4 3" />
                )}
                <text x="415" y="55" textAnchor="middle" fontSize="10" fontWeight="800" fill={bagSealed ? '#ffffff' : '#92400e'}>
                  {bagSealed ? 'Rolled Closed (Traps Gas)' : 'Left Open (Gas Escapes)'}
                </text>

                {/* Ripe Banana */}
                {bananaInBagB && (
                  <g>
                    <path
                      d="M 355 128 Q 415 92 472 132 Q 415 118 355 128 Z"
                      fill="#facc15"
                      stroke="#a16207"
                      strokeWidth="2.5"
                    />
                    <text x="415" y="100" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#854d0e">
                      Ripe Banana (Emits C₂H₄)
                    </text>

                    {/* Gaseous Ethylene Particles */}
                    {day > 0 && (
                      <g>
                        {[
                          [370, 145],
                          [415, 138],
                          [458, 148],
                          [392, 160],
                          [442, 158],
                        ].map(([gx, gy], idx) => (
                          <g key={idx}>
                            <circle
                              cx={gx}
                              cy={bagSealed ? gy : gy - 55}
                              r="5"
                              fill="#0ea5e9"
                              fillOpacity={bagSealed ? 0.85 : 0.4}
                            />
                          </g>
                        ))}
                        <text
                          x="415"
                          y={bagSealed ? 148 : 80}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="800"
                          fill="#0369a1"
                        >
                          {bagSealed ? 'Trapped Ethylene Gas (C₂H₄)' : 'C₂H₄ Gas Escaping ↑'}
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* 3 Tomatoes in Bag B */}
                {[370, 415, 460].map((cx, i) => (
                  <g key={cx}>
                    <circle cx={cx} cy={196 - (i === 1 ? 8 : 0)} r="22" fill={colB.fill} stroke={colB.stroke} strokeWidth="2.5" />
                    <path d={`M ${cx - 6} ${174 - (i === 1 ? 8 : 0)} Q ${cx} ${168 - (i === 1 ? 8 : 0)} ${cx + 6} ${174 - (i === 1 ? 8 : 0)}`} stroke="#15803d" strokeWidth="3" fill="none" />
                  </g>
                ))}

                <rect x="327" y="244" width="176" height="28" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="415" y="262" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#334155">
                  Day {day}: {colB.label}
                </text>
              </g>
            </svg>
          </div>

          {/* Conceptual Honesty Caveat */}
          <p className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-[11px] text-[var(--text-muted)]">
            <strong>Textbook Activity Model (TN Science p. 232):</strong> This is a controlled conceptual illustration of how trapped ethylene gas (C₂H₄) accelerates fruit ripening — not an empirically calibrated chemical-kinetics simulator.
          </p>
        </div>

        {/* Right: Controls + Cause->Response Ethylene Physiological Effects */}
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5">
              <Leaf className="w-4 h-4" />
              <span>Control Variables (Ethylene C₂H₄)</span>
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
              <span>Conceptual Time Elapsed:</span>
              <span className="font-mono-tabular text-emerald-700 dark:text-emerald-300">Day {day} of 5</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={day}
              onChange={(e) => { setDay(Number(e.target.value)); onExplore(); }}
              className="w-full accent-emerald-600"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setBananaInBagB((v) => !v); onExplore(); }}
              aria-pressed={bananaInBagB}
              className={`min-h-[44px] px-3 py-2 rounded-xl border font-bold ${
                bananaInBagB
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              {bananaInBagB ? 'Ripe Banana: IN Bag B' : 'Ripe Banana: REMOVED'}
            </button>
            <button
              type="button"
              onClick={() => { setBagSealed((v) => !v); onExplore(); }}
              aria-pressed={bagSealed}
              className={`min-h-[44px] px-3 py-2 rounded-xl border font-bold ${
                bagSealed
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              {bagSealed ? 'Bags: Rolled Closed' : 'Bags: Left Open'}
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--line)]">
            <div className="font-extrabold text-[var(--ink)]">
              5 Verified Physiological Effects of Ethylene (p. 232):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ETHYLENE_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setActiveRole(r.id); onExplore(); }}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg border font-bold text-[11px] ${
                    activeRole === r.id
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
            {ETHYLENE_ROLES.filter((r) => r.id === activeRole).map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
                <strong className="text-[var(--ink)]">{r.title}:</strong> {r.detail}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
