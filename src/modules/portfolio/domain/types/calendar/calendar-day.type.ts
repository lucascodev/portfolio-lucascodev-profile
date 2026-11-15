export interface CalendarDay {
  readonly isoDate: string;
  readonly dayOfMonth: number;
  readonly isInMonth: boolean;
  readonly isToday: boolean;
}
