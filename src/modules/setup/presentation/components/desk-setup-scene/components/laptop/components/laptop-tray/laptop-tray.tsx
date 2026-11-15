interface LaptopTrayProps {
  readonly width: number;
  readonly depth: number;
  readonly thickness: number;
}

const TRAY_COLOR = '#1b1b20';
const LIP_HEIGHT = 0.022;
const LIP_WIDTH = 0.05;
const LIP_INSET = 0.04;

export function LaptopTray({ width, depth, thickness }: LaptopTrayProps) {
  const lipX = width / 2 - LIP_INSET;

  return (
    <group>
      <mesh position={[0, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, thickness, depth]} />
        <meshStandardMaterial color={TRAY_COLOR} metalness={0.5} roughness={0.5} />
      </mesh>
      {[-lipX, lipX].map((x) => (
        <mesh key={x} position={[x, LIP_HEIGHT / 2, depth / 2]} castShadow>
          <boxGeometry args={[LIP_WIDTH, LIP_HEIGHT, 0.006]} />
          <meshStandardMaterial color={TRAY_COLOR} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
