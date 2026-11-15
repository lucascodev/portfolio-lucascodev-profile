import type { MarkdownLine as MarkdownLineModel } from '@/modules/portfolio/domain/types/markdown/markdown-line.type';
import { InlineMarkdown } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/about-app/components/inline-markdown/inline-markdown';
import styles from './markdown-line.module.css';

interface MarkdownLineProps {
  readonly line: MarkdownLineModel;
}

export function MarkdownLine({ line }: MarkdownLineProps) {
  switch (line.kind) {
    case 'heading': {
      const Heading = line.level === 1 ? 'h1' : 'h2';
      return (
        <Heading className={styles.heading} data-level={line.level}>
          <span className={styles.markup}>{'#'.repeat(line.level)} </span>
          {line.text}
        </Heading>
      );
    }
    case 'quote':
      return (
        <p className={styles.quote}>
          <span className={styles.markup}>&gt; </span>
          <InlineMarkdown source={line.text} />
        </p>
      );
    case 'bullet':
      return (
        <p className={styles.bullet}>
          <span className={styles.bulletMarker} aria-hidden="true">
            -
          </span>
          <span>
            <InlineMarkdown source={line.text} />
          </span>
        </p>
      );
    case 'paragraph':
      return (
        <p className={styles.paragraph}>
          <InlineMarkdown source={line.text} />
        </p>
      );
    case 'blank':
      return <span className={styles.blank} aria-hidden="true" />;
  }
}
