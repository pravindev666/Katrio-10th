# KATRIO — INTERACTIVE DUPLICATION, UX & SCIENTIFIC ACCURACY REPORT (PHASE 8 DELIVERABLE 4)

**Audit Date:** 2026-11-23  
**Audit Method:** Direct automated inspection of `src/data/curriculum_registry_class10.json`, `src/components/engines/*`, `src/routes/SectionPlayerPage.tsx`, and live user browser QA screenshots across all **694 registered Class 10 routes**.

---

## 1. Executive Audit Summary (Honest Live State Today)

While earlier rebuild phases eliminated the global premature-mastery bug (`onComplete` firing on slider drags), fixed the Science Unit 9 supersaturation scientific error, built 6 strong 2D concept-first pilots (`Science 4.3.1`, `4.8.1`, `16.1.5`, `16.2.1`, `17.8.1/2`, `Maths 4.2–4.6`), and eliminated the worst cross-subject mismatches (like Bacteria on Environment or Neurons on Ethylene), **six systemic codebase & UX defects STILL remain across the live app today**:

| # | Systemic Defect Verified in Live Codebase | Exact Count / Scope | Root Cause File(s) | Severity |
| :-: | :--- | ---: | :--- | :--- |
| **1** | **Stale Cross-Topic `accessibility_fallback` Text** (e.g., `13.1.4 Body wall` displaying *"Balanced chemical equation table, atom-count conservation breakdown, and text observation log for Body wall"*!) | **366 / 694 routes** (`243` non-chemistry routes + `116` non-coordinate Maths routes + `7` non-cutaway routes) | `src/data/curriculum_registry_class10.json` | **CRITICAL** |
| **2** | **Redundant `Interactive Lab \| 2D & Text` Toggle Bar on Already-2D Lessons** (clicking `2D & Text` hides the real interactive 2D diagram and reveals broken boilerplate text!) | **304+ routes** | `src/components/engines/EngineShell.tsx` (lines 280–325 & 880–950) | **HIGH** |
| **3** | **Dark Procedural 3D Scenes Where Interactive 2D Flowcharts / Diagrams Teach 10× Better** (e.g., `8.4 / 8.7 / 8.8 / 8.11` dark floating blue dome on black slab; `Maths 1/2/3/5/8` 3D canvases; `Science 2` 3D lens bench; legacy 3D in `English 01` & `Tamil 04`!) | **116 routes** | `ChemicalProcess3DCanvas.tsx`, `ScienceMismatchFixes2D.tsx`, `StoryStageEngine.tsx`, `TamilLanguageStudioEngine.tsx`, `MathsInteractiveLabs.tsx`, `PhysicsLab3DCanvas.tsx` | **HIGH** |
| **4** | **Intra-Chapter Bundled Multi-Topic Tabs & Shared Pin Sets** (e.g., clicking `8.4 METALLURGY` shows tabs for `8.7 Al`, `8.8 Cu`, `8.11 Rust`; clicking `13.1.4 Body wall` shows a shared Leech/Rabbit panel lacking dedicated Body Wall cuticle/epidermis/muscle layers; History/Geo subsections inside one unit share identical map pins!) | **~210 routes** | `ScienceMismatchFixes2D.tsx`, `SocialExtensions2D.tsx`, `TopicInteractiveLabs.tsx` | **HIGH** |
| **5** | **Generic Inferred Language Templates on Non-Pilot English (Units 3–7) & Tamil (இயல்கள் 1–3, 5–7)** instead of real textbook-grounded storyboards, poetic-device highlighters, memoriter trainers, and grammar trees | **47 language routes** (`15` English + `32` Tamil) | `LanguageStudioUnified2D.tsx` | **HIGH** |
| **6** | **Vertical Scroll Fatigue on Unrefactored Routes** (8–10 stacked boxes: Breadcrumbs → Header → Jump Bar → Spark/Explain → Dark Mind Map → Lab → "What to observe" → Key Ideas → Check → Flashcards → Textbook → Provenance) | **666 routes** | `src/routes/SectionPlayerPage.tsx`, `ChapterMindMapCard.tsx` | **MEDIUM-HIGH** |

---

## 2. Detailed Evidence of Live Defects

### Defect A — Stale `accessibility_fallback` Strings Across 366 Routes
Direct audit of `src/data/curriculum_registry_class10.json` revealed verbatim template duplication from the initial seed script:
- **294 routes** contain `"Balanced chemical equation table, atom-count conservation breakdown, and text observation log for <title>."` — of which **243 are NOT Chemistry** (Physics Units 1–6: `1.2 Inertia`, `2.16 Human Eye`, `4.10 Earthing`, `6.2 Alpha Decay`; Biology Units 13–22: `13.1.4 Body wall`, `16.1.1 Auxins`, `18.7 Sex Determination`, `22.7 Rainwater Harvesting`!).
- **116 Mathematics routes** contain `"Coordinate value table, equation derivation, and key-feature summary for <title>."` — even on `Maths 1` Relations, `Maths 2` Euclid's Lemma, `Maths 3` Matrices, `Maths 4` Geometry, and `Maths 8` Probability/Statistics!
- **Impact:** Directly visible whenever a student clicks `2D & Text` or scrolls to Stage 7 (`Textbook Reference & Accessible Summary`) — destroying trust in scientific accuracy!

### Defect B — Confusing `2D & Text` Button on Pure-2D Pages
- In `EngineShell.tsx`, the mode toolbar unconditionally renders `[Interactive Lab] [2D & Text]` even when `topicLabElement` is already a pure 2D SVG diagram, 2D map, or 2D language studio!
- Worse, `SectionPlayerPage.tsx` ALSO renders a top-right `[2D view]` button that flips `preferences.prefer2DPathway = true`, hiding ALL interactive 2D SVG diagrams and replacing them with the stale boilerplate string above!
- **Resolution:** Remove top-level `2D & Text` tabs completely from all Type A (Interactive 2D) and Type D (Language/Text) routes. Keep a clean, topic-accurate `"Switch to 2D / Text View"` toggle **strictly inside Type B / Type C 3D canvases** (`Heart`, `Brain/Neuron`, `3D Molecules`, `Plant Tissue Block`, `Maths Ch. 7 Solids`).

### Defect C — Chemistry Processes Need Bright 2D Interactive Flowcharts with Sliders (Not Dark Procedural 3D!)
- User screenshot of `8.4 / 8.11` confirmed that rendering a translucent hemisphere on a dark slab (`ChemicalProcess3DCanvas`) fails to show:
  - **Anode (`Fe → Fe²⁺ + 2e⁻`) vs Cathode (`O₂ + 2H₂O + 4e⁻ → 4OH⁻`)** electron flow across the iron surface;
  - **Baeyer → Alumina Kiln → Hall–Héroult Electrolytic Cell** step-by-step inputs (`Al₂O₃ + Na₃AlF₆ + CaF₂`), temperature slider (`150 °C → 950 °C`), voltage (`5–6 V`), and outputs (`4Al + 3O₂↑`);
  - **Combination, Decomposition, Displacement, Double-Displacement, Neutralization, and Oxidation/Reduction** distinct reaction flowcharts (`Reactants → Conditions → Particle Rearrangement → Products → Observations → Balanced Equation`).
- **Resolution:** Make **bright, high-contrast interactive 2D chemical process flowcharts with sliders** the primary representation for ALL of Units 8, 9, 10, and 11.6–11.9, while retaining clean 3D molecular geometry viewers ONLY for spatial bonding in Units `7.2–7.3` and `11.2–11.4`.

### Defect D — Residual Unnecessary 3D in English, Tamil, Optics & Mathematics
- `StoryStageEngine.tsx` (English Unit 1) still lazy-loads `EnglishStory3DCanvas.tsx` (low-poly cliff/seagull/island).
- `TamilLanguageStudioEngine.tsx` (Tamil இயல் 4) still lazy-loads `Tamil3DStageCanvas.tsx` (3D pillars for ஐம்பால்).
- `MathsInteractiveLabs.tsx` still uses `MathsChapter3DCanvas.tsx` on parts of `Maths 1, 2, 3, 5, 8` where crisp 2D interactive coordinate grids, arrow diagrams, and trees teach with exact mathematical clarity.
- `OpticsRayBenchLab` (Science Unit 2) uses a 3D laser box where a bright, draggable **2D Principal-Ray Diagram** (`F`, `2F`, optical centre `O`, live `u`, `v`, `f`, `m`) teaches ray tracing far better.

### Defect E — Bundled Multi-Topic Views Inside Single Chapters
- Clicking `8.4 METALLURGY` opens tabs for `8.7 Aluminium`, `8.8 Copper`, `8.11 Corrosion` instead of `8.4` Metallurgy ore concentration methods (Gravity separation, Magnetic separation, Froth floatation, Chemical leaching — TN Science pp. 112–114!).
- Clicking `13.1.4 Body wall` opens a generic Leech/Rabbit toggle without an actual 5-layer Leech Body Wall cross-section diagram (Cuticle, Epidermis, Dermis, Muscular layer, Botryoidal tissue — TN Science p. 189!).
- Clicking `14.1–14.17` (Science Unit 14), `6.1–6.4` (Maths Ch. 6), and `History 2–3, 5–10` / `Geography 2–7` currently share unit-wide scenes/pin lists across sibling subsections.

---

## 3. Scientific & Mathematical Accuracy Risk Register (Phase 9 Gate)

| Area | Accuracy Risk to Guard Against | Mandatory Guardrail / Automated Test |
| :--- | :--- | :--- |
| **Chemistry Unit 9 (Solutions)** | Mislabeling undissolved excess solid at constant temperature as *"supersaturated"*. | **Retained & Verified:** 4-state `evaluateSolubilityState()` enforces `Unsaturated`, `Saturated`, `Saturated + Undissolved Excess`, and 2-step metastable `Supersaturated` (tested in `conceptFirstRebuild.test.ts`). |
| **Chemistry Unit 8 & 10 (Flowcharts)** | Implying fake exact reaction rates, yields, or colour transitions not supported by textbook stoichiometry. | Expose ONLY scientifically justified sliders (`Temperature °C`, `Voltage V`, `pH 0–14`, `Stoichiometric coefficients`, `Presence of O₂ / H₂O / Catalyst / Coating`) and verify atom conservation programmatically. |
| **Mathematics Ch. 4 & Ch. 5 Geometry** | Unlabelled vertices, non-parallel "Thales" lines, or non-perpendicular tangents. | Every SVG proof must derive vertex coordinates mathematically so `DE ∥ BC`, `AD/DB = AE/EC`, `OP ⟂ PT = 90°`, and `a² + b² = c²` hold to `< 1e-6` precision at every slider value. |
| **Physics Unit 1, 2, 4, 6** | Sliders changing unrelated visual properties; wrong SI units; confusing Potential (`V`) with Current (`I`); linearizing `H = I²Rt`. | Lock exact formulas (`F = ma`, `τ = Fd`, `1/f = 1/v − 1/u`, `V = W/Q`, `H = I²Rt`, `²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He`) with automated unit tests against official TNSCERT Solved Problems. |
| **Biology Unit 17 & 21** | Cartoonish/unsettling gamete imagery; stigmatizing or sensationalized health visuals. | **Retained & Enforced:** Calm, neutral clinical 2D medical illustrations for gametes/reproduction; factual myth-vs-fact cards + Childline `1098` / `14417` for Unit 21. |
| **Tamil & English Content** | Automated English-to-Tamil literal translations or unverified Tamil grammar examples; verbatim copying of copyrighted modern prose/poems. | Zero verbatim copying of copyrighted selections; all Tamil grammar/poetry units stay flagged `editorialStatus: "provisional"` until reviewed by a qualified Tamil educator. |
| **Mastery & Completion Logic** | Marking a subsection `Completed` merely when a student drags a slider or views a tab. | **Retained & Enforced:** Interaction logs `explored` only; `completed` (`Understood ✓`) unlocks strictly after passing untimed conceptual + transfer checks. |

---

## 4. Keep / Improve / Replace / Remove Decision Summary

| Action | Exact Components / Scope |
| :--- | :--- |
| **RETAIN (Gold Standard)** | 6 Concept-First 2D pilot labs (`ElectricPotentialLab2D`, `JoulesLawLab2D`, `EthyleneRipeningLab2D`, `PituitaryEndocrineLab2D`, `MathsChapter4GeometryLabs2D`, `ReproductionDiagrams2D`), `HistoryUnit4Interactive2D` (`4.1–4.10`), `AccurateGeoMaps2D` (NASA true-coastline 2D maps), `HeartCirculationEngine` (3D+2D cutaway), `Mensuration3DEngine` (3D solids), `MoleculeBuilder3DEngine` (Units 7 & 11), `PlantAnatomy3DEngine` (Unit 12 tissues), `SolubilityMixerLab` (4-state logic), `progressStore` Gate 8 state machine, all 694 stable routes & Cloudflare SSG build. |
| **IMPROVE** | Upgrade `SectionPlayerPage.tsx` & `EngineShell.tsx` to a **calm, non-scrolling 4-Zone / Tabbed 11-Stage Workspace** (removing redundant `2D & Text` buttons on 2D lessons); purify all 366 stale `accessibility_fallback` strings in `curriculum_registry_class10.json`; split bundled multi-topic views (`Science 8.4–8.11`, `Science 13.1–13.2`, `History/Geography` per-subsection GPS pin focus); upgrade `ChapterMindMapCard` from heavy dark slate to calm, light high-contrast zoomable/expandable 2D concept graphs. |
| **REPLACE** | Replace `ChemicalProcess3DCanvas` dark dome/tanks in Chemistry Units `8`, `10`, `11.6–11.7` with **bright, textbook-faithful interactive 2D Chemical Process Flowcharts + sliders**; replace `EnglishStory3DCanvas` (English U1) & `Tamil3DStageCanvas` (Tamil U4) with **rich 2D Storyboards, Poetic-Device Highlighters, Memoriter Trainers, and Tamil Grammar Trees**; replace generic inferred templates in English Units 3–7 & Tamil இயல்கள் 1–3, 5–7 with book-audited 2D language experiences; replace legacy `MathsChapter3DCanvas` on Ch. 1, 2, 3, 5, 8 & 3D Optics bench on Unit 2 with precision 2D SVG labs. |
| **REMOVE** | Remove decorative 3D canvases from English & Tamil (`EnglishStory3DCanvas`, `Tamil3DStageCanvas`), unused `SocialInteractiveLabs.tsx` 3D dioramas (`CivicsEconomics3DCanvas`), redundant `2D & Text` switchers on non-3D views, and stale chemistry fallback strings from non-chemistry routes. |
