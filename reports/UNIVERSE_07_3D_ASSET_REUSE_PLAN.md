# Katrio Learning Universe — 3D Asset & Interactive Engine Reuse Plan

**Document ID:** `UNIVERSE_07_3D_ASSET_REUSE_PLAN`  
**Version:** 1.0 (Gate 1 Proposal — Awaiting Owner Sign-Off)  
**Guiding Principle:** *Keep and polish high-value 3D assets where spatial depth accelerates understanding; pair every 3D scene with a synchronized 2D schematic/flowchart/net; eliminate mismatched props and heavy mobile bloat — with ZERO arbitrary 3D percentage cap.*

---

## 1. Strategic Summary: Right-Sized Purposeful 3D (`168 / 694` Routes = `24.2%`)

Across all `694` subsections audited in [`UNIVERSE_06_694_CONCEPT_TO_EXPERIENCE_MATRIX.csv`](file:///c:/Users/hp/Desktop/katrio-—-class-10-interactive-visual-learning/reports/UNIVERSE_06_694_CONCEPT_TO_EXPERIENCE_MATRIX.csv), **`168` routes (`24.2%`)** genuinely benefit from **`synchronized-2d-3d`** experiences — more than 4× the arbitrary 40-topic cap from earlier draft docs — while **`526` routes (`75.8%`)** deliver sharper, faster learning through pure `interactive-2d` (`376`), `scenario-game` (`93`), and `interactive-language` (`57`):

| World | `synchronized-2d-3d` Routes | `interactive-2d` | `scenario-game` | `interactive-language` | Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Science Discovery World** | **135** *(Motion, Optics bench, Gas piston, Circuits, Resistivity, Acoustics, Reactor, Molecules, Periodic Bohr, Bright Metallurgy/Reaction/Organic/Dissolution + 2D Flowcharts, Plant blocks, Heart, Transpiration, Brain/Neuron, DNA)* | 186 | 50 | 0 | **371** |
| **Mathematics Workshop** | **24** *(Ch. 6 Clinometer Survey + Ch. 7 Mensuration Solids synced with 2D Unfolded Nets)* | 126 | 0 | 0 | **150** |
| **English Story Universe** | **0** *(0% forced 3D inside lessons)* | 0 | 0 | 21 | **21** |
| **Tamil Language & Literature World** | **0** *(0% 3D pillars)* | 0 | 0 | 36 | **36** |
| **Social Science Time & Earth World** | **9** *(India & TN Physical Relief / Drainage: NASA 2D Map + optional 3D SRTM elevation profile)* | 64 | 43 | 0 | **116** |
| **TOTAL** | **168 (24.2%)** | **376 (54.2%)** | **93 (13.4%)** | **57 (8.2%)** | **694** |

Crucially, **all `168` `synchronized-2d-3d` routes are powered by just `6` reusable modular 3D/Combined engines** (using procedural geometry + `5` compressed, scientifically reviewed `.glb` models + NASA/SRTM textures) — never 168 separate one-off WebGL scenes!

---

## 2. Exact Asset-by-Asset Audit & Reuse Plan (`public/models/` & `public/textures/`)

### 2.1 Existing `.glb` Models (`public/models/` — Currently `35.68 MB` across 13 files → Target `≤ 10.5 MB`!)

| File | Current Size | License | Decision | Target Size & Action Plan |
| :--- | :---: | :--- | :--- | :--- |
| `heart.glb` | 7.21 MB | MIT (`Human-Organ3D`) | **KEEP & OPTIMIZE** | Compress via Draco / meshopt (`≤ 2.0 MB`). Pair permanently with 2D Double Circulation circuit in Science `14.15`. Add labelled 3D anatomical pins + camera presets (Front, Anterior Cutaway, Valves, Top Vessels). |
| `brain.glb` | 4.44 MB | Apache 2.0 (Z-Anatomy) | **KEEP & OPTIMIZE** | Compress via Draco (`≤ 1.8 MB`). Scope to Science `15.3–15.4` CNS/Human Brain. Add labelled clickable lobe hit-targets (Cerebrum, Cerebellum, Pons, Medulla, Hypothalamus) synced to 2D lobe function cards. |
| `neuron-nih.glb` | 2.75 MB | MIT / US NIH Public Domain | **KEEP & OPTIMIZE** | Compress via Draco (`≤ 1.2 MB`). Scope strictly to Science `15.1–15.2` Neuron & Synapse. Add clickable hit-targets (Dendrites, Cyton, Axon, Myelin Sheath, Nodes of Ranvier, Synaptic Knobs). |
| `plant-foliage.glb` | 5.49 MB | CC0 1.0 (`KhronosGroup`) | **KEEP & OPTIMIZE** | Compress via Draco (`≤ 1.5 MB`) or replace textures with 512px WebP inside glTF. Scope to Science `12.1–12.7` & `14.5` Transpiration canopy context (paired with crisp 2D histological transverse sections). |
| `animal-cell-nih.glb` | 1.46 MB | MIT / US NIH Public Domain | **KEEP (SCOPED)** | Compress (`≤ 0.8 MB`). Use ONLY on relevant cellular/organelle subtopics (never on whole-organism Leech/Rabbit zoology!). |
| `bacteria-wall-nih.glb` | 0.46 MB | MIT / US NIH Public Domain | **KEEP (SCOPED)** | Already compact (`0.46 MB`). Restrict strictly to bacterial/biotech plasmid context (Science Unit 20 / bacterial disease reference only); block leakage into Environment or Lifestyle diseases. |
| `gears.glb` | 0.07 MB | MIT (`three.js`) | **SCOPE TO PHYSICS ONLY** | Tiny (`78 KB`). Remove from English Unit 5 poetry (`EnglishStory3DCanvas`); optionally retain only as a mechanical-advantage icon in Physics Unit 1 if helpful. |
| `kidney.glb` | **7.70 MB** | MIT (`Human-Organ3D`) | **RETIRE FROM CLASS 10** | Largest file in the repo (`7.70 MB`), yet TN Class 10 Science Unit 13 covers **Leech & Rabbit**, not human nephron/kidney! Removing saves `7.70 MB` immediately and stops anatomical mismatch. |
| `camera-optics.glb` | **3.76 MB** | MIT (`three.js` steampunk camera) | **RETIRE** | Decorative steampunk camera prop (`3.76 MB`) does not teach optical thin-lens ray tracing or Unit 23 Scratch. Replace Unit 23 with a crisp 2D Scratch block studio. |
| `boombox.glb` | **2.16 MB** | MIT / CC0 (`three.js`) | **DELETE IMMEDIATELY** | `0` imports anywhere in `src/` — dead binary bloat (`2.16 MB`). |
| `flower.glb` | 0.005 MB | MIT (`three.js`) | **RETIRE** | Low-poly 5 KB toy flower cannot show angiosperm ovule, antipodals, polar nuclei, or egg apparatus accurately; replaced by clinical 2D `Unit17ReproductionSuite2D`. |
| `seabird-animated.glb` | 0.07 MB | MIT (`three.js` `Stork.glb`) | **RETIRE FROM LESSONS** | Upstream mesh is anatomically a **stork**, not a seagull, and does not teach reading comprehension in *His First Flight*. |
| `parrot-animated.glb` | 0.09 MB | MIT (`three.js` `Parrot.glb`) | **RETIRE FROM LESSONS** | Decorative bird in English Unit 2 *Zigzag*; replaced by illustrated 2D storyboard & character studio. |

**Net Asset Impact:** Retiring 6 mismatched/orphaned GLBs removes **`13.8 MB`** immediately; Draco-compressing the 6 retained anatomical/plant GLBs brings the entire 3D model library from **`35.68 MB` down to `~7.8 MB` total** (with every single model lazy-loaded strictly when opened and capped `≤ 2.0 MB` each!).

### 2.2 NASA Satellite & SRTM Elevation Textures (`public/textures/earth/` — `3.16 MB`, 8 files)
- **RETAIN ALL 8 PUBLIC-DOMAIN TEXTURES** (`earth-color-4k.jpg`, `earth-elev-4k.jpg`, `earth-specular.jpg`, `earth-clouds.png`, `india-color.jpg`, `india-height.png`, `tamilnadu-color.jpg`, `tamilnadu-height.png`).
- **Optimization:** Add a `2048×1024` compressed WebP/JPG mobile variant of `earth-color-4k.jpg` (`~320 KB` vs `1.36 MB`) for 2D `AccurateGeoMaps2D` on low-end Android while keeping high-res for desktop zoom.
- **Purposeful 3D Reuse:** Keep `india-height.png` & `tamilnadu-height.png` powering an **optional 3D SRTM terrain elevation cross-section** inside Geography Unit 1 & Unit 6 (`9` physical relief/drainage routes) paired directly alongside the accurate 2D map!

---

## 3. Code Audit & Consolidation Plan for All 17 Procedural 3D Canvases

| Existing 3D Canvas File | Current Role | Gate 3/4 Decision | Reason & Upgrade Plan |
| :--- | :--- | :--- | :--- |
| `ModelExplorer3DCanvas.tsx` | Science `14.15` Human Heart (`heart.glb` + cutaway) | **KEEP & UPGRADE** | Add on-canvas 3D chamber labels, bright clinical studio lighting option, and synchronized 2D Double Circulation link. |
| `Mensuration3DCanvas.tsx` | Maths Ch. 7 Solids (Cylinder, Cone, Sphere, Frustum) | **KEEP & UPGRADE** | Sync directly with animated **2D Unfolded Net SVG** (unfold slider `0–100%`) and water-tank engineering challenge! |
| `MoleculeBuilder3DCanvas.tsx` | Science `7.2–7.4` & `11.1–11.4` 3D Molecules | **KEEP & UPGRADE** | Upgrade lighting to bright daylight lab background (`--viewer-bg`) + bond-angle callouts synced to 2D structural formula & mass table. |
| `ChemistryMixingLab3DCanvas.tsx` | Science `10.1` Virtual Reaction Beakers | **KEEP & POLISH (Gate 2 Pilot 1B!)** | Replace dark background with bright transparent borosilicate glassware, clear precipitate/gas cues, and side-by-side **2D Process Flowchart + Atom Conservation Bars**. |
| `PlantAnatomy3DCanvas.tsx` & `PlantTranspiration3DCanvas.tsx` | Science Unit 12 Tissue Blocks & Unit 14 Transpiration | **KEEP & SYNC** | Sync layer clicks cleanly with crisp 2D histological transverse-section diagrams & stomatal aperture gauges. |
| `TrigSurvey3DCanvas.tsx` | Maths `6.3–6.4` Lighthouse Clinometer | **KEEP & POLISH** | Keep synced with exact 2D right-triangle KaTeX surd derivation (`30°, 45°, 60°` + `0°/90°` boundary diagnostics). |
| `PhysicsLab3DCanvas.tsx` | Motion, Optics, Electricity, Resistivity, Thermal, Acoustics | **KEEP & BRIGHTEN** | Sync each sub-mode cleanly with its 2D diagram/graph (e.g., exact 2D principal-ray diagram paired with Optics bench; 2D circuit schematic paired with circuit bench; retire dark black-box styling). |
| `ChemistryNuclear3DCanvas.tsx` | Nuclear Reactor, Periodic Bohr, Solubility Beaker | **KEEP & SYNC** | Pair Bohr 3D shell with 2D Modern Periodic Table heatmap; pair Solubility beaker with 2D solubility curve & strict 4-state `evaluateSolubilityState()`; pair Reactor core with 2D A/Z nuclear equation balancer. |
| `BiologyCell3DCanvas.tsx` | Brain, Neuron, DNA, Cell, Kidney, Camera, Flower | **REFACTOR & CLEAN** | Retain `brain`, `neuron`, `dna`, `cell`; **strip out `kidney`, `camera_optics`, `flower`, and procedural `gametogenesis`** so zero mismatched assets remain! |
| `IndiaRelief3DCanvas.tsx` | Geography India/TN SRTM 3D Terrain | **SCOPE TO 9 PHYSICAL RELIEF ROUTES** | Keep strictly as optional 3D elevation explorer alongside `AccurateGeoMaps2D` on Geography Unit 1 & Unit 6 relief/drainage routes. |
| `ChemicalProcess3DCanvas.tsx` | Dark opaque procedural dome/furnace (`8.4–8.11`, `11.6–11.7`) | **REPLACE / REBUILD** | Replace dark opaque floating domes with **bright cutaway interactive vessels synced to 2D step-by-step Chemistry Process Flowcharts** (Baeyer/Hall–Héroult, Copper smelting, Iron rusting anode-cathode, Esterification). |
| `MathsChapter3DCanvas.tsx` | Decorative 3D on Maths Ch. 1, 2, 3, 5, 8 | **RETIRE** | Replace with mathematically exact 2D interactive canvases (`MathProofEngine`: arrow maps, Euclid bars, parabolas, Cartesian grid, probability bars). |
| `EnglishStory3DCanvas.tsx` | 3D stork/parrot/island in English U1 | **RETIRE** | Replace with illustrated 2D Storyboard & Language Studio (`StoryLanguageEngine`). |
| `Tamil3DStageCanvas.tsx` | 3D pillars in Tamil இயல் 4 | **RETIRE** | Replace with crisp 2D Tamil Translation & இலக்கணம் Tree Studio (`StoryLanguageEngine`). |
| `HistoryTheatre3DCanvas.tsx` | Generic 3D globe in History U1 | **RETIRE** | Replace with dated, source-grounded NASA 2D Historical Maps (`AccurateGeoMaps2D` + `TimelineMapEngine`). |
| `CivicsEconomics3DCanvas.tsx` & `SocialInteractiveLabs.tsx` | Dead/orphaned 3D Civics/Economics dioramas | **DELETE IMMEDIATELY** | Already unreferenced in live code (`0` production importers); remove to eliminate dead bundle clutter. |

---

## 4. Mandatory 3D Quality, Accessibility & Low-End Mobile Contract

Every retained or upgraded 3D scene in Katrio Universe MUST pass these six engineering standards:
1. **Bright, Consistent Studio Lighting:** Match Katrio's daylight theme (`--viewer-bg: #EDF1F8` in light mode, `#0F172A` in dark mode) — never muddy black void canvases with unreadable labels.
2. **Labelled Interactive Hit-Targets & Camera Presets:** Every clickable organ, molecule atom, solid face, or apparatus zone exposes BOTH a raycast click target AND a keyboard-accessible button strip + camera presets (`Front`, `Cutaway`, `Top`, `Reset View`).
3. **Motion & Simulation Controls:** Explicit `Pause / Play`, `Speed (0.5× / 1×)` where animated, and automatic stop under `prefers-reduced-motion` or Katrio's `Reduce Motion` preference.
4. **Always Paired with Synchronized 2D + Text:** Inside every 3D viewer sits a clean `3D + 2D` | `2D Diagram` | `Text Guide` switch — never a broken fallback string!
5. **Lazy-Load & Mobile-First Hydration:** `React.lazy` splits Three.js completely out of the initial route chunk; on low-RAM / `prefer2DPathway` / WebGL-unavailable devices, the synchronized 2D interactive lab renders immediately with a 1-tap *"Load 3D View (~1.2 MB)"* button.
6. **Zero External CDN Runtime Calls:** Local `/draco/` WASM decoders (`MIT`) + local `/models/` + local `/textures/` ensure 100% static Cloudflare Pages reliability and offline readiness.
