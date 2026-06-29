'use client';

import { useCreateExperience } from '@/presentation/hooks/use-experience-mutations/use-experience-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { RichTextEditor } from '@/presentation/view/shared/rich-text-editor/rich-text-editor.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExperienceModal({ isOpen, onClose }: Readonly<CreateExperienceModalProps>) {
  const [form, setForm] = useState({
    company: '',
    role: '',
    description: '',
    techStack: '',
    startDate: '',
    endDate: '',
    current: false,
    order: '0',
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateExperience();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    mutate(
      {
        company: form.company.trim(),
        role: form.role.trim(),
        description: form.description.trim(),
        techStack: form.techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
        startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
        endDate: form.current ? null : form.endDate ? new Date(form.endDate).toISOString() : null,
        current: form.current,
        order: Number.isNaN(Number(form.order)) ? 0 : Number(form.order),
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <EditModal title="Nova Experiência" isOpen={isOpen} onClose={onClose}>
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
        <RichTextEditor
          label="Descrição"
          value={form.description}
          onChange={(html) => setForm((p) => ({ ...p, description: html }))}
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
        <Input
          label="Ordem"
          type="number"
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
        />
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
          <Button type="submit" isLoading={isPending}>
            Criar
          </Button>
        </div>
      </form>
    </EditModal>
  );
}
