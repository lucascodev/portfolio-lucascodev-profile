export interface TerminalLine {
  readonly kind: 'command' | 'output';
  readonly text: string;
}
