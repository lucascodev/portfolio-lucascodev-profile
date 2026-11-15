import { describe, expect, it } from 'vitest';
import { highlightTerminalInput } from './highlight-terminal-input.rule';

const kinds = (input: string) => highlightTerminalInput(input).map((token) => token.kind);

describe('highlightTerminalInput', () => {
  it('returns no tokens for an empty line', () => {
    expect(highlightTerminalInput('')).toEqual([]);
  });

  it('marks the first word as a command only when the terminal knows it', () => {
    expect(highlightTerminalInput('whoami')).toEqual([{ text: 'whoami', kind: 'command' }]);
    expect(highlightTerminalInput('who')).toEqual([{ text: 'who', kind: 'unknown-command' }]);
    expect(kinds('WHOAMI')).toEqual(['command']);
    expect(kinds('constructor')).toEqual(['unknown-command']);
  });

  it('tells known files and apps apart from other arguments', () => {
    expect(highlightTerminalInput('cat sobre.md')).toEqual([
      { text: 'cat', kind: 'command' },
      { text: ' ', kind: 'whitespace' },
      { text: 'sobre.md', kind: 'known-argument' },
    ]);
    expect(kinds('cat nada.txt')).toEqual(['command', 'whitespace', 'argument']);
    expect(kinds('open projetos')).toEqual(['command', 'whitespace', 'known-argument']);
    expect(kinds('echo projetos')).toEqual(['command', 'whitespace', 'argument']);
  });

  it('marks quoted text as a string, even while the quote is still open', () => {
    expect(kinds('echo "ola mundo"')).toEqual(['command', 'whitespace', 'string']);
    expect(kinds("echo 'ola")).toEqual(['command', 'whitespace', 'string']);
  });

  it('keeps every character, so the tokens can be laid over the typed text', () => {
    const input = '  echo   "a b"  c ';

    expect(
      highlightTerminalInput(input)
        .map((token) => token.text)
        .join(''),
    ).toBe(input);
  });
});
