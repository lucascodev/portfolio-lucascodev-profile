import type { Certification } from '@/domain/entities/certification/certification.entity';
import { useQuery } from '@tanstack/react-query';

async function fetchCertifications(): Promise<Certification[]> {
  const res = await fetch('/api/certifications');
  if (!res.ok) throw new Error('Failed to fetch certifications');
  return res.json() as Promise<Certification[]>;
}

export function useCertificationsQuery() {
  return useQuery({ queryKey: ['certifications'], queryFn: fetchCertifications });
}
