import { describe, expect, it } from 'vitest';
import { resizeWindowBounds } from './resize-window-bounds.rule';

const bounds = { x: 100, y: 80, width: 500, height: 400 };
const minimumSize = { width: 320, height: 220 };

describe('resizeWindowBounds', () => {
  it('grows the window to the right and down from the south-east corner', () => {
    expect(resizeWindowBounds(bounds, 'se', { x: 40, y: 30 }, minimumSize)).toEqual({ x: 100, y: 80, width: 540, height: 430 });
  });

  it('keeps the right edge in place when resizing from the west edge', () => {
    const resized = resizeWindowBounds(bounds, 'w', { x: -50, y: 999 }, minimumSize);

    expect(resized).toEqual({ x: 50, y: 80, width: 550, height: 400 });
    expect(resized.x + resized.width).toBe(bounds.x + bounds.width);
  });

  it('keeps the bottom edge in place when resizing from the north edge', () => {
    expect(resizeWindowBounds(bounds, 'n', { x: 0, y: 30 }, minimumSize)).toEqual({ x: 100, y: 110, width: 500, height: 370 });
  });

  it('never shrinks below the minimum size, whatever the edge', () => {
    expect(resizeWindowBounds(bounds, 'se', { x: -900, y: -900 }, minimumSize)).toMatchObject({ width: 320, height: 220 });
    expect(resizeWindowBounds(bounds, 'nw', { x: 900, y: 900 }, minimumSize)).toEqual({ x: 280, y: 260, width: 320, height: 220 });
  });

  it('stops the top edge at the top of the workspace', () => {
    expect(resizeWindowBounds(bounds, 'n', { x: 0, y: -200 }, minimumSize)).toEqual({ x: 100, y: 0, width: 500, height: 480 });
  });
});
