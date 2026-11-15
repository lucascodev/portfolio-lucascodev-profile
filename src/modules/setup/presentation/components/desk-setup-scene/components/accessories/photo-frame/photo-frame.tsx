import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

interface PhotoFrameProps {
  readonly frameColor: string;
}

const FRAME_WIDTH = 0.13;
const FRAME_HEIGHT = 0.17;
const FRAME_THICKNESS = 0.01;
const BORDER = 0.012;
const LEAN_BACK_RADIANS = 0.18;
const PHOTO_TEXTURE_SIZE = { width: 128, height: 168 };

function createWarmPhotoTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = PHOTO_TEXTURE_SIZE.width;
  canvas.height = PHOTO_TEXTURE_SIZE.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available for the photo frame texture.');

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#f6d7a7');
  gradient.addColorStop(0.55, '#e9b07a');
  gradient.addColorStop(1, '#8a6a4f');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function PhotoFrame({ frameColor }: PhotoFrameProps) {
  const photoTexture = useMemo(() => createWarmPhotoTexture(), []);
  useEffect(() => () => photoTexture.dispose(), [photoTexture]);

  return (
    <group rotation-x={-LEAN_BACK_RADIANS}>
      <mesh position={[0, FRAME_HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT, FRAME_THICKNESS]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      <mesh position={[0, FRAME_HEIGHT / 2, FRAME_THICKNESS / 2 + 0.0005]}>
        <planeGeometry args={[FRAME_WIDTH - BORDER * 2, FRAME_HEIGHT - BORDER * 2]} />
        <meshStandardMaterial map={photoTexture} roughness={0.3} />
      </mesh>
    </group>
  );
}
