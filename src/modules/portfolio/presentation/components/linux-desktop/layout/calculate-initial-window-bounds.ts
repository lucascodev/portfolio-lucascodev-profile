import type { WindowBounds } from '@/modules/portfolio/domain/types/desktop/window-bounds.type';

interface AreaSize {
  readonly width: number;
  readonly height: number;
}

const CASCADE_STEP_X_PX = 120;
const CASCADE_STEP_Y_PX = 56;
const AREA_MARGIN_PX = 24;
const LEFT_BIAS_PX = 140;
const UP_BIAS_PX = 50;

export function calculateInitialWindowBounds(
  preferredSize: AreaSize,
  area: AreaSize,
  openWindowCount: number,
): WindowBounds {
  const width = Math.min(preferredSize.width, area.width - AREA_MARGIN_PX * 2);
  const height = Math.min(preferredSize.height, area.height - AREA_MARGIN_PX * 2);
  const centeredX = (area.width - width) / 2 - LEFT_BIAS_PX + openWindowCount * CASCADE_STEP_X_PX;
  const centeredY = (area.height - height) / 2 - UP_BIAS_PX + openWindowCount * CASCADE_STEP_Y_PX;

  return {
    width,
    height,
    x: Math.max(AREA_MARGIN_PX, Math.min(area.width - width - AREA_MARGIN_PX, centeredX)),
    y: Math.max(AREA_MARGIN_PX, Math.min(area.height - height - AREA_MARGIN_PX, centeredY)),
  };
}
