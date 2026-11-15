import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import styles from './settings-slider.module.css';

interface SettingsSliderProps {
  readonly label: string;
  readonly icon: ReactNode;
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly onCommit?: (value: number) => void;
}

export function SettingsSlider({ label, icon, value, onChange, onCommit }: SettingsSliderProps) {
  const commit = (event: SyntheticEvent<HTMLInputElement>) => onCommit?.(Number(event.currentTarget.value));

  return (
    <div className={styles.row}>
      <span className={styles.icon}>{icon}</span>
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={label}
        style={{ '--fill': `${value}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        onPointerUp={commit}
        onKeyUp={commit}
      />
    </div>
  );
}
