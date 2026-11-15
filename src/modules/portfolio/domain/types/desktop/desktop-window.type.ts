import type { DesktopAppId } from './desktop-app-id.type';
import type { WindowBounds } from './window-bounds.type';

export interface DesktopWindow {
  readonly appId: DesktopAppId;
  readonly bounds: WindowBounds;
  readonly zIndex: number;
  readonly isMinimized: boolean;
  readonly isMaximized: boolean;
}
