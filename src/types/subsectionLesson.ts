/**
 * Formal Unified Subsection Lesson Schema (Katrio 360° Curriculum-to-Understanding Transformation — Section H).
 * Strictly separates source-grounded educational content from reusable React presentation & interactive engines.
 */
export interface ConceptMapNodeSpec {
  id: string;
  label: string;
  role: 'cause' | 'turning_point' | 'actor' | 'effect' | 'comparison';
  shortNote: string;
  detail: string;
  x: number; // SVG x coordinate (viewBox 0..640)
  y: number; // SVG y coordinate (viewBox 0..270)
}

export interface ConceptMapEdgeSpec {
  from: string;
  to: string;
  relation: string;
}

export interface CausalStepSpec {
  stepNumber: number;
  phase: 'Cause' | 'Mechanism' | 'Evidence' | 'Consequence';
  heading: string;
  explanation: string;
  factVsInterpretationNote?: string;
}

export interface MemoryLinkSpec {
  kind: 'Timeline Anchor' | 'Compare Pair' | 'Concept Hook' | 'Visual Cue';
  cue: string;
  meaning: string;
}

export interface ActiveChallengeSpec {
  kind: 'sequence' | 'cause_match' | 'misconception_check';
  prompt: string;
  items: {
    id: string;
    label: string;
    targetOrOrder: string; // expected match label or '1'..'4' order
    whyFeedback: string;
  }[];
  successMessage: string;
}

export interface ExamBridgeItemSpec {
  id: string;
  labelType: 'Textbook Exercise Reference' | 'Original Practice';
  format: 'MCQ' | 'Assertion–Reason' | 'Short Answer Guide' | 'Detail Answer Outline' | 'Fill in the Blank';
  sourceRef: string;
  prompt: string;
  options?: { id: string; text: string; isCorrect: boolean; why: string }[];
  modelPoints?: string[];
  hint: string;
}

export interface TextbookReadingChunkSpec {
  id: string;
  subheading: string;
  printedPage: number;
  pdfPage: number;
  originalSummary: string;
  keySentenceHighlight: string;
  plainExplanation: string;
  recallPrompt: string;
  recallAnswer: string;
  glossaryTerms: { term: string; tamil?: string; meaning: string }[];
}

export interface UpdatedContextNote {
  label: string;
  textbookStatement: string;
  updatedContext: string;
  datedSource: string;
}

export interface SubsectionLessonPackage {
  id: string;
  subject: 'science' | 'mathematics' | 'social_science' | 'english' | 'tamil';
  strand?: 'history' | 'geography' | 'civics' | 'economics';
  unitId: string;
  sectionNumber: string;
  title: { en: string; ta?: string };
  estimatedMinutes: string;
  goalOneLiner: string;
  source: {
    book: string;
    edition: string;
    printedPages: number[];
    pdfPages: number[];
    officialPortalUrl: string;
    provenanceStatus: 'body_verified' | 'toc_verified' | 'provisional';
    editorialReviewStatus: 'pending_human_teacher_review' | 'teacher_approved';
  };
  explain: {
    simple: string; // 80-160 word ELI5 explanation
    simpleTamil?: string;
    analogy: string; // Clearly labelled 1-sentence analogy
    textbookStandard: string; // 1-sentence formal textbook summary
    detailed: string; // Deeper conceptual layer
    examReadyPoints: string[]; // Crisp exam-ready takeaways
    misconceptions: { myth: string; reality: string }[];
  };
  conceptMap: {
    title: string;
    nodes: ConceptMapNodeSpec[];
    edges: ConceptMapEdgeSpec[];
    textFallback: string;
  };
  interactive: {
    engineId: 'HistoryUnit4Interactive2D';
    variantKey: '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7' | '4.8' | '4.9' | '4.10';
    title: string;
    questionToInvestigate: string;
    whatToNotice: string;
    fallbackSummary: string;
    capabilities: string[];
    performanceBudget: string;
    reducedMotionStrategy: string;
  };
  stepByStep: CausalStepSpec[];
  memoryLinks: MemoryLinkSpec[];
  activeChallenge: ActiveChallengeSpec;
  examBridge: ExamBridgeItemSpec[];
  readingChunks: TextbookReadingChunkSpec[];
  updatedContextNote?: UpdatedContextNote;
  finish: {
    takeaway: string;
    canYouExplainPrompt: string;
    canYouExplainGuide: string;
  };
  nextSectionId?: string;
  status: 'scaffold' | 'reviewed' | 'functional' | 'pedagogically_tested';
}

export function validateSubsectionLesson(pkg: SubsectionLessonPackage): string[] {
  const errors: string[] = [];
  if (!pkg.id || !pkg.unitId || !pkg.sectionNumber) errors.push(`Missing identity fields in ${pkg.id}`);
  if (!pkg.source.printedPages.length || !pkg.source.pdfPages.length) {
    errors.push(`${pkg.id}: missing printedPages/pdfPages crosswalk`);
  }
  const wordCount = pkg.explain.simple.trim().split(/\s+/).length;
  if (wordCount < 55 || wordCount > 190) {
    errors.push(`${pkg.id}: explain.simple word count (${wordCount}) outside respectful ELI5 range`);
  }
  if (pkg.conceptMap.nodes.length < 3 || pkg.conceptMap.nodes.length > 7) {
    errors.push(`${pkg.id}: conceptMap should have 3–7 meaningful nodes (got ${pkg.conceptMap.nodes.length})`);
  }
  if (pkg.stepByStep.length < 3) errors.push(`${pkg.id}: stepByStep must contain at least 3 causal steps`);
  if (pkg.memoryLinks.length < 2) errors.push(`${pkg.id}: memoryLinks must contain at least 2 cues`);
  if (pkg.readingChunks.length < 1) errors.push(`${pkg.id}: readingChunks must map at least 1 textbook chunk`);
  return errors;
}
