export type SystemSettingsAction =
  | { readonly type: 'set-volume'; readonly volume: number }
  | { readonly type: 'set-brightness'; readonly brightness: number }
  | { readonly type: 'toggle-wifi' }
  | { readonly type: 'toggle-night-light' };
