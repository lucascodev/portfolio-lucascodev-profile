export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
  order: number;
}

export type LanguageLevel = 'basic' | 'elementary' | 'intermediate' | 'advanced' | 'fluent' | 'native';
