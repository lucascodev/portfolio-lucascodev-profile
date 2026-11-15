import { useMemo } from 'react';
import { highlightTerminalInput } from '@/modules/portfolio/domain/rules/terminal/highlight-terminal-input.rule';
import styles from './command-text.module.css';

interface CommandTextProps {
  readonly text: string;
}

export function CommandText({ text }: CommandTextProps) {
  const tokens = useMemo(() => highlightTerminalInput(text), [text]);

  return (
    <>
      {tokens.map((token, index) => (
        <span key={index} className={styles.token} data-kind={token.kind}>
          {token.text}
        </span>
      ))}
    </>
  );
}
