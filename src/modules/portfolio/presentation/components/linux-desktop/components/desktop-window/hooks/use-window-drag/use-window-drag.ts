import { type PointerEvent, useRef } from 'react';

interface WindowDragOptions {
  readonly position: { readonly x: number; readonly y: number };
  readonly isEnabled: boolean;
  readonly onMove: (x: number, y: number) => void;
}

interface DragStart {
  readonly pointerX: number;
  readonly pointerY: number;
  readonly windowX: number;
  readonly windowY: number;
}

const MIN_TOP_PX = 0;

export function useWindowDrag({ position, isEnabled, onMove }: WindowDragOptions) {
  const dragStartRef = useRef<DragStart | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    const isOnControl = (event.target as HTMLElement).closest('button');
    if (!isEnabled || isOnControl || event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { pointerX: event.clientX, pointerY: event.clientY, windowX: position.x, windowY: position.y };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = dragStartRef.current;
    if (!start) return;
    onMove(start.windowX + event.clientX - start.pointerX, Math.max(MIN_TOP_PX, start.windowY + event.clientY - start.pointerY));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}
