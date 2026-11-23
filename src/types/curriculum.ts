export type SubjectSlug =
  | 'science'
  | 'mathematics'
  | 'english'
  | 'tamil'
  | 'social_science';

export type SocialStrand = 'history' | 'geography' | 'civics' | 'economics';

export type SourceStatus =
  | 'toc_verified'
  | 'visually_verified_toc'
  | 'auto_extracted_review_required'
  | 'toc_verified_page_needs_review';

export type ContentStatus =
  | 'planned'
  | 'in_review'
  | 'content_verified'
  | 'interactive_qa_passed'
  | 'published';

export type ReviewStatus =
  | 'awaiting_human_audit'
  | 'pass0_pdf_verified_pending_human'
  | 'pending_review'
  | 'toc_verified_scaffold'
  | 'subject_review_pending'
  | 'approved';

export type InteractionStatus =
  | 'placeholder_scaffold'
  | 'demo_available'
  | 'in_development'
  | 'pilot_implemented'
  | 'verified_interactive';

export type Pass0AuditAction =
  | 'toc_verified'
  | 'approved'
  | 'corrected'
  | 'rejected'
  | 'needs_manual_visual_check';

export type EngineType =
  | 'ModelExplorer3D'
  | 'JourneyThrough'
  | 'SafeVirtualLab'
  | 'PhysicsWorkbench'
  | 'GraphSandbox'
  | 'GeometryWorkbench'
  | 'TimelineMap'
  | 'GeoMap'
  | 'StoryStage'
  | 'TamilLanguageStudio'
  | 'Flashcards'
  | 'QuizEngine'
  | 'ConceptGame';

export type RepresentationStatus =
  | 'Measured/Observed'
  | 'Equation-based simulation'
  | 'Conceptual schematic'
  | 'Illustrative reconstruction'
  | 'Hypothetical scenario';

export interface SourceReference {
  book_id: string;
  book_title: string;
  edition: string;
  pdf_filename: string;
  printed_page_start: number;
  printed_page_end: number;
  pdf_page_start: number;
  pdf_page_end: number;
}

export interface SourcePageAnchor {
  anchor_id: string;
  unit_id: string;
  subject: SubjectSlug;
  book_id: string;
  printed_page: number;
  pdf_page: number;
  linked_section_ids: string[];
  audit_note: string;
}

export interface EvidenceMarker {
  page_printed: number;
  marker_pattern: string;
  detection: string;
}

export interface CurriculumSection {
  id: string;
  unit_id: string;
  subject: SubjectSlug;
  strand?: SocialStrand;
  section_number: string;
  title: string;
  original_extracted_title?: string;
  kind:
  | 'toc_section'
  | 'body_heading'
  | 'prose'
  | 'poem'
  | 'supplementary'
  | 'grammar'
  | 'drama'
  | 'numbered_subsection'
  | 'activity_slot';
  book: string;
  printed_page: number;
  printed_page_end?: number;
  pdf_page: number;
  pdf_page_end?: number;
  source_status: SourceStatus;
  content_status: ContentStatus;
  review_status: ReviewStatus;
  interaction_status: InteractionStatus;
  pass0_audit_action?: Pass0AuditAction;
  pass0_audit_note?: string;
  route: string;
  activity_template: EngineType;
  suggested_activity_plan?: string;
  representation_status: RepresentationStatus;
  accessibility_fallback: string;
  learning_goal_placeholder: string;
  assets: string[];
  sources: SourceReference[];
  lesson_content_id?: string;
  demo_id?: string;
  body_verified_extension?: boolean;
}

export interface CurriculumUnit {
  id: string;
  subject: SubjectSlug;
  strand?: SocialStrand;
  unit_number: number;
  code_label: string;
  title: string;
  tamil_subtitle?: string;
  theme?: string;
  kind: 'unit' | 'chapter' | 'iyal' | 'thematic_unit';
  book: string;
  edition: string;
  printed_page: number;
  printed_page_end: number;
  pdf_page: number;
  pdf_page_end: number;
  source_status: SourceStatus;
  content_status: ContentStatus;
  review_status: ReviewStatus;
  interaction_status: InteractionStatus;
  route: string;
  hero_interaction_title: string;
  learning_evidence_summary: string;
  suggested_engine_label?: string;
  activity_template: EngineType;
  accessibility_fallback: string;
  sections: CurriculumSection[];
  source_page_anchors: SourcePageAnchor[];
  evidence_markers: EvidenceMarker[];
  assets: string[];
  sources: SourceReference[];
}

export interface SubjectMeta {
  slug: SubjectSlug;
  title: string;
  native_title?: string;
  world_name: string;
  tagline: string;
  book_title: string;
  edition: string;
  pdf_filename: string;
  pdf_page_offset: number;
  toc_pdf_pages: string;
  color_token: string;
  tint_token: string;
  unit_count: number;
  toc_verified_section_count: number;
  auto_extracted_section_count: number;
  source_page_anchor_count: number;
  evidence_marker_count: number;
  strands?: {
    slug: SocialStrand;
    title: string;
    unit_count: number;
    description: string;
  }[];
}

export interface CurriculumRegistry {
  document_id: string;
  schema_version: string;
  version: string;
  board: string;
  standard: number;
  working_title: string;
  generated_at: string;
  authority_notice: string;
  audit_totals: {
    subjects: number;
    units: number;
    toc_verified_sections: number;
    auto_extracted_candidates: number;
    total_sections: number;
    source_page_anchors: number;
    evidence_markers: number;
    pass0_corrected_headings: number;
    pass0_rejected_candidates: number;
    pilot_lessons_count: number;
    body_verified_extensions?: number;
  };
  subjects: SubjectMeta[];
  units: CurriculumUnit[];
}
