import type { SkillLevel } from '@/modules/portfolio/domain/types/skill-level.type';

export const SKILL_LEVEL_LABELS: Readonly<Record<SkillLevel, string>> = {
  beginner: 'básico',
  intermediate: 'intermediário',
  advanced: 'avançado',
  expert: 'especialista',
};
