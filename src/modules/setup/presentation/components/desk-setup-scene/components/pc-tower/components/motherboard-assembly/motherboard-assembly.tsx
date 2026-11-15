import type { Material } from 'three';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { Cable } from '@/modules/setup/presentation/components/cable/cable';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { paintEngravedLabel } from '@/modules/setup/presentation/textures/paint-engraved-label';
import { PumpHead } from './components/pump-head/pump-head';
import { RamBank } from './components/ram-bank/ram-bank';

interface MotherboardAssemblyProps {
  readonly origin: ScenePosition;
  readonly outerSide: 1 | -1;
  readonly radiatorInlet: ScenePosition;
  readonly glowMaterial: Material;
}

const BOARD_WIDTH = 0.22;
const BOARD_HEIGHT = 0.27;
const BOARD_THICKNESS = 0.004;
const BOARD_COLOR = '#18181d';
const HEATSINK_COLOR = '#2f3037';
const IO_COVER_COLOR = '#1b1b20';
const ACCENT_COLOR = '#f5c518';
const CONNECTOR_COLOR = '#0e0e11';
const TUBE_COLOR = '#16161a';
const TUBE_RADIUS = 0.0065;
const TUBE_DEPTH_SPACING = 0.014;
const VRM_HEATSINK_SIZE = { width: 0.022, height: 0.1, depth: 0.02 };
const IO_COVER_SIZE = { width: 0.028, height: 0.13, depth: 0.03 };
const VRM_LABEL_TEXTURE_SIZE = { width: 384, height: 96 };
const MODEL_LABEL_TEXTURE_SIZE = { width: 384, height: 64 };
const SLANTED_STRIPE_OFFSETS = [0, 0.011, 0.022];
const STRIPE_SLANT_RADIANS = 0.7;

const paintVrmLabel = (context: CanvasRenderingContext2D, size: Dimensions) =>
  paintEngravedLabel(context, size, { text: 'TUF GAMING', background: HEATSINK_COLOR, textColor: '#e6e6ea' });
const paintModelLabel = (context: CanvasRenderingContext2D, size: Dimensions) =>
  paintEngravedLabel(context, size, { text: 'B450M-PLUS', background: BOARD_COLOR, textColor: '#9a9dab', accentColor: ACCENT_COLOR });

export function MotherboardAssembly({ origin, outerSide, radiatorInlet, glowMaterial }: MotherboardAssemblyProps) {
  const vrmLabel = usePaintedTexture(VRM_LABEL_TEXTURE_SIZE, paintVrmLabel);
  const modelLabel = usePaintedTexture(MODEL_LABEL_TEXTURE_SIZE, paintModelLabel);
  const toward = (offset: number) => outerSide * offset;
  const pump: ScenePosition = { x: origin.x + toward(-0.02), y: origin.y + 0.06, z: origin.z + 0.022 };
  const surfaceZ = origin.z + BOARD_THICKNESS / 2;
  const vrmX = origin.x + toward(-0.068);
  const ioCoverX = origin.x + toward(-0.096);
  const heatsink = <meshStandardMaterial color={HEATSINK_COLOR} metalness={0.7} roughness={0.35} />;
  const accent = <meshStandardMaterial color={ACCENT_COLOR} roughness={0.5} />;

  return (
    <group>
      <mesh position={[origin.x, origin.y, origin.z]}>
        <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_THICKNESS]} />
        <meshStandardMaterial color={BOARD_COLOR} roughness={0.7} />
      </mesh>

      <mesh position={[ioCoverX, origin.y + 0.055, surfaceZ + IO_COVER_SIZE.depth / 2]} castShadow>
        <boxGeometry args={[IO_COVER_SIZE.width, IO_COVER_SIZE.height, IO_COVER_SIZE.depth]} />
        <meshStandardMaterial color={IO_COVER_COLOR} metalness={0.5} roughness={0.45} />
      </mesh>
      {SLANTED_STRIPE_OFFSETS.map((offset) => (
        <mesh
          key={offset}
          position={[ioCoverX, origin.y + 0.07 + offset, surfaceZ + IO_COVER_SIZE.depth + 0.0004]}
          rotation-z={outerSide * STRIPE_SLANT_RADIANS}
        >
          <planeGeometry args={[0.024, 0.0028]} />
          {accent}
        </mesh>
      ))}

      <mesh position={[vrmX, origin.y + 0.06, origin.z + 0.012]} castShadow>
        <boxGeometry args={[VRM_HEATSINK_SIZE.width, VRM_HEATSINK_SIZE.height, VRM_HEATSINK_SIZE.depth]} />
        {heatsink}
      </mesh>
      <mesh position={[vrmX, origin.y + 0.06, origin.z + 0.012 + VRM_HEATSINK_SIZE.depth / 2 + 0.0005]} rotation-z={Math.PI / 2}>
        <planeGeometry args={[VRM_HEATSINK_SIZE.height * 0.92, VRM_HEATSINK_SIZE.width * 0.86]} />
        <meshStandardMaterial map={vrmLabel} metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[origin.x + toward(-0.015), origin.y + 0.115, origin.z + 0.012]} castShadow>
        <boxGeometry args={[0.08, 0.022, 0.02]} />
        {heatsink}
      </mesh>

      <mesh position={[origin.x + toward(0.07), origin.y - 0.045, surfaceZ + 0.004]} castShadow>
        <boxGeometry args={[0.046, 0.046, 0.008]} />
        {heatsink}
      </mesh>
      <mesh position={[origin.x + toward(0.07), origin.y - 0.045, surfaceZ + 0.0085]} rotation-z={outerSide * STRIPE_SLANT_RADIANS}>
        <boxGeometry args={[0.04, 0.004, 0.0006]} />
        {accent}
      </mesh>

      <mesh position={[origin.x + toward(-0.005), origin.y - 0.012, surfaceZ + 0.0015]}>
        <boxGeometry args={[0.08, 0.022, 0.003]} />
        <meshStandardMaterial color="#143322" roughness={0.6} />
      </mesh>
      <mesh position={[origin.x + toward(-0.012), origin.y - 0.012, surfaceZ + 0.0033]}>
        <planeGeometry args={[0.05, 0.015]} />
        <meshStandardMaterial color="#e9eaee" roughness={0.6} />
      </mesh>
      <mesh position={[origin.x + toward(-0.05), origin.y - 0.036, surfaceZ + 0.0005]}>
        <planeGeometry args={[0.078, 0.013]} />
        <meshStandardMaterial map={modelLabel} roughness={0.7} />
      </mesh>

      <mesh position={[origin.x + toward(0.103), origin.y + 0.03, surfaceZ + 0.007]}>
        <boxGeometry args={[0.01, 0.055, 0.014]} />
        <meshStandardMaterial color={CONNECTOR_COLOR} roughness={0.6} />
      </mesh>

      <PumpHead position={[pump.x, pump.y, pump.z]} glowMaterial={glowMaterial} />
      <RamBank position={[origin.x + toward(0.038), origin.y + 0.06, surfaceZ]} direction={outerSide} />

      {[0, 1].map((tube) => {
        const tubeZ = pump.z + 0.02 + tube * TUBE_DEPTH_SPACING;
        const points: ScenePosition[] = [
          { x: pump.x + toward(-0.024), y: pump.y - 0.012, z: tubeZ - 0.012 },
          { x: pump.x + toward(-0.036), y: pump.y - 0.05, z: tubeZ },
          { x: pump.x, y: pump.y - 0.092, z: tubeZ + 0.012 },
          { x: pump.x + toward(0.06), y: pump.y - 0.098, z: tubeZ + 0.018 },
          { x: pump.x + toward(0.118), y: pump.y - 0.05, z: tubeZ + 0.018 },
          { x: pump.x + toward(0.128), y: pump.y + 0.05, z: tubeZ + 0.01 },
          { x: radiatorInlet.x, y: radiatorInlet.y - 0.03, z: radiatorInlet.z + tube * TUBE_DEPTH_SPACING },
          { x: radiatorInlet.x, y: radiatorInlet.y, z: radiatorInlet.z + tube * TUBE_DEPTH_SPACING },
        ];
        return <Cable key={tube} points={points} color={TUBE_COLOR} radius={TUBE_RADIUS} />;
      })}
    </group>
  );
}
