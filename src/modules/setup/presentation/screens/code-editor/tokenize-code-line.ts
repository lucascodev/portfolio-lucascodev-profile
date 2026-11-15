import type { CodeToken, CodeTokenKind } from './code-token.type';

const KEYWORDS = new Set([
  'as', 'async', 'await', 'class', 'const', 'else', 'export', 'extends', 'false', 'for', 'from', 'function',
  'if', 'implements', 'import', 'interface', 'let', 'new', 'null', 'readonly', 'return', 'true', 'type',
  'undefined', 'while',
]);

const TOKEN_PATTERN =
  /(?<comment>\/\/.*$)|(?<string>'(?:[^'\\]|\\.)*'?|"(?:[^"\\]|\\.)*"?|`(?:[^`\\]|\\.)*`?)|(?<number>\b\d+(?:\.\d+)?\b)|(?<word>[A-Za-z_$][\w$]*)|(?<space>\s+)|(?<symbol>.)/g;

function classifyWord(word: string, nextCharacter: string | undefined): CodeTokenKind {
  if (KEYWORDS.has(word)) return 'keyword';
  if (nextCharacter === '(') return 'function';
  if (/^[A-Z]/.test(word)) return 'type';
  return 'plain';
}

export function tokenizeCodeLine(line: string): CodeToken[] {
  return Array.from(line.matchAll(TOKEN_PATTERN), (match): CodeToken => {
    const [text] = match;
    const groups = match.groups ?? {};

    if (groups.comment) return { text, kind: 'comment' };
    if (groups.string) return { text, kind: 'string' };
    if (groups.number) return { text, kind: 'number' };
    if (groups.word) return { text, kind: classifyWord(text, line[match.index + text.length]) };
    if (groups.space) return { text, kind: 'plain' };
    return { text, kind: 'punctuation' };
  });
}
