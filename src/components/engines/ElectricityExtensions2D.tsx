import React, { useState } from 'react';
import { Lightbulb, ShieldAlert, Zap } from 'lucide-react';

export type ElectricityExtVariant = 'ohms_law_graph' | 'electric_power_kwh' | 'domestic_circuits_safety' | 'led_seven_segment';

interface ElectricityExtensions2DProps {
  variant: ElectricityExtVariant;
  onExplore: () => void;
}

const DIGIT_SEGMENTS: Record<number, string[]> = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'g', 'e', 'd'],
  3: ['a', 'b', 'g', 'c', 'd'],
  4: ['f', 'g', 'b', 'c'],
  5: ['a', 'f', 'g', 'c', 'd'],
  6: ['a', 'f', 'e', 'd', 'c', 'g'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
};

/**
 * Completes ALL remaining distinct concepts of Science Unit 4 — Electricity (TN Science pp. 45, 51–54):
 * Ohm's Law V-I straight-line graph, Electric Power & kWh bill, Domestic 220V 5A/15A + Earthing/MCB, and Interactive 7-Segment LED!
 */
export function ElectricityExtensions2D({ variant, onExplore }: ElectricityExtensions2DProps) {
  // Ohm's law V-I graph
  const [resOhm, setResOhm] = useState(5);
  const [voltV, setVoltV] = useState(15);

  // Electric power & kWh calculator
  const [powerW, setPowerW] = useState(1000);
  const [hoursPerDay, setHoursPerDay] = useState(2);

  // Domestic circuit safety (Live Red, Neutral Black, Earth Green + Overload/Short-Circuit trip)
  const [faultMode, setFaultMode] = useState<'normal' | 'overload' | 'short_circuit' | 'earth_fault'>('normal');

  // 7-Segment LED Display (a..g + decimal point, p. 53 Fig. 4.12)
  const [litSegs, setLitSegs] = useState<string[]>(DIGIT_SEGMENTS[8]);

  if (variant === 'ohms_law_graph') {
    const currA = Number((voltV / resOhm).toFixed(2));
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <svg viewBox="0 0 420 230" role="img" aria-label={`Ohms Law linear V versus I graph with resistance ${resOhm} ohms`} className="w-full h-auto">
            <line x1="55" y1="22" x2="55" y2="190" stroke="#475569" strokeWidth="2" />
            <line x1="55" y1="190" x2="395" y2="190" stroke="#475569" strokeWidth="2" />
            <text x="225" y="216" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Current I (Amperes)</text>
            <text x="18" y="108" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" transform="rotate(-90 18 108)">Voltage V (Volts)</text>
            {/* Straight Line from origin through (I, V) */}
            {(() => {
              const xMax = Math.min(380, 55 + (30 / resOhm) * 45);
              const yMax = 190 - 150;
              const px = Math.min(380, 55 + currA * 45);
              const py = 190 - (voltV / 30) * 150;
              return (
                <g>
                  <line x1="55" y1="190" x2={xMax} y2={yMax} stroke="#2563eb" strokeWidth="3" />
                  <circle cx={px} cy={py} r="6.5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x={Math.min(285, px + 10)} y={Math.max(36, py - 8)} fontSize="11" fontWeight="800" fill="#1d4ed8">
                    ({currA} A, {voltV} V) · Slope R = {resOhm} Ω
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
        <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
          <div className="font-extrabold uppercase tracking-wider text-[var(--science)]">
            4.4 Ohm&apos;s Law Straight-Line V–I Graph (Fig. 4.5, p. 45)
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Potential Difference (V): {voltV} V
            <input type="range" min={3} max={30} step={3} value={voltV} onChange={(e) => { setVoltV(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--primary)] mt-1" />
          </label>
          <label className="block font-bold text-[var(--ink)]">
            Nichrome Resistance (R): {resOhm} Ω
            <input type="range" min={2} max={15} step={1} value={resOhm} onChange={(e) => { setResOhm(Number(e.target.value)); onExplore(); }} className="w-full accent-orange-500 mt-1" />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-mono-tabular">
            V = I · R ⇒ I = {voltV} / {resOhm} = <strong>{currA} A</strong> (Constant temperature)
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'electric_power_kwh') {
    const kwhDay = Number(((powerW * hoursPerDay) / 1000).toFixed(2));
    const joules = (kwhDay * 3.6e6).toExponential(2);
    const hp = Number((powerW / 746).toFixed(2));
    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs sm:text-sm">
        <div className="font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          <span>4.9 Electric Power (P = VI) &amp; Commercial Energy Unit (1 kWh = 3.6 × 10⁶ J · p. 51)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block font-bold text-[var(--ink)]">
            Appliance Power Rating (P): {powerW} W ({hp} hp)
            <input type="range" min={100} max={2500} step={100} value={powerW} onChange={(e) => { setPowerW(Number(e.target.value)); onExplore(); }} className="w-full accent-amber-600 mt-1" />
          </label>
          <label className="block font-bold text-[var(--ink)]">
            Usage Duration (t): {hoursPerDay} hours / day
            <input type="range" min={1} max={12} step={1} value={hoursPerDay} onChange={(e) => { setHoursPerDay(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--primary)] mt-1" />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tabular text-xs">
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="text-[var(--text-muted)]">Daily Units (1 Unit = 1 kWh)</div>
            <div className="text-lg font-extrabold text-[var(--primary)]">{kwhDay} kWh</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="text-[var(--text-muted)]">SI Energy (Joules)</div>
            <div className="text-lg font-extrabold text-amber-700 dark:text-amber-300">{joules} J</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="text-[var(--text-muted)]">Horse Power (1 hp = 746 W)</div>
            <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{hp} hp</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'domestic_circuits_safety') {
    const info = {
      normal: { badge: 'SAFE · Parallel 220 V / 50 Hz', detail: 'Red Live wire + Black Neutral wire enter Main Fuse/MCB → Meter → Main Switch → Parallel 5 A (bulbs/fans) and 15 A (heater/AC) branches so every appliance gets equal 220 V (p. 52).' },
      overload: { badge: 'MCB / FUSE TRIPPED · Overloading!', detail: 'Too many high-power appliances connected to one socket draw excess current beyond the wire rating — Fuse melts or electromagnet in MCB trips to stop fire (pp. 52–53).' },
      short_circuit: { badge: 'MCB / FUSE TRIPPED · Short Circuit!', detail: 'Damaged insulation lets Red Live touch Black Neutral directly → effective resistance plunges near zero → huge surge current trips the Fuse/MCB instantly (p. 53).' },
      earth_fault: { badge: 'PROTECTED BY GREEN EARTH WIRE!', detail: 'Live wire accidentally touches metallic appliance body → Green Earth wire provides a low-resistance path straight into the ground, protecting the user from electric shock (4.10.2, p. 53)!' },
    }[faultMode];

    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300 inline-flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>4.10 Domestic Electric Circuits, MCB &amp; Earthing (Fig. 4.10, pp. 52–53)</span>
          </div>
          <span className={`px-3 py-1 rounded-full font-extrabold text-xs ${faultMode === 'normal' || faultMode === 'earth_fault' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {info.badge}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {([
            ['normal', 'Normal 220V Parallel'],
            ['overload', 'Simulate Overload'],
            ['short_circuit', 'Simulate Short Circuit'],
            ['earth_fault', 'Test Green Earth Wire'],
          ] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setFaultMode(k); onExplore(); }} className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs font-bold ${faultMode === k ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] leading-relaxed">
          {info.detail}
        </div>
      </div>
    );
  }

  // 4.11 / 4.11.1 / 4.12 Interactive Seven-Segment LED Display (a..g, Fig. 4.12, p. 53)
  const toggleSeg = (s: string) => {
    setLitSegs((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    onExplore();
  };
  const isOn = (s: string) => litSegs.includes(s);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-5 rounded-2xl border border-[var(--line)] bg-slate-950 p-4 flex flex-col items-center">
        <svg viewBox="0 0 180 240" role="img" aria-label="Interactive Seven Segment LED Display with segments a through g" className="w-40 h-auto">
          {/* a (top) */}
          <rect x="44" y="18" width="84" height="16" rx="6" fill={isOn('a') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('a')} className="cursor-pointer" />
          <text x="86" y="30" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">a</text>
          {/* f (top-left) */}
          <rect x="26" y="36" width="16" height="72" rx="6" fill={isOn('f') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('f')} className="cursor-pointer" />
          <text x="34" y="76" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">f</text>
          {/* b (top-right) */}
          <rect x="130" y="36" width="16" height="72" rx="6" fill={isOn('b') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('b')} className="cursor-pointer" />
          <text x="138" y="76" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">b</text>
          {/* g (middle) */}
          <rect x="44" y="110" width="84" height="16" rx="6" fill={isOn('g') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('g')} className="cursor-pointer" />
          <text x="86" y="122" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">g</text>
          {/* e (bottom-left) */}
          <rect x="26" y="128" width="16" height="72" rx="6" fill={isOn('e') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('e')} className="cursor-pointer" />
          <text x="34" y="168" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">e</text>
          {/* c (bottom-right) */}
          <rect x="130" y="128" width="16" height="72" rx="6" fill={isOn('c') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('c')} className="cursor-pointer" />
          <text x="138" y="168" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">c</text>
          {/* d (bottom) */}
          <rect x="44" y="202" width="84" height="16" rx="6" fill={isOn('d') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('d')} className="cursor-pointer" />
          <text x="86" y="214" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" className="pointer-events-none">d</text>
          {/* 8th LED decimal dot */}
          <circle cx="162" cy="210" r="8" fill={isOn('dp') ? '#ef4444' : '#1e293b'} onClick={() => toggleSeg('dp')} className="cursor-pointer" />
        </svg>
        <div className="text-[11px] font-bold text-slate-300 mt-1">Click any LED segment (a–g + dot)</div>
      </div>
      <div className="lg:col-span-7 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4" />
          <span>4.11 &amp; 4.12 Interactive Seven-Segment LED Display &amp; LED TV (pp. 53–54)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button key={d} type="button" onClick={() => { setLitSegs(DIGIT_SEGMENTS[d]); onExplore(); }} className="min-h-[38px] w-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)] font-mono-tabular font-extrabold text-[var(--ink)]">
              {d}
            </button>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] space-y-1.5">
          <div><strong>Lit Segments:</strong> {litSegs.length ? litSegs.join(', ') : 'None'}</div>
          <div><strong>LED Materials (p. 53):</strong> Semiconductor compounds like Gallium Arsenide &amp; Gallium Phosphide emit light with zero filament heat loss and zero toxic mercury.</div>
          <div><strong>LED TV (p. 54):</strong> Uses RGB LEDs for colour pixels/backlight (first monochrome LED screen by James P. Mitchell in 1977; first commercial LED TV by SONY in 2009).</div>
        </div>
      </div>
    </div>
  );
}
