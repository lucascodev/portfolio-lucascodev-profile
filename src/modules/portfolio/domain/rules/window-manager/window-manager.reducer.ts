import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { DesktopWindow } from '@/modules/portfolio/domain/types/desktop/desktop-window.type';
import type { WindowManagerAction } from '@/modules/portfolio/domain/types/desktop/window-manager-action.type';
import type { WindowManagerState } from '@/modules/portfolio/domain/types/desktop/window-manager-state.type';

function updateWindow(
  state: WindowManagerState,
  appId: DesktopAppId,
  update: (window: DesktopWindow) => DesktopWindow,
): WindowManagerState {
  return { ...state, windows: state.windows.map((window) => (window.appId === appId ? update(window) : window)) };
}

function bringToFront(state: WindowManagerState, appId: DesktopAppId, changes: Partial<DesktopWindow> = {}): WindowManagerState {
  const topZIndex = state.topZIndex + 1;
  return { ...updateWindow(state, appId, (window) => ({ ...window, ...changes, zIndex: topZIndex })), topZIndex };
}

export function windowManagerReducer(state: WindowManagerState, action: WindowManagerAction): WindowManagerState {
  const isOpen = state.windows.some((window) => window.appId === action.appId);
  if (!isOpen && action.type !== 'open') return state;

  switch (action.type) {
    case 'open': {
      if (isOpen) return bringToFront(state, action.appId, { isMinimized: false });
      const topZIndex = state.topZIndex + 1;
      const window: DesktopWindow = {
        appId: action.appId,
        bounds: action.bounds,
        zIndex: topZIndex,
        isMinimized: false,
        isMaximized: action.isMaximized,
      };
      return { windows: [...state.windows, window], topZIndex };
    }
    case 'close':
      return { ...state, windows: state.windows.filter((window) => window.appId !== action.appId) };
    case 'focus':
      return bringToFront(state, action.appId);
    case 'move':
      return updateWindow(state, action.appId, (window) => ({ ...window, bounds: { ...window.bounds, x: action.x, y: action.y } }));
    case 'resize':
      return updateWindow(state, action.appId, (window) => ({ ...window, bounds: action.bounds }));
    case 'toggle-minimize': {
      const window = state.windows.find((candidate) => candidate.appId === action.appId);
      if (window?.isMinimized) return bringToFront(state, action.appId, { isMinimized: false });
      return updateWindow(state, action.appId, (candidate) => ({ ...candidate, isMinimized: true }));
    }
    case 'toggle-maximize':
      return bringToFront(state, action.appId, {
        isMaximized: !state.windows.find((window) => window.appId === action.appId)?.isMaximized,
      });
  }
}
