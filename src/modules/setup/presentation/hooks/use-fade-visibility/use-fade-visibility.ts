import { useFrame } from '@react-three/fiber';
import { type RefObject, useRef } from 'react';
import { type Group, type Material, Mesh } from 'three';

interface OriginalMaterialState {
  readonly opacity: number;
  readonly transparent: boolean;
  readonly depthWrite: boolean;
}

const FADE_SPEED = 6;
const SNAP_THRESHOLD = 0.01;

function collectMaterials(group: Group): Material[] {
  const materials: Material[] = [];
  group.traverse((object) => {
    if (object instanceof Mesh) materials.push(...(Array.isArray(object.material) ? object.material : [object.material]));
  });
  return materials;
}

export function useFadeVisibility(groupRef: RefObject<Group | null>, isVisible: boolean): void {
  const opacityRef = useRef(1);
  const originalsRef = useRef(new Map<Material, OriginalMaterialState>());

  useFrame((_, deltaSeconds) => {
    const group = groupRef.current;
    const targetOpacity = isVisible ? 1 : 0;
    if (!group || opacityRef.current === targetOpacity) return;

    const next = opacityRef.current + (targetOpacity - opacityRef.current) * Math.min(1, deltaSeconds * FADE_SPEED);
    opacityRef.current = Math.abs(next - targetOpacity) < SNAP_THRESHOLD ? targetOpacity : next;
    const opacity = opacityRef.current;
    const originals = originalsRef.current;

    for (const material of collectMaterials(group)) {
      if (!originals.has(material)) {
        originals.set(material, { opacity: material.opacity, transparent: material.transparent, depthWrite: material.depthWrite });
      }
      const original = originals.get(material);
      if (!original) continue;

      const isFullyVisible = opacity === 1;
      material.transparent = isFullyVisible ? original.transparent : true;
      material.depthWrite = isFullyVisible ? original.depthWrite : false;
      material.opacity = original.opacity * opacity;
      material.needsUpdate = true;
    }
    group.visible = opacity > 0;
  });
}
