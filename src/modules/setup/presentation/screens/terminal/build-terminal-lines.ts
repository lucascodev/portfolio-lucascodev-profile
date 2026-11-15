import type { TerminalEntry } from '@/modules/setup/domain/types/monitor/terminal-entry.type';
import type { TerminalLine } from './terminal-line.type';

const COMMAND_CHARACTERS_PER_SECOND = 16;
const PAUSE_BEFORE_OUTPUT_SECONDS = 0.5;
const SECONDS_PER_OUTPUT_LINE = 0.12;
const PAUSE_AFTER_ENTRY_SECONDS = 1.2;
const RESTART_HOLD_SECONDS = 4;

function entryDurationSeconds(entry: TerminalEntry): number {
  return (
    entry.command.length / COMMAND_CHARACTERS_PER_SECOND +
    PAUSE_BEFORE_OUTPUT_SECONDS +
    entry.output.length * SECONDS_PER_OUTPUT_LINE +
    PAUSE_AFTER_ENTRY_SECONDS
  );
}

export function buildTerminalLines(entries: readonly TerminalEntry[], elapsedSeconds: number): TerminalLine[] {
  const sessionSeconds = entries.reduce((sum, entry) => sum + entryDurationSeconds(entry), 0);
  let remainingSeconds = elapsedSeconds % (sessionSeconds + RESTART_HOLD_SECONDS);
  const lines: TerminalLine[] = [];

  for (const entry of entries) {
    const typingSeconds = entry.command.length / COMMAND_CHARACTERS_PER_SECOND;
    if (remainingSeconds < typingSeconds) {
      const typedLength = Math.floor(remainingSeconds * COMMAND_CHARACTERS_PER_SECOND);
      return [...lines, { kind: 'command', text: entry.command.slice(0, typedLength) }];
    }

    lines.push({ kind: 'command', text: entry.command });
    remainingSeconds -= typingSeconds + PAUSE_BEFORE_OUTPUT_SECONDS;
    if (remainingSeconds < 0) return lines;

    const visibleOutputCount = Math.min(entry.output.length, Math.floor(remainingSeconds / SECONDS_PER_OUTPUT_LINE));
    lines.push(...entry.output.slice(0, visibleOutputCount).map((text): TerminalLine => ({ kind: 'output', text })));
    remainingSeconds -= entry.output.length * SECONDS_PER_OUTPUT_LINE + PAUSE_AFTER_ENTRY_SECONDS;
    if (remainingSeconds < 0) return lines;
  }

  return [...lines, { kind: 'command', text: '' }];
}
