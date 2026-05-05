'use client';

import type { Skill } from '@/domain/entities/skill/skill.entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateSkillPayload {
  name: string;
  category: Skill['category'];
  level: Skill['level'];
  iconUrl?: string | null;
  order?: number;
}

interface UpdateSkillPayload extends Partial<CreateSkillPayload> {
  id: string;
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSkillPayload) => {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar skill');
      return res.json() as Promise<Skill>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateSkillPayload) => {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar skill');
      return res.json() as Promise<Skill>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar skill');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}
