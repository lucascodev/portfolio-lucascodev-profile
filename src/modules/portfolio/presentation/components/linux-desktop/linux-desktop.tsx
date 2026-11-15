import { useEffect, useReducer, useRef } from 'react';
import { INITIAL_SYSTEM_SETTINGS } from '@/modules/portfolio/domain/constants/initial-system-settings.constant';
import { getShellUserHost } from '@/modules/portfolio/domain/rules/profile/get-shell-user-host.rule';
import { systemSettingsReducer } from '@/modules/portfolio/domain/rules/system-settings/system-settings.reducer';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import { AppContent } from './components/app-content/app-content';
import { DesktopWindow } from './components/desktop-window/desktop-window';
import { DisplayOverlay } from './components/display-overlay/display-overlay';
import { Dock } from './components/dock/dock';
import { TopBar } from './components/top-bar/top-bar';
import { WelcomeNotification } from './components/welcome-notification/welcome-notification';
import { DESKTOP_APP_CATALOG, INITIAL_DESKTOP_APPS } from './constants/desktop-app-catalog.constant';
import { useWindowManager } from './hooks/use-window-manager/use-window-manager';
import styles from './linux-desktop.module.css';

interface LinuxDesktopProps {
  readonly content: PortfolioContent;
  readonly isShuttingDown: boolean;
  readonly onPowerOff: () => void;
}

export function LinuxDesktop({ content, isShuttingDown, onPowerOff }: LinuxDesktopProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const { state, dispatch, openApp, toggleFromDock } = useWindowManager(areaRef);
  const [settings, dispatchSettings] = useReducer(systemSettingsReducer, INITIAL_SYSTEM_SETTINGS);
  const hasOpenedInitialAppsRef = useRef(false);
  const visibleWindows = state.windows.filter((window) => !window.isMinimized);
  const activeWindow = visibleWindows.reduce<(typeof visibleWindows)[number] | undefined>(
    (top, window) => (!top || window.zIndex > top.zIndex ? window : top),
    undefined,
  );
  const titleOf = (appId: string) => DESKTOP_APP_CATALOG.find((app) => app.id === appId)?.title ?? appId;

  useEffect(() => {
    if (hasOpenedInitialAppsRef.current) return;
    hasOpenedInitialAppsRef.current = true;
    INITIAL_DESKTOP_APPS.forEach((appId, index) => openApp(appId, index));
  }, [openApp]);

  return (
    <div
      className={styles.desktop}
      data-state={isShuttingDown ? 'shutting-down' : 'on'}
      role="application"
      aria-label="Desktop Linux do portfólio"
    >
      <TopBar
        activeAppTitle={activeWindow && titleOf(activeWindow.appId)}
        settings={settings}
        onSettingsChange={dispatchSettings}
        onPowerOff={onPowerOff}
      />
      <div className={styles.area}>
        <p className={styles.watermark} aria-hidden="true">
          {getShellUserHost(content.profile.name)}
        </p>
        <WelcomeNotification visitorName={content.profile.name} />
        <div ref={areaRef} className={styles.workspace}>
          {state.windows.map((window) => (
            <DesktopWindow
              key={window.appId}
              window={window}
              title={titleOf(window.appId)}
              isActive={window.appId === activeWindow?.appId}
              onFocus={() => dispatch({ type: 'focus', appId: window.appId })}
              onMove={(x, y) => dispatch({ type: 'move', appId: window.appId, x, y })}
              onResize={(bounds) => dispatch({ type: 'resize', appId: window.appId, bounds })}
              onMinimize={() => dispatch({ type: 'toggle-minimize', appId: window.appId })}
              onToggleMaximize={() => dispatch({ type: 'toggle-maximize', appId: window.appId })}
              onClose={() => dispatch({ type: 'close', appId: window.appId })}
            >
              <AppContent appId={window.appId} content={content} onOpenApp={openApp} onPowerOff={onPowerOff} />
            </DesktopWindow>
          ))}
        </div>
        <Dock
          apps={DESKTOP_APP_CATALOG}
          openAppIds={state.windows.map((window) => window.appId)}
          onAppClick={toggleFromDock}
        />
      </div>
      <DisplayOverlay brightness={settings.brightness} isNightLightEnabled={settings.isNightLightEnabled} />
    </div>
  );
}
