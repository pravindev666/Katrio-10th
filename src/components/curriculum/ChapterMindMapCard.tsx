import React, { useState } from 'react';
import { Brain, Lightbulb, Sparkles } from 'lucide-react';
import { getChapterMindMap } from '../../data/chapterMindMaps';

interface ChapterMindMapCardProps {
  unitId: string;
  unitTitle: string;
  isTamil?: boolean;
}

/**
 * Interactive Visual Radial Mind Map + Exam Memory Trick Studio for ALL 72 Chapters.
 * Students click any color-coded branch around the central chapter hub to review key facts & exam cues.
 */
export function ChapterMindMapCard({ unitId, unitTitle, isTamil = false }: ChapterMindMapCardProps) {
  const map = getChapterMindMap(unitId);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeBranch = map.branches[selectedIdx] ?? map.branches[0];

  // Coordinates for the 4 radial mind-map branch nodes around center (220, 125)
  const nodeCoords: [number, number][] = [
    [76, 46],
    [364, 46],
    [76, 204],
    [364, 204],
  ];

  return (
    <div
      lang={isTamil ? 'ta' : undefined}
      className={`rounded-[22px] border border-[var(--primary)]/30 bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)] ${isTamil ? 'font-tamil' : ''}`}
    >
      {/* Header + Mnemonic Memory Trick Strip */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>Interactive Chapter Mind Map &amp; Fast Memory Studio</span>
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">{unitTitle}</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-[var(--primary-tint)] border border-[var(--primary)]/25 text-[11px] font-bold text-[var(--primary)]">
          Click any mind-map branch to memorize
        </span>
      </div>

      {/* Memory Trick / Mnemonic Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--ink)]">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-700 dark:text-amber-300">Memory Trick: </strong>
            <span className="font-semibold">{map.mnemonic}</span>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[11px] font-extrabold text-[var(--primary)] font-mono-tabular shrink-0">
          {map.formulaOrKeyFact}
        </div>
      </div>

      {/* Visual Radial Mind Map SVG + Selected Branch Deep-Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-slate-950 p-3 overflow-hidden">
          <svg
            viewBox="0 0 440 250"
            className="w-full h-[230px] sm:h-[250px]"
            role="img"
            aria-label={`Interactive radial mind map for ${map.centralNode}`}
          >
            {/* Curved Mind Map Connectors */}
            {map.branches.slice(0, 4).map((b, i) => {
              const [nx, ny] = nodeCoords[i];
              const isSel = selectedIdx === i;
              const cx = (220 + nx) / 2;
              return (
                <path
                  key={`link-${b.title}`}
                  d={`M 220 125 Q ${cx} 125, ${nx} ${ny}`}
                  fill="none"
                  stroke={b.color}
                  strokeWidth={isSel ? 4.5 : 2.2}
                  strokeOpacity={isSel ? 1 : 0.5}
                />
              );
            })}

            {/* Central Hub Node */}
            <rect
              x="146"
              y="98"
              width="148"
              height="54"
              rx="16"
              fill="#1e293b"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text x="220" y="121" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="700">
              CHAPTER HUB
            </text>
            <text x="220" y="138" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="800">
              {map.centralNode.length > 22 ? `${map.centralNode.slice(0, 21)}…` : map.centralNode}
            </text>

            {/* 4 Clickable Branch Nodes */}
            {map.branches.slice(0, 4).map((b, i) => {
              const [nx, ny] = nodeCoords[i];
              const isSel = selectedIdx === i;
              return (
                <g
                  key={b.title}
                  onClick={() => setSelectedIdx(i)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedIdx(i);
                    }
                  }}
                >
                  <rect
                    x={nx - 68}
                    y={ny - 24}
                    width="136"
                    height="48"
                    rx="14"
                    fill={isSel ? b.color : '#0f172a'}
                    stroke={b.color}
                    strokeWidth={isSel ? 3 : 1.8}
                  />
                  <text
                    x={nx}
                    y={ny - 4}
                    textAnchor="middle"
                    fill={isSel ? '#0f172a' : '#94a3b8'}
                    fontSize="8.5"
                    fontWeight="800"
                  >
                    BRANCH {i + 1}
                  </text>
                  <text
                    x={nx}
                    y={ny + 12}
                    textAnchor="middle"
                    fill={isSel ? '#ffffff' : '#f8fafc'}
                    fontSize="10.5"
                    fontWeight="800"
                  >
                    {b.title.length > 19 ? `${b.title.slice(0, 18)}…` : b.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Branch Active Recall Spotlight */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {map.branches.map((b, i) => (
              <button
                key={b.title}
                type="button"
                onClick={() => setSelectedIdx(i)}
                aria-pressed={selectedIdx === i}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  selectedIdx === i
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                {i + 1}. {b.title}
              </button>
            ))}
          </div>

          <div
            className="p-4 rounded-2xl border-2 bg-[var(--surface-subtle)] space-y-2.5"
            style={{ borderColor: activeBranch.color }}
          >
            <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: activeBranch.color }}>
              Branch {selectedIdx + 1} · Visual Memory Node
            </div>
            <h4 className="text-base font-extrabold text-[var(--ink)]">{activeBranch.title}</h4>
            <p className="text-sm text-[var(--text)] leading-relaxed">{activeBranch.summary}</p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Board Exam Cue:</strong> {activeBranch.examCue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
