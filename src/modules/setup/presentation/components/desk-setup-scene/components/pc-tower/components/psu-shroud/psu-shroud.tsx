import type { Material } from 'three';
import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import { PC_CASE_WALL_METERS, PC_SHROUD_HEIGHT_METERS } from '@/modules/setup/presentation/constants/pc-case-layout.constant';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { paintPerforation } from '@/modules/setup/presentation/textures/paint-perforation';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

interface PsuShroudProps {
  readonly caseColor: string;
  readonly outerSide: 1 | -1;
  readonly glowMaterial: Material;
}

const { width: WIDTH, depth: DEPTH } = PC_CASE_DIMENSIONS;
const WALL = PC_CASE_WALL_METERS;
const SHROUD_WIDTH = WIDTH - WALL * 2;
const SHROUD_DEPTH = DEPTH - WALL * 2 - 0.01;
const PERFORATION_TEXTURE_SIZE = { width: 512, height: 320 };
const paintShroudTop = (context: CanvasRenderingContext2D, size: Dimensions) =>
  paintPerforation(context, size, { background: '#141418', hole: '#2a2a32' });

export function PsuShroud({ caseColor, outerSide, glowMaterial }: PsuShroudProps) {
  const perforation = usePaintedTexture(PERFORATION_TEXTURE_SIZE, paintShroudTop);
  const frontZ = SHROUD_DEPTH / 2 + 0.005;
  const ioX = outerSide * (WIDTH / 2 - 0.07);

  return (
    <group position={[0, WALL + PC_SHROUD_HEIGHT_METERS / 2, 0.005]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[SHROUD_WIDTH, PC_SHROUD_HEIGHT_METERS, SHROUD_DEPTH]} />
        <meshStandardMaterial color={caseColor} metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position-y={PC_SHROUD_HEIGHT_METERS / 2 + 0.0005} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[SHROUD_WIDTH, SHROUD_DEPTH]} />
        <meshStandardMaterial map={perforation} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, PC_SHROUD_HEIGHT_METERS / 2 - 0.004, frontZ]} material={glowMaterial}>
        <boxGeometry args={[SHROUD_WIDTH * 0.92, 0.003, 0.002]} />
      </mesh>

      <mesh position={[ioX, -PC_SHROUD_HEIGHT_METERS / 2 + 0.02, frontZ + 0.001]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.008, 0.008, 0.004, 24]} />
        <meshStandardMaterial color="#2a2a30" metalness={0.8} roughness={0.25} />
      </mesh>
      {[0.03, 0.045].map((offset) => (
        <mesh key={offset} position={[ioX - outerSide * offset, -PC_SHROUD_HEIGHT_METERS / 2 + 0.02, frontZ + 0.001]}>
          <boxGeometry args={[0.01, 0.004, 0.002]} />
          <meshStandardMaterial color="#050507" />
        </mesh>
      ))}
    </group>
  );
}
