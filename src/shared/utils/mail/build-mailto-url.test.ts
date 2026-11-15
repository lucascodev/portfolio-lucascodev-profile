import { describe, expect, it } from 'vitest';
import { buildMailtoUrl } from './build-mailto-url';

describe('buildMailtoUrl', () => {
  it('encodes subject and body so spaces and accents survive mail clients', () => {
    const url = buildMailtoUrl({ to: 'dev@example.com', subject: 'Olá, tudo bem?', body: 'Linha 1\nLinha 2' });

    expect(url.startsWith('mailto:dev@example.com?')).toBe(true);
    expect(url).not.toContain('+');
    expect(decodeURIComponent(url)).toContain('subject=Olá, tudo bem?');
    expect(decodeURIComponent(url)).toContain('body=Linha 1\nLinha 2');
  });
});
