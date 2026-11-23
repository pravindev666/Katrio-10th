# Katrio — Concept-to-Engine Redesign Plan & Architecture

**Date:** 2026-11-23  
**Guiding Principle:** *Understand → Predict → Experiment → Explain → Solve → Remember.*  
Share rendering frameworks freely, **never** share an unrelated teaching scene across distinct textbook subsections.

---

## 1. Typed Exact-Section Manifest Architecture (Eliminating Prefix Fallthrough)

Instead of coarse `sectionId.startsWith('science-04')` / `startsWith('maths-04')` / `startsWith('science-16')` / `startsWith('science-17')` dispatching, Katrio introduces a strongly typed **Exact-Section Experience Registry**:

- **Schema:** `src/types/lessonExperience.ts` (`LessonExperienceSpec`, `ConceptFirstLessonPackage`, `InteractionMode`).
- **Manifest:** `src/data/exactSectionManifest.ts` — keyed strictly by exact `sectionId` (`Record<string, LessonExperienceSpec>`).
- **Zero Misleading Fallthrough Policy:**
  - For audited chapters undergoing concept-first rebuild (`science-04`, `science-16`, `science-17`, `maths-04`), `TopicInteractiveLabs.tsx` removes broad prefix fallthrough for unrelated topics.
  - If an exact `sectionId` has a verified `ConceptFirstLessonPackage` (or verified exact pilot), render its exact concept-first experience.
  - If a sibling `sectionId` in a refactored unit does **not** yet have its bespoke interactive authored, render an honest, calm, **Topic-Specific Study & Textbook Reading Scaffold** clearly identifying the interactive activity as *in development* — **never** an unrelated glowing circuit, human neuron, gamete model, or Thales triangle!

---

## 2. Explicit Mastery & Progress State Machine (`progressStore.ts`)

| State | Trigger | Counts as Mastered? |
| --- | --- | --- |
| `not_started` | Default initial state | No |
| `visited` (`started`) | Learner opens subsection route | No |
| `explored` | Learner manipulates interactive controls, sliders, toggles, or diagrams (`onInteract` / `markSectionExplored`) | **No** (Fixes the 684-route premature completion bug!) |
| `practised` | Learner submits an attempt on a substantive prediction or practice task (`markSectionPractised`) | **No** |
| `understood_checkpoint` (`completed`) | Learner passes a validated transfer problem / deterministic conceptual checkpoint (`recordQuizCheckpoint` with passing criteria or `markUnderstoodCheckpoint`) | **Yes** |
| `review_later` | Independent local bookmark flag toggled anytime by learner | Independent flag |

---

## 3. Pedagogical 2D / 3D Selection Rules Applied

- **2D Interactive SVG/Canvas (Default for Maths, Physics Graphs, Hormones, Reproduction Diagrams, History/Civics/Econ, Language):**
  - Electric Potential (`4.3.1`): 2D movable test charge, reference $\infty$, selectable $A/B$, live $V = W/Q$ & $V_{AB} = V_A - V_B$.
  - Joule's Law (`4.8.1`): 2D Nichrome resistor heating lab + live parabolic $H = I^2 R t$ graph + $2I \to 4H$ lock-and-compare mission.
  - Ethylene (`16.1.5`): 2D controlled Tomato vs Tomato + Ripe Banana paper-bag comparison + conceptual day slider + cause→response hormone roles.
  - Pituitary Gland (`16.2.1`): 2D clickable Human Endocrine Body Map + Hypothalamus → Anterior/Posterior Pituitary → Target Organ pathway explorer.
  - Mathematics Chapter 4 (`4.2`, `4.3`, `4.4`, `4.5`, `4.6`): Five distinct, cleanly labelled 2D SVG geometric constructions (`A/B/C/D/E` permanent non-overlapping labels, parallel constraints, angle-bisector arcs, Pythagorean square-area proof, $OP \perp$ tangent proof, Ceva's concurrency verification).
  - Science Unit 17 Gametes (`17.8.1 Sperm`, `17.8.2 Ovum`): Calm, neutral-palette, textbook-labelled 2D medical SVG illustrations (with optional calm 3D view explicitly separated from unrelated plant/menstrual topics).
- **3D WebGL Preserved Where Spatial Depth Truly Helps:**
  - Human Heart 3D/2D cutaway (`14.15`), Chemical Reaction 3D Beakers (`10.1`), 3D Molecules & Hydrocarbons (`Unit 7`, `Unit 11`), Mensuration 3D Solids (`Maths Ch. 7`), NASA/SRTM Terrain (`Geography 1`), and fixed `SolubilityMixerLab` (`Unit 9`).

---

## 4. Phased Implementation Roadmap

1. **Phase 1 (Complete):** Global 694-route audit + 5-PDF verification + all CSV/MD audit deliverables.
2. **Phase 2 (Immediate — This Execution):**
   - Fix `progressStore.ts` / `ProgressContext.tsx` / `EngineShell.tsx` mastery state machine (`explored` vs `practised` vs `understood_checkpoint`).
   - Build `src/types/lessonExperience.ts` + `src/data/exactSectionManifest.ts` + reusable `ConceptFirstLessonPlayer.tsx`.
   - Fix `SolubilityMixerLab` (`TopicInteractiveLabs.tsx`) scientific misconception (Unsaturated vs Saturated + Undissolved Excess vs True Supersaturated).
   - Fix `MathsChapter3DCanvas.tsx` missing `A/B/C/D/E` vertex labels.
   - Calm `BiologyCell3DCanvas.tsx` gamete styling & decouple broad prefix fallthrough for Science 4, Science 16, Science 17, and Maths 4.
   - Audit & clean off-topic `related_section_ids` aliasing in `src/data/lesson_content/index.ts`.
3. **Phase 3 (Immediate — Vertical Slice Pilot):** Ship complete, textbook-verified 10-stage lessons + bespoke interactive engines for:
   - Science `4.3.1 Electric Potential`
   - Science `4.8.1 Joule's Law of Heating`
   - Science `16.1.5 Ethylene`
   - Science `16.2.1 Pituitary Gland`
   - Maths `4.2 Similarity`, `4.3 Thales + Angle Bisector`, `4.4 Pythagoras`, `4.5 Circles & Tangents`, `4.6 Concurrency`
   - Science `17.8.1 Structure of Human Sperm` & `17.8.2 Structure of Human Ovum` (plus clean Unit 17 topic separation)
4. **Phase 4 (Immediate Verification):** Deterministic unit tests for all formulas/ratios/labels/mastery states + live browser screenshots at desktop & 360px mobile + before-and-after global audit rerun.
5. **Phase 5 (Systematic Expansion — Next Batches after Educator Review):** Expand exact-section 2D/3D experiences across Science Units 1–3, 5–6, 8, 13, 18–23; Maths Ch. 1–3, 5, 8; Social Science Geography 4 / Civics 4 / Economics 4; and English & Tamil remaining units.
