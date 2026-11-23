# Katrio Learning Universe — Gate 0: Code Reality vs. Reports Audit

**Document ID:** `UNIVERSE_00_CODE_REALITY_VS_REPORTS`  
**Audit Date:** 2026-11-23  
**Workspace Audited:** `c:\Users\hp\Desktop\katrio-—-class-10-interactive-visual-learning`  
**Audit Method:** Direct inspection of live TypeScript/React source files, `package.json`, `public/models/`, `public/textures/`, `src/data/`, all five local TN Class 10 textbook PDFs in `10th-Books/`, and reproducible execution of `npm run audit:curriculum`, `npm run validate:lessons`, `npm run audit:links`, `npm test`, and `scratch/generate_universe_csvs.py`.

---

## 1. Executive Reality Check: What Is Actually True Today

Katrio has a **solid, working static-first React/TypeScript foundation** (`785` canonical prerendered routes, `27/27` passing automated unit tests, `25/25` passing JSON lesson checks, zero login, local-only progress export/import/reset, and strong early 2D/3D pilots). However, **several claims in previous planning documents do not match the running application yet**, and large portions of the `694` subsection routes still rely on shared templates or stale seed text.

| Status Category | Exact Verified Scope Today | Evidence / Exact File Paths |
| :--- | :--- | :--- |
| **Implemented & Verified (Passing Tests)** | Static React 19 + TS + Vite 8 + Tailwind 4 + KaTeX + Three.js app; `72` units & `694` canonical section routes (`691` handover + `3` History 4 body extensions); local-only progress (`katrio-device-v1`) with strict separation of `visited`, `explored`, `practised`, `completed`; `27/27` unit tests passing; `25/25` JSON pilot packages validated; 6 Concept-First 2D pilot engines (`ElectricPotentialLab2D`, `JoulesLawLab2D`, `EthyleneRipeningLab2D`, `PituitaryEndocrineLab2D`, `MathsChapter4GeometryLabs2D`, `ReproductionDiagrams2D`); 10 History Unit 4 subsection lessons (`4.1–4.10`); accurate 2D NASA satellite basemaps (`AccurateGeoMaps2D`). | `package.json`, `src/App.tsx`, `src/features/local-progress/progressStore.ts`, `src/utils/*.test.ts`, `src/data/exactSectionManifest*.ts`, `src/data/history_unit4_*.ts`, `src/components/engines/AccurateGeoMaps2D.tsx` |
| **Implemented but Partial / Shared / Placeholder** | Only **`53 / 694` (7.6%)** routes have directly authored bespoke lesson packages (`25` JSON in `src/data/lesson_content/index.ts` + `18` Concept-First TS specs + `10` History Unit 4 TS specs). Another **`60` routes** inherit an aliased sibling JSON package via `related_section_ids` (giving `85` `lesson_content_id` links). The remaining **`581` routes** render `SectionPlayerPage` with synthesized chapter-level mind maps (`chapterMindMaps.ts`), generic quizzes (`chapterQuizzes.ts`), and multi-route shared engines. `/arcade` (`PlatformPages.tsx`) renders 13 raw `EngineType` developer previews rather than cross-subject Learning Quests. | `src/routes/SectionPlayerPage.tsx`, `src/routes/PlatformPages.tsx`, `src/data/lesson_content/index.ts`, `src/data/chapterMindMaps.ts`, `src/data/chapterQuizzes.ts`, `src/components/engines/TopicInteractiveLabs.tsx` |
| **Planned Only (In Reports, NOT in Live Code)** | **Calm 4-Tab Lesson Workspace** (`PREMIUM_STUDENT_LESSON_UX.md`) is **NOT implemented**: live `SectionPlayerPage.tsx` still renders a **7-stage vertical jump layout** (`1. Explain` → `7. Textbook`); `ConceptFirstLessonPlayer.tsx` renders 7 vertical sections; `UnifiedSubsectionPlayer.tsx` renders 9 vertical sections. The **Interactive Learning Universe World Map**, **Concept Graph**, **Cross-Subject Capstone Missions**, and **20-field Exact-Section Experience Manifest** do not exist in code yet. | `src/routes/SectionPlayerPage.tsx` (lines 122–150, 570–800), `src/components/curriculum/ConceptFirstLessonPlayer.tsx` (lines 42–50), `src/components/curriculum/UnifiedSubsectionPlayer.tsx` (lines 33–46) |
| **Broken / Mismatched in Live App** | **1.** **`366` strictly cross-domain stale `accessibility_fallback` strings** (+ `36` intra-chemistry generic strings = **`402` total**): e.g., `13.1.4 Body wall` displays *"Balanced chemical equation table, atom-count conservation breakdown, and text observation log for Body wall."*<br>**2.** **`431 / 694` routes** show a redundant `[Interactive Lab \| 2D & Text]` toolbar AND top-right `[2D view]` button even when the view is already 2D; clicking `2D & Text` hides the real 2D SVG lab and exposes the broken fallback string.<br>**3.** **Unhelpful / visually weak 3D still live:** `Tamil3DStageCanvas.tsx` (3D pillars in Tamil இயல் 4 + advertised on `LandingPage.tsx`), `EnglishStory3DCanvas.tsx` (Three.js `Stork.glb` renamed `seabird-animated.glb` in English Unit 1), `ChemicalProcess3DCanvas.tsx` (dark opaque floating dome in Science `8.4–8.11` & `11.6–11.7`), `camera-optics.glb` (steampunk camera on Unit 23 Scratch), `MathsChapter3DCanvas.tsx` on 2D algebra/relations/coordinate/probability.<br>**4.** **Bundled intra-chapter views:** `Science 8.4` opens tabs for `8.7/8.8/8.11`; all `19` Science Unit 13 Leech/Rabbit subsections share one bundled panel; `55+` Social Science routes share one `social_chapter_2d` template.<br>**5.** **Orphaned / dead code & binary bloat:** `SocialInteractiveLabs.tsx` (41.7 KB) has zero importers; `CivicsEconomics3DCanvas.tsx` (11.8 KB) is transitively dead; `public/models/boombox.glb` (2.16 MB) has zero references anywhere in `src/`. | `src/data/curriculum_registry_class10.json`, `src/components/engines/EngineShell.tsx` (lines 280–324, 884–953), `src/routes/SectionPlayerPage.tsx` (lines 408–422), `src/routes/LandingPage.tsx` (lines 680–771), `reports/UNIVERSE_02_DUPLICATES_AND_WRONG_VISUALS.csv` |
| **Scientifically / Editorially Unverified** | **`0 / 694` routes** have external TN subject-educator or Tamil-teacher sign-off (`educator_approved = 0`). **`578 / 694` (83.3%)** remain `auto_extracted_review_required`. Body text extraction of `Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf` exhibits legacy Tamil glyph encoding (`மொIொழிபெயர்ப்பு`, `வேPற்றுமொIொழி`), proving automated PDF text dumps are unreliable for Tamil and mandating human Tamil proofreading. | `src/data/curriculum_registry_class10.json`, `10th-Books/Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf` (PDF pp. 84–101), `reports/UNIVERSE_01_SOURCE_GAPS.csv` |

---

## 2. Independent Verification of the Reported `366` Stale Fallback Defect

Re-running an exact audit directly against live `src/data/curriculum_registry_class10.json` **confirms all `366` cross-domain defects** and surfaces **`36` additional intra-chemistry generic strings (`402` total)**:

| Pattern in `accessibility_fallback` | Total Occurrences | Strictly Cross-Domain Wrong | Intra-Domain Generic / Stale | Exact Affected Subjects / Units |
| :--- | :---: | :---: | :---: | :--- |
| `"Balanced chemical equation table, atom-count conservation breakdown, and text observation log for <TITLE>."` | `294` | **`235`** | **`36`** | `235` Physics & Biology routes (Science Units 1–6, 12–23, e.g., `13.1.4 Body wall`, `16.1.5 Ethylene`, `22.7 Rainwater Harvesting`) + `36` non-balancing Chemistry routes (Periodic Trends, Metallurgy/Corrosion, Solutions). |
| `"Coordinate value table, equation derivation, and key-feature summary for <TITLE>."` | `116` | **`98`** | `0` | Non-coordinate Maths chapters (`maths-01`, `02`, `03`, `04`, `08`). Only `18` sit in `maths-05` Coordinate Geometry. |
| `"Interactive 2D SVG cutaway diagram and ordered step-by-step text walkthrough for <TITLE>."` | `43` | **`33`** | `0` | `20` Mathematics routes (`maths-07` Mensuration) + `13` non-anatomy Science routes (`science-07`, `science-11`). |
| **Total Flagged** | — | **`366`** | **`36`** | **`366` strictly cross-domain (`402` including intra-chemistry stale text).** |

Full route-by-route defect mapping (including shared-component group sizes, player types, redundant `2D & Text` flags, and P0/P1/P2/LOW severities across all 694 routes) is stored in [`UNIVERSE_02_DUPLICATES_AND_WRONG_VISUALS.csv`](file:///c:/Users/hp/Desktop/katrio-—-class-10-interactive-visual-learning/reports/UNIVERSE_02_DUPLICATES_AND_WRONG_VISUALS.csv).

---

## 3. Original Textbook PDF Verification (`10th-Books/`)

All five official Tamil Nadu State Board Class 10 textbook PDFs **ARE present and directly readable** on this workspace at `c:\Users\hp\Desktop\katrio-—-class-10-interactive-visual-learning\10th-Books\`:

| # | Local File in `10th-Books/` | Size | PDF Pages | Verified Imprint / Edition | Units | Copyright / Rights Posture |
| :-: | :--- | :---: | :---: | :--- | :---: | :--- |
| 1 | `Class_10_Science_English_2024_Edition-www.tntextbooks.in.pdf` | 59.93 MB | 360 | 2024 Reprint (`© SCERT 2019`, Rev. 2020/2022/2023) | 23 | `© SCERT 2019 · NOT FOR SALE` — no verbatim prose/figure copying. |
| 2 | `Class_10_Mathematics_English_2025_Edition-www.tntextbooks.in.pdf` | 41.00 MB | 352 | 2025 Revised Edition (`© SCERT 2019`) | 8 | `© SCERT 2019 · NOT FOR SALE` — original SVG/KaTeX diagrams & worked steps only. |
| 3 | `Class_10_English_2024_Edition-www.tntextbooks.in.pdf` | 67.09 MB | 224 | 2024 Reprint (`© SCERT 2019` + 3rd-party authors) | 7 | Mixed copyright: modern prose/poems carry author/publisher copyrights; summarize & analyze via original writing + page citations. |
| 4 | `Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf` | 40.96 MB | 184 | 2025 Revised Edition (`© SCERT 2019` + modern Tamil authors) | 7 இயல்கள் | Mixed copyright: Sangam/classical texts public domain; modern Tamil selections copyrighted. **Legacy PDF glyph encoding detected in body text — requires human Tamil educator review.** |
| 5 | `Class_10_Social_Science_English_2025_Edition-www.tntextbooks.in.pdf` | 39.09 MB | 344 | 2025 Revised Edition (`© SCERT 2019`) | 27 | `© SCERT 2019 · NOT FOR SALE` — original NASA/SRTM maps + paraphrased dated analysis. |
| **Total** | **5 Verified Local Textbooks** | **248.07 MB** | **1,464** | **2024–2025 Editions** | **72** | **Page-anchored original explanations, original visuals, zero verbatim copying.** |

**Honesty Note on PDF Inspection:** Programmatic traversal covered all `1,464` pages across all 5 PDFs; direct page-text verification was performed for History Unit 4 (`4.1–4.10`), the 6 Concept-First pilot units, and the Gate 2 pilot target pages (Science pp. 50–52, 138–140, 318–322; Maths pp. 167–172, 272–283; English pp. 1–7; Tamil pp. 72–91; Social History pp. 43–48). The remaining ~578 auto-extracted headings have **not** yet undergone line-by-line human editorial verification.

---

## 4. Revised Count Reconciliation: `691` / `694` Routes vs. `1,178` Extracted Headings

Previous audits surfaced two seemingly conflicting totals (`691`/`694` routes vs. `1,178` extracted PDF rows). Direct reconciliation in [`UNIVERSE_01_SOURCE_GAPS.csv`](file:///c:/Users/hp/Desktop/katrio-—-class-10-interactive-visual-learning/reports/UNIVERSE_01_SOURCE_GAPS.csv) explains every single row:

| Metric | Exact Count | Explanation |
| :--- | :---: | :--- |
| Canonical Handover Section Routes (Baseline) | **691** | Original IDs from `Katrio_Complete_Google_AI_Studio_AGY_Handover/curriculum_registry_class10.json` (`113` TOC/visually-verified + `578` auto-extracted candidates). |
| Body-Verified PDF Extensions Added | **+3** | History Unit 4 sections missing from the 691 baseline (`4.1 Chinese Revolution`, `4.3 Formation of Military Alliances`, `4.10 Fall of Berlin Wall and End of Cold War Era`). |
| **Current Registered Canonical Routes** | **694** | **371** Science · **150** Maths · **21** English · **36** Tamil · **116** Social Science (`116` TOC/body-verified + `578` auto-extracted). |
| Total Extracted Structural Rows (`FULL_TEXTBOOK_COVERAGE.csv`) | **1,178** | **750** numbered headings + **428** lettered `(a)/(b)/(i)` subdivisions traversed across `1,464` PDF pages. |
| **Reconciled Delta (`MISSING_FROM_REGISTRY_GAPS.csv`: `577` rows)** | **577** | Decomposed cleanly in `UNIVERSE_01_SOURCE_GAPS.csv` into:<br>• **`148` candidate missing numbered subsections** (e.g., Science `1.2.1`, `1.4.1`, `1.7`, `1.8`, `1.12`, `2.1`, `2.12`, `2.15`; Geography `4.2–4.3`; Civics `4.1`, `4.6`; Economics `4.2`, `4.4`) — verify against printed pages and either add as `body_verified_extension` or fold cleanly into parent subsection manifests.<br>• **`419` lettered subdivisions `(a)/(b)/(i)`** — should live as structured concept chunks inside parent subsection manifests (do NOT bloat route count).<br>• **`10` extractor false-positive artifacts** (e.g., `"97.5 N"` numeric prose value and MCQ `(a)/(b)/(c)/(d)` assertion-reason options) — explicitly marked `IGNORE`. |
| Truncated / Incomplete Auto-Extracted Titles | **52** | Logged in `UNIVERSE_01_SOURCE_GAPS.csv` (from `UNCERTAIN_HEADINGS_AND_MANUAL_REVIEW.csv` where multi-line PDF headings truncated, e.g., `1.10.1 Newton's universal law of`). |
| Figures, Tables, Maps, Examples, Activities & Exercises | **1,372** | `669` figures/tables/maps + `703` examples/activities/exercises indexed in `FIGURE_AND_EXERCISE_INVENTORY.csv`; most remain unlinked to interactive tasks and must be mapped across Tabs 1–4 as original rights-safe visuals and practice items. |

---

## 5. Dependency, Asset & License Inventory

### 5.1 Runtime & Build Dependencies (`package.json`)
Zero backend services, zero analytics/telemetry SDKs, zero paid runtime AI APIs, and zero auth libraries.

| Package | Version | License | Role |
| :--- | :--- | :--- | :--- |
| `react` / `react-dom` | `^19.0.1` | MIT | Core UI runtime |
| `react-router-dom` | `^7.18.5` | MIT | Client routing + SSG prerendering (`785` routes) |
| `three` / `@types/three` | `^0.187.0` | MIT | Lazy-loaded 3D WebGL scenes + local Draco WASM (`public/draco/`) |
| `katex` | `^0.19.1` | MIT | Offline math/science equation typesetting |
| `lucide-react` | `^0.546.0` | ISC | Accessible vector UI icons |
| `motion` | `^12.23.24` | MIT | Motion transitions (respects `reducedMotion`) |
| `tailwindcss` / `@tailwindcss/vite` | `^4.3.3` | MIT | Design token styling (`src/styles/tokens.css`) |
| `vite` / `typescript` / `tsx` / `esbuild` | Vite `8.3.0`, TS `7.0.2` | MIT / Apache-2.0 | Build, typecheck, test, SSG prerender |

### 5.2 Bundled 3D Models (`public/models/` — 13 `.glb` files, `35.68 MB` total) & Textures (`public/textures/earth/` — 8 files, `3.16 MB` total)

| Asset File | Size | License (`PROVENANCE.md`) | Live Importers in `src/` | Gate 0 Accuracy / Performance Verdict |
| :--- | :---: | :--- | :--- | :--- |
| `heart.glb` | 7.21 MB | MIT (`yihalem123/Human-Organ3D`) | `ModelExplorer3DCanvas.tsx` | **KEEP & OPTIMIZE:** Strong anatomy; needs Draco/LOD compression (< 2 MB) for low-end Android. |
| `brain.glb` | 4.44 MB | Apache 2.0 (`itayinbarr/brainproject` / Z-Anatomy) | `BiologyCell3DCanvas.tsx` | **KEEP & OPTIMIZE:** Scientifically credible Z-Anatomy mesh; add anatomical lobe hit-targets + compress. |
| `neuron-nih.glb` | 2.75 MB | MIT / US NIH 3D Public Domain | `BiologyCell3DCanvas.tsx` | **KEEP & UPGRADE:** Authentic NIH neuron; add labelled dendrite/axon/myelin hit-targets. |
| `animal-cell-nih.glb` | 1.46 MB | MIT / US NIH 3D Public Domain | `BiologyCell3DCanvas.tsx` | **KEEP (SCOPED):** Authentic NIH cell; reuse only on cell/organelle contexts, not generic zoology. |
| `plant-foliage.glb` | 5.49 MB | CC0 1.0 (`KhronosGroup`) | `BiologyCell3DCanvas.tsx` | **KEEP (OPTIMIZE):** Heavy (`5.49 MB`); compress or scope strictly to Unit 12/14 plant canopy context. |
| `kidney.glb` | 7.70 MB | MIT (`yihalem123/Human-Organ3D`) | `BiologyCell3DCanvas.tsx` | **RETIRE FROM UNIT 13:** Largest file (`7.70 MB`), yet TN Class 10 Science Unit 13 teaches **Leech & Rabbit**, not human kidney! Remove from Class 10 bundle unless scoped to an explicit *Explore Further* comparative anatomy note. |
| `bacteria-wall-nih.glb` | 0.46 MB | MIT / US NIH 3D Public Domain | `BiologyCell3DCanvas.tsx` | **REVIEW / SCOPE:** Only valid for bacterial/microbe reference; verify zero leakage into Unit 22 environment or non-bacterial diseases. |
| `camera-optics.glb` | 3.76 MB | MIT (`mrdoob/three.js` steampunk camera) | `BiologyCell3DCanvas.tsx` | **RETIRE:** Decorative steampunk prop (`3.76 MB`) teaches neither Optics ray geometry nor Unit 23 Scratch. |
| `boombox.glb` | 2.16 MB | MIT / CC0 (`mrdoob/three.js`) | **NONE (`0` references!)** | **DELETE:** 100% orphaned `2.16 MB` file; retro boombox has zero pedagogical value. |
| `flower.glb` | 5 KB | MIT (`mrdoob/three.js`) | `BiologyCell3DCanvas.tsx` | **REPLACE WITH CLINICAL 2D:** Low-poly 5 KB decorative flower cannot show ovule/embryo sac/anther anatomy accurately. |
| `seabird-animated.glb` | 76 KB | MIT (`mrdoob/three.js` `Stork.glb`) | `EnglishStory3DCanvas.tsx` | **RETIRE FROM LESSONS:** Upstream asset is a **stork**, not a seagull, and does not teach reading comprehension. |
| `parrot-animated.glb` | 97 KB | MIT (`mrdoob/three.js` `Parrot.glb`) | `EnglishStory3DCanvas.tsx` | **RETIRE FROM LESSONS:** Decorative bird for English Unit 2 *Zigzag*; replace with illustrated 2D story mission. |
| `gears.glb` | 78 KB | MIT (`mrdoob/three.js`) | `BiologyCell3DCanvas.tsx`, `EnglishStory3DCanvas.tsx` | **RETIRE FROM ENGLISH:** Optional physics/mechanical motif only; remove from English Unit 5 poetry. |
| `public/textures/earth/*` (8 NASA Blue Marble + SRTM files) | 3.16 MB | Public Domain (NASA / SRTM) + MIT | `AccurateGeoMaps2D.tsx`, `IndiaRelief3DCanvas.tsx`, `HistoryTheatre3DCanvas.tsx` | **KEEP & EXPAND:** High-value verified basemaps powering accurate 2D History/Geography maps + optional 3D India/TN SRTM elevation profiles! |

---

## 6. Reproducible Verification Log (Executed Read-Only on 2026-11-23)

| Command | Exit Code | Verified Output Summary |
| :--- | :---: | :--- |
| `npm run audit:curriculum` | `0` | `5` subjects · `72` units · `694` routes (`116` TOC/body-verified + `578` auto-extracted) · `1,387` source-page anchors · 100% canonical ID parity. |
| `npm run validate:lessons` | `0` | `25/25` JSON lesson packages conform to current schema contract. |
| `npm run audit:links` | `0` | `785` canonical routes verified (`19` hub + `72` unit + `694` section). |
| `npm test` | `0` | `27/27` tests passing (`curriculumStore.test.ts`, `pilots.test.ts`, `conceptFirstRebuild.test.ts`). |
| `python scratch/generate_universe_csvs.py` | `0` | Re-verified `366` cross-domain (`402` total) stale fallbacks, `431` redundant `2D & Text` routes, `0` `educator_approved` routes, and generated `UNIVERSE_01`, `UNIVERSE_02`, `UNIVERSE_06`. |

---

## 7. Unresolved Questions Requiring Owner Input Before Gate 2 Coding

1. **Science Gate 2 Pilot Preference:** Should Gate 2 implement **both** Science exemplars (`4.8.1 Joule's Law` 2D workbench + optional physical appliance context **AND** `10.1 Types of Chemical Reactions` polished 3D beaker/molecule theatre + synchronized 2D process flowchart) or start with one of the two?
2. **Candidate Missing Numbered Subsections (`148` rows in `UNIVERSE_01`):** Should we keep the `694` canonical route URLs frozen during Gates 2–3 and fold missing sub-headings (`Geo 4.2/4.3`, `Civics 4.1/4.6`, `Econ 4.2/4.4`, etc.) into Gate 4 as verified `body_verified_extension` additions one chapter at a time?
3. **Tamil Educator Sign-Off Workflow:** Who will review Tamil இயல் 4 (`மணற்கேணி`) and subsequent Tamil chapters before any route moves from `assessed` to `educator_approved`?
4. **Retiring Heavy / Unused Assets (`kidney.glb`, `boombox.glb`, `camera-optics.glb`):** Confirm removal of orphaned `boombox.glb` (`2.16 MB`) and mismatched `kidney.glb` (`7.70 MB`) / `camera-optics.glb` (`3.76 MB`) during Gate 3 cleanup to save **`13.6 MB`** of static bundle assets and accelerate low-end Android loading.
