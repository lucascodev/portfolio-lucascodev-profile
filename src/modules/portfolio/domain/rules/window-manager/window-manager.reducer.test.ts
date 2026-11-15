import { describe, expect, it } from 'vitest';
import type { WindowManagerState } from '@/modules/portfolio/domain/types/desktop/window-manager-state.type';
import { INITIAL_WINDOW_MANAGER_STATE } from '@/modules/portfolio/domain/constants/initial-window-manager-state.constant';
import { windowManagerReducer } from './window-manager.reducer';

const bounds = { x: 10, y: 20, width: 400, height: 300 };

const openApps = (...appIds: ('terminal' | 'about' | 'projects')[]): WindowManagerState =>
  appIds.reduce(
    (state, appId) => windowManagerReducer(state, { type: 'open', appId, bounds, isMaximized: false }),
    INITIAL_WINDOW_MANAGER_STATE,
  );

const zIndexOf = (state: WindowManagerState, appId: string) =>
  state.windows.find((window) => window.appId === appId)?.zIndex ?? -1;

describe('windowManagerReducer', () => {
  it('opens each app once, on top of the others', () => {
    const state = openApps('terminal', 'about');

    expect(state.windows.map((window) => window.appId)).toEqual(['terminal', 'about']);
    expect(zIndexOf(state, 'about')).toBeGreaterThan(zIndexOf(state, 'terminal'));
  });

  it('reopening an app brings the existing window back instead of duplicating it', () => {
    const minimized = windowManagerReducer(openApps('terminal', 'about'), { type: 'toggle-minimize', appId: 'terminal' });
    const reopened = windowManagerReducer(minimized, { type: 'open', appId: 'terminal', bounds, isMaximized: false });

    expect(reopened.windows).toHaveLength(2);
    expect(reopened.windows.find((window) => window.appId === 'terminal')?.isMinimized).toBe(false);
    expect(zIndexOf(reopened, 'terminal')).toBeGreaterThan(zIndexOf(reopened, 'about'));
  });

  it('focus brings a window to the front', () => {
    const state = windowManagerReducer(openApps('terminal', 'about'), { type: 'focus', appId: 'terminal' });

    expect(zIndexOf(state, 'terminal')).toBeGreaterThan(zIndexOf(state, 'about'));
  });

  it('moves and closes windows', () => {
    const moved = windowManagerReducer(openApps('projects'), { type: 'move', appId: 'projects', x: 99, y: 42 });
    const closed = windowManagerReducer(moved, { type: 'close', appId: 'projects' });

    expect(moved.windows[0].bounds).toMatchObject({ x: 99, y: 42, width: 400 });
    expect(closed.windows).toEqual([]);
  });

  it('replaces the bounds of a resized window', () => {
    const resizedBounds = { x: 5, y: 6, width: 640, height: 480 };
    const resized = windowManagerReducer(openApps('projects'), { type: 'resize', appId: 'projects', bounds: resizedBounds });

    expect(resized.windows[0].bounds).toEqual(resizedBounds);
  });

  it('toggles maximize and ignores actions on closed apps', () => {
    const maximized = windowManagerReducer(openApps('about'), { type: 'toggle-maximize', appId: 'about' });

    expect(maximized.windows[0].isMaximized).toBe(true);
    expect(windowManagerReducer(maximized, { type: 'focus', appId: 'terminal' })).toBe(maximized);
  });
});
