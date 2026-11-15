import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export function transformFromPlacement(placement: DisplayPlacement, localPoint: ScenePosition): ScenePosition {
  const sin = Math.sin(placement.rotationY);
  const cos = Math.cos(placement.rotationY);

  return {
    x: placement.x + localPoint.x * cos + localPoint.z * sin,
    y: localPoint.y,
    z: placement.z - localPoint.x * sin + localPoint.z * cos,
  };
}
