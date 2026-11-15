import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { MeshStandardMaterial, RepeatWrapping } from 'three';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { paintRainbowGradient } from '@/modules/setup/presentation/textures/paint-rainbow-gradient';

type Vector3Tuple = [number, number, number];

interface RamBankProps {
  readonly position: Vector3Tuple;
  readonly direction: 1 | -1;
}

const SLOT_COUNT = 4;
const SLOT_SPACING = 0.012;
const POPULATED_SLOTS: readonly number[] = [1, 3];
const SLOT_LENGTH = 0.126;
const STICK_LENGTH = 0.12;
const SPREADER_DEPTH = 0.022;
const LIGHT_BAR_DEPTH = 0.008;
const SLOT_COLOR = '#2a2b31';
const SPREADER_COLOR = '#1d1d23';
const RAINBOW_TEXTURE_SIZE = { width: 8, height: 256 };
const LIGHT_INTENSITY = 2.4;
const RAINBOW_FLOW_PER_SECOND = 0.12;

function useFlowingRainbowMaterial(): MeshStandardMaterial {
  const rainbow = usePaintedTexture(RAINBOW_TEXTURE_SIZE, paintRainbowGradient);
  const flowingRainbow = useMemo(() => {
    const texture = rainbow.clone();
    texture.wrapT = RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }, [rainbow]);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#000000',
        emissive: '#ffffff',
        emissiveMap: flowingRainbow,
        emissiveIntensity: LIGHT_INTENSITY,
        toneMapped: false,
      }),
    [flowingRainbow],
  );

  useEffect(() => () => flowingRainbow.dispose(), [flowingRainbow]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ clock }) => flowingRainbow.offset.setY(clock.getElapsedTime() * RAINBOW_FLOW_PER_SECOND));

  return material;
}

export function RamBank({ position, direction }: RamBankProps) {
  const lightMaterial = useFlowingRainbowMaterial();

  return (
    <group position={position}>
      {Array.from({ length: SLOT_COUNT }, (_, slot) => (
        <group key={slot} position-x={direction * slot * SLOT_SPACING}>
          <mesh position-z={0.003}>
            <boxGeometry args={[0.005, SLOT_LENGTH, 0.006]} />
            <meshStandardMaterial color={SLOT_COLOR} roughness={0.7} />
          </mesh>
          {POPULATED_SLOTS.includes(slot) && (
            <>
              <mesh position-z={0.006 + SPREADER_DEPTH / 2} castShadow>
                <boxGeometry args={[0.006, STICK_LENGTH, SPREADER_DEPTH]} />
                <meshStandardMaterial color={SPREADER_COLOR} metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh position-z={0.006 + SPREADER_DEPTH + LIGHT_BAR_DEPTH / 2} material={lightMaterial}>
                <boxGeometry args={[0.007, STICK_LENGTH, LIGHT_BAR_DEPTH]} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
