'use client';

import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { useSiteConfigQuery } from '@/presentation/hooks/use-site-config-query/use-site-config-query.hook';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditHeroModal } from '@/presentation/view/home/components/edit-hero-modal/edit-hero-modal.component';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { fadeUp, heroStagger } from '@/shared/utils/motion/motion.variants';
import { Text } from '@portfolio/design-system';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface HeroSectionProps {
  readonly initialData?: SiteConfig;
}

export function HeroSection({ initialData }: HeroSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const isEditMode = useAdminStore((state) => state.isEditMode);
  const { data } = useSiteConfigQuery(initialData);

  const config = useMemo(
    () => ({
      heroGreeting: data?.heroGreeting ?? 'Olá, eu sou',
      heroName: data?.heroName ?? 'Lucas Codev',
      heroRole: data?.heroRole ?? 'Fullstack & Mobile Engineer',
      heroDescription:
        data?.heroDescription ??
        'Especializado em Flutter, React Native, NestJS e Python/FastAPI. Construo soluções integradas com IA e Visão Computacional.',
      profileImageUrl: data?.profileImageUrl ?? '/avatar.jpg',
      heroTags: data?.heroTags ?? [
        'Flutter',
        'React Native',
        'NestJS',
        'FastAPI',
        'YOLOv8',
        'LLMs',
      ],
    }),
    [data],
  );

  return (
    <motion.section
      className="relative flex min-h-[92vh] flex-col items-center justify-center px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={heroStagger}
    >
      {isEditMode && data && (
        <div className="absolute right-4 top-4 z-20">
          <EditButton onClick={() => setIsEditModalOpen(true)} />
        </div>
      )}

      <motion.div
        variants={fadeUp}
        className="mb-8 h-28 w-28 overflow-hidden rounded-full border-2 border-[#2A2A2A] ring-4 ring-[#6EE7B7]/10"
      >
        {failedAvatarUrl === config.profileImageUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-[#111111] font-mono text-2xl font-bold text-[#6EE7B7]">
            LC
          </div>
        ) : (
          <Image
            src={config.profileImageUrl}
            unoptimized
            alt={config.heroName}
            width={112}
            height={112}
            className="h-full w-full object-cover"
            priority
            onError={() => setFailedAvatarUrl(config.profileImageUrl)}
          />
        )}
      </motion.div>

      <motion.p variants={fadeUp} className="mb-3 font-mono text-sm text-[#6EE7B7]">
        {config.heroGreeting}
      </motion.p>

      <motion.div variants={fadeUp}>
        <Text variant="h1" className="mb-4 max-w-3xl">
          {config.heroName}
        </Text>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Text variant="h3" color="secondary" className="mb-2 max-w-2xl font-normal">
          {config.heroRole}
        </Text>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Text variant="body" color="muted" className="mb-10 max-w-xl">
          {config.heroDescription}
        </Text>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
        <a
          href="/projects"
          className="inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-[#E5E5E5]"
        >
          Ver projetos
        </a>
        <a
          href="/about"
          className="inline-flex h-11 items-center rounded-lg border border-[#3D3D3D] px-6 text-sm font-medium text-white transition-colors hover:border-[#525252] hover:bg-[#111111]"
        >
          Sobre mim
        </a>
        <a
          href="/contact"
          className="inline-flex h-11 items-center gap-2 px-4 text-sm font-medium text-[#A3A3A3] transition-colors hover:text-white"
        >
          Contato →
        </a>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-2">
        {config.heroTags.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-1 font-mono text-xs text-[#737373]"
          >
            {tech}
          </span>
        ))}
      </motion.div>

      {data && (
        <EditHeroModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          config={data}
        />
      )}
    </motion.section>
  );
}
