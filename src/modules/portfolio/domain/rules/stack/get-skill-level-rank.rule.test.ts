import { describe, expect, it } from 'vitest';
import { getSkillLevelRank } from './get-skill-level-rank.rule';

describe('getSkillLevelRank', () => {
  it('ranks the levels from 1 to 4, lowest first', () => {
    expect(getSkillLevelRank('beginner')).toBe(1);
    expect(getSkillLevelRank('intermediate')).toBe(2);
    expect(getSkillLevelRank('advanced')).toBe(3);
    expect(getSkillLevelRank('expert')).toBe(4);
  });
});
