import type { SkillGroup } from '@/modules/portfolio/domain/types/skill-group.type';

export function countSkills(skillGroups: readonly SkillGroup[]): number {
  return skillGroups.reduce((total, group) => total + group.skills.length, 0);
}
