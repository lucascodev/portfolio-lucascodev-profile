import { describe, expect, it } from 'vitest';
import { buildCalendarWeeks } from './build-calendar-weeks.rule';

const today = new Date(2026, 10, 13);

describe('buildCalendarWeeks', () => {
  it('builds full weeks starting on Sunday, padded with the next month', () => {
    const weeks = buildCalendarWeeks({ year: 2026, monthIndex: 10 }, today);

    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0][0]).toMatchObject({ isoDate: '2026-11-01', isInMonth: true });
    expect(weeks[4][6]).toMatchObject({ isoDate: '2026-12-05', dayOfMonth: 5, isInMonth: false });
  });

  it('pads the first week with the end of the previous month', () => {
    const weeks = buildCalendarWeeks({ year: 2026, monthIndex: 7 }, today);

    expect(weeks).toHaveLength(6);
    expect(weeks[0][0]).toMatchObject({ isoDate: '2026-07-26', isInMonth: false });
    expect(weeks[0][6]).toMatchObject({ isoDate: '2026-08-01', isInMonth: true });
  });

  it('needs only four weeks when a 28-day month starts on Sunday', () => {
    expect(buildCalendarWeeks({ year: 2026, monthIndex: 1 }, today)).toHaveLength(4);
  });

  it('marks only today', () => {
    const days = buildCalendarWeeks({ year: 2026, monthIndex: 10 }, today).flat();

    expect(days.filter((day) => day.isToday).map((day) => day.isoDate)).toEqual(['2026-11-13']);
  });
});
