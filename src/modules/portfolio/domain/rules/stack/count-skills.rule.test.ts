import { describe, expect, it } from 'vitest';
import type { SkillGroup } from '@/modules/portfolio/domain/types/skill-group.type';
import { countSkills } from './count-skills.rule';

describe('countSkills', () => {
  it('sums the skills of every group', () => {
    const skillGroups: SkillGroup[] = [
      {
        title: 'front-end',
        skills: [
          { name: 'React', level: 'expert' },
          { name: 'Vite', level: 'advanced' },
        ],
      },
      { title: 'mobile', skills: [{ name: 'Expo', level: 'advanced' }] },
    ];

    expect(countSkills(skillGroups)).toBe(3);
  });

  it('is zero when there are no groups', () => {
    expect(countSkills([])).toBe(0);
  });
});
