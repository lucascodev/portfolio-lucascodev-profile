import { MONITOR_DISTANCE_FROM_DESK_BACK_METERS } from '@/modules/setup/domain/constants/monitor-arrangement.constant';
import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';
import type { ArrangedMonitor } from '@/modules/setup/domain/types/monitor/arranged-monitor.type';
import type { MonitorSpec } from '@/modules/setup/domain/types/monitor/monitor.type';
import { calculateScreenSize } from './calculate-screen-size.rule';
import { placeNextTo } from './place-next-to.rule';

function findPrimaryIndex(monitors: readonly MonitorSpec[]): number {
  const explicitIndex = monitors.findIndex((monitor) => monitor.isPrimary);
  if (explicitIndex >= 0) return explicitIndex;
  return Math.floor((monitors.length - 1) / 2);
}

export function arrangeMonitors(monitors: readonly MonitorSpec[], deskDepth: number): ArrangedMonitor[] {
  if (monitors.length === 0) return [];

  const sizes = monitors.map(calculateScreenSize);
  const primaryIndex = findPrimaryIndex(monitors);
  const placements: DisplayPlacement[] = [];
  const distanceFromBack = monitors[primaryIndex].distanceFromDeskBackMeters ?? MONITOR_DISTANCE_FROM_DESK_BACK_METERS;
  placements[primaryIndex] = { x: 0, z: -deskDepth / 2 + distanceFromBack, rotationY: 0 };

  for (let index = primaryIndex + 1; index < monitors.length; index++) {
    placements[index] = placeNextTo(placements[index - 1], sizes[index - 1].width, sizes[index].width, 1);
  }
  for (let index = primaryIndex - 1; index >= 0; index--) {
    placements[index] = placeNextTo(placements[index + 1], sizes[index + 1].width, sizes[index].width, -1);
  }

  return monitors.map((spec, index) => ({ spec, screenSize: sizes[index], placement: placements[index] }));
}
