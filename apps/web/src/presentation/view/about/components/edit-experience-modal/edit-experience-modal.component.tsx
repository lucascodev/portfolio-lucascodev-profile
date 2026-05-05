'use client';

import type { Experience } from '@/domain/entities/experience/experience.entity';
import {
  useDeleteExperience,
  useUpdateExperience,
} from '@/presentation/hooks/use-experience-mutations/use-experience-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface EditExperienceModalProps {
  experience: Experience;
  isOpen: boolean;
  onClose: () => void;
}

function toDateInput(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

export function EditExperienceModal({ experience, isOpen, onClose }: EditExperienceModalProps) {
  const [form, setForm] = useState({
    company: experience.company,
    role: experience.role,
    description: experience.description,
    techStack: experience.techStack.join(', '),
    startDate: toDateInput(experience.startDate),
    endDate: toDateInput(experience.endDate),
    current: experience.current,
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateExperience, isPending: isUpdating } = useUpdateExperience();
  const { mutate: deleteExperience, isPending: isDeleting } = useDeleteExperience();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    updateExperience(
      {
        id: experience.id,
        company: form.company,
        role: form.role,
        description: form.description,
        techStack: form.techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.current ? null : form.endDate ? new Date(form.endDate).toISOString() : null,
        current: form.current,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta experiência?')) return;
    setError(null);
    deleteExperience(experience.id, {
      onSuccess: () => onClose(),
      onError: (err) => setError(err.message),
    });
  }

  return (
    <EditModal title="Editar Experiência" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Empresa"
          value={form.company}
          onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
        />
        <Input
          label="Cargo"
          value={form.role}
          onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
        />
        <Input
          label="Descrição"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />
        <Input
          label="Tech Stack (separado por vírgula)"
          value={form.techStack}
          onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))}
        />
        <Input
          label="Data de início"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
        />
        {!form.current && (
          <Input
            label="Data de término"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
          />
        )}
        <label className="flex items-center gap-2 text-sm text-[#A3A3A3]">
          <input
            type="checkbox"
            checked={form.current}
            onChange={(e) => setForm((p) => ({ ...p, current: e.target.checked }))}
            className="rounded"
          />
          Emprego atual
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
