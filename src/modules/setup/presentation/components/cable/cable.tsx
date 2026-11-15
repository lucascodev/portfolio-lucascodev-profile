import { useEffect, useMemo } from 'react';
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

interface CableProps {
  readonly points: readonly ScenePosition[];
  readonly color: string;
  readonly radius?: number;
}

const DEFAULT_RADIUS_METERS = 0.0025;
const SEGMENTS_PER_METER = 120;
const RADIAL_SEGMENTS = 8;

export function Cable({ points, color, radius = DEFAULT_RADIUS_METERS }: CableProps) {
  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const curve = new CatmullRomCurve3(
      points.map((point) => new Vector3(point.x, point.y, point.z)),
      false,
      'centripetal',
    );
    const tubularSegments = Math.max(16, Math.round(curve.getLength() * SEGMENTS_PER_METER));
    return new TubeGeometry(curve, tubularSegments, radius, RADIAL_SEGMENTS, false);
  }, [points, radius]);

  useEffect(() => () => geometry?.dispose(), [geometry]);
  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}
