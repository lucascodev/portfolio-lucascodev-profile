import { useCallback, useEffect, useState } from 'react';
import type { ExperienceMode } from './experience-mode.type';

// Safety net for when the camera never reports arriving (no WebGL, tab in background).
const CAMERA_TIMEOUT_MS = 4500;
// Mirrors the desktop power-on / power-off CSS animations.
const DESKTOP_POWER_ON_MS = 700;
const DESKTOP_POWER_OFF_MS = 450;

export function useExperienceMode() {
  const [mode, setMode] = useState<ExperienceMode>('setup');
  const [isDesktopFullyOn, setIsDesktopFullyOn] = useState(false);

  const enterComputer = useCallback(() => setMode((current) => (current === 'setup' ? 'entering' : current)), []);
  const powerOff = useCallback(() => {
    setIsDesktopFullyOn(false);
    setMode((current) => (current === 'desktop' ? 'shutting-down' : current));
  }, []);

  const handleCameraSettled = useCallback((isFocusedOnScreen: boolean) => {
    setMode((current) => {
      if (isFocusedOnScreen && current === 'entering') return 'desktop';
      if (!isFocusedOnScreen && current === 'leaving') return 'setup';
      return current;
    });
  }, []);

  useEffect(() => {
    if (mode === 'entering' || mode === 'leaving') {
      const timeout = window.setTimeout(() => setMode(mode === 'entering' ? 'desktop' : 'setup'), CAMERA_TIMEOUT_MS);
      return () => window.clearTimeout(timeout);
    }
    if (mode === 'desktop') {
      const timeout = window.setTimeout(() => setIsDesktopFullyOn(true), DESKTOP_POWER_ON_MS);
      return () => window.clearTimeout(timeout);
    }
    if (mode === 'shutting-down') {
      const timeout = window.setTimeout(() => setMode('leaving'), DESKTOP_POWER_OFF_MS);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [mode]);

  return {
    mode,
    isFocusedOnScreen: mode === 'entering' || mode === 'desktop' || mode === 'shutting-down',
    isDesktopVisible: mode === 'desktop' || mode === 'shutting-down',
    isDesktopFullyOn,
    enterComputer,
    powerOff,
    handleCameraSettled,
  };
}
