import type { InlineSegment } from '@/modules/portfolio/domain/types/markdown/inline-segment.type';

const INLINE_TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInlineMarkdown(source: string): readonly InlineSegment[] {
  const segments: InlineSegment[] = [];
  let textStart = 0;

  for (const match of source.matchAll(INLINE_TOKEN)) {
    const [token, strongText, linkText, href] = match;
    if (match.index > textStart) segments.push({ kind: 'text', text: source.slice(textStart, match.index) });
    segments.push(strongText ? { kind: 'strong', text: strongText } : { kind: 'link', text: linkText, href });
    textStart = match.index + token.length;
  }

  if (textStart < source.length) segments.push({ kind: 'text', text: source.slice(textStart) });
  return segments;
}
