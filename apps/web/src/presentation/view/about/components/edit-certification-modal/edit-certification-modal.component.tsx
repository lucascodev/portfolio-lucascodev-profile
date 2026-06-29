'use client';

import type { Certification } from '@/domain/entities/certification/certification.entity';
import {
  useDeleteCertification,
  useUpdateCertification,
} from '@/presentation/hooks/use-certification-mutations/use-certification-mutations.hook';
import { EditModal } from '@/presentation/view/shared/edit-modal/edit-modal.component';
import { ImageUpload } from '@/presentation/view/shared/image-upload/image-upload.component';
import { Button, Input } from '@portfolio/design-system';
import { useState } from 'react';

interface EditCertificationModalProps {
  certification: Certification;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCertificationModal({
  certification,
  isOpen,
  onClose,
}: Readonly<EditCertificationModalProps>) {
  const [form, setForm] = useState({
    name: certification.name,
    issuer: certification.issuer,
    year: certification.year?.toString() ?? '',
    url: certification.url ?? '',
    badgeUrl: certification.badgeUrl,
    order: certification.order.toString(),
  });
  const [error, setError] = useState<string | null>(null);
  const { mutate: update, isPending: isUpdating } = useUpdateCertification();
  const { mutate: remove, isPending: isDeleting } = useDeleteCertification();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    update(
      {
        id: certification.id,
        name: form.name,
        issuer: form.issuer,
        year: form.year ? Number(form.year) : null,
        url: form.url || null,
        badgeUrl: form.badgeUrl,
        order: Number(form.order) || 0,
      },
      { onSuccess: () => onClose(), onError: (err) => setError(err.message) },
    );
  }

  function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta certificação?')) return;
    remove(certification.id, {
      onSuccess: () => onClose(),
      onError: (err) => setError(err.message),
    });
  }

  return (
    <EditModal title="Editar Certificação" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <Input
          label="Emissor"
          value={form.issuer}
          onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ano"
            type="number"
            value={form.year}
            onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
          />
          <Input
            label="Ordem"
            type="number"
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
          />
        </div>
        <Input
          label="URL do certificado (opcional)"
          value={form.url}
          onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
          placeholder="https://..."
        />
        <ImageUpload
          label="Badge da certificação"
          value={form.badgeUrl}
          onChange={(url) => setForm((p) => ({ ...p, badgeUrl: url }))}
          folder="certifications"
          aspect={undefined}
          circular={false}
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
