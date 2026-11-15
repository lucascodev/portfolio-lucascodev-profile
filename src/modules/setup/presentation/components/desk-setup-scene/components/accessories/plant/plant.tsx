import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

const POT_HEIGHT = 0.1;
const LEAF_COUNT = 9;
const LEAF_COLORS = ['#3f8f4f', '#2f7a43', '#5aa863'] as const;
const SWAY_SPEED = 0.8;
const SWAY_AMPLITUDE = 0.035;

export function Plant() {
  const foliageRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!foliageRef.current) return;
    foliageRef.current.rotation.z = Math.sin(clock.getElapsedTime() * SWAY_SPEED) * SWAY_AMPLITUDE;
  });

  return (
    <group>
      <mesh position={[0, POT_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.058, 0.045, POT_HEIGHT, 32]} />
        <meshStandardMaterial color="#e8e2d6" roughness={0.8} />
      </mesh>
      <mesh position={[0, POT_HEIGHT - 0.006, 0]}>
        <cylinderGeometry args={[0.053, 0.053, 0.004, 24]} />
        <meshStandardMaterial color="#3b2a20" roughness={1} />
      </mesh>

      <group ref={foliageRef} position={[0, POT_HEIGHT, 0]}>
        {Array.from({ length: LEAF_COUNT }, (_, index) => {
          const angle = (index / LEAF_COUNT) * Math.PI * 2;
          const tilt = 0.35 + (index % 3) * 0.18;
          const length = 0.12 + (index % 4) * 0.025;
          return (
            <group key={index} rotation-y={angle}>
              <mesh
                rotation-x={tilt}
                position={[0, (Math.cos(tilt) * length) / 2, (Math.sin(tilt) * length) / 2]}
                scale={[0.024, length / 2, 0.007]}
                castShadow
              >
                <sphereGeometry args={[1, 12, 8]} />
                <meshStandardMaterial color={LEAF_COLORS[index % LEAF_COLORS.length]} roughness={0.6} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
