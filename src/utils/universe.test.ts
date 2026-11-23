import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TN_TOWN_REGIONS,
  evaluateTownBudget,
  evaluateTownEnergyPlan,
  evaluateTownWaterTank,
} from './sustainableTownSim';
import {
  GATE2_WORKING_PILOTS,
  UNIVERSE_WORLDS,
  resolveSectionQualityTier,
} from '../data/universeWorlds';
import { isRouteUsing3DView } from '../components/engines/TopicInteractiveLabs';
import {
  createInitialProgressRecord,
  validateProgressJson,
} from '../features/local-progress/progressStore';
import { curriculumRegistry } from './curriculumStore';

test('Sustainable TN Town water tank uses exact TN Class 10 π = 22/7 formula and rainwater harvesting', () => {
  const r = 7; // 7 m gives exact clean values with π = 22/7!
  const h = 10;
  // Cylinder V = (22/7)*7*7*10 = 1540 m³; CSA = 2*(22/7)*7*10 = 440 m²; TSA = 2*(22/7)*7*(10+7) = 748 m²
  const res = evaluateTownWaterTank(r, h, 800, 'interior_coimbatore');
  assert.equal(res.volumeM3, 1540);
  assert.equal(res.capacityLiters, 1540000);
  assert.equal(res.csaM2, 440);
  assert.equal(res.tsaM2, 748);
  assert.equal(res.annualRainHarvestLiters, Math.round(800 * 700 * 0.85));
  assert.equal(res.meetsVolumeGoal, true);
  assert.equal(res.meetsAreaBudget, false);
});

test('Sustainable TN Town energy plan accurately converts kWh to Joules (1 kWh = 3.6×10⁶ J) and rewards LED + wind', () => {
  const highLedWind = evaluateTownEnergyPlan(80, 150, 3, 'interior_coimbatore');
  const lowLedNoWind = evaluateTownEnergyPlan(10, 20, 0, 'interior_coimbatore');

  assert.ok(highLedWind.dailyDemandKwh < lowLedNoWind.dailyDemandKwh);
  assert.equal(
    highLedWind.dailyEnergyJoulesMillion,
    Number((highLedWind.dailyDemandKwh * 3.6).toFixed(1)),
  );
  assert.ok(highLedWind.cleanSupplyKwh > lowLedNoWind.cleanSupplyKwh);
  assert.equal(highLedWind.meetsCleanTarget, true);
  assert.equal(lowLedNoWind.meetsCleanTarget, false);
});

test('Sustainable TN Town municipal budget enforces exact 100-unit balance and equity rules', () => {
  const balanced = evaluateTownBudget(35, 35, 30, 60);
  assert.equal(balanced.totalAllocated, 100);
  assert.equal(balanced.remainingUnits, 0);
  assert.equal(balanced.isBalanced, true);
  assert.equal(balanced.publicWelfareScore, 100);

  const overspent = evaluateTownBudget(40, 40, 35, 30);
  assert.equal(overspent.totalAllocated, 115);
  assert.equal(overspent.isBalanced, false);
});

test('isRouteUsing3DView hides 3D toggles on all Language, History, 2D Maths Proofs, Metallurgy, Leech Body Wall & Scratch routes', () => {
  // MUST be 0% 3D (pure 2D / interactive language / accurate 2D maps)
  assert.equal(isRouteUsing3DView('english-01-prose', 'StoryStage'), false);
  assert.equal(isRouteUsing3DView('tamil-04-01', 'TamilStudio'), false);
  assert.equal(isRouteUsing3DView('tamil-04-04', 'TamilStudio'), false);
  assert.equal(isRouteUsing3DView('social-history-01-auto-1-3-causes-course-and', 'HistoryTimeMap'), false);
  assert.equal(isRouteUsing3DView('social-history-04-auto-4-2-cold-war-rivalry', 'HistoryTimeMap'), false);
  assert.equal(isRouteUsing3DView('social-geography-04-auto-4-1-minerals', 'GeoRelief'), false);
  assert.equal(isRouteUsing3DView('science-13-auto-13-1-4-body-wall', 'ModelExplorer3D'), false);
  assert.equal(isRouteUsing3DView('science-08-auto-8-7-metallurgy-of', 'SafeVirtualLab'), false);
  assert.equal(isRouteUsing3DView('science-11-auto-11-6-ethanol-ch3ch2oh', 'SafeVirtualLab'), false);
  assert.equal(isRouteUsing3DView('science-23-auto-23-1-introduction', 'ConceptSort'), false);
  assert.equal(isRouteUsing3DView('maths-01-01', 'CoordinatePlotter'), false);
  assert.equal(isRouteUsing3DView('maths-04-03', 'GeometryCanvas'), false);

  // MUST stay true where genuine 3D spatial depth illuminates the concept
  assert.equal(isRouteUsing3DView('science-14-auto-14-15-structure-of-human-heart', 'ModelExplorer3D'), true);
  assert.equal(isRouteUsing3DView('science-10-auto-10-1-types-of-chemical', 'SafeVirtualLab'), true);
  assert.equal(isRouteUsing3DView('maths-07-02', 'Mensuration3D'), true);
  assert.equal(isRouteUsing3DView('science-07-auto-7-2-molecule-and', 'ModelExplorer3D'), true);
});

test('Honest Quality-Tier resolver never fabricates educator_approved and validates all 6 worlds + Gate 2 pilots', () => {
  assert.equal(UNIVERSE_WORLDS.length, 6);
  assert.ok(GATE2_WORKING_PILOTS.length >= 7);
  assert.equal(Object.keys(TN_TOWN_REGIONS).length, 3);

  let assessedCount = 0;
  let educatorApprovedCount = 0;

  for (const unit of curriculumRegistry.units) {
    for (const sec of unit.sections) {
      const tier = resolveSectionQualityTier(sec);
      if (tier === 'assessed') assessedCount++;
      if (tier === 'educator_approved') educatorApprovedCount++;
    }
  }

  assert.equal(educatorApprovedCount, 0, 'Must never fabricate educator_approved before human sign-off');
  assert.ok(assessedCount >= 30, `Expected at least 30 assessed routes, got ${assessedCount}`);
});

test('validateProgressJson preserves backward compatibility and new Universe reflection/stamps/capstone fields', () => {
  const initial = createInitialProgressRecord();
  initial.teachBackNotes = { 'science-10-auto-10-1-types-of-chemical': 'Atoms rearrange; mass stays equal.' };
  initial.discoveryStamps = ['tn-town-water', 'tn-town-energy'];
  initial.capstoneProgress = {
    'sustainable-tn-town': {
      stage: 3,
      completed: false,
      summary: 'Coimbatore rain-shadow plan: 1,540 m³ tank + 3 wind turbines.',
      updatedAt: '2026-11-23T09:00:00.000Z',
    },
  };

  const parsed = validateProgressJson(JSON.stringify(initial));
  assert.equal(parsed.valid, true);
  assert.ok(parsed.data);
  assert.equal(
    parsed.data.teachBackNotes?.['science-10-auto-10-1-types-of-chemical'],
    'Atoms rearrange; mass stays equal.',
  );
  assert.deepEqual(parsed.data.discoveryStamps, ['tn-town-water', 'tn-town-energy']);
  assert.equal(parsed.data.capstoneProgress?.['sustainable-tn-town']?.stage, 3);
});
