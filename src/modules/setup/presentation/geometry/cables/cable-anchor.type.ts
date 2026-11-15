import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

/** Where a cable plugs in, and the unit direction its connector points out of the device. */
export interface CableAnchor {
  readonly position: ScenePosition;
  readonly exit: ScenePosition;
}
