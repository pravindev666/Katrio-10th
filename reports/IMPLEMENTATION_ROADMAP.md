# KATRIO — PRIORITIZED IMPLEMENTATION ROADMAP (PHASE 8 DELIVERABLE 7)

**Principle:** Fix global UX clutter & broken text first, prove the gold-standard quality on a **small cross-subject Representative Pilot**, get real student/teacher validation, and only then scale chapter-by-chapter across all 694 routes.

---

## Wave 0 — Global Cleanup & Calm 4-Tab UX Foundation (Highest Immediate Impact)
1. **Purge all 366 stale `accessibility_fallback` strings** in `src/data/curriculum_registry_class10.json` using our audited `COMPLETE_2D_3D_DECISION_MATRIX.csv` (so `13.1.4 Body wall` never again shows *"Balanced chemical equation table..."*!).
2. **Remove redundant `2D & Text` buttons** from `EngineShell.tsx` and `SectionPlayerPage.tsx` on all Type A (2D) & Type D (Language) pages — keeping a clean `"2D / Text View"` toggle strictly inside genuine 3D viewers only.
3. **Switch `SectionPlayerPage.tsx` to the calm 4-Tab Workspace** (`1. Understand & Explore | 2. Mind Map & Memory | 3. Worked Example & Book | 4. Solve & Check`) and brighten `ChapterMindMapCard` from heavy dark slate to a clean light concept graph.
4. **Remove unnecessary legacy 3D canvases** from English Unit 1 (`EnglishStory3DCanvas`) and Tamil Unit 4 (`Tamil3DStageCanvas`).

## Wave 1 — Cross-Subject Representative Pilot (Verify "Easy to Remember" UX Live!)
Build and validate **1 iconic end-to-end showcase lesson per subject** before scaling:
- **Chemistry (`8.7 Metallurgy of Aluminium` + `8.11 Rusting` + `10.1 Reactions`):** Brand-new **bright interactive 2D Chemical Process Flowcharts with °C / V / O₂ / H₂O / Coating sliders** replacing the dark procedural 3D dome!
- **Biology (`13.1.4 Leech Body Wall` + `18.7 Sex Determination`):** Split bundled Unit 13 tabs so `13.1.4` shows a dedicated 5-layer Body Wall cross-section diagram; confirm `18.7` human `XX/XY` mastery flow.
- **Mathematics (`4.3 Thales` + `3.9 Matrices` + `8.2.5 Standard Deviation`):** Unify inside the calm 4-tab workspace with textbook solved examples + transfer problems.
- **English (`U1 His First Flight` 2D Illustrated Storyboard + `U1 Life` Poetic-Device Highlighter & Memoriter Cloze — Zero 3D!).**
- **Tamil (`இயல் 4 மொழிபெயர்ப்புக் கல்வி` + `இயல் 7 அலகிடுதல்` — Zero 3D, clean Tamil typography!).**
- **Social Science (`Geography 4.1 Minerals` + `History 6.4 Vellore Revolt`):** Subsection-focused accurate 2D NASA satellite maps with dedicated pins & timelines.

## Wave 2 — Core Science & Mathematics Full Chapter Pass
- **Science Chemistry Units 8, 9, 10, 11:** Complete 2D chemical process flowcharts with sliders for every metallurgy, solubility, reaction-type, rate, pH, and organic subsection.
- **Science Physics Units 1, 2, 3, 5, 6:** Replace remaining 3D Optics bench with crisp 2D principal-ray diagram; split Unit 1/3/5/6 subsections cleanly.
- **Science Biology Units 12, 13, 14, 15, 19, 20, 22:** Split remaining bundled views into dedicated subsection diagrams.
- **Maths Chapters 1, 2, 3, 5, 6, 8:** Replace remaining legacy `MathsChapter3DCanvas` views with crisp 2D interactive SVG workbenches.

## Wave 3 — Full Languages (All 7 English Units + All 7 Tamil இயல்கள்) & Social Science
- Author book-verified 2D storyboards, poetic-device highlighters, and memoriter recall trainers for English Units 2–7.
- Author book-verified Tamil செய்யுள், உரைநடை, and 7 distinct இலக்கணம் studios across all 7 இயல்கள் (flagged for qualified Tamil educator review).
- Tailor subsection-specific GPS pin focuses & cause-effect cards across History Units 2–3, 5–10 and Geography Units 2–7.

## Wave 4 — Multi-Device QA & Real Teacher/Student Sign-Off
- Test on Desktop, Tablet, Low-End Android (`360px` viewport), Keyboard-only navigation, Screen Reader, High-Contrast, and Reduced-Motion.
- Evaluate real Class 10 students against the **5 Acceptance Questions** (explain in own words + solve a brand-new problem).
- Complete legal review of TNSCERT textbook references & promote educator-verified lessons from `provisional` to `published`.
