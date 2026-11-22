export interface AccessibilityPreferences {
  theme: 'light' | 'dark' | 'high-contrast';
  fontScale: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
  focusMode: boolean;
  audioMuted: boolean;
  prefer2DPathway: boolean;
  bilingualTamilAssist: boolean;
}

export interface LastLessonState {
  route: string;
  sectionId: string;
  title: string;
  unitTitle: string;
  step: 'Explore' | 'Understand' | 'Try' | 'Check';
}

export interface DeviceProgressRecord {
  schemaVersion: 'katrio-device-v1';
  updatedAt: string;
  preferences: AccessibilityPreferences;
  visitedSections: string[];
  practisedSections: string[];
  bookmarkedSections: string[];
  completedDemos: string[];
  flashcardRatings: Record<string, 'know' | 'review_again'>;
  quizCheckpoints: Record<string, { score: number; total: number; completedAt: string }>;
  lastVisitedRoute: string | null;
  lastLessonState?: LastLessonState | null;
}

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  theme: 'light',
  fontScale: 'normal',
  reducedMotion: false,
  focusMode: false,
  audioMuted: true,
  prefer2DPathway: false,
  bilingualTamilAssist: true,
};

export function createInitialProgressRecord(): DeviceProgressRecord {
  return {
    schemaVersion: 'katrio-device-v1',
    updatedAt: new Date().toISOString(),
    preferences: { ...DEFAULT_PREFERENCES },
    visitedSections: [],
    practisedSections: [],
    bookmarkedSections: [],
    completedDemos: [],
    flashcardRatings: {},
    quizCheckpoints: {},
    lastVisitedRoute: null,
    lastLessonState: null,
  };
}

export function getCompletedSectionCount(record: DeviceProgressRecord): number {
  const uniqueCompleted = new Set<string>([
    ...(record.completedDemos ?? []),
    ...Object.keys(record.quizCheckpoints ?? {}),
  ]);
  return uniqueCompleted.size;
}

export function getSectionProgressStage(
  record: DeviceProgressRecord,
  sectionId: string,
): 'not_started' | 'started' | 'practised' | 'completed' {
  const hasQuiz = Boolean(record.quizCheckpoints[sectionId]);
  const hasCompletedActivity = record.completedDemos.some(
    (id) => id === sectionId || id.endsWith(`-${sectionId}`),
  );
  if (hasQuiz || hasCompletedActivity) {
    return 'completed';
  }
  if ((record.practisedSections ?? []).includes(sectionId)) {
    return 'practised';
  }
  if (record.visitedSections.includes(sectionId)) {
    return 'started';
  }
  return 'not_started';
}

export function validateProgressJson(rawJson: string): {
  valid: boolean;
  error?: string;
  data?: DeviceProgressRecord;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'JSON root must be an object.' };
    }
    if (parsed.schemaVersion !== 'katrio-device-v1') {
      return {
        valid: false,
        error: `Unsupported schemaVersion "${String(parsed.schemaVersion)}". Expected "katrio-device-v1".`,
      };
    }
    if (!Array.isArray(parsed.visitedSections) || !Array.isArray(parsed.bookmarkedSections)) {
      return {
        valid: false,
        error: 'Missing or invalid visitedSections / bookmarkedSections arrays.',
      };
    }
    if (!parsed.preferences || typeof parsed.preferences !== 'object') {
      return {
        valid: false,
        error: 'Missing preferences block in progress file.',
      };
    }

    const sanitized: DeviceProgressRecord = {
      schemaVersion: 'katrio-device-v1',
      updatedAt: new Date().toISOString(),
      preferences: {
        theme:
          parsed.preferences.theme === 'dark' || parsed.preferences.theme === 'high-contrast'
            ? parsed.preferences.theme
            : 'light',
        fontScale:
          parsed.preferences.fontScale === 'large' || parsed.preferences.fontScale === 'xlarge'
            ? parsed.preferences.fontScale
            : 'normal',
        reducedMotion: Boolean(parsed.preferences.reducedMotion),
        focusMode: Boolean(parsed.preferences.focusMode),
        audioMuted:
          typeof parsed.preferences.audioMuted === 'boolean'
            ? parsed.preferences.audioMuted
            : true,
        prefer2DPathway: Boolean(parsed.preferences.prefer2DPathway),
        bilingualTamilAssist:
          typeof parsed.preferences.bilingualTamilAssist === 'boolean'
            ? parsed.preferences.bilingualTamilAssist
            : true,
      },
      visitedSections: parsed.visitedSections.filter((x: unknown) => typeof x === 'string'),
      practisedSections: Array.isArray(parsed.practisedSections)
        ? parsed.practisedSections.filter((x: unknown) => typeof x === 'string')
        : [],
      bookmarkedSections: parsed.bookmarkedSections.filter((x: unknown) => typeof x === 'string'),
      completedDemos: Array.isArray(parsed.completedDemos)
        ? parsed.completedDemos.filter((x: unknown) => typeof x === 'string')
        : [],
      flashcardRatings:
        parsed.flashcardRatings && typeof parsed.flashcardRatings === 'object'
          ? parsed.flashcardRatings
          : {},
      quizCheckpoints:
        parsed.quizCheckpoints && typeof parsed.quizCheckpoints === 'object'
          ? parsed.quizCheckpoints
          : {},
      lastVisitedRoute:
        typeof parsed.lastVisitedRoute === 'string' ? parsed.lastVisitedRoute : null,
      lastLessonState:
        parsed.lastLessonState &&
        typeof parsed.lastLessonState === 'object' &&
        typeof parsed.lastLessonState.route === 'string'
          ? parsed.lastLessonState
          : null,
    };

    return { valid: true, data: sanitized };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid JSON syntax.',
    };
  }
}
