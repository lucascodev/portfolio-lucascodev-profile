import { describe, expect, it } from 'vitest';
import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import type { DeskSpec } from '@/modules/setup/domain/types/desk-items/desk.type';
import { resolvePcTowerPosition } from './resolve-pc-tower-position.rule';

const desk: DeskSpec = {
  label: 'Desk',
  widthMeters: 1.6,
  depthMeters: 0.85,
  heightMeters: 0.75,
  topColor: '#000',
  legColor: '#000',
};

describe('resolvePcTowerPosition', () => {
  it('puts a desk-back case against the back edge, on top of the desk', () => {
    const position = resolvePcTowerPosition('desk-back-right', desk);

    expect(position.y).toBe(desk.heightMeters);
    expect(position.x).toBeGreaterThan(0);
    expect(position.z - PC_CASE_DIMENSIONS.depth / 2).toBeGreaterThan(-desk.depthMeters / 2);
  });

  it('keeps a desk-side case fully on the desk', () => {
    const position = resolvePcTowerPosition('desk-left', desk);

    expect(position.x - PC_CASE_DIMENSIONS.width / 2).toBeGreaterThan(-desk.widthMeters / 2);
  });

  it('uses an explicit desk position when one is given', () => {
    expect(resolvePcTowerPosition('desk-back-right', desk, { x: 0.3, z: -0.2 })).toEqual({
      x: 0.3,
      y: desk.heightMeters,
      z: -0.2,
    });
  });

  it('puts a floor case beside the desk, on the floor', () => {
    const position = resolvePcTowerPosition('floor-right', desk);

    expect(position.y).toBe(0);
    expect(position.x).toBeGreaterThan(desk.widthMeters / 2);
  });
});
