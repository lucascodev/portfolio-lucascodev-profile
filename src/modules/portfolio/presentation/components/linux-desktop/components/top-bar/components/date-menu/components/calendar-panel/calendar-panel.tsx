import { useState } from 'react';
import { buildCalendarWeeks } from '@/modules/portfolio/domain/rules/calendar/build-calendar-weeks.rule';
import { getCalendarMonth } from '@/modules/portfolio/domain/rules/calendar/get-calendar-month.rule';
import { shiftCalendarMonth } from '@/modules/portfolio/domain/rules/calendar/shift-calendar-month.rule';
import { ChevronIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/components/system-icons/chevron-icon';
import {
  FULL_DATE_FORMATTER,
  MONTH_FORMATTER,
  WEEKDAY_FORMATTER,
} from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/constants/date-formatters.constant';
import { WEEKDAY_HEADERS } from '@/modules/portfolio/presentation/components/linux-desktop/components/top-bar/constants/weekday-headers.constant';
import styles from './calendar-panel.module.css';

interface CalendarPanelProps {
  readonly today: Date;
}

export function CalendarPanel({ today }: CalendarPanelProps) {
  const [month, setMonth] = useState(() => getCalendarMonth(today));
  const weeks = buildCalendarWeeks(month, today);
  const firstDayOfMonth = new Date(month.year, month.monthIndex, 1);

  return (
    <section className={styles.panel} aria-label="Calendário">
      <button type="button" className={styles.today} onClick={() => setMonth(getCalendarMonth(today))} title="Voltar para hoje">
        <span className={styles.weekday}>{WEEKDAY_FORMATTER.format(today)}</span>
        <span className={styles.fullDate}>{FULL_DATE_FORMATTER.format(today)}</span>
      </button>

      <div className={styles.calendar}>
        <div className={styles.monthBar}>
          <button type="button" className={styles.navButton} onClick={() => setMonth(shiftCalendarMonth(month, -1))} aria-label="Mês anterior">
            <ChevronIcon direction="left" />
          </button>
          <h2 className={styles.monthTitle} aria-live="polite">
            {MONTH_FORMATTER.format(firstDayOfMonth)}
          </h2>
          <button type="button" className={styles.navButton} onClick={() => setMonth(shiftCalendarMonth(month, 1))} aria-label="Próximo mês">
            <ChevronIcon direction="right" />
          </button>
        </div>

        <table className={styles.grid}>
          <thead>
            <tr>
              {WEEKDAY_HEADERS.map((weekday) => (
                <th key={weekday.name} scope="col">
                  <abbr title={weekday.name}>{weekday.initial}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0].isoDate}>
                {week.map((day) => (
                  <td key={day.isoDate}>
                    <time
                      className={styles.day}
                      dateTime={day.isoDate}
                      data-in-month={day.isInMonth}
                      data-today={day.isToday}
                      aria-current={day.isToday ? 'date' : undefined}
                    >
                      {day.dayOfMonth}
                    </time>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.events}>
        <h3 className={styles.eventsTitle}>Hoje</h3>
        <p className={styles.emptyEvents}>Nenhum evento</p>
      </div>
    </section>
  );
}
