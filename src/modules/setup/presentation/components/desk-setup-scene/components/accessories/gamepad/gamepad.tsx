import { RoundedBox } from '@react-three/drei';

interface GamepadProps {
  readonly color: string;
}

type Vector3Tuple = [number, number, number];

const HUB_SIZE = { width: 0.1, height: 0.032, depth: 0.058 };
const HUB_CENTER: Vector3Tuple = [0, 0.022, -0.008];
const FACE_Y = HUB_CENTER[1] + HUB_SIZE.height / 2;
const SHOULDER_X = 0.05;
const GRIP_X = 0.057;
const GRIP_SPLAY_RADIANS = 0.3;
const UPPER_ROW_Z = -0.014;
const LOWER_ROW_Z = 0.014;
const OUTER_COLUMN_X = 0.047;
const INNER_COLUMN_X = 0.022;
const STICK_POSITIONS: readonly Vector3Tuple[] = [
  [-OUTER_COLUMN_X, FACE_Y, UPPER_ROW_Z],
  [INNER_COLUMN_X, FACE_Y, LOWER_ROW_Z],
];
const DPAD_POSITION: Vector3Tuple = [-INNER_COLUMN_X, FACE_Y, LOWER_ROW_Z];
const FACE_BUTTON_SPREAD = 0.0098;
const FACE_BUTTON_RADIUS = 0.0048;
const FACE_BUTTONS: readonly { readonly color: string; readonly x: number; readonly z: number }[] = [
  { color: '#22c55e', x: 0, z: 1 },
  { color: '#ef4444', x: 1, z: 0 },
  { color: '#3b82f6', x: -1, z: 0 },
  { color: '#eab308', x: 0, z: -1 },
];
const MENU_BUTTON_OFFSET_X = 0.017;
const GUIDE_RADIUS = 0.0095;
const GUIDE_LIGHT_COLOR = '#4ade80';
const DETAIL_COLOR = '#2b2b31';
const CHROME_COLOR = '#c7cad3';

export function Gamepad({ color }: GamepadProps) {
  const shell = <meshStandardMaterial color={color} roughness={0.5} />;
  const detail = <meshStandardMaterial color={DETAIL_COLOR} roughness={0.6} />;

  return (
    <group>
      <RoundedBox args={[HUB_SIZE.width, HUB_SIZE.height, HUB_SIZE.depth]} radius={0.014} position={HUB_CENTER} castShadow receiveShadow>
        {shell}
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * SHOULDER_X, 0.0205, -0.012]} scale={[0.031, 0.0185, 0.031]} castShadow>
            <sphereGeometry args={[1, 28, 18]} />
            {shell}
          </mesh>
          <mesh position={[side * GRIP_X, 0.019, 0.026]} rotation-y={side * GRIP_SPLAY_RADIANS} scale={[0.024, 0.019, 0.044]} castShadow>
            <sphereGeometry args={[1, 28, 18]} />
            {shell}
          </mesh>
          <mesh position={[side * 0.04, 0.03, -0.039]} rotation-y={side * -0.25} castShadow>
            <boxGeometry args={[0.038, 0.009, 0.012]} />
            <meshStandardMaterial color={DETAIL_COLOR} metalness={0.3} roughness={0.3} />
          </mesh>
          <mesh position={[side * 0.042, 0.016, -0.04]}>
            <boxGeometry args={[0.024, 0.016, 0.014]} />
            {detail}
          </mesh>
          <mesh position={[side * MENU_BUTTON_OFFSET_X, FACE_Y + 0.0006, UPPER_ROW_Z]}>
            <cylinderGeometry args={[0.0028, 0.0028, 0.0014, 14]} />
            {detail}
          </mesh>
        </group>
      ))}

      {STICK_POSITIONS.map((position) => (
        <group key={position.join(',')} position={position}>
          <mesh position-y={0.0012}>
            <cylinderGeometry args={[0.011, 0.012, 0.0024, 24]} />
            {detail}
          </mesh>
          <mesh position-y={0.005}>
            <cylinderGeometry args={[0.0045, 0.006, 0.008, 16]} />
            {detail}
          </mesh>
          <mesh position-y={0.0105}>
            <cylinderGeometry args={[0.0092, 0.0085, 0.0035, 24]} />
            <meshStandardMaterial color={DETAIL_COLOR} roughness={0.85} />
          </mesh>
        </group>
      ))}

      <group position={DPAD_POSITION}>
        <mesh position-y={0.0012}>
          <cylinderGeometry args={[0.0128, 0.0128, 0.0024, 28]} />
          {detail}
        </mesh>
        {[0, Math.PI / 2].map((rotation) => (
          <mesh key={rotation} position-y={0.0034} rotation-y={rotation}>
            <boxGeometry args={[0.0205, 0.0022, 0.0064]} />
            <meshStandardMaterial color="#3a3a42" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {FACE_BUTTONS.map((button) => (
        <mesh
          key={button.color}
          position={[OUTER_COLUMN_X + button.x * FACE_BUTTON_SPREAD, FACE_Y + 0.0006, UPPER_ROW_Z + button.z * FACE_BUTTON_SPREAD]}
          scale={[1, 0.55, 1]}
        >
          <sphereGeometry args={[FACE_BUTTON_RADIUS, 18, 12]} />
          <meshStandardMaterial color={button.color} roughness={0.25} />
        </mesh>
      ))}

      <group position={[0, FACE_Y, UPPER_ROW_Z]}>
        <mesh scale={[1, 0.45, 1]}>
          <sphereGeometry args={[GUIDE_RADIUS, 24, 14]} />
          <meshStandardMaterial color={CHROME_COLOR} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position-y={0.0008} rotation-x={Math.PI / 2}>
          <torusGeometry args={[GUIDE_RADIUS + 0.0014, 0.001, 8, 20, Math.PI / 2]} />
          <meshStandardMaterial color="#000000" emissive={GUIDE_LIGHT_COLOR} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
