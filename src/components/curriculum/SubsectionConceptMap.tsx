import React, { useState } from 'react';
import { GitBranch, ListTree, Printer } from 'lucide-react';
import type { ConceptMapEdgeSpec, ConceptMapNodeSpec } from '../../types/subsectionLesson';

interface SubsectionConceptMapProps {
  title: string;
  nodes: ConceptMapNodeSpec[];
  edges: ConceptMapEdgeSpec[];
  textFallback: string;
  onExploreNode?: () => void;
}

const ROLE_COLORS: Record<ConceptMapNodeSpec['role'], { fill: string; border: string; badge: string }> = {
  cause: { fill: '#1e293b', border: '#f59e0b', badge: 'Cause' },
  turning_point: { fill: '#1e1b4b', border: '#6366f1', badge: 'Turning Point' },
  actor: { fill: '#132a2e', border: '#14b8a6', badge: 'Key Actor' },
  effect: { fill: '#0f291e', border: '#10b981', badge: 'Consequence' },
  comparison: { fill: '#2a1a2e', border: '#ec4899', badge: 'Compare' },
};

/**
 * Stage 2 — Accessible Interactive SVG Concept / Mind Map (Section D.2 Contract).
 * Features 3-7 cause->event->effect/compare nodes, keyboard navigation, "Show connections" mode,
 * semantic list/tree fallback, and printable plain-text mode.
 */
export function SubsectionConceptMap({
  title,
  nodes,
  edges,
  textFallback,
  onExploreNode,
}: SubsectionConceptMapProps) {
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id ?? '');
  const [showConnections, setShowConnections] = useState(true);
  const [viewMode, setViewMode] = useState<'svg' | 'tree' | 'printable'>('svg');

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? nodes[0];
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  const relatedEdges = edges.filter((e) => e.from === selectedId || e.to === selectedId);
  const connectedNodeIds = new Set<string>([selectedId]);
  relatedEdges.forEach((e) => {
    connectedNodeIds.add(e.from);
    connectedNodeIds.add(e.to);
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onExploreNode?.();
  };

  return (
    <section
      aria-label={`Concept map: ${title}`}
      className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            <span>See the Big Picture · Concept Map</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[var(--ink)] mt-0.5">{title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setShowConnections((s) => !s)}
            aria-pressed={showConnections}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl border font-bold ${
              showConnections
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            {showConnections ? '✓ Show connections' : 'Show connections'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'tree' ? 'svg' : 'tree'))}
            aria-pressed={viewMode === 'tree'}
            className="px-3 py-1.5 min-h-[38px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] font-bold text-[var(--ink)] inline-flex items-center gap-1"
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>{viewMode === 'tree' ? 'Visual map' : 'Text list view'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'printable' ? 'svg' : 'printable'))}
            aria-pressed={viewMode === 'printable'}
            className="px-3 py-1.5 min-h-[38px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] font-bold text-[var(--ink)] inline-flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Printable notes</span>
          </button>
        </div>
      </div>

      {viewMode === 'svg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 rounded-2xl border border-[var(--line)] bg-[#0b1224] p-2.5 overflow-x-auto">
            <svg
              viewBox="0 0 640 270"
              className="w-full min-w-[480px] h-[250px] sm:h-[270px]"
              role="img"
              aria-label={`Cause and consequence concept map for ${title}`}
            >
              <defs>
                <marker id="katrio-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                </marker>
                <marker id="katrio-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
                </marker>
              </defs>

              {/* Cause -> Event -> Effect Edges */}
              {edges.map((e) => {
                const a = nodeById.get(e.from);
                const b = nodeById.get(e.to);
                if (!a || !b) return null;
                const isRel = e.from === selectedId || e.to === selectedId;
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2 - 14;
                return (
                  <g key={`${e.from}-${e.to}`} opacity={showConnections ? (isRel ? 1 : 0.35) : 0.14}>
                    <path
                      d={`M ${a.x} ${a.y} Q ${mx} ${my}, ${b.x} ${b.y}`}
                      fill="none"
                      stroke={isRel ? '#fbbf24' : '#64748b'}
                      strokeWidth={isRel ? 2.8 : 1.6}
                      markerEnd={isRel ? 'url(#katrio-arrow-active)' : 'url(#katrio-arrow)'}
                    />
                    {showConnections && isRel && (
                      <text x={mx} y={my + 2} textAnchor="middle" fill="#fde68a" fontSize="9.5" fontWeight="700">
                        {e.relation}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Interactive Selectable Nodes */}
              {nodes.map((node) => {
                const st = ROLE_COLORS[node.role];
                const isSel = node.id === selectedId;
                const isConnected = connectedNodeIds.has(node.id);
                return (
                  <g
                    key={node.id}
                    onClick={() => handleSelect(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(node.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSel}
                    className="cursor-pointer focus:outline-none"
                    opacity={showConnections && !isConnected ? 0.55 : 1}
                  >
                    <rect
                      x={node.x - 74}
                      y={node.y - 26}
                      width="148"
                      height="52"
                      rx="14"
                      fill={isSel ? st.border : st.fill}
                      stroke={isSel ? '#ffffff' : st.border}
                      strokeWidth={isSel ? 2.8 : 1.8}
                    />
                    <text
                      x={node.x}
                      y={node.y - 6}
                      textAnchor="middle"
                      fill={isSel ? '#0f172a' : '#cbd5e1'}
                      fontSize="8.5"
                      fontWeight="800"
                    >
                      {st.badge.toUpperCase()}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 11}
                      textAnchor="middle"
                      fill={isSel ? '#0f172a' : '#f8fafc'}
                      fontSize="10.5"
                      fontWeight="800"
                    >
                      {node.label.length > 22 ? `${node.label.slice(0, 21)}…` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Keyboard-Parity Node Selector + Detail Panel */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select concept map node">
              {nodes.map((n, idx) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleSelect(n.id)}
                  aria-pressed={selectedId === n.id}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-bold border ${
                    selectedId === n.id
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'
                  }`}
                >
                  {idx + 1}. {n.label}
                </button>
              ))}
            </div>

            {selectedNode && (
              <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                  {ROLE_COLORS[selectedNode.role].badge} · {selectedNode.shortNote}
                </div>
                <h4 className="text-base font-extrabold text-[var(--ink)]">{selectedNode.label}</h4>
                <p className="text-sm text-[var(--text)] leading-relaxed">{selectedNode.detail}</p>
                {relatedEdges.length > 0 && (
                  <div className="pt-2 border-t border-[var(--line)] space-y-1 text-xs text-[var(--ink)]">
                    <div className="font-bold">Direct Connections:</div>
                    {relatedEdges.map((e) => (
                      <div key={`${e.from}-${e.to}`} className="text-[var(--text)]">
                        • <strong>{nodeById.get(e.from)?.label}</strong> — <em>{e.relation}</em> →{' '}
                        <strong>{nodeById.get(e.to)?.label}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'tree' && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-4 space-y-3">
          <ol className="space-y-2.5 text-sm">
            {nodes.map((n, i) => (
              <li key={n.id} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="font-extrabold text-[var(--ink)]">
                  {i + 1}. {n.label}{' '}
                  <span className="text-xs font-bold text-[var(--primary)]">({ROLE_COLORS[n.role].badge})</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text)] mt-1">{n.detail}</p>
              </li>
            ))}
          </ol>
          <div className="p-3 rounded-xl bg-[var(--canvas)] border border-[var(--line)] text-xs text-[var(--text)]">
            <strong>Causal Flow:</strong>{' '}
            {edges
              .map((e) => `${nodeById.get(e.from)?.label} (${e.relation}) → ${nodeById.get(e.to)?.label}`)
              .join('  |  ')}
          </div>
        </div>
      )}

      {viewMode === 'printable' && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-4 text-xs sm:text-sm text-[var(--ink)] space-y-2 font-mono">
          <div className="font-bold">PRINTABLE CONCEPT SUMMARY — {title}</div>
          <p className="font-sans leading-relaxed">{textFallback}</p>
          <ul className="font-sans list-disc pl-5 space-y-1">
            {nodes.map((n) => (
              <li key={n.id}>
                <strong>{n.label}</strong> ({ROLE_COLORS[n.role].badge}): {n.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
