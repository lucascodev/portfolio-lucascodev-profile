import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

interface PerforationColors {
  readonly background: string;
  readonly hole: string;
}

const HOLE_SPACING_PX = 12;
const HOLE_RADIUS_PX = 3;

export function paintPerforation(context: CanvasRenderingContext2D, size: Dimensions, colors: PerforationColors): void {
  context.fillStyle = colors.background;
  context.fillRect(0, 0, size.width, size.height);
  context.fillStyle = colors.hole;

  for (let y = HOLE_SPACING_PX / 2; y < size.height; y += HOLE_SPACING_PX) {
    const rowOffset = (Math.round(y / HOLE_SPACING_PX) % 2) * (HOLE_SPACING_PX / 2);
    for (let x = HOLE_SPACING_PX / 2 + rowOffset; x < size.width; x += HOLE_SPACING_PX) {
      context.beginPath();
      context.arc(x, y, HOLE_RADIUS_PX, 0, Math.PI * 2);
      context.fill();
    }
  }
}
