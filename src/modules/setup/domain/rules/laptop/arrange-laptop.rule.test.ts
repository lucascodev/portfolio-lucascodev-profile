import { describe, expect, it } from 'vitest';
import { arrangeMonitors } from '@/modules/setup/domain/rules/monitors/arrange-monitors.rule';
import type { LaptopSpec } from '@/modules/setup/domain/types/laptop/laptop.type';
import type { MonitorSpec } from '@/modules/setup/domain/types/monitor/monitor.type';
import { arrangeLaptop } from './arrange-laptop.rule';

const ultrawide: MonitorSpec = {
  label: 'Ultrawide',
  diagonalInches: 34,
  aspectRatio: '21:9',
  orientation: 'landscape',
  screen: { kind: 'dashboard', title: 'test' },
};

const laptop: LaptopSpec = {
  label: 'MacBook',
  diagonalInches: 14,
  aspectRatio: '16:10',
  side: 'right',
  mount: 'arm-tray',
  bodyColor: '#888',
  screen: { kind: 'dashboard', title: 'test' },
};

describe('arrangeLaptop', () => {
  const monitors = arrangeMonitors([ultrawide], 0.75);

  it('places the laptop beside the monitor on the chosen side, angled inward', () => {
    const right = arrangeLaptop(laptop, monitors);
    const left = arrangeLaptop({ ...laptop, side: 'left' }, monitors);

    expect(right.placement.x).toBeGreaterThan(monitors[0].screenSize.width / 2);
    expect(right.placement.rotationY).toBeLessThan(0);
    expect(left.placement.x).toBeCloseTo(-right.placement.x);
    expect(left.placement.rotationY).toBeGreaterThan(0);
  });

  it('brings the deck forward so the hinge is in front of the monitor plane', () => {
    const arranged = arrangeLaptop(laptop, monitors);

    expect(arranged.placement.z).toBeGreaterThan(monitors[0].placement.z);
  });

  it('sizes a 14" 16:10 laptop with a body slightly wider than its screen', () => {
    const arranged = arrangeLaptop(laptop, monitors);

    expect(arranged.screenSize.width).toBeCloseTo(0.3015, 3);
    expect(arranged.bodySize.width).toBeGreaterThan(arranged.screenSize.width);
  });
});
