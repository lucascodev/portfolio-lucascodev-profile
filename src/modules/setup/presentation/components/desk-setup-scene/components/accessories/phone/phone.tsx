import { RoundedBox } from '@react-three/drei';
import type { PhoneSpec } from '@/modules/setup/domain/types/desk-items/phone.type';
import { PHONE_LAYOUTS } from '@/modules/setup/presentation/constants/phone-layouts.constant';
import { useScreenTexture } from '@/modules/setup/presentation/hooks/use-screen-texture/use-screen-texture';

interface PhoneProps {
  readonly phone: PhoneSpec;
}

const CASE_LIP = 0.0022;
const CASE_BACK_THICKNESS = 0.0016;
const BEZEL_DETAIL_FROM_EDGE = 0.0085;
const HOME_BUTTON_RADIUS = 0.0052;
const BEZEL_DETAIL_COLOR = '#b9bcc4';
const SPEAKER_COLOR = '#2a2b31';

export function Phone({ phone }: PhoneProps) {
  const { body, screen, hasHomeButton } = PHONE_LAYOUTS[phone.model ?? 'full-screen'];
  const texture = useScreenTexture(phone.screen, screen);
  const frontZ = body.depth / 2;

  return (
    <group>
      {phone.caseColor && (
        <RoundedBox
          args={[body.width + CASE_LIP * 2, body.height + CASE_LIP * 2, body.depth + CASE_BACK_THICKNESS]}
          radius={0.005}
          position-z={-CASE_BACK_THICKNESS}
          castShadow
        >
          <meshStandardMaterial color={phone.caseColor} roughness={0.55} />
        </RoundedBox>
      )}
      <RoundedBox args={[body.width, body.height, body.depth]} radius={0.0035} castShadow>
        <meshStandardMaterial color={phone.color} metalness={0.3} roughness={0.3} />
      </RoundedBox>
      <mesh position-z={frontZ + 0.0004}>
        <planeGeometry args={[screen.width, screen.height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {hasHomeButton && (
        <>
          <mesh position={[0, -body.height / 2 + BEZEL_DETAIL_FROM_EDGE, frontZ + 0.0004]}>
            <ringGeometry args={[HOME_BUTTON_RADIUS * 0.84, HOME_BUTTON_RADIUS, 28]} />
            <meshStandardMaterial color={BEZEL_DETAIL_COLOR} metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, body.height / 2 - BEZEL_DETAIL_FROM_EDGE, frontZ + 0.0004]}>
            <planeGeometry args={[0.011, 0.0016]} />
            <meshStandardMaterial color={SPEAKER_COLOR} roughness={0.8} />
          </mesh>
          <mesh position={[-0.0105, body.height / 2 - BEZEL_DETAIL_FROM_EDGE, frontZ + 0.0004]}>
            <circleGeometry args={[0.0012, 12]} />
            <meshStandardMaterial color={SPEAKER_COLOR} roughness={0.4} />
          </mesh>
        </>
      )}
    </group>
  );
}
