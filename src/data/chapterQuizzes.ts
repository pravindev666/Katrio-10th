import type { LessonAssessmentQuestion } from '../types/lessonContent';
import { getChapterMindMap } from './chapterMindMaps';

/**
 * Generates 3 textbook-aligned, untimed conceptual check questions (with hints and worked explanations)
 * for any of the 72 Tamil Nadu Class 10 chapters that do not yet have a full bespoke LessonContentPackage JSON.
 * Uses the verified 72-chapter Mind Map facts, formulas, dates, and Board Exam cues — never mixes unrelated subjects!
 */
export function getChapterConceptChecks(
  unitId: string,
  unitTitle: string,
  sectionNumber: string,
  sectionTitle: string,
  printedPage: number,
): LessonAssessmentQuestion[] {
  const map = getChapterMindMap(unitId);
  const branches = map.branches;

  const q1Target = branches[0];
  const q1Others = branches.slice(1, 4);

  const q2Target = branches[2] ?? branches[0];
  const q2Others = [branches[0], branches[1], branches[3]].filter((b) => b && b.title !== q2Target.title);

  const q3Target = branches[1] ?? branches[0];
  const q3Others = [branches[0], branches[2], branches[3]].filter((b) => b && b.title !== q3Target.title);

  return [
    {
      id: `${unitId}-q1`,
      difficulty: 'conceptual',
      prompt: `[${unitTitle} · ${sectionNumber} ${sectionTitle} (p. ${printedPage})] Which core concept accurately describes "${q1Target.title}"?`,
      hint: `Check Branch 1 (${q1Target.title}) on the Chapter Mind Map or remember: ${map.mnemonic}`,
      worked_explanation: `${q1Target.title}: ${q1Target.summary} Exam cue: ${q1Target.examCue}`,
      options: [
        {
          id: 'a',
          label: q1Target.summary,
          is_correct: true,
          feedback: `Spot on! ${q1Target.examCue}`,
        },
        {
          id: 'b',
          label: q1Others[0]?.summary ?? 'An unrelated physical process outside this chapter.',
          is_correct: false,
          feedback: `That belongs to "${q1Others[0]?.title ?? 'another branch'}", not "${q1Target.title}".`,
        },
        {
          id: 'c',
          label: q1Others[1]?.summary ?? 'Only applies to pure arithmetic constants.',
          is_correct: false,
          feedback: `That describes "${q1Others[1]?.title ?? 'another branch'}". Look closely at "${q1Target.title}".`,
        },
        {
          id: 'd',
          label: q1Others[2]?.summary ?? 'None of the chapter principles apply here.',
          is_correct: false,
          feedback: `That matches "${q1Others[2]?.title ?? 'another branch'}" instead.`,
        },
      ],
    },
    {
      id: `${unitId}-q2`,
      difficulty: 'application',
      prompt: `Board Exam Quick-Recall: Which statement matches the verified key fact for "${q2Target.title}" in ${unitTitle}?`,
      hint: `Key reference strip for this chapter: ${map.formulaOrKeyFact}`,
      worked_explanation: `${q2Target.title} → ${q2Target.examCue} (${q2Target.summary})`,
      options: [
        {
          id: 'a',
          label: q2Others[0]?.examCue ?? 'Opposite relationship applies under standard conditions.',
          is_correct: false,
          feedback: `Not quite — that exam cue belongs to "${q2Others[0]?.title ?? 'another topic'}".`,
        },
        {
          id: 'b',
          label: q2Target.examCue,
          is_correct: true,
          feedback: `Correct! Remembering "${q2Target.examCue}" earns crisp Board exam marks.`,
        },
        {
          id: 'c',
          label: q2Others[1]?.examCue ?? 'Ignore units and standard textbook sign conventions.',
          is_correct: false,
          feedback: `That cue applies to "${q2Others[1]?.title ?? 'another topic'}".`,
        },
        {
          id: 'd',
          label: q2Others[2]?.examCue ?? 'Always substitute zero for all variables.',
          is_correct: false,
          feedback: `That cue belongs to "${q2Others[2]?.title ?? 'another topic'}".`,
        },
      ],
    },
    {
      id: `${unitId}-q3`,
      difficulty: 'recall',
      prompt: `Active Memory Check: Which branch of ${map.centralNode} specifically explains "${q3Target.summary}"?`,
      hint: `Look at the 4 radial branches of "${map.centralNode}" in the Mind Map.`,
      worked_explanation: `"${q3Target.title}" covers: ${q3Target.summary} Key takeaway: ${q3Target.examCue}`,
      options: [
        {
          id: 'a',
          label: q3Others[0]?.title ?? 'Branch A',
          is_correct: false,
          feedback: `"${q3Others[0]?.title}" focuses on: ${q3Others[0]?.summary}`,
        },
        {
          id: 'b',
          label: q3Others[1]?.title ?? 'Branch B',
          is_correct: false,
          feedback: `"${q3Others[1]?.title}" focuses on: ${q3Others[1]?.summary}`,
        },
        {
          id: 'c',
          label: q3Target.title,
          is_correct: true,
          feedback: `Excellent recall! ${q3Target.title} — ${q3Target.examCue}`,
        },
        {
          id: 'd',
          label: q3Others[2]?.title ?? 'Branch D',
          is_correct: false,
          feedback: `"${q3Others[2]?.title}" focuses on: ${q3Others[2]?.summary}`,
        },
      ],
    },
  ];
}
