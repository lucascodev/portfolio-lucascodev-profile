import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { Cable } from '@/modules/setup/presentation/components/cable/cable';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { paintGpuBackplate } from '@/modules/setup/presentation/textures/paint-gpu-backplate';
import { paintGpuLabel } from '@/modules/setup/presentation/textures/paint-gpu-label';

type Vector3Tuple = [number, number, number];

interface GraphicsCardProps {
  readonly position: Vector3Tuple;
  readonly outerSide: 1 | -1;
  /** Height of the PSU shroud top, relative to the card center, where the support bracket stands. */
  readonly shroudTopY: number;
}

const LENGTH = 0.28;
const THICKNESS = 0.05;
const HEIGHT = 0.12;
const FRONT_Z = HEIGHT / 2;
const BACKPLATE_THICKNESS = 0.004;
const BACKPLATE_TOP_Y = THICKNESS / 2 + BACKPLATE_THICKNESS;
const FAN_SHROUD_HEIGHT = 0.012;
const UNDERSIDE_Y = -THICKNESS / 2 - FAN_SHROUD_HEIGHT;
const LABEL_TEXTURE_SIZE = { width: 768, height: 128 };
const BACKPLATE_TEXTURE_SIZE = { width: 768, height: 320 };
const POWER_PLUG_SIZE = { width: 0.036, height: 0.014, depth: 0.012 };
const POWER_PLUG_OFFSET_X = 0.05;
const POWER_CABLE_SPACING = 0.016;
const POWER_CABLE_RADIUS = 0.0045;
const POWER_CABLE_COLOR = '#0b0b0e';
const SUPPORT_BRACKET_OFFSET_X = 0.03;
const FAN_OFFSETS_X = [-0.09, 0, 0.09];
const FAN_RADIUS = 0.038;
const FAN_LIGHT_COLOR = '#ff5a36';

export function GraphicsCard({ position, outerSide, shroudTopY }: GraphicsCardProps) {
  const label = usePaintedTexture(LABEL_TEXTURE_SIZE, paintGpuLabel);
  const backplate = usePaintedTexture(BACKPLATE_TEXTURE_SIZE, paintGpuBackplate);
  const plugX = outerSide * POWER_PLUG_OFFSET_X;
  const bracketHeight = UNDERSIDE_Y - shroudTopY;

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[LENGTH, THICKNESS, HEIGHT]} />
        <meshStandardMaterial color="#26262d" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, THICKNESS / 2 + BACKPLATE_THICKNESS / 2, 0]}>
        <boxGeometry args={[LENGTH * 0.98, BACKPLATE_THICKNESS, HEIGHT * 0.96]} />
        <meshStandardMaterial color="#18181d" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, BACKPLATE_TOP_Y + 0.0004, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[LENGTH * 0.98, HEIGHT * 0.96]} />
        <meshStandardMaterial map={backplate} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, FRONT_Z + 0.0006]}>
        <planeGeometry args={[LENGTH * 0.98, THICKNESS * 0.94]} />
        <meshStandardMaterial map={label} emissiveMap={label} emissive="#ffffff" emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[0, -THICKNESS / 2 - FAN_SHROUD_HEIGHT / 2, 0]}>
        <boxGeometry args={[LENGTH * 0.9, FAN_SHROUD_HEIGHT, HEIGHT * 0.85]} />
        <meshStandardMaterial color="#1c1c21" metalness={0.5} roughness={0.5} />
      </mesh>
      {FAN_OFFSETS_X.map((offsetX) => (
        <mesh key={offsetX} position={[offsetX, UNDERSIDE_Y - 0.0005, 0]} rotation-x={Math.PI / 2}>
          <ringGeometry args={[FAN_RADIUS * 0.82, FAN_RADIUS, 36]} />
          <meshStandardMaterial color="#000000" emissive={FAN_LIGHT_COLOR} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}
      <pointLight position={[0, UNDERSIDE_Y - 0.012, 0.01]} color={FAN_LIGHT_COLOR} intensity={0.14} distance={0.3} decay={2} />

      {bracketHeight > 0 && (
        <mesh position={[outerSide * SUPPORT_BRACKET_OFFSET_X, shroudTopY + bracketHeight / 2, FRONT_Z - 0.012]}>
          <boxGeometry args={[0.014, bracketHeight, 0.003]} />
          <meshStandardMaterial color="#0f0f12" metalness={0.5} roughness={0.5} />
        </mesh>
      )}

      <mesh position={[plugX, 0.004, FRONT_Z + POWER_PLUG_SIZE.depth / 2]}>
        <boxGeometry args={[POWER_PLUG_SIZE.width, POWER_PLUG_SIZE.height, POWER_PLUG_SIZE.depth]} />
        <meshStandardMaterial color={POWER_CABLE_COLOR} roughness={0.6} />
      </mesh>
      {[-1, 1].map((side) => {
        const startX = plugX + (side * POWER_CABLE_SPACING) / 2;
        // Plugs into the edge that faces the glass, droops in front of the card and goes back over the backplate.
        const points: ScenePosition[] = [
          { x: startX, y: 0.004, z: FRONT_Z + POWER_PLUG_SIZE.depth },
          { x: startX + outerSide * 0.004, y: -0.014, z: FRONT_Z + 0.04 },
          { x: startX + outerSide * 0.028, y: 0.016, z: FRONT_Z + 0.046 },
          { x: startX + outerSide * 0.04, y: 0.06, z: FRONT_Z + 0.02 },
          { x: startX + outerSide * 0.05, y: 0.074, z: 0 },
          { x: startX + outerSide * 0.058, y: 0.068, z: -FRONT_Z + 0.012 },
        ];
        return <Cable key={side} points={points} color={POWER_CABLE_COLOR} radius={POWER_CABLE_RADIUS} />;
      })}
    </group>
  );
}
