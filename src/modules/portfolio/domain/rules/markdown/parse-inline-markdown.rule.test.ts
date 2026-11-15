import { describe, expect, it } from 'vitest';
import { parseInlineMarkdown } from './parse-inline-markdown.rule';

describe('parseInlineMarkdown', () => {
  it('keeps plain text as a single segment', () => {
    expect(parseInlineMarkdown('Sem marcação.')).toEqual([{ kind: 'text', text: 'Sem marcação.' }]);
  });

  it('splits bold text out of the sentence', () => {
    expect(parseInlineMarkdown('Atuo na **FITec** desde 2023.')).toEqual([
      { kind: 'text', text: 'Atuo na ' },
      { kind: 'strong', text: 'FITec' },
      { kind: 'text', text: ' desde 2023.' },
    ]);
  });

  it('reads links with their label and address', () => {
    expect(parseInlineMarkdown('[GitHub](https://github.com/lucascodev)')).toEqual([
      { kind: 'link', text: 'GitHub', href: 'https://github.com/lucascodev' },
    ]);
  });

  it('handles bold and links side by side', () => {
    expect(parseInlineMarkdown('**Aura** e [site](https://a.b)')).toEqual([
      { kind: 'strong', text: 'Aura' },
      { kind: 'text', text: ' e ' },
      { kind: 'link', text: 'site', href: 'https://a.b' },
    ]);
  });

  it('leaves unclosed markers as plain text', () => {
    expect(parseInlineMarkdown('**sem fim')).toEqual([{ kind: 'text', text: '**sem fim' }]);
  });
});
