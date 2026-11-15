import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import type { CameraPose } from './camera-pose.type';

const easeInOutCubic = (progress: number): number => (progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2);

const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount;

function lerpPosition(from: ScenePosition, to: ScenePosition, amount: number): ScenePosition {
  return { x: lerp(from.x, to.x, amount), y: lerp(from.y, to.y, amount), z: lerp(from.z, to.z, amount) };
}

function quadraticBezier(from: ScenePosition, control: ScenePosition, to: ScenePosition, amount: number): ScenePosition {
  return lerpPosition(lerpPosition(from, control, amount), lerpPosition(control, to, amount), amount);
}

export function interpolateCameraFlight(from: CameraPose, to: CameraPose, progress: number, arcLiftMeters: number): CameraPose {
  const eased = easeInOutCubic(Math.min(1, Math.max(0, progress)));
  const midpoint = lerpPosition(from.position, to.position, 0.5);
  const control = { ...midpoint, y: Math.max(from.position.y, to.position.y) + arcLiftMeters };

  return {
    position: quadraticBezier(from.position, control, to.position, eased),
    target: lerpPosition(from.target, to.target, eased),
    viewShift: lerp(from.viewShift, to.viewShift, eased),
  };
}
