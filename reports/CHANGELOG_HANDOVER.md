# Katrio — 360° Transformation Changelog & Engineering Handover

**Date:** 2026-11-22  
**Milestone Completed:** Gate 0 (Edition/Source Audit), Gate 1 (Full 1,464-Page 5-Book Coverage & 4-Strand Unit 4 Audit), Gate 2 (694-Section 3D-vs-2D Decision Matrix), Gate 3 (End-to-End 9-Stage Pilot for **Social Science History Unit 4: `4.1`–`4.10`**, Header Jargon Cleanup, and Heart 3D Cutaway Overlap Fix).

---

## 1. Files Created

### Audit & Planning Reports (`reports/`)
1. `reports/SOURCE_PAGE_CROSSWALK.csv` — 1,464-row printed-page ↔ PDF-page crosswalk across all 5 local TNSCERT PDFs.
2. `reports/FULL_TEXTBOOK_COVERAGE.csv` & `reports/CURRICULUM_COMPLETENESS_AUDIT.csv` — 1,178 extracted textbook headings across all 5 books with matched route/status audit.
3. `reports/FIGURE_AND_EXERCISE_INVENTORY.csv` — 1,372 textbook activities, diagrams, glossaries, and end-of-unit exercise markers.
4. `reports/UNCERTAIN_HEADINGS_AND_MANUAL_REVIEW.csv` — 630 headings flagged for future human verification.
5. `reports/3D_VS_2D_DECISION_MATRIX.csv` — 694-row medium-selection matrix (all 15 Section C columns: 52 genuine 3D vs. 642 purpose-built 2D/reading).
6. `reports/AUDIT_FIRST_REPORT.md` — Edition audit, 2025–2026 TN SSLC learning-barrier summary, and Preserve / Fix / Replace matrix.
7. `reports/CURRICULUM_COMPLETENESS_AUDIT.md` — Subject-by-subject findings plus explicit disambiguation of all four Social Science Unit 4 chapters (`History 4`, `Geography 4`, `Civics 4`, `Economics 4`).
8. `reports/BROKEN_OR_DUPLICATE_ROUTE_AUDIT.md` — Route collision, canonical ID parity, and missing-subsection reconciliation audit.
9. `reports/COPYRIGHT_AND_ATTRIBUTION_DECISIONS.md` — TNSCERT textbook citation boundaries, zero commercial guide-book policy, and open-source asset provenance.
10. `reports/HISTORY_UNIT4_4_1_TO_4_10_PLAN.md` & `reports/CHAPTER4_HISTORY_INTERACTION_PLAN.md` — Subsection-by-subsection blueprint for History Unit 4 (`4.1`–`4.10`).
11. `reports/UNIFIED_LESSON_PLAYER_SPEC.md` — Formal specification of the 9-Stage Understanding-First Lesson Contract (Section D).
12. `reports/SUBJECT_INTERACTION_PLAYBOOK.md` — Least-complex effective medium design playbook across Science, Mathematics, English, Tamil, and Social Science.
13. `reports/ACCURACY_AND_CONTENT_RIGHTS_REVIEW.md` — Factual accuracy audit, Rule A7 context notes (`4.1`, `4.7`, `4.9`), and copyright compliance.
14. `reports/A11Y_UX_PERFORMANCE_QA.md` — WCAG 2.2 AA, CAST UDL 3.0, and zero-WebGL History Unit 4 performance report.
15. `reports/COVERAGE_DASHBOARD.md` — Honest multi-tier coverage metrics separating extracted headings, registered routes, audited drafts, and human-approved lessons.
16. `reports/CHANGELOG_HANDOVER.md` — This file.

### Application Code (`src/`)
- `src/types/subsectionLesson.ts` — Formal `SubsectionLessonPackage` schema + runtime `validateSubsectionLesson()` validator enforcing word counts, concept-map bounds (`3–7` nodes), causal steps, chunked textbook coverage, and honest review flags.
- `src/data/history_unit4_part1.ts` — Complete verified 9-stage packages for History Unit 4 subsections `4.1`–`4.5`.
- `src/data/history_unit4_part2.ts` — Complete verified 9-stage packages for History Unit 4 subsections `4.6`–`4.10`.
- `src/data/history_unit4_index.ts` — Lookup registry (`HISTORY_UNIT4_SUBSECTION_LESSONS`, `getSubsectionLessonById()`).
- `src/components/curriculum/SubsectionConceptMap.tsx` — Stage 2 accessible interactive SVG concept map with keyboard navigation, `"Show connections"`, text-list view, and print notes.
- `src/components/engines/HistoryUnit4Interactive2D.tsx` — Stage 3 bespoke 2D historical maps, alliance comparisons, and chronological explorers for all 10 subsections (`4.1`–`4.10`).
- `src/components/curriculum/UnifiedSubsectionPlayer.tsx` — Complete Stages 0–9 Understanding-First Lesson Player.

---

## 2. Files Modified (Non-Destructive)

- `src/data/curriculum_registry_class10.json` — Preserved **100% of all 691 canonical handover IDs** untouched; added the 3 missing PDF-verified History Unit 4 subsections (`4.1`, `4.3`, `4.10`) in exact canonical order (`4.1`–`4.10`) marked `body_verified_extension: true`. Registry total is now `694` (`116` TOC/body-verified + `578` auto-extracted candidates).
- `src/types/curriculum.ts` — Added `'pending_review'` to `ReviewStatus`, optional `body_verified_extension?: boolean` on `CurriculumSection`, and optional `body_verified_extensions?: number` on `audit_totals`.
- `src/components/engines/ModelExplorer3DCanvas.tsx` — Fixed the Heart 3D Cutaway visual Z-overlap by recessing `backShell` (`z = -0.22`, `opacity: 0.24`, `THREE.BackSide`) and refining cutaway slider thresholds.
- `src/utils/curriculumStore.ts` — Integrated `getSubsectionLessonById()` into `getStudentSectionStatus` / `getStudentUnitStatus`, cleaned `"Title under review"` to `"Book topic"`, and added the `social-history-04` curiosity question.
- `src/routes/UnitPage.tsx` — Kept all 10 History Unit 4 subsections (`4.1`–`4.10`) together in exact sequential order, prioritized unified lessons in `"Recommended next"`, and removed student-facing `"Heading in review"` / `"awaiting human educator sign-off"` jargon from student cards.
- `src/routes/SectionPlayerPage.tsx` — Mounted `<UnifiedSubsectionPlayer />` seamlessly for all 10 History Unit 4 routes (`4.1`–`4.10`), removed the student-facing `"Title awaiting editorial verification"` badge from the lesson header (retaining full provenance inside the collapsible drawer), and cleaned sidebar labels while leaving all 684 legacy routes and existing 3D/2D labs intact.
- `scripts/audit-curriculum.ts` — Preserves 100% baseline check that all `691` canonical handover IDs exist while validating explicitly marked `body_verified_extension: true` PDF additions (`694` total, `116` verified).
- `src/utils/curriculumStore.test.ts` — Updated registry totals and added automated contract validation tests for all 10 History Unit 4 packages + 4-strand Social Science Unit 4 route non-collision.
- `public/sitemap.xml` & `public/_redirects` — Regenerated via `npm run audit:links` to include all 694 section routes + 72 unit routes.

---

## 3. Preserved Working Capabilities

- All 691 canonical handover IDs and URLs remain unbroken.
- All 23 Science units, 8 Maths chapters, 7 English units, 7 Tamil இயல்கள், and 27 Social Science units remain navigable.
- All working Chemistry reaction beakers, Physics/Maths sliders & graphs, Heart 3D/2D cutaway (now visually cleaner!), NASA 4K Earth & India/TN terrain textures, and all 13 open-source `.glb` models remain intact.

---

## 4. Next Recommended Rollout Recipe (Gates 4 → 5)

1. **Gate 4 (Human Review):** Conduct live review of History Unit 4 (`4.1`–`4.10`) with a TN Class 10 History teacher and 3–5 students before flipping `editorialReviewStatus` to `teacher_approved`.
2. **Gate 5 (Remaining Social Science Unit 4 Chapters):** Using the exact same `SubsectionLessonPackage` contract + `body_verified_extension: true` registry reconciliation:
   - Reconcile **Geography Unit 4** (`4.2 Energy Resources`, `4.3 Industries`) → build bespoke 2D India mineral/industrial SVG layers.
   - Reconcile **Civics Unit 4** (`4.1`, `4.6`) → build India Foreign Policy & Panchsheel/NAM/SAARC interactive diagrams.
   - Reconcile **Economics Unit 4** (`4.2`, `4.4`) → build interactive Tamil Nadu/India tax-incidence & direct/indirect tax calculators.
3. **Gate 6 (Cross-Subject Expansion):** Replace generic placeholder demos across Science (`5.2 Reflection of Sound`, `13.1.9 Nervous System`, `4.6.1 Electrical Resistivity`), Maths, English, and Tamil following `reports/3D_VS_2D_DECISION_MATRIX.csv`.
