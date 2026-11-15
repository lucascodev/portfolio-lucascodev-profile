import type { CalendarMonth } from '@/modules/portfolio/domain/types/calendar/calendar-month.type';

export function shiftCalendarMonth(month: CalendarMonth, offset: number): CalendarMonth {
  const firstDay = new Date(month.year, month.monthIndex + offset, 1);
  return { year: firstDay.getFullYear(), monthIndex: firstDay.getMonth() };
}
