import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export function transformToPlacement(placement: DisplayPlacement, worldPoint: ScenePosition): ScenePosition {
  const sin = Math.sin(placement.rotationY);
  const cos = Math.cos(placement.rotationY);
  const dx = worldPoint.x - placement.x;
  const dz = worldPoint.z - placement.z;

  return {
    x: dx * cos - dz * sin,
    y: worldPoint.y,
    z: dx * sin + dz * cos,
  };
}
