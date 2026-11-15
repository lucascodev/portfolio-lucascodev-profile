import type { ReactNode } from 'react';
import styles from './settings-tile.module.css';

interface SettingsTileProps {
  readonly label: string;
  readonly detail: string;
  readonly icon: ReactNode;
  readonly isActive: boolean;
  readonly onToggle: () => void;
}

export function SettingsTile({ label, detail, icon, isActive, onToggle }: SettingsTileProps) {
  return (
    <button type="button" className={styles.tile} aria-pressed={isActive} onClick={onToggle}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.detail}>{detail}</span>
      </span>
    </button>
  );
}
