import { useState, type CSSProperties } from 'react';
import { countSkills } from '@/modules/portfolio/domain/rules/stack/count-skills.rule';
import { selectSkillGroups } from '@/modules/portfolio/domain/rules/stack/select-skill-groups.rule';
import { sortSkillsByLevel } from '@/modules/portfolio/domain/rules/stack/sort-skills-by-level.rule';
import type { SkillGroup } from '@/modules/portfolio/domain/types/skill-group.type';
import { PackageCard } from '@/modules/portfolio/presentation/components/linux-desktop/components/apps/stack-app/components/package-card/package-card';
import { STACK_GROUP_TONES } from '@/modules/portfolio/presentation/components/linux-desktop/constants/stack-group-tones.constant';
import styles from './stack-app.module.css';

interface StackAppProps {
  readonly skillGroups: readonly SkillGroup[];
}

const ALL_CATEGORIES = null;

function toneStyle(skillGroups: readonly SkillGroup[], group: SkillGroup): CSSProperties {
  const tone = STACK_GROUP_TONES[skillGroups.indexOf(group) % STACK_GROUP_TONES.length];
  return { '--group-tone': tone } as CSSProperties;
}

export function StackApp({ skillGroups }: StackAppProps) {
  const [category, setCategory] = useState<string | null>(ALL_CATEGORIES);
  const visibleGroups = selectSkillGroups(skillGroups, category);
  const totalSkills = countSkills(skillGroups);

  return (
    <div className={styles.packageManager}>
      <nav className={styles.sidebar} aria-label="Categorias">
        <button
          type="button"
          className={styles.category}
          aria-pressed={category === ALL_CATEGORIES}
          onClick={() => setCategory(ALL_CATEGORIES)}
        >
          <span>Todos</span>
          <span className={styles.count}>{totalSkills}</span>
        </button>
        {skillGroups.map((group) => (
          <button
            key={group.title}
            type="button"
            className={styles.category}
            style={toneStyle(skillGroups, group)}
            aria-pressed={category === group.title}
            onClick={() => setCategory(group.title)}
          >
            <span className={styles.categoryName}>
              <span className={styles.dot} aria-hidden="true" />
              {group.title}
            </span>
            <span className={styles.count}>{group.skills.length}</span>
          </button>
        ))}
      </nav>

      <div className={styles.main}>
        <p className={styles.command}>
          <span className={styles.prompt}>$</span> apt list --installed
        </p>
        <p className={styles.summary}>
          {totalSkills} pacotes em {skillGroups.length} categorias · <span className={styles.success}>✓ tudo atualizado</span>
        </p>

        {visibleGroups.map((group) => (
          <section
            key={group.title}
            className={styles.group}
            style={toneStyle(skillGroups, group)}
            aria-labelledby={`stack-group-${group.title}`}
          >
            <header className={styles.groupHeader}>
              <h3 id={`stack-group-${group.title}`} className={styles.groupTitle}>
                <span className={styles.dot} aria-hidden="true" />
                {group.title}
              </h3>
              <span className={styles.groupStatus}>
                {group.skills.length} <span className={styles.success}>✓ instalados</span>
              </span>
            </header>
            <ul className={styles.grid}>
              {sortSkillsByLevel(group.skills).map((skill) => (
                <PackageCard key={skill.name} skill={skill} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
