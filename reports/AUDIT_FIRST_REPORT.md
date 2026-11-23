# Katrio — Audit-First Baseline Report (Gate 0 & Gate 1)

**Audit Date:** 2026-11-22  
**Repository Root:** `c:\Users\hp\Desktop\katrio-—-class-10-interactive-visual-learning`  
**Local Textbook Folder Verified:** `10th-Books/` (accessible; all 5 official TNSCERT PDFs read directly, unmodified)

---

## 1. Textbook Editions & Version Alignment (Cross-Checked from PDF Front Matter)

| Subject | Local PDF Filename | PDF Pages | Dominant Page Offset (`PDF − Printed`) | Verified Edition & Reprint Line (PDF p. 2) |
| :--- | :--- | :---: | :---: | :--- |
| **Science** | `Class_10_Science_English_2024_Edition-www.tntextbooks.in.pdf` | 360 | `+8` | First Edition 2019; Revised 2020, 2022, 2023; **Reprint 2021, 2024** |
| **Mathematics** | `Class_10_Mathematics_English_2025_Edition-www.tntextbooks.in.pdf` | 352 | `+6` | First Edition 2019; Revised 2020, 2021, 2022, 2023, **2025**; Reprint 2024 |
| **English** | `Class_10_English_2024_Edition-www.tntextbooks.in.pdf` | 224 | `+4` | First Edition 2019; Revised 2020, 2022, 2023; **Reprint 2021, 2024** |
| **Tamil** | `Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf` | 184 | `+10` | First Edition 2019; Revised 2020–2024, **2025** (`© SCERT 2019`) |
| **Social Science** | `Class_10_Social_Science_English_2025_Edition-www.tntextbooks.in.pdf` | 344 | `+6` | First Edition 2019; Revised 2020, 2022, 2023, **2025** |

> **Edition Alignment Caveat (Rule A1 / A7):** All five PDFs belong to the **2019 Tamil Nadu Samacheer Kalvi New Syllabus**, but **Science** and **English** in `10th-Books/` are **2024 Reprint** copies while **Mathematics, Tamil, and Social Science** are **2025 Revised** copies. Every lesson records its exact source PDF filename, edition string, printed page, and 1-based PDF page so syllabus versions are never silently conflated.

---

## 2. What Exists in Katrio Today vs. Desired 360° Learning Behavior

### Baseline Technical & Content Inventory
- **Architecture:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Three.js + KaTeX; 100% static Cloudflare Pages deployment (`dist/` + pre-rendered SSG HTML routes + `_redirects` + `sitemap.xml`); zero login, zero tracking, zero runtime paid AI API keys; local-only progress (`src/features/local-progress/progressStore.ts` + `ProgressContext.tsx`).
- **Curriculum Baseline (`src/data/curriculum_registry_class10.json`):** 5 subjects, 72 units, **691** originally registered section routes (**113** TOC-verified + **578** auto-extracted review candidates), 1,387 source-page anchors, 25 JSON pilot lesson packages (`src/data/lesson_content/*.json`).
- **Critical Curriculum Gaps Found by Full 1,464-Page PDF Audit:**
  1. **History Unit 4 (*The World After World War II*, pp. 40–52)** had only 7 of 10 sections registered — **`4.1 Chinese Revolution`**, **`4.3 Formation of Military Alliances`**, and **`4.10 Fall of Berlin Wall and End of Cold War Era`** were missing!
  2. **Geography Unit 4 (*India — Resources and Industries*, pp. 170–185)** had only 1 section (`4.1 Minerals`), missing `4.2 Energy Resources` and `4.3 Industries`.
  3. **Civics Unit 4 (*India's Foreign Policy*, pp. 269–277)** was missing `4.1 Main Objectives of Our Foreign Policy` and `4.6 SAARC (1985)`.
  4. **Economics Unit 4 (*Government and Taxes*, pp. 321–327)** was missing `4.2 Tax` and `4.4 How Are Taxes Levied?`.
- **Critical UX & Pedagogical Gaps Identified Before Gate 3:**
  1. **Jargon in Student UI (Rule A3):** `SectionPlayerPage.tsx` displayed `"Title awaiting editorial verification"` badges and technical labels in the main student header instead of keeping editorial provenance in a collapsible details drawer.
  2. **Order of Learning (Section D):** Students landed directly on an interactive canvas before encountering an **ELI5 ("Explain it simply")** overview, **Simple → Detailed → Exam-ready** layers, a structured **Cause→Event→Effect Concept Map**, **Why did that happen?** causal stepper, or **Read the book, chunk by chunk** lower section.
  3. **Overuse of Decorative 3D vs. Purpose-Built 2D (Rule C):** Civics, Economics, and English/History concepts previously leaned on 3D spinning scenes where purpose-built 2D timelines, geopolitical maps, flowcharts, and institutional cards teach faster, use far less mobile battery, and deliver stronger accessibility parity.
  4. **3D Heart Cutaway Overlap Bug (Verified via User Screenshot):** In `ModelExplorer3DCanvas.tsx`, the sculpted outer myocardial shell (`backShell`) behind the internal chambers created visual overlap with the chambers in `Internal Cutaway` mode and lacked a clear `"Schematic cutaway"` label.

---

## 3. Component Preserve / Fix / Replace Decision Table

| Component / Area | Decision | Rationale |
| :--- | :---: | :--- |
| `src/features/local-progress/*` | **PRESERVE** | Clean zero-login, schema-validated localStorage + JSON export/import. Extend gently with `reviewLaterSections` local flag. |
| `src/components/engines/ChemistryMixingLab3DCanvas.tsx` & `ReactionLabEngine.tsx` | **PRESERVE & RETAIN** | Working chemistry beakers, strict flask containment, activity-series checks, and atom-balancing equation verifier. |
| `src/components/engines/MoleculeBuilder3DCanvas.tsx` & `Mensuration3DCanvas.tsx` | **PRESERVE & RETAIN** | Genuine 3D spatial value for carbon molecules and combined 3D solids/nets. |
| `src/components/engines/ModelExplorer3DCanvas.tsx` & `HeartCirculationEngine.tsx` | **PRESERVE & FIX** | Keep real MIT `heart.glb` + 2D SVG cutaway parity; fix cutaway shell overlap, refine default view, add clear schematic label. |
| `src/components/engines/TrigonometryClinometerEngine.tsx` & `TrigIdentitiesEngine.tsx` | **PRESERVE & RETAIN** | Accurate surd ratios, boundary guards (0°/90°), KaTeX derivations. |
| `src/components/engines/PhysicsLab3DCanvas.tsx` & `ChemistryNuclear3DCanvas.tsx` | **PRESERVE** | Working physics sliders (optics, circuits, resistivity, acoustics, nuclear, periodic orbitals, solubility). |
| `src/components/engines/HistoryTheatre3DCanvas.tsx` & `IndiaRelief3DCanvas.tsx` | **PRESERVE (OPTIONAL)** | Upgraded with real 4K NASA Blue Marble & SRTM heightmaps; keep available as optional visual exploration while prioritizing crisp 2D timelines & geopolitical maps for History Unit 4! |
| `src/routes/SectionPlayerPage.tsx` | **UPGRADE (NON-DESTRUCTIVE)** | Remove student-facing editorial jargon into details drawer; integrate the **Unified 9-Stage Understanding-First Lesson Player** for History Unit 4 (`4.1–4.10`) while preserving all existing 25 pilots and 691 routes. |
| `src/components/engines/HistoryUnit4Interactive2D.tsx` (New) | **ADD (GATE 3 PILOT)** | Purpose-built 2D timeline, historically accurate 2D geopolitical SVG maps, bloc comparison cards, and cause-effect explorer for History `4.1–4.10`. |

---

## 4. Research on Real TN SSLC (Class 10) Student Stumbling Blocks (Section I)

Web verification conducted **2026-11-22** against public 2025–2026 TN SSLC examination analyses and accessibility/learning standards:
1. **TN SSLC Social Science (History & Maps):** Exam analyses (e.g., Shiksha 2025–2026 TN SSLC reviews) consistently highlight three core pain points: (a) **memorizing dates & chronology** for the mandatory 5-mark Timeline Chart, (b) **confusing cause-and-effect chains** in 5-mark analytical questions rather than reciting guide-book paragraphs, and (c) **imprecise historical/geographical map plotting** and missing map keys.
2. **TN SSLC Mathematics:** Students lose marks on 8-mark practical geometry/graph plotting precision, combined Mensuration surface-area/volume conversions, and multi-step HOTS problems when formulas are memorized without visual derivation.
3. **Pedagogical & Accessibility Standards Grounding:**
   - **CAST UDL Guidelines 3.0** (`https://udlguidelines.cast.org/`): Multiple means of representation (ELI5 + Tamil toggle + SVG mind map + 2D interactive + chunked reading) and action/expression without requiring disability disclosure.
   - **W3C WCAG 2.2 AA** (`https://www.w3.org/TR/WCAG22/`): ≥44×44 CSS px targets, keyboard parity for every interactive, no drag-only actions, reduced-motion compliance, high contrast, and semantic structure.
   - *Transferability note:* Commercial guide sites and social forums are treated strictly as design hypotheses — never as syllabus authority or copyable content.
