import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';

function distance(a: ScenePosition, b: ScenePosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function measurePolyline(points: readonly ScenePosition[]): number {
  return points.reduce((total, point, index) => (index === 0 ? 0 : total + distance(points[index - 1], point)), 0);
}

export function resamplePolyline(points: readonly ScenePosition[], segmentCount: number): ScenePosition[] {
  const totalLength = measurePolyline(points);
  if (points.length < 2 || totalLength === 0) return Array.from({ length: segmentCount + 1 }, () => points[0]);

  const samples: ScenePosition[] = [];
  let segmentIndex = 0;
  let lengthBeforeSegment = 0;

  for (let sample = 0; sample <= segmentCount; sample++) {
    const target = (sample / segmentCount) * totalLength;
    while (
      segmentIndex < points.length - 2 &&
      lengthBeforeSegment + distance(points[segmentIndex], points[segmentIndex + 1]) < target
    ) {
      lengthBeforeSegment += distance(points[segmentIndex], points[segmentIndex + 1]);
      segmentIndex++;
    }

    const from = points[segmentIndex];
    const to = points[segmentIndex + 1];
    const segmentLength = distance(from, to);
    const t = segmentLength === 0 ? 0 : Math.min(1, (target - lengthBeforeSegment) / segmentLength);
    samples.push({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, z: from.z + (to.z - from.z) * t });
  }

  samples[0] = points[0];
  samples[segmentCount] = points[points.length - 1];
  return samples;
}
