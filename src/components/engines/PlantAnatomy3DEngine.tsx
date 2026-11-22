import React, { Suspense, lazy, useState } from 'react';
import { CheckCircle2, Layers, Leaf } from 'lucide-react';
import type { PlantSpecimen } from './PlantAnatomy3DCanvas';
import type { ModularEngineProps } from './types';

const PlantAnatomy3DCanvas = lazy(() => import('./PlantAnatomy3DCanvas'));
const BiologyCell3DCanvas = lazy(() => import('./BiologyCell3DCanvas'));

interface PartNote {
  id: string;
  label: string;
  tissueSystem: string;
  detail: string;
}

const DICOT_ROOT_PARTS: PartNote[] = [
  {
    id: 'epiblema',
    label: 'Epiblema (Piliferous Layer) & Root Hairs',
    tissueSystem: 'Dermal Tissue System (p. 175)',
    detail: 'Outermost single layer without cuticle or stomata; unicellular root hairs absorb water and minerals from soil.',
  },
  {
    id: 'cortex',
    label: 'Cortex (Parenchyma)',
    tissueSystem: 'Ground Tissue System (p. 175)',
    detail: 'Multilayered zone of thin-walled parenchyma cells with intercellular spaces; stores water and food.',
  },
  {
    id: 'endodermis',
    label: 'Endodermis & Casparian Strips',
    tissueSystem: 'Innermost Cortex Layer (p. 175)',
    detail: 'Barrel-shaped cells with suberin Casparian strips; thin-walled passage cells opposite protoxylem guide water into xylem.',
  },
  {
    id: 'pericycle',
    label: 'Pericycle',
    tissueSystem: 'Outer Stele Boundary (p. 175)',
    detail: 'Single layer inside endodermis — the site of origin of lateral roots.',
  },
  {
    id: 'xylem',
    label: 'Tetrarch Radial Xylem (Exarch)',
    tissueSystem: 'Vascular Tissue System (p. 175)',
    detail: 'Four radial arms with protoxylem towards the periphery (exarch); conducts water & minerals upward.',
  },
  {
    id: 'phloem',
    label: 'Alternating Phloem Patches',
    tissueSystem: 'Vascular Tissue System (p. 175)',
    detail: 'Positioned on alternate radii between xylem arms (radial bundle), separated by parenchymatous conjunctive tissue.',
  },
];

const CHLOROPLAST_PARTS: PartNote[] = [
  {
    id: 'envelope',
    label: 'Double Membrane Envelope',
    tissueSystem: 'Organelle Boundary (p. 180)',
    detail: 'Outer and inner selectively permeable membranes separated by an intermembrane space.',
  },
  {
    id: 'stroma',
    label: 'Stroma (Proteinaceous Matrix)',
    tissueSystem: 'Site of Dark Reaction / Calvin Cycle (pp. 180–181)',
    detail: 'Contains enzymes, 70S ribosomes, and circular DNA; reduces CO₂ into glucose using ATP and NADPH₂ without direct light.',
  },
  {
    id: 'grana',
    label: 'Grana (Stacked Thylakoid Discs)',
    tissueSystem: 'Site of Light-Dependent Reaction / Hill Reaction (p. 181)',
    detail: 'Pigment-rich thylakoid stacks holding chlorophyll; trap solar energy to split water (releasing O₂) and generate ATP + NADPH₂.',
  },
  {
    id: 'lamellae',
    label: 'Stroma Lamellae (Fret Channels)',
    tissueSystem: 'Internal Membrane Bridges (p. 180)',
    detail: 'Tubular membrane channels interconnecting adjacent grana stacks inside the chloroplast.',
  },
];

export function PlantAnatomy3DEngine({
  sectionId,
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const prefer2DText = mode === '2d_text';
  const onInteraction = onInteract;
  const defaultSpecimen: PlantSpecimen =
    sectionId.includes('chloroplast') || sectionId.includes('photosynthesis') || sectionId.includes('plastid')
      ? 'chloroplast'
      : 'dicot_root';

  const [specimen, setSpecimen] = useState<PlantSpecimen | 'foliage'>(defaultSpecimen);
  const [selectedPartId, setSelectedPartId] = useState(
    defaultSpecimen === 'dicot_root' ? 'xylem' : 'grana',
  );
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(prefer2DText ? '2d' : '3d');
  const [inspected, setInspected] = useState<string[]>([
    defaultSpecimen === 'dicot_root' ? 'xylem' : 'grana',
  ]);

  const effectiveMode = prefer2DText ? '2d' : viewMode;
  const parts = specimen === 'dicot_root' ? DICOT_ROOT_PARTS : CHLOROPLAST_PARTS;
  const activePart = parts.find((p) => p.id === selectedPartId) ?? parts[0];

  const handleSelectPart = (id: string) => {
    setSelectedPartId(id);
    onInteract();
    setInspected((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (next.length >= 4) onComplete('PlantAnatomy3D milestone completed! Inspected 4+ plant tissue & chloroplast structures.');
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            PlantExplorer 2D/3D · Science Unit 12 (pp. 173–181)
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">
            {specimen === 'dicot_root'
              ? '3D Transverse Section of Dicot Root (Bean)'
              : '3D Cutaway Structure of Chloroplast & Photosynthesis'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSpecimen('dicot_root');
              setSelectedPartId('xylem');
              onInteraction();
            }}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border ${
              specimen === 'dicot_root'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Dicot Root (12.3)
          </button>
          <button
            type="button"
            onClick={() => {
              setSpecimen('chloroplast');
              setSelectedPartId('grana');
              onInteraction();
            }}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border ${
              specimen === 'chloroplast'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Chloroplast (12.9)
          </button>
          <button
            type="button"
            onClick={() => {
              setSpecimen('foliage');
              setSelectedPartId('grana');
              onInteraction();
            }}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border ${
              specimen === 'foliage'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            Real 3D Foliage (Khronos CC0)
          </button>
          {!prefer2DText && (
            <button
              type="button"
              onClick={() => {
                setViewMode((m) => (m === '3d' ? '2d' : '3d'));
                onInteraction();
              }}
              className="px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] inline-flex items-center gap-1.5"
            >
              {effectiveMode === '3d' ? <Layers className="w-3.5 h-3.5" /> : <Leaf className="w-3.5 h-3.5" />}
              <span>{effectiveMode === '3d' ? 'Switch to 2D SVG' : 'Switch to 3D View'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7">
          {effectiveMode === '3d' ? (
            <Suspense
              fallback={
                <div className="h-[330px] rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                  Loading Three.js 3D Plant Explorer...
                </div>
              }
            >
              {specimen === 'foliage' ? (
                <BiologyCell3DCanvas kind="plant_foliage" reducedMotion={reducedMotion} />
              ) : (
                <PlantAnatomy3DCanvas
                  specimen={specimen}
                  selectedPartId={selectedPartId}
                  onSelectPart={handleSelectPart}
                  reducedMotion={reducedMotion}
                />
              )}
            </Suspense>
          ) : (
            <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                2D Interactive Cross-Section (No WebGL Required)
              </div>
              <svg
                viewBox="0 0 420 260"
                className="w-full h-auto rounded-xl bg-[var(--surface)] border border-[var(--line)]"
                role="img"
                aria-label={`2D diagram of ${specimen === 'dicot_root' ? 'Dicot Root' : 'Chloroplast'}`}
              >
                {specimen === 'dicot_root' ? (
                  <>
                    <circle cx="210" cy="130" r="108" fill="#ECFCCB" stroke="#65A30D" strokeWidth="4" onClick={() => handleSelectPart('epiblema')} className="cursor-pointer" />
                    <circle cx="210" cy="130" r="90" fill="#D9F99D" stroke="#84CC16" strokeWidth="2" onClick={() => handleSelectPart('cortex')} className="cursor-pointer" />
                    <circle cx="210" cy="130" r="56" fill="#FEF3C7" stroke="#D97706" strokeWidth="5" onClick={() => handleSelectPart('endodermis')} className="cursor-pointer" />
                    <circle cx="210" cy="130" r="46" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" onClick={() => handleSelectPart('pericycle')} className="cursor-pointer" />
                    <path d="M210 92 L222 118 L248 130 L222 142 L210 168 L198 142 L172 130 L198 118 Z" fill="#DC2626" onClick={() => handleSelectPart('xylem')} className="cursor-pointer" />
                    <circle cx="188" cy="108" r="9" fill="#2563EB" onClick={() => handleSelectPart('phloem')} className="cursor-pointer" />
                    <circle cx="232" cy="108" r="9" fill="#2563EB" onClick={() => handleSelectPart('phloem')} className="cursor-pointer" />
                    <circle cx="188" cy="152" r="9" fill="#2563EB" onClick={() => handleSelectPart('phloem')} className="cursor-pointer" />
                    <circle cx="232" cy="152" r="9" fill="#2563EB" onClick={() => handleSelectPart('phloem')} className="cursor-pointer" />
                    <text x="16" y="24" fontSize="11" fill="#365314" fontWeight="700">Red = Tetrarch Xylem · Blue = Phloem</text>
                    <text x="16" y="42" fontSize="11" fill="#92400E" fontWeight="700">Amber Ring = Endodermis (Casparian Strip)</text>
                  </>
                ) : (
                  <>
                    <ellipse cx="210" cy="130" rx="165" ry="92" fill="#BBF7D0" stroke="#15803D" strokeWidth="6" onClick={() => handleSelectPart('envelope')} className="cursor-pointer" />
                    <ellipse cx="210" cy="130" rx="150" ry="78" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" onClick={() => handleSelectPart('stroma')} className="cursor-pointer" />
                    <line x1="125" y1="130" x2="295" y2="130" stroke="#16A34A" strokeWidth="6" onClick={() => handleSelectPart('lamellae')} className="cursor-pointer" />
                    {[125, 210, 295].map((cx) =>
                      [0, 1, 2, 3].map((row) => (
                        <rect
                          key={`${cx}-${row}`}
                          x={cx - 24}
                          y={95 + row * 18}
                          width="48"
                          height="13"
                          rx="6"
                          fill="#166534"
                          onClick={() => handleSelectPart('grana')}
                          className="cursor-pointer"
                        />
                      )),
                    )}
                    <text x="210" y="244" textAnchor="middle" fontSize="11" fill="#14532D" fontWeight="700">
                      Grana (Light Reaction) · Stroma (Calvin Cycle / Dark Reaction)
                    </text>
                  </>
                )}
              </svg>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary-tint)] space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
              {activePart.tissueSystem}
            </div>
            <div className="text-base font-extrabold text-[var(--ink)]">{activePart.label}</div>
            <p className="text-xs text-[var(--text)] leading-relaxed">{activePart.detail}</p>
          </div>

          <div className="space-y-1.5" role="group" aria-label="Select plant anatomy part">
            {parts.map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => handleSelectPart(part.id)}
                className={`w-full text-left px-3.5 py-2.5 min-h-[42px] rounded-xl border text-xs font-bold transition-colors ${
                  selectedPartId === part.id
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                {part.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Inspected {inspected.length} / 4 structures</span>
            {inspected.length >= 4 && (
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
