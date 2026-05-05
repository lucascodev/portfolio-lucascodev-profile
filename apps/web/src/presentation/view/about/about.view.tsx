'use client';

import type { SkillCategory } from '@/domain/entities/skill/skill.entity';
import { useExperiencesQuery } from '@/presentation/hooks/use-experiences-query/use-experiences-query.hook';
import { useSiteConfigQuery } from '@/presentation/hooks/use-site-config-query/use-site-config-query.hook';
import { useSkillsQuery } from '@/presentation/hooks/use-skills-query/use-skills-query.hook';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { Button, Text } from '@portfolio/design-system';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { CreateExperienceModal } from './components/create-experience-modal/create-experience-modal.component';
import { CreateSkillModal } from './components/create-skill-modal/create-skill-modal.component';
import { EditAboutBioModal } from './components/edit-about-bio-modal/edit-about-bio-modal.component';
import { SkillLevel } from './components/skill-level/skill-level.component';
import { Timeline } from './components/timeline/timeline.component';

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  mobile: 'Mobile',
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'IA & ML',
  devops: 'DevOps',
  database: 'Banco de Dados',
};

export function AboutView() {
  const { data: skills = [] } = useSkillsQuery();
  const { data: experiences = [] } = useExperiencesQuery();
  const { data: siteConfig } = useSiteConfigQuery();
  const isEditMode = useAdminStore((s) => s.isEditMode);
  const [isCreateSkillModalOpen, setIsCreateSkillModalOpen] = useState(false);
  const [isCreateExperienceModalOpen, setIsCreateExperienceModalOpen] = useState(false);
  const [isEditBioModalOpen, setIsEditBioModalOpen] = useState(false);

  const skillsByCategory = skills.reduce<Partial<Record<SkillCategory, typeof skills>>>(
    (acc, skill) => {
      const cat = skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(skill);
      return acc;
    },
    {},
  );

  const aboutConfig = useMemo(
    () => ({
      title: siteConfig?.aboutTitle ?? 'Sobre mim',
      paragraph1:
        siteConfig?.aboutParagraph1 ??
        'Sou um desenvolvedor fullstack e mobile com foco em entregar produtos de alta qualidade. Trabalho com Flutter e React Native para mobile, NestJS e FastAPI no backend, e aplico IA e Visão Computacional com YOLO e LLMs para criar soluções inteligentes.',
      paragraph2:
        siteConfig?.aboutParagraph2 ??
        'Gosto de design minimalista, código limpo e arquiteturas que escalam. Quando não estou codando, estou estudando os últimos avanços em IA generativa e sistemas distribuídos.',
      tags: siteConfig?.aboutTags ?? [
        'Clean Code',
        'Clean Architecture',
        'TDD',
        'DDD',
        'Minimalismo',
      ],
      imageUrl: siteConfig?.profileImageUrl ?? '/avatar.jpg',
      imageAlt: siteConfig?.heroName ?? 'Lucas Codev',
    }),
    [siteConfig],
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-24">
      {/* Bio */}
      <section className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <Text variant="h2">{aboutConfig.title}</Text>
            {isEditMode && siteConfig && (
              <EditButton onClick={() => setIsEditBioModalOpen(true)} label="Editar seção" />
            )}
          </div>
          <Text variant="body" color="secondary" className="mb-4">
            {aboutConfig.paragraph1}
          </Text>
          <Text variant="body" color="secondary" className="mb-6">
            {aboutConfig.paragraph2}
          </Text>
          <div className="flex flex-wrap gap-2">
            {aboutConfig.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-1 font-mono text-xs text-[#6EE7B7]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-[#2A2A2A]">
            <Image
              src={aboutConfig.imageUrl}
              alt={aboutConfig.imageAlt}
              unoptimized
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="flex h-full w-full items-center justify-center bg-[#111111] font-mono text-5xl font-bold text-[#6EE7B7]">LC</div>';
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-24">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Text variant="h3">Stack Técnica</Text>
          {isEditMode && (
            <Button variant="secondary" size="sm" onClick={() => setIsCreateSkillModalOpen(true)}>
              Nova skill
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(skillsByCategory) as [SkillCategory, typeof skills][]).map(
            ([category, categorySkills]) => (
              <div key={category}>
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-[#525252]">
                  {SKILL_CATEGORY_LABELS[category]}
                </p>
                <div className="flex flex-col gap-2">
                  {categorySkills.map((skill) => (
                    <SkillLevel key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Experience */}
      <section>
        <div className="mb-8 flex items-center justify-between gap-4">
          <Text variant="h3">Experiência</Text>
          {isEditMode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateExperienceModalOpen(true)}
            >
              Nova experiência
            </Button>
          )}
        </div>
        {experiences.length > 0 ? (
          <Timeline experiences={experiences} />
        ) : (
          <p className="text-sm text-[#737373]">Em breve...</p>
        )}
      </section>

      {isCreateSkillModalOpen && (
        <CreateSkillModal
          isOpen={isCreateSkillModalOpen}
          onClose={() => setIsCreateSkillModalOpen(false)}
        />
      )}

      {isCreateExperienceModalOpen && (
        <CreateExperienceModal
          isOpen={isCreateExperienceModalOpen}
          onClose={() => setIsCreateExperienceModalOpen(false)}
        />
      )}

      {siteConfig && (
        <EditAboutBioModal
          isOpen={isEditBioModalOpen}
          onClose={() => setIsEditBioModalOpen(false)}
          config={siteConfig}
        />
      )}
    </main>
  );
}
