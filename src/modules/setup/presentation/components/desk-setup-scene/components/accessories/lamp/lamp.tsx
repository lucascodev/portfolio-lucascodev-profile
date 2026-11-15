import { useState } from 'react';
import { Object3D } from 'three';

interface LampProps {
  readonly lightColor: string;
  readonly armDirection: 1 | -1;
}

const POLE_HEIGHT = 0.42;
const ARM_LENGTH = 0.26;
const METAL_COLOR = '#1f1f27';

export function Lamp({ lightColor, armDirection }: LampProps) {
  const [lightTarget] = useState(() => new Object3D());
  const headX = armDirection * ARM_LENGTH;

  return (
    <group>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.065, 0.016, 32]} />
        <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, POLE_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, POLE_HEIGHT, 12]} />
        <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[headX / 2, POLE_HEIGHT, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.007, 0.007, ARM_LENGTH, 12]} />
        <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[headX, POLE_HEIGHT - 0.03, 0]} castShadow>
        <coneGeometry args={[0.055, 0.07, 32, 1, true]} />
        <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.35} side={2} />
      </mesh>
      <mesh position={[headX, POLE_HEIGHT - 0.055, 0]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={4} toneMapped={false} />
      </mesh>

      <primitive object={lightTarget} position={[headX, 0, 0]} />
      <spotLight
        position={[headX, POLE_HEIGHT - 0.06, 0]}
        target={lightTarget}
        color={lightColor}
        intensity={2.5}
        angle={0.75}
        penumbra={0.8}
        distance={1.4}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </group>
  );
}
