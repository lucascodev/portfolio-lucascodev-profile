import { SKILL_LEVELS } from '@/modules/portfolio/domain/constants/skill-levels.constant';
import type { SkillLevel } from '@/modules/portfolio/domain/types/skill-level.type';

export function getSkillLevelRank(level: SkillLevel): number {
  return SKILL_LEVELS.indexOf(level) + 1;
}
