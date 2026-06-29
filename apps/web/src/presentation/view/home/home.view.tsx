import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { HeroSection } from './components/hero-section/hero-section.component';
import { ExperiencePreview } from './components/experience-preview/experience-preview.component';
import { FeaturedProjects } from './components/featured-projects/featured-projects.component';
import { Text } from '@portfolio/design-system';

interface HomeViewProps {
  readonly siteConfig?: SiteConfig;
}

export function HomeView({ siteConfig }: HomeViewProps) {
  return (
    <main>
      <HeroSection initialData={siteConfig} />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Text variant="h2" className="mb-2">
          Experiência
        </Text>
        <Text variant="body" color="secondary" className="mb-10">
          Empresas e projetos onde atuei.
        </Text>
        <ExperiencePreview />
        <a
          href="/about"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs text-[#525252] transition-colors hover:text-[#6EE7B7]"
        >
          Ver experiência completa →
        </a>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
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
