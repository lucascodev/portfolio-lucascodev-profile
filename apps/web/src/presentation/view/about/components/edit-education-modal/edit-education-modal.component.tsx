'use client';

import type { Education } from '@/domain/entities/education/education.entity';
import { useDeleteEducation, useUpdateEducation } from '@/presentation/hooks/use-education-mutations/use-education-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface EditEducationModalProps {
  education: Education;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEducationModal({ education, isOpen, onClose }: Readonly<EditEducationModalProps>) {
  const [form, setForm] = useState({
    institution: education.institution,
    degree: education.degree,
    field: education.field ?? '',
    startYear: education.startYear.toString(),
    endYear: education.endYear?.toString() ?? '',
    current: education.current,
    order: education.order.toString(),
  });
  const [error, setError] = useState<string | null>(null);
  const { mutate: update, isPending: isUpdating } = useUpdateEducation();
  const { mutate: remove, isPending: isDeleting } = useDeleteEducation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    update(
      { id: education.id, institution: form.institution, degree: form.degree, field: form.field || null, startYear: Number(form.startYear), endYear: form.endYear ? Number(form.endYear) : null, current: form.current, order: Number(form.order) || 0 },
      { onSuccess: () => onClose(), onError: (err) => setError(err.message) },
    );
  }

  function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta formação?')) return;
    remove(education.id, { onSuccess: () => onClose(), onError: (err) => setError(err.message) });
  }

  return (
    <EditModal title="Editar Formação" isOpen={isOpen} onClose={onClose}>
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
          <Button type="button" variant="danger" onClick={handleDelete} isLoading={isDeleting}>Excluir</Button>
          <Button type="submit" isLoading={isUpdating}>Salvar</Button>
        </div>
      </form>
    </EditModal>
  );
}
