import React, { Suspense, lazy, useMemo, useState } from 'react';
import katex from 'katex';
import { Beaker, CheckCircle2, FlaskConical, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import {
  LAB_REAGENTS,
  UNIT10_REACTIONS,
  evaluateAtomConservation,
  mixCustomReagents,
  type LabReagentId,
  type ReactionCategory,
} from '../../utils/chemistrySimulations';
import type { ModularEngineProps } from './types';

const ChemistryMixingLab3DCanvas = lazy(() => import('./ChemistryMixingLab3DCanvas'));

const PREDICTION_CATEGORIES: ReactionCategory[] = [
  'Combination Reaction',
  'Thermal Decomposition Reaction',
  'Single Displacement Reaction',
  'Double Displacement (Precipitation)',
  'Double Displacement (Neutralization)',
  'No Reaction (Activity Series Limit)',
];

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

export function ReactionLabEngine({
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const [labMode, setLabMode] = useState<'free_mix' | 'guided_balance'>('free_mix');
  const [reagentA, setReagentA] = useState<LabReagentId>('PbNO3_2');
  const [reagentB, setReagentB] = useState<LabReagentId>('KI');
  const [customMixed, setCustomMixed] = useState(false);
  const [mixCount, setMixCount] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});

  const triggerPourMix = () => {
    setCustomMixed(true);
    onInteract();
    const pairKey = [reagentA, reagentB].sort().join('+');
    setCompletedMissions((prev) => {
      const next = { ...prev };
      if (pairKey === ['KI', 'PbNO3_2'].sort().join('+')) next.precipitate = true;
      if (pairKey === ['HCl', 'Zn'].sort().join('+')) next.zinc_bubbles = true;
      if (pairKey === ['Cu', 'HCl'].sort().join('+')) next.copper_limit = true;
      if (pairKey === ['HCl', 'NaOH'].sort().join('+')) next.neutralize = true;
      if (pairKey === ['CaCO3', 'Heat'].sort().join('+')) next.thermal = true;
      return next;
    });
    setMixCount((c) => {
      const next = c + 1;
      if (next >= 2) {
        onComplete('Ran 2+ hands-on 3D chemistry mixing experiments!');
      }
      return next;
    });
  };

  const [reactionIdx, setReactionIdx] = useState(0);
  const reaction = UNIT10_REACTIONS[reactionIdx];

  const [predicted, setPredicted] = useState<string>('');
  const [executed, setExecuted] = useState(false);

  const customOutcome = useMemo(() => mixCustomReagents(reagentA, reagentB), [reagentA, reagentB]);
  const regAMeta = LAB_REAGENTS.find((r) => r.id === reagentA) ?? LAB_REAGENTS[0];
  const regBMeta = LAB_REAGENTS.find((r) => r.id === reagentB) ?? LAB_REAGENTS[1];
  const show3D = mode !== '2d_text';

  // Start intentionally unbalanced (all 1s) when feasible so the student balances coefficients!
  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>(() =>
    reaction.reactants.map(() => 1),
  );
  const [productCoeffs, setProductCoeffs] = useState<number[]>(() =>
    reaction.products.map(() => 1),
  );

  const selectReaction = (idx: number) => {
    const next = UNIT10_REACTIONS[idx];
    setReactionIdx(idx);
    setPredicted('');
    setExecuted(false);
    setReactantCoeffs(next.reactants.map(() => 1));
    setProductCoeffs(next.products.map(() => 1));
    onInteract();
  };

  const conservation = useMemo(
    () => evaluateAtomConservation(reaction, reactantCoeffs, productCoeffs),
    [reaction, reactantCoeffs, productCoeffs],
  );

  const updateCoeff = (side: 'r' | 'p', idx: number, delta: -1 | 1) => {
    onInteract();
    if (side === 'r') {
      const next = reactantCoeffs.map((c, i) =>
        i === idx ? Math.max(1, Math.min(4, c + delta)) : c,
      );
      setReactantCoeffs(next);
      const check = evaluateAtomConservation(reaction, next, productCoeffs);
      if (executed && check.balanced) {
        onComplete(`Balanced ${reaction.title} — conservation of atoms confirmed!`);
      }
    } else {
      const next = productCoeffs.map((c, i) =>
        i === idx ? Math.max(1, Math.min(4, c + delta)) : c,
      );
      setProductCoeffs(next);
      const check = evaluateAtomConservation(reaction, reactantCoeffs, next);
      if (executed && check.balanced) {
        onComplete(`Balanced ${reaction.title} — conservation of atoms confirmed!`);
      }
    }
  };

  const equationLatex = useMemo(() => {
    const lhs = reaction.reactants
      .map((sp, i) => `${reactantCoeffs[i] > 1 ? reactantCoeffs[i] : ''}${sp.latex}`)
      .join(' + ');
    if (!reaction.feasible) {
      return `${lhs} \\not\\rightarrow \\text{No Reaction (Cl}_2\\text{ cannot displace F}^-\\text{)}`;
    }
    const rhs = reaction.products
      .map((sp, i) => `${productCoeffs[i] > 1 ? productCoeffs[i] : ''}${sp.latex}`)
      .join(' + ');
    const arrow = reaction.conditionLabel
      ? `\\xrightarrow{\\text{${reaction.conditionLabel}}}`
      : '\\rightarrow';
    return `${lhs} ${arrow} ${rhs}`;
  }, [reaction, reactantCoeffs, productCoeffs]);

  return (
    <div className="space-y-5">
      {/* Safety Boundary Banner */}
      <div className="p-3.5 rounded-[14px] bg-[var(--warning-bg)] border border-[var(--warning)]/35 text-xs sm:text-sm text-[var(--ink)] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[var(--warning)] shrink-0 mt-0.5" />
        <span>
          <strong>Safe Conceptual 3D Lab Simulation Only:</strong> {reaction.safetyBoundary}
        </span>
      </div>

      {/* Mode Switcher: 3D Free-Mix Chemistry Sandbox vs Guided Equation Balancer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Chemistry lab bench mode"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]"
        >
          <button
            type="button"
            onClick={() => {
              setLabMode('free_mix');
              onInteract();
            }}
            aria-pressed={labMode === 'free_mix'}
            className={`px-4 py-2 min-h-[42px] rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors ${labMode === 'free_mix'
                ? 'bg-[var(--science)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
              }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>3D Free-Mix Lab Bench</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLabMode('guided_balance');
              onInteract();
            }}
            aria-pressed={labMode === 'guided_balance'}
            className={`px-4 py-2 min-h-[42px] rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors ${labMode === 'guided_balance'
                ? 'bg-[var(--science)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
              }`}
          >
            <Beaker className="w-4 h-4" />
            <span>Guided Equation Balancer (6 Reactions)</span>
          </button>
        </div>
      </div>

      {/* 3D INTERACTIVE MIXING SANDBOX BENCH */}
      {labMode === 'free_mix' && (
        <div className="p-5 rounded-[20px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 space-y-3">
              {show3D ? (
                <Suspense
                  fallback={
                    <div className="h-[310px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                      Loading 3D Chemistry Mixing Bench...
                    </div>
                  }
                >
                  <ChemistryMixingLab3DCanvas
                    reagentALabel={regAMeta.formula}
                    reagentAColor={regAMeta.colorHex}
                    reagentBLabel={regBMeta.formula}
                    reagentBColor={regBMeta.colorHex}
                    isMixed={customMixed}
                    visualEffect={customOutcome.visualEffect}
                    liquidColorHex={customOutcome.liquidColorHex}
                    reducedMotion={reducedMotion}
                    onClickPour={triggerPourMix}
                  />
                </Suspense>
              ) : (
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2 text-xs">
                  <div className="font-bold text-[var(--primary)]">2D / Text Chemistry Bench Mode Active</div>
                  <p className="text-[var(--text)]">
                    Selected Pair: <strong>{regAMeta.name} ({regAMeta.formula})</strong> +{' '}
                    <strong>{regBMeta.name} ({regBMeta.formula})</strong>
                  </p>
                </div>
              )}

              {/* Interactive Lab Mission Tracker (Game-Like Discovery Goals) */}
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[var(--science)]">
                  <span>Lab Missions · Discover by Mixing</span>
                  <span>{Object.keys(completedMissions).length} / 5 Cleared</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {(
                    [
                      ['precipitate', '1. Golden Rain (PbI₂)', 'PbNO3_2', 'KI'],
                      ['zinc_bubbles', '2. Hydrogen Fizz (Zn+HCl)', 'Zn', 'HCl'],
                      ['copper_limit', '3. Why Cu Won’t Fizz', 'Cu', 'HCl'],
                      ['neutralize', '4. Neutralize Acid+Base', 'NaOH', 'HCl'],
                      ['thermal', '5. Heat Limestone (Δ)', 'CaCO3', 'Heat'],
                    ] as [string, string, LabReagentId, LabReagentId][]
                  ).map(([id, label, a, b]) => {
                    const done = completedMissions[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setReagentA(a);
                          setReagentB(b);
                          setCustomMixed(false);
                          onInteract();
                        }}
                        className={`px-2.5 py-1 rounded-lg border font-bold transition-colors ${
                          done
                            ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--success)]'
                            : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--science)]'
                        }`}
                      >
                        {done ? '★ ' : '○ '}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="space-y-1">
                  <span className="font-bold text-[var(--ink)] block">Beaker A (Left)</span>
                  <select
                    value={reagentA}
                    onChange={(e) => {
                      setReagentA(e.target.value as LabReagentId);
                      setCustomMixed(false);
                      onInteract();
                    }}
                    className="w-full min-h-[42px] px-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold"
                  >
                    {LAB_REAGENTS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.formula} — {r.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="font-bold text-[var(--ink)] block">Beaker B (Right)</span>
                  <select
                    value={reagentB}
                    onChange={(e) => {
                      setReagentB(e.target.value as LabReagentId);
                      setCustomMixed(false);
                      onInteract();
                    }}
                    className="w-full min-h-[42px] px-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold"
                  >
                    {LAB_REAGENTS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.formula} — {r.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={triggerPourMix}
                  className="flex-1 min-h-[48px] px-5 py-2.5 rounded-[12px] bg-[var(--science)] hover:opacity-95 text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{customMixed ? 'Pour Again / Try New Pair' : 'Pick Up & Pour in 3D!'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomMixed(false)}
                  className="min-h-[48px] px-3.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--text-muted)] inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rinse</span>
                </button>
              </div>

              {customMixed && (
                <div
                  role="status"
                  className={`p-4 rounded-2xl border space-y-1.5 text-xs ${customOutcome.occurs
                      ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
                      : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'
                    }`}
                >
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                    {customOutcome.category}
                  </div>
                  <div className="font-mono-tabular text-sm font-extrabold text-[var(--ink)]">
                    {customOutcome.equation}
                  </div>
                  <p className="font-semibold">{customOutcome.observation}</p>
                  <p className="text-[var(--text)] leading-relaxed">
                    <strong>Why (No Memorising!):</strong> {customOutcome.whyItHappens}
                  </p>
                </div>
              )}

              <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                <span>Experiments mixed: {mixCount} / 2</span>
                {mixCount >= 2 && (
                  <span className="font-bold text-[var(--success)] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lab milestone complete
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approved Textbook Reaction Selector (Guided Balancer Mode) */}
      {labMode === 'guided_balance' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-[var(--science)]">
              Choose an Approved Class 10 Unit 10 Reaction (pp. 139–143)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {UNIT10_REACTIONS.map((rxn, idx) => (
                <button
                  key={rxn.id}
                  type="button"
                  onClick={() => selectReaction(idx)}
                  aria-pressed={reactionIdx === idx}
                  className={`p-3 min-h-[48px] rounded-xl border text-left transition-colors ${reactionIdx === idx
                      ? 'bg-[var(--science)] text-white border-[var(--science)] font-bold'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--science)] font-semibold'
                    }`}
                >
                  <div className="text-xs sm:text-sm leading-snug">{rxn.title}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${reactionIdx === idx ? 'text-white/85' : 'text-[var(--text-muted)]'
                      }`}
                  >
                    Book p. {rxn.textbookPage} · {rxn.feasible ? rxn.energyProfile.split(' ')[0] : 'Reactivity Test'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Virtual Bench + Step 1 Predict */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)]">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Step 1 — Predict the Outcome (Ungraded)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PREDICTION_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setPredicted(cat);
                        onInteract();
                      }}
                      aria-pressed={predicted === cat}
                      className={`px-3 py-1.5 min-h-[38px] rounded-lg border text-xs font-semibold transition-colors ${predicted === cat
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                          : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setExecuted(true);
                    onInteract();
                    if (!reaction.feasible || conservation.balanced) {
                      onComplete(`Ran virtual experiment for ${reaction.title}!`);
                    }
                  }}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--science)] text-white text-sm font-bold inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Step 2 — Run Virtual Reaction</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectReaction(reactionIdx)}
                  className="px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset bench</span>
                </button>
              </div>

              {/* Live Balanced / Unbalanced Equation Box */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
                <div className="text-xs font-bold text-[var(--text-muted)]">
                  Chemical Equation (with physical states):
                </div>
                <div
                  className="text-base sm:text-lg overflow-x-auto py-1"
                  dangerouslySetInnerHTML={{ __html: renderLatex(equationLatex) }}
                />
              </div>

              {/* Observation & Explanation Output */}
              {executed && (
                <div
                  role="status"
                  className={`p-4 rounded-xl border space-y-2 text-sm ${!reaction.feasible
                      ? 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'
                      : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)]'
                    }`}
                >
                  <p className="font-extrabold">
                    Classification: {reaction.category}{' '}
                    {predicted &&
                      (predicted === reaction.category
                        ? '✓ (Your prediction matched!)'
                        : `(You predicted: ${predicted})`)}
                  </p>
                  <p className="text-[var(--text)]">
                    <strong>Observed Change:</strong> {reaction.observation}
                  </p>
                  <p className="text-[var(--text)]">
                    <strong>Why:</strong> {reaction.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Visual Reaction Vessel SVG */}
            <div className="lg:col-span-5 bg-[var(--surface)] rounded-[16px] border border-[var(--line)] p-4 flex flex-col items-center justify-center space-y-3">
              <svg
                viewBox="0 0 260 210"
                className="w-full max-w-[250px] h-auto"
                role="img"
                aria-label={`Virtual reaction vessel for ${reaction.title}. Status: ${executed ? reaction.observation : 'Awaiting reaction run'
                  }`}
              >
                {/* Bench Base */}
                <rect x="20" y="182" width="220" height="10" rx="5" fill="#CBD5E1" />
                {/* Beaker Body */}
                <path
                  d="M72,50 L72,170 Q72,182 86,182 L174,182 Q188,182 188,170 L188,50"
                  fill="#F8FAFC"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <line x1="65" y1="50" x2="195" y2="50" stroke="#334155" strokeWidth="3" />

                {/* Liquid / Contents */}
                <path
                  d="M75,115 L185,115 L185,170 Q185,179 174,179 L86,179 Q75,179 75,170 Z"
                  fill={
                    !executed
                      ? '#E0F2FE'
                      : reaction.visualEffect === 'yellow_precipitate'
                        ? '#FEF08A'
                        : reaction.visualEffect === 'no_change'
                          ? '#E2E8F0'
                          : '#CCFBF1'
                  }
                />

                {/* Yellow Precipitate Deposit */}
                {executed && reaction.visualEffect === 'yellow_precipitate' && (
                  <ellipse cx="130" cy="171" rx="46" ry="9" fill="#EAB308" />
                )}

                {/* Gas Bubbles */}
                {executed && reaction.visualEffect === 'gas_release' && (
                  <g fill="#0284C7" opacity="0.75">
                    <circle cx="108" cy="145" r="5" />
                    <circle cx="132" cy="128" r="6" />
                    <circle cx="152" cy="152" r="4.5" />
                    <circle cx="122" cy="96" r="5" />
                    <circle cx="144" cy="82" r="4" />
                  </g>
                )}

                {/* Heat indicator for thermal decomposition */}
                {reaction.conditionLabel && (
                  <g>
                    <path d="M118,196 Q130,176 142,196 Z" fill={executed ? '#EA580C' : '#94A3B8'} />
                    <text x="150" y="198" fill="#9A3412" fontSize="10" fontWeight="bold">
                      Δ Heat
                    </text>
                  </g>
                )}

                <text x="130" y="34" textAnchor="middle" fill="var(--ink)" fontSize="11.5" fontWeight="bold">
                  {executed ? reaction.energyProfile : 'Reactants ready in vessel'}
                </text>
              </svg>
            </div>
          </div>

          {/* Step 3: Interactive Stoichiometric Coefficient Balancer & Particle Conservation */}
          {reaction.feasible && (
            <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--science)]">
                    Step 3 — Balance Atoms (Law of Conservation of Matter)
                  </div>
                  <h4 className="text-base font-extrabold text-[var(--ink)]">
                    Adjust coefficients until reactant and product atom counts match for every element
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${conservation.balanced
                      ? 'bg-[var(--success-bg)] text-[var(--success)]'
                      : 'bg-[var(--warning-bg)] text-[var(--warning)]'
                    }`}
                >
                  {conservation.balanced ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Balanced — Atoms Conserved!</span>
                    </>
                  ) : (
                    <span>Unbalanced — Adjust coefficients below</span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reactant Coefficient Controls */}
                <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Reactants (Left Side)
                  </div>
                  {reaction.reactants.map((sp, i) => (
                    <div
                      key={sp.formula}
                      className="flex items-center justify-between gap-2 bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--line)]"
                    >
                      <div>
                        <div className="text-sm font-bold text-[var(--ink)]">{sp.name}</div>
                        <div className="text-xs font-mono-tabular text-[var(--text-muted)]">
                          {sp.formula} ({sp.phase})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCoeff('r', i, -1)}
                          aria-label={`Decrease coefficient of ${sp.name}`}
                          className="w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] font-extrabold text-sm"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-mono-tabular font-extrabold text-[var(--ink)]">
                          {reactantCoeffs[i]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCoeff('r', i, 1)}
                          aria-label={`Increase coefficient of ${sp.name}`}
                          className="w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] font-extrabold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Product Coefficient Controls */}
                <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Products (Right Side)
                  </div>
                  {reaction.products.map((sp, i) => (
                    <div
                      key={sp.formula}
                      className="flex items-center justify-between gap-2 bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--line)]"
                    >
                      <div>
                        <div className="text-sm font-bold text-[var(--ink)]">{sp.name}</div>
                        <div className="text-xs font-mono-tabular text-[var(--text-muted)]">
                          {sp.formula} ({sp.phase})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCoeff('p', i, -1)}
                          aria-label={`Decrease coefficient of ${sp.name}`}
                          className="w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] font-extrabold text-sm"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-mono-tabular font-extrabold text-[var(--ink)]">
                          {productCoeffs[i]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCoeff('p', i, 1)}
                          aria-label={`Increase coefficient of ${sp.name}`}
                          className="w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] font-extrabold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Element-by-Element Particle Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {conservation.elements.map((el) => (
                  <div
                    key={el.symbol}
                    className={`p-3 rounded-xl border text-center space-y-1 ${el.matches
                        ? 'bg-[var(--success-bg)] border-[var(--success)]/40'
                        : 'bg-[var(--warning-bg)] border-[var(--warning)]/40'
                      }`}
                  >
                    <div className="text-base font-extrabold text-[var(--ink)]">{el.symbol}</div>
                    <div className="text-xs font-mono-tabular font-bold text-[var(--text)]">
                      LHS {el.reactantCount} {el.matches ? '=' : '≠'} RHS {el.productCount}
                    </div>
                    <div className="text-[11px] font-semibold">
                      {el.matches ? '✓ Conserved' : 'Not equal'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
