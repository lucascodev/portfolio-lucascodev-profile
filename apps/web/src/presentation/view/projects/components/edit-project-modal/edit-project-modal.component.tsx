'use client';

import type { Project } from '@/domain/entities/project/project.entity';
import {
  useDeleteProject,
  useUpdateProject,
} from '@/presentation/hooks/use-project-mutations/use-project-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Badge, Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['mobile', 'web', 'frontend', 'backend', 'ai', 'fullstack', 'game'] as const;

const STATUSES = ['in_progress', 'completed', 'archived'] as const;

const selectClass =
  'rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none';

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const [form, setForm] = useState({
    title: project.title,
    shortDescription: project.shortDescription,
    fullDescription: project.fullDescription,
    category: project.category,
    status: project.status,
    techStack: project.techStack.join(', '),
    githubUrl: project.githubUrl ?? '',
    liveUrl: project.liveUrl ?? '',
    featured: project.featured,
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  function handleChange(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    updateProject(
      {
        id: project.id,
        title: form.title,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        category: form.category,
        status: form.status,
        techStack: form.techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        githubUrl: form.githubUrl || null,
        liveUrl: form.liveUrl || null,
        featured: form.featured,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    setError(null);
    deleteProject(project.id, {
      onSuccess: () => onClose(),
      onError: (err) => setError(err.message),
    });
  }

  return (
    <EditModal title="Editar Projeto" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <Input
          label="Descrição curta"
          value={form.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Descrição completa</label>
          <textarea
            value={form.fullDescription}
            onChange={(e) => handleChange('fullDescription', e.target.value)}
            rows={4}
            className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#A3A3A3]">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value as Project['category'])}
              className={selectClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#A3A3A3]">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value as Project['status'])}
              className={selectClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Input
            label="Tech Stack (separado por vírgula)"
            value={form.techStack}
            onChange={(e) => handleChange('techStack', e.target.value)}
          />
          {form.techStack.trim() && (
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2">
              {form.techStack
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
            </div>
          )}
        </div>
        <Input
          label="GitHub URL"
          value={form.githubUrl}
          onChange={(e) => handleChange('githubUrl', e.target.value)}
        />
        <Input
          label="Live URL"
          value={form.liveUrl}
          onChange={(e) => handleChange('liveUrl', e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-[#A3A3A3]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleChange('featured', e.target.checked)}
            className="rounded"
          />
          Destaque
        </label>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Excluir
          </Button>
          <Button type="submit" isLoading={isUpdating}>
            Salvar
          </Button>
        </div>
      </form>
    </EditModal>
  );
}
