import React, { useState } from 'react';
import katex from 'katex';
import { Dices, RotateCcw } from 'lucide-react';
import type { TopicLabProps } from './TopicInteractiveLabs';

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

/**
 * Ch. 1 Relations & Functions — Crisp Interactive 2D Arrow-Mapping Diagram (0% decorative 3D)
 */
export function MathsRelations3DLab({ onInteract, onComplete }: TopicLabProps) {
  const [slope, setSlope] = useState(2);
  const [shift, setShift] = useState(1);
  const inputs = [-1, 0, 1, 2];
  const outputs = inputs.map((x) => slope * x + shift);
  const uniqueOutputs = Array.from(new Set(outputs));
  const isOneToOne = slope !== 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <svg viewBox="0 0 460 220" className="w-full h-auto" role="img" aria-label="Interactive 2D Domain to Codomain arrow mapping diagram">
            <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill="#13213A">
              2D Arrow Diagram · f(x) = {slope}x {shift >= 0 ? `+ ${shift}` : `− ${Math.abs(shift)}`}
            </text>
            {/* Domain Oval */}
            <ellipse cx="110" cy="122" rx="64" ry="82" fill="#F0ECFC" stroke="#7155C8" strokeWidth="2.5" />
            <text x="110" y="54" textAnchor="middle" fontSize="11" fontWeight="800" fill="#7155C8">Domain (X)</text>
            {/* Codomain Oval */}
            <ellipse cx="350" cy="122" rx="64" ry="82" fill="#E8F6F4" stroke="#0B7773" strokeWidth="2.5" />
            <text x="350" y="54" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0B7773">Range f(X)</text>

            {inputs.map((x, idx) => {
              const yIn = 78 + idx * 34;
              const outVal = outputs[idx];
              const outIdx = uniqueOutputs.indexOf(outVal);
              const yOut = uniqueOutputs.length === 1 ? 125 : 78 + outIdx * (102 / Math.max(1, uniqueOutputs.length - 1));
              return (
                <g key={x}>
                  <line x1="138" y1={yIn} x2="318" y2={yOut} stroke="#7155C8" strokeWidth="2.2" />
                  <circle cx="110" cy={yIn} r="13" fill="#FFFFFF" stroke="#7155C8" strokeWidth="2" />
                  <text x="110" y={yIn + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#13213A">{x}</text>
                </g>
              );
            })}
            {uniqueOutputs.map((val, outIdx) => {
              const yOut = uniqueOutputs.length === 1 ? 125 : 78 + outIdx * (102 / Math.max(1, uniqueOutputs.length - 1));
              return (
                <g key={val}>
                  <circle cx="350" cy={yOut} r="14" fill="#FFFFFF" stroke="#0B7773" strokeWidth="2" />
                  <text x="350" y={yOut + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#13213A">{val}</text>
                </g>
              );
            })}
          </svg>
        </div>
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
          <input type="range" min={-3} max={4} step={1} value={slope} onChange={(e) => { setSlope(Number(e.target.value)); onInteract(); onComplete('Explored 2D Domain→Codomain Function Mapping!'); }} className="w-full accent-[var(--math)] mt-1" />
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
          <strong>Key Test:</strong> Set <strong>m = 0</strong> to watch all four arrows collapse to one single range value (Many-to-One vs. One-to-One!).
        </p>
      </div>
    </div>
  );
}

/**
 * Ch. 2 Numbers & Sequences — Crisp Interactive 2D AP/GP Growth Bars & Modulo Clock
 */
export function MathsSequences3DLab({ onInteract, onComplete }: TopicLabProps) {
  const [seqType, setSeqType] = useState<'AP' | 'GP'>('AP');
  const [startA, setStartA] = useState(2);
  const [step, setStep] = useState(2);
  const [modVal, setModVal] = useState(29);
  const [modDiv, setModDiv] = useState(7);

  const terms = Array.from({ length: 6 }, (_, i) =>
    seqType === 'AP' ? startA + i * step : startA * Math.pow(step, i),
  );
  const maxTerm = Math.max(...terms, 1);
  const n6 = terms[5];
  const sum6 = terms.reduce((acc, v) => acc + v, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <svg viewBox="0 0 460 220" className="w-full h-auto" role="img" aria-label={`2D ${seqType} sequence bar chart`}>
            <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill="#13213A">
              {seqType === 'AP' ? 'Arithmetic Progression (Linear Steps +d)' : 'Geometric Progression (Exponential ×r)'}
            </text>
            <line x1="36" y1="184" x2="432" y2="184" stroke="#94A3B8" strokeWidth="2" />
            {terms.map((val, idx) => {
              const barH = Math.max(14, Math.round((val / maxTerm) * 135));
              const x = 52 + idx * 62;
              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={184 - barH}
                    width="42"
                    height={barH}
                    rx="7"
                    fill={seqType === 'AP' ? '#7155C8' : '#0B7773'}
                    fillOpacity={0.25 + idx * 0.14}
                    stroke={seqType === 'AP' ? '#7155C8' : '#0B7773'}
                    strokeWidth="2"
                  />
                  <text x={x + 21} y={178 - barH} textAnchor="middle" fontSize="11" fontWeight="800" fill="#13213A">{val}</text>
                  <text x={x + 21} y="202" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#4E5F76">t{idx + 1}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(seqType === 'AP' ? `t_6 = a + 5d = ${n6},\\; S_6 = ${sum6}` : `t_6 = ar^5 = ${n6},\\; S_6 = ${sum6}`) }} />
          <span className="font-extrabold text-[var(--math)]">Clock Modulo: {modVal} ≡ {modVal % modDiv} (mod {modDiv})</span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="flex gap-2">
          {(['AP', 'GP'] as const).map((t) => (
            <button key={t} type="button" onClick={() => { setSeqType(t); setStep(t === 'GP' ? 2 : 3); onInteract(); onComplete('Compared 2D AP vs GP growth & modular congruence!'); }} className={`flex-1 py-2 rounded-xl border font-bold ${seqType === t ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
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

/**
 * Ch. 3 Algebra — Crisp 2D Quadratic Parabola & Real Root Plotter
 */
export function MathsAlgebra3DLab({ onInteract, onComplete }: TopicLabProps) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const disc = b * b - 4 * a * c;
  const realRoots =
    a !== 0 && disc >= 0
      ? disc === 0
        ? [-b / (2 * a)]
        : [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)]
      : [];

  const points = Array.from({ length: 81 }, (_, idx) => {
    const x = -6 + idx * 0.15;
    const y = a * x * x + b * x + c;
    const px = 220 + x * 30;
    const py = 120 - y * 14;
    return `${px.toFixed(1)},${Math.max(8, Math.min(232, py)).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <svg viewBox="0 0 440 240" className="w-full h-auto" role="img" aria-label="2D quadratic parabola and x-intercept roots graph">
            {/* Grid */}
            {[-4, -2, 2, 4].map((g) => (
              <g key={g} stroke="#E2E8F0" strokeWidth="1">
                <line x1={220 + g * 30} y1="10" x2={220 + g * 30} y2="230" />
                <line x1="15" y1={120 - g * 14} x2="425" y2={120 - g * 14} />
              </g>
            ))}
            <line x1="15" y1="120" x2="425" y2="120" stroke="#475569" strokeWidth="1.8" />
            <line x1="220" y1="10" x2="220" y2="230" stroke="#475569" strokeWidth="1.8" />
            <polyline fill="none" stroke="#7155C8" strokeWidth="3" points={points} />
            {realRoots.map((r, i) => (
              <g key={i}>
                <circle cx={220 + r * 30} cy="120" r="6" fill="#137B55" stroke="#FFFFFF" strokeWidth="2" />
                <text x={220 + r * 30} y="108" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#137B55">
                  x={r.toFixed(1)}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(`\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${disc}`) }} />
          <span className="font-extrabold text-[var(--math)]">
            {disc > 0 ? '2 Real & Unequal Roots' : disc === 0 ? 'Real & Equal Roots' : 'No Real Roots'}
          </span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">Ch. 3 · 2D Quadratic &amp; Discriminant Workbench</div>
        <label className="block font-bold text-[var(--ink)]">
          Coefficient a: {a}
          <input type="range" min={-2} max={3} step={0.5} value={a} onChange={(e) => { setA(Number(e.target.value)); onInteract(); onComplete('Tested 2D parabola & discriminant root nature!'); }} className="w-full accent-[var(--math)] mt-1" />
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
          <strong>Observe:</strong> Green root dots mark exact x-intercepts where f(x) = 0. Watch both vanish when <strong>Δ &lt; 0</strong>!
        </p>
      </div>
    </div>
  );
}

/**
 * Ch. 5 Coordinate Geometry — Crisp 2D Cartesian Plane (Distance, Midpoint & Slope)
 */
export function MathsCoordinate3DLab({ onInteract, onComplete }: TopicLabProps) {
  const [ax, setAx] = useState(-2);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(3);
  const [by, setBy] = useState(4);

  const dist = Math.hypot(bx - ax, by - ay).toFixed(2);
  const slopeStr = bx === ax ? 'Undefined (Vertical)' : ((by - ay) / (bx - ax)).toFixed(2);
  const toX = (x: number) => 220 + x * 36;
  const toY = (y: number) => 170 - y * 24;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <svg viewBox="0 0 440 230" className="w-full h-auto" role="img" aria-label="2D Cartesian coordinate distance and slope plane">
            {[-4, -2, 0, 2, 4].map((x) => (
              <line key={`vx-${x}`} x1={toX(x)} y1="15" x2={toX(x)} y2="215" stroke={x === 0 ? '#475569' : '#E2E8F0'} strokeWidth={x === 0 ? 1.8 : 1} />
            ))}
            {[-2, 0, 2, 4].map((y) => (
              <line key={`hy-${y}`} x1="25" y1={toY(y)} x2="415" y2={toY(y)} stroke={y === 0 ? '#475569' : '#E2E8F0'} strokeWidth={y === 0 ? 1.8 : 1} />
            ))}
            {/* Rise / Run Right Triangle */}
            <line x1={toX(ax)} y1={toY(ay)} x2={toX(bx)} y2={toY(ay)} stroke="#94A3B8" strokeWidth="1.8" strokeDasharray="4,4" />
            <line x1={toX(bx)} y1={toY(ay)} x2={toX(bx)} y2={toY(by)} stroke="#94A3B8" strokeWidth="1.8" strokeDasharray="4,4" />
            <line x1={toX(ax)} y1={toY(ay)} x2={toX(bx)} y2={toY(by)} stroke="#7155C8" strokeWidth="3" />
            <circle cx={toX(ax)} cy={toY(ay)} r="6.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx={toX(bx)} cy={toY(by)} r="6.5" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx={toX((ax + bx) / 2)} cy={toY((ay + by) / 2)} r="4.5" fill="#137B55" />
            <text x={toX(ax) - 6} y={toY(ay) - 10} textAnchor="end" fontSize="11" fontWeight="800" fill="#0369A1">A({ax},{ay})</text>
            <text x={toX(bx) + 8} y={toY(by) - 8} fontSize="11" fontWeight="800" fill="#BE123C">B({bx},{by})</text>
          </svg>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span dangerouslySetInnerHTML={{ __html: renderLatex(`m = \\frac{y_2 - y_1}{x_2 - x_1} = ${slopeStr}`) }} />
          <span className="font-extrabold text-[var(--math)]">Distance AB = {dist} · Midpoint ({((ax + bx) / 2).toFixed(1)}, {((ay + by) / 2).toFixed(1)})</span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">Ch. 5 · 2D Coordinate Geometry Grid</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="font-bold text-[var(--ink)]">A.x = {ax}<input type="range" min={-4} max={4} value={ax} onChange={(e) => { setAx(Number(e.target.value)); onInteract(); onComplete('Measured 2D distance, midpoint & slope!'); }} className="w-full accent-sky-500 mt-1" /></label>
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

/**
 * Ch. 8 Probability — Crisp 2D Empirical vs Theoretical (1/6 = 16.7%) Convergence Bar Lab
 */
export function MathsProbability3DLab({ onInteract, onComplete }: TopicLabProps) {
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
    if (total + n >= 15) onComplete('Tested 2D empirical probability convergence toward 1/6!');
  };

  const maxPct = Math.max(30, ...counts.map((c) => Math.round((c / Math.max(1, total)) * 100)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <svg viewBox="0 0 460 220" className="w-full h-auto" role="img" aria-label="2D fair die empirical vs theoretical 1/6 probability convergence chart">
          <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill="#13213A">
            Fair Die Outcomes (n = {total} rolls) vs. Theoretical P = 1/6 (16.7%)
          </text>
          <line x1="36" y1="184" x2="432" y2="184" stroke="#94A3B8" strokeWidth="2" />
          {/* Theoretical 16.7% dashed line */}
          <line
            x1="36"
            y1={184 - (16.7 / maxPct) * 135}
            x2="432"
            y2={184 - (16.7 / maxPct) * 135}
            stroke="#0B7773"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text x="430" y={178 - (16.7 / maxPct) * 135} textAnchor="end" fontSize="10" fontWeight="800" fill="#0B7773">
            Theoretical 16.7%
          </text>
          {counts.map((c, idx) => {
            const pct = total > 0 ? (c / total) * 100 : 0;
            const barH = Math.max(6, (pct / maxPct) * 135);
            const x = 52 + idx * 62;
            const isLast = lastRoll === idx + 1;
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={184 - barH}
                  width="42"
                  height={barH}
                  rx="7"
                  fill={isLast ? '#7155C8' : '#A78BFA'}
                  stroke="#5B21B6"
                  strokeWidth={isLast ? 2.5 : 1.2}
                />
                <text x={x + 21} y={178 - barH} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#13213A">
                  {pct.toFixed(0)}%
                </text>
                <text x={x + 21} y="202" textAnchor="middle" fontSize="11" fontWeight="800" fill="#4E5F76">
                  Face {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
          <Dices className="w-4 h-4" />
          <span>Ch. 8 · Empirical vs. Theoretical Probability</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => rollN(1)} className="px-3.5 py-2 rounded-xl bg-[var(--math)] text-white font-bold">Roll ×1</button>
          <button type="button" onClick={() => rollN(20)} className="px-3.5 py-2 rounded-xl bg-[var(--primary)] text-white font-bold">Roll ×20</button>
          <button type="button" onClick={() => rollN(100)} className="px-3.5 py-2 rounded-xl bg-[var(--science)] text-white font-bold">Roll ×100</button>
          <button type="button" onClick={() => { setCounts([0, 0, 0, 0, 0, 0]); setLastRoll(null); }} className="px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
          <strong>Sample Space S = &#123;1, 2, 3, 4, 5, 6&#125;:</strong> Roll 100+ times and watch all six bars settle smoothly near the green dashed <strong>1/6 ≈ 16.7%</strong> theoretical probability line!
        </p>
      </div>
    </div>
  );
}
