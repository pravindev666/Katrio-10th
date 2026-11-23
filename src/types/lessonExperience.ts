/**
 * Katrio Concept-First Lesson & Exact-Section Manifest Schema (Gates 4, 6 & 8).
 * Strictly keys every experience by exact canonical sectionId — never broad chapter prefix fallback.
 */

export type InteractionMode =
  | '2d-svg'
  | '2d-canvas'
  | '3d-webgl'
  | 'hybrid'
  | 'interactive-text'
  | 'story'
  | 'timeline'
  | 'map'
  | 'worked-example';

export type ConceptLabEngineId =
  | 'ElectricPotentialLab2D'
  | 'JoulesLawLab2D'
  | 'EthyleneRipeningLab2D'
  | 'PituitaryEndocrineLab2D'
  | 'MathsChapter4GeometryLabs2D'
  | 'ReproductionDiagrams2D';

export interface MindMapNode {
  id: string;
  label: string;
  role: 'core' | 'cause' | 'mechanism' | 'application' | 'caution';
  summary: string;
  detail: string;
  x: number;
  y: number;
}

export interface MindMapEdge {
  from: string;
  to: string;
  relation: string;
}

export interface WorkedExampleSpec {
  sourceRef: string;
  problem: string;
  given: string[];
  steps: string[];
  finalAnswer: string;
}

export interface ProgressiveChallengeItem {
  id: string;
  level: 'Supported' | 'Independent' | 'Apply to New Situation';
  prompt: string;
  options: { id: string; text: string; isCorrect: boolean; why: string }[];
  hint: string;
}

export interface FlashcardSpec {
  id: string;
  front: string;
  back: string;
  tag: string;
}

export interface ReadingChunkSpec {
  id: string;
  heading: string;
  printedPage: number;
  pdfPage: number;
  summary: string;
  plainExplanation: string;
  glossary: { term: string; tamil?: string; meaning: string }[];
  relatedExerciseRef: string;
}

export interface LessonExperienceSpec {
  sectionId: string;
  subject: 'science' | 'mathematics' | 'social_science' | 'english' | 'tamil';
  unitId: string;
  sectionNumber: string;
  title: { en: string; ta?: string };
  estimatedMinutes: string;
  textbookAnchor: {
    book: string;
    edition: string;
    pdf: string;
    printedPages: number[];
    pdfPages: number[];
    figures: string[];
    exercises: string[];
    officialPortalUrl: string;
  };
  editorialStatus: 'provisional' | 'teacher-reviewed' | 'published';
  concept: string;
  learningObjective: string;
  misconception: string;
  primaryMode: InteractionMode;
  engineId: ConceptLabEngineId;
  variantId: string;
  modelAssumptions: string[];
  variables: { id: string; label: string; unit?: string; validRange?: [number, number] }[];
  expectedObservations: string[];
  // 10-Stage Concept-First Lesson Content
  spark: { question: string; teaser: string };
  explanations: {
    simple: string;
    simpleTamil?: string;
    analogy: string;
    detailed: string;
    examReady: string[];
    misconceptions: { myth: string; reality: string }[];
  };
  mindMap: {
    title: string;
    nodes: MindMapNode[];
    edges: MindMapEdge[];
  };
  predictPrompt: {
    question: string;
    options: { id: string; label: string; feedback: string; isExpected?: boolean }[];
  };
  microMission: string;
  whyItWorks: {
    steps: { heading: string; detail: string }[];
    workedExample: WorkedExampleSpec;
  };
  solveChallenges: ProgressiveChallengeItem[];
  remember: {
    takeaways: string[];
    flashcards: FlashcardSpec[];
    funFact: { fact: string; source: string };
  };
  readingChunks: ReadingChunkSpec[];
  selfCheckPrompt: string;
  selfCheckGuide: string;
  alternative2D: string;
  accessibleText: string;
  reviewGate: string[];
}

export function validateLessonExperienceSpec(spec: LessonExperienceSpec): string[] {
  const errors: string[] = [];
  if (!spec.sectionId || !spec.unitId || !spec.sectionNumber) {
    errors.push(`Missing identity fields for ${spec.sectionId}`);
  }
  if (!spec.textbookAnchor.printedPages.length || !spec.textbookAnchor.pdfPages.length) {
    errors.push(`${spec.sectionId}: missing printedPages / pdfPages`);
  }
  if (spec.mindMap.nodes.length < 3 || spec.mindMap.nodes.length > 7) {
    errors.push(`${spec.sectionId}: mindMap must have 3-7 nodes`);
  }
  if (spec.solveChallenges.length < 2) {
    errors.push(`${spec.sectionId}: solveChallenges must have at least 2 progressive checks including transfer`);
  }
  if (spec.remember.takeaways.length < 3) {
    errors.push(`${spec.sectionId}: remember.takeaways must have at least 3 key takeaways`);
  }
  if (spec.readingChunks.length < 1) {
    errors.push(`${spec.sectionId}: readingChunks must include at least 1 source-linked chunk`);
  }
  if (spec.editorialStatus === 'published') {
    errors.push(`${spec.sectionId}: cannot be marked published before human educator review`);
  }
  return errors;
}
