import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color, MeshStandardMaterial, type PointLight } from 'three';
import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import type { PcTowerSpec } from '@/modules/setup/domain/types/desk-items/pc-tower.type';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import {
  PC_CASE_WALL_METERS,
  PC_FAN_RADIUS_METERS,
  PC_SHROUD_HEIGHT_METERS,
} from '@/modules/setup/presentation/constants/pc-case-layout.constant';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { paintEngravedLabel } from '@/modules/setup/presentation/textures/paint-engraved-label';
import { CaseFan } from './components/case-fan/case-fan';
import { GraphicsCard } from './components/graphics-card/graphics-card';
import { MotherboardAssembly } from './components/motherboard-assembly/motherboard-assembly';
import { PcCaseFrame } from './components/pc-case-frame/pc-case-frame';
import { PsuShroud } from './components/psu-shroud/psu-shroud';

interface PcTowerProps {
  readonly pcTower: PcTowerSpec;
  readonly outerSide: 1 | -1;
}

const { width: WIDTH, height: HEIGHT, depth: DEPTH } = PC_CASE_DIMENSIONS;
const WALL = PC_CASE_WALL_METERS;
const CHAMBER_BOTTOM = WALL + PC_SHROUD_HEIGHT_METERS;
const BACK_Z = -DEPTH / 2 + WALL;
const COLOR_CYCLE_SECONDS = 3;
const FAN_GLOW_INTENSITY = 3.2;
const BLADE_GLOW_INTENSITY = 0.75;
const RADIATOR_SIZE = { width: 0.27, height: 0.028, depth: 0.13 };
const RADIATOR_FAN_Y = HEIGHT - WALL - 0.013;
const RADIATOR_Y = RADIATOR_FAN_Y - 0.013 - RADIATOR_SIZE.height / 2;
const RADIATOR_Z = -0.01;
const RADIATOR_LABEL_TEXTURE_SIZE = { width: 384, height: 64 };
const GPU_ABOVE_SHROUD = 0.07;
const BACK_WALL_FAN_OFFSET_X = 0.14;
const BACK_WALL_FAN_HEIGHTS = [0.19, 0.31];
const BACK_WALL_FAN_Z = BACK_Z + 0.012;

const paintRadiatorLabel = (context: CanvasRenderingContext2D, size: Dimensions) =>
  paintEngravedLabel(context, size, { text: 'GAMEMAX', background: '#17171c', textColor: '#8f929c' });

function useCycledGlowMaterial(colors: readonly string[]) {
  const palette = useMemo(() => colors.map((color) => new Color(color)), [colors]);
  const material = useMemo(
    () => new MeshStandardMaterial({ color: '#000000', emissiveIntensity: FAN_GLOW_INTENSITY, toneMapped: false }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  const update = (elapsedSeconds: number) => {
    if (palette.length === 0) return;
    const cyclePosition = (elapsedSeconds / COLOR_CYCLE_SECONDS) % palette.length;
    const from = palette[Math.floor(cyclePosition)];
    const to = palette[(Math.floor(cyclePosition) + 1) % palette.length];
    material.emissive.lerpColors(from, to, cyclePosition % 1);
  };

  return { material, update };
}

export function PcTower({ pcTower, outerSide }: PcTowerProps) {
  const glow = useCycledGlowMaterial(pcTower.fanColors);
  const bladeMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#0d0d10',
        emissiveIntensity: BLADE_GLOW_INTENSITY,
        transparent: true,
        opacity: 0.9,
        toneMapped: false,
      }),
    [],
  );
  useEffect(() => () => bladeMaterial.dispose(), [bladeMaterial]);
  const radiatorLabel = usePaintedTexture(RADIATOR_LABEL_TEXTURE_SIZE, paintRadiatorLabel);
  const interiorLightRef = useRef<PointLight>(null);
  const spillLightRef = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    glow.update(clock.getElapsedTime());
    bladeMaterial.emissive.copy(glow.material.emissive);
    interiorLightRef.current?.color.copy(glow.material.emissive);
    spillLightRef.current?.color.copy(glow.material.emissive);
  });

  const innerX = (offset: number) => -outerSide * offset;
  const radiatorX = innerX(0.02);

  return (
    <group>
      <PcCaseFrame caseColor={pcTower.caseColor} outerSide={outerSide} />
      <PsuShroud caseColor={pcTower.caseColor} outerSide={outerSide} glowMaterial={glow.material} />
      <MotherboardAssembly
        origin={{ x: innerX(0.05), y: CHAMBER_BOTTOM + 0.15, z: BACK_Z + 0.003 }}
        outerSide={outerSide}
        radiatorInlet={{ x: radiatorX + outerSide * 0.11, y: RADIATOR_Y - RADIATOR_SIZE.height / 2, z: RADIATOR_Z - 0.02 }}
        glowMaterial={glow.material}
      />
      <GraphicsCard
        position={[innerX(0.03), CHAMBER_BOTTOM + GPU_ABOVE_SHROUD, BACK_Z + 0.07]}
        outerSide={outerSide}
        shroudTopY={-GPU_ABOVE_SHROUD}
      />

      <mesh position={[radiatorX, RADIATOR_Y, RADIATOR_Z]}>
        <boxGeometry args={[RADIATOR_SIZE.width, RADIATOR_SIZE.height, RADIATOR_SIZE.depth]} />
        <meshStandardMaterial color="#17171c" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[radiatorX, RADIATOR_Y, RADIATOR_Z + RADIATOR_SIZE.depth / 2 + 0.0005]}>
        <planeGeometry args={[0.1, RADIATOR_SIZE.height * 0.6]} />
        <meshStandardMaterial map={radiatorLabel} metalness={0.4} roughness={0.5} />
      </mesh>
      {[-1, 1].map((slot) => (
        <CaseFan
          key={`radiator-${slot}`}
          position={[radiatorX + slot * 0.065, RADIATOR_FAN_Y, RADIATOR_Z]}
          rotation={[Math.PI / 2, 0, 0]}
          radius={PC_FAN_RADIUS_METERS}
          glowMaterial={glow.material}
          bladeMaterial={bladeMaterial}
        />
      ))}
      {BACK_WALL_FAN_HEIGHTS.map((height) => (
        <CaseFan
          key={`back-wall-${height}`}
          position={[outerSide * BACK_WALL_FAN_OFFSET_X, height, BACK_WALL_FAN_Z]}
          rotation={[0, 0, 0]}
          radius={PC_FAN_RADIUS_METERS}
          glowMaterial={glow.material}
          bladeMaterial={bladeMaterial}
        />
      ))}
      <CaseFan
        position={[innerX(WIDTH / 2 - 0.03), HEIGHT - 0.14, -0.005]}
        rotation={[0, (outerSide * Math.PI) / 2, 0]}
        radius={PC_FAN_RADIUS_METERS}
        glowMaterial={glow.material}
        bladeMaterial={bladeMaterial}
      />

      <pointLight ref={interiorLightRef} position={[0, CHAMBER_BOTTOM + 0.15, 0.02]} intensity={0.9} distance={0.45} decay={2} />
      <pointLight ref={spillLightRef} position={[outerSide * 0.1, HEIGHT * 0.6, 0.12]} intensity={0.45} distance={1.4} decay={2} />
    </group>
  );
}
