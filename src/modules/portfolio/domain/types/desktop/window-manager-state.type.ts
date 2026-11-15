import type { DesktopWindow } from './desktop-window.type';

export interface WindowManagerState {
  readonly windows: readonly DesktopWindow[];
  readonly topZIndex: number;
}
