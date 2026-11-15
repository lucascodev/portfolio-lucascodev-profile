import type { KeycapTone } from './keycap-tone.type';

export interface KeyboardKey {
  readonly id: string;
  readonly x: number;
  readonly z: number;
  readonly width: number;
  readonly tone: KeycapTone;
  readonly legend?: string;
}
