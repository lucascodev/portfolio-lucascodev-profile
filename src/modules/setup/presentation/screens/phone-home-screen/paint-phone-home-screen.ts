import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';

type PhoneHomeScreen = Extract<ScreenContent, { kind: 'phone-home-screen' }>;

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric' });
const GRID_COLUMNS = 4;
const GRID_ROWS = 4;
const DOCK_APPS = 4;
const APP_COLORS = [
  '#22c55e', '#3b82f6', '#f97316', '#ec4899', '#a855f7', '#eab308', '#14b8a6', '#ef4444',
  '#6366f1', '#0ea5e9', '#84cc16', '#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981',
] as const;
const DOCK_COLORS = ['#22c55e', '#3b82f6', '#f8fafc', '#f97316'] as const;

function paintAppIcon(context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  context.fillStyle = color;
  context.beginPath();
  context.roundRect(x, y, size, size, size * 0.24);
  context.fill();
  context.fillStyle = 'rgba(255, 255, 255, 0.85)';
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size * 0.18, 0, Math.PI * 2);
  context.fill();
}

export function paintPhoneHomeScreen(context: CanvasRenderingContext2D, size: Dimensions, screen: PhoneHomeScreen): void {
  const now = new Date();
  const unit = size.width / 100;
  const [from, to] = screen.wallpaperColors;
  const wallpaper = context.createLinearGradient(0, 0, size.width, size.height);
  wallpaper.addColorStop(0, from);
  wallpaper.addColorStop(1, to);
  context.fillStyle = wallpaper;
  context.fillRect(0, 0, size.width, size.height);

  context.fillStyle = '#ffffff';
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  context.font = `600 ${Math.round(unit * 5)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(TIME_FORMATTER.format(now), unit * 7, unit * 6);

  const widgetTop = unit * 14;
  const widgetHeight = unit * 30;
  context.fillStyle = 'rgba(255, 255, 255, 0.16)';
  context.beginPath();
  context.roundRect(unit * 6, widgetTop, size.width - unit * 12, widgetHeight, unit * 6);
  context.fill();
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.font = `700 ${Math.round(unit * 15)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(TIME_FORMATTER.format(now), size.width / 2, widgetTop + widgetHeight * 0.42);
  context.font = `${Math.round(unit * 4.5)}px ${SCREEN_THEME.fontFamily}`;
  context.fillText(WEEKDAY_FORMATTER.format(now), size.width / 2, widgetTop + widgetHeight * 0.78);

  const iconSize = unit * 16;
  const gap = (size.width - iconSize * GRID_COLUMNS) / (GRID_COLUMNS + 1);
  const gridTop = widgetTop + widgetHeight + unit * 8;
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let column = 0; column < GRID_COLUMNS; column++) {
      const color = APP_COLORS[(row * GRID_COLUMNS + column) % APP_COLORS.length];
      paintAppIcon(context, gap + column * (iconSize + gap), gridTop + row * (iconSize + gap * 1.6), iconSize, color);
    }
  }

  const dockHeight = iconSize + unit * 8;
  const dockTop = size.height - dockHeight - unit * 5;
  context.fillStyle = 'rgba(255, 255, 255, 0.2)';
  context.beginPath();
  context.roundRect(unit * 4, dockTop, size.width - unit * 8, dockHeight, unit * 7);
  context.fill();
  for (let index = 0; index < DOCK_APPS; index++) {
    paintAppIcon(context, gap + index * (iconSize + gap), dockTop + unit * 4, iconSize, DOCK_COLORS[index]);
  }
  context.textAlign = 'left';
}
