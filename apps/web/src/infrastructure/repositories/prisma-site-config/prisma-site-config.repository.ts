import type { SiteConfig, SiteLink } from '@/domain/entities/site-config/site-config.entity';
import type {
  SiteConfigRepository,
  UpdateSiteConfigInput,
} from '@/domain/repositories/site-config/site-config.repository';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

const DEFAULT_SITE_CONFIG = {
  heroGreeting: 'Olá, eu sou',
  heroName: 'Lucas Pereira dos Reis',
  heroRole: 'Software Development Specialist',
  heroDescription:
    'Especialista em desenvolvimento Fullstack na FITec, trabalho com React, Next.js, TypeScript, NestJS e React Native. CEO & freelancer desde 2022, criando sistemas web, mobile e jogos digitais.',
  profileImageUrl: '/avatar.jpg',
  heroTags: ['React', 'Next.js', 'TypeScript', 'NestJS', 'React Native', 'IoT'],
  aboutTitle: 'Sobre mim',
  aboutParagraph1:
    'Sou Especialista em Desenvolvimento de Software na FITec, onde lidero a transição e otimização de plataformas usando React, Next.js e TypeScript. Atuo como desenvolvedor Fullstack em soluções IoT para gestão de recargas de veículos elétricos, trabalhando com NestJS, MQTT e React Native.',
  aboutParagraph2:
    'Como CEO & freelancer da LP Sistema de Segurança desde 2022, desenvolvo sistemas web, mobile e jogos digitais. Já criei um jogo 2D em Unity/C# para a Seven Boys na Campus Party Brasil e um globo 3D interativo em Three.js para a DTCOM. Cursando Engenharia de Software na UNIASSELVI, com formação técnica em Desenvolvimento Web pela TreinaWeb.',
  aboutTags: ['Clean Architecture', 'IoT', 'Fullstack', 'Mobile', 'Game Dev'],
  footerBio: 'Software Development Specialist na FITec. Fullstack, Mobile e Game Dev desde 2021.',
  footerNavLinks: [
    { label: 'Projetos', href: '/projects' },
    { label: 'Sobre', href: '/about' },
    { label: 'Contato', href: '/contact' },
  ],
  footerSocialLinks: [
    { label: 'GitHub', href: 'https://github.com/lucascodev' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lucas-pereira-dos-reis-60a49b18b/' },
  ],
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toSiteLinks(value: unknown): SiteLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { label?: unknown; href?: unknown } => {
      return typeof item === 'object' && item !== null;
    })
    .map((item) => ({
      label: typeof item.label === 'string' ? item.label : '',
      href: typeof item.href === 'string' ? item.href : '',
    }))
    .filter((item) => item.label.trim() !== '' && item.href.trim() !== '');
}

function toEntity(raw: {
  id: string;
  heroGreeting: string;
  heroName: string;
  heroRole: string;
  heroDescription: string;
  profileImageUrl: string;
  heroTags: unknown;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutTags: unknown;
  footerBio: string;
  footerNavLinks: unknown;
  footerSocialLinks: unknown;
  createdAt: Date;
  updatedAt: Date;
}): SiteConfig {
  return {
    ...raw,
    heroTags: toStringArray(raw.heroTags),
    aboutTags: toStringArray(raw.aboutTags),
    footerNavLinks: toSiteLinks(raw.footerNavLinks),
    footerSocialLinks: toSiteLinks(raw.footerSocialLinks),
  };
}

export class PrismaSiteConfigRepository implements SiteConfigRepository {
  private async getOrCreateRow() {
    const existing = await prisma.siteConfig.findFirst();
    if (existing) return existing;

    return prisma.siteConfig.create({
      data: DEFAULT_SITE_CONFIG,
    });
  }

  async get(): Promise<SiteConfig> {
    const row = await this.getOrCreateRow();
    return toEntity(row);
  }

  async update(data: UpdateSiteConfigInput): Promise<SiteConfig> {
    const existing = await this.getOrCreateRow();
    const row = await prisma.siteConfig.update({
      where: { id: existing.id },
      data: {
        ...data,
        heroTags: data.heroTags !== undefined ? data.heroTags : undefined,
        aboutTags: data.aboutTags !== undefined ? data.aboutTags : undefined,
        footerNavLinks:
          data.footerNavLinks !== undefined
            ? (data.footerNavLinks as unknown as Prisma.InputJsonValue)
            : undefined,
        footerSocialLinks:
          data.footerSocialLinks !== undefined
            ? (data.footerSocialLinks as unknown as Prisma.InputJsonValue)
            : undefined,
      },
    });

    return toEntity(row);
  }
}
