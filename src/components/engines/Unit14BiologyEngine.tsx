import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Droplets, HeartPulse, Sprout } from 'lucide-react';
import {
  ABO_PROFILES,
  CARDIAC_CYCLE_PHASES,
  evaluateBloodTransfusion,
  type AboGroup,
  type RhFactor,
} from '../../utils/bloodCompatibility';
import type { ModularEngineProps } from './types';

const PlantTranspiration3DCanvas = lazy(() => import('./PlantTranspiration3DCanvas'));

export function Unit14BiologyEngine({
  sectionId,
  lesson,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const isPlantSection =
    sectionId.includes('transport') ||
    sectionId.includes('diffusion') ||
    sectionId.includes('osmosis') ||
    sectionId.includes('root') ||
    sectionId.includes('apoplast') ||
    sectionId.includes('symplast') ||
    sectionId.includes('transpiration') ||
    sectionId.includes('mineral') ||
    sectionId.includes('sugar') ||
    sectionId.includes('sap');

  const isBloodGroupSection = sectionId.includes('blood-groups') || sectionId.includes('lymphatic');

  const [tab, setTab] = useState<'osmosis' | 'plant' | 'cardiac' | 'blood'>(() => {
    if (sectionId.includes('osmosis') || sectionId.includes('diffusion') || sectionId.includes('active-transport')) {
      return 'osmosis';
    }
    if (isPlantSection) return 'plant';
    if (isBloodGroupSection) return 'blood';
    return 'cardiac';
  });

  // Live Interactive Osmosis & Plasmolysis Simulator state (0 = pure hypotonic water, 50 = isotonic, 100 = concentrated salt hypertonic)
  const [externalSolutePct, setExternalSolutePct] = useState(15);
  const [animTick, setAnimTick] = useState(0);

  // Plant Transport state
  const [pathway, setPathway] = useState<'apoplast' | 'symplast'>('apoplast');
  const [stomataOpen, setStomataOpen] = useState(true);
  const [phloemSeason, setPhloemSeason] = useState<'summer' | 'spring'>('summer');

  // Cardiac state
  const [phaseIdx, setPhaseIdx] = useState(0);

  // Blood group compatibility state
  const [donorGroup, setDonorGroup] = useState<AboGroup>('O');
  const [donorRh, setDonorRh] = useState<RhFactor>('-');
  const [recipientGroup, setRecipientGroup] = useState<AboGroup>('AB');
  const [recipientRh, setRecipientRh] = useState<RhFactor>('+');

  const [actionsCount, setActionsCount] = useState(0);

  // Smooth visual motion tick for particles, water flow, vapor, and heartbeat
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setAnimTick((t) => (t + 1) % 360);
    }, 65);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const bump = () => {
    onInteract();
    setActionsCount((c) => {
      const next = c + 1;
      if (next >= 3) onComplete('Science Unit 14 Biology visual simulation completed!');
      return next;
    });
  };

  const transfusion = useMemo(
    () => evaluateBloodTransfusion(donorGroup, donorRh, recipientGroup, recipientRh),
    [donorGroup, donorRh, recipientGroup, recipientRh],
  );
  const activePhase = CARDIAC_CYCLE_PHASES[phaseIdx];

  // Osmosis biology state computed dynamically from external solute concentration
  const osmosisState =
    externalSolutePct < 38
      ? {
        kind: 'Hypotonic External Solution (Endosmosis)',
        cellStatus: 'TURGID (Swollen & Firm)',
        badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/35',
        vacuoleScale: 1.0 + (38 - externalSolutePct) * 0.004,
        protoScale: 0.96,
        flowDir: 'in' as const,
        explanation:
          'Higher water potential outside! Water molecules rush INTO the plant cell across the semi-permeable plasma membrane, filling the central vacuole and pushing outward (turgor pressure).',
      }
      : externalSolutePct <= 62
        ? {
          kind: 'Isotonic Solution (Dynamic Equilibrium)',
          cellStatus: 'FLACCID (Balanced)',
          badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35',
          vacuoleScale: 0.8,
          protoScale: 0.84,
          flowDir: 'eq' as const,
          explanation:
            'Water potential is equal inside and outside. Water molecules move in and out at equal rates with zero net volume change.',
        }
        : {
          kind: 'Hypertonic Salt/Sugar Solution (Exosmosis)',
          cellStatus: 'PLASMOLYSED (Shrunken)',
          badgeClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/35',
          vacuoleScale: Math.max(0.36, 0.72 - (externalSolutePct - 62) * 0.009),
          protoScale: Math.max(0.56, 0.78 - (externalSolutePct - 62) * 0.006),
          flowDir: 'out' as const,
          explanation:
            'Lower water potential outside! Water molecules exit the vacuole across the semi-permeable membrane; the protoplasm pulls away from the rigid cell wall (plasmolysis).',
        };

  return (
    <div className="space-y-4">
      {/* Clean Visual Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5" role="tablist">
          {(
            [
              ['osmosis', 'Osmosis & Plasmolysis Lab', Droplets],
              ['plant', 'Root Path & Stomata', Sprout],
              ['cardiac', 'Cardiac Cycle (0.8s)', HeartPulse],
              ['blood', 'ABO & Rh Lab', Droplets],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                bump();
              }}
              className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition-colors ${tab === id
                  ? 'bg-[var(--science)] text-white border-[var(--science)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--science)]'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-[var(--text-muted)]">
          {lesson?.title ?? 'Unit 14 Interactive Biology Lab'}
        </span>
      </div>

      {/* TAB 1: LIVE 3D + 2D OSMOSIS & PLASMOLYSIS SIMULATOR */}
      {tab === 'osmosis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 space-y-3">
              <Suspense
                fallback={
                  <div className="h-[300px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">
                    Loading 3D Plant Cell Osmosis Cutaway...
                  </div>
                }
              >
                <PlantTranspiration3DCanvas
                  mode="osmosis"
                  externalSolutePct={externalSolutePct}
                  reducedMotion={reducedMotion}
                />
              </Suspense>
            </div>
            <div className="lg:col-span-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--science)]">
                  Control External Solute
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]">
                  {osmosisState.cellStatus}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    [10, 'Pure Water (Hypotonic)'],
                    [50, 'Balanced (Isotonic)'],
                    [88, 'Salty Water (Hypertonic)'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setExternalSolutePct(val);
                      bump();
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${Math.abs(externalSolutePct - val) <= 12
                        ? 'bg-[var(--science)] text-white border-[var(--science)]'
                        : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label className="block space-y-1.5 text-xs font-bold text-[var(--ink)]">
                <div className="flex justify-between">
                  <span>External Solute (Salt/Sugar):</span>
                  <span className="font-mono-tabular text-[var(--science)]">{externalSolutePct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={2}
                  value={externalSolutePct}
                  onChange={(e) => {
                    setExternalSolutePct(Number(e.target.value));
                    bump();
                  }}
                  className="w-full accent-[var(--science)]"
                />
              </label>

              <div className={`p-3 rounded-xl border text-xs space-y-1 ${osmosisState.badgeClass}`}>
                <div className="font-extrabold text-sm">{osmosisState.kind}</div>
                <p className="leading-relaxed text-[var(--ink)]">{osmosisState.explanation}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-slate-950 p-4 space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
              2D Cross-Section View · Semi-Permeable Membrane &amp; H₂O Molecule Flow
            </div>

            <svg
              viewBox="0 0 460 250"
              className="w-full h-[240px] rounded-xl bg-gradient-to-b from-slate-900 to-sky-950/80"
              role="img"
              aria-label={`Interactive Osmosis simulation showing a ${osmosisState.cellStatus} plant cell in a ${osmosisState.kind}`}
            >
              {/* External Solution Bath */}
              <rect
                x="10"
                y="10"
                width="440"
                height="230"
                rx="16"
                fill={`rgba(14, 116, 144, ${0.18 + (externalSolutePct / 100) * 0.25})`}
                stroke="#38bdf8"
                strokeOpacity="0.3"
              />

              {/* Solute salt/sugar amber particles outside (scales with externalSolutePct!) */}
              {Array.from({ length: Math.round(externalSolutePct / 4.5) }, (_, i) => {
                const ang = (i * 2.399) + animTick * 0.015;
                const rx = 185 + (i % 3) * 14;
                const ry = 88 + (i % 2) * 14;
                const cx = 230 + Math.cos(ang) * rx;
                const cy = 125 + Math.sin(ang) * ry;
                return (
                  <circle
                    key={`sol-${i}`}
                    cx={Math.max(24, Math.min(436, cx))}
                    cy={Math.max(24, Math.min(226, cy))}
                    r="4.2"
                    fill="#fbbf24"
                    opacity="0.88"
                  />
                );
              })}

              {/* Rigid Outer Cellulose Cell Wall (never shrinks!) */}
              <rect
                x="115"
                y="38"
                width="230"
                height="174"
                rx="28"
                fill="rgba(22, 101, 52, 0.28)"
                stroke="#22c55e"
                strokeWidth="7"
              />
              <text x="128" y="57" fill="#86efac" fontSize="10" fontWeight="bold">
                Rigid Cell Wall
              </text>

              {/* Semi-Permeable Plasma Membrane + Protoplasm (swells or pulls inward in plasmolysis!) */}
              <g
                transform={`translate(230, 125) scale(${osmosisState.protoScale}) translate(-230, -125)`}
                style={{ transition: 'transform 0.4s ease' }}
              >
                <rect
                  x="126"
                  y="49"
                  width="208"
                  height="152"
                  rx="24"
                  fill="rgba(74, 222, 128, 0.34)"
                  stroke="#fde047"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />
                {/* Central Vacuole */}
                <ellipse
                  cx="230"
                  cy="128"
                  rx={72 * osmosisState.vacuoleScale}
                  ry={48 * osmosisState.vacuoleScale}
                  fill="#0284c7"
                  fillOpacity="0.82"
                  stroke="#7dd3fc"
                  strokeWidth="2"
                  style={{ transition: 'all 0.4s ease' }}
                />
                <text x="230" y="132" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="bold">
                  Central Vacuole
                </text>
                {/* Nucleus */}
                <circle cx="155" cy="96" r="13" fill="#a855f7" stroke="#f3e8ff" strokeWidth="1.5" />
                <text x="155" y="100" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                  Nuc
                </text>
              </g>

              {/* Live Animated Blue Water Molecules Crossing Semi-Permeable Membrane */}
              {Array.from({ length: 12 }, (_, i) => {
                const side = i < 6 ? -1 : 1;
                const phase = ((animTick * 0.045) + (i % 6) * 0.17) % 1;
                let progress = phase;
                if (osmosisState.flowDir === 'out') progress = 1 - phase;
                if (osmosisState.flowDir === 'eq') progress = 0.5 + Math.sin(animTick * 0.08 + i) * 0.35;

                const startX = side === -1 ? 45 : 415;
                const endX = side === -1 ? 185 : 275;
                const wx = startX + (endX - startX) * progress;
                const wy = 68 + (i % 6) * 23;
                return (
                  <g key={`h2o-${i}`}>
                    <circle cx={wx} cy={wy} r="5.5" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1.5" />
                  </g>
                );
              })}

              {/* Legend Bar */}
              <g transform="translate(22, 224)">
                <circle cx="6" cy="0" r="4.5" fill="#38bdf8" />
                <text x="15" y="3.5" fill="#e0f2fe" fontSize="10" fontWeight="bold">Water (H₂O)</text>
                <circle cx="96" cy="0" r="4" fill="#fbbf24" />
                <text x="105" y="3.5" fill="#fef3c7" fontSize="10" fontWeight="bold">Salt/Sugar Solute</text>
                <line x1="210" y1="0" x2="232" y2="0" stroke="#fde047" strokeWidth="2.5" strokeDasharray="4 2" />
                <text x="238" y="3.5" fill="#fef08a" fontSize="10" fontWeight="bold">Semi-permeable Membrane</text>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* TAB 2: 3D + 2D ROOT WATER PATHWAY & STOMATAL GUARD CELL TRANSPIRATION LAB */}
      {tab === 'plant' && (
        <div className="space-y-4">
          <Suspense
            fallback={
              <div className="h-[300px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">
                Loading 3D Xylem &amp; Leaf Stomata Model...
              </div>
            }
          >
            <PlantTranspiration3DCanvas
              mode="transpiration"
              stomataOpen={stomataOpen}
              pathway={pathway}
              reducedMotion={reducedMotion}
            />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Interactive Root Apoplast vs Symplast Visual Diagram */}
            <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold uppercase text-[var(--science)]">
                  1. Root Water Pathway (p. 202)
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPathway('apoplast');
                      bump();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${pathway === 'apoplast'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                      }`}
                  >
                    Apoplast
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPathway('symplast');
                      bump();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${pathway === 'symplast'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                      }`}
                  >
                    Symplast
                  </button>
                </div>
              </div>

              <svg viewBox="0 0 380 145" className="w-full h-[145px] rounded-xl bg-slate-950 border border-[var(--line)]" role="img" aria-label={`Root ${pathway} water pathway diagram`}>
                {/* Root Hair -> Cortex Cells -> Endodermis (Casparian Strip) -> Xylem */}
                <rect x="14" y="42" width="52" height="58" rx="10" fill="#166534" stroke="#4ade80" strokeWidth="2" />
                <text x="40" y="74" textAnchor="middle" fill="#dcfce7" fontSize="9.5" fontWeight="bold">Root Hair</text>

                <rect x="78" y="34" width="66" height="74" rx="10" fill="#14532d" stroke="#86efac" strokeWidth="2" />
                <text x="111" y="74" textAnchor="middle" fill="#dcfce7" fontSize="9.5" fontWeight="bold">Cortex 1</text>

                <rect x="156" y="34" width="66" height="74" rx="10" fill="#14532d" stroke="#86efac" strokeWidth="2" />
                <text x="189" y="74" textAnchor="middle" fill="#dcfce7" fontSize="9.5" fontWeight="bold">Cortex 2</text>

                {/* Endodermis with Suberin Casparian Strip */}
                <rect x="234" y="30" width="52" height="82" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="260" y1="22" x2="260" y2="122" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 3" />
                <text x="260" y="135" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold">Casparian Strip</text>

                {/* Xylem Vessel */}
                <rect x="300" y="22" width="64" height="98" rx="10" fill="#7f1d1d" stroke="#f87171" strokeWidth="2.5" />
                <text x="332" y="74" textAnchor="middle" fill="#fee2e2" fontSize="10.5" fontWeight="bold">Xylem ↑</text>

                {/* Animated Water Stream Path */}
                {pathway === 'apoplast' ? (
                  <path
                    d="M25,38 L228,38 L228,68 L330,68"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4.5"
                    strokeDasharray="10 6"
                    strokeDashoffset={-animTick * 1.4}
                  />
                ) : (
                  <path
                    d="M25,72 L111,72 L189,72 L260,72 L330,72"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="4.5"
                    strokeDasharray="10 6"
                    strokeDashoffset={-animTick * 1.1}
                  />
                )}
              </svg>

              <p className="text-xs text-[var(--text)] leading-relaxed">
                {pathway === 'apoplast'
                  ? 'Apoplast (Fast): Water races through non-living cell walls until blocked by the waterproof suberin Casparian strip — forcing it through the endodermal membrane into Xylem.'
                  : 'Symplast (Controlled): Water crosses the plasma membrane and flows from cell to cell through cytoplasm & plasmodesmata.'}
              </p>
            </div>

            {/* Interactive Stomatal Guard Cells SVG Visualizer */}
            <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold uppercase text-[var(--science)]">
                  2. Stomatal Guard Cells &amp; Transpiration (p. 203)
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStomataOpen((o) => !o);
                    bump();
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[var(--primary)] text-white"
                >
                  {stomataOpen ? 'Day (Turgid OPEN)' : 'Night (Flaccid CLOSED)'}
                </button>
              </div>

              <svg viewBox="0 0 380 145" className="w-full h-[145px] rounded-xl bg-slate-950 border border-[var(--line)]" role="img" aria-label={`Stoma ${stomataOpen ? 'open during day' : 'closed at night'}`}>
                {/* Left Bean-Shaped Guard Cell */}
                <path
                  d={
                    stomataOpen
                      ? 'M186,25 C120,25 110,120 186,120 C166,100 166,45 186,25 Z'
                      : 'M189,28 C142,28 142,117 189,117 C185,95 185,50 189,28 Z'
                  }
                  fill="#16a34a"
                  stroke="#86efac"
                  strokeWidth="3"
                  style={{ transition: 'all 0.4s ease' }}
                />
                {/* Right Bean-Shaped Guard Cell */}
                <path
                  d={
                    stomataOpen
                      ? 'M194,25 C260,25 270,120 194,120 C214,100 214,45 194,25 Z'
                      : 'M191,28 C238,28 238,117 191,117 C195,95 195,50 191,28 Z'
                  }
                  fill="#16a34a"
                  stroke="#86efac"
                  strokeWidth="3"
                  style={{ transition: 'all 0.4s ease' }}
                />
                {/* Rising Water Vapor Droplets when Open */}
                {stomataOpen &&
                  [0, 1, 2, 3].map((i) => {
                    const y = 95 - (((animTick * 1.4) + i * 24) % 85);
                    return (
                      <circle
                        key={`vap-${i}`}
                        cx={184 + (i % 2) * 12}
                        cy={y}
                        r="4"
                        fill="#38bdf8"
                        opacity={Math.max(0.2, y / 95)}
                      />
                    );
                  })}
                <text x="190" y="137" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                  {stomataOpen
                    ? 'Water enters guard cells → Turgid → Stomatal Pore OPEN ↑ H₂O Vapour'
                    : 'Water leaves guard cells → Flaccid → Pore CLOSED (Water Saved)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[var(--text)]">
                  <strong>Phloem Flow:</strong>{' '}
                  {phloemSeason === 'summer' ? 'Leaf (Source) → Root/Fruit (Sink)' : 'Root (Source) → Spring Bud (Sink)'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPhloemSeason((s) => (s === 'summer' ? 'spring' : 'summer'));
                    bump();
                  }}
                  className="px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-bold"
                >
                  Switch Season ↕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ANIMATED 0.8s CARDIAC CYCLE WAVEFORM */}
      {tab === 'cardiac' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {CARDIAC_CYCLE_PHASES.map((ph, idx) => (
              <button
                key={ph.id}
                type="button"
                onClick={() => {
                  setPhaseIdx(idx);
                  bump();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-colors ${phaseIdx === idx
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                  }`}
              >
                <div className="text-[11px] font-mono-tabular opacity-85">
                  {ph.startSec.toFixed(1)}s – {ph.endSec.toFixed(1)}s ({ph.durationSec}s)
                </div>
                <div className="text-sm font-extrabold mt-0.5">{ph.title}</div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-slate-950 p-4 text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-rose-300">
                Live Cardiac Timeline · {activePhase.title} ({activePhase.heartSound})
              </span>
              <span className="font-mono-tabular text-emerald-300">72 bpm · 120/80 mm Hg</span>
            </div>
            <svg viewBox="0 0 480 86" className="w-full h-[86px]" role="img" aria-label="Cardiac cycle ECG rhythm">
              {/* Timeline segments */}
              <rect x="10" y="62" width="60" height="12" rx="4" fill={phaseIdx === 0 ? '#f43f5e' : '#334155'} />
              <rect x="74" y="62" width="180" height="12" rx="4" fill={phaseIdx === 1 ? '#f43f5e' : '#334155'} />
              <rect x="258" y="62" width="212" height="12" rx="4" fill={phaseIdx === 2 ? '#0ea5e9' : '#334155'} />
              <text x="40" y="83" textAnchor="middle" fill="#cbd5e1" fontSize="9">0.1s Atrial</text>
              <text x="164" y="83" textAnchor="middle" fill="#cbd5e1" fontSize="9">0.3s Ventricular Systole</text>
              <text x="364" y="83" textAnchor="middle" fill="#cbd5e1" fontSize="9">0.4s Joint Diastole</text>
              {/* ECG P-QRS-T trace */}
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.6"
                points="10,40 35,40 44,28 54,40 82,40 92,48 104,10 116,52 126,40 175,40 192,26 212,40 470,40"
              />
              {/* Animated heartbeat scanner dot */}
              <circle cx={10 + ((animTick * 4.5) % 460)} cy={40} r="5" fill="#fde047" />
            </svg>
            <p className="text-xs text-slate-200">{activePhase.summary} · <strong>Valves:</strong> {activePhase.valveState}</p>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE ABO BLOOD TRANSFUSION MICROSCOPE VIEW */}
      {tab === 'blood' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
            <div className="font-extrabold text-[var(--ink)] uppercase tracking-wider">
              Donor Blood Group (RBC Antigens)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['A', 'B', 'AB', 'O'] as AboGroup[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setDonorGroup(g);
                    bump();
                  }}
                  className={`px-3 py-2 rounded-xl font-bold border ${donorGroup === g
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  Group {g}
                </button>
              ))}
              {(['+', '-'] as RhFactor[]).map((rh) => (
                <button
                  key={rh}
                  type="button"
                  onClick={() => {
                    setDonorRh(rh);
                    bump();
                  }}
                  className={`px-3 py-2 rounded-xl font-bold border ${donorRh === rh
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  Rh{rh}
                </button>
              ))}
            </div>

            <div className="font-extrabold text-[var(--ink)] uppercase tracking-wider pt-2">
              Recipient Blood Group (Plasma Antibodies)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['A', 'B', 'AB', 'O'] as AboGroup[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setRecipientGroup(g);
                    bump();
                  }}
                  className={`px-3 py-2 rounded-xl font-bold border ${recipientGroup === g
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  Group {g}
                </button>
              ))}
              {(['+', '-'] as RhFactor[]).map((rh) => (
                <button
                  key={rh}
                  type="button"
                  onClick={() => {
                    setRecipientRh(rh);
                    bump();
                  }}
                  className={`px-3 py-2 rounded-xl font-bold border ${recipientRh === rh
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  Rh{rh}
                </button>
              ))}
            </div>
            <p className="text-[var(--text-muted)]">
              Donor RBC Antigens: <strong>{ABO_PROFILES[donorGroup].rbcAntigens.join(', ') || 'None'}</strong> · Recipient Plasma Antibodies:{' '}
              <strong>{ABO_PROFILES[recipientGroup].plasmaAntibodies.join(', ') || 'None'}</strong>
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3 text-xs">
            {/* Microscope Slide Visual: Flowing RBCs vs Agglutination Clumps */}
            <div className="rounded-2xl border border-[var(--line)] bg-slate-950 p-3">
              <svg viewBox="0 0 360 120" className="w-full h-[115px]" role="img" aria-label={transfusion.compatible ? 'Smooth compatible blood cells' : 'Clumped agglutinated blood cells'}>
                <rect x="0" y="0" width="360" height="120" rx="12" fill={transfusion.compatible ? '#0f172a' : '#2a0d14'} />
                {transfusion.compatible
                  ? Array.from({ length: 10 }, (_, i) => {
                    const cx = ((i * 38 + animTick * 2.2) % 340) + 10;
                    const cy = 28 + (i % 3) * 30;
                    return <ellipse key={i} cx={cx} cy={cy} rx="12" ry="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />;
                  })
                  : Array.from({ length: 9 }, (_, i) => {
                    const cx = 145 + (i % 3) * 24 + Math.sin(i) * 6;
                    const cy = 36 + Math.floor(i / 3) * 20;
                    return (
                      <g key={i}>
                        <ellipse cx={cx} cy={cy} rx="11" ry="8" fill="#dc2626" stroke="#fde047" strokeWidth="2" />
                      </g>
                    );
                  })}
                <text x="180" y="110" textAnchor="middle" fill={transfusion.compatible ? '#6ee7b7' : '#fca5a5'} fontSize="10.5" fontWeight="bold">
                  {transfusion.compatible
                    ? 'Microscope View: Smooth Free-Flowing RBCs (Safe Transfusion ✓)'
                    : 'Microscope View: Antibody-Antigen Clumping (Agglutination Risk ✗)'}
                </text>
              </svg>
            </div>

            <div
              role="status"
              className={`p-3.5 rounded-2xl border space-y-1 ${transfusion.compatible
                  ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
                  : 'bg-[var(--error-bg)] border-[var(--error)]/40 text-[var(--error)]'
                }`}
            >
              <div className="text-sm font-extrabold">
                Donor {donorGroup}
                {donorRh} → Recipient {recipientGroup}
                {recipientRh}: {transfusion.compatible ? 'COMPATIBLE ✓' : 'INCOMPATIBLE ✗'}
              </div>
              <p className="leading-relaxed">{transfusion.reason}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Interactive steps explored: {Math.min(actionsCount, 3)} / 3</span>
        {actionsCount >= 3 && (
          <span className="inline-flex items-center gap-1 font-bold text-[var(--success)]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Milestone complete</span>
          </span>
        )}
      </div>
    </div>
  );
}
