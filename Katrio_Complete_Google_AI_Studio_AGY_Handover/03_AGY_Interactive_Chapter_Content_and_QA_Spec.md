# ANTIGRAVITY (AGY) — COMPLETE INTERACTIVE CONTENT BUILD SPEC

**Document ID:** AGY-2026-11-v1  
**Product:** Katrio (provisional).  
**Mission:** Convert the scaffold's honest placeholders into validated educational activities while preserving the five textbook outlines.  
**Sources:** the five attached Tamil Nadu Class 10 textbooks, edition years in `curriculum_registry_class10.json`.  
**Handover inputs:** Google AI Studio repo, JSON registry, chapter matrix CSV, section recipe CSV, brand brief.

## 1. Non-negotiable curriculum truth

The original PRD was a PRODUCT vision, not exhaustive chapter/subtopic coverage. The current registry has 5 subjects, 72 top-level units, 113 manually read TOC lesson/section slots, 578 auto-detected numbered headings **awaiting verification**, and 1,387 curricular printed-page anchors. These counts are a navigational baseline, not certification of every body subheading or every exercise. Do not mark any book fully audited until every chapter page is visually compared with its index and source.

Coverage must be checked against all these layers:

1. Subject → Book → Strand (if any) → Unit/Chapter.
2. TOC-section → Numbered subsection → Unnumbered teaching heading.
3. English: prose, poem, supplementary, vocabulary, grammar, listening, speaking, reading, writing, composition, self-evaluation and exercises as present in the PDF.
4. Tamil: இயல், பாடப்பகுதி, கவிதை/உரைநடை/நாடகம், இலக்கணம், வாசிப்பு, மொழிப் பயிற்சி, பொருள், வினா-விடை, மதிப்பீடு where actually present.
5. Maths: each 1.1 etc section, nested subheaders, examples, exercises, mathematical reasoning, ICT corner, revision/answers as relevant.
6. Science: numbered sections/subsections, diagrams, activities, assessments, experiments, definitions, practicals, safety and glossary.
7. Social Science: history, geography, civics, economics; subheadings, maps, data tables, timelines, infographics, exercises, glossary/ICT activities.
8. Each page anchor must be either linked to a verified subsection or explicitly retained in a review queue; no silent gaps.

Do not infer that identical-looking headings in different books represent identical teaching content. `source_status=auto_extracted_review_required` means the text is a candidate; a human must confirm it. Some extracted labels end mid-line due multi-column PDF layout. Correct only after looking at the printed source page and record the correction.

## 2. Mandatory editorial process — textbook before animation

For each chapter: inspect source PDF pages (including diagrams) → list real learning outcomes → verify all section headings and examples → choose ONE explanation engine per teachable objective → produce concept outline and storyboard → validate with subject expert/teacher → implement interactive mechanics → prove with sample questions → add fallback and inclusive controls → run content and accessibility QA → publish when reviewed. Do not mechanically apply one 3D scene to every page.

**Publishing rule:** `planned` → `in_review` → `content_verified` → `interactive_qa_passed` → `published`. A title may be navigable while content is incomplete; no fake progress. For source revisions, preserve old IDs and map changed edition pages explicitly.

## 3. The universal student learning experience

Every unit contains: a 15–30-second motivation prompt (not forced), 1 visible objective, guided step-by-step exploration, freely controlled interactive area, explanation with correct terminology, a solved example or evidence panel, an untimed check, useful feedback on wrong answers, local optional flashcards and revision, an accessible non-3D path. The student can rewind, reset, pause and leave. Never imply ADHD learners are all alike; allow learners to disable effects and choose complexity.

**Suggested lesson-player shell:** breadcrumb; chapter-title and citation; left verified contents; central real scene; single prominent control; right optional Why/How panel; bottom Check & Remember; accessible alternative tabs; current editorial revision badge for editors only.

## 4. How chapters should *look and behave* by subject

| Subject/strand | Preferred visual treatment | Real student action | Prohibited shortcut |
|---|---|---|---|
| Physics | clear vectors, apparatus, measurements, axis labels | adjust one variable, predict, observe, reason | realistic graphics with incorrect physics |
| Chemistry | safe virtual bench, molecular model, calibrated labels | choose safe simulation, predict changes, balance concept | dangerous instructions, invented reactions or pseudo-results |
| Biology | clean annotated cutaways, selective transparency, scale markers | rotate/zoom, follow a path, isolate layers, sequence mechanisms | confusing anatomical paths or unnecessary gore |
| Mathematics | exact grids, mathematical notation, real unit measurements | drag, compute, check a step and explain | value-less animation or random-number questions without validation |
| English | scenes and quote/evidence references with licensed text | put events in order, annotate, compare viewpoints | copy copyrighted prose into website without clearance |
| Tamil | typographically accurate native Tamil, optional vetted audio | classify grammar, interpret poem, rebuild sentence | invented meanings, mismatched transliteration or broken glyphs |
| History | multi-perspective historical timelines and verified maps | compare evidence, trace causes and consequences | treating suffering/war as points-scoring games |
| Geography | maps with legend and dated layers, real scale | change layers, measure/locate, explain patterns | fabricated terrain/borders or undated claims |
| Civics | clear institution diagrams and workflow stories | classify roles, trace a citizen process | pretending lesson simulation is legal advice |
| Economics | sourced datasets and clearly labelled toy data | change variables, interpret trade-offs | presenting synthetic model outputs as official statistics |

## 5. Model and interaction implementation fidelity

- 2D/3D models must have a source list for structural facts, not only a pretty reference render.
- Adopt a progressive detail budget: lightweight thumbnail → simplified 2D/3D → high-detail only on explicit student request.
- For organs: chamber/valve labels and route arrows must match the textbook and review notes; a “dissect” control means non-graphic educational cutaway and layer separation, with reset and alternate diagram.
- For chemistry: maintain balances, matter conservation and safety constraints; virtual outcomes must be deterministic and explainable.
- For mathematics: canonical formula evaluator and tests must underpin plots; show coordinate system, units, limitations and each transformation.
- For English/Tamil: no synthetic audio as if it were textbook narration without quality and rights review.
- For maps/timelines: evidence, datedness, legend, territorial uncertainty and alternate descriptions are required.
- Low-end Android is a primary target. 3D Canvas should load only after deliberate request. Prefer small optimized GLB/glTF, LOD and compressed textures, with tested WebGL-unavailable fallback.
- No public user-generated content, no accounts, no behavioral fingerprinting, no personal health tracking.

## 6. Section content package contract

Store content separately from code. Recommended JSON per verified lesson:

```json
{
  "section_id": "science-14-auto-example",
  "source_pdf": "Class_10_Science_English_2024_Edition-www.tntextbooks.in.pdf",
  "source_printed_pages": [205],
  "source_verified_by": "REQUIRED_PERSON_OR_REVIEW_ID",
  "editorial_status": "draft",
  "learning_objectives": [],
  "concept_outline": [],
  "key_terms": [],
  "interaction": {
    "engine": "ModelExplorer3D",
    "version": "v1",
    "scene_id": null,
    "controls": [],
    "expected_observations": [],
    "limitations": []
  },
  "accessible_equivalent": {"mode": "labelled_svg_steps", "steps": []},
  "assessment": {"question_bank": [], "worked_feedback": []},
  "flashcards": [],
  "assets": [],
  "rights_reviewed": false,
  "subject_review_passed": false,
  "accessibility_qa_passed": false,
  "student_visible": false
}
```

The `science-14-auto-example` above is a **schema example, not a genuine curriculum section**. Replace it with an existing registry ID after source verification. Never publish placeholder arrays as if real content exists.

## 7. Code architecture and reusable engines

Use the interaction-control and progressive detail ideas from the earlier ManicksGalaxy project (orbit/zoom, labels, scientific-source provenance), without copying astronomy content or importing unnecessary 3D dependencies. Verify reuse rights before copying any assets. Maintain a stable `LessonEngine` interface with `load/prepare/mount/reset/dispose/serialize` methods, clear scene variants and source provenance; no direct textbook content baked into engine code. Suggested engines: `ScientificModel3D`, `AnatomyCutaway`, `JourneyThrough`, `Physics2D`, `CircuitWorkbench`, `ReactionLab2D`, `MoleculeBuilder3D`, `GraphSandbox`, `GeometryWorkbench`, `DataStudio`, `TimeMap`, `GeoMap`, `StoryStage`, `VerseLab`, `TamilLanguageStudio`, `FlashcardDeck`, `QuizEngine`, `ConceptGame`. Reuse, do not reimplement under every chapter. Prefer authorable JSON scene state and data-driven react components.

## 8. Main subject-by-subject implementation blueprint

Each of the **72 units** below has a bespoke proposed central experience. These are *editorial product designs* and must be checked against actual subtopics before being implemented. Under each chapter the attached `section_activity_plans.csv` lists every currently indexed subsection candidate and a recommended interaction shell. More specific tasks must be created per verified subsection, not from the chapter title alone.


### Science — 23 units

| ID / Chapter | Visual hero and main interaction | Learning evidence |
|---|---|---|
| `science-01` — Laws of Motion | Force and Newton law sandbox (Physics2D) | Manipulate mass/force/friction; show force arrows and units |
| `science-02` — Optics | Light-ray and lens workbench (RayOptics2D) | Change object position and validate image formation |
| `science-03` — Thermal Physics | Heat transfer and expansion simulator (HeatLab2D) | Predict temperature/expansion outcomes |
| `science-04` — Electricity | Build circuits and measure readings (CircuitWorkbench) | Diagnose connections and test current/voltage behavior |
| `science-05` — Acoustics | Wave and sound studio (WaveLab2D) | Tune frequency/amplitude and hear optional safe sound |
| `science-06` — Nuclear Physics | Atomic nucleus and radiation concept model (ScientificConceptModel2D) | Explain decay and risk without dangerous experimentation |
| `science-07` — Atoms and Molecules | Atoms, molecules and conservation assembly (MoleculeBuilder3D) | Explain atom counts and molecular mass calculations |
| `science-08` — Periodic Classification of Elements | Periodic table explorer (PeriodicTable2D) | Find trends and justify classifications |
| `science-09` — Solutions | Solutions mixer with concentrations (SolutionLab2D) | Estimate concentrations and distinguish solution types |
| `science-10` — Types of Chemical Reactions | Safe simulated reaction workbench (ReactionLab2D) | Predict, balance and classify reaction types |
| `science-11` — Carbon and its Compounds | Carbon bond builder (MoleculeBuilder3D) | Compare structures and properties of compounds |
| `science-12` — Plant Anatomy and Plant Physiology | Plant tissue, roots and photosynthesis zoom (PlantExplorer2D3D) | Trace processes between parts, water and light |
| `science-13` — Structural Organisation of Animals | Animal tissues and organ structures (AnatomyLayerViewer) | Compare tissues and organ organisation |
| `science-14` — Transportation in Plants and Circulation in Animals | Human heart blood-flow and xylem/phloem journey (ModelExplorer3D + JourneyThrough) | Trace circulation and transport without mislabeling flow |
| `science-15` — Nervous System | Neuron and reflex pathway switchboard (NeuralPathway2D) | Predict stimulus-response sequence |
| `science-16` — Plant and Animal Hormones | Hormone signaling network (FeedbackSystem2D) | Follow organ-to-organ hormone effects |
| `science-17` — Reproduction in Plants and Animals | Reproduction process visual timeline (LifecycleTimeline) | Sequence biological stages with age-appropriate diagrams |
| `science-18` — Genetics | Trait inheritance workbench (PunnettWorkbench) | Calculate expected ratios and distinguish genotype/phenotype |
| `science-19` — Origin and Evolution of Life | Evolution evidence tree (EvolutionTree2D) | Compare evidence and distinguish mechanisms |
| `science-20` — Breeding and Biotechnology | Selective breeding and biotechnology concept lab (TraitSelection2D) | Explain selection outcomes and bioethics |
| `science-21` — Health and Diseases | Immune response and prevention decision simulator (HealthLearning2D) | Connect causes, transmission and prevention evidence |
| `science-22` — Environmental Management | Ecosystem resources and waste flow (EcosystemFlow2D) | Predict consequences of environmental choices |
| `science-23` — Visual Communication | Digital media and visual communication studio (CommunicationStudio) | Evaluate visual messages and responsible digital choices |

### Mathematics — 8 units

| ID / Chapter | Visual hero and main interaction | Learning evidence |
|---|---|---|
| `maths-01` — Relations and Functions | Input/output machine and relation graph (GraphSandbox + drag-to-map) | Classify relations/functions and compare representations |
| `maths-02` — Numbers and Sequences | Number machine, AP/GP staircase and clock arithmetic (PatternBuilder + NumberLine) | Predict next values and justify the rule |
| `maths-03` — Algebra | Equation balance and quadratic trajectory (EquationWorkbench + Plotter) | Explain valid algebraic transformations and check roots |
| `maths-04` — Geometry | Dynamic triangles, tangents and theorem constructions (GeometryWorkbench 2D) | Show conditions that make each theorem true |
| `maths-05` — Coordinate Geometry | Map grid with draggable points and dynamic straight lines (CoordinateCanvas) | Derive distance/area/line behavior from points |
| `maths-06` — Trigonometry | Virtual building survey with angles and distance (TrigonometryFieldTool) | Select correct ratios and solve with units |
| `maths-07` — Mensuration | Unfold, slice, fill and combine solids (ModelExplorer3D + NetUnfolder) | Compare surface area and volume correctly |
| `maths-08` — Statistics and Probability | Data lab with distributions, dice and event probability (DataStudio + ExperimentRepeater) | Distinguish data spread and empirical probability |

### English — 7 units

| ID / Chapter | Visual hero and main interaction | Learning evidence |
|---|---|---|
| `english-01` — Unit 1 | Scene map of “His First Flight” and “The Tempest” (StoryStage + VerseLab) | Track character motivation, language, and theme |
| `english-02` — Unit 2 | Mystery sequencing for “The Night the Ghost Got In” (StoryStage + VerseLab) | Use textual clues to infer and sequence |
| `english-03` — Unit 3 | Perspective and voice studio for women-focused texts (StoryStage + VerseLab) | Compare viewpoints without stereotyping |
| `english-04` — Unit 4 | Interactive setting and moral-choice evidence board (StoryStage + VerseLab) | Describe settings and draw text-supported inferences |
| `english-05` — Unit 5 | Invention timeline and technology language puzzles (StoryStage + VerseLab) | Compare imagination, evidence, vocabulary |
| `english-06` — Unit 6 | Language, identity and empathy discussion studio (StoryStage + VerseLab) | Support nuanced interpretations and respectful dialogue |
| `english-07` — Unit 7 | Detective evidence and suspense scene reconstruction (StoryStage + VerseLab) | Use clues and narrative structure to justify claims |

### தமிழ் — 7 units

| ID / Chapter | Visual hero and main interaction | Learning evidence |
|---|---|---|
| `tamil-01` — அமுதஊற்று | தமிழ்மொழி சொற்கள், பாடல், உரை மற்றும் இலக்கண ஆராய்வகம் (TamilLanguageStudio) | சொல், பொருள், இலக்கணம் ஆகியவற்றைச் சூழலுடன் கற்றல் |
| `tamil-02` — உயிரின் ஓசை | இயற்கை-ஒலி கருத்து வரைபடம் மற்றும் தொடர் பயிற்சி (TamilLanguageStudio + SoundOptional) | கவிதை மற்றும் இலக்கணப் புரிதலை மேம்படுத்தல் |
| `tamil-03` — கூட்டாஞ்சோறு | விருந்து, பண்பாடு, குறள் பொருள் காட்சி அரங்கு (TamilCultureStoryStage) | பண்பாட்டையும் இலக்கியச் சூழலையும் புரிதல் |
| `tamil-04` — மணற்கேணி | மொழிபெயர்ப்பு, உரைநடை மற்றும் இலக்கணப் பயிற்சி (TamilTranslationStudio) | பொருள் மாறாமல் மாற்றிச் சொல்லுதல் |
| `tamil-05` — நிலா முற்றம் | கலை, கவிதை, இலக்கண தொகுப்பு ஆய்வகம் (TamilVerseStudio) | கவிதை/இலக்கண கூறுகளை விளக்குதல் |
| `tamil-06` — விதை நெல் | நாகரிகம், சமூக சிந்தனை, புறப்பொருள் பயிற்சி (TamilCultureStoryStage) | இலக்கியச் சூழல் மற்றும் சொற்பொருள் விளக்கம் |
| `tamil-07` — பெருவழி | அறம், நாடகம், யாப்பு மற்றும் குறள் பயிற்சி (TamilVerseStudio + DramaStage) | நயமும் பொருளும் மதிப்பீடும் இணைத்தல் |

### Social Science — 27 units

| ID / Chapter | Visual hero and main interaction | Learning evidence |
|---|---|---|
| `social-history-01` — Outbreak of World War I and Its Aftermath | World War I cause-and-consequence map (HistoricalTimeMap) | Differentiate chronology, causes and consequences |
| `social-history-02` — The World between two World Wars | Interwar world comparison map (HistoricalTimeMap) | Explain interwar social/economic changes |
| `social-history-03` — World War II | World War II chronology and consequences (HistoricalTimeMap) | Study humanitarian effects without war-as-game scoring |
| `social-history-04` — The World after World War II | Post-1945 world shifts and global organisations (TimelineNetwork) | Explain changing geopolitical relations |
| `social-history-05` — Social and Religious Reform Movements in the 19th Century | 19th-century reform movement idea cards (EvidenceTimeline) | Compare reform ideas, context, and limitations |
| `social-history-06` — Early Revolts against British Rule in Tamil Nadu | Tamil Nadu early anti-colonial events (TamilNaduHistoryMap) | Locate actors/events and explain context |
| `social-history-07` — Anti-Colonial Movements and the Birth of Nationalism | Anti-colonial network and nationalism timeline (HistoricalTimeMap) | Recognize interlocking regional developments |
| `social-history-08` — Nationalism: Gandhian Phase | Gandhian movement decision and consequence tree (EvidenceTimeline) | Interpret nonviolent mobilisation and context |
| `social-history-09` — Freedom Struggle in Tamil Nadu | Tamil Nadu freedom struggle layered timeline (TamilNaduHistoryMap) | Name events/figures with documented evidence |
| `social-history-10` — Social Transformation in Tamil Nadu | Social change in Tamil Nadu then-and-now evidence gallery (EvidenceGallery) | Recognize continuity, change, and diverse contributors |
| `social-geography-01` — India - Location, Relief and Drainage | India terrain, rivers and drainage layered map (GeoMap2D3D) | Identify relief features and drainage patterns |
| `social-geography-02` — Climate and Natural Vegetation of India | Climate, rainfall and biome controls (ClimateGeoMap) | Interpret seasonal causes and natural vegetation |
| `social-geography-03` — India - Agriculture | Crop/soil/season/agriculture map (AgricultureMap) | Explain environmental and human agricultural drivers |
| `social-geography-04` — India - Resources and Industries | Resource extraction to industry chain (ResourceFlowMap) | Trace raw materials and impacts |
| `social-geography-05` — India - Population, Transport, Communication and Trade | Population, trade and transport route map (FlowMap) | Interpret migration/transport data responsibly |
| `social-geography-06` — Physical Geography of Tamil Nadu | Tamil Nadu landform, river and climate atlas (TamilNaduGeoMap) | Identify physical geography accurately |
| `social-geography-07` — Human Geography of Tamil Nadu | Tamil Nadu settlement and economic activity map (TamilNaduGeoMap) | Connect population and resource use |
| `social-civics-01` — Indian Constitution | Constitution concept and rights/duties explorer (CivicConceptExplorer) | Explain constitutional values without legal advice |
| `social-civics-02` — Central Government | Union government institutional relationship map (GovernmentOrgMap) | Describe separation of roles accurately |
| `social-civics-03` — State Government | State government institutions and responsibilities (GovernmentOrgMap) | Map functions and citizen processes |
| `social-civics-04` — India’s Foreign Policy | Foreign policy choices and documented objectives (PolicyConceptMap) | Explain terms and evidence-based constraints |
| `social-civics-05` — India’s International Relations | International bodies and bilateral relationships (NetworkMap) | Map facts with dated references |
| `social-economics-01` — Gross Domestic Product and its Growth: an Introduction | GDP production/services concept sliders (DataStory) | Read GDP without inventing official statistics |
| `social-economics-02` — Globalization and Trade | Trade and globalization supply-chain path (FlowMap) | Explain who contributes and who is affected |
| `social-economics-03` — Food Security and Nutrition | Farm-to-table food security chain (FoodSystem2D) | Identify supply, access and nutrition concepts |
| `social-economics-04` — Government and Taxes | Simple household budget and tax allocation (BudgetSimulator) | Interpret tax concepts without real tax advice |
| `social-economics-05` — Industrial Clusters in Tamil Nadu | Tamil Nadu industrial clusters locator (GeoDataMap) | Locate industry clusters using verified sources |

## 9. Subsection completeness and textbook verification process

**For every one of the imported subsections** in `section_activity_plans.csv`:

1. Navigate the source PDF at `pdf_page` or source page index, view diagrams when applicable, and decide whether the candidate heading is actual; correct split/duplicated entries.
2. Record `source_heading_verified`, source printed-page range, source image/table references, editor, revision date and school learning objective. Do not invent a title if PDF extraction is broken.
3. Split overly long sections into concept cards only if these remain under their parent verified title and are marked `editorial_subtopics` rather than new textbook sections.
4. Select interaction: first choose best medium (text/diagram/manipulative/2D/3D). Reserve 3D for spatial learning; never force 3D for poem comprehension or straightforward arithmetic.
5. Add two playable modes: **Guided** (one task at a time) and **Explore** (student-controlled). Both must have equivalent accessible paths.
6. Build an explanation & error-feedback path verified with actual examples; ensure challenges are educational, not random reward loops.
7. Add an untimed assessment, optional flashcards and a concise visual summary. Mark attempts locally; do not maintain server-side learner profiles.
8. Link source page anchors to this section; if any source page still has no heading link, retain it in an audit queue and report the gap.
9. Validate devices, keyboard, touch, WebGL-off, reduced-motion and Tamil glyph correctness. Verify textbook edition before publishing.

## 10. Six pilot experiences: acceptance criteria

1. **Science 14 Heart and circulation:** correctly identified chambers and major vessel paths; 2D/3D rotate, cross-section, transparent layers, blood path arrows, reset, screenreader step list; no anatomical false labels. The broader digestive-system journey is valuable but is not represented as a Class 10 textbook chapter without separate curriculum mapping.
2. **Science 10 Chemical reactions:** safe model, input selection, deterministic outcome, balanced equations verified by chemistry teacher, prediction/explanation/quiz; not a guide to mixing chemicals in real life.
3. **Maths 6 Trigonometry:** building height adjustable using simulated clinometer measurements, graph and working formula with units, deliberately test tricky cases and invalid angles.
4. **English 1 His First Flight:** licensed/reworded story-scene evidence, sequence puzzle, vocabulary, comprehension, poem and supplementary navigation, reduced-motion setting.
5. **Tamil 4 மணற்கேணி:** native Tamil grammar and translation activities, vetted cultural/literary explanations, human-audited text, no romanization-first design.
6. **Social History 1 WWI:** evidenced timeline, cause/effect cards, location map; avoid trivialized battle point scores; distinguish disputed interpretations.

## 11. Quality gates and measurable acceptance

- **Curriculum:** all 72 unit routes remain; all 113 verified TOC section slots accounted for; all 578 auto candidates human-audited (approve/correct/reject); additional missed unnumbered sections added; every curricular source page reviewed.
- **Truthfulness:** no hallucinated experiment, historical date, formula or Tamil meaning; documented sources, reviewer and lesson revision date.
- **Mechanics:** controls have observably correct, tested changes; scene load/reset/dispose works; separate user-visible “planned” vs “published”.
- **Learner experience:** interaction optional, no timer by default, constructive wrong-answer feedback, no gamified shame, 2D/text and audio alternatives.
- **Access:** WCAG 2.2 AA audit including visual contrast, names/roles, focus order, dragging alternatives, reduced-motion, captions, no motion-only tasks.
- **Efficiency:** static-first deployment, route refresh on Cloudflare Pages, lazy-load 3D, real-device budgets, offline optional after versioned packaging.
- **Privacy:** opt-in device-local state only, reset/export/import properly tested, no hidden learner tracking; if future analytics are added, separate consent and minors safeguards review.
- **Legal:** check textbook and asset licenses before reproducing any textbook text/images; attribute permitted sources; do not imply government endorsement.

## 12. AGY execution prompt (paste with the repo and files)

```text
Audit the supplied Katrio static scaffold against the FIVE attached Class 10 Tamil Nadu textbooks, the registry JSON, and the chapter/subsection CSV plans. First produce a source-to-route coverage report covering every unit, all table-of-contents entries, internal headings, exercises and source pages. Compare visually with PDF pages wherever parsing garbles headings (especially Tamil and two-column science/social pages). Do not change code or invent lesson text without listing proposed changes and asking the founder for permission if the change expands scope, alters source headings, rebrands the product or introduces backend costs.

Then implement the six agreed pilot experiences using genuinely accurate, tested 2D/3D interactions and accessible equivalents. Maintain original stable route IDs and status gating. Give each pilot a technical storyboard, model/reference provenance, student learning goal, controls, computational test cases, a worked explanation, flashcard/quiz draft and QA checklist. Separate engines from lesson JSON. Source credit and copyright must be reviewed before copying text or illustrations. Keep no-login static deployment. At end, supply changed-file list, automated test results, every remaining unverified source heading and a human subject-review checklist.
```

## 13. Delivery order for the whole curriculum

**Pass 0:** complete source heading verification across five books.  
**Pass 1:** six pilot lessons with accessible equivalents.  
**Pass 2:** complete one representative chapter per subject through every subtopic/exercise.  
**Pass 3:** expand by engine reuse, not by generating arbitrary 3D content.  
**Pass 4:** first subject completely verified and peer-reviewed; move to remaining subjects.  
**Pass 5:** teacher testing, child accessibility feedback, performance and legal review, production release.

## 14. Required completion report format

```text
Book: <subject, edition>
Total source units / chapter count: <n>
TOC entries verified: <n / expected>
Auto-extracted headings approved / corrected / rejected: <counts>
Previously missed headings discovered: <n, with pages>
Printed curricular pages audited: <n / expected>
Source page anchors with verified section linkage: <n / total>
Lesson player implemented: <n>
Interactive mechanisms validated: <n>
2D/text alternatives validated: <n>
Human subject reviewer approved: <n>
Unresolved blockers (source page and reason): <explicit list>
No features silently marked as finished.
```

## 15. Standards and explicit limitations

Accessibility targets: W3C WCAG 2.2 AA (`https://www.w3.org/TR/WCAG22/`), CAST UDL 3.0 choice/multiple representation (`https://udlguidelines.cast.org/`). These standards are design inputs, not proof that the finished implementation complies. Source-book edition and content review must happen independently. This handover does not license copyrighted textbook material and does not certify educational accuracy before teacher review.
