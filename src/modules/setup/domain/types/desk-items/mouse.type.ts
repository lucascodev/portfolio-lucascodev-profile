import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';

export interface MouseSpec {
  readonly label: string;
  readonly position: DeskPosition;
  readonly color: string;
  readonly lightColor?: string;
}
