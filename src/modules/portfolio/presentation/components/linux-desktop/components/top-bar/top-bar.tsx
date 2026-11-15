import type { SystemSettingsAction } from '@/modules/portfolio/domain/types/desktop/system-settings-action.type';
import type { SystemSettings } from '@/modules/portfolio/domain/types/desktop/system-settings.type';
import { DateMenu } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/date-menu/date-menu';
import { QuickSettings } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/quick-settings/quick-settings';
import styles from './top-bar.module.css';

interface TopBarProps {
  readonly activeAppTitle?: string;
  readonly settings: SystemSettings;
  readonly onSettingsChange: (action: SystemSettingsAction) => void;
  readonly onPowerOff: () => void;
}

const BRAND_MARK_URL = `${import.meta.env.BASE_URL}brand/lucas-reis-mark.svg`;

export function TopBar({ activeAppTitle, settings, onSettingsChange, onPowerOff }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <img className={styles.brandMark} src={BRAND_MARK_URL} alt="" width={18} height={18} />
        <span className={styles.activities}>Atividades</span>
        {activeAppTitle && <span className={styles.activeApp}>{activeAppTitle}</span>}
      </div>
      <DateMenu />
      <QuickSettings settings={settings} onChange={onSettingsChange} onPowerOff={onPowerOff} />
    </header>
  );
}
