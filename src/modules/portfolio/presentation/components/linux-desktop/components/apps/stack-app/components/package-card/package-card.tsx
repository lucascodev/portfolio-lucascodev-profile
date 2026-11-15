import { getSkillMonogram } from '@/modules/portfolio/domain/rules/stack/get-skill-monogram.rule';
import type { Skill } from '@/modules/portfolio/domain/types/skill.type';
import { SkillLevelMeter } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/stack-app/components/skill-level-meter/skill-level-meter';
import styles from './package-card.module.css';

interface PackageCardProps {
  readonly skill: Skill;
}

export function PackageCard({ skill }: PackageCardProps) {
  return (
    <li className={styles.card}>
      <span className={styles.monogram} aria-hidden="true">
        {getSkillMonogram(skill.name)}
      </span>
      <span className={styles.details}>
        <span className={styles.name}>{skill.name}</span>
        <SkillLevelMeter level={skill.level} />
      </span>
    </li>
  );
}
