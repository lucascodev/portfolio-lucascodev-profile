import { describe, expect, it } from 'vitest';
import { tokenizeCodeLine } from './tokenize-code-line';

describe('tokenizeCodeLine', () => {
  it('keeps the original text when joining tokens', () => {
    const line = "export const name = 'Lucas'; // hi";

    expect(tokenizeCodeLine(line).map((token) => token.text).join('')).toBe(line);
  });

  it('classifies keywords, strings, numbers and comments', () => {
    const kinds = tokenizeCodeLine("const coffee = 42; 'yes' // note")
      .filter((token) => token.text.trim() !== '')
      .map((token) => token.kind);

    expect(kinds).toEqual(['keyword', 'plain', 'punctuation', 'number', 'punctuation', 'string', 'comment']);
  });

  it('marks identifiers followed by a parenthesis as functions and capitalized ones as types', () => {
    const tokens = tokenizeCodeLine('buildPortfolio(Developer)');

    expect(tokens[0]).toEqual({ text: 'buildPortfolio', kind: 'function' });
    expect(tokens[2]).toEqual({ text: 'Developer', kind: 'type' });
  });

  it('treats a string still being typed as a string', () => {
    expect(tokenizeCodeLine("'Luc").at(0)).toEqual({ text: "'Luc", kind: 'string' });
  });
});
