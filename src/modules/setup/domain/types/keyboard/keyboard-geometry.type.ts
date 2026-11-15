import type { KeyboardKey } from './keyboard-key.type';
import type { KeyboardKnob } from './keyboard-knob.type';

export interface KeyboardGeometry {
  readonly keys: readonly KeyboardKey[];
  readonly knobs: readonly KeyboardKnob[];
  readonly width: number;
  readonly depth: number;
}
