import { METERS_PER_KEY_UNIT } from '@/modules/setup/domain/constants/physical-units.constant';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { KeyboardGeometry } from '@/modules/setup/domain/types/keyboard/keyboard-geometry.type';
import type { KeycapTone } from '@/modules/setup/domain/types/keyboard/keycap-tone.type';

export interface KeycapLegendPalette {
  readonly keycaps: Readonly<Record<KeycapTone, string>>;
  readonly legends: Readonly<Record<KeycapTone, string>>;
}

const MAX_FONT_HEIGHT_RATIO = 0.46;
const KEY_PADDING_RATIO = 0.16;
const AVERAGE_GLYPH_WIDTH_RATIO = 0.62;

export function paintKeycapLegends(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  geometry: KeyboardGeometry,
  palette: KeycapLegendPalette,
): void {
  const pixelsPerMeter = size.width / geometry.width;
  const keyDepth = METERS_PER_KEY_UNIT * pixelsPerMeter;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  geometry.keys.forEach((key) => {
    const centerX = (key.x + geometry.width / 2) * pixelsPerMeter;
    const centerY = (key.z + geometry.depth / 2) * pixelsPerMeter;
    const keyWidth = key.width * pixelsPerMeter;
    context.fillStyle = palette.keycaps[key.tone];
    context.fillRect(centerX - keyWidth / 2, centerY - keyDepth / 2, keyWidth, keyDepth);
    if (!key.legend) return;

    const availableWidth = keyWidth * (1 - KEY_PADDING_RATIO * 2);
    const fontSize = Math.min(keyDepth * MAX_FONT_HEIGHT_RATIO, availableWidth / (key.legend.length * AVERAGE_GLYPH_WIDTH_RATIO));
    context.font = `700 ${fontSize}px system-ui, sans-serif`;
    context.fillStyle = palette.legends[key.tone];
    context.fillText(key.legend, centerX, centerY);
  });
}
