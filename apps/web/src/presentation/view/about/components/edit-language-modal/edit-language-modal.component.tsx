'use client';

import type { Language, LanguageLevel } from '@/domain/entities/language/language.entity';
import { useDeleteLanguage, useUpdateLanguage } from '@/presentation/hooks/use-language-mutations/use-language-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

const LEVELS: LanguageLevel[] = ['basic', 'elementary', 'intermediate', 'advanced', 'fluent', 'native'];

interface EditLanguageModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLanguageModal({ language, isOpen, onClose }: Readonly<EditLanguageModalProps>) {
  const [form, setForm] = useState({ name: language.name, level: language.level, order: language.order.toString() });
  const [error, setError] = useState<string | null>(null);
  const { mutate: update, isPending: isUpdating } = useUpdateLanguage();
  const { mutate: remove, isPending: isDeleting } = useDeleteLanguage();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    update({ id: language.id, name: form.name, level: form.level, order: Number(form.order) || 0 }, { onSuccess: () => onClose(), onError: (err) => setError(err.message) });
  }

  function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir este idioma?')) return;
    remove(language.id, { onSuccess: () => onClose(), onError: (err) => setError(err.message) });
  }

  return (
    <EditModal title="Editar Idioma" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Idioma" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#A3A3A3]">Nível</label>
            <select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value as LanguageLevel }))} className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none">
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <Input label="Ordem" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))} />
        </div>
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
