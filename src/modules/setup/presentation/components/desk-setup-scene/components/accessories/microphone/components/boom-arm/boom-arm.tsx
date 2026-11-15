import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { ArmSegment } from '@/modules/setup/presentation/components/arm-segment/arm-segment';

interface BoomArmProps {
  readonly clamp: ScenePosition;
  readonly mount: ScenePosition;
  readonly color: string;
}

const POST_HEIGHT = 0.09;
const ELBOW_RISE = 0.24;
const ELBOW_POSITION_RATIO = 0.45;
const ROD_THICKNESS = 0.014;
const SPRING_THICKNESS = 0.005;
const SPRING_OFFSET = 0.018;
const SPRING_COLOR = '#55555f';
const JOINT_RADIUS = 0.013;

const offsetUp = (point: ScenePosition, amount: number): ScenePosition => ({ ...point, y: point.y + amount });

export function BoomArm({ clamp, mount, color }: BoomArmProps) {
  const post = offsetUp(clamp, POST_HEIGHT);
  const elbow: ScenePosition = {
    x: post.x + (mount.x - post.x) * ELBOW_POSITION_RATIO,
    y: Math.max(post.y, mount.y) + ELBOW_RISE,
    z: post.z + (mount.z - post.z) * ELBOW_POSITION_RATIO,
  };
  const joints = [post, elbow, mount];

  return (
    <group>
      <mesh position={[clamp.x, clamp.y + 0.02, clamp.z]} castShadow>
        <boxGeometry args={[0.05, 0.04, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[clamp.x, clamp.y - 0.05, clamp.z]} castShadow>
        <boxGeometry args={[0.05, 0.012, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[clamp.x, clamp.y + POST_HEIGHT / 2, clamp.z]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, POST_HEIGHT, 14]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>

      <ArmSegment from={post} to={elbow} thickness={ROD_THICKNESS} color={color} />
      <ArmSegment from={elbow} to={mount} thickness={ROD_THICKNESS} color={color} />
      <ArmSegment
        from={offsetUp(post, SPRING_OFFSET)}
        to={offsetUp(elbow, SPRING_OFFSET)}
        thickness={SPRING_THICKNESS}
        color={SPRING_COLOR}
      />
      <ArmSegment
        from={offsetUp(elbow, SPRING_OFFSET)}
        to={offsetUp(mount, SPRING_OFFSET)}
        thickness={SPRING_THICKNESS}
        color={SPRING_COLOR}
      />

      {joints.map((joint) => (
        <mesh key={`${joint.x}-${joint.y}-${joint.z}`} position={[joint.x, joint.y, joint.z]}>
          <sphereGeometry args={[JOINT_RADIUS, 14, 10]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
