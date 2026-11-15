import { describe, expect, it } from 'vitest';
import { METERS_PER_KEY_UNIT } from '@/modules/setup/domain/constants/physical-units.constant';
import { buildKeyboardGeometry } from './build-keyboard-geometry.rule';

describe('buildKeyboardGeometry', () => {
  it('builds the 61 keys of a 60% keyboard, 15 units wide and 5 rows deep', () => {
    const geometry = buildKeyboardGeometry('60');

    expect(geometry.keys).toHaveLength(61);
    expect(geometry.width).toBeCloseTo(15 * METERS_PER_KEY_UNIT);
    expect(geometry.depth).toBeCloseTo(5 * METERS_PER_KEY_UNIT);
  });

  it('skips gaps so a TKL has 87 keys', () => {
    expect(buildKeyboardGeometry('tkl').keys).toHaveLength(87);
  });

  it('builds a 65% keyboard with 68 keys and an accent spacebar', () => {
    const geometry = buildKeyboardGeometry('65');
    const accentWidths = geometry.keys.filter((key) => key.tone === 'accent').map((key) => key.width / METERS_PER_KEY_UNIT);

    expect(geometry.keys).toHaveLength(68);
    expect(geometry.width).toBeCloseTo(16 * METERS_PER_KEY_UNIT);
    expect(accentWidths).toContain(6.25);
  });

  it('keeps every key inside the keyboard bounds', () => {
    const geometry = buildKeyboardGeometry('75');

    geometry.keys.forEach((key) => {
      expect(Math.abs(key.x) + key.width / 2).toBeLessThanOrEqual(geometry.width / 2 + 1e-9);
      expect(Math.abs(key.z)).toBeLessThan(geometry.depth / 2);
    });
  });

  it('builds a 75% keyboard with 80 keys and a knob closing the function row', () => {
    const geometry = buildKeyboardGeometry('75');
    const [knob] = geometry.knobs;
    const unlabelledWidths = geometry.keys.filter((key) => key.legend === undefined).map((key) => key.width / METERS_PER_KEY_UNIT);

    expect(geometry.keys).toHaveLength(80);
    expect(geometry.width).toBeCloseTo(16 * METERS_PER_KEY_UNIT);
    expect(geometry.knobs).toHaveLength(1);
    expect(knob.x).toBeCloseTo(7.5 * METERS_PER_KEY_UNIT);
    expect(knob.z).toBeCloseTo(-2.5 * METERS_PER_KEY_UNIT);
    expect(unlabelledWidths).toEqual([6.25]);
  });

  it('tells the modifier keys of a 75% keyboard apart from the letters', () => {
    const modifierLegends = buildKeyboardGeometry('75')
      .keys.filter((key) => key.tone === 'modifier')
      .map((key) => key.legend);

    expect(modifierLegends).toContain('Backspace');
    expect(modifierLegends).not.toContain('Q');
  });

  it('has no knob on layouts without one', () => {
    expect(buildKeyboardGeometry('65').knobs).toHaveLength(0);
  });

  it('marks Esc and Enter as accent keys', () => {
    const accentKeys = buildKeyboardGeometry('60').keys.filter((key) => key.tone === 'accent');

    expect(accentKeys).toHaveLength(2);
  });
});
