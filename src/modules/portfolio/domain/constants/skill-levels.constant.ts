import type { SkillLevel } from '@/modules/portfolio/domain/types/skill-level.type';

/** Ordered from the lowest to the highest level; the position defines the rank. */
export const SKILL_LEVELS: readonly SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
