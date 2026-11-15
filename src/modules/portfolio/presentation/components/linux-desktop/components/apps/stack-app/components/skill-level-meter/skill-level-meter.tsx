import { SKILL_LEVELS } from '@/modules/portfolio/domain/constants/skill-levels.constant';
import { getSkillLevelRank } from '@/modules/portfolio/domain/rules/stack/get-skill-level-rank.rule';
import type { SkillLevel } from '@/modules/portfolio/domain/types/skill-level.type';
import { SKILL_LEVEL_LABELS } from '@/modules/portfolio/presentation/components/linux-desktop/constants/skill-level-labels.constant';
import styles from './skill-level-meter.module.css';

interface SkillLevelMeterProps {
  readonly level: SkillLevel;
}

export function SkillLevelMeter({ level }: SkillLevelMeterProps) {
  const rank = getSkillLevelRank(level);

  return (
    <span className={styles.meter}>
      <span className={styles.segments} aria-hidden="true">
        {SKILL_LEVELS.map((segmentLevel, index) => (
          <span key={segmentLevel} className={styles.segment} data-filled={index < rank} />
        ))}
      </span>
      <span className={styles.label}>{SKILL_LEVEL_LABELS[level]}</span>
    </span>
  );
}
