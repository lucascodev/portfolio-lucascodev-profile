import { useEffect } from 'react';

interface KeyPressOptions {
  readonly isEnabled: boolean;
  readonly worksWhileTyping?: boolean;
}

const TEXT_INPUT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

/** Runs the handler for a key on the whole page; by default it stays out of the way while the visitor types. */
export function useKeyPress(key: string, handler: () => void, { isEnabled, worksWhileTyping = false }: KeyPressOptions): void {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isTyping = event.target instanceof Element && event.target.closest(TEXT_INPUT_SELECTOR) !== null;
      if (event.key !== key || event.repeat || (isTyping && !worksWhileTyping)) return;
      event.preventDefault();
      handler();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, handler, isEnabled, worksWhileTyping]);
}
