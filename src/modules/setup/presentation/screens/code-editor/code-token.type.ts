export type CodeTokenKind = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'type' | 'punctuation' | 'plain';

export interface CodeToken {
  readonly text: string;
  readonly kind: CodeTokenKind;
}
