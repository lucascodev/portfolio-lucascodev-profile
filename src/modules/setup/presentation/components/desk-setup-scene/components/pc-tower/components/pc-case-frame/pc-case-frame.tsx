import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import { PC_CASE_WALL_METERS } from '@/modules/setup/presentation/constants/pc-case-layout.constant';

interface PcCaseFrameProps {
  readonly caseColor: string;
  readonly outerSide: 1 | -1;
}

const { width: WIDTH, height: HEIGHT, depth: DEPTH } = PC_CASE_DIMENSIONS;
const WALL = PC_CASE_WALL_METERS;
const PILLAR = 0.012;
const GLASS_COLOR = '#b9c6ff';

type Vector3Tuple = [number, number, number];

export function PcCaseFrame({ caseColor, outerSide }: PcCaseFrameProps) {
  const panels: { size: Vector3Tuple; position: Vector3Tuple }[] = [
    { size: [WIDTH, WALL, DEPTH], position: [0, WALL / 2, 0] },
    { size: [WIDTH, WALL, DEPTH], position: [0, HEIGHT - WALL / 2, 0] },
    { size: [WIDTH, HEIGHT, WALL], position: [0, HEIGHT / 2, -DEPTH / 2 + WALL / 2] },
    { size: [WALL, HEIGHT, DEPTH], position: [-outerSide * (WIDTH / 2 - WALL / 2), HEIGHT / 2, 0] },
    { size: [WIDTH, PILLAR, PILLAR], position: [0, HEIGHT - PILLAR / 2, DEPTH / 2 - PILLAR / 2] },
    { size: [WIDTH, PILLAR, PILLAR], position: [0, PILLAR / 2, DEPTH / 2 - PILLAR / 2] },
    { size: [PILLAR, HEIGHT, PILLAR], position: [outerSide * (WIDTH / 2 - PILLAR / 2), HEIGHT / 2, -DEPTH / 2 + PILLAR / 2] },
    { size: [PILLAR, HEIGHT, PILLAR], position: [-outerSide * (WIDTH / 2 - PILLAR / 2), HEIGHT / 2, DEPTH / 2 - PILLAR / 2] },
  ];
  const feet: Vector3Tuple[] = [-1, 1].flatMap((sideX) =>
    [-1, 1].map((sideZ): Vector3Tuple => [sideX * (WIDTH / 2 - 0.035), -0.008, sideZ * (DEPTH / 2 - 0.03)]),
  );

  return (
    <group>
      {panels.map(({ size, position }) => (
        <mesh key={position.join(',')} position={position} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={caseColor} metalness={0.45} roughness={0.45} />
        </mesh>
      ))}
      {feet.map((position) => (
        <mesh key={position.join(',')} position={position}>
          <boxGeometry args={[0.06, 0.016, 0.04]} />
          <meshStandardMaterial color={caseColor} metalness={0.45} roughness={0.45} />
        </mesh>
      ))}

      <mesh position={[0, HEIGHT / 2, DEPTH / 2]}>
        <boxGeometry args={[WIDTH, HEIGHT - WALL * 2, 0.003]} />
        <meshPhysicalMaterial color={GLASS_COLOR} transparent opacity={0.08} roughness={0.05} depthWrite={false} />
      </mesh>
      <mesh position={[outerSide * (WIDTH / 2), HEIGHT / 2, 0]}>
        <boxGeometry args={[0.003, HEIGHT - WALL * 2, DEPTH]} />
        <meshPhysicalMaterial color={GLASS_COLOR} transparent opacity={0.08} roughness={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}
