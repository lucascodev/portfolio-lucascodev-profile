import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { PcTowerPlacement } from './pc-tower-placement.type';

export interface PcTowerSpec {
  readonly label: string;
  readonly placement: PcTowerPlacement;
  readonly caseColor: string;
  readonly fanColors: readonly string[];
  readonly position?: DeskPosition;
}
