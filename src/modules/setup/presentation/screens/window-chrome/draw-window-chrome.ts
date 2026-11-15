import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';

const TRAFFIC_LIGHT_COLORS = ['#f38ba8', '#f9e2af', '#a6e3a1'] as const;

export function drawWindowChrome(context: CanvasRenderingContext2D, size: Dimensions, title: string, fontSize: number): number {
  const barHeight = Math.round(fontSize * 2);
  const dotRadius = fontSize * 0.32;

  context.fillStyle = SCREEN_THEME.background;
  context.fillRect(0, 0, size.width, size.height);
  context.fillStyle = SCREEN_THEME.surface;
  context.fillRect(0, 0, size.width, barHeight);

  TRAFFIC_LIGHT_COLORS.forEach((color, index) => {
    context.beginPath();
    context.fillStyle = color;
    context.arc(fontSize * (1 + index * 1.1), barHeight / 2, dotRadius, 0, Math.PI * 2);
    context.fill();
  });

  context.font = `${Math.round(fontSize * 0.85)}px ${SCREEN_THEME.fontFamily}`;
  context.fillStyle = SCREEN_THEME.mutedText;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(title, size.width / 2, barHeight / 2);
  context.textAlign = 'left';

  return barHeight;
}
