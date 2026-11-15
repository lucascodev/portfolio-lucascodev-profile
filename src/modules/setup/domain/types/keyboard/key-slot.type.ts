import type { KeycapTone } from './keycap-tone.type';

export type KeySlot =
  | { readonly kind: 'key'; readonly widthUnits: number; readonly tone: KeycapTone; readonly legend?: string }
  | { readonly kind: 'gap'; readonly widthUnits: number }
  | { readonly kind: 'knob'; readonly widthUnits: number };
