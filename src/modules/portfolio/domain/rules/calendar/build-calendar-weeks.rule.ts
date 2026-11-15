import type { CalendarDay } from '@/modules/portfolio/domain/types/calendar/calendar-day.type';
import type { CalendarMonth } from '@/modules/portfolio/domain/types/calendar/calendar-month.type';

const DAYS_PER_WEEK = 7;

function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function buildCalendarWeeks(month: CalendarMonth, today: Date): readonly (readonly CalendarDay[])[] {
  const leadingDays = new Date(month.year, month.monthIndex, 1).getDay();
  const daysInMonth = new Date(month.year, month.monthIndex + 1, 0).getDate();
  const weekCount = Math.ceil((leadingDays + daysInMonth) / DAYS_PER_WEEK);
  const todayIsoDate = toIsoDate(today);

  return Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: DAYS_PER_WEEK }, (_, weekdayIndex) => {
      const date = new Date(month.year, month.monthIndex, 1 - leadingDays + weekIndex * DAYS_PER_WEEK + weekdayIndex);
      const isoDate = toIsoDate(date);
      return {
        isoDate,
        dayOfMonth: date.getDate(),
        isInMonth: date.getMonth() === month.monthIndex,
        isToday: isoDate === todayIsoDate,
      };
    }),
  );
}
