interface ShockMountProps {
  readonly color: string;
  readonly microphoneRadius: number;
}

const RING_RADIUS = 0.047;
const UPPER_RING_Y = 0.04;
const LOWER_RING_Y = 0.004;
const RING_TUBE = 0.0036;
const STRUT_COUNT = 4;
const BAND_COUNT = 6;
const BAND_COLOR = '#3b1418';
const FULL_TURN = Math.PI * 2;

export function ShockMount({ color, microphoneRadius }: ShockMountProps) {
  const frame = <meshStandardMaterial color={color} metalness={0.5} roughness={0.45} />;
  const bandLength = RING_RADIUS - microphoneRadius;
  const bandRadius = microphoneRadius + bandLength / 2;

  return (
    <group>
      {[UPPER_RING_Y, LOWER_RING_Y].map((ringY) => (
        <mesh key={ringY} position-y={ringY} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[RING_RADIUS, RING_TUBE, 10, 48]} />
          {frame}
        </mesh>
      ))}
      {Array.from({ length: STRUT_COUNT }, (_, index) => {
        const angle = (index / STRUT_COUNT) * FULL_TURN + FULL_TURN / 8;
        return (
          <mesh
            key={`strut-${index}`}
            position={[Math.cos(angle) * RING_RADIUS, (UPPER_RING_Y + LOWER_RING_Y) / 2, Math.sin(angle) * RING_RADIUS]}
          >
            <cylinderGeometry args={[RING_TUBE * 0.8, RING_TUBE * 0.8, UPPER_RING_Y - LOWER_RING_Y, 10]} />
            {frame}
          </mesh>
        );
      })}
      {Array.from({ length: BAND_COUNT }, (_, index) => {
        const angle = (index / BAND_COUNT) * FULL_TURN;
        const bandY = index % 2 === 0 ? UPPER_RING_Y : LOWER_RING_Y;
        return (
          <mesh key={`band-${index}`} position={[Math.cos(angle) * bandRadius, bandY, Math.sin(angle) * bandRadius]} rotation-y={-angle}>
            <boxGeometry args={[bandLength, 0.002, 0.003]} />
            <meshStandardMaterial color={BAND_COLOR} roughness={0.9} />
          </mesh>
        );
      })}
      <mesh position-y={LOWER_RING_Y - 0.012}>
        <cylinderGeometry args={[0.009, 0.012, 0.02, 16]} />
        {frame}
      </mesh>
    </group>
  );
}
