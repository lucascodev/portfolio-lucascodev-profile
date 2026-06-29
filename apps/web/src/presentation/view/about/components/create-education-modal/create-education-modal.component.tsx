'use client';

import { useCreateEducation } from '@/presentation/hooks/use-education-mutations/use-education-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface CreateEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEducationModal({ isOpen, onClose }: Readonly<CreateEducationModalProps>) {
  const [form, setForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '', current: false, order: '0' });
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateEducation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutate(
      {
        institution: form.institution.trim(),
        degree: form.degree.trim(),
        field: form.field.trim() || null,
        startYear: Number(form.startYear),
        endYear: form.endYear ? Number(form.endYear) : null,
        current: form.current,
        order: Number(form.order) || 0,
      },
      { onSuccess: () => onClose(), onError: (err) => setError(err.message) },
    );
  }

  return (
    <EditModal title="Nova Formação" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Instituição" value={form.institution} onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))} />
        <Input label="Curso / Grau" value={form.degree} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} />
        <Input label="Área (opcional)" value={form.field} onChange={(e) => setForm((p) => ({ ...p, field: e.target.value }))} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Ano início" type="number" value={form.startYear} onChange={(e) => setForm((p) => ({ ...p, startYear: e.target.value }))} />
          <Input label="Ano fim" type="number" value={form.endYear} onChange={(e) => setForm((p) => ({ ...p, endYear: e.target.value }))} />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#A3A3A3]">
          <input type="checkbox" checked={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.checked }))} className="accent-[#6EE7B7]" />
          Em andamento
        </label>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isPending}>Criar</Button>
        </div>
      </form>
    </EditModal>
  );
}
