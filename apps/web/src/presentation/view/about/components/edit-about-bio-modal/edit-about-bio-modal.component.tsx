'use client';

import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { useUpdateSiteConfig } from '@/presentation/hooks/use-site-config-mutations/use-site-config-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button, Input } from '@portfolio/design-system';
import { useMemo, useState } from 'react';

interface EditAboutBioModalProps {
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

export function EditAboutBioModal({ isOpen, onClose, config }: Readonly<EditAboutBioModalProps>) {
  const initialState = useMemo(
    () => ({
      aboutTitle: config.aboutTitle,
      aboutParagraph1: config.aboutParagraph1,
      aboutParagraph2: config.aboutParagraph2,
      aboutTags: tagsToInput(config.aboutTags),
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
        aboutTitle: form.aboutTitle.trim(),
        aboutParagraph1: form.aboutParagraph1.trim(),
        aboutParagraph2: form.aboutParagraph2.trim(),
        aboutTags: parseTags(form.aboutTags),
      },
      {
        onSuccess: () => handleClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <EditModal title="Editar Sobre" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Título"
          value={form.aboutTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, aboutTitle: e.target.value }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Parágrafo 1</label>
          <textarea
            value={form.aboutParagraph1}
            onChange={(e) => setForm((prev) => ({ ...prev, aboutParagraph1: e.target.value }))}
            className="min-h-24 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Parágrafo 2</label>
          <textarea
            value={form.aboutParagraph2}
            onChange={(e) => setForm((prev) => ({ ...prev, aboutParagraph2: e.target.value }))}
            className="min-h-24 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>
        <Input
          label="Tags (separadas por vírgula)"
          value={form.aboutTags}
          onChange={(e) => setForm((prev) => ({ ...prev, aboutTags: e.target.value }))}
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
