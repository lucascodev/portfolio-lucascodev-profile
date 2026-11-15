import type { AboutSection } from './about-section.type';
import type { SocialLink } from './social-link.type';

export interface Profile {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly location: string;
  /** Short first-person introduction, one paragraph per item; inline markdown allowed. */
  readonly summary: readonly string[];
  readonly about: readonly AboutSection[];
  readonly email: string;
  readonly socialLinks: readonly SocialLink[];
}
