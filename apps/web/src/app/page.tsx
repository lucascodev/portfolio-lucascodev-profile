import { PrismaSiteConfigRepository } from '@/infrastructure/repositories/prisma-site-config/prisma-site-config.repository';
import { GetSiteConfigUseCase } from '@/use-cases/site-config/get-site-config/get-site-config.use-case';
import { HomeView } from '@/presentation/view/home/home.view';

export default async function HomePage() {
  const siteConfig = await new GetSiteConfigUseCase(
    new PrismaSiteConfigRepository(),
  ).execute().catch(() => undefined);

  return <HomeView siteConfig={siteConfig} />;
}
