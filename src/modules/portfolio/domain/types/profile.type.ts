import type { AboutSection } from './about-section.type';
import type { SocialLink } from './social-link.type';

export interface Profile {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly location: string;
  readonly summary: readonly string[];
  readonly about: readonly AboutSection[];
  readonly email: string;
  readonly socialLinks: readonly SocialLink[];
}
