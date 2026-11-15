import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { ArmSegment } from '@/modules/setup/presentation/components/arm-segment/arm-segment';

interface MonitorArmProps {
  readonly clamp: DeskPosition;
  readonly mountPoints: readonly ScenePosition[];
  readonly color: string;
}

const POLE_HEIGHT = 0.42;
const POLE_RADIUS = 0.018;
const ARM_THICKNESS = 0.034;
const JOINT_RADIUS = 0.022;
const MIN_ROOT_HEIGHT = 0.12;
const ROOT_BELOW_MOUNT = 0.06;
const ELBOW_RISE = 0.05;
const ELBOW_SETBACK = 0.06;

function Joint({ position, color }: { readonly position: ScenePosition; readonly color: string }) {
  return (
    <mesh position={[position.x, position.y, position.z]} castShadow>
      <sphereGeometry args={[JOINT_RADIUS, 16, 12]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
    </mesh>
  );
}

export function MonitorArm({ clamp, mountPoints, color }: MonitorArmProps) {
  return (
    <group>
      <mesh position={[clamp.x, 0.015, clamp.z]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.03, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[clamp.x, POLE_HEIGHT / 2, clamp.z]} castShadow>
        <cylinderGeometry args={[POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 20]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
      </mesh>

      {mountPoints.map((mount) => {
        const rootHeight = Math.min(POLE_HEIGHT - JOINT_RADIUS, Math.max(MIN_ROOT_HEIGHT, mount.y - ROOT_BELOW_MOUNT));
        const root: ScenePosition = { x: clamp.x, y: rootHeight, z: clamp.z };
        const elbow: ScenePosition = {
          x: (root.x + mount.x) / 2,
          y: (root.y + mount.y) / 2 + ELBOW_RISE,
          z: Math.min(root.z, mount.z) - ELBOW_SETBACK,
        };

        return (
          <group key={`${mount.x}-${mount.y}-${mount.z}`}>
            <ArmSegment from={root} to={elbow} thickness={ARM_THICKNESS} color={color} />
            <ArmSegment from={elbow} to={mount} thickness={ARM_THICKNESS * 0.85} color={color} />
            <Joint position={root} color={color} />
            <Joint position={elbow} color={color} />
            <Joint position={mount} color={color} />
          </group>
        );
      })}
    </group>
  );
}
