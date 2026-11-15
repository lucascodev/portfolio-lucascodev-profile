import { RoundedBox } from '@react-three/drei';
import { POWER_STRIP_SIZE } from '@/modules/setup/presentation/constants/accessory-dimensions.constant';

interface PowerStripProps {
  readonly color: string;
}

const SOCKET_COUNT = 5;
const SOCKET_SPACING = 0.055;
const SWITCH_COLOR = '#ef4444';

export function PowerStrip({ color }: PowerStripProps) {
  const { width, height, depth } = POWER_STRIP_SIZE;

  return (
    <group>
      <RoundedBox args={[width, height, depth]} radius={0.006} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      {Array.from({ length: SOCKET_COUNT }, (_, index) => (
        <mesh key={index} position={[(index - (SOCKET_COUNT - 1) / 2) * SOCKET_SPACING, height + 0.0005, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.015, 24]} />
          <meshStandardMaterial color="#0b0b0e" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[width / 2 - 0.012, height + 0.002, 0]}>
        <boxGeometry args={[0.012, 0.004, 0.016]} />
        <meshStandardMaterial color={SWITCH_COLOR} emissive={SWITCH_COLOR} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}
