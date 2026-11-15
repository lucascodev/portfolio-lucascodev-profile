import type { PhoneModel } from '@/modules/setup/domain/types/desk-items/phone-model.type';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import { HOME_BUTTON_PHONE_SIZE, PHONE_SIZE } from './accessory-dimensions.constant';

interface PhoneLayout {
  readonly body: { readonly width: number; readonly height: number; readonly depth: number };
  readonly screen: Dimensions;
  readonly hasHomeButton: boolean;
}

const EDGE_TO_EDGE_INSET = 0.003;

export const PHONE_LAYOUTS: Readonly<Record<PhoneModel, PhoneLayout>> = {
  'full-screen': {
    body: PHONE_SIZE,
    screen: { width: PHONE_SIZE.width - EDGE_TO_EDGE_INSET * 2, height: PHONE_SIZE.height - EDGE_TO_EDGE_INSET * 2 },
    hasHomeButton: false,
  },
  // A 4.7-inch 16:9 panel between the thick top and bottom bezels of the home-button generation.
  'home-button': { body: HOME_BUTTON_PHONE_SIZE, screen: { width: 0.0585, height: 0.104 }, hasHomeButton: true },
};
