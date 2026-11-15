import type { PhoneSpec } from '@/modules/setup/domain/types/desk-items/phone.type';
import { Phone } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/phone/phone';
import {
  PHONE_SIZE,
  PHONE_STAND_POLE_HEIGHT_METERS,
} from '@/modules/setup/presentation/constants/accessory-dimensions.constant';

interface PhoneStandProps {
  readonly color: string;
  readonly phone?: PhoneSpec;
}

const CLAMP_WIDTH = PHONE_SIZE.width + 0.014;
const CLAMP_Y = PHONE_STAND_POLE_HEIGHT_METERS + 0.025;
const PHONE_FORWARD_OFFSET = 0.018;

export function PhoneStand({ color, phone }: PhoneStandProps) {
  const material = <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />;

  return (
    <group>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.072, 0.016, 40]} />
        {material}
      </mesh>
      <mesh position={[0, PHONE_STAND_POLE_HEIGHT_METERS / 2, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, PHONE_STAND_POLE_HEIGHT_METERS, 14]} />
        {material}
      </mesh>
      <mesh position={[0, PHONE_STAND_POLE_HEIGHT_METERS + 0.01, 0]}>
        <sphereGeometry args={[0.012, 16, 12]} />
        {material}
      </mesh>
      <mesh position={[0, CLAMP_Y, -0.008]} castShadow>
        <boxGeometry args={[CLAMP_WIDTH, 0.014, 0.008]} />
        {material}
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * CLAMP_WIDTH) / 2, CLAMP_Y + 0.008, PHONE_FORWARD_OFFSET]} castShadow>
          <boxGeometry args={[0.008, 0.032, 0.018]} />
          {material}
        </mesh>
      ))}
      {phone && (
        <group position={[0, CLAMP_Y + 0.012, PHONE_FORWARD_OFFSET]}>
          <Phone phone={phone} />
        </group>
      )}
    </group>
  );
}
