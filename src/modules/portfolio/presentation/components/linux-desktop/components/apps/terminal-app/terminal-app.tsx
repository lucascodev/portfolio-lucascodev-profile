import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { getShellUserHost } from '@/modules/portfolio/domain/rules/profile/get-shell-user-host.rule';
import { completeTerminalInput } from '@/modules/portfolio/domain/rules/terminal/complete-terminal-input.rule';
import { suggestTerminalInput } from '@/modules/portfolio/domain/rules/terminal/suggest-terminal-input.rule';
import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import { CommandText } from './components/command-text/command-text';
import { TerminalInput } from './components/terminal-input/terminal-input';
import { useTerminalSession } from './hooks/use-terminal-session/use-terminal-session';
import styles from './terminal-app.module.css';

interface TerminalAppProps {
  readonly content: PortfolioContent;
  readonly onOpenApp: (appId: DesktopAppId) => void;
  readonly onPowerOff: () => void;
}

const SUGGESTION_ACCEPT_KEYS = ['ArrowRight', 'End'];
const NO_CANDIDATES: readonly string[] = [];

export function TerminalApp({ content, onOpenApp, onPowerOff }: TerminalAppProps) {
  const { entries, history, submit } = useTerminalSession({ content, onOpenApp, onPowerOff });
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [candidates, setCandidates] = useState(NO_CANDIDATES);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prompt = `${getShellUserHost(content.profile.name)}:~$`;
  const suggestion = useMemo(() => suggestTerminalInput(input, history), [input, history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [entries, candidates]);

  const typeInput = (value: string) => {
    setInput(value);
    setCandidates(NO_CANDIDATES);
  };

  const browseHistory = (direction: -1 | 1) => {
    if (history.length === 0) return;
    const current = historyIndex ?? history.length;
    const next = Math.min(history.length, Math.max(0, current + direction));
    setHistoryIndex(next === history.length ? null : next);
    typeInput(history[next] ?? '');
  };

  const completeInput = () => {
    const completion = completeTerminalInput(input);
    setInput(completion.input);
    setCandidates(completion.candidates);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const isCaretAtEnd = event.currentTarget.selectionStart === input.length;

    if (event.key === 'Enter') {
      submit(input);
      typeInput('');
      setHistoryIndex(null);
    }
    if (event.key === 'Tab' && input !== '') {
      event.preventDefault();
      completeInput();
    }
    if (SUGGESTION_ACCEPT_KEYS.includes(event.key) && suggestion && isCaretAtEnd) {
      event.preventDefault();
      typeInput(suggestion);
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
            <span className={styles.prompt}>{prompt}</span> <CommandText text={entry.text} />
          </p>
        ) : (
          <p key={entry.id} className={styles.line} data-tone={entry.tone}>
            {entry.text || ' '}
          </p>
        ),
      )}
      <div className={styles.inputLine}>
        <span className={styles.prompt}>{prompt}</span>
        <TerminalInput value={input} suggestion={suggestion} inputRef={inputRef} onChange={typeInput} onKeyDown={handleKeyDown} />
      </div>
      {candidates.length > 0 && (
        <p className={styles.line} data-tone="muted">
          {candidates.join('  ')}
        </p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
