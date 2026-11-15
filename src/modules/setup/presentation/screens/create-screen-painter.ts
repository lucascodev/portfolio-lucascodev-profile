import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import { paintCodeEditor } from './code-editor/paint-code-editor';
import { paintDashboard } from './dashboard/paint-dashboard';
import { paintLockScreen } from './lock-screen/paint-lock-screen';
import { paintLoginScreen } from './login-screen/paint-login-screen';
import { paintMacLockScreen } from './mac-lock-screen/paint-mac-lock-screen';
import { paintPhoneHomeScreen } from './phone-home-screen/paint-phone-home-screen';
import type { ScreenPainter } from './screen-painter.type';
import { paintSplit } from './split/paint-split';
import { paintTerminal } from './terminal/paint-terminal';

const DEFAULT_LEFT_PANE_FRACTION = 0.58;

export function createScreenPainter(screen: ScreenContent): ScreenPainter {
  switch (screen.kind) {
    case 'code-editor':
      return (context, size, elapsedSeconds) => paintCodeEditor(context, size, elapsedSeconds, screen);
    case 'terminal':
      return (context, size, elapsedSeconds) => paintTerminal(context, size, elapsedSeconds, screen.entries);
    case 'dashboard':
      return (context, size, elapsedSeconds) => paintDashboard(context, size, elapsedSeconds, screen.title);
    case 'mac-lock-screen':
      return (context, size, elapsedSeconds) => paintMacLockScreen(context, size, elapsedSeconds, screen);
    case 'login-screen':
      return (context, size, elapsedSeconds) => paintLoginScreen(context, size, elapsedSeconds, screen);
    case 'phone-home-screen':
      return (context, size) => paintPhoneHomeScreen(context, size, screen);
    case 'lock-screen':
      return (context, size) => paintLockScreen(context, size, screen.wallpaperColors);
    case 'split': {
      const painters = [createScreenPainter(screen.panes[0]), createScreenPainter(screen.panes[1])] as const;
      const leftPaneFraction = screen.leftPaneFraction ?? DEFAULT_LEFT_PANE_FRACTION;
      return (context, size, elapsedSeconds) => paintSplit(context, size, elapsedSeconds, painters, leftPaneFraction);
    }
  }
}
