import { type RefObject, useEffect } from 'react';

interface DismissOptions {
  readonly isEnabled: boolean;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly onDismiss: () => void;
}

/**
 * Closes a popover on Escape or on a pointer press outside the container.
 * Listens in the capture phase so this Escape is consumed before page-wide Escape shortcuts see it.
 */
export function useDismiss({ isEnabled, containerRef, onDismiss }: DismissOptions): void {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const isInside = event.target instanceof Node && containerRef.current?.contains(event.target);
      if (!isInside) onDismiss();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isEnabled, containerRef, onDismiss]);
}
