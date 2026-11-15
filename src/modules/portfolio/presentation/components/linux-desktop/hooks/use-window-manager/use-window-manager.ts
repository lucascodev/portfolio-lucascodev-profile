import { type RefObject, useCallback, useReducer } from 'react';
import { INITIAL_WINDOW_MANAGER_STATE } from '@/modules/portfolio/domain/constants/initial-window-manager-state.constant';
import { windowManagerReducer } from '@/modules/portfolio/domain/rules/window-manager/window-manager.reducer';
import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import { DESKTOP_APP_CATALOG } from '@/modules/portfolio/presentation/components/linux-desktop/constants/desktop-app-catalog.constant';
import { calculateInitialWindowBounds } from '@/modules/portfolio/presentation/components/linux-desktop/layout/calculate-initial-window-bounds';

const COMPACT_SCREEN_MAX_WIDTH_PX = 720;

export function useWindowManager(areaRef: RefObject<HTMLElement | null>) {
  const [state, dispatch] = useReducer(windowManagerReducer, INITIAL_WINDOW_MANAGER_STATE);

  const openApp = useCallback(
    (appId: DesktopAppId, cascadeIndex = state.windows.length) => {
      const definition = DESKTOP_APP_CATALOG.find((app) => app.id === appId);
      const area = areaRef.current?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };
      if (!definition) return;

      dispatch({
        type: 'open',
        appId,
        bounds: calculateInitialWindowBounds(definition.defaultSize, area, cascadeIndex),
        isMaximized: area.width < COMPACT_SCREEN_MAX_WIDTH_PX,
      });
    },
    [areaRef, state.windows.length],
  );

  const toggleFromDock = useCallback(
    (appId: DesktopAppId) => {
      const window = state.windows.find((candidate) => candidate.appId === appId);
      const isFrontmost = window?.zIndex === state.topZIndex;
      if (window && isFrontmost && !window.isMinimized) {
        dispatch({ type: 'toggle-minimize', appId });
        return;
      }
      openApp(appId);
    },
    [openApp, state.topZIndex, state.windows],
  );

  return { state, dispatch, openApp, toggleFromDock };
}
