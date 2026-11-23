import type { SubjectSlug } from './curriculum';

export type QualityTier =
  | 'indexed'
  | 'explained'
  | 'interactive'
  | 'assessed'
  | 'educator_approved';

export type RepresentationChoice =
  | 'interactive-2d'
  | 'interactive-3d'
  | 'synchronized-2d-3d'
  | 'interactive-language'
  | 'scenario-game';

export type UniverseWorldId =
  | 'science'
  | 'mathematics'
  | 'english'
  | 'tamil'
  | 'social_science'
  | 'arcade';

export interface UniverseConceptEdge {
  from: string;
  to: string;
  relationship: 'causes' | 'requires' | 'contrasts_with' | 'measured_by' | 'applied_in' | 'connects_to';
  label: string;
}

export interface UniverseWorldIsland {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  unitIds: string[];
  featuredRoute: string;
  featuredLabel: string;
}

export interface UniverseWorldDefinition {
  id: UniverseWorldId;
  subjectSlug?: SubjectSlug;
  worldName: string;
  shortTitle: string;
  tagline: string;
  bigQuestion: string;
  accentToken: string;
  tintToken: string;
  route: string;
  featuredPilotRoute: string;
  featuredPilotTitle: string;
  signatureAction: string;
  islands: UniverseWorldIsland[];
  islandConnections: { from: string; to: string; label: string }[];
}

export interface UniversePilotMeta {
  id: string;
  pilotCode: string;
  worldId: UniverseWorldId;
  sectionId: string;
  route: string;
  title: string;
  subjectLabel: string;
  representation: RepresentationChoice;
  oneLinePurpose: string;
  sourceBook: string;
  printedPages: string;
  microMissionGoal: string;
  transferSummary: string;
  beyondSyllabusBadge?: string;
  provisionalNotice?: string;
  qualityTier: QualityTier;
}
