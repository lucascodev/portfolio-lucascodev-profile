import { useCallback, useRef, useState } from 'react';
import { CalendarPanel } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/date-menu/components/calendar-panel/calendar-panel';
import { Popover } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/popover/popover';
import { BellIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/bell-icon';
import { CLOCK_FORMATTER } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/constants/date-formatters.constant';
import { useClock } from '@/shared/presentation/hooks/use-clock/use-clock';
import { useDismiss } from '@/shared/presentation/hooks/use-dismiss/use-dismiss';
import styles from './date-menu.module.css';

const POPOVER_ID = 'date-menu-popover';

export function DateMenu() {
  const now = useClock();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  useDismiss({ isEnabled: isOpen, containerRef, onDismiss: close });

  return (
    <div ref={containerRef} className={styles.dateMenu}>
      <button
        type="button"
        className={styles.clock}
        data-open={isOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={POPOVER_ID}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <time dateTime={now.toISOString()}>{CLOCK_FORMATTER.format(now)}</time>
      </button>

      {isOpen && (
        <Popover id={POPOVER_ID} label="Calendário e notificações" align="center">
          <div className={styles.columns}>
            <section className={styles.notifications} aria-label="Notificações">
              <span className={styles.bell}>
                <BellIcon />
              </span>
              <p className={styles.emptyNotifications}>Nenhuma notificação</p>
            </section>
            <CalendarPanel today={now} />
          </div>
        </Popover>
      )}
    </div>
  );
}
