export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  iconUrl: string | null;
  order: number;
}

export type SkillCategory =
  | 'mobile'
  | 'frontend'
  | 'backend'
  | 'ai'
  | 'devops'
  | 'database'
  | 'other';

export type SkillLevel = 'learning' | 'proficient' | 'expert';
