import React, { useMemo, useState } from 'react';
import { Compass, Layers, MapPin } from 'lucide-react';

export type GeoMapRegion = 'india' | 'tamil_nadu' | 'world' | 'europe_asia';

export interface AccurateMapPin {
  id: string;
  label: string;
  sublabel?: string;
  lat: number;
  lon: number;
  category?: string;
  detail: string;
  examFact?: string;
  color?: string;
}

export interface AccurateMapRouteLine {
  id: string;
  label: string;
  points: [number, number][]; // [lat, lon]
  color: string;
  dashed?: boolean;
}

interface AccurateGeoMaps2DProps {
  region: GeoMapRegion;
  title: string;
  subtitle?: string;
  pins: AccurateMapPin[];
  routes?: AccurateMapRouteLine[];
  showRiversToggle?: boolean;
  showMonsoonToggle?: boolean;
  defaultSelectedId?: string;
  onExplore?: () => void;
}

/**
 * Exact Web Mercator projection matching the NASA GIBS raster tiles saved by
 * build_nasa_srtm_tiles.py:
 *  - India (`/textures/earth/india-color.jpg`): lon [65.0, 99.0], lat [5.0, 39.0]
 *  - Tamil Nadu (`/textures/earth/tamilnadu-color.jpg`): lon [74.5, 82.0], lat [7.2, 14.7]
 * And exact Equirectangular projection for World (`/textures/earth/earth-color-4k.jpg`):
 *  - World: lon [-180, 180], lat [-90, 90]
 */
function mercY(latDeg: number): number {
  const rad = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

export function projectLatLonToSvg(
  lat: number,
  lon: number,
  region: GeoMapRegion,
): { x: number; y: number } {
  if (region === 'india') {
    const lonMin = 65.0;
    const lonMax = 99.0;
    const myTop = mercY(39.0);
    const myBot = mercY(5.0);
    const x = ((lon - lonMin) / (lonMax - lonMin)) * 600;
    const y = ((myTop - mercY(lat)) / (myTop - myBot)) * 600;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  }
  if (region === 'tamil_nadu') {
    const lonMin = 74.5;
    const lonMax = 82.0;
    const myTop = mercY(14.7);
    const myBot = mercY(7.2);
    const x = ((lon - lonMin) / (lonMax - lonMin)) * 600;
    const y = ((myTop - mercY(lat)) / (myTop - myBot)) * 600;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  }
  // World Equirectangular (800 x 400 canvas)
  const x = ((lon + 180) / 360) * 800;
  const y = ((90 - lat) / 180) * 400;
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
}

// Accurate GPS polylines for major Indian & Tamil Nadu rivers
const INDIA_RIVERS: AccurateMapRouteLine[] = [
  { id: 'indus', label: 'Indus', color: '#38bdf8', points: [[32.0, 79.0], [34.1, 77.6], [35.4, 75.5], [33.5, 72.0], [29.0, 70.5], [24.0, 67.8]] },
  { id: 'ganga', label: 'Ganga', color: '#0ea5e9', points: [[30.9, 79.0], [29.9, 78.2], [26.5, 80.3], [25.4, 81.8], [25.6, 85.1], [24.8, 87.9], [22.2, 88.2]] },
  { id: 'brahmaputra', label: 'Brahmaputra', color: '#38bdf8', points: [[29.3, 88.8], [29.4, 94.5], [27.5, 95.2], [26.2, 91.7], [24.0, 89.8]] },
  { id: 'narmada', label: 'Narmada (West-flowing)', color: '#7dd3fc', points: [[22.7, 81.7], [22.9, 79.0], [22.2, 76.2], [21.7, 72.8]] },
  { id: 'godavari', label: 'Godavari', color: '#0ea5e9', points: [[19.9, 73.5], [19.1, 77.3], [18.7, 79.9], [16.7, 82.2]] },
  { id: 'krishna', label: 'Krishna', color: '#0ea5e9', points: [[17.9, 73.6], [16.8, 75.7], [16.2, 77.9], [16.0, 81.1]] },
  { id: 'kaveri', label: 'Kaveri', color: '#0284c7', points: [[12.4, 75.5], [12.3, 76.6], [11.8, 77.8], [10.8, 78.7], [11.1, 79.8]] },
];

const TN_RIVERS: AccurateMapRouteLine[] = [
  { id: 'tn_kaveri', label: 'Kaveri', color: '#38bdf8', points: [[12.1, 77.7], [11.8, 77.8], [11.1, 78.0], [10.8, 78.7], [10.8, 79.1], [11.1, 79.85]] },
  { id: 'tn_palar', label: 'Palar', color: '#7dd3fc', points: [[12.9, 78.6], [12.9, 79.1], [12.8, 79.7], [12.46, 80.15]] },
  { id: 'tn_vaigai', label: 'Vaigai', color: '#38bdf8', points: [[9.7, 77.3], [10.0, 77.7], [9.92, 78.12], [9.35, 78.95]] },
  { id: 'tn_thamirabarani', label: 'Thamirabarani (Perennial)', color: '#0ea5e9', points: [[8.68, 77.25], [8.73, 77.7], [8.64, 78.12]] },
];

const INDIA_MONSOON: AccurateMapRouteLine[] = [
  { id: 'sw_arabian', label: 'SW Monsoon (Arabian Branch)', color: '#c084fc', dashed: true, points: [[8.0, 69.0], [12.0, 73.5], [18.5, 73.0], [23.0, 76.0]] },
  { id: 'sw_bay', label: 'SW Monsoon (Bay of Bengal)', color: '#c084fc', dashed: true, points: [[10.0, 86.0], [17.0, 88.5], [23.5, 89.0], [26.0, 84.0]] },
];

const TN_MONSOON: AccurateMapRouteLine[] = [
  { id: 'ne_monsoon', label: 'NE Retreating Monsoon (Oct–Dec)', color: '#f472b6', dashed: true, points: [[14.3, 81.6], [13.1, 80.3], [11.4, 79.8], [9.9, 78.8]] },
];

/**
 * Clean, accurate, zero-WebGL 2D geographic & historical map component backed by
 * real NASA Blue Marble satellite rasters and exact GPS (lat, lon) projections.
 */
export function AccurateGeoMaps2D({
  region,
  title,
  subtitle,
  pins,
  routes = [],
  showRiversToggle = false,
  showMonsoonToggle = false,
  defaultSelectedId,
  onExplore,
}: AccurateGeoMaps2DProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultSelectedId ?? pins[0]?.id ?? '');
  const [showRivers, setShowRivers] = useState(showRiversToggle);
  const [showMonsoon, setShowMonsoon] = useState(false);

  const activePin = useMemo(
    () => pins.find((p) => p.id === selectedId) ?? pins[0],
    [pins, selectedId],
  );

  const isWorldLike = region === 'world' || region === 'europe_asia';
  const imgSrc =
    region === 'india'
      ? '/textures/earth/india-color.jpg'
      : region === 'tamil_nadu'
        ? '/textures/earth/tamilnadu-color.jpg'
        : '/textures/earth/earth-color-4k.jpg';

  // For Europe & Asia historical theatres, crop neatly around Eurasia + North Africa + India
  const viewBox =
    region === 'europe_asia'
      ? '340 42 360 210'
      : isWorldLike
        ? '0 0 800 400'
        : '0 0 600 600';

  const imgW = isWorldLike ? 800 : 600;
  const imgH = isWorldLike ? 400 : 600;
  const pinRadius = region === 'europe_asia' ? 5.5 : isWorldLike ? 8.5 : 10;
  const labelSize = region === 'europe_asia' ? 7.5 : isWorldLike ? 11.5 : 13.5;

  const activeRoutes = useMemo(() => {
    const list: AccurateMapRouteLine[] = [...routes];
    if (showRivers && region === 'india') list.push(...INDIA_RIVERS);
    if (showRivers && region === 'tamil_nadu') list.push(...TN_RIVERS);
    if (showMonsoon && region === 'india') list.push(...INDIA_MONSOON);
    if (showMonsoon && region === 'tamil_nadu') list.push(...TN_MONSOON);
    return list;
  }, [routes, showRivers, showMonsoon, region]);

  const selectPin = (id: string) => {
    setSelectedId(id);
    onExplore?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
      {/* Left: Real NASA Satellite Accurate 2D Interactive Map */}
      <div className="lg:col-span-7 space-y-2.5">
        <div className="rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden shadow-xs relative">
          <div className="px-3.5 py-2 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-200">
            <span className="font-extrabold inline-flex items-center gap-1.5 text-amber-300">
              <Compass className="w-3.5 h-3.5" />
              <span>Accurate 2D Satellite Atlas · {title}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {showRiversToggle && (
                <button
                  type="button"
                  onClick={() => { setShowRivers((v) => !v); onExplore?.(); }}
                  aria-pressed={showRivers}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] ${
                    showRivers ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {showRivers ? '✓ Rivers ON' : 'Show Rivers'}
                </button>
              )}
              {showMonsoonToggle && (
                <button
                  type="button"
                  onClick={() => { setShowMonsoon((v) => !v); onExplore?.(); }}
                  aria-pressed={showMonsoon}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] ${
                    showMonsoon ? 'bg-violet-600 text-white border-violet-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {showMonsoon ? '✓ Monsoon Winds ON' : 'Show Monsoon'}
                </button>
              )}
            </div>
          </div>

          <svg
            viewBox={viewBox}
            role="img"
            aria-label={`Accurate 2D satellite map for ${title}. Click any location pin to inspect.`}
            className="w-full h-auto block max-h-[430px] object-contain bg-[#0b1f38]"
          >
            <image href={imgSrc} x="0" y="0" width={imgW} height={imgH} preserveAspectRatio="none" />

            {/* Subtle dark scrim for crisp pin legibility */}
            <rect x="0" y="0" width={imgW} height={imgH} fill="#020617" opacity="0.16" />

            {/* Rivers, Monsoon Winds & Historical Routes */}
            {activeRoutes.map((rt) => {
              const pts = rt.points
                .map(([lt, ln]) => {
                  const p = projectLatLonToSvg(lt, ln, region);
                  return `${p.x},${p.y}`;
                })
                .join(' ');
              return (
                <polyline
                  key={rt.id}
                  points={pts}
                  fill="none"
                  stroke={rt.color}
                  strokeWidth={region === 'europe_asia' ? 2.4 : 4.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={rt.dashed ? '10 7' : undefined}
                  opacity="0.92"
                />
              );
            })}

            {/* Accurate GPS Clickable Pins */}
            {pins.map((pin) => {
              const pt = projectLatLonToSvg(pin.lat, pin.lon, region);
              const isSelected = activePin?.id === pin.id;
              const fill = pin.color ?? (isSelected ? '#f59e0b' : '#ef4444');
              return (
                <g
                  key={pin.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${pin.label}: ${pin.detail}`}
                  onClick={() => selectPin(pin.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectPin(pin.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pinRadius * 1.9}
                      fill={fill}
                      opacity="0.35"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? pinRadius * 1.25 : pinRadius}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={region === 'europe_asia' ? 1.8 : 2.8}
                  />
                  {/* High-contrast dark pill label */}
                  <rect
                    x={pt.x + pinRadius + 3}
                    y={pt.y - labelSize * 0.85}
                    width={Math.min(170, pin.label.length * (labelSize * 0.56) + 12)}
                    height={labelSize * 1.45}
                    rx={region === 'europe_asia' ? 3 : 5}
                    fill={isSelected ? '#f59e0b' : '#0f172a'}
                    opacity="0.92"
                  />
                  <text
                    x={pt.x + pinRadius + 9}
                    y={pt.y + labelSize * 0.25}
                    fontSize={labelSize}
                    fontWeight="800"
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                  >
                    {pin.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="px-3.5 py-1.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>NASA Blue Marble True-Coastline 2D Projection · Exact GPS Coordinates</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Layers className="w-3 h-3" /> {pins.length} Interactive Locations
            </span>
          </div>
        </div>
      </div>

      {/* Right: Interactive Location Selector + Grounded Historical/Geographical Card */}
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
        <div>
          <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{title}</span>
          </div>
          {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {pins.map((p) => {
            const isSel = activePin?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPin(p.id)}
                aria-pressed={isSel}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors ${
                  isSel
                    ? 'bg-[var(--social)] text-white border-[var(--social)] shadow-xs'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--social)]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {activePin && (
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--social)]">
                {activePin.category ?? activePin.sublabel ?? 'Selected Location'}
              </span>
              <span className="font-mono-tabular text-[10px] text-[var(--text-muted)]">
                {Math.abs(activePin.lat).toFixed(1)}°{activePin.lat >= 0 ? 'N' : 'S'},{' '}
                {Math.abs(activePin.lon).toFixed(1)}°{activePin.lon >= 0 ? 'E' : 'W'}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-[var(--ink)]">{activePin.label}</h4>
            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">{activePin.detail}</p>
            {activePin.examFact && (
              <div className="p-2.5 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/25 text-[11px] font-semibold text-[var(--ink)]">
                <strong>Textbook Exam Point:</strong> {activePin.examFact}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
