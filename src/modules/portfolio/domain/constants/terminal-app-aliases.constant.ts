import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';

export const TERMINAL_APP_ALIASES: Readonly<Record<string, DesktopAppId>> = {
  terminal: 'terminal',
  sobre: 'about',
  about: 'about',
  projetos: 'projects',
  projects: 'projects',
  stack: 'stack',
  contato: 'contact',
  contact: 'contact',
};
