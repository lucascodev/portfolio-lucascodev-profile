import { describe, expect, it } from 'vitest';
import type { CableObstacle } from '@/modules/setup/domain/types/cables/cable-obstacle.type';
import type { CablePhysicsWorld } from '@/modules/setup/domain/types/cables/cable-physics-world.type';
import { simulateCable } from './simulate-cable.rule';

const desk: CableObstacle = {
  center: { x: 0, y: -0.02, z: 0 },
  halfSize: { x: 1, y: 0.02, z: 0.5 },
  rotationY: 0,
};
const box: CableObstacle = {
  center: { x: 0, y: 0.05, z: 0 },
  halfSize: { x: 0.1, y: 0.05, z: 0.1 },
  rotationY: 0.4,
  owners: ['pc-tower'],
};
const world: CablePhysicsWorld = { obstacles: [desk, box], floorY: -0.75 };

function isInside(obstacle: CableObstacle, point: { x: number; y: number; z: number }): boolean {
  const sin = Math.sin(obstacle.rotationY);
  const cos = Math.cos(obstacle.rotationY);
  const dx = point.x - obstacle.center.x;
  const dz = point.z - obstacle.center.z;
  const local = { x: dx * cos - dz * sin, y: point.y - obstacle.center.y, z: dx * sin + dz * cos };
  return (
    Math.abs(local.x) < obstacle.halfSize.x - 1e-4 &&
    Math.abs(local.y) < obstacle.halfSize.y - 1e-4 &&
    Math.abs(local.z) < obstacle.halfSize.z - 1e-4
  );
}

describe('simulateCable', () => {
  const straightThroughBox = [
    { x: -0.4, y: 0.005, z: 0 },
    { x: 0.4, y: 0.005, z: 0 },
  ];

  it('keeps both ends pinned where the devices are', () => {
    const cable = simulateCable(straightThroughBox, world, []);

    expect(cable.at(0)).toEqual(straightThroughBox[0]);
    expect(cable.at(-1)).toEqual(straightThroughBox[1]);
  });

  it('never leaves the cable inside an obstacle or under the desk top', () => {
    const cable = simulateCable(straightThroughBox, world, []);

    cable.forEach((point) => {
      expect(isInside(box, point)).toBe(false);
      expect(isInside(desk, point)).toBe(false);
    });
  });

  it('lets a cable pass through the device it is plugged into', () => {
    const cable = simulateCable(straightThroughBox, world, ['pc-tower']);

    expect(cable.some((point) => isInside(box, point))).toBe(true);
  });

  it('sags under gravity between two raised points', () => {
    const raised = [
      { x: -0.3, y: 0.5, z: 0.4 },
      { x: 0.3, y: 0.5, z: 0.4 },
    ];
    const cable = simulateCable(raised, { obstacles: [], floorY: -0.75 }, []);
    const middle = cable[Math.floor(cable.length / 2)];

    expect(middle.y).toBeLessThan(0.45);
  });
});
