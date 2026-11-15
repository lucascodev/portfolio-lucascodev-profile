import { describe, expect, it } from 'vitest';
import { getSkillMonogram } from './get-skill-monogram.rule';

describe('getSkillMonogram', () => {
  it('keeps short names as they are, symbols included', () => {
    expect(getSkillMonogram('C#')).toBe('C#');
    expect(getSkillMonogram('C++')).toBe('C++');
    expect(getSkillMonogram('AWS')).toBe('AWS');
  });

  it('uses the initials of the first two words of a multi-word name', () => {
    expect(getSkillMonogram('GitHub Actions')).toBe('GA');
    expect(getSkillMonogram('React Native')).toBe('RN');
  });

  it('uses up to two capitals of a single-word name', () => {
    expect(getSkillMonogram('TypeScript')).toBe('TS');
    expect(getSkillMonogram('PostgreSQL')).toBe('PS');
    expect(getSkillMonogram('Next.js')).toBe('N');
  });

  it('falls back to the uppercased first letter when the name has no capitals', () => {
    expect(getSkillMonogram('pnpm')).toBe('P');
  });
});
