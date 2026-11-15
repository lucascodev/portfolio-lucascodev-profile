import { MINIMUM_WINDOW_SIZE } from '@/modules/portfolio/domain/constants/minimum-window-size.constant';
import type { WindowBounds } from '@/modules/portfolio/domain/types/desktop/window-bounds.type';
import type { WindowResizeEdge } from '@/modules/portfolio/domain/types/desktop/window-resize-edge.type';

interface PointerDelta {
  readonly x: number;
  readonly y: number;
}

interface Span {
  readonly start: number;
  readonly size: number;
}

const MIN_TOP_PX = 0;

/** Grows or shrinks the span from its start edge, keeping the end edge where it was. */
function resizeFromStart(span: Span, delta: number, minimumSize: number, minimumStart: number): Span {
  const end = span.start + span.size;
  const start = Math.max(minimumStart, Math.min(span.start + delta, end - minimumSize));
  return { start, size: end - start };
}

function resizeFromEnd(span: Span, delta: number, minimumSize: number): Span {
  return { start: span.start, size: Math.max(minimumSize, span.size + delta) };
}

export function resizeWindowBounds(
  bounds: WindowBounds,
  edge: WindowResizeEdge,
  delta: PointerDelta,
  minimumSize: { readonly width: number; readonly height: number } = MINIMUM_WINDOW_SIZE,
): WindowBounds {
  const width: Span = { start: bounds.x, size: bounds.width };
  const height: Span = { start: bounds.y, size: bounds.height };

  const horizontal = edge.includes('w')
    ? resizeFromStart(width, delta.x, minimumSize.width, -Infinity)
    : edge.includes('e')
      ? resizeFromEnd(width, delta.x, minimumSize.width)
      : width;
  const vertical = edge.includes('n')
    ? resizeFromStart(height, delta.y, minimumSize.height, MIN_TOP_PX)
    : edge.includes('s')
      ? resizeFromEnd(height, delta.y, minimumSize.height)
      : height;

  return { x: horizontal.start, y: vertical.start, width: horizontal.size, height: vertical.size };
}
