import type { Material } from 'three';

type Vector3Tuple = [number, number, number];

interface PumpHeadProps {
  readonly position: Vector3Tuple;
  readonly glowMaterial: Material;
}

const RADIUS = 0.03;
const DEPTH = 0.026;
const FACE_Z = DEPTH / 2;
const BODY_COLOR = '#131317';
const LOGO_COLOR = '#f4f4ff';
const MIRROR_RING_RADII = [0.025, 0.019, 0.013];

export function PumpHead({ position, glowMaterial }: PumpHeadProps) {
  return (
    <group position={position}>
      <mesh rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, DEPTH, 36]} />
        <meshStandardMaterial color={BODY_COLOR} metalness={0.6} roughness={0.3} />
      </mesh>
      {MIRROR_RING_RADII.map((ringRadius, index) => (
        <mesh key={ringRadius} position-z={FACE_Z + 0.0006 - index * 0.0001} material={glowMaterial}>
          <ringGeometry args={[ringRadius - 0.0012, ringRadius, 40]} />
        </mesh>
      ))}
      <mesh position-z={FACE_Z + 0.0008}>
        <circleGeometry args={[0.0055, 20]} />
        <meshStandardMaterial color={LOGO_COLOR} emissive={LOGO_COLOR} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}
