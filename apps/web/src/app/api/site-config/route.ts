import { PrismaSiteConfigRepository } from '@/infrastructure/repositories/prisma-site-config/prisma-site-config.repository';
import { GetSiteConfigUseCase } from '@/use-cases/site-config/get-site-config/get-site-config.use-case';
import { UpdateSiteConfigUseCase } from '@/use-cases/site-config/update-site-config/update-site-config.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaSiteConfigRepository();
const getUseCase = new GetSiteConfigUseCase(repository);
const updateUseCase = new UpdateSiteConfigUseCase(repository);

const siteLinkSchema = z.object({
  label: z.string().min(1).max(60),
  href: z.string().min(1).max(500),
});

const updateSchema = z.object({
  heroGreeting: z.string().min(1).max(80).optional(),
  heroName: z.string().min(1).max(120).optional(),
  heroRole: z.string().min(1).max(120).optional(),
  heroDescription: z.string().min(1).max(500).optional(),
  profileImageUrl: z.string().min(1).max(500).optional(),
  heroTags: z.array(z.string().min(1).max(40)).max(20).optional(),
  aboutTitle: z.string().min(1).max(80).optional(),
  aboutParagraph1: z.string().min(1).max(1500).optional(),
  aboutParagraph2: z.string().min(1).max(1500).optional(),
  aboutTags: z.array(z.string().min(1).max(40)).max(20).optional(),
  footerBio: z.string().min(1).max(300).optional(),
  footerNavLinks: z.array(siteLinkSchema).max(10).optional(),
  footerSocialLinks: z.array(siteLinkSchema).max(10).optional(),
});

export async function GET() {
  const siteConfig = await getUseCase.execute();
  return NextResponse.json(siteConfig);
}

export async function PATCH(request: Request) {
  const body: unknown = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const siteConfig = await updateUseCase.execute(parsed.data);
  return NextResponse.json(siteConfig);
}
