'use client';

import type { Experience } from '@/domain/entities/experience/experience.entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateExperiencePayload {
  company: string;
  role: string;
  description: string;
  techStack?: string[];
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  order?: number;
}

interface UpdateExperiencePayload extends Partial<CreateExperiencePayload> {
  id: string;
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateExperiencePayload) => {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar experiência');
      return res.json() as Promise<Experience>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateExperiencePayload) => {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar experiência');
      return res.json() as Promise<Experience>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar experiência');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}
