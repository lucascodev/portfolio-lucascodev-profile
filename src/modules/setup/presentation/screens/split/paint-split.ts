import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScreenPainter } from '@/modules/setup/presentation/screens/screen-painter.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';

const DIVIDER_WIDTH_PX = 3;

function paintPane(
  context: CanvasRenderingContext2D,
  painter: ScreenPainter,
  offsetX: number,
  size: Dimensions,
  elapsedSeconds: number,
): void {
  context.save();
  context.translate(offsetX, 0);
  context.beginPath();
  context.rect(0, 0, size.width, size.height);
  context.clip();
  painter(context, size, elapsedSeconds);
  context.restore();
}

export function paintSplit(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  elapsedSeconds: number,
  painters: readonly [ScreenPainter, ScreenPainter],
  leftPaneFraction: number,
): void {
  const leftWidth = Math.round(size.width * leftPaneFraction);
  const rightWidth = size.width - leftWidth - DIVIDER_WIDTH_PX;

  paintPane(context, painters[0], 0, { width: leftWidth, height: size.height }, elapsedSeconds);
  context.fillStyle = SCREEN_THEME.surface;
  context.fillRect(leftWidth, 0, DIVIDER_WIDTH_PX, size.height);
  paintPane(context, painters[1], leftWidth + DIVIDER_WIDTH_PX, { width: rightWidth, height: size.height }, elapsedSeconds);
}
