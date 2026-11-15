import { describe, expect, it } from 'vitest';
import type { CameraPose } from './camera-pose.type';
import { calculateSeatedOverviewPose } from './calculate-seated-overview-pose';

const FOV = 50;
const DESK_HEIGHT = 0.75;
const DESK_DEPTH = 0.9;

function verticalScreenFraction(pose: CameraPose, point: { y: number; z: number }): number {
  const pitch = Math.atan2(pose.position.y - pose.target.y, pose.position.z - pose.target.z);
  const pointAngle = Math.atan2(pose.position.y - point.y, pose.position.z - point.z);
  const projected = Math.tan(pointAngle - pitch) / Math.tan((FOV * Math.PI) / 360);
  return (1 - projected) / 2;
}

const poseFor = (aspectRatio: number) =>
  calculateSeatedOverviewPose({
    aspectRatio,
    verticalFovDegrees: FOV,
    deskHeight: DESK_HEIGHT,
    deskDepth: DESK_DEPTH,
    parallaxX: 0,
    parallaxY: 0,
  });

const frontEdge = { y: DESK_HEIGHT, z: DESK_DEPTH / 2 };

describe('calculateSeatedOverviewPose', () => {
  it('keeps the desk front edge just above the bottom of wide and square frames', () => {
    [1.78, 1.28, 1].forEach((aspectRatio) => {
      expect(verticalScreenFraction(poseFor(aspectRatio), frontEdge)).toBeGreaterThan(0);
      expect(verticalScreenFraction(poseFor(aspectRatio), frontEdge)).toBeLessThan(0.12);
    });
  });

  it('lifts the desk on portrait screens to leave room for text below', () => {
    expect(verticalScreenFraction(poseFor(0.46), frontEdge)).toBeGreaterThan(0.3);
  });

  it('sits like a person: eyes above the desk, in front of it, looking slightly down', () => {
    const pose = poseFor(1.78);

    expect(pose.position.y - DESK_HEIGHT).toBeCloseTo(0.47);
    expect(pose.position.z).toBeGreaterThan(DESK_DEPTH / 2);
    expect(pose.target.y).toBeLessThan(pose.position.y);
  });

  it('only pushes the setup sideways on wide screens', () => {
    expect(poseFor(1.78).viewShift).toBeGreaterThan(0);
    expect(poseFor(1).viewShift).toBe(0);
  });
});
