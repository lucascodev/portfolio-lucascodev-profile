import { getScreenDimOpacity } from '@/modules/portfolio/domain/rules/system-settings/get-screen-dim-opacity.rule';
import styles from './display-overlay.module.css';

interface DisplayOverlayProps {
  readonly brightness: number;
  readonly isNightLightEnabled: boolean;
}

export function DisplayOverlay({ brightness, isNightLightEnabled }: DisplayOverlayProps) {
  return (
    <>
      <div className={styles.nightLight} data-enabled={isNightLightEnabled} aria-hidden="true" />
      <div className={styles.dim} style={{ opacity: getScreenDimOpacity(brightness) }} aria-hidden="true" />
    </>
  );
}
