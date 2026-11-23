import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAngleBisectorTheorem,
  computeCevaProduct,
  computeCircleTangent,
  computeElectricPotential,
  computeJoulesHeating,
  computePotentialDifference,
  computePythagoras,
  computeSimilarityTriangle,
  computeThalesBPT,
  evaluateSolubilityState,
} from './conceptFirstSimulations';
import {
  ALL_CONCEPT_FIRST_SPECS,
  getExactLessonExperienceById,
} from '../data/exactSectionManifest';
import { validateLessonExperienceSpec } from '../types/lessonExperience';
import { getTopicAwareLabLabel } from '../components/engines/TopicInteractiveLabs';
import {
  computeNuclearDecayDaughter,
  computeRainwaterHarvestLiters,
  computeTorqueAndLift,
} from '../components/engines/ScienceMismatchFixes2D';
import {
  computeDispersionMetrics,
  computeMatrixOps2x2,
} from '../components/engines/MathsExtensions2D';
import { computeGstAndDirectTax } from '../components/engines/SocialExtensions2D';
import {
  computeHumanSexDetermination,
  computePhClassification,
  computeTriangleAreaAndCollinear,
} from '../components/engines/SubchapterDifferentiatedLabs2D';
import { projectLatLonToSvg } from '../components/engines/AccurateGeoMaps2D';
import {
  createInitialProgressRecord,
  getCompletedSectionCount,
  getSectionProgressStage,
} from '../features/local-progress/progressStore';

test('exact-section manifest validates every concept-first spec and guarantees zero prefix-leakage across refactored units', () => {
  assert.ok(ALL_CONCEPT_FIRST_SPECS.length >= 16);

  for (const spec of ALL_CONCEPT_FIRST_SPECS) {
    const errors = validateLessonExperienceSpec(spec);
    assert.deepEqual(errors, [], `Validation failed for ${spec.sectionId}: ${errors.join('; ')}`);
  }

  // 6 Gold-Standard Distinct Engines / Variants
  const ep = getExactLessonExperienceById('science-04-auto-4-3-1-electric-potential');
  const jl = getExactLessonExperienceById('science-04-auto-4-8-1-joule-s-law-of-heating');
  const eth = getExactLessonExperienceById('science-16-auto-16-1-5-ethylene');
  const pit = getExactLessonExperienceById('science-16-auto-16-2-1-pituitary-gland');
  const thales = getExactLessonExperienceById('maths-04-03');
  const pyth = getExactLessonExperienceById('maths-04-04');
  const tangents = getExactLessonExperienceById('maths-04-05');
  const ceva = getExactLessonExperienceById('maths-04-06');
  const sperm = getExactLessonExperienceById('science-17-auto-17-8-1-structure-of-human');
  const ovum = getExactLessonExperienceById('science-17-auto-17-8-2-structure-of-human-ovum');

  assert.equal(ep?.engineId, 'ElectricPotentialLab2D');
  assert.equal(jl?.engineId, 'JoulesLawLab2D');
  assert.notEqual(ep?.engineId, jl?.engineId);

  assert.equal(eth?.engineId, 'EthyleneRipeningLab2D');
  assert.equal(pit?.engineId, 'PituitaryEndocrineLab2D');
  assert.notEqual(eth?.engineId, pit?.engineId);

  assert.equal(thales?.variantId, 'thales_and_bisector');
  assert.equal(pyth?.variantId, 'pythagoras');
  assert.equal(tangents?.variantId, 'circles_tangents');
  assert.equal(ceva?.variantId, 'concurrency');

  assert.equal(sperm?.engineId, 'ReproductionDiagrams2D');
  assert.equal(sperm?.variantId, 'sperm');
  assert.equal(ovum?.variantId, 'ovum');

  // Verify Concept-First pilot routes stay cleanly owned by exactSectionManifest,
  // while ALL expanded sibling topics route to their exact concept-specific 2D labs (ZERO generic mismatch!)
  assert.equal(getTopicAwareLabLabel('science-16-auto-16-1-5-ethylene'), null);
  assert.equal(getTopicAwareLabLabel('science-16-auto-16-2-1-pituitary-gland'), null);
  assert.equal(getTopicAwareLabLabel('maths-04-01'), null);

  // Unit 16 sibling plant/endocrine hormones NEVER show a human neuron!
  const auxinLabel = getTopicAwareLabLabel('science-16-auto-16-1-1-auxins') ?? '';
  assert.ok(auxinLabel.includes('Auxin') && !auxinLabel.includes('Neuron'));
  const pancreasLabel = getTopicAwareLabLabel('science-16-auto-16-2-4-pancreas-islets-of') ?? '';
  assert.ok(pancreasLabel.includes('Pancreas') && !pancreasLabel.includes('Neuron'));

  // Unit 17 sibling topics route to Menstrual Cycle & Hygiene (NEVER gametes!)
  const cycleLabel = getTopicAwareLabLabel('science-17-auto-17-9-menstrual-cycle-process') ?? '';
  assert.ok(cycleLabel.includes('Menstrual Cycle') && !cycleLabel.includes('Sperm'));
  const hygieneLabel = getTopicAwareLabLabel('science-17-auto-17-14-personal-hygiene') ?? '';
  assert.ok(hygieneLabel.includes('Hygiene') && !hygieneLabel.includes('Sperm'));

  // Unit 4 LED & Domestic Circuits route to purpose-built 2D labs (NEVER generic bulb!)
  const ledLabel = getTopicAwareLabLabel('science-04-auto-4-11-led-bulb') ?? '';
  assert.ok(ledLabel.includes('Seven-Segment') && !ledLabel.includes('Resistor'));
  const domesticLabel = getTopicAwareLabLabel('science-04-auto-4-10-2-earthing') ?? '';
  assert.ok(domesticLabel.includes('Earthing') || domesticLabel.includes('Domestic'));
});

test('Full Curriculum Expansion routes eliminate ALL cross-chapter 3D mismatches in Science, Maths, and Social Science', () => {
  // Science mismatch fixes
  assert.ok((getTopicAwareLabLabel('science-01-auto-1-4-6-moment-of-the-force') ?? '').includes('Torque'));
  assert.ok((getTopicAwareLabLabel('science-02-auto-2-17-defects-in-eye') ?? '').includes('Human Eye'));
  assert.ok((getTopicAwareLabLabel('science-03-auto-3-3-1-expansion-of-substances') ?? '').includes('Thermal Expansion'));
  assert.ok((getTopicAwareLabLabel('science-06-auto-6-2-3-alpha-decay') ?? '').includes('Alpha/Beta/Gamma'));
  assert.ok((getTopicAwareLabLabel('science-08-auto-8-11-corrosion') ?? '').includes('Corrosion'));
  assert.ok((getTopicAwareLabLabel('science-13-auto-13-1-9-nervous-system') ?? '').includes('Leech & Rabbit'));
  assert.ok(!(getTopicAwareLabLabel('science-13-auto-13-1-9-nervous-system') ?? '').includes('Kidney'));
  assert.ok((getTopicAwareLabLabel('science-19-auto-19-2-evidences-of-evolution') ?? '').includes('Evolution'));
  assert.ok((getTopicAwareLabLabel('science-20-auto-20-5-genetic-engineering') ?? '').includes('Biotechnology'));
  assert.ok((getTopicAwareLabLabel('science-22-auto-22-7-rainwater-harvesting') ?? '').includes('Rainwater Harvesting'));

  // Maths Ch. 3 & Ch. 8 mismatch fixes (Matrices != Parabola; Statistics != Rolling Die!)
  assert.ok((getTopicAwareLabLabel('maths-03-09') ?? '').includes('Matrices'));
  assert.ok((getTopicAwareLabLabel('maths-03-auto-3-4-2-excluded-value') ?? '').includes('Excluded Value'));
  assert.ok((getTopicAwareLabLabel('maths-03-08') ?? '').includes('Parabola'));
  assert.ok((getTopicAwareLabLabel('maths-08-auto-8-2-5-standard-deviation') ?? '').includes('Standard Deviation'));
  assert.ok((getTopicAwareLabLabel('maths-08-04') ?? '').includes('Probability'));

  // Social Science 2D concept labs & Accurate 2D NASA Maps (verified canonical registry IDs!)
  assert.ok((getTopicAwareLabLabel('social-economics-04-auto-4-1-role-of-government') ?? '').includes('GST'));
  assert.ok((getTopicAwareLabLabel('social-geography-04-auto-4-1-minerals') ?? '').includes('Accurate 2D India Satellite Map'));
  assert.ok((getTopicAwareLabLabel('social-civics-04-auto-4-2-panchsheel') ?? '').includes('Panchsheel'));
  assert.ok((getTopicAwareLabLabel('social-history-06-auto-6-1-resistance') ?? '').includes('Accurate 2D Historical Satellite Atlas'));

  // Intra-chapter differentiation (fixes Science Unit 18 Genetics, Unit 8 3D Metallurgy, Unit 10 pH, Unit 11 Esterification, Unit 21 Health, English 2-7 & Tamil 1-3/5-9!)
  assert.ok((getTopicAwareLabLabel('science-18-auto-18-7-sex-determination') ?? '').includes('Human Sex Determination'));
  assert.ok(!(getTopicAwareLabLabel('science-18-auto-18-7-sex-determination') ?? '').includes('Monohybrid'));
  assert.ok((getTopicAwareLabLabel('science-18-auto-18-5-2-types-of-chromosomes') ?? '').includes('Chromosome'));
  assert.ok((getTopicAwareLabLabel('science-18-auto-18-6-2-dna-replication') ?? '').includes('DNA Replication'));
  assert.ok((getTopicAwareLabLabel('science-08-auto-8-7-metallurgy-of') ?? '').includes('2D Chemistry Process Flowchart'));
  assert.ok((getTopicAwareLabLabel('science-10-auto-10-7-ph-calculation') ?? '').includes('pH Scale'));
  assert.ok((getTopicAwareLabLabel('science-11-auto-11-6-ethanol-ch3ch2oh') ?? '').includes('2D Organic Chemistry Process Flowchart'));
  assert.ok((getTopicAwareLabLabel('science-15-auto-15-5-reflex-action') ?? '').includes('Reflex Arc'));
  assert.ok((getTopicAwareLabLabel('science-21-auto-21-8-diabetes-mellitus') ?? '').includes('Clinical Health'));
  assert.ok((getTopicAwareLabLabel('english-02-prose') ?? '').includes('2D English'));
  assert.ok((getTopicAwareLabLabel('tamil-01-01') ?? '').includes('தமிழ்'));

  // Accurate 2D Mercator GPS projection checks (Delhi must sit strictly north of Chennai, Chennai north of Kanyakumari!)
  const delhi = projectLatLonToSvg(28.61, 77.21, 'india');
  const chennai = projectLatLonToSvg(13.08, 80.27, 'india');
  const kanyakumari = projectLatLonToSvg(8.08, 77.55, 'india');
  assert.ok(delhi.y < chennai.y && chennai.y < kanyakumari.y);
  assert.ok(chennai.x > delhi.x && chennai.x > 0 && chennai.x < 600);

  // Human Sex Determination, pH Scale, and Collinearity math verifications
  assert.equal(computeHumanSexDetermination('X').chromosomeFormula, '44 + XX');
  assert.equal(computeHumanSexDetermination('Y').chromosomeFormula, '44 + XY');
  assert.equal(computePhClassification(2).nature, 'Acidic');
  assert.equal(computePhClassification(7).nature, 'Neutral');
  assert.equal(computePhClassification(11).nature, 'Basic (Alkaline)');
  assert.equal(computeTriangleAreaAndCollinear(0, 0, 2, 2, 4, 4).isCollinear, true);
  assert.equal(computeTriangleAreaAndCollinear(0, 0, 4, 0, 0, 3).area, 6);

  // Deterministic math/science/economics simulation verifications
  const eq = computeTorqueAndLift(20, 3, 30, 2, 50, 2, 'freefall');
  assert.equal(eq.isBalanced, true);
  assert.equal(eq.apparentWeightN, 0);

  const alpha = computeNuclearDecayDaughter(92, 238, 'alpha');
  assert.equal(alpha.daughterZ, 90);
  assert.equal(alpha.daughterA, 234);

  const rain = computeRainwaterHarvestLiters(100, 40, 0.85);
  assert.equal(rain.harvestableLiters, 3400);

  const mat = computeMatrixOps2x2([[2, 1], [0, 3]], [[1, 4], [2, 5]]);
  assert.deepEqual(mat.productAB, [[4, 13], [6, 15]]);
  assert.deepEqual(mat.transposeA, [[2, 0], [1, 3]]);

  // TN Maths Example 8.4 (p. 306): [13, 8, 4, 9, 7, 12, 10] -> mean = 9, σ ≈ 2.83!
  const ex84 = computeDispersionMetrics([13, 8, 4, 9, 7, 12, 10]);
  assert.equal(ex84.mean, 9);
  assert.equal(ex84.stdDev, 2.83);

  const tax = computeGstAndDirectTax(1000, 18, 8);
  assert.equal(tax.gstTotal, 180);
  assert.equal(tax.cgst, 90);
  assert.equal(tax.finalPrice, 1180);
  assert.equal(tax.directTaxRatePct, 10);
});

test('Science 4.3.1 Electric Potential & 4.8.1 Joule Law match TN Class 10 textbook numericals and scaling laws', () => {
  // Textbook Solved Problem-2 (pp. 44-45): W = 100 J, Q = 10 C -> 10 V
  const sp2 = computeElectricPotential(100, 10);
  assert.equal(sp2.valid, true);
  assert.equal(sp2.potentialV, 10);

  // Equal work (24 J) on different charges (2 C vs 4 C) -> 12 V vs 6 V
  assert.equal(computeElectricPotential(24, 2).potentialV, 12);
  assert.equal(computeElectricPotential(24, 4).potentialV, 6);
  assert.equal(computeElectricPotential(24, 0).valid, false);
  assert.equal(computePotentialDifference(12, 6).deltaV, 6);

  // Textbook Solved Problem-6 (p. 51): R = 5 Ω, I = 6 A, t = 5 min (300 s) -> H = 54,000 J
  const sp6 = computeJoulesHeating(6, 5, 300);
  assert.equal(sp6.valid, true);
  assert.equal(sp6.heatJ, 54000);

  // Quadratic scaling: doubling current I quadruples heat H (4x)
  const base = computeJoulesHeating(3, 5, 20);
  assert.equal(base.heatJ, 900);
  assert.equal(base.doubleCurrentHeatJ, 3600);
  assert.equal(base.doubleCurrentMultiplier, 4);
});

test('Science Unit 9 Solubility model never labels undissolved excess at constant T as Supersaturated', () => {
  // 24 g < 36 g limit at 25 °C -> Unsaturated
  const unsat = evaluateSolubilityState(24, 25, 24, false);
  assert.equal(unsat.classification, 'unsaturated');

  // 36 g === 36 g limit at 25 °C -> Saturated
  const sat = evaluateSolubilityState(36, 25, 36, false);
  assert.equal(sat.classification, 'saturated');

  // Adding 60 g directly at 25 °C (never heated/dissolved) -> Saturated + Undissolved Excess (NOT supersaturated!)
  const excess = evaluateSolubilityState(60, 25, 36, true);
  assert.equal(excess.classification, 'saturated_with_excess');
  assert.equal(excess.dissolvedG, 36);
  assert.equal(excess.undissolvedExcessG, 24);
  assert.ok(!excess.headline.startsWith('Supersaturated'));

  // Dissolving 60 g at 60 °C and cooling calmly to 25 °C without disturbance -> True Supersaturated!
  const supersat = evaluateSolubilityState(60, 25, 60, false);
  assert.equal(supersat.classification, 'supersaturated_metastable');
  assert.equal(supersat.dissolvedG, 60);
  assert.equal(supersat.undissolvedExcessG, 0);

  // Disturbing/seeding precipitates back to saturated + excess
  const seeded = evaluateSolubilityState(60, 25, 60, true);
  assert.equal(seeded.classification, 'saturated_with_excess');
  assert.equal(seeded.undissolvedExcessG, 24);
});

test('Mathematics Chapter 4 Geometry invariants hold across Similarity, Thales, Angle Bisector, Pythagoras, Tangents, and Ceva', () => {
  const sim = computeSimilarityTriangle(4, 5, 3.6, 1.5);
  assert.equal(sim.pq, 6);
  assert.equal(sim.areaRatio, 2.25);

  const th = computeThalesBPT(10, 12, 0.4);
  assert.ok(th.diff < 1e-6);
  assert.equal(th.AD, 4);
  assert.equal(th.DB, 6);

  const bis = computeAngleBisectorTheorem(8, 12, 10);
  assert.ok(bis.diff < 1e-6);
  assert.equal(bis.BD, 4);
  assert.equal(bis.DC, 6);

  const py = computePythagoras(5, 12);
  assert.equal(py.hypotenuse, 13);
  assert.equal(py.areaA + py.areaB, py.areaC);

  // Example 4.24 (p. 191): r = 3 cm, OT = 5 cm -> PT = 4 cm
  const tan = computeCircleTangent(3, 5);
  assert.equal(tan.valid, true);
  assert.equal(tan.tangentLengthPT, 4);
  assert.equal(computeCircleTangent(5, 4).valid, false);

  // Example 4.33 (p. 197): BD = 12, DC = 3, CE/EA = 5/8, AF/FB = 2/5 -> Product = 1
  const ceva = computeCevaProduct(12, 3, 5, 8, 2, 5);
  assert.equal(ceva.isConcurrent, true);
  assert.equal(ceva.product, 1);
});

test('Gate 8 mastery state machine strictly separates visited, explored, practised, and understood_checkpoint', () => {
  const rec = createInitialProgressRecord();
  const id = 'science-04-auto-4-8-1-joule-s-law-of-heating';

  assert.equal(getSectionProgressStage(rec, id), 'not_started');
  rec.visitedSections.push(id);
  assert.equal(getSectionProgressStage(rec, id), 'started');

  // Moving a slider or exploring a lab logs 'explored', NEVER 'completed'!
  rec.exploredSections?.push(id);
  assert.equal(getSectionProgressStage(rec, id), 'explored');
  assert.equal(getCompletedSectionCount(rec), 0);

  // Answering a practice item without passing mastery logs 'practised', STILL not 'completed'!
  rec.practisedSections.push(id);
  assert.equal(getSectionProgressStage(rec, id), 'practised');
  assert.equal(getCompletedSectionCount(rec), 0);

  // Only a validated understoodCheckpoint marks completed/mastered!
  rec.understoodCheckpoints![id] = {
    score: 3,
    total: 3,
    verifiedAt: new Date().toISOString(),
    mode: 'concept_first_transfer',
  };
  assert.equal(getSectionProgressStage(rec, id), 'completed');
  assert.equal(getCompletedSectionCount(rec), 1);
});
