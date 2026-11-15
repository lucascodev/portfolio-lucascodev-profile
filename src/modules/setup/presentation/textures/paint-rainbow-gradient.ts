import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

// The first colour is repeated at the end, so the gradient tiles vertically without a seam.
const RAINBOW_STOPS = ['#ff3fd0', '#8b5cf6', '#22d3ee', '#4ade80', '#fbbf24', '#fb7185', '#ff3fd0'];

export function paintRainbowGradient(context: CanvasRenderingContext2D, size: Dimensions): void {
  const gradient = context.createLinearGradient(0, 0, 0, size.height);
  RAINBOW_STOPS.forEach((color, index) => gradient.addColorStop(index / (RAINBOW_STOPS.length - 1), color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, size.width, size.height);
}
