import type { ConsentStorage } from '@/modules/consent/domain/ports/consent-storage.port';
import { useCookieConsent } from '@/modules/consent/presentation/hooks/use-cookie-consent/use-cookie-consent';
import styles from './cookie-banner.module.css';

interface CookieBannerProps {
  readonly storage: ConsentStorage;
}

export function CookieBanner({ storage }: CookieBannerProps) {
  const { status, accept, decline } = useCookieConsent(storage);
  if (status !== 'pending') return null;

  return (
    <section className={styles.banner} aria-label="Aviso de cookies">
      <p className={styles.message}>
        <span className={styles.prompt}>$</span> Este site usa cookies para lembrar suas preferências. Tudo bem para você?
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.decline} onClick={decline}>
          Recusar
        </button>
        <button type="button" className={styles.accept} onClick={accept}>
          Aceitar
        </button>
      </div>
    </section>
  );
}
