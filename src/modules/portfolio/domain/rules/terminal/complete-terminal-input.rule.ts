import { findTerminalCompletionScope } from '@/modules/portfolio/domain/rules/terminal/find-terminal-completion-scope.rule';
import type { TerminalCompletion } from '@/modules/portfolio/domain/types/terminal/terminal-completion.type';

function findSharedBeginning(sortedWords: readonly string[]): string {
  const first = sortedWords[0];
  const last = sortedWords[sortedWords.length - 1];
  let length = 0;
  while (length < first.length && first[length] === last[length]) length += 1;
  return first.slice(0, length);
}

export function completeTerminalInput(input: string): TerminalCompletion {
  if (input.trim() === '') return { input, candidates: [] };

  const { typedWord, candidates } = findTerminalCompletionScope(input);
  if (candidates.length === 0) return { input, candidates: [] };

  const lineBeforeWord = input.slice(0, input.length - typedWord.length);
  if (candidates.length === 1) return { input: `${lineBeforeWord}${candidates[0]} `, candidates: [] };

  const sortedCandidates = [...candidates].sort();
  return { input: lineBeforeWord + findSharedBeginning(sortedCandidates), candidates: sortedCandidates };
}
