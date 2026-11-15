import { describe, expect, it } from 'vitest';
import type { Skill } from '@/modules/portfolio/domain/types/skill.type';
import { sortSkillsByLevel } from './sort-skills-by-level.rule';

const names = (skills: readonly Skill[]) => skills.map((skill) => skill.name);

describe('sortSkillsByLevel', () => {
  it('puts the highest levels first', () => {
    const skills: Skill[] = [
      { name: 'Flutter', level: 'beginner' },
      { name: 'React', level: 'expert' },
      { name: 'Angular', level: 'intermediate' },
    ];

    expect(names(sortSkillsByLevel(skills))).toEqual(['React', 'Angular', 'Flutter']);
  });

  it('keeps the written order between skills of the same level', () => {
    const skills: Skill[] = [
      { name: 'Vite', level: 'advanced' },
      { name: 'Next.js', level: 'advanced' },
    ];

    expect(names(sortSkillsByLevel(skills))).toEqual(['Vite', 'Next.js']);
  });

  it('does not change the original list', () => {
    const skills: Skill[] = [
      { name: 'Flutter', level: 'beginner' },
      { name: 'React', level: 'expert' },
    ];

    sortSkillsByLevel(skills);

    expect(names(skills)).toEqual(['Flutter', 'React']);
  });
});
