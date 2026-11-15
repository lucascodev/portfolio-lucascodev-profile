import { describe, expect, it } from 'vitest';
import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import { isBlockingScreenView } from './is-blocking-screen-view';

const DESK_HEIGHT = 0.75;
const screen = { center: { x: 0, y: DESK_HEIGHT + 0.34, z: 0 }, width: 0.8, height: 0.34, rotationY: 0 };

const boomMicrophone: AccessorySpec = {
  kind: 'microphone',
  label: 'Mic',
  position: { x: 0.12, z: 0.08 },
  color: '#000',
  ringColor: '#fff',
  mount: { kind: 'boom-arm', clamp: { x: 0.74, z: 0.42 }, heightMeters: 0.12 },
};

describe('isBlockingScreenView', () => {
  it('flags a tall item right in front of the screen', () => {
    expect(isBlockingScreenView(boomMicrophone, screen, DESK_HEIGHT)).toBe(true);
  });

  it('ignores items beside the screen, behind it or too low to reach it', () => {
    expect(isBlockingScreenView({ ...boomMicrophone, position: { x: 0.7, z: 0.08 } }, screen, DESK_HEIGHT)).toBe(false);
    expect(isBlockingScreenView({ ...boomMicrophone, position: { x: 0.1, z: -0.2 } }, screen, DESK_HEIGHT)).toBe(false);
    expect(
      isBlockingScreenView(
        { kind: 'drawing-tablet', label: 'Tablet', position: { x: 0, z: 0.2 }, color: '#000', penColor: '#000' },
        screen,
        DESK_HEIGHT,
      ),
    ).toBe(false);
  });
});
