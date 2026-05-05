'use client';

import type { Skill } from '@/domain/entities/skill/skill.entity';
import {
  useDeleteSkill,
  useUpdateSkill,
} from '@/presentation/hooks/use-skill-mutations/use-skill-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface EditSkillModalProps {
  skill: Skill;
  isOpen: boolean;
  onClose: () => void;
}

const LEVELS = ['learning', 'proficient', 'expert'] as const;
const CATEGORIES = ['mobile', 'frontend', 'backend', 'ai', 'devops', 'database', 'other'] as const;

export function EditSkillModal({ skill, isOpen, onClose }: EditSkillModalProps) {
  const [form, setForm] = useState({
    name: skill.name,
    category: skill.category,
    level: skill.level,
    iconUrl: skill.iconUrl ?? '',
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    updateSkill(
      {
        id: skill.id,
        name: form.name,
        category: form.category,
        level: form.level,
        iconUrl: form.iconUrl || null,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta skill?')) return;
    setError(null);
    deleteSkill(skill.id, {
      onSuccess: () => onClose(),
      onError: (err) => setError(err.message),
    });
  }

  return (
    <EditModal title="Editar Skill" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Categoria</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value as Skill['category'] }))
            }
            className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Nível</label>
          <select
            value={form.level}
            onChange={(e) => setForm((p) => ({ ...p, level: e.target.value as Skill['level'] }))}
            className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Icon URL"
          value={form.iconUrl}
          onChange={(e) => setForm((p) => ({ ...p, iconUrl: e.target.value }))}
        />
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
