import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Map as MapIcon, Play, Sparkles } from 'lucide-react';
import type { UniverseWorldDefinition } from '../../types/universe';
import { UNIVERSE_WORLDS } from '../../data/universeWorlds';

interface WorldConceptIslandMapProps {
  /** Pass a specific world to show its thematic Concept Islands; omit to show the 6-World Universe Map. */
  world?: UniverseWorldDefinition;
}

export function WorldConceptIslandMap({ world }: WorldConceptIslandMapProps) {
  const [selectedId, setSelectedId] = useState<string>(
    world ? world.islands[0]?.id ?? '' : UNIVERSE_WORLDS[0].id,
  );

  // MODE A: Full 6-World Katrio Learning Universe Overview Map
  if (!world) {
    const worldCoords: Record<string, [number, number]> = {
      science: [145, 86],
      mathematics: [350, 74],
      english: [555, 86],
      tamil: [165, 224],
      social_science: [350, 232],
      arcade: [545, 224],
    };
    const bridges: [string, string, string][] = [
      ['science', 'mathematics', 'Formulas & 3D Nets'],
      ['science', 'social_science', 'Environment & Monsoon'],
      ['mathematics', 'arcade', 'Tank Engineering'],
      ['english', 'tamil', 'Translation & Story'],
      ['social_science', 'arcade', 'Civic Budgets'],
    ];
    const activeWorld = UNIVERSE_WORLDS.find((w) => w.id === selectedId) ?? UNIVERSE_WORLDS[0];

    return (
      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
              <MapIcon className="w-4 h-4" />
              <span>Interactive 2D Katrio Universe Map · Zero Heavy 3D Lobby</span>
            </div>
            <h2 className="text-xl font-extrabold text-[var(--ink)]">
              Explore Six Connected Learning Worlds
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Click or Tab to any World island to preview &amp; jump in
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--viewer-bg)] p-3 overflow-hidden">
            <svg
              viewBox="0 0 700 305"
              className="w-full h-auto"
              role="img"
              aria-label="Interactive 2D Universe Map connecting Science, Mathematics, English, Tamil, Social Science, and Cross-Subject Challenge Arcade"
            >
              {/* Subtle connecting pathways */}
              {bridges.map(([a, b, lbl]) => {
                const [x1, y1] = worldCoords[a];
                const [x2, y2] = worldCoords[b];
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                return (
                  <g key={`${a}-${b}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,4" />
                    <rect x={mx - 48} y={my - 9} width="96" height="17" rx="6" fill="#FFFFFF" stroke="#DDE4F0" />
                    <text x={mx} y={my + 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4E5F76">{lbl}</text>
                  </g>
                );
              })}

              {UNIVERSE_WORLDS.map((w) => {
                const [cx, cy] = worldCoords[w.id];
                const isSel = activeWorld.id === w.id;
                return (
                  <g
                    key={w.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(w.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(w.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <rect
                      x={cx - 82}
                      y={cy - 34}
                      width="164"
                      height="68"
                      rx="18"
                      fill={isSel ? w.accentToken : '#FFFFFF'}
                      stroke={w.accentToken}
                      strokeWidth={isSel ? 3 : 2}
                    />
                    <text
                      x={cx}
                      y={cy - 6}
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="800"
                      fill={isSel ? '#FFFFFF' : '#13213A'}
                      lang={w.id === 'tamil' ? 'ta' : undefined}
                      className={w.id === 'tamil' ? 'font-tamil' : ''}
                    >
                      {w.shortTitle}
                    </text>
                    <text
                      x={cx}
                      y={cy + 14}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="700"
                      fill={isSel ? '#FFFFFF' : '#4E5F76'}
                    >
                      {w.islands.length} {w.islands.length === 1 ? 'Capstone Hub' : 'Concept Islands'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{ backgroundColor: activeWorld.tintToken }}
            className="lg:col-span-5 p-5 rounded-2xl border border-[var(--line)] space-y-3.5"
          >
            <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: activeWorld.accentToken }}>
              Selected World
            </div>
            <h3 lang={activeWorld.id === 'tamil' ? 'ta' : undefined} className={`text-xl font-extrabold text-[var(--ink)] ${activeWorld.id === 'tamil' ? 'font-tamil' : ''}`}>
              {activeWorld.worldName}
            </h3>
            <p lang={activeWorld.id === 'tamil' ? 'ta' : undefined} className={`text-sm font-bold text-[var(--ink)] ${activeWorld.id === 'tamil' ? 'font-tamil' : ''}`}>
              {activeWorld.bigQuestion}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
              {activeWorld.signatureAction}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                to={activeWorld.route}
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Enter {activeWorld.shortTitle}</span>
              </Link>
              <Link
                to={activeWorld.featuredPilotRoute}
                className="px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--primary)] text-[var(--ink)] text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[var(--primary)]" />
                <span>Try Featured Quest</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODE B: Subject-Specific Concept Island Map
  const activeIsland = world.islands.find((i) => i.id === selectedId) ?? world.islands[0];

  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5" style={{ color: world.accentToken }}>
          <Sparkles className="w-4 h-4" />
          <span>{world.worldName} · Concept Island Map</span>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          All chapters are directly open below — nothing is locked
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--viewer-bg)] p-3 overflow-hidden">
          <svg
            viewBox="0 0 660 290"
            className="w-full h-auto"
            role="img"
            aria-label={`Concept Island Map for ${world.worldName}`}
          >
            {world.islandConnections.map((conn) => {
              const a = world.islands.find((i) => i.id === conn.from);
              const b = world.islands.find((i) => i.id === conn.to);
              if (!a || !b) return null;
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={world.accentToken} strokeWidth="2.2" strokeDasharray="5,4" opacity="0.6" />
                  <rect x={mx - 62} y={my - 9} width="124" height="17" rx="6" fill="#FFFFFF" stroke="#DDE4F0" />
                  <text x={mx} y={my + 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#35465D">{conn.label}</text>
                </g>
              );
            })}

            {world.islands.map((isl) => {
              const isSel = activeIsland?.id === isl.id;
              return (
                <g
                  key={isl.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(isl.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(isl.id);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={isl.x - 102}
                    y={isl.y - 34}
                    width="204"
                    height="68"
                    rx="18"
                    fill={isSel ? world.accentToken : '#FFFFFF'}
                    stroke={world.accentToken}
                    strokeWidth={isSel ? 3 : 2}
                  />
                  <text
                    x={isl.x}
                    y={isl.y - 4}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight="800"
                    fill={isSel ? '#FFFFFF' : '#13213A'}
                    lang={world.id === 'tamil' ? 'ta' : undefined}
                    className={world.id === 'tamil' ? 'font-tamil' : ''}
                  >
                    {isl.title.length > 26 ? `${isl.title.slice(0, 25)}…` : isl.title}
                  </text>
                  <text
                    x={isl.x}
                    y={isl.y + 15}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill={isSel ? '#FFFFFF' : '#4E5F76'}
                  >
                    {isl.unitIds.length} Chapters · {isl.featuredLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {activeIsland && (
          <div
            style={{ backgroundColor: world.tintToken }}
            className="lg:col-span-5 p-5 rounded-2xl border border-[var(--line)] space-y-3"
          >
            <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: world.accentToken }}>
              Concept Island Spotlight ({activeIsland.unitIds.length} Chapters)
            </div>
            <h3 lang={world.id === 'tamil' ? 'ta' : undefined} className={`text-lg font-extrabold text-[var(--ink)] ${world.id === 'tamil' ? 'font-tamil' : ''}`}>
              {activeIsland.title}
            </h3>
            <p lang={world.id === 'tamil' ? 'ta' : undefined} className={`text-xs sm:text-sm text-[var(--text)] leading-relaxed ${world.id === 'tamil' ? 'font-tamil' : ''}`}>
              {activeIsland.subtitle}
            </p>
            <Link
              to={activeIsland.featuredRoute}
              className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
            >
              <span>Launch {activeIsland.featuredLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
