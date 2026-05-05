import { useQuery } from '@tanstack/react-query';
import type { Skill } from '@/domain/entities/skill/skill.entity';

async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills');
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json() as Promise<Skill[]>;
}

export function useSkillsQuery() {
  return useQuery({ queryKey: ['skills'], queryFn: fetchSkills });
}
