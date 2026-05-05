import { useQuery } from '@tanstack/react-query';
import type { Experience } from '@/domain/entities/experience/experience.entity';

async function fetchExperiences(): Promise<Experience[]> {
  const res = await fetch('/api/experiences');
  if (!res.ok) throw new Error('Failed to fetch experiences');
  return res.json() as Promise<Experience[]>;
}

export function useExperiencesQuery() {
  return useQuery({ queryKey: ['experiences'], queryFn: fetchExperiences });
}
