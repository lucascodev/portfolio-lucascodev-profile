'use client';

import type { Education } from '@/domain/entities/education/education.entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateEducationPayload {
  institution: string;
  degree: string;
  field?: string | null;
  startYear: number;
  endYear?: number | null;
  current?: boolean;
  order?: number;
}

interface UpdateEducationPayload extends Partial<CreateEducationPayload> {
  id: string;
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEducationPayload) => {
      const res = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar formação');
      return res.json() as Promise<Education>;
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['education'] }); },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateEducationPayload) => {
      const res = await fetch(`/api/education/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar formação');
      return res.json() as Promise<Education>;
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['education'] }); },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar formação');
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['education'] }); },
  });
}
