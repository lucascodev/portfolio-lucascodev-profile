import type { Profile } from '@/modules/portfolio/domain/types/profile.type';
import styles from './setup-intro.module.css';

interface SetupIntroProps {
  readonly profile: Profile;
  readonly isVisible: boolean;
}

export function SetupIntro({ profile, isVisible }: SetupIntroProps) {
  return (
    <section className={styles.intro} data-visible={isVisible} aria-hidden={!isVisible} aria-labelledby="intro-title">
      <p className={styles.prompt}>
        <span className={styles.promptSymbol}>❯</span> whoami
      </p>
      <h1 id="intro-title" className={styles.title}>
        {profile.name}
      </h1>
      <p className={styles.role}>{profile.role}</p>
      <p className={styles.headline}>
        Esse é o meu setup de verdade. <strong className={styles.highlight}>Clique no monitor</strong> para entrar no meu sistema e conhecer
        meus projetos.
      </p>
      <p className={styles.shortcut}>
        ou aperte <kbd className={styles.key}>Enter</kbd>
      </p>
    </section>
  );
}
