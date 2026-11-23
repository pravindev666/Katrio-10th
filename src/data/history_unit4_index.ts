import type { SubsectionLessonPackage } from '../types/subsectionLesson';
import { HISTORY_UNIT4_PART1 } from './history_unit4_part1';
import { HISTORY_UNIT4_PART2 } from './history_unit4_part2';

export const HISTORY_UNIT4_SUBSECTION_LESSONS: SubsectionLessonPackage[] = [
  ...HISTORY_UNIT4_PART1,
  ...HISTORY_UNIT4_PART2,
];

const BY_ID = new Map<string, SubsectionLessonPackage>(
  HISTORY_UNIT4_SUBSECTION_LESSONS.map((pkg) => [pkg.id, pkg]),
);

export function getSubsectionLessonById(sectionId: string): SubsectionLessonPackage | undefined {
  return BY_ID.get(sectionId);
}
