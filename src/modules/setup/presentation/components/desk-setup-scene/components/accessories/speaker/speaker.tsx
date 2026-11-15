import { RoundedBox } from '@react-three/drei';

interface SpeakerProps {
  readonly color: string;
}

const WIDTH = 0.12;
const HEIGHT = 0.2;
const DEPTH = 0.14;
const DRIVER_COLOR = '#16161c';

export function Speaker({ color }: SpeakerProps) {
  const frontZ = DEPTH / 2 + 0.002;

  return (
    <group>
      <RoundedBox args={[WIDTH, HEIGHT, DEPTH]} radius={0.008} position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, HEIGHT * 0.35, frontZ]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.04, 0.04, 0.006, 32]} />
        <meshStandardMaterial color={DRIVER_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[0, HEIGHT * 0.78, frontZ]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.016, 0.016, 0.006, 24]} />
        <meshStandardMaterial color={DRIVER_COLOR} roughness={0.4} />
      </mesh>
    </group>
  );
}
