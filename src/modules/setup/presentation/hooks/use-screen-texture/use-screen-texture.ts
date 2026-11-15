import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import { createScreenPainter } from '@/modules/setup/presentation/screens/create-screen-painter';

const PIXELS_PER_METER = 1800;
const MIN_CANVAS_WIDTH_PX = 360;
const REPAINT_INTERVAL_SECONDS = 1 / 24;
const TEXTURE_ANISOTROPY = 8;

export function useScreenTexture(screen: ScreenContent, screenSize: Dimensions): CanvasTexture {
  const pixelsPerMeter = Math.max(PIXELS_PER_METER, MIN_CANVAS_WIDTH_PX / screenSize.width);
  const canvasWidth = Math.round(screenSize.width * pixelsPerMeter);
  const canvasHeight = Math.round(screenSize.height * pixelsPerMeter);
  const lastPaintRef = useRef(Number.NEGATIVE_INFINITY);
  const paint = useMemo(() => createScreenPainter(screen), [screen]);

  const { texture, context } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) throw new Error('2D canvas context is not available for the monitor screen.');

    const canvasTexture = new CanvasTexture(canvas);
    canvasTexture.colorSpace = SRGBColorSpace;
    canvasTexture.anisotropy = TEXTURE_ANISOTROPY;
    return { texture: canvasTexture, context: canvasContext };
  }, [canvasWidth, canvasHeight]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    const elapsedSeconds = clock.getElapsedTime();
    if (elapsedSeconds - lastPaintRef.current < REPAINT_INTERVAL_SECONDS) return;

    lastPaintRef.current = elapsedSeconds;
    paint(context, { width: canvasWidth, height: canvasHeight }, elapsedSeconds);
    texture.needsUpdate = true;
  });

  return texture;
}
