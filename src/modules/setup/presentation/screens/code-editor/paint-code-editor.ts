import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import { SCREEN_THEME } from '@/modules/setup/presentation/screens/screen-theme.constant';
import { calculateTypedCharacters } from '@/modules/setup/presentation/screens/typing/calculate-typed-characters';
import { calculateScreenFontSize } from '@/modules/setup/presentation/screens/typography/calculate-screen-font-size';
import { drawWindowChrome } from '@/modules/setup/presentation/screens/window-chrome/draw-window-chrome';
import type { CodeTokenKind } from './code-token.type';
import { tokenizeCodeLine } from './tokenize-code-line';

type CodeEditorScreen = Extract<ScreenContent, { kind: 'code-editor' }>;

const TYPING_RHYTHM = { charactersPerSecond: 22, holdSeconds: 4 };
const LINE_HEIGHT_RATIO = 1.55;
const CURSOR_BLINKS_PER_SECOND = 2;

const TOKEN_COLORS: Readonly<Record<CodeTokenKind, string>> = {
  keyword: SCREEN_THEME.keyword,
  string: SCREEN_THEME.string,
  number: SCREEN_THEME.number,
  comment: SCREEN_THEME.comment,
  function: SCREEN_THEME.function,
  type: SCREEN_THEME.type,
  punctuation: SCREEN_THEME.punctuation,
  plain: SCREEN_THEME.text,
};

function sliceTypedLines(lines: readonly string[], typedCharacters: number): string[] {
  let remaining = typedCharacters;
  const typedLines: string[] = [];

  for (const line of lines) {
    if (remaining < 0) break;
    typedLines.push(line.slice(0, remaining));
    remaining -= line.length + 1;
  }
  return typedLines;
}

export function paintCodeEditor(
  context: CanvasRenderingContext2D,
  size: Dimensions,
  elapsedSeconds: number,
  screen: CodeEditorScreen,
): void {
  const fontSize = calculateScreenFontSize(size);
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const top = drawWindowChrome(context, size, `${screen.fileName} — portfolio`, fontSize);
  const statusBarHeight = fontSize * 1.6;
  const gutterWidth = fontSize * 3.2;
  const textLeft = gutterWidth + fontSize;

  const totalCharacters = screen.lines.reduce((sum, line) => sum + line.length + 1, 0);
  const typedLines = sliceTypedLines(screen.lines, calculateTypedCharacters(elapsedSeconds, totalCharacters, TYPING_RHYTHM));
  const visibleRows = Math.floor((size.height - top - statusBarHeight - fontSize) / lineHeight);
  const firstVisibleLine = Math.max(0, typedLines.length - visibleRows);
  const cursorLineIndex = typedLines.length - 1;

  context.font = `${fontSize}px ${SCREEN_THEME.fontFamily}`;
  context.textBaseline = 'middle';
  const characterWidth = context.measureText('M').width;

  context.fillStyle = SCREEN_THEME.surface;
  context.fillRect(0, top, gutterWidth, size.height - top);

  typedLines.slice(firstVisibleLine).forEach((line, visibleIndex) => {
    const lineIndex = firstVisibleLine + visibleIndex;
    const y = top + fontSize + visibleIndex * lineHeight + lineHeight / 2;

    if (lineIndex === cursorLineIndex) {
      context.fillStyle = 'rgba(203, 166, 247, 0.08)';
      context.fillRect(gutterWidth, y - lineHeight / 2, size.width - gutterWidth, lineHeight);
    }

    context.fillStyle = lineIndex === cursorLineIndex ? SCREEN_THEME.text : SCREEN_THEME.comment;
    context.textAlign = 'right';
    context.fillText(String(lineIndex + 1), gutterWidth - fontSize * 0.6, y);
    context.textAlign = 'left';

    let column = 0;
    for (const token of tokenizeCodeLine(line)) {
      context.fillStyle = TOKEN_COLORS[token.kind];
      context.fillText(token.text, textLeft + column * characterWidth, y);
      column += token.text.length;
    }

    const isCursorOn = Math.floor(elapsedSeconds * CURSOR_BLINKS_PER_SECOND) % 2 === 0;
    if (lineIndex === cursorLineIndex && isCursorOn) {
      context.fillStyle = SCREEN_THEME.accent;
      context.fillRect(textLeft + column * characterWidth, y - fontSize * 0.6, characterWidth * 0.15 + 2, fontSize * 1.2);
    }
  });

  context.fillStyle = SCREEN_THEME.accent;
  context.fillRect(0, size.height - statusBarHeight, size.width, statusBarHeight);
  context.fillStyle = SCREEN_THEME.surface;
  context.font = `${Math.round(fontSize * 0.8)}px ${SCREEN_THEME.fontFamily}`;
  const statusY = size.height - statusBarHeight / 2;
  context.fillText(' main  ✓ 0 problems', fontSize * 0.6, statusY);
  context.textAlign = 'right';
  const column = (typedLines.at(-1)?.length ?? 0) + 1;
  context.fillText(`Ln ${cursorLineIndex + 1}, Col ${column}  TypeScript `, size.width - fontSize * 0.6, statusY);
  context.textAlign = 'left';
}
