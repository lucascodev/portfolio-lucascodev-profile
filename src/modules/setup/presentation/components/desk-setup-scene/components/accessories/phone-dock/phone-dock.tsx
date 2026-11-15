import { RoundedBox } from '@react-three/drei';
import type { PhoneSpec } from '@/modules/setup/domain/types/desk-items/phone.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { ArmSegment } from '@/modules/setup/presentation/components/arm-segment/arm-segment';
import { Phone } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/phone/phone';
import { PHONE_LAYOUTS } from '@/modules/setup/presentation/constants/phone-layouts.constant';

interface PhoneDockProps {
  readonly color: string;
  readonly phone: PhoneSpec;
}

const BASE_SIZE = { width: 0.086, height: 0.006, depth: 0.1 };
const LEAN_BACK_RADIANS = 0.3;
const CRADLE_ORIGIN = { y: 0.032, z: 0.012 };
const CRADLE_PLATE_SIZE = { width: 0.058, height: 0.1, thickness: 0.004 };
const HOOK_OFFSET_X = 0.018;
const HOOK_WIDTH = 0.012;
const PHONE_ABOVE_HOOKS = 0.007;
const BASE_HINGE: ScenePosition = { x: 0, y: 0.011, z: -0.032 };
const HINGE_RADIUS = 0.006;
const HINGE_LENGTH = 0.034;
const ARM_THICKNESS = 0.022;
const PAD_COLOR = '#15151a';

/** Where a point of the tilted cradle ends up in the dock's own space. */
function cradlePoint(y: number, z: number): ScenePosition {
  return {
    x: 0,
    y: CRADLE_ORIGIN.y + y * Math.cos(LEAN_BACK_RADIANS) + z * Math.sin(LEAN_BACK_RADIANS),
    z: CRADLE_ORIGIN.z - y * Math.sin(LEAN_BACK_RADIANS) + z * Math.cos(LEAN_BACK_RADIANS),
  };
}

/** A folding desk stand: a weighted base, a hinged arm and a tilted cradle that holds the phone on two hooks. */
export function PhoneDock({ color, phone }: PhoneDockProps) {
  const { body } = PHONE_LAYOUTS[phone.model ?? 'full-screen'];
  const metal = <meshStandardMaterial color={color} metalness={0.75} roughness={0.35} />;
  const plateZ = -body.depth / 2 - CRADLE_PLATE_SIZE.thickness / 2 - 0.002;
  const cradleHinge = cradlePoint(CRADLE_PLATE_SIZE.height * 0.55, plateZ - CRADLE_PLATE_SIZE.thickness / 2 - HINGE_RADIUS);

  return (
    <group>
      <RoundedBox
        args={[BASE_SIZE.width, BASE_SIZE.height, BASE_SIZE.depth]}
        radius={0.0028}
        position={[0, BASE_SIZE.height / 2, 0.006]}
        castShadow
        receiveShadow
      >
        {metal}
      </RoundedBox>
      <mesh position={[0, BASE_SIZE.height + 0.0004, 0.012]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[BASE_SIZE.width * 0.7, BASE_SIZE.depth * 0.5]} />
        <meshStandardMaterial color={PAD_COLOR} roughness={0.9} />
      </mesh>

      {[BASE_HINGE, cradleHinge].map((hinge) => (
        <mesh key={hinge.y} position={[hinge.x, hinge.y, hinge.z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[HINGE_RADIUS, HINGE_RADIUS, HINGE_LENGTH, 20]} />
          {metal}
        </mesh>
      ))}
      <ArmSegment from={BASE_HINGE} to={cradleHinge} thickness={ARM_THICKNESS} color={color} />

      <group position={[0, CRADLE_ORIGIN.y, CRADLE_ORIGIN.z]} rotation-x={-LEAN_BACK_RADIANS}>
        <mesh position={[0, CRADLE_PLATE_SIZE.height / 2, plateZ]} castShadow>
          <boxGeometry args={[CRADLE_PLATE_SIZE.width, CRADLE_PLATE_SIZE.height, CRADLE_PLATE_SIZE.thickness]} />
          {metal}
        </mesh>
        <mesh position={[0, CRADLE_PLATE_SIZE.height / 2, plateZ + CRADLE_PLATE_SIZE.thickness / 2 + 0.0004]}>
          <planeGeometry args={[CRADLE_PLATE_SIZE.width * 0.8, CRADLE_PLATE_SIZE.height * 0.7]} />
          <meshStandardMaterial color={PAD_COLOR} roughness={0.9} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position-x={side * HOOK_OFFSET_X}>
            <mesh position={[0, 0.002, 0.001]}>
              <boxGeometry args={[HOOK_WIDTH, 0.006, body.depth + 0.014]} />
              {metal}
            </mesh>
            <mesh position={[0, 0.008, body.depth / 2 + 0.0065]}>
              <boxGeometry args={[HOOK_WIDTH, 0.016, 0.003]} />
              {metal}
            </mesh>
          </group>
        ))}
        <group position={[0, body.height / 2 + PHONE_ABOVE_HOOKS, 0]}>
          <Phone phone={phone} />
        </group>
      </group>
    </group>
  );
}
