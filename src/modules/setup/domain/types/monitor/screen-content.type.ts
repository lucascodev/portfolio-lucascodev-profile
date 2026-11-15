import type { TerminalEntry } from './terminal-entry.type';

export type ScreenContent =
  | { readonly kind: 'code-editor'; readonly fileName: string; readonly lines: readonly string[] }
  | { readonly kind: 'terminal'; readonly entries: readonly TerminalEntry[] }
  | { readonly kind: 'dashboard'; readonly title: string }
  | { readonly kind: 'lock-screen'; readonly wallpaperColors: readonly [string, string] }
  | { readonly kind: 'phone-home-screen'; readonly wallpaperColors: readonly [string, string] }
  | { readonly kind: 'login-screen'; readonly userName: string; readonly hint: string }
  | { readonly kind: 'mac-lock-screen'; readonly userName: string; readonly wallpaperColors: readonly [string, string, string] }
  | { readonly kind: 'split'; readonly panes: readonly [ScreenContent, ScreenContent]; readonly leftPaneFraction?: number };
