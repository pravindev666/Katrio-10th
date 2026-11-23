# KATRIO — INTERACTIVE COMPONENT ARCHITECTURE & CONTENT CONTRACT (PHASE 7 & PHASE 8 DELIVERABLE 6)

**Architectural Rule:** Educational content lives strictly in typed JSON/TS data packages separated from React UI components. Every route resolves via an **exact `sectionId` manifest** — NEVER broad chapter-prefix guesswork!

---

## 1. Unified 20-Field Subsection Content Contract (`SubsectionExperienceContract`)

```ts
export type RepresentationType =
  | 'TypeA_Interactive2D'
  | 'TypeB_Interactive3D'
  | 'TypeC_Combined2D3D'
  | 'TypeD_InteractiveTextStory';

export interface SubsectionExperienceContract {
  // 1–3. Identity & Verified Textbook Anchor
  sectionId: string;                    // Stable canonical route ID (694 routes preserved)
  subject: 'science' | 'mathematics' | 'english' | 'tamil' | 'social_science';
  unitId: string;
  sectionNumber: string;
  exactTitle: string;
  textbookRef: { book: string; edition: string; printedPages: number[]; pdfPages: number[]; officialUrl: string };

  // 4–8. Pedagogical Core
  learningObjectives: string[];
  prerequisites: string[];
  plainExplanation: { simple: string; detailed: string; examBullets: string[]; tamilSupport?: string };
  misconceptions: { myth: string; reality: string }[];
  mindMap: { title: string; centralNode: string; mnemonic: string; nodes: { id: string; label: string; summary: string; detail: string; relation: string }[] };

  // 9–12. Representation Decision & Scientific Controls
  representationType: RepresentationType;
  representationJustification: string;
  engineFamily:
    | 'ChemicalProcessFlowchart2D'
    | 'PhysicsExperiment2D'
    | 'DynamicGeometryMath2D'
    | 'BiologyPathway2D'
    | 'AccurateSatelliteMap2D'
    | 'LanguageCraftStudio2D'
    | 'CombinedAnatomyOrSolid3D';
  engineConfig: Record<string, unknown>; // Exact variables, units, ranges, formulas, pins, or stanza data

  // 13–17. Mastery, Recall & Accessibility
  workedExamples: { sourceRef: string; problem: string; given: string[]; steps: string[]; answer: string }[];
  practiceChecks: { id: string; level: 'guided' | 'conceptual' | 'transfer'; prompt: string; hint: string; options: { id: string; label: string; isCorrect: boolean; why: string }[] }[];
  funFact: { fact: string; source: string };
  accessibilityAlternative: string;      // Topic-specific — ZERO stale chemistry templates!
  readingChunks: { heading: string; printedPage: number; summary: string; glossary: { term: string; tamil?: string; meaning: string }[] }[];

  // 18–20. Governance & Honest QA
  editorialStatus: 'provisional' | 'educator_reviewed' | 'published';
  completionCriteria: 'pass_conceptual_and_transfer_checks';
  implementationStatus: 'pilot_verified' | 'data_authored' | 'planned';
}
```

---

## 2. Seven Clean Reusable Engine Families (Zero Cross-Topic Leakage)

1. **`ChemicalProcessFlowchart2D` (NEW — Chemistry Units 8, 9, 10, 11):** Renders bright 6-stage interactive SVG process flowcharts (`Reactants → Conditions → Tank/Molecular Change → Products → Observations → Balanced Equation`) driven purely by `engineConfig` (sliders for `°C`, `V`, `pH`, coefficients, coatings, catalyst).
2. **`DynamicGeometryMath2D` (Retained & Expanded — Maths Ch. 1–6 & 8):** Crisp 2D SVG dynamic geometry, matrix steppers, coordinate grids, and live statistics dot-plots with unit-tested invariants.
3. **`PhysicsExperiment2D` (Retained & Expanded — Science Units 1–6):** Live 2D Electric Potential, Joule's Law `H=I²Rt`, Principal-Ray Optics, Lever/Lift Mechanics, Waves/Echo, and Nuclear Shield/Decay labs.
4. **`BiologyPathway2D` (Retained & Expanded — Science Units 12–22):** Calm clinical 2D anatomy, hormone loops, menstrual cycle chart, Leech/Rabbit system-specific diagrams, Genetics `XX/XY` & DNA fork, rDNA cut-and-splice, and Ecology calculators.
5. **`AccurateSatelliteMap2D` (Retained — ALL History & Geography):** Real NASA Blue Marble India, Tamil Nadu, and World 2D projections with subsection-scoped GPS pins, rivers, monsoon arrows, and cause-effect timelines.
6. **`LanguageCraftStudio2D` (Upgraded — ALL English Units 1–7 & Tamil 7 இயல்கள் — ZERO 3D):** Storyboard beats, poetic-device highlighter, memoriter cloze trainer, Tamil பதம் பிரித்தல் + இலக்கண விதி flowcharts & அலகிடுதல் scanner.
7. **`CombinedAnatomyOrSolid3D` (Retained ONLY for 40 Type B/C routes):** Heart Cutaway + 2D Circulation, Brain/Neuron + 2D Map, Plant Tissue Block + 2D Cross-Section, 3D Molecules (`7.2–7.3`, `11.2–11.4`), and Maths Ch. 7 Solids + 2D Nets — with an embedded `"2D / Text View"` switch ONLY here!

---

## 3. Static-First & Compatibility Guarantees
- Zero login, zero backend, zero runtime AI, 100% static Cloudflare Pages SSG (`785` routes preserved with exact canonical URLs).
- Local-only progress (`localStorage` JSON export/import) enforcing strict `not_started → started → explored → practised → completed` mastery transitions.
