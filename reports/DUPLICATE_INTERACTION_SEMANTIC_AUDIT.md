# Katrio — Duplicate Interaction Semantic Audit

**Date:** 2026-11-23  
**Purpose:** Distinguish legitimate **shared frameworks** (same reusable React component parameterized with genuinely distinct equations, variables, diagrams, and transfer tasks) from **semantic duplication defects** (sibling subsections presenting an identical `(engineId, variantId, controls, learningObjective)` experience under different page titles).

---

## 1. Semantic Fingerprinting Methodology

Each of the **694** registered routes was fingerprinted by the 5-tuple:
`(renderedComponent, variantId, interactiveControls, conceptualModel, assessmentSource)`.

When two sibling routes share the exact same 5-tuple while their official TNSCERT textbook subsections teach **different concepts**, the pair is flagged as a **Semantic Duplication Defect**.

---

## 2. High-Impact Semantic Duplication Defects Identified

1. **Science Unit 16 (`Plant and Animal Hormones`, 7 routes → 1 identical 3D Human Neuron scene):**
   - `16.1.1 Auxins`, `16.1.2 Cytokinins`, `16.1.3 Gibberellins`, `16.1.4 Abscisic Acid`, `16.1.5 Ethylene`, `16.2.1 Pituitary Gland`, `16.2.4 Pancreas` all share fingerprint `(NeuronHormone3DLab, neuron_or_brain_3d, Neuron/Brain toggle)`.
   - **Verdict:** **100% conceptually irrelevant duplication (7/7).** Plant hormones have zero nervous system; endocrine glands communicate chemically via blood, not axons.
2. **Mathematics Chapter 4 (`Geometry`, 12 routes → 1 identical Thales BPT slider):**
   - `4.1`–`4.6` (Similarity, Thales, Angle Bisector, Constructions, Pythagoras, Circles & Tangents, Concurrency) all share `(MathsGeometry3DLab, maths_thales_3d, 1 ratio slider)`.
   - **Verdict:** **10/12 conceptually irrelevant + 2/12 diagram-defective.**
3. **Science Unit 4 (`Electricity`, 20 of 27 routes → 1 identical Series/Parallel Bulb scene):**
   - `4.3.1 Electric Potential`, `4.8.1 Joule's Law of Heating`, `4.10.2 Earthing`, `4.11 LED Bulb`, `4.12 LED Television` all receive `(ElectricityCircuitLab, electricity_circuit_3d, Series/Parallel V/R1/R2)`.
   - **Verdict:** **Irrelevant for Electric Potential, Joule's Law, Domestic Safety, and LEDs.** Appropriate only when parameterized specifically for Ohm's Law / Series / Parallel resistors.
4. **Science Unit 17 (`Reproduction in Plants and Animals`, 17 routes → 1 Sperm/Ovum/Flower toggle):**
   - Plant vegetative/asexual reproduction (`17.2`), ovule embryo sac (`17.3.2`), cross-pollination agents (`17.5`), plant double fertilization (`17.6`), human testes (`17.7.1`), menstrual cycle (`17.9`), foetal development (`17.10`), family planning (`17.12`), UTI (`17.13`), and personal hygiene (`17.14`) all share `(Gametogenesis3DLab, gametogenesis_flower_3d)`.
   - **Verdict:** **14/17 conceptually irrelevant; 3/17 (`17.8`, `17.8.1`, `17.8.2`) need calm textbook 2D redesign.**
5. **Science Units 18–20 (`Genetics`, `Evolution`, `Biotechnology`, 36 routes → 1 DNA + `Tt` Punnett Square):**
   - Evolution (`19.*`) and Breeding/Biotechnology (`20.*`) inherit Mendel's `Tt` Pea Plant cross (`24` irrelevant routes).
6. **Science Units 21–22 (`Health & Diseases`, `Environmental Management`, 50 routes → 1 Bacteria Cell Wall):**
   - All `21` Environmental Management routes (rainwater harvesting, solar energy, wildlife conservation, e-waste) display a rotating 3D Bacterial Cell Wall!
7. **`lesson_content/index.ts` `related_section_ids` Content Aliasing (60 distinct sibling routes):**
   - Example: `maths-07-03` (*Volume*), `maths-07-04` (*Volume and Surface Area of Combined Solids*), and `maths-07-05` (*Conversion of Solids*) all silently inherit `maths-07-02.json` (*Surface Area* objectives, worked examples, and quizzes).
   - Example: `english-01-supplementary` (*The Tempest*) was listed inside `english-01-prose.json`'s `related_section_ids` (overridden only because `english-01-supplementary.json` loaded earlier).
   - **Action:** Enforce explicit strict matching in `lesson_content/index.ts` so sibling routes with distinct objectives do not silently present another subsection's quiz as their own!

---

## 3. Legitimate Reusable Frameworks (Not Flagged as Defects)
- `UnifiedSubsectionPlayer` across History Unit 4 (`4.1`–`4.10`): **Reusable shell**, but every single one of the 10 routes supplies unique historical dates, unique SVG concept maps, unique 2D maps/timelines, unique challenges, and unique textbook reading chunks.
- `ConceptFirstLessonPlayer` (introduced in Phase 2): **Reusable 10-stage framework** hosting completely distinct interactive labs (`ElectricPotentialLab2D`, `JoulesLawLab2D`, `EthyleneRipeningLab2D`, `PituitaryEndocrineLab2D`, `MathsChapter4GeometryLabs2D`, `ReproductionDiagrams2D`).
