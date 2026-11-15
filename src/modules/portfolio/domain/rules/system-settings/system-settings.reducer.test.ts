import { describe, expect, it } from 'vitest';
import { INITIAL_SYSTEM_SETTINGS } from '@/modules/portfolio/domain/constants/initial-system-settings.constant';
import { systemSettingsReducer } from './system-settings.reducer';

describe('systemSettingsReducer', () => {
  it('sets volume and brightness as whole percentages between 0 and 100', () => {
    const louder = systemSettingsReducer(INITIAL_SYSTEM_SETTINGS, { type: 'set-volume', volume: 72.6 });
    const tooBright = systemSettingsReducer(INITIAL_SYSTEM_SETTINGS, { type: 'set-brightness', brightness: 140 });
    const tooQuiet = systemSettingsReducer(INITIAL_SYSTEM_SETTINGS, { type: 'set-volume', volume: -5 });

    expect(louder.volume).toBe(73);
    expect(tooBright.brightness).toBe(100);
    expect(tooQuiet.volume).toBe(0);
  });

  it('toggles wifi and night light back and forth', () => {
    const wifiOff = systemSettingsReducer(INITIAL_SYSTEM_SETTINGS, { type: 'toggle-wifi' });
    const nightLightOn = systemSettingsReducer(INITIAL_SYSTEM_SETTINGS, { type: 'toggle-night-light' });

    expect(wifiOff.isWifiEnabled).toBe(false);
    expect(systemSettingsReducer(wifiOff, { type: 'toggle-wifi' }).isWifiEnabled).toBe(true);
    expect(nightLightOn.isNightLightEnabled).toBe(true);
  });

  it('leaves the other settings untouched', () => {
    const changed = systemSettingsReducer(INITIAL_SYSTEM_SETTINGS, { type: 'set-brightness', brightness: 40 });

    expect(changed).toEqual({ ...INITIAL_SYSTEM_SETTINGS, brightness: 40 });
  });
});
