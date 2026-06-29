'use client';

import type { Language } from '@/domain/entities/language/language.entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateLanguagePayload {
  name: string;
  level: Language['level'];
  order?: number;
}

interface UpdateLanguagePayload extends Partial<CreateLanguagePayload> {
  id: string;
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLanguagePayload) => {
      const res = await fetch('/api/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar idioma');
      return res.json() as Promise<Language>;
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['languages'] }); },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateLanguagePayload) => {
      const res = await fetch(`/api/languages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar idioma');
      return res.json() as Promise<Language>;
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['languages'] }); },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/languages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar idioma');
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['languages'] }); },
  });
}
