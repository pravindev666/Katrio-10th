import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ModularEngineProps } from './types';

const Tamil3DStageCanvas = lazy(() => import('./Tamil3DStageCanvas'));

const PILLAR_EXPLANATIONS: Record<string, string> = {
  'ஆண்பால்': 'உயர்திணை — ஒருமை ஆண் (எ.கா. வீரன், செழியன் வந்தான்)',
  'பெண்பால்': 'உயர்திணை — ஒருமை பெண் (எ.கா. கண்ணகி, மகள் வந்தாள்)',
  'பலர்பால்': 'உயர்திணை — பன்மை மனிதர்கள் (எ.கா. மக்கள் வந்தனர்)',
  'ஒன்றன்பால்': 'அஃறிணை — ஒருமை உயிரினம்/பொருள் (எ.கா. யானை வந்தது)',
  'பலவின்பால்': 'அஃறிணை — பன்மை உயிரினங்கள்/பொருள்கள் (எ.கா. பசுக்கள் வந்தன)',
  source: 'பிறமொழி அறிவியல் மற்றும் இலக்கியச் செல்வங்கள் (Source Language)',
  bridge: 'பொருள் சிதையாமல் தமிழ் மரபிற்கேற்ப மாற்றும் மொழிபெயர்ப்புப் பாலம் (பக். 73–74)',
  tamil: 'செம்மையான தமிழ் வடிவம் — மணற்கேணி அறிவுப் பெருக்கு (பக். 72–75)',
};

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
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const initialVariant =
    (lesson?.interaction.config?.studioVariant as 'translation' | 'grammar' | undefined) ??
    'translation';

  const [studioMode, setStudioMode] = useState<'translation' | 'grammar_paal' | 'grammar_vazhu' | 'grammar_amaithi'>(
    initialVariant === 'grammar' ? 'grammar_paal' : 'translation',
  );
  const [selectedPillar, setSelectedPillar] = useState<string>(
    initialVariant === 'grammar' ? 'ஆண்பால்' : 'bridge',
  );

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

  return (
    <div lang="ta" className="font-tamil space-y-5">
      {/* 3D Interactive Tamil Visual Anchor (hidden in 2D/Text mode) */}
      {mode !== '2d_text' && (
        <div className="p-4 rounded-[20px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[var(--tamil)]">
              3D தமிழ் காட்சி அரங்கு — தூண்களைத் தொட்டு இலக்கணம் &amp; மொழிபெயர்ப்பை உடனே உணருங்கள்
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['ஆண்பால்', 'பெண்பால்', 'பலர்பால்', 'ஒன்றன்பால்', 'பலவின்பால்'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setStudioMode('grammar_paal');
                    setSelectedPillar(p);
                    onInteract();
                  }}
                  className={`px-2.5 py-1 min-h-[34px] rounded-lg text-[11px] font-bold border ${selectedPillar === p && studioMode !== 'translation'
                      ? 'bg-[var(--tamil)] text-white border-[var(--tamil)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Suspense
            fallback={
              <div className="h-[280px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                3D தமிழ் காட்சி அரங்கு திறக்கிறது...
              </div>
            }
          >
            <Tamil3DStageCanvas
              variant={studioMode === 'translation' ? 'translation_bridge' : 'grammar_pillars'}
              selectedPillar={selectedPillar}
              onSelectPillar={(id) => {
                setSelectedPillar(id);
                onInteract();
              }}
              reducedMotion={reducedMotion}
            />
          </Suspense>
          {PILLAR_EXPLANATIONS[selectedPillar] && (
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)]">
              <strong>{selectedPillar}:</strong> {PILLAR_EXPLANATIONS[selectedPillar]}
            </div>
          )}
        </div>
      )}

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
