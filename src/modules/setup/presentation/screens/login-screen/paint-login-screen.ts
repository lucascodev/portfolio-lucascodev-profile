import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';

type LoginScreen = Extract<ScreenContent, { kind: 'login-screen' }>;

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const BASE_COLOR = '#0f0d1a';
const ACCENT = '#cba6f7';
const PULSES_PER_SECOND = 0.6;
const CARET_BLINKS_PER_SECOND = 1.6;

const WALLPAPER_GLOWS = [
  { x: 0.18, y: 0.22, radius: 0.42, color: 'rgba(168, 85, 247, 0.55)' },
  { x: 0.82, y: 0.78, radius: 0.45, color: 'rgba(14, 165, 233, 0.45)' },
  { x: 0.7, y: 0.18, radius: 0.35, color: 'rgba(236, 72, 153, 0.3)' },
] as const;

function paintWallpaper(context: CanvasRenderingContext2D, size: Dimensions): void {
  context.fillStyle = BASE_COLOR;
  context.fillRect(0, 0, size.width, size.height);
  const reach = Math.max(size.width, size.height);

  for (const glow of WALLPAPER_GLOWS) {
    const gradient = context.createRadialGradient(
      glow.x * size.width,
      glow.y * size.height,
      0,
      glow.x * size.width,
      glow.y * size.height,
      glow.radius * reach,
    );
    gradient.addColorStop(0, glow.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size.width, size.height);
  }
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function paintLoginScreen(context: CanvasRenderingContext2D, size: Dimensions, elapsedSeconds: number, screen: LoginScreen): void {
  const now = new Date();
  const unit = size.height / 100;
  const centerX = size.width / 2;
  paintWallpaper(context, size);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';
  context.font = `300 ${Math.round(unit * 17)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(TIME_FORMATTER.format(now), centerX, unit * 20);
  context.fillStyle = 'rgba(255, 255, 255, 0.75)';
  context.font = `${Math.round(unit * 4.2)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(DATE_FORMATTER.format(now), centerX, unit * 32);

  const avatarY = unit * 52;
  const avatarRadius = unit * 9;
  const pulse = (elapsedSeconds * PULSES_PER_SECOND) % 1;
  context.strokeStyle = `rgba(203, 166, 247, ${0.7 * (1 - pulse)})`;
  context.lineWidth = unit * 0.8;
  context.beginPath();
  context.arc(centerX, avatarY, avatarRadius * (1 + pulse * 0.45), 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = 'rgba(255, 255, 255, 0.14)';
  context.beginPath();
  context.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#ffffff';
  context.font = `600 ${Math.round(unit * 7)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(initialsOf(screen.userName), centerX, avatarY);

  context.font = `600 ${Math.round(unit * 4.6)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(screen.userName, centerX, unit * 67);

  const fieldWidth = unit * 46;
  const fieldHeight = unit * 8;
  const fieldTop = unit * 73;
  context.fillStyle = 'rgba(255, 255, 255, 0.12)';
  context.beginPath();
  context.roundRect(centerX - fieldWidth / 2, fieldTop, fieldWidth, fieldHeight, fieldHeight / 2);
  context.fill();
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
  context.font = `${Math.round(unit * 3.4)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(screen.hint, centerX - unit * 2, fieldTop + fieldHeight / 2);

  const isCaretOn = Math.floor(elapsedSeconds * CARET_BLINKS_PER_SECOND) % 2 === 0;
  if (isCaretOn) {
    context.fillStyle = ACCENT;
    context.fillRect(centerX - fieldWidth / 2 + unit * 3, fieldTop + unit * 2, unit * 0.5, fieldHeight - unit * 4);
  }
  context.fillStyle = ACCENT;
  context.beginPath();
  context.arc(centerX + fieldWidth / 2 - fieldHeight / 2, fieldTop + fieldHeight / 2, fieldHeight / 2 - unit, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = BASE_COLOR;
  context.font = `700 ${Math.round(unit * 4)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText('→', centerX + fieldWidth / 2 - fieldHeight / 2, fieldTop + fieldHeight / 2);
  context.textAlign = 'left';
}
