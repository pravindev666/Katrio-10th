# Katrio Learning Universe — Versioned Release Scorecard (Gate 5)

- **Release Snapshot:** `katrio-class-10` v0.2.0 — *Concept-First Learning Universe (Gates 0–5 Complete)*
- **Date:** 2026-11-23
- **Architecture:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · KaTeX · Three.js · Static Cloudflare Pages SSG (`787` pre-rendered HTML routes)
- **Privacy & Access Guarantee:** Zero login, zero student profiles, zero analytics/tracking, zero countdown timers, zero public leaderboards, zero runtime paid AI APIs. All progress, reflection notes, Discovery Stamps, and Capstone saves remain strictly on-device under `katrio-device-v1` with JSON Export / Import / Reset.

---

## 1. Exact Verified Denominators & Before → After Transformation

| Metric | Before Rebuild (Gate 0 Baseline) | After Gates 2–5 (Verified 2026-11-23) | Verification Command |
| :--- | :--- | :--- | :--- |
| **Subjects / Chapters (Units)** | 5 subjects · 72 units | **5 subjects · 72 units** (100% preserved) | `npm run audit:curriculum` |
| **Canonical Section Routes** | 694 (`691` handover + `3` body-verified) | **694** (100% canonical URL parity) | `npm run audit:curriculum` |
| **Total Static SSG Routes (`dist/`)** | 785 | **787** (`+ /arcade/sustainable-tn-town`, `+ /progress`) | `npm run build` |
| **Stale Cross-Domain `accessibility_fallback` Strings** | 402 (366 cross-domain + 36 intra-chemistry) | **0** (`496` entries purified cleanly) | `npm run validate:universe` |
| **Redundant `2D & Text` Button on Already-2D Pages** | 431 routes | **0** (hidden on all 534 non-3D routes via `isRouteUsing3DView`) | `npm run validate:universe` & `npm test` |
| **Retained `.glb` 3D Models on Disk** | 13 models (`35.68 MB`) | **7 purposeful models (`21.88 MB`)** (`13.80 MB` / 6 mismatched models retired) | `npm run validate:universe` |
| **Retired Mismatched 3D Canvases Deleted** | 7 decorative/dark canvases | **0 references remaining in `src/`** | `npm run validate:universe` |
| **Live Runtime Representation Split (`694` routes)** | Forced 3D in English/Tamil/History/Maths | **160 Synchronized 3D+2D · 534 Pure 2D / Language / Scenario** (0% 3D in English, Tamil, History, Maths Ch. 1–5/8) | `npm run validate:universe` |
| **Calm 4-Tab Concept Quest Workspace Coverage** | Mixed 7-link & 10-box vertical scroll walls | **694 / 694 routes (100%)** (`SectionPlayerPage`, `ConceptFirstLessonPlayer`, `UnifiedSubsectionPlayer`) | Codebase + `npm run lint` |
| **Automated Unit Tests (`src/utils/*.test.ts`)** | 27 tests | **33 / 33 passing (0 failed)** | `npm test` |
| **Honest External Educator Sign-Off (`educator_approved`)** | 0 | **0 (Reported honestly — never fabricated)** | `npm run validate:universe` |

---

## 2. Reproducible Automated Verification Results (All Exit Code 0)

Every verification gate below ran cleanly on 2026-11-23 with **`TOTAL FAILED STEPS: 0`**:

| # | Command | Result | Verified Summary |
| :-: | :--- | :-: | :--- |
| 1 | `npm run lint` (`tsc --noEmit`) | **PASS (0)** | Zero TypeScript errors across all routes, engines, scripts, and tests. |
| 2 | `npm run audit:curriculum` | **PASS (0)** | 5 subjects, 72 units, 116 verified + 578 auto-extracted = **694** sections, 1,387 source-page anchors, 0 duplicate IDs, Tamil Unicode intact. |
| 3 | `npm run validate:lessons` | **PASS (0)** | **25 / 25** flagship JSON lesson packages validated cleanly against contract. |
| 4 | `npm run validate:universe` | **PASS (0)** | **0** stale fallbacks, **0** retired `.glb` / canvas refs, **7 / 7** active `.glb` files present (`21.88 MB`), **6** Worlds & **8** Showcase Pilot entries verified, `educator_approved = 0` honesty guard enforced. |
| 5 | `npm run audit:links` | **PASS (0)** | **787** unique canonical routes verified; `public/sitemap.xml` & `public/_redirects` regenerated. |
| 6 | `npm test` | **PASS (0)** | **33 / 33** unit tests passed (including `sustainableTownSim`, `isRouteUsing3DView`, `resolveSectionQualityTier`, `validateProgressJson`, `conceptFirstSimulations`, `curriculumStore`, `history_unit4`, `chemistrySimulations`, `physicsSimulations`). |
| 7 | `npm run build` | **PASS (0)** | Production Vite 8 bundle built in `6.63s` + **787** pre-rendered static HTML files written under `dist/`. |

---

## 3. Honest Quality-Tier Breakdown Across All 694 Canonical Routes

Katrio enforces a strict 5-tier quality model (`indexed` → `explained` → `interactive` → `assessed` → `educator_approved`) and **blocks** any automated script from marking `educator_approved` without real external teacher sign-off:

| Honest Quality Tier | Route Count | Share of 694 | Meaning in Katrio UI |
| :--- | :---: | :---: | :--- |
| **`assessed`** (Concept + Working Model + Verified Mastery Checks) | **53** | 7.6% | Full concept-first packages, flagship JSON pilots, History U4 suite, and Gate 2 pilots |
| **`interactive`** (Topic-Specific Interactive Studio + Explanation) | **60** | 8.6% | Verified chapter routes with purpose-built 2D/3D labs and checks |
| **`explained`** (Plain Explanation + 4-Tab Workspace + Book Anchor) | **93** | 13.4% | Subsections with concept-specific explanation, mind map, and interactive workbench |
| **`indexed`** (Textbook-Indexed Reference + 4-Tab Workspace) | **488** | 70.3% | Cleanly indexed auto-extracted headings with purified topic fallbacks, chapter labs, and textbook anchors |
| **`educator_approved`** (Signed External TN Subject / Tamil Teacher QA) | **0** | 0.0% | **Pending external human subject-teacher & Tamil-educator review** |

---

## 4. Gate 2 Showcase Pilots — 15-Point Gold-Standard Playability Matrix

All Gate 2 Showcase Pilots are live on the local dev server (`http://localhost:3001/`) and statically pre-rendered in `dist/`:

| Pilot | Canonical Route & Live Dev URL | Medium | Automated / Engineering Points (1–12, 14) | Point 13 (External Educator QA) | Point 15 (Live Classroom Student Transfer Pilot) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **1A. Science 4.8.1** Joule’s Law of Heating | [`/class-10/science/science-04/science-04-auto-4-8-1-joule-s-law-of-heating`](http://localhost:3001/class-10/science/science-04/science-04-auto-4-8-1-joule-s-law-of-heating) | Interactive 2D (`JoulesLawLab2D` + p. 51 Appliance Context) | **PASS** (13/13 automated/design checks) | Pending Physics Teacher Sign-off | Pending Classroom Pilot |
| **1B. Science 10.1** Chemical Reactions | [`/class-10/science/science-10/science-10-auto-10-1-types-of-chemical`](http://localhost:3001/class-10/science/science-10/science-10-auto-10-1-types-of-chemical) | Sync 3D Bright Glassware + 2D Process Flowchart + Atom Bars | **PASS** (13/13) | Pending Chemistry Teacher Sign-off | Pending Classroom Pilot |
| **2A. Maths 4.3** Thales & Angle Bisector | [`/class-10/mathematics/maths-04/maths-04-03`](http://localhost:3001/class-10/mathematics/maths-04/maths-04-03) | Interactive 2D Constrained Proof (`A, B, C, D, E` labels) | **PASS** (13/13) | Pending Maths Teacher Sign-off | Pending Classroom Pilot |
| **2B. Maths 7.2 / 7.3** Mensuration Solids | [`/class-10/mathematics/maths-07/maths-07-02`](http://localhost:3001/class-10/mathematics/maths-07/maths-07-02) | Sync 3D Solids + Animated 2D Unfolded Nets + Tank Mission | **PASS** (13/13) | Pending Maths Teacher Sign-off | Pending Classroom Pilot |
| **3. English Unit 1** *His First Flight* | [`/class-10/english/english-01/english-01-prose`](http://localhost:3001/class-10/english/english-01/english-01-prose) | 0% 3D · 5-Scene 2D Coastal Storyboard + Perspectives + Vocab + Alternate Ending | **PASS** (13/13) | Pending English Teacher Sign-off | Pending Classroom Pilot |
| **4. Tamil இயல் 4** *மணற்கேணி* (4.1 & 4.4) | [`/class-10/tamil/tamil-04/tamil-04-01`](http://localhost:3001/class-10/tamil/tamil-04/tamil-04-01) & [`tamil-04-04`](http://localhost:3001/class-10/tamil/tamil-04/tamil-04-04) | 0% 3D · `வடம் vs ஒட்டகம்` + Interactive `இருதிணை → ஐம்பால்` Tree + `வழாநிலை/வழு` Builder | **PASS** (13/13, transparently badged *Provisional*) | Pending Tamil Educator Proofreading | Pending Classroom Pilot |
| **5. Social History 4.2** Cold War Rivalry (+ U1) | [`/class-10/social_science/social-history-04/social-history-04-auto-4-2-cold-war-rivalry`](http://localhost:3001/class-10/social_science/social-history-04/social-history-04-auto-4-2-cold-war-rivalry) | 0% 3D · Dated 2D Historical Maps + Causal Choices + Fact vs Interpretation | **PASS** (13/13) | Pending History Teacher Sign-off | Pending Classroom Pilot |
| **6. Capstone** *Sustainable TN Town* | [`/arcade/sustainable-tn-town`](http://localhost:3001/arcade/sustainable-tn-town) | Untimed 4-Stage Cross-Subject Simulation (π = 22/7, kWh→J, Monsoon, Budget, Proposal) | **PASS** (13/13) | Pending Multidisciplinary Teacher Review | Pending Classroom Pilot |

---

## 5. Retained vs Retired 3D Assets (`public/models/`)

- **Retained (7 purposeful models · `21.88 MB` total):** `human-heart.glb`, `brain.glb`, `neuron.glb`, `animal-cell.glb`, `bacterial-cell.glb`, `leaf-plant.glb`, `gears.glb` (all documented in `public/models/PROVENANCE.md` and referenced in active 3D labs).
- **Retired & Deleted (6 mismatched models · `13.80 MB` reclaimed):** `boombox.glb`, `kidney.glb`, `camera-optics.glb`, `flower.glb`, `seabird-animated.glb`, `parrot-animated.glb`.
- **Retired & Deleted Code (7 decorative/dark canvases):** `Tamil3DStageCanvas.tsx`, `EnglishStory3DCanvas.tsx`, `ChemicalProcess3DCanvas.tsx`, `MathsChapter3DCanvas.tsx`, `HistoryTheatre3DCanvas.tsx`, `CivicsEconomics3DCanvas.tsx`, `SocialInteractiveLabs.tsx`.

---

## 6. Known Limitations & Honest Next Steps

1. **External Educator Sign-Off (`educator_approved = 0`):** All 694 routes — and specifically all Tamil lessons (*Provisional — pending Tamil educator proofreading*, due to legacy font encoding in the official 2025 Tamil PDF) — await independent review by Tamil Nadu Class 10 subject teachers before advancing to `educator_approved`.
2. **Real Student Usability & Transfer Testing:** Point 15 (observing real Class 10 students complete transfer checks without adult rescue) and full assistive-technology screen-reader testing (NVDA / TalkBack on budget Android phones) must be conducted in live classroom pilots before claiming WCAG certification.
3. **Chunk Size Optimization (Non-Blocking):** `npm run build` emits a standard Vite advisory that the main JS bundle (`index-*.js`, `688 kB` gzipped) exceeds `500 kB` because the static curriculum registry (`curriculum_registry_class10.json`) is bundled for instant zero-backend offline search. Future optimization can split subject JSON chunks dynamically by route if initial mobile payload reduction becomes a priority.
4. **Remaining Syllabus Authoring (`488` `indexed` subsections):** Every route now loads cleanly in the Calm 4-Tab Workspace with accurate purified fallbacks and topic-matched interactive engines, while full bespoke per-subsection worked examples and transfer items can continue expanding incrementally from `53` `assessed` routes toward complete chapter-by-chapter parity.
