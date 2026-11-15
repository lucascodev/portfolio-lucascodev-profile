const MAX_DIM_OPACITY = 0.7;
const FULL_BRIGHTNESS = 100;

export function getScreenDimOpacity(brightness: number): number {
  const darkness = (FULL_BRIGHTNESS - brightness) / FULL_BRIGHTNESS;
  return Math.min(MAX_DIM_OPACITY, Math.max(0, darkness * MAX_DIM_OPACITY));
}
