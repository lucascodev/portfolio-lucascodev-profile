import { RoundedBox } from '@react-three/drei';

interface ToyCarProps {
  readonly color: string;
}

const BODY_SIZE = { width: 0.03, height: 0.008, depth: 0.072 };
const CABIN_SIZE = { width: 0.023, height: 0.008, depth: 0.03 };
const WHEEL_RADIUS = 0.0056;
const WHEEL_WIDTH = 0.005;
const AXLE_OFFSET_Z = 0.022;
const BODY_Y = WHEEL_RADIUS + 0.003;
const GLASS_COLOR = '#0b1220';
const TYRE_COLOR = '#111114';

export function ToyCar({ color }: ToyCarProps) {
  return (
    <group>
      <RoundedBox args={[BODY_SIZE.width, BODY_SIZE.height, BODY_SIZE.depth]} radius={0.003} position={[0, BODY_Y, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.25} />
      </RoundedBox>
      <RoundedBox
        args={[CABIN_SIZE.width, CABIN_SIZE.height, CABIN_SIZE.depth]}
        radius={0.003}
        position={[0, BODY_Y + BODY_SIZE.height / 2 + CABIN_SIZE.height / 2 - 0.001, -0.004]}
        castShadow
      >
        <meshStandardMaterial color={GLASS_COLOR} metalness={0.7} roughness={0.15} />
      </RoundedBox>
      <mesh position={[0, BODY_Y + BODY_SIZE.height / 2 + 0.004, -BODY_SIZE.depth / 2 + 0.004]}>
        <boxGeometry args={[BODY_SIZE.width, 0.0015, 0.007]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.25} />
      </mesh>

      {[-1, 1].flatMap((sideX) =>
        [-1, 1].map((sideZ) => (
          <mesh
            key={`${sideX}-${sideZ}`}
            position={[sideX * (BODY_SIZE.width / 2), WHEEL_RADIUS, sideZ * AXLE_OFFSET_Z]}
            rotation-z={Math.PI / 2}
          >
            <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_WIDTH, 16]} />
            <meshStandardMaterial color={TYRE_COLOR} roughness={0.8} />
          </mesh>
        )),
      )}
    </group>
  );
}
