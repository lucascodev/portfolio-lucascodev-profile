import { describe, expect, it } from 'vitest';
import { getShellUserHost } from './get-shell-user-host.rule';

describe('getShellUserHost', () => {
  it('uses only the lowercased first name as the shell user', () => {
    expect(getShellUserHost('Lucas Reis')).toBe('lucas@portfolio');
  });

  it('ignores surrounding and repeated spaces', () => {
    expect(getShellUserHost('  Lucas   Pereira dos Reis ')).toBe('lucas@portfolio');
  });

  it('keeps a single name as it is, lowercased', () => {
    expect(getShellUserHost('Lucas')).toBe('lucas@portfolio');
  });
});
