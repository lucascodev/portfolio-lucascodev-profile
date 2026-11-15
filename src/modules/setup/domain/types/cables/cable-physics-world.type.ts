import type { CableObstacle } from './cable-obstacle.type';

export interface CablePhysicsWorld {
  readonly obstacles: readonly CableObstacle[];
  readonly floorY: number;
}
