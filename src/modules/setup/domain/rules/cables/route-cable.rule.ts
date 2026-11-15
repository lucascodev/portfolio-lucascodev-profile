import { CABLE_SURFACE_HEIGHT_METERS } from '@/modules/setup/domain/constants/cable-routing.constant';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

const DROP_SETBACK_METERS = 0.05;
const ELEVATED_THRESHOLD_METERS = 0.02;
const MIN_POINT_DISTANCE_METERS = 0.01;

function isElevated(point: ScenePosition): boolean {
  return Math.abs(point.y - CABLE_SURFACE_HEIGHT_METERS) > ELEVATED_THRESHOLD_METERS;
}

function distance(a: ScenePosition, b: ScenePosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function removeClosePoints(points: readonly ScenePosition[]): ScenePosition[] {
  return points.filter((point, index) => index === 0 || distance(point, points[index - 1]) >= MIN_POINT_DISTANCE_METERS);
}

/**
 * Routes a cable like people do on a real desk: down to the surface behind the device,
 * straight back to a channel along the back edge, sideways along it, then into the target.
 * Heights are relative to the desk top.
 */
export function routeCable(start: ScenePosition, end: ScenePosition, channelZ: number): ScenePosition[] {
  const surface = CABLE_SURFACE_HEIGHT_METERS;
  const points: ScenePosition[] = [start];

  if (isElevated(start)) points.push({ x: start.x, y: surface, z: start.z - DROP_SETBACK_METERS });
  points.push({ x: start.x, y: surface, z: channelZ });
  points.push({ x: end.x, y: surface, z: channelZ });
  if (isElevated(end)) points.push({ x: end.x, y: surface, z: (channelZ + end.z) / 2 });
  points.push(end);

  return removeClosePoints(points);
}
