# INTERACTIVE VISUAL LEARNING PLATFORM
## Product Requirements Document — Version 1.0

**Working title:** Interactive Visual Learning Platform (brand/name not yet selected)  
**Document date:** 05 November 2026  
**Status:** Proposed product specification — not implemented  
**Owner:** Founder / product lead  
**Starting syllabus:** Tamil Nadu State Board, Class 10; five user-supplied textbooks (English, Mathematics, Science, Social Science, Tamil)  
**Delivery model:** One unified static-first website, no required account, optional offline learning  
**Guiding promise:** **Don't just read the lesson. Step inside it.**

> **Product decision:** Build ONE educational platform, NOT one codebase or domain per subject. Give each subject its own world, chapter index and interaction vocabulary while reusing the same accessibility, activity, assessment, content and performance engines. Use 3D only when spatial manipulation genuinely helps understanding; use 2D, text, audio and tactile-friendly controls when they teach better.

---

# 1. Executive product brief

## 1.1 The learner problem

Many students can repeat definitions but struggle to imagine an invisible process, see causality, connect a mathematical formula to real life, track a historical sequence, or understand a story's structure. Long text, crowded pages, autoplaying media, intricate controls and high-stakes quiz feedback can create additional barriers for learners with attention differences, reading difficulties, low bandwidth or limited confidence.

Existing textbooks contain learning objectives, diagrams, activities, exercises and ICT references. This product should provide a parallel **interactive explanation layer**, not an unapproved replacement textbook or an unrelated collection of mini-games.

## 1.2 Vision and mission

**Vision:** A learner can enter a heart, build a molecule, control a physical experiment, manipulate a graph, act inside a story, travel through a timeline, and leave knowing *why* something works.

**Mission:** Turn each curriculum concept into an accurate, joyful and accessible experience with a clear learning objective, a manipulable model where appropriate, short guided practice, and low-pressure evidence of understanding.

**ADHD-informed, not ADHD-exclusive:** Design for predictable navigation, low-clutter screens, visible progress, meaningful choices, micro-steps, pausing, instant explanatory feedback and sensory controls. No diagnosis, disability inference, promise to treat ADHD, or claims that a specific game helps every ADHD learner. Test with a diverse group of students and educators.

## 1.3 Goals and measurable proof

1. A student reaches a relevant lesson from the homepage in no more than **three purposeful selections** (goal, not a measured result).
2. Every released interactive lesson teaches a documented curriculum objective and includes **Explore**, **Explain**, **Try**, **Check**, **Recap**.
3. Every required interaction has a **non-3D alternative** that teaches the same assessed concept.
4. The website remains functional without an account, backend API or persistent analytics identifier.
5. A student can finish one coherent activity in approximately **3–8 minutes**, or pause and return; complex simulations may extend beyond this.
6. Improve conceptual understanding, not mere clicks: each pilot unit has a small pre/post concept check, teacher review, and an accessible alternative.

## 1.4 Not in initial scope

An LMS; school accounts; mandatory profiles; live chat; social networking; surveillance or ADHD detection; generative-AI answers as a default teacher; paid rewards; manipulative streaks; multiplayer; fully realistic VR; every chapter as a 3D world; real hazardous lab instructions; claims of official school-board endorsement.

---

# 2. Product and website strategy

## 2.1 Decision: one website, many subject worlds

| Choice | Benefits | Costs / decision |
|---|---|---|
| One unified website **RECOMMENDED** | One search, sitemap, shared design system, lesson engine, performance framework, progress import/export, accessibility settings; easier cross-subject links | Needs careful modular boundaries and content governance |
| One separate website per subject | Independent branding / team release | Duplicates quiz engine, settings, UI, navigation and SEO; fragments learner experience |
| One giant 3D application | Immersive visual consistency | Slow on low-end devices; wrong format for language, timelines and some mathematical concepts |

**Recommended URL shape:** `/class/10/science/14/circulation/heart`, `/class/10/maths/6/heights-and-distances`, `/class/10/english/1/his-first-flight`, `/class/10/tamil/3/...`, `/class/10/social-science/history/3/...`. Add language query or route segment only after translation strategy is finalized. All pages must have stable, readable URLs and static metadata.

## 2.2 Core navigation

**Home → Choose class → Choose subject → Choose chapter → Choose topic → Choose learning mode.** Alternate navigation: global search, skill search (`graph`, `blood flow`, `tenses`), and short curated discovery tours. The Learning Arcade should be a **view over curriculum-tagged activities**, not a separate source of truth.

Subject worlds: Science Lab (Physics, Chemistry, Biology); Mathematics Playground; English Story Studio; Tamil Language & Literature Studio; Social Science Time-and-Place Atlas; Revision Arcade. Suggested subject skins differ in accents/icons but share controls and accessibility semantics.

## 2.3 Class expansion

Design the schema for multiple boards, standards, languages and editions, but publish **Tamil Nadu Class 10 first**. The requested digestive-travel lesson is a high-potential future demonstration, but it is **not listed as a standalone unit** in the uploaded Class 10 Science table of contents; do not claim its coverage is directly derived from that volume. A cross-grade or enrichment pathway can legitimately host it once another curriculum source is mapped.

---

# 3. Source basis and curriculum governance

## 3.1 Materials inspected

- **Science:** Tamil Nadu Government Standard Ten Science, supplied 2024 reprint; 23 units, including electricity, optics, reactions, anatomy, circulation, nervous system, genetics and environmental management (PDF pp. 6–7).
- **Mathematics:** Tamil Nadu Government Standard Ten Mathematics, supplied 2025 revised edition; 8 chapters, including relations/functions, algebra, geometry, coordinate geometry, trigonometry, mensuration, statistics/probability (PDF pp. 5–6).
- **Social Science:** supplied 2025 revised edition; four strands: History (10), Geography (7), Civics (5), Economics (5), 27 units total (PDF pp. 4–5).
- **English:** supplied 2024 reprint; 7 thematic units each with prose, poem and supplementary selections (PDF p. 4).
- **Tamil:** supplied 2025 edition; 7 thematic `இயல்` units mixing prose, poetry, supplementary text and grammar (PDF pp. 8–9).
- **ManicksGalaxy:** user-supplied ZIP, inspected as a **technical reference**, not a licensed source of the curriculum. Existing React/Vite/TypeScript/Three.js implementation demonstrates orbit controls, touch/pointer models, local preference and progress state, quiz patterns, reading-depth levels, science labels, provenance tiers, image assets and reduced-motion awareness.

**Source distinction:** Chapter names are drawn from supplied textbooks. Every proposed game, simulation, cognitive design choice, metric, model and roadmap item in this PRD is a new product proposal, not a claim that the government textbooks prescribe it.

## 3.2 Curriculum model and editorial rule

Every published `lesson` record must connect to: board + standard + subject + strand + chapter/unit + source edition + specific concept + learning outcome + prerequisites + verified explanation + interaction type + objective check + accessibility fallback + reviewer approval + version. Where a textbook has no chapter-level result at a finer granularity, an educator must derive and approve topic objectives; never assume a whole book's PDF can be auto-converted into perfect lessons.

**Copyright / attribution:** `NOT FOR SALE` on a government PDF does not by itself prove an unrestricted reuse license. Before reproducing extensive text, page scans, literary works, illustrations, audio narration or translated passages on a public site, obtain or document the applicable permissions/rights. Prefer original wording, independently produced diagrams and brief factual topic references with attribution; specifically review rights for poems and prose selections. The site must not suggest official Tamil Nadu government approval without authorization.

---

# 4. Learners, educators and usage context

| Persona | Typical need | Product response |
|---|---|---|
| Curious student | Understand something spatial or abstract | Explore first, labels on demand, change one variable |
| Student with attention regulation difficulty | Avoid overload, reduce initiation friction | One objective per screen, mini checkpoints, no unsolicited animation |
| Student who reads slowly or struggles with dense text | Understand without decoding large blocks | Narration optional, short text, visual sequence, captions, glossary |
| Student on budget Android device | Useful learning with intermittent network | Static pages, device-aware lazy loading, 2D fallback, offline packs |
| Tamil/English bilingual learner | Learn without translation friction | First-class Tamil script, language toggle when reviewed translations exist |
| Teacher / parent | Find activities and explain concepts accurately | Curriculum map, teacher notes, projection mode, printable one-page recap |
| Screen-reader / keyboard user | Full participation without mouse gestures | Semantic descriptions, equivalent controls, text/step simulation |

**No diagnosis assumptions:** Accessibility settings are learner preferences. Never categorize, track, identify or expose users as having ADHD or any other condition.

---

# 5. Student experience and lesson design

## 5.1 Default lesson sequence

1. **Hook (15–30 seconds):** A single question with a motivating visual. Example: “Why does blood move one way through the heart?”
2. **Predict:** Learner chooses one expectation. No grading penalty.
3. **Explore:** Manipulate the model; replay and pause.
4. **Explain:** Focused labels, voice-over *only when enabled*, small readable steps, optional deeper detail.
5. **Try:** Make one decision or construct a solution.
6. **Check:** One or two conceptual questions with *why* feedback; allow retry.
7. **Recap:** Three durable ideas, one transfer-to-real-life question, optional download/review.

A lesson is *complete* when its learning evidence is met, not because a 3D object was rotated or a timer elapsed. Learners can use Explore and skip scoring if they wish; return through an ungraded revisit.

## 5.2 Modes available from any lesson

**Guided tour**, **Free exploration**, **Build/repair**, **Compare**, **Experiment/what-if**, **Explain simply**, **Deep dive**, **Quick review**, **Flashcards**, **Quiz**, **Teacher mode**, **Accessible text/2D**. Do not expose every mode at once; show the few supported by that topic.

## 5.3 No-login progress

Use client-side `localStorage` (with schema versioning) for completed checkpoints, topic bookmarks, anonymous settings and optionally wrong-answer review queues. Never depend on this storage being durable or globally synced. Provide **Export progress JSON**, **Import progress**, **Clear all progress**, visible “Saved on this device only” notice, graceful behavior when storage is unavailable, and a one-click “continue where I left off.” No account, no backend sync, no third-party learning identifier; private/incognito or cleared storage may lose progress.

---

# 6. Reusable interaction engine library

A small number of excellent **lesson engines** should power hundreds of individual topics. Content and science parameters live in validated data; interaction logic is reused.

| Engine | Interaction | Best curriculum examples |
|---|---|---|
| `ModelExplorer3D` | Orbit, zoom, select, label, layer, isolate, explode/reassemble | Heart, plant structures, atoms, geometric solids |
| `JourneyThrough` | Follow an object/path, camera travel, pause at stations, replay | Blood circulation, food digestion (future), nutrient transport |
| `VirtualLab` | Choose apparatus/variables, predict, run safe simulated experiment, observe | Chemical reactions, electric circuits, forces, heat |
| `MicroscopeScale` | Zoom across scales with honest scale markers | Cell → tissue → organ; atom → molecule → material |
| `GraphSandbox` | Drag variables, graph updates, see equation/units | Functions, quadratic graphs, trigonometry, statistics |
| `GeometryWorkbench` | Rotate/cut/assemble shapes, measure lengths/areas/volumes | Similarity, Pythagoras, mensuration |
| `TimeMap` | Timeline slider + map layers, causal events and perspectives | World Wars, freedom movements, Tamil Nadu history |
| `StoryStage` | Character perspectives, scene order, emotion/intention clues, choice and consequence | English prose and supplementary literature |
| `LanguageStudio` | Word building, pronunciation practice optional, grammar sorting, context cards | Tamil/English vocabulary, grammar, poetry |
| `ConceptGame` | Matching, classify, sequence, reconstruct, spot the error | All subjects |
| `FlashcardDeck` | Reveal, explain, self-rate, spaced return **on device** | Terms, formulas, dates, processes |
| `QuizEngine` | Question variants, feedback, hints, low-pressure practice | All subjects |

**Added opportunities:** Cross-section view, controlled time travel, slow motion, hypothesis testing, diagnostic “find the mistake”, compare two hypotheses, probability experiments, construction puzzles, observation journals (local only), fieldwork challenges without location tracking, printable worksheets, text-based simulation scripts, sound wave visualization, **scale literacy** (model size, real size, exaggerated view), and “What changes if?” causal exploration.

---

# 7. Science: detailed product requirements

## 7.1 Chemistry — Virtual Experiment Laboratory

**Core concept:** A student is not just looking at a pretty test tube. They choose a question, assemble an age-appropriate *virtual* experiment, adjust inputs, predict, observe visual/measurement output and explain the chemistry.

**Core features:** drag/drop apparatus *or equivalent click-to-place controls*; selectable reagent catalog restricted to curriculum-safe demonstrations; amount/temperature/concentration sliders where pedagogically relevant; particle-level overlay; observable changes (colour, temperature, gas bubbles, precipitate, pH) only when chemically justified; balanced equation view; atom count conservation visual; step-by-step teacher notes; reset and compare attempts; answer explanation; pseudo-safety markers to prevent transfer from simulation to unsafe real-world procedures.

**Example: Types of Chemical Reactions (Science Unit 10).** Predict whether two reactants change; run a curricular model; show reactant and product particle representations; demonstrate **conservation of atoms** in balanced equations; let the learner classify the reaction and explain evidence. Do not invent reactions or deterministic outcomes where chemistry depends on omitted conditions. Do not present any physical dangerous substance-handling instructions as a student home activity.

**Example: Solutions (Unit 9).** Add a solute to solvent; vary quantity, volume and temperature if scientifically appropriate; contrast saturation models and dissolved vs undissolved particles; graphs remain quantitatively consistent with selected assumptions; teach limitations of a simplified representation.

**Example: Periodic Classification of Elements (Unit 8).** Explore periodic table; compare atomic number/period/group and select properties; 3D atom view is representational, not an accurate depiction of electron trajectories; allow annotated 2D alternative.

**Acceptance:** (a) every virtual experiment declares scope/assumptions and valid parameters; (b) conserved quantities are asserted by tests; (c) impossible combinations produce explanatory feedback; (d) no lab gesture is required for keyboard use; (e) no gratuitous realistic hazardous procedure.

## 7.2 Biology — Human and plant learning worlds

**Heart (direct Class 10 unit mapping):** map to Science Unit 14 *Transportation in Plants and Circulation in Animals*. Learner can orbit anatomical heart, select a chamber, toggle layers (surface, cutaway, valves, large vessels), isolate a named structure, follow oxygenated/deoxygenated blood with an explicit legend, compare stages of the cardiac cycle, label or reassemble and answer a circulation-path question. Include a non-graphic “cutaway” mode and offer 2D annotated diagrams. **A heart dissection is a virtual anatomical cross-section**; not surgical instruction.

**Nervous system:** Unit 15, trigger a stimulus and watch labelled signal progression through a simplified neuron/reflex pathway; label what is schematic and what is real.

**Plant transport:** Units 12 and 14, move from roots/stem/leaf through water transport and view xylem/phloem with labels and scale warnings.

**Genetics:** Unit 18, build allele combinations and Punnett-square outcomes; clearly distinguish probabilities from guaranteed traits; avoid deterministic social or health conclusions.

**Digestive journey (enrichment / future-grade source needed):** a camera follows a food bolus from mouth → oesophagus → stomach → small intestine → large intestine with labelled enzymes, organs and absorption at appropriate stages. The learner can change speed, enter close-up views, and choose questions. Do not confuse the digestive system with a Class 10 unit unsupported by the supplied table of contents. Do not force a physically unrealistic continuous first-person view when a labelled schematic better explains absorption.

## 7.3 Physics — Manipulable cause and effect

**Laws of motion:** build a cart/force scene; adjust mass and force; watch acceleration, vectors and quantitative graph. **Optics:** place mirrors/lenses, trace light rays, vary focal length and object distance with measured readouts. **Thermal physics:** heat-transfer animation and time graphs. **Electricity:** construct circuits via accessible node connections; distinguish open/closed paths, series/parallel, voltage/current/resistance and safe simulation outcomes. **Acoustics:** waveform / frequency / amplitude controls, *mute by default*, with visual equivalents. **Nuclear physics:** age-appropriate conceptual visualizations without instructions for harmful devices. **Environmental management:** interventions and consequences in a simplified resource-flow system.

**Mandatory scientific integrity:** Simulation output must be based on reviewed equations/data or deliberately labelled qualitative models; avoid animation-only fake physics and “accurate 3D” claims where the rendering is illustrative.

---

# 8. Mathematics: a real-world interactive playground

Math lessons prioritize **manipulation → observation → mathematical explanation → worked example → independent transfer**. Not all math needs 3D.

| Class 10 chapter | Proposed hero activity | Evidence of understanding |
|---|---|---|
| 1. Relations and Functions | Match input/output machines; drag points and inspect graph families | Distinguish relation vs function; connect rule/table/graph |
| 2. Numbers and Sequences | Tile-step staircase and recurring patterns; sliders for AP/GP | Derive an nth-term rule; compare sequences |
| 3. Algebra | Balance-equation workbench and quadratic trajectory | Explain each algebraic transformation; solve and validate |
| 4. Geometry | Scale triangles, circle tangents, Pythagoras shape puzzles | Recognize conditions and justify a theorem |
| 5. Coordinate Geometry | Place and connect points; redraw a park-map boundary | Compute area/slope/line form and interpret result |
| 6. Trigonometry | Measure a building using virtual shadow/inclinometer | Select ratio and solve a height/distance case with units |
| 7. Mensuration | Fill and cut 3D solids; surface net unfolding | Predict volume/surface area effects |
| 8. Statistics and Probability | Run virtual dice/coin experiments and compare dispersion | Contrast empirical and theoretical probability |

**Real-world sandbox opportunities:** household budgeting (cost equations), cricket trajectory (quadratic illustration with physics simplification), building a ramp (geometry), parcel packaging (surface-area trade-off), water tank (volume), traffic and travel time (functions), rainfall (statistics), solar-panel tilt (trigonometry). Clearly mark modelling assumptions and avoid implying mathematically identical to the full real-world system.

**Math reasoning visibility:** Every interactive result has a step-by-step derivation and units; let users pause a transformation, request a hint (one hint at a time), inspect a common wrong turn, and try another generated problem. Answer checking should use algebraic equivalence/tolerance where relevant, not brittle string comparison.

---

# 9. English and Tamil: language as exploration, not rote typing

## 9.1 English Story Studio

The uploaded English book's 7 units each include **prose, poem and supplementary** literature. Examples include “His First Flight” (Unit 1), “The Night the Ghost Got In” (Unit 2), “Empowered Women Navigating the World” (Unit 3), “The Attic” (Unit 4), “Tech Bloomers” (Unit 5), “The Last Lesson” (Unit 6) and “The Dying Detective” (Unit 7).

**Modes:** illustrated scene sequence; select a character perspective; causal timeline; vocabulary-in-context; pause to predict what happens next; match textual evidence to interpretation; grammar sentence lab; audible pronunciation only when initiated; dialog reordering; literal vs figurative meaning; read-listen-respond options; literary devices as interactive comparisons.

**Copyright constraints:** The full prose, poems, dramatizations, character artwork and voice acting may have rights implications even in a government-provided compilation. Keep editorial provenance, use original pedagogical examples where appropriate and secure rights before adapting protected text. Never fabricate direct quotations as if from the book.

## 9.2 Tamil Literature and Grammar Studio

Represent Tamil as a **first-class native language** (correct Tamil font shaping, collation, punctuation, line breaks and narration review), not an English page with labels translated by machine alone. The 7 textbook thematic units cover language/humanity, nature/environment/science, culture, education, arts/aesthetics/innovation, civilization/society, and ethics/philosophy/thought.

**Modules:** build a Tamil word from correct components; identify grammar constructions; sentence transformation; match literary device to an original example; explore proverbs/Thirukkural through meaning and context (respect rights / source attribution); poetry rhythm with captions and learner-controlled audio; match historical and cultural references to maps; interactive reading comprehension; voice-based examples are optional, never required to advance.

**Review:** At least one skilled Tamil educator reviews each item and pronunciation. Do not use brittle automated linguistic analysis as the sole answer key where accepted variants exist.

## 9.3 Language accessibility

Switch between: simple explanation, full curricular terminology, listen, read with highlight, vocabulary popovers and practice. Do not label dialect or accent differences as inferior; avoid compulsory speech recording or asking minors to upload voices.

---

# 10. Social Science: time, place, systems and civic decisions

| Strand | Proposed modes | Sample chapters |
|---|---|---|
| History (10 units) | Time slider, annotated map, evidence cards, multiple perspectives, cause-effect reconstruction | World Wars, Gandhian phase, Tamil Nadu freedom struggle |
| Geography (7 units) | Terrain/river overlays, climate and land-use sliders, map layers, migration/transport flow | India relief and drainage; Tamil Nadu physical geography |
| Civics (5 units) | Constitution concept explorer, branches-of-government relationship map, citizen-process simulator | Indian Constitution, Central/State Government |
| Economics (5 units) | Budget slider, GDP composition, food supply path, taxation and industry cluster graph | GDP, food security, government and taxes |

**History truthfulness:** Distinguish documented facts, scholarly interpretation and illustrated reconstruction; don't fabricate geographic borders, dates, statistics or quotations. Include different groups' roles and perspectives with context. No sensational battle play that trivializes harm.

**Civics fairness:** Explain institutional mechanisms and source dates without partisan persuasion, giving students factual civic literacy and transparent limits of each model.

**Geo privacy:** Map activities do not request a learner's GPS; allow choosing example places manually. No requirement for live geolocation.

---

# 11. Cross-subject learning arcade, flashcards and assessments

**Game patterns:** 1) drag or click-to-classify, 2) sequence the process, 3) find an error, 4) build the model, 5) compare and predict, 6) time-slider challenge, 7) concept map links, 8) clue-based discovery, 9) low-pressure memory match, 10) peerless “explain the result” prompts. Games must not become contextless tapping for points; each declares one cognitive outcome.

**Flashcards:** Topic-linked front/back, multiple card types (term, diagram label, why, apply), “Know / Not yet” self-rating, optional local review scheduling with transparent logic, no obligation to keep a streak, export/import, optional print. Cards may be generated from a reviewed *question bank*, never unreviewed hallucinated textbook facts.

**Quizzes:** Three modes—practice (ungraded), checkpoint (concept evidence), mixed revision; hints; explanation after answer; shuffle without tricking users; no countdown by default; never punish exploration or needing assistance. Mix recall, application and explanation; store no unnecessary personal data.

**Progress UI:** Understood concepts, “try again” queue, activity history, last opened topics; never publicly rank students or infer neurodevelopmental traits. Celebration should be gentle, optional and non-extrinsic.

---

# 12. Focus, accessibility and inclusion requirements

**Basis:** Follow CAST Universal Design for Learning 3.0 (multiple means of engagement, representation, action/expression) and target **WCAG 2.2 Level AA** for the complete published experience, including alternative controls for 3D simulations. These are design and testing requirements, not a claim of formal certification.

## 12.1 Non-negotiable learning controls

- One clear learning objective per activity; expected duration and progress markers; breadcrumbs and “Back to Chapter” throughout.
- **Focus mode** hides nonessential chrome, recommendation widgets, rankings and movement; user-selected, not attached to a diagnosis.
- Reduced motion follows OS preference; learner may further disable camera transitions, particles, parallax and auto-orbit. Animation can be paused/replayed; no autoplay audio.
- Pause, resume, reset, undo, step-by-step, slow-motion and replay where appropriate. Nothing meaningful relies on timing or reaction speed.
- Reading controls: short explanations, font scaling, readable line lengths, choice of high contrast/low visual stimulation, optional audio with captions/transcript, plain-language glossary.
- Keyboard-only controls for orbit, zoom, layer toggles, dragging equivalents and final answers. Screen-reader alternative narrative describing relevant states, transitions and results.
- 2D/text alternative preserving the **same learning objective and assessment** when WebGL fails, motion is disabled or users simply prefer it.
- Large and separated touch controls (design target ~44 × 44 CSS px), no reliance on colour alone, visible focus indicators, skip links, captions, ARIA live updates used sparingly.
- No forced daily streak, public ranking, punitive red screens, surprise audio, artificial scarcity, infinite scroll, mandatory timers, popups during learning or random sensory effects.

## 12.2 ADHD-informed pedagogical safeguards

Offer micro-steps, explicit “what to do first,” clean visual hierarchy, adjustable stimulus, prediction-before-explanation, frequent but non-punitive feedback, optional movement/play, and a planned stopping point. Do not claim universal benefits for ADHD: validate with students and educators, including people with ADHD where ethically and voluntarily recruited, and measure actual comprehension, task completion and perceived overload rather than screen time alone.

## 12.3 Accessibility audit checklist

- Every main flow passes keyboard-only testing, focus visibility, 200–400% zoom/reflow, screen-reader manual review and contrast inspection.
- All 3D object gestures have buttons or discrete selectors; drag actions have non-drag equivalents.
- Tamil script is rendered and read correctly on supported devices; subtitles and descriptions are reviewed by humans.
- “Low motion” does not eliminate meaningful scientific state changes; those must be available through frames/text/table.

---

# 13. Detailed hero learning experiences

## 13.1 Story A — “Travel through the Heart” (P0 candidate)

**Curriculum:** Class 10 Science, Unit 14. **Objective:** Trace the path of blood through the four chambers and major connections, and explain valves' role in one-way flow.

**Journey:** Chapter → Heart → choose Guided/Explore/2D → 3D exterior rotating model → tap/right-panel select atrium → “Cutaway” cross-section → blue/red path animation *with text and legend* → user drags or clicks sequence tiles to trace blood flow → quiz explaining valve function → printable flow chart and local completion.

**Controls:** rotate, zoom, reset view, show/hide labels, layer selection, cutaway, flow pause, speed, step forward/back, 2D diagram, screen-reader walkthrough. Important: “red/blue” is an educational colour convention and is never the only signal; structure and oxygenation status are named in text.

**Model caveats:** Shapes should be anatomically reviewed; left/right from the viewer versus the patient's perspective must be labelled. Blood-flow animation does not imply an exact depiction of every fluid particle. No actual dissection instructions.

**Acceptance:** Correct ordered flow in both 3D and 2D; quiz completion possible without WebGL; no forced sound; keyboard feature parity; underpowered-device fallback; scientific review sign-off.

## 13.2 Story B — “Reaction Lab” (P0 candidate)

**Curriculum:** Class 10 Science Unit 10, safe conceptual reaction. **Objective:** Match observations to reaction classification and balance a simple equation.

**Journey:** Prompt → predict visible result → choose reagents from an approved curriculum-limited set → use click-to-assemble apparatus → observe reaction with equations and measured indicators → open particle view → balance atom counters → explain the reaction → answer conceptual check. Every reaction has immutable approved inputs and a reviewed outcome model.

**Acceptance:** Scientific assertions verified; no dangerous procedural recipes; step controls work by keyboard; no unexplained animated colour changes; failure path offers “why not” explanations; static storyboard fallback exists.

## 13.3 Story C — “Measure a Building without Climbing It” (P0 candidate)

**Curriculum:** Class 10 Mathematics Chapter 6, Heights and Distances. **Objective:** Relate angle of elevation and a measured distance to a computed height, including units and assumptions.

**Journey:** Student stands at a chosen point on a safe virtual ground → drag/step an angle slider → see tangent triangle overlay → predict building height → reveal a derivation, with units → modify distance and explain why output changes → solve an unfamiliar variant with hints.

**Acceptance:** Geometry matches equations at all slider states; keyboard slider; numerical precision and unit tests; no need for 3D graphics to finish.

## 13.4 Story D — “His First Flight — Visual Reading Lab” (P1)

**Curriculum:** Class 10 English Unit 1 prose. **Objective:** Identify character motivation and cause-effect across a narrative.

**Journey:** A sequence of **original illustrations** represents moments described in the assigned text → choose what the character fears / expects → examine evidence references to the assigned textbook → arrange event cards → see how events change the character's decision → quick comprehension recap. Textual adaptation and quoted passages require rights review.

**Acceptance:** No invented line presented as a book quote; story arc reviewed; readers can use text-only mode; language exercise is pedagogically scored, not timed.

## 13.5 Story E — “Tamil Grammar Builder” (P0 candidate)

**Curriculum:** Class 10 Tamil, grammatical topics by `இயல்`. **Objective:** Recognize and construct a selected grammar pattern using teacher-validated examples.

**Journey:** Short explanation in Tamil → see component cards → place/select them into a valid pattern → get meaning-focused feedback → compare near-miss examples → practice in a short original sentence → recap. Strictly tested Tamil shaping, line breaks and typing methods.

## 13.6 Story F — “World History TimeMap” (P1)

**Curriculum:** Class 10 Social Science History. **Objective:** Place major events chronologically and explain a short causal chain.

**Journey:** Timeline with dated points → pan and click sites on an evidence-based historical map → toggle “what changed” overlays → connect causes/events/consequences → answer with evidence. Historical border shapes and each timeline point need source and date metadata.

---

# 14. Design system and information architecture

## 14.1 Screens

- **Landing:** “What do you want to understand?” Search + grade + six subject entrances; keep visual motion under user control.
- **Class home:** Subject cards, topic shortcuts, continue locally (optional), explore showcase.
- **Subject home:** Chapter index, learning objectives, estimated duration, accessible-format badges.
- **Chapter home:** Topic cards, prerequisites, outcomes, types of interactions, downloadable review.
- **Lesson player:** Clear title / objective, one dominant canvas or diagram, labelled controls, short instruction, modes, help/hint, checkpoint, optional reference panel.
- **Arcade:** Filter by standard / subject / unit / objective / game type; do not fragment the canonical lesson.
- **Quick review:** Flashcards, quizzes, one-page summaries, printable review.
- **Settings:** Motion, contrast, fonts, captions, language, sound, quality, storage export/clear.
- **Teacher view:** Projection mode, aligned objective, classroom facilitation script, safety/accuracy notes, printable resource.
- **Sources:** Official curriculum reference; model assumptions, provenance, version and corrections channel.

## 14.2 Content tree

`Board → Standard → Subject → Strand (optional) → Unit/Chapter → Topic/Subtopic → Learning objective → Activities → Checks → Sources`.

**Information architecture rule:** A concept has one canonical record but can appear in many collections. For example, probability may appear in Mathematics, the Arcade, a revision deck and a cross-subject statistics tour, all pointing to the same stable lesson ID.

## 14.3 Visual style

Premium, friendly, legible and scientific rather than childish or distractingly cinematic. The 3D model should be the central teaching object, not background decoration. Avoid a single dark space-themed visual system across subjects; carry over ManicksGalaxy's scientific seriousness and interaction clarity, not its astronomy-specific sky aesthetic.

---

# 15. Static-first technology and development architecture

## 15.1 Architecture decision

**Recommended for new platform:** Astro **static generation** for route and curriculum pages, with on-demand React/TypeScript interactive islands; Three.js only for scenes that need it; Canvas/SVG for 2D science and mathematics; Markdown/MDX or validated typed content data for lesson authoring. Deploy static output to Cloudflare Pages or equivalent CDN; cloud functions, databases and authentication are **not required** for public no-login lessons.

**Alternative:** React + Vite fully static SPA can work and aligns more closely with ManicksGalaxy, but has weaker default per-page static HTML and can send unnecessary JS to noninteractive pages. The final choice should be confirmed with a small performance prototype for a curriculum index + 3D heart + 2D graph, not assumed from taste.

```text
       STATIC CONTENT / BUILD SYSTEM (no runtime accounts)
              Curriculum registry / reviewed lesson manifests
                       |                       |
                  Static routes                Search index
                       |                       |
             Subject / chapter pages ───────────┘
                       |
                 Lesson shell (HTML)
                       |
             Load interactive island on demand
       ┌───────────┬───────────┬────────────┬─────────────┐
       | 3D engine | 2D engine | Language   | Quiz / Cards |
       | Three.js  | SVG/Canvas| renderer   | shared       |
       └───────────┴───────────┴────────────┴─────────────┘
                       |
          Device-only preferences and local progress
               (export/import and clear controls)
```

## 15.2 Reference code to reuse from ManicksGalaxy

1. `src/three/PlanetSceneCanvas.tsx`: scene setup, OrbitControls, camera presets, quality tiers, reduced-motion handling and graphics fallback patterns. **Extract generic primitives**, do not carry astronomical assumptions into body anatomy or chemistry.
2. `src/components/ObjectDetailView.tsx`: structured detail drawer, camera controls, scientific labels, sources tabs.
3. `src/components/CompareView.tsx`: comparison interactions and explicit true-scale versus presentation-scale distinction.
4. `src/lib/voyageStore.ts`: local preference and progress patterns, replacing astronomy terms with a versioned lesson store.
5. `src/components/LearnAndTeachersView.tsx`: teacher-facing content, glossary and quiz interaction patterns; refactor for generic curriculum objectives.
6. `src/data/catalog.ts`: typed object catalog and authenticity/source-provenance metadata. Extend to a lesson data contract.

**Must NOT simply reuse:** astronomy's planet textures, celestial data schema, orbital physics for anatomy, astronomical copy/branding, astronomy-focused hash routing or large always-loaded scene bundles. Reuse is architectural, not a statement that the current ZIP implements this new product.

## 15.3 Proposed monorepo structure

```text
apps/web/                         # Astro static shell, search and routing
packages/ui/                     # Accessible common UI components
packages/curriculum/             # Typed board/grade/subject/chapter registry
packages/lesson-schema/          # Schemas + migration and validation
packages/engine-3d/              # Orbit, layers, camera, labels, cutaway
packages/engine-2d/              # SVG/Canvas, plots, diagrams, maps
packages/engine-lab/             # Typed safe experiment states and rules
packages/engine-language/        # Stories, Tamil/English grammar activities
packages/engine-assessment/      # Quizzes, hints, flashcards, local review
packages/device-state/           # Local settings/progress export/import
content/tn/10/                   # One source folder per curriculum unit
assets/models/                   # Rights-reviewed GLB models / 2D fallbacks
scripts/content-audit/           # Data validation, reference checks
apps/web/tests/                  # E2E + accessible-user journeys
```

## 15.4 Lesson manifest — illustrative schema

```json
{
  "id": "tn-10-science-14-heart-flow",
  "board": "tn-state",
  "standard": 10,
  "subject": "science",
  "strand": "biology",
  "unitId": "14",
  "topicSlug": "heart-blood-flow",
  "sourceEdition": "Science supplied 2024 reprint",
  "objective": "Trace blood flow and explain one-way valves",
  "sourceRefs": [{"book": "science-10", "unit": "14"}],
  "modes": ["guided", "free", "2d", "text", "quiz"],
  "engine": "ModelExplorer3D",
  "fallback": "accessible-blood-flow-2d",
  "models": [{"assetId": "heart-glb-v1", "licenseId": "rights-review-required"}],
  "review": {"science": "pending", "education": "pending", "a11y": "pending"},
  "status": "draft"
}
```

Fields such as source edition, model claim, licence record, content translations and software asset version are **immutable audit references per published lesson revision**. CI must reject missing objective, missing fallback, unreviewed content, broken asset provenance or duplicate canonical IDs.

---

# 16. Model fidelity, scale and content safety

Every simulation declares a **representation status**: `Measured/Observed`, `Equation-based simulation`, `Conceptual schematic`, `Illustrative reconstruction`, or `Hypothetical scenario`. This follows ManicksGalaxy's valuable authentic-vs-artistic distinction but uses labels appropriate to all disciplines.

- **Body:** Review anatomical position, vessel connections, orientation, blood flow and layer nomenclature with science educator; clearly distinguish schematic motion from physiological quantitative prediction.
- **Chemistry:** Validate stoichiometry, reaction prerequisites, conservation, and school-level safety; avoid unreviewed reagent combinations and dangerous procedures.
- **Mathematics:** Derive visuals from equations, not hand-matched animation; test numeric edge cases, undefined values and units.
- **Maps/history:** Review location, time window, boundary attribution and contested history. No invented “photographic” reconstruction without label.
- **Text/language:** Use human-reviewed Tamil and English, avoid claiming exact textual quotations when composing paraphrases.
- **3D assets:** Track creator, license, origin, scale, dimension, file checksum, polygon count, texture sizes, age-suitability and reviewer sign-off.
- **Reality controls:** Distinguish “true scale” from “not-to-scale for teaching.” Avoid representing nanoparticles, blood cells or atoms as photographically accurate based on a stylized render.

**Safety boundary:** Virtual labs are for conceptual learning. Do not provide dangerous real-life procedural instructions; clearly separate observations from activities requiring supervised school laboratory conditions. Anatomy should be appropriate for the age group and optionally less graphic.

---

# 17. Performance, offline and privacy requirements

## 17.1 Proposed release budgets (targets; not measured)

| Area | Target / behavior | Verification |
|---|---|---|
| Static pages | Meaningful page content works without lesson JavaScript | Browser disable-JS smoke test |
| Page experience | LCP goal ≤ 2.5 seconds at p75 on representative mid-range mobile/test network | Lighthouse + real-user *opt-in or aggregate* research; lab benchmarks |
| 3D scene | Adaptive quality targeting responsive controls; ~30 fps on chosen supported budget devices | Representative device performance test |
| Asset downloads | Base route avoids 3D assets entirely; 3D models compressed, lazy loaded and cacheable | Network waterfall / bundle analyzer |
| Network resilience | Indexed page and downloaded offline packs available offline; clearly signal unavailable models | PWA airplane-mode tests |
| Memory | No leaked canvases/textures/listeners between scene transitions | Device soak tests |
| Accessibility | WCAG 2.2 AA target; same assessed outcome in 2D/text path | Automated + manual assistive-tech audit |
| Audio | Off by default, fully captioned/transcribed, optional | Browser media tests |
| Privacy | No login, no advertising IDs, no user-submitted child data in MVP | Network / storage audit |

**Offline plan:** Progressive web app only if justified. Prefer opt-in per-subject download packs with clear size estimate, version and delete option; do not cache huge 3D libraries automatically. Static content should work in basic online browsers without service-worker support.

## 17.2 Minors, data and third parties

This is designed for children. Default to **no external trackers**, no analytics SDK retaining individual activity histories, no ads, no public profiles, no comments, no location request, no camera/microphone request, and no external AI service invoked by default. Device-local state is still user data; document exactly what is stored and allow deletion/export. If adding optional cloud saves or third-party tools later, revisit verifiable parental consent, notices, vendor processing, security, statutory obligations and deployment dates under India's DPDP legal framework with qualified counsel before release. The rules' notification alone does not establish that every requirement has the same effective date; verify current commencement and any applicable exemptions.

---

# 18. Editorial and publishing workflow

1. **Select topic** from edition-specific official curriculum registry.
2. **Define objective**, prerequisite and the misconception the activity targets.
3. **Choose format**: 3D only when it adds learning value; otherwise SVG/2D/text/story/map.
4. **Storyboard** a guided route and a nonvisual equivalent.
5. **Implement model** with small declarative data; log all approximations.
6. **Subject review** by teacher or qualified expert, with citations.
7. **Inclusive review**: focus, typography, audio, Tamil, keyboard, screen reader, low-bandwidth.
8. **Safety and copyright review**, specifically for textbook text and externally sourced assets.
9. **Automated validation**: schema, hyperlinks, model calculations, broken assets, bounds and tests.
10. **Release** only if three content badges are approved: Scientific/subject accuracy; Instructional quality; Accessibility/rights. Keep rollback and correction page.

**Minimum lesson artefacts:** lesson manifest, objective, 1-page teacher guide, interactive asset, accessible fallback, 3 concept questions, answer explanations, glossary, source/rights record, test cases and version history.

---

# 19. Priority roadmap and scope control

## Phase 0 — Foundation and verification

- Approve the product name/brand, no-login policy, TN Class 10 as initial board, language plan and rights position.
- Build content registry, SEO/static routing, common shell, accessibility settings and 2D lesson prototype.
- Perform representative tests: low-cost Android, keyboard, screen reader and slow network.
- Scientific/educational review of the first three hero interactions before broader expansion.

## Phase 1 — Pilot: 6 polished hero lessons (P0)

1. Heart and circulation (Science Unit 14): cutaway 3D + 2D pathway.
2. Safe conceptual chemical reaction (Science Unit 10): virtual lab + balancing.
3. Heights and Distances (Math Chapter 6): angle-and-height sandbox.
4. Tamil grammar builder (selected topic from the 2025 book): human-reviewed practice.
5. English narrative sequencing (Unit 1): original scene cards, rights-reviewed adaptation.
6. Geography terrain/map layers **or** World War timeline (Social Science): interactive timeline/map; final selection by available reviewed datasets.

Each pilot must ship with at least one flashcard set, 3–5 practice questions, keyboard mode and print/2D alternative. A polished cross-subject pilot is more informative than 100 unfinished simulations.

## Phase 2 — Shared learning engines and breadth (P1)

- Full Class 10 chapter directories with **honest availability labels** (`Interactive`, `2D explain`, `Review only`, `Planned`).
- Expand to approximately **25–40** reviewed activities from the most reusable engines, across all five books; target is a planning range, not a delivery commitment.
- Add ConceptGame templates, robust flashcard and quiz bank, mixed revision, teacher projection, local export/import, search and cross-topic recommendations.

## Phase 3 — Curriculum completeness and bilingual quality (P2)

- Achieve explicit coverage of each Class 10 chapter/unit with at least one verified explanatory asset, then deepen interactive coverage by topic demand.
- Expand Tamil/English bilingual support for non-language subjects only after reviewed terminology; add offline packs and student-tested adaptation options.
- Expand to other classes/boards only after a formal curriculum audit; digestive-system journey is a good candidate with another standard's textbook mapping.

## Phase 4 — Optional advanced experiences (later)

- Controlled collaborative classroom modes with no student identities, AR/VR only on supported devices, accessibility-preserving multiplayer challenges, teacher-authored lesson variants via reviewed publishing pipeline, and science extensions beyond the textbook. None are prerequisites to a good first release.

## Priority gates

| Priority | Definition | Required before release? |
|---|---|---|
| P0 | accurate curriculum, accessible core, no-login local state, at least one verified mode, mobile support | Yes |
| P1 | breadth, teacher tools, offline packs, printable learning extras | After pilot evidence |
| P2 | additional standards, advanced engine types, optional immersive hardware | Later |
| Excluded | mandatory accounts, intrusive tracking, public ranking and speculative cognitive diagnosis | No |

---

# 20. Test strategy and acceptance contract

## 20.1 Every learning activity must pass these product tests

**PRD-01 Discovery:** A student reaches a lesson from class/subject/chapter in three selections or fewer after selecting class, or a documented exception; all links work as direct static URLs.  
**PRD-02 Objective:** Lesson displays a reviewed objective and source reference; quiz measures that objective.  
**PRD-03 Choice:** Guided/free/accessible modes available where declared; no unsupported button shown.  
**PRD-04 Input parity:** Every drag/rotate/zoom task has equivalent button/keyboard controls; can complete without pointer dragging.  
**PRD-05 Pause and motion:** Audio off by default, motion preferences honoured, pause/replay/step works.  
**PRD-06 Accessible fallback:** Same learning objective test passed with WebGL unavailable; visible “Switch to 2D/Text” path.  
**PRD-07 No login:** New browser session can reach and complete lesson without registration/cookies consent wall.  
**PRD-08 Local progress:** Store, export, import, clear, corruption recovery and private-mode failures handled without breakage.  
**PRD-09 Science and maths:** Correctness unit/property tests for simulation parameters, conservation, labelled pathways, solved expressions.  
**PRD-10 Cross-language:** Tamil glyphs, screen reader, search and reviewed terminology work for all released Tamil lessons.  
**PRD-11 Responsive:** 320 px small phone through desktop layout; navigation and labels remain legible, model never traps scroll.  
**PRD-12 Performance:** No automatic multi-megabyte 3D asset on class/subject pages; lazy load tested; memory released on unmount.  
**PRD-13 Rights:** Every published media and story adaptation has a recorded right to use or documented exception.  
**PRD-14 Safety:** Dangerous lab workflows absent; age-appropriate representations; scientific limitations visible.  
**PRD-15 SEO:** Each curriculum URL produces real title, description, canonical URL, headings, nonempty pre-rendered HTML and sitemap entry.  
**PRD-16 Offline:** Offline mode never silently shows stale or missing lessons; local offline pack is explicitly managed.  
**PRD-17 No tracking:** Network inspection reveals no child profiling, location, advertising identifier or unnecessary third-party request.  
**PRD-18 Recovery:** Invalid resource, unsupported GL and crashed island fall back to clear explanatory state without losing page navigation.

## 20.2 E2E journey examples (Playwright + manual validation)

- Student, fresh Chrome → navigate Class 10 → Science → circulation → open heart → pause → rotate by keyboard → switch cutaway → answer → export → refresh → verify retained → clear.
- Budget Android / throttled network → Science Unit 10 → see 2D before downloading 3D → finish chemistry check; no stuck loader, no auto video/audio.
- `prefers-reduced-motion` → maths simulator → make variable adjustment with static labelled states; test results still visible.
- Screen-reader + keyboard → Tamil grammar → complete a question, hear concise state change, correct an error.
- Browser with WebGL disabled → heart route → switch to 2D and complete the exact objective.
- Teacher projection → lesson objective, full-screen presentation, large labels, no personal identifying information.
- Broken content manifest → clear fallback and build-time publish-blocking error.
- Science reference update → prior lesson metadata and version traceable, tests rerun.

## 20.3 User research (privacy-preserving)

Pilot with students and teachers from varied learning/technology backgrounds. With appropriate consent and safeguarding for minor participants, test time-to-first-action, task completion, conceptual gains on parallel questions, perceived overload, simulator usability, accessibility blockers and the ability to explain a concept the next day. Collect only necessary aggregate or consent-based research data; no hidden webcam, keystroke or attention tracking.

---

# 21. Metrics and decision rules

**North-star metric:** **Concepts meaningfully understood per completed learning session**, measured through opt-in/controlled concept-check studies, **not** raw seconds on site or number of animations played.

| Metric | Definition / collection | Decision use |
|---|---|---|
| Concept transfer | Score difference on equivalent but unfamiliar pre/post problem in consented studies | Keep/rewrite the learning model |
| Task success | Can learner complete stated objective without intervention? | UX and instruction debugging |
| First meaningful action | Time from open to first successful exploration event during moderated tests | Onboarding simplification |
| Accessibility completion | Same assessment completion in keyboard/2D/screen-reader paths | Release gate |
| Device reliability | Crash / renderer fallback / memory behaviour in lab tests | Graphics budgets |
| Content coverage | Reviewed objectives / approved syllabus objectives | Editorial planning |
| Return-to-learn | Only device-local self-view or voluntary aggregate surveys | Value without surveillance |

**No false promises:** No baseline or target impact numbers are evidenced by the uploaded files. Establish them empirically in the pilot rather than marketing an unproven ADHD outcome or universal performance improvement.

---

# 22. Risks, trade-offs and founder decisions

| Risk | Why it matters | Mitigation / decision |
|---|---|---|
| Building too much 3D | Expensive, slow, distracting | Every lesson must justify why 3D adds conceptual value |
| Scientific inaccuracy | Students learn visually persuasive falsehoods | Review + model types + equation tests + provenance |
| Rights of textbook material | Government PDFs are not automatically unrestricted reuse | Rights register, original diagrams, publisher/author permission checks |
| Learner overload | Gamification can fragment attention | Predictable minimal UI, learner control, user studies |
| Tamil quality | Font shaping, morphology, accepted variants | Native language educator review and testing |
| Class 10-only limits | Digestive journey may belong to another grade | Generic board/class schema and source-based enrichment labels |
| No-login progress loss | Browser storage can disappear | Clear messaging + export/import + short lessons |
| Asset cost | Anatomical models and mobile bandwidth | Device tiers + compression + 2D first |
| SSG build complexity | Many routes and content versions | Automated registry, schema validation, incremental builds |
| Unreviewed analytics or AI | Minor data and inaccurate teaching | No default data collection, human-reviewed content |

**Founder decisions pending (recommended defaults):** Branding: pending, do not invent a permanent name. Grade: TN Class 10. Language: textbook-language first, English/Tamil bilingual for navigation as feasible. Login: none. Cloud backend: none for MVP. 3D: selective. Revenue: free public student access, no ads initially. Rights and educational reviewers: required before launch. School partnerships and any monetization: later, after trust and learning proof.

---

# Appendix A. Curriculum → interaction crosswalk

**Interpretation note:** The names below follow the uploaded book contents; activity suggestions are original proposals. “P0 candidate” does not mean the entire corresponding chapter will be implemented in Phase 1.

## A1. Science: 23 Class 10 units

| Unit | Official topic | Proposed flagship interaction |
|---|---|---|
| 1 | Laws of Motion | Force-cart with arrows and acceleration graph |
| 2 | Optics | Ray tracing and lens/mirror builder |
| 3 | Thermal Physics | Heat-transfer and temperature timeline |
| 4 | Electricity | Interactive circuit board |
| 5 | Acoustics | Sound-wave manipulation with mute-safe visual mode |
| 6 | Nuclear Physics | Concept timeline and safe structure model |
| 7 | Atoms and Molecules | Atom/element/molecule viewer |
| 8 | Periodic Classification of Elements | Periodic discovery table and trends explorer |
| 9 | Solutions | Solute–solvent virtual lab |
| 10 | Types of Chemical Reactions | Classification/reaction lab — P0 candidate |
| 11 | Carbon and its Compounds | Molecule bonding and carbon structure builder |
| 12 | Plant Anatomy and Plant Physiology | Plant cross-section and transport journey |
| 13 | Structural Organisation of Animals | Tissue/organ layers and microscope zoom |
| 14 | Transportation in Plants and Circulation in Animals | 3D heart + blood path — P0 candidate |
| 15 | Nervous System | Neuron and reflex-path explorer |
| 16 | Plant and Animal Hormones | Signal-to-response causal model |
| 17 | Reproduction in Plants and Animals | Age-appropriate labelled cycle and mechanism comparison |
| 18 | Genetics | Trait-combination probability lab |
| 19 | Origin and Evolution of Life | Evidence timeline and tree-of-life concepts |
| 20 | Breeding and Biotechnology | Selective-breeding choices with limitations |
| 21 | Health and Diseases | Transmission/prevention concept simulator; no personalized diagnosis |
| 22 | Environmental Management | Resource-system and impact sandbox |
| 23 | Visual Communication | Visual-code and media interpretation lab |

## A2. Mathematics: 8 chapters

| Chapter | Official topic | Example interaction |
|---|---|---|
| 1 | Relations and Functions | Graph/input-output machine |
| 2 | Numbers and Sequences | Sequence visualizer |
| 3 | Algebra | Equation-transform sandbox |
| 4 | Geometry | Proof-through-construction workbench |
| 5 | Coordinate Geometry | Map/coordinate toolkit |
| 6 | Trigonometry | Heights-and-distances measurement — P0 candidate |
| 7 | Mensuration | 3D net and volume explorer |
| 8 | Statistics and Probability | Sampling and probability lab |

## A3. Social Science: all four strands

**History (10):** Outbreak of World War I and Its Aftermath; The World between two World Wars; World War II; The World after World War II; Social and Religious Reform Movements in the 19th Century; Early Revolts against British Rule in Tamil Nadu; Anti-Colonial Movements and the Birth of Nationalism; Nationalism: Gandhian Phase; Freedom Struggle in Tamil Nadu; Social Transformation in Tamil Nadu. **Recommended engine:** dated evidence-based TimeMap, history comparisons, source cards.

**Geography (7):** India - Location, Relief and Drainage; Climate and Natural Vegetation of India; India - Agriculture; India - Resources and Industries; India - Population, Transport, Communication and Trade; Physical Geography of Tamil Nadu; Human Geography of Tamil Nadu. **Engine:** map overlays, terrain, resources, transport and climate explorations.

**Civics (5):** Indian Constitution; Central Government; State Government; India's Foreign Policy; India's International Relations. **Engine:** organization charts, constitutional process sequences, diplomatic systems maps.

**Economics (5):** Gross Domestic Product and its Growth: an Introduction; Globalization and Trade; Food Security and Nutrition; Government and Taxes; Industrial Clusters in Tamil Nadu. **Engine:** economic-flow graphs, household-resource simulations and policy impact models without simplistic conclusions.

## A4. English: 7 prose-led unit identifiers

| Unit | Prose identifier | Suggested interactive format |
|---|---|---|
| 1 | His First Flight | Visual reading journey and cause/effect |
| 2 | The Night the Ghost Got In | Sequence reconstruction and narrator analysis |
| 3 | Empowered Women Navigating the World | Journey map and nonfiction comprehension |
| 4 | The Attic | Setting, clue and narrative interpretation |
| 5 | Tech Bloomers | Concept comparison and tech vocabulary |
| 6 | The Last Lesson | Perspective, tone and historical-language context |
| 7 | The Dying Detective | Evidence and inference puzzle |

All seven units **also contain poems and supplementary readings**; content inventory must separately map them before claiming syllabus completeness. Do not turn copyrighted literary works into full interactive derivatives without rights review.

## A5. Tamil: seven thematic unit identifiers

| இயல் | Textbook thematic area (Tamil) | Example modes |
|---|---|---|
| 1 | மொழி, மனிதம் | Vocabulary, word-building, meaning and grammar |
| 2 | இயற்கை, சுற்றுச்சூழல், அறிவியல் | Narrated scenes and interpretive language tasks |
| 3 | பண்பாடு | Cultural context cards and comprehension |
| 4 | கல்வி | Translation comparison and language practice |
| 5 | கலை, அழகியல், புதுமை | Poetry, form and literary-device exploration |
| 6 | நாகரிகம், நாடு, சமூகம் | Historical/cultural narratives and context maps |
| 7 | அறம், தத்துவம், சிந்தனை | Ethics/inference, argument and contextual reading |

The theme strings are normalized for readability; source PDF Tamil extraction can contain encoding artifacts, so native-speaking editorial verification is required for exact page titles and learning activities.

---

# Appendix B. Initial quality definition and release checklist

A released lesson is **Done** only if all statements are true:

- [ ] Curriculum topic and edition mapped; source page/unit recorded.
- [ ] Observable learning objective and misconception recorded.
- [ ] Student can reach lesson by search, index and direct URL.
- [ ] Guided sequence, user-controlled exploration and concise explanation complete.
- [ ] Review questions match lesson objective; answer feedback explains *why*.
- [ ] Keyboard, touch, reduced motion and screen reader journeys manually tested.
- [ ] Non-WebGL / low-bandwidth alternative teaches and assesses the same concept.
- [ ] Scientific/subject reviewer and teacher reviewer sign off.
- [ ] All images/models/phrases have approved rights metadata; source claims traceable.
- [ ] Safety, content maturity, correction flow and input errors tested.
- [ ] Device performance, semantic HTML, metadata, sitemap and deep link tested.
- [ ] Optional local progress export/import/clear robustly tested.
- [ ] No login, trackers, mic/camera, advertising IDs or unexpected third-party beacons.
- [ ] Content, automation, visual and E2E regression pass before deployment.

---

# Appendix C. Sources and verification register

## User-supplied source files (primary curriculum / code reference)

1. `Class_10_Science_English_2024_Edition-www.tntextbooks.in.pdf` — title/preface; **contents PDF pages 6–7**; individual lessons for subject review.
2. `Class_10_Mathematics_English_2025_Edition-www.tntextbooks.in.pdf` — **contents PDF pages 5–6**; topic subdivisions in that table.
3. `Class_10_Social_Science_English_2025_Edition-www.tntextbooks.in.pdf` — **contents PDF pages 4–5**; four strands.
4. `Class_10_English_2024_Edition-www.tntextbooks.in.pdf` — **contents PDF page 4**, prose/poem/supplementary mapping.
5. `Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf` — **contents PDF pages 8–9**, thematic units and literature/grammar entries.
6. `ManicksGalaxy-main.zip` — inspected `package.json`, `src/three/PlanetSceneCanvas.tsx`, `src/components/ObjectDetailView.tsx`, `src/components/CompareView.tsx`, `src/components/LearnAndTeachersView.tsx`, `src/lib/voyageStore.ts`, `src/data/catalog.ts`, and included ManicksGalaxy PRD/UX blueprint (technical patterns only).

## External standards and implementation documentation (supplementary)

- CAST. **Universal Design for Learning Guidelines v3.0 (2024).** https://udlguidelines.cast.org/ — engagement, representation, action/expression.
- W3C. **Web Content Accessibility Guidelines (WCAG) 2.2.** https://www.w3.org/TR/WCAG22/ — WCAG 2.2 Level AA target; keyboard, alternatives for dragging, motion, focus and target size.
- Astro official docs. **On-demand rendering and static defaults.** https://docs.astro.build/en/guides/on-demand-rendering/ — default prerendering and optional server-rendered routes.
- Government of India, Press Information Bureau. **DPDP Rules 2025 notification and student-data context.** https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014 and https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202901 — consult lawyers for currently commenced obligations and child-data requirements before collecting children's personal data.

**Document limitations:** This is a grounded discovery PRD and prioritized *proposal*, not proof of implementation, full copyright clearance, finished lesson content, clinical neurodiversity efficacy, a finished 3D anatomical model, or technical load/performance certification. The uploaded books cover different revisions; edition-specific mapping and future syllabus changes need editorial monitoring.
