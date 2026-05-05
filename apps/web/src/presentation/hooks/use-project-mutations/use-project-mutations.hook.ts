'use client';

import type { Project } from '@/domain/entities/project/project.entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateProjectPayload {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  images?: string[];
  techStack?: string[];
  category: Project['category'];
  status?: Project['status'];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  order?: number;
}

interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  id: string;
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectPayload) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar projeto');
      return res.json() as Promise<Project>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProjectPayload) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar projeto');
      return res.json() as Promise<Project>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar projeto');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
