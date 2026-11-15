import { useEffect, useState } from 'react';

export interface BatteryStatus {
  readonly levelPercent: number;
  readonly isCharging: boolean;
}

interface BatteryManager extends EventTarget {
  readonly level: number;
  readonly charging: boolean;
}

type NavigatorWithBattery = Navigator & { readonly getBattery?: () => Promise<BatteryManager> };

const BATTERY_EVENTS = ['levelchange', 'chargingchange'] as const;

export function useBatteryStatus(): BatteryStatus | null {
  const [status, setStatus] = useState<BatteryStatus | null>(null);

  useEffect(() => {
    const browserNavigator = navigator as NavigatorWithBattery;
    if (!browserNavigator.getBattery) return;

    let battery: BatteryManager | null = null;
    let isSubscribed = true;
    const update = () => {
      if (!battery || !isSubscribed) return;
      setStatus({ levelPercent: Math.round(battery.level * 100), isCharging: battery.charging });
    };

    browserNavigator
      .getBattery()
      .then((manager) => {
        battery = manager;
        update();
        BATTERY_EVENTS.forEach((eventName) => manager.addEventListener(eventName, update));
      })
      .catch(() => setStatus(null));

    return () => {
      isSubscribed = false;
      BATTERY_EVENTS.forEach((eventName) => battery?.removeEventListener(eventName, update));
    };
  }, []);

  return status;
}
