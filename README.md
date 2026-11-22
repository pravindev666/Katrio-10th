# Katrio · Interactive Visual Learning · Tamil Nadu Class 10

**Spec Alignment:** `GAIS-2026-11-v1` → `AGY-2026-11-v1`  
**Brand Promise:** *Don't just read the lesson. Step inside it. See it. Try it. Understand it.*  
**Architecture:** 100% static-first, zero-login, zero-backend, zero-tracking educational web app built with React 19, TypeScript, Vite 8, Tailwind CSS v4, KaTeX (locally bundled), and lazy-loaded Three.js.

## 1. Canonical Curriculum & Pass 0 / Pass 1 Status

Synced verbatim from `Katrio_Complete_Google_AI_Studio_AGY_Handover/curriculum_registry_class10.json` and audited against all 5 supplied Tamil Nadu SCERT Class 10 PDFs (`10th-Books/`, gitignored):

- **Subjects:** `5` (`science`, `mathematics`, `english`, `tamil`, `social_science`)
- **Units / Chapters:** `72` (Science: 23, Mathematics: 8, English: 7, Tamil: 7, Social Science: 27 across History [10], Geography [7], Civics [5], Economics [5])
- **Manually TOC-Verified Content Sections:** `113`
- **Auto-Extracted Subsection Candidates (Pass 0 PDF-Audited, Pending Human Educator Sign-Off):** `578/578` resolved (`176` multi-line / visually verified headings cleanly recovered; `0` unresolved; original extracted strings preserved in `original_extracted_title`)
- **Total Deep-Linked Section Routes:** `691` (`782` total canonical pre-rendered routes)
- **Traceable Source-Page Anchors:** `1,387` + `370` evidence markers
- **All 6/6 Handover 3D Interactive Labs Live (Lazy-Loaded Three.js + 2D/Text Fallback):**
  1. `science-14-auto-14-15-structure-of-human-heart` — **3D Human Heart Cutaway & Double Circulation**
  2. `maths-07-02` (plus all Ch. 7 solids) — **3D Mensuration Solids & Unfolded Net Explorer** (Cylinder, Hollow Cylinder, Cone, Sphere, Hemisphere, Frustum, Combined Solid, $\pi = 22/7$)
  3. `science-07-auto-7-2-molecule-and` — **3D Atoms & Molecules Builder** (H₂O, CO₂, CH₄, Table 7.1 atomic mass & % composition)
  4. `science-11-auto-11-3-1-hydrocarbons` — **3D Carbon Bond Explorer** (Alkanes/Alkenes/Alkynes, Ethanol, Ethanoic Acid, virtual bromine water test)
  5. `science-12-auto-12-3-internal-structure-of` — **3D Dicot Root & Chloroplast Cutaway**
  6. `social-geography-01-auto-1-2-major-physiographic` — **3D India Relief & Drainage Terrain Model** (*Schematic · Not to Scale*)
- **Pass 2 Complete Chapters (25 validated packages covering 5 full chapters across all 5 subjects + 3D chapters):**
  - **Science Unit 14** (`23/23` sections), **Mathematics Ch. 6** (`6/6`) + **Ch. 7** (`20/20`), **English Unit 1** (`3/3`), **Tamil இயல் 4 மணற்கேணி** (`4/4`), **Social Science History Unit 1** (`3/3`) + **Geography Unit 1** (`2/2`), plus **Science Unit 10** Reactions pilot.

## 2. Run, Audit, Validate, Test & Build Commands

```bash
# Install dependencies
npm install

# 1. Run Pass 0 PDF audit against 10th-Books/ (generates pass0_heading_audit.json & Coverage Report)
python scripts/pass0-audit-pdfs.py

# 2. Sync canonical handover registry + Pass 0 recovered headings + handover CSVs into src/data/
npm run sync:registry

# 3. Verify 100% canonical ID parity, counts, and source-status discipline
npm run audit:curriculum

# 4. Validate all 782 canonical routes & regenerate public/sitemap.xml and public/_redirects
npm run audit:links

# 5. Validate all src/data/lesson_content/*.json packages against Section 6 schema & QA honesty rules
npm run validate:lessons

# 6. TypeScript strict type-check & unit/computational test suite
npm run lint
npm test

# 7. Production build + static pre-render (SSG) of all 782 routes into dist/
npm run build

# 8. Local development server (http://localhost:3000)
npm run dev
```

## 3. Repository Layout

- `src/data/curriculum_registry_class10.json` — Canonical registry synced from handover + Pass 0 heading audit
- `src/data/lesson_content/` — Validated `LessonContentPackage` JSON files (`index.ts` loader + 7 pilot JSONs)
- `src/utils/mathSimulations.ts`, `chemistrySimulations.ts`, `heartCirculation.ts` — Pure, unit-tested computational domain modules separated from UI components
- `src/components/engines/` — Modular `LessonEngine` components (`HeartCirculationEngine`, `ReactionLabEngine`, `TrigonometryClinometerEngine`, `StoryStageEngine`, `TamilLanguageStudioEngine`, `HistoryTimeMapEngine`, `ModelExplorer3DCanvas`, and thin dispatcher `EngineShell.tsx`)
- `scripts/prerender-ssg.ts` — Post-build static pre-renderer generating SEO/meta/canonical `<noscript>` HTML for all 782 routes in `dist/`
- `Katrio_Pass0_Source_to_Route_Coverage_Report.md` — Section 14 Source-to-Route Coverage Report and human QA sign-off tracker
