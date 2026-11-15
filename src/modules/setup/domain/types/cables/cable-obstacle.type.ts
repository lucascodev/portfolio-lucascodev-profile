import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import type { CableEndpoint } from './cable-endpoint.type';

export interface CableObstacle {
  readonly center: ScenePosition;
  readonly halfSize: ScenePosition;
  readonly rotationY: number;
  readonly owners?: readonly CableEndpoint[];
}
