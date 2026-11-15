import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { MicrophoneMount } from './microphone-mount.type';
import type { PhoneSpec } from './phone.type';

interface AccessoryBase {
  readonly label: string;
  readonly position: DeskPosition;
  readonly rotationDegrees?: number;
}

export type AccessorySpec =
  | (AccessoryBase & { readonly kind: 'lamp'; readonly lightColor: string })
  | (AccessoryBase & { readonly kind: 'plant' })
  | (AccessoryBase & { readonly kind: 'mug'; readonly color: string })
  | (AccessoryBase & { readonly kind: 'tumbler'; readonly color: string })
  | (AccessoryBase & { readonly kind: 'headphones'; readonly color: string })
  | (AccessoryBase & { readonly kind: 'speaker'; readonly color: string })
  | (AccessoryBase & {
      readonly kind: 'microphone';
      readonly color: string;
      readonly ringColor: string;
      readonly mount?: MicrophoneMount;
    })
  | (AccessoryBase & { readonly kind: 'drawing-tablet'; readonly color: string; readonly penColor: string })
  | (AccessoryBase & { readonly kind: 'phone-stand'; readonly color: string; readonly phone?: PhoneSpec })
  | (AccessoryBase & { readonly kind: 'phone-dock'; readonly color: string; readonly phone: PhoneSpec })
  | (AccessoryBase & { readonly kind: 'photo-frame'; readonly frameColor: string })
  | (AccessoryBase & { readonly kind: 'power-strip'; readonly color: string })
  | (AccessoryBase & { readonly kind: 'gamepad'; readonly color: string })
  | (AccessoryBase & { readonly kind: 'hard-drives'; readonly count: number })
  | (AccessoryBase & { readonly kind: 'toy-car'; readonly color: string })
  | (AccessoryBase & { readonly kind: 'rgb-remote'; readonly color: string });
