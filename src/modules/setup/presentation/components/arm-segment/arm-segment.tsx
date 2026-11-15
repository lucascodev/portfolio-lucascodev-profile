import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

interface ArmSegmentProps {
  readonly from: ScenePosition;
  readonly to: ScenePosition;
  readonly thickness: number;
  readonly color: string;
}

const SEGMENT_AXIS = new Vector3(0, 0, 1);

export function ArmSegment({ from, to, thickness, color }: ArmSegmentProps) {
  const { midpoint, length, quaternion } = useMemo(() => {
    const start = new Vector3(from.x, from.y, from.z);
    const direction = new Vector3(to.x, to.y, to.z).sub(start);
    return {
      length: direction.length(),
      midpoint: start.addScaledVector(direction, 0.5),
      quaternion: new Quaternion().setFromUnitVectors(SEGMENT_AXIS, direction.clone().normalize()),
    };
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow>
      <boxGeometry args={[thickness, thickness * 0.8, length]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
    </mesh>
  );
}
