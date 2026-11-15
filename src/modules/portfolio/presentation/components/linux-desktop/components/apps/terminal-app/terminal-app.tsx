import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { getShellUserHost } from '@/modules/portfolio/domain/rules/profile/get-shell-user-host.rule';
import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import { useTerminalSession } from './hooks/use-terminal-session/use-terminal-session';
import styles from './terminal-app.module.css';

interface TerminalAppProps {
  readonly content: PortfolioContent;
  readonly onOpenApp: (appId: DesktopAppId) => void;
  readonly onPowerOff: () => void;
}

export function TerminalApp({ content, onOpenApp, onPowerOff }: TerminalAppProps) {
  const { entries, history, submit } = useTerminalSession({ content, onOpenApp, onPowerOff });
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prompt = `${getShellUserHost(content.profile.name)}:~$`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [entries]);

  const browseHistory = (direction: -1 | 1) => {
    if (history.length === 0) return;
    const current = historyIndex ?? history.length;
    const next = Math.min(history.length, Math.max(0, current + direction));
    setHistoryIndex(next === history.length ? null : next);
    setInput(history[next] ?? '');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit(input);
      setInput('');
      setHistoryIndex(null);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      browseHistory(-1);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      browseHistory(1);
    }
  };

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      {entries.map((entry) =>
        entry.kind === 'input' ? (
          <p key={entry.id} className={styles.line}>
            <span className={styles.prompt}>{prompt}</span> {entry.text}
          </p>
        ) : (
          <p key={entry.id} className={styles.line} data-tone={entry.tone}>
            {entry.text || ' '}
          </p>
        ),
      )}
      <label className={styles.inputLine}>
        <span className={styles.prompt}>{prompt}</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Comando do terminal"
        />
      </label>
      <div ref={bottomRef} />
    </div>
  );
}
