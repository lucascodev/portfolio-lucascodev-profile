import { listTerminalArgumentCandidates } from '@/modules/portfolio/domain/rules/terminal/list-terminal-argument-candidates.rule';
import { TERMINAL_COMMAND_NAMES } from '@/modules/portfolio/domain/rules/terminal/run-terminal-command.rule';
import type { TerminalInputToken } from '@/modules/portfolio/domain/types/terminal/terminal-input-token.type';

const TOKEN_PATTERN = /\s+|"[^"]*"?|'[^']*'?|[^\s"']+/g;
const QUOTES = ['"', "'"];

const isBlank = (text: string): boolean => text.trim() === '';

export function highlightTerminalInput(input: string): TerminalInputToken[] {
  const texts = input.match(TOKEN_PATTERN) ?? [];
  const commandIndex = texts.findIndex((text) => !isBlank(text));
  const command = (texts[commandIndex] ?? '').toLowerCase();
  const knownArguments = listTerminalArgumentCandidates(command);

  return texts.map((text, index): TerminalInputToken => {
    if (isBlank(text)) return { text, kind: 'whitespace' };
    if (index === commandIndex) return { text, kind: TERMINAL_COMMAND_NAMES.includes(command) ? 'command' : 'unknown-command' };
    if (QUOTES.includes(text[0])) return { text, kind: 'string' };
    return { text, kind: knownArguments.includes(text) ? 'known-argument' : 'argument' };
  });
}
