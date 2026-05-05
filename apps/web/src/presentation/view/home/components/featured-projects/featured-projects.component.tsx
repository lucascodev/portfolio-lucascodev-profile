'use client';

import { useProjectsQuery } from '@/presentation/hooks/use-projects-query/use-projects-query.hook';
import { fadeUp, stagger } from '@/shared/utils/motion/motion.variants';
import { Badge, Card, Text } from '@portfolio/design-system';
import { motion } from 'framer-motion';

export function FeaturedProjects() {
  const { data: projects, isLoading } = useProjectsQuery();
  const featured = projects?.filter((p) => p.featured) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {['sk-1', 'sk-2', 'sk-3'].map((k) => (
          <div key={k} className="h-48 animate-pulse rounded-xl bg-[#111111]" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {featured.map((project) => (
        <motion.a
          key={project.id}
          href={`/projects/${project.slug}`}
          variants={fadeUp}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
          <Card hoverable className="h-full">
            <Badge variant="highlight" className="mb-3">
              {project.category}
            </Badge>
            <Text variant="h4" className="mb-2">
              {project.title}
            </Text>
            <Text variant="small" color="secondary" className="mb-4">
              {project.shortDescription}
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </Card>
        </motion.a>
      ))}
    </motion.div>
  );
}
