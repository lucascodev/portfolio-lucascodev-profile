import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const NOTIFICATION_TEXT = '✓ Deploy concluído';

export function paintLockScreen(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  wallpaperColors: readonly [string, string],
): void {
  const now = new Date();
  const gradient = context.createLinearGradient(0, 0, size.width, size.height);
  gradient.addColorStop(0, wallpaperColors[0]);
  gradient.addColorStop(1, wallpaperColors[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size.width, size.height);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';
  context.font = `600 ${Math.round(size.width * 0.26)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(TIME_FORMATTER.format(now), size.width / 2, size.height * 0.22);
  context.font = `${Math.round(size.width * 0.065)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(DATE_FORMATTER.format(now), size.width / 2, size.height * 0.31);

  const cardTop = size.height * 0.62;
  const cardPadding = size.width * 0.07;
  context.fillStyle = 'rgba(255, 255, 255, 0.18)';
  context.beginPath();
  context.roundRect(cardPadding, cardTop, size.width - cardPadding * 2, size.height * 0.08, size.width * 0.05);
  context.fill();
  context.fillStyle = '#ffffff';
  context.font = `${Math.round(size.width * 0.062)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(NOTIFICATION_TEXT, size.width / 2, cardTop + size.height * 0.04);
  context.textAlign = 'left';
}
