import type { SkillGroup } from '@/modules/portfolio/domain/types/skill-group.type';

export function selectSkillGroups(
  skillGroups: readonly SkillGroup[],
  category: string | null,
): readonly SkillGroup[] {
  if (category === null) return skillGroups;
  return skillGroups.filter((group) => group.title === category);
}
