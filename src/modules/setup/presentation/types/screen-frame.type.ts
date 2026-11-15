import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export interface ScreenFrame {
  readonly center: ScenePosition;
  readonly width: number;
  readonly height: number;
  readonly rotationY: number;
}
