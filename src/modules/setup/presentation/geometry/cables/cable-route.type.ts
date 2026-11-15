import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export interface CablePlug {
  readonly socket: ScenePosition;
  readonly tip: ScenePosition;
}

export interface CableRoute {
  readonly key: string;
  readonly points: readonly ScenePosition[];
  readonly plugs: readonly CablePlug[];
  readonly color: string;
  readonly connects: readonly string[];
}
