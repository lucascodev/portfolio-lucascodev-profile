import { type PointerEvent, useRef } from 'react';
import { resizeWindowBounds } from '@/modules/portfolio/domain/rules/window-manager/resize-window-bounds.rule';
import type { WindowBounds } from '@/modules/portfolio/domain/types/desktop/window-bounds.type';
import type { WindowResizeEdge } from '@/modules/portfolio/domain/types/desktop/window-resize-edge.type';

interface WindowResizeOptions {
  readonly bounds: WindowBounds;
  readonly isEnabled: boolean;
  readonly onResize: (bounds: WindowBounds) => void;
}

interface ResizeStart {
  readonly edge: WindowResizeEdge;
  readonly pointerX: number;
  readonly pointerY: number;
  readonly bounds: WindowBounds;
}

export function useWindowResize({ bounds, isEnabled, onResize }: WindowResizeOptions) {
  const resizeStartRef = useRef<ResizeStart | null>(null);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = resizeStartRef.current;
    if (!start) return;
    const delta = { x: event.clientX - start.pointerX, y: event.clientY - start.pointerY };
    onResize(resizeWindowBounds(start.bounds, start.edge, delta));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!resizeStartRef.current) return;
    resizeStartRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePropsFor = (edge: WindowResizeEdge) => ({
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (!isEnabled || event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      resizeStartRef.current = { edge, pointerX: event.clientX, pointerY: event.clientY, bounds };
    },
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  });

  return { handlePropsFor };
}
