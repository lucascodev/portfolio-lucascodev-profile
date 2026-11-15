import { describe, expect, it } from 'vitest';
import { CABLE_SURFACE_HEIGHT_METERS } from '@/modules/setup/domain/constants/cable-routing.constant';
import { routeCable } from './route-cable.rule';

const CHANNEL_Z = -0.4;

describe('routeCable', () => {
  it('starts and ends exactly at the given endpoints', () => {
    const start = { x: 0, y: 0.01, z: 0.2 };
    const end = { x: 0.3, y: 0.05, z: -0.35 };
    const route = routeCable(start, end, CHANNEL_Z);

    expect(route.at(0)).toEqual(start);
    expect(route.at(-1)).toEqual(end);
  });

  it('runs along the back channel on the desk surface', () => {
    const route = routeCable({ x: -0.2, y: 0.004, z: 0.2 }, { x: 0.4, y: 0.004, z: -0.3 }, CHANNEL_Z);
    const channelPoints = route.filter((point) => point.z === CHANNEL_Z);

    expect(channelPoints).toHaveLength(2);
    channelPoints.forEach((point) => expect(point.y).toBe(CABLE_SURFACE_HEIGHT_METERS));
  });

  it('drops an elevated start down to the desk before heading back', () => {
    const route = routeCable({ x: 0, y: 0.45, z: 0 }, { x: 0.3, y: 0.004, z: -0.3 }, CHANNEL_Z);

    expect(route[1].y).toBe(CABLE_SURFACE_HEIGHT_METERS);
    expect(route[1].z).toBeLessThan(0);
  });

  it('never repeats points that are on top of each other', () => {
    const route = routeCable({ x: 0, y: 0.004, z: CHANNEL_Z }, { x: 0, y: 0.004, z: CHANNEL_Z }, CHANNEL_Z);

    expect(route).toHaveLength(1);
  });
});
