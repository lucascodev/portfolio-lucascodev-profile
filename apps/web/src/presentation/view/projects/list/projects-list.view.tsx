'use client';

import { useProjectsQuery } from '@/presentation/hooks/use-projects-query/use-projects-query.hook';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { useProjectsStore } from '@/presentation/store/projects/projects.store';
import { fadeUp } from '@/shared/utils/motion/motion.variants';
import { Button, Text } from '@portfolio/design-system';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CreateProjectModal } from '../components/create-project-modal/create-project-modal.component';
import { ProjectCard } from '../components/project-card/project-card.component';
import { FilterBar } from './components/filter-bar/filter-bar.component';

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

export function ProjectsListView() {
  const { data: projects, isLoading } = useProjectsQuery();
  const { selectedCategory } = useProjectsStore();
  const isEditMode = useAdminStore((s) => s.isEditMode);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filtered =
    selectedCategory === 'all'
      ? (projects ?? [])
      : (projects ?? []).filter((p) => p.category === selectedCategory);

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        className="mb-2 flex items-center justify-between gap-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Text variant="h2">Projetos</Text>
        {isEditMode && (
          <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
            Novo projeto
          </Button>
        )}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Text variant="body" color="secondary" className="mb-10">
          Todas as soluções que desenvolvi ao longo da carreira.
        </Text>
      </motion.div>

      <FilterBar />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? SKELETON_KEYS.map((k) => (
              <div key={k} className="h-48 animate-pulse rounded-xl bg-[#111111]" />
            ))
          : filtered.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>

      {isCreateModalOpen && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </main>
  );
}
