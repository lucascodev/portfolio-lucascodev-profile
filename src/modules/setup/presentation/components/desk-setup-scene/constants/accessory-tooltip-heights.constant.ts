import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';

export const ACCESSORY_TOOLTIP_HEIGHTS: Readonly<Record<AccessorySpec['kind'], number>> = {
  lamp: 0.5,
  plant: 0.3,
  mug: 0.16,
  tumbler: 0.24,
  headphones: 0.33,
  speaker: 0.26,
  microphone: 0.26,
  'drawing-tablet': 0.06,
  'phone-stand': 0.4,
  'photo-frame': 0.22,
  'power-strip': 0.08,
  'phone-dock': 0.21,
  gamepad: 0.09,
  'hard-drives': 0.08,
  'toy-car': 0.06,
  'rgb-remote': 0.05,
};
