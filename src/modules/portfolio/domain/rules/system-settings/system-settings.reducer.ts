import type { SystemSettingsAction } from '@/modules/portfolio/domain/types/desktop/system-settings-action.type';
import type { SystemSettings } from '@/modules/portfolio/domain/types/desktop/system-settings.type';

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

function clampPercent(value: number): number {
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, Math.round(value)));
}

export function systemSettingsReducer(settings: SystemSettings, action: SystemSettingsAction): SystemSettings {
  switch (action.type) {
    case 'set-volume':
      return { ...settings, volume: clampPercent(action.volume) };
    case 'set-brightness':
      return { ...settings, brightness: clampPercent(action.brightness) };
    case 'toggle-wifi':
      return { ...settings, isWifiEnabled: !settings.isWifiEnabled };
    case 'toggle-night-light':
      return { ...settings, isNightLightEnabled: !settings.isNightLightEnabled };
  }
}
