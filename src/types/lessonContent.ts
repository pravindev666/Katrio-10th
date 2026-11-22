import type { EngineType, RepresentationStatus, SubjectSlug } from './curriculum';

/**
 * Section 6 Contract from 03_AGY_Interactive_Chapter_Content_and_QA_Spec.md
 * Strictly separates authorable, validated educational content from reusable engine code.
 */
export interface LessonKeyTerm {
  term: string;
  definition: string;
  native_term?: string;
  example?: string;
}

export interface LessonInteractionControl {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'select' | 'stepper' | 'sequence' | 'balancer' | 'map_layer' | 'button_group';
  description: string;
  keyboard_equivalent: string;
}

export interface LessonAccessibleStep {
  step_number: number;
  heading: string;
  description: string;
  key_takeaway: string;
}

export interface LessonAssessmentOption {
  id: string;
  label: string;
  is_correct: boolean;
  feedback: string;
}

export interface LessonAssessmentQuestion {
  id: string;
  difficulty: 'recall' | 'conceptual' | 'application';
  prompt: string;
  hint: string;
  options: LessonAssessmentOption[];
  worked_explanation: string;
}

export interface LessonFlashcard {
  id: string;
  card_type: 'term' | 'diagram_label' | 'why' | 'apply';
  front: string;
  back: string;
  hint?: string;
}

export interface LessonAssetProvenance {
  asset_id: string;
  kind: 'procedural_3d' | 'interactive_svg' | 'data_table' | 'schematic_map';
  description: string;
  license: string;
  source_reference: string;
}

export interface LessonStoryboardStep {
  mode: 'guided' | 'explore';
  step: number;
  title: string;
  learner_action: string;
  expected_response: string;
}

export interface LessonContentPackage {
  section_id: string;
  related_section_ids?: string[];
  unit_id: string;
  subject: SubjectSlug;
  title: string;
  subtitle: string;
  curiosity_hook: string;
  estimated_minutes: number;
  source_pdf: string;
  source_edition: string;
  source_printed_pages: number[];
  source_pdf_pages: number[];
  source_verified_by: string;
  revision_date: string;
  editorial_status: 'draft' | 'in_review' | 'content_verified' | 'interactive_qa_passed' | 'published';
  learning_objectives: string[];
  concept_outline: {
    heading: string;
    summary: string;
    worked_example?: string;
  }[];
  key_terms: LessonKeyTerm[];
  interaction: {
    engine: EngineType;
    version: string;
    scene_id: string;
    representation_status: RepresentationStatus;
    modes_supported: ('guided' | 'explore' | '2d_text')[];
    controls: LessonInteractionControl[];
    expected_observations: string[];
    limitations: string[];
    safety_note?: string;
    config: Record<string, unknown>;
  };
  storyboard: LessonStoryboardStep[];
  accessible_equivalent: {
    mode: 'labelled_svg_steps' | 'structured_table_steps' | 'native_tamil_text_steps' | 'evidence_timeline_table';
    summary: string;
    steps: LessonAccessibleStep[];
  };
  assessment: {
    question_bank: LessonAssessmentQuestion[];
    worked_feedback: string[];
  };
  flashcards: LessonFlashcard[];
  assets: LessonAssetProvenance[];
  qa_checklist: {
    curriculum_alignment_checked: boolean;
    computational_tests_passed: boolean;
    keyboard_parity_verified: boolean;
    webgl_off_2d_verified: boolean;
    reduced_motion_verified: boolean;
    rights_notes: string;
  };
  rights_reviewed: boolean;
  subject_review_passed: boolean;
  accessibility_qa_passed: boolean;
  student_visible: boolean;
}
