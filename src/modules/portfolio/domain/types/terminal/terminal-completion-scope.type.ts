export interface TerminalCompletionScope {
  readonly typedWord: string;
  readonly candidates: readonly string[];
}
