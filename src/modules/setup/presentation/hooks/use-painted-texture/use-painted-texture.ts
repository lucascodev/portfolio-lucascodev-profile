import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

type StaticPainter = (context: CanvasRenderingContext2D, size: Dimensions) => void;

const TEXTURE_ANISOTROPY = 8;

export function usePaintedTexture(size: Dimensions, paint: StaticPainter): CanvasTexture {
  const { width, height } = size;

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas context is not available for a painted texture.');

    paint(context, { width, height });
    const canvasTexture = new CanvasTexture(canvas);
    canvasTexture.colorSpace = SRGBColorSpace;
    canvasTexture.anisotropy = TEXTURE_ANISOTROPY;
    return canvasTexture;
  }, [width, height, paint]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
