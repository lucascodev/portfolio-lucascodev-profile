import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { TerminalOutputLine } from './terminal-output-line.type';

export type TerminalEffect =
  | { readonly kind: 'clear' }
  | { readonly kind: 'power-off' }
  | { readonly kind: 'open-app'; readonly appId: DesktopAppId };

export interface TerminalCommandResult {
  readonly lines: readonly TerminalOutputLine[];
  readonly effect?: TerminalEffect;
}
