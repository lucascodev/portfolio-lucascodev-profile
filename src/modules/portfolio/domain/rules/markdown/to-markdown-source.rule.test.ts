import { describe, expect, it } from 'vitest';
import { toMarkdownSource } from './to-markdown-source.rule';

describe('toMarkdownSource', () => {
  it('writes each line kind with its markdown marker', () => {
    expect(toMarkdownSource({ kind: 'heading', level: 1, text: 'Lucas' })).toBe('# Lucas');
    expect(toMarkdownSource({ kind: 'heading', level: 2, text: 'Agora' })).toBe('## Agora');
    expect(toMarkdownSource({ kind: 'quote', text: 'frase' })).toBe('> frase');
    expect(toMarkdownSource({ kind: 'bullet', text: 'item' })).toBe('- item');
    expect(toMarkdownSource({ kind: 'paragraph', text: 'texto' })).toBe('texto');
    expect(toMarkdownSource({ kind: 'blank' })).toBe('');
  });
});
