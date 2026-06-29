'use client';

import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { useUpdateSiteConfig } from '@/presentation/hooks/use-site-config-mutations/use-site-config-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { ImageUpload } from '@/presentation/view/shared/image-upload/image-upload.component';
import { Button, Input } from '@portfolio/design-system';
import { useMemo, useState } from 'react';

interface EditHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
}

function tagsToInput(tags: string[]): string {
  return tags.join(', ');
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function EditHeroModal({ isOpen, onClose, config }: Readonly<EditHeroModalProps>) {
  const initialState = useMemo(
    () => ({
      heroGreeting: config.heroGreeting,
      heroName: config.heroName,
      heroRole: config.heroRole,
      heroDescription: config.heroDescription,
      profileImageUrl: config.profileImageUrl,
      heroTags: tagsToInput(config.heroTags),
    }),
    [config],
  );

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useUpdateSiteConfig();

  function handleClose() {
    setForm(initialState);
    setError(null);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    mutate(
      {
        heroGreeting: form.heroGreeting.trim(),
        heroName: form.heroName.trim(),
        heroRole: form.heroRole.trim(),
        heroDescription: form.heroDescription.trim(),
        profileImageUrl: form.profileImageUrl.trim(),
        heroTags: parseTags(form.heroTags),
      },
      {
        onSuccess: () => handleClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <EditModal title="Editar Hero" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Saudação"
          value={form.heroGreeting}
          onChange={(e) => setForm((prev) => ({ ...prev, heroGreeting: e.target.value }))}
        />
        <Input
          label="Nome"
          value={form.heroName}
          onChange={(e) => setForm((prev) => ({ ...prev, heroName: e.target.value }))}
        />
        <Input
          label="Cargo"
          value={form.heroRole}
          onChange={(e) => setForm((prev) => ({ ...prev, heroRole: e.target.value }))}
        />
        <ImageUpload
          label="Foto de perfil"
          value={form.profileImageUrl}
          onChange={(url) => setForm((prev) => ({ ...prev, profileImageUrl: url }))}
          folder="avatar"
          aspect={1}
          circular={true}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Descrição</label>
          <textarea
            value={form.heroDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, heroDescription: e.target.value }))}
            className="min-h-24 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>
        <Input
          label="Tags (separadas por vírgula)"
          value={form.heroTags}
          onChange={(e) => setForm((prev) => ({ ...prev, heroTags: e.target.value }))}
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            Salvar
          </Button>
        </div>
      </form>
    </EditModal>
  );
}
