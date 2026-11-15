import { buildAboutDocument } from '@/modules/portfolio/domain/rules/about/build-about-document.rule';
import type { Profile } from '@/modules/portfolio/domain/types/profile.type';
import { MarkdownLine } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/about-app/components/markdown-line/markdown-line';
import styles from './about-app.module.css';

interface AboutAppProps {
  readonly profile: Profile;
}

export function AboutApp({ profile }: AboutAppProps) {
  const lines = buildAboutDocument(profile);

  return (
    <div className={styles.editor}>
      <article className={styles.document}>
        {lines.map((line, index) => (
          // The document is static, so the line number is a stable key.
          <div key={index} className={styles.line}>
            <span className={styles.lineNumber} aria-hidden="true">
              {index + 1}
            </span>
            <MarkdownLine line={line} />
          </div>
        ))}
      </article>
      <footer className={styles.statusBar}>
        <span>Markdown</span>
        <span>UTF-8</span>
        <span>{lines.length} linhas</span>
      </footer>
    </div>
  );
}
