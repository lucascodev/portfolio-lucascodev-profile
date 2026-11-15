import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

export const ACCESSORY_COLLISION_HALF_SIZES: Readonly<Record<AccessorySpec['kind'], ScenePosition>> = {
  lamp: { x: 0.065, y: 0.21, z: 0.065 },
  plant: { x: 0.07, y: 0.12, z: 0.07 },
  mug: { x: 0.055, y: 0.05, z: 0.042 },
  tumbler: { x: 0.038, y: 0.1, z: 0.038 },
  headphones: { x: 0.06, y: 0.14, z: 0.06 },
  speaker: { x: 0.06, y: 0.1, z: 0.07 },
  microphone: { x: 0.035, y: 0.11, z: 0.035 },
  'drawing-tablet': { x: 0.132, y: 0.01, z: 0.1 },
  'phone-stand': { x: 0.072, y: 0.009, z: 0.072 },
  'photo-frame': { x: 0.066, y: 0.086, z: 0.03 },
  'power-strip': { x: 0.16, y: 0.018, z: 0.028 },
  'phone-dock': { x: 0.043, y: 0.088, z: 0.052 },
  gamepad: { x: 0.08, y: 0.025, z: 0.05 },
  'hard-drives': { x: 0.05, y: 0.015, z: 0.055 },
  'toy-car': { x: 0.018, y: 0.012, z: 0.037 },
  'rgb-remote': { x: 0.021, y: 0.004, z: 0.044 },
};
