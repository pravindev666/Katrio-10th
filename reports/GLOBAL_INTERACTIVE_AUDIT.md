# Katrio — Mandatory Global Interactive Duplication Audit (Baseline Snapshot)

**Audit Date:** 2026-11-23  
**Method:** Automated static AST/dispatch analysis of `SectionPlayerPage.tsx`, `EngineShell.tsx`, `TopicInteractiveLabs.tsx`, `MathsInteractiveLabs.tsx`, `SocialInteractiveLabs.tsx`, `src/data/lesson_content/*.json`, and `src/data/curriculum_registry_class10.json`, cross-referenced against all **5 local TNSCERT Class 10 PDFs** (`10th-Books/`, 1,464 pages total).

---

## 1. Executive Headline Metrics (Before Rebuild)

| Metric | Exact Audited Count | Notes & Evidence |
| --- | ---: | --- |
| **Total Headings Extracted Across All 5 Textbook PDFs** | **1,178** | Verified directly from `10th-Books/` (`reports/FULL_TEXTBOOK_COVERAGE.csv`) |
| **Registered Top-Level Units / Chapters** | **72** | Science 23 · Maths 8 · English 7 · Tamil 7 · Social Science 27 |
| **Registered Routable Subsections Inspected** | **694** | 100% of registered routes inspected (`reports/ALL_SUBSECTIONS_INTERACTION_MATRIX.csv`) |
| **PDF Headings Missing from Registry (Separate Gap List)** | **577** | Documented in `reports/MISSING_FROM_REGISTRY_GAPS.csv` (includes unnumbered sub-items, exercises, and unindexed subsections across units) |
| **Routes Could Not Be Tested Statically** | **0** | All 694 routes mapped deterministically; browser visual testing performed on target vertical-slice routes |
| **Duplicate Interactive Groups (>1 section sharing identical component+variant)** | **50** | Documented in `reports/DUPLICATE_INTERACTIVE_GROUPS.csv` |
| **Routes Participating in a Repeated Group** | **649 / 694** | 93.5% of routes share an engine+variant with at least one sibling |
| **Routes Using `startsWith(...)` Prefix Dispatch** | **501 / 694** | 443 chapter-prefix (`TopicInteractiveLabs.tsx`) + 58 strand-prefix (`SocialInteractiveLabs.tsx`) |
| **Routes Aliased via `related_section_ids` JSON Sharing** | **60 / 694** | 65 total alias entries across 25 pilot JSONs (5 overlap direct pilots) |
| **Routes With Premature Mastery Bug (`onComplete` → `markDemoCompleted` on slider/click)** | **684 / 694** | Only the 10 History Unit 4 unified lessons were immune |

---

## 2. Six-Category Pedagogical Classification (All 694 Registered Subsections)

| Classification Category | Count | % of 694 | Examples (Confirmed Defects vs. Appropriate Reuse) |
| --- | ---: | ---: | --- |
| **1. Correct and reusable** | **10** | 1.4% | Social Science History Unit 4 (`4.1`–`4.10`): bespoke 2D maps/timelines, exact-ID lookup, genuine active challenge completion. |
| **2. Correct but needs improvement** | **35** | 5.0% | 25 direct verified pilot lessons (Heart, Reactions, Clinometer, His First Flight, Tamil 4, WWI, etc.) + 7 Science 4 Resistivity routes + 3 Unit 17 Gamete routes needing calm 2D redesign & mastery fix. |
| **3. Repeated but educationally appropriate** | **231** | 33.3% | Neighboring subtopics sharing an appropriate subject framework (e.g., Maths Ch.1 Functions, Maths Ch.2 AP/GP, Maths Ch.5 Coordinate Grid, Science 4 Series/Parallel) that still need unique subsection challenges and mastery separation. |
| **4. Repeated and conceptually irrelevant** | **319** | 46.0% | **Confirmed conceptual mismatches:** Science `4.3.1 Electric Potential` & `4.8.1 Joule's Law` showing Series/Parallel bulb; ALL 7 Science Unit 16 Hormones (`16.1.5 Ethylene`, `16.2.1 Pituitary`) showing a 3D Human Neuron; 14/17 Science Unit 17 Reproduction topics showing Sperm/Ovum; 10/12 Maths Ch.4 topics showing Thales triangle; Science 19–20 Evolution/Biotech showing `Tt` Punnett square; Science 22 Ecology showing Bacterial Cell Wall; Science 8 Metallurgy showing Na→Ar Bohr shells; Maths 3 Matrices/GCD showing Quadratic Parabola; Maths 8 Standard Deviation showing Rolling Die; 60 aliased `related_section_ids` routes; Social 3D dioramas. |
| **5. Scientifically / mathematically incorrect** | **16** | 2.3% | **Confirmed factual/diagram defects:** 13 Science Unit 9 `SolubilityMixerLab` routes labelling excess undissolved solute as *"Supersaturated"* (contradicting TN Science p. 126–127) + 2 Maths `4.3` Thales routes with unlabelled `A/B/C/D/E` dots and misplaced Tangent–Radius notes + 1 misrouted Unit 9 sub-case. |
| **6. Missing or unfinished** | **83** | 12.0% | Routes falling through to generic `EngineShell` defaults without subsection-specific content packages. |

---

## 3. Top 12 Most Severe Duplicate Interactive Groups

| Sections Sharing | Component & Variant | Irrelevant / Incorrect Count | Severity |
| ---: | --- | ---: | --- |
| **50** | `HealthImmuneEco3DLab` (`bacteria_wall_3d`) | 21 irrelevant (all of Science Unit 22 Environmental Management shows bacteria!) | High |
| **36** | `GeneticsPunnettLab` (`dna_punnett_3d`) | 24 irrelevant (Units 19 Evolution & 20 Biotechnology show `Tt` Punnett square!) | High |
| **31** | `GeographyChapters3DStudio` (`geography_3d_studio`) | 31 irrelevant (generic relief diorama reused across climate/soils/resources/transport) | Medium |
| **30** | `MathsAlgebra3DLab` (`maths_parabola_3d`) | 16 irrelevant (Matrices, GCD/LCM, Rational Expressions show a 3D parabola!) | High |
| **27** | `HistoryChapters3DStudio` (`history_3d_studio`) | 27 irrelevant (decorative globe diorama reused across Units 2–3, 5–10) | Medium |
| **26** | `NuclearChainReactionLab` (`nuclear_reactor_3d`) | 12 irrelevant (alpha/beta/gamma decay & fusion show Boron control rods!) | Medium |
| **23** | `PeriodicTrendsLab` (`periodic_bohr_3d`) | 9 irrelevant (Metallurgy of Al/Cu/Fe & Corrosion show Period 3 Bohr radii!) | High |
| **20** | `ElectricityCircuitLab` (`electricity_circuit_3d`) | **12 irrelevant** (Electric Potential `4.3.1`, Joule's Law `4.8.1`, Earthing, LED TV!) | **P0 Critical** |
| **17** | `Gametogenesis3DLab` (`gametogenesis_flower_3d`) | **14 irrelevant + 3 redesign needed** (Plant/Menstrual/Fetal/Hygiene routed to gametes!) | **P0 Critical** |
| **13** | `SolubilityMixerLab` (`solubility_beaker_3d`) | **13 scientifically incorrect** (excess solute mislabelled Supersaturated!) | **P0 Critical** |
| **12** | `MathsGeometry3DLab` (`maths_thales_3d`) | **10 irrelevant + 2 incorrect** (unlabelled A/B/C/D/E + Tangent–Radius filler!) | **P0 Critical** |
| **7 (Unit 16)** | `NeuronHormone3DLab` (`neuron_or_brain_3d`) | **7/7 irrelevant** (Ethylene, Auxins, Pituitary, Pancreas show Human Neuron!) | **P0 Critical** |

---

## 4. Confirmed Defects vs. Suspected Issues vs. Unverified Content
- **Confirmed Code & Factual Defects:** Every item listed in Sections 2–3 above was verified by directly reading both the live TypeScript components and the official local PDFs in `10th-Books/`.
- **Unverified Auto-Extracted Titles:** `578 / 694` registry entries retain `source_status: "auto_extracted_review_required"` pending human educator editorial sign-off (e.g., `science-04-auto-4-2-consists-of-different-components-such` is a known Pass 0 sentence-fragment extraction candidate flagged in `reports/UNCERTAIN_HEADINGS_AND_MANUAL_REVIEW.csv`).
- **Supporting Machine-Readable CSVs:**
  - `reports/ALL_SUBSECTIONS_INTERACTION_MATRIX.csv` (all 694 rows)
  - `reports/SUBSECTION_INTERACTION_MATRIX.csv` (all 694 rows)
  - `reports/DUPLICATE_INTERACTIVE_GROUPS.csv` (all 50 groups)
  - `reports/MISSING_OR_INCORRECT_ACTIVITIES.csv` (all 418 flagged rows)
  - `reports/MISSING_FROM_REGISTRY_GAPS.csv` (all 577 unindexed PDF headings)
