import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { HeroSection } from './components/hero-section/hero-section.component';
import { CertificationsStrip } from './components/certifications-strip/certifications-strip.component';
import { FeaturedProjects } from './components/featured-projects/featured-projects.component';
import { Text } from '@portfolio/design-system';

interface HomeViewProps {
  readonly siteConfig?: SiteConfig;
}

export function HomeView({ siteConfig }: HomeViewProps) {
  return (
    <main>
      <HeroSection initialData={siteConfig} />
      <CertificationsStrip />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Text variant="h2" className="mb-2">
          Projetos em Destaque
        </Text>
        <Text variant="body" color="secondary" className="mb-10">
          Soluções que construí — do mobile ao backend e IA.
        </Text>
        <FeaturedProjects />
      </section>
    </main>
  );
}
