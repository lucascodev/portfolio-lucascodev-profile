export interface CalendarDay {
  /** Local date as YYYY-MM-DD. */
  readonly isoDate: string;
  readonly dayOfMonth: number;
  readonly isInMonth: boolean;
  readonly isToday: boolean;
}
