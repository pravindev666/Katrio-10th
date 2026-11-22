import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useProgress } from '../../features/local-progress/ProgressContext';
import { getCompletedSectionCount } from '../../features/local-progress/progressStore';

export function AccessibilityBar() {
  const { preferences, updatePreferences } = useProgress();

  // Only show a thin, calm exit strip when Focus Mode is active so the student can always exit in 1 click
  if (!preferences.focusMode) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Focus view active bar"
      className="bg-[var(--surface-subtle)] border-b border-[var(--line)] text-sm"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
        <span className="font-medium text-[var(--ink)]">
          Focus view is on — distraction-free lesson mode
        </span>
        <button
          type="button"
          onClick={() => updatePreferences({ focusMode: false })}
          className="px-3.5 py-1.5 min-h-[36px] rounded-[10px] bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors"
        >
          Exit Focus view
        </button>
      </div>
    </div>
  );
}

export function LearningSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { preferences, updatePreferences, record } = useProgress();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-start justify-end p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learning-settings-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-[20px] bg-[var(--surface)] border border-[var(--line)] shadow-[var(--shadow-pop)] p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-tint)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 id="learning-settings-title" className="text-lg font-extrabold text-[var(--ink)]">
                Learning settings
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Saved on this device only · No account needed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close learning settings"
            className="min-w-[44px] min-h-[44px] rounded-xl border border-[var(--line)] inline-flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface-subtle)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Theme & Contrast */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[var(--ink)]">
            Display theme &amp; contrast
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
                { id: 'high-contrast', label: 'High Contrast' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updatePreferences({ theme: t.id })}
                aria-pressed={preferences.theme === t.id}
                className={`min-h-[44px] px-3 py-2 rounded-[12px] text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 ${preferences.theme === t.id
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                  }`}
              >
                {preferences.theme === t.id && <Check className="w-4 h-4 shrink-0" />}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Text size */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[var(--ink)]">
            Text size (English &amp; தமிழ்)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'normal', label: 'A (100%)' },
                { id: 'large', label: 'A+ (112%)' },
                { id: 'xlarge', label: 'A++ (125%)' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updatePreferences({ fontScale: f.id })}
                aria-pressed={preferences.fontScale === f.id}
                className={`min-h-[44px] px-3 py-2 rounded-[12px] text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 ${preferences.fontScale === f.id
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--primary)]'
                  }`}
              >
                {preferences.fontScale === f.id && <Check className="w-4 h-4 shrink-0" />}
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Focus, Motion & 2D Preferences */}
        <div className="space-y-2.5">
          <span className="block text-sm font-bold text-[var(--ink)]">
            Study &amp; sensory preferences
          </span>

          <button
            type="button"
            onClick={() => updatePreferences({ focusMode: !preferences.focusMode })}
            aria-pressed={preferences.focusMode}
            className={`w-full p-3.5 min-h-[48px] rounded-[12px] border text-left flex items-center justify-between gap-3 transition-colors ${preferences.focusMode
                ? 'bg-[var(--primary-tint)] border-[var(--primary)] text-[var(--ink)]'
                : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--ink)]'
              }`}
          >
            <div>
              <div className="text-sm font-bold">Focus view</div>
              <div className="text-xs text-[var(--text-muted)]">
                Hides extra navigation and sidebars while studying a lesson
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${preferences.focusMode
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--line)]'
                }`}
            >
              {preferences.focusMode ? 'On' : 'Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
            aria-pressed={preferences.reducedMotion}
            className={`w-full p-3.5 min-h-[48px] rounded-[12px] border text-left flex items-center justify-between gap-3 transition-colors ${preferences.reducedMotion
                ? 'bg-[var(--primary-tint)] border-[var(--primary)] text-[var(--ink)]'
                : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--ink)]'
              }`}
          >
            <div>
              <div className="text-sm font-bold">Reduced motion</div>
              <div className="text-xs text-[var(--text-muted)]">
                Pauses automatic 3D rotation and continuous flow animations
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${preferences.reducedMotion
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--line)]'
                }`}
            >
              {preferences.reducedMotion ? 'On' : 'Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => updatePreferences({ prefer2DPathway: !preferences.prefer2DPathway })}
            aria-pressed={preferences.prefer2DPathway}
            className={`w-full p-3.5 min-h-[48px] rounded-[12px] border text-left flex items-center justify-between gap-3 transition-colors ${preferences.prefer2DPathway
                ? 'bg-[var(--primary-tint)] border-[var(--primary)] text-[var(--ink)]'
                : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--ink)]'
              }`}
          >
            <div>
              <div className="text-sm font-bold">Prefer 2D diagrams &amp; text</div>
              <div className="text-xs text-[var(--text-muted)]">
                Opens clear 2D diagrams by default instead of 3D scenes
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${preferences.prefer2DPathway
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--line)]'
                }`}
            >
              {preferences.prefer2DPathway ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        {/* 4. Honest Device-Only Progress Summary & Links */}
        <div className="pt-3 border-t border-[var(--line)] space-y-3">
          <div className="p-3.5 rounded-[12px] bg-[var(--surface-subtle)] border border-[var(--line)] text-sm space-y-1">
            <div className="font-bold text-[var(--ink)]">Your local study progress</div>
            <p className="text-xs text-[var(--text-muted)]">
              Started: {record.visitedSections.length} · Practised:{' '}
              {(record.practisedSections ?? []).length} · Completed:{' '}
              {getCompletedSectionCount(record)}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Link
              to="/accessibility"
              onClick={onClose}
              className="text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              Full accessibility page →
            </Link>
            <Link
              to="/privacy"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)] hover:text-[var(--primary)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Export or reset progress</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
