'use client';

import type { SkillCategory, SkillLevel } from '@/domain/entities/skill/skill.entity';
import { useCreateSkill } from '@/presentation/hooks/use-skill-mutations/use-skill-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface CreateSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: SkillCategory[] = ['mobile', 'frontend', 'backend', 'ai', 'devops', 'database'];
const LEVELS: SkillLevel[] = ['learning', 'proficient', 'expert'];

export function CreateSkillModal({ isOpen, onClose }: Readonly<CreateSkillModalProps>) {
  const [form, setForm] = useState({
    name: '',
    category: 'frontend' as SkillCategory,
    level: 'learning' as SkillLevel,
    iconUrl: '',
    order: '0',
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateSkill();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    mutate(
      {
        name: form.name.trim(),
        category: form.category,
        level: form.level,
        iconUrl: form.iconUrl.trim() ? form.iconUrl.trim() : null,
        order: Number.isNaN(Number(form.order)) ? 0 : Number(form.order),
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <EditModal title="Nova Skill" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#A3A3A3]">Categoria</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value as SkillCategory }))
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
            <label className="text-sm text-[#A3A3A3]">Nível</label>
            <select
              value={form.level}
              onChange={(e) => setForm((p) => ({ ...p, level: e.target.value as SkillLevel }))}
              className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Icon URL"
          value={form.iconUrl}
          onChange={(e) => setForm((p) => ({ ...p, iconUrl: e.target.value }))}
          placeholder="https://..."
        />
        <Input
          label="Ordem"
          type="number"
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
        />

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
