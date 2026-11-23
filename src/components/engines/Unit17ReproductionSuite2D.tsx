import React, { useState } from 'react';
import { Calendar, Flower2, HeartHandshake, Microscope } from 'lucide-react';

export type Unit17Variant =
  | 'asexual_spores'
  | 'flower_ovule'
  | 'pollination_agents'
  | 'double_fertilization'
  | 'human_testes'
  | 'menstrual_cycle'
  | 'foetal_timeline'
  | 'reproductive_health_hygiene';

interface Unit17ReproductionSuite2DProps {
  variant: Unit17Variant;
  onExplore: () => void;
}

const MENSTRUAL_PHASES = [
  { id: 'menstrual', label: '1. Menstrual Phase (Days 1–5)', ovary: 'Primary follicles begin developing.', uterus: 'Breakdown of uterine endometrial lining causes menstrual flow.', hormones: 'Progesterone and Oestrogen levels drop (Table 17.1, p. 251).' },
  { id: 'follicular', label: '2. Follicular / Proliferative (Days 6–13)', ovary: 'Primary follicle matures into fluid-filled Graafian follicle.', uterus: 'Endometrial lining regenerates and thickens.', hormones: 'FSH and Oestrogen steadily increase.' },
  { id: 'ovulatory', label: '3. Ovulatory Phase (Day 14)', ovary: 'Mature Graafian follicle ruptures, releasing the ovum (ovulation).', uterus: 'Endometrial thickness increases further.', hormones: 'Sharp LH peak triggers ovulation!' },
  { id: 'luteal', label: '4. Luteal / Secretory (Days 15–28)', ovary: 'Emptied follicle turns into Corpus Luteum.', uterus: 'Endometrium prepared for implantation; sheds if unfertilized.', hormones: 'Corpus luteum secretes Progesterone (declines if no fertilization).' },
];

/**
 * Completes 100% (17/17) of Science Unit 17 — Reproduction in Plants and Animals (TN Science pp. 243–256).
 * Calm, dignified, source-grounded 2D SVG biology diagrams separating plant, human, hormonal, and hygiene topics cleanly.
 */
export function Unit17ReproductionSuite2D({ variant, onExplore }: Unit17ReproductionSuite2DProps) {
  const [asexualTab, setAsexualTab] = useState<'rhizopus' | 'bryophyllum' | 'yeast' | 'amoeba'>('rhizopus');
  const [ovulePart, setOvulePart] = useState('egg');
  const [agent, setAgent] = useState<'wind' | 'insects' | 'water' | 'animals'>('insects');
  const [fertStep, setFertStep] = useState(0);
  const [cycleDay, setCycleDay] = useState(14);
  const [foetalStage, setFoetalStage] = useState(0);
  const [hygieneTab, setHygieneTab] = useState<'family' | 'uti' | 'hygiene'>('hygiene');

  if (variant === 'asexual_spores') {
    const modes = {
      rhizopus: { title: 'Spore Formation in Rhizopus (Bread Mould · Fig. 17.6, p. 245)', desc: 'A knob-like sporangium develops on fungal hyphae; its nucleus divides repeatedly to form many haploid/mitotic spores liberated to grow new hyphae.' },
      bryophyllum: { title: 'Vegetative Leaf Propagation (Bryophyllum · Fig. 17.1, p. 244)', desc: 'Adventitious plantlets sprout directly along the leaf notches and grow into independent genetically identical plants.' },
      yeast: { title: 'Budding in Yeast (Fig. 17.5, p. 244)', desc: 'A small projection (bud) emerges from the parent yeast cell, receives a divided nucleus, and detaches as a new individual.' },
      amoeba: { title: 'Binary Fission in Amoeba (Fig. 17.4, p. 244)', desc: 'Parent cell divides mitotically into two genetically identical daughter cells without gamete fusion.' },
    }[asexualTab];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 500 220" role="img" aria-label={modes.title} className="w-full h-auto">
            {asexualTab === 'rhizopus' ? (
              <g>
                <line x1="80" y1="185" x2="420" y2="185" stroke="#78716c" strokeWidth="4" />
                <line x1="250" y1="185" x2="250" y2="85" stroke="#57534e" strokeWidth="5" />
                <circle cx="250" cy="70" r="30" fill="#fef3c7" stroke="#92400e" strokeWidth="2.5" />
                {[[238, 66], [250, 56], [262, 68], [246, 78], [295, 42], [312, 58], [326, 36]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4.5" fill="#78350f" />
                ))}
                <text x="150" y="72" fontSize="11.5" fontWeight="800" fill="#0f172a">Sporangium</text>
                <text x="342" y="45" fontSize="11.5" fontWeight="800" fill="#92400e">Liberated Spores</text>
                <text x="250" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill="#57534e">Hypha (Mycelium on moist bread · Activity 1)</text>
              </g>
            ) : (
              <g>
                <rect x="90" y="55" width="320" height="110" rx="18" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                <text x="250" y="102" textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#065f46">{modes.title.split(' (')[0]}</text>
                <text x="250" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Mitotic Division Only · Single Parent · Genetically Identical Clones</text>
              </g>
            )}
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            17.1 &amp; 17.2 Vegetative &amp; Asexual Reproduction (pp. 244–245)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {([['rhizopus', 'Spore (Rhizopus)'], ['bryophyllum', 'Leaf (Bryophyllum)'], ['yeast', 'Budding (Yeast)'], ['amoeba', 'Fission (Amoeba)']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setAsexualTab(k); onExplore(); }} className={`min-h-[38px] px-2.5 py-1.5 rounded-xl border font-bold ${asexualTab === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong className="text-[var(--ink)]">{modes.title}:</strong> {modes.desc}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'flower_ovule') {
    const ovuleInfo: Record<string, string> = {
      antipodals: '3 Antipodal cells at the chalazal (basal) end — degenerate after fertilization (p. 246, Fig. 17.10).',
      polar: '2 Polar nuclei (Secondary nucleus, 2n) at the centre of the embryo sac — fuse with 2nd male gamete (Triple Fusion → 3n Endosperm).',
      egg: 'Egg Apparatus at the micropylar end: 1 Egg cell (female gamete, n) flanked by 2 Synergids.',
      micropyle: 'Micropyle opening in the two integuments where the pollen tube enters the ovule.',
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 520 250" role="img" aria-label="Structure of Angiosperm Ovule showing 7-celled 8-nucleate embryo sac" className="w-full h-auto">
            {/* Outer & Inner Integuments */}
            <ellipse cx="220" cy="125" rx="92" ry="74" fill="#fef9c3" stroke="#a16207" strokeWidth="2.5" />
            <ellipse cx="220" cy="125" rx="68" ry="56" fill="#ecfdf5" stroke="#15803d" strokeWidth="2" />
            {/* Micropyle opening at bottom */}
            <rect x="208" y="182" width="24" height="22" fill="#ffffff" />
            <text x="220" y="218" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#92400e">Micropyle (Pollen Tube Entry)</text>
            <text x="220" y="34" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#166534">Chalaza (3 Antipodal Cells)</text>

            {/* 3 Antipodals (top) */}
            {[200, 220, 240].map((x) => (
              <circle key={x} cx={x} cy="86" r="8" fill={ovulePart === 'antipodals' ? '#2563eb' : '#93c5fd'} stroke="#1e40af" onClick={() => { setOvulePart('antipodals'); onExplore(); }} className="cursor-pointer" />
            ))}
            {/* 2 Polar Nuclei (center) */}
            <circle cx="212" cy="125" r="9" fill={ovulePart === 'polar' ? '#7c3aed' : '#c4b5fd'} stroke="#5b21b6" onClick={() => { setOvulePart('polar'); onExplore(); }} className="cursor-pointer" />
            <circle cx="228" cy="125" r="9" fill={ovulePart === 'polar' ? '#7c3aed' : '#c4b5fd'} stroke="#5b21b6" onClick={() => { setOvulePart('polar'); onExplore(); }} className="cursor-pointer" />
            {/* Egg + 2 Synergids (bottom) */}
            <circle cx="220" cy="160" r="10" fill={ovulePart === 'egg' ? '#dc2626' : '#fca5a5'} stroke="#991b1b" onClick={() => { setOvulePart('egg'); onExplore(); }} className="cursor-pointer" />
            <circle cx="200" cy="164" r="7" fill="#fde68a" stroke="#b45309" />
            <circle cx="240" cy="164" r="7" fill="#fde68a" stroke="#b45309" />

            {/* Right Leader Labels */}
            <text x="342" y="88" fontSize="11.5" fontWeight="800" fill="#1e3a8a">3 Antipodal cells</text>
            <text x="342" y="128" fontSize="11.5" fontWeight="800" fill="#5b21b6">2 Polar nuclei (centre)</text>
            <text x="342" y="164" fontSize="11.5" fontWeight="800" fill="#991b1b">Egg cell + 2 Synergids</text>
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5">
            <Flower2 className="w-4 h-4" />
            <span>17.3.2 Structure of Ovule — 7 Cells, 8 Nuclei (Fig. 17.10, p. 246)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {([['egg', 'Egg Apparatus'], ['polar', 'Polar Nuclei'], ['antipodals', 'Antipodals'], ['micropyle', 'Micropyle']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setOvulePart(k); onExplore(); }} className={`min-h-[38px] px-3 py-1.5 rounded-xl border font-bold ${ovulePart === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] border-[var(--line)]'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] leading-relaxed">
            {ovuleInfo[ovulePart]}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'pollination_agents') {
    const map = {
      wind: { term: 'Anemophily (Wind)', traits: 'Enormous numbers of small, smooth, dry, light pollen grains; large hairy protruding stigmas (e.g., Grasses, Cacti — p. 247).' },
      insects: { term: 'Entomophily (Insects · ~80% by Honey Bees)', traits: 'Brightly coloured petals, fragrance, nectar; larger sticky/spiny exine pollen grains adhering to insect bodies.' },
      water: { term: 'Hydrophily (Water · Fig. 17.11)', traits: 'Aquatic plants release floating pollen grains carried on water surface to female stigmas (e.g., Hydrilla, Vallisneria).' },
      animals: { term: 'Zoophily (Birds & Mammals)', traits: 'Bright colour, large size, rich nectar (e.g., Sunbird pollinates Canna & Gladioli; Squirrels pollinate Silk Cotton tree, p. 248).' },
    }[agent];

    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs sm:text-sm">
        <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          17.5 Agents of Cross-Pollination Explorer (pp. 247–248)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {([['wind', 'Wind (Anemophily)'], ['insects', 'Insects (Entomophily)'], ['water', 'Water (Hydrophily)'], ['animals', 'Animals (Zoophily)']] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setAgent(k); onExplore(); }} className={`min-h-[44px] px-3 py-2 rounded-xl border font-bold text-xs ${agent === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1.5">
          <div className="text-base font-extrabold text-[var(--ink)]">{map.term}</div>
          <p className="text-[var(--text)] leading-relaxed">{map.traits}</p>
        </div>
      </div>
    );
  }

  if (variant === 'double_fertilization') {
    const steps = [
      { title: '1. Pollen Germination on Stigma', detail: 'Compatible pollen grain lands on stigma and grows a pollen tube through the germ pore down the style toward the micropyle.' },
      { title: '2. Two Male Gametes Enter Embryo Sac', detail: 'Generative cell divides mitotically to form TWO male gametes (n each); pollen tube tip bursts inside embryo sac.' },
      { title: '3. Syngamy (n + n = 2n Diploid Zygote)', detail: 'First male gamete fuses with the Egg cell → forms diploid Zygote (2n) → develops into future Embryo.' },
      { title: '4. Triple Fusion (n + 2n = 3n Endosperm)', detail: 'Second male gamete fuses with diploid Secondary nucleus (2 polar nuclei) → forms triploid Primary Endosperm Nucleus (3n) providing food to embryo! Post-fertilization: Ovule → Seed, Ovary → Fruit (p. 248).' },
    ];
    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs sm:text-sm">
        <div className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          17.6 Double Fertilization in Plants — Syngamy + Triple Fusion (Fig. 17.12, p. 248)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {steps.map((s, idx) => (
            <button key={s.title} type="button" onClick={() => { setFertStep(idx); onExplore(); }} className={`min-h-[44px] p-3 rounded-xl border text-left text-xs font-bold ${fertStep === idx ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
              {s.title}
            </button>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] leading-relaxed">
          <strong>{steps[fertStep].title}:</strong> {steps[fertStep].detail}
        </div>
      </div>
    );
  }

  if (variant === 'human_testes') {
    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs sm:text-sm">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
          <Microscope className="w-4 h-4" />
          <span>17.7 &amp; 17.7.1 Human Reproductive Organs — Structure of Testes (Fig. 17.13, p. 249)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="font-extrabold text-[var(--ink)]">Seminiferous Tubules</div>
            <p className="text-xs text-[var(--text)] mt-1">Located inside pyramidal lobules covered by fibrous <em>tunica albuginea</em>; site where spermatogenesis produces haploid sperm.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="font-extrabold text-[var(--ink)]">Sertoli Cells</div>
            <p className="text-xs text-[var(--text)] mt-1">Supporting nurse cells inside tubules that provide nourishment to developing spermatozoa.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="font-extrabold text-[var(--ink)]">Leydig (Interstitial) Cells</div>
            <p className="text-xs text-[var(--text)] mt-1">Polyhedral cells lying between seminiferous tubules that secrete <strong>Testosterone</strong> (controlled by pituitary LH).</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'menstrual_cycle') {
    const activePhase =
      cycleDay <= 5
        ? MENSTRUAL_PHASES[0]
        : cycleDay <= 13
          ? MENSTRUAL_PHASES[1]
          : cycleDay === 14
            ? MENSTRUAL_PHASES[2]
            : MENSTRUAL_PHASES[3];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 overflow-x-auto">
            <svg viewBox="0 0 540 220" role="img" aria-label={`28-day menstrual cycle synchrony chart on Day ${cycleDay}`} className="w-full h-auto min-w-[300px]">
              {/* Phase colored bands */}
              <rect x="40" y="34" width="85" height="140" fill="#ffe4e6" />
              <rect x="125" y="34" width="136" height="140" fill="#fef9c3" />
              <rect x="261" y="34" width="22" height="140" fill="#dcfce7" />
              <rect x="283" y="34" width="227" height="140" fill="#eff6ff" />

              <text x="82" y="25" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#9f1239">Menstrual (1–5)</text>
              <text x="193" y="25" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#854d0e">Follicular (6–13)</text>
              <text x="272" y="25" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#166534">Day 14</text>
              <text x="396" y="25" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#1e40af">Luteal (15–28)</text>

              {/* Schematic Hormone Curves: LH peak at Day 14, Progesterone peak Days 18-24 */}
              <path d="M 40 154 Q 230 148 272 52 Q 300 148 510 154" fill="none" stroke="#16a34a" strokeWidth="2.5" />
              <path d="M 40 162 L 272 158 Q 375 68 470 115 L 510 160" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 3" />
              <text x="284" y="64" fontSize="10" fontWeight="800" fill="#15803d">LH Peak (Ovulation)</text>
              <text x="392" y="96" fontSize="10" fontWeight="800" fill="#1d4ed8">Progesterone (Corpus Luteum)</text>

              {/* Current Day Vertical Cursor */}
              {(() => {
                const cx = 40 + ((cycleDay - 1) / 27) * 470;
                return (
                  <g>
                    <line x1={cx} y1="30" x2={cx} y2="180" stroke="#0f172a" strokeWidth="2.5" />
                    <circle cx={cx} cy="180" r="6" fill="#0f172a" />
                  </g>
                );
              })()}
              <text x="275" y="204" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
                28-Day Reproductive Cycle Timeline (Day {cycleDay} · Table 17.1, p. 251)
              </text>
            </svg>
          </div>
          <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
            <div className="font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>17.9 Menstrual Cycle Synchrony (p. 251)</span>
            </div>
            <label className="block font-bold text-[var(--ink)]">
              Inspect Cycle Day: Day {cycleDay} of 28
              <input type="range" min={1} max={28} step={1} value={cycleDay} onChange={(e) => { setCycleDay(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--primary)] mt-1" />
            </label>
            <div className="flex flex-wrap gap-1.5">
              {([3, 10, 14, 21] as const).map((d) => (
                <button key={d} type="button" onClick={() => { setCycleDay(d); onExplore(); }} className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-bold">
                  Day {d}
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1.5 text-[var(--text)]">
              <div className="font-extrabold text-[var(--ink)]">{activePhase.label}</div>
              <div><strong>Ovary:</strong> {activePhase.ovary}</div>
              <div><strong>Uterus:</strong> {activePhase.uterus}</div>
              <div><strong>Hormones:</strong> {activePhase.hormones}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'foetal_timeline') {
    const stages = [
      { title: '1. Fertilization (Ampulla of Fallopian Tube)', detail: 'Haploid sperm (n) + haploid ovum (n) unite to form diploid Zygote (2n = 46).' },
      { title: '2. Cleavage → Morula → Blastocyst', detail: 'Rapid mitotic divisions form a solid morula and hollow blastocyst as it moves toward the uterus.' },
      { title: '3. Implantation (Day 6–7)', detail: 'Blastocyst embeds safely in the thickened uterine endometrium.' },
      { title: '4. Placenta & Gestation (~280 Days)', detail: 'Placenta exchanges oxygen, nutrients, and wastes between mother and foetus; Oxytocin aids childbirth (parturition) and Prolactin stimulates lactation (pp. 252–253).' },
    ];
    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs sm:text-sm">
        <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
          17.10 Fertilization to Foetal Development (pp. 252–253)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {stages.map((s, idx) => (
            <button key={s.title} type="button" onClick={() => { setFoetalStage(idx); onExplore(); }} className={`min-h-[44px] p-3 rounded-xl border text-left text-xs font-bold ${foetalStage === idx ? 'bg-[var(--science)] text-white border-[var(--science)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
              {s.title}
            </button>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] leading-relaxed">
          {stages[foetalStage].detail}
        </div>
      </div>
    );
  }

  // 17.12, 17.13, 17.14 Reproductive Health, UTI & Personal Hygiene (pp. 254–256)
  return (
    <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs sm:text-sm">
      <div className="font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300 inline-flex items-center gap-1.5">
        <HeartHandshake className="w-4 h-4" />
        <span>17.12–17.14 Reproductive Health, UTI Prevention &amp; Hygiene (pp. 254–256)</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {([
          ['family', '17.12 Family Planning & WHO Health'],
          ['uti', '17.13 Urinary Tract Infection (UTI)'],
          ['hygiene', '17.14 Personal & Menstrual Hygiene'],
        ] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => { setHygieneTab(k); onExplore(); }} className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-bold ${hygieneTab === k ? 'bg-teal-700 text-white border-teal-700' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
        {hygieneTab === 'family' && (
          <p><strong className="text-[var(--ink)]">Population &amp; Family Planning (p. 254):</strong> Covers barrier methods, hormonal pills, IUDs (Copper-T), and surgical methods (vasectomy in males, tubectomy in females) alongside maternal-child nutrition and safe spacing.</p>
        )}
        {hygieneTab === 'uti' && (
          <p><strong className="text-[var(--ink)]">Urinary Tract Infection Prevention (p. 255):</strong> Drinking adequate clean water, never holding urine for long durations, and maintaining clean toilet hygiene help prevent bacterial UTIs.</p>
        )}
        {hygieneTab === 'hygiene' && (
          <p><strong className="text-[var(--ink)]">Personal, Body &amp; Menstrual Hygiene (pp. 255–256):</strong> Regular bathing, handwashing with soap after toilet use, clean breathable clothing, and changing sanitary napkins regularly every 4–5 hours prevent infections and support adolescent well-being.</p>
        )}
      </div>
    </div>
  );
}
