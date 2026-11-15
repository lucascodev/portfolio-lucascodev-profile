export type InlineSegment =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'strong'; readonly text: string }
  | { readonly kind: 'link'; readonly text: string; readonly href: string };
