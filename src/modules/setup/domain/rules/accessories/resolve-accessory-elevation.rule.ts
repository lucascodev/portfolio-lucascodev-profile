import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';

export function resolveAccessoryElevation(accessory: AccessorySpec): number {
  if (accessory.kind === 'microphone' && accessory.mount?.kind === 'boom-arm') return accessory.mount.heightMeters;
  return 0;
}
