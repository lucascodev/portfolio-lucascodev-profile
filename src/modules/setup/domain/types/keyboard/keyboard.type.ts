import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { KeyboardLayout } from './keyboard-layout.type';

export interface KeyboardSpec {
  readonly label: string;
  readonly layout: KeyboardLayout;
  readonly position: DeskPosition;
  readonly caseColor: string;
  readonly keycapColor: string;
  readonly accentKeycapColor: string;
  readonly modifierKeycapColor?: string;
  readonly legendColor?: string;
  readonly backlightColor?: string;
}
