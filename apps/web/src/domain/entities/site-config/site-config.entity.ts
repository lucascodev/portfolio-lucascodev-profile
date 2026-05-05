export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  id: string;
  heroGreeting: string;
  heroName: string;
  heroRole: string;
  heroDescription: string;
  profileImageUrl: string;
  heroTags: string[];
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutTags: string[];
  footerBio: string;
  footerNavLinks: SiteLink[];
  footerSocialLinks: SiteLink[];
  createdAt: Date;
  updatedAt: Date;
}
