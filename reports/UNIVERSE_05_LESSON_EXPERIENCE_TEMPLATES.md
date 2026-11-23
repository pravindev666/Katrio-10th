# Katrio Learning Universe — Calm 4-Tab Lesson Template & Six Gate 2 Working-Pilot Specs

**Document ID:** `UNIVERSE_05_LESSON_EXPERIENCE_TEMPLATES`  
**Version:** 1.0 (Gate 1 + Gate 2 Spec — Ready for Owner Sign-Off)  
**Experience Loop:** *Understand → Predict → Experiment → Observe → Explain → Solve → Recall → Transfer*

---

## Part A — The Calm 4-Tab Concept Quest Workspace (Unified Across All 694 Routes)

Today's live app splits lessons across three vertical-scroll layouts (`SectionPlayerPage` 7-stage stack, `ConceptFirstLessonPlayer` 7-stage stack, `UnifiedSubsectionPlayer` 9-stage stack) and shows redundant `2D & Text` / `2D view` controls on already-2D pages. Katrio Universe consolidates **all 694 routes** into **one calm, consistent 4-Tab Workspace**:

### Layout & Chrome Rules (Desktop, Tablet, Mobile)
- **Compact Sticky Lesson Header (1 row):** Breadcrumb link to Chapter, Section Number + Title, Printed Page pill (`p. 50`), Honest Quality-Tier pill (`Assessed Pilot` / `Interactive` / `Explained` / `Indexed`), Local Progress Stage (`Visited` / `Explored` / `Practised` / `Understood ✓`), and 3 clean icons: `Topics Drawer`, `Focus Mode`, `Save`. **No top-level `2D view` button on already-2D lessons!**
- **Four Non-Linear Accessible Tabs (`role="tablist"`):** Students may click tabs in **any order** — nothing is locked behind "finish Tab 1 first."
  - **Desktop / Tablet (`≥ 768 px`):** Clean 4-pill horizontal bar directly under the header + sticky `← Prev` / `Next →` buttons.
  - **Mobile (`< 768 px`):** Fixed accessible 4-icon bottom navigation bar (`48 px` tall, `≥ 44×44 px` hit targets) — eliminating 7 rows of stacked jump chips!
- **Contextual View Switcher (Strictly Inside 3D/Combined Viewers Only):**
  - On `interactive-2d`, `interactive-language`, and `scenario-game` routes: **zero `2D & Text` toggle bar** (a discreet `"Text & keyboard summary"` disclosure sits inside the accessibility helper if needed).
  - On `synchronized-2d-3d` routes: clean 3-mode viewer bar strictly inside the stage: **`3D + 2D Split`** (desktop default) | **`2D Diagram`** | **`Text Guide`** (mobile defaults cleanly to stacked/tabbed 2D-first with 1-tap 3D launch so low-end phones load instantaneously!).

### Inside Each of the Four Tabs

| Tab | Learner Purpose | Exact Content Structure (Never More Than 1 Primary Control Cluster Visible at Once) |
| :--- | :--- | :--- |
| **TAB 1: Discover & Explore** | Hook curiosity, explain simply, predict, experiment, and see cause-and-effect. | 1. **15–30 s Curiosity Hook** (1 bold question).<br>2. **Layered Explanation Toggle:** `Simple (ELI5)` \| `Rigorous & Exam Terms` \| optional `தமிழ் உதவி`.<br>3. **Pre-Lab Prediction Prompt** (optional 1-click guess before experimenting).<br>4. **Generous Main Interactive Stage** (2D lab, synced 3D+2D scene, illustrated storyboard, Tamil grammar tree, or map/scenario) with **Active Micro-Mission banner**, live units/bounds, Pause/Reset, and **"What Changed & Why?"** dynamic readout.<br>5. **Free Exploration Mode** toggle (explore freely after or before trying the mission). |
| **TAB 2: Connect & Remember** | Build mental models, link prerequisites, bust misconceptions, and lock durable recall. | 1. **Light, Accessible Interactive Concept Map** (replaces dark slate radial box with bright zoomable/list-toggleable graph featuring **explicit typed edge labels**: *causes*, *requires*, *contrasts with*, *measured in*).<br>2. **Common Misconception Flip-Cards** ("What many students think" vs. "What actually happens & why").<br>3. **Key Terms & Compare/Contrast Strip**.<br>4. **Spaced Retrieval Flashcards (`≥ 5` genuinely distinct cards):** why / how / diagram-cue / compare / apply — saved locally (`Know` / `Review Again`).<br>5. **Optional "Teach It Back" Local Scratchpad** (student explains in 2–3 sentences in English or Tamil; saved on device only). |
| **TAB 3: Solve & Apply** | Move from guided reasoning to independent unfamiliar transfer (the true mastery gate!). | 1. **Revealable Worked Example** (step-by-step reasoning using KaTeX/diagrams; student reveals one step at a time).<br>2. **Guided Practice Problem** with tiered hints (Hint 1 → Hint 2 → Reasoning).<br>3. **Unfamiliar Transfer Challenge (Mastery Gate):** Fresh numbers/context/passage not copied from the worked example; item-level error-specific explanations. Passing unlocks `Understood ✓`.<br>4. **Creative / Real-World Extension** (e.g., design constraint, alternate ending, civic choice) + *"Why This Matters Elsewhere"* links to other subjects. |
| **TAB 4: Book & Revision** | Ground everything transparently in the official TN Class 10 textbook (placed last by default, 1 tap away anytime). | 1. **Source Provenance Card:** Textbook edition, exact subsection heading, printed & PDF page numbers.<br>2. **Chunked Rights-Safe Study Notes** in original textbook order with tap-glossary popovers (paraphrased original prose; zero verbatim copyrighted copying).<br>3. **Textbook Figures & Exercise Crosswalk** (maps textbook Figure/Table/Exercise numbers to Katrio interactive practice).<br>4. **Syllabus vs. Explore Further Split** + **Printable Revision Summary** + Prev/Next chapter links. |

---

## Part B — Gate 2 Interactive Vertical Slice: Six Working-Pilot Specifications

Every pilot below is anchored to **verified canonical IDs and PDF pages** inspected directly in `10th-Books/` and `src/data/curriculum_registry_class10.json`. All six are designed to pass the **15-Point Gold-Standard Playability Test** before Gate 3 scaling begins.

---

### Pilot 1 (Science — Dual Showcase Spec)

#### Pilot 1A: Electricity → Heat (`science-04-auto-4-8-1-joule-s-law-of-heating`)
- **Verified Textbook Anchor:** `Class 10 Science (2024 Reprint)`, Unit 4 Electricity, Section `4.8.1 Joule's Law of Heating`, Printed pp. `50–51` (PDF pp. `58–59`), Fig. `4.9`, Solved Problem 6.
- **One-Line Purpose:** *Discover why doubling electric current quadruples heat output in a nichrome heating coil (`H = I²Rt`).*
- **Representation (`interactive-2d` + optional contextual appliance modal):** Precision 2D nichrome-coil workbench + synchronized live parabolic `H vs. I` curve (`JoulesLawLab2D`), with an optional lightweight *"Where is this used?"* toggle (electric iron nichrome alloy vs. low-melting fuse wire vs. high-melting tungsten filament — p. 51).
- **Controls, Units & Bounds:** Current `I` (`0.5–10.0 A`, step `0.5 A`), Resistance `R` (`1–20 Ω`, step `1 Ω`), Time `t` (`1–60 s`, step `1 s`), plus keyboard `−`/`+` steppers and Reset.
- **Micro-Mission:** *"Starting from `I = 2 A, R = 5 Ω, t = 10 s` (`H = 200 J`), generate exactly `800 J` (`4×` heat) by changing **only current `I`**."*
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* TN Solved Problem 6 (`R = 5 Ω`, `H = 100 J`, `t = 1 s` → find `I` and `V`).
  - *Unfamiliar Transfer:* *"A room heater coil runs at `I = 3 A` for `20 s` through `R = 10 Ω`. If a technician replaces the wire so current drops to `1.5 A` while resistance doubles to `20 Ω` for the same `20 s`, does heat stay the same, halve, or quarter? Calculate exact new `H`."* (Correct: `H_1 = 1800 J`, `H_2 = 900 J` → halves because `I²` quarters while `R` only doubles!)
- **5+ Distinct Flashcards:** (1) Scaling law (`2I → 4H`), (2) Why nichrome is chosen (high resistivity + high melting point + resists oxidation), (3) Contrast fuse wire vs. bulb filament melting points, (4) SI unit distinction (`J` energy vs. `W` power), (5) Why high-voltage grid lines reduce `I²R` line loss (*Explore Further*).
- **Accessibility & Performance:** Pure SVG + KaTeX (`< 20 KB`), full keyboard stepper parity, `reduced-motion` freezes coil shimmer, data table toggle.

#### Pilot 1B: Safe Chemical Reaction Studio (`science-10-auto-10-1-types-of-chemical`)
- **Verified Textbook Anchor:** `Class 10 Science (2024 Reprint)`, Unit 10 Types of Chemical Reactions, Section `10.1`, Printed pp. `138–144` (PDF pp. `146–152`).
- **One-Line Purpose:** *Watch how atoms rearrange across five reaction types — linking live 3D molecular collisions and glassware observations to a synchronized 2D process flowchart and balanced equation.*
- **Representation (`synchronized-2d-3d`):** Bright glass-studio 3D reaction flask & ball-and-stick molecule view (`ChemistryMixingLab3DCanvas` upgraded to bright daylight studio lighting) **paired side-by-side** with an interactive **2D Process Flowchart** (`Reactants` → `Conditions / Activity Series Check` → `Particle Rearrangement` → `Macroscopic Observation` → `Balanced Equation + Green Atom-Conservation Bars`).
- **Scientifically Valid Controls (Zero Fake Kinetics!):** Reagent pair selector (safe textbook reactions: `2Mg + O₂ → 2MgO`, `CaCO₃ --Δ--> CaO + CO₂↑`, `Zn + 2HCl → ZnCl₂ + H₂↑`, `Cu + HCl → No Reaction`, `Pb(NO₃)₂ + 2KI → PbI₂↓ (yellow) + 2KNO₃`), Heat/Condition toggle, Reaction-Class Prediction buttons, and Stoichiometric Coefficient steppers (`1–4`). **Zero dangerous physical lab recipes; zero fabricated reaction-rate curves.**
- **Micro-Mission:** *"1. Predict what happens when Copper (`Cu`) vs. Zinc (`Zn`) enters dilute `HCl`. 2. Trigger the yellow `PbI₂` precipitate reaction and balance every element bar to green (`Pb`, `N`, `O`, `K`, `I`)."*
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* Balancing `CH₄ + 2O₂ → CO₂ + 2H₂O` (p. 138) and verifying atom counts.
  - *Unfamiliar Transfer:* *"Iron nails are dipped in aqueous `CuSO₄` (blue), and separately silver wire is dipped in aqueous `FeSO₄`. Using the reactivity series, predict which vessel reacts, classify the reaction type, and balance the equation."*
- **5+ Distinct Flashcards:** (1) Combination vs. Decomposition energy direction, (2) Why `Cu + HCl` gives no `H₂`, (3) Identifying precipitate double-displacement cues, (4) Why subscripts must NEVER change during balancing, (5) Thermal vs. electrolytic vs. photolytic decomposition.
- **Accessibility & Performance:** Viewer switcher (`3D + 2D Split` | `2D Flowchart Only` | `Text Observation Log`); procedural Three.js glass & spheres (`< 40 KB` code, `0 MB` external GLB!).

---

### Pilot 2 (Mathematics — Linked 2D Proof + 3D Solids/Nets Pair)

#### Pilot 2A: Constrained 2D Geometry Proofs (`maths-04-03`)
- **Verified Textbook Anchor:** `Class 10 Mathematics (2025 Revised)`, Chapter 4 Geometry, Section `4.3 Thales Theorem and Angle Bisector Theorem`, Printed pp. `171–180` (PDF pp. `177–186`), Activity 2 (ruled-paper parallel cut, p. 172), Theorems 1–4.
- **One-Line Purpose:** *Move points under exact geometric constraints to see why a line parallel to one side divides the other two sides proportionally — and how an angle bisector divides the opposite side in the exact ratio of adjacent sides.*
- **Representation (`interactive-2d` — `MathProofEngine`):** Two cleanly separated interactive modes inside `4.3` (never conflated!):
  1. **Thales / BPT Mode:** Labelled triangle `△ABC` with vertices `A, B, C`, parallel line `DE ∥ BC` marked with chevron parallel arrows, live segment lengths `AD, DB, AE, EC`, and live ratio bars proving `AD/DB = AE/EC` to `< 1e-6` precision at every slider/drag step.
  2. **Angle Bisector Theorem (ABT) Mode:** Distinct labelled triangle `△ABC` with internal angle bisector `AD` (`∠BAD = ∠CAD` marked with equal arc ticks!), live side lengths `AB, AC, BD, DC`, proving `AB/AC = BD/DC` dynamically as vertex `A` moves!
- **Micro-Mission:** *"(a) In Thales mode, set `AD/DB = 2.00` while keeping `DE ∥ BC` and verify `AE/EC`. (b) Switch to Angle Bisector mode, make `AB = 1.5 × AC`, and verify where `D` lands on `BC`."*
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* Revealable step-by-step Activity 2 / Example finding `EC` when `DE ∥ BC`.
  - *Unfamiliar Transfer:* *"In `△PQR`, ray `PS` bisects `∠QPR` meeting `QR` at `S`. If `PQ = 10 cm`, `PR = 15 cm`, and total side `QR = 12.5 cm`, find exact `QS` and `SR` — then test whether a line `XY` cutting `PQ` at `4 cm` and `PR` at `7 cm` is parallel to `QR`."*
- **5+ Distinct Flashcards:** (1) Parallel assumption required for Thales, (2) Converse of Thales diagnostic test, (3) Difference between Thales (parallel line) vs. ABT (equal-angle bisector), (4) Full-side proportion `AD/AB = AE/AC`, (5) Common trap: adding segments instead of dividing ratios.

#### Pilot 2B: Linked 3D Mensuration Solids & 2D Unfolded Nets (`maths-07-02`, linked with `maths-07-03`)
- **Verified Textbook Anchor:** `Class 10 Mathematics (2025 Revised)`, Chapter 7 Mensuration, Section `7.2 Surface Area` & `7.3 Volume`, Printed pp. `270–289` (PDF pp. `276–295`), Examples `7.1–7.4`.
- **One-Line Purpose:** *Unfold a 3D cylinder, cone, frustum, or combined tank into its flat 2D net to see where `2πrh`, `πrl`, and `πr²h` come from — then engineer a water tank.*
- **Representation (`synchronized-2d-3d` — `CombinedSceneEngine`):** Interactive 3D rotatable/sliceable solid (`Mensuration3DCanvas`) **synchronized live** with an **animated 2D Unfolded Net SVG** (e.g., cylinder unwraps into a `2πr × h` rectangle + two `πr²` circles; cone unwraps into a circular sector of radius `l` and arc `2πr`!) + exact `π = 22/7` KaTeX readouts.
- **Controls, Units & Bounds:** Solid selector (`Cylinder`, `Hollow Cylinder`, `Cone`, `Sphere`, `Hemisphere`, `Frustum`, `Combined Tank`), Radius `r` (`1–14 m`), Height `h` (`2–20 m`), **Unfold Net Slider (`0%` solid → `100%` flat 2D net)**, Pause/Reset.
- **Micro-Mission (*Engineering Challenge*):** *"Design a cylindrical + hemispherical-dome village water tank holding at least `1,000 m³` while keeping outer sheet-metal surface area (`TSA`) below `580 m²`!"*
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* Example 7.2 (`CSA = 88 cm²`, `h = 14 cm` → diameter `2 cm`) & Example 7.4 hollow cylinder paint area (pp. 272–273).
  - *Unfamiliar Transfer:* *"A conical tent has base radius `7 m` and vertical height `24 m`. Find slant height `l`, canvas area required (`π = 22/7`), and cost if canvas is `₹120/m²` — why is `TSA` NOT used for the tent roof?"*
- **5+ Distinct Flashcards:** (1) Why cylinder CSA equals rectangle `2πr × h`, (2) Slant height `l = √(r² + h²)` vs vertical height `h`, (3) Why hollow cylinder TSA adds two ring areas `2π(R² - r²)`, (4) When to add vs exclude joined circular faces on combined solids, (5) Effect on volume (`8×`) vs surface area (`4×`) when all dimensions double.

---

### Pilot 3 (English — Illustrated 2D Story Studio, Zero 3D)

#### Pilot 3: *His First Flight* (`english-01-prose`)
- **Verified Textbook Anchor:** `Class 10 English (2024 Reprint)`, Unit 1 Prose: *His First Flight* by Liam O'Flaherty, Printed pp. `2–7` (PDF pp. `6–11`), Comprehension, Parts of Speech (p. 7).
- **One-Line Purpose:** *Step inside the young seagull's cliff-edge dilemma — investigate how fear, hunger, and family strategy turn hesitation into courage.*
- **Representation (`interactive-language` — `StoryLanguageEngine`, 0% 3D):** Retires `EnglishStory3DCanvas` / `Stork.glb` completely! Replaces it with a warm **Illustrated 2D 5-Scene Coastal Storyboard** (SVG cliff-ledge, sea expanse, mother hovering with fish, plunge, gliding over green sea) with:
  1. **Character Motivation Inspector:** Switch between *Young Seagull*, *Mother Seagull*, and *Father & Siblings* at each scene to compare internal fear vs. tough-love intent using paraphrased textual evidence.
  2. **5-Beat Chronological Sequencer:** Keyboard-accessible reorder puzzle connecting cause → turning point → resolution.
  3. **Contextual Vocabulary & Word-Form Micro-Game:** Uses verified Unit 1 grammar task (p. 7 — transforming words between noun/verb/adjective/adverb in fresh sentences, e.g., *amusedly → amusement*, *depth → deep*, *successful → succeed*) + contextual idioms (*brink, preening, beckoning, swooped*).
  4. **Optional Creative Alternate-Ending Prompt (Local-Only):** *"What if the mother had simply dropped the fish onto the ledge? Write a 3-sentence alternate ending and explain how it would change the story's theme (clearly marked Your Creative Version vs. Liam O'Flaherty's Original Plot)."*
- **Rights Posture:** Zero verbatim copyrighted story text copied; original paraphrased story beats + textbook page citations (`pp. 2–5`).
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* Evidence-based inference showing why the mother halted just out of reach (linking hunger as the trigger to overcome fear).
  - *Unfamiliar Transfer:* A brand-new 4-line original short passage about a nervous student learning to swim — student identifies the parallel emotional turning point, cites one piece of textual evidence, and transforms two bold words into requested parts of speech.
- **5+ Distinct Flashcards:** (1) Central conflict (fear of wing failure vs. innate ability), (2) Why parents refused food (tough love vs. cruelty), (3) Turning point catalyst (sight of mother tearing fish), (4) Vocabulary in context (*plaintively / beckoning / skim*), (5) Word-form transformation rule (adjective ↔ adverb ↔ noun).

---

### Pilot 4 (Tamil — Interactive 2D Literature & இலக்கணம் Studio, Zero 3D Pillars)

#### Pilot 4: இயல் 4 *மணற்கேணி* (`tamil-04-01` & `tamil-04-04`)
- **Verified Textbook Anchor:** `Class 10 Tamil (2025 Revised)`, இயல் 4 *மணற்கேணி*:
  - `tamil-04-01`: உரைநடை — *மொழிபெயர்ப்புக் கல்வி*, Printed pp. `72–75` (PDF pp. `82–85`).
  - `tamil-04-04`: கற்கண்டு — *இலக்கணம் – பொது* (திணை, பால், எண், இடம், காலம், வழு, வழாநிலை, வழுவமைதி), Printed pp. `84–88` (PDF pp. `94–98`), plus மொழியோடு விளையாடு (p. 91 / PDF p. 101).
- **One-Line Purpose:** *பிறமொழி அறிவுகளைத் தமிழில் செம்மையாக மொழிபெயர்க்கும் நுட்பத்தையும், திணை–பால்–வழுவமைதி இலக்கண அமைப்பையும் 2D பயிற்சிகள் வழியாகத் தெளிவாக உணர்க.*
- **Representation (`interactive-language` — `StoryLanguageEngine:TamilStudio2D`, 0% 3D):** Retires `Tamil3DStageCanvas` (the 3D pillars) completely! Features crisp `Noto Sans Tamil` typography (`16–18 px`, `line-height: 1.75`) and three interactive 2D benches:
  1. **மொழிபெயர்ப்புச் செம்மை Comparator (`tamil-04-01`):** Interactive word-by-word literal-vs-contextual translation workbench (e.g., *Camel* → `வடம்` [rope] vs. `ஒட்டகம்` [camel] in *"ஊசி காதில் வடம் நுழையாது"*, p. 74; comparing awkward literal translations against idiomatic Tamil).
  2. **Visual இலக்கணம் Tree & Sentence Builder (`tamil-04-04`):** Interactive 2D tree mapping **இருதிணை** (`உயர்திணை`, `அஃறிணை`) → **ஐம்பால்** (`ஆண்பால்`, `பெண்பால்`, `பலர்பால்`, `ஒன்றன்பால்`, `பலவின்பால்`) → **மூவிடம்** (`தன்மை`, `முன்னிலை`, `படர்க்கை`) where selecting a subject + verb highlights agreement (`வழாநிலை`) vs. mismatch (`வழு`) live!
  3. **வழு → வழாநிலை → ஐந்து வகை வழுவமைதி Sorter:** Classify sentences into `திணை / பால் / இட / கால / மரபு வழுவமைதி` with clear contextual Tamil explanations (why poetic/affectionate exceptions are grammatically accepted).
- **Editorial Governance Gate:** Explicitly badged **`Provisional — Pending Tamil Educator Proofreading`** (never `educator_approved` until reviewed by a qualified TN Class 10 Tamil teacher; zero raw automated PDF glyph dumps used!).
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* Why *"என் அம்மை வந்தாள்"* (referring lovingly to a cow) is `திணை வழுவமைதி` rather than an error.
  - *Unfamiliar Transfer:* Correct two unseen `வழு` sentences into `வழாநிலை` and choose the best idiomatic Tamil translation for a new English science/proverb sentence (explaining why literal word-for-word fails).
- **5+ Distinct Flashcards:** (1) மொழிபெயர்ப்பு ஏன் `பயன்கலை` எனப்படுகிறது, (2) *வடம்* vs *ஒட்டகம்* பொருள் வேறுபாடு, (3) உயர்திணை (3 பால்) vs அஃறிணை (2 பால்) அமைப்பு, (4) வழு vs வழாநிலை vs வழுவமைதி வேறுபாடு, (5) ஐந்து வகை வழுவமைதி அடையாளக் குறிப்புகள்.

---

### Pilot 5 (Social Science — Dated, Sourced 2D Cold War Maps & Causal Choices)

#### Pilot 5: History Unit 4 — *Cold War Era* (`social-history-04-auto-4-2-cold-war-rivalry` + linked `4.3–4.8`)
- **Verified Textbook Anchor:** `Class 10 Social Science (2025 Revised)`, History Unit 4 *The World After World War II*, Printed pp. `43–48` (PDF pp. `49–54`) — `4.2 Cold War` (`p. 43`), `4.3 Military Alliances` (`pp. 43–44`), `4.4 Korean War` (`p. 44`), `4.5 Non-Aligned Movement` (`p. 44`), `4.6 Cuban Revolution & Missile Crisis` (`pp. 44–45`), `4.7 Arab-Israeli War` (`pp. 45–47`), `4.8 Vietnam War` (`pp. 47–48`).
- **One-Line Purpose:** *Explore how ideological rivalry between the US and USSR reshaped Europe, Asia, and newly independent nations from 1947 to 1975 — without collapsing six distinct events into one generic globe.*
- **Representation (`interactive-2d` + `scenario-game` — `TimelineMapEngine`):** Uses Katrio's verified NASA Blue Marble 2D map basemap (`AccurateGeoMaps2D`) upgraded with **per-subsection dated map frames** (NOT one repeated globe!):
  - `4.2` Cold War (`1947–1949`): Zoomed Europe map contrasting Truman Doctrine / Marshall Plan aid zones vs. Soviet Eastern Bloc.
  - `4.3` Alliances (`1949–1955`): Toggleable dated layers (`NATO 1949`, `SEATO 1954`, `Warsaw Pact 1955`, `CENTO 1955`) showing exact member regions with clear legend disclaimers (*schematic alliance memberships as taught in TN Class 10, pp. 43–44*).
  - `4.5` Non-Aligned Movement (`1955 Bandung → 1961 Belgrade`): Highlights India, Yugoslavia, Egypt, Indonesia, Ghana — contrasting neutral sovereignty against military bloc alignment.
  - `4.6` Cuban Missile Crisis (`Oct 1962`): Zoomed Caribbean theatre showing US–Cuba–USSR escalation timeline & diplomatic off-ramp.
- **Causal Decision Micro-Mission:** *"You are a newly independent Asian nation's delegate at Bandung (1955) & Belgrade (1961). Weigh three policy options (Join NATO/SEATO, Join Warsaw Pact, or Adopt Non-Alignment) — observe documented historical consequences and separate documented historical facts from historians' interpretations."*
- **Worked + Unfamiliar Transfer Check:**
  - *Worked:* Trace the causal chain from WWII devastation in Western Europe → Marshall Plan (1947) → NATO (1949) → Warsaw Pact (1955).
  - *Unfamiliar Transfer:* *"Compare why both the Korean War (`1950–1953`) and Vietnam War (`1955–1975`) became 'hot' proxy conflicts during a 'Cold' War, and explain one reason NAM leaders opposed permanent military pacts."*
- **5+ Distinct Flashcards:** (1) Containment & Truman Doctrine vs. Marshall Plan, (2) NATO vs. Warsaw Pact founding purpose, (3) 38th Parallel & Korean War outcome, (4) Five NAM founding leaders & 4 core principles, (5) Why October 1962 Cuban Missile Crisis shifted diplomacy toward direct communication.

---

### Pilot 6 (Cross-Subject Challenge Arcade Capstone)

#### Pilot 6: ***Design a Sustainable Tamil Nadu Town*** (`/arcade/sustainable-tn-town`)
- **Verified Cross-Subject Textbook Anchors (Explicitly Linked — Zero Fake Alignment!):**
  1. **Mathematics (`maths-07-02` & `maths-07-03`, pp. 270–289):** Calculate cylindrical rainwater storage tank volume `V = πr²h` (`π = 22/7`) and curved/total surface area for construction material budget.
  2. **Science Electricity & Environment (`science-04-auto-4-9-electric-power`, p. 51; `science-22-auto-22-6-4-wind-energy`, p. 321; `science-22-auto-22-7-rainwater-harvesting`, p. 322; `science-22-auto-22-8-electrical-energy`, p. 323):** Balance daily town `kWh` electricity demand using solar/wind/LED efficiency (`P = VI`, `1 kWh = 3.6×10⁶ J`) and size rooftop rainwater harvesting recharge pits.
  3. **Social Science Geography (`social-geography-06-auto-6-1-location-and-size` & `6.7 Climate`, pp. 201–209):** Account for Tamil Nadu's Northeast Monsoon (`Oct–Dec`) dominance and Western Ghats rain-shadow pattern when siting tanks and wind turbines (e.g., Aralvaimozhi / Muppandal pass).
  4. **Social Science Economics (`social-economics-04-auto-4-1-role-of-government-in` & `4.3 Types of Taxes`, pp. 321–324):** Allocate a simplified ₹100-unit municipal development budget across clean water, renewable streetlamps, schools, and sanitation (*clearly badged as a simplified educational model — NOT actual statutory Tamil Nadu municipal tax rates!*).
  5. **English / Tamil Communication (Tab 3 Creative Reflection):** Write a concise 3-point citizen proposal in English or Tamil justifying your town's design trade-offs (saved locally; exportable).
- **Beyond-Syllabus Enrichment Tag:** Any real-world reference numbers (e.g., Chennai mean annual rainfall ~1,400 mm vs. Coimbatore rain-shadow ~700 mm, Muppandal wind corridor engineering context) carry an explicit **`Explore Further (Beyond Board Syllabus)`** badge + credible public source note.
- **Playable Loop (Save/Resume Locally, Untimed):**
  - **Stage 1 (Water — Maths + Geography + Science 22.7):** Choose town region (Coastal NE Monsoon vs. Interior Rain-Shadow), pick tank radius `r` and height `h` to meet dry-season demand without exceeding material area cap.
  - **Stage 2 (Energy — Science 4.9 + 22.6/22.8):** Swap incandescent streetlamps for LEDs (`4.11`), add wind/solar capacity, and calculate daily `kWh` saved.
  - **Stage 3 (Public Budget — Economics 4.1/4.3):** Balance public-service investments against progressive/local-fee revenue trade-offs with zero deficit meltdown.
  - **Stage 4 (Explain & Transfer):** Answer 3 cross-subject unfamiliar transfer questions + generate a printable/exportable *"What Did I Learn?"* reflection card linking back to all 5 textbook chapters!
- **5+ Distinct Cross-Subject Flashcards:** (1) Why volume scales faster than tank surface area as `r` increases, (2) Converting Watts + hours into `kWh`, (3) Why Tamil Nadu relies heavily on the Northeast Monsoon, (4) Rooftop rainwater percolation vs. surface runoff, (5) How public taxes fund non-excludable infrastructure like streetlighting and drainage.
