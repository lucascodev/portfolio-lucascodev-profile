import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import { AppIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/app-icon/app-icon';
import type { DesktopAppDefinition } from '@/modules/portfolio/presentation/components/linux-desktop/types/desktop-app-definition.type';
import styles from './dock.module.css';

interface DockProps {
  readonly apps: readonly DesktopAppDefinition[];
  readonly openAppIds: readonly DesktopAppId[];
  readonly onAppClick: (appId: DesktopAppId) => void;
}

const DOCK_LABELS: Readonly<Record<DesktopAppId, string>> = {
  terminal: 'Terminal',
  about: 'Sobre mim',
  projects: 'Projetos',
  stack: 'Stack',
  contact: 'Contato',
};

export function Dock({ apps, openAppIds, onAppClick }: DockProps) {
  return (
    <nav className={styles.dock} aria-label="Aplicativos">
      {apps.map((app) => (
        <button
          key={app.id}
          type="button"
          className={styles.item}
          onClick={() => onAppClick(app.id)}
          aria-label={DOCK_LABELS[app.id]}
          data-open={openAppIds.includes(app.id)}
        >
          <AppIcon appId={app.id} />
          <span className={styles.tooltip}>{DOCK_LABELS[app.id]}</span>
        </button>
      ))}
    </nav>
  );
}
