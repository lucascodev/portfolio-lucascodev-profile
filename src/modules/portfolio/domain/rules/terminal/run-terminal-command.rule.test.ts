import { describe, expect, it } from 'vitest';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import { runTerminalCommand } from './run-terminal-command.rule';

const content: PortfolioContent = {
  profile: {
    name: 'Lucas',
    role: 'Dev',
    headline: 'headline',
    location: 'Brasil',
    summary: ['Resumo.'],
    about: [{ title: 'Agora', items: ['Primeiro item.'] }],
    email: 'dev@example.com',
    socialLinks: [{ label: 'GitHub', url: 'https://github.com/' }],
  },
  skillGroups: [{ title: 'front-end', skills: [{ name: 'React', level: 'expert' }] }],
  projects: [{ title: 'Portfolio', description: 'Este site', tags: ['Three.js'] }],
};
const context = { content, now: new Date('2026-11-13T16:00:00') };
const texts = (input: string) => runTerminalCommand(input, context).lines.map((outputLine) => outputLine.text);

describe('runTerminalCommand', () => {
  it('prints nothing for an empty line', () => {
    expect(runTerminalCommand('   ', context)).toEqual({ lines: [] });
  });

  it('answers portfolio questions from the content', () => {
    expect(texts('whoami')).toEqual(['Lucas — Dev']);
    expect(texts('sobre')).toEqual(expect.arrayContaining(['# Lucas', '## Agora', '- Primeiro item.']));
    expect(texts('projetos').join('\n')).toContain('Portfolio');
    expect(texts('contato').join('\n')).toContain('dev@example.com');
  });

  it('is case insensitive and reads files with cat', () => {
    expect(texts('WHOAMI')).toEqual(['Lucas — Dev']);
    expect(texts('cat stack.txt').join('\n')).toContain('React');
    expect(runTerminalCommand('cat nada.txt', context).lines[0].tone).toBe('error');
  });

  it('shows only the first name as the shell user in neofetch', () => {
    const fullNameContext = { ...context, content: { ...content, profile: { ...content.profile, name: 'Lucas Reis' } } };
    const [userHost] = runTerminalCommand('neofetch', fullNameContext).lines;

    expect(userHost.text).toContain('lucas@portfolio');
  });

  it('asks the desktop to open apps, clear or power off', () => {
    expect(runTerminalCommand('open projetos', context).effect).toEqual({ kind: 'open-app', appId: 'projects' });
    expect(runTerminalCommand('clear', context).effect).toEqual({ kind: 'clear' });
    expect(runTerminalCommand('exit', context).effect).toEqual({ kind: 'power-off' });
  });

  it('explains unknown commands', () => {
    const [result] = runTerminalCommand('rm -rf /', context).lines;

    expect(result.tone).toBe('error');
    expect(result.text).toContain('help');
  });
});
