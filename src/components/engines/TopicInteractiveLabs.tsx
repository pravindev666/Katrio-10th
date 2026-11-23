import React, { Suspense, lazy, useMemo, useState } from 'react';
import katex from 'katex';
import { Dices, Flame, Play, RotateCcw, Volume2, Zap } from 'lucide-react';
import {
  computeCircuitSimulation,
  computeDopplerFrequency,
  computeEchoSimulation,
  computeThinLensImage,
} from '../../utils/physicsSimulations';
import { evaluateSolubilityState } from '../../utils/conceptFirstSimulations';
import {
  MathsAlgebra3DLab,
  MathsCoordinate3DLab,
  MathsProbability3DLab,
  MathsRelations3DLab,
  MathsSequences3DLab,
} from './MathsInteractiveLabs';
import { PlantAndEndocrineHormones2D } from './PlantAndEndocrineHormones2D';
import { Unit17ReproductionSuite2D } from './Unit17ReproductionSuite2D';
import { ElectricityExtensions2D } from './ElectricityExtensions2D';
import { ScienceMismatchFixes2D } from './ScienceMismatchFixes2D';
import { MathsExtensions2D } from './MathsExtensions2D';
import { SocialExtensions2D } from './SocialExtensions2D';
import { SubchapterDifferentiatedLabs2D } from './SubchapterDifferentiatedLabs2D';
import { LanguageStudioUnified2D } from './LanguageStudioUnified2D';

const PhysicsLab3DCanvas = lazy(() => import('./PhysicsLab3DCanvas'));
const BiologyCell3DCanvas = lazy(() => import('./BiologyCell3DCanvas'));
const ChemistryNuclear3DCanvas = lazy(() => import('./ChemistryNuclear3DCanvas'));

function renderLatex(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false });
  } catch {
    return tex;
  }
}

export interface TopicLabProps {
  sectionId: string;
  sectionTitle: string;
  unitTitle?: string;
  reducedMotion: boolean;
  onInteract: () => void;
  onComplete: (reason: string) => void;
}

/**
 * 1. SCIENCE UNIT 5 — ACOUSTICS: 3D + 2D Sound Wave Reflection (∠i = ∠r), Echo Chamber (17.2 m) & Doppler Lab
 */
export function AcousticsEchoLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [wallDistM, setWallDistM] = useState(22);
  const [incidentAngleDeg, setIncidentAngleDeg] = useState(35);
  const [medium, setMedium] = useState<'air' | 'water' | 'steel'>('air');
  const [sourceSpeed, setSourceSpeed] = useState(25);
  const [approaching, setApproaching] = useState(true);

  const speedMap = { air: 344, water: 1480, steel: 5100 };
  const speedMs = speedMap[medium];

  const echo = useMemo(() => computeEchoSimulation(wallDistM, speedMs), [wallDistM, speedMs]);
  const dopplerHz = useMemo(
    () => computeDopplerFrequency(500, sourceSpeed, approaching, 344),
    [sourceSpeed, approaching],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-2.5">
          <Suspense
            fallback={
              <div className="h-[320px] rounded-2xl border border-[var(--line)] bg-slate-950 flex items-center justify-center text-sm text-slate-300">
                Loading 3D Sound Wave Reflection Studio...
              </div>
            }
          >
            <PhysicsLab3DCanvas
              kind="acoustics"
              wallDistM={wallDistM}
              incidentAngleDeg={incidentAngleDeg}
              reducedMotion={reducedMotion}
            />
          </Suspense>

          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs">
            <div
              dangerouslySetInnerHTML={{
                __html: renderLatex(
                  `\\angle i = \\angle r = ${incidentAngleDeg}^\\circ, \\quad t = \\frac{2d}{v} = \\frac{${echo.roundTripDistanceM}}{${speedMs}} = ${echo.echoTimeSec}\\text{ s}`,
                ),
              }}
            />
            <span
              className={`px-2.5 py-1 rounded-full font-extrabold border ${echo.isDistinctEcho
                ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/35'
                : 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/35'
                }`}
            >
              {echo.isDistinctEcho
                ? `Distinct Echo Heard ✓ (≥ ${echo.minEchoDistanceM} m)`
                : `Too Close (< ${echo.minEchoDistanceM} m) — Reverberation Only`}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3 text-xs">
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
            <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span>Laws of Sound Reflection (p. 62, Fig. 5.4)</span>
            </div>

            <label className="block font-bold text-[var(--ink)] space-y-1">
              <div className="flex justify-between">
                <span>Angle of Incidence (∠i = ∠r):</span>
                <span className="font-mono-tabular text-[var(--science)]">{incidentAngleDeg}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={incidentAngleDeg}
                onChange={(e) => {
                  setIncidentAngleDeg(Number(e.target.value));
                  onInteract();
                  onComplete('Verified 3D Law of Sound Reflection (∠i = ∠r) & Echo Distance!');
                }}
                className="w-full accent-[var(--science)]"
              />
            </label>

            <label className="block font-bold text-[var(--ink)] space-y-1">
              <div className="flex justify-between">
                <span>Rigid Wall Distance (d):</span>
                <span className="font-mono-tabular text-[var(--science)]">{wallDistM} m</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={wallDistM}
                onChange={(e) => {
                  setWallDistM(Number(e.target.value));
                  onInteract();
                }}
                className="w-full accent-[var(--science)]"
              />
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  ['air', 'Air 344 m/s'],
                  ['water', 'Water 1480'],
                  ['steel', 'Steel 5100'],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMedium(m);
                    onInteract();
                  }}
                  className={`px-2 py-2 rounded-xl border text-[11px] font-bold ${medium === m
                    ? 'bg-[var(--science)] text-white border-[var(--science)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase tracking-wider text-[var(--primary)]">
                Doppler Pitch Shift (500 Hz Siren)
              </span>
              <span className="font-mono-tabular font-extrabold text-sm text-[var(--ink)]">
                {dopplerHz} Hz
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setApproaching(true);
                  onInteract();
                }}
                className={`flex-1 py-1.5 rounded-lg border font-bold ${approaching ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                  }`}
              >
                Approaching ↑
              </button>
              <button
                type="button"
                onClick={() => {
                  setApproaching(false);
                  onInteract();
                }}
                className={`flex-1 py-1.5 rounded-lg border font-bold ${!approaching ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                  }`}
              >
                Receding ↓
              </button>
            </div>
            <label className="block font-semibold text-[var(--ink)]">
              Source Speed: {sourceSpeed} m/s
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={sourceSpeed}
                onChange={(e) => {
                  setSourceSpeed(Number(e.target.value));
                  onInteract();
                }}
                className="w-full accent-[var(--primary)] mt-1"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. SCIENCE UNIT 2 — OPTICS: 3D Optical Laser Lens Bench + Thin Lens Formula
 */
export function OpticsRayBenchLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [focalCm, setFocalCm] = useState(15);
  const [objectDistCm, setObjectDistCm] = useState(30);

  const res = useMemo(
    () => computeThinLensImage(lensType, focalCm, objectDistCm),
    [lensType, focalCm, objectDistCm],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense
          fallback={
            <div className="h-[320px] rounded-2xl border border-[var(--line)] bg-slate-950 flex items-center justify-center text-sm text-slate-300">
              Loading 3D Optical Laser Lens Bench...
            </div>
          }
        >
          <PhysicsLab3DCanvas
            kind="optics"
            lensType={lensType}
            objectDistCm={objectDistCm}
            focalCm={focalCm}
            imageDistCm={res.imageDistanceCm}
            magnification={res.magnification}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <div
          className="px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap items-center justify-between gap-2"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: renderLatex(
                `\\frac{1}{v} = \\frac{1}{f} + \\frac{1}{u} \\implies v = ${res.imageDistanceCm === null ? '\\infty' : `${res.imageDistanceCm}\\text{ cm}`
                }, \\; m = ${res.magnification === null ? '\\infty' : res.magnification}`,
              ),
            }}
          />
          <span className="font-extrabold text-[var(--science)]">
            {res.nature} · {res.sizeRelation}
          </span>
        </div>
      </div>

      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs">
        <div className="flex gap-2">
          {(['convex', 'concave'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setLensType(t);
                onInteract();
                onComplete('Explored 3D Convex vs Concave Ray Optics image formation!');
              }}
              className={`flex-1 py-2.5 rounded-xl border font-bold capitalize ${lensType === t
                ? 'bg-[var(--science)] text-white border-[var(--science)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                }`}
            >
              {t} Lens
            </button>
          ))}
        </div>

        <label className="block font-bold text-[var(--ink)] space-y-1">
          <div className="flex justify-between">
            <span>Object Distance (|u|):</span>
            <span className="font-mono-tabular text-[var(--science)]">{objectDistCm} cm</span>
          </div>
          <input
            type="range"
            min={8}
            max={55}
            step={1}
            value={objectDistCm}
            onChange={(e) => {
              setObjectDistCm(Number(e.target.value));
              onInteract();
            }}
            className="w-full accent-[var(--science)]"
          />
        </label>

        <label className="block font-bold text-[var(--ink)] space-y-1">
          <div className="flex justify-between">
            <span>Focal Length (|f|):</span>
            <span className="font-mono-tabular text-[var(--science)]">{focalCm} cm</span>
          </div>
          <input
            type="range"
            min={10}
            max={25}
            step={1}
            value={focalCm}
            onChange={(e) => {
              setFocalCm(Number(e.target.value));
              onInteract();
            }}
            className="w-full accent-[var(--science)]"
          />
        </label>

        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
          <strong>Try This Challenge:</strong> Slide the 3D candle inside <strong>F</strong> (|u| &lt; {focalCm} cm) on a Convex Lens to form a magnified <strong>Virtual &amp; Erect</strong> image!
        </div>
      </div>
    </div>
  );
}

/**
 * 3. SCIENCE UNIT 4 — ELECTRICITY: 3D Copper Circuit & Glowing Filament Bulb Lab
 */
export function ElectricityCircuitLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [topology, setTopology] = useState<'series' | 'parallel'>('series');
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(6);

  const sim = useMemo(
    () => computeCircuitSimulation(voltage, r1, r2, topology),
    [voltage, r1, r2, topology],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense
          fallback={
            <div className="h-[320px] rounded-2xl border border-[var(--line)] bg-slate-950 flex items-center justify-center text-sm text-slate-300">
              Loading 3D Electric Circuit Bench...
            </div>
          }
        >
          <PhysicsLab3DCanvas
            kind="electricity"
            topology={topology}
            currentAmp={sim.totalCurrentAmp}
            brightnessPct={sim.bulbBrightnessPct}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <div
          className="px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: renderLatex(
                `R_{\\text{eq}} = ${sim.equivalentResistanceOhm}\\,\\Omega, \\quad I = \\frac{V}{R_{\\text{eq}}} = ${sim.totalCurrentAmp}\\text{ A}`,
              ),
            }}
          />
          <span className="font-extrabold text-amber-600 inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Power P = {sim.totalPowerWatt} W
          </span>
        </div>
      </div>

      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5 text-xs">
        <div className="flex gap-2">
          {(['series', 'parallel'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTopology(t);
                onInteract();
                onComplete('Compared 3D Series vs Parallel circuits and bulb power!');
              }}
              className={`flex-1 py-2.5 rounded-xl border font-bold capitalize ${topology === t
                ? 'bg-[var(--science)] text-white border-[var(--science)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                }`}
            >
              {t} Circuit
            </button>
          ))}
        </div>

        <label className="block font-bold text-[var(--ink)]">
          Battery Voltage (V): {voltage} V
          <input type="range" min={3} max={24} step={1} value={voltage} onChange={(e) => { setVoltage(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--science)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Resistor R₁: {r1} Ω
          <input type="range" min={2} max={20} step={1} value={r1} onChange={(e) => { setR1(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--science)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Resistor R₂: {r2} Ω
          <input type="range" min={2} max={20} step={1} value={r2} onChange={(e) => { setR2(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--science)] mt-1" />
        </label>

        <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
          <strong>Observe:</strong> Switching to <strong>Parallel</strong> drops total resistance, accelerating 3D electron flow and making both filament bulbs glow much brighter!
        </p>
      </div>
    </div>
  );
}

/**
 * 3B. SCIENCE UNIT 4.6.1 — ELECTRICAL RESISTIVITY: 3D Stretching & Thickening Wire Chamber (R = rho * L / A)
 */
export function ElectricalResistivity3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [material, setMaterial] = useState<'copper' | 'nichrome' | 'rubber'>('copper');
  const [lengthM, setLengthM] = useState(4);
  const [areaMm2, setAreaMm2] = useState(2);

  const matInfo = {
    copper: { label: 'Copper (Conductor)', rho: 1.68e-8, rhoTex: '1.68 \\times 10^{-8}', speedAmp: 4.5, note: 'Very low resistivity — free electrons glide past copper ions with minimal collisions.' },
    nichrome: { label: 'Nichrome (Heating Alloy)', rho: 1.5e-6, rhoTex: '1.50 \\times 10^{-6}', speedAmp: 1.4, note: '~90× higher resistivity than copper — frequent electron collisions generate heat in electric irons & toasters (p. 46)!' },
    rubber: { label: 'Rubber / Glass (Insulator)', rho: 1e13, rhoTex: '1.0 \\times 10^{13}', speedAmp: 0.08, note: 'Enormous resistivity — virtually zero free conduction electrons can cross.' },
  }[material];

  // Relative resistance readout for intuitive comparison
  const resistanceOhm =
    material === 'rubber'
      ? '∞ (Insulator)'
      : `${Number(((matInfo.rho * lengthM) / (areaMm2 * 1e-6)).toFixed(4))} Ω`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[320px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Resistivity Wire Chamber...</div>}>
          <PhysicsLab3DCanvas
            kind="resistivity"
            wireLengthM={lengthM}
            wireAreaMm2={areaMm2}
            materialKind={material}
            currentAmp={matInfo.speedAmp}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap items-center justify-between gap-2">
          <span
            dangerouslySetInnerHTML={{
              __html: renderLatex(
                `R = \\rho \\frac{L}{A} = (${matInfo.rhoTex}) \\frac{${lengthM}}{${areaMm2}\\text{ mm}^2}`,
              ),
            }}
          />
          <span className="font-mono-tabular font-extrabold text-[var(--science)]">R = {resistanceOhm}</span>
        </div>
      </div>

      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Choose Conductor Material (ρ · Textbook p. 46)
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['copper', 'nichrome', 'rubber'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMaterial(m);
                onInteract();
                onComplete('Compared Copper, Nichrome & Insulator resistivity in 3D!');
              }}
              className={`py-2 px-2 rounded-xl border font-bold capitalize ${material === m ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        <label className="block font-bold text-[var(--ink)]">
          Wire Length (L — directly proportional R ∝ L): {lengthM} m
          <input type="range" min={1} max={10} step={1} value={lengthM} onChange={(e) => { setLengthM(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--science)] mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Cross-Sectional Area (A — inversely proportional R ∝ 1/A): {areaMm2} mm²
          <input type="range" min={0.5} max={5} step={0.5} value={areaMm2} onChange={(e) => { setAreaMm2(Number(e.target.value)); onInteract(); }} className="w-full accent-[var(--primary)] mt-1" />
        </label>

        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
          <strong>{matInfo.label}:</strong> {matInfo.note}
        </div>
      </div>
    </div>
  );
}

/**
 * 4. SCIENCE UNIT 3 — THERMAL PHYSICS: 3D Glass Pressure Cylinder & Gas Laws Piston
 */
export function ThermalGasPistonLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [tempK, setTempK] = useState(340);
  const [pressureAtm, setPressureAtm] = useState(2);
  const volumeL = Number(((tempK / 300) * (2 / pressureAtm) * 2.5).toFixed(2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7">
        <Suspense
          fallback={
            <div className="h-[320px] rounded-2xl border border-[var(--line)] bg-slate-950 flex items-center justify-center text-sm text-slate-300">
              Loading 3D Thermal Gas Piston Chamber...
            </div>
          }
        >
          <PhysicsLab3DCanvas
            kind="thermal"
            tempK={tempK}
            volumeL={volumeL}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>

      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-orange-600 inline-flex items-center gap-1.5">
          <Flame className="w-4 h-4" />
          <span>Boyle&apos;s &amp; Charles&apos;s Gas Laws (Unit 3)</span>
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Absolute Temperature (T): {tempK} K ({tempK - 273} °C)
          <input
            type="range"
            min={250}
            max={600}
            step={10}
            value={tempK}
            onChange={(e) => {
              setTempK(Number(e.target.value));
              onInteract();
              onComplete('Tested 3D Charles’s & Boyle’s Gas Laws inside the thermal cylinder!');
            }}
            className="w-full accent-orange-500 mt-1"
          />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          External Pressure (P): {pressureAtm} atm
          <input
            type="range"
            min={1}
            max={5}
            step={0.5}
            value={pressureAtm}
            onChange={(e) => {
              setPressureAtm(Number(e.target.value));
              onInteract();
            }}
            className="w-full accent-[var(--primary)] mt-1"
          />
        </label>
        <div
          className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]"
          dangerouslySetInnerHTML={{
            __html: renderLatex(`\\frac{P V}{T} = \\text{const} \\implies V = ${volumeL}\\text{ L}`),
          }}
        />
      </div>
    </div>
  );
}

/**
 * 5. SCIENCE UNIT 1 — LAWS OF MOTION: 3D Newton's Laws Rocket-Cart Track
 */
export function MotionForce3DLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [forceN, setForceN] = useState(24);
  const [massKg, setMassKg] = useState(6);
  const accel = Number((forceN / massKg).toFixed(2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7">
        <Suspense
          fallback={
            <div className="h-[320px] rounded-2xl border border-[var(--line)] bg-slate-950 flex items-center justify-center text-sm text-slate-300">
              Loading 3D Newton&apos;s Laws Track...
            </div>
          }
        >
          <PhysicsLab3DCanvas
            kind="motion"
            forceN={forceN}
            massKg={massKg}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Newton&apos;s Second Law &amp; Inertia Lab (Unit 1)
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Applied Net Force (F): {forceN} N
          <input
            type="range"
            min={0}
            max={60}
            step={2}
            value={forceN}
            onChange={(e) => {
              setForceN(Number(e.target.value));
              onInteract();
              onComplete('Explored 3D Newton’s Second Law (F = ma)!');
            }}
            className="w-full accent-[var(--science)] mt-1"
          />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Cart Mass / Inertia (m): {massKg} kg
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={massKg}
            onChange={(e) => {
              setMassKg(Number(e.target.value));
              onInteract();
            }}
            className="w-full accent-[var(--science)] mt-1"
          />
        </label>
        <div
          className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm"
          dangerouslySetInnerHTML={{
            __html: renderLatex(`a = \\frac{F}{m} = \\frac{${forceN}\\text{ N}}{${massKg}\\text{ kg}} = ${accel}\\text{ m/s}^2`),
          }}
        />
      </div>
    </div>
  );
}

/**
 * 6. SCIENCE UNIT 17 — REPRODUCTION & GAMETOGENESIS: 3D Human Sperm (Fig. 17.15) & Human Ovum (Fig. 17.16)!
 * Directly fixes Screenshot 4 (17.8 Gametogenesis will NEVER show a chemistry beaker set!)
 */
const GAMETE_PARTS: Record<string, { title: string; cell: string; desc: string }> = {
  acrosome: {
    title: 'Acrosome Cap (Sperm Head — Fig. 17.15)',
    cell: 'Human Sperm (Male Gamete)',
    desc: 'Anterior cap on the elongated sperm head containing hyaluronidase enzyme, which helps penetrate the ovum layers during fertilization (p. 250).',
  },
  nucleus: {
    title: 'Haploid Nucleus (n = 23 chromosomes)',
    cell: 'Both Sperm & Ovum',
    desc: 'Carries half the genetic blueprint (haploid). When sperm and ovum nuclei fuse at fertilization, a diploid zygote (2n = 46) is formed (p. 250).',
  },
  midpiece: {
    title: 'Middle Piece & Spiral Mitochondria (Fig. 17.15)',
    cell: 'Human Sperm',
    desc: 'Connected by a short neck containing centrioles; packed with spirally arranged mitochondria that generate ATP energy for sperm motility.',
  },
  tail: {
    title: 'Motile Flagellum Tail (Fig. 17.15)',
    cell: 'Human Sperm',
    desc: 'Long lash-like tail propelled by mitochondrial ATP, enabling the spermatozoan to swim toward the ovum.',
  },
  corona: {
    title: 'Corona Radiata (Outer Follicle Layer — Fig. 17.16)',
    cell: 'Human Ovum (Female Gamete)',
    desc: 'Thick outer protective halo formed by radiating follicle cells surrounding the mature egg.',
  },
  zona: {
    title: 'Zona Pellucida & Perivitelline Space (Fig. 17.16)',
    cell: 'Human Ovum',
    desc: 'Inner translucent protective glycoprotein coat surrounding the vitelline plasma membrane, separated by the fluid-filled perivitelline space (p. 250).',
  },
  cytoplasm: {
    title: 'Yolk-Free Cytoplasm & Vitelline Membrane',
    cell: 'Human Ovum',
    desc: 'The mature spherical human ovum is almost free of yolk, rich in nourishing cytoplasm enclosed by the vitelline surface membrane.',
  },
};

export function Gametogenesis3DLab({ onInteract }: TopicLabProps) {
  return (
    <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs text-[var(--ink)]">
      <strong>Unit 17 Clinical 2D Reproduction Diagrams Active:</strong> All Unit 17 topics use calm, clinical 2D biological illustrations (<code>ReproductionDiagrams2D</code> &amp; <code>Unit17ReproductionSuite2D</code>).
      <button type="button" onClick={onInteract} className="ml-2 underline font-bold text-[var(--primary)]">
        Log exploration
      </button>
    </div>
  );
}

/**
 * 7. SCIENCE UNITS 15 & 16 — NERVOUS SYSTEM & HORMONES: 3D Multipolar Neuron & Live Action Potential
 */
const NEURON_PARTS: Record<string, { title: string; desc: string }> = {
  dendrites: {
    title: 'Dendrites (Signal Receivers)',
    desc: 'Branched extensions around the cell body (cyton) that receive electrical nerve impulses from receptors or neighbouring neurons.',
  },
  soma: {
    title: 'Cyton / Cell Body & Nucleus',
    desc: 'Contains the central nucleus and Nissl’s granules that metabolically support the neuron and integrate incoming signals.',
  },
  axon: {
    title: 'Axon (Long Impulse Cable)',
    desc: 'Single elongated fibre carrying nerve impulses rapidly away from the cyton toward synaptic knobs at the target muscle or next neuron.',
  },
  myelin: {
    title: 'Myelin Sheath & Nodes of Ranvier',
    desc: 'Fatty Schwann-cell insulating segments with tiny exposed Nodes of Ranvier that speed up electrical impulse conduction.',
  },
};

export function NeuronHormone3DLab({ sectionId, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const defaultBrain =
    sectionId.toLowerCase().includes('brain') ||
    sectionId.toLowerCase().includes('central') ||
    sectionId.toLowerCase().includes('forebrain') ||
    sectionId.toLowerCase().includes('hindbrain');
  const [viewModel, setViewModel] = useState<'neuron' | 'brain'>(defaultBrain ? 'brain' : 'neuron');
  const [part, setPart] = useState('myelin');
  const active = NEURON_PARTS[part] ?? NEURON_PARTS.myelin;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => { setViewModel('neuron'); onInteract(); }}
            className={`px-3 py-1.5 rounded-xl border font-bold ${viewModel === 'neuron' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
          >
            Real US NIH 3D Neuron
          </button>
          <button
            type="button"
            onClick={() => { setViewModel('brain'); onInteract(); onComplete('Explored Real 3D Human Brain Atlas (Z-Anatomy)!'); }}
            className={`px-3 py-1.5 rounded-xl border font-bold ${viewModel === 'brain' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
          >
            Real 3D Human Brain (Z-Anatomy)
          </button>
        </div>
        <Suspense fallback={<div className="h-[340px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Nervous System Studio...</div>}>
          <BiologyCell3DCanvas
            kind={viewModel}
            selectedPart={part}
            onSelectPart={(id) => {
              setPart(id);
              onInteract();
              onComplete('Explored 3D Nervous System & Human Brain model!');
            }}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>
      <div className="lg:col-span-5 space-y-3 text-xs">
        <div className="p-4 rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary-tint)] space-y-1.5">
          <div className="text-base font-extrabold text-[var(--ink)]">{active.title}</div>
          <p className="text-[var(--text)] leading-relaxed">{active.desc}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(NEURON_PARTS).map(([id, info]) => (
            <button
              key={id}
              type="button"
              onClick={() => { setPart(id); onInteract(); }}
              className={`px-3 py-2 rounded-xl border font-bold ${part === id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
            >
              {info.title.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 8. SCIENCE UNIT 6 — NUCLEAR PHYSICS: 3D Pressurized Nuclear Reactor & Boron Control Rod Lab
 */
export function NuclearChainReactionLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [rodDepthPct, setRodDepthPct] = useState(55);
  const kFactor = Number((2.2 - (rodDepthPct / 100) * 1.95).toFixed(2));
  const stateLabel =
    kFactor < 0.85
      ? { text: 'Subcritical (Safe Shutdown)', color: 'text-sky-600' }
      : kFactor <= 1.15
        ? { text: 'Controlled Critical (Steady Power ✓)', color: 'text-emerald-600' }
        : { text: 'Supercritical Surge — Insert Control Rods!', color: 'text-rose-600' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[320px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Nuclear Reactor Core...</div>}>
          <ChemistryNuclear3DCanvas kind="nuclear" controlRodPct={rodDepthPct} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs flex flex-wrap justify-between gap-2">
          <span className="font-bold text-[var(--ink)]">Multiplication Factor k = {kFactor}</span>
          <span className={`font-extrabold ${stateLabel.color}`}>{stateLabel.text}</span>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          3D U-235 Fission Reactor &amp; Control Rods (Unit 6)
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Boron/Cadmium Control Rod Depth: {rodDepthPct}%
          <input type="range" min={0} max={100} step={5} value={rodDepthPct} onChange={(e) => { setRodDepthPct(Number(e.target.value)); onInteract(); onComplete('Controlled 3D U-235 nuclear fission with Boron control rods!'); }} className="w-full accent-[var(--science)] mt-1" />
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setRodDepthPct(90); onInteract(); }} className="flex-1 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold text-[var(--ink)]">Shutdown (90%)</button>
          <button type="button" onClick={() => { setRodDepthPct(60); onInteract(); onComplete('Stabilized 3D Reactor at critical k ≈ 1.0!'); }} className="flex-1 py-2 rounded-xl bg-[var(--science)] text-white font-bold">Critical (60%)</button>
          <button type="button" onClick={() => { setRodDepthPct(15); onInteract(); }} className="flex-1 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-700 font-bold">Surge (15%)</button>
        </div>
        <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
          <strong>Observe in 3D:</strong> Lowering the dark Boron rods absorbs flying yellow neutrons and calms the glowing Uranium-235 fuel core to steady power (k ≈ 1.0).
        </p>
      </div>
    </div>
  );
}

/**
 * 9. SCIENCE UNIT 8 — PERIODIC CLASSIFICATION: 3D Bohr Atomic Orbital & Radius Trends Lab
 */
const PERIOD3_ELEMENTS = [
  { sym: 'Na', z: 11, radiusPm: 186, shells: [2, 8, 1], kind: 'Alkali Metal (Group 1)', ionEnergy: 'Low (loses 1e⁻ easily)' },
  { sym: 'Mg', z: 12, radiusPm: 160, shells: [2, 8, 2], kind: 'Alkaline Earth Metal (Group 2)', ionEnergy: 'Moderate (loses 2e⁻)' },
  { sym: 'Al', z: 13, radiusPm: 143, shells: [2, 8, 3], kind: 'Post-Transition Metal (Group 13)', ionEnergy: 'Moderate (loses 3e⁻)' },
  { sym: 'Si', z: 14, radiusPm: 118, shells: [2, 8, 4], kind: 'Metalloid (Group 14)', ionEnergy: 'Shares 4e⁻ covalently' },
  { sym: 'P', z: 15, radiusPm: 110, shells: [2, 8, 5], kind: 'Non-Metal (Group 15)', ionEnergy: 'High' },
  { sym: 'S', z: 16, radiusPm: 103, shells: [2, 8, 6], kind: 'Non-Metal (Group 16)', ionEnergy: 'High (gains 2e⁻)' },
  { sym: 'Cl', z: 17, radiusPm: 99, shells: [2, 8, 7], kind: 'Halogen Non-Metal (Group 17)', ionEnergy: 'Very High (gains 1e⁻)' },
  { sym: 'Ar', z: 18, radiusPm: 97, shells: [2, 8, 8], kind: 'Noble Gas (Group 18)', ionEnergy: 'Maximum (Full Octet)' },
];

export function PeriodicTrendsLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [idx, setIdx] = useState(0);
  const el = PERIOD3_ELEMENTS[idx];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7">
        <Suspense fallback={<div className="h-[320px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Bohr Atomic Orbital...</div>}>
          <ChemistryNuclear3DCanvas
            kind="periodic"
            elementSymbol={el.sym}
            atomicNumber={el.z}
            atomicRadiusPm={el.radiusPm}
            shells={el.shells}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          3D Periodic Atomic Radius Trends (Period 3: Na → Ar)
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {PERIOD3_ELEMENTS.map((item, i) => (
            <button
              key={item.sym}
              type="button"
              onClick={() => { setIdx(i); onInteract(); onComplete('Explored 3D Bohr shells & Period 3 atomic radius shrinkage!'); }}
              className={`p-2 rounded-xl border text-center transition-all ${idx === i ? 'bg-[var(--science)] text-white border-[var(--science)] shadow-sm' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--science)]'}`}
            >
              <div className="text-sm font-extrabold">{item.sym}</div>
              <div className={`text-[10px] ${idx === i ? 'text-white/90' : 'text-[var(--text-muted)]'}`}>{item.radiusPm} pm</div>
            </button>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <div className="font-extrabold text-[var(--ink)]">{el.sym} (Z = {el.z}) · {el.kind}</div>
          <div className="text-[var(--text)]">Electron Shells: <strong>[{el.shells.join(', ')}]</strong> · Ionization: <strong>{el.ionEnergy}</strong></div>
          <div className="text-[11px] text-[var(--text-muted)] pt-1">Watch the 3D orbital shells physically shrink from Na (186 pm) to Ar (97 pm) as nuclear charge pulls electrons tighter!</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 10. SCIENCE UNIT 9 — SOLUTIONS: Chemically Accurate Solubility, Saturation & True Supersaturation Lab
 * Fixes confirmed scientific defect: excess undissolved solute at constant T is SATURATED + UNDISSOLVED EXCESS
 * (NOT supersaturated!). True supersaturation requires dissolving at higher T and cooling calmly without disturbance.
 */
export function SolubilityMixerLab({ reducedMotion, onInteract }: TopicLabProps) {
  const [addedGrams, setAddedGrams] = useState(24);
  const [tempC, setTempC] = useState(25);
  const [maxDissolvedEver, setMaxDissolvedEver] = useState(24);
  const [disturbed, setDisturbed] = useState(false);

  const sol = evaluateSolubilityState(addedGrams, tempC, maxDissolvedEver, disturbed);

  const handleAddSolute = () => {
    const nextG = Math.min(96, addedGrams + 12);
    const limitAtT = Math.round(36 + (tempC - 25) * 1.2);
    setAddedGrams(nextG);
    setDisturbed(true);
    if (nextG <= limitAtT) {
      setMaxDissolvedEver(Math.max(maxDissolvedEver, nextG));
    }
    onInteract();
  };

  const handleTempChange = (nextT: number) => {
    const prevT = tempC;
    setTempC(nextT);
    const limitAtNextT = Math.round(36 + (nextT - 25) * 1.2);
    if (nextT >= prevT) {
      // Heating dissolves more solute up to the new solubility limit
      if (addedGrams <= limitAtNextT) {
        setMaxDissolvedEver(addedGrams);
        setDisturbed(false);
      } else {
        setMaxDissolvedEver(Math.max(maxDissolvedEver, limitAtNextT));
      }
    }
    onInteract();
  };

  const handleReset = () => {
    setAddedGrams(24);
    setTempC(25);
    setMaxDissolvedEver(24);
    setDisturbed(false);
  };

  const visualSpoons = Math.max(1, Math.round(addedGrams / 10));
  const visualExcess = Math.round(sol.undissolvedExcessG / 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-2.5">
        <Suspense fallback={<div className="h-[320px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Solubility Beaker...</div>}>
          <ChemistryNuclear3DCanvas
            kind="solubility"
            spoons={visualSpoons}
            tempC={tempC}
            excessCrystals={visualExcess}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <div
          className={`px-3.5 py-2.5 rounded-xl border text-xs space-y-1 ${sol.classification === 'supersaturated_metastable'
            ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 text-purple-900 dark:text-purple-200'
            : sol.classification === 'saturated_with_excess'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-900 dark:text-amber-200'
              : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--science)]'
            }`}
        >
          <div className="font-extrabold">{sol.headline}</div>
          <p className="text-[11px] leading-relaxed text-[var(--text)]">{sol.explanation}</p>
        </div>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Solubility &amp; Saturation Lab (TN Science pp. 126–128)
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center font-mono-tabular">
          <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="text-[10px] text-[var(--text-muted)]">Added</div>
            <div className="font-extrabold text-[var(--ink)]">{addedGrams} g</div>
          </div>
          <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="text-[10px] text-[var(--text-muted)]">Dissolved</div>
            <div className="font-extrabold text-emerald-700 dark:text-emerald-300">{sol.dissolvedG} g</div>
          </div>
          <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="text-[10px] text-[var(--text-muted)]">Settled Solid</div>
            <div className="font-extrabold text-amber-700 dark:text-amber-300">{sol.undissolvedExcessG} g</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddSolute}
            className="flex-1 min-h-[40px] py-2 rounded-xl bg-[var(--science)] text-white font-bold"
          >
            + Add 12 g Solute
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] font-bold text-[var(--ink)]"
          >
            Reset
          </button>
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Water Temperature: {tempC} °C (Solubility limit ≈ {sol.solubilityLimitG} g / 100 g water)
          <input
            type="range"
            min={15}
            max={80}
            step={5}
            value={tempC}
            onChange={(e) => handleTempChange(Number(e.target.value))}
            className="w-full accent-orange-500 mt-1"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              // Demonstrate genuine two-step supersaturation: dissolve 60 g at 60 °C, then cool calmly to 25 °C!
              setAddedGrams(60);
              setMaxDissolvedEver(60);
              setTempC(25);
              setDisturbed(false);
              onInteract();
            }}
            className="min-h-[38px] flex-1 px-2.5 py-1.5 rounded-xl bg-purple-700 text-white font-bold"
          >
            Create True Supersaturated (Heat 60 °C → Cool 25 °C)
          </button>
          {sol.classification === 'supersaturated_metastable' && (
            <button
              type="button"
              onClick={() => { setDisturbed(true); onInteract(); }}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold"
            >
              Drop Seed Crystal (Precipitate!)
            </button>
          )}
        </div>
        <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[11px] text-[var(--text)]">
          <strong>Key Science Rule:</strong> Excess solid resting on the bottom at constant 25 °C is a <strong>saturated solution with undissolved excess</strong> — NOT supersaturated! True supersaturation holds extra <em>dissolved</em> solute metastably until disturbed.
        </p>
      </div>
    </div>
  );
}

/**
 * 11. SCIENCE UNITS 18, 19 & 20 — GENETICS, EVOLUTION & BIOTECHNOLOGY: 3D DNA Double Helix + Punnett Square
 */
export function GeneticsPunnettLab({ reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [p1, setP1] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [p2, setP2] = useState<'TT' | 'Tt' | 'tt'>('Tt');

  const g1 = [p1[0], p1[1]];
  const g2 = [p2[0], p2[1]];
  const grid = [
    [g1[0] + g2[0], g1[0] + g2[1]],
    [g1[1] + g2[0], g1[1] + g2[1]],
  ].map((row) => row.map((pair) => (pair === 'tT' ? 'Tt' : pair)));
  const tallCount = grid.flat().filter((g) => g.includes('T')).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6">
        <Suspense fallback={<div className="h-[340px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D DNA Double Helix...</div>}>
          <BiologyCell3DCanvas kind="dna" reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Mendel&apos;s Monohybrid Cross (T = Tall, t = Dwarf)
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([['Parent 1', p1, setP1], ['Parent 2', p2, setP2]] as const).map(([label, val, setter]) => (
            <div key={label} className="space-y-1">
              <span className="font-bold text-[var(--ink)]">{label}:</span>
              <div className="flex gap-1">
                {(['TT', 'Tt', 'tt'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { setter(g); onInteract(); onComplete('Explored 3D DNA & Mendelian Punnett Square ratios!'); }}
                    className={`flex-1 py-1.5 rounded-lg border font-extrabold ${val === g ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center font-extrabold text-white bg-slate-950 p-3 rounded-xl">
          <div className="p-1.5 text-slate-400">×</div>
          <div className="p-1.5 rounded bg-slate-800 text-sky-300">{g2[0]}</div>
          <div className="p-1.5 rounded bg-slate-800 text-sky-300">{g2[1]}</div>
          <div className="p-1.5 rounded bg-slate-800 text-amber-300">{g1[0]}</div>
          {grid[0].map((c, i) => (
            <div key={i} className={`p-2 rounded border ${c.includes('T') ? 'bg-emerald-900/50 border-emerald-400/40' : 'bg-amber-900/40 border-amber-400/40'}`}>
              {c} ({c.includes('T') ? 'Tall' : 'Dwarf'})
            </div>
          ))}
          <div className="p-1.5 rounded bg-slate-800 text-amber-300">{g1[1]}</div>
          {grid[1].map((c, i) => (
            <div key={i} className={`p-2 rounded border ${c.includes('T') ? 'bg-emerald-900/50 border-emerald-400/40' : 'bg-amber-900/40 border-amber-400/40'}`}>
              {c} ({c.includes('T') ? 'Tall' : 'Dwarf'})
            </div>
          ))}
        </div>
        <div className="font-bold text-[var(--ink)]">
          Offspring Phenotype: <span className="text-emerald-600">{tallCount} Tall</span> : <span className="text-amber-600">{4 - tallCount} Dwarf</span> ({tallCount * 25}% Tall)
        </div>
      </div>
    </div>
  );
}

/**
 * 12A. SCIENCE UNIT 13 — STRUCTURAL ORGANISATION OF ANIMALS: Real US NIH 3D Animal Cell & Organ Systems Explorer
 */
export function AnimalOrganisation3DLab({ sectionTitle, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [focus, setFocus] = useState(0);
  const systems = [
    { title: '1. Animal Cell & Tissue Layers', detail: 'Animal organs like the Indian Cattle Leech (Hirudinaria) and Rabbit (Oryctolagus) are built from specialized epithelial, connective, muscular, and nervous tissues.' },
    { title: '2. Segmentation, Locomotion & Respiration', detail: 'Leech shows 33 metameres with anterior/posterior suckers and cutaneous respiration through moist skin; Rabbit breathes with spongy lungs & a muscular diaphragm.' },
    { title: '3. Excretory Kidneys, Digestive & Nervous Integration', detail: 'Rabbit has a pair of bean-shaped metanephric kidneys filtering blood into urine, while Leech uses 17 pairs of Nephridia.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6 space-y-2.5">
        <Suspense fallback={<div className="h-[340px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Animal Cell Model...</div>}>
          <BiologyCell3DCanvas kind="animal_cell" reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Structural Organisation of Animals · {sectionTitle}
        </div>
        <div className="space-y-2">
          {systems.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => { setFocus(i); onInteract(); onComplete('Explored 3D Animal Cell & Structural Organisation systems!'); }}
              className={`w-full p-3 rounded-xl border text-left transition-colors ${focus === i ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
            >
              <div className="font-extrabold">{s.title}</div>
              <p className={`mt-1 leading-relaxed ${focus === i ? 'text-white/90' : 'text-[var(--text)]'}`}>{s.detail}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 12B. SCIENCE UNITS 21, 22, 23 — HEALTH, IMMUNITY, ECOLOGY 3D STUDIO (Real US NIH Bacteria Wall GLB!)
 */
export function HealthImmuneEco3DLab({ sectionTitle, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const [step, setStep] = useState(0);
  const stages = [
    { title: '1. Recognition & Prevention', detail: 'Healthy nutrition, vaccination, clean water, and vector control prevent pathogens from breaching primary physical & chemical barriers.' },
    { title: '2. Immune Defense & Homeostasis', detail: 'White blood cells (lymphocytes) identify foreign surface antigens and produce targeted antibodies to neutralize infection.' },
    { title: '3. Sustainable Community & Environment', detail: 'Conservation of forests, rainwater harvesting, renewable solar/wind energy, and responsible e-waste recycling protect long-term ecosystem balance.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6">
        <Suspense fallback={<div className="h-[340px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Life Sciences Model...</div>}>
          <BiologyCell3DCanvas kind="immune" reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Interactive Biology &amp; Health Explorer · {sectionTitle}
        </div>
        <div className="space-y-2">
          {stages.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => { setStep(i); onInteract(); onComplete('Explored Biology Health & Environment concept stages!'); }}
              className={`w-full p-3 rounded-xl border text-left transition-colors ${step === i ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
            >
              <div className="font-extrabold">{s.title}</div>
              <p className={`mt-1 leading-relaxed ${step === i ? 'text-white/90' : 'text-[var(--text)]'}`}>{s.detail}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 13. MATHS CHAPTER 8 — PROBABILITY & STATISTICS LIVE CONVERGENCE SIMULATOR
 */
export function ProbabilityDiceLab({ onInteract, onComplete }: TopicLabProps) {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const totalRolls = counts.reduce((a, b) => a + b, 0);

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
    if (totalRolls + n >= 10) onComplete('Tested empirical vs theoretical probability P(E) = 1/6!');
  };

  return (
    <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
          <Dices className="w-4 h-4" />
          <span>Interactive Probability Convergence Simulator</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => rollN(1)} className="px-3.5 py-2 rounded-xl bg-[var(--math)] text-white text-xs font-bold">Roll 1×</button>
          <button type="button" onClick={() => rollN(25)} className="px-3.5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold">Roll 25×</button>
          <button type="button" onClick={() => { setCounts([0, 0, 0, 0, 0, 0]); setLastRoll(null); }} className="px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)]">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 items-end h-[155px] p-4 rounded-xl bg-slate-950 border border-[var(--line)]">
        {counts.map((c, idx) => {
          const pct = totalRolls > 0 ? Math.round((c / totalRolls) * 100) : 0;
          return (
            <div key={idx} className="flex flex-col items-center justify-end h-full gap-1">
              <span className="text-[10px] font-mono-tabular text-sky-300 font-bold">{pct}%</span>
              <div style={{ height: `${Math.max(6, Math.min(100, pct * 2.4))}px` }} className={`w-full max-w-[38px] rounded-t-lg transition-all ${lastRoll === idx + 1 ? 'bg-amber-400' : 'bg-violet-500'}`} />
              <span className="text-xs font-extrabold text-white">Face {idx + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="text-xs font-semibold text-[var(--ink)] flex justify-between">
        <span>Total Trials: <strong>{totalRolls}</strong></span>
        <span>Theoretical Probability: <strong>1/6 ≈ 16.7%</strong></span>
      </div>
    </div>
  );
}

/**
 * 14. SOCIAL SCIENCE — ECONOMICS: Interactive GDP Sector Builder
 */
export function EconomicsGdpLab({ onInteract, onComplete }: TopicLabProps) {
  const [agri, setAgri] = useState(18);
  const [ind, setInd] = useState(28);
  const [serv, setServ] = useState(54);
  const total = Math.max(1, agri + ind + serv);
  const agriPct = Math.round((agri / total) * 100);
  const indPct = Math.round((ind / total) * 100);
  const servPct = 100 - agriPct - indPct;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--social)]">
          Interactive Gross Domestic Product (GDP) Sector Builder
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Primary (Agriculture): ₹{agri}L Cr ({agriPct}%)
          <input type="range" min={5} max={80} value={agri} onChange={(e) => { setAgri(Number(e.target.value)); onInteract(); onComplete('Modelled Primary, Secondary & Tertiary GDP contributions!'); }} className="w-full accent-emerald-600 mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Secondary (Industry): ₹{ind}L Cr ({indPct}%)
          <input type="range" min={5} max={80} value={ind} onChange={(e) => { setInd(Number(e.target.value)); onInteract(); }} className="w-full accent-amber-600 mt-1" />
        </label>
        <label className="block font-bold text-[var(--ink)]">
          Tertiary (Services &amp; IT): ₹{serv}L Cr ({servPct}%)
          <input type="range" min={5} max={100} value={serv} onChange={(e) => { setServ(Number(e.target.value)); onInteract(); }} className="w-full accent-sky-600 mt-1" />
        </label>
      </div>
      <div className="lg:col-span-6 p-5 rounded-2xl border border-[var(--line)] bg-slate-950 text-white flex flex-col justify-between space-y-4">
        <div className="text-xs font-extrabold uppercase text-sky-300">Total GDP = ₹{total} Lakh Crore</div>
        <div className="w-full h-12 rounded-xl overflow-hidden flex border border-white/20">
          <div style={{ width: `${agriPct}%` }} className="bg-emerald-500 flex items-center justify-center text-xs font-extrabold text-slate-950">{agriPct > 12 ? `${agriPct}%` : ''}</div>
          <div style={{ width: `${indPct}%` }} className="bg-amber-400 flex items-center justify-center text-xs font-extrabold text-slate-950">{indPct > 12 ? `${indPct}%` : ''}</div>
          <div style={{ width: `${servPct}%` }} className="bg-sky-400 flex items-center justify-center text-xs font-extrabold text-slate-950">{servPct > 12 ? `${servPct}%` : ''}</div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          India’s <strong>Tertiary (Services) Sector</strong> contributes over half of national GDP, shifting the economy from agrarian to service-led growth.
        </p>
      </div>
    </div>
  );
}

/**
 * 12C. SCIENCE UNIT 23 — VISUAL COMMUNICATION: Interactive 2D Scratch Stage, Sprite & Block Script Sandbox
 * (Pure 2D block-coding workbench matching TN Class 10 Science Unit 23, p. 330)
 */
export function VisualCommunication3DLab({ sectionTitle, onInteract, onComplete }: TopicLabProps) {
  const [spriteX, setSpriteX] = useState(110);
  const [spriteY, setSpriteY] = useState(95);
  const [angleDeg, setAngleDeg] = useState(0);
  const [speech, setSpeech] = useState('Vanakkam! Click a Scratch block!');
  const [stepCount, setStepCount] = useState(0);

  const runBlock = (action: 'move' | 'turn' | 'say' | 'reset') => {
    onInteract();
    if (action === 'reset') {
      setSpriteX(110);
      setSpriteY(95);
      setAngleDeg(0);
      setSpeech('Stage reset! Ready to run script.');
      return;
    }
    if (action === 'move') {
      const rad = (angleDeg * Math.PI) / 180;
      setSpriteX((x) => Math.max(40, Math.min(340, Math.round(x + Math.cos(rad) * 40))));
      setSpriteY((y) => Math.max(40, Math.min(165, Math.round(y + Math.sin(rad) * 40))));
      setSpeech('Moved 40 steps forward!');
    } else if (action === 'turn') {
      setAngleDeg((a) => (a + 90) % 360);
      setSpeech('Turned clockwise 90°!');
    } else if (action === 'say') {
      setSpeech('Scratch = Stage + Sprite + Script Blocks (p. 330)');
    }
    setStepCount((c) => {
      const next = c + 1;
      if (next >= 3) onComplete('Built & executed Scratch visual script blocks on the 2D Stage!');
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
      <div className="lg:col-span-7 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2.5">
        <div className="flex items-center justify-between font-extrabold text-[var(--science)]">
          <span>2D Scratch Stage &amp; Sprite Preview (Unit 23 · p. 330)</span>
          <span className="font-mono-tabular text-[var(--text-muted)]">x: {spriteX}, y: {spriteY}, dir: {angleDeg}°</span>
        </div>
        <svg viewBox="0 0 380 200" className="w-full h-auto rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]" role="img" aria-label="Interactive 2D Scratch Stage and Sprite">
          <g stroke="#DDE4F0" strokeWidth="1">
            {[76, 152, 228, 304].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="200" />)}
            {[50, 100, 150].map((y) => <line key={y} x1="0" y1={y} x2="380" y2={y} />)}
          </g>
          <g transform={`translate(${spriteX}, ${spriteY}) rotate(${angleDeg})`}>
            <circle cx="0" cy="0" r="18" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <polygon points="18,0 28,-6 28,6" fill="#0B7773" />
            <circle cx="-5" cy="-5" r="2.5" fill="#13213A" />
            <circle cx="5" cy="-5" r="2.5" fill="#13213A" />
          </g>
          <rect x="14" y="12" width="352" height="28" rx="8" fill="#FFFFFF" stroke="#DDE4F0" />
          <text x="24" y="30" fontSize="11" fontWeight="700" fill="#13213A">Sprite says: “{speech}”</text>
        </svg>
      </div>
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          Scratch Script Editor · {sectionTitle}
        </div>
        <button type="button" onClick={() => runBlock('move')} className="w-full p-2.5 rounded-xl bg-sky-600 text-white font-bold text-left">
          Motion Block → move (40) steps
        </button>
        <button type="button" onClick={() => runBlock('turn')} className="w-full p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-left">
          Motion Block → turn clockwise (90°)
        </button>
        <button type="button" onClick={() => runBlock('say')} className="w-full p-2.5 rounded-xl bg-purple-600 text-white font-bold text-left">
          Looks Block → say (“Stage + Sprite + Script!”)
        </button>
        <button type="button" onClick={() => runBlock('reset')} className="w-full p-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-bold inline-flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Sprite Position
        </button>
      </div>
    </div>
  );
}

/**
 * 15. STRICT TOPIC-ACCURATE DISPATCHER (Full Curriculum Concept-First Expansion)
 * Guarantees EVERY Science, Mathematics, and Social Science subsection routes to an
 * interactive model matching its actual textbook concept — zero irrelevant 3D fallthroughs!
 */
const SCIENCE_04_CONCEPT_FIRST_IDS = new Set([
  'science-04-auto-4-3-electric-potential-and',
  'science-04-auto-4-3-1-electric-potential',
  'science-04-auto-4-8-heating-effect',
  'science-04-auto-4-8-1-joule-s-law-of-heating',
]);

const SCIENCE_04_CIRCUIT_EXACT_IDS = new Set([
  'science-04-auto-4-1-electric-current',
  'science-04-auto-4-1-2-si-unit-of-electric-current',
  'science-04-auto-4-2-electric-circuit',
  'science-04-auto-4-2-consists-of-different-components-such',
  'science-04-auto-4-2-1-electrical-components',
  'science-04-auto-4-5-resistance-of-a',
  'science-04-auto-4-5-1-unit-of-resistance',
  'science-04-auto-4-7-system-of-resistors',
  'science-04-auto-4-7-1-resistors-in-series',
  'science-04-auto-4-7-2-resistances-in-parallel',
  'science-04-auto-4-7-3-series-connection-of',
  'science-04-auto-4-7-5-difference-between-series',
]);

const SCIENCE_16_CONCEPT_FIRST_IDS = new Set([
  'science-16-auto-16-1-5-ethylene',
  'science-16-auto-16-2-1-pituitary-gland',
]);

const SCIENCE_17_CONCEPT_FIRST_IDS = new Set([
  'science-17-auto-17-8-gametogenesis',
  'science-17-auto-17-8-1-structure-of-human',
  'science-17-auto-17-8-2-structure-of-human-ovum',
]);

function isScience01TorqueOrGravity(id: string): boolean {
  return (
    id.includes('1-4-5') ||
    id.includes('1-4-6') ||
    id.includes('1-4-7') ||
    id.includes('torque') ||
    id.includes('moment') ||
    id.includes('1-9-') ||
    id.includes('1-10') ||
    id.includes('1-11') ||
    id.includes('1-12') ||
    id.includes('grav') ||
    id.includes('weight')
  );
}

function isScience02EyeOrScattering(id: string): boolean {
  return (
    id.includes('2-3-') ||
    id.includes('2-4-') ||
    id.includes('2-16-') ||
    id.includes('2-17-') ||
    id.includes('2-18-') ||
    id.includes('2-19-') ||
    id.includes('eye') ||
    id.includes('scatter') ||
    id.includes('disper')
  );
}

function isScience03Expansion(id: string): boolean {
  return id.includes('3-1') || id.includes('3-2') || id.includes('3-3');
}

function isScience06DecayOrSafety(id: string): boolean {
  return (
    id.includes('6-1') ||
    id.includes('6-2') ||
    id.includes('6-4') ||
    id.includes('6-5') ||
    id.includes('6-6')
  );
}

function isScience08MetallurgyOrCorrosion(id: string): boolean {
  return (
    id.includes('8-4-') ||
    id.includes('8-5-') ||
    id.includes('8-6') ||
    id.includes('8-7-') ||
    id.includes('8-8-') ||
    id.includes('8-9-') ||
    id.includes('8-10') ||
    id.includes('8-11') ||
    id.includes('metall') ||
    id.includes('corros') ||
    id.includes('alloy')
  );
}

function isMaths03Matrices(id: string): boolean {
  return id === 'maths-03-09' || id.includes('3-9') || id.includes('matri');
}

function isMaths03AlgebraNonQuadratic(id: string): boolean {
  return (
    id === 'maths-03-01' ||
    id === 'maths-03-02' ||
    id === 'maths-03-03' ||
    id === 'maths-03-04' ||
    id === 'maths-03-05' ||
    id.includes('3-2-') ||
    id.includes('3-3-') ||
    id.includes('3-4-') ||
    id.includes('3-5-')
  );
}

function isMaths08Statistics(id: string): boolean {
  return (
    id === 'maths-08-01' ||
    id === 'maths-08-02' ||
    id === 'maths-08-03' ||
    id.includes('8-2-') ||
    id.includes('deviation') ||
    id.includes('variance') ||
    id.includes('range')
  );
}

export function getTopicAwareLabLabel(sectionId: string): string | null {
  const id = sectionId.toLowerCase();

  // Dedicated 10-stage ConceptFirstLessonPlayer units handled upstream
  if (id.startsWith('maths-04')) return null;
  if (SCIENCE_04_CONCEPT_FIRST_IDS.has(id)) return null;
  if (SCIENCE_16_CONCEPT_FIRST_IDS.has(id)) return null;
  if (SCIENCE_17_CONCEPT_FIRST_IDS.has(id)) return null;

  // Science Unit 16 (remaining 5 hormones/glands — 100% authentic 2D!)
  if (id.startsWith('science-16')) {
    if (id.includes('auxin')) return '2D Plant Hormone Lab — Went’s Auxin Coleoptile Experiment (16.1.1)';
    if (id.includes('cytokinin')) return '2D Plant Tissue Culture — Cytokinin Morphogenesis & Richmond–Lang Effect';
    if (id.includes('gibberellin')) return '2D Plant Hormone Lab — Gibberellin Stem Elongation & Bolting';
    if (id.includes('abscisic')) return '2D Stress Hormone Lab — Abscisic Acid Stomatal Closure';
    return '2D Endocrine Lab — Pancreas Islets of Langerhans (Insulin vs Glucagon)';
  }

  // Science Unit 17 (remaining 14 reproduction & hygiene routes — 100% authentic 2D!)
  if (id.startsWith('science-17')) {
    if (id.includes('17-2')) return '2D Asexual Reproduction Lab — Rhizopus Spores, Budding & Bryophyllum';
    if (id.includes('17-3')) return '2D Angiosperm Ovule Lab — 7-Celled, 8-Nucleate Embryo Sac (Fig. 17.10)';
    if (id.includes('17-5')) return '2D Cross-Pollination Agents — Anemophily, Entomophily & Hydrophily';
    if (id.includes('17-6')) return '2D Plant Fertilization Lab — Syngamy (2n) & Triple Fusion (3n)';
    if (id.includes('17-7')) return '2D Human Male Reproductive Organ — Structure of Testes (Fig. 17.13)';
    if (id.includes('17-9')) return '2D 28-Day Menstrual Cycle & LH/Progesterone Phase Chart (Table 17.1)';
    if (id.includes('17-10')) return '2D Fertilization to Foetal Development — 280-Day Gestation Timeline';
    return '2D Reproductive Health, Family Planning, UTI & Personal Hygiene Guide';
  }

  // Science Unit 4 (all remaining electricity subtopics cleanly separated!)
  if (id.startsWith('science-04')) {
    if (id.includes('4-4-ohm')) return '2D Ohm’s Law Linear V–I Graph Workbench (Fig. 4.5)';
    if (id.includes('resist')) return '3D Electrical Resistivity Wire Chamber (R = ρL/A)';
    if (id.includes('4-9-electric-power')) return '2D Electric Power (P = VI) & Commercial Unit (1 kWh) Calculator';
    if (id.includes('4-10')) return '2D Domestic Electric Circuit (220 V), Earthing & MCB Safety Lab';
    if (id.includes('4-11') || id.includes('4-12')) return '2D LED Bulb, Interactive Seven-Segment Display (a–g) & LED TV Lab';
    if (SCIENCE_04_CIRCUIT_EXACT_IDS.has(id)) return '3D Electricity — Copper Circuit & Resistor Lab';
    return null;
  }

  // Science Unit 13 MUST precede generic 'nervous' match so Leech/Rabbit never get Human Brain/Kidney!
  if (id.startsWith('science-13')) {
    return '2D Structural Organisation of Animals — Indian Cattle Leech & Rabbit Anatomy';
  }

  if (id.startsWith('science-01')) {
    return isScience01TorqueOrGravity(id)
      ? '2D Torque (Principle of Moments) & Gravitation / Apparent Weight Lab'
      : '3D Laws of Motion & Force Track Lab';
  }
  if (id.startsWith('science-02')) {
    return isScience02EyeOrScattering(id)
      ? '2D Human Eye Defects (Myopia/Hypermetropia) & Rayleigh Scattering Lab'
      : '3D Optics — Interactive Laser Lens Bench';
  }
  if (id.startsWith('science-03')) {
    return isScience03Expansion(id)
      ? '2D Thermal Expansion (ΔL = αL₀ΔT) & Kelvin Absolute Scale Lab'
      : '3D Thermal Physics — Gas Piston & Boyle/Charles Laws Lab';
  }
  if (id.startsWith('science-05')) return '3D Acoustics — Sound Reflection, Echo & Doppler Lab';
  if (id.startsWith('science-06')) {
    return isScience06DecayOrSafety(id)
      ? '2D Alpha/Beta/Gamma Penetrating Power, Displacement Law & ICRP Dosimeter Lab'
      : '3D Nuclear Fission — U-235 Chain Reaction & Control Rod Reactor Lab';
  }
  if (id.startsWith('science-07')) {
    if (id.includes('7-1') || id.includes('7-5') || id.includes('7-6') || id.includes('7-7') || id.includes('7-8')) {
      return '2D Atoms & Molecules — Isotopes (AAM), Percent Composition & Avogadro / VD Lab';
    }
    return null; // 7.2 / 7.3 use 3D MoleculeBuilder
  }
  if (id.startsWith('science-08')) {
    return isScience08MetallurgyOrCorrosion(id)
      ? '2D Chemistry Process Flowcharts — Ore Concentration, Hall’s Al, Cu & Corrosion / Rusting'
      : '3D + 2D Periodic Classification — Bohr Atomic Radius & Trends Lab';
  }
  if (id.startsWith('science-09')) return 'Solutions — Chemically Accurate Solubility, Saturation & Supersaturation Lab';
  if (id.startsWith('science-10')) {
    if (id.includes('10-2') || id.includes('10-4') || id.includes('10-6') || id.includes('10-7') || id.includes('ph')) {
      return '2D Rate of Chemical Reaction & Interactive pH Scale (0–14) Lab';
    }
    return null; // 10.1 uses 3D + 2D SafeVirtualLab Reaction Beakers & Flowchart
  }
  if (id.startsWith('science-11')) {
    if (id.includes('11-6') || id.includes('11-7')) {
      return '2D Organic Chemistry Process Flowchart — Ethanol & Ethanoic Acid Esterification';
    }
    if (id.includes('11-5') || id.includes('11-8') || id.includes('11-9')) {
      return '2D Interactive IUPAC Name Builder & Soap Micelle Cleansing Lab';
    }
    return null; // 11.2–11.4 use 3D Hydrocarbon Molecule Builder
  }
  if (id.startsWith('science-12')) {
    if (id.includes('12-9') || id.includes('12-10') || id.includes('12-11')) {
      return '2D Plant Physiology — Photosynthesis (Calvin Cycle) & Mitochondria Respiration (ATP/RQ)';
    }
    return null; // 12.1–12.7 use Plant Anatomy Cutaway
  }
  if (id.startsWith('science-15')) {
    if (id.includes('15-5') || id.includes('15-7')) {
      return '2D Reflex Arc Circuit & Autonomic Nervous Balance Lab (Fig. 15.9)';
    }
    return 'Real 3D Human Brain & US NIH Neuron Studio';
  }
  if (id.startsWith('science-18')) {
    if (id.includes('18-7')) return '2D Human Sex Determination (44+XX × 44+XY) Gamete Fusion Lab';
    if (id.includes('18-5')) return '2D Chromosome Structure & Centromere Position Classifier (Fig. 18.5)';
    if (id.includes('18-6')) return '2D Watson–Crick Base-Pairing Builder & Semi-Conservative DNA Replication Lab';
    return '3D + 2D DNA Double Helix & Mendelian Monohybrid Cross Lab';
  }
  if (id.startsWith('science-19')) return '2D Origin & Evolution — Homologous/Analogous Organs, Archaeopteryx & ¹⁴C Dating';
  if (id.startsWith('science-20')) return '2D Breeding & Biotechnology — rDNA Plasmid Splice, Triticale & Stem Cells';
  if (id.startsWith('science-21')) return '2D Clinical Health, Lifestyle BMI/Diabetes, Protection & HIV/Cancer Facts';
  if (id.startsWith('science-22')) return '2D Environmental Management — Rainwater Harvesting, Clean Energy & 3R Waste';
  if (id.startsWith('science-23')) return '2D Scratch Visual Block-Coding Stage & Visual Communication Studio';

  // Mathematics Chapters (crisp 2D for Ch. 1–5, 8; 3D+2D for Ch. 6 Clinometer & Ch. 7 Mensuration!)
  if (id.startsWith('maths-01')) {
    if (id.includes('1-6') || id.includes('1-7') || id.includes('1-8') || id.includes('1-9') || id === 'maths-01-06' || id === 'maths-01-07' || id === 'maths-01-08' || id === 'maths-01-09') {
      return '2D Function Types (One-One/Bijection), Line Tests & Composition f(g(x)) Lab';
    }
    return '2D Relations & Functions Arrow-Mapping Machine';
  }
  if (id.startsWith('maths-02')) {
    if (id === 'maths-02-02' || id === 'maths-02-03' || id === 'maths-02-04' || id === 'maths-02-05' || id === 'maths-02-11' || id.includes('2-4-') || id.includes('2-5-') || id.includes('2-11-')) {
      return '2D Euclid’s Division Lemma, Modular Arithmetic & Special Series (Σk, Σk², Σk³) Lab';
    }
    return '2D AP/GP Growth Bars & Modular Arithmetic Studio';
  }
  if (id.startsWith('maths-03')) {
    if (isMaths03Matrices(id)) return '2D Matrices Workbench — Order, Transpose & Row × Column Multiplication';
    if (isMaths03AlgebraNonQuadratic(id)) return '2D Polynomial GCD/LCM & Rational Excluded Value Explorer';
    return '2D Quadratic Parabola & Discriminant Root Plotter';
  }
  if (id.startsWith('maths-05')) {
    if (id === 'maths-05-02' || id === 'maths-05-03' || id === 'maths-05-04' || id.includes('5-2-') || id.includes('5-4-')) {
      return '2D Triangle Area, Collinearity Test & Parallel/Perpendicular Slopes Lab';
    }
    return '2D Coordinate Geometry Distance, Midpoint & Slope Plane';
  }
  if (id.startsWith('maths-08')) {
    return isMaths08Statistics(id)
      ? '2D Statistics — Deviations, Variance, Standard Deviation (σ) & CV Lab'
      : '2D Fair Die & Probability Convergence Chart';
  }

  // Languages: English (Units 2–7) & Tamil (இயல்கள் 1–3, 5–9) intuitive dedicated 2D studios!
  if (id.startsWith('english-') && !id.startsWith('english-01')) {
    return 'Interactive 2D English Reading, Literary Craft & Vocabulary Studio';
  }
  if (id.startsWith('tamil-') && !id.startsWith('tamil-04')) {
    return 'தமிழ் இலக்கியம், சொல் நயம் & இலக்கணப் பயிற்சியகம் (2D Studio)';
  }

  // Social Science (Real NASA Accurate 2D Maps for ALL History & Geography + Interactive 2D Civics/Economics!)
  if (id.startsWith('social-economics-04')) return '2D Direct Income Tax vs Indirect GST Slab Calculator (Economics Unit 4)';
  if (id.startsWith('social-geography-04')) return 'Accurate 2D India Satellite Map — Mineral Belts & Industrial Clusters';
  if (id.startsWith('social-civics-04')) return '2D India’s Foreign Policy — Panchsheel, NAM & Article 51 Explorer';
  if (id.startsWith('social-civics')) return '2D Civics & Constitutional Governance Explorer';
  if (id.startsWith('social-economics')) return '2D Economics & Tamil Nadu Development Explorer';
  if (id.startsWith('social-history-') && !id.startsWith('social-history-01') && !id.startsWith('social-history-04'))
    return 'Accurate 2D Historical Satellite Atlas & Turning-Points Explorer';
  if (id.startsWith('social-geography-') && !id.startsWith('social-geography-01'))
    return 'Accurate 2D India & Tamil Nadu Satellite Geography Atlas';

  return null;
}

export function renderTopicAwareInteractiveLab(props: TopicLabProps): React.ReactNode | null {
  const id = props.sectionId.toLowerCase();

  if (id.startsWith('maths-04')) return null;
  if (SCIENCE_04_CONCEPT_FIRST_IDS.has(id)) return null;
  if (SCIENCE_16_CONCEPT_FIRST_IDS.has(id)) return null;
  if (SCIENCE_17_CONCEPT_FIRST_IDS.has(id)) return null;

  // Science Unit 16 (remaining 5 hormones/glands)
  if (id.startsWith('science-16')) {
    const variant = id.includes('auxin')
      ? 'auxins'
      : id.includes('cytokinin')
        ? 'cytokinins'
        : id.includes('gibberellin')
          ? 'gibberellins'
          : id.includes('abscisic')
            ? 'abscisic_acid'
            : 'pancreas';
    return <PlantAndEndocrineHormones2D variant={variant} onExplore={props.onInteract} />;
  }

  // Science Unit 17 (remaining 14 reproduction & hygiene routes)
  if (id.startsWith('science-17')) {
    const variant = id.includes('17-2')
      ? 'asexual_spores'
      : id.includes('17-3')
        ? 'flower_ovule'
        : id.includes('17-5')
          ? 'pollination_agents'
          : id.includes('17-6')
            ? 'double_fertilization'
            : id.includes('17-7')
              ? 'human_testes'
              : id.includes('17-9')
                ? 'menstrual_cycle'
                : id.includes('17-10')
                  ? 'foetal_timeline'
                  : 'reproductive_health_hygiene';
    return <Unit17ReproductionSuite2D variant={variant} onExplore={props.onInteract} />;
  }

  // Science Unit 4 (all distinct electricity concepts)
  if (id.startsWith('science-04')) {
    if (id.includes('4-4-ohm')) return <ElectricityExtensions2D variant="ohms_law_graph" onExplore={props.onInteract} />;
    if (id.includes('resist')) return <ElectricalResistivity3DLab {...props} />;
    if (id.includes('4-9-electric-power')) return <ElectricityExtensions2D variant="electric_power_kwh" onExplore={props.onInteract} />;
    if (id.includes('4-10')) return <ElectricityExtensions2D variant="domestic_circuits_safety" onExplore={props.onInteract} />;
    if (id.includes('4-11') || id.includes('4-12')) return <ElectricityExtensions2D variant="led_seven_segment" onExplore={props.onInteract} />;
    if (SCIENCE_04_CIRCUIT_EXACT_IDS.has(id)) return <ElectricityCircuitLab {...props} />;
    return null;
  }

  // Science Unit 13 (Leech & Rabbit — checked before generic nervous system!)
  if (id.startsWith('science-13')) {
    return <ScienceMismatchFixes2D variant="leech_rabbit_anatomy" sectionId={props.sectionId} onExplore={props.onInteract} />;
  }

  if (id.startsWith('science-01')) {
    return isScience01TorqueOrGravity(id)
      ? <ScienceMismatchFixes2D variant="torque_gravitation" sectionId={props.sectionId} onExplore={props.onInteract} />
      : <MotionForce3DLab {...props} />;
  }
  if (id.startsWith('science-02')) {
    return isScience02EyeOrScattering(id)
      ? <ScienceMismatchFixes2D variant="optics_eye_scattering" sectionId={props.sectionId} onExplore={props.onInteract} />
      : <OpticsRayBenchLab {...props} />;
  }
  if (id.startsWith('science-03')) {
    return isScience03Expansion(id)
      ? <ScienceMismatchFixes2D variant="thermal_expansion" sectionId={props.sectionId} onExplore={props.onInteract} />
      : <ThermalGasPistonLab {...props} />;
  }
  if (id.startsWith('science-05')) return <AcousticsEchoLab {...props} />;
  if (id.startsWith('science-06')) {
    return isScience06DecayOrSafety(id)
      ? <ScienceMismatchFixes2D variant="nuclear_decay_safety" sectionId={props.sectionId} onExplore={props.onInteract} />
      : <NuclearChainReactionLab {...props} />;
  }
  if (id.startsWith('science-07')) {
    if (id.includes('7-1') || id.includes('7-5') || id.includes('7-6') || id.includes('7-7') || id.includes('7-8')) {
      return <SubchapterDifferentiatedLabs2D variant="atoms_isotopes_avogadro" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return null;
  }
  if (id.startsWith('science-08')) {
    return isScience08MetallurgyOrCorrosion(id)
      ? <ScienceMismatchFixes2D variant="metallurgy_corrosion" sectionId={props.sectionId} onExplore={props.onInteract} />
      : <PeriodicTrendsLab {...props} />;
  }
  if (id.startsWith('science-09')) return <SolubilityMixerLab {...props} />;
  if (id.startsWith('science-10')) {
    if (id.includes('10-2') || id.includes('10-4') || id.includes('10-6') || id.includes('10-7') || id.includes('ph')) {
      return <SubchapterDifferentiatedLabs2D variant="chem_rate_ph" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return null;
  }
  if (id.startsWith('science-11')) {
    if (id.includes('11-5') || id.includes('11-6') || id.includes('11-7') || id.includes('11-8') || id.includes('11-9')) {
      return <SubchapterDifferentiatedLabs2D variant="organic_iupac_process" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return null;
  }
  if (id.startsWith('science-12')) {
    if (id.includes('12-9') || id.includes('12-10') || id.includes('12-11')) {
      return <SubchapterDifferentiatedLabs2D variant="plant_photosynthesis_respiration" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return null;
  }
  if (id.startsWith('science-15')) {
    if (id.includes('15-5') || id.includes('15-7')) {
      return <SubchapterDifferentiatedLabs2D variant="nervous_reflex_arc" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return <NeuronHormone3DLab {...props} />;
  }
  if (id.startsWith('science-18')) {
    if (id.includes('18-7')) {
      return <SubchapterDifferentiatedLabs2D variant="genetics_sex_determination" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    if (id.includes('18-5')) {
      return <SubchapterDifferentiatedLabs2D variant="genetics_chromosome" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    if (id.includes('18-6')) {
      return <SubchapterDifferentiatedLabs2D variant="genetics_dna_replication" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return <GeneticsPunnettLab {...props} />;
  }
  if (id.startsWith('science-19')) {
    return <ScienceMismatchFixes2D variant="evolution_fossils" sectionId={props.sectionId} onExplore={props.onInteract} />;
  }
  if (id.startsWith('science-20')) {
    return <ScienceMismatchFixes2D variant="biotech_rdna" sectionId={props.sectionId} onExplore={props.onInteract} />;
  }
  if (id.startsWith('science-21')) {
    return <SubchapterDifferentiatedLabs2D variant="health_clinical_2d" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
  }
  if (id.startsWith('science-22')) {
    return <ScienceMismatchFixes2D variant="environment_conservation" sectionId={props.sectionId} onExplore={props.onInteract} />;
  }
  if (id.startsWith('science-23')) return <VisualCommunication3DLab {...props} />;

  // Mathematics Chapters
  if (id.startsWith('maths-01')) {
    if (id.includes('1-6') || id.includes('1-7') || id.includes('1-8') || id.includes('1-9') || id === 'maths-01-06' || id === 'maths-01-07' || id === 'maths-01-08' || id === 'maths-01-09') {
      return <SubchapterDifferentiatedLabs2D variant="maths1_relations_subtopics" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return <MathsRelations3DLab {...props} />;
  }
  if (id.startsWith('maths-02')) {
    if (id === 'maths-02-02' || id === 'maths-02-03' || id === 'maths-02-04' || id === 'maths-02-05' || id === 'maths-02-11' || id.includes('2-4-') || id.includes('2-5-') || id.includes('2-11-')) {
      return <SubchapterDifferentiatedLabs2D variant="maths2_euclid_modulo_series" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return <MathsSequences3DLab {...props} />;
  }
  if (id.startsWith('maths-03')) {
    if (isMaths03Matrices(id)) return <MathsExtensions2D variant="matrices_ops" onExplore={props.onInteract} />;
    if (isMaths03AlgebraNonQuadratic(id)) return <MathsExtensions2D variant="algebra_gcd_rational" onExplore={props.onInteract} />;
    return <MathsAlgebra3DLab {...props} />;
  }
  if (id.startsWith('maths-05')) {
    if (id === 'maths-05-02' || id === 'maths-05-03' || id === 'maths-05-04' || id.includes('5-2-') || id.includes('5-4-')) {
      return <SubchapterDifferentiatedLabs2D variant="maths5_area_slope_lines" sectionId={props.sectionId} sectionTitle={props.sectionTitle} reducedMotion={props.reducedMotion} onExplore={props.onInteract} />;
    }
    return <MathsCoordinate3DLab {...props} />;
  }
  if (id.startsWith('maths-08')) {
    return isMaths08Statistics(id)
      ? <MathsExtensions2D variant="statistics_dispersion" onExplore={props.onInteract} />
      : <MathsProbability3DLab {...props} />;
  }

  // Languages: English (Units 2–7) & Tamil (இயல்கள் 1–3, 5–9) dedicated intuitive 2D studios
  if (id.startsWith('english-') && !id.startsWith('english-01')) {
    return (
      <LanguageStudioUnified2D
        sectionId={props.sectionId}
        sectionTitle={props.sectionTitle}
        unitTitle={props.unitTitle ?? 'Class 10 English'}
        subject="english"
        onExplore={props.onInteract}
      />
    );
  }
  if (id.startsWith('tamil-') && !id.startsWith('tamil-04')) {
    return (
      <LanguageStudioUnified2D
        sectionId={props.sectionId}
        sectionTitle={props.sectionTitle}
        unitTitle={props.unitTitle ?? 'பத்தாம் வகுப்புத் தமிழ்'}
        subject="tamil"
        onExplore={props.onInteract}
      />
    );
  }

  // Social Science 2D Concept Labs
  if (id.startsWith('social-economics-04')) {
    return <SocialExtensions2D variant="economics_taxes_gst" sectionId={props.sectionId} sectionTitle={props.sectionTitle} onExplore={props.onInteract} />;
  }
  if (id.startsWith('social-geography-04')) {
    return <SocialExtensions2D variant="geography_resources_industries" sectionId={props.sectionId} sectionTitle={props.sectionTitle} onExplore={props.onInteract} />;
  }
  if (id.startsWith('social-civics-04')) {
    return <SocialExtensions2D variant="civics_foreign_policy" sectionId={props.sectionId} sectionTitle={props.sectionTitle} onExplore={props.onInteract} />;
  }
  if (
    id.startsWith('social-civics') ||
    id.startsWith('social-economics') ||
    (id.startsWith('social-history-') && !id.startsWith('social-history-01') && !id.startsWith('social-history-04')) ||
    (id.startsWith('social-geography-') && !id.startsWith('social-geography-01'))
  ) {
    return <SocialExtensions2D variant="social_chapter_2d" sectionId={props.sectionId} sectionTitle={props.sectionTitle} onExplore={props.onInteract} />;
  }

  return null;
}

/**
 * Returns true ONLY when the active interactive stage actually mounts a Three.js 3D canvas!
 * Used by EngineShell and SectionPlayerPage to hide redundant "2D & Text" buttons on already-2D lessons.
 */
export function isRouteUsing3DView(sectionId: string, engine?: string): boolean {
  const label = getTopicAwareLabLabel(sectionId);
  if (label) {
    return label.includes('3D') || label.startsWith('Solutions —');
  }
  const id = sectionId.toLowerCase();
  if (id.startsWith('english-') || id.startsWith('tamil-') || id.startsWith('maths-04')) return false;
  if (id.startsWith('social-history-')) return false;
  if (id.startsWith('maths-06') && (id === 'maths-06-01' || id === 'maths-06-02')) return false;
  if (
    id.startsWith('science-07') ||
    id.startsWith('science-10') ||
    id.startsWith('science-11') ||
    id.startsWith('science-12') ||
    id.startsWith('science-14') ||
    id.startsWith('maths-06') ||
    id.startsWith('maths-07') ||
    id.startsWith('social-geography-01')
  ) {
    return true;
  }
  return engine === 'ModelExplorer3D' || engine === 'SafeVirtualLab' || engine === 'GeoMap';
}
