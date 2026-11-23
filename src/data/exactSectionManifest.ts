import type { LessonExperienceSpec } from '../types/lessonExperience';
import { SCIENCE_CONCEPT_FIRST_SPECS } from './exactSectionManifestScience';
import { MATHS_CH4_CONCEPT_FIRST_SPECS } from './exactSectionManifestMaths';

export const ALL_CONCEPT_FIRST_SPECS: LessonExperienceSpec[] = [
  ...SCIENCE_CONCEPT_FIRST_SPECS,
  ...MATHS_CH4_CONCEPT_FIRST_SPECS,
];

const EXACT_MANIFEST_MAP = new Map<string, LessonExperienceSpec>();
for (const spec of ALL_CONCEPT_FIRST_SPECS) {
  EXACT_MANIFEST_MAP.set(spec.sectionId, spec);
}

/**
 * Exact-ID lookup ONLY (Gate 6): zero broad startsWith(...) prefix fallback!
 */
export function getExactLessonExperienceById(sectionId: string): LessonExperienceSpec | undefined {
  return EXACT_MANIFEST_MAP.get(sectionId);
}

export function getAllExactConceptFirstIds(): string[] {
  return Array.from(EXACT_MANIFEST_MAP.keys());
}
