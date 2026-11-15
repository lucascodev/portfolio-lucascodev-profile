import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export interface CameraPose {
  readonly position: ScenePosition;
  readonly target: ScenePosition;
  readonly viewShift: number;
}
