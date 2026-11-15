import { describe, expect, it } from 'vitest';
import { interpolateCameraFlight } from './interpolate-camera-flight';

const from = { position: { x: 0, y: 1.6, z: 2.5 }, target: { x: 0, y: 1, z: 0 }, viewShift: 0.1 };
const to = { position: { x: 0, y: 1.1, z: 0.5 }, target: { x: 0, y: 1.1, z: 0 }, viewShift: 0 };

describe('interpolateCameraFlight', () => {
  it('starts exactly at the origin pose and ends exactly at the destination', () => {
    expect(interpolateCameraFlight(from, to, 0, 0.2)).toEqual(from);
    expect(interpolateCameraFlight(from, to, 1, 0.2)).toEqual(to);
  });

  it('arcs above the straight line between the two positions', () => {
    const halfway = interpolateCameraFlight(from, to, 0.5, 0.2);
    const straightLineHeight = (from.position.y + to.position.y) / 2;

    expect(halfway.position.y).toBeGreaterThan(straightLineHeight);
  });

  it('eases in, moving less in the first tenth than a linear flight would', () => {
    const early = interpolateCameraFlight(from, to, 0.1, 0);
    const linearZ = from.position.z + (to.position.z - from.position.z) * 0.1;

    expect(early.position.z).toBeGreaterThan(linearZ);
  });

  it('clamps progress outside 0..1', () => {
    expect(interpolateCameraFlight(from, to, 1.4, 0.2)).toEqual(to);
  });
});
