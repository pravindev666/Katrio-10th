import { useCallback, useEffect, useState, type RefObject } from 'react';

export interface FullscreenState {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  exitFullscreen: () => void;
}

/**
 * Universal fullscreen hook with native Fullscreen API + graceful CSS fixed-overlay fallback.
 * Supports `Esc` to exit and cleanly syncs with browser fullscreen events.
 */
export function useFullscreen(targetRef: RefObject<HTMLElement | null>): FullscreenState {
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      const activeEl =
        document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement;
      setIsNativeFullscreen(Boolean(activeEl && activeEl === targetRef.current));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, [targetRef]);

  useEffect(() => {
    if (!isFallbackFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFallbackFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFallbackFullscreen]);

  const exitFullscreen = useCallback(() => {
    setIsFallbackFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      const webkitDoc = document as Document & {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => Promise<void> | void;
      };
      if (webkitDoc.webkitFullscreenElement && webkitDoc.webkitExitFullscreen) {
        webkitDoc.webkitExitFullscreen();
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;

    if (isNativeFullscreen || isFallbackFullscreen) {
      exitFullscreen();
      return;
    }

    const req =
      el.requestFullscreen ||
      (el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen;

    if (req) {
      Promise.resolve(req.call(el)).catch(() => {
        setIsFallbackFullscreen(true);
      });
    } else {
      setIsFallbackFullscreen(true);
    }
  }, [targetRef, isNativeFullscreen, isFallbackFullscreen, exitFullscreen]);

  return {
    isFullscreen: isNativeFullscreen || isFallbackFullscreen,
    toggleFullscreen,
    exitFullscreen,
  };
}
