# Katrio — Interactive Reuse Root-Cause Audit (Baseline Before Rebuild)

**Audit Date:** 2026-11-23  
**Scope:** Full source-code inspection of the live Katrio repository (`src/`, `scripts/`, `public/`) cross-referenced against the five official Tamil Nadu State Board Class 10 PDFs verified directly on disk under `10th-Books/`:
- `Class_10_Science_English_2024_Edition-www.tntextbooks.in.pdf` (2024 Reprint, 360 pp, offset `+8`)
- `Class_10_Mathematics_English_2025_Edition-www.tntextbooks.in.pdf` (2025 Revised, 352 pp, offset `+6`)
- `Class_10_English_2024_Edition-www.tntextbooks.in.pdf` (2024 Reprint, 224 pp, offset `+4`)
- `Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf` (2025 Revised, 184 pp, offset `+10`)
- `Class_10_Social_Science_English_2025_Edition-www.tntextbooks.in.pdf` (2025 Revised, 344 pp, offset `+6`)

---

## 1. Confirmed Architectural Root Causes (Exact File & Line Citations)

| # | File & Line Reference | Confirmed Root Cause | Concrete Impact Across the 694 Registered Routes |
| --- | --- | --- | --- |
| **RC-1** | `src/components/engines/TopicInteractiveLabs.tsx:1356–1428` | `getTopicAwareLabLabel()` and `renderTopicAwareInteractiveLab()` dispatch by coarse `sectionId.startsWith(...)` chapter prefixes (e.g., `science-04`, `science-16`, `science-17`, `maths-04`, `science-18/19/20`, `science-21/22`) and `social-*` strand prefixes. | **501 / 694 routes** (`443` chapter-prefix + `58` strand-prefix) receive identical chapter-wide 3D scenes regardless of the actual textbook subsection concept. |
| **RC-2** | `src/components/engines/MathsChapter3DCanvas.tsx:266–301` | The `kind === 'geometry'` Thales scene plots five white vertex spheres (`A`, `B`, `C`, `D`, `E`) in a loop without attaching individual letter labels beside any vertex. | Students cannot tell which point is `A`, `B`, `C`, `D`, or `E` when interpreting `AD/DB = AE/EC`. |
| **RC-3** | `src/components/engines/MathsInteractiveLabs.tsx:162–192` | `MathsGeometry3DLab` serves ALL **12** Mathematics Chapter 4 subsections with a single Thales ratio slider and hardcodes a 3-bullet summary lumping Thales (4.3), Angle Bisector (4.3), and Tangent–Radius Theorem (**4.5 Circles and Tangents**) together. | Similarity (4.2), Angle Bisector (4.3), Pythagoras (4.4), Circles & Tangents (4.5), and Concurrency (4.6) all render the same unlabelled Thales triangle. |
| **RC-4** | `src/components/engines/EngineShell.tsx:215–219` + `TopicInteractiveLabs.tsx` + `MathsInteractiveLabs.tsx` + `SocialInteractiveLabs.tsx` | `handleCompleteMilestone()` immediately calls `markDemoCompleted(sectionId)`, which `getSectionProgressStage()` (`src/features/local-progress/progressStore.ts:72–76`) treats as **`completed` (mastered)**. Across labs, `onComplete(...)` fires on a single slider move (`onChange`), toggle click (`setTopology`, `setLensType`, `setMaterial`, `setSpoons`, `setRatio`), or info card click! | **684 / 694 routes** can falsely report `Completed` without solving any transfer problem or validating conceptual understanding. |
| **RC-5** | `src/data/lesson_content/index.ts:62–72` | `LESSON_MAP` aliases each of the 25 legacy pilot JSON packages onto `lesson.related_section_ids`. | **60 distinct sibling routes** silently inherit another subsection's title, learning objectives, flashcards, and concept-check quizzes (e.g., `maths-07-03` Volume inheriting `maths-07-02` Surface Area). |
| **RC-6** | `src/components/engines/TopicInteractiveLabs.tsx:987–998` | `SolubilityMixerLab` labels `spoons > maxDissolved` (undissolved solute sitting on the beaker floor at constant temperature) as **`"Supersaturated — 3D Crystals Precipitating!"`**. | **Confirmed scientific error** across all 13 Science Unit 9 routes (TN Class 10 Science p. 126–127 explicitly states excess solute settling at constant temperature is a **saturated solution with undissolved excess**, whereas supersaturation requires altering temperature/pressure first and produces a metastable dissolved state). |
| **RC-7** | `src/components/engines/BiologyCell3DCanvas.tsx:340–431` + `TopicInteractiveLabs.tsx:711–793` | `Gametogenesis3DLab` uses procedural glowing spheres and sinusoidal tail animation for sperm/ovum and dispatches to ALL **17** Science Unit 17 subsections (including vegetative/asexual reproduction, flower/ovule, pollination, plant double fertilization, menstrual cycle, fetal development, and personal hygiene). | Pedagogically irrelevant for 14/17 Unit 17 topics and visually unsettling/over-animated for adolescent anatomy learning in `17.8.1` & `17.8.2`. |

---

## 2. Keep / Refine / Replace Decision Matrix for Existing Engines

| Existing Engine / Component | Decision | Rationale & Required Action |
| --- | --- | --- |
| `UnifiedSubsectionPlayer.tsx` + `HistoryUnit4Interactive2D.tsx` + `SubsectionConceptMap.tsx` | **KEEP & GENERALIZE** | Already implements calm, understanding-first 2D learning with zero premature mastery bugs (`10/10` History Unit 4 subsections). Generalize into our reusable **Concept-First Lesson Player** supporting bespoke 2D/hybrid STEM & Humanities labs. |
| `HeartCirculationEngine.tsx` + `ModelExplorer3DCanvas.tsx` (Science 14.15) | **KEEP (REFINE MASTERY)** | Genuine spatial 3D anatomy with 2D SVG cutaway + fixed cutaway rear-shell transparency. Decouple `onComplete` so exploring never auto-claims mastery. |
| `ReactionLabEngine.tsx` + `ChemistryMixingLab3DCanvas.tsx` (Science 10.1) | **KEEP (REFINE MASTERY)** | Strong interactive 3D beaker pouring + atom-conservation equation balancer. Keep intact; gate completion on balanced equation + reasoning check. |
| `MoleculeBuilder3DEngine.tsx` (Science 7 & 11) | **KEEP (REFINE SCOPE)** | 3D spatial bond geometry adds genuine value for hydrocarbons & molecules; stop aliasing unrelated text-only atomic-mass subsections onto it without distinct objectives. |
| `TrigonometryClinometerEngine.tsx` & `TrigIdentitiesEngine.tsx` (Maths Ch. 6) | **KEEP (REFINE MASTERY)** | Verified exact surd calculations (`30°/45°/60°`), boundary error diagnostics, and clean 2D/3D support. |
| `Mensuration3DEngine.tsx` (Maths Ch. 7) | **KEEP (REFINE ALIASING)** | 3D solids (cylinder, cone, sphere, frustum) genuinely need 3D depth; decouple Surface Area vs Volume vs Conversion subsections over time. |
| `IndiaRelief3DEngine.tsx` (NASA/SRTM terrain) | **KEEP (USE SELECTIVELY)** | Valuable for Geography Unit 1 Physiography; do NOT reuse as decorative background for unrelated chapters. |
| `TopicInteractiveLabs.tsx -> SolubilityMixerLab` | **REFINE IMMEDIATELY (BUG FIX)** | Fix `Unsaturated` / `Saturated with undissolved excess` / genuine two-step `Supersaturated (heat → dissolve → cool calmly → seed crystal)` physics and wording. |
| `TopicInteractiveLabs.tsx -> ElectricityCircuitLab` | **KEEP FOR CIRCUITS ONLY / REPLACE FOR 4.3.1 & 4.8.1** | Valid for Series/Parallel circuits (`4.7.1`, `4.7.2`, `4.7.5`); **REPLACE** for `4.3.1 Electric Potential` (`ElectricPotentialLab2D`) and `4.8.1 Joule's Law` (`JoulesLawLab2D`), and remove broad `startsWith('science-04')` fallthrough! |
| `TopicInteractiveLabs.tsx -> NeuronHormone3DLab` | **RESTRICT TO UNIT 15 NERVOUS SYSTEM / REPLACE FOR ALL UNIT 16** | Valid only for Unit 15 Neuron/Brain topics. **REMOVE** from `science-16` entirely; replace `16.1.5 Ethylene` with `EthyleneRipeningLab2D` and `16.2.1 Pituitary Gland` with `PituitaryEndocrineLab2D`! |
| `MathsInteractiveLabs.tsx -> MathsGeometry3DLab` + `MathsChapter3DCanvas.tsx` | **FIX 3D LABELS & REPLACE WITH 2D SUITE FOR CH. 4** | Add permanent vertex letter sprites `A, B, C, D, E` to `MathsChapter3DCanvas.tsx`, remove broad `startsWith('maths-04')`, and build separate exact 2D SVG labs for `4.2 Similarity`, `4.3 Thales + Angle Bisector`, `4.4 Pythagoras`, `4.5 Circles & Tangents`, and `4.6 Concurrency`. |
| `TopicInteractiveLabs.tsx -> Gametogenesis3DLab` + `BiologyCell3DCanvas.tsx` | **REPLACE WITH CALM 2D GAMETE DIAGRAMS & SEPARATE UNIT 17** | Replace procedural glowing gametes with calm, respectful, textbook-labelled 2D medical SVG illustrations (`ReproductionDiagrams2D`) for `17.8.1 Sperm` and `17.8.2 Ovum`, calm the optional 3D renderer, and stop routing unrelated Unit 17 subsections to gametes! |
| `SocialInteractiveLabs.tsx` (3D Civics/Econ/History/Geo dioramas) | **REPLACE INCREMENTALLY WITH 2D** | History Unit 4 already migrated to bespoke 2D; remaining Social units queued for chapter-by-chapter 2D maps, timelines, and tax/policy models. |
