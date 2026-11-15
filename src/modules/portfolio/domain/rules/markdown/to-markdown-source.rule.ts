import type { MarkdownLine } from '@/modules/portfolio/domain/types/markdown/markdown-line.type';

/** The line as it would be written in the .md file. */
export function toMarkdownSource(line: MarkdownLine): string {
  switch (line.kind) {
    case 'heading':
      return `${'#'.repeat(line.level)} ${line.text}`;
    case 'quote':
      return `> ${line.text}`;
    case 'bullet':
      return `- ${line.text}`;
    case 'paragraph':
      return line.text;
    case 'blank':
      return '';
  }
}
