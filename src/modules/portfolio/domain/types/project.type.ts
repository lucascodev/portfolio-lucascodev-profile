export interface Project {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly repositoryUrl?: string;
  readonly liveUrl?: string;
}
