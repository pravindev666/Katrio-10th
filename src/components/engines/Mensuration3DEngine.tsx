import React, { Suspense, lazy, useMemo, useState } from 'react';
import katex from 'katex';
import { Box, CheckCircle2, Eye, Layers } from 'lucide-react';
import {
  computeSolidMeasurements,
  type SolidKind,
} from '../../utils/mensurationSimulations';
import type { ModularEngineProps } from './types';

const Mensuration3DCanvas = lazy(() => import('./Mensuration3DCanvas'));

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

const SOLID_OPTIONS: { kind: SolidKind; label: string; sec: string }[] = [
  { kind: 'cylinder', label: 'Right Circular Cylinder', sec: '7.2.1' },
  { kind: 'hollow_cylinder', label: 'Hollow Cylinder', sec: '7.2.2' },
  { kind: 'cone', label: 'Right Circular Cone', sec: '7.2.3' },
  { kind: 'sphere', label: 'Solid Sphere', sec: '7.2.4' },
  { kind: 'hemisphere', label: 'Solid Hemisphere', sec: '7.2.5' },
  { kind: 'frustum', label: 'Frustum of Cone', sec: '7.2.7' },
  { kind: 'combined_capsule', label: 'Combined Solid', sec: '7.4' },
];

export function Mensuration3DEngine({
  sectionId,
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const prefer2DText = mode === '2d_text';
  const initialKind: SolidKind = sectionId.includes('frustum')
    ? 'frustum'
    : sectionId.includes('cone')
    ? 'cone'
    : sectionId.includes('hollow-cylinder')
    ? 'hollow_cylinder'
    : sectionId.includes('hemisphere')
    ? 'hemisphere'
    : sectionId.includes('sphere')
    ? 'sphere'
    : sectionId.includes('maths-07-04')
    ? 'combined_capsule'
    : 'cylinder';

  const [kind, setKind] = useState<SolidKind>(initialKind);
  const [radius, setRadius] = useState(7); // 7 cm gives clean π = 22/7 arithmetic!
  const [outerRadius, setOuterRadius] = useState(14);
  const [height, setHeight] = useState(14);
  const [cutaway, setCutaway] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [unfoldPct, setUnfoldPct] = useState(100);
  const [viewMode, setViewMode] = useState<'split_3d_2d' | '2d_net' | 'text'>(
    prefer2DText ? '2d_net' : 'split_3d_2d',
  );
  const [exploredKinds, setExploredKinds] = useState<string[]>([initialKind]);

  const effectiveMode = prefer2DText ? '2d_net' : viewMode;
  const needsOuter = kind === 'hollow_cylinder' || kind === 'frustum';
  const needsHeight = kind !== 'sphere' && kind !== 'hemisphere';

  const result = useMemo(
    () =>
      computeSolidMeasurements({
        kind,
        radius,
        outerRadius,
        height,
        useExact22Over7: true,
      }),
    [kind, radius, outerRadius, height],
  );

  // Engineering Mission: Village Water Tank (Volume >= 1000 cm³/m³ while TSA <= 620)
  const tankMissionSolved =
    (kind === 'cylinder' || kind === 'combined_capsule') &&
    result.volume >= 1000 &&
    result.tsa <= 620;

  const onInteraction = onInteract;
  const selectKind = (next: SolidKind) => {
    setKind(next);
    onInteract();
    setExploredKinds((prev) => {
      const updated = prev.includes(next) ? prev : [...prev, next];
      if (updated.length >= 3) onComplete('Mensuration 3D solid milestone completed! Explored 3+ solids with π = 22/7.');
      return updated;
    });
  };

  return (
    <div className="space-y-5">
      {/* Header + 3D/2D Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            ModelExplorer3D + NetUnfolder · Maths Ch. 7 (π = 22/7)
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">{result.label}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {!prefer2DText && (
            <>
              <button
                type="button"
                onClick={() => {
                  setViewMode('split_3d_2d');
                  onInteraction();
                }}
                aria-pressed={effectiveMode === 'split_3d_2d'}
                className={`px-3 py-2 min-h-[38px] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border ${
                  effectiveMode === 'split_3d_2d'
                    ? 'bg-[var(--math)] text-white border-[var(--math)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Solid + 2D Net</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('2d_net');
                  onInteraction();
                }}
                aria-pressed={effectiveMode === '2d_net'}
                className={`px-3 py-2 min-h-[38px] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border ${
                  effectiveMode === '2d_net'
                    ? 'bg-[var(--math)] text-white border-[var(--math)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Unfolded Net Only</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Water Tank Engineering Micro-Mission Banner */}
      <div
        className={`p-3.5 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
          tankMissionSolved
            ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
            : 'bg-[var(--math-tint)] border-[var(--math)]/30 text-[var(--ink)]'
        }`}
      >
        <div>
          <span className="font-extrabold text-[var(--math)]">Water Tank Engineering Quest: </span>
          <span>
            Choose Cylinder or Combined Solid and tune <strong>r</strong> &amp; <strong>h</strong> so Volume ≥ <strong>1,000</strong> while outer TSA ≤ <strong>620</strong>!
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] font-mono-tabular font-extrabold">
          {tankMissionSolved
            ? `★ Tank Goal Met! V = ${result.volume}, TSA = ${result.tsa}`
            : `Now: V = ${result.volume} · TSA = ${result.tsa}`}
        </span>
      </div>

      {/* Solid Selector Strip */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select 3D mensuration solid">
        {SOLID_OPTIONS.map((opt) => (
          <button
            key={opt.kind}
            type="button"
            onClick={() => selectKind(opt.kind)}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border transition-colors ${
              kind === opt.kind
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
            }`}
          >
            {opt.sec} · {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Synchronized 3D Solid + Live Animated 2D Unfolded Net SVG */}
        <div className="lg:col-span-7 space-y-3">
          {effectiveMode === 'split_3d_2d' && (
            <>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCutaway((v) => !v);
                    onInteraction();
                  }}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold border inline-flex items-center gap-1.5 ${
                    cutaway
                      ? 'bg-amber-500/15 border-amber-500 text-[var(--ink)]'
                      : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text)]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{cutaway ? 'Cutaway Slice: ON' : 'Slice Cutaway: OFF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWireframe((v) => !v);
                    onInteraction();
                  }}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold border ${
                    wireframe
                      ? 'bg-[var(--primary-tint)] border-[var(--primary)] text-[var(--primary)]'
                      : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text)]'
                  }`}
                >
                  {wireframe ? 'Wireframe Mesh: ON' : 'Wireframe Mesh: OFF'}
                </button>
              </div>
              <Suspense
                fallback={
                  <div className="h-[310px] rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                    Loading Three.js 3D Solid Explorer...
                  </div>
                }
              >
                <Mensuration3DCanvas
                  kind={kind}
                  radius={radius}
                  outerRadius={outerRadius}
                  height={height}
                  cutaway={cutaway}
                  wireframe={wireframe}
                  reducedMotion={reducedMotion}
                />
              </Suspense>
            </>
          )}

          {/* Synchronized Live Unfolding 2D Net SVG (always shown alongside 3D and standalone in 2D Net mode) */}
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--math)]">
                Synchronized 2D Unfolded Net (Unfold: {unfoldPct}%)
              </span>
              <label className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ink)]">
                <span>Unfold:</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={10}
                  value={unfoldPct}
                  onChange={(e) => {
                    setUnfoldPct(Number(e.target.value));
                    onInteraction();
                  }}
                  aria-label="Unfold 2D net percentage"
                  className="w-24 accent-[var(--math)]"
                />
              </label>
            </div>
            <svg
              viewBox="0 0 460 220"
              className="w-full h-auto rounded-xl bg-[var(--surface)] border border-[var(--line)]"
              role="img"
              aria-label={`2D unfolded net schematic for ${result.label}`}
            >
              {kind === 'cylinder' || kind === 'hollow_cylinder' ? (
                <>
                  <circle cx={95 + (100 - unfoldPct) * 0.55} cy="110" r="42" fill="#DBEAFE" stroke="#4255D4" strokeWidth="2.5" />
                  <text x={95 + (100 - unfoldPct) * 0.55} y="114" textAnchor="middle" fontSize="11.5" fill="#1E3A8A" fontWeight="700">
                    Base πr²
                  </text>
                  <rect
                    x={240 - 80 * (unfoldPct / 100)}
                    y="52"
                    width={160 * (unfoldPct / 100)}
                    height="116"
                    fill="#E0E7FF"
                    stroke="#7155C8"
                    strokeWidth="2.5"
                  />
                  <text x="240" y="106" textAnchor="middle" fontSize="12.5" fill="#1E3A8A" fontWeight="800">
                    CSA = 2πr × h = {result.csa}
                  </text>
                  <text x="240" y="128" textAnchor="middle" fontSize="11" fill="#334155">
                    r = {radius} cm, h = {height} cm
                  </text>
                  <circle cx={385 - (100 - unfoldPct) * 0.55} cy="110" r="42" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
                  <text x={385 - (100 - unfoldPct) * 0.55} y="114" textAnchor="middle" fontSize="11.5" fill="#92400E" fontWeight="700">
                    Top πr²
                  </text>
                </>
              ) : kind === 'cone' || kind === 'frustum' ? (
                <>
                  <path
                    d={`M ${220 - 110 * (unfoldPct / 100)} 175 L 220 35 L ${220 + 110 * (unfoldPct / 100)} 175 Z`}
                    fill="#E0E7FF"
                    stroke="#7155C8"
                    strokeWidth="2.5"
                  />
                  <line x1="220" y1="35" x2="220" y2="175" stroke="#D97706" strokeDasharray="5,4" strokeWidth="2" />
                  <text x="230" y="110" fontSize="12" fill="#92400E" fontWeight="700">
                    h = {height} cm
                  </text>
                  <text x="285" y="95" fontSize="12" fill="#1E3A8A" fontWeight="700">
                    l = {result.slantHeight} cm
                  </text>
                  <text x="220" y="198" textAnchor="middle" fontSize="12" fill="#1E3A8A" fontWeight="700">
                    {kind === 'frustum' ? `Bottom R = ${outerRadius} cm · Top r = ${radius} cm` : `Unfolded Sector CSA = πrl = ${result.csa}`}
                  </text>
                </>
              ) : (
                <>
                  <circle cx="150" cy="110" r="65" fill="#E0E7FF" stroke="#4255D4" strokeWidth="2.5" />
                  <ellipse cx="150" cy="110" rx="65" ry="20" fill="none" stroke="#D97706" strokeDasharray="5,4" strokeWidth="2" />
                  <line x1="150" y1="110" x2="215" y2="110" stroke="#1E3A8A" strokeWidth="2.5" />
                  <text x="182" y="102" textAnchor="middle" fontSize="12" fill="#1E3A8A" fontWeight="700">
                    r = {radius} cm
                  </text>
                  <text x="335" y="96" textAnchor="middle" fontSize="13" fill="#1E3A8A" fontWeight="700">
                    {result.label}
                  </text>
                  <text x="335" y="120" textAnchor="middle" fontSize="12" fill="#334155">
                    CSA = {result.csa} · TSA = {result.tsa}
                  </text>
                  <text x="335" y="142" textAnchor="middle" fontSize="12" fill="#334155">
                    Volume = {result.volume}
                  </text>
                </>
              )}
            </svg>
            <p className="text-xs text-[var(--text)] leading-relaxed">{result.netDescription}</p>
          </div>
        </div>

        {/* Right: Live Controls & Textbook Formulas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink)]">
              Dimensions (cm) — Textbook Example Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setKind('cylinder');
                  setRadius(14);
                  setHeight(20);
                  onInteraction();
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[11px] font-bold text-[var(--primary)]"
              >
                Ex 7.1 Drum (r=14, h=20)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKind('cone');
                  setRadius(7);
                  setHeight(24);
                  onInteraction();
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[11px] font-bold text-[var(--primary)]"
              >
                Pythagorean Cone (r=7, h=24, l=25)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKind('frustum');
                  setRadius(7);
                  setOuterRadius(14);
                  setHeight(24);
                  onInteraction();
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[11px] font-bold text-[var(--primary)]"
              >
                Bucket Frustum (r=7, R=14, h=24)
              </button>
            </div>

            <label className="block space-y-1 text-xs">
              <span className="flex justify-between font-bold text-[var(--ink)]">
                <span>{needsOuter ? 'Inner / Top Radius (r)' : 'Radius (r)'}</span>
                <span className="font-mono-tabular">{radius} cm</span>
              </span>
              <input
                type="range"
                min={2}
                max={21}
                step={1}
                value={radius}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRadius(val);
                  if (outerRadius <= val) setOuterRadius(val + 3);
                  onInteraction();
                }}
                className="w-full accent-[var(--primary)]"
              />
            </label>

            {needsOuter && (
              <label className="block space-y-1 text-xs">
                <span className="flex justify-between font-bold text-[var(--ink)]">
                  <span>Outer / Bottom Radius (R)</span>
                  <span className="font-mono-tabular">{outerRadius} cm</span>
                </span>
                <input
                  type="range"
                  min={radius + 1}
                  max={28}
                  step={1}
                  value={outerRadius}
                  onChange={(e) => {
                    setOuterRadius(Number(e.target.value));
                    onInteraction();
                  }}
                  className="w-full accent-[var(--primary)]"
                />
              </label>
            )}

            {needsHeight && (
              <label className="block space-y-1 text-xs">
                <span className="flex justify-between font-bold text-[var(--ink)]">
                  <span>Height (h)</span>
                  <span className="font-mono-tabular">{height} cm</span>
                </span>
                <input
                  type="range"
                  min={3}
                  max={30}
                  step={1}
                  value={height}
                  onChange={(e) => {
                    setHeight(Number(e.target.value));
                    onInteraction();
                  }}
                  className="w-full accent-[var(--primary)]"
                />
              </label>
            )}
          </div>

          {result.valid ? (
            <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                  <div className="text-[11px] font-bold text-[var(--text-muted)]">CSA</div>
                  <div className="text-sm font-extrabold font-mono-tabular text-[var(--ink)]">
                    {result.csa} cm²
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--primary-tint)] border border-[var(--primary)]/30">
                  <div className="text-[11px] font-bold text-[var(--primary)]">TSA</div>
                  <div className="text-sm font-extrabold font-mono-tabular text-[var(--primary)]">
                    {result.tsa} cm²
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/30">
                  <div className="text-[11px] font-bold text-[var(--success)]">Volume</div>
                  <div className="text-sm font-extrabold font-mono-tabular text-[var(--ink)]">
                    {result.volume} cm³
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-1 border-t border-[var(--line)]">
                <div
                  className="overflow-x-auto py-0.5"
                  dangerouslySetInnerHTML={{ __html: renderLatex(result.csaFormulaLatex) }}
                />
                <div
                  className="overflow-x-auto py-0.5"
                  dangerouslySetInnerHTML={{ __html: renderLatex(result.tsaFormulaLatex) }}
                />
                <div
                  className="overflow-x-auto py-0.5"
                  dangerouslySetInnerHTML={{ __html: renderLatex(result.volumeFormulaLatex) }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)]">{result.netDescription}</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/40 text-xs font-bold text-[var(--error)]">
              {result.error}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <span>Explored {exploredKinds.length} / 3 solids for hands-on milestone</span>
            {exploredKinds.length >= 3 && (
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
