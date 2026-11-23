# Katrio — Teacher, Student & Low-End Device Test Plan (Gate 4 / Gate 9)

**Date:** 2026-11-23  
**Target Audience:** Tamil Nadu State Board Class 10 students (ages 14–16), Science & Mathematics teachers, and low-end Android devices (360×800 viewport, 3G/offline cache, keyboard/screen-reader users).

---

## 1. Automated Verification Suite (Executed in CI / `npm test`)

1. **Exact-Section Manifest & Zero Prefix-Leakage Checks:**
   - Assert `science-04-auto-4-3-1-electric-potential` resolves to `ElectricPotentialLab2D` (NOT `ElectricityCircuitLab`).
   - Assert `science-04-auto-4-8-1-joule-s-law-of-heating` resolves to `JoulesLawLab2D` (NOT `ElectricityCircuitLab` or `ElectricPotentialLab2D`).
   - Assert `science-16-auto-16-1-5-ethylene` resolves to `EthyleneRipeningLab2D` (NOT `NeuronHormone3DLab`).
   - Assert `science-16-auto-16-2-1-pituitary-gland` resolves to `PituitaryEndocrineLab2D` (NOT `NeuronHormone3DLab`).
   - Assert `maths-04-02`, `maths-04-03`, `maths-04-04`, `maths-04-05`, `maths-04-06` each resolve to **distinct** geometric variants (Similarity, Thales+Angle Bisector, Pythagoras, Circles & Tangents, Concurrency).
   - Assert `science-17-auto-17-8-1-structure-of-human` and `science-17-auto-17-8-2-structure-of-human-ovum` resolve to calm 2D medical SVG diagrams, while `science-17-auto-17-9-menstrual-cycle-process` does NOT render a sperm/ovum model.
2. **Deterministic Physics, Chemistry & Mathematics Calculations:**
   - Electric potential: $V = W/Q$ (e.g., $100\text{ J} / 10\text{ C} = 10\text{ V}$; equal work $24\text{ J}$ on $2\text{ C}$ vs $4\text{ C}$ yields $12\text{ V}$ vs $6\text{ V}$).
   - Joule's law: $H = I^2 R t$ (matches TN Science Solved Problem 6: $I=6\text{ A}, R=5\,\Omega, t=300\text{ s} \implies H=54{,}000\text{ J}$); verify doubling $I$ while fixing $R, t$ multiplies $H$ by exactly `4.0`.
   - Solubility states: verify $20\text{ g} < 36\text{ g}$ = `Unsaturated`; $36\text{ g}$ = `Saturated`; $45\text{ g}$ at $25\,^\circ\text{C}$ without heating = `Saturated with undissolved excess` (NEVER `Supersaturated`!); $45\text{ g}$ dissolved at $60\,^\circ\text{C}$ and calmly cooled to $25\,^\circ\text{C}$ = `Supersaturated (metastable)`.
   - Geometry invariants: Thales $AD/DB = AE/EC$ exact equality across $[0.2, 0.8]$; Angle Bisector $BD/DC = AB/AC$ exact equality; Pythagoras $a^2 + b^2 = c^2$; Circle tangent $PT = \sqrt{OT^2 - r^2}$ (Example 4.24: $OT=5, r=3 \implies PT=4$); Ceva's product $= 1$.
3. **Mastery State Machine Integrity:**
   - Verify visiting → `started` (`visited`), moving a slider or clicking a model → `explored` (NEVER `completed`!), attempting practice → `practised`, and passing a validated transfer check → `completed` (`understood_checkpoint`).

---

## 2. Human Student Comprehension Scenarios (3–5 Class 10 Students, Think-Aloud Protocol)

| Scenario | Route | Student Task (No Coaching) | Success Criterion |
| --- | --- | --- | --- |
| **S1** | Electric Potential (`4.3.1`) | Move test charge between A and B; compare $24\text{ J}$ moving $2\text{ C}$ vs $4\text{ C}$. | Student explains in their own words why electric potential is *work per unit charge* ($V = W/Q$), not total work. |
| **S2** | Joule's Law (`4.8.1`) | Predict what happens when current doubles from $2\text{ A}$ to $4\text{ A}$ with $R=5\,\Omega, t=10\text{ s}$, then test. | Student predicts `4×` heat (not `2×`) and cites $I^2$ in $H = I^2 R t$. |
| **S3** | Ethylene (`16.1.5`) | Compare Bag A (tomatoes alone) vs Bag B (tomatoes + ripe banana) across 5 days. | Student explains ethylene is a gaseous plant hormone released by ripening fruit and names 2 other textbook effects. |
| **S4** | Pituitary (`16.2.1`) | Click Anterior vs Posterior lobes and trace TSH, GH, and ADH to target organs. | Student accurately distinguishes Anterior vs Posterior hormones and explains blood-borne chemical signalling vs nerves. |
| **S5** | Geometry (`4.3` & `4.5`) | Identify `A, B, C, D, E` on Thales, switch to Angle Bisector ray `AD`, then inspect `4.5` radius $OP \perp$ tangent. | Student reads all labels effortlessly without zooming, verifies $AD/DB = AE/EC$, and solves a fresh numerical ratio. |
| **S6** | Reproduction (`17.8.1` & `17.8.2`) | Inspect the calm 2D Sperm and Ovum diagrams and match acrosome, middle piece, corona radiata, zona pellucida. | Student reports clear, comfortable, textbook-appropriate presentation with zero confusion or discomfort. |

---

## 3. Accessibility & Low-End Mobile Checklist (360×800px + Keyboard + Screen Reader)
- **Viewport 360px:** Zero horizontal scrollbars; all SVG labels legible; all buttons/inputs ≥ `44×44 px` touch targets.
- **200% Browser Zoom:** No overlapping text or clipped controls.
- **Keyboard-only (`Tab`, `Enter`, `Space`, Arrow keys):** Every stage jump pill, mind-map node, interactive slider/stepper, hormone button, and challenge option reachable with visible focus outline.
- **Reduced Motion & Dark/High-Contrast Mode:** All animations pause; SVG strokes/text remain high-contrast in Light, Dark, and High-Contrast themes.
- **Screen Reader (NVDA / TalkBack):** Every 2D SVG diagram includes `<title>`, `<desc>`, `role="img"`, and a collapsible plain-text equivalent summary.
