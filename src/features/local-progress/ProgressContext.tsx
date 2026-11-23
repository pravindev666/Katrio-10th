import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  type AccessibilityPreferences,
  type CapstoneProgressEntry,
  type DeviceProgressRecord,
  type LastLessonState,
  createInitialProgressRecord,
  validateProgressJson,
} from './progressStore';

const STORAGE_KEY = 'katrio_device_state_v1';

interface ProgressContextValue {
  record: DeviceProgressRecord;
  preferences: AccessibilityPreferences;
  storageAvailable: boolean;
  updatePreferences: (patch: Partial<AccessibilityPreferences>) => void;
  markSectionVisited: (
    sectionId: string,
    route: string,
    meta?: { title?: string; unitTitle?: string; step?: 'Explore' | 'Understand' | 'Try' | 'Check' },
  ) => void;
  markSectionExplored: (sectionId: string) => void;
  markSectionPractised: (sectionId: string) => void;
  toggleBookmarkSection: (sectionId: string) => void;
  markDemoCompleted: (demoId: string) => void;
  markUnderstoodCheckpoint: (sectionId: string, score: number, total: number, mode?: string) => void;
  rateFlashcard: (cardId: string, rating: 'know' | 'review_again') => void;
  recordQuizCheckpoint: (quizId: string, score: number, total: number) => void;
  saveTeachBackNote: (sectionId: string, note: string) => void;
  awardDiscoveryStamp: (stampId: string) => void;
  saveCapstoneProgress: (missionId: string, entry: Omit<CapstoneProgressEntry, 'updatedAt'>) => void;
  exportProgressJsonString: () => string;
  importProgressJsonString: (rawJson: string) => { valid: boolean; error?: string };
  resetDeviceProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [record, setRecord] = useState<DeviceProgressRecord>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const res = validateProgressJson(saved);
        if (res.valid && res.data) {
          return res.data;
        }
      }
    } catch {
      // Storage unavailable or blocked
    }
    return createInitialProgressRecord();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }

    const root = document.documentElement;
    const { theme, fontScale, reducedMotion, focusMode } = record.preferences;

    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('high-contrast', theme === 'high-contrast');
    root.classList.toggle('reduce-motion', reducedMotion);
    root.classList.toggle('focus-mode', focusMode);
    root.setAttribute('data-font-scale', fontScale);
  }, [record]);

  const updatePreferences = useCallback((patch: Partial<AccessibilityPreferences>) => {
    setRecord((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      preferences: { ...prev.preferences, ...patch },
    }));
  }, []);

  const markSectionVisited = useCallback(
    (
      sectionId: string,
      route: string,
      meta?: { title?: string; unitTitle?: string; step?: 'Explore' | 'Understand' | 'Try' | 'Check' },
    ) => {
      setRecord((prev) => {
        const alreadyVisited = prev.visitedSections.includes(sectionId);
        const nextLessonState: LastLessonState = {
          route,
          sectionId,
          title: meta?.title ?? prev.lastLessonState?.title ?? sectionId,
          unitTitle: meta?.unitTitle ?? prev.lastLessonState?.unitTitle ?? 'Class 10',
          step: meta?.step ?? prev.lastLessonState?.step ?? 'Explore',
        };
        if (
          alreadyVisited &&
          prev.lastVisitedRoute === route &&
          prev.lastLessonState?.step === nextLessonState.step
        ) {
          return prev;
        }
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          visitedSections: alreadyVisited
            ? prev.visitedSections
            : [...prev.visitedSections, sectionId],
          lastVisitedRoute: route,
          lastLessonState: nextLessonState,
        };
      });
    },
    [],
  );

  const markSectionExplored = useCallback((sectionId: string) => {
    setRecord((prev) => {
      const current = prev.exploredSections ?? [];
      if (current.includes(sectionId)) return prev;
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        exploredSections: [...current, sectionId],
      };
    });
  }, []);

  const markSectionPractised = useCallback((sectionId: string) => {
    setRecord((prev) => {
      const current = prev.practisedSections ?? [];
      if (current.includes(sectionId)) return prev;
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        practisedSections: [...current, sectionId],
      };
    });
  }, []);

  const toggleBookmarkSection = useCallback((sectionId: string) => {
    setRecord((prev) => {
      const exists = prev.bookmarkedSections.includes(sectionId);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        bookmarkedSections: exists
          ? prev.bookmarkedSections.filter((id) => id !== sectionId)
          : [...prev.bookmarkedSections, sectionId],
      };
    });
  }, []);

  const markDemoCompleted = useCallback((demoId: string) => {
    setRecord((prev) => {
      if (prev.completedDemos.includes(demoId)) return prev;
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        completedDemos: [...prev.completedDemos, demoId],
      };
    });
  }, []);

  const markUnderstoodCheckpoint = useCallback(
    (sectionId: string, score: number, total: number, mode = 'concept_transfer') => {
      setRecord((prev) => {
        const currentPractised = prev.practisedSections ?? [];
        const currentStamps = prev.discoveryStamps ?? [];
        const stampId = `mastery:${sectionId}`;
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          practisedSections: currentPractised.includes(sectionId)
            ? currentPractised
            : [...currentPractised, sectionId],
          understoodCheckpoints: {
            ...(prev.understoodCheckpoints ?? {}),
            [sectionId]: { score, total, verifiedAt: new Date().toISOString(), mode },
          },
          discoveryStamps: currentStamps.includes(stampId)
            ? currentStamps
            : [...currentStamps, stampId],
        };
      });
    },
    [],
  );

  const rateFlashcard = useCallback((cardId: string, rating: 'know' | 'review_again') => {
    setRecord((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      flashcardRatings: { ...prev.flashcardRatings, [cardId]: rating },
    }));
  }, []);

  const recordQuizCheckpoint = useCallback((quizId: string, score: number, total: number) => {
    setRecord((prev) => {
      const currentPractised = prev.practisedSections ?? [];
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        practisedSections: currentPractised.includes(quizId)
          ? currentPractised
          : [...currentPractised, quizId],
        quizCheckpoints: {
          ...prev.quizCheckpoints,
          [quizId]: { score, total, completedAt: new Date().toISOString() },
        },
      };
    });
  }, []);

  const saveTeachBackNote = useCallback((sectionId: string, note: string) => {
    setRecord((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      teachBackNotes: {
        ...(prev.teachBackNotes ?? {}),
        [sectionId]: note,
      },
    }));
  }, []);

  const awardDiscoveryStamp = useCallback((stampId: string) => {
    setRecord((prev) => {
      const current = prev.discoveryStamps ?? [];
      if (current.includes(stampId)) return prev;
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        discoveryStamps: [...current, stampId],
      };
    });
  }, []);

  const saveCapstoneProgress = useCallback(
    (missionId: string, entry: Omit<CapstoneProgressEntry, 'updatedAt'>) => {
      setRecord((prev) => {
        const currentStamps = prev.discoveryStamps ?? [];
        const stampId = `capstone:${missionId}`;
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          capstoneProgress: {
            ...(prev.capstoneProgress ?? {}),
            [missionId]: {
              ...entry,
              updatedAt: new Date().toISOString(),
            },
          },
          discoveryStamps:
            entry.completed && !currentStamps.includes(stampId)
              ? [...currentStamps, stampId]
              : currentStamps,
        };
      });
    },
    [],
  );

  const exportProgressJsonString = useCallback(() => {
    return JSON.stringify(record, null, 2);
  }, [record]);

  const importProgressJsonString = useCallback((rawJson: string) => {
    const res = validateProgressJson(rawJson);
    if (res.valid && res.data) {
      setRecord(res.data);
      return { valid: true };
    }
    return { valid: false, error: res.error };
  }, []);

  const resetDeviceProgress = useCallback(() => {
    const fresh = createInitialProgressRecord();
    setRecord(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        record,
        preferences: record.preferences,
        storageAvailable,
        updatePreferences,
        markSectionVisited,
        markSectionExplored,
        markSectionPractised,
        toggleBookmarkSection,
        markDemoCompleted,
        markUnderstoodCheckpoint,
        rateFlashcard,
        recordQuizCheckpoint,
        saveTeachBackNote,
        awardDiscoveryStamp,
        saveCapstoneProgress,
        exportProgressJsonString,
        importProgressJsonString,
        resetDeviceProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
