import React, { Suspense, lazy, useState } from 'react';
import katex from 'katex';
import { Dices, RotateCcw } from 'lucide-react';
import type { TopicLabProps } from './TopicInteractiveLabs';

const MathsChapter3DCanvas = lazy(() => import('./MathsChapter3DCanvas'));

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

export function MathsRelations3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [slope, setSlope] = useState(2);
  const [shift, setShift] = useState(1);
  const inputs = [-1, 0, 1, 2];
  const outputs = inputs.map((x) => slope * x + shift);
  const isOneToOne = slope !== 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Function Machine...</div>}>
          <MathsChapter3DCanvas kind="functions" funcSlope={slope} funcShift={shift} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(`f(x) = ${slope}x ${shift >= 0 ? '+' : ''}${shift}`) }} />
          <span className="font-extrabold text-[var(--math)]">
            {isOneToOne ? 'Bijective (One-to-One & Onto)' : 'Constant Function (Many-to-One)'}
          </span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">Ch. 1 · Relations &amp; Functions Machine</div>
        <label className="block font-bold text-[var(--ink)]">
          Multiplier (m): {slope}
          <input type="range" min={-3} max={4} step={1} value={slope} onChange={(e) => { setSlope(Number(e.target.value)); onInteract(); onComplete('Explored 3D Domain→Codomain Function Mapping!'); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Constant Shift (c): {shift}
          <input type="range" min={-4} max={4} step={1} value={shift} onChange={(e) => { setShift(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {inputs.map((x, i) => (
            <div key={x} className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-center font-mono-tabular">
              <div className="text-[10px] text-[var(--text-muted)]">x = {x}</div>
              <div className="font-extrabold text-[var(--math)]">f = {outputs[i]}</div>
            </div>
          ))}
        </div>
        <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
          <strong>Key Test:</strong> Set <strong>m = 0</strong> to see all distinct inputs collapse to the same output (Many-to-One vs One-to-One!).
        </p>
      </div>
    </div>
  );
}

export function MathsSequences3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [seqType, setSeqType] = useState<'AP' | 'GP'>('AP');
  const [startA, setStartA] = useState(2);
  const [step, setStep] = useState(2);
  const [modVal, setModVal] = useState(29);
  const [modDiv, setModDiv] = useState(7);

  const n6 = seqType === 'AP' ? startA + 5 * step : startA * Math.pow(step, 5);
  const sum6 =
    seqType === 'AP'
      ? (6 / 2) * (2 * startA + 5 * step)
      : step === 1
        ? startA * 6
        : Number(((startA * (Math.pow(step, 6) - 1)) / (step - 1)).toFixed(1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D AP/GP Staircase...</div>}>
          <MathsChapter3DCanvas kind="sequences" seqType={seqType} seqStart={startA} seqStep={step} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(seqType === 'AP' ? `t_6 = a + 5d = ${n6},\\; S_6 = ${sum6}` : `t_6 = ar^5 = ${n6},\\; S_6 = ${sum6}`) }} />
          <span className="font-extrabold text-[var(--math)]">Clock Modulo: {modVal} ≡ {modVal % modDiv} (mod {modDiv})</span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="flex gap-2">
          {(['AP', 'GP'] as const).map((t) => (
            <button key={t} type="button" onClick={() => { setSeqType(t); setStep(t === 'GP' ? 2 : 3); onInteract(); onComplete('Compared 3D AP vs GP staircases & modular congruence!'); }} className={`flex-1 py-2 rounded-xl border font-bold ${seqType === t ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
              {t === 'AP' ? 'Arithmetic (AP)' : 'Geometric (GP)'}
            </button>
          ))}
        </div>
        <label className="block font-bold text-[var(--ink)]">
          First Term (a): {startA}
          <input type="range" min={1} max={10} value={startA} onChange={(e) => { setStartA(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          {seqType === 'AP' ? `Common Difference (d): ${step}` : `Common Ratio (r): ${step}`}
          <input type="range" min={1} max={seqType === 'AP' ? 8 : 3} value={step} onChange={(e) => { setStep(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
          <div className="font-extrabold text-[var(--ink)]">Euclid / Clock Modular Arithmetic</div>
          <div className="flex gap-2 items-center">
            <input type="range" min={10} max={60} value={modVal} onChange={(e) => setModVal(Number(e.target.value))} className="flex-1 accent-indigo-600" />
            <select value={modDiv} onChange={(e) => setModDiv(Number(e.target.value))} className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] font-bold">
              {[5, 7, 12].map((d) => <option key={d} value={d}>mod {d}</option>)}
            </select>
          </div>
          <div className="text-[11px] font-mono-tabular text-[var(--math)] font-bold">
            {modVal} = {Math.floor(modVal / modDiv)} × {modDiv} + <strong>{modVal % modDiv}</strong> (Remainder)
          </div>
        </div>
      </div>
    </div>
  );
}

export function MathsAlgebra3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const disc = b * b - 4 * a * c;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Quadratic Parabola...</div>}>
          <MathsChapter3DCanvas kind="algebra" quadA={a} quadB={b} quadC={c} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(`\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${disc}`) }} />
          <span className="font-extrabold text-[var(--math)]">
            {disc > 0 ? '2 Real & Unequal Roots' : disc === 0 ? 'Real & Equal Roots' : 'No Real Roots'}
          </span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">Ch. 3 · 3D Quadratic &amp; Discriminant Arena</div>
        <label className="block font-bold text-[var(--ink)]">
          Coefficient a: {a}
          <input type="range" min={-2} max={3} step={0.5} value={a} onChange={(e) => { setA(Number(e.target.value)); onInteract(); onComplete('Tested 3D parabola & discriminant root nature!'); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Coefficient b: {b}
          <input type="range" min={-6} max={6} step={1} value={b} onChange={(e) => { setB(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Constant c: {c}
          <input type="range" min={-6} max={6} step={1} value={c} onChange={(e) => { setC(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
          <strong>Observe:</strong> Glowing green spheres mark where the 3D parabola crosses the x-axis (real roots). Watch them vanish when <strong>Δ &lt; 0</strong>!
        </p>
      </div>
    </div>
  );
}

export function MathsGeometry3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [ratio, setRatio] = useState(0.55);
  const ad = Number((ratio * 10).toFixed(1));
  const db = Number(((1 - ratio) * 10).toFixed(1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Thales BPT Studio...</div>}>
          <MathsChapter3DCanvas kind="geometry" splitRatio={ratio} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(`\\frac{AD}{DB} = \\frac{${ad}}{${db}} = \\frac{AE}{EC} = ${(ad / db).toFixed(2)}`) }} />
          <span className="font-extrabold text-[var(--math)]">DE ∥ BC (Similar △ADE ∼ △ABC)</span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">Ch. 4 · Thales (BPT) &amp; Similarity Bench</div>
        <label className="block font-bold text-[var(--ink)]">
          Slide Parallel Line DE along AB: {Math.round(ratio * 100)}%
          <input type="range" min={0.25} max={0.8} step={0.05} value={ratio} onChange={(e) => { setRatio(Number(e.target.value)); onInteract(); onComplete('Verified Basic Proportionality (Thales) Theorem in 3D!'); }} className="w-full accent-[var(--math)] mt-1" />
        </label>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1.5 text-[var(--text)]">
          <div><strong>1. Thales Theorem (BPT):</strong> A line drawn parallel to one side of a triangle divides the other two sides in the exact same ratio.</div>
          <div><strong>2. Angle Bisector Theorem:</strong> Internal bisector splits opposite side in ratio of adjacent sides.</div>
          <div><strong>3. Tangent-Radius Theorem:</strong> Tangent at any point on a circle is perpendicular (90°) to the radius.</div>
        </div>
      </div>
    </div>
  );
}

export function MathsCoordinate3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [ax, setAx] = useState(-2);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(3);
  const [by, setBy] = useState(4);

  const dist = Math.hypot(bx - ax, by - ay).toFixed(2);
  const slopeStr = bx === ax ? 'Undefined (Vertical)' : ((by - ay) / (bx - ax)).toFixed(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Coordinate Grid...</div>}>
          <MathsChapter3DCanvas kind="coordinate" ptAx={ax} ptAy={ay} ptBx={bx} ptBy={by} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(`m = \\frac{y_2 - y_1}{x_2 - x_1} = ${slopeStr}`) }} />
          <span className="font-extrabold text-[var(--math)]">Distance AB = {dist} units · Midpoint ({((ax + bx) / 2).toFixed(1)}, {((ay + by) / 2).toFixed(1)})</span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">Ch. 5 · 3D Coordinate Geometry Grid</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="font-bold text-[var(--ink)]">A.x = {ax}<input type="range" min={-4} max={4} value={ax} onChange={(e) => { setAx(Number(e.target.value)); onInteract(); onComplete('Measured 3D distance, midpoint & slope!'); }} className="w-full accent-sky-500 mt-1" /></label>
          <label className="font-bold text-[var(--ink)]">A.y = {ay}<input type="range" min={-2} max={5} value={ay} onChange={(e) => { setAy(Number(e.target.value)); onInteract(); }} className="w-full accent-sky-500 mt-1" /></label>
          <label className="font-bold text-[var(--ink)]">B.x = {bx}<input type="range" min={-4} max={4} value={bx} onChange={(e) => { setBx(Number(e.target.value)); onInteract(); }} className="w-full accent-rose-500 mt-1" /></label>
          <label className="font-bold text-[var(--ink)]">B.y = {by}<input type="range" min={-2} max={5} value={by} onChange={(e) => { setBy(Number(e.target.value)); onInteract(); }} className="w-full accent-rose-500 mt-1" /></label>
        </div>
        <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
          <strong>Tip:</strong> Parallel lines share equal slope (m₁ = m₂); perpendicular lines satisfy <strong>m₁ · m₂ = −1</strong>!
        </p>
      </div>
    </div>
  );
}

export function MathsProbability3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [counts, setCounts] = useState<number[]>([2, 1, 2, 1, 2, 2]);
  const [lastRoll, setLastRoll] = useState<number | null>(6);
  const total = counts.reduce((a, b) => a + b, 0);

  const rollN = (n: number) => {
    const next = [...counts];
    let latest = 1;
    for (let i = 0; i < n; i++) {
      latest = Math.floor(Math.random() * 6) + 1;
      next[latest - 1] += 1;
    }
    setCounts(next);
    setLastRoll(latest);
    onInteract();
    if (total + n >= 15) onComplete('Tested 3D empirical probability convergence toward 1/6!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Probability Dice Arena...</div>}>
          <MathsChapter3DCanvas kind="probability" dieCounts={counts} lastRoll={lastRoll} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
          <Dices className="w-4 h-4" />
          <span>Ch. 8 · 3D Rolling Die &amp; Distribution Towers</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => rollN(1)} className="px-3.5 py-2 rounded-xl bg-[var(--math)] text-white font-bold">Roll 1×</button>
          <button type="button" onClick={() => rollN(25)} className="px-3.5 py-2 rounded-xl bg-[var(--primary)] text-white font-bold">Roll 25×</button>
          <button type="button" onClick={() => rollN(100)} className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold">Roll 100×</button>
          <button type="button" onClick={() => { setCounts([0, 0, 0, 0, 0, 0]); setLastRoll(null); }} className="px-2.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 font-mono-tabular">
          {counts.map((c, idx) => (
            <div key={idx} className={`p-2 rounded-xl border text-center ${lastRoll === idx + 1 ? 'bg-amber-500/15 border-amber-500' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              <div className="text-[10px] text-[var(--text-muted)]">Face {idx + 1}</div>
              <div className="font-extrabold text-[var(--ink)]">{total > 0 ? `${Math.round((c / total) * 100)}%` : '0%'} ({c})</div>
            </div>
          ))}
        </div>
        <div className="text-[var(--ink)] font-semibold">Total Rolls: <strong>{total}</strong> · Expected P(E) = <strong>1/6 ≈ 16.7%</strong></div>
      </div>
    </div>
  );
}
