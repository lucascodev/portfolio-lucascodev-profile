'use client';

import { STORAGE_BUCKET, getSupabase } from '@/shared/lib/supabase/supabase.lib';
import { useCallback, useRef, useState } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  aspect?: number;
  circular?: boolean;
}

function centerAspectCrop(width: number, height: number, aspect: number): Crop {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height), width, height);
}

const MAX_OUTPUT_PX = 800;

async function getCroppedBlob(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string,
): Promise<File> {
  const cropX = (crop.x / 100) * image.naturalWidth;
  const cropY = (crop.y / 100) * image.naturalHeight;
  const cropWidth = (crop.width / 100) * image.naturalWidth;
  const cropHeight = (crop.height / 100) * image.naturalHeight;

  const scale = Math.min(1, MAX_OUTPUT_PX / Math.max(cropWidth, cropHeight));
  const outputWidth = Math.round(cropWidth * scale);
  const outputHeight = Math.round(cropHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas vazio'));
        return;
      }
      const baseName = fileName.replace(/\.[^/.]+$/, '');
      resolve(new File([blob], `${baseName}.png`, { type: 'image/png' }));
    }, 'image/png');
  });
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Imagem',
  aspect,
  circular,
}: Readonly<ImageUploadProps>) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [originalFileName, setOriginalFileName] = useState('image.jpg');
  const [previewError, setPreviewError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result as string);
    reader.readAsDataURL(file);
    if (inputRef.current) inputRef.current.value = '';
  }

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect ?? 1));
    },
    [aspect],
  );

  async function handleConfirmCrop() {
    if (!imgRef.current || !crop) return;
    setIsUploading(true);
    setError(null);
    try {
      const croppedFile = await getCroppedBlob(imgRef.current, crop, originalFileName);
      const ext = 'png';
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const client = getSupabase();
      const { error: uploadError } = await client.storage
        .from(STORAGE_BUCKET)
        .upload(path, croppedFile, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);
      const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      setPreviewSrc(null);
      setPreviewError(false);
    } catch (err) {
      setError('Erro ao fazer upload: ' + (err instanceof Error ? err.message : 'tente novamente'));
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancelCrop() {
    setPreviewSrc(null);
    setCrop(undefined);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-[#A3A3A3]">{label}</label>

      {/* crop modal */}
      {previewSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-6">
            <p className="text-sm font-medium text-white">Ajustar imagem</p>
            <div className="flex justify-center overflow-hidden rounded-lg">
              <ReactCrop
                crop={crop}
                onChange={(_, pct) => setCrop(pct)}
                aspect={aspect}
                circularCrop={circular ?? aspect === 1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={previewSrc}
                  alt="preview"
                  onLoad={onImageLoad}
                  className="max-h-80 max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelCrop}
                className="rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#A3A3A3] transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                disabled={isUploading}
                className="rounded-lg bg-[#6EE7B7] px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
              >
                {isUploading ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-[40px] items-center gap-3">
        {value && !previewError && (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#111111]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
              onError={() => setPreviewError(true)}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full rounded-lg border border-dashed border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-[#A3A3A3] transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? 'Enviando...' : value ? 'Trocar imagem' : 'Selecionar imagem'}
          </button>
          {value && (
            <p className="mt-1 truncate font-mono text-xs text-[#525252]">
              {value.split('/').pop()}
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
