import { useCallback } from 'react';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { paintPerforation } from '@/modules/setup/presentation/textures/paint-perforation';
import { BoomArm } from './components/boom-arm/boom-arm';
import { ShockMount } from './components/shock-mount/shock-mount';

interface MicrophoneProps {
  readonly color: string;
  readonly ringColor: string;
  readonly boomClamp?: ScenePosition;
}

const BASE_RADIUS = 0.05;
const BASE_HEIGHT = 0.014;
const NECK_HEIGHT = 0.045;
const BODY_RADIUS = 0.028;
const BODY_HEIGHT = 0.15;
const CAP_HEIGHT = 0.012;
const LIGHT_RING_Y = 0.022;
const RING_INTENSITY = 3.5;
const GRILLE_HOLE_COLOR = '#050507';
const GRILLE_TEXTURE_SIZE = { width: 504, height: 432 };

function DeskStand({ color, ringColor }: Omit<MicrophoneProps, 'boomClamp'>) {
  return (
    <>
      <mesh position={[0, BASE_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS * 1.05, BASE_HEIGHT, 40]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, BASE_HEIGHT + 0.002, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[BASE_RADIUS * 0.82, 0.0035, 10, 48]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={RING_INTENSITY} toneMapped={false} />
      </mesh>
      <mesh position={[0, BASE_HEIGHT + NECK_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[0.011, 0.014, NECK_HEIGHT, 20]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.45} />
      </mesh>
    </>
  );
}

function MicrophoneBody({ color, ringColor, bottom }: Omit<MicrophoneProps, 'boomClamp'> & { readonly bottom: number }) {
  const paintGrille = useCallback(
    (context: CanvasRenderingContext2D, size: Dimensions) => paintPerforation(context, size, { background: color, hole: GRILLE_HOLE_COLOR }),
    [color],
  );
  const grille = usePaintedTexture(GRILLE_TEXTURE_SIZE, paintGrille);

  return (
    <>
      <mesh position={[0, bottom + BODY_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[BODY_RADIUS, BODY_RADIUS, BODY_HEIGHT, 40, 1, true]} />
        <meshStandardMaterial map={grille} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, bottom + BODY_HEIGHT + CAP_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[BODY_RADIUS * 0.96, BODY_RADIUS * 1.03, CAP_HEIGHT, 40]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, bottom + 0.004, 0]}>
        <cylinderGeometry args={[BODY_RADIUS * 1.02, BODY_RADIUS * 0.9, 0.008, 40]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, bottom + LIGHT_RING_Y, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[BODY_RADIUS + 0.002, 0.0045, 10, 48]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={RING_INTENSITY} toneMapped={false} />
      </mesh>
    </>
  );
}

export function Microphone({ color, ringColor, boomClamp }: MicrophoneProps) {
  if (!boomClamp) {
    return (
      <group>
        <DeskStand color={color} ringColor={ringColor} />
        <MicrophoneBody color={color} ringColor={ringColor} bottom={BASE_HEIGHT + NECK_HEIGHT} />
      </group>
    );
  }

  return (
    <group>
      <MicrophoneBody color={color} ringColor={ringColor} bottom={0} />
      <ShockMount color={color} microphoneRadius={BODY_RADIUS} />
      <BoomArm clamp={boomClamp} mount={{ x: 0, y: -0.02, z: 0 }} color={color} />
    </group>
  );
}
