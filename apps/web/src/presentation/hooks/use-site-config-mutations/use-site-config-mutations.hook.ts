'use client';

import type { SiteLink } from '@/domain/entities/site-config/site-config.entity';
import { siteConfigQueryKey } from '@/presentation/hooks/use-site-config-query/use-site-config-query.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateSiteConfigPayload {
  heroGreeting?: string;
  heroName?: string;
  heroRole?: string;
  heroDescription?: string;
  profileImageUrl?: string;
  heroTags?: string[];
  aboutTitle?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutTags?: string[];
  footerBio?: string;
  footerNavLinks?: SiteLink[];
  footerSocialLinks?: SiteLink[];
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSiteConfigPayload) => {
      const res = await fetch('/api/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar conteúdo institucional');
      }

      return res.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: siteConfigQueryKey });
    },
  });
}
