'use client';

import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { useUpdateSiteConfig } from '@/presentation/hooks/use-site-config-mutations/use-site-config-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { Button } from '@portfolio/design-system';
import { useMemo, useState } from 'react';

interface EditFooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
}

function linksToText(links: SiteConfig['footerNavLinks']): string {
  return links.map((link) => `${link.label}|${link.href}`).join('\n');
}

function textToLinks(value: string): SiteConfig['footerNavLinks'] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split('|');
      return {
        label: label?.trim() ?? '',
        href: href?.trim() ?? '',
      };
    })
    .filter((link) => link.label !== '' && link.href !== '');
}

export function EditFooterModal({ isOpen, onClose, config }: Readonly<EditFooterModalProps>) {
  const initialState = useMemo(
    () => ({
      footerBio: config.footerBio,
      footerNavLinks: linksToText(config.footerNavLinks),
      footerSocialLinks: linksToText(config.footerSocialLinks),
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
        footerBio: form.footerBio.trim(),
        footerNavLinks: textToLinks(form.footerNavLinks),
        footerSocialLinks: textToLinks(form.footerSocialLinks),
      },
      {
        onSuccess: () => handleClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <EditModal title="Editar Footer" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Bio</label>
          <textarea
            value={form.footerBio}
            onChange={(e) => setForm((prev) => ({ ...prev, footerBio: e.target.value }))}
            className="min-h-20 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Menu (um por linha: label|href)</label>
          <textarea
            value={form.footerNavLinks}
            onChange={(e) => setForm((prev) => ({ ...prev, footerNavLinks: e.target.value }))}
            className="min-h-24 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 font-mono text-xs text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#A3A3A3]">Social (um por linha: label|href)</label>
          <textarea
            value={form.footerSocialLinks}
            onChange={(e) => setForm((prev) => ({ ...prev, footerSocialLinks: e.target.value }))}
            className="min-h-24 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 font-mono text-xs text-white focus:border-[#6EE7B7] focus:outline-none"
          />
        </div>

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
