import { RoundedBox } from '@react-three/drei';

interface DrawingTabletProps {
  readonly color: string;
  readonly penColor: string;
}

const TABLET_WIDTH = 0.264;
const TABLET_DEPTH = 0.2;
const TABLET_THICKNESS = 0.009;
const EXPRESS_KEY_COUNT = 4;
const PEN_LENGTH = 0.155;
const PEN_RADIUS = 0.0048;
const PEN_ROTATION_RADIANS = 0.55;

function Pen({ color }: { readonly color: string }) {
  return (
    <group position={[0.02, TABLET_THICKNESS + PEN_RADIUS, 0.015]} rotation-y={PEN_ROTATION_RADIANS}>
      <mesh rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[PEN_RADIUS, PEN_RADIUS * 0.9, PEN_LENGTH, 20]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <mesh position-x={PEN_LENGTH / 2 + 0.008} rotation-z={-Math.PI / 2}>
        <coneGeometry args={[PEN_RADIUS * 0.9, 0.016, 20]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <mesh position-x={PEN_LENGTH * 0.18} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[PEN_RADIUS * 1.05, PEN_RADIUS * 1.05, 0.03, 20]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function DrawingTablet({ color, penColor }: DrawingTabletProps) {
  const keySpacing = TABLET_WIDTH / 7;

  return (
    <group>
      <RoundedBox
        args={[TABLET_WIDTH, TABLET_THICKNESS, TABLET_DEPTH]}
        radius={0.004}
        position={[0, TABLET_THICKNESS / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, TABLET_THICKNESS + 0.0004, 0.018]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[TABLET_WIDTH * 0.82, TABLET_DEPTH * 0.68]} />
        <meshStandardMaterial color="#25252b" roughness={0.35} />
      </mesh>
      {Array.from({ length: EXPRESS_KEY_COUNT }, (_, index) => (
        <mesh
          key={index}
          position={[(index - (EXPRESS_KEY_COUNT - 1) / 2) * keySpacing, TABLET_THICKNESS + 0.0008, -TABLET_DEPTH / 2 + 0.017]}
        >
          <boxGeometry args={[keySpacing * 0.8, 0.0016, 0.012]} />
          <meshStandardMaterial color="#2e2e36" roughness={0.6} />
        </mesh>
      ))}
      <Pen color={penColor} />
    </group>
  );
}
