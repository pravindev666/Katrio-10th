# Katrio — Scientific & Mathematical Accuracy Issues Audit

**Date:** 2026-11-23  
**Primary Authority:** Local TNSCERT Class 10 Science (2024 Reprint) & Mathematics (2025 Revised) PDFs verified directly from `10th-Books/`.

---

## 1. Confirmed Scientific Error — Science Unit 9 Solubility (`TopicInteractiveLabs.tsx:987–998`)

- **Defect:** In `SolubilityMixerLab`, when `spoons > maxDissolved` at a constant temperature (`25 °C`), the status bar displays:
  > `"Supersaturated — 3D Crystals Precipitating!"`
- **Why This Is Scientifically Incorrect:**
  - Directly verified against **TN Class 10 Science 2024, printed pp. 126–127 (PDF pp. 134–135), Sections 9.3.3 & 9.4**:
    - Adding extra solute beyond the saturation limit (e.g., >36 g NaCl in 100 g water at 25 °C) at constant temperature **does NOT create a supersaturated solution**. The solution remains **saturated** at equilibrium, and the excess solid simply **settles undissolved at the bottom**.
    - A **supersaturated solution** contains *more dissolved solute* than a normal saturated solution at that temperature. It is achieved by **altering conditions** (typically heating the solvent to dissolve extra solute, then carefully cooling it without disturbance). It is **metastable/unstable** — disturbing it or dropping a seed crystal triggers rapid crystallization back down to the saturation limit.
- **Required Fix (Implemented in Phase 2/3):**
  - Replace the 3-state spoon check with an explicit, chemically accurate 4-state model:
    1. **Unsaturated** (`dissolved < solubility(T)` and `undissolved = 0`)
    2. **Saturated** (`dissolved === solubility(T)` and `undissolved = 0`)
    3. **Saturated + Undissolved Excess Solid** (`added > solubility(T)` at constant $T$ — clearly explains this is **NOT** supersaturated!)
    4. **True Supersaturated (Metastable)** — achieved ONLY when the learner heats the solution to dissolve excess solute AND cools it gently without disturbance; includes a **"Drop Seed Crystal / Disturb"** button that visibly precipitates the metastable excess back to a saturated solution!

---

## 2. Confirmed Physics Misalignments — Science Unit 4 Electricity

1. **`4.3.1 Electric Potential` (TN Science p. 44, Fig. 4.3, Solved Problem 2 p. 44–45):**
   - *Before:* Rendered a Series/Parallel glowing bulb circuit (`ElectricityCircuitLab`) with no test charge, no reference infinity/zero point, and no $V = W/Q$ formula.
   - *Fix:* Build dedicated 2D Electric Potential Sandbox showing $V = W/Q$ (1 V = 1 J/C), reference point, points $A$ and $B$, potential difference $V_{AB} = V_A - V_B$ (or $V_B - V_A$), clear distinction between potential at a point vs potential difference, and explicit statement of schematic analogy limits.
2. **`4.8.1 Joule's Law of Heating` (TN Science pp. 50–51, Eq. 4.19–4.20, Solved Problem 6: $R = 5\,\Omega, I = 6\text{ A}, t = 300\text{ s} \implies H = 54{,}000\text{ J}$):**
   - *Before:* Rendered the same Series/Parallel bulb circuit with no time $t$, no $H = I^2 R t$, and no quadratic demonstration.
   - *Fix:* Build dedicated 2D Nichrome Resistor Heating Lab + parabolic $H$ vs $I$ graph, lock-$R$-and-$t$ **Double Current ($I \to 2I \implies H \to 4H$)** comparison mode, explicit $\Delta T = H/(mc)$ assumption note (fixed mass/specific heat, zero heat loss), and mains-electricity safety warning.

---

## 3. Confirmed Biology Misalignments — Science Units 16 & 17

1. **`16.1.5 Ethylene` (TN Science p. 232, Fig. 16.6 + Brown Paper Bag Activity):**
   - *Before:* Rendered a 3D human neuron & brain!
   - *Fix:* Build controlled 2D Tomato-only vs Tomato + Ripe Banana paper-bag conceptual comparison (explicitly labelled as conceptual textbook illustration, not empirically measured reaction kinetics) + all 5 textbook physiological effects of ethylene.
2. **`16.2.1 Pituitary Gland` (TN Science pp. 233–234, Fig. 16.7):**
   - *Before:* Rendered a 3D human neuron & brain!
   - *Fix:* Build interactive 2D Endocrine System Body Map + Hypothalamus → Anterior Lobe (Adenohypophysis: `GH`, `TSH`, `ACTH`, `FSH`, `LH`, `PRL`) vs Posterior Lobe (Neurohypophysis: `ADH/Vasopressin`, `Oxytocin`) → Target Organs & textbook disorders (`Dwarfism`, `Gigantism`, `Acromegaly`, `Diabetes insipidus`), explicitly noting the intermediate lobe is non-existent in humans (p. 233).
3. **`17.8.1 Structure of Human Sperm` & `17.8.2 Structure of Human Ovum` (TN Science p. 250, Fig. 17.15 & Fig. 17.16):**
   - *Before:* Procedural glowing spheres with pulsing tail reused across all 17 Unit 17 subsections.
   - *Fix:* Calm, neutral-palette, textbook-labelled 2D medical SVG diagrams matching exact Figure 17.15 (`Head`, `Acrosome`, `Nucleus`, `Neck / Centrioles`, `Middle piece`, `Mitochondria`, `Tail`) and Figure 17.16 (`Corona radiata follicle cells`, `Zona pellucida`, `Perivitelline space`, `Vitelline membrane`, `Cytoplasm`, `Nucleus`), with scale context note (`Sperm head ~5 µm, total ~50–60 µm; Ovum ~100–120 µm diameter`).

---

## 4. Confirmed Mathematics Defects — Maths Chapter 4 Geometry

1. **`MathsChapter3DCanvas.tsx:290–294`:** Missing individual `A`, `B`, `C`, `D`, `E` vertex labels on the Thales triangle.
2. **`MathsInteractiveLabs.tsx:184–188`:** Misplaced **Tangent–Radius Theorem** (`4.5`, p. 189) inside `4.3 Thales Theorem and Angle Bisector Theorem` (pp. 171–178).
3. **Theorem conflation across Chapter 4:** `4.2 Similarity`, `4.3 Thales + Angle Bisector`, `4.4 Pythagoras`, `4.5 Circles & Tangents`, and `4.6 Concurrency (Ceva's & Menelaus's Theorem)` require separate, mathematically constrained 2D constructions and proof steps.
