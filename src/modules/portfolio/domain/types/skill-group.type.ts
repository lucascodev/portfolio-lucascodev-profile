import type { Skill } from './skill.type';

export interface SkillGroup {
  readonly title: string;
  readonly skills: readonly Skill[];
}
