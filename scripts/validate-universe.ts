import fs from 'node:fs';
import path from 'node:path';
import type { CurriculumRegistry } from '../src/types/curriculum';
import {
  GATE2_WORKING_PILOTS,
  UNIVERSE_WORLDS,
  resolveSectionQualityTier,
} from '../src/data/universeWorlds';
import { isRouteUsing3DView } from '../src/components/engines/TopicInteractiveLabs';

const ROOT = process.cwd();
const REGISTRY_PATH = path.resolve(ROOT, 'src/data/curriculum_registry_class10.json');
const MODELS_DIR = path.resolve(ROOT, 'public/models');
const SRC_DIR = path.resolve(ROOT, 'src');

const RETIRED_GLBS = [
  'boombox.glb',
  'kidney.glb',
  'camera-optics.glb',
  'flower.glb',
  'seabird-animated.glb',
  'parrot-animated.glb',
];

const RETIRED_CANVASES = [
  'Tamil3DStageCanvas',
  'EnglishStory3DCanvas',
  'ChemicalProcess3DCanvas',
  'MathsChapter3DCanvas',
  'HistoryTheatre3DCanvas',
  'CivicsEconomics3DCanvas',
  'SocialInteractiveLabs',
];

function walkFiles(dir: string, exts = ['.ts', '.tsx']): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function main() {
  const errors: string[] = [];
  const registry: CurriculumRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const allSections = registry.units.flatMap((u) =>
    u.sections.map((s) => ({ unit: u, section: s })),
  );
  const sectionById = new Map(allSections.map((row) => [row.section.id, row]));

  // 1. Stale Cross-Domain Fallback Check across all 694 routes
  let staleFallbacks = 0;
  for (const { unit, section } of allSections) {
    const fb = section.accessibility_fallback ?? '';
    const isChemUnit = ['science-07', 'science-08', 'science-09', 'science-10', 'science-11'].includes(unit.id);
    const isCoordUnit = unit.id === 'maths-05';
    const isAnatomyUnit = ['science-12', 'science-13', 'science-14', 'science-15', 'science-16', 'science-17'].includes(unit.id);

    if (!isChemUnit && /Balanced chemical equation table/i.test(fb)) {
      staleFallbacks++;
      errors.push(`Cross-domain chemistry fallback on ${section.id}: "${fb}"`);
    }
    if (!isCoordUnit && /Coordinate grid table and step-by-step/i.test(fb)) {
      staleFallbacks++;
      errors.push(`Cross-domain coordinate fallback on ${section.id}: "${fb}"`);
    }
    if (!isAnatomyUnit && /Detailed anatomical cutaway text/i.test(fb)) {
      staleFallbacks++;
      errors.push(`Cross-domain anatomy fallback on ${section.id}: "${fb}"`);
    }
    if (fb.trim().length < 20) {
      staleFallbacks++;
      errors.push(`Missing/short accessibility_fallback on ${section.id}`);
    }
  }

  // 2. Verify Retired GLB Assets are removed from disk and zero references remain in src/
  for (const glb of RETIRED_GLBS) {
    if (fs.existsSync(path.join(MODELS_DIR, glb))) {
      errors.push(`Retired mismatched 3D model still exists on disk: public/models/${glb}`);
    }
  }

  const srcFiles = walkFiles(SRC_DIR);
  const referencedGlbs = new Set<string>();
  for (const file of srcFiles) {
    // Skip test files checking for absence
    if (file.endsWith('.test.ts')) continue;
    const text = fs.readFileSync(file, 'utf-8');
    for (const glb of RETIRED_GLBS) {
      if (text.includes(glb)) {
        errors.push(`Retired GLB "${glb}" still referenced in ${path.relative(ROOT, file)}`);
      }
    }
    for (const canvas of RETIRED_CANVASES) {
      if (text.includes(canvas)) {
        errors.push(`Retired 3D canvas "${canvas}" still referenced in ${path.relative(ROOT, file)}`);
      }
    }
    const glbMatches = text.match(/\/models\/[a-zA-Z0-9._-]+\.glb/g) ?? [];
    for (const m of glbMatches) {
      referencedGlbs.add(m.replace('/models/', ''));
    }
  }

  for (const glb of referencedGlbs) {
    if (!fs.existsSync(path.join(MODELS_DIR, glb))) {
      errors.push(`Referenced 3D model missing on disk: public/models/${glb}`);
    }
  }

  // 3. Honest Quality-Tier Check (Zero unverified educator_approved claims!)
  const tierCounts = {
    indexed: 0,
    explained: 0,
    interactive: 0,
    assessed: 0,
    educator_approved: 0,
  };
  let routesUsing3D = 0;
  let routesPure2DOrLanguage = 0;

  for (const { unit, section } of allSections) {
    const tier = resolveSectionQualityTier(section);
    tierCounts[tier]++;
    if (tier === 'educator_approved') {
      errors.push(`Section ${section.id} must NOT auto-claim educator_approved without signed external review!`);
    }
    const uses3D = isRouteUsing3DView(section.id, section.activity_template);
    if (uses3D) {
      routesUsing3D++;
      if (unit.subject === 'english' || unit.subject === 'tamil') {
        errors.push(`Language route ${section.id} unexpectedly flagged as 3D!`);
      }
    } else {
      routesPure2DOrLanguage++;
    }
  }

  // 4. Verify all Gate 2 Working Pilots & 6 Universe Worlds resolve cleanly
  if (UNIVERSE_WORLDS.length !== 6) {
    errors.push(`Expected 6 Universe Worlds, found ${UNIVERSE_WORLDS.length}`);
  }
  for (const pilot of GATE2_WORKING_PILOTS) {
    if (pilot.route === '/arcade/sustainable-tn-town') continue;
    const match = sectionById.get(pilot.sectionId);
    if (!match) {
      errors.push(`Gate 2 Pilot "${pilot.id}" references missing sectionId: ${pilot.sectionId}`);
    } else if (match.section.route !== pilot.route) {
      errors.push(`Gate 2 Pilot "${pilot.id}" route mismatch: ${pilot.route} !== ${match.section.route}`);
    }
  }

  // 5. Report Results
  const retainedGlbs = fs
    .readdirSync(MODELS_DIR)
    .filter((f) => f.endsWith('.glb'));
  const totalGlbBytes = retainedGlbs.reduce(
    (sum, f) => sum + fs.statSync(path.join(MODELS_DIR, f)).size,
    0,
  );

  console.log('=== KATRIO LEARNING UNIVERSE CI VALIDATOR ===');
  console.log(`Units: ${registry.units.length} | Sections: ${allSections.length}`);
  console.log(`Stale cross-domain accessibility fallbacks: ${staleFallbacks}`);
  console.log(
    `Retained .glb models: ${retainedGlbs.length} (${(totalGlbBytes / (1024 * 1024)).toFixed(2)} MB) | Referenced in src/: ${referencedGlbs.size}`,
  );
  console.log(
    `Live Representation Split (Runtime Engine): 3D+2D Sync = ${routesUsing3D} · Pure 2D / Language / Scenario = ${routesPure2DOrLanguage}`,
  );
  console.log(
    `Honest Quality Tiers: assessed=${tierCounts.assessed}, interactive=${tierCounts.interactive}, explained=${tierCounts.explained}, indexed=${tierCounts.indexed}, educator_approved=${tierCounts.educator_approved}`,
  );
  console.log(
    `Universe Worlds: ${UNIVERSE_WORLDS.length} | Gate 2 Showcase Pilots Verified: ${GATE2_WORKING_PILOTS.length}`,
  );

  if (errors.length > 0) {
    console.error(`\nFAILED with ${errors.length} universe integrity error(s):`);
    for (const err of errors.slice(0, 30)) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log('PASS: All 694 routes, assets, pilots, and honest quality tiers passed validation.');
}

main();
