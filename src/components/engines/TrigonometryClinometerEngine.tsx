import React, { Suspense, lazy, useMemo, useState } from 'react';
import katex from 'katex';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { solveClinometer, type ClinometerMode } from '../../utils/mathSimulations';
import type { ModularEngineProps } from './types';

const TrigSurvey3DCanvas = lazy(() => import('./TrigSurvey3DCanvas'));

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

export function TrigonometryClinometerEngine({
  sectionId,
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const [surveyMode, setSurveyMode] = useState<ClinometerMode>('elevation');
  const [distanceM, setDistanceM] = useState(48);
  const [angleDeg, setAngleDeg] = useState(30);
  const [observerEyeM, setObserverEyeM] = useState(0);

  const result = useMemo(
    () =>
      solveClinometer({
        mode: surveyMode,
        distanceM,
        angleDeg,
        observerEyeM: surveyMode === 'elevation' ? observerEyeM : 0,
      }),
    [surveyMode, distanceM, angleDeg, observerEyeM],
  );

  const handlePresetAngle = (deg: number) => {
    setAngleDeg(deg);
    onInteract();
    if (deg === 45 || deg === 30 || deg === 60) {
      onComplete(`Explored exact trigonometric ratio at θ = ${deg}°!`);
    }
  };

  const handleReset = () => {
    setSurveyMode('elevation');
    setDistanceM(48);
    setAngleDeg(30);
    setObserverEyeM(0);
  };

  // Visual scaling inside SVG (clamped cleanly for steep angles)
  const scaledHeightPx = result.valid
    ? Math.max(16, Math.min(138, result.verticalDeltaM * 1.45))
    : angleDeg === 0
    ? 0
    : 138;

  return (
    <div className="space-y-5">
      {/* Mode Switcher: Elevation vs Depression */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Choose clinometer measurement mode"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]"
        >
          <button
            type="button"
            onClick={() => {
              setSurveyMode('elevation');
              onInteract();
            }}
            aria-pressed={surveyMode === 'elevation'}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              surveyMode === 'elevation'
                ? 'bg-[var(--math)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
            }`}
          >
            Angle of Elevation (Looking Up)
          </button>
          <button
            type="button"
            onClick={() => {
              setSurveyMode('depression');
              onInteract();
            }}
            aria-pressed={surveyMode === 'depression'}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              surveyMode === 'depression'
                ? 'bg-[var(--math)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
            }`}
          >
            Angle of Depression (Looking Down)
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset (Example 6.19)</span>
        </button>
      </div>

      {/* 3D Interactive Lighthouse & Laser Sightline Diorama (hidden in 2D/Text mode) */}
      {mode !== '2d_text' && (
        <div className="p-4 rounded-[20px] border border-[var(--line)] bg-[var(--surface-subtle)]">
          <Suspense
            fallback={
              <div className="h-[290px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                Loading 3D Trigonometry Lighthouse Diorama...
              </div>
            }
          >
            <TrigSurvey3DCanvas
              mode={surveyMode}
              distanceM={distanceM}
              angleDeg={angleDeg}
              verticalDeltaM={result.valid ? result.verticalDeltaM : 0}
              observerEyeM={surveyMode === 'elevation' ? observerEyeM : 0}
              valid={result.valid}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </div>
      )}

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)]">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor={`trig-dist-${sectionId}`}
              className="block text-sm font-bold text-[var(--ink)]"
            >
              Horizontal Ground Distance (d): {distanceM} m
            </label>
            <input
              id={`trig-dist-${sectionId}`}
              type="range"
              min={10}
              max={90}
              step={2}
              value={distanceM}
              onChange={(e) => {
                setDistanceM(Number(e.target.value));
                onInteract();
              }}
              className="w-full accent-[var(--math)] min-h-[36px]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`trig-angle-${sectionId}`}
              className="block text-sm font-bold text-[var(--ink)]"
            >
              Clinometer Angle (θ): {angleDeg}°
            </label>
            <input
              id={`trig-angle-${sectionId}`}
              type="range"
              min={0}
              max={90}
              step={5}
              value={angleDeg}
              onChange={(e) => {
                setAngleDeg(Number(e.target.value));
                onInteract();
              }}
              className="w-full accent-[var(--math)] min-h-[36px]"
            />

            {/* Exact Textbook Presets & Boundary Edge-Case Testers */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { deg: 0, label: '0° (edge)' },
                { deg: 30, label: '30° (1/√3)' },
                { deg: 45, label: '45° (1)' },
                { deg: 60, label: '60° (√3)' },
                { deg: 85, label: '85° (steep)' },
                { deg: 90, label: '90° (undefined)' },
              ].map((p) => (
                <button
                  key={p.deg}
                  type="button"
                  onClick={() => handlePresetAngle(p.deg)}
                  aria-pressed={angleDeg === p.deg}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg border text-xs font-bold transition-colors ${
                    angleDeg === p.deg
                      ? 'bg-[var(--math)] text-white border-[var(--math)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--math)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {surveyMode === 'elevation' && (
            <div className="space-y-1">
              <label
                htmlFor={`trig-eye-${sectionId}`}
                className="block text-sm font-bold text-[var(--ink)]"
              >
                Observer Eye Height (h₀): {observerEyeM.toFixed(1)} m
              </label>
              <input
                id={`trig-eye-${sectionId}`}
                type="range"
                min={0}
                max={2}
                step={0.2}
                value={observerEyeM}
                onChange={(e) => {
                  setObserverEyeM(Number(e.target.value));
                  onInteract();
                }}
                className="w-full accent-[var(--math)] min-h-[36px]"
              />
            </div>
          )}

          {/* Live Formula Derivation or Invalid Boundary Diagnostic */}
          {result.valid ? (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2.5 text-sm">
              <div
                className="overflow-x-auto py-0.5"
                dangerouslySetInnerHTML={{ __html: renderLatex(result.latexDerivation) }}
              />
              {result.exactSurdFormula && (
                <div className="p-2.5 rounded-lg bg-[var(--math-tint)] text-xs font-bold text-[var(--ink)] flex flex-wrap items-center gap-2">
                  <span>Exact surd form:</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderLatex(`H = ${result.exactSurdFormula}`),
                    }}
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono-tabular">
                <div className="p-2 rounded-lg bg-[var(--surface-subtle)]">
                  <div className="text-[var(--text-muted)]">tan({angleDeg}°)</div>
                  <div className="font-bold text-[var(--ink)]">{result.tanTheta}</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-subtle)]">
                  <div className="text-[var(--text-muted)]">Height H</div>
                  <div className="font-bold text-[var(--math)]">{result.totalHeightM} m</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-subtle)]">
                  <div className="text-[var(--text-muted)]">Line of Sight</div>
                  <div className="font-bold text-[var(--ink)]">{result.lineOfSightM} m</div>
                </div>
              </div>
              {result.warning && (
                <p className="text-xs font-semibold text-[var(--warning)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{result.warning}</span>
                </p>
              )}
            </div>
          ) : (
            <div
              role="alert"
              className="p-4 rounded-xl bg-[var(--warning-bg)] border border-[var(--warning)]/40 space-y-2 text-sm text-[var(--ink)]"
            >
              <div className="font-extrabold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[var(--warning)] shrink-0" />
                <span>Boundary Case Triggered (θ = {angleDeg}°)</span>
              </div>
              <p className="text-xs sm:text-sm">{result.error}</p>
              <div
                className="pt-1 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: renderLatex(result.latexDerivation) }}
              />
            </div>
          )}
        </div>

        {/* Live Geometric SVG Diagram */}
        <div className="lg:col-span-6 bg-[var(--surface)] rounded-[16px] border border-[var(--line)] p-4 flex flex-col items-center justify-center space-y-3">
          <svg
            viewBox="0 0 360 230"
            className="w-full max-w-[360px] h-auto"
            role="img"
            aria-label={
              result.valid
                ? `${surveyMode === 'elevation' ? 'Angle of elevation' : 'Angle of depression'} right triangle with horizontal distance ${distanceM} m, angle ${angleDeg} degrees, and computed height ${result.totalHeightM} m`
                : `Invalid boundary case at angle ${angleDeg} degrees`
            }
          >
            {/* Ground line */}
            <line x1="20" y1="192" x2="340" y2="192" stroke="var(--ink)" strokeWidth="2.5" />

            {surveyMode === 'elevation' ? (
              <g>
                {/* Observer figure */}
                <line x1="56" y1="192" x2="56" y2={192 - observerEyeM * 8} stroke="#4255D4" strokeWidth="4" />
                <circle cx="56" cy={188 - observerEyeM * 8} r="5" fill="#4255D4" />

                {/* Eye-level horizontal dashed line */}
                <line
                  x1="56"
                  y1={188 - observerEyeM * 8}
                  x2="268"
                  y2={188 - observerEyeM * 8}
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />

                {/* Right Triangle */}
                {result.valid && (
                  <polygon
                    points={`56,${188 - observerEyeM * 8} 268,${188 - observerEyeM * 8} 268,${
                      188 - observerEyeM * 8 - scaledHeightPx
                    }`}
                    fill="#7155C8"
                    fillOpacity="0.16"
                    stroke="#7155C8"
                    strokeWidth="2.5"
                  />
                )}

                {/* Building / Tower */}
                <rect
                  x="268"
                  y={Math.max(24, 188 - observerEyeM * 8 - scaledHeightPx)}
                  width="38"
                  height={192 - Math.max(24, 188 - observerEyeM * 8 - scaledHeightPx)}
                  fill="#35465D"
                  rx="2"
                />
                {/* 90° right-angle box */}
                <rect
                  x="256"
                  y={176 - observerEyeM * 8}
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#7155C8"
                  strokeWidth="1.5"
                />
                <text x="112" y="212" fill="var(--ink)" fontSize="12" fontWeight="bold">
                  d = {distanceM} m · θ = {angleDeg}°
                </text>
                <text x="148" y="22" fill="#7155C8" fontSize="12.5" fontWeight="bold">
                  {result.valid ? `Building Height H = ${result.totalHeightM} m` : `θ = ${angleDeg}° (Invalid)`}
                </text>
              </g>
            ) : (
              /* Angle of Depression diagram with parallel horizontal ray */
              <g>
                {/* Cliff / Lighthouse on left */}
                <rect
                  x="42"
                  y={192 - scaledHeightPx}
                  width="42"
                  height={scaledHeightPx}
                  fill="#35465D"
                  rx="2"
                />
                {/* Top horizontal reference ray (parallel to ground!) */}
                <line
                  x1="84"
                  y1={192 - scaledHeightPx}
                  x2="310"
                  y2={192 - scaledHeightPx}
                  stroke="#0B7773"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <text x="165" y={Math.max(18, 184 - scaledHeightPx)} fill="#0B7773" fontSize="10.5" fontWeight="bold">
                  Upper Horizontal (Parallel) → θ_dep = {angleDeg}°
                </text>
                {/* Depression triangle */}
                {result.valid && (
                  <polygon
                    points={`84,${192 - scaledHeightPx} 84,192 290,192`}
                    fill="#7155C8"
                    fillOpacity="0.16"
                    stroke="#7155C8"
                    strokeWidth="2.5"
                  />
                )}
                {/* Target ship / marker on ground/sea */}
                <circle cx="290" cy="192" r="6" fill="#C35243" />
                <text x="128" y="212" fill="var(--ink)" fontSize="12" fontWeight="bold">
                  Horizontal d = {distanceM} m · Alternate θ = {angleDeg}°
                </text>
              </g>
            )}
          </svg>

          <p className="text-xs text-[var(--text-muted)] text-center">
            Modelling assumptions: level horizontal ground, strictly vertical tower (90°), flat-Earth
            sightline (Class 10 Maths pp. 250–258).
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            onComplete('Verified Heights & Distances clinometer calculation with units!')
          }
          className="px-4 py-2 min-h-[42px] rounded-xl bg-[var(--success)] text-white text-xs font-bold inline-flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark clinometer exploration complete</span>
        </button>
      </div>
    </div>
  );
}
