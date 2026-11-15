import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, DoubleSide, type Sprite, Vector2 } from 'three';
import { BLUEPRINT_IGNORE_FLAG } from '@/modules/setup/presentation/hooks/use-blueprint-reveal/blueprint-ignore-flag.constant';

interface MugProps {
  readonly color: string;
}

const MUG_HEIGHT = 0.095;
const BASE_RADIUS = 0.03;
const RIM_RADIUS = 0.041;
const WALL_THICKNESS = 0.003;
const FLOOR_THICKNESS = 0.008;
const DRINK_LEVEL = 0.08;
const DRINK_COLOR = '#3a2116';
const MUG_PROFILE = [
  [0, 0],
  [BASE_RADIUS - 0.002, 0],
  [BASE_RADIUS, 0.003],
  [RIM_RADIUS, MUG_HEIGHT - 0.002],
  [RIM_RADIUS - WALL_THICKNESS / 2, MUG_HEIGHT],
  [RIM_RADIUS - WALL_THICKNESS, MUG_HEIGHT - 0.002],
  [BASE_RADIUS - WALL_THICKNESS, FLOOR_THICKNESS],
  [0, FLOOR_THICKNESS],
].map(([radius, height]) => new Vector2(radius, height));
const HANDLE_RADIUS = 0.021;
const HANDLE_TUBE = 0.0052;
const STEAM_PUFFS = 5;
const STEAM_RISE_METERS = 0.14;
const STEAM_CYCLE_SECONDS = 3;
const STEAM_MAX_OPACITY = 0.18;
const STEAM_TEXTURE_SIZE = 64;

const wallRadiusAt = (height: number): number => BASE_RADIUS + ((RIM_RADIUS - BASE_RADIUS) * height) / MUG_HEIGHT;

function createSoftPuffTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = STEAM_TEXTURE_SIZE;
  canvas.height = STEAM_TEXTURE_SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available for the steam texture.');

  const center = STEAM_TEXTURE_SIZE / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, STEAM_TEXTURE_SIZE, STEAM_TEXTURE_SIZE);
  return new CanvasTexture(canvas);
}

export function Mug({ color }: MugProps) {
  const puffRefs = useRef<(Sprite | null)[]>([]);
  const puffTexture = useMemo(() => createSoftPuffTexture(), []);
  useEffect(() => () => puffTexture.dispose(), [puffTexture]);

  useFrame(({ clock }) => {
    puffRefs.current.forEach((puff, index) => {
      if (!puff) return;
      const phaseSeconds = clock.getElapsedTime() + (index * STEAM_CYCLE_SECONDS) / STEAM_PUFFS;
      const progress = (phaseSeconds % STEAM_CYCLE_SECONDS) / STEAM_CYCLE_SECONDS;
      puff.position.set(Math.sin(progress * Math.PI * 2 + index) * 0.012, MUG_HEIGHT + progress * STEAM_RISE_METERS, 0);
      puff.scale.setScalar(0.03 + progress * 0.05);
      puff.material.opacity = Math.sin(progress * Math.PI) * STEAM_MAX_OPACITY;
    });
  });

  return (
    <group>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[MUG_PROFILE, 40]} />
        <meshStandardMaterial color={color} roughness={0.25} side={DoubleSide} />
      </mesh>
      <mesh position-y={DRINK_LEVEL} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[wallRadiusAt(DRINK_LEVEL) - WALL_THICKNESS, 32]} />
        <meshStandardMaterial color={DRINK_COLOR} roughness={0.15} />
      </mesh>
      <mesh position={[wallRadiusAt(MUG_HEIGHT / 2) - 0.001, MUG_HEIGHT / 2, 0]} rotation-z={-Math.PI / 2} scale={[1.25, 1, 1]} castShadow>
        <torusGeometry args={[HANDLE_RADIUS, HANDLE_TUBE, 12, 24, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>

      {Array.from({ length: STEAM_PUFFS }, (_, index) => (
        <sprite
          key={index}
          ref={(puff) => {
            puffRefs.current[index] = puff;
          }}
          raycast={() => undefined}
          userData={{ [BLUEPRINT_IGNORE_FLAG]: true }}
        >
          <spriteMaterial map={puffTexture} transparent opacity={0} depthWrite={false} fog={false} />
        </sprite>
      ))}
    </group>
  );
}
