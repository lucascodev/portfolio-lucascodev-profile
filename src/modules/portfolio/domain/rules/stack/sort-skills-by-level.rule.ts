import type { Skill } from '@/modules/portfolio/domain/types/skill.type';
import { getSkillLevelRank } from './get-skill-level-rank.rule';

/** Highest level first; skills on the same level keep the order they were written in. */
export function sortSkillsByLevel(skills: readonly Skill[]): readonly Skill[] {
  return [...skills].sort((first, second) => getSkillLevelRank(second.level) - getSkillLevelRank(first.level));
}
