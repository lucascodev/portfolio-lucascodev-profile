interface WeekdayHeader {
  readonly initial: string;
  readonly name: string;
}

export const WEEKDAY_HEADERS: readonly WeekdayHeader[] = [
  { initial: 'D', name: 'domingo' },
  { initial: 'S', name: 'segunda-feira' },
  { initial: 'T', name: 'terça-feira' },
  { initial: 'Q', name: 'quarta-feira' },
  { initial: 'Q', name: 'quinta-feira' },
  { initial: 'S', name: 'sexta-feira' },
  { initial: 'S', name: 'sábado' },
];
