import fs from 'node:fs';
import path from 'node:path';
import type { CurriculumRegistry } from '../src/types/curriculum';
import type { LessonContentPackage } from '../src/types/lessonContent';

const ROOT = process.cwd();
const REGISTRY_PATH = path.resolve(ROOT, 'src/data/curriculum_registry_class10.json');
const LESSON_DIR = path.resolve(ROOT, 'src/data/lesson_content');

export function validateAllLessonPackages() {
  const registry: CurriculumRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const validSectionIds = new Set(
    registry.units.flatMap((u) => u.sections.map((s) => s.id)),
  );
  const validUnitIds = new Set(registry.units.map((u) => u.id));

  const jsonFiles = fs
    .readdirSync(LESSON_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const errors: string[] = [];
  const validated: { file: string; section_id: string; questions: number; flashcards: number }[] = [];

  for (const file of jsonFiles) {
    const fullPath = path.resolve(LESSON_DIR, file);
    const pkg: LessonContentPackage = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    if (!pkg.section_id || !validSectionIds.has(pkg.section_id)) {
      errors.push(`${file}: section_id "${pkg.section_id}" does not exist in canonical curriculum registry.`);
    }
    for (const relId of pkg.related_section_ids ?? []) {
      if (!validSectionIds.has(relId)) {
        errors.push(`${file}: related_section_id "${relId}" does not exist in canonical curriculum registry.`);
      }
    }
    if (!pkg.unit_id || !validUnitIds.has(pkg.unit_id)) {
      errors.push(`${file}: unit_id "${pkg.unit_id}" does not exist in canonical curriculum registry.`);
    }
    if (`${pkg.section_id}.json` !== file) {
      errors.push(`${file}: filename must match section_id "${pkg.section_id}.json".`);
    }
    if (!pkg.source_pdf || !pkg.source_printed_pages?.length) {
      errors.push(`${file}: missing source_pdf or source_printed_pages provenance.`);
    }
    if (!pkg.learning_objectives || pkg.learning_objectives.length < 2) {
      errors.push(`${file}: must specify at least 2 concrete learning_objectives.`);
    }
    if (!pkg.concept_outline || pkg.concept_outline.length < 2) {
      errors.push(`${file}: must specify at least 2 concept_outline blocks.`);
    }
    if (!pkg.interaction?.engine || !pkg.interaction?.controls?.length) {
      errors.push(`${file}: missing interaction engine or controls metadata.`);
    }
    if (!pkg.accessible_equivalent?.steps?.length) {
      errors.push(`${file}: missing accessible_equivalent steps (2D/text parity required).`);
    }
    if (!pkg.assessment?.question_bank || pkg.assessment.question_bank.length < 3) {
      errors.push(`${file}: assessment.question_bank must contain at least 3 topic-specific questions.`);
    }
    for (const q of pkg.assessment?.question_bank ?? []) {
      const correctCount = q.options.filter((o) => o.is_correct).length;
      if (correctCount !== 1) {
        errors.push(`${file}: question "${q.id}" must have exactly 1 correct option (found ${correctCount}).`);
      }
      if (!q.hint || !q.worked_explanation) {
        errors.push(`${file}: question "${q.id}" missing hint or worked_explanation.`);
      }
    }
    if (!pkg.flashcards || pkg.flashcards.length < 3) {
      errors.push(`${file}: must include at least 3 flashcards.`);
    }
    if (!pkg.assets || pkg.assets.length < 1) {
      errors.push(`${file}: must declare asset provenance in assets[].`);
    }
    if (!pkg.storyboard || pkg.storyboard.length < 2) {
      errors.push(`${file}: must declare guided/explore storyboard steps.`);
    }

    validated.push({
      file,
      section_id: pkg.section_id,
      questions: pkg.assessment?.question_bank?.length ?? 0,
      flashcards: pkg.flashcards?.length ?? 0,
    });
  }

  return { valid: errors.length === 0, errors, validated };
}

const isMain = process.argv[1] && process.argv[1].endsWith('validate-lessons.ts');
if (isMain) {
  const res = validateAllLessonPackages();
  console.log('=== KATRIO LESSON CONTENT PACKAGE VALIDATION ===');
  for (const v of res.validated) {
    console.log(`  ✔ ${v.file} (${v.questions} checks, ${v.flashcards} flashcards)`);
  }
  if (!res.valid) {
    console.error('Validation Errors:', res.errors);
    process.exit(1);
  }
  console.log(`STATUS: PASS — ${res.validated.length} validated pilot lesson packages conform to AGY Section 6 contract.`);
}
