import { describe, expect, it } from 'vitest';
import { suggestTerminalInput } from './suggest-terminal-input.rule';

describe('suggestTerminalInput', () => {
  it('suggests nothing for an empty line', () => {
    expect(suggestTerminalInput('', ['whoami'])).toBeUndefined();
  });

  it('prefers the most recent history entry that starts with what was typed', () => {
    const history = ['cat sobre.md', 'open stack', 'cat stack.txt'];

    expect(suggestTerminalInput('cat', history)).toBe('cat stack.txt');
    expect(suggestTerminalInput('op', history)).toBe('open stack');
  });

  it('does not suggest the line that is already typed', () => {
    expect(suggestTerminalInput('whoami', ['whoami'])).toBeUndefined();
  });

  it('falls back to a command the terminal knows', () => {
    expect(suggestTerminalInput('neo', [])).toBe('neofetch');
    expect(suggestTerminalInput('NEO', [])).toBe('NEOfetch');
    expect(suggestTerminalInput('xyz', [])).toBeUndefined();
  });

  it('falls back to a known file or app for the argument being typed', () => {
    expect(suggestTerminalInput('cat so', [])).toBe('cat sobre.md');
    expect(suggestTerminalInput('open pro', [])).toBe('open projetos');
    expect(suggestTerminalInput('echo pro', [])).toBeUndefined();
  });
});
