import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';

type MacLockScreen = Extract<ScreenContent, { kind: 'mac-lock-screen' }>;

const FONT_FAMILY = '"SF Pro Display", "Space Grotesk", system-ui, sans-serif';
const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const PASSWORD_HINT = 'Digite a senha';
const WAVE_COUNT = 3;
const WAVE_DRIFT_PER_SECOND = 0.05;

function paintWallpaper(context: CanvasRenderingContext2D, size: Dimensions, colors: MacLockScreen['wallpaperColors'], elapsedSeconds: number): void {
  const [top, middle, bottom] = colors;
  const background = context.createLinearGradient(0, 0, size.width * 0.3, size.height);
  background.addColorStop(0, top);
  background.addColorStop(0.55, middle);
  background.addColorStop(1, bottom);
  context.fillStyle = background;
  context.fillRect(0, 0, size.width, size.height);

  for (let wave = 0; wave < WAVE_COUNT; wave++) {
    const baseY = size.height * (0.45 + wave * 0.17);
    const phase = elapsedSeconds * WAVE_DRIFT_PER_SECOND + wave * 1.7;
    context.beginPath();
    context.moveTo(0, size.height);
    for (let x = 0; x <= size.width; x += size.width / 24) {
      const y = baseY + Math.sin(x / size.width * Math.PI * 2 + phase) * size.height * 0.06;
      context.lineTo(x, y);
    }
    context.lineTo(size.width, size.height);
    context.closePath();
    context.fillStyle = `rgba(255, 255, 255, ${0.06 + wave * 0.03})`;
    context.fill();
  }
}

export function paintMacLockScreen(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  elapsedSeconds: number,
  screen: MacLockScreen,
): void {
  const now = new Date();
  const unit = size.height / 100;
  const centerX = size.width / 2;
  paintWallpaper(context, size, screen.wallpaperColors, elapsedSeconds);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(255, 255, 255, 0.85)';
  context.font = `600 ${Math.round(unit * 5)}px ${FONT_FAMILY}`;
  context.fillText(DATE_FORMATTER.format(now), centerX, unit * 13);
  context.fillStyle = 'rgba(255, 255, 255, 0.95)';
  context.font = `700 ${Math.round(unit * 24)}px ${FONT_FAMILY}`;
  context.fillText(TIME_FORMATTER.format(now), centerX, unit * 31);

  const avatarY = unit * 70;
  const avatarRadius = unit * 6.5;
  context.fillStyle = 'rgba(255, 255, 255, 0.3)';
  context.beginPath();
  context.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#ffffff';
  context.font = `600 ${Math.round(unit * 6)}px ${FONT_FAMILY}`;
  context.fillText(screen.userName.charAt(0).toUpperCase(), centerX, avatarY);

  context.font = `600 ${Math.round(unit * 4)}px ${FONT_FAMILY}`;
  context.fillText(screen.userName, centerX, unit * 81);
  context.fillStyle = 'rgba(255, 255, 255, 0.7)';
  context.font = `${Math.round(unit * 3.2)}px ${FONT_FAMILY}`;
  context.fillText(PASSWORD_HINT, centerX, unit * 88);
  context.textAlign = 'left';
}
