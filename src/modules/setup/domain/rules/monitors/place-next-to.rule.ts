import { MONITOR_GAP_METERS, MONITOR_INWARD_ANGLE_RADIANS } from '@/modules/setup/domain/constants/monitor-arrangement.constant';
import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';

export type PlacementDirection = 1 | -1;

export function placeNextTo(
  previous: DisplayPlacement,
  previousWidth: number,
  width: number,
  direction: PlacementDirection,
): DisplayPlacement {
  const rotationY = previous.rotationY - direction * MONITOR_INWARD_ANGLE_RADIANS;
  const previousReach = previousWidth / 2 + MONITOR_GAP_METERS / 2;
  const nextReach = width / 2 + MONITOR_GAP_METERS / 2;

  return {
    rotationY,
    x: previous.x + direction * (Math.cos(previous.rotationY) * previousReach + Math.cos(rotationY) * nextReach),
    z: previous.z - direction * (Math.sin(previous.rotationY) * previousReach + Math.sin(rotationY) * nextReach),
  };
}
