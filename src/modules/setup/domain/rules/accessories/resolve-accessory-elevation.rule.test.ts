import { describe, expect, it } from 'vitest';
import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import { resolveAccessoryElevation } from './resolve-accessory-elevation.rule';

const microphone: AccessorySpec = {
  kind: 'microphone',
  label: 'Mic',
  position: { x: 0, z: 0 },
  color: '#000',
  ringColor: '#fff',
};

describe('resolveAccessoryElevation', () => {
  it('lifts a microphone held by a boom arm to the arm height', () => {
    const onBoom: AccessorySpec = {
      ...microphone,
      mount: { kind: 'boom-arm', clamp: { x: 0.7, z: 0.4 }, heightMeters: 0.12 },
    };

    expect(resolveAccessoryElevation(onBoom)).toBe(0.12);
  });

  it('keeps everything else resting on the desk', () => {
    expect(resolveAccessoryElevation(microphone)).toBe(0);
    expect(resolveAccessoryElevation({ kind: 'plant', label: 'Plant', position: { x: 0, z: 0 } })).toBe(0);
  });
});
