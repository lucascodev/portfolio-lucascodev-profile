import type { CalendarMonth } from '@/modules/portfolio/domain/types/calendar/calendar-month.type';

export function getCalendarMonth(date: Date): CalendarMonth {
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}
