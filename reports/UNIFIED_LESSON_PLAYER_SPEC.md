# Katrio — Unified Subsection Lesson Player Specification

## 1. Information Architecture & Route Hierarchy
- `Home (/)` → `Class 10 (/class-10)` → `Subject (/class-10/:subject)` → `(Social Science Strand /class-10/social_science/:strand)` → `Unit (/class-10/:subject/:unitId)` → `Subsection (/class-10/:subject/:unitId/:sectionId)`
- Persistent header search matches natural English & Tamil phrases (`"4.2 cold war"`, `"heart blood flow"`, `"quadratic graph"`, `"இலக்கணம்"`) and displays strand badges so `4.1` across History, Geography, Civics, and Economics are unmistakably distinct.

## 2. The 9-Stage Student-Facing Subsection Flow (Section D Contract)
Every full understanding-first subsection renders in a clean, uncrowded single vertical reading/interaction canvas (optional collapsible chapter TOC rail on desktop, single-column sticky nav on mobile, zero surrounding button clutter):

| Stage | Student-Facing Label | Purpose & Accessibility Rules |
| :---: | :--- | :--- |
| **0** | Orientation & Jump Links | Breadcrumb, friendly title (zero registry jargon!), editable estimate (`~4–6 min`), 1-sentence goal (`You will understand…`), quick **"Jump to textbook"** anchor, Focus Mode toggle, Save/Review-later buttons, collapsible **Source & editorial details** drawer. |
| **1** | **Understand simply** (ELI5 first) | 80–160 word respectful simple explanation, optional **தமிழ் விளக்கம்** toggle, clearly labelled **Analogy**, 1-sentence **Textbook-standard** summary, expandable **Simple → Detailed → Exam-ready** tabs, optional user-triggered **Listen** (Web Speech API, OFF by default, visible transcript). |
| **2** | **See the big picture** (Concept Map) | Responsive interactive SVG Concept Map (4–6 cause→event→effect / compare nodes), keyboard Tab/Enter navigation, **"Show connections"** highlight mode, semantic tree/list fallback, printable text toggle. |
| **3** | **Explore** (Primary 2D or 3D Interactive) | One focused, concept-relevant activity with investigation prompt, obvious primary control, reset/help, and "What to notice" note. Full 2D/keyboard equivalent for every 3D scene. |
| **4** | **Why did that happen?** (Step-by-step) | Small progressive reveal cards (`Cause → Mechanism → Evidence → Consequence`) separating verified facts from historical interpretations or scientific model assumptions. Skippable & reversible. |
| **5** | **Easy-to-remember links** | 2–5 precise timeline anchors, comparison pairs, or meaning-linked cues (never fabricated dates or misleading tricks). |
| **6** | **Try it yourself** (Low-stakes check) | Untimed conceptual challenge (sequence, match cause→effect, spot misconception, predict outcome) with calm *"Good observation — here is why"* feedback and unlimited retries. |
| **7** | **Practise for exams** (Optional Exam Bridge) | Clearly separated **Textbook Exercise References** vs **Original Practice** (MCQ, Assertion–Reason, Short/Long Answer outline). Never claims guaranteed exam questions. |
| **8** | **Read the book, chunk by chunk** | Anchored at `#textbook-reading` below the interactive lesson. Preserves exact textbook order (`(a)`, `(b)`, ...) and printed/PDF page numbers; displays rights-safe original summaries, clickable bilingual glossary terms, *"Explain this chunk"* & *"What did I just read?"* optional checks, plus official TNSCERT link. |
| **9** | **Finish & next** | 1–3 sentence takeaway, *"Can you explain it in your own words?"* self-check, genuine completion state (triggered by active engagement or explicit learner toggle — never merely visiting!), local **"Review later"** flag, Prev/Next verified subsection navigation. |

## 3. No-Login Local Progress Model (`src/features/local-progress/`)
- Stored strictly in `window.localStorage` (`katrio_class10_local_progress_v1`) with JSON backup export/import.
- Zero accounts, zero analytics beacons, zero behavioural/attention scoring, zero compulsory timers or punitive streaks.
- Distinguishes `Started` (visited), `Practised` (interacted/checked), `Completed` (genuine learning milestone or explicit learner check-off), and `Review later` (local spaced-revision bookmark).
