import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Droplets,
  Info,
  Landmark,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Breadcrumbs } from '../chrome/Breadcrumbs';
import {
  TN_TOWN_REGIONS,
  evaluateTownBudget,
  evaluateTownEnergyPlan,
  evaluateTownWaterTank,
  type TnTownRegion,
} from '../../utils/sustainableTownSim';
import { useProgress } from '../../features/local-progress/ProgressContext';

const CAPSTONE_ID = 'sustainable-tn-town';

const TRANSFER_QUESTIONS = [
  {
    id: 'q1-tank',
    subject: 'Mathematics Ch. 7 (Mensuration)',
    prompt:
      'A town doubles the radius r of a cylindrical rainwater tank while keeping height h constant. How do its storage Volume (πr²h) and Curved Surface Area (2πrh) change?',
    options: [
      { id: 'a', label: 'Volume becomes 4× larger; Curved Surface Area becomes 2× larger', correct: true, why: 'Volume depends on r² (2² = 4×) while CSA is linear in r (2×) — wider tanks hold much more water per unit of wall steel!' },
      { id: 'b', label: 'Both Volume and Curved Surface Area become 2× larger', correct: false, why: 'Look closely at the exponent: V = πr²h squares r, whereas CSA = 2πrh uses r¹.' },
      { id: 'c', label: 'Volume becomes 8× larger; Curved Surface Area becomes 4× larger', correct: false, why: 'That happens only when BOTH radius r and height h double together.' },
    ],
  },
  {
    id: 'q2-energy',
    subject: 'Science Unit 4 & 22 (Power & Clean Energy)',
    prompt:
      'Replacing 200 incandescent streetlamps (100 W each) with LED lamps (30 W each) running 10 hours every night saves how much energy in 1 night (in kWh)?',
    options: [
      { id: 'a', label: '140 kWh saved per night', correct: true, why: 'Power saved per lamp = 70 W → 200 × 70 W = 14,000 W = 14 kW. Over 10 hours: 14 kW × 10 h = 140 kWh (= 504 × 10⁶ J)!' },
      { id: 'b', label: '14 kWh saved per night', correct: false, why: '14 kW is the power saved, not energy — remember to multiply by 10 hours (E = P × t).' },
      { id: 'c', label: '700 kWh saved per night', correct: false, why: 'Check the watts-to-kilowatts division by 1,000: (200 × 70 × 10) / 1000 = 140 kWh.' },
    ],
  },
  {
    id: 'q3-geo-econ',
    subject: 'Geography Unit 6 & Economics Unit 4',
    prompt:
      'Why does an interior Western-Ghats pass town (like Coimbatore/Muppandal) prioritize wind turbines + larger recharge tanks compared with coastal Chennai?',
    options: [
      { id: 'a', label: 'Western Ghats create a leeward rain-shadow (lower rainfall) while mountain passes accelerate wind speeds', correct: true, why: 'Exact geographical synthesis! Orographic rain-shadow cuts rainfall while Palghat/Aralvaimozhi passes funnel strong wind corridors (Geo Unit 6, pp. 202–208).' },
      { id: 'b', label: 'Tamil Nadu receives zero Northeast Monsoon rain', correct: false, why: 'Tamil Nadu actually receives its major rainfall from the Northeast Monsoon (Oct–Dec), especially along the coast.' },
      { id: 'c', label: 'Direct taxes are banned in coastal towns', correct: false, why: 'Tax classification (Direct vs Indirect, Econ Unit 4) does not depend on coastal geography.' },
    ],
  },
];

const CAPSTONE_FLASHCARDS = [
  { id: 'fc1', front: 'Why does a wider cylindrical tank store more water per m² of steel wall?', back: 'Volume scales with r² (πr²h) while curved wall area scales linearly with r (2πrh).' },
  { id: 'fc2', front: 'How many Joules equal 1 commercial unit (1 kWh) of electrical energy?', back: '1 kWh = 1,000 W × 3,600 s = 3.6 × 10⁶ J (TN Science Unit 4, p. 51).' },
  { id: 'fc3', front: 'Which monsoon brings the largest share of rainfall to coastal Tamil Nadu?', back: 'The Northeast Monsoon (October–December), bringing cyclonic rain from the Bay of Bengal (Geo Unit 6, p. 208).' },
  { id: 'fc4', front: 'How do you estimate rooftop rainwater harvest in litres from area (m²) and rainfall (mm)?', back: '1 mm of rain over 1 m² equals 1 litre: Harvest ≈ Area (m²) × Rainfall (mm) × runoff efficiency (~0.85).' },
  { id: 'fc5', front: 'What distinguishes a Direct Tax from an Indirect Tax in funding public services?', back: 'A direct tax (e.g., income tax) is paid directly by the earner and cannot be shifted, whereas an indirect tax (e.g., GST) can be shifted onto consumers (Econ Unit 4, p. 323).' },
];

export function SustainableTnTownMission() {
  const { record, saveCapstoneProgress, saveTeachBackNote } = useProgress();
  const saved = record.capstoneProgress?.[CAPSTONE_ID];

  const [stage, setStage] = useState<number>(saved?.stage ?? 0);
  const [region, setRegion] = useState<TnTownRegion>('coastal_chennai');
  // Stage 1: Water Tank + Rainwater
  const [radiusM, setRadiusM] = useState(7);
  const [heightM, setHeightM] = useState(7);
  const [roofM2, setRoofM2] = useState(1200);
  // Stage 2: Energy
  const [ledPct, setLedPct] = useState(80);
  const [solarKw, setSolarKw] = useState(250);
  const [windCount, setWindCount] = useState(2);
  // Stage 3: Simplified Budget (100 units)
  const [waterBudget, setWaterBudget] = useState(35);
  const [energyBudget, setEnergyBudget] = useState(35);
  const [schoolBudget, setSchoolBudget] = useState(30);
  const [directTaxPct, setDirectTaxPct] = useState(60);
  // Stage 4: Transfer + Citizen Brief + Flashcards
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [briefLang, setBriefLang] = useState<'en' | 'ta'>('en');
  const [citizenBrief, setCitizenBrief] = useState(
    record.teachBackNotes?.[CAPSTONE_ID] ?? '',
  );
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const waterRes = useMemo(
    () => evaluateTownWaterTank(radiusM, heightM, roofM2, region),
    [radiusM, heightM, roofM2, region],
  );
  const energyRes = useMemo(
    () => evaluateTownEnergyPlan(ledPct, solarKw, windCount, region),
    [ledPct, solarKw, windCount, region],
  );
  const budgetRes = useMemo(
    () => evaluateTownBudget(waterBudget, energyBudget, schoolBudget, directTaxPct),
    [waterBudget, energyBudget, schoolBudget, directTaxPct],
  );

  const transferCorrectCount = TRANSFER_QUESTIONS.filter((q) => {
    const picked = answers[q.id];
    return q.options.some((o) => o.id === picked && o.correct);
  }).length;
  const allTransferPassed = transferCorrectCount === TRANSFER_QUESTIONS.length;

  const persistStage = (nextStage: number, completed = false) => {
    setStage(nextStage);
    saveCapstoneProgress(CAPSTONE_ID, {
      stage: nextStage,
      completed: completed || Boolean(saved?.completed),
      summary: `${TN_TOWN_REGIONS[region].name} · Tank ${waterRes.volumeM3} m³ · Clean ${energyRes.renewableSharePct}% · Transfer ${transferCorrectCount}/3`,
    });
  };

  const resetMission = () => {
    setStage(0);
    setRadiusM(7);
    setHeightM(7);
    setRoofM2(1200);
    setLedPct(80);
    setSolarKw(250);
    setWindCount(2);
    setWaterBudget(35);
    setEnergyBudget(35);
    setSchoolBudget(30);
    setDirectTaxPct(60);
    setAnswers({});
  };

  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-6 pb-14 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Challenge Arcade', to: '/arcade' },
          { label: 'Design a Sustainable Tamil Nadu Town' },
        ]}
      />

      {/* Mission Hero */}
      <section
        style={{ backgroundColor: 'var(--arcade-tint)' }}
        className="rounded-[24px] border border-[var(--line)] p-6 sm:p-8 space-y-4 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-extrabold text-[var(--arcade)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cross-Subject Capstone · Untimed · Saved Locally</span>
          </div>
          <div className="flex items-center gap-2">
            {saved?.completed && (
              <span className="px-3 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/35 text-xs font-extrabold inline-flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Capstone Stamp Earned</span>
              </span>
            )}
            <button
              type="button"
              onClick={resetMission}
              className="px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
          Design a Sustainable Tamil Nadu Town
        </h1>
        <p className="text-sm sm:text-base text-[var(--text)] max-w-3xl leading-relaxed">
          Combine <strong>Maths Ch. 7 Mensuration</strong>, <strong>Science Units 4 &amp; 22</strong>,{' '}
          <strong>Geography Unit 6</strong>, <strong>Economics Unit 4</strong>, and{' '}
          <strong>English / தமிழ் communication</strong> to engineer water storage, clean electricity,
          and a fair municipal budget.
        </p>

        {/* Verified Textbook Links Strip */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {[
            ['Maths 7.2–7.3 Tanks', '/class-10/mathematics/maths-07/maths-07-02'],
            ['Science 4.9 Power', '/class-10/science/science-04/science-04-auto-4-9-electric-power'],
            ['Science 22.7 Rainwater', '/class-10/science/science-22/science-22-auto-22-7-rainwater-harvesting'],
            ['Geo 6.1 TN Geography', '/class-10/social_science/social-geography-06/social-geography-06-auto-6-1-location-and-size'],
            ['Econ 4.3 Taxes', '/class-10/social_science/social-economics-04/social-economics-04-auto-4-3-types-of-taxes'],
          ].map(([lbl, to]) => (
            <Link
              key={to}
              to={to}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--primary)] font-bold hover:underline inline-flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              <span>{lbl}</span>
            </Link>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface)]/90 border border-[var(--line)] text-xs text-[var(--text-muted)] flex items-start gap-2">
          <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
          <span>
            <strong>Syllabus vs. Explore Further Notice:</strong> All equations (π = 22/7, 1 kWh = 3.6×10⁶ J,
            monsoon relief, direct vs. indirect taxes) match your verified TN Class 10 textbooks. Mean
            regional rainfall &amp; 100-unit municipal budgets are clearly simplified <em>Explore Further</em> models — not official statutory tax rates.
          </span>
        </div>
      </section>

      {/* Non-Linear 4-Stage Navigation */}
      <nav
        aria-label="Capstone mission stages"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2.5"
      >
        {[
          { idx: 0, label: '1. Water Tank & Monsoon', ok: waterRes.meetsVolumeGoal && waterRes.meetsAreaBudget, icon: Droplets },
          { idx: 1, label: '2. Clean Power & LEDs', ok: energyRes.meetsCleanTarget, icon: Zap },
          { idx: 2, label: '3. Fair Public Budget', ok: budgetRes.isBalanced, icon: Landmark },
          { idx: 3, label: '4. Explain & Transfer', ok: allTransferPassed, icon: Award },
        ].map((st) => {
          const Icon = st.icon;
          const active = stage === st.idx;
          return (
            <button
              key={st.idx}
              type="button"
              onClick={() => persistStage(st.idx)}
              aria-pressed={active}
              className={`p-3.5 rounded-2xl border text-left transition-colors flex items-center justify-between gap-2 ${
                active
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
              }`}
            >
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{st.label}</span>
              </span>
              {st.ok && <CheckCircle2 className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[var(--success)]'}`} />}
            </button>
          );
        })}
      </nav>

      {/* STAGE 1: WATER TANK (MATHS 7.2/7.3 + GEO 6 + SCIENCE 22.7) */}
      {stage === 0 && (
        <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--math)]">
                Stage 1 · Maths Ch. 7 + Geography Unit 6 + Science 22.7
              </div>
              <h2 className="text-xl font-extrabold text-[var(--ink)]">
                Size Your Cylindrical Water Tank &amp; Rainwater Catchment
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--info-bg)] text-[var(--primary)] text-xs font-bold">
              Goal: Volume ≥ 1,000 m³ &amp; Outer TSA ≤ 620 m²
            </span>
          </div>

          {/* Choose Tamil Nadu Region */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {Object.values(TN_TOWN_REGIONS).map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setRegion(reg.id)}
                aria-pressed={region === reg.id}
                className={`p-3.5 rounded-2xl border text-left space-y-1 transition-colors ${
                  region === reg.id
                    ? 'bg-[var(--social-tint)] border-[var(--social)] text-[var(--ink)]'
                    : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--text)]'
                }`}
              >
                <div className="text-xs font-extrabold text-[var(--ink)]">{reg.name}</div>
                <div className="text-[11px] leading-snug">{reg.climateNote}</div>
                <div className="text-[11px] font-mono-tabular font-bold text-[var(--social)]">
                  Explore Further est.: ~{reg.annualRainfallMm} mm/yr
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)]">
              <svg viewBox="0 0 420 220" className="w-full h-auto rounded-xl bg-[var(--surface)] border border-[var(--line)]" role="img" aria-label="Town rainwater storage cylindrical tank schematic">
                <rect x="20" y="16" width="380" height="32" rx="8" fill="#E8F6F4" />
                <text x="210" y="36" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0B7773">
                  Rooftop Catchment: {roofM2} m² → {(waterRes.annualRainHarvestLiters / 1000).toFixed(0)} kL/yr
                </text>
                {/* Cylindrical Tank scaled by r and h */}
                <ellipse cx="160" cy={165 - heightM * 6} rx={Math.min(72, radiusM * 7.5)} ry="14" fill="#DBEAFE" stroke="#4255D4" strokeWidth="2.5" />
                <rect
                  x={160 - Math.min(72, radiusM * 7.5)}
                  y={165 - heightM * 6}
                  width={Math.min(72, radiusM * 7.5) * 2}
                  height={heightM * 6}
                  fill="#BFDBFE"
                  fillOpacity="0.65"
                  stroke="#4255D4"
                  strokeWidth="2.5"
                />
                <ellipse cx="160" cy="165" rx={Math.min(72, radiusM * 7.5)} ry="14" fill="#93C5FD" stroke="#4255D4" strokeWidth="2.5" />
                <text x="315" y="96" textAnchor="middle" fontSize="12" fontWeight="800" fill="#13213A">r = {radiusM} m · h = {heightM} m</text>
                <text x="315" y="118" textAnchor="middle" fontSize="12" fontWeight="800" fill={waterRes.meetsVolumeGoal ? '#137B55' : '#A86113'}>
                  V = {waterRes.volumeM3} m³
                </text>
                <text x="315" y="138" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={waterRes.meetsAreaBudget ? '#137B55' : '#B43C4C'}>
                  TSA = {waterRes.tsaM2} m²
                </text>
                <text x="315" y="160" textAnchor="middle" fontSize="10.5" fill="#4E5F76">
                  π = 22/7 (TN Ch. 7)
                </text>
              </svg>
            </div>

            <div className="lg:col-span-6 space-y-3.5 text-xs">
              <label className="block font-bold text-[var(--ink)]">
                Tank Radius (r): <span className="font-mono-tabular text-[var(--math)]">{radiusM} m</span>
                <input type="range" min={3} max={10} step={0.5} value={radiusM} onChange={(e) => setRadiusM(Number(e.target.value))} className="w-full accent-[var(--math)] mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Tank Height (h): <span className="font-mono-tabular text-[var(--math)]">{heightM} m</span>
                <input type="range" min={3} max={14} step={0.5} value={heightM} onChange={(e) => setHeightM(Number(e.target.value))} className="w-full accent-[var(--math)] mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Public Rooftop Catchment Area: <span className="font-mono-tabular text-[var(--science)]">{roofM2} m²</span>
                <input type="range" min={500} max={2500} step={100} value={roofM2} onChange={(e) => setRoofM2(Number(e.target.value))} className="w-full accent-[var(--science)] mt-1" />
              </label>

              <div className={`p-3.5 rounded-xl border font-bold ${waterRes.meetsVolumeGoal && waterRes.meetsAreaBudget ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]' : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'}`}>
                {waterRes.meetsVolumeGoal && waterRes.meetsAreaBudget
                  ? `✓ Optimal Tank! Volume ${waterRes.volumeM3} m³ (≥ 1,000) fits inside TSA ${waterRes.tsaM2} m² (≤ 620) — holding ${(waterRes.capacityLiters / 1000).toLocaleString()} kL!`
                  : `Keep tuning: ${!waterRes.meetsVolumeGoal ? 'Increase r or h to reach V ≥ 1,000 m³. ' : ''}${!waterRes.meetsAreaBudget ? 'Reduce TSA ≤ 620 m² by balancing r and h closer together!' : ''}`}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => persistStage(1)}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-white font-bold inline-flex items-center gap-1.5"
                >
                  <span>Next: Stage 2 Clean Energy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 2: CLEAN ELECTRICITY & LEDs (SCIENCE 4.9, 4.11, 22.6, 22.8) */}
      {stage === 1 && (
        <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--science)]">
                Stage 2 · Science Unit 4 (4.9 Power, 4.11 LED) + Unit 22 (22.6 Wind/Solar)
              </div>
              <h2 className="text-xl font-extrabold text-[var(--ink)]">
                Cut Town Power Waste &amp; Reach 75%+ Clean Electricity
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--science-tint)] text-[var(--science)] text-xs font-bold">
              Goal: LEDs ≥ 60% &amp; Clean Share ≥ 75%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
            <div className="lg:col-span-6 space-y-3.5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)]">
              <label className="block font-bold text-[var(--ink)]">
                LED Street &amp; School Lighting Upgrade: <span className="text-[var(--science)]">{ledPct}%</span> (saves {energyRes.ledSavedKwh} kWh/day)
                <input type="range" min={0} max={100} step={10} value={ledPct} onChange={(e) => setLedPct(Number(e.target.value))} className="w-full accent-[var(--science)] mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Community Solar Rooftop Capacity: <span className="text-amber-600">{solarKw} kW</span>
                <input type="range" min={50} max={500} step={25} value={solarKw} onChange={(e) => setSolarKw(Number(e.target.value))} className="w-full accent-amber-500 mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Wind Turbines (Region factor {TN_TOWN_REGIONS[region].windPotentialFactor}×): <span className="text-[var(--primary)]">{windCount} turbines</span>
                <input type="range" min={0} max={6} step={1} value={windCount} onChange={(e) => setWindCount(Number(e.target.value))} className="w-full accent-[var(--primary)] mt-1" />
              </label>
            </div>

            <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
              <div className="grid grid-cols-2 gap-3 font-mono-tabular">
                <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                  <div className="text-[11px] text-[var(--text-muted)]">Daily Demand</div>
                  <div className="text-lg font-extrabold text-[var(--ink)]">{energyRes.dailyDemandKwh} kWh</div>
                  <div className="text-[10px] text-[var(--text-muted)]">= {energyRes.dailyEnergyJoulesMillion} × 10⁶ J</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                  <div className="text-[11px] text-[var(--text-muted)]">Clean Supply Share</div>
                  <div className={`text-lg font-extrabold ${energyRes.meetsCleanTarget ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                    {energyRes.renewableSharePct}%
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">{energyRes.cleanSupplyKwh} kWh/day clean</div>
                </div>
              </div>

              <div className="h-5 rounded-full bg-[var(--surface-subtle)] overflow-hidden border border-[var(--line)]">
                <div
                  style={{ width: `${energyRes.renewableSharePct}%` }}
                  className="h-full bg-[var(--science)] transition-all"
                />
              </div>

              <div className={`p-3 rounded-xl border font-bold ${energyRes.meetsCleanTarget ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]' : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'}`}>
                {energyRes.meetsCleanTarget
                  ? '✓ Clean Grid Achieved! LED efficiency cuts demand first, making 75%+ solar & wind supply affordable.'
                  : 'Raise LED upgrades (≥ 60%) and solar/wind capacity until clean electricity covers at least 75% of daily kWh.'}
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => persistStage(0)} className="px-4 py-2 rounded-xl border border-[var(--line)] font-bold inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Water
                </button>
                <button type="button" onClick={() => persistStage(2)} className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-white font-bold inline-flex items-center gap-1.5">
                  <span>Next: Stage 3 Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 3: MUNICIPAL BUDGET & TAX EQUITY (ECONOMICS UNIT 4) */}
      {stage === 2 && (
        <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--social)]">
                Stage 3 · Economics Unit 4 (4.1 Development Policies &amp; 4.3 Direct vs Indirect Taxes)
              </div>
              <h2 className="text-xl font-extrabold text-[var(--ink)]">
                Balance a 100-Unit Public Service Budget &amp; Tax Mix
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--social-tint)] text-[var(--social)] text-xs font-bold">
              Goal: Allocate Exactly 100 Units (≥ 25 each)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)]">
              <label className="block font-bold text-[var(--ink)]">
                Water &amp; Rainwater Sanitation: {waterBudget} units
                <input type="range" min={10} max={60} step={5} value={waterBudget} onChange={(e) => setWaterBudget(Number(e.target.value))} className="w-full accent-sky-600 mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Clean Energy &amp; LED Streetlights: {energyBudget} units
                <input type="range" min={10} max={60} step={5} value={energyBudget} onChange={(e) => setEnergyBudget(Number(e.target.value))} className="w-full accent-[var(--science)] mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)]">
                Public Schools &amp; Primary Health: {schoolBudget} units
                <input type="range" min={10} max={60} step={5} value={schoolBudget} onChange={(e) => setSchoolBudget(Number(e.target.value))} className="w-full accent-[var(--primary)] mt-1" />
              </label>
              <label className="block font-bold text-[var(--ink)] pt-2 border-t border-[var(--line)]">
                Direct Progressive Tax Share: {directTaxPct}% (Indirect GST/Fees: {100 - directTaxPct}%)
                <input type="range" min={20} max={80} step={5} value={directTaxPct} onChange={(e) => setDirectTaxPct(Number(e.target.value))} className="w-full accent-[var(--social)] mt-1" />
              </label>
            </div>

            <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
              <div className="flex items-center justify-between font-extrabold text-sm">
                <span>Total Allocated: {budgetRes.totalAllocated} / 100 units</span>
                <span className={budgetRes.remainingUnits === 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
                  {budgetRes.remainingUnits === 0
                    ? 'Balanced ✓'
                    : budgetRes.remainingUnits > 0
                      ? `${budgetRes.remainingUnits} unspent`
                      : `${Math.abs(budgetRes.remainingUnits)} deficit!`}
                </span>
              </div>
              <p className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
                <strong>Tax Equity Insight:</strong> {budgetRes.equityNote}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Simplified 100-unit classroom model illustrating progressive vs. indirect tax concepts (TN Economics pp. 321–325). Does not represent official statutory Tamil Nadu tax slabs.
              </p>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => persistStage(1)} className="px-4 py-2 rounded-xl border border-[var(--line)] font-bold inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Energy
                </button>
                <button type="button" onClick={() => persistStage(3)} className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--primary)] text-white font-bold inline-flex items-center gap-1.5">
                  <span>Next: Stage 4 Transfer &amp; Reflection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 4: UNFAMILIAR CROSS-SUBJECT TRANSFER + CITIZEN BRIEF + 5 FLASHCARDS */}
      {stage === 3 && (
        <div className="space-y-6">
          <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
                  Stage 4 · Independent Cross-Subject Transfer Check (True Mastery Gate)
                </div>
                <h2 className="text-xl font-extrabold text-[var(--ink)]">
                  Apply What You Discovered to 3 Unfamiliar Problems ({transferCorrectCount}/3)
                </h2>
              </div>
              {allTransferPassed && (
                <button
                  type="button"
                  onClick={() => persistStage(3, true)}
                  className="px-4 py-2 rounded-xl bg-[var(--success)] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Save Capstone Completion Stamp</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {TRANSFER_QUESTIONS.map((q, idx) => {
                const picked = answers[q.id];
                const chosenObj = q.options.find((o) => o.id === picked);
                return (
                  <div key={q.id} className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      Transfer {idx + 1} · {q.subject}
                    </div>
                    <p className="text-sm font-bold text-[var(--ink)]">{q.prompt}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            const next = { ...answers, [q.id]: opt.id };
                            setAnswers(next);
                            const allOk = TRANSFER_QUESTIONS.every((tq) =>
                              tq.options.some((to) => to.id === next[tq.id] && to.correct),
                            );
                            if (allOk) persistStage(3, true);
                          }}
                          className={`w-full text-left p-3 min-h-[44px] rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
                            picked === opt.id
                              ? opt.correct
                                ? 'bg-[var(--success-bg)] border-[var(--success)] text-[var(--ink)]'
                                : 'bg-[var(--warning-bg)] border-[var(--warning)] text-[var(--ink)]'
                              : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text)] hover:border-[var(--primary)]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {chosenObj && (
                      <p className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)]">
                        <strong>{chosenObj.correct ? '✓ Correct: ' : 'Hint: '}</strong>
                        {chosenObj.why}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* English / Tamil Citizen Proposal (Local-only Creative Achievement) */}
          <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold text-[var(--ink)]">
                Write Your 3-Line Citizen Proposal (Saved Only on This Device)
              </h3>
              <div className="flex gap-1.5 text-xs">
                <button type="button" onClick={() => setBriefLang('en')} className={`px-3 py-1.5 rounded-lg border font-bold ${briefLang === 'en' ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}>English</button>
                <button type="button" onClick={() => setBriefLang('ta')} className={`px-3 py-1.5 rounded-lg border font-bold font-tamil ${briefLang === 'ta' ? 'bg-[var(--tamil)] text-white border-[var(--tamil)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}>தமிழ்</button>
              </div>
            </div>
            <p className={`text-xs text-[var(--text-muted)] ${briefLang === 'ta' ? 'font-tamil' : ''}`}>
              {briefLang === 'ta'
                ? 'உங்கள் ஊரின் மழைநீர் சேகரிப்புத் தொட்டி, தூய மின்சாரம் மற்றும் நியாயமான வரிப் பகிர்வை 2–3 வரிகளில் விளக்கி எழுதுக:'
                : 'Explain in 2–3 sentences how your town balances tank geometry, clean LED/wind power, and fair taxes:'}
            </p>
            <textarea
              rows={3}
              lang={briefLang === 'ta' ? 'ta' : undefined}
              value={citizenBrief}
              onChange={(e) => {
                setCitizenBrief(e.target.value);
                saveTeachBackNote(CAPSTONE_ID, e.target.value);
              }}
              placeholder={briefLang === 'ta' ? 'எ.கா. எங்கள் ஊரில் 7 மீ ஆரமுள்ள உருளைத் தொட்டி...' : 'e.g. By choosing a wider cylindrical tank and upgrading 80% of lights to LEDs...'}
              className={`w-full p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)] ${briefLang === 'ta' ? 'font-tamil' : ''}`}
            />
          </section>

          {/* 5 Distinct Cross-Subject Retrieval Flashcards */}
          <section className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-extrabold text-[var(--ink)]">
              5 Cross-Subject Retrieval Cards (Tap to Flip)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAPSTONE_FLASHCARDS.map((fc) => {
                const isOpen = Boolean(flipped[fc.id]);
                return (
                  <button
                    key={fc.id}
                    type="button"
                    onClick={() => setFlipped((p) => ({ ...p, [fc.id]: !p[fc.id] }))}
                    aria-pressed={isOpen}
                    className={`p-4 rounded-2xl border text-left transition-colors space-y-2 ${
                      isOpen
                        ? 'bg-[var(--primary-tint)] border-[var(--primary)]'
                        : 'bg-[var(--surface-subtle)] border-[var(--line)] hover:border-[var(--primary)]'
                    }`}
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      {isOpen ? 'Answer' : 'Question · Tap to Reveal'}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[var(--ink)] leading-relaxed">
                      {isOpen ? fc.back : fc.front}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
