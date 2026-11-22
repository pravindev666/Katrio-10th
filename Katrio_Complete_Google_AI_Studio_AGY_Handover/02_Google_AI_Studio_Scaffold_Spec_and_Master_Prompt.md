# GOOGLE AI STUDIO — BUILD THE COMPLETE PLACEHOLDER WEBSITE

**Document ID:** GAIS-2026-11-v1  
**Mode:** Production-quality STATIC SCAFFOLD ONLY; no educational content generation yet.  
**Working title:** Katrio · Free Interactive Visual Learning · TN Class 10.  
**Inputs you must attach:** `curriculum_registry_class10.json`, `curriculum_index_flat.csv`, `chapter_interaction_blueprints.csv`, `section_activity_plans.csv` and `01_Katrio_Brand_Palette_Landing_Page.md`. Also attach source textbook PDFs if the tool supports them, but the registry is the navigation source of truth.  
**Authority rule:** Metadata in the registry is curricular scaffolding; anything marked auto-extracted needs human review. Never silently replace its text with guesses.

## 1. MASTER PROMPT — paste this into Google AI Studio

```text
You are a staff product designer, frontend architect and accessibility engineer. Build a complete, coherent, premium-quality, static-generated educational website named KATRIO (provisional brand name). Use the attached Brand & Landing Page spec and curriculum_registry_class10.json verbatim as design and route inputs.

MISSION
Free, no-login, age-inclusive Class 10 Tamil Nadu visual learning across Mathematics, Science, English, Tamil and Social Science, plus a Learning Arcade. Learn through accurate 2D/3D visualizations, interactions, flashcards and quizzes when the content is later supplied. Right now BUILD STRUCTURE AND HONEST PLACEHOLDERS ONLY. Do not create invented learning explanations, fake science animations, pretend functional quizzes, or generic repeated paragraphs to simulate coverage.

REQUIRED SITE ORGANIZATION
Landing → Class 10 hub → Subject → Strand (when present) → Unit/Chapter → Section/Subsection → Activity slots. Deep-linked routes for every registered unit and section, consistent breadcrumbs, table of contents sidebar, search index, sitemap, responsive mobile navigation. Mathematics includes numeric subtopics, Science and Social Science include machine-extracted headings flagged for review, English includes prose/poem/supplementary, Tamil includes seven thematic units and each literature/grammar lesson. Every registered source-page anchor must remain traceable from its unit in an accessible “Source page index” drawer. DO NOT interpret source page anchors as teaching content.

TECHNICAL IMPLEMENTATION
Use TypeScript, React and Vite with an explicit STATIC PRE-RENDER/SSG build step; verify output is built for direct links (and fallback handling) on Cloudflare Pages. Prefer data-driven templates and a small interaction-engine interface over one hardcoded component per topic. Import registry JSON; use stable IDs in routes and components; do not create a backend, database, Firebase, Supabase, auth, login, accounts, AI text generation at runtime or expensive subscriptions. Keep a11y and keyboard parity central. Use CSS design tokens from brand spec, with reusable components and light/dark/high contrast schemes.

REQUIRED PAGES
1 Landing with exact section order and final marketing copy from brand document.
2 /class-10 board-and-grade hub, all five subjects + Arcade.
3 /class-10/{subject} for five subjects with search/filter, unit list and accurate counts.
4 /class-10/social_science/{strand} for History/Geography/Civics/Economics.
5 /class-10/{subject}/{unit_id} for every unit.
6 /class-10/{subject}/{unit_id}/{section_id} for every section.
7 /arcade, /flashcards, /quizzes, /teachers, /accessibility, /privacy, /about and /roadmap (with truthful incomplete states).
8 /404 helpful lookup with route suggestions; no broken links.

CHAPTER PAGE SKELETON
Breadcrumb > Unit title and textbook source > learning goals placeholder > stable right/left section navigator > central visually attractive, functional responsive activity container (mock controls DISABLED until implemented) > tabs “Explore”, “Try”, “Understand”, “Practice”, “Flashcards”, “Quiz”, “Review” > editorial status banner and source reference > accessibility alternative panel > continue to next verified section. No generic lesson prose. Add one real interaction DEMONSTRATION component only if genuine and marked an independently authored demo unrelated to textbook facts. Otherwise it is a preview.

STATIC DATA CONTRACT
Fields: id, title, kind, book, printed-page, pdf-page, source_status, content_status, review_status, interaction_status, route, activity_template, accessibility_fallback, assets, sources. Reject duplicate IDs and broken references at build time. Preserve Tamil Unicode; do not transliterate or invent content titles. All imported sections with source_status='auto_extracted_review_required' must display a subtle “Title awaiting editorial verification” tag until AGY approves them.

INTERACTION COMPONENT PLACEHOLDERS
Provide separate reusable shells for: ModelExplorer3D, JourneyThrough, SafeVirtualLab, PhysicsWorkbench, GraphSandbox, GeometryWorkbench, TimelineMap, GeoMap, StoryStage, TamilLanguageStudio, Flashcards, QuizEngine, ConceptGame. Each shell has typed props, clear loading/empty/error/implemented states, meaningful 2D fallback, keyboard controls. The placeholder should have a polished still diagram / labelled empty canvas plus “Interactive experience planned”, NOT faux sliders or buttons that pretend to alter results. Science models and maps must not misrepresent scale or official data.

NO-LOGIN AND PRIVACY
No student personally identifiable information or telemetry by default. Device-local preferences and optional progress via IndexedDB/localStorage only. “Reset my device progress”, “Export progress” and “Import progress” with versioned JSON and validation; these features should truly function if shown. Do not imply synchronized cross-device progress. No mandatory cookies beyond functional storage without explicit appropriate choices.

ACCESSIBILITY
Target WCAG 2.2 AA. Responsive and keyboard operable; pointer alternatives for drag; 44px tap targets; skip links; visible focus; captions; no forced timers; reduced motion, pause/play, sound-off defaults, focus mode, 2D/text alternate pathway, font scaling and proper Tamil glyph shaping. Accessibility must be tested, not merely asserted. Never claim this platform treats ADHD.

SEO + STATIC OUTPUT
Every generated route receives descriptive title and meta, open graph fields, correct sitemap, canonical URL where known, static HTML when possible, and no invented “fully available” claims. Pre-render navigation routes; ensure direct refresh works on Cloudflare Pages and preview deploys. Lazy load heavy visual assets; do not load Three.js on content-only pages.

DELIVERABLES
Source code, README with run/build/deploy, component story gallery, typed schemas, a route/coverage validation script and test outputs. Printed audit: expected 5 subjects, 72 units, 113 manually TOC-verified content-section slots, 578 automatically detected subsection candidates awaiting manual verification, and 1,387 source-page anchors (based on supplied registry v1). Do not treat these extracted candidate counts as proof of exhaustive heading recognition. All 72 unit routes and all imported section routes must resolve and show accurate status.

WORK IN PHASES AND SHOW ACTUAL CODE
Phase A: app shell and design tokens; B: registry-driven class/subject/unit routes; C: all section routes, evidence drawer and honest placeholder shells; D: focus accessibility, local preferences, tests, search index, SSG deployment. Do not start real textbook content injection. Do not remove sections just to simplify the UI. Provide changes + tests + remaining limitations at each phase.
```

**Reuse note:** Treat ManicksGalaxy as a reference for zoom/pan, scene labels, camera reset, and progressive enhancement—not as a reason to render astronomy-style 3D in every subject. If the original repository is provided, review code and asset licensing before reusing.

## 2. Practical project folder structure

```text
src/
  assets/                   # original permitted visual assets
  components/
    chrome/                 # header, breadcrumbs, search, sidebar
    accessibility/          # motion, focus, accessibility controls
    curriculum/             # chapter card, source-page drawer, status tags
    engines/                # typed shells, no fake execution
  data/
    curriculum_registry_class10.json
    lesson_content/         # EMPTY, AGY will populate later
    asset_manifest.json
  features/
    explorer/               # subject pages, sections and search
    arcade/                 # later game implementations
    local-progress/         # import/export, preferences
  routes/                   # SSG route templates
  styles/tokens.css
  types/curriculum.ts
scripts/
  audit-curriculum.ts       # count and source coverage validation
  audit-links.ts
public/
  preview-art/              # original and licensed only
```

## 3. Information architecture and route rules

- Use the `id` of chapter and subsection to build URLs; the displayed title can change after human editorial audit without breaking links.
- Avoid duplicating the 1,387 source page anchors as standalone SEO pages. Keep them in unit source drawers or `/source-pages` on-demand within a unit.
- If a book has a numbered subheading not already captured, AGY appends a new stable ID and review flag; do not renumber existing IDs.
- Social Science uses subject `social_science` and strand labels; Tamil and English do not get artificially split into science-style lectures.
- Distinguish `toc_verified`, `visually_verified_toc`, `auto_extracted_review_required`, and `toc_verified_page_needs_review` statuses.

## 4. Data-bound placeholder examples (real source titles)

- Mathematics → Chapter 6 **Trigonometry** → 6.3 **Heights and Distances** → virtual building measurement viewer placeholder.
- Science → Unit 14 **Transportation in Plants and Circulation in Animals** → human blood-flow model viewer placeholder.
- Science → Unit 10 **Types of Chemical Reactions** → reaction lab viewer placeholder.
- English → Unit 1 → **His First Flight**, **Life**, **The Tempest** → prose/poem/supplementary scene shells.
- Tamil → இயல் 4 **மணற்கேணி** → **மொழிபெயர்ப்புக் கல்வி**, **திருவிளையாடற் புராணம்**, **புதிய நம்பிக்கை**, **இலக்கணம் – பொது**.
- Social Science → Geography → **India - Location, Relief and Drainage** → map workbench placeholder.

## 5. Responsive layouts

Desktop width 1440: left 270px curriculum tree, central 760px player, right 250px contextual help (can collapse); sticky but respects screen height. Tablet: drawer navigation and one content column. Mobile: full-width reader, bottom section navigator, 44px+ target controls, visual viewer height adaptable. Avoid nested scroll traps, hero video autoplay and oversized badges. Device constraints favor a still preview and 2D pathway.

## 6. Acceptance checklist (Google AI Studio delivery gate)

- [ ] 5 subject pages, 72 unit pages, all registered section pages and 1,387 page anchors visible where appropriate.
- [ ] No missing Science/Tamil sections from verified TOC; no invented section names.
- [ ] All source auto-extracted candidates flagged for editorial review, not auto-approved.
- [ ] Design token palette consistent on landing and all subject routes.
- [ ] No login, signup, account, cloud-save or profile buttons.
- [ ] Search can find English and Tamil Unicode titles, subject, unit, and section.
- [ ] Static deployment tested on deep-link browser refresh; no 404 on documented routes.
- [ ] All displayed buttons either work or are explicitly disabled as planned.
- [ ] All placeholder 3D shells have 2D text alternatives and load on low-powered devices.
- [ ] TypeScript check, lint, tests, link-audit and axe/manual keyboard checks performed.
- [ ] Repository handoff to AGY documents content entry points and exact schemas.

## 7. Phased AI Studio instructions (if context/output limit is hit)

**Prompt 1 — App shell:** “Implement only Phase A from the attached GAIS specification. Use the brand tokens and a responsive landing page. Do not add content yet. Return actual code and run instructions.”

**Prompt 2 — Curriculum routes:** “Read the entire attached registry. Implement Phase B with all data-driven route templates and exact subject/unit counts. Do not paraphrase or invent names. Test every route.”

**Prompt 3 — Sections/player:** “Implement Phase C. Render all imported section placeholders with honest statuses and source-page drawers; add engine shell interfaces; do not fake functionality. Validate all identifiers.”

**Prompt 4 — QA/deployment:** “Implement Phase D: accessibility controls, static pre-render, Cloudflare Pages routing, search, indexed local progress, automated tests, source-status audit and README.”

## 8. Stop conditions

Stop and report errors, not silently invent: parse failures in Tamil, an unexplained source page gap, duplicate stable IDs, a title without source evidence, a non-functional interactive experience presented as functional, any SSG deployment path that cannot refresh, and claims of guaranteed exam success or ADHD treatment.
