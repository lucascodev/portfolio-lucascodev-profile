const LOCALE = 'pt-BR';

export const CLOCK_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export const WEEKDAY_FORMATTER = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });

export const FULL_DATE_FORMATTER = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' });

export const MONTH_FORMATTER = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
