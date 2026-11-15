export interface TerminalOutputLine {
  readonly text: string;
  readonly tone: 'default' | 'accent' | 'muted' | 'error' | 'success';
}
