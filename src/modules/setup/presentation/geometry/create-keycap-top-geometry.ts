import { PlaneGeometry } from 'three';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { KeyboardGeometry } from '@/modules/setup/domain/types/keyboard/keyboard-geometry.type';
import type { KeyboardKey } from '@/modules/setup/domain/types/keyboard/keyboard-key.type';

/** A flat keycap top whose UVs cut this key's own area out of an atlas laid out like the whole keyboard. */
export function createKeycapTopGeometry(key: KeyboardKey, keyboard: KeyboardGeometry, top: Dimensions): PlaneGeometry {
  const plane = new PlaneGeometry(top.width, top.height).rotateX(-Math.PI / 2);
  const left = (key.x - top.width / 2 + keyboard.width / 2) / keyboard.width;
  const right = (key.x + top.width / 2 + keyboard.width / 2) / keyboard.width;
  const far = 1 - (key.z - top.height / 2 + keyboard.depth / 2) / keyboard.depth;
  const near = 1 - (key.z + top.height / 2 + keyboard.depth / 2) / keyboard.depth;

  const uv = plane.getAttribute('uv');
  uv.setXY(0, left, far);
  uv.setXY(1, right, far);
  uv.setXY(2, left, near);
  uv.setXY(3, right, near);
  uv.needsUpdate = true;
  return plane;
}
