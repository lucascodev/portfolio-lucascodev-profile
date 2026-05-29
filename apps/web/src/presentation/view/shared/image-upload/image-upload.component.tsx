'use client';

import { STORAGE_BUCKET, getSupabase } from '@/shared/lib/supabase/supabase.lib';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Imagem',
}: Readonly<ImageUploadProps>) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const client = getSupabase();
    const { error: uploadError } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError('Erro ao fazer upload: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setIsUploading(false);

    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-[#A3A3A3]">{label}</label>
      <div className="flex min-h-[40px] items-center gap-3">
        {value && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#111111]">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="rounded-lg border border-dashed border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-[#A3A3A3] transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? 'Enviando...' : value ? 'Trocar imagem' : 'Selecionar imagem'}
          </button>
          {value && <p className="truncate font-mono text-xs text-[#525252]">{value}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
