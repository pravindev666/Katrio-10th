import React, { Suspense, lazy, useState } from 'react';
import { CheckCircle2, Globe2, Info, Layers } from 'lucide-react';
import type { HistoryHotspotId } from './HistoryTheatre3DCanvas';
import type { ModularEngineProps } from './types';

const HistoryTheatre3DCanvas = lazy(() => import('./HistoryTheatre3DCanvas'));

interface WwiTimelineEvent {
  id: string;
  year: string;
  pageRef: string;
  title: string;
  locationId: 'berlin' | 'sarajevo' | 'paris' | 'petrograd' | 'madras' | 'versailles';
  cause: string;
  consequence: string;
  perspectiveNote: string;
}

const WWI_TIMELINE: WwiTimelineEvent[] = [
  {
    id: 'alliances',
    year: '1882–1907',
    pageRef: 'p. 4',
    title: 'Division of Europe into Two Armed Camps',
    locationId: 'berlin',
    cause: 'Imperial competition for markets/colonies, Franco-German hostility after 1871, and naval arms races.',
    consequence: 'Triple Alliance (1882: Germany, Austria-Hungary, Italy) stood opposite Triple Entente (1907: Britain, France, Russia).',
    perspectiveNote: 'Each bloc described its treaties as defensive, yet mutual-aid pledges increased the danger of rapid escalation.',
  },
  {
    id: 'sarajevo',
    year: '28 June 1914',
    pageRef: 'p. 5',
    title: 'Sarajevo Crisis & Outbreak of World War I',
    locationId: 'sarajevo',
    cause: 'Balkan instability after the 1912–13 Balkan Wars and assassination of Archduke Francis Ferdinand in Sarajevo.',
    consequence: 'Austria moved against Serbia; Germany declared war on Russia (1 Aug) and invaded neutral Belgium, bringing Britain into the war.',
    perspectiveNote: 'Historians emphasize Sarajevo was the immediate spark, while imperialism, nationalism, and alliances were deeper causes.',
  },
  {
    id: 'western-front',
    year: '1914–1916',
    pageRef: 'p. 6',
    title: 'Western Front & Trench Warfare (Marne, Verdun, Somme)',
    locationId: 'paris',
    cause: 'German advance toward Paris halted at the Battle of the Marne (Sep 1914), locking both sides into fortified trenches.',
    consequence: 'Enormous loss of life — two million fought at Verdun (1916) and Britain lost 20,000 soldiers on the first day at the Somme.',
    perspectiveNote: 'Industrialized artillery, poison gas, and air raids extended wartime suffering directly to civilian populations.',
  },
  {
    id: 'global-india',
    year: '1914–1917',
    pageRef: 'pp. 7–9',
    title: 'Global Theatres, Sea Blockades & Impact on India',
    locationId: 'madras',
    cause: 'Allied naval dominance cut Central Powers supply lines; Germany replied with cruisers (Emden bombarding Madras) and unrestricted submarine warfare.',
    consequence: 'USA entered the war (Apr 1917) after ships including the Lusitania were sunk; India contributed soldiers, £230M cash, £125M loans, and £250M materials amid grain distress and rising Home Rule politics.',
    perspectiveNote: 'Studying colonial theatres shows why 1914–1918 was a global conflict, not purely a European war.',
  },
  {
    id: 'russia-1917',
    year: '1917–Mar 1918',
    pageRef: 'pp. 6, 9–10',
    title: 'Russian Revolution & Treaty of Brest-Litovsk',
    locationId: 'petrograd',
    cause: 'Severe Eastern Front losses, bread shortages, and autocratic Tsarist rule sparked the March and November 1917 revolutions.',
    consequence: 'Tsar Nicholas II abdicated (15 Mar 1917); Soviet Russia exited the war via the Treaty of Brest-Litovsk (3 Mar 1918).',
    perspectiveNote: 'Tamil poet Bharathiyar welcomed the collapse of Tsarist autocracy in verse (quoted on textbook p. 10).',
  },
  {
    id: 'versailles',
    year: 'Nov 1918 – June 1919',
    pageRef: 'pp. 7–8, 11',
    title: 'Armistice, Treaty of Versailles & League of Nations',
    locationId: 'versailles',
    cause: 'Exhaustion of Central Powers and Allied victory led to the 11 November 1918 armistice and Paris Peace Conference.',
    consequence: 'Signed 28 June 1919: reparations, army cap (100,000), return of Alsace–Lorraine, collapse of three empires, and creation of the League of Nations.',
    perspectiveNote: 'Debates continue among historians over whether the harsh Versailles terms secured peace or fueled interwar resentment.',
  },
];

const CAUSE_EFFECT_PAIRS = [
  {
    id: 'belgium',
    cause: 'Germany violated Belgian neutrality in August 1914 (p. 5)',
    effect: 'Britain formally entered World War I on the Allied side',
  },
  {
    id: 'submarines',
    cause: 'Unrestricted German submarine warfare & sinking of Lusitania (p. 7)',
    effect: 'United States declared war on Germany in April 1917',
  },
  {
    id: 'revolution',
    cause: 'Heavy casualties, bread shortages & Russian Revolution of 1917 (pp. 6, 9)',
    effect: 'Russia withdrew from the war via the Treaty of Brest-Litovsk (Mar 1918)',
  },
  {
    id: 'wilson',
    cause: 'Devastation of 8 million deaths & President Wilson’s Fourteen Points (p. 8)',
    effect: 'Creation of the League of Nations for collective security',
  },
];

export function HistoryTimeMapEngine({
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mapView, setMapView] = useState<'3d' | '2d'>(mode === '2d_text' ? '2d' : '3d');
  const [layers, setLayers] = useState({
    allies: true,
    central: true,
    hotspots: true,
  });

  const handlePinSelect = (hotspotId: HistoryHotspotId) => {
    const idx = WWI_TIMELINE.findIndex((e) => e.locationId === hotspotId);
    if (idx >= 0) {
      setSelectedIdx(idx);
      onInteract();
    }
  };

  // Cause -> Effect matcher state
  const [pickedCause, setPickedCause] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, boolean>>({});
  const [matchStatus, setMatchStatus] = useState<string>('');

  const activeEvent = WWI_TIMELINE[selectedIdx];

  const handleMatchEffect = (effectId: string) => {
    if (!pickedCause) {
      setMatchStatus('Select a historical cause on the left first, then choose its documented consequence.');
      return;
    }
    onInteract();
    if (pickedCause === effectId) {
      const next = { ...matchedPairs, [effectId]: true };
      setMatchedPairs(next);
      setPickedCause(null);
      setMatchStatus('✓ Documented cause-and-consequence link verified.');
      if (CAUSE_EFFECT_PAIRS.every((p) => next[p.id])) {
        onComplete('Completed the WWI chronology, schematic map, and cause-effect evidence check!');
      }
    } else {
      setMatchStatus('Not quite — compare the dates and textbook page notes on the timeline above.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Timeline Selector Ribbon */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--social)]">
            Chronological Turning Points (1882–1919 · History Unit 1)
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            Evidence-based chronology · No trivialized battle scoring
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {WWI_TIMELINE.map((ev, idx) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                onInteract();
              }}
              aria-pressed={selectedIdx === idx}
              className={`px-3 py-2 min-h-[42px] rounded-xl border text-xs sm:text-sm font-bold transition-colors ${selectedIdx === idx
                  ? 'bg-[var(--social)] text-white border-[var(--social)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--social)]'
                }`}
            >
              {ev.year}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive 3D / 2D Theatre Map + Historical Evidence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)]">
        {/* 3D / 2D Strategic Theatre Map */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['allies', 'Allies / Entente'],
                  ['central', 'Central Powers'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
                    onInteract();
                  }}
                  aria-pressed={layers[k]}
                  className={`px-3 py-1.5 min-h-[34px] rounded-lg border text-xs font-bold ${layers[k]
                      ? 'bg-[var(--social)] text-white border-[var(--social)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  {layers[k] ? '✓ ' : ''}
                  {label}
                </button>
              ))}
            </div>
            {mode !== '2d_text' && (
              <button
                type="button"
                onClick={() => setMapView((v) => (v === '3d' ? '2d' : '3d'))}
                className="px-3 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
              >
                {mapView === '3d' ? <Layers className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
                <span>{mapView === '3d' ? '2D Schematic' : '3D Command Map'}</span>
              </button>
            )}
          </div>

          {mapView === '3d' && mode !== '2d_text' ? (
            <Suspense
              fallback={
                <div className="h-[330px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                  Loading 3D Historical Theatre Map...
                </div>
              }
            >
              <HistoryTheatre3DCanvas
                activeHotspot={activeEvent.locationId}
                showAllies={layers.allies}
                showCentral={layers.central}
                onSelectHotspot={handlePinSelect}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          ) : (
            <div className="bg-[var(--surface)] rounded-[16px] border border-[var(--line)] p-3">
              <svg
                viewBox="0 0 420 230"
                className="w-full h-auto"
                role="img"
                aria-label="Schematic 1914 to 1918 World War I alliances and global turning-point map, not to scale, showing Britain, France, Germany, Austria-Hungary, Sarajevo, Russia, Ottoman Empire, and India (Madras)"
              >
                {/* Ocean background */}
                <rect x="0" y="0" width="420" height="230" rx="10" fill="#EFF6FF" />

                {/* Allies / Entente Schematic Regions */}
                {layers.allies && (
                  <g>
                    <rect x="35" y="45" width="54" height="32" rx="8" fill="#2563EB" fillOpacity="0.22" stroke="#1D4ED8" strokeWidth="1.8" />
                    <text x="62" y="65" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontWeight="bold">Britain</text>

                    <rect x="52" y="88" width="60" height="40" rx="8" fill="#2563EB" fillOpacity="0.22" stroke="#1D4ED8" strokeWidth="1.8" />
                    <text x="82" y="112" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontWeight="bold">France</text>

                    <rect x="225" y="28" width="128" height="72" rx="10" fill="#2563EB" fillOpacity="0.18" stroke="#1D4ED8" strokeWidth="1.8" />
                    <text x="289" y="62" textAnchor="middle" fill="#1E3A8A" fontSize="10.5" fontWeight="bold">Russian Empire</text>
                    <text x="289" y="76" textAnchor="middle" fill="#1E40AF" fontSize="8.5">(Exits Mar 1918)</text>

                    <rect x="318" y="138" width="82" height="58" rx="10" fill="#2563EB" fillOpacity="0.18" stroke="#1D4ED8" strokeWidth="1.8" />
                    <text x="359" y="162" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontWeight="bold">British India</text>
                    <text x="359" y="177" textAnchor="middle" fill="#1E40AF" fontSize="8.5">Madras (Emden)</text>
                  </g>
                )}

                {/* Central Powers Schematic Regions */}
                {layers.central && (
                  <g>
                    <rect x="122" y="62" width="76" height="40" rx="8" fill="#B45309" fillOpacity="0.25" stroke="#92400E" strokeWidth="1.8" />
                    <text x="160" y="86" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="bold">Germany</text>

                    <rect x="134" y="108" width="84" height="38" rx="8" fill="#B45309" fillOpacity="0.25" stroke="#92400E" strokeWidth="1.8" />
                    <text x="176" y="131" textAnchor="middle" fill="#78350F" fontSize="9.5" fontWeight="bold">Austria-Hungary</text>

                    <rect x="218" y="138" width="78" height="42" rx="8" fill="#B45309" fillOpacity="0.22" stroke="#92400E" strokeWidth="1.8" />
                    <text x="257" y="162" textAnchor="middle" fill="#78350F" fontSize="9.5" fontWeight="bold">Ottoman Emp.</text>
                  </g>
                )}

                {/* Highlighted Active Hotspot Pins */}
                {layers.hotspots && (
                  <g>
                    {[
                      { id: 'berlin', x: 158, y: 74, label: 'Berlin' },
                      { id: 'paris', x: 96, y: 102, label: 'Marne/Verdun' },
                      { id: 'versailles', x: 80, y: 118, label: 'Versailles' },
                      { id: 'sarajevo', x: 185, y: 142, label: 'Sarajevo' },
                      { id: 'petrograd', x: 252, y: 46, label: 'Petrograd' },
                      { id: 'madras', x: 355, y: 184, label: 'Madras' },
                    ].map((pin) => {
                      const isActive = activeEvent.locationId === pin.id;
                      return (
                        <g key={pin.id}>
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={isActive ? 9 : 5}
                            fill={isActive ? '#C35243' : '#13213A'}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                          {isActive && (
                            <text
                              x={pin.x}
                              y={pin.y - 13}
                              textAnchor="middle"
                              fill="#991B1B"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              ★ {pin.label}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Explicit Cartographic Honesty Legend */}
                <text x="12" y="218" fill="#475569" fontSize="9.5" fontWeight="bold">
                  Schematic Theatre Diagram (1914–1918) · NOT TO SCALE · Blue: Allies/Entente · Amber: Central Powers
                </text>
              </svg>
            </div>
          )}
        </div>

        {/* Active Historical Evidence Card */}
        <div className="lg:col-span-5 p-5 rounded-[16px] bg-[var(--surface)] border border-[var(--line)] space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular font-bold text-[var(--social)]">
            <span>{activeEvent.year}</span>
            <span>Textbook {activeEvent.pageRef}</span>
          </div>
          <h4 className="text-lg font-extrabold text-[var(--ink)]">{activeEvent.title}</h4>
          <p className="text-[var(--text)] leading-relaxed">
            <strong className="text-[var(--ink)]">Documented Causes:</strong> {activeEvent.cause}
          </p>
          <p className="text-[var(--text)] leading-relaxed">
            <strong className="text-[var(--ink)]">Historical Consequences:</strong>{' '}
            {activeEvent.consequence}
          </p>
          <div className="p-3 rounded-xl bg-[var(--social-tint)] border border-[var(--social)]/25 text-xs text-[var(--ink)] flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--social)] shrink-0 mt-0.5" />
            <span>
              <strong>Historical Interpretation Note:</strong> {activeEvent.perspectiveNote}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={selectedIdx === 0}
              onClick={() => {
                setSelectedIdx((i) => Math.max(0, i - 1));
                onInteract();
              }}
              className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold disabled:opacity-35"
            >
              ← Earlier Event
            </button>
            <button
              type="button"
              disabled={selectedIdx === WWI_TIMELINE.length - 1}
              onClick={() => {
                setSelectedIdx((i) => Math.min(WWI_TIMELINE.length - 1, i + 1));
                onInteract();
              }}
              className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[var(--social)] text-white text-xs font-bold disabled:opacity-35"
            >
              Next Event →
            </button>
          </div>
        </div>
      </div>

      {/* Cause -> Consequence Interactive Evidence Matcher */}
      <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--social)]">
            Cause &amp; Consequence Evidence Check
          </div>
          <h4 className="text-base font-extrabold text-[var(--ink)]">
            Link each documented cause (left) to its historical consequence (right)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {CAUSE_EFFECT_PAIRS.map((p) => {
              const done = matchedPairs[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={done}
                  onClick={() => setPickedCause(p.id)}
                  aria-pressed={pickedCause === p.id}
                  className={`w-full p-3.5 min-h-[44px] rounded-xl border text-left text-xs sm:text-sm font-bold transition-colors ${done
                      ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--success)]'
                      : pickedCause === p.id
                        ? 'bg-[var(--social)] text-white border-[var(--social)]'
                        : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--social)]'
                    }`}
                >
                  {done ? '✓ ' : ''}
                  {p.cause}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {[CAUSE_EFFECT_PAIRS[2], CAUSE_EFFECT_PAIRS[0], CAUSE_EFFECT_PAIRS[3], CAUSE_EFFECT_PAIRS[1]].map(
              (p) => {
                const done = matchedPairs[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={done}
                    onClick={() => handleMatchEffect(p.id)}
                    className={`w-full p-3.5 min-h-[44px] rounded-xl border text-left text-xs sm:text-sm transition-colors ${done
                        ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)] font-semibold'
                        : 'bg-[var(--surface-subtle)] text-[var(--text)] border-[var(--line)] hover:border-[var(--social)]'
                      }`}
                  >
                    {p.effect}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {matchStatus && (
          <div role="status" className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs sm:text-sm font-semibold text-[var(--ink)]">
            {matchStatus}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onComplete('Reviewed WWI TimeMap chronology and cause-consequence chains!')}
            className="px-4 py-2 min-h-[42px] rounded-xl bg-[var(--success)] text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark timeline review complete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
