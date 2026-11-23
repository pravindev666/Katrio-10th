import React, { Suspense, lazy, useMemo, useState } from 'react';
import {
  Activity,
  Dna,
  Flame,
  FlaskConical,
  GitBranch,
  HeartPulse,
  Leaf,
  Microscope,
  ShieldCheck,
  Sigma,
  Users,
} from 'lucide-react';

const ChemicalProcess3DCanvas = lazy(() => import('./ChemicalProcess3DCanvas'));

export type SubchapterLabVariant =
  | 'genetics_chromosome'
  | 'genetics_dna_replication'
  | 'genetics_sex_determination'
  | 'atoms_isotopes_avogadro'
  | 'chem_rate_ph'
  | 'organic_iupac_process'
  | 'plant_photosynthesis_respiration'
  | 'nervous_reflex_arc'
  | 'health_clinical_2d'
  | 'maths1_relations_subtopics'
  | 'maths2_euclid_modulo_series'
  | 'maths5_area_slope_lines';

interface SubchapterDifferentiatedLabs2DProps {
  variant: SubchapterLabVariant;
  sectionId: string;
  sectionTitle: string;
  reducedMotion?: boolean;
  onExplore: () => void;
}

/**
 * Pure deterministic helpers (unit-tested in conceptFirstRebuild.test.ts)
 */
export function computeHumanSexDetermination(fatherGamete: 'X' | 'Y') {
  const motherGamete = 'X';
  const childPair = `${motherGamete}${fatherGamete}`;
  const chromosomeFormula = fatherGamete === 'X' ? '44 + XX' : '44 + XY';
  const biologicalSex = fatherGamete === 'X' ? 'Female (Girl)' : 'Male (Boy)';
  return { motherGamete, fatherGamete, childPair, chromosomeFormula, biologicalSex, probabilityPct: 50 };
}

export function computePhClassification(phValue: number) {
  const hConcExp = -phValue;
  const nature = phValue < 7 ? 'Acidic' : phValue === 7 ? 'Neutral' : 'Basic (Alkaline)';
  const indicatorColor =
    phValue <= 3 ? '#ef4444' : phValue <= 5 ? '#f97316' : phValue === 6 ? '#eab308' : phValue === 7 ? '#22c55e' : phValue <= 10 ? '#06b6d4' : '#6366f1';
  return { phValue, hConcExp, nature, indicatorColor };
}

export function computeTriangleAreaAndCollinear(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
) {
  const det = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2);
  const area = Number((0.5 * Math.abs(det)).toFixed(2));
  return { area, isCollinear: area === 0 };
}

/**
 * Eliminates intra-chapter duplication across Science Units 7, 10, 11, 12, 15, 18, 21
 * and Mathematics Chapters 1, 2, 5! Every subtopic renders its own actual scientific/mathematical concept!
 */
export function SubchapterDifferentiatedLabs2D({
  variant,
  sectionId,
  sectionTitle,
  reducedMotion = false,
  onExplore,
}: SubchapterDifferentiatedLabs2DProps) {
  const id = sectionId.toLowerCase();

  // Unit 18.7 Human Sex Determination (44+XX vs 44+XY)
  const [spermType, setSpermType] = useState<'X' | 'Y'>('Y');
  // Unit 18.5 Chromosome Types
  const [chromType, setChromType] = useState<'metacentric' | 'submetacentric' | 'acrocentric' | 'telocentric'>('metacentric');
  // Unit 18.6 DNA Replication & Base Pairing
  const [dnaStrand, setDnaStrand] = useState<('A' | 'T' | 'G' | 'C')[]>(['A', 'T', 'G', 'C', 'G', 'A']);
  const [repStep, setRepStep] = useState(0);

  // Unit 7 Isotopes / Avogadro
  const [vdInput, setVdInput] = useState(22);

  // Unit 10 Rate & pH Scale
  const [phVal, setPhVal] = useState(7);
  const [tempRateC, setTempRateC] = useState(40);
  const [catalystOn, setCatalystOn] = useState(false);

  // Unit 11 IUPAC & Organic 3D Esterification
  const [carbonCount, setCarbonCount] = useState(2);
  const [funcGroup, setFuncGroup] = useState<'alkane' | 'alcohol' | 'acid' | 'aldehyde'>('alcohol');
  const [esterHeatOn, setEsterHeatOn] = useState(true);
  const [esterStage, setEsterStage] = useState(1);

  // Unit 12 Photosynthesis & Respiration
  const [lightIntensity, setLightIntensity] = useState(75);
  const [respMode, setRespMode] = useState<'aerobic' | 'anaerobic'>('aerobic');

  // Unit 15 Reflex Arc
  const [reflexStep, setReflexStep] = useState(0);

  // Unit 21 Health Clinical 2D
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(60);

  // Maths Ch. 1 Relations/Functions
  const [funcType, setFuncType] = useState<'one_one' | 'many_one' | 'bijection'>('bijection');
  const [compX, setCompX] = useState(3);

  // Maths Ch. 2 Euclid & Modular Arithmetic & Special Series
  const [euclidA, setEuclidA] = useState(45);
  const [euclidB, setEuclidB] = useState(12);
  const [seriesN, setSeriesN] = useState(5);

  // Maths Ch. 5 Area & Slope
  const [px3, setPx3] = useState(4);
  const [py3, setPy3] = useState(4);
  const [slopeM1, setSlopeM1] = useState(2);
  const [slopeM2, setSlopeM2] = useState(-0.5);

  const sexRes = useMemo(() => computeHumanSexDetermination(spermType), [spermType]);
  const phRes = useMemo(() => computePhClassification(phVal), [phVal]);
  const triRes = useMemo(() => computeTriangleAreaAndCollinear(0, 0, 2, 2, px3, py3), [px3, py3]);

  // 1. SCIENCE 18.7 / 18.7.1 — HUMAN SEX DETERMINATION (44+XX × 44+XY — ZERO TALL/DWARF PEA PLANTS!)
  if (variant === 'genetics_sex_determination') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 500 230" role="img" aria-label="Human XX and XY Sex Determination diagram" className="w-full h-auto">
            <text x="250" y="22" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
              Human Sex Determination · Fig. 18.8 (TN Science pp. 269–270)
            </text>
            {/* Mother (Homogametic) */}
            <rect x="38" y="42" width="155" height="52" rx="12" fill="#fce7f3" stroke="#be185d" strokeWidth="2" />
            <text x="115" y="64" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#831843">Mother (44 + XX)</text>
            <text x="115" y="81" textAnchor="middle" fontSize="10" fontWeight="600" fill="#9d174d">Homogametic → Only 22 + X Ova</text>

            {/* Father (Heterogametic) */}
            <rect x="307" y="42" width="155" height="52" rx="12" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
            <text x="384" y="64" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0c4a6e">Father (44 + XY)</text>
            <text x="384" y="81" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0369a1">Heterogametic → 22+X or 22+Y</text>

            {/* Gamete Arrows */}
            <line x1="115" y1="94" x2="225" y2="148" stroke="#be185d" strokeWidth="3" />
            <line x1="384" y1="94" x2="275" y2="148" stroke={spermType === 'X' ? '#be185d' : '#0284c7'} strokeWidth="3" />
            <circle cx="165" cy="122" r="16" fill="#fbcfe8" stroke="#be185d" strokeWidth="2" />
            <text x="165" y="126" textAnchor="middle" fontSize="11" fontWeight="900" fill="#831843">X</text>

            <circle cx="335" cy="122" r="16" fill={spermType === 'X' ? '#fbcfe8' : '#bae6fd'} stroke={spermType === 'X' ? '#be185d' : '#0369a1'} strokeWidth="2" />
            <text x="335" y="126" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">{spermType}</text>

            {/* Zygote Result */}
            <rect x="155" y="148" width="190" height="62" rx="14" fill={spermType === 'X' ? '#fdf2f8' : '#f0f9ff'} stroke={spermType === 'X' ? '#db2777' : '#0284c7'} strokeWidth="2.5" />
            <text x="250" y="172" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#0f172a">
              Zygote: {sexRes.chromosomeFormula}
            </text>
            <text x="250" y="194" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={spermType === 'X' ? '#be185d' : '#0369a1'}>
              {sexRes.biologicalSex} (50% Probability)
            </text>
          </svg>
        </div>

        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>18.7 Human Sex Determination (23 Pairs)</span>
          </div>
          <div className="font-bold text-[var(--ink)]">Choose which sperm fertilizes the (22 + X) ovum:</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setSpermType('X'); onExplore(); }} className={`py-2.5 rounded-xl border font-extrabold ${spermType === 'X' ? 'bg-pink-700 text-white border-pink-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              Sperm Carrying X (22 + X)
            </button>
            <button type="button" onClick={() => { setSpermType('Y'); onExplore(); }} className={`py-2.5 rounded-xl border font-extrabold ${spermType === 'Y' ? 'bg-sky-700 text-white border-sky-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              Sperm Carrying Y (22 + Y)
            </button>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>Key Scientific Fact (p. 270):</strong> Humans have 22 pairs of Autosomes + 1 pair of Sex Chromosomes (Allosomes). Because every ovum carries X, the <strong>father’s sperm (X or Y)</strong> solely determines the child’s sex — giving an equal 50% : 50% chance at every conception.
          </div>
        </div>
      </div>
    );
  }

  // 2. SCIENCE 18.5 — CHROMOSOME STRUCTURE & CENTROMERE TYPES
  if (variant === 'genetics_chromosome') {
    const chromSpec = {
      metacentric: { shape: 'V-shaped', ratio: 'Centromere at exact centre — two EQUAL arms.', cy: 105 },
      submetacentric: { shape: 'J / L-shaped', ratio: 'Centromere slightly off-centre — one shorter, one longer arm.', cy: 82 },
      acrocentric: { shape: 'Rod-shaped (tiny short arm)', ratio: 'Centromere near one end — one very short, one very long arm.', cy: 56 },
      telocentric: { shape: 'Rod-shaped (terminal)', ratio: 'Centromere at the proximal tip — only a single arm.', cy: 40 },
    }[chromType];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 380 210" role="img" aria-label={`Chromosome centromere classification: ${chromType}`} className="w-full h-auto">
            <text x="190" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">
              Chromosome Types by Centromere Position (Fig. 18.5, p. 265)
            </text>
            {/* Upper chromatid arms */}
            {chromType !== 'telocentric' && (
              <>
                <line x1="178" y1={chromSpec.cy} x2="170" y2="38" stroke="#6366f1" strokeWidth="14" strokeLinecap="round" />
                <line x1="202" y1={chromSpec.cy} x2="210" y2="38" stroke="#6366f1" strokeWidth="14" strokeLinecap="round" />
              </>
            )}
            {/* Lower chromatid arms */}
            <line x1="178" y1={chromSpec.cy} x2="170" y2="174" stroke="#4f46e5" strokeWidth="14" strokeLinecap="round" />
            <line x1="202" y1={chromSpec.cy} x2="210" y2="174" stroke="#4f46e5" strokeWidth="14" strokeLinecap="round" />
            {/* Centromere */}
            <circle cx="190" cy={chromSpec.cy} r="13" fill="#f59e0b" stroke="#92400e" strokeWidth="2.5" />
            <text x="230" y={chromSpec.cy + 4} fontSize="11" fontWeight="800" fill="#b45309">← Centromere (Primary Constriction)</text>
            <text x="190" y="198" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1e3a8a">
              {chromType.toUpperCase()} · {chromSpec.shape}
            </text>
          </svg>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <Dna className="w-4 h-4" />
            <span>18.5 Structure &amp; Types of Chromosomes (pp. 264–266)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(['metacentric', 'submetacentric', 'acrocentric', 'telocentric'] as const).map((k) => (
              <button key={k} type="button" onClick={() => { setChromType(k); onExplore(); }} className={`py-2 rounded-xl border font-bold capitalize ${chromType === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                {k}
              </button>
            ))}
          </div>
          <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>{chromSpec.shape}:</strong> {chromSpec.ratio} Protective end caps are called <strong>Telomeres</strong>; knob-like satellite chromosomes are SAT-chromosomes.
          </p>
        </div>
      </div>
    );
  }

  // 3. SCIENCE 18.6 — WATSON-CRICK BASE PAIRING & DNA REPLICATION FORK
  if (variant === 'genetics_dna_replication') {
    const pairOf = (b: 'A' | 'T' | 'G' | 'C') => (b === 'A' ? 'T' : b === 'T' ? 'A' : b === 'G' ? 'C' : 'G');
    const bondsOf = (b: 'A' | 'T' | 'G' | 'C') => (b === 'A' || b === 'T' ? '══ (2 H-bonds)' : '≡≡ (3 H-bonds)');
    const repStages = [
      '1. Origin of Replication: Helicase enzyme unwinds the DNA double helix like a zipper (p. 268).',
      '2. Topoisomerase releases supercoil twist ahead of the replication fork; RNA primer attaches.',
      '3. DNA Polymerase adds complementary nucleotides (A↔T, G↔C) continuously on Leading Strand & Okazaki fragments on Lagging Strand.',
      '4. DNA Ligase seals Okazaki fragments → Two identical Semi-Conservative DNA molecules (1 old + 1 new strand each)!',
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <Dna className="w-4 h-4" />
            <span>Watson–Crick Chargaff Base-Pairing Builder (Tap Any Base!)</span>
          </div>
          <div className="space-y-1.5 font-mono-tabular">
            {dnaStrand.map((base, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => {
                    const order: ('A' | 'T' | 'G' | 'C')[] = ['A', 'T', 'G', 'C'];
                    const next = [...dnaStrand];
                    next[idx] = order[(order.indexOf(base) + 1) % 4];
                    setDnaStrand(next);
                    onExplore();
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-extrabold"
                >
                  5′– {base}
                </button>
                <span className="text-[11px] font-bold text-[var(--text-muted)]">{bondsOf(base)}</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-extrabold">
                  {pairOf(base)} –3′
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--primary)]">
            18.6.2 Semi-Conservative DNA Replication Stepper (pp. 267–268)
          </div>
          <div className="space-y-1.5">
            {repStages.map((txt, idx) => (
              <button key={txt} type="button" onClick={() => { setRepStep(idx); onExplore(); }} className={`w-full p-2.5 rounded-xl border text-left leading-relaxed ${repStep === idx ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-bold' : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text)]'}`}>
                {txt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. SCIENCE UNIT 7 — ISOTOPES, PERCENT COMPOSITION & AVOGADRO / VAPOUR DENSITY
  if (variant === 'atoms_isotopes_avogadro') {
    const rmm = vdInput * 2;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
            7.6–7.8 Avogadro’s Law &amp; Vapour Density Calculator (RMM = 2 × VD)
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Gas Vapour Density (VD): {vdInput} → Relative Molecular Mass = {rmm} g/mol
            <input type="range" min={1} max={44} step={1} value={vdInput} onChange={(e) => { setVdInput(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--science)] mt-1" />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] font-mono-tabular space-y-1">
            <div>1 Mole of ANY Gas at STP = <strong>22.4 Litres</strong> (6.023 × 10²³ molecules)</div>
            <div>Example match: VD = 22 → RMM = 44 (CO₂); VD = 16 → RMM = 32 (O₂); VD = 8 → RMM = 16 (CH₄)</div>
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
          <div className="font-extrabold text-[var(--ink)]">7.1.2 Average Atomic Mass &amp; 7.5 Percent Composition</div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>Chlorine Isotopes:</strong> 75% ³⁵Cl + 25% ³⁷Cl → AAM = (35 × 0.75) + (37 × 0.25) = <strong>35.5 amu</strong>.<br />
            <strong>Percent Composition of H₂O (18 g):</strong> Hydrogen = (2/18) × 100 = <strong>11.11%</strong>; Oxygen = (16/18) × 100 = <strong>88.89%</strong>.
          </div>
        </div>
      </div>
    );
  }

  // 5. SCIENCE UNIT 10 — RATE OF REACTION & INTERACTIVE pH SCALE (0–14)
  if (variant === 'chem_rate_ph') {
    const rateRel = Number(((tempRateC / 25) * (catalystOn ? 2.4 : 1)).toFixed(2));
    const isPhTopic = id.includes('ph') || id.includes('water') || id.includes('10-4') || id.includes('10-6') || id.includes('10-7');
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4" />
            <span>{isPhTopic ? 'Interactive pH Scale (pH = −log₁₀[H⁺] · pp. 147–151)' : '10.2 Rate of Reaction & Collision Frequency Lab'}</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Solution pH: {phVal} ({phRes.nature}) · [H⁺] = 10^{phRes.hConcExp} M
            <input type="range" min={0} max={14} step={1} value={phVal} onChange={(e) => { setPhVal(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--science)] mt-1" />
          </label>
          <div className="h-9 rounded-xl flex items-center justify-center font-extrabold text-white shadow-xs" style={{ backgroundColor: phRes.indicatorColor }}>
            Universal Indicator · pH {phVal} ({phRes.nature}) · pH + pOH = 14
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Human Blood ≈ 7.4 · Stomach HCl ≈ 2.0 · Tooth Decay starts below pH 5.5 · Acid Rain &lt; 5.6!
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold text-[var(--ink)]">Factors Speeding Up Chemical Reaction Rate (10.2)</div>
          <label className="block font-bold text-[var(--ink)]">
            Temperature: {tempRateC} °C → Relative Collision Rate: <strong>{rateRel}×</strong>
            <input type="range" min={15} max={90} step={5} value={tempRateC} onChange={(e) => { setTempRateC(Number(e.target.value)); onExplore(); }} className="w-full accent-orange-500 mt-1" />
          </label>
          <button type="button" onClick={() => { setCatalystOn((c) => !c); onExplore(); }} className={`w-full py-2 rounded-xl font-bold border ${catalystOn ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
            {catalystOn ? '✓ Catalyst Added (Lowers Activation Energy!)' : 'Add Catalyst (e.g., MnO₂ on KClO₃)'}
          </button>
          <p className="text-[11px] text-[var(--text-muted)]">
            Higher temperature, higher reactant concentration, powdered surface area, pressure (gases), and catalysts all increase effective collisions per second.
          </p>
        </div>
      </div>
    );
  }

  // 6. SCIENCE UNIT 11 — IUPAC NOMENCLATURE + 3D ESTERIFICATION CHEMICAL PROCESS + SOAP MICELLE
  if (variant === 'organic_iupac_process') {
    const roots = ['', 'Meth', 'Eth', 'Prop', 'But', 'Pent'];
    const root = roots[carbonCount];
    const iupacName =
      funcGroup === 'alkane'
        ? `${root}ane`
        : funcGroup === 'alcohol'
          ? `${root}anol (–OH)`
          : funcGroup === 'acid'
            ? `${root}anoic acid (–COOH)`
            : `${root}anal (–CHO)`;
    const show3DFlow = id.includes('11-6') || id.includes('11-7');

    return (
      <div className="space-y-4 text-xs">
        {show3DFlow ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300">Loading 3D Esterification Lab...</div>}>
                <ChemicalProcess3DCanvas kind="esterification_bath" stageIndex={esterStage} heatOn={esterHeatOn} reducedMotion={reducedMotion} />
              </Suspense>
            </div>
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>3D Ethanol + Ethanoic Acid → Esterification Bath (pp. 166–168)</span>
              </div>
              <div className="flex gap-1.5">
                {['1. Mix Reactants', '2. Conc. H₂SO₄ + Warm Bath', '3. Sweet Fruity Ester!'].map((lbl, i) => (
                  <button key={lbl} type="button" onClick={() => { setEsterStage(i); onExplore(); }} className={`flex-1 py-2 px-1.5 rounded-xl border font-bold text-[11px] ${esterStage === i ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => { setEsterHeatOn((h) => !h); onExplore(); }} className={`w-full py-2 rounded-xl font-bold ${esterHeatOn ? 'bg-orange-600 text-white' : 'bg-slate-700 text-white'}`}>
                {esterHeatOn ? '🔥 Bunsen Water-Bath Heat: ON' : 'Burner Heat: OFF (Click to Heat)'}
              </button>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular text-[11px]">
                CH₃COOH + C₂H₅OH —(Conc. H₂SO₄, Heat)→ CH₃COOC₂H₅ (Ethyl Ethanoate) + H₂O
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
              <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
                11.5 Interactive IUPAC Organic Name Builder (Root + Primary + Secondary Suffix)
              </div>
              <label className="block font-bold text-[var(--ink)]">
                Carbon Chain Length (C₁ to C₅): {carbonCount} Carbons → Root: <strong>{root}-</strong>
                <input type="range" min={1} max={5} step={1} value={carbonCount} onChange={(e) => { setCarbonCount(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--science)] mt-1" />
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {([['alkane', 'Alkane (-ane)'], ['alcohol', 'Alcohol (-ol)'], ['acid', 'Carboxylic (-oic acid)'], ['aldehyde', 'Aldehyde (-al)']] as const).map(([k, l]) => (
                  <button key={k} type="button" onClick={() => { setFuncGroup(k); onExplore(); }} className={`py-2 rounded-xl border font-bold ${funcGroup === k ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}>{l}</button>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-400 font-extrabold text-sm text-center text-emerald-900 dark:text-emerald-200">
                IUPAC Name: {iupacName}
              </div>
            </div>
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
              <div className="font-extrabold text-[var(--ink)]">11.9 Soaps vs Detergents &amp; Micelle Cleansing Action (p. 169)</div>
              <p className="text-[var(--text)] leading-relaxed">
                Soap molecules have a <strong>hydrophobic hydrocarbon tail</strong> (attaches to oil/grease) and a <strong>hydrophilic ionic head</strong> (faces water), forming spherical <strong>Micelles</strong> that lift dirt away! Detergents work even in <em>hard water</em> (Ca²⁺/Mg²⁺) without forming insoluble scum.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 7. SCIENCE UNIT 12 — PHOTOSYNTHESIS & CELLULAR RESPIRATION (MITOCHONDRIA ATP / R.Q.)
  if (variant === 'plant_photosynthesis_respiration') {
    const o2Rate = Math.min(100, Math.round(lightIntensity * 1.15));
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5">
            <Leaf className="w-4 h-4" />
            <span>12.9 Photosynthesis (Grana Light + Stroma Calvin Cycle · p. 180)</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Sunlight Intensity: {lightIntensity}% → Relative O₂ Evolution: <strong>{o2Rate}%</strong>
            <input type="range" min={10} max={100} step={5} value={lightIntensity} onChange={(e) => { setLightIntensity(Number(e.target.value)); onExplore(); }} className="w-full accent-emerald-600 mt-1" />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] font-mono-tabular text-[11px]">
            6CO₂ + 12H₂O —(Light / Chlorophyll)→ C₆H₁₂O₆ + 6H₂O + 6O₂↑
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <Microscope className="w-4 h-4" />
            <span>12.10–12.11 Mitochondria &amp; Respiration (ATP &amp; R.Q.)</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setRespMode('aerobic'); onExplore(); }} className={`flex-1 py-2 rounded-xl border font-bold ${respMode === 'aerobic' ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>Aerobic (With O₂)</button>
            <button type="button" onClick={() => { setRespMode('anaerobic'); onExplore(); }} className={`flex-1 py-2 rounded-xl border font-bold ${respMode === 'anaerobic' ? 'bg-amber-600 text-white border-amber-600' : 'bg-[var(--surface)] border-[var(--line)]'}`}>Anaerobic (No O₂)</button>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            {respMode === 'aerobic'
              ? 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36 ATP (Glycolysis in Cytoplasm → Krebs Cycle & Electron Transport in Mitochondria). Respiratory Quotient (R.Q. = CO₂/O₂) for Glucose = 1.0!'
              : 'C₆H₁₂O₆ → 2C₂H₅OH (Ethanol) + 2CO₂ + 2 ATP (Yeast fermentation) or Lactic Acid in fatigued muscles.'}
          </div>
        </div>
      </div>
    );
  }

  // 8. SCIENCE UNIT 15.5 / 15.7 — INTERACTIVE 2D REFLEX ARC CIRCUIT
  if (variant === 'nervous_reflex_arc') {
    const arcNodes = [
      { title: '1. Receptor (Skin Heat Sensor)', desc: 'Pain/heat receptors in fingertips detect a hot vessel instantaneously.' },
      { title: '2. Sensory (Afferent) Neuron', desc: 'Carries electrical impulse rapidly from skin receptor to the dorsal root of the Spinal Cord.' },
      { title: '3. Association Neuron (Spinal Cord)', desc: 'Processes signal directly inside spinal grey matter — bypassing slow conscious brain delay!' },
      { title: '4. Motor (Efferent) Neuron', desc: 'Transmits rapid withdrawal command via ventral root to arm muscles.' },
      { title: '5. Effector (Biceps Muscle)', desc: 'Hand pulls back in milliseconds before tissue burns! (Fig. 15.9, p. 225).' },
    ];
    return (
      <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
          <Activity className="w-4 h-4" />
          <span>15.5 Interactive Reflex Arc Pathway &amp; Autonomic Balance (pp. 224–226)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {arcNodes.map((n, i) => (
            <button key={n.title} type="button" onClick={() => { setReflexStep(i); onExplore(); }} className={`p-3 rounded-xl border text-left ${reflexStep === i ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
              <div className="font-extrabold">{n.title}</div>
            </button>
          ))}
        </div>
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink)]">
          <strong>{arcNodes[reflexStep].title}:</strong> {arcNodes[reflexStep].desc}
        </div>
      </div>
    );
  }

  // 9. SCIENCE UNIT 21 — CLINICAL HEALTH, DIABETES, BMI & PROTECTION (CALM 2D — NO SPIKE BALL!)
  if (variant === 'health_clinical_2d') {
    const bmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
    const bmiCat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy Range ✓' : bmi < 30 ? 'Overweight' : 'Obese Risk';
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" />
            <span>Unit 21 · Lifestyle Health &amp; BMI Explorer (pp. 301–312)</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Height: {heightCm} cm · Weight: {weightKg} kg → BMI = <strong>{bmi} kg/m² ({bmiCat})</strong>
            <input type="range" min={130} max={195} value={heightCm} onChange={(e) => { setHeightCm(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--science)] mt-1" />
            <input type="range" min={35} max={110} value={weightKg} onChange={(e) => { setWeightKg(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--primary)] mt-1" />
          </label>
          <p className="text-[var(--text)] leading-relaxed">
            <strong>Type 1 Diabetes (IDDM):</strong> Beta-cell destruction (requires insulin). <strong>Type 2 Diabetes (NIDDM):</strong> Insulin resistance linked to obesity &amp; sedentary lifestyle — managed by diet &amp; exercise!
          </p>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Protection, Cancer Awareness &amp; HIV Facts ({sectionTitle})</span>
          </div>
          <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>Child Protection (21.1):</strong> National Childline <strong>1098</strong> provides free 24×7 emergency support. <strong>Tobacco/Alcohol:</strong> Nicotine &amp; tar cause hypoxia/emphysema; alcohol causes liver cirrhosis. <strong>HIV/AIDS (21.12):</strong> Transmitted via blood/unsterile needles/mother-to-child — NEVER by handshakes, sharing food, or mosquitoes (ELISA screening + Western Blot confirmation).
          </p>
        </div>
      </div>
    );
  }

  // 10. MATHS CH. 1 — RELATIONS, FUNCTIONS, BIJECTION & COMPOSITION f(g(x))
  if (variant === 'maths1_relations_subtopics') {
    const gx = 2 * compX + 1;
    const fgx = gx * gx;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            <span>Ch. 1 Function Types &amp; Line Tests (1.6–1.7)</span>
          </div>
          <div className="flex gap-1.5">
            {([['one_one', 'One-One (Injective)'], ['many_one', 'Many-One'], ['bijection', 'Bijection (1-1 & Onto)']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setFuncType(k); onExplore(); }} className={`flex-1 py-2 px-2 rounded-xl border font-bold ${funcType === k ? 'bg-[var(--math)] text-white border-[var(--math)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}>{l}</button>
            ))}
          </div>
          <p className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)]">
            {funcType === 'bijection'
              ? 'Bijection: Every domain element maps to a UNIQUE codomain element AND every codomain element has a pre-image (passes BOTH Vertical & Horizontal Line Tests!).'
              : funcType === 'one_one'
                ? 'One-One: Distinct inputs always yield distinct outputs (passes Horizontal Line Test).'
                : 'Many-One: Two or more distinct inputs share the same output (e.g., f(x) = x² maps −2 and +2 to 4).'}
          </p>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold text-[var(--ink)]">1.9 Composition of Functions Machine: (f ∘ g)(x) = f(g(x))</div>
          <label className="block font-bold text-[var(--ink)]">
            Input x = {compX} · g(x) = 2x + 1 → {gx} · f(u) = u² → <strong>f(g({compX})) = {fgx}</strong>
            <input type="range" min={-4} max={6} step={1} value={compX} onChange={(e) => { setCompX(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
          </label>
          <p className="text-[11px] text-[var(--text-muted)]">
            Note: In general, (f ∘ g)(x) ≠ (g ∘ f)(x), while composition of three functions IS associative: f ∘ (g ∘ h) = (f ∘ g) ∘ h!
          </p>
        </div>
      </div>
    );
  }

  // 11. MATHS CH. 2 — EUCLID'S DIVISION LEMMA, MODULAR ARITHMETIC & SPECIAL SERIES
  if (variant === 'maths2_euclid_modulo_series') {
    const q = Math.floor(euclidA / euclidB);
    const r = euclidA % euclidB;
    const sumN = (seriesN * (seriesN + 1)) / 2;
    const sumSq = (seriesN * (seriesN + 1) * (2 * seriesN + 1)) / 6;
    const sumCube = sumN * sumN;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--math)] inline-flex items-center gap-1.5">
            <Sigma className="w-4 h-4" />
            <span>2.2–2.5 Euclid’s Division Lemma (a = bq + r) &amp; Congruence Modulo</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Dividend a = {euclidA} · Divisor b = {euclidB}
            <input type="range" min={12} max={96} step={1} value={euclidA} onChange={(e) => { setEuclidA(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
            <input type="range" min={3} max={12} step={1} value={euclidB} onChange={(e) => { setEuclidB(Number(e.target.value)); onExplore(); }} className="w-full accent-indigo-500 mt-1" />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] font-mono-tabular font-bold">
            {euclidA} = {euclidB} × {q} + {r} &nbsp;⇒&nbsp; {euclidA} ≡ {r} (mod {euclidB})
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold text-[var(--ink)]">2.11 Special Series Calculator (First n = {seriesN} Natural Numbers)</div>
          <input type="range" min={1} max={12} step={1} value={seriesN} onChange={(e) => { setSeriesN(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)]" />
          <div className="grid grid-cols-3 gap-2 font-mono-tabular text-center">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]"><div className="text-[10px]">Σk = n(n+1)/2</div><div className="font-extrabold text-sm">{sumN}</div></div>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]"><div className="text-[10px]">Σk²</div><div className="font-extrabold text-sm">{sumSq}</div></div>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]"><div className="text-[10px]">Σk³ = (Σk)²</div><div className="font-extrabold text-sm">{sumCube}</div></div>
          </div>
        </div>
      </div>
    );
  }

  // 12. MATHS CH. 5 — AREA OF TRIANGLE / COLLINEARITY & PARALLEL/PERPENDICULAR SLOPES
  const isParallel = Math.abs(slopeM1 - slopeM2) < 0.01;
  const isPerp = Math.abs(slopeM1 * slopeM2 + 1) < 0.01;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="font-extrabold uppercase tracking-wider text-[var(--math)]">
          5.2–5.3 Area of Triangle &amp; Collinearity Test (A(0,0), B(2,2), C({px3},{py3}))
        </div>
        <label className="block font-bold text-[var(--ink)]">
          Move Point C: x₃ = {px3}, y₃ = {py3}
          <input type="range" min={0} max={6} step={1} value={px3} onChange={(e) => { setPx3(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
          <input type="range" min={0} max={6} step={1} value={py3} onChange={(e) => { setPy3(Number(e.target.value)); onExplore(); }} className="w-full accent-indigo-500 mt-1" />
        </label>
        <div className={`p-3 rounded-xl border font-extrabold ${triRes.isCollinear ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-emerald-50 border-emerald-400 text-emerald-900'}`}>
          Area = {triRes.area} sq. units {triRes.isCollinear ? '→ Points are COLLINEAR (lie on one straight line!)' : '→ Forms a non-degenerate triangle!'}
        </div>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
        <div className="font-extrabold text-[var(--ink)]">5.4 Slopes of Parallel (m₁ = m₂) &amp; Perpendicular Lines (m₁·m₂ = −1)</div>
        <label className="block font-bold">
          Slope m₁ = {slopeM1} · Slope m₂ = {slopeM2} · Product m₁·m₂ = {Number((slopeM1 * slopeM2).toFixed(2))}
          <input type="range" min={-2} max={4} step={0.5} value={slopeM1} onChange={(e) => { setSlopeM1(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--math)] mt-1" />
          <input type="range" min={-2} max={4} step={0.5} value={slopeM2} onChange={(e) => { setSlopeM2(Number(e.target.value)); onExplore(); }} className="w-full accent-sky-600 mt-1" />
        </label>
        <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-bold text-[var(--ink)]">
          {isParallel ? '✓ PARALLEL LINES (m₁ = m₂)' : isPerp ? '✓ PERPENDICULAR LINES (m₁ × m₂ = −1, 90°!)' : 'Intersecting obliquely (try m₁ = 2, m₂ = −0.5 for 90°!)'}
        </div>
      </div>
    </div>
  );
}
