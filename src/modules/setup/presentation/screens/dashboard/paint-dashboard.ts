import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';
import { calculateScreenFontSize } from '@/modules/setup/presentation/screens/typography/calculate-screen-font-size';
import { drawWindowChrome } from '@/modules/setup/presentation/screens/window-chrome/draw-window-chrome';

const CONTRIBUTION_ROWS = 7;
const CONTRIBUTION_LEVEL_COLORS = ['#313244', '#2b4a3a', '#3f7a52', '#5fb36d', '#a6e3a1'] as const;
const PIPELINE_STAGES = ['lint', 'test', 'build', 'deploy'] as const;
const SECONDS_PER_STAGE = 1.6;
const PIPELINE_HOLD_SECONDS = 2.5;
const SWEEP_COLUMNS_PER_SECOND = 9;

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function drawContributionGraph(
  context: CanvasRenderingContext2D,
  origin: { x: number; y: number },
  availableWidth: number,
  elapsedSeconds: number,
): number {
  const cellGap = 3;
  const columns = Math.max(8, Math.floor(availableWidth / 16));
  const cellSize = (availableWidth - cellGap * (columns - 1)) / columns;
  const sweepColumn = (elapsedSeconds * SWEEP_COLUMNS_PER_SECOND) % (columns + 12);

  for (let column = 0; column < columns; column++) {
    const isSwept = Math.abs(column - sweepColumn) < 1.5;
    for (let row = 0; row < CONTRIBUTION_ROWS; row++) {
      const baseLevel = Math.floor(pseudoRandom(column * CONTRIBUTION_ROWS + row) * CONTRIBUTION_LEVEL_COLORS.length);
      const level = isSwept ? CONTRIBUTION_LEVEL_COLORS.length - 1 : baseLevel;
      context.fillStyle = CONTRIBUTION_LEVEL_COLORS[level];
      context.fillRect(origin.x + column * (cellSize + cellGap), origin.y + row * (cellSize + cellGap), cellSize, cellSize);
    }
  }
  return CONTRIBUTION_ROWS * (cellSize + cellGap);
}

function drawPipeline(
  context: CanvasRenderingContext2D,
  origin: { x: number; y: number },
  availableWidth: number,
  fontSize: number,
  elapsedSeconds: number,
): void {
  const cycleSeconds = PIPELINE_STAGES.length * SECONDS_PER_STAGE + PIPELINE_HOLD_SECONDS;
  const progress = (elapsedSeconds % cycleSeconds) / SECONDS_PER_STAGE;
  const rowHeight = fontSize * 2.2;
  const labelWidth = fontSize * 5;
  const barWidth = availableWidth - labelWidth - fontSize * 2;

  PIPELINE_STAGES.forEach((stage, index) => {
    const stageProgress = Math.min(1, Math.max(0, progress - index));
    const y = origin.y + index * rowHeight;
    const isDone = stageProgress >= 1;

    context.fillStyle = SCREEN_THEME.text;
    context.fillText(stage, origin.x, y);
    context.fillStyle = SCREEN_THEME.surfaceRaised;
    context.fillRect(origin.x + labelWidth, y - fontSize * 0.3, barWidth, fontSize * 0.6);
    context.fillStyle = isDone ? SCREEN_THEME.success : SCREEN_THEME.accent;
    context.fillRect(origin.x + labelWidth, y - fontSize * 0.3, barWidth * stageProgress, fontSize * 0.6);
    context.fillStyle = isDone ? SCREEN_THEME.success : SCREEN_THEME.mutedText;
    context.fillText(isDone ? '✓' : '…', origin.x + labelWidth + barWidth + fontSize * 0.6, y);
  });
}

export function paintDashboard(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  elapsedSeconds: number,
  title: string,
): void {
  const fontSize = calculateScreenFontSize(size);
  const top = drawWindowChrome(context, size, title, fontSize);
  const padding = fontSize * 1.4;
  const contentWidth = size.width - padding * 2;

  context.textBaseline = 'middle';
  context.font = `bold ${Math.round(fontSize * 1.1)}px ${SCREEN_THEME.fontFamily}`;
  context.fillStyle = SCREEN_THEME.text;
  context.fillText('contributions', padding, top + padding);

  const graphTop = top + padding * 2;
  const graphHeight = drawContributionGraph(context, { x: padding, y: graphTop }, contentWidth, elapsedSeconds);

  const pipelineTitleY = graphTop + graphHeight + padding * 1.2;
  context.font = `bold ${Math.round(fontSize * 1.1)}px ${SCREEN_THEME.fontFamily}`;
  context.fillStyle = SCREEN_THEME.text;
  context.fillText('ci / main', padding, pipelineTitleY);

  context.font = `${fontSize}px ${SCREEN_THEME.fontFamily}`;
  drawPipeline(context, { x: padding, y: pipelineTitleY + padding * 1.4 }, contentWidth, fontSize, elapsedSeconds);
}
