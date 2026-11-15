export interface AboutSection {
  readonly title: string;
  /** Each item may use inline markdown: **bold** and [label](url). */
  readonly items: readonly string[];
}
