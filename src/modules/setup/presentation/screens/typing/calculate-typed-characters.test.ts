import { describe, expect, it } from 'vitest';
import { calculateTypedCharacters } from './calculate-typed-characters';

const rhythm = { charactersPerSecond: 10, holdSeconds: 2 };

describe('calculateTypedCharacters', () => {
  it('types characters proportionally to the elapsed time', () => {
    expect(calculateTypedCharacters(1.55, 100, rhythm)).toBe(15);
  });

  it('holds the full text after finishing typing', () => {
    expect(calculateTypedCharacters(11, 100, rhythm)).toBe(100);
  });

  it('restarts the loop after the hold', () => {
    expect(calculateTypedCharacters(12.5, 100, rhythm)).toBe(5);
  });

  it('returns zero for empty text', () => {
    expect(calculateTypedCharacters(3, 0, rhythm)).toBe(0);
  });
});
