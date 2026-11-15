import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Material } from 'three';

type Vector3Tuple = [number, number, number];

interface CaseFanProps {
  readonly position: Vector3Tuple;
  readonly rotation: Vector3Tuple;
  readonly radius: number;
  readonly glowMaterial: Material;
  readonly bladeMaterial: Material;
}

const BLADE_COUNT = 9;
const SPIN_RADIANS_PER_SECOND = 9;
const HUB_COLOR = '#131317';
const HUB_STICKER_COLOR = '#8f929c';

export function CaseFan({ position, rotation, radius, glowMaterial, bladeMaterial }: CaseFanProps) {
  const bladesRef = useRef<Group>(null);

  useFrame((_, deltaSeconds) => {
    if (bladesRef.current) bladesRef.current.rotation.z += deltaSeconds * SPIN_RADIANS_PER_SECOND;
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh material={glowMaterial}>
        <torusGeometry args={[radius, radius * 0.07, 10, 48]} />
      </mesh>
      <mesh material={glowMaterial}>
        <ringGeometry args={[radius * 0.84, radius, 48]} />
      </mesh>
      <mesh material={glowMaterial} position-z={0.0005}>
        <ringGeometry args={[radius * 0.72, radius * 0.76, 48]} />
      </mesh>

      <group ref={bladesRef} position-z={-0.002}>
        {Array.from({ length: BLADE_COUNT }, (_, index) => {
          const angle = (index * Math.PI * 2) / BLADE_COUNT;
          return (
            <mesh
              key={index}
              material={bladeMaterial}
              position={[Math.cos(angle) * radius * 0.48, Math.sin(angle) * radius * 0.48, 0]}
              rotation-z={angle + 0.5}
            >
              <boxGeometry args={[radius * 0.56, radius * 0.3, 0.003]} />
            </mesh>
          );
        })}
      </group>

      <mesh position-z={0.002}>
        <circleGeometry args={[radius * 0.3, 28]} />
        <meshStandardMaterial color={HUB_COLOR} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position-z={0.0026}>
        <circleGeometry args={[radius * 0.15, 24]} />
        <meshStandardMaterial color={HUB_STICKER_COLOR} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}
