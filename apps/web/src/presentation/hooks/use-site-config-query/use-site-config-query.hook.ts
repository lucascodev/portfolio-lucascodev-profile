import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { useQuery } from '@tanstack/react-query';

async function fetchSiteConfig(): Promise<SiteConfig> {
  const res = await fetch('/api/site-config');
  if (!res.ok) throw new Error('Erro ao buscar configurações do site');
  return res.json() as Promise<SiteConfig>;
}

export const siteConfigQueryKey = ['site-config'] as const;

export function useSiteConfigQuery(initialData?: SiteConfig) {
  return useQuery({
    queryKey: siteConfigQueryKey,
    queryFn: fetchSiteConfig,
    initialData,
  });
}
