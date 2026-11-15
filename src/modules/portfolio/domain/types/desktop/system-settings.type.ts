export interface SystemSettings {
  /** 0 to 100. */
  readonly volume: number;
  /** 0 to 100. */
  readonly brightness: number;
  readonly isWifiEnabled: boolean;
  readonly isNightLightEnabled: boolean;
}
