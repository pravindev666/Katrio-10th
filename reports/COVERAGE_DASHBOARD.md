# Katrio — Honest Curriculum & Understanding Coverage Dashboard

**Snapshot Date:** 2026-11-22  
**Strict Honesty Rule:** Extraction, route creation, automated authoring, and human educator approval are **never** conflated.

---

## 1. Platform-Wide Multi-Tier Pipeline Totals (All 5 TNSCERT Class 10 Textbooks)

| Pipeline Stage | Count | Share / Scope | Honest Status |
| --- | ---: | --- | --- |
| **Official TNSCERT PDF Pages Audited** | **1,464** | 5 books (`Science 2024`, `Maths 2025`, `English 2024`, `Tamil 2025`, `Social Science 2025`) | 100% traversed & page-offset mapped (`reports/SOURCE_PAGE_CROSSWALK.csv`) |
| **Total Extracted Textbook Headings (All Granularities)** | **1,178** | Units + numbered + unnumbered + lettered headings | Audited in `reports/FULL_TEXTBOOK_COVERAGE.csv` |
| **Textbook Figures / Activities / Exercises Inventoried** | **1,372** | Across all 5 PDFs | Audited in `reports/FIGURE_AND_EXERCISE_INVENTORY.csv` |
| **Registered Canonical Chapter Units** | **72** | Science 23 · Maths 8 · English 7 · Tamil 7 · Social Science 27 | 100% parity with handover baseline |
| **Registered Section Routes in App** | **694** | 691 handover baseline IDs (100% preserved) + 3 PDF body-verified History Unit 4 extensions (`4.1`, `4.3`, `4.10`) | Zero duplicate or colliding routes |
| **TOC / PDF-Body Verified Section Headings** | **116** | 113 handover TOC-verified + 3 History Unit 4 body-verified | 578 auto-extracted candidates remain flagged in provenance metadata |
| **Medium-Selection Audited Routes (Gate 2 Matrix)** | **694** | **52** genuine 3D justified · **642** purpose-built 2D / interactive reading | Documented in `reports/3D_VS_2D_DECISION_MATRIX.csv` |
| **New 9-Stage Understanding-First Subsection Lessons (Gate 3)** | **10** | **Social Science History Unit 4 (`4.1`–`4.10`) — 10/10 complete** | Schema-validated, bespoke 2D interactives, rights-safe `#textbook-reading`, Tamil toggle |
| **Legacy 4-Tab Pilot Lesson Packages (`src/data/lesson_content/`)** | **85** | Spread across all 5 subjects (Science, Maths, English, Tamil, Social Science) | Functional legacy pilots preserved intact |
| **Human TN Teacher & Student Approved Chapters (Gate 4)** | **0** | Pending live educator + student walkthrough | Intentionally `0` until real human sign-off occurs |

---

## 2. Social Science Unit 4 Four-Strand Breakdown (Disambiguated)

| Strand & Unit ID | Official Textbook Title (2025 Edition) | Printed Pages (PDF) | Verified Subsections in PDF | Registered Routes Now | Understanding-First 9-Stage Status |
| --- | --- | --- | ---: | ---: | --- |
| **History Unit 4** (`social-history-04`) | *The World After World War II* | pp. 40–52 (PDF 46–58) | **10** (`4.1`–`4.10`) | **10 / 10** (`4.1`, `4.3`, `4.10` reconciled!) | **10 / 10 Complete (Gate 3 Pilot — Ready for Gate 4 Human Review)** |
| **Geography Unit 4** (`social-geography-04`) | *India – Resources and Industries* | pp. 171–185 (PDF 177–191) | **5** (`4.1`–`4.5`) | 3 / 5 (`4.2`, `4.3` missing) | Audited in Gate 1; queued for Gate 5 |
| **Civics Unit 4** (`social-civics-04`) | *India's Foreign Policy* | pp. 270–277 (PDF 276–283) | **6** (`4.1`–`4.6`) | 4 / 6 (`4.1`, `4.6` missing) | Audited in Gate 1; queued for Gate 5 |
| **Economics Unit 4** (`social-economics-04`) | *Government and Taxes* | pp. 319–327 (PDF 325–333) | **7** (`4.1`–`4.7`) | 5 / 7 (`4.2`, `4.4` missing) | Audited in Gate 1; queued for Gate 5 |

---

## 3. History Unit 4 (`4.1`–`4.10`) Subsection Completion Ledger

| # | Canonical Route | Printed pp. | Concept Map | Bespoke 2D Interactive | Rule A7 Context Note | Review Status |
| --- | --- | --- | --- | --- | --- | --- |
| `4.1` | `/class-10/social_science/social-history-04/social-history-04-4-1-chinese-revolution` | 40–42 | Yes (5 nodes) | 2D China Revolution Timeline & Route Explorer | Opium Wars dates (p. 41) | `pending_human_teacher_review` |
| `4.2` | `/class-10/social_science/social-history-04/social-history-04-auto-4-2-cold-war-rivalry` | 42–43 | Yes (5 nodes) | 2D US vs USSR Cold War Ideological Comparator | — | `pending_human_teacher_review` |
| `4.3` | `/class-10/social_science/social-history-04/social-history-04-4-3-formation-of-military-alliances` | 43–44 | Yes (5 nodes) | 2D NATO / SEATO / CENTO / Warsaw Pact Alliance Map | — | `pending_human_teacher_review` |
| `4.4` | `/class-10/social_science/social-history-04/social-history-04-auto-4-4-korean-war` | 44 | Yes (4 nodes) | 2D 38th Parallel Korean Peninsula Phase Map | — | `pending_human_teacher_review` |
| `4.5` | `/class-10/social_science/social-history-04/social-history-04-auto-4-5-non-aligned-movement` | 44–45 | Yes (5 nodes) | 2D Bandung (1955) → Belgrade (1961) Five-Founders Explorer | — | `pending_human_teacher_review` |
| `4.6` | `/class-10/social_science/social-history-04/social-history-04-auto-4-6-the-cuban-revolution` | 45 | Yes (5 nodes) | 2D Caribbean / Bay of Pigs / 1962 Missile Crisis Map | — | `pending_human_teacher_review` |
| `4.7` | `/class-10/social_science/social-history-04/social-history-04-auto-4-7-arab-israeli-war` | 45–46 | Yes (5 nodes) | 2D West Asia & Suez Canal Diplomacy Timeline (1947–1973) | 1949 Armistice date (p. 45) | `pending_human_teacher_review` |
| `4.8` | `/class-10/social_science/social-history-04/social-history-04-auto-4-8-vietnam-war` | 46–47 | Yes (5 nodes) | 2D 17th Parallel Geneva Accord to 1976 Unification Explorer | — | `pending_human_teacher_review` |
| `4.9` | `/class-10/social_science/social-history-04/social-history-04-auto-4-9-towards-european-union` | 47–48 | Yes (5 nodes) | 2D ECSC → EEC → SEA → Maastricht → Euro Integration Stepper | Post-Brexit 27 EU members (p. 48) | `pending_human_teacher_review` |
| `4.10` | `/class-10/social_science/social-history-04/social-history-04-4-10-fall-of-berlin-wall-and-end-of-cold-war-era` | 48–50 | Yes (5 nodes) | 2D Divided Berlin (1961–1989) & Soviet Reforms Explorer | — | `pending_human_teacher_review` |
