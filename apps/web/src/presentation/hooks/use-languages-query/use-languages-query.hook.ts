import type { Language } from '@/domain/entities/language/language.entity';
import { useQuery } from '@tanstack/react-query';

async function fetchLanguages(): Promise<Language[]> {
  const res = await fetch('/api/languages');
  if (!res.ok) throw new Error('Failed to fetch languages');
  return res.json() as Promise<Language[]>;
}

export function useLanguagesQuery() {
  return useQuery({ queryKey: ['languages'], queryFn: fetchLanguages });
}
