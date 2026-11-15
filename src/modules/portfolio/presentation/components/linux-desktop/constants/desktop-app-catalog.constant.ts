import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { DesktopAppDefinition } from '@/modules/portfolio/presentation/components/linux-desktop/types/desktop-app-definition.type';

export const DESKTOP_APP_CATALOG: readonly DesktopAppDefinition[] = [
  { id: 'terminal', title: 'Terminal', defaultSize: { width: 680, height: 440 } },
  { id: 'about', title: 'sobre.md — Editor de texto', defaultSize: { width: 620, height: 480 } },
  { id: 'projects', title: 'Projetos — Arquivos', defaultSize: { width: 820, height: 520 } },
  { id: 'stack', title: 'Pacotes instalados', defaultSize: { width: 720, height: 520 } },
  { id: 'contact', title: 'Nova mensagem — Correio', defaultSize: { width: 580, height: 500 } },
];

export const INITIAL_DESKTOP_APPS: readonly DesktopAppId[] = ['about', 'terminal'];
