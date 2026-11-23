import React, { Suspense, lazy, useMemo, useState } from 'react';
import {
  Atom,
  Dna,
  Droplets,
  Eye,
  Flame,
  Hammer,
  Microscope,
  Radio,
  Scale,
  Sprout,
} from 'lucide-react';

const ChemicalProcess3DCanvas = lazy(() => import('./ChemicalProcess3DCanvas'));

export type ScienceMismatch2DVariant =
  | 'torque_gravitation'
  | 'optics_eye_scattering'
  | 'thermal_expansion'
  | 'nuclear_decay_safety'
  | 'metallurgy_corrosion'
  | 'leech_rabbit_anatomy'
  | 'evolution_fossils'
  | 'biotech_rdna'
  | 'environment_conservation';

interface ScienceMismatchFixes2DProps {
  variant: ScienceMismatch2DVariant;
  sectionId: string;
  onExplore: () => void;
}

/**
 * Pure deterministic helpers (also unit-tested in conceptFirstRebuild.test.ts)
 */
export function computeTorqueAndLift(
  leftForceN: number,
  leftDistM: number,
  rightForceN: number,
  rightDistM: number,
  massKg: number,
  liftAccelMs2: number,
  liftDirection: 'up' | 'down' | 'freefall',
) {
  const g = 9.8;
  const antiClockwiseNm = Number((leftForceN * leftDistM).toFixed(2));
  const clockwiseNm = Number((rightForceN * rightDistM).toFixed(2));
  const netTorqueNm = Number((clockwiseNm - antiClockwiseNm).toFixed(2));
  const isBalanced = Math.abs(netTorqueNm) < 0.01;
  const trueWeightN = Number((massKg * g).toFixed(2));
  const apparentWeightN =
    liftDirection === 'freefall'
      ? 0
      : liftDirection === 'up'
        ? Number((massKg * (g + liftAccelMs2)).toFixed(2))
        : Number(Math.max(0, massKg * (g - liftAccelMs2)).toFixed(2));
  return { antiClockwiseNm, clockwiseNm, netTorqueNm, isBalanced, trueWeightN, apparentWeightN };
}

export function computeNuclearDecayDaughter(
  parentZ: number,
  parentA: number,
  decayType: 'alpha' | 'beta' | 'gamma',
) {
  if (decayType === 'alpha') {
    return { daughterZ: parentZ - 2, daughterA: parentA - 4, emitted: '⁴₂He (Alpha particle)' };
  }
  if (decayType === 'beta') {
    return { daughterZ: parentZ + 1, daughterA: parentA, emitted: '⁰₋₁e (Beta particle)' };
  }
  return { daughterZ: parentZ, daughterA: parentA, emitted: 'γ (High-energy photon)' };
}

export function computeRainwaterHarvestLiters(
  roofAreaM2: number,
  rainfallMm: number,
  runoffCoeff = 0.85,
) {
  // 1 mm rain on 1 m² = 1 litre of water
  const grossLiters = Math.round(roofAreaM2 * rainfallMm);
  const harvestableLiters = Math.round(roofAreaM2 * rainfallMm * runoffCoeff);
  const daysForFamily = Number((harvestableLiters / 500).toFixed(1)); // ~500 L/day household
  return { grossLiters, harvestableLiters, daysForFamily };
}

/**
 * Eliminates ALL remaining conceptual mismatches across Science Units 1, 2, 3, 6, 8, 13, 19, 20, and 22.
 * Grounded in Tamil Nadu Class 10 Science (2024 Reprint) — zero irrelevant 3D models.
 */
export function ScienceMismatchFixes2D({
  variant,
  sectionId,
  onExplore,
}: ScienceMismatchFixes2DProps) {
  const id = sectionId.toLowerCase();

  // Unit 1: Torque & Gravitation
  const [unit1Tab, setUnit1Tab] = useState<'torque' | 'gravitation'>(
    id.includes('grav') || id.includes('weight') || id.includes('mass') || id.includes('rocket')
      ? 'gravitation'
      : 'torque',
  );
  const [leftF, setLeftF] = useState(20);
  const [leftD, setLeftD] = useState(3);
  const [rightF, setRightF] = useState(30);
  const [rightD, setRightD] = useState(2);
  const [liftMass, setLiftMass] = useState(50);
  const [liftAccel, setLiftAccel] = useState(2);
  const [liftDir, setLiftDir] = useState<'up' | 'down' | 'freefall'>('up');

  // Unit 2: Eye Defects, Dispersion & Rayleigh Scattering
  const [opticsMode, setOpticsMode] = useState<'myopia' | 'hypermetropia' | 'scattering'>(
    id.includes('scatter') || id.includes('disper') ? 'scattering' : 'myopia',
  );
  const [correctiveLensOn, setCorrectiveLensOn] = useState(true);
  const [wavelengthNm, setWavelengthNm] = useState(450);

  // Unit 3: Thermal Expansion & Kelvin Scale
  const [tempC, setTempC] = useState(80);
  const [metalKind, setMetalKind] = useState<'aluminium' | 'copper' | 'iron'>('copper');

  // Unit 6: Alpha/Beta/Gamma Decay & Safety Dosimeter
  const [decayType, setDecayType] = useState<'alpha' | 'beta' | 'gamma'>(
    id.includes('beta') ? 'beta' : id.includes('gamma') ? 'gamma' : 'alpha',
  );
  const [shield, setShield] = useState<'paper' | 'aluminium' | 'lead'>('aluminium');
  const [annualDoseMsv, setAnnualDoseMsv] = useState(12);

  // Unit 8: Metallurgy (Al/Cu/Fe) & Corrosion + 3D Chemical Process Flow state
  const [metalTab, setMetalTab] = useState<'aluminium' | 'copper' | 'corrosion'>(
    id.includes('corros') || id.includes('pamban') || id.includes('alloy')
      ? 'corrosion'
      : id.includes('copper')
        ? 'copper'
        : 'aluminium',
  );
  const [metalStage, setMetalStage] = useState(1);
  const [furnaceHeatOn, setFurnaceHeatOn] = useState(true);
  const [corroMoisture, setCorroMoisture] = useState(true);
  const [corroAir, setCorroAir] = useState(true);
  const [corroProtection, setCorroProtection] = useState<'none' | 'galvanization' | 'anodizing' | 'alloying'>('none');

  // Unit 13: Leech vs Rabbit Anatomy
  const [animalTab, setAnimalTab] = useState<'leech' | 'rabbit'>(
    id.includes('13-2') || id.includes('rabbit') ? 'rabbit' : 'leech',
  );
  const [leechPart, setLeechPart] = useState<'suckers' | 'crop' | 'nephridia' | 'nervous'>(
    id.includes('excret') ? 'nephridia' : id.includes('nervous') ? 'nervous' : 'suckers',
  );
  const [rabbitPart, setRabbitPart] = useState<'dentition' | 'lungs' | 'heart' | 'kidney'>(
    id.includes('respir') ? 'lungs' : id.includes('circul') ? 'heart' : id.includes('urino') ? 'kidney' : 'dentition',
  );

  // Unit 19: Evolution & Fossils
  const [evoTab, setEvoTab] = useState<'organs' | 'archaeopteryx' | 'carbon14' | 'ethnobotany'>(
    id.includes('fossil') || id.includes('age')
      ? 'carbon14'
      : id.includes('ethno')
        ? 'ethnobotany'
        : id.includes('19-2')
          ? 'archaeopteryx'
          : 'organs',
  );
  const [halfLives, setHalfLives] = useState(2);

  // Unit 20: Plant Breeding, rDNA & Medicine
  const [bioTab, setBioTab] = useState<'rdna' | 'hybrid' | 'medicine'>(
    id.includes('20-2') || id.includes('20-3') || id.includes('20-4')
      ? 'hybrid'
      : id.includes('20-6') || id.includes('20-7')
        ? 'medicine'
        : 'rdna',
  );
  const [rdnaStep, setRdnaStep] = useState(0);

  // Unit 22: Environmental Management
  const [envTab, setEnvTab] = useState<'rainwater' | 'energy' | 'forest' | 'waste'>(
    id.includes('rainwater')
      ? 'rainwater'
      : id.includes('forest') || id.includes('wildlife') || id.includes('soil')
        ? 'forest'
        : id.includes('waste') || id.includes('sewage')
          ? 'waste'
          : 'energy',
  );
  const [roofArea, setRoofArea] = useState(100);
  const [rainMm, setRainMm] = useState(40);
  const [renewablePct, setRenewablePct] = useState(65);

  const torqueRes = useMemo(
    () => computeTorqueAndLift(leftF, leftD, rightF, rightD, liftMass, liftAccel, liftDir),
    [leftF, leftD, rightF, rightD, liftMass, liftAccel, liftDir],
  );

  const decayRes = useMemo(() => computeNuclearDecayDaughter(92, 238, decayType), [decayType]);
  const rainRes = useMemo(() => computeRainwaterHarvestLiters(roofArea, rainMm), [roofArea, rainMm]);

  // 1. UNIT 1 — TORQUE (MOMENT OF FORCE) & GRAVITATION / APPARENT WEIGHT
  if (variant === 'torque_gravitation') {
    const tiltDeg = Math.max(-16, Math.min(16, torqueRes.netTorqueNm * 0.25));
    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setUnit1Tab('torque'); onExplore(); }}
            className={`px-3.5 py-2 rounded-xl border font-bold ${unit1Tab === 'torque' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
          >
            Principle of Moments (τ = F × d)
          </button>
          <button
            type="button"
            onClick={() => { setUnit1Tab('gravitation'); onExplore(); }}
            className={`px-3.5 py-2 rounded-xl border font-bold ${unit1Tab === 'gravitation' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
          >
            Gravitation, Apparent Weight &amp; Weightlessness
          </button>
        </div>

        {unit1Tab === 'torque' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <svg viewBox="0 0 500 220" role="img" aria-label="Balanced lever beam illustrating Principle of Moments" className="w-full h-auto">
                <polygon points="250,128 228,185 272,185" fill="#475569" />
                <text x="250" y="204" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Pivot / Fulcrum (O)</text>
                <g transform={`rotate(${tiltDeg} 250 128)`}>
                  <rect x="60" y="120" width="380" height="14" rx="6" fill="#0f766e" />
                  {/* Left Force */}
                  <rect x={250 - leftD * 38 - 18} y="82" width="36" height="38" rx="6" fill="#2563eb" />
                  <text x={250 - leftD * 38} y="105" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">{leftF}N</text>
                  <text x={250 - leftD * 38} y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">d₁={leftD}m</text>
                  {/* Right Force */}
                  <rect x={250 + rightD * 38 - 18} y="82" width="36" height="38" rx="6" fill="#d97706" />
                  <text x={250 + rightD * 38} y="105" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">{rightF}N</text>
                  <text x={250 + rightD * 38} y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#b45309">d₂={rightD}m</text>
                </g>
                <text x="250" y="28" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={torqueRes.isBalanced ? '#15803d' : '#b45309'}>
                  {torqueRes.isBalanced
                    ? 'EQUILIBRIUM! Anticlockwise Moment = Clockwise Moment'
                    : torqueRes.netTorqueNm > 0
                      ? 'Tilts Clockwise (Right Moment Larger)'
                      : 'Tilts Anticlockwise (Left Moment Larger)'}
                </text>
              </svg>
            </div>
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>Moment of a Force / Torque (pp. 5–7)</span>
              </div>
              <label className="block font-bold text-[var(--ink)]">
                Left Force F₁: {leftF} N · Distance d₁: {leftD} m (τ₁ = {torqueRes.antiClockwiseNm} N·m)
                <input type="range" min={10} max={50} step={5} value={leftF} onChange={(e) => { setLeftF(Number(e.target.value)); onExplore(); }} className="w-full accent-blue-600 mt-1" />
                <input type="range" min={1} max={4} step={0.5} value={leftD} onChange={(e) => { setLeftD(Number(e.target.value)); onExplore(); }} className="w-full accent-blue-400 mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Right Force F₂: {rightF} N · Distance d₂: {rightD} m (τ₂ = {torqueRes.clockwiseNm} N·m)
                <input type="range" min={10} max={50} step={5} value={rightF} onChange={(e) => { setRightF(Number(e.target.value)); onExplore(); }} className="w-full accent-amber-600 mt-1" />
                <input type="range" min={1} max={4} step={0.5} value={rightD} onChange={(e) => { setRightD(Number(e.target.value)); onExplore(); }} className="w-full accent-amber-400 mt-1" />
              </label>
              <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
                <strong>Principle of Moments:</strong> At equilibrium, F₁ × d₁ = F₂ × d₂. Longer spanner handles increase d so less force F turns tight bolts!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
              <div className="font-extrabold text-sm text-[var(--ink)]">Apparent Weight in a Moving Lift (Table 1.1, pp. 10–11)</div>
              <div className="grid grid-cols-3 gap-1.5">
                {([['up', 'Accelerating Up (a↑)'], ['down', 'Accelerating Down (a↓)'], ['freefall', 'Free Fall (a = g)']] as const).map(([k, lbl]) => (
                  <button key={k} type="button" onClick={() => { setLiftDir(k); onExplore(); }} className={`p-2 rounded-xl border font-bold ${liftDir === k ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
              <label className="block font-bold text-[var(--ink)]">
                Person Mass (m — stays constant everywhere): {liftMass} kg
                <input type="range" min={20} max={90} step={5} value={liftMass} onChange={(e) => { setLiftMass(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--science)] mt-1" />
              </label>
              {liftDir !== 'freefall' && (
                <label className="block font-bold text-[var(--ink)]">
                  Lift Acceleration (a): {liftAccel} m/s²
                  <input type="range" min={0} max={6} step={0.5} value={liftAccel} onChange={(e) => { setLiftAccel(Number(e.target.value)); onExplore(); }} className="w-full accent-amber-600 mt-1" />
                </label>
              )}
            </div>
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 font-mono-tabular">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--text-muted)]">True Weight (W = mg)</div>
                  <div className="text-lg font-extrabold text-[var(--ink)]">{torqueRes.trueWeightN} N</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--text-muted)]">Scale Reading (Apparent R)</div>
                  <div className="text-lg font-extrabold text-[var(--science)]">{torqueRes.apparentWeightN} N</div>
                </div>
              </div>
              <p className="font-sans text-[var(--text)] leading-relaxed">
                {liftDir === 'freefall'
                  ? 'Weightlessness (R = m(g − g) = 0 N)! Astronauts in orbit are NOT in zero gravity — both spacecraft and astronaut fall together around Earth (p. 11)!'
                  : liftDir === 'up'
                    ? 'Accelerating upward: R = m(g + a) > W. You feel heavier against the lift floor.'
                    : 'Accelerating downward: R = m(g − a) < W. You feel lighter.'}
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-sans text-[11px] text-[var(--text-muted)]">
                <strong>Formula Key:</strong> g = GM / R² ≈ 9.8 m/s² (higher at Poles, slightly lower at Equator &amp; high altitudes). Rocket propulsion obeys Newton’s 3rd Law &amp; Conservation of Linear Momentum.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. UNIT 2 — HUMAN EYE DEFECTS (MYOPIA/HYPERMETROPIA) & RAYLEIGH SCATTERING / DISPERSION
  if (variant === 'optics_eye_scattering') {
    const scatterStrength = Number((Math.pow(650 / wavelengthNm, 4)).toFixed(2));
    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {([
            ['myopia', 'Myopia (Short-Sightedness)'],
            ['hypermetropia', 'Hypermetropia (Long-Sightedness)'],
            ['scattering', 'Dispersion & Rayleigh Scattering (I ∝ 1/λ⁴)'],
          ] as const).map(([k, lbl]) => (
            <button key={k} type="button" onClick={() => { setOpticsMode(k); onExplore(); }} className={`px-3 py-2 rounded-xl border font-bold ${opticsMode === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              {lbl}
            </button>
          ))}
        </div>

        {opticsMode === 'scattering' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-slate-950 p-4 text-white">
              <svg viewBox="0 0 480 200" role="img" aria-label="Rayleigh scattering intensity comparison across wavelengths" className="w-full h-auto">
                <text x="240" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#e2e8f0">
                  Rayleigh Scattering Law: Intensity I ∝ 1 / λ⁴ (p. 20)
                </text>
                {/* Incoming sun ray */}
                <line x1="30" y1="105" x2="185" y2="105" stroke={wavelengthNm < 490 ? '#38bdf8' : wavelengthNm < 570 ? '#4ade80' : '#f87171'} strokeWidth="5" />
                <circle cx="205" cy="105" r="18" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
                <text x="205" y="142" textAnchor="middle" fontSize="10" fill="#cbd5e1">Air Molecule</text>
                {/* Scattered rays scale with intensity */}
                {[-55, -25, 25, 55].map((ang, i) => (
                  <line
                    key={i}
                    x1="220"
                    y1="105"
                    x2={220 + Math.cos((ang * Math.PI) / 180) * Math.min(180, 40 + scatterStrength * 28)}
                    y2={105 + Math.sin((ang * Math.PI) / 180) * Math.min(85, 22 + scatterStrength * 14)}
                    stroke={wavelengthNm < 490 ? '#38bdf8' : wavelengthNm < 570 ? '#4ade80' : '#f87171'}
                    strokeWidth={wavelengthNm < 490 ? '3.5' : '2'}
                    strokeDasharray="6 4"
                  />
                ))}
                <text x="355" y="175" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fde047">
                  Relative Scatter: {scatterStrength}× vs Red (650 nm)
                </text>
              </svg>
            </div>
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <label className="block font-bold text-[var(--ink)]">
                Light Wavelength (λ): {wavelengthNm} nm ({wavelengthNm < 490 ? 'Blue / Violet' : wavelengthNm < 580 ? 'Green / Yellow' : 'Orange / Red'})
                <input type="range" min={410} max={680} step={15} value={wavelengthNm} onChange={(e) => { setWavelengthNm(Number(e.target.value)); onExplore(); }} className="w-full accent-sky-600 mt-1" />
              </label>
              <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
                <strong>Why is the sky blue &amp; sunrise/sunset red?</strong> Short-wavelength blue light scatters far more strongly (~4–6×) across atmospheric gases. At sunrise/sunset, sunlight travels a longer atmospheric path so blue scatters away and long-wavelength <strong>Red</strong> reaches our eyes!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <svg viewBox="0 0 500 220" role="img" aria-label={`Human eye ray diagram for ${opticsMode}`} className="w-full h-auto">
                {/* Eyeball */}
                <circle cx="330" cy="110" r="76" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
                {/* Eye Lens */}
                <ellipse cx="268" cy="110" rx="12" ry="34" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                {/* Retina back wall */}
                <path d="M 398 70 A 76 76 0 0 1 398 150" fill="none" stroke="#dc2626" strokeWidth="5" />
                <text x="415" y="114" fontSize="11" fontWeight="800" fill="#dc2626">Retina</text>

                {/* Corrective Spectacle Lens */}
                {correctiveLensOn && (
                  <g>
                    <rect x="178" y="68" width="14" height="84" rx={opticsMode === 'hypermetropia' ? 8 : 2} fill="#e0e7ff" stroke="#4338ca" strokeWidth="2" />
                    <text x="185" y="56" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#4338ca">
                      {opticsMode === 'myopia' ? 'Concave Lens' : 'Convex Lens'}
                    </text>
                  </g>
                )}

                {/* Incoming rays & focal point */}
                {(() => {
                  const focusX = correctiveLensOn ? 404 : opticsMode === 'myopia' ? 355 : 445;
                  return (
                    <g stroke="#2563eb" strokeWidth="2.4" fill="none">
                      <polyline points={`40,86 185,86 268,${correctiveLensOn ? (opticsMode === 'myopia' ? 80 : 92) : 86} ${focusX},110`} />
                      <polyline points={`40,134 185,134 268,${correctiveLensOn ? (opticsMode === 'myopia' ? 140 : 128) : 134} ${focusX},110`} />
                      <circle cx={focusX} cy="110" r="5.5" fill={correctiveLensOn ? '#16a34a' : '#dc2626'} stroke="none" />
                    </g>
                  );
                })()}
                <text x="250" y="206" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={correctiveLensOn ? '#15803d' : '#b91c1c'}>
                  {correctiveLensOn
                    ? '✓ Sharp Image Focused Directly ON the Retina!'
                    : opticsMode === 'myopia'
                      ? '✗ Image Forms IN FRONT of Retina (Distant Objects Blurry)'
                      : '✗ Image Forms BEHIND Retina (Nearby Objects Blurry)'}
                </text>
              </svg>
            </div>
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Human Eye &amp; Defect Correction (pp. 26–28)</span>
              </div>
              <button
                type="button"
                onClick={() => { setCorrectiveLensOn((v) => !v); onExplore(); }}
                className={`w-full py-2.5 rounded-xl font-bold ${correctiveLensOn ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'}`}
              >
                {correctiveLensOn
                  ? `✓ ${opticsMode === 'myopia' ? 'Concave' : 'Convex'} Corrective Lens ON — Click to Remove`
                  : `Add Corrective ${opticsMode === 'myopia' ? 'Concave' : 'Convex'} Lens`}
              </button>
              <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
                {opticsMode === 'myopia'
                  ? 'Myopia (Short-sightedness): Eyeball elongates or lens focal length is too short. Corrected using a diverging Concave Lens (f = −xy / (x − y)).'
                  : 'Hypermetropia (Long-sightedness): Eyeball shortens or focal length is too long. Corrected using a converging Convex Lens (f = dD / (d − D)).'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. UNIT 3 — THERMAL EXPANSION & KELVIN SCALE
  if (variant === 'thermal_expansion') {
    const alphaMap = {
      aluminium: { label: 'Aluminium', alpha: 23e-6, color: '#64748b' },
      copper: { label: 'Copper', alpha: 17e-6, color: '#d97706' },
      iron: { label: 'Iron / Steel', alpha: 12e-6, color: '#334155' },
    }[metalKind];
    const tempK = tempC + 273;
    const deltaT = tempC - 20;
    const deltaLMm = Number((1000 * alphaMap.alpha * deltaT).toFixed(2)); // for L0 = 1 m = 1000 mm
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 480 210" role="img" aria-label="Linear thermal expansion of metal rod" className="w-full h-auto">
            <text x="240" y="26" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
              Linear Thermal Expansion (ΔL = α · L₀ · ΔT · pp. 34–36)
            </text>
            {/* Fixed clamp */}
            <rect x="45" y="75" width="16" height="62" rx="4" fill="#334155" />
            {/* Original 1m rod */}
            <rect x="61" y="92" width="260" height="28" rx="4" fill={alphaMap.color} />
            {/* Expansion delta */}
            <rect x="321" y="92" width={Math.max(0, deltaLMm * 18)} height="28" rx="3" fill="#ef4444" />
            <text x="190" y="110" textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffffff">L₀ = 1.000 m ({alphaMap.label})</text>
            <text x={325 + Math.max(0, deltaLMm * 9)} y="82" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#dc2626">
              +ΔL = {deltaLMm} mm
            </text>
            <text x="240" y="176" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155">
              Temperature T = {tempC} °C = {tempK} K (Absolute Kelvin Scale: K = °C + 273)
            </text>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-orange-600 inline-flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            <span>Temperature &amp; Thermal Expansion (Unit 3)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['aluminium', 'copper', 'iron'] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setMetalKind(m); onExplore(); }} className={`py-2 rounded-xl border font-bold capitalize ${metalKind === m ? 'bg-orange-600 text-white border-orange-600' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                {m}
              </button>
            ))}
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Rod Temperature: {tempC} °C ({tempK} K) · ΔT = {deltaT} K
            <input type="range" min={20} max={320} step={10} value={tempC} onChange={(e) => { setTempC(Number(e.target.value)); onExplore(); }} className="w-full accent-orange-500 mt-1" />
          </label>
          <p className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]">
            <strong>Liquid Expansion Note (3.3.2):</strong> When heating liquid in a flask, level first drops slightly (container expands), then rises. Real expansion is ALWAYS greater than apparent expansion!
          </p>
        </div>
      </div>
    );
  }

  // 4. UNIT 6 — RADIOACTIVE ALPHA/BETA/GAMMA DECAY & ICRP RADIATION SAFETY
  if (variant === 'nuclear_decay_safety') {
    const blocked =
      (decayType === 'alpha') ||
      (decayType === 'beta' && (shield === 'aluminium' || shield === 'lead')) ||
      (decayType === 'gamma' && shield === 'lead');

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-slate-950 p-4 text-white space-y-3">
          <svg viewBox="0 0 480 185" role="img" aria-label="Alpha Beta Gamma radiation penetrating power test" className="w-full h-auto">
            <text x="240" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fde047">
              Penetrating Power &amp; Soddy–Fajans Displacement Law (pp. 76–84)
            </text>
            <rect x="28" y="68" width="66" height="54" rx="8" fill="#f59e0b" />
            <text x="61" y="99" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">²³⁸₉₂U</text>
            {/* Barrier */}
            <rect
              x="220"
              y="48"
              width={shield === 'paper' ? 10 : shield === 'aluminium' ? 22 : 42}
              height="94"
              rx="4"
              fill={shield === 'paper' ? '#f8fafc' : shield === 'aluminium' ? '#94a3b8' : '#334155'}
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <text x="235" y="160" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#cbd5e1">
              {shield === 'paper' ? 'Paper Sheet' : shield === 'aluminium' ? 'Aluminium Plate' : 'Thick Lead Block'}
            </text>
            {/* Ray path */}
            <line
              x1="94"
              y1="95"
              x2={blocked ? 220 : 445}
              y2="95"
              stroke={decayType === 'alpha' ? '#fb923c' : decayType === 'beta' ? '#38bdf8' : '#c084fc'}
              strokeWidth="4.5"
              strokeDasharray={decayType === 'gamma' ? '8 4' : undefined}
            />
            <text x="350" y="99" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={blocked ? '#4ade80' : '#f87171'}>
              {blocked ? 'STOPPED BY SHIELD ✓' : 'PENETRATES THROUGH!'}
            </text>
          </svg>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono-tabular text-sky-200">
            ²³⁸₉₂Parent → <strong>{decayRes.daughterA}</strong> / Z=<strong>{decayRes.daughterZ}</strong> Daughter + {decayRes.emitted}
          </div>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <Radio className="w-4 h-4" />
            <span>Radioactivity &amp; ICRP Safety Limits (p. 83)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['alpha', 'beta', 'gamma'] as const).map((t) => (
              <button key={t} type="button" onClick={() => { setDecayType(t); onExplore(); }} className={`py-2 rounded-xl border font-bold capitalize ${decayType === t ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['paper', 'aluminium', 'lead'] as const).map((s) => (
              <button key={s} type="button" onClick={() => { setShield(s); onExplore(); }} className={`py-2 rounded-xl border font-bold capitalize ${shield === s ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                {s}
              </button>
            ))}
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Pocket Dosimeter Annual Dose: {annualDoseMsv} mSv/yr ({annualDoseMsv <= 20 ? '✓ Within ICRP Safe Limit ≤ 20 mSv/yr' : '⚠ Exceeds ICRP 20 mSv/yr Limit!'})
            <input type="range" min={1} max={40} step={1} value={annualDoseMsv} onChange={(e) => { setAnnualDoseMsv(Number(e.target.value)); onExplore(); }} className="w-full accent-amber-500 mt-1" />
          </label>
          <p className="text-[11px] text-[var(--text-muted)]">
            <strong>Isotopes (p. 83):</strong> Co-60 &amp; Au-198 (cancer therapy), Cf-252 (airline explosive detection), Am-241 (smoke detectors), C-14 (carbon dating).
          </p>
        </div>
      </div>
    );
  }

  // 5. UNIT 8 — METALLURGY (3D CHEMICAL PROCESS FLOW FOR Al HALL'S PROCESS, Cu SMELTING & CORROSION!)
  if (variant === 'metallurgy_corrosion') {
    const rustOccurs = corroMoisture && corroAir && corroProtection === 'none';
    const canvasKind =
      metalTab === 'aluminium'
        ? 'hall_heroult_al'
        : metalTab === 'copper'
          ? 'copper_smelting'
          : 'rusting_galvanization';

    const stageLabels =
      metalTab === 'aluminium'
        ? ['1. Baeyer Digestion (150 °C)', '2. Hall Electrolytic Tank (950 °C)', '3. Molten Al Tap + O₂↑']
        : ['1. Froth Floatation (CuFeS₂)', '2. Bessemer Smelting Furnace', '3. CuSO₄ Electrolytic Refining'];

    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {([
            ['aluminium', '8.7 Metallurgy of Aluminium (3D Hall’s Tank)'],
            ['copper', '8.8 Metallurgy of Copper (3D Furnace & Refining)'],
            ['corrosion', '8.11 Iron Rusting & Galvanization (3D Cell · p. 120)'],
          ] as const).map(([k, lbl]) => (
            <button key={k} type="button" onClick={() => { setMetalTab(k); setMetalStage(1); onExplore(); }} className={`px-3 py-2 rounded-xl border font-bold ${metalTab === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              {lbl}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Interactive 3D Chemical Process Flow Canvas */}
          <div className="lg:col-span-6 space-y-2.5">
            <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-xs">Loading 3D Chemical Process Flow...</div>}>
              <ChemicalProcess3DCanvas
                kind={canvasKind}
                stageIndex={metalStage}
                heatOn={metalTab === 'corrosion' ? corroMoisture && corroAir : furnaceHeatOn}
                protectedCoat={corroProtection !== 'none'}
              />
            </Suspense>
            {metalTab !== 'corrosion' && (
              <div className="flex flex-wrap gap-1.5">
                {stageLabels.map((lbl, idx) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => { setMetalStage(idx); onExplore(); }}
                    className={`flex-1 py-2 px-2 rounded-xl border font-bold text-[11px] ${metalStage === idx ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}
                  >
                    {lbl}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setFurnaceHeatOn((h) => !h); onExplore(); }}
                  className={`px-3 py-2 rounded-xl font-bold text-[11px] ${furnaceHeatOn ? 'bg-orange-600 text-white' : 'bg-slate-700 text-white'}`}
                >
                  {furnaceHeatOn ? '🔥 Heat ON' : 'Heat OFF'}
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Controls & Balanced Chemical Equations */}
          <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
            {metalTab === 'corrosion' ? (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
                  <Hammer className="w-4 h-4 text-[var(--science)]" />
                  <span>Iron Rusting Simulator (Fe₂O₃·xH₂O · Fig. 8.12, p. 120)</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setCorroAir((a) => !a); onExplore(); }} className={`flex-1 py-2 rounded-xl border font-bold ${corroAir ? 'bg-sky-600 text-white border-sky-600' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    {corroAir ? '✓ Oxygen (O₂) Present' : 'No Oxygen'}
                  </button>
                  <button type="button" onClick={() => { setCorroMoisture((m) => !m); onExplore(); }} className={`flex-1 py-2 rounded-xl border font-bold ${corroMoisture ? 'bg-blue-600 text-white border-blue-600' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    {corroMoisture ? '✓ Moisture (H₂O) Present' : 'Dry Air Only'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {([['none', 'Bare Iron'], ['galvanization', 'Galvanization (Zn)'], ['anodizing', 'Anodizing (Al₂O₃)'], ['alloying', 'Stainless Steel Alloy']] as const).map(([k, l]) => (
                    <button key={k} type="button" onClick={() => { setCorroProtection(k); onExplore(); }} className={`py-2 rounded-xl border font-bold ${corroProtection === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className={`p-3 rounded-xl font-extrabold border ${rustOccurs ? 'bg-amber-100 border-amber-500 text-amber-950' : 'bg-emerald-50 border-emerald-500 text-emerald-950'}`}>
                  {rustOccurs
                    ? '⚠ WET CORROSION ACTIVE! Reddish-brown Fe₂O₃·xH₂O crust forms under the water droplet!'
                    : '✓ IRON PROTECTED! Protective Zinc/Oxide/Alloy layer blocks electrochemical rusting.'}
                </div>
                <p className="text-[var(--text)] leading-relaxed">
                  <strong>Pamban Sea Bridge (1914 · p. 120):</strong> Periodic anti-corrosive coatings shield steel girders across the salty Rameshwaram sea channel.
                </p>
              </>
            ) : metalTab === 'aluminium' ? (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">
                  Extraction of Aluminium from Bauxite (Al₂O₃·2H₂O · Fig. 8.10, p. 115)
                </div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border ${metalStage === 0 ? 'bg-[var(--info-bg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold text-[var(--science)]">Step 1 · Baeyer’s Process (150 °C → 1000 °C)</div>
                    <p className="mt-1 text-[var(--text)]">Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O → Al(OH)₃↓ → Ignited at 1000 °C → Pure Alumina (Al₂O₃).</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${metalStage === 1 ? 'bg-[var(--info-bg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold text-[var(--science)]">Step 2 · Hall’s Electrolytic Reduction (900–950 °C, 5–6 V)</div>
                    <p className="mt-1 text-[var(--text)]">Pure Alumina + Molten Cryolite (Na₃AlF₆) + Fluorspar (lowers fusion temp). Carbon rods = Anode; Graphite-lined tank = Cathode.</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${metalStage === 2 ? 'bg-[var(--info-bg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold text-[var(--science)]">Step 3 · Overall Reaction &amp; Aluminothermic Welding</div>
                    <p className="mt-1 text-[var(--text)]">2Al₂O₃ → 4Al (molten at cathode) + 3O₂↑ (reacts with graphite to CO₂). Thermite: Fe₂O₃ + 2Al → 2Fe + Al₂O₃ + Heat.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">
                  Extraction of Copper from Copper Pyrites (CuFeS₂ · p. 116)
                </div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border ${metalStage === 0 ? 'bg-[var(--info-bg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold text-[var(--science)]">1. Froth Floatation &amp; Roasting</div>
                    <p className="mt-1 text-[var(--text)]">2CuFeS₂ + O₂ → Cu₂S + 2FeS + SO₂↑ (removes moisture, sulphur &amp; volatile impurities).</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${metalStage === 1 ? 'bg-[var(--info-bg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold text-[var(--science)]">2. Smelting &amp; Bessemerisation</div>
                    <p className="mt-1 text-[var(--text)]">Iron removed as FeSiO₃ slag; Bessemer converter yields 98% Blister Copper (2Cu₂O + Cu₂S → 6Cu + SO₂↑).</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${metalStage === 2 ? 'bg-[var(--info-bg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold text-[var(--science)]">3. Electrolytic Refining in Acidified CuSO₄</div>
                    <p className="mt-1 text-[var(--text)]">Impure copper anode dissolves and deposits as 99.9% pure copper on the cathode plate!</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6. UNIT 13 — INDIAN CATTLE LEECH & RABBIT ANATOMY (REPLACES HUMAN KIDNEY!)
  if (variant === 'leech_rabbit_anatomy') {
    const leechDetails = {
      suckers: 'Anterior sucker (segments 1–5) & Posterior sucker (segments 27–33) anchor firmly to the host while three jaws make a painless Y-shaped wound; salivary glands secrete anticoagulant Hirudin (p. 192).',
      crop: 'Largest digestive chamber (segments 9–18) with 10 pairs of lateral caeca storing host blood to nourish the leech for several months without elaborate enzyme secretion.',
      nephridia: '17 pairs of segmentally arranged coiled Nephridia (segments 6–22) perform excretion — completely distinct from mammalian kidneys!',
      nervous: 'Nerve ring encircling the pharynx connected to a ventral paired nerve cord with segmental ganglia across its 33 metameres.',
    }[leechPart];

    const rabbitDetails = {
      dentition: 'Heterodont & Diphyodont dentition with Dental Formula I 2/1, C 0/0, PM 3/2, M 3/3 = 2033 / 1023 (28 teeth). Canines are absent, creating a gap called the Diastema for chewing plants!',
      lungs: 'Spongy paired lungs inside the thoracic cavity separated from the abdomen by a muscular dome-shaped Diaphragm.',
      heart: 'Four-chambered mammalian heart (2 auricles, 2 ventricles) with double circulation and warm-blooded homeostasis.',
      kidney: 'Pair of dark-red bean-shaped metanephric kidneys filtering nitrogenous wastes as urea.',
    }[rabbitPart];

    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setAnimalTab('leech'); onExplore(); }} className={`px-3.5 py-2 rounded-xl border font-bold ${animalTab === 'leech' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
            13.1 Indian Cattle Leech (Hirudinaria granulosa)
          </button>
          <button type="button" onClick={() => { setAnimalTab('rabbit'); onExplore(); }} className={`px-3.5 py-2 rounded-xl border font-bold ${animalTab === 'rabbit' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
            13.2 Common Rabbit (Oryctolagus cuniculus)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <svg viewBox="0 0 460 190" role="img" aria-label={animalTab === 'leech' ? 'Segmented body diagram of Indian Cattle Leech' : 'Organ systems and dental formula diagram of Rabbit'} className="w-full h-auto">
              {animalTab === 'leech' ? (
                <g>
                  <text x="230" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">Phylum Annelida · 33 Metameres (Segments)</text>
                  <ellipse cx="230" cy="98" rx="170" ry="34" fill="#65a30d" stroke="#365314" strokeWidth="2.5" />
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line key={i} x1={90 + i * 20} y1="68" x2={90 + i * 20} y2="128" stroke="#365314" strokeWidth="1.2" opacity="0.55" />
                  ))}
                  <circle cx="62" cy="98" r="14" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
                  <circle cx="396" cy="98" r="20" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
                  <text x="62" y="152" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e">Anterior Sucker (Seg 1–5)</text>
                  <text x="230" y="152" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#166534">17 Pairs Nephridia · Crop · Cocoon (Seg 9–11)</text>
                  <text x="396" y="152" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e">Posterior Sucker</text>
                </g>
              ) : (
                <g>
                  <text x="230" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">Phylum Chordata · Class Mammalia (Oryctolagus cuniculus)</text>
                  <rect x="45" y="48" width="370" height="114" rx="16" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                  <text x="230" y="84" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f766e">Rabbit Dental Formula: I 2/1, C 0/0, PM 3/2, M 3/3</text>
                  <text x="230" y="112" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">Written concisely: 2033 / 1023 = 28 Teeth Total</text>
                  <text x="230" y="140" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b45309">Canines Absent → Gap Called DIASTEMA (Herbivorous Adaptation!)</text>
                </g>
              )}
            </svg>
          </div>
          <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
            <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
              <Microscope className="w-4 h-4" />
              <span>{animalTab === 'leech' ? 'Leech Systems & Parasitic Adaptations' : 'Rabbit Organ Systems (pp. 192–197)'}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {animalTab === 'leech'
                ? ([['suckers', 'Suckers & Hirudin'], ['crop', 'Blood-Storing Crop'], ['nephridia', '17 Pairs Nephridia'], ['nervous', 'Ventral Nerve Cord']] as const).map(([k, l]) => (
                  <button key={k} type="button" onClick={() => { setLeechPart(k); onExplore(); }} className={`py-2 px-2 rounded-xl border font-bold ${leechPart === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
                ))
                : ([['dentition', 'Dentition & Diastema'], ['lungs', 'Lungs & Diaphragm'], ['heart', '4-Chambered Heart'], ['kidney', 'Metanephric Kidneys']] as const).map(([k, l]) => (
                  <button key={k} type="button" onClick={() => { setRabbitPart(k); onExplore(); }} className={`py-2 px-2 rounded-xl border font-bold ${rabbitPart === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
                ))}
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
              {animalTab === 'leech' ? leechDetails : rabbitDetails}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. UNIT 19 — ORIGIN & EVOLUTION OF LIFE (REPLACES PUNNETT SQUARE!)
  if (variant === 'evolution_fossils') {
    const remainingPct = Number((100 / Math.pow(2, halfLives)).toFixed(2));
    const approxYears = halfLives * 5730;
    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {([
            ['organs', 'Homologous vs Analogous'],
            ['archaeopteryx', 'Archaeopteryx (p. 276)'],
            ['carbon14', 'Radiocarbon ¹⁴C Dating'],
            ['ethnobotany', 'Ethnobotany & Astrobiology (p. 281)'],
          ] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setEvoTab(k); onExplore(); }} className={`px-3 py-2 rounded-xl border font-bold ${evoTab === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
          ))}
        </div>

        {evoTab === 'carbon14' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
              <div className="font-extrabold text-sm text-[var(--ink)]">19.5.2 Radioactive Carbon (¹⁴C) Fossil Dating (W.F. Libby)</div>
              <label className="block font-bold text-[var(--ink)]">
                Elapsed ¹⁴C Half-Lives (1 Half-Life ≈ 5,730 yrs): {halfLives}
                <input type="range" min={0} max={5} step={1} value={halfLives} onChange={(e) => { setHalfLives(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--science)] mt-1" />
              </label>
              <div className="w-full h-7 rounded-lg bg-slate-200 overflow-hidden border border-[var(--line)]">
                <div style={{ width: `${remainingPct}%` }} className="h-full bg-emerald-600 transition-all" />
              </div>
              <div className="font-mono-tabular font-extrabold text-[var(--science)]">
                Remaining ¹⁴C: {remainingPct}% → Estimated Fossil Age: ≈ {approxYears.toLocaleString()} years
              </div>
            </div>
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2">
              <div className="font-extrabold text-[var(--ink)]">Thiruvakkarai National Fossil Wood Park (Villupuram, TN · p. 281)</div>
              <p className="text-[var(--text)] leading-relaxed">
                About 2 million years ago, tree trunks buried along riverbanks had their organic matter gradually replaced by <strong>silica</strong> (petrifaction), preserving annual rings, bark texture, and nodes as solid stone!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5 leading-relaxed">
            {evoTab === 'organs' && (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">19.2 Morphological &amp; Anatomical Evidences (pp. 275–276)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <div className="font-extrabold text-emerald-700 dark:text-emerald-300">Homologous Organs (Divergent Evolution)</div>
                    <p className="mt-1 text-[var(--text)]">Same embryonic origin &amp; basic bone plan, DIFFERENT functions: Human hand, Cat foreleg, Whale flipper, Bat wing.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <div className="font-extrabold text-amber-700 dark:text-amber-300">Analogous Organs (Convergent Evolution)</div>
                    <p className="mt-1 text-[var(--text)]">DIFFERENT origin &amp; structure, SAME flight function: Insect wing, Bird wing, Bat wing. Plus Vestigial organs (appendix, coccyx) &amp; Ernst Haeckel’s Biogenetic Law.</p>
                  </div>
                </div>
              </>
            )}
            {evoTab === 'archaeopteryx' && (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">Archaeopteryx — Jurassic Connecting Link (Fig. 19.4, p. 276)</div>
                <p className="text-[var(--text)]">
                  Oldest known fossil bird bridging <strong>Reptiles</strong> (long bony tail, clawed wing digits, conical teeth) and <strong>Birds</strong> (wings with true feathers). Leonardo da Vinci is regarded as the Father of Palaeontology.
                </p>
              </>
            )}
            {evoTab === 'ethnobotany' && (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">19.6 Ethnobotany (J.W. Harshberger, 1895) &amp; 19.7 Astrobiology (p. 281)</div>
                <p className="text-[var(--text)]">
                  Ethnobotany studies traditional plant knowledge for medicine, food &amp; biodiversity. Astrobiology searches for extraterrestrial life in the <strong>Goldilocks (Habitable) Zone</strong> where liquid water can exist (Earth!).
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // 8. UNIT 20 — BREEDING & BIOTECHNOLOGY (rDNA PLASMID CUT-AND-PASTE, TRITICALE, INSULIN)
  if (variant === 'biotech_rdna') {
    const rdnaStages = [
      { title: '1. Isolate Gene & Plasmid Vector', desc: 'Extract the desired human insulin gene and circular bacterial plasmid DNA (vector).' },
      { title: '2. Molecular Scissors (Restriction Endonuclease)', desc: 'Restriction enzyme cuts both plasmid DNA and target insulin gene at matching sticky-end sequences.' },
      { title: '3. Molecular Glue (DNA Ligase)', desc: 'DNA Ligase joins the insulin gene into the plasmid, forming Recombinant DNA (rDNA)!' },
      { title: '4. Cloning in E. coli → Human Insulin (Eli Lilly, 1979)', desc: 'Host bacteria multiply rapidly and synthesize pure human insulin, clotting factors, vaccines & growth hormone (p. 293).' },
    ];

    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {([
            ['rdna', '20.5 Recombinant DNA (rDNA) Cut & Splice'],
            ['hybrid', '20.2–20.4 Plant & Animal Breeding (Triticale)'],
            ['medicine', '20.6–20.7 Biotechnology in Medicine & Stem Cells'],
          ] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setBioTab(k); onExplore(); }} className={`px-3 py-2 rounded-xl border font-bold ${bioTab === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
          ))}
        </div>

        {bioTab === 'rdna' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <svg viewBox="0 0 420 200" role="img" aria-label="Recombinant DNA plasmid insertion steps" className="w-full h-auto">
                <circle cx="135" cy="105" r="56" fill="none" stroke="#2563eb" strokeWidth="10" strokeDasharray={rdnaStep >= 1 ? '280 72' : undefined} />
                <text x="135" y="109" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e40af">Bacterial Plasmid</text>
                {rdnaStep >= 2 ? (
                  <path d="M 176 66 A 56 56 0 0 1 190 112" fill="none" stroke="#dc2626" strokeWidth="11" />
                ) : (
                  <rect x="275" y="96" width="95" height="16" rx="6" fill="#dc2626" />
                )}
                <text x="320" y="84" textAnchor="middle" fontSize="11" fontWeight="800" fill="#b91c1c">
                  {rdnaStep >= 2 ? 'Spliced by DNA Ligase ✓' : 'Target Human Gene'}
                </text>
                <text x="210" y="186" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0f766e">
                  Stage {rdnaStep + 1} / 4 · {rdnaStages[rdnaStep].title}
                </text>
              </svg>
            </div>
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
              <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
                <Dna className="w-4 h-4" />
                <span>Genetic Engineering Pipeline (pp. 291–293)</span>
              </div>
              <div className="space-y-1.5">
                {rdnaStages.map((s, i) => (
                  <button key={s.title} type="button" onClick={() => { setRdnaStep(i); onExplore(); }} className={`w-full p-2.5 rounded-xl border text-left ${rdnaStep === i ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    <div className="font-extrabold">{s.title}</div>
                    <p className={`mt-0.5 ${rdnaStep === i ? 'text-white/95' : 'text-[var(--text)]'}`}>{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5 leading-relaxed">
            {bioTab === 'hybrid' ? (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">Crop Improvement: Mutation Breeding &amp; First Man-Made Cereal Triticale (p. 290)</div>
                <p className="text-[var(--text)]">
                  <strong>Mutation Breeding:</strong> Gamma rays (Co-60 / Cs-137 in Gamma Gardens) created <strong>Sharbati Sonora</strong> wheat &amp; saline-tolerant <strong>Atomita 2</strong> rice.
                </p>
                <p className="text-[var(--text)]">
                  <strong>Triticale (2n = 42):</strong> Cross between Wheat (<em>Triticum durum</em>, 2n = 28) × Rye (<em>Secale cereale</em>, 2n = 14) → sterile F₁ (2n = 21) → Colchicine doubles chromosomes → fertile Hexaploid Triticale!
                </p>
              </>
            ) : (
              <>
                <div className="font-extrabold text-sm text-[var(--ink)]">20.6 Gene Therapy &amp; 20.7 Undifferentiated Stem Cells (p. 293)</div>
                <p className="text-[var(--text)]">
                  <strong>Somatic Gene Therapy</strong> replaces defective genes in non-reproductive body cells (benefiting the patient without altering offspring). <strong>Stem cells</strong> are unspecialised cells capable of self-renewal and differentiation into neurons, heart muscle, or pancreatic insulin-producing cells.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // 9. UNIT 22 — ENVIRONMENTAL MANAGEMENT (REPLACES BACTERIA CELL WALL!)
  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap gap-1.5">
        {([
          ['rainwater', '22.7 Rainwater Harvesting & TN Eris'],
          ['energy', '22.5–22.6 Renewable vs Fossil Energy'],
          ['forest', '22.2–22.4 Forests, Wildlife & Soil'],
          ['waste', '22.9–22.11 E-Waste, Sewage & 3R'],
        ] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => { setEnvTab(k); onExplore(); }} className={`px-3 py-2 rounded-xl border font-bold ${envTab === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
        ))}
      </div>

      {envTab === 'rainwater' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
            <div className="font-extrabold text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Rooftop Rainwater Catchment Calculator (p. 322)</span>
            </div>
            <label className="block font-bold text-[var(--ink)]">
              Rooftop Catchment Area: {roofArea} m²
              <input type="range" min={30} max={300} step={10} value={roofArea} onChange={(e) => { setRoofArea(Number(e.target.value)); onExplore(); }} className="w-full accent-sky-600 mt-1" />
            </label>
            <label className="block font-bold text-[var(--ink)]">
              Monsoon Shower Depth: {rainMm} mm
              <input type="range" min={10} max={120} step={5} value={rainMm} onChange={(e) => { setRainMm(Number(e.target.value)); onExplore(); }} className="w-full accent-blue-600 mt-1" />
            </label>
          </div>
          <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
            <div className="grid grid-cols-2 gap-2 font-mono-tabular">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="text-[10px] text-[var(--text-muted)]">Harvested &amp; Recharged (85%)</div>
                <div className="text-lg font-extrabold text-sky-700 dark:text-sky-300">{rainRes.harvestableLiters.toLocaleString()} L</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="text-[10px] text-[var(--text-muted)]">Household Supply (~500 L/day)</div>
                <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{rainRes.daysForFamily} days</div>
              </div>
            </div>
            <p className="text-[var(--text)] leading-relaxed">
              <strong>Tamil Nadu Heritage (p. 322):</strong> Interconnected village <strong>Eris</strong> (overflow channels feeding the next village), <strong>Ooranis</strong> (community ponds), and King Karikala Chola’s 2nd-century <strong>Kallanai (Grand Anicut)</strong> across the Kaveri!
            </p>
          </div>
        </div>
      ) : envTab === 'energy' ? (
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
            <Atom className="w-4 h-4 text-emerald-600" />
            <span>Clean Energy Transition Planner (Solar · Wind · Biogas · Tidal · pp. 318–322)</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Renewable Grid Share: {renewablePct}% (Coal &amp; Petroleum Fossil Share: {100 - renewablePct}%)
            <input type="range" min={10} max={95} step={5} value={renewablePct} onChange={(e) => { setRenewablePct(Number(e.target.value)); onExplore(); }} className="w-full accent-emerald-600 mt-1" />
          </label>
          <div className="w-full h-8 rounded-xl overflow-hidden flex border border-[var(--line)]">
            <div style={{ width: `${renewablePct}%` }} className="bg-emerald-600 text-white font-extrabold flex items-center justify-center">
              Renewable {renewablePct}%
            </div>
            <div style={{ width: `${100 - renewablePct}%` }} className="bg-slate-700 text-amber-200 font-extrabold flex items-center justify-center">
              Fossil {100 - renewablePct}%
            </div>
          </div>
          <p className="text-[var(--text)]">
            <strong>Key Facts:</strong> Biogas (Gobar gas) produces clean methane (~75% CH₄) anaerobically. Tidal energy is predictable and zero-emission; denser water spins tidal turbines at lower speeds than wind!
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5 leading-relaxed">
          <div className="font-extrabold text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{envTab === 'forest' ? 'Forests, Wildlife Initiatives & Soil Conservation (p. 318)' : 'E-Waste, Sewage Treatment & 3R Solid Waste Management (pp. 323–326)'}</span>
          </div>
          {envTab === 'forest' ? (
            <p className="text-[var(--text)]">
              <strong>India Wildlife Projects (p. 318):</strong> Project Tiger (1973), Crocodile Conservation (1976), Project Elephant (1992), Sea Turtle Project (1999), Indian Rhino Vision. Prevent soil erosion via <strong>reforestation, terracing, contour ploughing, and shelter belts</strong>.
            </p>
          ) : (
            <p className="text-[var(--text)]">
              <strong>E-Waste Hazards:</strong> Discarded electronics leach Lead, Cadmium, Mercury &amp; Chromium into groundwater. Apply the <strong>3R Principle (Reduce, Reuse, Recycle)</strong>, segregate biodegradable vs non-biodegradable waste, and treat municipal sewage before river discharge.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
