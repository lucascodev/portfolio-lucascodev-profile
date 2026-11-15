import { describe, expect, it } from 'vitest';
import type { MonitorSpec } from '@/modules/setup/domain/types/monitor/monitor.type';
import { arrangeMonitors } from './arrange-monitors.rule';

const DESK_DEPTH = 0.75;

const createMonitor = (overrides: Partial<MonitorSpec> = {}): MonitorSpec => ({
  label: 'Monitor',
  diagonalInches: 24,
  aspectRatio: '16:9',
  orientation: 'landscape',
  screen: { kind: 'dashboard', title: 'test' },
  ...overrides,
});

describe('arrangeMonitors', () => {
  it('returns nothing when there are no monitors', () => {
    expect(arrangeMonitors([], DESK_DEPTH)).toEqual([]);
  });

  it('centers the primary monitor facing the viewer', () => {
    const [primary] = arrangeMonitors([createMonitor()], DESK_DEPTH);

    expect(primary.placement.x).toBe(0);
    expect(primary.placement.rotationY).toBe(0);
  });

  it('honours a custom distance from the back of the desk for the primary monitor', () => {
    const [primary] = arrangeMonitors([createMonitor({ distanceFromDeskBackMeters: 0.4 })], DESK_DEPTH);

    expect(primary.placement.z).toBeCloseTo(-DESK_DEPTH / 2 + 0.4);
  });

  it('keeps the primary centered even when it is not the middle one', () => {
    const arranged = arrangeMonitors([createMonitor({ isPrimary: true }), createMonitor()], DESK_DEPTH);

    expect(arranged[0].placement.x).toBe(0);
    expect(arranged[1].placement.x).toBeGreaterThan(0);
  });

  it('angles side monitors inward and brings them closer to the viewer', () => {
    const [left, primary, right] = arrangeMonitors(
      [createMonitor(), createMonitor({ isPrimary: true }), createMonitor()],
      DESK_DEPTH,
    );

    expect(left.placement.x).toBeLessThan(0);
    expect(left.placement.rotationY).toBeGreaterThan(0);
    expect(right.placement.rotationY).toBeLessThan(0);
    expect(left.placement.z).toBeGreaterThan(primary.placement.z);
    expect(right.placement.z).toBeCloseTo(left.placement.z);
  });

  it('places neighbours without overlapping the primary screen', () => {
    const [primary, right] = arrangeMonitors([createMonitor({ isPrimary: true }), createMonitor()], DESK_DEPTH);
    const rightInnerEdgeX = right.placement.x - (Math.cos(right.placement.rotationY) * right.screenSize.width) / 2;

    expect(rightInnerEdgeX).toBeGreaterThan(primary.screenSize.width / 2);
  });
});
