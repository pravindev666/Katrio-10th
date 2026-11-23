import React, { useState } from 'react';
import { Brain, Lightbulb, List, Network, Sparkles } from 'lucide-react';
import { getChapterMindMap } from '../../data/chapterMindMaps';

interface ChapterMindMapCardProps {
  unitId: string;
  unitTitle: string;
  isTamil?: boolean;
}

const EDGE_LABELS = ['explains', 'requires', 'applies to', 'connects to'];

/**
 * Bright, Accessible Interactive Concept Graph + Memory Cues Studio for ALL 72 Chapters.
 * Replaces heavy dark slate canvas with a crisp daylight concept graph + explicit relationship labels + text-list mode.
 */
export function ChapterMindMapCard({ unitId, unitTitle, isTamil = false }: ChapterMindMapCardProps) {
  const map = getChapterMindMap(unitId);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [listMode, setListMode] = useState(false);
  const activeBranch = map.branches[selectedIdx] ?? map.branches[0];

  const nodeCoords: [number, number][] = [
    [82, 48],
    [358, 48],
    [82, 204],
    [358, 204],
  ];

  return (
    <div
      lang={isTamil ? 'ta' : undefined}
      className={`rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)] ${isTamil ? 'font-tamil' : ''}`}
    >
      {/* Header + Graph/List Accessibility Toggle */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>{isTamil ? 'பாட மனவரைபடம் & நினைவுக் குறிப்புகள்' : 'Interactive Concept Map & Memory Cues'}</span>
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">{unitTitle}</h3>
        </div>
        <button
          type="button"
          onClick={() => setListMode((v) => !v)}
          aria-pressed={listMode}
          className="px-3 py-1.5 min-h-[38px] rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] hover:border-[var(--primary)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
        >
          {listMode ? <Network className="w-3.5 h-3.5 text-[var(--primary)]" /> : <List className="w-3.5 h-3.5 text-[var(--primary)]" />}
          <span>{listMode ? 'Show Concept Graph' : 'Accessible Text List'}</span>
        </button>
      </div>

      {/* Memory Trick / Formula Banner */}
      <div className="p-3.5 rounded-2xl bg-[var(--warning-bg)] border border-[var(--warning)]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--ink)]">
          <Lightbulb className="w-4 h-4 text-[var(--warning)] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[var(--warning)]">{isTamil ? 'நினைவு உத்தி: ' : 'Memory Cue: '}</strong>
            <span className="font-semibold">{map.mnemonic}</span>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[11px] font-extrabold text-[var(--primary)] font-mono-tabular shrink-0">
          {map.formulaOrKeyFact}
        </div>
      </div>

      {listMode ? (
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {map.branches.map((b, i) => (
            <li key={b.title} className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-extrabold" style={{ color: b.color }}>
                <span>{i + 1}. {b.title}</span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)] text-[10px] text-[var(--text-muted)]">
                  {EDGE_LABELS[i % EDGE_LABELS.length]}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">{b.summary}</p>
              <div className="text-xs font-semibold text-[var(--ink)]">
                <strong>Exam Cue:</strong> {b.examCue}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Bright Daylight Concept Graph SVG (zero heavy dark slate!) */}
          <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--viewer-bg)] p-3 overflow-hidden">
            <svg
              viewBox="0 0 440 255"
              className="w-full h-[230px] sm:h-[255px]"
              role="img"
              aria-label={`Interactive concept map for ${map.centralNode} with labelled relationships`}
            >
              {/* Curved Connectors + Explicit Relationship Labels */}
              {map.branches.slice(0, 4).map((b, i) => {
                const [nx, ny] = nodeCoords[i];
                const isSel = selectedIdx === i;
                const mx = (220 + nx) / 2;
                const my = (128 + ny) / 2;
                return (
                  <g key={`link-${b.title}`}>
                    <path
                      d={`M 220 128 Q ${mx} 128, ${nx} ${ny}`}
                      fill="none"
                      stroke={b.color}
                      strokeWidth={isSel ? 3.5 : 2}
                      strokeOpacity={isSel ? 1 : 0.55}
                    />
                    <rect
                      x={mx - 30}
                      y={my - 9}
                      width="60"
                      height="16"
                      rx="6"
                      fill="#FFFFFF"
                      stroke={b.color}
                      strokeWidth="1"
                    />
                    <text x={mx} y={my + 2} textAnchor="middle" fill="#35465D" fontSize="8.2" fontWeight="700">
                      {EDGE_LABELS[i % EDGE_LABELS.length]}
                    </text>
                  </g>
                );
              })}

              {/* Central Concept Hub */}
              <rect
                x="146"
                y="100"
                width="148"
                height="56"
                rx="16"
                fill="#FFFFFF"
                stroke="#4255D4"
                strokeWidth="2.5"
              />
              <text x="220" y="121" textAnchor="middle" fill="#4255D4" fontSize="8.8" fontWeight="800">
                CORE CONCEPT
              </text>
              <text x="220" y="139" textAnchor="middle" fill="#13213A" fontSize="11.2" fontWeight="800">
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
                      x={nx - 70}
                      y={ny - 24}
                      width="140"
                      height="48"
                      rx="14"
                      fill={isSel ? b.color : '#FFFFFF'}
                      stroke={b.color}
                      strokeWidth={isSel ? 2.5 : 1.8}
                    />
                    <text
                      x={nx}
                      y={ny - 4}
                      textAnchor="middle"
                      fill={isSel ? '#FFFFFF' : '#4E5F76'}
                      fontSize="8.2"
                      fontWeight="800"
                    >
                      NODE {i + 1}
                    </text>
                    <text
                      x={nx}
                      y={ny + 12}
                      textAnchor="middle"
                      fill={isSel ? '#FFFFFF' : '#13213A'}
                      fontSize="10.2"
                      fontWeight="800"
                    >
                      {b.title.length > 19 ? `${b.title.slice(0, 18)}…` : b.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Node Active Recall Spotlight */}
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
                Node {selectedIdx + 1} · {EDGE_LABELS[selectedIdx % EDGE_LABELS.length]}
              </div>
              <h4 className="text-base font-extrabold text-[var(--ink)]">{activeBranch.title}</h4>
              <p className="text-sm text-[var(--text)] leading-relaxed">{activeBranch.summary}</p>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--warning)] shrink-0 mt-0.5" />
                <span>
                  <strong>Exam Cue:</strong> {activeBranch.examCue}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
