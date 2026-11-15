import {
  LAPTOP_DECK_DEPTH_TO_WIDTH_RATIO,
  LAPTOP_SIDE_BEZEL_METERS,
} from '@/modules/setup/domain/constants/laptop-proportions.constant';
import { calculateScreenSize } from '@/modules/setup/domain/rules/monitors/calculate-screen-size.rule';
import { placeNextTo } from '@/modules/setup/domain/rules/monitors/place-next-to.rule';
import type { ArrangedLaptop } from '@/modules/setup/domain/types/laptop/arranged-laptop.type';
import type { LaptopSpec } from '@/modules/setup/domain/types/laptop/laptop.type';
import type { ArrangedMonitor } from '@/modules/setup/domain/types/monitor/arranged-monitor.type';

/**
 * Places the laptop beside the outermost monitor on its side. The returned placement is the deck center,
 * pushed forward so the hinge (where the screen stands) lines up with the monitor row.
 */
export function arrangeLaptop(laptop: LaptopSpec, monitors: readonly ArrangedMonitor[]): ArrangedLaptop {
  const screenSize = calculateScreenSize({ ...laptop, orientation: 'landscape' });
  const bodyWidth = screenSize.width + LAPTOP_SIDE_BEZEL_METERS * 2;
  const bodySize = { width: bodyWidth, height: bodyWidth * LAPTOP_DECK_DEPTH_TO_WIDTH_RATIO };
  const direction = laptop.side === 'right' ? 1 : -1;
  const neighbour = laptop.side === 'right' ? monitors.at(-1) : monitors.at(0);

  const hinge = neighbour
    ? placeNextTo(neighbour.placement, neighbour.screenSize.width, bodyWidth, direction)
    : { x: 0, z: 0, rotationY: 0 };
  const forwardOffset = bodySize.height / 2;

  return {
    spec: laptop,
    screenSize,
    bodySize,
    placement: {
      rotationY: hinge.rotationY,
      x: hinge.x + Math.sin(hinge.rotationY) * forwardOffset,
      z: hinge.z + Math.cos(hinge.rotationY) * forwardOffset,
    },
  };
}
