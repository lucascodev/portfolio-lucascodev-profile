import { KEYBOARD_LAYOUTS } from '@/modules/setup/domain/constants/keyboard-layouts.constant';
import { METERS_PER_KEY_UNIT } from '@/modules/setup/domain/constants/physical-units.constant';
import type { KeyboardGeometry } from '@/modules/setup/domain/types/keyboard/keyboard-geometry.type';
import type { KeyboardKey } from '@/modules/setup/domain/types/keyboard/keyboard-key.type';
import type { KeyboardKnob } from '@/modules/setup/domain/types/keyboard/keyboard-knob.type';
import type { KeyboardLayout } from '@/modules/setup/domain/types/keyboard/keyboard-layout.type';

export function buildKeyboardGeometry(layout: KeyboardLayout): KeyboardGeometry {
  const rows = KEYBOARD_LAYOUTS[layout];
  const widthUnits = Math.max(...rows.map((row) => row.reduce((sum, slot) => sum + slot.widthUnits, 0)));
  const depthUnits = rows.length;
  const keys: KeyboardKey[] = [];
  const knobs: KeyboardKnob[] = [];

  rows.forEach((row, rowIndex) => {
    let cursorUnits = 0;
    row.forEach((slot, slotIndex) => {
      const centerUnits = cursorUnits + slot.widthUnits / 2;
      cursorUnits += slot.widthUnits;
      if (slot.kind === 'gap') return;

      const id = `${rowIndex}-${slotIndex}`;
      const x = (centerUnits - widthUnits / 2) * METERS_PER_KEY_UNIT;
      const z = (rowIndex + 0.5 - depthUnits / 2) * METERS_PER_KEY_UNIT;
      if (slot.kind === 'knob') {
        knobs.push({ id, x, z });
        return;
      }

      keys.push({ id, x, z, width: slot.widthUnits * METERS_PER_KEY_UNIT, tone: slot.tone, legend: slot.legend });
    });
  });

  return { keys, knobs, width: widthUnits * METERS_PER_KEY_UNIT, depth: depthUnits * METERS_PER_KEY_UNIT };
}
