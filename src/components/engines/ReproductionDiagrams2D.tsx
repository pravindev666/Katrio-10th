import React, { useState } from 'react';
import { Microscope } from 'lucide-react';

export type ReproductionDiagramVariant = 'sperm' | 'ovum' | 'gametogenesis_compare';

interface ReproductionDiagrams2DProps {
  variant: ReproductionDiagramVariant;
  onExplore: () => void;
}

const SPERM_PARTS = [
  { id: 'acrosome', label: 'Acrosome', desc: 'Cap-like anterior tip on the sperm head containing hyaluronidase enzyme, which helps penetrate the outer egg layers during fertilization (p. 250).' },
  { id: 'nucleus', label: 'Haploid Nucleus (n = 23)', desc: 'Condensed nucleus filling the elongated head, carrying 23 paternal chromosomes.' },
  { id: 'neck', label: 'Neck (Centrioles)', desc: 'Short connecting region between the head and middle piece containing centrioles.' },
  { id: 'midpiece', label: 'Middle Piece (Mitochondria)', desc: 'Contains spirally arranged mitochondria that generate energy (ATP) required for tail motility.' },
  { id: 'tail', label: 'Tail (Flagellum)', desc: 'Slender motile flagellum whose movement propels the spermatozoan toward the ovum.' },
];

const OVUM_PARTS = [
  { id: 'corona', label: 'Corona Radiata', desc: 'Thick outer protective layer composed of radiating follicle cells surrounding the mature ovum (p. 250).' },
  { id: 'zona', label: 'Zona Pellucida', desc: 'Inner thin, transparent protective membrane located just inside the corona radiata.' },
  { id: 'perivitelline', label: 'Perivitelline Space', desc: 'Fluid-filled narrow space separating the zona pellucida from the surface vitelline membrane.' },
  { id: 'vitelline', label: 'Vitelline Membrane', desc: 'Plasma membrane forming the surface boundary of the ovum.' },
  { id: 'cytoplasm', label: 'Cytoplasm (Ooplasm)', desc: 'Abundant, nearly yolk-free cytoplasm containing nutrients for early development.' },
  { id: 'ovum_nucleus', label: 'Haploid Nucleus (n = 23)', desc: 'Central spherical nucleus carrying 23 maternal chromosomes.' },
];

/**
 * Science Unit 17 (17.8, 17.8.1, 17.8.2 — TN Class 10 Science p. 250, Fig. 17.15 & Fig. 17.16).
 * Calm, dignified, neutral-palette, textbook-grade labelled 2D medical SVG illustrations.
 * Zero neon/creepy effects, zero unsettling animation, explicit microscopic scale note.
 */
export function ReproductionDiagrams2D({ variant, onExplore }: ReproductionDiagrams2DProps) {
  const [activeTab, setActiveTab] = useState<'sperm' | 'ovum'>(variant === 'ovum' ? 'ovum' : 'sperm');
  const [selectedSperm, setSelectedSperm] = useState('acrosome');
  const [selectedOvum, setSelectedOvum] = useState('corona');

  const showingSperm = variant === 'sperm' || (variant === 'gametogenesis_compare' && activeTab === 'sperm');
  const parts = showingSperm ? SPERM_PARTS : OVUM_PARTS;
  const selectedId = showingSperm ? selectedSperm : selectedOvum;
  const setSelectedId = showingSperm ? setSelectedSperm : setSelectedOvum;
  const activePart = parts.find((p) => p.id === selectedId) ?? parts[0];

  return (
    <div className="space-y-4">
      {variant === 'gametogenesis_compare' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('sperm'); onExplore(); }}
            aria-pressed={activeTab === 'sperm'}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-extrabold ${
              activeTab === 'sperm'
                ? 'bg-[var(--science)] text-white border-[var(--science)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Fig. 17.15 · Structure of Human Sperm
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('ovum'); onExplore(); }}
            aria-pressed={activeTab === 'ovum'}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-extrabold ${
              activeTab === 'ovum'
                ? 'bg-[var(--science)] text-white border-[var(--science)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Fig. 17.16 · Structure of Human Ovum
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Calm Clinical Textbook 2D SVG Illustration */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[#f8fafc] dark:bg-slate-900 p-4 overflow-x-auto">
          {showingSperm ? (
            <svg
              viewBox="0 0 560 250"
              role="img"
              aria-labelledby="sperm-title sperm-desc"
              className="w-full h-auto min-w-[300px]"
            >
              <title id="sperm-title">Structure of Human Sperm (Figure 17.15)</title>
              <desc id="sperm-desc">
                Calm labelled 2D textbook diagram of a human spermatozoan showing Head with Acrosome and Haploid Nucleus,
                short Neck with centrioles, Middle piece containing mitochondria, and slender Tail.
              </desc>

              {/* Bracket labels at bottom */}
              <line x1="60" y1="196" x2="170" y2="196" stroke="#64748b" strokeWidth="1.5" />
              <text x="115" y="214" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155">Head</text>
              <line x1="178" y1="196" x2="290" y2="196" stroke="#64748b" strokeWidth="1.5" />
              <text x="234" y="214" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155">Middle Piece</text>
              <line x1="298" y1="196" x2="520" y2="196" stroke="#64748b" strokeWidth="1.5" />
              <text x="409" y="214" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155">Tail (Flagellum)</text>

              {/* Outer plasma membrane contour */}
              {/* Head */}
              <ellipse
                cx="118"
                cy="125"
                rx="54"
                ry="34"
                fill={selectedSperm === 'nucleus' ? '#bfdbfe' : '#e0f2fe'}
                stroke="#334155"
                strokeWidth="2.2"
                onClick={() => { setSelectedSperm('nucleus'); onExplore(); }}
                className="cursor-pointer"
              />
              {/* Acrosome cap */}
              <path
                d="M 64 125 C 64 98, 96 90, 114 92 C 92 104, 92 146, 114 158 C 96 160, 64 152, 64 125 Z"
                fill={selectedSperm === 'acrosome' ? '#fcd34d' : '#fef3c7'}
                stroke="#b45309"
                strokeWidth="2"
                onClick={() => { setSelectedSperm('acrosome'); onExplore(); }}
                className="cursor-pointer"
              />
              {/* Condensed Haploid Nucleus */}
              <ellipse
                cx="126"
                cy="125"
                rx="32"
                ry="20"
                fill={selectedSperm === 'nucleus' ? '#60a5fa' : '#93c5fd'}
                stroke="#1d4ed8"
                strokeWidth="1.8"
                onClick={() => { setSelectedSperm('nucleus'); onExplore(); }}
                className="cursor-pointer"
              />
              {/* Short Neck + Centriole */}
              <rect
                x="170"
                y="114"
                width="16"
                height="22"
                rx="4"
                fill={selectedSperm === 'neck' ? '#a7f3d0' : '#e2e8f0'}
                stroke="#475569"
                strokeWidth="1.8"
                onClick={() => { setSelectedSperm('neck'); onExplore(); }}
                className="cursor-pointer"
              />
              <circle cx="178" cy="125" r="3.5" fill="#475569" />

              {/* Middle piece + calm spiral mitochondria */}
              <rect
                x="186"
                y="108"
                width="104"
                height="34"
                rx="10"
                fill={selectedSperm === 'midpiece' ? '#bbf7d0' : '#ecfdf5'}
                stroke="#0f766e"
                strokeWidth="2"
                onClick={() => { setSelectedSperm('midpiece'); onExplore(); }}
                className="cursor-pointer"
              />
              {[198, 214, 230, 246, 262, 276].map((mx) => (
                <ellipse key={mx} cx={mx} cy="125" rx="5" ry="12" fill="none" stroke="#0d9488" strokeWidth="1.8" />
              ))}

              {/* Calm static Flagellum Tail */}
              <path
                d="M 290 125 C 345 120, 415 130, 520 124"
                fill="none"
                stroke={selectedSperm === 'tail' ? '#1d4ed8' : '#475569'}
                strokeWidth="5"
                strokeLinecap="round"
                onClick={() => { setSelectedSperm('tail'); onExplore(); }}
                className="cursor-pointer"
              />

              {/* Direct Textbook Leader Lines & Permanent Labels */}
              <line x1="82" y1="98" x2="58" y2="52" stroke="#475569" strokeWidth="1.3" />
              <text x="54" y="46" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0f172a">Acrosome</text>

              <line x1="128" y1="104" x2="146" y2="52" stroke="#475569" strokeWidth="1.3" />
              <text x="150" y="46" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0f172a">Nucleus (n=23)</text>

              <line x1="178" y1="114" x2="205" y2="74" stroke="#475569" strokeWidth="1.3" />
              <text x="215" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Neck</text>

              <line x1="248" y1="108" x2="296" y2="52" stroke="#475569" strokeWidth="1.3" />
              <text x="308" y="46" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0f172a">Mitochondria</text>

              <line x1="420" y1="122" x2="445" y2="78" stroke="#475569" strokeWidth="1.3" />
              <text x="455" y="72" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0f172a">Tail</text>
            </svg>
          ) : (
            <svg
              viewBox="0 0 560 270"
              role="img"
              aria-labelledby="ovum-title ovum-desc"
              className="w-full h-auto min-w-[300px]"
            >
              <title id="ovum-title">Structure of Human Ovum (Figure 17.16)</title>
              <desc id="ovum-desc">
                Calm labelled 2D textbook diagram of a spherical human ovum showing outer follicle cells of corona radiata,
                zona pellucida, perivitelline space, vitelline membrane, yolk-free cytoplasm, and central haploid nucleus.
              </desc>

              {/* Corona Radiata Follicle Cells (calm muted ring of cells) */}
              {Array.from({ length: 18 }, (_, i) => {
                const ang = (i / 18) * Math.PI * 2;
                const fx = 215 + Math.cos(ang) * 96;
                const fy = 135 + Math.sin(ang) * 96;
                return (
                  <circle
                    key={i}
                    cx={fx}
                    cy={fy}
                    r="15"
                    fill={selectedOvum === 'corona' ? '#fde68a' : '#fef9c3'}
                    stroke="#a16207"
                    strokeWidth="1.6"
                    onClick={() => { setSelectedOvum('corona'); onExplore(); }}
                    className="cursor-pointer"
                  />
                );
              })}

              {/* Zona Pellucida */}
              <circle
                cx="215"
                cy="135"
                r="82"
                fill={selectedOvum === 'zona' ? '#fbcfe8' : '#fce7f3'}
                stroke="#be185d"
                strokeWidth="2.5"
                onClick={() => { setSelectedOvum('zona'); onExplore(); }}
                className="cursor-pointer"
              />

              {/* Perivitelline Space */}
              <circle
                cx="215"
                cy="135"
                r="71"
                fill={selectedOvum === 'perivitelline' ? '#e0f2fe' : '#f8fafc'}
                stroke="#94a3b8"
                strokeWidth="1.4"
                strokeDasharray="3 3"
                onClick={() => { setSelectedOvum('perivitelline'); onExplore(); }}
                className="cursor-pointer"
              />

              {/* Vitelline Membrane & Cytoplasm */}
              <circle
                cx="215"
                cy="135"
                r="62"
                fill={selectedOvum === 'cytoplasm' ? '#fed7aa' : '#fff7ed'}
                stroke={selectedOvum === 'vitelline' ? '#0f766e' : '#9a3412'}
                strokeWidth={selectedOvum === 'vitelline' ? 3.5 : 2.2}
                onClick={() => { setSelectedOvum('cytoplasm'); onExplore(); }}
                className="cursor-pointer"
              />

              {/* Haploid Nucleus */}
              <circle
                cx="215"
                cy="135"
                r="24"
                fill={selectedOvum === 'ovum_nucleus' ? '#93c5fd' : '#dbeafe'}
                stroke="#1d4ed8"
                strokeWidth="2.2"
                onClick={() => { setSelectedOvum('ovum_nucleus'); onExplore(); }}
                className="cursor-pointer"
              />
              <circle cx="220" cy="132" r="6" fill="#1e40af" />

              {/* Clean Textbook Right-Side Leader Lines */}
              {[
                { y1: 52, x1: 286, y2: 36, label: 'Corona radiata (Follicle cells)' },
                { y1: 86, x1: 280, y2: 78, label: 'Zona pellucida' },
                { y1: 112, x1: 283, y2: 118, label: 'Perivitelline space' },
                { y1: 138, x1: 277, y2: 158, label: 'Vitelline membrane' },
                { y1: 158, x1: 256, y2: 198, label: 'Cytoplasm (yolk-free)' },
                { y1: 145, x1: 234, y2: 238, label: 'Haploid Nucleus (n = 23)' },
              ].map((l) => (
                <g key={l.label}>
                  <line x1={l.x1} y1={l.y1} x2="352" y2={l.y2} stroke="#475569" strokeWidth="1.4" />
                  <circle cx={l.x1} cy={l.y1} r="2.8" fill="#0f172a" />
                  <text x="360" y={l.y2 + 4} fontSize="11.5" fontWeight="800" fill="#0f172a">
                    {l.label}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>

        {/* Right: Respectful Factual Structure Inspector + Scale Note */}
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)] inline-flex items-center gap-1.5">
            <Microscope className="w-4 h-4" />
            <span>Inspect Textbook Labels (TN Science p. 250)</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {parts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setSelectedId(p.id); onExplore(); }}
                aria-pressed={selectedId === p.id}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border font-bold ${
                  selectedId === p.id
                    ? 'bg-[var(--science)] text-white border-[var(--science)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--science)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1.5">
            <div className="text-sm font-extrabold text-[var(--ink)]">{activePart.label}</div>
            <p className="text-[var(--text)] leading-relaxed">{activePart.desc}</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/25 text-[11px] text-[var(--ink)] leading-relaxed">
            <strong>Microscopic Scale Context:</strong> A human sperm head is ~5 µm wide (total length ~50–60 µm), while a mature human ovum is ~100–120 µm in diameter (roughly 20× wider than the sperm head). Both diagrams are enlarged schematics and are <em>not drawn to literal relative scale</em>.
          </div>
        </div>
      </div>
    </div>
  );
}
