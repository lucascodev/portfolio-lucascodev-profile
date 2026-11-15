interface TumblerProps {
  readonly color: string;
}

const RADIUS = 0.036;
const HEIGHT = 0.17;
const LID_HEIGHT = 0.022;

export function Tumbler({ color }: TumblerProps) {
  return (
    <group>
      <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[RADIUS, RADIUS * 0.9, HEIGHT, 40]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, HEIGHT + LID_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[RADIUS * 1.02, RADIUS * 1.02, LID_HEIGHT, 40]} />
        <meshStandardMaterial color="#b9b9c2" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}
