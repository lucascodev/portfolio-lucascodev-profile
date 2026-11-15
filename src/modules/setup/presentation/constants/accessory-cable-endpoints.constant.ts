import type { CableEndpoint } from '@/modules/setup/domain/types/cables/cable-endpoint.type';
import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';

export const ACCESSORY_CABLE_ENDPOINTS: Partial<Record<AccessorySpec['kind'], readonly CableEndpoint[]>> = {
  microphone: ['microphone'],
  'drawing-tablet': ['drawing-tablet'],
  'phone-stand': ['phone'],
  'power-strip': ['power-strip'],
};
