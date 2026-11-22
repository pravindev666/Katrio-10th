export interface MindMapBranch {
  title: string;
  color: string;
  summary: string;
  examCue: string;
}

export interface ChapterMindMapSpec {
  centralNode: string;
  mnemonic: string;
  formulaOrKeyFact: string;
  branches: MindMapBranch[];
}

/**
 * Universal Chapter Mind Map & Memory Tricks database covering ALL 72 Tamil Nadu Class 10 chapters
 * (Science 1-23, Maths 1-8, History 1-10, Geography 1-7, Civics 1-5, Economics 1-5, English 1-7, Tamil 1-7).
 */
export const CHAPTER_MIND_MAPS: Record<string, ChapterMindMapSpec> = {
  // ═══ MATHEMATICS (8 CHAPTERS) ═══
  'maths-01': {
    centralNode: 'Relations & Functions',
    mnemonic: 'Every X has ONE Arrow (Function) · Distinct Ys = One-to-One · All Ys Hit = Onto · Both = Bijection!',
    formulaOrKeyFact: 'n(A × B) = n(A)·n(B)  |  (f ∘ g)(x) = f(g(x))',
    branches: [
      { title: 'Cartesian Product', color: '#6366f1', summary: 'Ordered pairs A × B = {(a,b) | a∈A, b∈B}.', examCue: 'A×B ≠ B×A unless A = B or empty.' },
      { title: 'Types of Functions', color: '#0ea5e9', summary: 'One-to-One (injective), Many-to-One, Onto (surjective), Bijective.', examCue: 'Horizontal Line Test checks One-to-One.' },
      { title: '4 Representations', color: '#10b981', summary: 'Ordered pairs, Table, Arrow diagram, and Graph.', examCue: 'Vertical Line Test checks if a graph is a function.' },
      { title: 'Composition f ∘ g', color: '#f59e0b', summary: 'Feed g(x) directly inside f(·); generally f ∘ g ≠ g ∘ f.', examCue: 'Associative: f∘(g∘h) = (f∘g)∘h.' },
    ],
  },
  'maths-02': {
    centralNode: 'Numbers & Sequences',
    mnemonic: 'Euclid "a = bq + r" · AP Adds d · GP Multiplies r · Clock Modulo keeps Remainder!',
    formulaOrKeyFact: 'AP: tₙ = a + (n−1)d  |  GP: tₙ = arⁿ⁻¹  |  a ≡ b (mod m)',
    branches: [
      { title: 'Euclid & HCF', color: '#6366f1', summary: 'a = bq + r (0 ≤ r < b); Fundamental Theorem of Arithmetic = unique prime factors.', examCue: 'Repeatedly divide divisor by remainder until r = 0.' },
      { title: 'Modular Arithmetic', color: '#0ea5e9', summary: 'a ≡ b (mod m) means m divides (a − b) cleanly.', examCue: 'Clock math uses mod 12; weekday math uses mod 7.' },
      { title: 'AP & GP Terms', color: '#10b981', summary: 'AP grows by constant difference d; GP grows by constant ratio r.', examCue: 'S∞ = a / (1 − r) when |r| < 1.' },
      { title: 'Special Series', color: '#f59e0b', summary: 'Σn = n(n+1)/2; Σn² = n(n+1)(2n+1)/6; Σn³ = [n(n+1)/2]².', examCue: 'Cube sum is literally the square of natural sum!' },
    ],
  },
  'maths-03': {
    centralNode: 'Algebra & Matrices',
    mnemonic: 'Discriminant Δ = b² − 4ac decides Roots: + (2 Real), 0 (Equal), − (None)!',
    formulaOrKeyFact: 'x = (−b ± √Δ)/2a  |  α+β = −b/a, αβ = c/a',
    branches: [
      { title: '3-Variable Linear', color: '#6366f1', summary: 'Eliminate one variable pairwise to reduce 3 equations to 2.', examCue: 'Check 0=0 (infinite solutions) vs 0=k (no solution).' },
      { title: 'GCD, LCM & Sqrt', color: '#0ea5e9', summary: 'f(x)·g(x) = GCD × LCM; polynomial square root via long division.', examCue: 'Always put |...| modulus sign on square roots.' },
      { title: 'Quadratic & Graphs', color: '#10b981', summary: 'Roots from formula or parabola x-axis intersections.', examCue: 'Nature of roots depends purely on Δ = b² − 4ac.' },
      { title: 'Matrices', color: '#f59e0b', summary: 'Row × Column multiplication (Aₘₓₙ × Bₙₓₚ = Cₘₓₚ); AB ≠ BA.', examCue: '(AB)ᵀ = BᵀAᵀ (Reversal Law of Transpose!).' },
    ],
  },
  'maths-04': {
    centralNode: 'Geometry & Theorems',
    mnemonic: 'TAP-C: Thales (Parallel Ratio) · Angle Bisector · Pythagoras (a²+b²=c²) · Circle Tangents Equal!',
    formulaOrKeyFact: 'AD/DB = AE/EC  |  PA = PB (Tangents)  |  AC² = AB² + BC²',
    branches: [
      { title: 'Similar Triangles', color: '#6366f1', summary: 'AA, SAS, SSS similarity; Ratio of areas = Square of side ratio.', examCue: 'Corresponding sides stay proportional.' },
      { title: 'Thales (BPT)', color: '#0ea5e9', summary: 'Line parallel to one triangle side splits other two proportionally.', examCue: 'Crucial 8-mark proof theorem!' },
      { title: 'Angle Bisector & Ceva', color: '#10b981', summary: 'Internal bisector splits opposite side in ratio of adjacent sides.', examCue: 'Remember Pythagoras & Alternate Segment Theorem too.' },
      { title: 'Circle Tangents', color: '#f59e0b', summary: 'Radius ⊥ Tangent (90°); two tangents from external point are equal.', examCue: 'Practice 8-mark compass constructions cleanly.' },
    ],
  },
  'maths-05': {
    centralNode: 'Coordinate Geometry',
    mnemonic: 'Shoelace Area (counter-clockwise!) · Parallel = Same Slope · Perpendicular = Product −1!',
    formulaOrKeyFact: 'm = (y₂−y₁)/(x₂−x₁) = tan θ  |  y − y₁ = m(x − x₁)',
    branches: [
      { title: 'Triangle & Quad Area', color: '#6366f1', summary: '½|(x₁y₂+x₂y₃+x₃y₁) − (y₁x₂+y₂x₃+y₃x₁)|; Area = 0 means Collinear!', examCue: 'Plot rough sketch to list vertices anti-clockwise.' },
      { title: 'Slope (Gradient)', color: '#0ea5e9', summary: 'm = tan θ = rise/run = −a/b for ax + by + c = 0.', examCue: 'm₁ = m₂ (∥) and m₁·m₂ = −1 (⊥).' },
      { title: 'Line Equations', color: '#10b981', summary: 'Slope-intercept y=mx+c, Point-slope, Two-point, Intercept x/a+y/b=1.', examCue: 'X-axis is y=0; Y-axis is x=0.' },
      { title: 'Parallel & Perp Form', color: '#f59e0b', summary: 'Parallel to ax+by+c=0 is ax+by+k=0; Perp is bx−ay+k=0.', examCue: 'Swap a & b and flip middle sign for perpendicular!' },
    ],
  },
  'maths-06': {
    centralNode: 'Trigonometry',
    mnemonic: 'SOH-CAH-TOA · 3 Identities: sin²+cos²=1, 1+tan²=sec², 1+cot²=cosec²!',
    formulaOrKeyFact: 'tan 30° = 1/√3  |  tan 45° = 1  |  tan 60° = √3',
    branches: [
      { title: '3 Core Identities', color: '#6366f1', summary: 'sin²θ+cos²θ=1; sec²θ−tan²θ=1; cosec²θ−cot²θ=1.', examCue: 'Convert everything into sin & cos when stuck.' },
      { title: 'Standard Angles', color: '#0ea5e9', summary: '0°, 30°, 45°, 60°, 90° exact surd values (√3 ≈ 1.732).', examCue: 'Double-check whether problem asks for √3 decimal.' },
      { title: 'Angle of Elevation', color: '#10b981', summary: 'Looking UP from horizontal eye line to tower/building top.', examCue: 'Always add observer height h₀ if stated!' },
      { title: 'Angle of Depression', color: '#f59e0b', summary: 'Looking DOWN from cliff/lighthouse; equals alternate interior angle.', examCue: 'Draw horizontal top ray first before angle θ.' },
    ],
  },
  'maths-07': {
    centralNode: 'Mensuration (3D Solids)',
    mnemonic: 'Cone = ⅓ Cylinder · Hemisphere = ½ Sphere · Melting Conserves TOTAL VOLUME!',
    formulaOrKeyFact: 'CSA Cone = πrl  |  V Sphere = (4/3)πr³  |  l = √(r²+h²)',
    branches: [
      { title: 'Cylinder & Cone', color: '#6366f1', summary: 'Cylinder V=πr²h; Cone V=⅓πr²h, CSA=πrl.', examCue: 'Slant height l = √(r²+h²); check radius vs diameter!' },
      { title: 'Sphere & Hemisphere', color: '#0ea5e9', summary: 'Sphere SA=4πr², V=4/3πr³; Solid Hemisphere TSA=3πr².', examCue: 'Hollow vs solid hemisphere: 2πr² vs 3πr².' },
      { title: 'Frustum of Cone', color: '#10b981', summary: 'Bucket shape: V = ⅓πh(R²+Rr+r²); CSA = π(R+r)l.', examCue: 'l = √(h² + (R−r)²).' },
      { title: 'Combined & Melted', color: '#f59e0b', summary: 'Combined SA = ONLY visible outer faces; Recasting preserves Volume.', examCue: 'Cancel π on both sides before multiplying!' },
    ],
  },
  'maths-08': {
    centralNode: 'Statistics & Probability',
    mnemonic: 'CV = (σ / x̄) × 100% (Lower CV = More Consistent!) · 0 ≤ P(E) ≤ 1 Always!',
    formulaOrKeyFact: 'σ = √(Σd²/n)  |  P(A∪B) = P(A) + P(B) − P(A∩B)',
    branches: [
      { title: 'Range & Coeff.', color: '#6366f1', summary: 'Range = L − S; Coefficient of Range = (L−S)/(L+S).', examCue: 'Quickest measure of spread.' },
      { title: 'Standard Deviation σ', color: '#0ea5e9', summary: 'Variance = σ²; adding/subtracting k does NOT change σ!', examCue: 'Multiplying data by k multiplies σ by |k|.' },
      { title: 'Sample Space S', color: '#10b981', summary: '2 coins=4, 3 coins=8, 2 dice=36, playing deck=52 cards.', examCue: 'P(not E) = 1 − P(E).' },
      { title: 'Addition Theorem', color: '#f59e0b', summary: 'P(A∪B) = P(A)+P(B)−P(A∩B); Mutually exclusive ⇒ P(A∩B)=0.', examCue: 'Watch keywords: "at least", "at most", "or", "neither".' },
    ],
  },

  // ═══ SCIENCE (23 CHAPTERS) ═══
  'science-01': {
    centralNode: 'Laws of Motion',
    mnemonic: '1st = Inertia (Stubborn) · 2nd = F=ma · 3rd = Equal & Opposite · Rocket = Conservation of Momentum!',
    formulaOrKeyFact: 'F = ma  |  p = mv  |  F = Gm₁m₂/R²  |  g = GM/R²',
    branches: [
      { title: 'Inertia & Torque', color: '#0ea5e9', summary: 'Rest, Motion & Direction inertia; Torque τ = F × d (N·m).', examCue: 'Principle of Moments: Clockwise = Anticlockwise.' },
      { title: 'Newton’s 3 Laws', color: '#10b981', summary: 'Impulse J = F×t = Δp; Rocket propulsion uses 3rd Law + momentum.', examCue: 'SI unit of force = Newton (kg·m/s²).' },
      { title: 'Universal Gravitation', color: '#6366f1', summary: 'G = 6.674×10⁻¹¹ N·m²/kg²; g = 9.8 m/s² (max at poles, 0 at center).', examCue: 'Mass is constant everywhere; Weight W = mg changes!' },
      { title: 'Apparent Weight', color: '#f59e0b', summary: 'Lift moving up: R=m(g+a); Down: R=m(g−a); Freefall: R=0.', examCue: 'Astronauts float in freefall, not zero gravity.' },
    ],
  },
  'science-02': {
    centralNode: 'Optics & Human Eye',
    mnemonic: 'M-C (Myopia → Concave) · H-V (Hypermetropia → Convex) · Sky Blue = Rayleigh 1/λ⁴!',
    formulaOrKeyFact: '1/f = 1/v − 1/u  |  P = 1/f (Dioptre)  |  sin i / sin r = μ₂/μ₁',
    branches: [
      { title: 'Refraction & Dispersion', color: '#0ea5e9', summary: 'Snell’s Law; White light splits into VIBGYOR (Violet bends most).', examCue: 'Rayleigh scattering ∝ 1/λ⁴ makes sky blue & sunrise red.' },
      { title: 'Convex & Concave Lenses', color: '#10b981', summary: 'Convex converges (real/inverted except within F); Concave diverges (always virtual/erect).', examCue: 'Cartesian sign: u is always negative!' },
      { title: 'Human Eye Defects', color: '#6366f1', summary: 'Myopia (short sight → Concave), Hypermetropia (long → Convex), Presbyopia (Bifocal).', examCue: 'Astigmatism corrected with Cylindrical lens.' },
      { title: 'Microscope & Telescope', color: '#f59e0b', summary: 'Simple/Compound microscopes magnify tiny objects; Telescopes view distant stars.', examCue: 'Power P = 1/f(m), unit = Dioptre (D).' },
    ],
  },
  'science-03': {
    centralNode: 'Thermal Physics',
    mnemonic: 'Boyle (T const: PV=c) · Charles (P const: V/T=c) · Avogadro (V/n=c) → Ideal Gas PV = RT!',
    formulaOrKeyFact: 'PV = RT  |  ΔL/L₀ = αL ΔT  |  K = °C + 273',
    branches: [
      { title: 'Temperature & Heat', color: '#ef4444', summary: 'Heat flows hot→cold (SI: Joule); 1 cal = 4.186 J; Absolute zero = 0 K (−273°C).', examCue: 'Thermal equilibrium = equal temperature, zero net heat flow.' },
      { title: 'Thermal Expansion', color: '#f59e0b', summary: 'Linear (αL), Superficial (αA), Cubical (αV) expansion in solids/liquids/gases.', examCue: 'Real expansion = Apparent + Container expansion.' },
      { title: '3 Fundamental Gas Laws', color: '#0ea5e9', summary: 'Boyle (P ∝ 1/V), Charles (V ∝ T), Avogadro (V ∝ n).', examCue: 'Always convert temperature to Kelvin (K)!' },
      { title: 'Ideal Gas Equation', color: '#10b981', summary: 'PV = RT (R = 8.31 J·mol⁻¹·K⁻¹); Real gases behave ideally at low P & high T.', examCue: 'Key 4-mark derivation in Board exams.' },
    ],
  },
  'science-04': {
    centralNode: 'Electricity & Circuits',
    mnemonic: 'V = IR ("VIR") · Series = Same I (R adds) · Parallel = Same V (1/R adds) · Heat H = I²Rt!',
    formulaOrKeyFact: 'V = IR  |  R = ρL/A  |  H = I²Rt  |  1 kWh = 3.6×10⁶ J',
    branches: [
      { title: 'Current & Ohm’s Law', color: '#f59e0b', summary: 'I = Q/t (Ampere); V = W/Q (Volt); V = IR at constant temperature.', examCue: 'Ammeter in Series; Voltmeter in Parallel.' },
      { title: 'Resistivity ρ', color: '#0ea5e9', summary: 'R = ρL/A (Ω·m); Copper = low ρ; Nichrome = high ρ (heating elements).', examCue: 'Conductance G = 1/R; Conductivity σ = 1/ρ.' },
      { title: 'Series vs Parallel', color: '#10b981', summary: 'Rs = R₁+R₂; 1/Rp = 1/R₁+1/R₂. Household wiring is ALWAYS Parallel!', examCue: 'Parallel lets each appliance get full 220V independently.' },
      { title: 'Joule Heating & Safety', color: '#ef4444', summary: 'H = I²Rt; Power P = VI; Fuse melts on overload; Earthing prevents shock.', examCue: 'LED bulbs save energy & have no toxic mercury.' },
    ],
  },
  'science-05': {
    centralNode: 'Acoustics (Sound Waves)',
    mnemonic: 'Echo Needs ≥ 17.2 m (0.1 s persistence) · Faster in Solids > Liquids > Gases · Doppler = Pitch Shift!',
    formulaOrKeyFact: 'v = nλ  |  Min Echo d = vt/2 = 17.2 m  |  20 Hz – 20,000 Hz',
    branches: [
      { title: 'Longitudinal Waves', color: '#0ea5e9', summary: 'Compressions & rarefactions; needs material medium (no sound in vacuum!).', examCue: 'Audible: 20 Hz–20 kHz; >20 kHz = Ultrasonic.' },
      { title: 'Speed Factors', color: '#10b981', summary: 'Increases with Temperature & Humidity; Independent of Pressure at constant T.', examCue: 'v increases by 0.61 m/s per °C rise.' },
      { title: 'Echo & Applications', color: '#6366f1', summary: 'Distinct echo needs ≥0.1 s delay (≥17.2 m at 344 m/s); used in SONAR & Ultrasound.', examCue: 'Stethoscope uses multiple reflections of sound.' },
      { title: 'Doppler Effect', color: '#f59e0b', summary: 'Apparent frequency rises when source approaches, drops when receding.', examCue: 'Used in radar speed guns, SONAR & measuring star velocity.' },
    ],
  },
  'science-06': {
    centralNode: 'Nuclear Physics',
    mnemonic: 'α (−4 mass, −2 atomic) · β (0 mass, +1 atomic) · γ (0, 0 energy) · Fission Splits · Fusion Joins!',
    formulaOrKeyFact: 'E = mc²  |  1 Roentgen = 2.58×10⁻⁴ C/kg  |  U-235 Fission',
    branches: [
      { title: 'Radioactivity (α, β, γ)', color: '#ef4444', summary: 'Henri Becquerel (1896) & Marie Curie; α = He²⁺, β = electron, γ = EM wave.', examCue: 'Soddy & Fajans Displacement Law for α/β decay.' },
      { title: 'Nuclear Fission', color: '#f59e0b', summary: 'Heavy U-235 splits via slow neutron → Ba + Kr + 3n + 200 MeV.', examCue: 'Controlled in Reactors via Boron/Cadmium Control Rods & Heavy Water Moderator.' },
      { title: 'Nuclear Fusion', color: '#0ea5e9', summary: 'Light Hydrogen nuclei fuse into Helium at 10⁷ K — powers the Sun & stars!', examCue: 'Releases far more energy per kg than fission.' },
      { title: 'Radioisotopes & Safety', color: '#10b981', summary: 'Co-60 (cancer), I-131 (thyroid), P-32 (crops), C-14 (fossil dating).', examCue: 'Lead aprons & dosimeters ensure safe radiation handling.' },
    ],
  },
  'science-07': {
    centralNode: 'Atoms & Molecules',
    mnemonic: 'Avogadro Nₐ = 6.023×10²³ · 1 Mole Gas at STP = 22.4 L · RMM = 2 × Vapour Density!',
    formulaOrKeyFact: 'Moles = Mass / Molar Mass  |  % Comp = (Element Mass / Mol Mass) × 100',
    branches: [
      { title: 'Modern Atomic Theory', color: '#6366f1', summary: 'Atoms divisible (p, n, e); Isotopes (same Z), Isobars (same A), Isotones (same n).', examCue: 'Relative Atomic Mass uses C-12 = 12 amu scale.' },
      { title: 'Atomicity', color: '#0ea5e9', summary: 'Monoatomic (He), Diatomic (O₂), Triatomic (O₃), Polyatomic (P₄, S₈).', examCue: 'Homo- vs Hetero-atomic molecules.' },
      { title: 'Mole Concept', color: '#10b981', summary: '1 mole = 6.023×10²³ particles = GMM (g) = 22.4 L gas at STP.', examCue: 'Practice 2-mark/4-mark mole & % composition numericals!' },
      { title: 'Avogadro’s Law', color: '#f59e0b', summary: 'Equal gas volumes at same T & P contain equal molecules → RMM = 2×VD.', examCue: 'Explains Gay-Lussac’s Law cleanly.' },
    ],
  },
  'science-08': {
    centralNode: 'Periodic Classification',
    mnemonic: 'Across Period (→): Radius SHRINKS, IE/EA/EN RISE! Down Group (↓): Radius GROWS!',
    formulaOrKeyFact: '7 Periods · 18 Groups · Modern Law = Atomic Number (Moseley)',
    branches: [
      { title: 'Modern Periodic Table', color: '#6366f1', summary: 'Properties are periodic functions of Atomic Number Z (s, p, d, f blocks).', examCue: 'Group 1 = Alkali; Group 17 = Halogens; Group 18 = Noble gases.' },
      { title: 'Periodic Trends', color: '#0ea5e9', summary: 'Atomic Radius ↓ across period, ↑ down group; Electronegativity highest at Fluorine (4.0).', examCue: 'Know Pauling scale values & metallic character trend.' },
      { title: 'Metallurgy (Al, Cu, Fe)', color: '#10b981', summary: 'Bauxite → Bayer + Hall-Héroult (Al); Copper pyrites (Cu); Haematite + Blast Furnace (Fe).', examCue: 'Smelting, Roasting (sulphides), Calcination (carbonates).' },
      { title: 'Alloys & Corrosion', color: '#f59e0b', summary: 'Brass (Cu+Zn), Bronze (Cu+Sn), Stainless Steel (Fe+Cr+Ni+C); Galvanisation stops rust.', examCue: 'Amalgam = alloy containing Mercury (Hg).' },
    ],
  },
  'science-09': {
    centralNode: 'Solutions & Solubility',
    mnemonic: 'Solute (Less) + Solvent (More) = Solution · Like Dissolves Like · Henry’s Law (Gas Pressure ↑ → Solubility ↑)!',
    formulaOrKeyFact: 'Mass % = (Solute / Solution) × 100  |  Solubility = (m_solute / m_solvent) × 100',
    branches: [
      { title: 'Types of Solutions', color: '#0ea5e9', summary: 'Binary solutions across Solid, Liquid & Gas; Aqueous (water) vs Non-aqueous.', examCue: 'True solution is homogeneous & transparent.' },
      { title: 'Saturation States', color: '#10b981', summary: 'Unsaturated (more dissolves), Saturated (max at temp T), Supersaturated (unstable).', examCue: 'Cooling supersaturated solution precipitates crystals.' },
      { title: 'Solubility Factors', color: '#6366f1', summary: 'Nature, Temperature (endothermic ↑ with T; gases ↓ with T), Pressure (Henry’s Law).', examCue: 'Fizzy soda bottles seal CO₂ under high pressure!' },
      { title: 'Hydrated & Hygroscopic', color: '#f59e0b', summary: 'CuSO₄·5H₂O (Blue Vitriol turns white on heating); Deliquescent (NaOH) dissolves in air moisture.', examCue: 'Distinguish Hygroscopic (absorbs, stays solid) vs Deliquescent (liquefies).' },
    ],
  },
  'science-10': {
    centralNode: 'Chemical Reactions & pH',
    mnemonic: '5 Classes: Combo · Decomp · Single · Double · Combustion · pH < 7 Acid, 7 Neutral, > 7 Base!',
    formulaOrKeyFact: 'pH = −log₁₀[H⁺]  |  pH + pOH = 14  |  Zn + CuSO₄ → ZnSO₄ + Cu',
    branches: [
      { title: '5 Reaction Types', color: '#0ea5e9', summary: 'Combination, Decomposition (Thermal/Electro/Photo), Single & Double Displacement, Combustion.', examCue: 'Activity Series: Cu CANNOT displace Zn from ZnSO₄!' },
      { title: 'Reversible & Rate', color: '#10b981', summary: 'Rate speeds up with Concentration, Temperature, Catalyst & Powdered Surface Area.', examCue: 'Dynamic equilibrium: Forward rate = Backward rate.' },
      { title: 'pH Scale (Sorensen)', color: '#f59e0b', summary: 'Stomach HCl ≈ 2, Blood = 7.35–7.45, Tooth decay < 5.5, Acid rain < 5.6.', examCue: 'Calculate pH = −log[H⁺] for 0.001 M HCl → pH = 3!' },
      { title: 'Ionic Product of Water', color: '#6366f1', summary: 'Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ mol²·dm⁻⁶ at 25°C.', examCue: 'Neutralization: Acid + Base → Salt + Water.' },
    ],
  },
  'science-11': {
    centralNode: 'Carbon & Its Compounds',
    mnemonic: 'Alkanes (−ane, CₙH₂ₙ₊₂) · Alkenes (=ene, CₙH₂ₙ) · Alkynes (≡yne, CₙH₂ₙ₋₂) · Micelles Trap Grease!',
    formulaOrKeyFact: 'CH₃CH₂OH (Ethanol) + CH₃COOH (Ethanoic Acid) ⇌ Ester + H₂O',
    branches: [
      { title: 'Hydrocarbons & IUPAC', color: '#6366f1', summary: 'Catenation + Tetravalency; Root word (Meth..Pent) + Suffix + Functional group (-OH, -CHO, -COOH).', examCue: 'Homologous series differs by −CH₂− (14 amu).' },
      { title: 'Ethanol (C₂H₅OH)', color: '#0ea5e9', summary: 'Fermentation of molasses; Dehydration with conc. H₂SO₄ at 443 K gives Ethene.', examCue: 'Used in medicine, tinctures & biofuel.' },
      { title: 'Ethanoic Acid', color: '#10b981', summary: 'Glacial acetic acid freezes at 17°C; reacts with ethanol → fruity Ester!', examCue: 'Decarboxylation with soda lime yields Methane.' },
      { title: 'Soaps vs Detergents', color: '#f59e0b', summary: 'Hydrophobic tail grabs oil, hydrophilic head grabs water (Micelle); Detergents work in hard water!', examCue: 'TFM (Total Fatty Matter) measures soap quality.' },
    ],
  },
  'science-12': {
    centralNode: 'Plant Anatomy & Physiology',
    mnemonic: 'Dicot Root = Tetrarch (4) + Conjunctive Parenchyma · Monocot Stem = Scattered Bundles ("Skull")!',
    formulaOrKeyFact: '6CO₂ + 12H₂O —(Light/Chlorophyll)→ C₆H₁₂O₆ + 6H₂O + 6O₂',
    branches: [
      { title: 'Vascular Bundles', color: '#10b981', summary: 'Radial (Roots), Conjoint Collateral (Stems), Open (Cambium in Dicot) vs Closed (Monocot).', examCue: 'Know Dicot vs Monocot Root/Stem/Leaf comparison tables!' },
      { title: 'Chloroplast & Light/Dark', color: '#0ea5e9', summary: 'Light Reaction (Grana → ATP + NADPH₂ + O₂); Dark/Calvin Cycle (Stroma → Glucose).', examCue: 'ATP is the Energy Currency of the cell.' },
      { title: 'Mitochondria & Respiration', color: '#6366f1', summary: 'Glycolysis (Cytoplasm) → Krebs Cycle (Matrix) → ETC (Inner membrane) → 36–38 ATP.', examCue: 'Anaerobic respiration produces Ethanol + CO₂ (Yeast).' },
      { title: 'RQ (Respiratory Quotient)', color: '#f59e0b', summary: 'RQ = Volume of CO₂ liberated / Volume of O₂ consumed (= 1 for glucose).', examCue: 'High-frequency 2-mark formula!' },
    ],
  },
  'science-13': {
    centralNode: 'Animal Structural Organisation',
    mnemonic: 'Leech = 33 Segments (Hirudin stops clotting!) · Rabbit = Mammalian Diphyodont + Diastema Gap!',
    formulaOrKeyFact: 'Leech (Hirudinaria granulosa)  |  Rabbit (Oryctolagus cuniculus)',
    branches: [
      { title: 'Indian Cattle Leech', color: '#ef4444', summary: '33 segments, anterior/posterior suckers, hermaphrodite, Sanguivorous (blood feeder).', examCue: 'Salivary gland secretes Hirudin (anticoagulant).' },
      { title: 'Leech Systems', color: '#f59e0b', summary: 'Cutaneous respiration via skin; Haemocoelic circulation; 17 pairs of Nephridia.', examCue: 'No true blood vessels — 4 longitudinal haemocoelic channels.' },
      { title: 'Rabbit Anatomy', color: '#0ea5e9', summary: 'Herbivorous mammal; Diastema (gap for chewing — canines absent!); 4-chambered heart.', examCue: 'Dental formula of Rabbit: I 2/1, C 0/0, PM 3/2, M 3/3 = 28.' },
      { title: 'Rabbit Systems', color: '#10b981', summary: 'Lungs with Diaphragm; Metanephric Kidneys; CNS Brain + Spinal Cord.', examCue: 'Explore both the 3D Animal Cell & 3D Kidney in this unit!' },
    ],
  },
  'science-14': {
    centralNode: 'Transport & Human Heart',
    mnemonic: 'Apoplast = Around Walls · Symplast = Straight Through · Tricuspid = RIGHT (3) · Bicuspid = LEFT (2)!',
    formulaOrKeyFact: 'Cardiac Cycle = 0.8 s (72–75 bpm)  |  Normal BP = 120/80 mmHg',
    branches: [
      { title: 'Plant Water & Phloem', color: '#10b981', summary: 'Root hair osmosis → Apoplast/Symplast → Xylem Transpiration Pull (↑); Phloem sucrose flow (↕).', examCue: 'Turgid guard cells OPEN stoma; Flaccid CLOSE it.' },
      { title: 'Blood & Vessels', color: '#ef4444', summary: 'RBC (Haemoglobin), WBC (Defense), Platelets (Clotting); Arteries (away), Veins (valves, toward).', examCue: 'Pulmonary Artery carries deoxygenated; Pulm. Vein carries oxygenated!' },
      { title: 'Human Heart & LUB-DUB', color: '#0ea5e9', summary: 'SA Node = Pacemaker; LUBB = AV valves close; DUBB = Semilunar valves close.', examCue: 'Left Ventricle wall is 3× thicker for systemic pressure.' },
      { title: 'ABO & Rh Blood Groups', color: '#6366f1', summary: 'Landsteiner ABO; O⁻ = Universal Donor (no antigens), AB⁺ = Universal Recipient.', examCue: 'Lymph drains excess tissue fluid & carries fats.' },
    ],
  },
  'science-15': {
    centralNode: 'Nervous System & Brain',
    mnemonic: 'Reflex Arc = R-S-I-M-E (Receptor → Sensory → Interneuron → Motor → Effector)!',
    formulaOrKeyFact: 'CNS = Brain (1.36 kg) + Spinal Cord  |  12 Cranial + 31 Spinal Nerves',
    branches: [
      { title: 'Neuron Structure', color: '#0ea5e9', summary: 'Dendrites (receive) → Cyton (cell body) → Axon (myelin sheath + Nodes of Ranvier) → Synapse.', examCue: 'Neurotransmitter Acetylcholine bridges the synaptic cleft.' },
      { title: 'Human Brain (3 Parts)', color: '#f43f5e', summary: 'Forebrain (Cerebrum = memory/thinking, Hypothalamus = temp/hunger), Midbrain, Hindbrain (Cerebellum = balance, Medulla = heartbeat).', examCue: 'Protected by 3 Meninges (Dura, Arachnoid, Pia) & CSF!' },
      { title: 'Spinal Cord & Reflex', color: '#10b981', summary: 'Fast involuntary protective response controlled by spinal cord before brain feels pain.', examCue: 'Draw & label the Reflex Arc diagram cleanly.' },
      { title: 'ANS (Sympathetic)', color: '#f59e0b', summary: 'Sympathetic = Fight/Flight (speeds heart); Parasympathetic = Rest/Digest (calms).', examCue: 'Explore the REAL 3D Brain & 3D Neuron right in this unit!' },
    ],
  },
  'science-16': {
    centralNode: 'Plant & Animal Hormones',
    mnemonic: 'Plant 5: A-G-C-E-A (Auxin, Gibberellin, Cytokinin, Ethylene=Ripen, ABA=Stress)!',
    formulaOrKeyFact: 'Pituitary = Master Gland  |  Insulin (↓ Sugar) vs Glucagon (↑ Sugar)',
    branches: [
      { title: '5 Phytohormones', color: '#10b981', summary: 'Auxin (phototropism/apical dominance), Gibberellin (bolting), Cytokinin (cell division), Ethylene (fruit ripening), ABA (abscission).', examCue: 'Only Ethylene is a GASEOUS hormone!' },
      { title: 'Pituitary & Thyroid', color: '#0ea5e9', summary: 'GH (dwarfism/gigantism), ADH (diabetes insipidus); Thyroxine needs Iodine (prevents Goitre).', examCue: 'Thyroxine = "Personality Hormone".' },
      { title: 'Pancreas (Dual Gland)', color: '#6366f1', summary: 'Islets of Langerhans: β-cells make Insulin (lowers glucose), α-cells make Glucagon.', examCue: 'Insulin deficiency causes Diabetes Mellitus.' },
      { title: 'Adrenal & Gonads', color: '#f59e0b', summary: 'Adrenaline = "Emergency / 3F Hormone" (Fear, Fight, Flight); Testosterone & Estrogen.', examCue: 'Feedback control maintains hormone homeostasis.' },
    ],
  },
  'science-17': {
    centralNode: 'Reproduction in Life',
    mnemonic: 'Double Fertilization = Syngamy (2n Zygote) + Triple Fusion (3n Endosperm)!',
    formulaOrKeyFact: 'Human Gametes: n = 23 → Zygote 2n = 46  |  Gestation ≈ 280 days',
    branches: [
      { title: 'Asexual & Vegetative', color: '#10b981', summary: 'Fission, Budding (Yeast), Fragmentation (Spirogyra), Spore formation, Tissue culture.', examCue: 'Produces genetically identical offspring rapidly.' },
      { title: 'Angiosperm Flower', color: '#f59e0b', summary: 'Calyx, Corolla, Androecium (Pollen), Gynoecium (Ovule); Pollination → Double Fertilization.', examCue: 'Ovary becomes Fruit; Ovule becomes Seed!' },
      { title: 'Gametogenesis', color: '#0ea5e9', summary: 'Sperm (Acrosome enzyme + Mitochondrial spiral + Tail) & Ovum (Zona pellucida + Corona radiata).', examCue: 'Inspect the 3D Sperm & Ovum + 3D Flower models!' },
      { title: 'Menstrual Cycle & Health', color: '#ec4899', summary: '28-day cycle (Ovulation ~Day 14); Placenta nourishes embryo; Safe contraception & hygiene.', examCue: 'Colostrum (first breast milk) provides rich IgA immunity.' },
    ],
  },
  'science-18': {
    centralNode: 'Genetics & DNA',
    mnemonic: 'Monohybrid = 3:1 (1:2:1) · Dihybrid = 9:3:3:1 · DNA Pairing = A=T (2 H-bonds), G≡C (3 H-bonds)!',
    formulaOrKeyFact: 'Human: 44 Autosomes + XX (Female) / XY (Male) = 46 Chromosomes',
    branches: [
      { title: 'Mendel’s 3 Laws', color: '#6366f1', summary: 'Dominance, Segregation (Purity of Gametes), and Independent Assortment (9:3:3:1).', examCue: 'Mendel chose Pisum sativum (Garden Pea) with 7 contrasting traits.' },
      { title: 'Chromosomes & Sex', color: '#0ea5e9', summary: 'Metacentric, Sub-metacentric, Acrocentric, Telocentric; Father’s X/Y sperm determines baby’s sex.', examCue: 'Telomeres protect chromosome tips.' },
      { title: 'Watson & Crick DNA', color: '#10b981', summary: 'Antiparallel double helix; Sugar-Phosphate backbone + A=T & G≡C rungs (Chargaff’s Rule).', examCue: 'Semi-conservative replication uses DNA Helicase & Polymerase.' },
      { title: 'Mutations', color: '#f59e0b', summary: 'Chromosomal (Euploidy/Aneuploidy, Down Syndrome Trisomy-21) vs Gene (Sickle Cell Anemia).', examCue: 'Point mutation substitutes a single nitrogenous base.' },
    ],
  },
  'science-19': {
    centralNode: 'Origin & Evolution',
    mnemonic: 'Homologous = Same Origin/Diff Function (Divergent) · Analogous = Diff Origin/Same Function (Convergent)!',
    formulaOrKeyFact: 'Archaeopteryx = Missing Link (Reptiles ↔ Birds)  |  C-14 Dating',
    branches: [
      { title: 'Origin of Life', color: '#6366f1', summary: 'Big Bang → Chemical Evolution (Oparin & Haldane) → Biogenesis.', examCue: 'Miller-Urey proved organic amino acids form naturally.' },
      { title: 'Evidences of Evolution', color: '#0ea5e9', summary: 'Homologous organs (bat wing/human hand), Analogous (bird/insect wing), Vestigial (appendix), Fossils.', examCue: 'Birbal Sahni = Father of Indian Paleobotany.' },
      { title: 'Lamarck vs Darwin', color: '#10b981', summary: 'Lamarck = Use & Disuse (giraffe neck); Darwin = Natural Selection ("Survival of the Fittest").', examCue: 'Darwin sailed on HMS Beagle to Galápagos Islands.' },
      { title: 'Ethnobotany & Astrobiology', color: '#f59e0b', summary: 'Traditional medicinal plant wisdom + Goldilocks habitable zone search for life.', examCue: 'Radioactive Carbon-14 determines fossil age (Libby).' },
    ],
  },
  'science-20': {
    centralNode: 'Breeding & Biotechnology',
    mnemonic: 'Green Revolution (Wheat/Rice) · Genetic Scissors = Restriction Enzyme · Glue = DNA Ligase!',
    formulaOrKeyFact: 'rDNA = Plasmid Vector + Foreign Gene → Human Insulin (Humulin)',
    branches: [
      { title: 'Crop Improvement', color: '#10b981', summary: 'Dr. M.S. Swaminathan (India) & Norman Borlaug; IR-8 Rice, Sonalika Wheat, Polyploidy (seedless).', examCue: 'Biofortification enriches crops (Protina Maize, Atlas-66 Wheat).' },
      { title: 'Animal Breeding', color: '#0ea5e9', summary: 'Inbreeding (pure lines) vs Outbreeding/Crossbreeding (Hybrid vigour — Karan Swiss cow, Mule).', examCue: 'Dolly (1996, Ian Wilmut) = first cloned sheep.' },
      { title: 'Genetic Engineering', color: '#6366f1', summary: 'Restriction Endonuclease cuts DNA; Ligase joins; Golden Rice (Vitamin A), Bt Cotton.', examCue: 'DNA Fingerprinting (Alec Jeffreys) uses VNTR repeats.' },
      { title: 'Stem Cells & Gene Therapy', color: '#f59e0b', summary: 'Embryonic vs Adult stem cells repair damaged tissue; Somatic Gene Therapy treats disorders.', examCue: 'Bioethics ensures safe & equitable biotech.' },
    ],
  },
  'science-21': {
    centralNode: 'Health & Diseases',
    mnemonic: 'Type-1 Diabetes = Insulin Absent · Type-2 = Insulin Resistant · AIDS = HIV attacks T-Helper Cells!',
    formulaOrKeyFact: 'BMI = Weight (kg) / Height² (m²)  |  1 Dec = World AIDS Day',
    branches: [
      { title: 'Abuse Prevention', color: '#ef4444', summary: 'Protecting children (POCSO / Childline 1098); avoiding tobacco (nicotine), alcohol (cirrhosis) & drugs.', examCue: 'Rehabilitation, counselling & healthy sports habits.' },
      { title: 'Lifestyle Disorders', color: '#f59e0b', summary: 'Diabetes Mellitus (Polyuria, Polydipsia, Polyphagia), Obesity, Coronary Heart Disease (Atherosclerosis).', examCue: 'HDL = Good cholesterol; LDL = Bad cholesterol.' },
      { title: 'Cancer Biology', color: '#6366f1', summary: 'Uncontrolled mitosis; Benign (localized) vs Malignant (metastasis); Carcinogens trigger oncogenes.', examCue: 'Treated via Surgery, Radiotherapy, Chemotherapy & Immunotherapy.' },
      { title: 'HIV / AIDS', color: '#0ea5e9', summary: 'Retrovirus diagnosed by ELISA (screening) & Western Blot (confirmation); NOT spread by touch/sharing meals!', examCue: 'Prevention: screened blood, sterile needles & awareness.' },
    ],
  },
  'science-22': {
    centralNode: 'Environmental Management',
    mnemonic: '3Rs = Reduce, Reuse, Recycle · Chipko = Hug Trees (1973) · E-Waste = Safe Collection, Never Burn!',
    formulaOrKeyFact: 'Biogas = CH₄ (Methane ~75%) + CO₂  |  Solar + Wind = Clean Energy',
    branches: [
      { title: 'Forests & Wildlife', color: '#10b981', summary: 'Afforestation, Social Forestry, Chipko Movement, Jim Corbett (1936), Wildlife Protection Act (1972).', examCue: 'Soil erosion prevented by contour ploughing & shelter belts.' },
      { title: 'Renewable Energy', color: '#f59e0b', summary: 'Solar PV panels, Biogas (anaerobic slurry), Wind turbines (Muppandal, TN), Tidal & Hydro power.', examCue: 'Shale gas & fossil fuels are finite & raise CO₂.' },
      { title: 'Rainwater Harvesting', color: '#0ea5e9', summary: 'Rooftop recharge pits, Ooranis & Eris (ancient TN tanks) raise groundwater table & stop saltwater intrusion.', examCue: 'Tamil Nadu pioneered mandatory rooftop RWH!' },
      { title: 'Solid & E-Waste', color: '#6366f1', summary: 'Segregate biodegradable vs plastic; Composting, Vermicomposting & authorized E-waste recycling.', examCue: 'Lead/Mercury/Cadmium in discarded electronics pollute soil.' },
    ],
  },
  'science-23': {
    centralNode: 'Visual Communication',
    mnemonic: 'Scratch = Sprite (Actor) + Stage (Backdrop) + Script (Blocks)!',
    formulaOrKeyFact: 'Visual Media = Graphics + Animation + Interactive Storytelling',
    branches: [
      { title: 'Visual File Formats', color: '#0ea5e9', summary: 'Images (JPEG/PNG/SVG), Audio (MP3/WAV), Video (MP4) & Vector vs Raster clarity.', examCue: 'Choose crisp vector/SVG diagrams for learning.' },
      { title: 'Scratch Programming', color: '#f59e0b', summary: 'MIT visual block editor: Stage, Sprites, Motion/Looks/Sound/Control scripts.', examCue: 'Green Flag starts script; Red Octagon stops it.' },
      { title: 'Digital Literacy', color: '#10b981', summary: 'Verify sources, respect copyright/open licenses, avoid misinformation.', examCue: 'Responsible digital citizenship keeps learners safe.' },
      { title: 'Optical & Camera Craft', color: '#6366f1', summary: 'Framing, contrast, colour accessibility & clear typography guide attention.', examCue: 'Inspect the 3D Optical Camera model in this lab!' },
    ],
  },

  // ═══ SOCIAL SCIENCE — HISTORY (10 CHAPTERS) ═══
  'social-history-01': {
    centralNode: 'World War I (1914–1918)',
    mnemonic: 'MAIN Causes: Militarism · Alliances (Triple Alliance vs Entente) · Imperialism · Nationalism + Sarajevo Spark!',
    formulaOrKeyFact: '28 June 1914 (Sarajevo) → 11 Nov 1918 (Armistice) → 28 June 1919 (Versailles)',
    branches: [
      { title: 'Two Armed Camps', color: '#ef4444', summary: 'Triple Alliance (1882: Germany, Austria-Hungary, Italy) vs Triple Entente (1907: Britain, France, Russia).', examCue: 'Italy later switched to Allies in 1915.' },
      { title: 'Course & Global Reach', color: '#f59e0b', summary: 'Trench warfare (Marne, Verdun, Somme); Emden shelled Madras (1914); USA entered (Apr 1917).', examCue: 'India contributed soldiers, funds & faced Home Rule surge.' },
      { title: 'Russian Revolution (1917)', color: '#0ea5e9', summary: 'Tsar Nicholas II abdicated; Lenin’s Bolsheviks signed Brest-Litovsk (Mar 1918).', examCue: 'Bharathiyar hailed the fall of Tsardom in verse!' },
      { title: 'Versailles & League', color: '#10b981', summary: 'Harsh reparations on Germany; League of Nations (1920, Geneva) created from Wilson’s 14 Points.', examCue: 'USA never joined the League of Nations.' },
    ],
  },
  'social-history-02': {
    centralNode: 'Interwar World (1919–39)',
    mnemonic: '1929 Crash → Economic Pain → Dictators Rise (Mussolini Italy, Hitler Germany) → Road to WWII!',
    formulaOrKeyFact: '1929 Wall Street Crash  |  1922 Fascist Italy  |  1933 Nazi Germany',
    branches: [
      { title: 'Great Depression', color: '#ef4444', summary: 'US stock crash froze global credit; Indian farmers hit by plunging prices & land rent.', examCue: 'FDR’s New Deal revived US infrastructure & banking.' },
      { title: 'Fascism & Nazism', color: '#f59e0b', summary: 'Mussolini (Black Shirts, Lateran Treaty 1929); Hitler (Mein Kampf, Gestapo, Munich Pact 1938).', examCue: 'Anti-democratic dictatorship crushed trade unions & minorities.' },
      { title: 'Asia & Africa', color: '#10b981', summary: 'Ho Chi Minh in Vietnam; Egyptian independence (1922); resistance to Apartheid in South Africa.', examCue: 'Latin America’s Good Neighbor Policy.' },
      { title: 'League Failures', color: '#0ea5e9', summary: 'Failed to stop Japan in Manchuria (1931) & Italy in Ethiopia (1935).', examCue: 'Appeasement emboldened Axis expansion.' },
    ],
  },
  'social-history-03': {
    centralNode: 'World War II (1939–1945)',
    mnemonic: '1939 Poland → 1941 Pearl Harbor → 1942 Stalingrad → 1944 D-Day → 1945 UN Born (24 Oct)!',
    formulaOrKeyFact: '1 Sep 1939 – 2 Sep 1945  |  UN HQ: New York  |  Bretton Woods (1944)',
    branches: [
      { title: 'Causes & Outbreak', color: '#ef4444', summary: 'Versailles resentment, Axis aggression, failure of appeasement → Invasion of Poland.', examCue: 'Blitzkrieg ("Lightning War") overran Western Europe.' },
      { title: 'Turning Points', color: '#f59e0b', summary: 'Battle of Britain (RAF), Stalingrad (USSR), El Alamein, Midway & D-Day Normandy.', examCue: 'Holocaust & atomic bombings underscored human cost of war.' },
      { title: 'United Nations (1945)', color: '#0ea5e9', summary: 'General Assembly, Security Council (5 permanent veto members), ICJ, UNESCO, WHO, UNICEF.', examCue: 'Universal Declaration of Human Rights (10 Dec 1948).' },
      { title: 'Bretton Woods Twins', color: '#10b981', summary: 'World Bank (IBRD) & IMF (1945) + Beveridge Welfare State in Britain.', examCue: 'Decolonisation swept India (1947), Asia & Africa.' },
    ],
  },
  'social-history-04': {
    centralNode: 'Post-1945 World',
    mnemonic: 'Cold War = NATO (US) vs Warsaw Pact (USSR) · India Led Third Way = NAM (1961)!',
    formulaOrKeyFact: '1949 China  |  1955 Bandung  |  1961 NAM  |  1989 Berlin Wall Falls',
    branches: [
      { title: 'Chinese Revolution', color: '#ef4444', summary: 'Sun Yat-sen → Long March → Mao Zedong founded PRC (1 Oct 1949).', examCue: 'Ended century of foreign spheres of influence.' },
      { title: 'Cold War Alliances', color: '#0ea5e9', summary: 'Marshall Plan, NATO (1949), SEATO, Warsaw Pact (1955); Korea, Cuba (1962) & Vietnam crises.', examCue: 'Non-Aligned Movement promoted peaceful coexistence.' },
      { title: 'Middle East & EU', color: '#f59e0b', summary: 'Suez Crisis (1956, Nasser), Arab-Israeli conflicts, European Union (Maastricht 1992).', examCue: 'Euro currency introduced across Eurozone.' },
      { title: 'End of Cold War', color: '#10b981', summary: 'Gorbachev’s Glasnost (openness) & Perestroika (restructuring); German reunification (1990); USSR ended 1991.', examCue: 'Unipolar to multipolar world transition.' },
    ],
  },
  'social-history-05': {
    centralNode: '19th-C Reform Movements',
    mnemonic: 'Roy (Brahmo/Sati) · Phule (Satyashodhak) · Vivekananda (Chicago 1893) · Vallalar (Jeeva Karunya)!',
    formulaOrKeyFact: '1828 Brahmo Samaj  |  1829 Sati Abolished  |  1867 Vadalur Dharma Salai',
    branches: [
      { title: 'Bengal Reformers', color: '#6366f1', summary: 'Raja Rammohan Roy (Brahmo Samaj), Vidyasagar (Widow Remarriage Act 1856), Ramakrishna & Vivekananda.', examCue: 'Prarthana Samaj (Maharashtra) & Aligarh Movement (Sir Syed).' },
      { title: 'Anti-Caste Pioneers', color: '#10b981', summary: 'Jyotiba Phule (Gulamgiri), Narayana Guru (Aruvippuram), Ayyankali (Sadhu Jana Paripalana).', examCue: 'Advocated universal education & human dignity.' },
      { title: 'Revivalist Streams', color: '#f59e0b', summary: 'Dayananda Saraswati (Arya Samaj — "Go Back to Vedas"), Theosophical Society (Adyar, Annie Besant).', examCue: 'Deoband & Sikh Singh Sabha movements.' },
      { title: 'Tamil Nadu Reformers', color: '#0ea5e9', summary: 'Ramalinga Adigal / Vallalar (Samarasa Vedha Sanmarga Sangam) & Ayothidasar (Oru Paisa Tamilan).', examCue: 'Vaikunda Swamigal led Samathuva Samajam in South TN.' },
    ],
  },
  'social-history-06': {
    centralNode: 'Early Revolts in TN',
    mnemonic: 'P-V-K-M-V: Puli Thevar → Velunachiyar (1780) → Kattabomman (1799) → Marudhu (1801) → Vellore (1806)!',
    formulaOrKeyFact: '1755 Puli Thevar  |  1780 Velunachiyar  |  1801 Tiruchy Proclamation  |  1806 Vellore',
    branches: [
      { title: 'Palayakkarar System', color: '#f59e0b', summary: 'Viswanatha Nayak (1529) created 72 Palayams; Eastern (Kattabomman) & Western (Puli Thevar) blocs.', examCue: 'Puli Thevar defeated British forces at Kalakadu.' },
      { title: 'Rani Velunachiyar', color: '#ec4899', summary: 'Allied with Hyder Ali, Gopala Nayak & Kuyili to recapture Sivagangai (1780).', examCue: 'First queen in India to wage war against the British!' },
      { title: 'Kattabomman & Marudhu', color: '#ef4444', summary: 'Panchalankurichi hero hanged at Kayathar (1799); Marudhu Brothers issued 1801 Proclamation; Dheeran Chinnamalai.', examCue: 'Carnatic Treaty (1801) gave British direct TN control.' },
      { title: 'Vellore Revolt (1806)', color: '#0ea5e9', summary: '10 July 1806 sepoy uprising against Agnew’s turban & humiliation; hoisted Tipu’s tiger flag.', examCue: 'Forerunner of the 1857 Great Rebellion!' },
    ],
  },
  'social-history-07': {
    centralNode: 'Anti-Colonial & Nationalism',
    mnemonic: '1857 Rebellion → 1885 INC → 1905 Swadeshi (Bengal) → 1916 Home Rule (Adyar & Pune)!',
    formulaOrKeyFact: '1857 Great Revolt  |  1885 INC (W.C. Bonnerjee)  |  1905 Partition of Bengal',
    branches: [
      { title: 'Peasant & Tribal Revolts', color: '#10b981', summary: 'Santhal (Sidhu & Kanhu), Munda (Birsa Munda), Indigo (1859) & Deccan riots against oppressive taxes.', examCue: 'Permanent Settlement & Ryotwari impoverished peasants.' },
      { title: '1857 Great Rebellion', color: '#ef4444', summary: 'Doctrine of Lapse + cartridges; Meerut → Delhi → Jhansi/Kanpur/Lucknow → Crown took over in 1858.', examCue: 'Queen Victoria’s Proclamation promised non-interference.' },
      { title: 'INC & Swadeshi (1905)', color: '#f59e0b', summary: 'Moderates (Naoroji Drain Theory) & Extremists (Lal-Bal-Pal); Boycott & National Education.', examCue: 'Partition of Bengal revoked in 1911.' },
      { title: 'Home Rule (1916)', color: '#0ea5e9', summary: 'Annie Besant (Madras/New India) & Tilak (Bombay); Lucknow Pact united Congress & League.', examCue: 'Built nationwide constitutional demand for self-rule.' },
    ],
  },
  'social-history-08': {
    centralNode: 'Gandhian Phase (1919–47)',
    mnemonic: 'C-N-D-Q: Champaran (1917) → Non-Cooperation (1920) → Dandi Salt (1930) → Quit India (1942)!',
    formulaOrKeyFact: '13 Apr 1919 Jallianwala  |  12 Mar 1930 Dandi  |  15 Aug 1947 Freedom',
    branches: [
      { title: 'Early Satyagrahas', color: '#10b981', summary: 'Champaran (Indigo), Kheda, Ahmedabad Mill; Rowlatt Act protest & Jallianwala Bagh massacre (1919).', examCue: 'Tagore renounced knighthood; Gandhi returned Kaiser-i-Hind.' },
      { title: 'Non-Cooperation & Civil Disob.', color: '#0ea5e9', summary: 'Khilafat unity (1920), Chauri Chaura (1922), Lahore Purna Swaraj (1929), Dandi Salt March (1930).', examCue: 'Poona Pact (1932) between Gandhi & Ambedkar.' },
      { title: 'Revolutionaries & INA', color: '#ef4444', summary: 'Bhagat Singh, Rajguru, Sukhdev; Subhas Chandra Bose led INA ("Give me blood, I will give you freedom").', examCue: 'Rani of Jhansi Regiment led by Capt. Lakshmi Sahgal.' },
      { title: 'Quit India & Freedom', color: '#f59e0b', summary: '1942 "Do or Die", RIN Mutiny (1946), Cabinet Mission, Mountbatten Plan → Independence!', examCue: 'Constituent Assembly framed India’s Republic.' },
    ],
  },
  'social-history-09': {
    centralNode: 'Freedom Struggle in TN',
    mnemonic: 'V.O.C. (Ships) · Bharathiyar (Songs) · Rajaji (Vedaranyam Salt) · Tiruppur Kumaran (Flag)!',
    formulaOrKeyFact: '1884 Madras Mahajana Sabha  |  1906 Swadeshi Steam  |  1930 Vedaranyam',
    branches: [
      { title: 'Early Associations', color: '#6366f1', summary: 'Madras Native Assoc. (1852, Gajula Lakshminarasu), The Hindu (1878), Swadesamitran (G. Subramania Iyer).', examCue: 'Madras Mahajana Sabha (1884) hosted key INC sessions.' },
      { title: 'Swadeshi in TN', color: '#0ea5e9', summary: 'V.O.C. launched Galia & Lavo steamships; Subramania Siva & Bharathiyar energized Tirunelveli & Pondicherry.', examCue: 'Vanchinathan & Bharathamatha Association.' },
      { title: 'Vedaranyam (1930)', color: '#10b981', summary: 'Rajaji led salt march from Trichy to Vedaranyam; Rukmani Lakshmipathi first woman arrested.', examCue: 'George Joseph ("Rosaappu Durai") championed Vaikom & workers.' },
      { title: 'Mass Leaders & Quit India', color: '#f59e0b', summary: 'Tiruppur Kumaran (1932), Sathyamurthi, K. Kamarajar, Muthuramalinga Thevar & Agasthiyar youth.', examCue: 'Rajaji formed 1937 Congress ministry in Madras.' },
    ],
  },
  'social-history-10': {
    centralNode: 'Social Transformation in TN',
    mnemonic: 'Print Classics (U.Ve.Sa.) → Justice Party (1916) → Periyar Self-Respect (1925) → Women’s Empowerment!',
    formulaOrKeyFact: '1578 First Tamil Print  |  1916 Justice Party  |  1925 Self-Respect Movement',
    branches: [
      { title: 'Tamil Renaissance', color: '#6366f1', summary: 'C.W. Damotharanar & U.Ve. Swaminatha Iyer rescued Sangam classics; Parithimar Kalaignar & Maraimalai Adigal.', examCue: 'Robert Caldwell proved Dravidian linguistic independence (1856).' },
      { title: 'Justice Party (1916)', color: '#0ea5e9', summary: 'Dr. C. Natesanar, P. Theagarayar, Dr. T.M. Nair; Communal G.O., Staff Selection Board, Women’s suffrage (1921).', examCue: 'Launched pioneering Midday Meal scheme in Madras schools.' },
      { title: 'Periyar & Self-Respect', color: '#f59e0b', summary: 'Vaikom Hero (1924), Kudi Arasu journal, Self-Respect marriages, rationalism & gender equality.', examCue: 'M. Singaravelar celebrated India’s first May Day (1923, Madras)!' },
      { title: 'Women’s Movement', color: '#ec4899', summary: 'Dr. Muthulakshmi Reddy (abolished Devadasi system, Adyar Cancer Inst.) & Moovalur Ramamirtham.', examCue: 'WIA (1917, Adyar) fought child marriage & championed girls’ schools.' },
    ],
  },

  // ═══ SOCIAL SCIENCE — GEOGRAPHY (7 CHAPTERS) ═══
  'social-geography-01': {
    centralNode: 'India: Relief & Drainage',
    mnemonic: '5 Divisions: Himalayas · Great Plains · Peninsular Plateau · Coastal Plains · Islands!',
    formulaOrKeyFact: 'IST = 82°30′E (+5:30 GMT)  |  Area = 32,87,263 km²  |  7th Largest',
    branches: [
      { title: 'Northern Mountains', color: '#6366f1', summary: 'Trans-Himalayas, Himadri (Everest 8,848 m), Himachal, Siwaliks & Purvanchal Hills.', examCue: 'Source of perennial snow-fed rivers.' },
      { title: 'Northern Plains', color: '#10b981', summary: 'Fertile alluvium by Indus, Ganga & Brahmaputra (Bhabar, Tarai, Bhangar, Khadar).', examCue: 'Ganga (2,525 km) is longest river in India.' },
      { title: 'Peninsular Plateau', color: '#f59e0b', summary: 'Oldest Gondwana block; Aravalli, Vindhya-Satpura, Western & Eastern Ghats.', examCue: 'Narmada & Tapti flow WEST into Arabian Sea!' },
      { title: 'Coasts & Islands', color: '#0ea5e9', summary: 'Malabar (kayals/Vembanad) vs Coromandel; Andaman-Nicobar (Volcanic, Indira Point) & Lakshadweep (Coral).', examCue: 'Palk Strait separates India and Sri Lanka.' },
    ],
  },
  'social-geography-02': {
    centralNode: 'Climate & Vegetation',
    mnemonic: 'SW Monsoon (Jun–Sep) Wets West Coast & North · NE Monsoon (Oct–Dec) Wets Tamil Nadu!',
    formulaOrKeyFact: 'Mawsynram = 1,141 cm (Wettest)  |  Project Tiger = 1973  |  18 Biosphere Reserves',
    branches: [
      { title: 'Climate Controls', color: '#0ea5e9', summary: 'Latitude, Altitude (Lapse Rate 6.5°C/km), Distance from sea, Jet Streams & Western Disturbances.', examCue: 'Himalayas shield India from freezing Arctic winds.' },
      { title: '4 Seasons', color: '#f59e0b', summary: 'Winter, Summer (Mango showers/Norwesters), SW Monsoon (Arabian + Bay branches), Retreating NE Monsoon.', examCue: 'Tamil Nadu lies in SW Monsoon rain-shadow of Western Ghats!' },
      { title: 'Natural Vegetation', color: '#10b981', summary: 'Evergreen (>200 cm), Deciduous (100–200 cm, most common), Dry Thorn, Mountain & Mangrove (Sundarbans).', examCue: 'Sundari trees give Sundarbans its name.' },
      { title: 'Wildlife Conservation', color: '#6366f1', summary: 'National Parks, Sanctuaries & Biosphere Reserves (Nilgiri = India’s 1st, 1986).', examCue: 'Gulf of Mannar protects marine coral & Dugong.' },
    ],
  },
  'social-geography-03': {
    centralNode: 'India: Agriculture',
    mnemonic: 'Kharif = Monsoon (Rice/Cotton) · Rabi = Winter (Wheat/Mustard) · Black Soil = Cotton!',
    formulaOrKeyFact: 'Alluvial = Most Fertile  |  Black (Regur) = Cotton  |  ICAR = 8 Soil Types',
    branches: [
      { title: 'Major Soils', color: '#f59e0b', summary: 'Alluvial (deltas/plains), Black (lava/cotton), Red (iron oxide), Laterite (tea/coffee), Desert.', examCue: 'Prevent erosion via afforestation & terrace farming.' },
      { title: 'Irrigation & Dams', color: '#0ea5e9', summary: 'Well/Tubewell (62%), Canal, Tank; Bhakra Nangal (Sutlej), Hirakud (Mahanadi — longest), Mettur (Kaveri).', examCue: 'Drip & Sprinkler micro-irrigation save 50%+ water.' },
      { title: 'Food & Cash Crops', color: '#10b981', summary: 'Rice (WB/UP/TN), Wheat (UP/Punjab), Cotton, Sugarcane, Tea (Assam), Coffee (Karnataka).', examCue: 'Jute = "Golden Fibre"; Rice is Kharif staple.' },
      { title: 'Revolutions', color: '#6366f1', summary: 'Green (Grains), White (Milk), Blue (Fish), Yellow (Oilseeds), Silver (Eggs), Golden (Fruits/Honey).', examCue: 'Livestock & fisheries boost rural farm income.' },
    ],
  },
  'social-geography-04': {
    centralNode: 'Resources & Industries',
    mnemonic: 'Mumbai = Cottonopolis · Coimbatore = Manchester of South · Bengaluru = Electronic Capital!',
    formulaOrKeyFact: 'TISCO (Jamshedpur, 1907)  |  Muppandal (TN) = Largest Wind Farm',
    branches: [
      { title: 'Metallic Minerals', color: '#ef4444', summary: 'Iron Ore (Magnetite/Haematite), Manganese (Steel hardening), Copper, Bauxite (Aluminium).', examCue: 'Chotanagpur Plateau is India’s Mineral Heartland.' },
      { title: 'Non-Metallic & Energy', color: '#f59e0b', summary: 'Mica (insulator), Limestone (cement), Coal ("Black Gold"), Petroleum (Mumbai High, Digboi).', examCue: 'Neyveli (TN) leads India’s Lignite production.' },
      { title: 'Clean Energy', color: '#10b981', summary: 'Nuclear (Kalpakkam, Kudankulam), Solar (Kamuthi, TN), Wind (Muppandal) & Hydro.', examCue: 'Non-conventional energy is renewable & low-carbon.' },
      { title: 'Manufacturing', color: '#0ea5e9', summary: 'Agro-based (Textiles, Sugar, Paper), Mineral-based (Steel, Auto, Cement) & IT Software.', examCue: 'Chennai is called the "Detroit of Asia".' },
    ],
  },
  'social-geography-05': {
    centralNode: 'Population & Transport',
    mnemonic: 'NH-44 = Longest Highway (Srinagar–Kanyakumari) · Golden Quad = Delhi–Mumbai–Chennai–Kolkata!',
    formulaOrKeyFact: 'Census Every 10 Yrs (First 1872, Full 1881)  |  13 Major Sea Ports',
    branches: [
      { title: 'Population Trends', color: '#6366f1', summary: 'Density = Persons/km² (Bihar highest, Arunachal lowest); Literacy, Sex Ratio & Urbanisation.', examCue: 'Fertile plains & industrial cities attract migration.' },
      { title: 'Road & Rail', color: '#f59e0b', summary: 'NHAI Golden Quadrilateral (5,846 km); Indian Railways (1853 Mumbai–Thane) = 18 Zones.', examCue: 'Southern Railway HQ = Chennai!' },
      { title: 'Water & Air', color: '#0ea5e9', summary: 'Inland Waterways (NW-1 Ganga); 13 Major Ports (Mumbai, JNPT, Chennai, Ennore, Thoothukudi).', examCue: 'Waterways are the cheapest mode for bulky cargo.' },
      { title: 'Comms & Trade', color: '#10b981', summary: 'INSAT/GSAT satellites, Digital India, Exports vs Imports (Balance of Trade).', examCue: 'Pipelines transport oil & gas safely over long distances.' },
    ],
  },
  'social-geography-06': {
    centralNode: 'Tamil Nadu: Physical Geo',
    mnemonic: 'Highest Peak = Doddabetta (2,637 m) · Only Perennial TN River = Thamirabarani · Rain = NE Monsoon!',
    formulaOrKeyFact: 'Coastline = 1,076 km (2nd Longest in India)  |  Marina = 13 km',
    branches: [
      { title: 'Western & Eastern Ghats', color: '#10b981', summary: 'Nilgiris (Doddabetta), Anamalai, Palani, Cardamom Hills; Javadhu, Servarayan, Kolli & Pachamalai.', examCue: '4 Western Ghat Passes: Palghat, Shencottah, Aralvaimozhi, Achankoil.' },
      { title: 'Plateaus & Plains', color: '#f59e0b', summary: 'Bharamahal, Coimbatore & Madurai Plateaus; Fertile Kaveri Delta & Coromandel Coast.', examCue: 'Pichavaram (Cuddalore) has world’s 2nd largest mangrove forest!' },
      { title: 'Rivers of TN', color: '#0ea5e9', summary: 'Kaveri (Talakaveri → Hogenakkal → Mettur → Grand Anicut → Poompuhar), Palar, Vaigai, Thamirabarani.', examCue: 'Thamirabarani flows perennially into Gulf of Mannar.' },
      { title: 'Climate & Soils', color: '#6366f1', summary: '48% rainfall from Oct–Dec NE Monsoon; Red soil covers >60% of TN.', examCue: 'Know TN Biosphere Reserves: Nilgiri, Gulf of Mannar, Agasthyamalai.' },
    ],
  },
  'social-geography-07': {
    centralNode: 'Tamil Nadu: Human Geo',
    mnemonic: 'Thanjavur = Granary · Tiruppur = Knitwear · Sivakasi = Little Japan · Chennai = Auto & IT!',
    formulaOrKeyFact: '3 Paddy Seasons: Sornavari · Samba · Navarai  |  TNAU Coimbatore',
    branches: [
      { title: 'TN Agriculture', color: '#10b981', summary: 'Paddy (Thanjavur), Cotton, Sugarcane, Nilgiris Tea, Erode Turmeric, Pollachi Coconut.', examCue: 'TN ranks #1 in India for bananas, flowers & wind power.' },
      { title: 'Water Resources', color: '#0ea5e9', summary: 'Mettur, Bhavanisagar, Amaravathi, Vaigai, Mullaiperiyar & Papanasam dams + Eri tanks.', examCue: 'Multipurpose reservoirs support irrigation & hydroelectricity.' },
      { title: 'Industries & Trade', color: '#f59e0b', summary: 'Textiles (Coimbatore/Tiruppur), Leather (Vellore), Auto/IT (Chennai), Cement (Ariyalur), Steel (Salem).', examCue: '3 Major Ports: Chennai, Kamarajar (Ennore), V.O.C. (Thoothukudi).' },
      { title: 'Disaster Readiness', color: '#ef4444', summary: 'Cyclone warning, Landslide safety in Nilgiris, Coastal mangrove buffers & school drills.', examCue: 'NDMA & TNSDMA coordinate rapid emergency response.' },
    ],
  },

  // ═══ SOCIAL SCIENCE — CIVICS (5 CHAPTERS) ═══
  'social-civics-01': {
    centralNode: 'Indian Constitution',
    mnemonic: 'S-S-S-D-R (Sovereign, Socialist, Secular, Democratic, Republic) · Art. 32 = Heart & Soul!',
    formulaOrKeyFact: 'Adopted 26 Nov 1949  |  Enforced 26 Jan 1950  |  6 Rights + 11 Duties',
    branches: [
      { title: 'Framing & Preamble', color: '#6366f1', summary: 'Constituent Assembly (Dr. Rajendra Prasad, Dr. B.R. Ambedkar); 42nd Amendment (1976) = Mini Constitution.', examCue: 'Single Citizenship across all of India.' },
      { title: '6 Fundamental Rights', color: '#0ea5e9', summary: 'Equality (14–18), Freedom (19–22), Exploitation (23–24), Religion (25–28), Culture (29–30), Remedies (32).', examCue: '5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto.' },
      { title: 'DPSP & Duties', color: '#10b981', summary: 'DPSP (Irish model, Part IV) guides welfare; 11 Fundamental Duties (Art. 51A, Swaran Singh).', examCue: 'Right to Education (Art. 21A) for ages 6–14.' },
      { title: 'Centre–State & Emergency', color: '#f59e0b', summary: 'Union, State & Concurrent Lists; Art. 352 (National), 356 (State), 360 (Financial) emergencies.', examCue: 'Official Languages & Sarkaria Commission.' },
    ],
  },
  'social-civics-02': {
    centralNode: 'Central Government',
    mnemonic: 'President = Nominal Head · PM = Real Head · Money Bill = ONLY in Lok Sabha!',
    formulaOrKeyFact: 'Lok Sabha (Max 552, 5 yrs)  |  Rajya Sabha (Max 250, Permanent)  |  SC (1950)',
    branches: [
      { title: 'President & VP', color: '#6366f1', summary: 'President (Art. 52, age ≥35, 5 yrs) = Supreme Commander; Vice President chairs Rajya Sabha.', examCue: 'Art. 72 grants President pardoning powers.' },
      { title: 'PM & Council', color: '#10b981', summary: 'PM (Art. 74–75) leads majority in Lok Sabha; Cabinet collectively responsible to Lok Sabha.', examCue: 'PM is the link between President and Cabinet.' },
      { title: 'Parliament', color: '#0ea5e9', summary: 'Speaker presides over Lok Sabha & certifies Money Bills; 3 sessions (Budget, Monsoon, Winter).', examCue: '1/3rd of Rajya Sabha retires every 2 years.' },
      { title: 'Supreme Court', color: '#f59e0b', summary: 'Original, Appellate, Advisory & Judicial Review powers; Guardian of Constitution.', examCue: 'Attorney General (Art. 76) = Highest law officer.' },
    ],
  },
  'social-civics-03': {
    centralNode: 'State Government',
    mnemonic: 'Governor ↔ President · Chief Minister ↔ Prime Minister · High Court Art. 226 Writs!',
    formulaOrKeyFact: 'TN Assembly = 234 Elected MLAs (Unicameral)  |  Madras HC (1862)',
    branches: [
      { title: 'Governor', color: '#6366f1', summary: 'Appointed by President (age ≥35); summons Assembly, appoints CM & signs State Bills.', examCue: 'Constitutional head of the State Executive.' },
      { title: 'Chief Minister', color: '#10b981', summary: 'Real executive head, forms State Cabinet, directs state policies & welfare schemes.', examCue: 'Collectively responsible to the Legislative Assembly.' },
      { title: 'State Legislature', color: '#0ea5e9', summary: 'Vidhan Sabha (Lower) & Vidhan Parishad (Upper, only in 6 states; TN abolished in 1986).', examCue: 'Legislates on State List & Concurrent List.' },
      { title: 'High Court', color: '#f59e0b', summary: 'Madras High Court (est. 1862, bench at Madurai); protects rights under Art. 226.', examCue: 'Supervises all district & subordinate courts.' },
    ],
  },
  'social-civics-04': {
    centralNode: 'India’s Foreign Policy',
    mnemonic: 'Panchsheel (1954 = 5 Peaceful Rules) · NAM (1961 = Independent Voice) · Art. 51 = World Peace!',
    formulaOrKeyFact: 'Panchsheel (1954)  |  NAM (1961)  |  Look East (1992) → Act East',
    branches: [
      { title: 'Constitutional Base', color: '#6366f1', summary: 'Article 51 directs State to promote international peace, treaty respect & arbitration.', examCue: 'Nehru shaped India’s post-1947 diplomacy.' },
      { title: 'Panchsheel (1954)', color: '#10b981', summary: 'Sovereignty, Non-aggression, Non-interference, Mutual equality, Peaceful coexistence.', examCue: 'Signed between India & China (1954).' },
      { title: 'Non-Aligned Movement', color: '#0ea5e9', summary: 'Founded by Nehru, Tito, Nasser, Sukarno & Nkrumah — independent foreign policy.', examCue: 'Not neutrality — active advocacy for global peace.' },
      { title: 'Modern Strategy', color: '#f59e0b', summary: 'Neighbourhood First, Act East, No-First-Use Nuclear Policy & Anti-Apartheid solidarity.', examCue: 'Balances security with economic diplomacy.' },
    ],
  },
  'social-civics-05': {
    centralNode: 'International Relations',
    mnemonic: 'Neighbours (SAARC/BIMSTEC) · Emerging Powers (BRICS) · Global Peace (UN & ISA)!',
    formulaOrKeyFact: 'SAARC (1985, 8 Members)  |  BRICS (New Dev. Bank)  |  BIMSTEC',
    branches: [
      { title: 'Immediate Neighbours', color: '#10b981', summary: 'Hydro-power (Bhutan), Open border (Nepal), Cultural/Maritime ties (Sri Lanka, Maldives, Bangladesh).', examCue: 'Kaladan Multimodal Project links India & Myanmar.' },
      { title: 'Developed Partners', color: '#0ea5e9', summary: 'USA (Tech/Defence), Russia (Space/Defence), Japan (Shinkansen/Metro), France (Solar/Aviation).', examCue: 'Chabahar Port (Iran) connects India to Central Asia.' },
      { title: 'Regional Blocs', color: '#f59e0b', summary: 'SAARC (Kathmandu HQ), BIMSTEC (Bay of Bengal), ASEAN & SCO.', examCue: 'OPEC coordinates global petroleum supplies.' },
      { title: 'Global Leadership', color: '#6366f1', summary: 'BRICS (Brazil, Russia, India, China, South Africa), G20 & International Solar Alliance.', examCue: 'India champions Global South sustainable growth.' },
    ],
  },

  // ═══ SOCIAL SCIENCE — ECONOMICS (5 CHAPTERS) ═══
  'social-economics-01': {
    centralNode: 'GDP & Economic Growth',
    mnemonic: 'GDP = Inside Borders · GNP = By Nationals (+NFIA) · Tertiary Services = Biggest Share (>53%)!',
    formulaOrKeyFact: 'GDP = C + I + G + (X − M)  |  PCI = National Income / Population',
    branches: [
      { title: 'National Income Terms', color: '#0ea5e9', summary: 'GDP, GNP, NNP (GNP − Depreciation), Per Capita Income & Purchasing Power Parity.', examCue: 'Count ONLY final goods to avoid double counting!' },
      { title: '3 Measurement Methods', color: '#10b981', summary: 'Expenditure (C+I+G+X−M), Income (Rent+Wage+Interest+Profit) & Value-Added Method.', examCue: 'CSO / NSO estimates India’s official GDP.' },
      { title: 'Sectoral Composition', color: '#f59e0b', summary: 'Primary (Agri), Secondary (Industry), Tertiary (Services — largest GDP driver).', examCue: 'Agriculture still employs a large rural share.' },
      { title: 'HDI & GNH', color: '#6366f1', summary: 'HDI (Mahbub ul Haq, 1990) = Life Expectancy + Education + Income; Bhutan = GNH.', examCue: 'Growth = output rise; Development = wellbeing + equity!' },
    ],
  },
  'social-economics-02': {
    centralNode: 'Globalization & Trade',
    mnemonic: '1991 LPG = Liberalisation · Privatisation · Globalisation · WTO (1995, Geneva)!',
    formulaOrKeyFact: 'GATT (1947) → WTO (1 Jan 1995)  |  FDI + MNC Supply Chains',
    branches: [
      { title: 'History of Trade', color: '#f59e0b', summary: 'Ancient Silk Route & South Indian spice/textile ports → European trading companies → Modern MNCs.', examCue: 'Chola & Sangam ports traded across the Indian Ocean.' },
      { title: '1991 Economic Reforms', color: '#0ea5e9', summary: 'Ended License Raj, reduced import tariffs, opened FDI & integrated with world markets.', examCue: 'Spurred IT, telecom & automotive growth.' },
      { title: 'MNCs & WTO', color: '#6366f1', summary: 'MNCs operate production across nations; WTO administers TRIPS, TRIMS & dispute settlement.', examCue: 'Indian MNCs: Tata, Infosys, TVS, Bajaj, Sun Pharma.' },
      { title: 'Fair Globalisation', color: '#10b981', summary: 'Benefits: jobs, tech, choice; Challenges: small-unit competition & wage inequality.', examCue: 'Smart policy protects MSMEs & workers.' },
    ],
  },
  'social-economics-03': {
    centralNode: 'Food Security & Nutrition',
    mnemonic: '3As of Food Security = Availability · Accessibility · Affordability · TN = Universal PDS!',
    formulaOrKeyFact: 'FCI Buffer Stock (MSP)  |  NFSA (2013)  |  TN Universal PDS',
    branches: [
      { title: '3 Pillars & Green Rev.', color: '#10b981', summary: 'HYV seeds & irrigation made India food self-sufficient; FCI buys surplus at MSP.', examCue: 'Buffer stock protects against drought & price spikes.' },
      { title: 'TN Universal PDS', color: '#0ea5e9', summary: 'Unlike targeted PDS elsewhere, Tamil Nadu covers ALL households via Fair Price Shops!', examCue: 'NFSA (2013) guarantees subsidized grains to 75% rural / 50% urban.' },
      { title: 'Purchasing Power', color: '#f59e0b', summary: 'Depends on rural employment, wages, inflation & agricultural productivity.', examCue: 'Multi-dimensional Poverty Index tracks health, schooling & living.' },
      { title: 'Nutrition Programmes', color: '#6366f1', summary: 'ICDS Anganwadis, Puratchi Thalaivar MGR Noon Meal Scheme, Dr. Muthulakshmi Maternity Aid.', examCue: 'Directly reduces stunting, wasting & anemia.' },
    ],
  },
  'social-economics-04': {
    centralNode: 'Government & Taxes',
    mnemonic: 'Direct Tax = You Pay Directly (Income) · Indirect Tax = Passed to Buyer (GST 1 July 2017)!',
    formulaOrKeyFact: 'Progressive Tax (Rate ↑ as Income ↑)  |  GST = CGST + SGST / IGST',
    branches: [
      { title: 'Why Taxes Matter', color: '#6366f1', summary: 'Fund public schools, hospitals, highways, defence, clean water & welfare safety nets.', examCue: 'Adam Smith’s 4 Canons: Equity, Certainty, Convenience, Economy.' },
      { title: 'Direct Taxes', color: '#10b981', summary: 'Income Tax, Corporate Tax, Wealth Tax — burden cannot be shifted; Progressive rates.', examCue: 'Direct taxes reduce income inequality.' },
      { title: 'Indirect Taxes & GST', color: '#0ea5e9', summary: 'GST (1 July 2017) unified excise/VAT/service tax ("One Nation, One Market, One Tax").', examCue: 'GST eliminates cascading tax-on-tax.' },
      { title: 'Black Money & Integrity', color: '#ef4444', summary: 'Unaccounted income drains public welfare; digital trails & tax compliance strengthen growth.', examCue: 'Distinguish Tax Avoidance vs illegal Tax Evasion.' },
    ],
  },
  'social-economics-05': {
    centralNode: 'TN Industrial Clusters',
    mnemonic: 'Chennai (Auto/IT) · Coimbatore (Textiles/Pumps) · Tiruppur (Knitwear) · Sivakasi (Print/Matches)!',
    formulaOrKeyFact: 'SIPCOT (1971) · TIDCO · TANSIDCO · TIIC · MSME Hub',
    branches: [
      { title: 'Why Clusters Thrive', color: '#6366f1', summary: 'Shared skilled labour, suppliers, logistics & knowledge spillovers cut business costs.', examCue: 'TN combines traditional artisan hubs with modern factories.' },
      { title: 'Auto, IT & Electronics', color: '#0ea5e9', summary: 'Chennai–Sriperumbudur–Hosur ("Detroit of Asia"), ICF Perambur, TIDEL Park IT corridors.', examCue: 'Strong port, rail & engineering-college ecosystem.' },
      { title: 'Textiles & Leather', color: '#10b981', summary: 'Coimbatore (spinning/wet grinders), Tiruppur (cotton knitwear exports), Karur (home textiles), Vellore (leather).', examCue: 'Tiruppur accounts for a massive share of India’s knitwear exports!' },
      { title: 'Policy Agencies', color: '#f59e0b', summary: 'SIPCOT (industrial parks), TANSI, GUIDANCE TN & Start-up TN nurture entrepreneurs.', examCue: 'SEZs promote export-oriented manufacturing.' },
    ],
  },

  // ═══ ENGLISH (7 CHAPTERS) ═══
  'english-01': {
    centralNode: 'Unit 1: Flight, Life & Tempest',
    mnemonic: 'Seagull = Hunger Beats Fear · Life (Van Dyke) = Forward Hope · Tempest = Mercy Beats Revenge!',
    formulaOrKeyFact: 'Liam O’Flaherty (Prose)  |  Henry Van Dyke (Sonnet)  |  Shakespeare (Tempest)',
    branches: [
      { title: 'His First Flight', color: '#0ea5e9', summary: 'Timid young seagull overcomes terror when mother holds mackerel out of reach — discovers his wings!', examCue: 'Theme: Self-confidence & parent’s tough love.' },
      { title: 'Life (14-Line Sonnet)', color: '#f59e0b', summary: 'Walk forward gladly without mourning past or fearing future — "road’s last turn will be the best".', examCue: 'Rhyme: abba abba cdd cee; Antithesis & Metaphor.' },
      { title: 'The Tempest', color: '#6366f1', summary: 'Exiled Duke Prospero & Ariel conjure storm, unite Miranda & Ferdinand, and forgive repentant enemies.', examCue: 'Quote: Forgiveness is nobler than vengeance.' },
      { title: 'Grammar Focus', color: '#10b981', summary: 'Modals (can, must, ought to), Active ↔ Passive Voice & Parts of Speech forms.', examCue: 'Watch passive verb agreement (is/was + V3).' },
    ],
  },
  'english-02': {
    centralNode: 'Unit 2: Ghost, Grumble & Zigzag',
    mnemonic: 'Ghost = Comic Misunderstanding · Grumble = Stay Positive · Zigzag = Right Place Unlocks Talent!',
    formulaOrKeyFact: 'James Thurber  |  L.M. Montgomery  |  Asha Nehemiah',
    branches: [
      { title: 'Night the Ghost Got In', color: '#6366f1', summary: 'Midnight footsteps spark shoe-throwing, police raid & Grandfather’s Civil War attic panic — he just wanted water!', examCue: 'Humorous escalating chain of confusion.' },
      { title: 'The Grumble Family', color: '#ef4444', summary: 'Lives on Complaining Street; weather is always too hot or cold — moral: keep smiling & walk away from pessimism!', examCue: 'Epithet & Anaphora poetic devices.' },
      { title: 'Zigzag (Supplementary)', color: '#10b981', summary: 'Snoring African bird ruins painting at home, then becomes disciplined star helper at Dr. Krishnan’s noisy clinic!', examCue: 'Every quirky ability shines in the right environment.' },
      { title: 'Grammar Focus', color: '#0ea5e9', summary: 'Articles (a/an/the), Prepositional Phrases & Plural Noun forms.', examCue: 'Check vowel SOUND (an hour, a university).' },
    ],
  },
  'english-03': {
    centralNode: 'Unit 3: Empowered Women',
    mnemonic: 'INSV Tarini = 6 Navy Women · 254 Days · 21,600 NM · Mulan = Courage + Wisdom!',
    formulaOrKeyFact: 'Navika Sagar Parikrama (2017–18)  |  Rakhi Nariani Shirke  |  Mulan',
    branches: [
      { title: 'INSV Tarini Voyage', color: '#0ea5e9', summary: 'Lt. Cdr. Vartika Joshi & 5 officers circumnavigated globe relying purely on wind, skill & teamwork.', examCue: 'Honoured with Nari Shakti Puraskar; collected IMD ocean data.' },
      { title: 'I am Every Woman', color: '#ec4899', summary: 'Celebrates woman’s persistence, innate beauty, fearless self-respect ("Don’t mess with her!").', examCue: 'Metaphor: "She is a lioness" — strength + grace.' },
      { title: 'The Story of Mulan', color: '#f59e0b', summary: 'Disguises herself to save her ailing father, rises to General, wins victory via clever strategy & earns Emperor’s respect.', examCue: 'Courage & filial devotion transcend gender barriers.' },
      { title: 'Grammar Focus', color: '#10b981', summary: 'Tenses (12 forms), Idioms & Phrases, Slogan writing.', examCue: 'Match time markers (since/for → Perfect Continuous).' },
    ],
  },
  'english-04': {
    centralNode: 'Unit 4: Attic, Ant & Aged Mother',
    mnemonic: 'Attic = Honesty Heals 29-Yr Guilt · Ant = Plan Ahead · Aged Mother = Elders’ Wisdom Saves All!',
    formulaOrKeyFact: 'Satyajit Ray  |  Aesop Fable  |  Matsuo Basho',
    branches: [
      { title: 'The Attic', color: '#f59e0b', summary: 'Aditya confesses stealing Sanyal’s 1948 silver medal 29 years ago and returns it from the Bramhapur attic.', examCue: 'Sanyal refuses ₹150 cash — dignity > money.' },
      { title: 'Ant and the Cricket', color: '#10b981', summary: 'Cricket sings all summer and starves in winter; Ant teaches diligent foresight & preparation.', examCue: 'Fable with closing couplet applying to humans too.' },
      { title: 'The Aged Mother', color: '#6366f1', summary: 'Kind farmer hides his mother instead of abandoning her on Obatsuyama; her "rope of ashes" wisdom abolishes the cruel decree!', examCue: 'Mother drops twigs along the mountain trail so her son won’t get lost.' },
      { title: 'Grammar Focus', color: '#0ea5e9', summary: 'Conjunctions (Coordinating/Subordinating), Nominalisation & Compound Words.', examCue: 'Though/Although never pairs with "but"!' },
    ],
  },
  'english-05': {
    centralNode: 'Unit 5: Tech & Machines',
    mnemonic: 'Tech Bloomers = Assistive Freedom · Kipling = Machines Serve, Never Love · 2889 = Sci-Fi Vision!',
    formulaOrKeyFact: 'Dragon Dictate & Liberator  |  Rudyard Kipling  |  Jules Verne',
    branches: [
      { title: 'Tech Bloomers', color: '#0ea5e9', summary: 'Alisha (Dragon Dictate) & David (Liberator/ECO2 eye-gaze) conquer barriers with Kim’s assistive tech.', examCue: 'Inclusion empowers every learner equally.' },
      { title: 'Secret of the Machines', color: '#f59e0b', summary: 'Forged from ore, machines haul, fly & compute 24/7 — yet lack pity, love, or forgiveness; humans remain masters.', examCue: 'Personification & Hyperbole ("stars will shine again").' },
      { title: 'A Day in 2889', color: '#6366f1', summary: 'Francis Bennett edits the Earth Herald via phonotelephote video, aero-cars & cloud advertisements.', examCue: 'Written in 1889 — predicted video calls & solar power!' },
      { title: 'Grammar Focus', color: '#10b981', summary: 'Pronouns, Reported Speech (Direct ↔ Indirect) & Abbreviations/Acronyms.', examCue: 'Backshift verb tenses when reporting verb is past.' },
    ],
  },
  'english-06': {
    centralNode: 'Unit 6: Language & Unity',
    mnemonic: 'Last Lesson = Mother Tongue Is Key to Freedom · No Men Foreign = One Humanity · Peter = Civic Duty!',
    formulaOrKeyFact: 'Alphonse Daudet  |  James Kirkup  |  Mary Mapes Dodge',
    branches: [
      { title: 'The Last Lesson', color: '#0ea5e9', summary: 'Berlin bans French in Alsace; Franz regrets past laziness as M. Hamel writes "Vive La France!" after 40 years.', examCue: 'We value treasures most when we risk losing them.' },
      { title: 'No Men Are Foreign', color: '#10b981', summary: 'Uniforms differ, yet every human shares one sun, air, labour & earth; hating others defiles our own home.', examCue: 'Transferred Epithet ("peaceful harvests", "war’s long winter").' },
      { title: 'Little Hero of Holland', color: '#f59e0b', summary: 'Young Peter plugs a leaking dike hole with his bare arm all freezing night to save his town from flooding.', examCue: 'Courageous civic duty even at a young age.' },
      { title: 'Grammar Focus', color: '#6366f1', summary: 'Subject–Verb Agreement, Non-Finite Verbs (Gerund/Infinitive/Participle).', examCue: '"Neither…nor" agrees with the nearer subject.' },
    ],
  },
  'english-07': {
    centralNode: 'Unit 7: Mystery & Deduction',
    mnemonic: 'Holmes Feigns Illness → Ivory Box Clue → Watson Hides → Gas Lamp Signal → Smith Caught!',
    formulaOrKeyFact: 'Arthur Conan Doyle  |  Nadia Bush  |  Silas Weir Mitchell',
    branches: [
      { title: 'The Dying Detective', color: '#f59e0b', summary: 'Sherlock Holmes fakes fatal Sumatran fever to trick murderer Culverton Smith into confessing before hidden Watson & Inspector Morton.', examCue: 'Turning up the gas lamp was Holmes’s arrest signal!' },
      { title: 'House on Elm Street', color: '#6366f1', summary: 'Mysterious silent house with bare tree that never grows leaves — stays an intriguing unsolved enigma.', examCue: 'Synecdoche & Rhetorical Question.' },
      { title: 'A Dilemma', color: '#ef4444', summary: 'Uncle Philip wills Tom a box of precious rubies booby-trapped with dynamite — Tom chooses peace & safety over fatal greed.', examCue: 'Clever moral on obsession and wisdom.' },
      { title: 'Grammar Focus', color: '#10b981', summary: 'Simple, Compound & Complex Sentence Transformation + Punctuation.', examCue: 'Simple = 1 finite verb; Compound = FANBOYS; Complex = Subordinator.' },
    ],
  },

  // ═══ TAMIL (7 இயல்கள்) ═══
  'tamil-01': {
    centralNode: 'இயல் 1: அமுதஊற்று',
    mnemonic: 'மொழி = 3 (தனி, தொடர், பொது) · தொழிற்பெயர் = தல்/அல் விகுதி · தமிழ்ச்சொல் வளம் = பாவாணர்!',
    formulaOrKeyFact: 'எழுத்து + சொல் · அன்னை மொழியே (பாவலரேறு பெருஞ்சித்திரனார்)',
    branches: [
      { title: 'அன்னை மொழியே', color: '#f59e0b', summary: 'செந்தமிழின் பெருமை, பாண்டியன் மகள், எட்டுத்தொகை, பத்துப்பாட்டு & திருக்குறள் சிறப்பு.', examCue: 'ஆசிரியர்: பாவலரேறு பெருஞ்சித்திரனார் (கனிச்சாறு).' },
      { title: 'தமிழ்ச்சொல் வளம்', color: '#10b981', summary: 'தேவநேயப் பாவாணர்: அடிவகை, கிளை, இலை, பூ, காய், தானியம் ஆகியவற்றுக்கான நுட்பமான தமிழ்ச் சொற்கள்.', examCue: 'நாடும் மொழியும் நமது இரு கண்கள்.' },
      { title: 'காலக்கணிதம் & தோணி', color: '#0ea5e9', summary: 'கண்ணதாசன் கவிஞர் மாண்பு & ப. சிங்காரத்தின் "புயலிலே ஒரு தோணி" (கடற்பயண அனுபவம்).', examCue: 'மாற்றம் எனது மானிடத் தத்துவம் — கண்ணதாசன்.' },
      { title: 'எழுத்து & சொல் இலக்கணம்', color: '#6366f1', summary: 'உயிரளபெடை (3 வகை), ஒற்றளபெடை, மூவகை மொழி, முதனிலை & எதிர்மறைத் தொழிற்பெயர்.', examCue: 'செய்யுளிசை (இசைநிறை), இன்னிசை, சொல்லிசை அளபெடை!' },
    ],
  },
  'tamil-02': {
    centralNode: 'இயல் 2: உயிரின் ஓசை',
    mnemonic: 'காற்று 4 திசை: கொண்டல்(கிழக்கு) · கோடை(மேற்கு) · வாடை(வடக்கு) · தென்றல்(தெற்கு)!',
    formulaOrKeyFact: 'தொகாநிலைத் தொடர்கள் = 9 வகை · முல்லைப்பாட்டு (நப்பூதனார்)',
    branches: [
      { title: 'கேட்கிறதா என் குரல்', color: '#0ea5e9', summary: 'காற்றின் 4 பெயர்கள், பருவக்காற்று (ஹிப்பாலஸ்), காற்றாலை ஆற்றல் & மாசுபாட்டைத் தடுத்தல்.', examCue: 'உயிர்வளி (O₂) காக்க மரங்கள் நடுவோம்.' },
      { title: 'காற்றே வா & முல்லைப்பாட்டு', color: '#10b981', summary: 'பாரதியாரின் வசன கவிதை & நப்பூதனாரின் முல்லைப்பாட்டு (மழைக்கால விரிச்சி கேட்டல்).', examCue: 'முல்லைப்பாட்டு பத்துப்பாட்டில் மிகக் குறைந்த அடிகள் (103).' },
      { title: 'புயலிலே / பிரும்மம்', color: '#f59e0b', summary: 'இயற்கையின் வலிமை & மனிதக் கலை நுட்பம் வெளிப்படுத்தும் உரைநடை.', examCue: 'இயற்கைச் சமநிலையைப் பேணுதல்.' },
      { title: 'தொகாநிலைத் தொடர்கள் (9)', color: '#6366f1', summary: 'எழுவாய், விளி, வினைமுற்று, பெயரெச்ச, வினையெச்ச, வேற்றுமை, இடைச்சொல், உரிச்சொல், அடுக்குத்தொடர்.', examCue: 'உருபு மறையாமல் வெளிப்படையாக வருவது தொகாநிலை!' },
    ],
  },
  'tamil-03': {
    centralNode: 'இயல் 3: கூட்டாஞ்சோறு',
    mnemonic: 'தொகைநிலை = 6 (வேற்றுமை, வினை, பண்பு, உவமை, உம்மை, அன்மொழி) · விருந்தோம்பல் = தமிழர் பண்பாடு!',
    formulaOrKeyFact: 'விருந்து போற்றுதும் · காசிக்காண்டம் · மலைபடுகடாம் · திருக்குறள்',
    branches: [
      { title: 'விருந்து போற்றுதும்!', color: '#f59e0b', summary: 'அல்லில் ஆயினும் விருந்து வரின் உவக்கும் தமிழர் பண்பாடு & வாழை இலை விருந்து.', examCue: 'தொல்காப்பியம் & புறநானூறு சான்றுகள்.' },
      { title: 'காசிக்காண்டம் & பிள்ளைத்தமிழ்', color: '#ec4899', summary: 'அதிவீரராம பாண்டியர் (விருந்தோம்பல் 9 ஒழுக்கம்) & குமரகுருபரர் (முத்துக்குமாரசாமி).', examCue: 'பிள்ளைத்தமிழ் = 10 பருவங்கள் (100 பாடல்கள்).' },
      { title: 'கோபல்லபுரத்து மக்கள்', color: '#10b981', summary: 'கி. ராஜநாராயணன் (சாகித்திய அகாதெமி) — கரிசல் நில கிராமத்து விருந்தோம்பல்.', examCue: 'கரிசல் இலக்கியத்தின் தந்தை — கி.ரா.' },
      { title: 'தொகைநிலைத் தொடர் (6)', color: '#6366f1', summary: 'வேற்றுமை, வினைத்தொகை (முக்காலம்: ஊறுகாய்), பண்புத்தொகை, உவமை, உம்மை, அன்மொழித்தொகை.', examCue: 'உருபு மறைந்து வருவது தொகைநிலை!' },
    ],
  },
  'tamil-04': {
    centralNode: 'இயல் 4: மணற்கேணி',
    mnemonic: 'ஐம்பால் = உயர்திணை 3 + அஃறிணை 2 · வழு (பிழை) → வழாநிலை (சரி) · வழுவமைதி = 5!',
    formulaOrKeyFact: 'மொழிபெயர்ப்புக் கல்வி · திருவிளையாடற் புராணம் · இலக்கணம் பொது',
    branches: [
      { title: 'மொழிபெயர்ப்புக் கல்வி', color: '#0ea5e9', summary: 'அறிவியல் & இலக்கியப் பாலம்; இடம்பார்த்துப் பொருள் மாறாமல் மொழிபெயர்த்தல் (பாரதியார்: Exhibition → காட்சி).', examCue: 'Camel = வடம் (கயிறு) / ஒட்டகம் — சூழல் பொருள் முக்கியம்!' },
      { title: 'திருவிளையாடற் புராணம்', color: '#f59e0b', summary: 'பரஞ்சோதி முனிவர்: இடைக்காடனார் பிணக்குத் தீர்த்த படலம் — புலமைக்கு இறைவனே தலைவணங்கும் சிறப்பு.', examCue: 'பாண்டிய மன்னன் குலேச பாண்டியன் & புலவர் இடைக்காடனார்.' },
      { title: 'புதிய நம்பிக்கை', color: '#10b981', summary: 'கமலாலயன் (மேரி மெக்லியோட் பெத்யூன் வாழ்க்கை) — கல்வி தடைகளை உடைக்கும் ஆயுதம்.', examCue: 'எழுத்தறிவு சமூக விடுதலையின் திறவுகோல்.' },
      { title: 'இலக்கணம் – பொது', color: '#6366f1', summary: 'இருதிணை, ஐம்பால், மூவிடம், வழு–வழாநிலை (7), ஐந்து வகை வழுவமைதி (திணை, பால், இடம், கால, மரபு).', examCue: '"கத்தும் குயிலோசை" = மரபு வழுவமைதி!' },
    ],
  },
  'tamil-05': {
    centralNode: 'இயல் 5: நிலா முற்றம்',
    mnemonic: 'ஐந்திணை = குறிஞ்சி(மலை) · முல்லை(காடு) · மருதம்(வயல்) · நெய்தல்(கடல்) · பாலை(சுரம்)!',
    formulaOrKeyFact: 'அகப்பொருள் = முதற்பொருள் (நிலம்+பொழுது) + கருப்பொருள் + உரிப்பொருள்',
    branches: [
      { title: 'பன்முகக் கலைஞர்', color: '#f59e0b', summary: 'நிகழ்கலைகள் (கரகாட்டம், மயிலாட்டம், தெருக்கூத்து) & தமிழ் நாடக/கலை மரபு.', examCue: 'கலை சமூக விழிப்புணர்வையும் மகிழ்வையும் தரும்.' },
      { title: 'கம்பராமாயணம்', color: '#6366f1', summary: 'கம்பர் ("கல்வியில் பெரியர் கம்பர்"): சந்த நயம், இயற்கை வருணனை & சகோதரப் பாசம்.', examCue: 'விருத்தம் என்னும் ஒண்பாவிற்கு உயர் கம்பன்!' },
      { title: 'பாய்ச்சல் (சிறுகதை)', color: '#10b981', summary: 'சா. கந்தசாமி — அனுமன் வேடக் கலைஞரிடம் சிறுவன் அழகு கற்கும் கலை ஆர்வம்.', examCue: 'கலைஞனின் அர்ப்பணிப்பும் உயிரோட்டமும்.' },
      { title: 'அகப்பொருள் இலக்கணம்', color: '#0ea5e9', summary: '5 நிலங்கள், 6 பெரும்பொழுதுகள் (கார்..பின்பனி), 6 சிறுபொழுதுகள் (காலை..வைகறை).', examCue: 'முதற்பொருள் = நிலமும் பொழுதும்!' },
    ],
  },
  'tamil-06': {
    centralNode: 'இயல் 6: விதை நெல்',
    mnemonic: 'புறத்திணை = 12 (வெட்சி..பாடாண், பொதுவியல், கைக்கிளை, பெருந்திணை) · சிலப்பதிகாரம் = முத்தமிழ்க் காப்பியம்!',
    formulaOrKeyFact: 'சிற்றகல் ஒளி (ம.பொ.சி) · சிலப்பதிகாரம் (இளங்கோவடிகள்) · புறப்பொருள்',
    branches: [
      { title: 'சிற்றகல் ஒளி', color: '#f59e0b', summary: 'ம.பொ. சிவஞானம் (சிலம்புச் செல்வர்) — ஏழ்மையிலும் நூல் வாசிப்பால் உயர்ந்த தன்வரலாறு.', examCue: 'எல்லைப் போராட்டத்தில் திருத்தணியை மீட்டவர் ம.பொ.சி!' },
      { title: 'சிலப்பதிகாரம் & முத்தொள்ளாயிரம்', color: '#ec4899', summary: 'மருவூர்ப்பாக்கம் வணிக வளம் (இளங்கோவடிகள்); சேர, சோழ, பாண்டியர் நாட்டு வளம்.', examCue: 'குடிமக்கள் காப்பியம் = சிலப்பதிகாரம்.' },
      { title: 'மங்கையராய்ப் பிறப்பதற்கே', color: '#10b981', summary: 'எம்.எஸ். சுப்புலட்சுமி, பாலசரசுவதி, ராஜம் கிருஷ்ணன், கிருஷ்ணம்மாள் & சின்னப்பிள்ளை சாதனைகள்.', examCue: 'பெண்களின் இசை, இலக்கியம் & சமூகப் பங்களிப்பு.' },
      { title: 'புறப்பொருள் இலக்கணம்', color: '#6366f1', summary: 'வெட்சி (நிரை கவர்தல்), கரந்தை (மீட்டல்), வஞ்சி, காஞ்சி, நொச்சி, உழிஞை, தும்பை, வாகை, பாடாண்.', examCue: 'புறத்திணை மொத்தம் 12 வகை!' },
    ],
  },
  'tamil-07': {
    centralNode: 'இயல் 7: பெருவழி',
    mnemonic: 'வெண்பா = செப்பலோசை · ஆசிரியப்பா = அகவலோசை · நேரசை (குறில்/நெடில்) · நிரையசை (இருகுறில்)!',
    formulaOrKeyFact: 'சங்க அறம் · தேம்பாவணி (வீரமாமுனிவர்) · இராமானுசர் · யாப்பு & அலகிடுதல்',
    branches: [
      { title: 'சங்க இலக்கிய அறம்', color: '#10b981', summary: 'அறம் அறக்கண்ட நெறிமான் அவையம் — வணிகம், அரசியல், போர் அனைத்திலும் அறநெறி.', examCue: 'இம்மைச் செய்தது மறுமைக்கு ஆம் எனும் அறவிலை வணிகன் அல்லன்!' },
      { title: 'தேம்பாவணி & அக்கறை', color: '#0ea5e9', summary: 'வீரமாமுனிவர் (கருணையன் தாய் எலிசபெத் மறைவு) & கல்யாண்ஜி கவிதை.', examCue: 'தேம்பாவணி = வாடாத மாலை (3,615 பாடல்கள்).' },
      { title: 'இராமானுசர் நாடகம்', color: '#f59e0b', summary: 'திருக்கோட்டியூர் கோபுரத்தின் மீது நின்று அனைவருக்கும் மந்திரம் உரைத்த சமூக சமத்துவம்.', examCue: 'மக்கள் அனைவரும் உய்ய வேண்டும் என்ற பெருநோக்கு.' },
      { title: 'யாப்பு & அலகிடுதல்', color: '#6366f1', summary: 'வெண்பா (ஈற்றடி முச்சீர்: நாள், மலர், காசு, பிறப்பு) & அலகிட்டு வாய்பாடு காணுதல்.', examCue: 'திருக்குறள் அலகிடுதல் = உறுதியான 3/5 மதிப்பெண் வினா!' },
    ],
  },
};

export function getChapterMindMap(unitId: string): ChapterMindMapSpec {
  return (
    CHAPTER_MIND_MAPS[unitId] ?? {
      centralNode: 'Chapter Concept Map',
      mnemonic: 'Connect Visual Model → Key Formula/Rule → Worked Example → Self Check!',
      formulaOrKeyFact: 'Tamil Nadu State Board Class 10 Curriculum',
      branches: [
        { title: 'Core Visual Concept', color: '#0ea5e9', summary: 'Explore the 3D/2D interactive model first to build spatial intuition.', examCue: 'Predict before sliding controls.' },
        { title: 'Definitions & Rules', color: '#10b981', summary: 'Summarize key textbook definitions in your own crisp words.', examCue: 'Underline keywords & units.' },
        { title: 'Worked Application', color: '#f59e0b', summary: 'Connect equations, dates, or diagrams directly to real-world examples.', examCue: 'Always verify units and labels.' },
        { title: 'Active Recall', color: '#6366f1', summary: 'Test yourself with flashcards and untimed concept checks.', examCue: 'Spaced repetition locks memory.' },
      ],
    }
  );
}
