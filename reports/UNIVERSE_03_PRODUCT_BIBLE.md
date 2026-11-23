# Katrio Learning Universe — Product & Pedagogy Bible

**Document ID:** `UNIVERSE_03_PRODUCT_BIBLE`  
**Version:** 1.0 (Gate 1 Proposal — Awaiting Owner Sign-Off)  
**Product Promise:** *Don't just read the lesson. Step inside it. Experiment. Discover. Explain. Solve. Remember.*  
**Non-Negotiable Outcome:** The student can **explain the concept in their own words** and **apply it to an unfamiliar new problem** — not merely watch animations or click sliders.

---

## 1. Product Vision: Science Museum Meets Animated Storybook

Katrio transforms Tamil Nadu State Board Class 10 from 694 isolated syllabus pages into a **connected Interactive Learning Universe** built around **five accessible subject worlds plus a Cross-Subject Challenge Arcade**:

1. **Science Discovery World** — Physics experiment hangar, safe chemistry reaction studio (3D beakers/molecules synced with crisp 2D process flowcharts), clinical 3D+2D anatomy theatre, and living systems/ecology investigations.
2. **Mathematics Workshop** — Constrained 2D geometry proof studio, number-pattern playground, algebra function & matrix machine, 3D mensuration solids & unfolded nets, and trigonometry surveying missions.
3. **English Story Universe** — Illustrated 2D story worlds, prose conflict investigations, poetic-device studio, memoriter poem trainer, contextual vocabulary games, grammar workshop, and evidence-backed creative prompts.
4. **Tamil Language & Literature World** — First-class Tamil typography (`Noto Sans Tamil`), literary landscapes, செய்யுள் / உரைநடை phrase-to-meaning maps, interactive இலக்கணம் grammar builders, poetic metre & மனப்பாடப் பகுதி trainers, and reviewed audio where feasible.
5. **Social Science Time & Earth World** — Dated, source-grounded 2D historical maps & causal timelines, NASA satellite geography layers (+ optional 3D SRTM terrain relief profiles), constitutional democracy scenarios, and economics budget/tax simulations.
6. **Cross-Subject Challenge Arcade** — Authentic real-world Tamil Nadu capstone missions (e.g., *Design a Sustainable Tamil Nadu Town*) uniting 2–5 verified textbook concepts across subjects, with clear prerequisites and transparent enrichment tags.

### Visual Identity & Art Direction
- **Bright, Warm & Inviting — Never a Generic Dark 3D Dashboard:** Honors Katrio's daylight brand palette in [`src/styles/tokens.css`](file:///c:/Users/hp/Desktop/katrio-—-class-10-interactive-visual-learning/src/styles/tokens.css) (`--canvas: #F7F9FE`, `--surface: #FFFFFF`, `--ink: #13213A`, `--primary: #4255D4`) with clear subject accents (`--science: #0B7773`, `--math: #7155C8`, `--english: #3478C0`, `--tamil: #C04F75`, `--social: #9B631F`, `--arcade: #C35243`) plus verified Dark and High-Contrast accessibility themes.
- **Subject-Appropriate Visual Tone:** Chemistry beakers & molecules are bright, crisp, and glass-like (no dark opaque blobs); Biology diagrams are clinical, clear, and respectful; Social Science maps use accurate NASA coastlines with dated legends; English and Tamil look like curated illustrated editions.
- **One Active Control Cluster at a Time:** Calm visual hierarchy that removes extraneous cognitive load while keeping exploration deeply rewarding.

---

## 2. Three Linked Architecture Layers & Learning Modes

Katrio operates on **three cleanly separated, cross-linked layers** (so content scales without copying UI code):

1. **Curriculum Map (Syllabus Truth):** Exact TN Class 10 textbook units (`72`), canonical section routes (`694`), source PDF editions, printed pages, PDF pages, figures, tables, examples, activities, and end-of-unit exercises.
2. **Concept Graph (Meaning & Dependencies):** Explicit concept nodes with typed directed edges (`prerequisite_of`, `causes`, `contrasts_with`, `applied_in`, `connects_across_subject`) explaining *why* ideas connect (e.g., *Science 4.3 Electric Potential* + *4.4 Ohm's Law* → *4.8.1 Joule's Law* → *Science 22.8 Electrical Energy Management*).
3. **Experience Graph (Interactive Quests & Engines):** Reusable 2D/3D/Language/Scenario engines driven by validated exact-section manifests containing micro-missions, predictions, worked examples, transfer challenges, flashcards, and creative tasks.

### Three Student-Controlled Study Modes (Zero Content Gating!)
- **Explore Freely (World View):** Enter any subject world's interactive 2D Concept Island Map (with optional lightweight portals) and follow curiosity across connected concepts.
- **Follow the Textbook (Syllabus View):** Jump straight to any exact TN Class 10 chapter, section number, or printed page via ordered chapter lists, instant English/Tamil search, or direct URL deep link.
- **Focus Mode:** Hides peripheral navigation and world chrome so one calm learning task fills the screen (ideal for neurodivergent learners, classroom projectors, and small phones).

> **Strict Open-Access Rule:** Never lock any chapter, tab, or mission behind XP, badges, accounts, previous completions, or 3D hardware capabilities. Every one of the `694` deep links works immediately with keyboard, touch, screen reader, and low-end Android phones.

---

## 3. Representation Philosophy: Pedagogy First, Zero Arbitrary 3D Quota

Katrio rejects BOTH extremes: neither forcing unhelpful 3D into every page NOR artificially capping 3D at 5.8% (40 routes). Every subsection chooses its representation strictly by **what makes students understand fastest and enjoy learning most**:

| Representation Type | When to Choose It | Mandatory Standards |
| :--- | :--- | :--- |
| **`interactive-2d`** | Proofs, equations, graphs, circuits/schematics, clinical biology systems (Leech/Rabbit, hormones, gametes, genetics Punnett), dated historical maps, thematic geography maps, Scratch blocks. | Mathematical/scientific invariants verified to `< 1e-6`; responsive SVG with zero label collision on 360 px mobile; keyboard stepper parity for every drag handle. |
| **`synchronized-2d-3d`** | Spatial depth, 3D geometry/nets, molecular bond angles, layered anatomy, cutaway reaction vessels/furnaces, optical/acoustic/gas-piston chambers, SRTM terrain elevation — **where 3D reveals spatial structure AND a synced 2D diagram/flowchart/net reveals exact rules/equations.** | One-sentence pedagogical justification; labelled 3D hit-targets; camera presets; pause/reset; lazy-loaded compressed assets; explicit `3D Model \| Diagram \| Description` toggle inside the viewer; graceful WebGL fallback. |
| **`interactive-3d`** | Pure spatial inspection only when standalone 3D suffices (rare; Katrio prefers `synchronized-2d-3d` so learners always see exact formulas/schematics alongside the 3D view). | Same strict 3D hit-target, performance, and 2D/text parity rules. |
| **`interactive-language`** | All English prose, poems, supplementary, memoriter poems, grammar; all Tamil செய்யுள், உரைநடை, விரிவானம், இலக்கணம், மொழிபெயர்ப்பு. | Illustrated 2D storyboards, character-choice maps, poetic-device highlighters, visual Tamil grammar trees, native `Noto Sans Tamil` rendering, optional reviewed audio transcripts. **Zero decorative 3D pillars or generic animals in lessons.** |
| **`scenario-game`** | Civic constitutional decisions, economic budgets/taxes, environmental resource management, clinical health decisions, and cross-subject capstone towns. | Transparent real-world simplifications; clear distinction between textbook historical examples and current law; never invent official tax rates or unsafe lab procedures. |

### Control Quality Rule
Every slider, toggle, or draggable handle must alter a **scientifically, mathematically, or narratively meaningful variable** with:
- Labelled SI/subject units and physically valid bounds (plus informative boundary diagnostics, e.g. `0°`/`90°` in trigonometry);
- Visible immediate cause-and-effect + concise `"What changed & why?"` explanation;
- Reset button, pause toggle for animations, keyboard/button equivalent for any drag, and zero fabricated precision.

---

## 4. Gameful "Learning Quest" System (Engaging Without Manipulative Loops)

### Six Ethical Game Mechanics
1. **Concept Micro-Missions (2–8 min, untimed):** Concrete, testable goals (e.g., *"Quadruple heat output using current only"*, *"Keep DE parallel to BC while making AD = 2·DB"*, *"Balance lead nitrate + potassium iodide until every atom bar turns green"*).
2. **Discovery Interactions:** Rotate, dissect, heat/cool, measure, compare viewpoints, construct grammar trees, trace borders, and test predictions before seeing explanations.
3. **Honest Progression Without Pressure:** Strictly separate four states stored locally on device (`visited` → `explored` → `practised` → `understood`). Optional discovery stamps/mastery badges unlock **only** upon verified understanding — never from clicks, slider drags, time-on-site, or daily streaks.
4. **Smart Subsection Practice:** Exact-section question banks with item-level diagnostic explanations for wrong answers, equivalent numeric variants, tiered hints, keyboard parity, and local spaced-review reminders — 100% static with zero runtime AI API cost.
5. **Creative Achievements:** Local-only hypothesis notes, *"teach it back in your own words"* prompts, alternate story-ending drafts, custom budget allocations, and JSON progress/notes export/import. Zero personal data collected.
6. **Cross-Subject Connections ("Why This Matters Elsewhere"):** Valid conceptual links showing how textbook chapters work together in Tamil Nadu and the real world.

### Three Engagement Layers
- **Layer 1 — Lesson Micro-Game:** 1–5 minute concept challenge inside Tab 1 & Tab 3.
- **Layer 2 — Chapter Quest Chain:** 3–7 linked missions per chapter culminating in an integrative chapter challenge (all lessons directly enterable out of order).
- **Layer 3 — Universe Capstone Mission:** Optional multi-subject challenge in the Challenge Arcade uniting 2–5 textbook subsections with checkpoints, hints, local save/resume, and a reflective *"What did I learn?"* summary.

> **Zero Dark Patterns:** No countdown timers by default, no daily streak loss penalties, no public leaderboards for minors, no ads, no third-party tracking, no autoplay audio, no forced logins.

---

## 5. Honest 5-Tier Quality Model & Rights Governance

Every single one of the `694` routes displays a truthful, tasteful quality tier — never marking an indexed placeholder as a finished playable lesson:

| Quality Tier | Exact Requirement to Earn This Tier | Current Verified Count (2026-11-23) |
| :--- | :--- | :---: |
| **`indexed`** | Canonical route, textbook page anchor, and title registered (may await source verification). | `488` |
| **`explained`** | Verified heading + original paraphrased explanation + clean topic-specific accessible summary. | `93` |
| **`interactive`** | Functional, concept-specific 2D/3D/Language/Scenario experience + tested accessible alternative (zero cross-topic leakage or stale fallback). | `60` |
| **`assessed`** | Validated worked example + independent unfamiliar transfer challenge + 5+ distinct retrieval flashcards + strict mastery check. | `53` |
| **`educator_approved`** | Independent TN subject teacher (and Tamil educator for Tamil lessons) verified scientific/linguistic accuracy, copyright clearance, and low-end mobile QA. | **`0`** *(explicitly tracked until real human review!)* |

### Syllabus Scope vs. Beyond-Books Enrichment
- **For the Exam (Syllabus Core):** Anchored strictly to the five verified 2024–2025 TN Class 10 textbooks (`10th-Books/`), preserving board-exam academic vocabulary, SI units, formulas, and page numbers.
- **Understand Deeply:** Intuitive ELI5 analogies expandable to full academic precision, common misconception contrasts, and cause-effect reasoning.
- **Explore Further (Clearly Tagged Beyond Syllabus):** Real-world engineering, Tamil Nadu context (ISRO, Pamban Bridge, Muppandal Wind Corridor, Tiruvakkarai Fossils, Thoothukudi salt pans), and interdisciplinary missions — always badged *"Explore Further (Beyond Board Syllabus)"* with credible independent citations.
- **Copyright Discipline:** All 5 PDFs carry `© SCERT 2019 · NOT FOR SALE` and modern literary pieces carry third-party copyrights. Katrio publishes **only original paraphrased explanations, original SVG/3D assets, public-domain classics, and page-anchored citations** — never verbatim copyrighted textbook prose, poems, or scanned textbook diagrams.

---

## 6. Typed Exact-Section Experience Manifest & 8 Reusable Engines

To eliminate fragile `startsWith(...)` dispatcher hacks, Katrio introduces a versioned **Exact-Section Experience Manifest** (`ExperienceResolver(sectionId) -> exact manifest -> LessonPlayer`) backed by automated CI validation (`npm run validate:universe`):

```ts
export interface UniverseLessonManifest {
  sectionId: string;                 // Exact canonical ID from curriculum_registry_class10.json
  conceptIds: string[];              // Nodes in the Concept Graph
  curriculumVersion: 'tn-class10-2024-2025-v2';
  sourcePdfRef: { book: string; edition: string; printedPages: number[]; pdfPages: number[]; officialUrl?: string };
  editorialStatus: 'indexed' | 'explained' | 'interactive' | 'assessed' | 'educator_approved';
  title: string;
  studentQuestion: string;           // 1-line curiosity hook
  prerequisites: { sectionId: string; why: string }[];
  objectives: string[];
  explanations: { simple: string; rigorous: string; examPoints: string[]; tamilAssist?: string };
  misconceptions: { myth: string; reality: string; whyItHappens: string }[];
  conceptMap: { nodes: ConceptNode[]; edges: { from: string; to: string; relationship: string }[] };
  representation: {
    choice: 'interactive-2d' | 'interactive-3d' | 'synchronized-2d-3d' | 'interactive-language' | 'scenario-game';
    whyThisRepresentation: string;
    accessibleAlternative: string;
  };
  assets: { id: string; path: string; license: string; attribution: string; accuracyReviewed: boolean }[];
  engineId: '2DLabEngine' | '3DObjectEngine' | 'CombinedSceneEngine' | 'StoryLanguageEngine' | 'TimelineMapEngine' | 'MathProofEngine' | 'ScenarioQuestEngine' | 'ReviewFlashcardsEngine';
  variantId: string;
  config: Record<string, unknown>;
  variableRules?: { id: string; label: string; unit: string; min: number; max: number; step: number }[];
  quest: { missionTitle: string; goal: string; playerAction: string; successCheck: string; hintLevels: string[] };
  workedExamples: WorkedExampleSpec[];
  practice: PracticeQuestionSpec[];
  transferCheck: TransferProblemSpec[];
  flashcardDeck: FlashcardSpec[];    // Minimum 5 genuinely distinct prompts (why/how/diagram/apply/contrast)
  funFacts?: { text: string; source: string }[];
  textbookLinks: { sectionHeading: string; printedPages: number[]; exerciseRefs: string[] };
  textbookChunkReferences: { chunkTitle: string; paraphrasedSummary: string; glossary: { term: string; meaning: string; tamil?: string }[] }[];
  beyondSyllabusNotes?: { title: string; summary: string; source: string }[];
  performanceBudget: { maxInitialKb: number; maxLazyAssetMb: number };
  progressRules: { exploreTrigger: string; practiseTrigger: string; masteryTrigger: 'pass_unfamiliar_transfer' };
}
```

**Automated CI Rejection Rules (`scripts/validate-universe.ts`):** Reject any manifest marked `interactive` or higher if it has mismatched `unit_id/section_id`, cross-domain fallback text, missing accessible alternative, `< 5` distinct flashcards on `assessed` routes, missing transfer problem, unattributed assets, or `educator_approved` without reviewer metadata.

---

## 7. Learning Science & the 15-Point Gold-Standard Playability Test

Every design decision draws on validated educational research (worked examples with faded scaffolds, predict-observe-explain, spaced retrieval across varied formats, self-explanation prompts, and extraneous cognitive-load management) — never pseudoscientific "attention hacks".

Before any pilot or chapter batch is promoted, it must pass all **15 binary Pass/Fail checks**:

1. Exact textbook section ID & verified printed/PDF page anchors (or explicitly flagged pending verification).
2. One-line purpose clearly tells the learner what they will discover.
3. Meaningful input alters a concept-specific output with accurate units, formulas, and bounds.
4. Accessible 2D/text/keyboard alternative exists for every 3D or drag action.
5. Error-specific diagnostic feedback and tiered optional hints appear on mistakes.
6. Source-verified plain-language explanation expands cleanly to rigorous academic & exam vocabulary.
7. Interactive concept map displays explicit typed relationships (causal/spatial/semantic), not unlabelled spokes.
8. Includes at least one revealable worked example + one independent unfamiliar transfer problem with full reasoning.
9. Contains `≥ 5` genuinely distinct retrieval flashcards (not reworded copies of one definition).
10. Animations/stories can be paused; touch targets are `≥ 44×44 px` with zero precision-drag traps on mobile.
11. Opening a route or moving a slider records `visited`/`explored` only — **never** `understood/mastered`.
12. Offline/static build and `reduced-motion` behaviour tested directly when claimed.
13. Subject educator (and Tamil educator for Tamil) confirms scientific/linguistic accuracy and rights clearance before `educator_approved`.
14. Asset payloads & mobile load time measured, not assumed.
15. Student validation protocol checks whether learners can (a) locate the concept, (b) predict outcomes, (c) explain mechanics in their own words, (d) solve a fresh transfer problem, (e) recall later, (f) map back to the textbook passage, and (g) complete smoothly on low-end Android.
