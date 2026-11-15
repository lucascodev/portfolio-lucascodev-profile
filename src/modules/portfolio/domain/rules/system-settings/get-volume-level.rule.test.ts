import { describe, expect, it } from 'vitest';
import { getVolumeLevel } from './get-volume-level.rule';

describe('getVolumeLevel', () => {
  it('is muted at zero', () => {
    expect(getVolumeLevel(0)).toBe('muted');
  });

  it('splits the rest of the range in thirds', () => {
    expect(getVolumeLevel(1)).toBe('low');
    expect(getVolumeLevel(33)).toBe('low');
    expect(getVolumeLevel(34)).toBe('medium');
    expect(getVolumeLevel(66)).toBe('medium');
    expect(getVolumeLevel(67)).toBe('high');
    expect(getVolumeLevel(100)).toBe('high');
  });
});
