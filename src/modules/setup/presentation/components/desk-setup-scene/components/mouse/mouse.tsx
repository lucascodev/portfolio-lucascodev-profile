import type { MouseSpec } from '@/modules/setup/domain/types/desk-items/mouse.type';

interface MouseProps {
  readonly mouse: MouseSpec;
}

const LIGHT_INTENSITY = 3;

export function Mouse({ mouse }: MouseProps) {
  return (
    <group>
      <mesh scale={[0.032, 0.036, 0.062]} castShadow>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={mouse.color} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.034, -0.026]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.0045, 0.0045, 0.005, 16]} />
        <meshStandardMaterial color="#2a2a33" roughness={0.8} />
      </mesh>
      {mouse.lightColor && (
        <mesh position={[0, 0.0008, 0]} rotation-x={-Math.PI / 2} scale={[0.033, 0.063, 1]}>
          <ringGeometry args={[0.92, 1, 48]} />
          <meshStandardMaterial
            color={mouse.lightColor}
            emissive={mouse.lightColor}
            emissiveIntensity={LIGHT_INTENSITY}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
