import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import styles from './enter-beacon.module.css';

interface EnterBeaconProps {
  readonly position: ScenePosition;
  readonly appearAfterSeconds: number;
  readonly isHidden: boolean;
  readonly isEmphasized: boolean;
  readonly onSelect: () => void;
}

const MILLISECONDS_PER_SECOND = 1000;
const LABEL = 'Entrar no sistema';

export function EnterBeacon({ position, appearAfterSeconds, isHidden, isEmphasized, onSelect }: EnterBeaconProps) {
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setHasAppeared(true), appearAfterSeconds * MILLISECONDS_PER_SECOND);
    return () => window.clearTimeout(timeout);
  }, [appearAfterSeconds]);

  if (!hasAppeared || isHidden) return null;

  return (
    <Html position={[position.x, position.y, position.z]} center zIndexRange={[30, 20]}>
      <button type="button" className={styles.beacon} data-emphasized={isEmphasized} onClick={onSelect}>
        <span className={styles.pulse} aria-hidden="true" />
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v9M6.3 6.3a8 8 0 1 0 11.4 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        {LABEL}
      </button>
    </Html>
  );
}
