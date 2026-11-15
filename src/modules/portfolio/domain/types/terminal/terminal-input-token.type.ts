import type { TerminalInputTokenKind } from './terminal-input-token-kind.type';

export interface TerminalInputToken {
  readonly text: string;
  readonly kind: TerminalInputTokenKind;
}
