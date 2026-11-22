import React, { Suspense, lazy, useState } from 'react';
import { CheckCircle2, Globe2, Layers, Waves } from 'lucide-react';
import type { IndiaDivisionId } from './IndiaRelief3DCanvas';
import type { ModularEngineProps } from './types';

const IndiaRelief3DCanvas = lazy(() => import('./IndiaRelief3DCanvas'));

interface DivisionSpec {
  id: IndiaDivisionId;
  title: string;
  textbookPages: string;
  keyFacts: string[];
  rivers: string;
}

const INDIA_DIVISIONS: DivisionSpec[] = [
  {
    id: 'himalayas',
    title: '1. The Northern Mountains (Himalayas)',
    textbookPages: 'pp. 131–134',
    keyFacts: [
      'Young fold mountains stretching ~2,500 km from Indus Gorge to Brahmaputra Gorge.',
      'Three divisions: Trans-Himalayas (Tibetan), Himalayas (Himadri, Himachal, Siwaliks), and Purvanchal Hills.',
      'Himadri averages 6,000 m height with Mt. Everest (8,848 m) and Kanchenjunga (8,586 m).',
    ],
    rivers: 'Source of perennial Himalayan rivers: Indus, Ganga, and Brahmaputra (fed by snowmelt & rain).',
  },
  {
    id: 'northern_plains',
    title: '2. The Northern Great Plains',
    textbookPages: 'pp. 134–135',
    keyFacts: [
      'Fertile alluvial plain deposited by the Indus, Ganga, and Brahmaputra river systems.',
      'Divided into Rajasthan Plains, Punjab-Haryana Plains, Ganga Plains, and Brahmaputra Plains.',
      'Features Bhabar, Tarai, Bhangar (old alluvium), and Khadar (new fertile alluvium) belts.',
    ],
    rivers: 'Drained by the Ganga (longest river originating in India), Yamuna, and Brahmaputra.',
  },
  {
    id: 'peninsular_plateau',
    title: '3. The Peninsular Plateau',
    textbookPages: 'pp. 135–136',
    keyFacts: [
      'Oldest and largest physiographic division (~16 lakh sq. km), part of ancient Gondwana land.',
      'Bounded by Aravalli (one of the oldest fold ranges), Vindhya-Satpura, Western Ghats, and Eastern Ghats.',
      'Divided by Narmada river into Central Highlands (Malwa/Chotanagpur) and Deccan Plateau.',
    ],
    rivers: 'East-flowing (Mahanadi, Godavari, Krishna, Kaveri → Bay of Bengal) & West-flowing rift rivers (Narmada, Tapti → Arabian Sea).',
  },
  {
    id: 'coastal_plains',
    title: '4. The Coastal Plains',
    textbookPages: 'pp. 136–137',
    keyFacts: [
      'Mainland coastline spans ~6,100 km (7,516.6 km including islands).',
      'Western Coastal Plain (narrow: Konkan, Kanara, Malabar with backwaters/kayals like Vembanad).',
      'Eastern Coastal Plain (wider deltas: Northern Circars & Coromandel Coast, Chilika & Pulicat lakes).',
    ],
    rivers: 'Receives major eastern deltas (Godavari, Krishna, Kaveri) and short swift western streams.',
  },
  {
    id: 'islands',
    title: '5. The Islands',
    textbookPages: 'pp. 137–138',
    keyFacts: [
      'Andaman & Nicobar Islands (Bay of Bengal): volcanic origin, includes Barren Island (active volcano) and Indira Point (6°45′N, southernmost point of India).',
      'Lakshadweep Islands (Arabian Sea): coral origin; capital Kavaratti.',
    ],
    rivers: 'Separated from mainland seas; India and Sri Lanka are separated by the Palk Strait.',
  },
];

export function IndiaRelief3DEngine({
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const prefer2DText = mode === '2d_text';
  const onInteraction = onInteract;
  const [selectedId, setSelectedId] = useState<IndiaDivisionId>('himalayas');
  const [showRivers, setShowRivers] = useState(true);
  const [showMonsoon, setShowMonsoon] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(prefer2DText ? '2d' : '3d');
  const [visited, setVisited] = useState<string[]>(['himalayas']);

  const effectiveMode = prefer2DText ? '2d' : viewMode;
  const active = INDIA_DIVISIONS.find((d) => d.id === selectedId) ?? INDIA_DIVISIONS[0];

  const handleSelect = (id: IndiaDivisionId) => {
    setSelectedId(id);
    onInteract();
    setVisited((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (next.length >= 4) onComplete('India Relief 3D Atlas milestone completed! Explored 4+ physiographic divisions.');
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            GeoMap 2D/3D · Geography Unit 1 (pp. 129–142)
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">
            India — 5 Major Physiographic Divisions &amp; Drainage Systems
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowRivers((r) => !r);
              onInteraction();
            }}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 ${
              showRivers
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{showRivers ? 'Drainage Rivers: ON' : 'Drainage Rivers: OFF'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMonsoon((m) => !m);
              onInteraction();
            }}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 ${
              showMonsoon
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            <span>{showMonsoon ? 'SW Monsoon Winds: ON' : 'SW Monsoon Winds: OFF'}</span>
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
              {effectiveMode === '3d' ? <Layers className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
              <span>{effectiveMode === '3d' ? 'Switch to 2D Table' : 'Switch to 3D Relief'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 space-y-3">
          {effectiveMode === '3d' ? (
            <Suspense
              fallback={
                <div className="h-[340px] rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                  Loading Three.js 3D India Relief Map...
                </div>
              }
            >
              <IndiaRelief3DCanvas
                selectedDivision={selectedId}
                showRivers={showRivers}
                showMonsoon={showMonsoon}
                onSelectDivision={handleSelect}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          ) : (
            <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                2D Structured Physiographic &amp; Drainage Atlas (Not to Scale · No WebGL)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-bold text-[var(--ink)]">Geographic Extent (p. 129–130)</div>
                  <p className="text-[var(--text)] mt-1">
                    8°4′N to 37°6′N · 68°7′E to 97°25′E · Area: 32,87,263 sq. km · Central Meridian (IST): 82°30′E (GMT +5:30).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-bold text-[var(--ink)]">Himalayan vs Peninsular Rivers</div>
                  <p className="text-[var(--text)] mt-1">
                    Himalayan rivers (Indus, Ganga, Brahmaputra) are perennial &amp; snow-fed; Peninsular rivers (Godavari, Krishna, Kaveri) are seasonal &amp; rain-fed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary-tint)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--primary)]">
              <span>Selected Physiographic Division</span>
              <span>Textbook {active.textbookPages}</span>
            </div>
            <div className="text-base font-extrabold text-[var(--ink)]">{active.title}</div>
            <ul className="list-disc pl-4 space-y-1 text-xs text-[var(--text)]">
              {active.keyFacts.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-[var(--ink)] pt-1 border-t border-[var(--line)]">
              Drainage: {active.rivers}
            </p>
          </div>

          <div className="space-y-1.5" role="group" aria-label="Select India physiographic division">
            {INDIA_DIVISIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelect(d.id)}
                className={`w-full text-left px-3.5 py-2.5 min-h-[42px] rounded-xl border text-xs font-bold transition-colors ${
                  selectedId === d.id
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Explored {visited.length} / 4 physiographic divisions</span>
            {visited.length >= 4 && (
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
