import { useEffect, useState } from 'react';
import styles from './welcome-notification.module.css';

interface WelcomeNotificationProps {
  readonly visitorName: string;
}

const AUTO_DISMISS_MS = 14_000;

export function WelcomeNotification({ visitorName }: WelcomeNotificationProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsOpen(false), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isOpen) return null;

  return (
    <aside className={styles.notification} role="status">
      <div className={styles.content}>
        <p className={styles.title}>Bem-vindo ao sistema do {visitorName} 👋</p>
        <p className={styles.body}>
          Abra <strong>Sobre</strong>, <strong>Projetos</strong>, <strong>Stack</strong> e <strong>Contato</strong> pela dock, ou digite{' '}
          <code>help</code> no terminal. Para voltar ao setup, use <kbd>Esc</kbd> ou o botão ⏻.
        </p>
      </div>
      <button type="button" className={styles.close} onClick={() => setIsOpen(false)} aria-label="Fechar notificação">
        ×
      </button>
    </aside>
  );
}
