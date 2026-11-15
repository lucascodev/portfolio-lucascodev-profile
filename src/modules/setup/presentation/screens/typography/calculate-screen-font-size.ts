import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

const MIN_FONT_SIZE_PX = 11;
const MAX_FONT_SIZE_PX = 24;
const COLUMNS_PER_SCREEN = 34;
const ROWS_PER_SCREEN = 26;

export function calculateScreenFontSize(size: Dimensions): number {
  const fittingSize = Math.min(size.width / COLUMNS_PER_SCREEN, size.height / ROWS_PER_SCREEN);
  return Math.round(Math.min(MAX_FONT_SIZE_PX, Math.max(MIN_FONT_SIZE_PX, fittingSize)));
}
