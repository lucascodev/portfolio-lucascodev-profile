export interface TerminalCompletion {
  readonly input: string;
  readonly candidates: readonly string[];
}
