import { describe, expect, it } from 'vitest';
import { shiftCalendarMonth } from './shift-calendar-month.rule';

describe('shiftCalendarMonth', () => {
  it('moves forward and backward within the same year', () => {
    expect(shiftCalendarMonth({ year: 2026, monthIndex: 10 }, 1)).toEqual({ year: 2026, monthIndex: 11 });
    expect(shiftCalendarMonth({ year: 2026, monthIndex: 10 }, -1)).toEqual({ year: 2026, monthIndex: 9 });
  });

  it('crosses into the next and the previous year', () => {
    expect(shiftCalendarMonth({ year: 2026, monthIndex: 11 }, 1)).toEqual({ year: 2027, monthIndex: 0 });
    expect(shiftCalendarMonth({ year: 2026, monthIndex: 0 }, -1)).toEqual({ year: 2025, monthIndex: 11 });
  });
});
