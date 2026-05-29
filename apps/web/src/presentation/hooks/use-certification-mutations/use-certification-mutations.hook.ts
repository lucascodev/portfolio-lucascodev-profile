'use client';

import type { Certification } from '@/domain/entities/certification/certification.entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateCertificationPayload {
  name: string;
  issuer: string;
  year?: number | null;
  url?: string | null;
  order?: number;
}

interface UpdateCertificationPayload extends Partial<CreateCertificationPayload> {
  id: string;
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCertificationPayload) => {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar certificação');
      return res.json() as Promise<Certification>;
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['certifications'] }); },
  });
}

export function useUpdateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCertificationPayload) => {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar certificação');
      return res.json() as Promise<Certification>;
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['certifications'] }); },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar certificação');
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['certifications'] }); },
  });
}
