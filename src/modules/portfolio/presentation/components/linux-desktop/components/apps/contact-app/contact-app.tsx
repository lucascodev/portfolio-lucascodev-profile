import { type FormEvent, useState } from 'react';
import type { Profile } from '@/modules/portfolio/domain/types/profile.type';
import { buildMailtoUrl } from '@/shared/utils/mail/build-mailto-url';
import styles from './contact-app.module.css';

interface ContactAppProps {
  readonly profile: Profile;
}

const DEFAULT_SUBJECT = 'Vi seu portfólio';

export function ContactApp({ profile }: ContactAppProps) {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildMailtoUrl({ to: profile.email, subject, body });
  };

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Para</span>
        <input className={styles.input} value={profile.email} readOnly />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Assunto</span>
        <input className={styles.input} value={subject} onChange={(event) => setSubject(event.target.value)} />
      </label>
      <textarea
        className={styles.message}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Escreva sua mensagem..."
        aria-label="Mensagem"
      />
      <footer className={styles.footer}>
        <ul className={styles.socials}>
          {profile.socialLinks.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <button type="submit" className={styles.send}>
          Enviar
        </button>
      </footer>
    </form>
  );
}
