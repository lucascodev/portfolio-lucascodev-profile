import type { CableEndpoint } from '@/modules/setup/domain/types/cables/cable-endpoint.type';
import type { CableObstacle } from '@/modules/setup/domain/types/cables/cable-obstacle.type';
import type { CablePhysicsWorld } from '@/modules/setup/domain/types/cables/cable-physics-world.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { measurePolyline, resamplePolyline } from './resample-polyline.rule';

interface MutablePoint {
  x: number;
  y: number;
  z: number;
}

const GRAVITY_METERS_PER_SECOND_SQUARED = -9.8;
const TIME_STEP_SECONDS = 1 / 60;
const SIMULATION_STEPS = 150;
const CONSTRAINT_ITERATIONS = 10;
const LOW_OBSTACLE_HEIGHT_METERS = 0.07;
const BROAD_PHASE_MARGIN_METERS = 0.2;
const DAMPING = 0.97;
const SURFACE_FRICTION = 0.6;
const CABLE_SLACK = 1.04;
const COLLISION_RADIUS_METERS = 0.004;
const TARGET_SEGMENT_LENGTH_METERS = 0.025;
const MIN_SEGMENTS = 8;
const MAX_SEGMENTS = 90;

function toLocal(obstacle: CableObstacle, point: MutablePoint): MutablePoint {
  const sin = Math.sin(obstacle.rotationY);
  const cos = Math.cos(obstacle.rotationY);
  const dx = point.x - obstacle.center.x;
  const dz = point.z - obstacle.center.z;
  return { x: dx * cos - dz * sin, y: point.y - obstacle.center.y, z: dx * sin + dz * cos };
}

function writeFromLocal(obstacle: CableObstacle, local: MutablePoint, target: MutablePoint): void {
  const sin = Math.sin(obstacle.rotationY);
  const cos = Math.cos(obstacle.rotationY);
  target.x = obstacle.center.x + local.x * cos + local.z * sin;
  target.y = obstacle.center.y + local.y;
  target.z = obstacle.center.z - local.x * sin + local.z * cos;
}

interface PushOut {
  readonly axis: 'x' | 'y' | 'z';
  readonly distance: number;
}

/**
 * Pushes the point out through the closest face. Objects resting on the desk (bottom at or below the
 * desk top, which is y = 0) never push cables downward, otherwise the cable would get trapped between
 * the object and the desk; low ones always push upward, so cables drape over them instead of being
 * shoved sideways off the desk edge. Returns true when the point was pushed up onto a top face.
 */
function resolveObstacle(obstacle: CableObstacle, point: MutablePoint): boolean {
  const local = toLocal(obstacle, point);
  const reach = {
    x: obstacle.halfSize.x + COLLISION_RADIUS_METERS,
    y: obstacle.halfSize.y + COLLISION_RADIUS_METERS,
    z: obstacle.halfSize.z + COLLISION_RADIUS_METERS,
  };
  const isOutside = Math.abs(local.x) >= reach.x || Math.abs(local.y) >= reach.y || Math.abs(local.z) >= reach.z;
  if (isOutside) return false;

  const isResting = obstacle.center.y - obstacle.halfSize.y <= COLLISION_RADIUS_METERS;
  const isLowAndResting = isResting && obstacle.halfSize.y * 2 <= LOW_OBSTACLE_HEIGHT_METERS;
  if (isLowAndResting) {
    local.y = reach.y;
    writeFromLocal(obstacle, local, point);
    return true;
  }

  const candidates: PushOut[] = [
    { axis: 'x', distance: reach.x - local.x },
    { axis: 'x', distance: -reach.x - local.x },
    { axis: 'z', distance: reach.z - local.z },
    { axis: 'z', distance: -reach.z - local.z },
    { axis: 'y', distance: reach.y - local.y },
    ...(isResting ? [] : [{ axis: 'y' as const, distance: -reach.y - local.y }]),
  ];
  const shortest = candidates.reduce((best, candidate) =>
    Math.abs(candidate.distance) < Math.abs(best.distance) ? candidate : best,
  );

  local[shortest.axis] += shortest.distance;
  writeFromLocal(obstacle, local, point);
  return shortest.axis === 'y' && shortest.distance > 0;
}

function isNearPath(obstacle: CableObstacle, path: readonly ScenePosition[]): boolean {
  const radius = Math.hypot(obstacle.halfSize.x, obstacle.halfSize.z) + BROAD_PHASE_MARGIN_METERS;
  const xs = path.map((point) => point.x);
  const zs = path.map((point) => point.z);
  return (
    obstacle.center.x + radius >= Math.min(...xs) &&
    obstacle.center.x - radius <= Math.max(...xs) &&
    obstacle.center.z + radius >= Math.min(...zs) &&
    obstacle.center.z - radius <= Math.max(...zs)
  );
}

function applyFriction(point: MutablePoint, previous: MutablePoint): void {
  previous.x += (point.x - previous.x) * SURFACE_FRICTION;
  previous.z += (point.z - previous.z) * SURFACE_FRICTION;
}

function satisfyDistance(a: MutablePoint, b: MutablePoint, restLength: number, isAPinned: boolean, isBPinned: boolean): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const length = Math.hypot(dx, dy, dz);
  if (length === 0 || (isAPinned && isBPinned)) return;

  const correction = (length - restLength) / length;
  const shareA = isAPinned ? 0 : isBPinned ? 1 : 0.5;
  const shareB = 1 - shareA;
  a.x += dx * correction * shareA;
  a.y += dy * correction * shareA;
  a.z += dz * correction * shareA;
  b.x -= dx * correction * shareB;
  b.y -= dy * correction * shareB;
  b.z -= dz * correction * shareB;
}

/**
 * Settles a cable as a Verlet rope pinned at both ends: it falls under gravity, keeps a fixed length
 * with a little slack, rests on surfaces with friction and is pushed out of every obstacle it does not
 * plug into. Runs once and returns the settled shape.
 */
export function simulateCable(
  initialPath: readonly ScenePosition[],
  world: CablePhysicsWorld,
  connectedEndpoints: readonly CableEndpoint[],
): ScenePosition[] {
  const pathLength = measurePolyline(initialPath);
  const segmentCount = Math.min(MAX_SEGMENTS, Math.max(MIN_SEGMENTS, Math.round(pathLength / TARGET_SEGMENT_LENGTH_METERS)));
  const restLength = (pathLength * CABLE_SLACK) / segmentCount;
  const obstacles = world.obstacles.filter(
    (obstacle) =>
      !obstacle.owners?.some((owner) => connectedEndpoints.includes(owner)) && isNearPath(obstacle, initialPath),
  );

  const points: MutablePoint[] = resamplePolyline(initialPath, segmentCount).map((point) => ({ ...point }));
  const previous: MutablePoint[] = points.map((point) => ({ ...point }));
  const lastIndex = points.length - 1;
  const isPinned = (index: number) => index === 0 || index === lastIndex;
  const gravityStep = GRAVITY_METERS_PER_SECOND_SQUARED * TIME_STEP_SECONDS * TIME_STEP_SECONDS;

  for (let step = 0; step < SIMULATION_STEPS; step++) {
    for (let index = 1; index < lastIndex; index++) {
      const point = points[index];
      const velocity = {
        x: (point.x - previous[index].x) * DAMPING,
        y: (point.y - previous[index].y) * DAMPING,
        z: (point.z - previous[index].z) * DAMPING,
      };
      previous[index] = { ...point };
      point.x += velocity.x;
      point.y += velocity.y + gravityStep;
      point.z += velocity.z;
    }

    for (let iteration = 0; iteration < CONSTRAINT_ITERATIONS; iteration++) {
      for (let index = 0; index < lastIndex; index++) {
        satisfyDistance(points[index], points[index + 1], restLength, isPinned(index), isPinned(index + 1));
      }
      for (let index = 1; index < lastIndex; index++) {
        const point = points[index];
        for (const obstacle of obstacles) {
          if (resolveObstacle(obstacle, point)) applyFriction(point, previous[index]);
        }
        if (point.y < world.floorY + COLLISION_RADIUS_METERS) {
          point.y = world.floorY + COLLISION_RADIUS_METERS;
          applyFriction(point, previous[index]);
        }
      }
    }
  }

  return points.map((point) => ({ x: point.x, y: point.y, z: point.z }));
}
