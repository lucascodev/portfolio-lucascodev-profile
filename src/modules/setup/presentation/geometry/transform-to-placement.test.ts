import { describe, expect, it } from 'vitest';
import { transformFromPlacement } from './transform-from-placement';
import { transformToPlacement } from './transform-to-placement';

describe('transformToPlacement', () => {
  it('undoes transformFromPlacement', () => {
    const placement = { x: 0.4, z: -0.2, rotationY: 0.7 };
    const local = { x: 0.1, y: 0.3, z: -0.25 };
    const roundTrip = transformToPlacement(placement, transformFromPlacement(placement, local));

    expect(roundTrip.x).toBeCloseTo(local.x);
    expect(roundTrip.y).toBeCloseTo(local.y);
    expect(roundTrip.z).toBeCloseTo(local.z);
  });
});
