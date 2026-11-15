import { describe, expect, it } from 'vitest';
import { getScreenDimOpacity } from './get-screen-dim-opacity.rule';

describe('getScreenDimOpacity', () => {
  it('does not dim at full brightness', () => {
    expect(getScreenDimOpacity(100)).toBe(0);
  });

  it('dims proportionally as brightness goes down', () => {
    expect(getScreenDimOpacity(50)).toBeCloseTo(0.35);
  });

  it('never covers the screen completely, even at zero brightness', () => {
    expect(getScreenDimOpacity(0)).toBe(0.7);
  });
});
