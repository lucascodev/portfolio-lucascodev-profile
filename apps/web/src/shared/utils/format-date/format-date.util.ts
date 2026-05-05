export function formatDate(date: Date | string, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(new Date(date));
}

export function formatDateRange(
  start: Date | string,
  end: Date | string | null,
  locale = 'pt-BR',
): string {
  const startStr = formatDate(start, locale);
  if (!end) return `${startStr} — presente`;
  return `${startStr} — ${formatDate(end, locale)}`;
}
