import { findTerminalCompletionScope } from '@/modules/portfolio/domain/rules/terminal/find-terminal-completion-scope.rule';

export function suggestTerminalInput(input: string, history: readonly string[]): string | undefined {
  if (input === '') return undefined;

  const fromHistory = history.findLast((entry) => entry.startsWith(input) && entry.length > input.length);
  if (fromHistory) return fromHistory;

  const { typedWord, candidates } = findTerminalCompletionScope(input);
  const longerCandidate = candidates.find((candidate) => candidate.length > typedWord.length);
  return longerCandidate ? input + longerCandidate.slice(typedWord.length) : undefined;
}
