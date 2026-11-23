import type { LessonContentPackage } from '../../types/lessonContent';

// Pass 1 P0 Pilots (7 packages)
import science14Heart from './science-14-auto-14-15-structure-of-human-heart.json';
import science10Reactions from './science-10-auto-10-1-types-of-chemical.json';
import maths06Heights from './maths-06-03.json';
import english01Flight from './english-01-prose.json';
import tamil04Translation from './tamil-04-01.json';
import tamil04Grammar from './tamil-04-04.json';
import socialHistory01Wwi from './social-history-01-auto-1-3-causes-course-and.json';

// Pass 2 — Remaining 5/6 Handover 3D Blueprints
import maths07Mensuration3d from './maths-07-02.json';
import science07Molecules3d from './science-07-auto-7-2-molecule-and.json';
import science11Carbon3d from './science-11-auto-11-3-1-hydrocarbons.json';
import science12Plant3d from './science-12-auto-12-3-internal-structure-of.json';
import geo01IndiaRelief3d from './social-geography-01-auto-1-2-major-physiographic.json';

// Pass 2 — Completing 1 Full Chapter Per Subject (English U1, Tamil U4, History U1, Maths Ch.6, Science U14)
import english01Poem from './english-01-poem.json';
import english01Supp from './english-01-supplementary.json';
import tamil04Poem from './tamil-04-02.json';
import tamil04Supp from './tamil-04-03.json';
import history01Rivalry from './social-history-01-auto-1-2-rivalry-of-great-powers.json';
import history01RussianRev from './social-history-01-auto-1-4-russian-revolution.json';
import maths06Intro from './maths-06-01.json';
import maths06Identities from './maths-06-02.json';
import science14Transport from './science-14-auto-14-1-means-of-transport.json';
import science14Transpiration from './science-14-auto-14-5-transpiration.json';
import science14Vessels from './science-14-auto-14-13-blood-vessels.json';
import science14Heartbeat from './science-14-auto-14-15-2-heart-beat.json';
import science14BloodGroups from './science-14-auto-14-17-blood-groups.json';

export const ALL_PILOT_LESSONS: LessonContentPackage[] = [
  science14Heart as unknown as LessonContentPackage,
  science10Reactions as unknown as LessonContentPackage,
  maths06Heights as unknown as LessonContentPackage,
  english01Flight as unknown as LessonContentPackage,
  tamil04Translation as unknown as LessonContentPackage,
  tamil04Grammar as unknown as LessonContentPackage,
  socialHistory01Wwi as unknown as LessonContentPackage,
  maths07Mensuration3d as unknown as LessonContentPackage,
  science07Molecules3d as unknown as LessonContentPackage,
  science11Carbon3d as unknown as LessonContentPackage,
  science12Plant3d as unknown as LessonContentPackage,
  geo01IndiaRelief3d as unknown as LessonContentPackage,
  english01Poem as unknown as LessonContentPackage,
  english01Supp as unknown as LessonContentPackage,
  tamil04Poem as unknown as LessonContentPackage,
  tamil04Supp as unknown as LessonContentPackage,
  history01Rivalry as unknown as LessonContentPackage,
  history01RussianRev as unknown as LessonContentPackage,
  maths06Intro as unknown as LessonContentPackage,
  maths06Identities as unknown as LessonContentPackage,
  science14Transport as unknown as LessonContentPackage,
  science14Transpiration as unknown as LessonContentPackage,
  science14Vessels as unknown as LessonContentPackage,
  science14Heartbeat as unknown as LessonContentPackage,
  science14BloodGroups as unknown as LessonContentPackage,
];

const DIRECT_LESSON_IDS = new Set<string>(ALL_PILOT_LESSONS.map((l) => l.section_id));
const LESSON_MAP = new Map<string, LessonContentPackage>();
for (const lesson of ALL_PILOT_LESSONS) {
  LESSON_MAP.set(lesson.section_id, lesson);
}
for (const lesson of ALL_PILOT_LESSONS) {
  if (lesson.related_section_ids) {
    for (const relId of lesson.related_section_ids) {
      if (!LESSON_MAP.has(relId)) {
        LESSON_MAP.set(relId, lesson);
      }
    }
  }
}

export function isDirectPilotLessonId(sectionId: string): boolean {
  return DIRECT_LESSON_IDS.has(sectionId);
}

export function getLessonContentBySectionId(
  sectionId: string,
): LessonContentPackage | undefined {
  return LESSON_MAP.get(sectionId);
}

export function getAllPilotLessonIds(): string[] {
  return ALL_PILOT_LESSONS.map((l) => l.section_id);
}

export function getAllCoveredSectionIds(): string[] {
  return Array.from(LESSON_MAP.keys());
}
