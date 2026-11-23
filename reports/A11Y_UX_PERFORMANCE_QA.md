# Katrio — Accessibility, UX & Performance QA Report

**Audit Date:** 2026-11-22  
**Target Standards:** WCAG 2.2 AA · CAST UDL 3.0 · Calm Student-First Mobile/Desktop UX · Zero-Login Static Architecture  
**Scope:** Gate 3 History Unit 4 (`4.1`–`4.10`) 9-Stage `UnifiedSubsectionPlayer`, `SubsectionConceptMap`, `HistoryUnit4Interactive2D`, cleaned `SectionPlayerPage` / `UnitPage` headers, and fixed 3D Heart Cutaway (`14.15`).

---

## 1. WCAG 2.2 AA & CAST UDL 3.0 Verification Matrix

| Criterion | Status | Implementation Evidence |
| --- | --- | --- |
| **Keyboard-only navigation (2.1.1 / 2.4.7)** | Verified in code | All concept-map SVG nodes (`<g role="button" tabIndex={0}>`), timeline/map region buttons, depth-layer toggles (`Simple / Detailed / Exam-ready`), causal reveal steps, glossary popovers, and challenge selectors are fully keyboard-focusable with `Enter` / `Space` / Arrow support and visible focus rings (`focus-visible:outline`). |
| **Target size ≥ 44×44 CSS px (2.5.8)** | Verified in code | Primary interactive buttons, stage actions, challenge options, glossary pills, and Prev/Next navigation buttons enforce `min-h-[44px]` across `UnifiedSubsectionPlayer`, `SubsectionConceptMap`, and `HistoryUnit4Interactive2D`. |
| **Non-color visual cues (1.4.1)** | Verified in code | Concept-map nodes distinguish `Cause` / `Event` / `Effect` with explicit text badges + dashed/solid stroke patterns, not color alone. Challenge feedback pairs icons + plain-text `"Why"` explanations. |
| **Multiple means of representation (UDL 3.0)** | Verified in code | Every History Unit 4 subsection provides: (1) ELI5 plain English + optional Tamil toggle + analogy + `Simple → Detailed → Exam-ready` depth layers, (2) optional user-triggered Web Speech `Listen` button (never autoplays!) with visible text right on screen, (3) interactive SVG concept map **plus** structured text-list view **plus** print-friendly note mode, (4) bespoke 2D historical map/timeline, (5) chunked textbook reading guide (`#textbook-reading`). |
| **Reduced motion & calm UI (2.3.3)** | Verified in code | Zero auto-spinning 3D canvases on History Unit 4 (`0` WebGL contexts mounted); calm static/step-driven 2D SVGs honouring `prefers-reduced-motion` and Katrio's Learning Settings drawer (`reduceMotion`, `highContrast`, `darkMode`, `dyslexiaFont`, `fontSize`). |
| **Zero student-facing editorial jargon (Rule A3)** | Verified in code | Removed the orange `"Title awaiting editorial verification"` pill from the student header in `SectionPlayerPage.tsx` and removed `"Heading in review"` / `"Pilot ready"` / `"TOC verified"` / `"Awaiting editorial review"` labels from `UnitPage.tsx` and chapter sidebars. Full audit/provenance status remains honestly disclosed inside the collapsible *"Textbook provenance, Pass 0 audit & page reference"* drawer at the bottom of the lesson. |
| **Meaningful completion tracking** | Verified in code | Visiting a subsection marks `Started`; interacting or checking the challenge marks `Practised`; `Completed` is triggered only when the learner actively finishes the `"You try"` challenge or self-confirms `"Can you explain it?"` in Stage 9. Local `Review later` bookmark persists strictly in browser `localStorage` (zero login, zero server calls). |

---

## 2. Performance & Architecture Budget (History Unit 4 vs. 3D Science)

- **History Unit 4 (`4.1`–`4.10`) WebGL Budget:** **0 WebGL contexts** (100% crisp vector SVG + semantic HTML/CSS), ensuring instant paint, low battery draw on budget Android phones, and crisp zooming up to 400%.
- **Preserved Genuine 3D Models (Science Unit 14 Heart Cutaway Fix):**
  - Fixed the cutaway Z-overlap artifact reported on `14.15 Structure of Human Heart` (`src/components/engines/ModelExplorer3DCanvas.tsx`): pushed `backShell` to `z = -0.22` with `opacity: 0.24` and `THREE.BackSide` so the 4 internal chambers, septum, valves, aorta, and venae cavae remain unobstructed, and tightened cutaway auto-switch thresholds (`>= 60%` / `<= 25%`).
  - Existing working 2D/3D labs across Chemistry beakers, Physics/Maths sliders, NASA 4K satellite Earth & SRTM India/Tamil Nadu terrain, and all 13 open-source `.glb` models in `public/models/` remain untouched and intact.
- **Static SSG & Routing Integrity:** Verified via `npm run lint` (`tsc --noEmit`), `npm test`, `npm run validate:lessons`, `npm run audit:curriculum`, `npm run audit:links` (regenerates `sitemap.xml` & `_redirects`), and `npm run build` (full Vite + React static build).

---

## 3. Honest Residual Risks & Required Human QA (Gate 4)

1. **Real-Device & Screen-Reader Verification Pending:** Automated tests verify schema contracts, route non-collision, and TypeScript safety, but live testing with **NVDA / TalkBack / VoiceOver** and real **360px–412px budget Android phones** has not yet been performed by human testers.
2. **Student & Teacher Comprehension Trial Pending (Gate 4):** Before expanding the 9-stage `UnifiedSubsectionPlayer` pattern to Geography Unit 4, Civics Unit 4, and Economics Unit 4, test `4.1`–`4.10` with 3–5 Class 10 Tamil Nadu students and 1 Social Science teacher to verify reading load, Tamil clarity, and map legibility.
3. **Legacy 684 Routes Still Use Legacy 4-Tab Player:** The 684 routes outside History Unit 4 intentionally continue using Katrio's existing 4-tab `SectionPlayerPage` + `EngineShell` (preserving all existing 3D/2D labs and 85 pilot lessons) until migrated incrementally chapter-by-chapter under Gates 5+.
