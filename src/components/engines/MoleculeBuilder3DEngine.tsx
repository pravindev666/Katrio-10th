import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Atom, CheckCircle2, FlaskConical, Layers } from 'lucide-react';
import {
  CLASS10_MOLECULES_3D,
  TABLE_7_1_ATOMIC_MASS,
  analyzeMoleculeMass,
  type AtomNode3D,
} from '../../utils/moleculeSimulations';
import type { ModularEngineProps } from './types';

const MoleculeBuilder3DCanvas = lazy(() => import('./MoleculeBuilder3DCanvas'));

export function MoleculeBuilder3DEngine({
  sectionId,
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const prefer2DText = mode === '2d_text';
  const onInteraction = onInteract;
  const defaultMolId =
    sectionId.startsWith('science-07')
      ? 'h2o'
      : sectionId.includes('ethanol')
      ? 'ethanol'
      : sectionId.includes('ethanoic')
      ? 'ethanoic_acid'
      : 'ch4';

  const [molId, setMolId] = useState(defaultMolId);
  const [selectedAtom, setSelectedAtom] = useState<AtomNode3D | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(prefer2DText ? '2d' : '3d');
  const [testedBromine, setTestedBromine] = useState(false);
  const [visitedMols, setVisitedMols] = useState<string[]>([defaultMolId]);

  const molecule = useMemo(
    () => CLASS10_MOLECULES_3D.find((m) => m.id === molId) ?? CLASS10_MOLECULES_3D[0],
    [molId],
  );
  const analysis = useMemo(() => analyzeMoleculeMass(molecule), [molecule]);
  const effectiveMode = prefer2DText ? '2d' : viewMode;

  const chooseMolecule = (id: string) => {
    setMolId(id);
    setSelectedAtom(null);
    setTestedBromine(false);
    onInteract();
    setVisitedMols((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (next.length >= 3) onComplete('MoleculeBuilder3D milestone completed! Explored 3+ 3D molecules and percent composition.');
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
            MoleculeBuilder3D · {molecule.textbookPages}
          </div>
          <h3 className="text-lg font-extrabold text-[var(--ink)]">
            {molecule.name} ({molecule.formula}) — {molecule.geometryLabel} ({molecule.bondAngle})
          </h3>
        </div>
        {!prefer2DText && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setViewMode('3d');
                onInteraction();
              }}
              className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border ${
                effectiveMode === '3d'
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>3D Ball-and-Stick</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('2d');
                onInteraction();
              }}
              className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border ${
                effectiveMode === '2d'
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Structural &amp; Mass Table</span>
            </button>
          </div>
        )}
      </div>

      {/* Molecule Selector */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select textbook molecule">
        {CLASS10_MOLECULES_3D.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => chooseMolecule(m.id)}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border transition-colors ${
              molId === m.id
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
            }`}
          >
            {m.name} ({m.formula})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 space-y-3">
          {effectiveMode === '3d' ? (
            <Suspense
              fallback={
                <div className="h-[330px] rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                  Loading Three.js 3D Molecule Builder...
                </div>
              }
            >
              <MoleculeBuilder3DCanvas
                molecule={molecule}
                selectedAtomId={selectedAtom?.id ?? null}
                onSelectAtom={(atom) => {
                  setSelectedAtom(atom);
                  onInteraction();
                }}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          ) : (
            <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                2D Structural Projection (No WebGL Required)
              </div>
              <svg
                viewBox="-3 -2 6 4"
                className="w-full h-[250px] rounded-xl bg-slate-900 border border-[var(--line)]"
                role="img"
                aria-label={`2D structural formula projection of ${molecule.name}`}
              >
                {molecule.bonds.map((b, idx) => {
                  const a1 = molecule.atoms.find((a) => a.id === b.from);
                  const a2 = molecule.atoms.find((a) => a.id === b.to);
                  if (!a1 || !a2) return null;
                  const offsets = b.order === 1 ? [0] : b.order === 2 ? [-0.08, 0.08] : [-0.11, 0, 0.11];
                  return offsets.map((off, oi) => (
                    <line
                      key={`${idx}-${oi}`}
                      x1={a1.position[0]}
                      y1={-a1.position[1] + off}
                      x2={a2.position[0]}
                      y2={-a2.position[1] + off}
                      stroke="#CBD5E1"
                      strokeWidth="0.065"
                    />
                  ));
                })}
                {molecule.atoms.map((a) => {
                  const meta = TABLE_7_1_ATOMIC_MASS[a.element];
                  return (
                    <g
                      key={a.id}
                      onClick={() => {
                        setSelectedAtom(a);
                        onInteraction();
                      }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={a.position[0]}
                        cy={-a.position[1]}
                        r={meta.radius * 0.85}
                        fill={meta.color}
                        stroke={selectedAtom?.id === a.id ? '#FBBF24' : '#0F172A'}
                        strokeWidth="0.06"
                      />
                      <text
                        x={a.position[0]}
                        y={-a.position[1] + 0.1}
                        textAnchor="middle"
                        fontSize="0.26"
                        fontWeight="700"
                        fill={a.element === 'H' ? '#0F172A' : '#FFFFFF'}
                      >
                        {a.element}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {selectedAtom && (
            <div className="p-3.5 rounded-xl bg-[var(--primary-tint)] border border-[var(--primary)]/30 text-xs text-[var(--ink)]">
              <strong>Selected Atom ({selectedAtom.id}):</strong> {TABLE_7_1_ATOMIC_MASS[selectedAtom.element].name} ({selectedAtom.element}) · Relative Atomic Mass Aᵣ ={' '}
              <strong>{TABLE_7_1_ATOMIC_MASS[selectedAtom.element].mass}</strong> · {selectedAtom.role}
            </div>
          )}
        </div>

        {/* Right: Molecular Mass, Percent Composition & Bromine Water Test */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2.5 text-xs">
            <div className="font-extrabold text-[var(--ink)] text-sm">{molecule.iupacName}</div>
            <p className="text-[var(--text)] leading-relaxed">{molecule.summary}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                <div className="text-[11px] text-[var(--text-muted)] font-semibold">Atomicity</div>
                <div className="text-base font-extrabold font-mono-tabular text-[var(--ink)]">
                  {analysis.atomicity} atoms
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--primary-tint)] border border-[var(--primary)]/30">
                <div className="text-[11px] text-[var(--primary)] font-semibold">Gram Molecular Mass</div>
                <div className="text-base font-extrabold font-mono-tabular text-[var(--primary)]">
                  {analysis.molecularMass} g/mol
                </div>
              </div>
            </div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)]">
              Classification: <span className="text-[var(--ink)]">{molecule.classification}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink)]">
              Percent Composition by Mass (Table 7.1)
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--text-muted)]">
                  <th className="py-1">Element</th>
                  <th className="py-1">Count</th>
                  <th className="py-1">Mass</th>
                  <th className="py-1 text-right">% Mass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {analysis.composition.map((row) => (
                  <tr key={row.symbol}>
                    <td className="py-1.5 font-bold text-[var(--ink)]">
                      {row.name} ({row.symbol})
                    </td>
                    <td className="py-1.5 font-mono-tabular">{row.count}</td>
                    <td className="py-1.5 font-mono-tabular">{row.massContribution} g</td>
                    <td className="py-1.5 font-mono-tabular text-right font-bold text-[var(--primary)]">
                      {row.percentByMass}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[var(--ink)] inline-flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Unit 11 Virtual Bromine Water Test (p. 158)</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setTestedBromine(true);
                  onInteraction();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[var(--primary)] text-white font-bold"
              >
                Run Test
              </button>
            </div>
            {testedBromine && (
              <p className="p-2.5 rounded-lg bg-[var(--info-bg)] text-[var(--ink)] font-semibold">
                {molecule.bromineWaterTest}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Explored {visitedMols.length} / 3 molecules</span>
            {visitedMols.length >= 3 && (
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
