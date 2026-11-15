import { RoundedBox } from '@react-three/drei';

type Vector3Tuple = [number, number, number];

interface WebcamProps {
  readonly position: Vector3Tuple;
}

const BODY_COLOR = '#111115';
const GRILLE_COLOR = '#1b1b21';
const LENS_COLOR = '#27345c';
const BODY_SIZE = { width: 0.094, height: 0.029, depth: 0.026 };
const BODY_Y = 0.0165;
const FRONT_Z = BODY_SIZE.depth / 2;
const GRILLE_OFFSET_X = 0.034;
const SHUTTER_OPEN_RADIANS = 1.9;
const SHUTTER_SIZE = { width: 0.03, thickness: 0.003, length: 0.02 };

export function Webcam({ position }: WebcamProps) {
  return (
    <group position={position}>
      <RoundedBox args={[BODY_SIZE.width, BODY_SIZE.height, BODY_SIZE.depth]} radius={0.006} position={[0, BODY_Y, 0]} castShadow>
        <meshStandardMaterial color={BODY_COLOR} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, BODY_Y, FRONT_Z + 0.0006]}>
        <planeGeometry args={[0.04, BODY_SIZE.height * 0.82]} />
        <meshStandardMaterial color="#07070b" metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[0, BODY_Y, FRONT_Z + 0.0015]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.009, 0.009, 0.002, 24]} />
        <meshStandardMaterial color={LENS_COLOR} metalness={0.9} roughness={0.1} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * GRILLE_OFFSET_X, BODY_Y, FRONT_Z + 0.0006]}>
          <planeGeometry args={[0.02, BODY_SIZE.height * 0.6]} />
          <meshStandardMaterial color={GRILLE_COLOR} roughness={0.9} />
        </mesh>
      ))}

      <group position={[0, BODY_Y + BODY_SIZE.height / 2, FRONT_Z]} rotation-x={-SHUTTER_OPEN_RADIANS}>
        <mesh position={[0, 0, SHUTTER_SIZE.length / 2]}>
          <boxGeometry args={[SHUTTER_SIZE.width, SHUTTER_SIZE.thickness, SHUTTER_SIZE.length]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.6} />
        </mesh>
      </group>

      <mesh position={[0, -0.004, -0.012]}>
        <boxGeometry args={[0.03, 0.03, 0.006]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.5} />
      </mesh>
    </group>
  );
}
