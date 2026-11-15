import type { BufferGeometry } from 'three';

export function bendGeometryAroundY<TGeometry extends BufferGeometry>(geometry: TGeometry, radius: number): TGeometry {
  const positions = geometry.getAttribute('position');

  for (let index = 0; index < positions.count; index++) {
    const angle = positions.getX(index) / radius;
    const distanceFromCenter = radius - positions.getZ(index);
    positions.setX(index, distanceFromCenter * Math.sin(angle));
    positions.setZ(index, radius - distanceFromCenter * Math.cos(angle));
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
