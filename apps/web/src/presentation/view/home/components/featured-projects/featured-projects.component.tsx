'use client';

import { Card, Text, Badge } from '@portfolio/design-system';
import { useProjectsQuery } from '@/presentation/hooks/use-projects-query/use-projects-query.hook';

export function FeaturedProjects() {
  const { data: projects, isLoading } = useProjectsQuery();
  const featured = projects?.filter((p) => p.featured) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-[#111111]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {featured.map((project) => (
        <a key={project.id} href={`/projects/${project.slug}`}>
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
        </a>
      ))}
    </div>
  );
}
