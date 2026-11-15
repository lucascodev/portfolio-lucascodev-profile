import { RoundedBox } from '@react-three/drei';

interface RgbRemoteProps {
  readonly color: string;
}

const BODY_SIZE = { width: 0.04, height: 0.006, depth: 0.086 };
const BUTTON_RADIUS = 0.0034;
const BUTTON_SPACING = 0.0088;
const BUTTON_ROWS: readonly (readonly string[])[] = [
  ['#e5e7eb', '#e5e7eb', '#1f2937', '#ef4444'],
  ['#ef4444', '#22c55e', '#3b82f6', '#f8fafc'],
  ['#f97316', '#84cc16', '#6366f1', '#fda4af'],
  ['#f59e0b', '#06b6d4', '#8b5cf6', '#fbcfe8'],
  ['#fde047', '#0ea5e9', '#d946ef', '#bae6fd'],
];

export function RgbRemote({ color }: RgbRemoteProps) {
  const { width, height, depth } = BODY_SIZE;

  return (
    <group>
      <RoundedBox args={[width, height, depth]} radius={0.002} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.5} />
      </RoundedBox>
      {BUTTON_ROWS.flatMap((row, rowIndex) =>
        row.map((buttonColor, columnIndex) => (
          <mesh
            key={`${rowIndex}-${columnIndex}`}
            position={[
              (columnIndex - (row.length - 1) / 2) * BUTTON_SPACING,
              height + 0.0006,
              (rowIndex - (BUTTON_ROWS.length - 1) / 2) * BUTTON_SPACING * 1.25,
            ]}
          >
            <cylinderGeometry args={[BUTTON_RADIUS, BUTTON_RADIUS, 0.0012, 14]} />
            <meshStandardMaterial color={buttonColor} roughness={0.5} />
          </mesh>
        )),
      )}
    </group>
  );
}
