import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import type { DeskSpec } from '@/modules/setup/domain/types/desk-items/desk.type';
import type { PcTowerPlacement } from '@/modules/setup/domain/types/desk-items/pc-tower-placement.type';
import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

const EDGE_CLEARANCE_METERS = 0.03;
const FLOOR_DISTANCE_FROM_DESK_METERS = 0.2;
const BACK_PLACEMENT_OFFSET_RATIO = 0.2;

function resolveX(placement: PcTowerPlacement, desk: DeskSpec): number {
  const side = placement.endsWith('left') ? -1 : 1;
  if (placement.startsWith('floor')) return side * (desk.widthMeters / 2 + FLOOR_DISTANCE_FROM_DESK_METERS);
  if (placement.startsWith('desk-back')) return side * desk.widthMeters * BACK_PLACEMENT_OFFSET_RATIO;
  return side * (desk.widthMeters / 2 - PC_CASE_DIMENSIONS.width / 2 - EDGE_CLEARANCE_METERS);
}

function resolveZ(placement: PcTowerPlacement, desk: DeskSpec): number {
  if (placement.startsWith('desk-back')) return -desk.depthMeters / 2 + PC_CASE_DIMENSIONS.depth / 2 + EDGE_CLEARANCE_METERS;
  return 0;
}

export function resolvePcTowerPosition(placement: PcTowerPlacement, desk: DeskSpec, position?: DeskPosition): ScenePosition {
  if (position) return { x: position.x, y: desk.heightMeters, z: position.z };

  return {
    x: resolveX(placement, desk),
    y: placement.startsWith('floor') ? 0 : desk.heightMeters,
    z: resolveZ(placement, desk),
  };
}
