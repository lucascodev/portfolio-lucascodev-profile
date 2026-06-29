import type { Education } from '@/domain/entities/education/education.entity';
import { useQuery } from '@tanstack/react-query';

async function fetchEducation(): Promise<Education[]> {
  const res = await fetch('/api/education');
  if (!res.ok) throw new Error('Failed to fetch education');
  return res.json() as Promise<Education[]>;
}

export function useEducationQuery() {
  return useQuery({ queryKey: ['education'], queryFn: fetchEducation });
}
