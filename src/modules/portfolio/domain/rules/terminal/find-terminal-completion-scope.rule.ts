import { listTerminalArgumentCandidates } from '@/modules/portfolio/domain/rules/terminal/list-terminal-argument-candidates.rule';
import { TERMINAL_COMMAND_NAMES } from '@/modules/portfolio/domain/rules/terminal/run-terminal-command.rule';
import type { TerminalCompletionScope } from '@/modules/portfolio/domain/types/terminal/terminal-completion-scope.type';

const COMMAND_ONLY = 1;
const COMMAND_AND_FIRST_ARGUMENT = 2;

export function findTerminalCompletionScope(input: string): TerminalCompletionScope {
  const words = input.trimStart().split(/\s+/);
  const typedWord = words.at(-1) ?? '';

  if (words.length === COMMAND_ONLY) {
    return { typedWord, candidates: TERMINAL_COMMAND_NAMES.filter((name) => name.startsWith(typedWord.toLowerCase())) };
  }
  if (words.length === COMMAND_AND_FIRST_ARGUMENT) {
    return { typedWord, candidates: listTerminalArgumentCandidates(words[0]).filter((candidate) => candidate.startsWith(typedWord)) };
  }
  return { typedWord, candidates: [] };
}
