import { describe, expect, it } from 'vitest';
import { completeTerminalInput } from './complete-terminal-input.rule';

describe('completeTerminalInput', () => {
  it('finishes a command that has a single match and leaves room for the argument', () => {
    expect(completeTerminalInput('neo')).toEqual({ input: 'neofetch ', candidates: [] });
    expect(completeTerminalInput('wh')).toEqual({ input: 'whoami ', candidates: [] });
  });

  it('lists the options and types their shared beginning when several commands match', () => {
    expect(completeTerminalInput('c')).toEqual({ input: 'c', candidates: ['cat', 'clear', 'contact', 'contato'] });
    expect(completeTerminalInput('con')).toEqual({ input: 'conta', candidates: ['contact', 'contato'] });
  });

  it('completes files for cat and apps for open', () => {
    expect(completeTerminalInput('cat so')).toEqual({ input: 'cat sobre.md ', candidates: [] });
    expect(completeTerminalInput('cat ')).toEqual({ input: 'cat ', candidates: ['contato.txt', 'sobre.md', 'stack.txt'] });
    expect(completeTerminalInput('open pro')).toEqual({ input: 'open proje', candidates: ['projects', 'projetos'] });
  });

  it('leaves the line alone when nothing matches', () => {
    expect(completeTerminalInput('xyz')).toEqual({ input: 'xyz', candidates: [] });
    expect(completeTerminalInput('echo pro')).toEqual({ input: 'echo pro', candidates: [] });
    expect(completeTerminalInput('cat sobre.md st')).toEqual({ input: 'cat sobre.md st', candidates: [] });
    expect(completeTerminalInput('')).toEqual({ input: '', candidates: [] });
  });

  it('does not offer names every object inherits', () => {
    expect(completeTerminalInput('constr')).toEqual({ input: 'constr', candidates: [] });
  });
});
