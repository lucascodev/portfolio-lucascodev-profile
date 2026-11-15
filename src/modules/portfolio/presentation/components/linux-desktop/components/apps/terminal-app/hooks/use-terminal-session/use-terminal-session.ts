import { useState } from 'react';
import { runTerminalCommand } from '@/modules/portfolio/domain/rules/terminal/run-terminal-command.rule';
import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import type { TerminalOutputLine } from '@/modules/portfolio/domain/types/terminal/terminal-output-line.type';
import type { TerminalEntry } from './terminal-entry.type';

interface TerminalSessionOptions {
  readonly content: PortfolioContent;
  readonly onOpenApp: (appId: DesktopAppId) => void;
  readonly onPowerOff: () => void;
}

const BOOT_COMMAND = 'neofetch';
const WELCOME_LINE: TerminalOutputLine = { text: 'Bem-vindo! Digite "help" para ver os comandos.', tone: 'success' };

export function useTerminalSession({ content, onOpenApp, onPowerOff }: TerminalSessionOptions) {
  const toOutputEntries = (lines: readonly TerminalOutputLine[]): TerminalEntry[] =>
    lines.map((outputLine) => ({ id: crypto.randomUUID(), kind: 'output', ...outputLine }));

  const [entries, setEntries] = useState<TerminalEntry[]>(() => [
    { id: crypto.randomUUID(), kind: 'input', text: BOOT_COMMAND },
    ...toOutputEntries(runTerminalCommand(BOOT_COMMAND, { content, now: new Date() }).lines),
    ...toOutputEntries([WELCOME_LINE]),
  ]);
  const [history, setHistory] = useState<string[]>([]);

  const submit = (input: string) => {
    const result = runTerminalCommand(input, { content, now: new Date() });
    if (input.trim() !== '') setHistory((previous) => [...previous, input]);

    if (result.effect?.kind === 'clear') {
      setEntries([]);
      return;
    }
    setEntries((previous) => [...previous, { id: crypto.randomUUID(), kind: 'input', text: input }, ...toOutputEntries(result.lines)]);
    if (result.effect?.kind === 'open-app') onOpenApp(result.effect.appId);
    if (result.effect?.kind === 'power-off') onPowerOff();
  };

  return { entries, history, submit };
}
