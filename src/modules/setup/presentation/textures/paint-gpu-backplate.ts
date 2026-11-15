import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

type RatioPoint = readonly [number, number];

const BRAND_TEXT = 'GEFORCE RTX';
const CAUTION_TEXT = 'CAUTION';
const FONT_FAMILY = '"Space Grotesk", "Arial Black", sans-serif';
const LINE_COLOR = '#e4e4ea';
const STICKER_COLOR = '#eceef2';
const VENT_PANEL_START_RATIO = 0.77;
const VENT_SLAT_COUNT = 7;
const GRAPHIC_LINES: readonly (readonly RatioPoint[])[] = [
  [
    [0.02, 0.78],
    [0.12, 0.78],
    [0.17, 0.46],
    [0.31, 0.46],
  ],
  [
    [0.2, 0.9],
    [0.26, 0.6],
    [0.3, 0.6],
  ],
  [
    [0.5, 0.92],
    [0.56, 0.62],
    [0.74, 0.62],
  ],
];
const STICKERS: readonly { readonly x: number; readonly y: number; readonly width: number; readonly height: number }[] = [
  { x: 0.05, y: 0.2, width: 0.11, height: 0.12 },
  { x: 0.05, y: 0.36, width: 0.09, height: 0.08 },
];

function paintGraphicLines(context: CanvasRenderingContext2D, size: Dimensions): void {
  context.strokeStyle = LINE_COLOR;
  context.lineWidth = Math.max(2, size.height * 0.014);
  GRAPHIC_LINES.forEach((line) => {
    context.beginPath();
    line.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x * size.width, y * size.height);
      else context.lineTo(x * size.width, y * size.height);
    });
    context.stroke();
  });

  context.fillStyle = LINE_COLOR;
  context.beginPath();
  context.moveTo(size.width * 0.6, size.height * 0.56);
  context.lineTo(size.width * 0.75, size.height * 0.56);
  context.lineTo(size.width * 0.75, size.height * 0.2);
  context.closePath();
  context.fill();
}

function paintStickers(context: CanvasRenderingContext2D, size: Dimensions): void {
  context.fillStyle = STICKER_COLOR;
  STICKERS.forEach((sticker) =>
    context.fillRect(sticker.x * size.width, sticker.y * size.height, sticker.width * size.width, sticker.height * size.height),
  );

  context.fillRect(size.width * 0.33, size.height * 0.7, size.width * 0.13, size.height * 0.16);
  context.fillStyle = '#111114';
  context.font = `700 ${Math.round(size.height * 0.085)}px ${FONT_FAMILY}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(CAUTION_TEXT, size.width * 0.395, size.height * 0.78, size.width * 0.115);
  context.textAlign = 'left';
}

function paintVentPanel(context: CanvasRenderingContext2D, size: Dimensions): void {
  const left = size.width * VENT_PANEL_START_RATIO;
  const panelWidth = size.width - left;
  context.fillStyle = '#8b8e98';
  context.fillRect(left, 0, panelWidth, size.height);

  const slatWidth = panelWidth / (VENT_SLAT_COUNT * 2);
  context.fillStyle = '#1a1a1f';
  for (let slat = 0; slat < VENT_SLAT_COUNT; slat += 1) {
    const slatLeft = left + slat * slatWidth * 2;
    context.beginPath();
    context.moveTo(slatLeft + slatWidth * 1.4, size.height * 0.08);
    context.lineTo(slatLeft + slatWidth * 2.4, size.height * 0.08);
    context.lineTo(slatLeft + slatWidth, size.height * 0.92);
    context.lineTo(slatLeft, size.height * 0.92);
    context.closePath();
    context.fill();
  }
}

export function paintGpuBackplate(context: CanvasRenderingContext2D, size: Dimensions): void {
  context.fillStyle = '#121216';
  context.fillRect(0, 0, size.width, size.height);
  paintGraphicLines(context, size);

  context.fillStyle = '#23252d';
  context.fillRect(size.width * 0.36, size.height * 0.16, size.width * 0.11, size.height * 0.3);

  context.fillStyle = '#f2f2f6';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font = `700 ${Math.round(size.height * 0.17)}px ${FONT_FAMILY}`;
  context.fillText(BRAND_TEXT, size.width * 0.49, size.height * 0.34, size.width * 0.19);

  paintStickers(context, size);
  paintVentPanel(context, size);
}
