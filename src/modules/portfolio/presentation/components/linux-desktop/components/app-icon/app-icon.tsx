import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import styles from './app-icon.module.css';

interface AppIconProps {
  readonly appId: DesktopAppId;
}

const ICON_GRADIENTS: Readonly<Record<DesktopAppId, readonly [string, string]>> = {
  terminal: ['#2b2b36', '#14141b'],
  about: ['#60a5fa', '#2563eb'],
  projects: ['#fbbf24', '#d97706'],
  stack: ['#4ade80', '#16a34a'],
  contact: ['#f472b6', '#db2777'],
};

function Glyph({ appId }: AppIconProps) {
  switch (appId) {
    case 'terminal':
      return (
        <>
          <path d="M14 18l7 6-7 6" fill="none" stroke="#a6e3a1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 31h10" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'about':
      return (
        <>
          <rect x="14" y="10" width="20" height="28" rx="3" fill="#fff" opacity="0.95" />
          <path d="M18 18h12M18 23h12M18 28h8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'projects':
      return <path d="M10 16a3 3 0 0 1 3-3h8l3 3h11a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" fill="#fff" opacity="0.95" />;
    case 'stack':
      return (
        <>
          <path d="M24 10l13 7-13 7-13-7z" fill="#fff" />
          <path d="M11 24l13 7 13-7M11 31l13 7 13-7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
        </>
      );
    case 'contact':
      return (
        <>
          <rect x="10" y="14" width="28" height="20" rx="3" fill="#fff" />
          <path d="M11 16l13 10 13-10" fill="none" stroke="#db2777" strokeWidth="2.5" strokeLinejoin="round" />
        </>
      );
  }
}

export function AppIcon({ appId }: AppIconProps) {
  const [from, to] = ICON_GRADIENTS[appId];
  const gradientId = `app-icon-${appId}`;

  return (
    <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${gradientId})`} />
      <Glyph appId={appId} />
    </svg>
  );
}
