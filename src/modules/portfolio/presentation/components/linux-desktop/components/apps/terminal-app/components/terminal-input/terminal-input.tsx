import { type KeyboardEvent, type RefObject, type UIEvent, useRef } from 'react';
import { CommandText } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/terminal-app/components/command-text/command-text';
import styles from './terminal-input.module.css';

interface TerminalInputProps {
  readonly value: string;
  readonly suggestion?: string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly onChange: (value: string) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function TerminalInput({ value, suggestion, inputRef, onChange, onKeyDown }: TerminalInputProps) {
  const highlightRef = useRef<HTMLSpanElement>(null);
  const suggestedRest = suggestion?.slice(value.length);

  const followInputScroll = (event: UIEvent<HTMLInputElement>) => {
    highlightRef.current?.scrollTo({ left: event.currentTarget.scrollLeft });
  };

  return (
    <span className={styles.field}>
      <span ref={highlightRef} className={styles.highlight} aria-hidden="true">
        <CommandText text={value} />
        {suggestedRest && <span className={styles.suggestion}>{suggestedRest}</span>}
      </span>
      <input
        ref={inputRef}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onScroll={followInputScroll}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        aria-label="Comando do terminal"
      />
    </span>
  );
}
