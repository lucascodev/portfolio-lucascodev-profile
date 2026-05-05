import { useQuery } from '@tanstack/react-query';
import type { Project } from '@/domain/entities/project/project.entity';

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json() as Promise<Project[]>;
}

export const projectsQueryKey = ['projects'] as const;

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: fetchProjects,
  });
}
