import React, { Suspense, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw, ShieldAlert } from 'lucide-react';
import {
  DOUBLE_CIRCULATION_PATHWAY,
  validateCirculationSequence,
} from '../../utils/heartCirculation';
import type { ModularEngineProps } from './types';

const LazyModelExplorer3DCanvas = React.lazy(() => import('./ModelExplorer3DCanvas'));

interface HeartPartSpec {
  id: string;
  label: string;
  side: "Patient's Right (Viewer Left)" | "Patient's Left (Viewer Right)" | 'Midline / Valves';
  oxygenation: 'Deoxygenated (Low O₂)' | 'Oxygenated (High O₂)' | 'Muscular Partition / One-way Flap';
  detail: string;
}

const HEART_PARTS_2D: HeartPartSpec[] = [
  {
    id: 'venaCava',
    label: 'Superior & Inferior Vena Cava',
    side: "Patient's Right (Viewer Left)",
    oxygenation: 'Deoxygenated (Low O₂)',
    detail: 'Major systemic veins returning deoxygenated blood from body tissues into the Right Atrium (p. 207).',
  },
  {
    id: 'rightAtrium',
    label: 'Right Atrium (Upper Right Chamber)',
    side: "Patient's Right (Viewer Left)",
    oxygenation: 'Deoxygenated (Low O₂)',
    detail: 'Thin-walled upper chamber housing the SA node (natural pacemaker) near the superior vena cava opening (pp. 207, 209).',
  },
  {
    id: 'tricuspid',
    label: 'Tricuspid Valve (Right AV Valve)',
    side: 'Midline / Valves',
    oxygenation: 'Muscular Partition / One-way Flap',
    detail: 'Three leaf-like flaps anchored by chordae tendineae to papillary muscles; prevents backflow into the Right Atrium (p. 208).',
  },
  {
    id: 'rightVentricle',
    label: 'Right Ventricle (Pulmonary Pump)',
    side: "Patient's Right (Viewer Left)",
    oxygenation: 'Deoxygenated (Low O₂)',
    detail: 'Pumps deoxygenated blood through the pulmonary semilunar valve into the pulmonary trunk toward both lungs (p. 208).',
  },
  {
    id: 'pulmonaryArtery',
    label: 'Pulmonary Trunk & Arteries',
    side: "Patient's Right (Viewer Left)",
    oxygenation: 'Deoxygenated (Low O₂)',
    detail: 'Arises from Right Ventricle and bifurcates to carry deoxygenated blood to left and right lungs for gas exchange (p. 208).',
  },
  {
    id: 'pulmonaryVein',
    label: 'Pulmonary Veins',
    side: "Patient's Left (Viewer Right)",
    oxygenation: 'Oxygenated (High O₂)',
    detail: 'Bring freshly oxygenated blood from the lungs into the Left Atrium (p. 207).',
  },
  {
    id: 'leftAtrium',
    label: 'Left Atrium (Upper Left Chamber)',
    side: "Patient's Left (Viewer Right)",
    oxygenation: 'Oxygenated (High O₂)',
    detail: 'Receives oxygen-rich blood from the pulmonary veins and pushes it through the bicuspid valve (p. 207).',
  },
  {
    id: 'bicuspid',
    label: 'Bicuspid / Mitral Valve (Left AV Valve)',
    side: 'Midline / Valves',
    oxygenation: 'Muscular Partition / One-way Flap',
    detail: 'Two-cusp one-way valve between Left Atrium and Left Ventricle; closes with tricuspid valve to produce LUBB (pp. 208, 210).',
  },
  {
    id: 'leftVentricle',
    label: 'Left Ventricle (Main Systemic Pump)',
    side: "Patient's Left (Viewer Right)",
    oxygenation: 'Oxygenated (High O₂)',
    detail: 'Muscular wall is ~3× thicker than Right Ventricle to pump oxygenated blood at high pressure into the Aorta (p. 208).',
  },
  {
    id: 'aorta',
    label: 'Aortic Arch & Semilunar Valve',
    side: "Patient's Left (Viewer Right)",
    oxygenation: 'Oxygenated (High O₂)',
    detail: 'Largest systemic artery supplying oxygenated blood to body organs; coronary arteries branch from its base (p. 208).',
  },
  {
    id: 'septum',
    label: 'Interatrial & Interventricular Septum',
    side: 'Midline / Valves',
    oxygenation: 'Muscular Partition / One-way Flap',
    detail: 'Muscular partition keeping oxygenated and deoxygenated blood completely separate during double circulation (p. 207).',
  },
];

const INITIAL_SCRAMBLED_IDS = [
  'pulmonary-vein-la',
  'vena-cava-ra',
  'aortic-valve-aorta',
  'tricuspid-rv',
  'bicuspid-lv',
  'pulmonary-artery-lungs',
];

export function HeartCirculationEngine({
  sectionId,
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const [cutaway, setCutaway] = useState(40);
  const [layer, setLayer] = useState<'all' | 'chambers' | 'vessels' | 'valves'>('all');
  const [flowPaused, setFlowPaused] = useState(false);
  const [show3DCanvas, setShow3DCanvas] = useState(mode !== '2d_text');
  useEffect(() => {
    setShow3DCanvas(mode !== '2d_text');
  }, [mode]);
  const [selectedPart, setSelectedPart] = useState<HeartPartSpec>(HEART_PARTS_2D[8]); // Left Ventricle
  const [activeTab, setActiveTab] = useState<'anatomy' | 'sequence'>('anatomy');

  // Circulation sequence puzzle state
  const [orderedIds, setOrderedIds] = useState<string[]>(INITIAL_SCRAMBLED_IDS);
  const [sequenceChecked, setSequenceChecked] = useState(false);
  const seqValidation = validateCirculationSequence(orderedIds);

  const moveItem = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[index], next[target]] = [next[target], next[index]];
    setOrderedIds(next);
    setSequenceChecked(false);
    onInteract();
  };

  const handleCheckSequence = () => {
    setSequenceChecked(true);
    onInteract();
    if (seqValidation.isExactOrder) {
      onComplete('Double circulation pathway (Vena Cava → Lungs → Aorta) verified in exact order!');
    }
  };

  const handleReset = () => {
    setCutaway(40);
    setLayer('all');
    setFlowPaused(false);
    setSelectedPart(HEART_PARTS_2D[8]);
    setOrderedIds(INITIAL_SCRAMBLED_IDS);
    setSequenceChecked(false);
  };

  const use2DVisual = mode === '2d_text' || !show3DCanvas;

  return (
    <div className="space-y-5">
      {/* Sub-mode switcher + Orientation & Convention Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Heart explorer activity mode"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]"
        >
          <button
            type="button"
            onClick={() => setActiveTab('anatomy')}
            aria-pressed={activeTab === 'anatomy'}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'anatomy'
                ? 'bg-[var(--science)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
            }`}
          >
            1. Inspect Cutaway &amp; Valves
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sequence')}
            aria-pressed={activeTab === 'sequence'}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'sequence'
                ? 'bg-[var(--science)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
            }`}
          >
            2. Trace Blood-Flow Sequence
          </button>
        </div>

        {activeTab === 'anatomy' && mode !== '2d_text' && (
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShow3DCanvas((prev) => !prev);
                onInteract();
              }}
              aria-pressed={!use2DVisual}
              className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)] hover:border-[var(--science)]"
            >
              {use2DVisual ? 'Load 3D Cutaway (WebGL)' : 'Switch to Interactive 2D SVG'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Explicit Anatomical Orientation & Colour Legend (Never colour alone!) */}
      <div className="p-3.5 rounded-[14px] bg-[var(--surface-subtle)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold text-[var(--ink)]">
            <span className="w-3 h-3 rounded-full bg-[#2B6CB0] inline-block" aria-hidden="true" />
            <span>Blue convention = Deoxygenated blood (Right Heart → Lungs)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-[var(--ink)]">
            <span className="w-3 h-3 rounded-full bg-[#C83E4D] inline-block" aria-hidden="true" />
            <span>Red convention = Oxygenated blood (Lungs → Left Heart → Body)</span>
          </span>
        </div>
        <span className="font-semibold text-[var(--text-muted)]">
          Anatomical orientation: Patient&apos;s Right is on Viewer&apos;s Left
        </span>
      </div>

      {activeTab === 'anatomy' && (
        <div className="space-y-4">
          {!use2DVisual ? (
            <>
              <Suspense
                fallback={
                  <div className="h-[380px] rounded-[20px] bg-[#EDF1F8] flex items-center justify-center text-base font-bold text-[#13213A]">
                    Loading 3D Anatomical Heart Cutaway...
                  </div>
                }
              >
                <LazyModelExplorer3DCanvas
                  cutawayAmount={cutaway}
                  selectedLayer={layer}
                  flowPaused={flowPaused}
                  reducedMotion={reducedMotion}
                  onUserInteract={onInteract}
                  onSelectPart={(name, detail) => {
                    onInteract();
                    const found = HEART_PARTS_2D.find((p) =>
                      name.toLowerCase().includes(p.label.split(' ')[0].toLowerCase()),
                    );
                    setSelectedPart(
                      found ?? {
                        id: 'custom',
                        label: name,
                        side: 'Midline / Valves',
                        oxygenation: 'Muscular Partition / One-way Flap',
                        detail,
                      },
                    );
                  }}
                />
              </Suspense>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-[16px] bg-[var(--surface-subtle)] border border-[var(--line)]">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`cutaway-${sectionId}`}
                    className="block text-sm font-bold text-[var(--ink)]"
                  >
                    Anterior Cutaway Wall: {cutaway}%
                  </label>
                  <input
                    id={`cutaway-${sectionId}`}
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={cutaway}
                    onChange={(e) => {
                      setCutaway(Number(e.target.value));
                      onInteract();
                    }}
                    className="w-full accent-[var(--science)] min-h-[36px]"
                  />
                  <p className="text-xs text-[var(--text-muted)]">
                    Slide right to open the non-graphic cross-section and inspect chambers &amp; septum.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-sm font-bold text-[var(--ink)]">
                    Isolate anatomical layer:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'chambers', 'vessels', 'valves'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setLayer(l);
                          onInteract();
                        }}
                        aria-pressed={layer === l}
                        className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold capitalize transition-colors ${
                          layer === l
                            ? 'bg-[var(--science)] text-white'
                            : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-sm font-bold text-[var(--ink)]">
                    Blood-flow animation:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFlowPaused((p) => !p);
                        onInteract();
                      }}
                      className="px-3.5 py-1.5 min-h-[38px] rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
                    >
                      {flowPaused ? '▶ Resume Flow' : '⏸ Pause Flow'}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Cardiac cycle: 0.8 s (Atrial systole 0.1 s · Ventricular 0.3 s · Diastole 0.4 s)
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Full Interactive 2D SVG Anatomical Cutaway — identical teaching power without WebGL */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-5 rounded-[20px] border border-[var(--line)] bg-[var(--viewer-bg)]">
              <div className="lg:col-span-7 bg-[var(--surface)] rounded-[16px] border border-[var(--line)] p-4 flex flex-col items-center justify-center">
                <svg
                  viewBox="0 0 460 360"
                  className="w-full max-w-[440px] h-auto"
                  role="img"
                  aria-label="Interactive 2D anatomical cross-section of the human heart showing Superior and Inferior Vena Cava, Right Atrium, Tricuspid Valve, Right Ventricle, Pulmonary Artery, Pulmonary Veins, Left Atrium, Bicuspid Valve, Left Ventricle, Aorta, and Septum"
                >
                  {/* Orientation indicators */}
                  <text x="16" y="20" fill="var(--text-muted)" fontSize="11" fontWeight="bold">
                    PATIENT&apos;S RIGHT (Deoxygenated)
                  </text>
                  <text x="262" y="20" fill="var(--text-muted)" fontSize="11" fontWeight="bold">
                    PATIENT&apos;S LEFT (Oxygenated)
                  </text>

                  {/* Superior & Inferior Vena Cava */}
                  <path
                    d="M112,35 L112,112 M112,248 L112,330"
                    stroke="#2B6CB0"
                    strokeWidth="22"
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[0]);
                      onInteract();
                    }}
                  />
                  {/* Aortic Arch */}
                  <path
                    d="M250,150 C250,45 335,45 340,115 L340,320"
                    fill="none"
                    stroke="#C83E4D"
                    strokeWidth="22"
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[9]);
                      onInteract();
                    }}
                  />
                  {/* Pulmonary Trunk */}
                  <path
                    d="M202,165 C202,95 160,82 145,70 M202,110 C225,85 270,82 300,78"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="16"
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[4]);
                      onInteract();
                    }}
                  />
                  {/* Pulmonary Veins */}
                  <path
                    d="M360,130 L420,120 M360,152 L420,158"
                    stroke="#DC2626"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[5]);
                      onInteract();
                    }}
                  />

                  {/* Outer Myocardium Silhouette */}
                  <path
                    d="M95,120 C75,180 105,310 230,332 C355,310 385,180 355,115 C325,85 130,85 95,120 Z"
                    fill="#FDE8EA"
                    stroke="#9F1239"
                    strokeWidth="3"
                  />

                  {/* Right Atrium */}
                  <ellipse
                    cx="152"
                    cy="152"
                    rx="44"
                    ry="36"
                    fill={selectedPart.id === 'rightAtrium' ? '#1D4ED8' : '#3B82F6'}
                    stroke="#1E3A8A"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[1]);
                      onInteract();
                    }}
                  />
                  <text x="122" y="150" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Right Atrium
                  </text>
                  <text x="132" y="164" fill="#DBEAFE" fontSize="9">
                    (SA Node)
                  </text>

                  {/* Right Ventricle */}
                  <path
                    d="M118,200 L212,200 L212,300 C162,292 126,252 118,200 Z"
                    fill={selectedPart.id === 'rightVentricle' ? '#1D4ED8' : '#2563EB'}
                    stroke="#1E3A8A"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[3]);
                      onInteract();
                    }}
                  />
                  <text x="142" y="246" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Right
                  </text>
                  <text x="136" y="261" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Ventricle
                  </text>

                  {/* Left Atrium */}
                  <ellipse
                    cx="306"
                    cy="150"
                    rx="42"
                    ry="34"
                    fill={selectedPart.id === 'leftAtrium' ? '#991B1B' : '#DC2626'}
                    stroke="#7F1D1D"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[6]);
                      onInteract();
                    }}
                  />
                  <text x="278" y="154" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Left Atrium
                  </text>

                  {/* Left Ventricle (visibly thicker outer wall!) */}
                  <path
                    d="M242,200 L338,200 C332,262 292,302 242,308 Z"
                    fill={selectedPart.id === 'leftVentricle' ? '#991B1B' : '#C83E4D'}
                    stroke="#7F1D1D"
                    strokeWidth="9"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[8]);
                      onInteract();
                    }}
                  />
                  <text x="262" y="245" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Left Ventricle
                  </text>
                  <text x="260" y="260" fill="#FEE2E2" fontSize="9.5">
                    (3× thicker wall)
                  </text>

                  {/* Septum */}
                  <rect
                    x="217"
                    y="125"
                    width="20"
                    height="190"
                    rx="8"
                    fill={selectedPart.id === 'septum' ? '#334155' : '#94A3B8'}
                    stroke="#1E293B"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[10]);
                      onInteract();
                    }}
                  />
                  <text
                    x="227"
                    y="235"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform="rotate(-90 227 235)"
                  >
                    SEPTUM
                  </text>

                  {/* Tricuspid & Bicuspid Valve Markers */}
                  <rect
                    x="138"
                    y="191"
                    width="56"
                    height="12"
                    rx="6"
                    fill="#FDE047"
                    stroke="#854D0E"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[2]);
                      onInteract();
                    }}
                  />
                  <rect
                    x="266"
                    y="191"
                    width="56"
                    height="12"
                    rx="6"
                    fill="#FDE047"
                    stroke="#854D0E"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPart(HEART_PARTS_2D[7]);
                      onInteract();
                    }}
                  />

                  {/* Labels */}
                  <text x="45" y="64" fill="#1E3A8A" fontSize="10" fontWeight="bold">
                    Vena Cava
                  </text>
                  <text x="128" y="58" fill="#1E40AF" fontSize="10" fontWeight="bold">
                    Pulm. Artery
                  </text>
                  <text x="278" y="45" fill="#991B1B" fontSize="10.5" fontWeight="bold">
                    Aortic Arch
                  </text>
                  <text x="366" y="114" fill="#991B1B" fontSize="10" fontWeight="bold">
                    Pulm. Veins
                  </text>
                  <text x="16" y="350" fill="var(--text-muted)" fontSize="10">
                    Click any chamber, vessel, or yellow valve (or use the structure buttons right)
                  </text>
                </svg>
              </div>

              {/* Keyboard-Accessible Structure Selector */}
              <div className="lg:col-span-5 space-y-2.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--science)]">
                  Select a Structure (Keyboard &amp; Screen-Reader Parity)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
                  {HEART_PARTS_2D.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        setSelectedPart(part);
                        onInteract();
                      }}
                      aria-pressed={selectedPart.id === part.id}
                      className={`px-3 py-2 min-h-[40px] rounded-xl border text-left text-xs font-bold transition-colors ${
                        selectedPart.id === part.id
                          ? 'bg-[var(--science)] text-white border-[var(--science)]'
                          : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--science)]'
                      }`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Anatomical Detail Panel */}
          <div className="p-4 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] space-y-1.5 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--science-tint)] text-[var(--science)]">
                {selectedPart.side}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--line)]">
                {selectedPart.oxygenation}
              </span>
            </div>
            <p className="font-extrabold text-[var(--ink)] text-base">{selectedPart.label}</p>
            <p className="text-[var(--text)] leading-relaxed">{selectedPart.detail}</p>
          </div>
        </div>
      )}

      {activeTab === 'sequence' && (
        <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-extrabold text-[var(--ink)]">
              Order the 6 Stations of Human Double Circulation
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text)]">
              Use the Up (↑) and Down (↓) buttons to arrange blood flow starting from body tissues
              entering the Vena Cava and ending as oxygenated blood leaves through the Aorta.
            </p>
          </div>

          <ol className="space-y-2.5">
            {orderedIds.map((id, idx) => {
              const station = DOUBLE_CIRCULATION_PATHWAY.find((s) => s.id === id)!;
              const isInRightSpot = sequenceChecked && station.order === idx + 1;
              const isWrongSpot = sequenceChecked && station.order !== idx + 1;
              return (
                <li
                  key={id}
                  className={`p-3.5 rounded-xl border bg-[var(--surface)] flex items-center justify-between gap-3 ${
                    isInRightSpot
                      ? 'border-[var(--success)] bg-[var(--success-bg)]/40'
                      : isWrongSpot
                      ? 'border-[var(--warning)] bg-[var(--warning-bg)]/50'
                      : 'border-[var(--line)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-extrabold text-[var(--ink)] inline-flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-sm font-extrabold text-[var(--ink)]">
                        {station.structure}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {station.circuit} · {station.oxygenation}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, -1)}
                      aria-label={`Move "${station.structure}" earlier`}
                      className="min-w-[38px] min-h-[38px] rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--science)] inline-flex items-center justify-center disabled:opacity-35"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === orderedIds.length - 1}
                      onClick={() => moveItem(idx, 1)}
                      aria-label={`Move "${station.structure}" later`}
                      className="min-w-[38px] min-h-[38px] rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--science)] inline-flex items-center justify-center disabled:opacity-35"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleCheckSequence}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[var(--science)] text-white text-sm font-bold inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Circulation Order</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderedIds(INITIAL_SCRAMBLED_IDS);
                setSequenceChecked(false);
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-sm font-semibold text-[var(--ink)]"
            >
              Scramble again
            </button>
          </div>

          {sequenceChecked && (
            <div
              role="status"
              className={`p-4 rounded-xl border text-sm ${
                seqValidation.isExactOrder
                  ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
                  : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'
              }`}
            >
              {seqValidation.isExactOrder ? (
                <p className="font-bold">
                  ✓ Perfect! All 6 stations of double circulation are in exact physiological order
                  (Right Atrium → Tricuspid → Right Ventricle → Lungs → Left Atrium → Bicuspid →
                  Left Ventricle → Aorta).
                </p>
              ) : (
                <p>
                  <strong>
                    {seqValidation.correctCount} of 6 stations in exact position.
                  </strong>{' '}
                  Check station #{(seqValidation.firstMismatchIndex ?? 0) + 1} — remember: blood
                  enters the <strong>Right Atrium</strong> from the Vena Cava first, goes to the
                  lungs for gas exchange, and returns to the <strong>Left Atrium</strong> before
                  leaving through the Aorta.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Honest Model Scope & Provenance Note */}
      <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs text-[var(--text-muted)] flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-[var(--science)] shrink-0 mt-0.5" />
        <span>
          <strong>Educational Model Provenance:</strong> Conceptual schematic aligned to TN Class 10
          Science (2024 Reprint, pp. 207–210). Non-graphic cutaway only; not surgical instruction.
        </span>
      </div>
    </div>
  );
}
