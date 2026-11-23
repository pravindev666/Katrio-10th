import React, { useState } from 'react';
import { BookOpen, Feather, MessageSquare, Sparkles } from 'lucide-react';

interface LanguageEntry {
  genre: 'Prose' | 'Poem' | 'Supplementary' | 'தமிழ் செய்யுள்' | 'தமிழ் உரைநடை' | 'தமிழ் இலக்கணம்';
  authorOrNote: string;
  coreIdea: string;
  tamilHelp?: string;
  beats: { heading: string; detail: string }[];
  craftSpotlight: { term: string; example: string }[];
  quickPrompt: { question: string; options: string[]; answerIdx: number; why: string };
}

const ENGLISH_UNITS_2_TO_7: Record<string, LanguageEntry> = {
  'english-02-prose': {
    genre: 'Prose',
    authorOrNote: 'James Thurber · Humorous Narrative',
    coreIdea: 'A comical midnight misunderstanding escalates when footsteps around the dining table convince the whole household—and the police—that a ghost or burglar has broken in.',
    tamilHelp: 'நள்ளிரவில் கேட்ட காலடிச் சத்தத்தைத் தவறாகப் புரிந்துகொண்டதால் ஏற்பட்ட நகைச்சுவைக் குழப்பமே இக்கதையின் மையம்.',
    beats: [
      { heading: '1. Midnight Footsteps', detail: 'Narrator hears rhythmic steps downstairs near the dining room table and wakes his brother Herman.' },
      { heading: '2. Mother Throws a Shoe', detail: 'Mother assumes burglars are inside and flings a shoe through the neighbour’s window to call the police.' },
      { heading: '3. Chaotic Police Search', detail: 'Officers rummage through the house while Grandfather mistakes them for Civil War deserters!' },
      { heading: '4. Morning Reveal', detail: 'Grandfather casually asks why there was no water—he had simply walked downstairs for a drink!' },
    ],
    craftSpotlight: [
      { term: 'Comic Escalation', example: 'One small sound snowballs into broken glass, police, and reporters.' },
      { term: 'Grammar Focus', example: 'Articles (a, an, the) & Prepositional Phrases.' },
    ],
    quickPrompt: {
      question: 'Who actually made the mysterious footsteps downstairs?',
      options: ['A neighbourhood burglar', 'Grandfather looking for water', 'A stray dog'],
      answerIdx: 1,
      why: 'The next morning Grandfather innocently revealed he had walked down for water, turning suspense into humour.',
    },
  },
  'english-02-poem': {
    genre: 'Poem',
    authorOrNote: 'Lucy Maud Montgomery · Didactic Poem',
    coreIdea: 'Warns cheerfully against habitual complaining—showing how the Grumble Family on Complaining Street find fault in both sunshine and rain.',
    tamilHelp: 'எப்போதும் குறை சொல்லும் பழக்கத்தைத் தவிர்த்து, மகிழ்ச்சியும் நன்றியுணர்வும் கொண்ட வாழ்க்கையைத் தேர்ந்தெடுக்க வேண்டும்.',
    beats: [
      { heading: '1. Complaining Street', detail: 'Lives in the City of Never-Are-Satisfied beside the River of Discontent.' },
      { heading: '2. Growling at Everything', detail: 'Whether weather is hot or cold, summer or winter, they growl at every station.' },
      { heading: '3. Contagious Habit', detail: 'Anyone who lingers near them starts adopting their gloomy outlook.' },
      { heading: '4. Wise Choice', detail: 'Walk with a smile and a song—never become a member of the Grumble Family.' },
    ],
    craftSpotlight: [
      { term: 'Epithet & Metaphor', example: '"City of Never-Are-Satisfied", "River of Discontent"' },
      { term: 'Anaphora / Repetition', example: 'Repeated "They growl at..." emphasizes the endless habit.' },
    ],
    quickPrompt: {
      question: 'What is the central advice at the end of "The Grumble Family"?',
      options: ['Move to another city', 'Keep smiling and avoid habitual complaining', 'Predict the weather carefully'],
      answerIdx: 1,
      why: 'The poet urges readers to stay positive and keep their feet clear of Complaining Street.',
    },
  },
  'english-02-supplementary': {
    genre: 'Supplementary',
    authorOrNote: 'Asha Nehemiah · Humorous Story',
    coreIdea: 'Dr. Somu’s multilingual pet bird Zigzag turns Dr. Krishnan’s house upside down by snoring—until it discovers its true calling calming young patients at the clinic!',
    beats: [
      { heading: '1. Unexpected Arrival', detail: 'Zigzag arrives speaking 21 languages—yet refuses to utter a word and falls asleep snoring loudly.' },
      { heading: '2. Fruit Chaos on the Fan', detail: 'Papaya and guava slices stored on ceiling fan blades splatter Mrs. Krishnan’s sunset painting!' },
      { heading: '3. Clinic Transformation', detail: 'Brought to Dr. Krishnan’s noisy clinic, Zigzag commands absolute, cheerful order among crying children.' },
      { heading: '4. Surprise Happy Ending', detail: 'The art critic loves the "abstract" painting, and the family joyfully adopts Zigzag!' },
    ],
    craftSpotlight: [
      { term: 'Situational Irony', example: 'The "disaster" bird becomes the clinic’s greatest helper and saves the painting.' },
      { term: 'Theme', example: 'Every creature thrives when placed in the right purposeful environment.' },
    ],
    quickPrompt: {
      question: 'Why did Zigzag suddenly become cheerful and active at Dr. Krishnan’s clinic?',
      options: ['Because the clinic had no ceiling fan', 'Because Zigzag loved having a purposeful role keeping children calm', 'Because Dr. Somu returned early'],
      answerIdx: 1,
      why: 'Zigzag was simply bored at home; guiding noisy patients gave him joy and purpose.',
    },
  },
};

/**
 * Clean, calm, ultra-intuitive 2D Language Craft Studio for ALL English (Units 2–7)
 * and ALL Tamil (இயல்கள் 1–3, 5–9) lessons — ZERO mismatched 3D seagulls or Unit 4 drills!
 */
export function LanguageStudioUnified2D({
  sectionId,
  sectionTitle,
  unitTitle,
  subject,
  onExplore,
}: {
  sectionId: string;
  sectionTitle: string;
  unitTitle: string;
  subject: 'english' | 'tamil';
  onExplore: () => void;
}) {
  const isTamil = subject === 'tamil';
  const [activeBeat, setActiveBeat] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [pickedOpt, setPickedOpt] = useState<number | null>(null);

  // Build tailored dataset (curated or cleanly inferred by genre & title!)
  const entry: LanguageEntry = (() => {
    if (ENGLISH_UNITS_2_TO_7[sectionId]) return ENGLISH_UNITS_2_TO_7[sectionId];

    if (isTamil) {
      const isGrammar = sectionId.endsWith('-05') || sectionId.endsWith('-04') || sectionTitle.includes('இலக்கணம்') || sectionTitle.includes('எழுத்து') || sectionTitle.includes('சொல்') || sectionTitle.includes('பொருள்') || sectionTitle.includes('யாப்பு') || sectionTitle.includes('அணி');
      const isPoem = sectionTitle.includes('கவிதை') || sectionTitle.includes('செய்யுள்') || sectionTitle.includes('குறள்') || sectionTitle.includes('புராணம்') || sectionTitle.includes('மொழியே') || sectionTitle.includes('காற்றே') || sectionTitle.includes('மலை');
      return {
        genre: isGrammar ? 'தமிழ் இலக்கணம்' : isPoem ? 'தமிழ் செய்யுள்' : 'தமிழ் உரைநடை',
        authorOrNote: `${unitTitle} · பத்தாம் வகுப்புத் தமிழ்`,
        coreIdea: isGrammar
          ? `${sectionTitle} — தமிழ் இலக்கண விதிகள், வகைகள் மற்றும் தெளிவான சான்றுகளைப் புரிந்து பிழையின்றி எழுதுதல்.`
          : isPoem
            ? `${sectionTitle} — பாடலின் மையக் கருத்து, சொல்லழகு, அணி நயம் மற்றும் வாழ்வியல் விழுமியங்களை உணர்தல்.`
            : `${sectionTitle} — உரைநடைக் கட்டுரையின் முதன்மைக் கருத்துகள், தமிழர் பண்பாடு மற்றும் அறிவியல் சிந்தனையைத் தொகுத்தல்.`,
        tamilHelp: `Study Focus (English): Explore key structure, vocabulary, and textbook examples for "${sectionTitle}" (${unitTitle}).`,
        beats: isGrammar
          ? [
              { heading: '1. இலக்கண வரையறை', detail: `${sectionTitle} என்பதன் அடிப்படை விதியை எளிய எடுத்துக்காட்டுடன் நினைவிற்கொள்ளுங்கள்.` },
              { heading: '2. வகைப்பாடு & வேறுபாடு', detail: 'உட்பிரிவுகளையும் அவற்றுக்கிடையேயான நுட்பமான வேறுபாடுகளையும் ஒப்பிடுங்கள்.' },
              { heading: '3. தொடர் பயன்பாடு', detail: 'தினசரிப் பேச்சு மற்றும் தேர்வில் பிழையின்றித் தொடர் அமைக்கும் பயிற்சி.' },
            ]
          : [
              { heading: '1. மையக் கருத்து (Theme)', detail: `${sectionTitle} பாடத்தின் முதன்மை நோக்கத்தையும் சூழலையும் உள்வாங்குங்கள்.` },
              { heading: '2. சொல் நயம் & பொருள்', detail: 'அருஞ்சொற்பொருள், இலக்கணக் குறிப்பு மற்றும் பகுபத உறுப்பிலக்கணத்தைக் கவனியுங்கள்.' },
              { heading: '3. வாழ்வியல் செய்தி', detail: 'இப்பாடம் இன்றைய மாணவருக்கு உணர்த்தும் பண்பாடு மற்றும் அறிவியல் பார்வை.' },
            ],
        craftSpotlight: [
          { term: 'தேர்வுக் குறிப்பு', example: 'சிறுவினா, குறுவினா மற்றும் நெடுவினாக்களுக்குப் பாடநூல் சான்றுகளுடன் விடையளிக்கவும்.' },
          { term: 'மொழித் திறன்', example: 'பொருளுணர்ந்து படித்தல், பிழையின்றி எழுதுதல் மற்றும் சொற்களஞ்சிய வளர்ச்சி.' },
        ],
        quickPrompt: {
          question: `${sectionTitle} பகுதியைப் படிக்கும்போது முதலில் எதைத் தெளிவுபடுத்த வேண்டும்?`,
          options: [
            'பாடத்தின் மையக் கருத்து, விதி மற்றும் எடுத்துக்காட்டுகள்',
            'பொருள் புரியாமல் மனப்பாடம் செய்தல்',
            'பக்க எண்ணை மட்டும் நினைவில் வைத்தல்',
          ],
          answerIdx: 0,
          why: 'மையக் கருத்தையும் சான்றுகளையும் புரிந்துகொண்டால் அனைத்து வினாக்களுக்கும் சுயமாகத் தெளிவான விடை எழுதலாம்.',
        },
      };
    }

    // English Units 3–7 cleanly tailored by Prose / Poem / Supplementary
    const isPoem = sectionId.includes('poem');
    const isSupp = sectionId.includes('supplementary');
    return {
      genre: isPoem ? 'Poem' : isSupp ? 'Supplementary' : 'Prose',
      authorOrNote: `${unitTitle} · TN Class 10 English`,
      coreIdea: isPoem
        ? `Explore the stanza imagery, tone, rhyme scheme, and central message of "${sectionTitle}".`
        : isSupp
          ? `Trace the turning points, character choices, and human values in "${sectionTitle}".`
          : `Unpack the narrative flow, key vocabulary, and grammar applications built into "${sectionTitle}".`,
      tamilHelp: `"${sectionTitle}" பாடத்தின் முக்கியக் கருத்து, சொற்பொருள் மற்றும் இலக்கணப் பயன்பாடுகளை எளிமையாகக் கற்றுக்கொள்ளுங்கள்.`,
      beats: isPoem
        ? [
            { heading: '1. Opening Imagery & Tone', detail: `Notice how "${sectionTitle}" sets its mood and speaker’s voice right from the first stanza.` },
            { heading: '2. Figures of Speech', detail: 'Identify Metaphor, Personification, Alliteration, and Rhyming Words across lines.' },
            { heading: '3. Central Message', detail: 'Connect the closing stanza to the poet’s enduring message for young readers.' },
          ]
        : [
            { heading: '1. Setting & Context', detail: `Understand where "${sectionTitle}" begins and what challenge the main characters face.` },
            { heading: '2. Turning Point', detail: 'Observe the key decision or discovery that shifts the course of events.' },
            { heading: '3. Takeaway & Language Craft', detail: 'Review glossary terms, idioms, and paragraph-writing cues anchored to this text.' },
          ],
      craftSpotlight: [
        { term: isPoem ? 'Appreciation Questions' : 'Paragraph & Summary Skill', example: 'Quote key phrases accurately and explain their contextual meaning in clear, active sentences.' },
        { term: 'Vocabulary & Grammar', example: 'Practice synonyms, antonyms, tense consistency, and voice transformations from this unit.' },
      ],
      quickPrompt: {
        question: `What is the best strategy to write high-scoring answers for "${sectionTitle}"?`,
        options: [
          'Connect the central theme with accurate textual events or poetic devices in your own clear words',
          'Copy unrelated quotes from another chapter',
          'Ignore vocabulary and context clues',
        ],
        answerIdx: 0,
        why: 'Understanding character motivation, poetic craft, and contextual vocabulary leads to clear, accurate answers.',
      },
    };
  })();

  return (
    <div lang={isTamil ? 'ta' : undefined} className={`space-y-4 text-xs sm:text-sm ${isTamil ? 'font-tamil' : ''}`}>
      {/* Serene Language Header Banner */}
      <div className="p-4 rounded-2xl border border-[var(--primary)]/25 bg-[var(--info-bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            {entry.genre.includes('Poem') || entry.genre.includes('செய்யுள்') ? <Feather className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            <span>{entry.genre} Studio · {entry.authorOrNote}</span>
          </div>
          <p className="text-sm font-bold text-[var(--ink)] leading-relaxed">{entry.coreIdea}</p>
        </div>
        {entry.tamilHelp && (
          <button
            type="button"
            onClick={() => { setShowHelp((v) => !v); onExplore(); }}
            className={`shrink-0 px-3 py-2 rounded-xl border text-xs font-bold ${showHelp ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
          >
            {isTamil ? (showHelp ? 'Hide English Tip' : 'English Study Tip') : (showHelp ? 'தமிழ் உதவி மறை' : 'தமிழ் உதவி')}
          </button>
        )}
      </div>

      {showHelp && entry.tamilHelp && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-400/40 text-xs sm:text-sm text-[var(--ink)] font-tamil">
          {entry.tamilHelp}
        </div>
      )}

      {/* Interactive Story / Poem / Grammar Step Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
            {isTamil ? 'படிநிலை அமைப்பு (தொட்டுப் படிக்க)' : 'Interactive Structure Explorer (Click Each Beat)'}
          </div>
          {entry.beats.map((b, idx) => (
            <button
              key={b.heading}
              type="button"
              onClick={() => { setActiveBeat(idx); onExplore(); }}
              aria-pressed={activeBeat === idx}
              className={`w-full p-3 rounded-xl border text-left transition-colors ${
                activeBeat === idx
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
              }`}
            >
              <div className="font-extrabold text-xs sm:text-sm">{b.heading}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{entry.beats[activeBeat]?.heading}</span>
            </div>
            <p className="text-sm text-[var(--ink)] leading-relaxed">{entry.beats[activeBeat]?.detail}</p>
          </div>

          {/* Literary Craft / Grammar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {entry.craftSpotlight.map((c) => (
              <div key={c.term} className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-1 text-xs">
                <div className="font-extrabold text-[var(--primary)]">{c.term}</div>
                <p className="text-[var(--text)] leading-relaxed">{c.example}</p>
              </div>
            ))}
          </div>

          {/* Quick Interactive Comprehension Check */}
          <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2.5 text-xs">
            <div className="font-extrabold text-[var(--ink)] inline-flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
              <span>{entry.quickPrompt.question}</span>
            </div>
            <div className="space-y-1.5">
              {entry.quickPrompt.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setPickedOpt(idx); onExplore(); }}
                  className={`w-full p-2.5 rounded-xl border text-left font-semibold ${
                    pickedOpt === idx
                      ? idx === entry.quickPrompt.answerIdx
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-[var(--ink)]'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-[var(--ink)]'
                      : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {pickedOpt !== null && (
              <div role="status" className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                <strong>{pickedOpt === entry.quickPrompt.answerIdx ? '✓ Spot on! ' : 'Hint: '}</strong>
                {entry.quickPrompt.why}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
