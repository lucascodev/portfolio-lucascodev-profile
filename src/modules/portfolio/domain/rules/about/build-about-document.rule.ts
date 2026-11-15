import type { AboutSection } from '@/modules/portfolio/domain/types/about-section.type';
import type { MarkdownLine } from '@/modules/portfolio/domain/types/markdown/markdown-line.type';
import type { Profile } from '@/modules/portfolio/domain/types/profile.type';

const LINKS_SECTION_TITLE = 'Links';
const BLANK: MarkdownLine = { kind: 'blank' };

function sectionLines(section: AboutSection): readonly MarkdownLine[] {
  return [
    BLANK,
    { kind: 'heading', level: 2, text: section.title },
    ...section.items.map((text): MarkdownLine => ({ kind: 'bullet', text })),
  ];
}

function linksSection(profile: Profile): AboutSection {
  return {
    title: LINKS_SECTION_TITLE,
    items: [...profile.socialLinks.map((link) => `[${link.label}](${link.url})`), `[E-mail](mailto:${profile.email})`],
  };
}

/** The lines of sobre.md: who, the headline, the introduction, the about sections and the links, separated by blank lines like a real file. */
export function buildAboutDocument(profile: Profile): readonly MarkdownLine[] {
  return [
    { kind: 'heading', level: 1, text: profile.name },
    { kind: 'paragraph', text: `**${profile.role}** · 📍 ${profile.location}` },
    BLANK,
    { kind: 'quote', text: profile.headline },
    ...profile.summary.flatMap((text): readonly MarkdownLine[] => [BLANK, { kind: 'paragraph', text }]),
    ...[...profile.about, linksSection(profile)].flatMap(sectionLines),
  ];
}
