import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { CheckCircle2 } from 'lucide-react';
import { evaluateTrigIdentities } from '../../utils/trigIdentitiesSimulations';
import type { ModularEngineProps } from './types';

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

export function TrigIdentitiesEngine({
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const [angleDeg, setAngleDeg] = useState(30);
  const [checkedAngles, setCheckedAngles] = useState<number[]>([30]);

  const evalRes = useMemo(() => evaluateTrigIdentities(angleDeg), [angleDeg]);

  const setAngle = (deg: number) => {
    setAngleDeg(deg);
    onInteract();
    setCheckedAngles((prev) => {
      const next = prev.includes(deg) ? prev : [...prev, deg];
      if (next.length >= 3) onComplete('Trigonometric identities verified across 3+ acute angles!');
      return next;
    });
  };

  // Unit triangle geometry (Hypotenuse = 140px)
  const rad = (angleDeg * Math.PI) / 180;
  const hyp = 140;
  const base = Math.cos(rad) * hyp;
  const opp = Math.sin(rad) * hyp;
  const originX = 75;
  const originY = 185;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            Trigonometry Ratios &amp; Identities Lab · Maths Ch. 6.1–6.2 (pp. 239–249)
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">
            Live Right Triangle, Complementary Angles &amp; 3 Pythagorean Identities
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[30, 45, 60, 20, 70].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAngle(preset)}
              className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold border ${
                angleDeg === preset
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              θ = {preset}°
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-6 space-y-3">
          <svg
            viewBox="0 0 320 225"
            className="w-full h-auto rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)]"
            role="img"
            aria-label={`Right triangle with acute angle ${angleDeg} degrees`}
          >
            {/* Triangle OMP (Fig 6.1) */}
            <polygon
              points={`${originX},${originY} ${originX + base},${originY} ${originX + base},${originY - opp}`}
              fill="#E0E7FF"
              stroke="#4255D4"
              strokeWidth="3"
            />
            <rect
              x={originX + base - 12}
              y={originY - 12}
              width="12"
              height="12"
              fill="none"
              stroke="#4255D4"
              strokeWidth="2"
            />
            <text x={originX - 18} y={originY + 5} fontSize="13" fontWeight="700" fill="#13213A">O</text>
            <text x={originX + base + 8} y={originY + 5} fontSize="13" fontWeight="700" fill="#13213A">M</text>
            <text x={originX + base + 8} y={originY - opp - 4} fontSize="13" fontWeight="700" fill="#13213A">P</text>
            <text x={originX + base / 2} y={originY + 20} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A8A">
              Adjacent = cos({angleDeg}°) = {evalRes.cos}
            </text>
            <text x={originX + base + 12} y={originY - opp / 2} fontSize="11" fontWeight="700" fill="#DC2626">
              Opp = sin({angleDeg}°) = {evalRes.sin}
            </text>
            <text x={originX + base / 2 - 22} y={originY - opp / 2 - 8} fontSize="11" fontWeight="700" fill="#0F766E">
              Hyp = 1
            </text>
            <text x={originX + 18} y={originY - 10} fontSize="12" fontWeight="800" fill="#4255D4">
              θ = {angleDeg}°
            </text>
          </svg>

          <label className="block space-y-1 text-xs">
            <span className="flex justify-between font-bold text-[var(--ink)]">
              <span>Adjust Acute Angle θ (1° to 89°)</span>
              <span className="font-mono-tabular">
                θ = {angleDeg}° · (90° − θ) = {evalRes.complementDeg}°
              </span>
            </span>
            <input
              type="range"
              min={5}
              max={85}
              step={1}
              value={angleDeg}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </label>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            {[
              ['sin θ', evalRes.sin],
              ['cos θ', evalRes.cos],
              ['tan θ', evalRes.tan],
              ['cosec θ', evalRes.cosec],
              ['sec θ', evalRes.sec],
              ['cot θ', evalRes.cot],
            ].map(([name, val]) => (
              <div key={String(name)} className="p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                <div className="text-[11px] font-bold text-[var(--text-muted)]">{name}</div>
                <div className="text-sm font-extrabold font-mono-tabular text-[var(--ink)]">{val}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2.5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
              Three Fundamental Trigonometric Identities (Always Hold for 0° &lt; θ &lt; 90°)
            </div>
            {evalRes.identities.map((id) => (
              <div
                key={id.id}
                className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/30 text-xs"
              >
                <span dangerouslySetInnerHTML={{ __html: renderLatex(id.labelLatex) }} />
                <span className="font-mono-tabular font-extrabold text-[var(--success)]">
                  LHS = {id.lhs} = RHS ({id.rhs}) ✓
                </span>
              </div>
            ))}
            <div className="p-2.5 rounded-xl bg-[var(--info-bg)] text-xs text-[var(--ink)]">
              <strong>Complementary Proof (p. 240–241):</strong> sin({angleDeg}°) ={' '}
              <span className="font-mono-tabular font-bold">{evalRes.complementaryCheck.sinTheta}</span> = cos(
              {evalRes.complementDeg}°) ={' '}
              <span className="font-mono-tabular font-bold">{evalRes.complementaryCheck.cosComplement}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Verified {checkedAngles.length} / 3 angles</span>
            {checkedAngles.length >= 3 && (
              <span className="inline-flex items-center gap-1 font-bold text-[var(--success)]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Milestone complete</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
