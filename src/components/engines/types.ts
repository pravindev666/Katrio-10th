import type { LessonContentPackage } from '../../types/lessonContent';

/**
 * Reusable LessonEngine lifecycle contract (Section 7 of 03_AGY spec).
 * Engine logic stays strictly separate from textbook data packages.
 */
export interface LessonEngineStateSnapshot {
  engineId: string;
  version: string;
  mode: 'guided' | 'explore' | '2d_text';
  completed: boolean;
  payload: Record<string, unknown>;
}

export interface LessonEngineController {
  load: (lesson: LessonContentPackage) => Promise<void> | void;
  prepare: () => void;
  mount: () => void;
  reset: () => void;
  dispose: () => void;
  serialize: () => LessonEngineStateSnapshot;
}

export interface ModularEngineProps {
  sectionId: string;
  lesson?: LessonContentPackage;
  mode: 'guided' | 'explore' | '2d_text';
  reducedMotion: boolean;
  onInteract: () => void;
  onComplete: (message: string) => void;
}
