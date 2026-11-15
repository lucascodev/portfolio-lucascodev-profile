import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

const BRAND_TEXT = 'GEFORCE RTX';
const SLOGAN_TEXT = "W H A T ' S   Y O U R   G A M E ?";
const FONT_FAMILY = '"Space Grotesk", "Arial Black", sans-serif';
const HEATSINK_BAND = { top: 0.08, bottom: 0.52 };
const HEATSINK_START_RATIO = 0.26;
const FIN_SPACING_PX = 7;
const FIN_GAP_PX = 2;
const HEAT_PIPE_ROWS = [0.2, 0.36];
const HEAT_PIPE_COLOR = '#b06a3a';

function paintHeatsinkBand(context: CanvasRenderingContext2D, size: Dimensions): void {
  const left = size.width * HEATSINK_START_RATIO;
  const top = size.height * HEATSINK_BAND.top;
  const bandHeight = size.height * (HEATSINK_BAND.bottom - HEATSINK_BAND.top);
  context.fillStyle = '#565862';
  context.fillRect(left, top, size.width * 0.97 - left, bandHeight);
  context.fillStyle = '#0c0c0f';
  for (let x = left; x < size.width * 0.97; x += FIN_SPACING_PX) context.fillRect(x, top, FIN_GAP_PX, bandHeight);

  context.fillStyle = HEAT_PIPE_COLOR;
  HEAT_PIPE_ROWS.forEach((row) => context.fillRect(size.width * 0.34, size.height * row, size.width * 0.56, size.height * 0.08));
}

function paintNameBand(context: CanvasRenderingContext2D, size: Dimensions): void {
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  context.fillStyle = '#cfd0d6';
  context.font = `700 ${Math.round(size.height * 0.3)}px ${FONT_FAMILY}`;
  context.fillText(BRAND_TEXT, size.width * 0.1, size.height * 0.77);

  context.fillStyle = '#050506';
  context.fillRect(size.width * 0.52, size.height * 0.62, size.width * 0.4, size.height * 0.3);
  context.fillStyle = '#f3e9c6';
  context.font = `600 ${Math.round(size.height * 0.13)}px ${FONT_FAMILY}`;
  context.textAlign = 'center';
  context.fillText(SLOGAN_TEXT, size.width * 0.72, size.height * 0.77, size.width * 0.36);
  context.textAlign = 'left';
}

export function paintGpuLabel(context: CanvasRenderingContext2D, size: Dimensions): void {
  context.fillStyle = '#141418';
  context.fillRect(0, 0, size.width, size.height);
  paintHeatsinkBand(context, size);
  paintNameBand(context, size);
}
