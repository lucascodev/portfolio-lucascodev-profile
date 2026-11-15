import { PlaneGeometry } from 'three';
import { describe, expect, it } from 'vitest';
import { bendGeometryAroundY } from './bend-geometry-around-y';

describe('bendGeometryAroundY', () => {
  it('keeps the center in place and brings the edges toward the viewer', () => {
    const geometry = bendGeometryAroundY(new PlaneGeometry(0.8, 0.3, 2, 1), 1.9);
    const positions = geometry.getAttribute('position');
    const center = { x: positions.getX(1), z: positions.getZ(1) };
    const edge = { x: positions.getX(2), z: positions.getZ(2) };

    expect(center.x).toBeCloseTo(0);
    expect(center.z).toBeCloseTo(0);
    expect(edge.z).toBeGreaterThan(0.04);
    expect(edge.x).toBeLessThan(0.4);
  });
});
