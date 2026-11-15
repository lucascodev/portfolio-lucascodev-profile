import { describe, expect, it } from 'vitest';
import { transformFromPlacement } from './transform-from-placement';

describe('transformFromPlacement', () => {
  it('only translates when the display is not rotated', () => {
    expect(transformFromPlacement({ x: 1, z: 2, rotationY: 0 }, { x: 0.1, y: 0.5, z: -0.2 })).toEqual({
      x: 1.1,
      y: 0.5,
      z: 1.8,
    });
  });

  it('rotates a point behind the display the same way three.js rotates the group', () => {
    const point = transformFromPlacement({ x: 0, z: 0, rotationY: Math.PI / 2 }, { x: 0, y: 0, z: -1 });

    expect(point.x).toBeCloseTo(-1);
    expect(point.z).toBeCloseTo(0);
  });
});
