import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export interface CableAnchor {
  readonly position: ScenePosition;
  readonly exit: ScenePosition;
}
