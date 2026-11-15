import { resolveAccessoryElevation } from '@/modules/setup/domain/rules/accessories/resolve-accessory-elevation.rule';
import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import { ACCESSORY_COLLISION_HALF_SIZES } from '@/modules/setup/presentation/constants/accessory-collision-sizes.constant';
import type { ScreenFrame } from '@/modules/setup/presentation/types/screen-frame.type';
import { transformToPlacement } from './transform-to-placement';

/** True when the accessory stands between a viewer facing the screen and the lower part of the screen. */
export function isBlockingScreenView(accessory: AccessorySpec, screen: ScreenFrame, deskHeight: number): boolean {
  const halfSize = ACCESSORY_COLLISION_HALF_SIZES[accessory.kind];
  const local = transformToPlacement(
    { x: screen.center.x, z: screen.center.z, rotationY: screen.rotationY },
    { x: accessory.position.x, y: 0, z: accessory.position.z },
  );
  const topHeight = resolveAccessoryElevation(accessory) + halfSize.y * 2;
  const screenBottomHeight = screen.center.y - deskHeight - screen.height / 2;

  const isInFront = local.z > 0;
  const overlapsHorizontally = Math.abs(local.x) < screen.width / 2 + halfSize.x;
  const reachesScreen = topHeight > screenBottomHeight;
  return isInFront && overlapsHorizontally && reachesScreen;
}
