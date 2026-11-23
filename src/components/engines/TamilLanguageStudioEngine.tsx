import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import type { ModularEngineProps } from './types';

const PAAL_EXPLANATIONS: Record<string, { thinai: string; example: string; rule: string }> = {
  'ஆண்பால்': { thinai: 'உயர்திணை', example: 'செழியன் வந்தான் · வீரன் வென்றான்', rule: 'ஒருமை ஆண்மகனைக் குறிக்கும் உயர்திணைப் பிரிவு.' },
  'பெண்பால்': { thinai: 'உயர்திணை', example: 'கண்ணகி வந்தாள் · மகள் பாடினாள்', rule: 'ஒருமை பெண்மகளைக் குறிக்கும் உயர்திணைப் பிரிவு.' },
  'பலர்பால்': { thinai: 'உயர்திணை', example: 'மக்கள் வந்தனர் · மாணவர்கள் கற்றனர்', rule: 'ஒன்றுக்கு மேற்பட்ட மனிதர்களைக் குறிக்கும் உயர்திணைப் பிரிவு.' },
  'ஒன்றன்பால்': { thinai: 'அஃறிணை', example: 'யானை வந்தது · மயில் ஆடியது', rule: 'மனிதர் அல்லாத ஒருமை உயிரினம் அல்லது பொருள்.' },
  'பலவின்பால்': { thinai: 'அஃறிணை', example: 'பசுக்கள் வந்தன · பறவைகள் பறந்தன', rule: 'மனிதர் அல்லாத பன்மை உயிரினங்கள் அல்லது பொருள்கள்.' },
};

const AGREEMENT_SUBJECTS = [
  { id: 's1', text: 'செழியன்', expectedPaal: 'ஆண்பால்', expectedVerb: 'வந்தான்' },
  { id: 's2', text: 'கண்ணகி', expectedPaal: 'பெண்பால்', expectedVerb: 'வந்தாள்' },
  { id: 's3', text: 'மாணவர்கள்', expectedPaal: 'பலர்பால்', expectedVerb: 'வந்தனர்' },
  { id: 's4', text: 'யானை', expectedPaal: 'ஒன்றன்பால்', expectedVerb: 'வந்தது' },
  { id: 's5', text: 'பசுக்கள்', expectedPaal: 'பலவின்பால்', expectedVerb: 'வந்தன' },
];
const AGREEMENT_VERBS = ['வந்தான்', 'வந்தாள்', 'வந்தனர்', 'வந்தது', 'வந்தன'];

// Pilot 5A: மொழிபெயர்ப்புக் கல்வி (pp. 72–75)
const TRANSLATION_DRILLS = [
  {
    id: 'exhibition',
    prompt: 'பாரதியாரின் மொழிபெயர்ப்பு: "Exhibition" (பக். 73)',
    options: ['காட்சி / பொருட்காட்சி', 'தொலைவரி', 'படியெடுத்தல்'],
    correct: 'காட்சி / பொருட்காட்சி',
    why: 'பாரதியார் Exhibition என்பதைக் "காட்சி, பொருட்காட்சி" என எளிமையாகத் தமிழ்ப்படுத்தினார் (பக். 73).',
  },
  {
    id: 'telemetry',
    prompt: 'Tele- முன்னொட்டு மொழிபெயர்ப்பு: "Telemetry" (பக். 74)',
    options: ['தொலைஅளவியல்', 'உருமாற்றுதல்', 'வேலை நிறுத்தம்'],
    correct: 'தொலைஅளவியல்',
    why: 'Tele- என்பது "தொலை" என்பதைக் குறிக்கும்: Telegraph (தொலைவரி), Telescope (தொலைநோக்கி), Telemetry (தொலைஅளவியல்).',
  },
  {
    id: 'transcribe',
    prompt: 'இடம்பார்த்து மொழிபெயர்ப்பு: "Transcribe" (பக். 74)',
    options: ['படியெடுத்தல்', 'தொலைபேசி', 'இருப்புப் பாதை'],
    correct: 'படியெடுத்தல்',
    why: 'Trans- கொண்ட சொற்களை ஒரே முன்னொட்டால் மொழிபெயர்க்காமல் சூழலுக்கு ஏற்பப் படியெடுத்தல், மாறுதல், உருமாற்றுதல், செயல்படுத்துதல் என மொழிபெயர்க்க வேண்டும்.',
  },
  {
    id: 'camel',
    prompt: 'செம்மை மொழிபெயர்ப்பு: "ஊசி காதில் ___ நுழையாது" (பக். 74)',
    options: ['வடம் (கயிறு)', 'ஒட்டகம்', 'கப்பல்'],
    correct: 'வடம் (கயிறு)',
    why: 'Camel என்ற சொல்லுக்கு வடம் (கயிறு), ஒட்டகம் என இருபொருள் உண்டு; ஊசி காதில் நூல் நுழையும், கயிறு (வடம்) நுழையாது என்பதே செம்மையான பொருள்.',
  },
];

// Pilot 5B: இலக்கணம் – பொது (pp. 84–86)
const AIMPAAL_ITEMS = [
  { id: 'veera', word: 'வீரன்', thinai: 'உயர்திணை', correct: 'ஆண்பால்' },
  { id: 'kannagi', word: 'கண்ணகி', thinai: 'உயர்திணை', correct: 'பெண்பால்' },
  { id: 'makkal', word: 'மக்கள்', thinai: 'உயர்திணை', correct: 'பலர்பால்' },
  { id: 'yanai', word: 'யானை', thinai: 'அஃறிணை', correct: 'ஒன்றன்பால்' },
  { id: 'pasukkal', word: 'பசுக்கள்', thinai: 'அஃறிணை', correct: 'பலவின்பால்' },
];

const VAZHU_REPAIR_ITEMS = [
  {
    id: 'thinai',
    category: 'திணை வழு',
    broken: 'செழியன் வந்தது.',
    options: ['செழியன் வந்தான்.', 'செழியன் வந்தன.', 'செழியன் வருவார்.'],
    correct: 'செழியன் வந்தான்.',
    why: 'செழியன் உயர்திணை ஆண்பால்; எனவே "வந்தது" என்ற அஃறிணைப் பயனிலைக்குப் பதில் "வந்தான்" என்பதே வழாநிலை (பக். 85).',
  },
  {
    id: 'idam',
    category: 'இட வழு',
    broken: 'நீ வந்தேன்.',
    options: ['நீ வந்தாய்.', 'நீ வந்தான்.', 'நீ வந்தது.'],
    correct: 'நீ வந்தாய்.',
    why: '"நீ" முன்னிலைப் பெயர்; எனவே முன்னிலை வினையாகிய "வந்தாய்" என்பதே பொருந்தும் (பக். 85).',
  },
  {
    id: 'kaalam',
    category: 'கால வழு',
    broken: 'நேற்று வருவான்.',
    options: ['நேற்று வந்தான்.', 'நாளை வந்தான்.', 'நேற்று வருகிறான்.'],
    correct: 'நேற்று வந்தான்.',
    why: '"நேற்று" இறந்தகாலத்தைக் குறிப்பதால் இறந்தகால வினையாகிய "வந்தான்" அமைவதே வழாநிலை (பக். 85).',
  },
  {
    id: 'marabu',
    category: 'மரபு வழு',
    broken: 'தென்னை மரங்கள் உள்ள பகுதி — தென்னந்தோட்டம்.',
    options: ['தென்னந்தோப்பு', 'தென்னங்காடு', 'தென்னஞ்சோலை'],
    correct: 'தென்னந்தோப்பு',
    why: 'தென்னை மரங்கள் உள்ள பகுதியைத் "தென்னந்தோப்பு" எனக் கூறுவதே தமிழ் மரபு வழாநிலை (பக். 85).',
  },
];

const VAZHUVAMAITHI_ITEMS = [
  {
    id: 'v1',
    sentence: '“என் அம்மை வந்தாள்” என்று மாட்டைப் பார்த்துக் கூறுதல்',
    correct: 'திணை வழுவமைதி',
    reason: 'உவப்பின் காரணமாக அஃறிணை, உயர்திணையாக ஏற்கப்பட்டது (பக். 85).',
  },
  {
    id: 'v2',
    sentence: '“வாடா இராசா” என்று மகளைப் பார்த்துத் தாய் அழைத்தல்',
    correct: 'பால் வழுவமைதி',
    reason: 'உவப்பின் காரணமாகப் பெண்பால், ஆண்பாலாக ஏற்கப்பட்டது (பக். 85).',
  },
  {
    id: 'v3',
    sentence: '“இந்த மாறன் ஒருநாளும் பொய் கூறமாட்டான்” என்று மாறன் தன்னைப் பற்றிக் கூறுதல்',
    correct: 'இட வழுவமைதி',
    reason: 'தன்மையினைப் படர்க்கை இடத்தில் கூறுவது இடவழுவமைதி (பக். 85).',
  },
  {
    id: 'v4',
    sentence: '“குடியரசுத் தலைவர் நாளை தமிழகம் வருகிறார்”',
    correct: 'கால வழுவமைதி',
    reason: 'வருகையின் உறுதித்தன்மை நோக்கி எதிர்காலம் நிகழ்காலமாக ஏற்கப்பட்டது (பக். 86).',
  },
  {
    id: 'v5',
    sentence: '“கத்துங் குயிலோசை – சற்றே வந்து காதிற் படவேணும்” (பாரதியார்)',
    correct: 'மரபு வழுவமைதி',
    reason: 'குயில் கூவும் என்பதே மரபு; கவிதையில் இடம்பெற்றதால் "கத்தும்" என்பது மரபு வழுவமைதி (பக். 86).',
  },
];

export function TamilLanguageStudioEngine({
  lesson,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const initialVariant =
    (lesson?.interaction.config?.studioVariant as 'translation' | 'grammar' | undefined) ??
    'translation';

  const [studioMode, setStudioMode] = useState<'translation' | 'grammar_paal' | 'grammar_vazhu' | 'grammar_amaithi'>(
    initialVariant === 'grammar' ? 'grammar_paal' : 'translation',
  );
  const [selectedPaal, setSelectedPaal] = useState<string>('ஆண்பால்');
  const [builderSubIdx, setBuilderSubIdx] = useState(0);
  const [builderVerb, setBuilderVerb] = useState('வந்தான்');

  // Translation drill answers
  const [transAns, setTransAns] = useState<Record<string, string>>({});
  // Aimpaal classifier answers
  const [paalAns, setPaalAns] = useState<Record<string, string>>({});
  // Vazhu repair answers
  const [vazhuAns, setVazhuAns] = useState<Record<string, string>>({});
  // Vazhuvamaithi answers
  const [amaithiAns, setAmaithiAns] = useState<Record<string, string>>({});

  const checkAllDone = (map: Record<string, string>, items: { id: string; correct: string }[], msg: string) => {
    if (items.every((it) => map[it.id] === it.correct)) {
      onComplete(msg);
    }
  };

  const activeSubject = AGREEMENT_SUBJECTS[builderSubIdx];
  const isAgreementCorrect = builderVerb === activeSubject.expectedVerb;
  const activePaalInfo = PAAL_EXPLANATIONS[selectedPaal] ?? PAAL_EXPLANATIONS['ஆண்பால்'];

  return (
    <div lang="ta" className="font-tamil space-y-5">
      {/* Honest Provisional Tamil Educator Review Notice */}
      <div className="p-3 rounded-xl bg-[var(--tamil-tint)] border border-[var(--tamil)]/30 text-xs text-[var(--ink)] flex items-start gap-2">
        <Info className="w-4 h-4 text-[var(--tamil)] shrink-0 mt-0.5" />
        <span>
          <strong>இயல் 4 மணற்கேணி — 2D தமிழ் மொழி &amp; இலக்கணக் கூடம் (0% 3D):</strong> அனைத்துப் பயிற்சிகளும்
          தெளிவான 2D காட்சி மரமாகவும் சொல் ஒப்பீடாகவும் அமைக்கப்பட்டுள்ளன.{' '}
          <span className="text-[var(--text-muted)]">(Provisional — pending Tamil educator proofreading)</span>
        </span>
      </div>

      {/* Interactive 2D Visual Tamil Grammar Tree & Live Agreement Builder (Replaces 3D Pillars!) */}
      <div className="p-4 sm:p-5 rounded-[20px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-[var(--tamil)]">
            {studioMode === 'translation'
              ? 'காட்சி மொழிபெயர்ப்பு ஒப்பீட்டுப் பலகை (வடம் vs ஒட்டகம் · பக். 74)'
              : 'காட்சி 2D இலக்கண மரம்: இருதிணை → ஐம்பால் & எழுவாய்–பயனிலை இயைபு'}
          </span>
        </div>

        {studioMode === 'translation' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
              <div className="font-extrabold text-[var(--primary)]">1. மூலச் சொல் (Source)</div>
              <div className="text-sm font-extrabold text-[var(--ink)]">“Camel” (இருபொருள்)</div>
              <p className="text-[var(--text)]">அரபு / ஆங்கிலச் சூழலில் <strong>வடம் (கயிறு)</strong> மற்றும் <strong>ஒட்டகம்</strong> என இரு பொருள்கள்.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--warning-bg)] border border-[var(--warning)]/40 space-y-1">
              <div className="font-extrabold text-[var(--warning)]">2. நேரடிச் சொல் மொழிபெயர்ப்பு (தவறு)</div>
              <div className="text-sm font-extrabold text-[var(--ink)]">“ஊசி காதில் ஒட்டகம் நுழையாது”</div>
              <p className="text-[var(--text)]">சூழலை நோக்காமல் நேரடியாக மொழிபெயர்த்ததால் உவமைத் தொடர்பு சிதைகிறது.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/40 space-y-1">
              <div className="font-extrabold text-[var(--success)]">3. செம்மை மொழிபெயர்ப்பு (சரி · பக். 74)</div>
              <div className="text-sm font-extrabold text-[var(--ink)]">“ஊசி காதில் வடம் (கயிறு) நுழையாது”</div>
              <p className="text-[var(--text)]">ஊசி காதில் மெல்லிய நூல் நுழையும்; தடித்த கயிறு (வடம்) நுழையாது என்பதே பொருத்தமான பொருள்!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
              <svg viewBox="0 0 540 215" className="w-full h-auto" role="img" aria-label="இருதிணை மற்றும் ஐம்பால் 2D காட்சி இலக்கண மரம்">
                {/* Root */}
                <rect x="200" y="10" width="140" height="34" rx="10" fill="#FDECF2" stroke="#C04F75" strokeWidth="2" />
                <text x="270" y="32" textAnchor="middle" fontSize="13" fontWeight="800" fill="#13213A">இருதிணை (2)</text>

                {/* Branches to Uyartinai & Ahrinai */}
                <path d="M 235 44 L 155 76" stroke="#C04F75" strokeWidth="2.2" />
                <path d="M 305 44 L 405 76" stroke="#0B7773" strokeWidth="2.2" />

                <rect x="65" y="76" width="180" height="34" rx="10" fill="#EEF1FF" stroke="#4255D4" strokeWidth="2" />
                <text x="155" y="98" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#13213A">உயர்திணை (3 பால்)</text>

                <rect x="315" y="76" width="180" height="34" rx="10" fill="#E8F6F4" stroke="#0B7773" strokeWidth="2" />
                <text x="405" y="98" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#13213A">அஃறிணை (2 பால்)</text>

                {/* 5 Paal Leaf Nodes */}
                {[
                  { name: 'ஆண்பால்', x: 52, parentX: 155, color: '#4255D4' },
                  { name: 'பெண்பால்', x: 155, parentX: 155, color: '#4255D4' },
                  { name: 'பலர்பால்', x: 258, parentX: 155, color: '#4255D4' },
                  { name: 'ஒன்றன்பால்', x: 365, parentX: 405, color: '#0B7773' },
                  { name: 'பலவின்பால்', x: 475, parentX: 405, color: '#0B7773' },
                ].map((n) => {
                  const active = selectedPaal === n.name;
                  return (
                    <g
                      key={n.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedPaal(n.name);
                        onInteract();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedPaal(n.name);
                          onInteract();
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <line x1={n.parentX} y1="110" x2={n.x} y2="150" stroke={n.color} strokeWidth={active ? 3 : 1.6} />
                      <rect
                        x={n.x - 46}
                        y="150"
                        width="92"
                        height="44"
                        rx="11"
                        fill={active ? n.color : '#FFFFFF'}
                        stroke={n.color}
                        strokeWidth={active ? 2.5 : 1.6}
                      />
                      <text x={n.x} y="176" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={active ? '#FFFFFF' : '#13213A'}>
                        {n.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-2 p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] text-xs text-[var(--ink)]">
                <strong>{selectedPaal} ({activePaalInfo.thinai}):</strong> {activePaalInfo.rule} — <em>{activePaalInfo.example}</em>
              </div>
            </div>

            {/* Interactive Live Subject + Verb Vazhaanilai / Vazhu Builder */}
            <div className="lg:col-span-5 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-3 text-xs">
              <div className="font-extrabold text-[var(--tamil)]">எழுவாய் + பயனிலை இயைபுச் சோதனை (பக். 85)</div>
              <div>
                <div className="font-bold text-[var(--text-muted)] mb-1">1. எழுவாயைத் தேர்க:</div>
                <div className="flex flex-wrap gap-1.5">
                  {AGREEMENT_SUBJECTS.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setBuilderSubIdx(idx);
                        onInteract();
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold ${builderSubIdx === idx ? 'bg-[var(--tamil)] text-white border-[var(--tamil)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}
                    >
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-bold text-[var(--text-muted)] mb-1">2. பொருந்தும் பயனிலையைத் தேர்க:</div>
                <div className="flex flex-wrap gap-1.5">
                  {AGREEMENT_VERBS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setBuilderVerb(v);
                        onInteract();
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold ${builderVerb === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`p-3 rounded-xl border font-bold ${isAgreementCorrect ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]' : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'}`}>
                <div className="text-sm">“{activeSubject.text} {builderVerb}.”</div>
                <div className="mt-1 font-medium">
                  {isAgreementCorrect
                    ? `✓ வழாநிலை (சரி): ${activeSubject.text} (${activeSubject.expectedPaal}) + ${builderVerb} இயைபு துல்லியம்!`
                    : `⚠ வழு (பிழை): ${activeSubject.text} (${activeSubject.expectedPaal}) உடன் “${activeSubject.expectedVerb}” வர வேண்டும்.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Native Tamil Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="தமிழ் பயிற்சித் தளம் தேர்வு"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]"
        >
          {(
            [
              ['translation', '1. மொழிபெயர்ப்புப் பயிற்சி (பக். 72–75)'],
              ['grammar_paal', '2. இருதிணை & ஐம்பால் (பக். 84)'],
              ['grammar_vazhu', '3. வழு → வழாநிலை (பக். 85)'],
              ['grammar_amaithi', '4. வழுவமைதி 5 வகை (பக். 85–86)'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setStudioMode(id);
                onInteract();
              }}
              aria-pressed={studioMode === id}
              className={`px-3.5 py-2 min-h-[42px] rounded-lg text-xs sm:text-sm font-bold transition-colors ${studioMode === id
                  ? 'bg-[var(--tamil)] text-white'
                  : 'text-[var(--ink)] hover:bg-[var(--surface)]'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Link
          to={
            initialVariant === 'grammar'
              ? '/class-10/tamil/tamil-04/tamil-04-01'
              : '/class-10/tamil/tamil-04/tamil-04-04'
          }
          className="px-3 py-1.5 rounded-lg bg-[var(--tamil-tint)] text-[var(--tamil)] text-xs font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>
            {initialVariant === 'grammar'
              ? 'உரைநடை: மொழிபெயர்ப்புக் கல்வி'
              : 'கற்கண்டு: இலக்கணம் – பொது'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* MODE 1: TRANSLATION STUDIO */}
      {studioMode === 'translation' && (
        <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-extrabold text-[var(--ink)]">
              பொருள் மாறா தமிழ் மொழிபெயர்ப்புப் பயிற்சி
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text)]">
              முன்னொட்டுச் சொற்கள் (Tele-) மற்றும் சூழல்சார் சொற்கள் (Trans-, Camel) ஆகியவற்றிற்குப்
              பொருத்தமான தமிழ் மொழிபெயர்ப்பைத் தேர்ந்தெடுக்கவும்.
            </p>
          </div>

          <div className="space-y-3">
            {TRANSLATION_DRILLS.map((item) => {
              const chosen = transAns[item.id];
              const isRight = chosen === item.correct;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2.5"
                >
                  <div className="text-sm sm:text-base font-extrabold text-[var(--ink)]">
                    {item.prompt}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const next = { ...transAns, [item.id]: opt };
                          setTransAns(next);
                          onInteract();
                          checkAllDone(
                            next,
                            TRANSLATION_DRILLS,
                            'மொழிபெயர்ப்புக் கல்விப் பயிற்சிகள் அனைத்தும் வெற்றிகரமாக நிறைவடைந்தன!',
                          );
                        }}
                        aria-pressed={chosen === opt}
                        className={`px-3.5 py-2 min-h-[42px] rounded-xl border text-xs sm:text-sm font-bold transition-colors ${chosen === opt
                            ? opt === item.correct
                              ? 'bg-[var(--success)] text-white border-[var(--success)]'
                              : 'bg-[var(--warning-bg)] text-[var(--ink)] border-[var(--warning)]'
                            : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--tamil)]'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {chosen && (
                    <p
                      role="status"
                      className={`text-xs sm:text-sm font-medium ${isRight ? 'text-[var(--success)]' : 'text-[var(--warning)]'
                        }`}
                    >
                      {isRight ? '✓ சரியான விடை! ' : 'மீண்டும் முயற்சிக்கவும்: '}
                      {item.why}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: AIMPAAL CLASSIFIER */}
      {studioMode === 'grammar_paal' && (
        <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <h4 className="text-base sm:text-lg font-extrabold text-[var(--ink)]">
            ஐம்பால் வகைப்பாட்டுப் பயிற்சி (பக். 84)
          </h4>
          <div className="space-y-3">
            {AIMPAAL_ITEMS.map((item) => {
              const chosen = paalAns[item.id];
              const isRight = chosen === item.correct;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-base font-extrabold text-[var(--ink)]">{item.word}</span>
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-[var(--tamil-tint)] text-[var(--tamil)]">
                      {item.thinai}
                    </span>
                    {chosen && (
                      <div
                        className={`text-xs font-bold mt-1 ${isRight ? 'text-[var(--success)]' : 'text-[var(--warning)]'
                          }`}
                      >
                        {isRight
                          ? `✓ சரி (${item.thinai} · ${item.correct})`
                          : `மீண்டும் பார்க்கவும் — "${item.word}" என்பது ${item.thinai} வகையைச் சேர்ந்தது.`}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['ஆண்பால்', 'பெண்பால்', 'பலர்பால்', 'ஒன்றன்பால்', 'பலவின்பால்'].map((paal) => (
                      <button
                        key={paal}
                        type="button"
                        onClick={() => {
                          const next = { ...paalAns, [item.id]: paal };
                          setPaalAns(next);
                          onInteract();
                          checkAllDone(
                            next,
                            AIMPAAL_ITEMS,
                            'ஐம்பால் வகைப்பாடு அனைத்தும் துல்லியமாகப் பிரிக்கப்பட்டன!',
                          );
                        }}
                        className={`px-3 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold ${chosen === paal
                            ? paal === item.correct
                              ? 'bg-[var(--success)] text-white border-[var(--success)]'
                              : 'bg-[var(--warning-bg)] text-[var(--ink)] border-[var(--warning)]'
                            : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--tamil)]'
                          }`}
                      >
                        {paal}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: VAZHU -> VAZHAANILAI REPAIR */}
      {studioMode === 'grammar_vazhu' && (
        <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <h4 className="text-base sm:text-lg font-extrabold text-[var(--ink)]">
            வழுவை நீக்கி வழாநிலையாக மாற்றுக (பக். 85)
          </h4>
          <div className="space-y-3">
            {VAZHU_REPAIR_ITEMS.map((item) => {
              const chosen = vazhuAns[item.id];
              const isRight = chosen === item.correct;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2.5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[var(--warning-bg)] text-[var(--warning)] text-xs font-bold">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[var(--ink)]">
                      பிழையான தொடர்: “{item.broken}”
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const next = { ...vazhuAns, [item.id]: opt };
                          setVazhuAns(next);
                          onInteract();
                          checkAllDone(
                            next,
                            VAZHU_REPAIR_ITEMS,
                            'வழு – வழாநிலைத் திருத்தப் பயிற்சி நிறைவடைந்தது!',
                          );
                        }}
                        className={`px-3.5 py-2 min-h-[42px] rounded-xl border text-xs sm:text-sm font-bold ${chosen === opt
                            ? opt === item.correct
                              ? 'bg-[var(--success)] text-white border-[var(--success)]'
                              : 'bg-[var(--warning-bg)] text-[var(--ink)] border-[var(--warning)]'
                            : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--tamil)]'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {chosen && (
                    <p
                      role="status"
                      className={`text-xs sm:text-sm ${isRight ? 'text-[var(--success)] font-bold' : 'text-[var(--warning)]'
                        }`}
                    >
                      {isRight ? '✓ சரியான வழாநிலை! ' : 'மீண்டும் சரிபார்க்கவும்: '}
                      {item.why}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 4: VAZHUVAMAITHI IDENTIFIER */}
      {studioMode === 'grammar_amaithi' && (
        <div className="p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <h4 className="text-base sm:text-lg font-extrabold text-[var(--ink)]">
            ஐந்து வகை வழுவமைதியை இனங்காண்க (பக். 85–86)
          </h4>
          <div className="space-y-3">
            {VAZHUVAMAITHI_ITEMS.map((item) => {
              const chosen = amaithiAns[item.id];
              const isRight = chosen === item.correct;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2.5"
                >
                  <div className="text-sm sm:text-base font-extrabold text-[var(--ink)]">
                    {item.sentence}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'திணை வழுவமைதி',
                      'பால் வழுவமைதி',
                      'இட வழுவமைதி',
                      'கால வழுவமைதி',
                      'மரபு வழுவமைதி',
                    ].map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        onClick={() => {
                          const next = { ...amaithiAns, [item.id]: kind };
                          setAmaithiAns(next);
                          onInteract();
                          checkAllDone(
                            next,
                            VAZHUVAMAITHI_ITEMS,
                            'ஐந்து வகை வழுவமைதிகளும் துல்லியமாக இனங்காணப்பட்டன!',
                          );
                        }}
                        className={`px-3 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold ${chosen === kind
                            ? kind === item.correct
                              ? 'bg-[var(--success)] text-white border-[var(--success)]'
                              : 'bg-[var(--warning-bg)] text-[var(--ink)] border-[var(--warning)]'
                            : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--tamil)]'
                          }`}
                      >
                        {kind}
                      </button>
                    ))}
                  </div>
                  {chosen && (
                    <p
                      role="status"
                      className={`text-xs sm:text-sm ${isRight ? 'text-[var(--success)] font-bold' : 'text-[var(--warning)]'
                        }`}
                    >
                      {isRight ? '✓ மிகச் சரி! ' : 'குறிப்பு: '}
                      {item.reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onComplete('தமிழ் இயல் 4 மணற்கேணி பயிற்சிப் பதிவாகியது!')}
          className="px-4 py-2 min-h-[42px] rounded-xl bg-[var(--success)] text-white text-xs font-bold inline-flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>இப்பயிற்சியை நிறைவு செய்தேன்</span>
        </button>
      </div>
    </div>
  );
}
