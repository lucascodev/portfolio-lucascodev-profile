import { describe, expect, it } from 'vitest';
import { calculateInitialWindowBounds } from './calculate-initial-window-bounds';

describe('calculateInitialWindowBounds', () => {
  it('keeps the window fully inside the desktop area', () => {
    const bounds = calculateInitialWindowBounds({ width: 800, height: 600 }, { width: 500, height: 400 }, 0);

    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(500);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(400);
  });

  it('cascades each new window a bit further', () => {
    const area = { width: 1600, height: 900 };
    const first = calculateInitialWindowBounds({ width: 600, height: 400 }, area, 0);
    const second = calculateInitialWindowBounds({ width: 600, height: 400 }, area, 1);

    expect(second.x).toBeGreaterThan(first.x);
    expect(second.y).toBeGreaterThan(first.y);
  });
});
