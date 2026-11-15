import { describe, expect, it } from 'vitest';
import type { MonitorSpec } from '@/modules/setup/domain/types/monitor/monitor.type';
import { calculateScreenSize } from './calculate-screen-size.rule';

const baseMonitor: MonitorSpec = {
  label: 'Test monitor',
  diagonalInches: 27,
  aspectRatio: '16:9',
  orientation: 'landscape',
  screen: { kind: 'dashboard', title: 'test' },
};

describe('calculateScreenSize', () => {
  it('converts a 27" 16:9 diagonal into its real width and height in meters', () => {
    const size = calculateScreenSize(baseMonitor);

    expect(size.width).toBeCloseTo(0.5977, 3);
    expect(size.height).toBeCloseTo(0.3362, 3);
  });

  it('swaps width and height when the monitor is in portrait', () => {
    const landscape = calculateScreenSize(baseMonitor);
    const portrait = calculateScreenSize({ ...baseMonitor, orientation: 'portrait' });

    expect(portrait).toEqual({ width: landscape.height, height: landscape.width });
  });

  it('makes an ultrawide wider than a 16:9 of the same diagonal', () => {
    const ultrawide = calculateScreenSize({ ...baseMonitor, aspectRatio: '21:9' });

    expect(ultrawide.width).toBeGreaterThan(calculateScreenSize(baseMonitor).width);
  });
});
