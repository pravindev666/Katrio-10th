# KATRIO — PREMIUM STUDENT LESSON UX SPECIFICATION (PHASE 4, 5 & PHASE 8 DELIVERABLE 5)

**Goal:** Eliminate scroll fatigue, visual noise, and redundant buttons (`2D & Text` on 2D pages) so any Class 10 student opens a topic, grasps it in 60 seconds, practices calmly, and remembers it naturally.

---

## 1. Core UX Principles (UDL 3.0 & Attention-Friendly Design)
- **One primary focus at a time:** Replace 10 vertically stacked boxes with a clean **4-Tab Study Workspace** (plus optional "View All" scroll mode for students who prefer continuous scrolling).
- **Zero redundant chrome:** Remove top-level `Interactive Lab | 2D & Text` buttons from all Type A (2D) & Type D (Language) pages. Show a single calm `"2D / Text View"` switch *inside* genuine 3D viewers only (`Heart`, `Brain`, `Molecules`, `Plant Block`, `Maths Ch. 7 Solids`).
- **Light, calm visual surface:** Bright daylight-friendly SVG flowcharts, labelled diagrams, and mind maps (no dark neon slabs unless inside an optical/astronomy canvas).
- **Zero pressure:** No compulsory timers, no manipulative streaks, unlimited retries with hints, honest `Started → Explored → Practised → Understood ✓` progress badges.
- **Readable typography:** `16–18px` body text, `Noto Sans Tamil` with `1.75` line-height for Tamil, full keyboard + touch parity (`≥ 44px` tap targets), Pause/Replay/Reset controls on all animations, Reduced-Motion & Focus modes.

---

## 2. The 4-Tab Non-Linear Workspace (Mapping All 11 Pedagogical Stages Cleanly)

| Tab (1 Click — Any Order) | Pedagogical Stages Included | What the Student Sees |
| :--- | :--- | :--- |
| **1. Understand & Explore** *(Default)* | Curiosity Hook · Plain ELI5 + Detailed + `தமிழ் உதவி` · Predict First · Primary 2D Flowchart / Accurate Map / Interactive Lab / Language Studio | Top 2-line Spark hook + 1 clean, full-width visual interactive with sliders/buttons + side-by-side plain explanation & Why It Works steps. |
| **2. Mind Map & Memory** | Expandable Light 2D Concept Graph · 1 Memory Trick · Graphical Flip Flashcards · Verified Fun Fact | Clean light-mode radial/tree concept map (tap any branch to expand) + flip cards + 1 short verified *"Did You Know?"* card. |
| **3. Worked Example & Book** | Textbook Solved Example · Common Mistakes · Chunked Textbook Reading Anchor & Inline Glossary | Step-by-step solved problem + side-by-side glossary tap-cards + exact `Book p. X / PDF p. Y` citation & official TNSCERT link. |
| **4. Solve & Check** | Guided Question · Independent Transfer Problem · Self-Explain Scratchpad · Next Topic Action | 3 untimed questions with optional hints. Solving all unlocks **`Understood ✓`** on device + clear **Next Subsection →** button. |

*(For **English** and **Tamil**, tabs automatically relabel cleanly to language-native names: e.g., `1. Story / Poem Studio`, `2. Mind Map & Vocabulary`, `3. Literary Craft / இலக்கணம்`, `4. Practice Check`.)*

---

## 3. Responsive Breakpoints (Desktop · Tablet · Mobile)

- **Desktop (`≥ 1280px`):** Max width `1240px`; collapsible left Chapter Outline drawer (collapsed by default so the visual owns full width); inside Tab 1, **7-col interactive visual left / 5-col explanation & controls right**; single compact header bar (`48px` height).
- **Tablet (`768px–1279px`):** Single-row 4-tab switcher (`44px` touch height); visual stacked cleanly above compact 2-column control cards; slide-over Chapter Topics drawer.
- **Mobile / Low-End Android (`< 768px`):** 2×2 pill tab bar at top; responsive SVG `viewBox` diagrams (`100%` width, zero horizontal page overflow); large thumb-friendly sliders & buttons (`≥ 48px` hit area); zero mandatory WebGL (instant load on 2 GB RAM devices).
