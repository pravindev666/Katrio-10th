# Katrio Learning Universe — World Map & Information Architecture

**Document ID:** `UNIVERSE_04_WORLD_MAP_IA`  
**Version:** 1.0 (Gate 1 Proposal — Awaiting Owner Sign-Off)  
**Design Principle:** *Magical optional discovery layer on top of rock-solid, instant, keyboard-accessible syllabus navigation.*

---

## 1. Navigation Architecture & Preserved Canonical URLs

**All `785` existing canonical routes stay 100% intact** (zero broken links, zero changed section IDs, full Cloudflare Pages static SSG support). New Universe views enhance existing hubs cleanly without adding mandatory detours:

| Route | Screen Name | Role in Katrio Learning Universe |
| :--- | :--- | :--- |
| `/` | **Home / Katrio Universe Hub** | Bright daylight hero: *"Choose a World"*, local *"Continue Where You Left Off"* card, instant bilingual English/Tamil Search bar, *"Jump Straight to Textbook"*, Six World Portals, and a **Live Working Preview Carousel** (only real interactive pilots — zero fake demos!). |
| `/class-10` | **Universe Overview & Textbook Index** | Toggleable **Universe Map View** (6 connected interactive 2D SVG World Islands showing cross-subject bridges) ↔ **Fast Syllabus List View** (all 72 chapters filterable by subject, tier, or search). |
| `/class-10/:subject` *(+ Social Science strands)* | **Subject World Page** | Top toggle: **World Map (Concept Islands)** ↔ **Textbook Chapter List**. Shows prerequisite paths between chapters, honest quality-tier indicators (`Interactive Pilot`, `Explained`, `Indexed`), and direct chapter launch. |
| `/class-10/:subject/:unitId` | **Chapter Quest Hub** | Chapter big question, short visual **Chapter Journey Path** (3–7 milestone nodes), interactive chapter concept overview, ordered subsection list (every topic directly clickable), optional Chapter Capstone Chain, and local mastery progress. |
| `/class-10/:subject/:unitId/:sectionId` | **Calm 4-Tab Lesson Quest Workspace** | All `694` canonical deep links render inside one consistent, distraction-free **4-Tab Workspace** (`Discover & Explore`, `Connect & Remember`, `Solve & Apply`, `Book & Revision`) with Focus Mode and collapsible Chapter Drawer. |
| `/arcade` | **Cross-Subject Challenge Arcade** | Replaces the 13 raw engine developer previews with curated **Mission Quests** & skill challenges grouped by **Learning Goal**, **Subject**, and **Difficulty** — anchored by signature capstones like ***Design a Sustainable Tamil Nadu Town***. |
| `/flashcards` & `/quizzes` | **Personal Retrieval & Practice Deck** | Spaced local retrieval queue ("Due for Review", "Filter by Subject/Chapter") pulling from exact-section decks. |
| `/privacy` *(alias `/progress`)* | **Anonymous Local Reflection & Progress** | Device-local journey map: Concepts Explored vs. Understood, saved *"Teach it back"* notes, earned mastery stamps, JSON Export / Import / Reset — **zero personal identifiers, zero account**. |
| `/teachers`, `/accessibility`, `/about`, `/roadmap` | **Classroom, Inclusion & Governance** | Projector mode guide, textbook-page crosswalk, WCAG 2.2 AA & UDL display settings, copyright/attribution table, and live honest tier scorecard. |

---

## 2. Visual & Interactive Identity of All Six Worlds

Every World honors [`src/styles/tokens.css`](file:///c:/Users/hp/Desktop/katrio-—-class-10-interactive-visual-learning/src/styles/tokens.css) so Katrio feels cohesive, bright, and unmistakably educational — **like visiting six bright wings of a world-class science & culture museum**.

| # | World Name & Accent Token | Visual Motif & Atmosphere | Concept Island Clusters (on World Page) | Signature Student Experiences |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Science Discovery World**<br>`--science: #0B7773` / `--science-tint: #E8F6F4` | Bright glass-walled museum lab with blueprint grids, crisp brass/copper physics tools, luminous laboratory glassware, and clean anatomical cards. | **4 Wing Islands:**<br>1. *Physics Hangar* (Units 1–6)<br>2. *Chemistry Reaction Studio* (Units 7–11)<br>3. *Living Systems & Anatomy Theatre* (Units 12–18)<br>4. *Evolution, Health & Planet Lab* (Units 19–23) | • 3D Heart Cutaway + synced 2D Double Circulation<br>• Bright 3D Reaction Beakers + synced 2D Equation Flowchart (`10.1`)<br>• Joule's Law Heating Bench (`4.8.1`) & 3D Molecules (`7.2`, `11.3`)<br>• Clinical 2D Hormones, Leech/Rabbit, Genetics & Rainwater Labs |
| **2** | **Mathematics Workshop**<br>`--math: #7155C8` / `--math-tint: #F0ECFC` | Tactile architect's drafting studio: crisp white coordinate paper, cobalt-indigo compass lines, translucent 3D solids unfolding into origami nets. | **3 Studio Benches:**<br>1. *Numbers, Relations & Algebra Machine* (Ch. 1–3)<br>2. *Geometry & Coordinate Proof Table* (Ch. 4–5)<br>3. *Surveying, 3D Solids & Data Lab* (Ch. 6–8) | • Constrained 2D Thales & Angle Bisector Proof (`4.3`)<br>• 3D Mensuration Solids linked to 2D Unfolded Nets (`7.2` Water Tank Mission)<br>• 3D/2D Lighthouse Clinometer (`6.3`)<br>• Matrix Row×Column & Statistics `σ`/CV Workbench |
| **3** | **English Story Universe**<br>`--english: #3478C0` / `--english-tint: #E9F3FC` | Warm illustrated literary folio: coastal cliffs, ink-wash scene strips, character quote cards, poetic rhythm staves, and calm serif/sans pairing. | **3 Story Zones:**<br>1. *Courage & Discovery Stories* (Prose U1–U7)<br>2. *Verse & Memoriter Salon* (Poems U1–U7, 4 `*` badges)<br>3. *Grammar, Vocab & Perspective Desk* (Supp + Craft) | • *His First Flight* playable 2D storyboard, conflict investigation & vocab micro-game (`english-01-prose`)<br>• Interactive Poetic-Device Highlighter & Blank-Fill Memoriter Trainer (`Life`, `I am Every Woman`, etc.)<br>• 0% forced 3D inside lessons |
| **4** | **Tamil Language & Literature World**<br>`--tamil: #C04F75` / `--tamil-tint: #FDECF2` | Refined Tamil literary pavilion: palm-leaf / temple-stone warm accents, generous `Noto Sans Tamil` typography (`line-height: 1.75`), and lyrical cultural vignettes. | **7 இயல் Pavilions (இயல் 1–7):**<br>Visual progression across *அமுதஊற்று*, *உயிரின் ஓசை*, *கூட்டாஞ்சோறு*, *மணற்கேணி*, *மணற்கேணி → திருப்புமுனை*, *நிலா முற்றம்*, *விதைநெல்* — each showing செய்யுள், உரைநடை, விரிவானம் & கற்கண்டு இலக்கணம் clearly. | • இயல் 4 *மணற்கேணி* interactive 2D translation & இலக்கணம் (ஐம்பால், வழு/வழாநிலை/வழுவமைதி) studio (`tamil-04-01`, `tamil-04-04`)<br>• 9 `*` மனப்பாடப் பகுதி trainers & visual grammar trees<br>• 0% 3D pillars; Tamil educator review gated |
| **5** | **Social Science Time & Earth World**<br>`--social: #9B631F` / `--social-tint: #FFF3E3` | Cartographer's atlas room: authentic NASA Blue Marble satellite maps, sepia-framed dated timelines, parliament chamber & town-hall civic boards. | **4 Atlas Terrains:**<br>1. *History Time Portal* (Units 1–10)<br>2. *India & Tamil Nadu Satellite Atlas* (Geo Units 1–7)<br>3. *Constitutional Democracy Hall* (Civics Units 1–5)<br>4. *Economy & Development Ledger* (Econ Units 1–5) | • History Unit 4 Cold War dated 2D maps & causal choices (`4.1–4.10`)<br>• NASA 2D India/TN Maps + optional 3D SRTM terrain elevation profiles<br>• Municipal Budget & Tax Incidence Simulator (explicit historical vs current law notes) |
| **6** | **Cross-Subject Challenge Arcade**<br>`--arcade: #C35243` / `--arcade-tint: #FFF0EC` | Maker-fair mission board: bright illustrated challenge cards showing linked subject badges, difficulty selector, untimed play, and local reflection summaries. | **3 Mission Tracks:**<br>1. *Tamil Nadu Real-World Capstones* (2–5 chapters)<br>2. *Quick Concept Micro-Games* (2–5 min untimed)<br>3. *Board-Exam Transfer Drills* (mixed unfamiliar problems) | • ***Design a Sustainable Tamil Nadu Town*** (Maths Ch. 7 + Science U4/U22 + Geo U6/U7 + Economics U4 + English/Tamil civic brief)<br>• *Solar Microgrid Challenge*, *Monsoon Flood-Safe Bridge*, *Zero-Waste School Lab* |

---

## 3. Screen-by-Screen UX Blueprints

### 3.1 Home / Universe Hub (`/`)
1. **Top Utility Header (Compact, 64 px):** `Katrio` logo + `Class 10 TN` pill | 4 clean nav items (`Universe`, `Subjects`, `Challenge Arcade`, `For Teachers`) | `Learning Settings` button (Theme, Font Size, Reduce Motion, Bilingual Tamil Assist, Focus Mode) | Local Progress badge (`Explored / Understood` link to `/privacy`).
2. **Hero Band:** Plain-English promise (*"Step inside Class 10. Experiment, discover, and make it stick."*), two primary CTAs (`Explore the 6 Worlds` + `Jump Straight to Textbook`), plus an instant **Bilingual Search Bar** (matching chapter names, section numbers like `4.8.1`, English terms, and Tamil Unicode like `மணற்கேணி`).
3. **Continue Learning Card** *(shown only when local device history exists)*: Exact last section, current tab, honest progress stage, 1-click resume.
4. **Six World Portals Grid (2×3 Desktop / 1-col Mobile):** Each card shows World colour strip, mini illustrated 2D emblem, signature question, live count of `Interactive` / `Assessed` chapters vs `Total`, and two links: `Enter World` + `Try Featured Quest`.
5. **Live Playable Pilot Carousel:** Interactive preview of ONLY genuinely verified working pilots (e.g., try changing `I` in Joule's Law or dragging `DE ∥ BC` in Thales right in the preview, or launching the full quest) — **retiring the outdated "All 9 3D Labs" grid that currently advertises Tamil 3D pillars and English 3D birds!**

### 3.2 World Page (`/class-10/:subject`)
- **Dual View Switcher (Persisted Locally, Keyboard Accessible):**
  - **Concept Island Map (Default on Desktop/Tablet, Optional on Phone):** Lightweight interactive 2D SVG map grouping chapters into thematic islands connected by labelled prerequisite arrows (e.g., *Unit 4 Electricity* → *Unit 22 Electrical Energy Management*). Clicking any node opens a compact Chapter Preview Card with `Start First Quest` and `View All Topics`.
  - **Ordered Textbook List (1-Click Switch / Default for Screen Readers & Quick Exam Prep):** Exact SCERT unit order with search, quality-tier filter (`All` | `Ready to Play` | `In Progress`), printed page range, and zero map scrolling required!

### 3.3 Chapter Quest Hub (`/class-10/:subject/:unitId`)
- **Chapter Header:** Big curiosity question, printed textbook page range, and honest chapter readiness meter (e.g., *"3 Assessed · 7 Interactive · 2 Indexed"*).
- **Visual Chapter Journey Strip:** Horizontal (scrollable/keyboard-tabbable) 3–7 step milestone path showing how subsections build toward the chapter's big idea + optional Chapter Capstone.
- **Direct Subsection Index:** Every subsection listed in exact textbook order with its quality-tier badge, personal local stage (`Not Started`, `Visited`, `Explored`, `Practised`, `Understood ✓`), and 1-click launch.

### 3.4 Anonymous Device-Local Reflection & Progress (`/privacy`)
- Displays four honest local counters (`Visited`, `Explored`, `Practised`, `Understood`), a subject-by-subject mastery bar, earned **Concept Discovery Stamps** (unlocked only by verified transfer checks), saved *"Teach It Back"* reflection notes, bookmarked topics for revision, and one-click **Export JSON / Import JSON / Reset All Device Data** — strictly zero accounts or telemetry.

---

## 4. Accessibility (WCAG 2.2 AA & CAST UDL 3.0) & Low-End Android Performance Budget

| Constraint | Verifiable Engineering Target |
| :--- | :--- |
| **No Mandatory Heavy 3D Lobby** | Universe Hub and World Pages use **pure crisp 2D SVG + CSS** (`< 120 KB` initial JS+CSS gzipped on landing). Three.js (`~160 KB` gzipped) and `.glb` models load **strictly on demand** when a user enters a `synchronized-2d-3d` lesson and clicks or views the 3D panel. |
| **Low-End Android Budget (4G / 2 GB RAM)** | First Contentful Paint `< 1.8 s` on throttled Fast 3G/4G; individual lazy `.glb` assets capped at `≤ 2.0 MB` after Draco/meshopt compression (down from `7.70 MB` today); automatic WebGL-context-loss fallback to the synchronized 2D interactive diagram. |
| **Keyboard & Screen-Reader Parity** | Full `Tab` / `Arrow` / `Enter` / `Space` operation across World Maps, 4-tab bars (`role="tablist"`), sliders (`aria-valuetext` with units), drag-free button steppers, and semantic `lang="ta"` on all Tamil spans. |
| **Touch & Visual Comfort** | Minimum `44×44 px` touch targets; `≥ 4.5:1` text contrast across Light, Dark, and High-Contrast themes; full `prefers-reduced-motion` + manual Reduce Motion toggle pausing all 3D orbits and 2D particle flows; text scaling up to `125%` with zero horizontal scroll traps at `360 px` width. |
