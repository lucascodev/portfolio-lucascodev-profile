type Vector3Tuple = [number, number, number];

interface KeyboardKnobProps {
  readonly position: Vector3Tuple;
}

const KNOB_RADIUS = 0.0078;
const KNOB_HEIGHT = 0.015;
const COLLAR_HEIGHT = 0.003;
const KNOB_COLOR = '#17171b';
const COLLAR_COLOR = '#8b8f9a';

export function KeyboardKnob({ position }: KeyboardKnobProps) {
  return (
    <group position={position}>
      <mesh position={[0, COLLAR_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[KNOB_RADIUS * 1.08, KNOB_RADIUS * 1.08, COLLAR_HEIGHT, 28]} />
        <meshStandardMaterial color={COLLAR_COLOR} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, COLLAR_HEIGHT + KNOB_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[KNOB_RADIUS * 0.94, KNOB_RADIUS, KNOB_HEIGHT, 28]} />
        <meshStandardMaterial color={KNOB_COLOR} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}
