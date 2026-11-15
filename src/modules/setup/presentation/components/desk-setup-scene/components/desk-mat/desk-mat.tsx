import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { DeskMatSpec } from '@/modules/setup/domain/types/desk-items/desk-mat.type';
import { paintCrackPattern } from '@/modules/setup/presentation/textures/paint-crack-pattern';

interface DeskMatProps {
  readonly deskMat: DeskMatSpec;
}

const MAT_THICKNESS = 0.003;
const TEXTURE_WIDTH_PX = 2048;
const TEXTURE_ANISOTROPY = 8;

function useMatTexture(deskMat: DeskMatSpec): CanvasTexture | null {
  const { pattern, color, widthMeters, depthMeters } = deskMat;

  const texture = useMemo(() => {
    if (!pattern) return null;
    const canvas = document.createElement('canvas');
    canvas.width = TEXTURE_WIDTH_PX;
    canvas.height = Math.round((TEXTURE_WIDTH_PX * depthMeters) / widthMeters);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas context is not available for the desk mat texture.');

    paintCrackPattern(context, { width: canvas.width, height: canvas.height }, { background: color, crack: pattern.color });
    const canvasTexture = new CanvasTexture(canvas);
    canvasTexture.colorSpace = SRGBColorSpace;
    canvasTexture.anisotropy = TEXTURE_ANISOTROPY;
    return canvasTexture;
  }, [pattern, color, widthMeters, depthMeters]);

  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

export function DeskMat({ deskMat }: DeskMatProps) {
  const texture = useMatTexture(deskMat);

  return (
    <group>
      <mesh position={[0, MAT_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[deskMat.widthMeters, MAT_THICKNESS, deskMat.depthMeters]} />
        <meshStandardMaterial color={deskMat.color} roughness={0.95} />
      </mesh>
      {texture && (
        <mesh position={[0, MAT_THICKNESS + 0.0003, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[deskMat.widthMeters, deskMat.depthMeters]} />
          <meshStandardMaterial map={texture} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}
