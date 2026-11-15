import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { TerminalEntry } from '@/modules/setup/domain/types/monitor/terminal-entry.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';
import { calculateScreenFontSize } from '@/modules/setup/presentation/screens/typography/calculate-screen-font-size';
import { drawWindowChrome } from '@/modules/setup/presentation/screens/window-chrome/draw-window-chrome';
import { buildTerminalLines } from './build-terminal-lines';
import type { TerminalLine } from './terminal-line.type';

const PROMPT = '❯ ';
const LINE_HEIGHT_RATIO = 1.5;
const CURSOR_BLINKS_PER_SECOND = 2;

function pickOutputColor(text: string): string {
  if (/^\s*(✓|✔|\+|ready|done)/i.test(text)) return SCREEN_THEME.success;
  if (/error|fail|✗/i.test(text)) return SCREEN_THEME.danger;
  if (/warn/i.test(text)) return SCREEN_THEME.warning;
  return SCREEN_THEME.mutedText;
}

function drawLine(context: CanvasRenderingContext2D, line: TerminalLine, x: number, y: number): number {
  if (line.kind === 'output') {
    context.fillStyle = pickOutputColor(line.text);
    context.fillText(line.text, x, y);
    return x + context.measureText(line.text).width;
  }

  context.fillStyle = SCREEN_THEME.accent;
  context.fillText(PROMPT, x, y);
  const commandX = x + context.measureText(PROMPT).width;
  context.fillStyle = SCREEN_THEME.text;
  context.fillText(line.text, commandX, y);
  return commandX + context.measureText(line.text).width;
}

export function paintTerminal(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  elapsedSeconds: number,
  entries: readonly TerminalEntry[],
): void {
  const fontSize = calculateScreenFontSize(size);
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const top = drawWindowChrome(context, size, 'zsh — ~/portfolio', fontSize);
  const lines = buildTerminalLines(entries, elapsedSeconds);
  const visibleRows = Math.floor((size.height - top - fontSize) / lineHeight);
  const visibleLines = lines.slice(-visibleRows);

  context.font = `${fontSize}px ${SCREEN_THEME.fontFamily}`;
  context.textBaseline = 'middle';

  let cursorX = fontSize;
  let cursorY = top + fontSize;
  visibleLines.forEach((line, index) => {
    cursorY = top + fontSize + index * lineHeight;
    cursorX = drawLine(context, line, fontSize, cursorY);
  });

  const isCursorOn = Math.floor(elapsedSeconds * CURSOR_BLINKS_PER_SECOND) % 2 === 0;
  if (visibleLines.at(-1)?.kind === 'command' && isCursorOn) {
    context.fillStyle = SCREEN_THEME.text;
    context.fillRect(cursorX + 2, cursorY - fontSize * 0.55, fontSize * 0.55, fontSize * 1.1);
  }
}
