import { describe, expect, it } from 'vitest';
import type { SkillGroup } from '@/modules/portfolio/domain/types/skill-group.type';
import { selectSkillGroups } from './select-skill-groups.rule';

const skillGroups: SkillGroup[] = [
  { title: 'front-end', skills: [{ name: 'React', level: 'expert' }] },
  { title: 'back-end', skills: [{ name: 'NestJS', level: 'advanced' }, { name: 'Django', level: 'intermediate' }] },
];

describe('selectSkillGroups', () => {
  it('returns every group when no category is selected', () => {
    expect(selectSkillGroups(skillGroups, null)).toEqual(skillGroups);
  });

  it('returns only the group of the selected category', () => {
    expect(selectSkillGroups(skillGroups, 'back-end')).toEqual([skillGroups[1]]);
  });

  it('returns nothing for an unknown category', () => {
    expect(selectSkillGroups(skillGroups, 'jogos')).toEqual([]);
  });
});
