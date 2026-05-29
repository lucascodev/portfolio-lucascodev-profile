'use client';

import { useCreateCertification } from '@/presentation/hooks/use-certification-mutations/use-certification-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { ImageUpload } from '@/presentation/view/shared/image-upload/image-upload.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface CreateCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCertificationModal({ isOpen, onClose }: Readonly<CreateCertificationModalProps>) {
  const [form, setForm] = useState({ name: '', issuer: '', year: '', url: '', badgeUrl: null as string | null, order: '0' });
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateCertification();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutate(
      {
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        year: form.year ? Number(form.year) : null,
        url: form.url.trim() || null,
        badgeUrl: form.badgeUrl,
        order: Number(form.order) || 0,
      },
      { onSuccess: () => onClose(), onError: (err) => setError(err.message) },
    );
  }

  return (
    <EditModal title="Nova Certificação" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <Input label="Emissor" value={form.issuer} onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Ano" type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
          <Input label="Ordem" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))} />
        </div>
        <Input label="URL do certificado (opcional)" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
        <ImageUpload
          label="Badge da certificação"
          value={form.badgeUrl}
          onChange={(url) => setForm((p) => ({ ...p, badgeUrl: url }))}
          folder="certifications"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isPending}>Criar</Button>
        </div>
      </form>
    </EditModal>
  );
}
