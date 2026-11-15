interface HeadphonesProps {
  readonly color: string;
}

const STAND_HEIGHT = 0.27;
const BAND_RADIUS = 0.085;
const STAND_COLOR = '#23232b';

export function Headphones({ color }: HeadphonesProps) {
  const bandCenterY = STAND_HEIGHT - BAND_RADIUS + 0.012;

  return (
    <group>
      <mesh position={[0, 0.006, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.012, 32]} />
        <meshStandardMaterial color={STAND_COLOR} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, STAND_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, STAND_HEIGHT, 12]} />
        <meshStandardMaterial color={STAND_COLOR} metalness={0.5} roughness={0.4} />
      </mesh>

      <group position={[0, bandCenterY, 0]} rotation-y={Math.PI / 2}>
        <mesh castShadow>
          <torusGeometry args={[BAND_RADIUS, 0.011, 12, 40, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * BAND_RADIUS, -0.012, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.032, 32]} />
            <meshStandardMaterial color={color} roughness={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
