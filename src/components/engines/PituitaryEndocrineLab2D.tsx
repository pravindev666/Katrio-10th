import React, { useState } from 'react';
import { Activity } from 'lucide-react';

interface PituitaryEndocrineLab2DProps {
  onExplore: () => void;
}

interface PituitaryHormoneSpec {
  id: string;
  lobe: 'anterior' | 'posterior';
  shortName: string;
  fullName: string;
  targetOrgan: string;
  targetCoord: [number, number];
  action: string;
  disorder: string;
}

const PITUITARY_HORMONES: PituitaryHormoneSpec[] = [
  {
    id: 'gh',
    lobe: 'anterior',
    shortName: 'GH',
    fullName: 'Growth Hormone (Somatotropic Hormone)',
    targetOrgan: 'Bones, Cartilage & Body Tissues',
    targetCoord: [108, 250],
    action: 'Promotes development and enlargement of muscles, cartilage, long bones, and regulates cell metabolism (p. 233).',
    disorder: 'Low in children → Dwarfism; Excess in children → Gigantism; Excess in adults → Acromegaly.',
  },
  {
    id: 'tsh',
    lobe: 'anterior',
    shortName: 'TSH',
    fullName: 'Thyroid Stimulating Hormone',
    targetOrgan: 'Thyroid Gland (Neck)',
    targetCoord: [150, 108],
    action: 'Controls growth of the thyroid gland and coordinates secretion of thyroxine (T3, T4) (p. 234).',
    disorder: 'Disrupted TSH signalling alters thyroid metabolism.',
  },
  {
    id: 'acth',
    lobe: 'anterior',
    shortName: 'ACTH',
    fullName: 'Adrenocorticotropic Hormone',
    targetOrgan: 'Adrenal Cortex (Above Kidneys)',
    targetCoord: [130, 172],
    action: 'Stimulates the adrenal cortex to produce cortical hormones and influences protein synthesis (p. 234).',
    disorder: 'Alters stress-response and salt-sugar balance regulated by adrenal cortex.',
  },
  {
    id: 'gth',
    lobe: 'anterior',
    shortName: 'FSH & LH',
    fullName: 'Gonadotropic Hormones (FSH & LH)',
    targetOrgan: 'Gonads (Testes / Ovary)',
    targetCoord: [150, 224],
    action: 'FSH stimulates sperm formation (males) & ovarian follicle growth (females); LH triggers testosterone (males) & ovulation + corpus luteum (females) (p. 234).',
    disorder: 'Essential for normal puberty and reproductive maturation.',
  },
  {
    id: 'prl',
    lobe: 'anterior',
    shortName: 'PRL',
    fullName: 'Prolactin (Lactogenic Hormone)',
    targetOrgan: 'Mammary Glands',
    targetCoord: [176, 138],
    action: 'Initiates mammary gland development during pregnancy and stimulates milk production after childbirth (p. 234).',
    disorder: 'Regulates lactation after childbirth.',
  },
  {
    id: 'adh',
    lobe: 'posterior',
    shortName: 'ADH',
    fullName: 'Vasopressin / Antidiuretic Hormone (ADH)',
    targetOrgan: 'Kidney Tubules',
    targetCoord: [172, 184],
    action: 'Increases water reabsorption in kidney tubules, reducing excess water loss through urine (p. 234).',
    disorder: 'Deficiency of ADH causes excessive dilute urine output (polyuria) → Diabetes insipidus!',
  },
  {
    id: 'oxytocin',
    lobe: 'posterior',
    shortName: 'Oxytocin',
    fullName: 'Oxytocin',
    targetOrgan: 'Uterus & Mammary Glands',
    targetCoord: [150, 212],
    action: 'Aids contraction of smooth muscles of the uterus during childbirth and milk ejection after childbirth (p. 234).',
    disorder: 'Works in coordination with childbirth and lactation reflexes.',
  },
];

/**
 * Science 16.2.1 — Pituitary Gland ("Master Gland", TN Class 10 Science pp. 233–234, Fig. 16.7).
 * Interactive 2D Endocrine System Map + Hypothalamus → Anterior/Posterior Pituitary → Target Organ Flow.
 */
export function PituitaryEndocrineLab2D({ onExplore }: PituitaryEndocrineLab2DProps) {
  const [selectedId, setSelectedId] = useState<string>('tsh');
  const active = PITUITARY_HORMONES.find((h) => h.id === selectedId) ?? PITUITARY_HORMONES[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Clickable 2D Human Endocrine Map + Zoomed Pituitary Stalk Inset */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4">
          <svg
            viewBox="0 0 360 315"
            role="img"
            aria-labelledby="pit-title pit-desc"
            className="w-full h-auto"
          >
            <title id="pit-title">Pituitary Gland and Endocrine Target Organ Map</title>
            <desc id="pit-desc">
              Human outline showing the pea-shaped pituitary gland at the base of the midbrain attached to the hypothalamus,
              sending {active.fullName} via the bloodstream to {active.targetOrgan}.
            </desc>

            {/* Calm neutral anatomical outline */}
            <circle cx="150" cy="54" r="32" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <path
              d="M 134 86 L 134 102 L 96 116 L 86 218 L 106 218 L 114 146 L 114 288 L 146 288 L 150 232 L 154 288 L 186 288 L 186 146 L 194 218 L 214 218 L 204 116 L 166 102 L 166 86 Z"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* Pituitary Gland Origin Marker at base of midbrain */}
            <circle cx="150" cy="60" r="8" fill="#7c3aed" stroke="#4c1d95" strokeWidth="2" />
            <text x="150" y="16" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#4c1d95">
              Pituitary (Base of Midbrain)
            </text>

            {/* Bloodstream Hormone Pathway Line from Pituitary -> Selected Target Organ */}
            <path
              d={`M 150 68 Q ${(150 + active.targetCoord[0]) / 2 + 24} ${(68 + active.targetCoord[1]) / 2} ${active.targetCoord[0]} ${active.targetCoord[1]}`}
              fill="none"
              stroke={active.lobe === 'anterior' ? '#2563eb' : '#db2777'}
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Target Organ Markers */}
            {PITUITARY_HORMONES.map((h) => {
              const isSel = h.id === active.id;
              return (
                <g
                  key={h.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${h.shortName}: ${h.targetOrgan}`}
                  onClick={() => { setSelectedId(h.id); onExplore(); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(h.id);
                      onExplore();
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <circle
                    cx={h.targetCoord[0]}
                    cy={h.targetCoord[1]}
                    r={isSel ? 11 : 7}
                    fill={isSel ? (h.lobe === 'anterior' ? '#2563eb' : '#db2777') : '#ffffff'}
                    stroke={h.lobe === 'anterior' ? '#1d4ed8' : '#be185d'}
                    strokeWidth="2.5"
                  />
                </g>
              );
            })}

            {/* Zoomed Pituitary Stalk Inset (Fig. 16.7) */}
            <rect x="228" y="22" width="124" height="162" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="290" y="40" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0f172a">
              Zoom: Fig. 16.7
            </text>
            {/* Hypothalamus */}
            <rect x="252" y="48" width="76" height="22" rx="6" fill="#fef3c7" stroke="#d97706" />
            <text x="290" y="63" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e">
              Hypothalamus
            </text>
            {/* Pituitary Stalk */}
            <rect x="285" y="70" width="10" height="18" fill="#cbd5e1" />
            {/* Anterior Lobe */}
            <ellipse
              cx="274"
              cy="108"
              rx="18"
              ry="22"
              fill={active.lobe === 'anterior' ? '#2563eb' : '#dbeafe'}
              stroke="#1d4ed8"
              strokeWidth="2"
            />
            <text x="274" y="111" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={active.lobe === 'anterior' ? '#ffffff' : '#1e3a8a'}>
              Ant.
            </text>
            {/* Posterior Lobe */}
            <ellipse
              cx="306"
              cy="108"
              rx="16"
              ry="20"
              fill={active.lobe === 'posterior' ? '#db2777' : '#fce7f3'}
              stroke="#be185d"
              strokeWidth="2"
            />
            <text x="306" y="111" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={active.lobe === 'posterior' ? '#ffffff' : '#9d174d'}>
              Post.
            </text>
            <text x="290" y="148" textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
              Intermediate lobe
            </text>
            <text x="290" y="160" textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
              absent in humans
            </text>
            <text x="290" y="176" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#2563eb">
              Via Bloodstream (Ductless)
            </text>

            {/* Target Label Banner */}
            <rect x="18" y="294" width="324" height="18" rx="6" fill="#eff6ff" />
            <text x="180" y="306" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1e3a8a">
              {active.shortName} → Bloodstream → {active.targetOrgan}
            </text>
          </svg>
        </div>

        {/* Right: Lobe & Hormone Inspector + Endocrine vs Nervous Contrast */}
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3.5 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>Select a Pituitary Hormone (Anterior vs Posterior Lobe)</span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300">
              Anterior Lobe (Adenohypophysis) — 5 Major Hormone Groups:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PITUITARY_HORMONES.filter((h) => h.lobe === 'anterior').map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => { setSelectedId(h.id); onExplore(); }}
                  aria-pressed={selectedId === h.id}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl border font-bold ${
                    selectedId === h.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-blue-500'
                  }`}
                >
                  {h.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-extrabold text-pink-700 dark:text-pink-300">
              Posterior Lobe (Neurohypophysis) — 2 Hormones:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PITUITARY_HORMONES.filter((h) => h.lobe === 'posterior').map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => { setSelectedId(h.id); onExplore(); }}
                  aria-pressed={selectedId === h.id}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl border font-bold ${
                    selectedId === h.id
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-pink-500'
                  }`}
                >
                  {h.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Active Hormone Details Card */}
          <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-[var(--ink)]">{active.fullName}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  active.lobe === 'anterior'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200'
                }`}
              >
                {active.lobe === 'anterior' ? 'Adenohypophysis' : 'Neurohypophysis'}
              </span>
            </div>
            <div>
              <strong className="text-[var(--ink)]">Target Organ:</strong>{' '}
              <span className="text-[var(--text)]">{active.targetOrgan}</span>
            </div>
            <div>
              <strong className="text-[var(--ink)]">Physiological Action:</strong>{' '}
              <span className="text-[var(--text)]">{active.action}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-400/40 text-[var(--ink)]">
              <strong>Imbalance / Clinical Note:</strong> {active.disorder}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/25 text-[11px] text-[var(--ink)] leading-relaxed">
            <strong>Endocrine vs. Nervous System:</strong> Endocrine glands are <em>ductless</em> and release chemical messengers (hormones) into the <strong>bloodstream</strong> for slower, longer-lasting coordination across distant target organs — unlike fast electrical nerve impulses along neurons.
          </div>
        </div>
      </div>
    </div>
  );
}
