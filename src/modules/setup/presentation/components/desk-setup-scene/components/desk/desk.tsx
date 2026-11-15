import { RoundedBox } from '@react-three/drei';
import type { DeskSpec } from '@/modules/setup/domain/types/desk-items/desk.type';

interface DeskProps {
  readonly desk: DeskSpec;
}

const TOP_THICKNESS = 0.035;
const LEG_SIZE = 0.05;
const LEG_INSET = 0.09;
const CROSSBAR_HEIGHT = 0.04;

export function Desk({ desk }: DeskProps) {
  const legHeight = desk.heightMeters - TOP_THICKNESS;
  const legX = desk.widthMeters / 2 - LEG_INSET;
  const legZ = desk.depthMeters / 2 - LEG_INSET;
  const legPositions: [number, number][] = [
    [-legX, -legZ],
    [legX, -legZ],
    [-legX, legZ],
    [legX, legZ],
  ];

  return (
    <group>
      <RoundedBox
        args={[desk.widthMeters, TOP_THICKNESS, desk.depthMeters]}
        radius={0.01}
        position={[0, desk.heightMeters - TOP_THICKNESS / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={desk.topColor} roughness={0.55} />
      </RoundedBox>

      {legPositions.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, legHeight / 2, z]} castShadow>
          <boxGeometry args={[LEG_SIZE, legHeight, LEG_SIZE]} />
          <meshStandardMaterial color={desk.legColor} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      <mesh position={[0, legHeight - CROSSBAR_HEIGHT, -legZ]} castShadow>
        <boxGeometry args={[legX * 2, CROSSBAR_HEIGHT, LEG_SIZE * 0.6]} />
        <meshStandardMaterial color={desk.legColor} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}
