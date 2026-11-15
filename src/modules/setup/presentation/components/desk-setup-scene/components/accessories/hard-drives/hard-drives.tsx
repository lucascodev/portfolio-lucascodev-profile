import { HARD_DRIVE_SIZE } from '@/modules/setup/presentation/constants/accessory-dimensions.constant';

interface HardDrivesProps {
  readonly count: number;
}

const SHELL_COLOR = '#aeb2bb';
const LABEL_COLOR = '#f1f2f4';
const LABEL_PRINT_COLOR = '#30323a';
const CIRCUIT_BOARD_COLOR = '#1f6b3a';
const STACK_TWIST_RADIANS = 0.34;
const STACK_SLIDE_METERS = 0.011;

/** Alternates the twist and the slide so the pile looks dropped on the desk, not machined. */
const stackOffset = (index: number) => ({
  rotationY: (index % 2 === 0 ? 1 : -1) * STACK_TWIST_RADIANS * Math.ceil(index / 2),
  x: (index % 2 === 0 ? -1 : 1) * STACK_SLIDE_METERS * Math.ceil(index / 2),
});

function HardDrive() {
  const { width, height, depth } = HARD_DRIVE_SIZE;

  return (
    <group>
      <mesh position-y={height / 2} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={SHELL_COLOR} metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, height + 0.0003, 0.006]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[width * 0.78, depth * 0.66]} />
        <meshStandardMaterial color={LABEL_COLOR} roughness={0.7} />
      </mesh>
      {[-0.014, -0.004].map((offsetZ) => (
        <mesh key={offsetZ} position={[-0.006, height + 0.0005, offsetZ]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[width * 0.5, 0.004]} />
          <meshStandardMaterial color={LABEL_PRINT_COLOR} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, height / 2, -depth / 2 - 0.0015]}>
        <boxGeometry args={[width * 0.8, height * 0.5, 0.003]} />
        <meshStandardMaterial color={CIRCUIT_BOARD_COLOR} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function HardDrives({ count }: HardDrivesProps) {
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const { rotationY, x } = stackOffset(index);
        return (
          <group key={index} position={[x, index * HARD_DRIVE_SIZE.height, 0]} rotation-y={rotationY}>
            <HardDrive />
          </group>
        );
      })}
    </group>
  );
}
