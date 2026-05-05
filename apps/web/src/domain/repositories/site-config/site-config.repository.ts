import type { SiteConfig, SiteLink } from '../../entities/site-config/site-config.entity';

export interface UpdateSiteConfigInput {
  heroGreeting?: string;
  heroName?: string;
  heroRole?: string;
  heroDescription?: string;
  profileImageUrl?: string;
  heroTags?: string[];
  aboutTitle?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutTags?: string[];
  footerBio?: string;
  footerNavLinks?: SiteLink[];
  footerSocialLinks?: SiteLink[];
}

export interface SiteConfigRepository {
  get(): Promise<SiteConfig>;
  update(data: UpdateSiteConfigInput): Promise<SiteConfig>;
}
