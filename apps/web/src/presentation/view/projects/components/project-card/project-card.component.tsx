'use client';

import type { Project } from '@/domain/entities/project/project.entity';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditProjectModal } from '@/presentation/view/projects/components/edit-project-modal/edit-project-modal.component';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { fadeUp } from '@/shared/utils/motion/motion.variants';
import { Badge, Card, Text } from '@portfolio/design-system';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: Readonly<ProjectCardProps>) {
  const isEditMode = useAdminStore((s) => s.isEditMode);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative block h-full"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      >
        <a href={`/projects/${project.slug}`} className="block h-full">
          <Card hoverable className="flex h-full flex-col">
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="highlight">{project.category}</Badge>
              {project.featured && <Badge variant="default">Destaque</Badge>}
            </div>
            <Text variant="h4" className="mb-2">
              {project.title}
            </Text>
            <Text variant="small" color="secondary" className="mb-4 flex-1">
              {project.shortDescription}
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 5).map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
              {project.techStack.length > 5 && <Badge>+{project.techStack.length - 5}</Badge>}
            </div>
          </Card>
        </a>
        {isEditMode && (
          <div className="absolute right-3 top-3 z-10">
            <EditButton onClick={() => setIsModalOpen(true)} />
          </div>
        )}
      </motion.div>
      {isModalOpen && (
        <EditProjectModal
          project={project}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
