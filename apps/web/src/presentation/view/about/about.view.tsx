'use client';

import type { Certification } from '@/domain/entities/certification/certification.entity';
import type { Education } from '@/domain/entities/education/education.entity';
import type { Language } from '@/domain/entities/language/language.entity';
import type { SkillCategory } from '@/domain/entities/skill/skill.entity';
import { useCertificationsQuery } from '@/presentation/hooks/use-certifications-query/use-certifications-query.hook';
import { useEducationQuery } from '@/presentation/hooks/use-education-query/use-education-query.hook';
import { useExperiencesQuery } from '@/presentation/hooks/use-experiences-query/use-experiences-query.hook';
import { useLanguagesQuery } from '@/presentation/hooks/use-languages-query/use-languages-query.hook';
import { useSiteConfigQuery } from '@/presentation/hooks/use-site-config-query/use-site-config-query.hook';
import { useSkillsQuery } from '@/presentation/hooks/use-skills-query/use-skills-query.hook';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { fadeUp, stagger } from '@/shared/utils/motion/motion.variants';
import { Button, Text } from '@portfolio/design-system';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { CreateCertificationModal } from './components/create-certification-modal/create-certification-modal.component';
import { CreateEducationModal } from './components/create-education-modal/create-education-modal.component';
import { CreateExperienceModal } from './components/create-experience-modal/create-experience-modal.component';
import { CreateLanguageModal } from './components/create-language-modal/create-language-modal.component';
import { CreateSkillModal } from './components/create-skill-modal/create-skill-modal.component';
import { EditAboutBioModal } from './components/edit-about-bio-modal/edit-about-bio-modal.component';
import { EditCertificationModal } from './components/edit-certification-modal/edit-certification-modal.component';
import { EditEducationModal } from './components/edit-education-modal/edit-education-modal.component';
import { EditLanguageModal } from './components/edit-language-modal/edit-language-modal.component';
import { SkillLevel } from './components/skill-level/skill-level.component';
import { Timeline } from './components/timeline/timeline.component';

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  mobile: 'Mobile',
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'IA & ML',
  devops: 'DevOps',
  database: 'Banco de Dados',
  other: 'Outros',
};

const LANGUAGE_LEVEL_LABELS: Record<Language['level'], string> = {
  basic: 'Básico',
  elementary: 'Elementar',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
  fluent: 'Fluente',
  native: 'Nativo',
};

export function AboutView() {
  const { data: skills = [] } = useSkillsQuery();
  const { data: experiences = [] } = useExperiencesQuery();
  const { data: certifications = [] } = useCertificationsQuery();
  const { data: education = [] } = useEducationQuery();
  const { data: languages = [] } = useLanguagesQuery();
  const { data: siteConfig } = useSiteConfigQuery();
  const isEditMode = useAdminStore((s) => s.isEditMode);
  const [isCreateSkillModalOpen, setIsCreateSkillModalOpen] = useState(false);
  const [isCreateExperienceModalOpen, setIsCreateExperienceModalOpen] = useState(false);
  const [isCreateCertificationModalOpen, setIsCreateCertificationModalOpen] = useState(false);
  const [isCreateEducationModalOpen, setIsCreateEducationModalOpen] = useState(false);
  const [isCreateLanguageModalOpen, setIsCreateLanguageModalOpen] = useState(false);
  const [isEditBioModalOpen, setIsEditBioModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

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
      <motion.section
        className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={fadeUp}>
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
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center">
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
        </motion.div>
      </motion.section>

      {/* Skills */}
      <motion.section
        className="mb-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
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
      </motion.section>

      {/* Experience */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
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
      </motion.section>

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

      {/* Education */}
      <motion.section className="mb-24" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <Text variant="h3">Formação Acadêmica</Text>
          {isEditMode && (
            <Button variant="secondary" size="sm" onClick={() => setIsCreateEducationModalOpen(true)}>Nova formação</Button>
          )}
        </div>
        {education.length > 0 ? (
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div key={edu.id} className="relative rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-5">
                {isEditMode && (
                  <button onClick={() => setEditingEducation(edu)} className="absolute right-4 top-4 rounded-md border border-[#2A2A2A] px-2 py-1 font-mono text-xs text-[#525252] transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7]">editar</button>
                )}
                <p className="font-semibold text-white">{edu.institution}</p>
                <p className="text-sm text-[#A3A3A3]">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>
                <p className="mt-1 font-mono text-xs text-[#525252]">
                  {edu.startYear} — {edu.current ? 'presente' : (edu.endYear ?? '?')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#737373]">Em breve...</p>
        )}
      </motion.section>

      {/* Certifications */}
      <motion.section className="mb-24" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <Text variant="h3">Certificações</Text>
          {isEditMode && (
            <Button variant="secondary" size="sm" onClick={() => setIsCreateCertificationModalOpen(true)}>Nova certificação</Button>
          )}
        </div>
        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="relative flex items-start gap-3 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-4">
                {isEditMode && (
                  <button onClick={() => setEditingCertification(cert)} className="absolute right-3 top-3 rounded-md border border-[#2A2A2A] px-2 py-0.5 font-mono text-xs text-[#525252] transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7]">editar</button>
                )}
                <span className="mt-0.5 text-[#6EE7B7]">▸</span>
                <div className="min-w-0 flex-1 pr-10">
                  {cert.url ? (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-[#6EE7B7] transition-colors">{cert.name}</a>
                  ) : (
                    <p className="font-medium text-white">{cert.name}</p>
                  )}
                  <p className="text-sm text-[#525252]">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#737373]">Em breve...</p>
        )}
      </motion.section>

      {/* Languages */}
      <motion.section className="mb-24" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <Text variant="h3">Idiomas</Text>
          {isEditMode && (
            <Button variant="secondary" size="sm" onClick={() => setIsCreateLanguageModalOpen(true)}>Novo idioma</Button>
          )}
        </div>
        {languages.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <div key={lang.id} className="relative flex items-center gap-3 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] px-5 py-3">
                {isEditMode && (
                  <button onClick={() => setEditingLanguage(lang)} className="absolute -right-1 -top-1 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-1.5 py-0.5 font-mono text-xs text-[#525252] transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7]">✎</button>
                )}
                <span className="font-medium text-white">{lang.name}</span>
                <span className="rounded-full bg-[#6EE7B7]/10 px-2 py-0.5 font-mono text-xs text-[#6EE7B7]">{LANGUAGE_LEVEL_LABELS[lang.level]}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#737373]">Em breve...</p>
        )}
      </motion.section>

      {siteConfig && (
        <EditAboutBioModal
          isOpen={isEditBioModalOpen}
          onClose={() => setIsEditBioModalOpen(false)}
          config={siteConfig}
        />
      )}

      {isCreateCertificationModalOpen && (
        <CreateCertificationModal isOpen={isCreateCertificationModalOpen} onClose={() => setIsCreateCertificationModalOpen(false)} />
      )}
      {editingCertification && (
        <EditCertificationModal certification={editingCertification} isOpen={true} onClose={() => setEditingCertification(null)} />
      )}

      {isCreateEducationModalOpen && (
        <CreateEducationModal isOpen={isCreateEducationModalOpen} onClose={() => setIsCreateEducationModalOpen(false)} />
      )}
      {editingEducation && (
        <EditEducationModal education={editingEducation} isOpen={true} onClose={() => setEditingEducation(null)} />
      )}

      {isCreateLanguageModalOpen && (
        <CreateLanguageModal isOpen={isCreateLanguageModalOpen} onClose={() => setIsCreateLanguageModalOpen(false)} />
      )}
      {editingLanguage && (
        <EditLanguageModal language={editingLanguage} isOpen={true} onClose={() => setEditingLanguage(null)} />
      )}
    </main>
  );
}
