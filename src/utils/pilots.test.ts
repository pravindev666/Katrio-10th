import test from 'node:test';
import assert from 'node:assert/strict';
import {
  solveClinometer,
  solveDistanceFromDepression,
  getExactTanLabel,
} from './mathSimulations';
import {
  UNIT10_REACTIONS,
  ACTIVITY_SERIES,
  canDisplaceMetal,
  canDisplaceHalogen,
  evaluateAtomConservation,
  mixCustomReagents,
} from './chemistrySimulations';
import {
  DOUBLE_CIRCULATION_PATHWAY,
  validateCirculationSequence,
} from './heartCirculation';
import { computeSolidMeasurements } from './mensurationSimulations';
import {
  CLASS10_MOLECULES_3D,
  analyzeMoleculeMass,
  calculateAverageAtomicMass,
} from './moleculeSimulations';
import { evaluateTrigIdentities } from './trigIdentitiesSimulations';
import {
  CARDIAC_CYCLE_PHASES,
  evaluateBloodTransfusion,
} from './bloodCompatibility';
import {
  computeEchoSimulation,
  computeDopplerFrequency,
  computeThinLensImage,
  computeCircuitSimulation,
} from './physicsSimulations';
import {
  ALL_PILOT_LESSONS,
  getLessonContentBySectionId,
} from '../data/lesson_content';
import { getSectionById, getUnitById } from './curriculumStore';

// 1. Mathematics Ch. 6.3 — Heights and Distances computational tests
test('solveClinometer matches TN Class 10 Example 6.19 (d = 48 m, θ = 30°, h0 = 0 m)', () => {
  const res = solveClinometer({
    mode: 'elevation',
    distanceM: 48,
    angleDeg: 30,
    observerEyeM: 0,
  });
  assert.equal(res.valid, true);
  assert.equal(res.exactSurdFormula, '16\\sqrt{3}\\text{ m}');
  assert.equal(res.totalHeightM, 27.71);
  assert.equal(getExactTanLabel(30), '\\frac{1}{\\sqrt{3}}');
});

test('solveClinometer handles 45° and 60° exact surds plus observer eye height h0', () => {
  const at45 = solveClinometer({
    mode: 'elevation',
    distanceM: 30,
    angleDeg: 45,
    observerEyeM: 1.6,
  });
  assert.equal(at45.valid, true);
  assert.equal(at45.verticalDeltaM, 30);
  assert.equal(at45.totalHeightM, 31.6);

  const at60 = solveClinometer({
    mode: 'elevation',
    distanceM: 20,
    angleDeg: 60,
    observerEyeM: 0,
  });
  assert.equal(at60.valid, true);
  assert.equal(at60.exactSurdFormula, '20\\sqrt{3}\\text{ m}');
  assert.equal(at60.totalHeightM, 34.64);
});

test('solveClinometer rejects invalid boundaries (0°, 90°, negative distance, negative eye height)', () => {
  const atZero = solveClinometer({ mode: 'elevation', distanceM: 30, angleDeg: 0, observerEyeM: 1.5 });
  assert.equal(atZero.valid, false);
  assert.ok(atZero.error?.includes('0°'));

  const atNinety = solveClinometer({ mode: 'elevation', distanceM: 30, angleDeg: 90, observerEyeM: 1.5 });
  assert.equal(atNinety.valid, false);
  assert.ok(atNinety.error?.includes('undefined'));

  const zeroDist = solveClinometer({ mode: 'elevation', distanceM: 0, angleDeg: 45, observerEyeM: 0 });
  assert.equal(zeroDist.valid, false);

  const negEye = solveClinometer({ mode: 'elevation', distanceM: 25, angleDeg: 45, observerEyeM: -1 });
  assert.equal(negEye.valid, false);
});

test('solveDistanceFromDepression computes d = H / tan(θ) and validates domain', () => {
  assert.equal(solveDistanceFromDepression(50, 45).distanceM, 50);
  assert.equal(solveDistanceFromDepression(30, 30).distanceM, 51.96);
  assert.equal(solveDistanceFromDepression(30, 0).valid, false);
  assert.equal(solveDistanceFromDepression(30, 90).valid, false);
  assert.equal(solveDistanceFromDepression(-5, 45).valid, false);
});

// 2. Mathematics Ch. 6.1–6.2 — Trig Identities computational tests
test('evaluateTrigIdentities verifies all 3 Pythagorean and complementary identities across angles', () => {
  for (const deg of [15, 30, 45, 60, 75]) {
    const res = evaluateTrigIdentities(deg);
    assert.equal(res.valid, true);
    assert.equal(res.complementaryCheck.matches, true);
    for (const id of res.identities) {
      assert.equal(id.holds, true, `Identity ${id.id} should hold at ${deg}°`);
    }
  }
  assert.equal(evaluateTrigIdentities(0).valid, false);
  assert.equal(evaluateTrigIdentities(90).valid, false);
});

// 3. Mathematics Ch. 7 — 3D Mensuration computational tests (π = 22/7)
test('computeSolidMeasurements matches TN Class 10 Example 7.1 and validates all 7 solids', () => {
  // Textbook Example 7.1 (p. 271): Drum r = 14 cm, h = 20 cm => CSA = 1760 cm², TSA = 2992 cm²
  const drum = computeSolidMeasurements({ kind: 'cylinder', radius: 14, height: 20, useExact22Over7: true });
  assert.equal(drum.valid, true);
  assert.equal(drum.csa, 1760);
  assert.equal(drum.tsa, 2992);
  assert.equal(drum.volume, 12320);

  // Cone r = 7, h = 24 => l = 25, CSA = 550, TSA = 704, V = 1232
  const cone = computeSolidMeasurements({ kind: 'cone', radius: 7, height: 24, useExact22Over7: true });
  assert.equal(cone.valid, true);
  assert.equal(cone.slantHeight, 25);
  assert.equal(cone.csa, 550);
  assert.equal(cone.tsa, 704);
  assert.equal(cone.volume, 1232);

  // Solid Hemisphere r = 7 => CSA = 308, TSA = 462 (3πr²)
  const hemi = computeSolidMeasurements({ kind: 'hemisphere', radius: 7, useExact22Over7: true });
  assert.equal(hemi.csa, 308);
  assert.equal(hemi.tsa, 462);

  // Frustum r = 7, R = 14, h = 24 => l = 25
  const frustum = computeSolidMeasurements({ kind: 'frustum', radius: 7, outerRadius: 14, height: 24, useExact22Over7: true });
  assert.equal(frustum.valid, true);
  assert.equal(frustum.slantHeight, 25);

  // Invalid domain checks
  assert.equal(computeSolidMeasurements({ kind: 'cylinder', radius: 0, height: 10 }).valid, false);
  assert.equal(computeSolidMeasurements({ kind: 'frustum', radius: 10, outerRadius: 8, height: 12 }).valid, false);
});

// 4. Science Unit 7 & 11 — 3D Molecule Builder & Isotopic Average Mass tests
test('analyzeMoleculeMass and calculateAverageAtomicMass match TN Class 10 textbook values', () => {
  const expectedMasses: Record<string, number> = {
    h2o: 18,
    co2: 44,
    ch4: 16,
    c2h4: 28,
    c2h2: 26,
    ethanol: 46,
    ethanoic_acid: 60,
  };
  for (const [id, mass] of Object.entries(expectedMasses)) {
    const mol = CLASS10_MOLECULES_3D.find((m) => m.id === id);
    assert.ok(mol, `Expected molecule ${id}`);
    assert.equal(analyzeMoleculeMass(mol).molecularMass, mass);
  }

  // Textbook p. 93 Carbon-12 (98.9%) + Carbon-13 (1.1%) = 12.011 amu
  const carbon = calculateAverageAtomicMass([
    { massAmu: 12, abundancePercent: 98.9 },
    { massAmu: 13, abundancePercent: 1.1 },
  ]);
  assert.equal(carbon.valid, true);
  assert.equal(carbon.averageAmu, 12.011);

  // Textbook p. 94 Boron-10 (20%) + Boron-11 (80%) = 10.8 amu
  const boron = calculateAverageAtomicMass([
    { massAmu: 10, abundancePercent: 20 },
    { massAmu: 11, abundancePercent: 80 },
  ]);
  assert.equal(boron.valid, true);
  assert.equal(boron.averageAmu, 10.8);
});

// 5. Science Unit 10 — Stoichiometry & Activity Series tests
test('all feasible Unit 10 textbook reactions strictly conserve atoms and obey activity series', () => {
  const feasibleReactions = UNIT10_REACTIONS.filter((r) => r.feasible);
  assert.equal(feasibleReactions.length, 5);
  for (const rxn of feasibleReactions) {
    const report = evaluateAtomConservation(
      rxn,
      rxn.reactants.map((s) => s.balancedCoeff),
      rxn.products.map((s) => s.balancedCoeff),
    );
    assert.equal(report.balanced, true, `Expected ${rxn.id} to conserve every element`);
  }
  const znHcl = UNIT10_REACTIONS.find((r) => r.id === 'displacement-zn-hcl')!;
  assert.equal(evaluateAtomConservation(znHcl, [1, 1], [1, 1]).balanced, false);

  assert.equal(ACTIVITY_SERIES[0].symbol, 'K');
  assert.equal(canDisplaceMetal('Zn', 'H'), true);
  assert.equal(canDisplaceMetal('Ag', 'H'), false);
  assert.equal(canDisplaceHalogen('F', 'Cl'), true);
  assert.equal(canDisplaceHalogen('Cl', 'F'), false);

  // 3D Free-Mix Chemistry Lab Bench reagent tests
  assert.equal(mixCustomReagents('Zn', 'HCl').occurs, true);
  assert.equal(mixCustomReagents('Zn', 'HCl').visualEffect, 'gas_release');
  assert.equal(mixCustomReagents('Cu', 'HCl').occurs, false); // Cu below H!
  assert.equal(mixCustomReagents('PbNO3_2', 'KI').visualEffect, 'yellow_precipitate');
  assert.equal(mixCustomReagents('NaOH', 'HCl').visualEffect, 'neutral_clear');
  assert.equal(mixCustomReagents('CaCO3', 'Heat').visualEffect, 'flame_heat');
  assert.equal(mixCustomReagents('NaF', 'Cl2').occurs, false);
  assert.equal(mixCustomReagents('KI', 'Cl2').occurs, true);
});

// 6. Science Unit 14 — Double Circulation, Cardiac Cycle & ABO/Rh Compatibility tests
test('double circulation, 0.8 s cardiac cycle, and ABO/Rh compatibility follow TN Class 10 Unit 14', () => {
  const canonicalOrder = DOUBLE_CIRCULATION_PATHWAY.map((s) => s.id);
  assert.equal(validateCirculationSequence(canonicalOrder).isExactOrder, true);
  assert.equal(validateCirculationSequence([...canonicalOrder].reverse()).isExactOrder, false);

  const cycleTotal = Number(CARDIAC_CYCLE_PHASES.reduce((acc, p) => acc + p.durationSec, 0).toFixed(2));
  assert.equal(cycleTotal, 0.8);

  // Universal Donor O- -> AB+ compatible; A+ -> B- incompatible; O+ -> O- Rh conflict
  assert.equal(evaluateBloodTransfusion('O', '-', 'AB', '+').compatible, true);
  assert.equal(evaluateBloodTransfusion('A', '+', 'B', '-').compatible, false);
  assert.equal(evaluateBloodTransfusion('O', '+', 'O', '-').compatible, false);
  assert.equal(evaluateBloodTransfusion('A', '+', 'O', '+').compatible, false);
});

// 7. Full Pass 2 Chapter Completion (5 Full Chapters) & 6/6 3D Blueprints Integrity
test('all 25 lesson packages resolve cleanly, cover 5 full chapters + all 6/6 3D chapters, and keep human QA gates honest', () => {
  assert.equal(ALL_PILOT_LESSONS.length, 25);

  for (const lesson of ALL_PILOT_LESSONS) {
    const resolved = getSectionById(lesson.subject, lesson.unit_id, lesson.section_id);
    assert.ok(resolved, `Lesson ${lesson.section_id} must resolve in canonical curriculum registry`);
    assert.ok(lesson.learning_objectives.length >= 2);
    assert.ok(lesson.concept_outline.length >= 2);
    assert.ok(lesson.assessment.question_bank.length >= 3);
    assert.ok(lesson.flashcards.length >= 3);
    assert.ok(lesson.accessible_equivalent.steps.length >= 3);
    assert.equal(lesson.subject_review_passed, false);
    assert.equal(lesson.rights_reviewed, false);
    assert.equal(lesson.accessibility_qa_passed, false);
  }

  // Pass 2: 100% section coverage across 1 complete chapter per subject (5 subjects!)
  const pass2Chapters: [string, string][] = [
    ['english', 'english-01'],
    ['tamil', 'tamil-04'],
    ['social_science', 'social-history-01'],
    ['mathematics', 'maths-06'],
    ['science', 'science-14'],
  ];
  for (const [subj, unitId] of pass2Chapters) {
    const unit = getUnitById(subj, unitId);
    assert.ok(unit, `Expected Pass 2 unit ${unitId}`);
    for (const sec of unit.sections) {
      assert.ok(
        getLessonContentBySectionId(sec.id),
        `Pass 2 complete chapter ${unitId} missing lesson binding for ${sec.id}`,
      );
    }
  }

  // All 6/6 Handover 3D blueprint chapters have a validated 3D lesson package!
  const six3dRoutes = [
    'science-14-auto-14-15-structure-of-human-heart',
    'maths-07-02',
    'science-07-auto-7-2-molecule-and',
    'science-11-auto-11-3-1-hydrocarbons',
    'science-12-auto-12-3-internal-structure-of',
    'social-geography-01-auto-1-2-major-physiographic',
  ];
  for (const secId of six3dRoutes) {
    assert.ok(getLessonContentBySectionId(secId), `3D blueprint ${secId} must have a lesson package`);
  }
});

// 8. Topic-Aware Physics Labs (Acoustics Echo/Doppler, Optics Thin Lens, Electricity Ohm's Law)
test('physicsSimulations accurately computes Acoustics echo threshold, Doppler pitch, Thin Lens image, and Series/Parallel circuits', () => {
  // Acoustics Unit 5: 17.2 m threshold in air (344 m/s)
  const echoTooClose = computeEchoSimulation(12, 344);
  assert.equal(echoTooClose.minEchoDistanceM, 17.2);
  assert.equal(echoTooClose.isDistinctEcho, false);

  const echoValid = computeEchoSimulation(34.4, 344);
  assert.equal(echoValid.echoTimeSec, 0.2);
  assert.equal(echoValid.isDistinctEcho, true);

  // Doppler shift: approaching increases frequency, receding decreases frequency
  assert.ok(computeDopplerFrequency(500, 34, true, 344) > 500);
  assert.ok(computeDopplerFrequency(500, 34, false, 344) < 500);

  // Optics Unit 2: Convex lens at 2F (u = -30, f = +15) -> v = +30, m = -1 (Real, Inverted, Same Size)
  const at2F = computeThinLensImage('convex', 15, 30);
  assert.equal(at2F.imageDistanceCm, 30);
  assert.equal(at2F.magnification, -1);
  assert.ok(at2F.nature.includes('Real'));
  // At F -> image at infinity
  assert.equal(computeThinLensImage('convex', 15, 15).imageDistanceCm, null);
  // Concave lens always virtual & erect
  const concave = computeThinLensImage('concave', 15, 30);
  assert.ok(concave.nature.includes('Virtual') && concave.nature.includes('Erect'));

  // Electricity Unit 4: Series R = 4 + 6 = 10 Ohm vs Parallel R = 2.4 Ohm
  const series = computeCircuitSimulation(12, 4, 6, 'series');
  assert.equal(series.equivalentResistanceOhm, 10);
  assert.equal(series.totalCurrentAmp, 1.2);
  const parallel = computeCircuitSimulation(12, 4, 6, 'parallel');
  assert.equal(parallel.equivalentResistanceOhm, 2.4);
  assert.equal(parallel.totalCurrentAmp, 5);
});
