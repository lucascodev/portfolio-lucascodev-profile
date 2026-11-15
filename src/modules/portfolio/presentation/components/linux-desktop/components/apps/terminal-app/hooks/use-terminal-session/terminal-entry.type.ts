import type { TerminalOutputLine } from '@/modules/portfolio/domain/types/terminal/terminal-output-line.type';

export type TerminalEntry =
  | { readonly id: string; readonly kind: 'input'; readonly text: string }
  | ({ readonly id: string; readonly kind: 'output' } & TerminalOutputLine);
