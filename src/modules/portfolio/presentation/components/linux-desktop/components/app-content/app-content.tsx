import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import { AboutApp } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/about-app/about-app';
import { ContactApp } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/contact-app/contact-app';
import { ProjectsApp } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/projects-app/projects-app';
import { StackApp } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/stack-app/stack-app';
import { TerminalApp } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/terminal-app/terminal-app';

interface AppContentProps {
  readonly appId: DesktopAppId;
  readonly content: PortfolioContent;
  readonly onOpenApp: (appId: DesktopAppId) => void;
  readonly onPowerOff: () => void;
}

export function AppContent({ appId, content, onOpenApp, onPowerOff }: AppContentProps) {
  switch (appId) {
    case 'terminal':
      return <TerminalApp content={content} onOpenApp={onOpenApp} onPowerOff={onPowerOff} />;
    case 'about':
      return <AboutApp profile={content.profile} />;
    case 'projects':
      return <ProjectsApp projects={content.projects} />;
    case 'stack':
      return <StackApp skillGroups={content.skillGroups} />;
    case 'contact':
      return <ContactApp profile={content.profile} />;
  }
}
