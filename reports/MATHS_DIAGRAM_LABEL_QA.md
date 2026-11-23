# Katrio — Mathematics Diagram & Label QA Report (Chapter 4 Geometry)

**Date:** 2026-11-23  
**Source Authority:** `Class_10_Mathematics_English_2025_Edition-www.tntextbooks.in.pdf` (pp. 161–200, PDF pp. 167–206).

---

## 1. Baseline Visual Defects Audited (Before Fix)

| Defect ID | Location | Observed Defect |
| --- | --- | --- |
| **MATH-01** | `MathsChapter3DCanvas.tsx:290–294` | Renders 5 white spheres for vertices `A, B, C, D, E` with **zero individual vertex labels**. Only a distant floating title mentions `AD/DB = AE/EC`. |
| **MATH-02** | `MathsInteractiveLabs.tsx:187` | Lists *"3. Tangent-Radius Theorem"* inside Section `4.3 Thales Theorem and Angle Bisector Theorem`, even though Tangents belong to Section `4.5 Circles and Tangents` (p. 188–193). |
| **MATH-03** | `TopicInteractiveLabs.tsx:1381, 1418` | Dispatches all 12 Chapter 4 routes (`4.1`–`4.6`) to the same Thales BPT scene. |
| **MATH-04** | `MathsChapter3DCanvas.tsx` | 3D perspective projection distorts true parallel lengths and angle measures on flat planar geometry proofs, violating mathematical clarity. |

---

## 2. Redesigned 2D Geometry QA Specifications (Implemented in Phase 3)

All five core Chapter 4 theorems now use crisp, high-contrast **2D SVG** canvases (`viewBox="0 0 560 320"`, responsive down to 360px width, zero horizontal overflow, WCAG AA contrast ≥ 4.5:1, and full keyboard + numeric input parity alongside sliders):

| Subsection Route(s) | Exact 2D Diagram & Permanent Labels | Mathematical Constraint Enforced | Textbook Examples & Proof Alignment |
| --- | --- | --- | --- |
| **4.2 Similarity** (`maths-04-02`, `4.2.1`, `4.2.2`) | Two side-by-side triangles $\triangle ABC$ and $\triangle PQR$ with permanent vertex labels `A, B, C, P, Q, R`, matching angle arcs ($\angle 1, \angle 2, \angle 3$), and live side lengths. | Strict proportional scaling $PQ = k \cdot AB$, $QR = k \cdot BC$, $RP = k \cdot CA$ ($k \in [0.5, 2.0]$); verifies $AB/PQ = BC/QR = CA/RP = 1/k$ and area ratio $= 1/k^2$. | pp. 162–165, Fig. 4.4–4.5, AA/SAS/SSS criteria. |
| **4.3 Thales Theorem (BPT)** (`maths-04-03`, `4.3.1`) | Triangle $\triangle ABC$ with non-overlapping pill-backed vertex labels **`A` (top), `B` (bottom-left), `C` (bottom-right), `D` (left of $AB$), `E` (right of $AC$)**, parallel chevrons on $DE \parallel BC$, and live segment lengths `AD`, `DB`, `AE`, `EC`. | $D = (1-t)A + tB$, $E = (1-t)A + tC$ ($t \in [0.20, 0.80]$); guarantees $DE \parallel BC$ and exact invariant $AD/DB = AE/EC = t/(1-t)$ with zero divide-by-zero edge cases. | Theorem 1 (p. 172, Fig. 4.29), Converse Theorem 2 (p. 174), Worked Example 4.12 ($x=4 \implies AB=6, AC=9$) & Example 4.13. |
| **4.3 Angle Bisector Theorem** (Dedicated toggle/tab inside `4.3` with full construction!) | Triangle $\triangle ABC$ with permanent labels **`A`, `B`, `C`, `D` (on $BC$)**, equal-angle arc markers ($\angle BAD = \angle CAD$), optional proof construction dashed line $CE \parallel AB$ meeting extended $AD$ at `E`! | Point $D$ computed analytically from vertex $A$'s exact internal bisector: $D = \frac{b \cdot B + c \cdot C}{b + c}$ where $b = AC, c = AB$, guaranteeing $BD/DC = AB/AC$ at every slider/numeric setting! | Theorem 3 (pp. 174–175, Fig. 4.33) & Converse Theorem 4 (pp. 175–176). |
| **4.4 Pythagoras Theorem** (`maths-04-04`) | Right triangle $\triangle ABC$ right-angled at `C` (`90°` square marker), legs `a = BC`, `b = AC`, hypotenuse `c = AB`, plus proportional visual area squares **$a^2$**, **$b^2$**, and **$c^2$** plus optional altitude $CD \perp AB$ similar-triangle proof overlay! | Strictly enforces $c = \sqrt{a^2 + b^2}$ and verifies $a^2 + b^2 = c^2$ (presets include Pythagorean triplets `3-4-5`, `5-12-13`, `6-8-10`, `8-15-17`). | Theorem 5 (pp. 184–185, Fig. 4.46, Baudhayana Theorem note), Example 4.20. |
| **4.5 Circles and Tangents** (`maths-04-05`, `4.5.1`) | Circle with center **`O`**, contact point **`P`**, tangent line **`XY`**, radius **`OP`** with **`90°` perpendicularity square**, plus external point **`T`** showing equal tangents **`TP = TQ`**! | Tangent angle always strictly orthogonal to radius vector $\vec{OP}$ ($\vec{OP} \cdot \vec{PX} = 0$); external tangent length computed via exact right triangle $TP = \sqrt{OT^2 - r^2}$. | pp. 188–193, Fig. 4.54–4.56, Example 4.24 ($OT=5, r=3 \implies PT=4\text{ cm}$). |
| **4.6 Concurrency Theorems** (`maths-04-06`) | Triangle $\triangle ABC$ with cevians $AD, BE, CF$ meeting at point **`O`** (Toggle: **Centroid / Medians** vs **Ceva's Theorem general cevians** with live product $\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB} = 1.00$!). | Enforces Ceva's concurrency invariant numerically and visually flags non-concurrent cevians when product $\neq 1$. | pp. 195–197, Fig. 4.71–4.73, Example 4.33 ($AB=13, AC=14, BC=15 \implies BD=12, DC=3$). |

---

## 3. Label Legibility & Mobile Safeguards
- Every vertex label uses a high-contrast rounded badge pill (`#0f172a` text on `#ffffff` stroke-ringed badge in light/dark themes) positioned **outward along the bisector/normal away from triangle edges** so labels NEVER overlap segments at any slider setting!
- Every interactive control includes **both** a touch-friendly slider (`min-h-[44px]`) AND preset/stepper buttons so drag-only interaction is never required.
- `MathsChapter3DCanvas.tsx` also receives crisp floating `A, B, C, D, E` sprites so legacy 3D previews never show unlabelled spheres.
