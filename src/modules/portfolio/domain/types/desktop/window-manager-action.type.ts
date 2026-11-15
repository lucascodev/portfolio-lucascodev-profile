import type { DesktopAppId } from './desktop-app-id.type';
import type { WindowBounds } from './window-bounds.type';

export type WindowManagerAction =
  | { readonly type: 'open'; readonly appId: DesktopAppId; readonly bounds: WindowBounds; readonly isMaximized: boolean }
  | { readonly type: 'close'; readonly appId: DesktopAppId }
  | { readonly type: 'focus'; readonly appId: DesktopAppId }
  | { readonly type: 'move'; readonly appId: DesktopAppId; readonly x: number; readonly y: number }
  | { readonly type: 'resize'; readonly appId: DesktopAppId; readonly bounds: WindowBounds }
  | { readonly type: 'toggle-minimize'; readonly appId: DesktopAppId }
  | { readonly type: 'toggle-maximize'; readonly appId: DesktopAppId };
