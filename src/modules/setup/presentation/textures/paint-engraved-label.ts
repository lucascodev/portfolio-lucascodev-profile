import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

export interface EngravedLabelStyle {
  readonly text: string;
  readonly background: string;
  readonly textColor: string;
  readonly accentColor?: string;
}

const FONT_FAMILY = '"Space Grotesk", "Arial Black", sans-serif';
const FONT_HEIGHT_RATIO = 0.5;
const SIDE_PADDING_RATIO = 0.06;
const ACCENT_SLASH_COUNT = 3;

/** A flat plate with one line of text and, optionally, slanted accent slashes before it. */
export function paintEngravedLabel(context: CanvasRenderingContext2D, size: Dimensions, style: EngravedLabelStyle): void {
  context.fillStyle = style.background;
  context.fillRect(0, 0, size.width, size.height);

  let textStart = size.width * SIDE_PADDING_RATIO;
  if (style.accentColor) {
    const slashWidth = size.height * 0.22;
    context.fillStyle = style.accentColor;
    for (let slash = 0; slash < ACCENT_SLASH_COUNT; slash += 1) {
      const left = textStart + slash * slashWidth * 1.6;
      context.beginPath();
      context.moveTo(left + slashWidth, size.height * 0.2);
      context.lineTo(left + slashWidth * 2, size.height * 0.2);
      context.lineTo(left + slashWidth, size.height * 0.8);
      context.lineTo(left, size.height * 0.8);
      context.closePath();
      context.fill();
    }
    textStart += ACCENT_SLASH_COUNT * slashWidth * 1.6 + slashWidth;
  }

  context.fillStyle = style.textColor;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font = `700 ${Math.round(size.height * FONT_HEIGHT_RATIO)}px ${FONT_FAMILY}`;
  context.fillText(style.text, textStart, size.height / 2, size.width - textStart - size.width * SIDE_PADDING_RATIO);
}
