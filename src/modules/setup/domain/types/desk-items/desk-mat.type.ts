import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { DeskMatPattern } from './desk-mat-pattern.type';

export interface DeskMatSpec {
  readonly label: string;
  readonly position: DeskPosition;
  readonly widthMeters: number;
  readonly depthMeters: number;
  readonly color: string;
  readonly pattern?: DeskMatPattern;
}
