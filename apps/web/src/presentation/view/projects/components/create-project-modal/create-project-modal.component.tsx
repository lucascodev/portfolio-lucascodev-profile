'use client';

import type { ProjectCategory, ProjectStatus } from '@/domain/entities/project/project.entity';
import { useCreateProject } from '@/presentation/hooks/use-project-mutations/use-project-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ProjectCategory[] = ['mobile', 'web', 'backend', 'ai', 'fullstack'];
const STATUSES: ProjectStatus[] = ['in_progress', 'completed', 'archived'];

export function CreateProjectModal({ isOpen, onClose }: Readonly<CreateProjectModalProps>) {
  const [form, setForm] = useState({
    slug: '',
    title: '',
    shortDescription: '',
    fullDescription: '',
    coverImage: '/projects/default-cover.jpg',
    techStack: '',
    category: 'web' as ProjectCategory,
    status: 'in_progress' as ProjectStatus,
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: '0',
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateProject();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    mutate(
      {
        slug: form.slug.trim(),
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        coverImage: form.coverImage.trim(),
        techStack: form.techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
        category: form.category,
        status: form.status,
        githubUrl: form.githubUrl.trim() ? form.githubUrl.trim() : null,
        liveUrl: form.liveUrl.trim() ? form.liveUrl.trim() : null,
        featured: form.featured,
        order: Number.isNaN(Number(form.order)) ? 0 : Number(form.order),
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <EditModal title="Novo Projeto" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="ex.: dashboard-analytics"
        />
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
        <Input
          label="Descrição curta"
          value={form.shortDescription}
          onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Descrição completa</label>
          <textarea
            value={form.fullDescription}
            onChange={(e) => setForm((p) => ({ ...p, fullDescription: e.target.value }))}
            className="min-h-24 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>
        <Input
          label="Imagem de capa"
          value={form.coverImage}
          onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
        />
        <Input
          label="Tech Stack (separado por vírgula)"
          value={form.techStack}
          onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#A3A3A3]">Categoria</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value as ProjectCategory }))
              }
              className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#A3A3A3]">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ProjectStatus }))}
              className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="GitHub URL"
          value={form.githubUrl}
          onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
          placeholder="https://github.com/..."
        />
        <Input
          label="Live URL"
          value={form.liveUrl}
          onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
          placeholder="https://..."
        />
        <Input
          label="Ordem"
          type="number"
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm text-[#A3A3A3]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
            className="rounded"
          />
          Destaque
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            Criar
          </Button>
        </div>
      </form>
    </EditModal>
  );
}
