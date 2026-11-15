import { RoundedBox } from '@react-three/drei';
import type { ArrangedLaptop } from '@/modules/setup/domain/types/laptop/arranged-laptop.type';
import {
  LAPTOP_DECK_THICKNESS_METERS,
  LAPTOP_TRAY_THICKNESS_METERS,
  LAPTOP_TRAY_TILT_RADIANS,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import { useScreenTexture } from '@/modules/setup/presentation/hooks/use-screen-texture/use-screen-texture';
import { LaptopTray } from './components/laptop-tray/laptop-tray';

interface LaptopProps {
  readonly laptop: ArrangedLaptop;
}

const DECK_THICKNESS = LAPTOP_DECK_THICKNESS_METERS;
const LID_THICKNESS = 0.005;
const LID_LEAN_BACK_RADIANS = 0.3;
const SCREEN_CHIN_METERS = 0.016;
const TRAY_THICKNESS = LAPTOP_TRAY_THICKNESS_METERS;
const KEYBOARD_COLOR = '#16161b';

export function Laptop({ laptop }: LaptopProps) {
  const { spec, screenSize, bodySize } = laptop;
  const texture = useScreenTexture(spec.screen, screenSize);
  const isOnTray = spec.mount === 'arm-tray';
  const deckWidth = bodySize.width;
  const deckDepth = bodySize.height;
  const lidHeight = screenSize.height + SCREEN_CHIN_METERS + 0.008;
  const deckTopY = DECK_THICKNESS + 0.0005;

  return (
    <group rotation-x={isOnTray ? LAPTOP_TRAY_TILT_RADIANS : 0}>
      {isOnTray && <LaptopTray width={deckWidth + 0.05} depth={deckDepth + 0.04} thickness={TRAY_THICKNESS} />}

      <group position-y={isOnTray ? TRAY_THICKNESS : 0}>
        <RoundedBox
          args={[deckWidth, DECK_THICKNESS, deckDepth]}
          radius={0.004}
          position={[0, DECK_THICKNESS / 2, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={spec.bodyColor} metalness={0.7} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, deckTopY, -deckDepth * 0.13]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[deckWidth * 0.86, deckDepth * 0.42]} />
          <meshStandardMaterial color={KEYBOARD_COLOR} roughness={0.8} />
        </mesh>
        <mesh position={[0, deckTopY, deckDepth * 0.26]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[deckWidth * 0.42, deckDepth * 0.3]} />
          <meshStandardMaterial color={spec.bodyColor} metalness={0.5} roughness={0.25} />
        </mesh>

        <group position={[0, DECK_THICKNESS, -deckDepth / 2]} rotation-x={-LID_LEAN_BACK_RADIANS}>
          <RoundedBox
            args={[deckWidth, lidHeight, LID_THICKNESS]}
            radius={0.002}
            position={[0, lidHeight / 2, -LID_THICKNESS / 2]}
            castShadow
          >
            <meshStandardMaterial color={spec.bodyColor} metalness={0.7} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, SCREEN_CHIN_METERS + screenSize.height / 2, 0.0006]}>
            <planeGeometry args={[screenSize.width, screenSize.height]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
