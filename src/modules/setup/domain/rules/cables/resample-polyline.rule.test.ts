import { describe, expect, it } from 'vitest';
import { measurePolyline, resamplePolyline } from './resample-polyline.rule';

const lShape = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 1, y: 0, z: 1 },
];

describe('resamplePolyline', () => {
  it('measures the total length of all segments', () => {
    expect(measurePolyline(lShape)).toBeCloseTo(2);
  });

  it('keeps both ends and spaces samples evenly along the path', () => {
    const samples = resamplePolyline(lShape, 4);

    expect(samples).toHaveLength(5);
    expect(samples[0]).toEqual(lShape[0]);
    expect(samples[4]).toEqual(lShape[2]);
    expect(samples[2].x).toBeCloseTo(1);
    expect(samples[2].z).toBeCloseTo(0);
    expect(samples[3].z).toBeCloseTo(0.5);
  });
});
