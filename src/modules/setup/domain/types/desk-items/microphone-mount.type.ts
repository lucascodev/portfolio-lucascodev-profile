import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';

export type MicrophoneMount =
  | { readonly kind: 'desk-stand' }
  | { readonly kind: 'boom-arm'; readonly clamp: DeskPosition; readonly heightMeters: number };
