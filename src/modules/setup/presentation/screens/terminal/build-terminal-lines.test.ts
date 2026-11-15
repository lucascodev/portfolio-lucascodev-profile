import { describe, expect, it } from 'vitest';
import type { TerminalEntry } from '@/modules/setup/domain/types/monitor/terminal-entry.type';
import { buildTerminalLines } from './build-terminal-lines';

const entries: TerminalEntry[] = [
  { command: 'npm test', output: ['12 passed', 'done'] },
  { command: 'git push', output: ['ok'] },
];

describe('buildTerminalLines', () => {
  it('types the first command character by character', () => {
    expect(buildTerminalLines(entries, 0.25)).toEqual([{ kind: 'command', text: 'npm ' }]);
  });

  it('prints output lines after the command finishes', () => {
    const lines = buildTerminalLines(entries, 0.5 + 0.5 + 0.13);

    expect(lines).toEqual([
      { kind: 'command', text: 'npm test' },
      { kind: 'output', text: '12 passed' },
    ]);
  });

  it('moves on to the next command after the first entry ends', () => {
    const lines = buildTerminalLines(entries, 0.5 + 0.5 + 0.24 + 1.2 + 0.1);

    expect(lines.at(-1)).toEqual({ kind: 'command', text: 'g' });
  });

  it('ends with an empty prompt once the session is over', () => {
    const lines = buildTerminalLines(entries, 5.5);

    expect(lines.at(-1)).toEqual({ kind: 'command', text: '' });
    expect(lines).toHaveLength(6);
  });
});
