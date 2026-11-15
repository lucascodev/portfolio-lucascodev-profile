import { describe, expect, it } from 'vitest';
import type { Profile } from '@/modules/portfolio/domain/types/profile.type';
import { toMarkdownSource } from '@/modules/portfolio/domain/rules/markdown/to-markdown-source.rule';
import { buildAboutDocument } from './build-about-document.rule';

const profile: Profile = {
  name: 'Lucas Reis',
  role: 'Desenvolvedor Full Stack',
  headline: 'Do banco de dados ao pixel.',
  location: 'Santa Fé do Sul, SP',
  summary: ['Sou desenvolvedor full stack.', 'Comecei no PHP.'],
  about: [
    { title: 'Agora', items: ['Trabalho na **FITec**.'] },
    { title: 'Formação', items: ['Engenharia de Software', 'GitHub Copilot'] },
  ],
  email: 'dev@example.com',
  socialLinks: [{ label: 'GitHub', url: 'https://github.com/lucascodev' }],
};

describe('buildAboutDocument', () => {
  it('writes the whole file in order, with blank lines between blocks and none at the end', () => {
    expect(buildAboutDocument(profile).map(toMarkdownSource)).toEqual([
      '# Lucas Reis',
      '**Desenvolvedor Full Stack** · 📍 Santa Fé do Sul, SP',
      '',
      '> Do banco de dados ao pixel.',
      '',
      'Sou desenvolvedor full stack.',
      '',
      'Comecei no PHP.',
      '',
      '## Agora',
      '- Trabalho na **FITec**.',
      '',
      '## Formação',
      '- Engenharia de Software',
      '- GitHub Copilot',
      '',
      '## Links',
      '- [GitHub](https://github.com/lucascodev)',
      '- [E-mail](mailto:dev@example.com)',
    ]);
  });
});
