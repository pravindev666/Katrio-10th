import test from 'node:test';
import assert from 'node:assert/strict';
import {
  curriculumRegistry,
  getSubjects,
  getUnitsBySubject,
  getUnitById,
  getSectionById,
  searchCurriculum,
  suggestRoutesForPath,
  formatSourceStatusLabel,
  getStudentSectionStatus,
  getStudentUnitStatus,
  getUnitCuriosityQuestion,
} from './curriculumStore';
import {
  createInitialProgressRecord,
  validateProgressJson,
  getSectionProgressStage,
  getCompletedSectionCount,
} from '../features/local-progress/progressStore';
import { HISTORY_UNIT4_SUBSECTION_LESSONS, getSubsectionLessonById } from '../data/history_unit4_index';
import { validateSubsectionLesson } from '../types/subsectionLesson';

test('curriculum registry satisfies exact canonical handover + verified PDF body extensions', () => {
  assert.equal(curriculumRegistry.audit_totals.subjects, 5);
  assert.equal(curriculumRegistry.audit_totals.units, 72);
  assert.equal(curriculumRegistry.audit_totals.body_verified_extensions, 3);
  assert.equal(curriculumRegistry.audit_totals.toc_verified_sections, 116);
  assert.equal(curriculumRegistry.audit_totals.auto_extracted_candidates, 578);
  assert.equal(curriculumRegistry.audit_totals.total_sections, 694);
  assert.equal(curriculumRegistry.audit_totals.source_page_anchors, 1387);
  assert.equal(curriculumRegistry.audit_totals.evidence_markers, 370);
  assert.ok((curriculumRegistry.audit_totals.pilot_lessons_count ?? 0) >= 75);
});

test('subject unit counts match Tamil Nadu Class 10 textbooks', () => {
  const subjects = getSubjects();
  assert.equal(subjects.length, 5);
  assert.equal(getUnitsBySubject('science').length, 23);
  assert.equal(getUnitsBySubject('mathematics').length, 8);
  assert.equal(getUnitsBySubject('english').length, 7);
  assert.equal(getUnitsBySubject('tamil').length, 7);
  assert.equal(getUnitsBySubject('social_science').length, 27);
  assert.equal(getUnitsBySubject('social_science', 'history').length, 10);
  assert.equal(getUnitsBySubject('social_science', 'geography').length, 7);
  assert.equal(getUnitsBySubject('social_science', 'civics').length, 5);
  assert.equal(getUnitsBySubject('social_science', 'economics').length, 5);
});

test('canonical handover IDs and exact textbook titles resolve cleanly across all 5 subjects', () => {
  // Maths Chapter 6 -> 6.3 Heights and Distances (canonical ID: maths-06-03)
  const trigUnit = getUnitById('mathematics', 'maths-06');
  assert.ok(trigUnit);
  assert.equal(trigUnit.title, 'Trigonometry');
  const heightsResolved = getSectionById('mathematics', 'maths-06', 'maths-06-03');
  assert.ok(heightsResolved);
  assert.equal(heightsResolved.section.title, 'Heights and Distances');
  assert.equal(heightsResolved.section.section_number, '6.3');
  assert.equal(heightsResolved.section.lesson_content_id, 'maths-06-03');

  // Science Unit 14 -> 14.15 Structure of Human Heart
  const heartResolved = getSectionById(
    'science',
    'science-14',
    'science-14-auto-14-15-structure-of-human-heart',
  );
  assert.ok(heartResolved);
  assert.equal(heartResolved.unit.title, 'Transportation in Plants and Circulation in Animals');
  assert.equal(heartResolved.section.lesson_content_id, 'science-14-auto-14-15-structure-of-human-heart');

  // Science Unit 10 -> 10.1 TYPES OF CHEMICAL REACTIONS (Pass 0 recovered multi-line heading!)
  const rxnResolved = getSectionById(
    'science',
    'science-10',
    'science-10-auto-10-1-types-of-chemical',
  );
  assert.ok(rxnResolved);
  assert.equal(rxnResolved.section.title, 'TYPES OF CHEMICAL REACTIONS');
  assert.equal(rxnResolved.section.original_extracted_title, 'TYPES OF CHEMICAL');

  // English Unit 1 -> His First Flight, Life, The Tempest
  const engUnit1 = getUnitById('english', 'english-01');
  assert.ok(engUnit1);
  const titles = engUnit1.sections.map((s) => s.title);
  assert.deepEqual(titles, ['His First Flight', 'Life', 'The Tempest']);
  const flightResolved = getSectionById('english', 'english-01', 'english-01-prose');
  assert.ok(flightResolved);
  assert.equal(flightResolved.section.lesson_content_id, 'english-01-prose');

  // Tamil இயல் 4 மணற்கேணி
  const tamilUnit4 = getUnitById('tamil', 'tamil-04');
  assert.ok(tamilUnit4);
  assert.equal(tamilUnit4.title, 'மணற்கேணி');
  const tamilTitles = tamilUnit4.sections.map((s) => s.title);
  assert.ok(tamilTitles.includes('மொழிபெயர்ப்புக் கல்வி'));
  assert.ok(tamilTitles.includes('திருவிளையாடற் புராணம்'));
  assert.ok(tamilTitles.includes('புதிய நம்பிக்கை'));
  assert.ok(tamilTitles.includes('இலக்கணம் – பொது'));

  // Verify all 3 visually-audited Pass 0 headings resolved cleanly
  const sci21 = getSectionById('science', 'science-21', 'science-21-auto-21-7-diseases-and-disorders');
  assert.equal(sci21?.section.title, 'Diseases and Disorders due to Lifestyle Modifications');

  const geo02 = getSectionById('social_science', 'social-geography-02', 'social-geography-02-auto-2-1-the-factors-affecting-the');
  assert.equal(geo02?.section.title, 'The factors affecting the climate');

  const eco01 = getSectionById('social_science', 'social-economics-01', 'social-economics-01-auto-1-5-economic-growth-and');
  assert.equal(eco01?.section.title, 'Economic Growth and Development');

  // Social Science History Unit 1 -> Outbreak of WWI (Pass 0 recovered heading!)
  const wwiResolved = getSectionById(
    'social_science',
    'social-history-01',
    'social-history-01-auto-1-3-causes-course-and',
  );
  assert.ok(wwiResolved);
  assert.equal(wwiResolved.section.title, 'Causes, Course and Results of World War I');
});

test('search finds both English and Tamil Unicode queries accurately', () => {
  const tamilHits = searchCurriculum('மணற்கேணி');
  assert.ok(tamilHits.length > 0);
  assert.equal(tamilHits[0].unitId, 'tamil-04');

  const heightsHits = searchCurriculum('Heights and Distances');
  assert.ok(heightsHits.some((h) => h.unitId === 'maths-06'));

  const autoStatusLabel = formatSourceStatusLabel('auto_extracted_review_required');
  assert.equal(autoStatusLabel.label, 'Title awaiting editorial verification');
  assert.equal(autoStatusLabel.requiresEditorialBanner, true);
});

test('section navigation resolves prev/next sections and canonical 404 route suggestions', () => {
  const resolved = getSectionById('mathematics', 'maths-06', 'maths-06-03');
  assert.ok(resolved);
  assert.equal(resolved.section.title, 'Heights and Distances');
  assert.ok(resolved.prevSection);

  const suggestions = suggestRoutesForPath('/class-10/science/heart');
  assert.ok(suggestions.length > 0);
  assert.ok(
    suggestions.some(
      (s) => s.route === '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
    ),
  );
});

test('student-friendly status helpers and curiosity questions map accurately', () => {
  const resolved = getSectionById('mathematics', 'maths-06', 'maths-06-03');
  assert.ok(resolved);
  const secStatus = getStudentSectionStatus(resolved.section);
  assert.equal(secStatus.badgeLabel, 'Interactive lesson ready');
  assert.equal(secStatus.kind, 'interactive_ready');

  const plannedResolved = getSectionById('mathematics', 'maths-01', 'maths-01-01');
  assert.ok(plannedResolved);
  const plannedStatus = getStudentSectionStatus(plannedResolved.section);
  assert.equal(plannedStatus.kind, 'in_preparation');
  assert.equal(plannedStatus.badgeLabel, 'Lesson in preparation');

  const unitStatus = getStudentUnitStatus(resolved.unit);
  assert.equal(unitStatus.kind, 'interactive_ready');
  assert.ok(unitStatus.verifiedCount >= 1);

  const question = getUnitCuriosityQuestion(resolved.unit);
  assert.ok(question.includes('tower'));
});

test('progress stage distinguishes Started, Practised, Completed and deduplicates union count', () => {
  const record = createInitialProgressRecord();
  const secId = 'science-14-auto-14-15-structure-of-human-heart';

  assert.equal(getSectionProgressStage(record, secId), 'not_started');
  assert.equal(getCompletedSectionCount(record), 0);

  // Visiting a lesson marks it Started, never Completed
  record.visitedSections.push(secId);
  assert.equal(getSectionProgressStage(record, secId), 'started');
  assert.equal(getCompletedSectionCount(record), 0);

  // Interacting with controls marks it Practised, still not Completed
  record.practisedSections.push(secId);
  assert.equal(getSectionProgressStage(record, secId), 'practised');
  assert.equal(getCompletedSectionCount(record), 0);

  // Completing both the demo and concept check on the SAME section counts as 1 unique completed lesson
  record.completedDemos.push(secId);
  record.quizCheckpoints[secId] = { score: 3, total: 3, completedAt: new Date().toISOString() };
  assert.equal(getSectionProgressStage(record, secId), 'completed');
  assert.equal(getCompletedSectionCount(record), 1);

  // Completing a second distinct section increments the unique count to 2
  record.quizCheckpoints['maths-06-03'] = { score: 2, total: 3, completedAt: new Date().toISOString() };
  assert.equal(getCompletedSectionCount(record), 2);
});

test('device progress JSON export/import validation enforces schemaVersion and preserves practisedSections', () => {
  const initial = createInitialProgressRecord();
  initial.visitedSections.push('maths-06-03');
  initial.practisedSections.push('maths-06-03');
  const raw = JSON.stringify(initial);

  const validCheck = validateProgressJson(raw);
  assert.equal(validCheck.valid, true);
  assert.deepEqual(validCheck.data?.visitedSections, ['maths-06-03']);
  assert.deepEqual(validCheck.data?.practisedSections, ['maths-06-03']);

  const invalidCheck = validateProgressJson(JSON.stringify({ schemaVersion: 'wrong-v0' }));
  assert.equal(invalidCheck.valid, false);
});

test('History Unit 4 (4.1–4.10) covers all 10 verified textbook subsections in exact order and passes contract validation', () => {
  const hist4 = getUnitById('social_science', 'social-history-04');
  assert.ok(hist4);
  assert.equal(hist4.title, 'The World after World War II');
  assert.deepEqual(
    hist4.sections.map((s) => s.section_number),
    ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10'],
  );
  assert.equal(HISTORY_UNIT4_SUBSECTION_LESSONS.length, 10);

  for (const sec of hist4.sections) {
    const pkg = getSubsectionLessonById(sec.id);
    assert.ok(pkg, `Missing 9-stage SubsectionLessonPackage for ${sec.id}`);
    const validationErrors = validateSubsectionLesson(pkg);
    assert.deepEqual(
      validationErrors,
      [],
      `Validation errors for ${sec.id}: ${validationErrors.join('; ')}`,
    );
    assert.equal(pkg.source.editorialReviewStatus, 'pending_human_teacher_review');
    assert.equal(getStudentSectionStatus(sec).kind, 'interactive_ready');
  }
});

test('all four Social Science Unit 4 strands resolve cleanly without route or ID collisions', () => {
  const unitIds = [
    'social-history-04',
    'social-geography-04',
    'social-civics-04',
    'social-economics-04',
  ];
  const seenRoutes = new Set<string>();
  for (const uid of unitIds) {
    const unit = getUnitById('social_science', uid);
    assert.ok(unit, `Missing Social Science Unit 4 unit ${uid}`);
    assert.ok(!seenRoutes.has(unit.route), `Colliding unit route ${unit.route}`);
    seenRoutes.add(unit.route);
    for (const sec of unit.sections) {
      assert.ok(!seenRoutes.has(sec.route), `Colliding section route ${sec.route}`);
      seenRoutes.add(sec.route);
      assert.ok(sec.route.includes(uid), `Section route ${sec.route} does not scope to ${uid}`);
    }
  }
});
