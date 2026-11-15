import type { KeySlot } from '@/modules/setup/domain/types/keyboard/key-slot.type';
import type { KeyboardLayout } from '@/modules/setup/domain/types/keyboard/keyboard-layout.type';

type KeyRow = readonly KeySlot[];

const key = (widthUnits = 1, legend?: string): KeySlot => ({ kind: 'key', widthUnits, tone: 'base', legend });
const accentKey = (widthUnits = 1, legend?: string): KeySlot => ({ kind: 'key', widthUnits, tone: 'accent', legend });
const modifierKey = (widthUnits: number, legend: string): KeySlot => ({ kind: 'key', widthUnits, tone: 'modifier', legend });
const gap = (widthUnits: number): KeySlot => ({ kind: 'gap', widthUnits });
const knob = (): KeySlot => ({ kind: 'knob', widthUnits: 1 });
const keys = (count: number, widthUnits = 1): KeySlot[] => Array.from({ length: count }, () => key(widthUnits));
const legendKeys = (...legends: readonly string[]): KeySlot[] => legends.map((legend) => key(1, legend));

const NUMBER_ROW: KeyRow = [accentKey(), ...keys(12), key(2)];
const TOP_ROW: KeyRow = [key(1.5), ...keys(12), key(1.5)];
const HOME_ROW: KeyRow = [key(1.75), ...keys(11), accentKey(2.25)];
const SHIFT_ROW: KeyRow = [key(2.25), ...keys(10), key(2.75)];
const SPACE_ROW: KeyRow = [...keys(3, 1.25), key(6.25), ...keys(4, 1.25)];
const NAV_CLUSTER: KeyRow = [gap(0.25), ...keys(3)];
const FUNCTION_GROUP_GAP = gap(0.5);

export const KEYBOARD_LAYOUTS: Readonly<Record<KeyboardLayout, readonly KeyRow[]>> = {
  '60': [NUMBER_ROW, TOP_ROW, HOME_ROW, SHIFT_ROW, SPACE_ROW],
  '65': [
    [...NUMBER_ROW, key()],
    [...TOP_ROW, key()],
    [...HOME_ROW, key()],
    [key(2.25), ...keys(10), key(1.75), key(), key()],
    [...keys(3, 1.25), accentKey(6.25), ...keys(6)],
  ],
  '75': [
    [
      accentKey(1, 'Esc'),
      FUNCTION_GROUP_GAP,
      ...legendKeys('F1', 'F2', 'F3', 'F4'),
      FUNCTION_GROUP_GAP,
      ...legendKeys('F5', 'F6', 'F7', 'F8'),
      FUNCTION_GROUP_GAP,
      ...legendKeys('F9', 'F10', 'F11', 'F12'),
      FUNCTION_GROUP_GAP,
      knob(),
    ],
    [
      ...legendKeys('~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='),
      modifierKey(2, 'Backspace'),
      modifierKey(1, 'Del'),
    ],
    [
      modifierKey(1.5, 'Tab'),
      ...legendKeys('Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'),
      key(1.5, '\\'),
      modifierKey(1, 'PgUp'),
    ],
    [
      modifierKey(1.75, 'Caps'),
      ...legendKeys('A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '"'),
      accentKey(2.25, 'Enter'),
      modifierKey(1, 'PgDn'),
    ],
    [
      modifierKey(2.25, 'Shift'),
      ...legendKeys('Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'),
      modifierKey(1.75, 'Shift'),
      accentKey(1, '↑'),
      modifierKey(1, 'End'),
    ],
    [
      modifierKey(1.25, 'Ctrl'),
      modifierKey(1.25, 'Win'),
      modifierKey(1.25, 'Alt'),
      accentKey(6.25),
      modifierKey(1, 'Fn'),
      modifierKey(1, 'Ctrl'),
      gap(1),
      accentKey(1, '←'),
      accentKey(1, '↓'),
      accentKey(1, '→'),
    ],
  ],
  tkl: [
    [accentKey(), gap(1), ...keys(4), gap(0.5), ...keys(4), gap(0.5), ...keys(4), ...NAV_CLUSTER],
    [key(), ...keys(12), key(2), ...NAV_CLUSTER],
    [...TOP_ROW, ...NAV_CLUSTER],
    [...HOME_ROW, gap(3.25)],
    [...SHIFT_ROW, gap(1.25), key(), gap(1)],
    [...keys(3, 1.25), key(6.25), ...keys(4, 1.25), ...NAV_CLUSTER],
  ],
};
