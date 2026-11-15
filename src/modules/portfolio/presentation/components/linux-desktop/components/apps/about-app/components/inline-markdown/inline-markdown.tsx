import { parseInlineMarkdown } from '@/modules/portfolio/domain/rules/markdown/parse-inline-markdown.rule';
import type { InlineSegment } from '@/modules/portfolio/domain/types/markdown/inline-segment.type';
import styles from './inline-markdown.module.css';

interface InlineMarkdownProps {
  readonly source: string;
}

const EXTERNAL_LINK_PREFIX = 'http';

function renderSegment(segment: InlineSegment, index: number) {
  switch (segment.kind) {
    case 'text':
      return <span key={index}>{segment.text}</span>;
    case 'strong':
      return (
        <span key={index}>
          <span className={styles.markup}>**</span>
          <strong className={styles.strong}>{segment.text}</strong>
          <span className={styles.markup}>**</span>
        </span>
      );
    case 'link': {
      const isExternal = segment.href.startsWith(EXTERNAL_LINK_PREFIX);
      return (
        <span key={index}>
          <span className={styles.markup}>[</span>
          <a
            className={styles.link}
            href={segment.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
          >
            {segment.text}
          </a>
          <span className={styles.markup}>](</span>
          <span className={styles.url}>{segment.href}</span>
          <span className={styles.markup}>)</span>
        </span>
      );
    }
  }
}

export function InlineMarkdown({ source }: InlineMarkdownProps) {
  return <>{parseInlineMarkdown(source).map(renderSegment)}</>;
}
