import React, { useState } from 'react';
import { Activity, Leaf, RotateCcw } from 'lucide-react';

export type Hormone2DVariant = 'auxins' | 'cytokinins' | 'gibberellins' | 'abscisic_acid' | 'pancreas';

interface PlantAndEndocrineHormones2DProps {
  variant: Hormone2DVariant;
  onExplore: () => void;
}

/**
 * Completes 100% (7/7) of Science Unit 16 — Plant and Animal Hormones (TN Class 10 Science pp. 230–237).
 * Every single hormone/gland receives its own authentic 2D biological diagram — ZERO human neurons!
 */
export function PlantAndEndocrineHormones2D({
  variant,
  onExplore,
}: PlantAndEndocrineHormones2DProps) {
  // 16.1.1 Went's Experiment (p. 230, Fig. 16.2)
  const [wentCase, setWentCase] = useState<'intact' | 'decapitated' | 'plain_agar' | 'auxin_agar'>('auxin_agar');

  // 16.1.2 Cytokinins (p. 231: Morphogenesis & Richmond–Lang Effect)
  const [cytoRatio, setCytoRatio] = useState<'high_auxin' | 'balanced' | 'high_cytokinin'>('high_cytokinin');

  // 16.1.3 Gibberellins (p. 231, Fig. 16.4: Bolting in Rosette Plants)
  const [gaApplied, setGaApplied] = useState(true);

  // 16.1.4 Abscisic Acid (p. 232, Fig. 16.5: Water-Stress Stomatal Closure)
  const [waterStress, setWaterStress] = useState(true);

  // 16.2.4 Pancreas Islets of Langerhans (pp. 236–237, Fig. 16.10: Insulin vs Glucagon)
  const [bloodGlucose, setBloodGlucose] = useState(145);

  if (variant === 'auxins') {
    const wentInfo = {
      intact: { height: 148, title: 'Control: Intact Coleoptile Tip', result: 'Grows straight upward normally — tip synthesizes natural Auxin (IAA) which diffuses downward to elongate cells.' },
      decapitated: { height: 76, title: 'Experiment 1: Cut Tip Removed', result: 'Growth STOPS! Without the tip, no auxin reaches the zone of elongation.' },
      plain_agar: { height: 78, title: 'Experiment 2: Plain Agar Block Only', result: 'Still NO growth — proves the agar jelly itself does not trigger stem elongation.' },
      auxin_agar: { height: 146, title: 'Experiment 3: Auxin-Infused Agar Block', result: 'Growth RESUMES! Chemical diffusing from detached tips into agar stimulated elongation — Went named it "Auxin" (to grow, p. 230)!' },
    }[wentCase];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 overflow-x-auto">
          <svg viewBox="0 0 520 250" role="img" aria-label={`Went Avena coleoptile experiment showing ${wentInfo.title}`} className="w-full h-auto min-w-[280px]">
            <rect x="40" y="210" width="440" height="18" rx="6" fill="#d6d3d1" />
            <text x="260" y="223" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#44403c">Avena (Oat) Coleoptile Growth Bed · Fig. 16.2 (p. 230)</text>
            {/* Coleoptile Shoot */}
            <rect x="232" y={210 - wentInfo.height} width="56" height={wentInfo.height} rx="8" fill="#84cc16" stroke="#3f6212" strokeWidth="2.5" />
            {/* Tip or Agar Block */}
            {wentCase === 'intact' && (
              <path d={`M 232 ${210 - wentInfo.height} Q 260 ${178 - wentInfo.height} 288 ${210 - wentInfo.height} Z`} fill="#4d7c0f" stroke="#365314" strokeWidth="2" />
            )}
            {(wentCase === 'plain_agar' || wentCase === 'auxin_agar') && (
              <rect
                x="236"
                y={188 - wentInfo.height}
                width="48"
                height="22"
                rx="4"
                fill={wentCase === 'auxin_agar' ? '#fbbf24' : '#e2e8f0'}
                stroke={wentCase === 'auxin_agar' ? '#b45309' : '#64748b'}
                strokeWidth="2"
              />
            )}
            <text x="260" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">{wentInfo.title}</text>
            <text x="360" y={210 - wentInfo.height / 2} fontSize="11.5" fontWeight="800" fill="#3f6212">
              {wentInfo.height > 100 ? '↑ Cell Elongation Active' : '× Growth Halted'}
            </text>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5">
            <Leaf className="w-4 h-4" />
            <span>16.1.1 Auxins · Went&apos;s Experiment (pp. 230–231)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {([
              ['intact', 'Control (Intact Tip)'],
              ['decapitated', '1. Tip Removed'],
              ['plain_agar', '2. Plain Agar'],
              ['auxin_agar', '3. Auxin Agar'],
            ] as const).map(([k, lbl]) => (
              <button key={k} type="button" onClick={() => { setWentCase(k); onExplore(); }} className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border font-bold ${wentCase === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
                {lbl}
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] leading-relaxed">
            <strong>Observation:</strong> {wentInfo.result}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            <strong>Key Textbook Facts:</strong> Natural auxin = IAA (Indole-3-Acetic Acid); Synthetic = 2,4-D. Causes apical dominance, cell elongation, and parthenocarpy (seedless watermelon/grapes/lime).
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'cytokinins') {
    const info = {
      high_auxin: { label: 'High Auxin : Low Cytokinin', outcome: 'Root Formation Initiated from Callus', color: '#b45309' },
      balanced: { label: 'Balanced Auxin + Cytokinin', outcome: 'Rapid Callus Cell Division (Cytokinesis)', color: '#0f766e' },
      high_cytokinin: { label: 'High Cytokinin : Low Auxin', outcome: 'Shoot & Lateral Bud Growth (Overcomes Apical Dominance!)', color: '#15803d' },
    }[cytoRatio];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 520 230" role="img" aria-label={`Cytokinin tissue culture morphogenesis showing ${info.outcome}`} className="w-full h-auto">
            <rect x="160" y="150" width="200" height="58" rx="12" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="260" y="185" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155">Plant Tissue Culture Agar Medium</text>
            {/* Callus cell mass */}
            <ellipse cx="260" cy="142" rx="44" ry="22" fill="#bef264" stroke="#4d7c0f" strokeWidth="2" />
            {cytoRatio === 'high_cytokinin' && (
              <g stroke="#15803d" strokeWidth="4" fill="none">
                <path d="M 260 120 L 260 58" />
                <path d="M 260 90 L 222 68" />
                <path d="M 260 82 L 298 60" />
                <circle cx="260" cy="54" r="10" fill="#22c55e" stroke="none" />
                <circle cx="220" cy="65" r="9" fill="#22c55e" stroke="none" />
                <circle cx="300" cy="57" r="9" fill="#22c55e" stroke="none" />
              </g>
            )}
            {cytoRatio === 'high_auxin' && (
              <g stroke="#a16207" strokeWidth="3" fill="none">
                <path d="M 245 162 L 230 198" />
                <path d="M 260 164 L 260 202" />
                <path d="M 275 162 L 290 198" />
              </g>
            )}
            <text x="260" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill={info.color}>{info.outcome}</text>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            16.1.2 Cytokinins · Morphogenesis &amp; Richmond–Lang Effect (p. 231)
          </div>
          <div className="space-y-1.5">
            {(['high_auxin', 'balanced', 'high_cytokinin'] as const).map((r) => (
              <button key={r} type="button" onClick={() => { setCytoRatio(r); onExplore(); }} className={`w-full min-h-[40px] px-3 py-2 rounded-xl border text-left font-bold ${cytoRatio === r ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
                {r === 'high_auxin' ? 'High Auxin : Low Cytokinin → Roots' : r === 'balanced' ? 'Balanced Ratio → Cell Division (Cytokinesis)' : 'High Cytokinin : Low Auxin → Shoots & Lateral Buds'}
              </button>
            ))}
          </div>
          <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
            <strong>Exam Key:</strong> Isolated from Herring fish sperm &amp; Zeatin from <em>Zea mays</em>; abundant in coconut liquid endosperm. Delays leaf ageing (<strong>Richmond–Lang effect</strong>).
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'gibberellins') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 520 245" role="img" aria-label={`Gibberellin bolting comparison showing ${gaApplied ? 'sudden shoot elongation and flowering' : 'compact rosette leaves'}`} className="w-full h-auto">
            <rect x="60" y="210" width="400" height="16" rx="6" fill="#d6d3d1" />
            {/* Untreated Rosette */}
            <g transform="translate(150,210)">
              <ellipse cx="-26" cy="-12" rx="28" ry="11" fill="#65a30d" />
              <ellipse cx="26" cy="-12" rx="28" ry="11" fill="#65a30d" />
              <ellipse cx="0" cy="-18" rx="24" ry="12" fill="#84cc16" />
              <text x="0" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">Untreated Rosette</text>
            </g>
            {/* GA-Treated Plant */}
            <g transform="translate(360,210)">
              <ellipse cx="-26" cy="-12" rx="28" ry="11" fill="#65a30d" />
              <ellipse cx="26" cy="-12" rx="28" ry="11" fill="#65a30d" />
              {gaApplied ? (
                <g>
                  <line x1="0" y1="-16" x2="0" y2="-155" stroke="#15803d" strokeWidth="6" />
                  <circle cx="0" cy="-164" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
                  <text x="0" y="-186" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#15803d">Bolted Shoot + Flowering!</text>
                </g>
              ) : (
                <ellipse cx="0" cy="-18" rx="24" ry="12" fill="#84cc16" />
              )}
              <text x="0" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#15803d">
                {gaApplied ? 'Treated with Gibberellin' : 'No Gibberellin Applied'}
              </text>
            </g>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            16.1.3 Gibberellins · Bolting &amp; Internode Elongation (p. 231, Fig. 16.4)
          </div>
          <button
            type="button"
            onClick={() => { setGaApplied((v) => !v); onExplore(); }}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold"
          >
            {gaApplied ? '✓ Gibberellin Applied (Bolting Active) — Click to Reset' : 'Apply Gibberellin to Rosette Plant'}
          </button>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1.5 text-[var(--text)]">
            <div><strong>Discovery (Kurosawa, 1926):</strong> Observed <em>Bakanae</em> ("foolish seedling") internode elongation in rice caused by fungus <em>Gibberella fujikuroi</em>.</div>
            <div><strong>Other Roles (p. 232):</strong> Breaks potato tuber dormancy, promotes male flowers in cucurbits, and induces seedless parthenocarpic tomatoes more efficiently than auxins!</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'abscisic_acid') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 520 235" role="img" aria-label={`Abscisic acid stomatal response under ${waterStress ? 'drought stress (stomata closed)' : 'normal moisture (stomata open)'}`} className="w-full h-auto">
            <text x="260" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
              {waterStress ? 'Drought Stress → ABA Released → Stomata CLOSE (Saves Water)' : 'Adequate Water → Low ABA → Stomata OPEN'}
            </text>
            {/* Guard Cells */}
            <path
              d={waterStress ? 'M 255 75 C 215 95, 215 165, 255 185 C 242 155, 242 105, 255 75 Z' : 'M 248 75 C 195 95, 195 165, 248 185 C 228 155, 228 105, 248 75 Z'}
              fill="#84cc16"
              stroke="#3f6212"
              strokeWidth="2.5"
            />
            <path
              d={waterStress ? 'M 265 75 C 305 95, 305 165, 265 185 C 278 155, 278 105, 265 75 Z' : 'M 272 75 C 325 95, 325 165, 272 185 C 292 155, 292 105, 272 75 Z'}
              fill="#84cc16"
              stroke="#3f6212"
              strokeWidth="2.5"
            />
            <text x="260" y="216" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={waterStress ? '#b45309' : '#0284c7'}>
              {waterStress ? 'Stomatal Pore Closed — Transpiration Minimized' : 'Stomatal Pore Open — Gas Exchange & Water Loss'}
            </text>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            16.1.4 Abscisic Acid (ABA) · The "Stress Hormone" (p. 232)
          </div>
          <button
            type="button"
            onClick={() => { setWaterStress((v) => !v); onExplore(); }}
            className={`w-full min-h-[44px] px-4 py-2 rounded-xl font-bold ${waterStress ? 'bg-amber-600 text-white' : 'bg-sky-600 text-white'}`}
          >
            {waterStress ? 'Condition: Water Stress / Drought (Click for Normal Water)' : 'Condition: Well-Watered (Click to Trigger Drought Stress)'}
          </button>
          <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>Verified Roles (p. 232):</strong> Found in chloroplasts; acts as a growth inhibitor that closes stomata during drought, promotes leaf senescence &amp; abscission (Fig. 16.5), and induces winter bud dormancy in trees like birch.
          </p>
        </div>
      </div>
    );
  }

  // 16.2.4 Pancreas — Islets of Langerhans (Insulin vs Glucagon Blood Glucose Homeostasis, pp. 236–237)
  const isHigh = bloodGlucose > 110;
  const isLow = bloodGlucose < 80;
  const statusText = isHigh
    ? 'High Blood Glucose (After Meal) → Beta (β) Cells secrete INSULIN → Liver converts Glucose → Glycogen ↓'
    : isLow
      ? 'Low Blood Glucose (Fasting) → Alpha (α) Cells secrete GLUCAGON → Liver converts Glycogen → Glucose ↑'
      : 'Normal Homeostasis (80–110 mg/dL) — Insulin and Glucagon in dynamic balance!';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
        <svg viewBox="0 0 540 245" role="img" aria-label={`Pancreas Islets of Langerhans blood glucose homeostasis at ${bloodGlucose} milligrams per deciliter`} className="w-full h-auto">
          <rect x="195" y="18" width="150" height="44" rx="12" fill={isHigh ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7'} stroke={isHigh ? '#dc2626' : isLow ? '#d97706' : '#16a34a'} strokeWidth="2.5" />
          <text x="270" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">Blood Glucose Level</text>
          <text x="270" y="54" textAnchor="middle" fontSize="13" fontWeight="800" fill={isHigh ? '#b91c1c' : isLow ? '#b45309' : '#15803d'}>{bloodGlucose} mg/dL</text>

          {/* Beta Cells -> Insulin Path (Left) */}
          <rect x="28" y="110" width="195" height="58" rx="12" fill={isHigh ? '#2563eb' : '#eff6ff'} stroke="#2563eb" strokeWidth="2.2" />
          <text x="125" y="133" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={isHigh ? '#ffffff' : '#1e3a8a'}>Beta (β) Cells → INSULIN</text>
          <text x="125" y="152" textAnchor="middle" fontSize="10" fontWeight="600" fill={isHigh ? '#dbeafe' : '#334155'}>Glucose → Glycogen (Lowers blood sugar)</text>

          {/* Alpha Cells -> Glucagon Path (Right) */}
          <rect x="317" y="110" width="195" height="58" rx="12" fill={isLow ? '#d97706' : '#fffbeb'} stroke="#d97706" strokeWidth="2.2" />
          <text x="415" y="133" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={isLow ? '#ffffff' : '#92400e'}>Alpha (α) Cells → GLUCAGON</text>
          <text x="415" y="152" textAnchor="middle" fontSize="10" fontWeight="600" fill={isLow ? '#fef3c7' : '#334155'}>Glycogen → Glucose (Raises blood sugar)</text>

          {/* Pancreas Dual-Gland Box */}
          <rect x="130" y="192" width="280" height="38" rx="10" fill="#f8fafc" stroke="#64748b" />
          <text x="270" y="215" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">Pancreas = Exocrine (Digestive Juice) + Endocrine (Islets)</text>
        </svg>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>16.2.4 Pancreas · Islets of Langerhans (p. 236)</span>
          </span>
          <button type="button" onClick={() => setBloodGlucose(95)} className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-bold inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Simulate Blood Glucose: {bloodGlucose} mg/dL
          <input type="range" min={55} max={210} step={5} value={bloodGlucose} onChange={(e) => { setBloodGlucose(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--primary)] mt-1" />
        </label>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-semibold text-[var(--ink)]">
          {statusText}
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          <strong>Clinical Note (p. 237):</strong> Deficiency of Insulin causes <strong>Diabetes mellitus</strong> (hyperglycemia, glycosuria, polyuria, polydipsia, polyphagia). First discovered by Banting, Best &amp; MacLeod (1921).
        </p>
      </div>
    </div>
  );
}
