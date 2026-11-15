import type { SkillLevel } from './skill-level.type';

export interface Skill {
  readonly name: string;
  readonly level: SkillLevel;
}
