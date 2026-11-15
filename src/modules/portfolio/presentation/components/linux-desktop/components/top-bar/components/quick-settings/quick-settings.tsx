import { useCallback, useRef, useState } from 'react';
import { getVolumeLevel } from '@/modules/portfolio/domain/rules/system-settings/get-volume-level.rule';
import type { SystemSettingsAction } from '@/modules/portfolio/domain/types/desktop/system-settings-action.type';
import type { SystemSettings } from '@/modules/portfolio/domain/types/desktop/system-settings.type';
import { Popover } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/popover/popover';
import { SettingsSlider } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/quick-settings/components/settings-slider/settings-slider';
import { SettingsTile } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/quick-settings/components/settings-tile/settings-tile';
import { BatteryIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/battery-icon';
import { BrightnessIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/brightness-icon';
import { NightLightIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/night-light-icon';
import { PowerIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/power-icon';
import { VolumeIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/volume-icon';
import { WifiIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/wifi-icon';
import { useBatteryStatus } from '@/shared/presentation/hooks/use-battery-status/use-battery-status';
import { useDismiss } from '@/shared/presentation/hooks/use-dismiss/use-dismiss';
import { playFeedbackTone } from '@/shared/utils/audio/play-feedback-tone';
import styles from './quick-settings.module.css';

interface QuickSettingsProps {
  readonly settings: SystemSettings;
  readonly onChange: (action: SystemSettingsAction) => void;
  readonly onPowerOff: () => void;
}

const POPOVER_ID = 'quick-settings-popover';
const WIFI_NETWORK_NAME = 'portfolio-5G';
/** Shown when the browser does not share the real battery. */
const FALLBACK_BATTERY = { levelPercent: 100, isCharging: false } as const;

export function QuickSettings({ settings, onChange, onPowerOff }: QuickSettingsProps) {
  const battery = useBatteryStatus() ?? FALLBACK_BATTERY;
  const volumeLevel = getVolumeLevel(settings.volume);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  useDismiss({ isEnabled: isOpen, containerRef, onDismiss: close });

  const batteryText = `${battery.levelPercent}%${battery.isCharging ? ' · carregando' : ''}`;

  return (
    <div ref={containerRef} className={styles.quickSettings}>
      <button
        type="button"
        className={styles.tray}
        data-open={isOpen}
        aria-label="Configurações rápidas"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={POPOVER_ID}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <span className={styles.trayIcon} data-optional="true">
          <WifiIcon isEnabled={settings.isWifiEnabled} />
        </span>
        <span className={styles.trayIcon} data-optional="true">
          <VolumeIcon level={volumeLevel} />
        </span>
        <span className={styles.trayIcon}>
          <BatteryIcon levelPercent={battery.levelPercent} isCharging={battery.isCharging} />
        </span>
        <span className={styles.trayIcon} data-variant="power">
          <PowerIcon />
        </span>
      </button>

      {isOpen && (
        <Popover id={POPOVER_ID} label="Configurações rápidas" align="end">
          <div className={styles.panel}>
            <div className={styles.header}>
              <span className={styles.batteryChip}>
                <span className={styles.chipIcon}>
                  <BatteryIcon levelPercent={battery.levelPercent} isCharging={battery.isCharging} />
                </span>
                {batteryText}
              </span>
              <button type="button" className={styles.powerButton} onClick={onPowerOff} aria-label="Desligar e voltar ao setup" title="Desligar e voltar ao setup">
                <PowerIcon />
              </button>
            </div>

            <SettingsSlider
              label="Volume"
              icon={<VolumeIcon level={volumeLevel} />}
              value={settings.volume}
              onChange={(volume) => onChange({ type: 'set-volume', volume })}
              onCommit={playFeedbackTone}
            />
            <SettingsSlider
              label="Brilho"
              icon={<BrightnessIcon />}
              value={settings.brightness}
              onChange={(brightness) => onChange({ type: 'set-brightness', brightness })}
            />

            <div className={styles.tiles}>
              <SettingsTile
                label="Wi-Fi"
                detail={settings.isWifiEnabled ? WIFI_NETWORK_NAME : 'Desligado'}
                icon={<WifiIcon isEnabled={settings.isWifiEnabled} />}
                isActive={settings.isWifiEnabled}
                onToggle={() => onChange({ type: 'toggle-wifi' })}
              />
              <SettingsTile
                label="Luz noturna"
                detail={settings.isNightLightEnabled ? 'Ligada' : 'Desligada'}
                icon={<NightLightIcon />}
                isActive={settings.isNightLightEnabled}
                onToggle={() => onChange({ type: 'toggle-night-light' })}
              />
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}
