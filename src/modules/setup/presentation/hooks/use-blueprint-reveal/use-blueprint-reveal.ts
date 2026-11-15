import { useFrame } from '@react-three/fiber';
import { type RefObject, useLayoutEffect, useRef } from 'react';
import { EdgesGeometry, type Group, LineBasicMaterial, LineSegments, type Material, Mesh } from 'three';
import { BLUEPRINT_IGNORE_FLAG } from './blueprint-ignore-flag.constant';

interface BlueprintRevealOptions {
  readonly delaySeconds: number;
  readonly isEnabled: boolean;
}

interface BlueprintStroke {
  readonly mesh: Mesh;
  readonly lines: LineSegments<EdgesGeometry, LineBasicMaterial>;
  readonly vertexCount: number;
}

const BLUEPRINT_COLOR = '#7dd3fc';
const EDGE_THRESHOLD_DEGREES = 25;
const DRAW_SECONDS = 1.2;
const FILL_SECONDS = 0.6;

const easeInOutCubic = (progress: number): number => (progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2);

function setMeshVisible(mesh: Mesh, isVisible: boolean): void {
  if (Array.isArray(mesh.material)) return;
  (mesh.material as Material).visible = isVisible;
}

function removeStrokes(strokes: readonly BlueprintStroke[]): void {
  strokes.forEach(({ mesh, lines }) => {
    mesh.remove(lines);
    lines.geometry.dispose();
    setMeshVisible(mesh, true);
  });
}

export function useBlueprintReveal(groupRef: RefObject<Group | null>, { delaySeconds, isEnabled }: BlueprintRevealOptions): void {
  const strokesRef = useRef<BlueprintStroke[]>([]);
  const lineMaterialRef = useRef<LineBasicMaterial | null>(null);
  const isFinishedRef = useRef(false);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group || !isEnabled) return;

    const lineMaterial = new LineBasicMaterial({ color: BLUEPRINT_COLOR, transparent: true, toneMapped: false });
    const strokes: BlueprintStroke[] = [];

    group.traverse((object) => {
      if (!(object instanceof Mesh) || Array.isArray(object.material)) return;
      if (object.userData[BLUEPRINT_IGNORE_FLAG]) return;

      const edges = new EdgesGeometry(object.geometry, EDGE_THRESHOLD_DEGREES);
      edges.setDrawRange(0, 0);
      const lines = new LineSegments(edges, lineMaterial);
      lines.raycast = () => undefined;
      object.add(lines);
      setMeshVisible(object, false);
      strokes.push({ mesh: object, lines, vertexCount: edges.getAttribute('position').count });
    });

    strokesRef.current = strokes;
    lineMaterialRef.current = lineMaterial;
    isFinishedRef.current = false;

    return () => {
      removeStrokes(strokes);
      lineMaterial.dispose();
      strokesRef.current = [];
    };
  }, [groupRef, isEnabled]);

  useFrame(({ clock }) => {
    const lineMaterial = lineMaterialRef.current;
    if (isFinishedRef.current || !lineMaterial || strokesRef.current.length === 0) return;

    const elapsedSeconds = clock.getElapsedTime() - delaySeconds;
    if (elapsedSeconds < 0) return;

    const drawProgress = easeInOutCubic(Math.min(1, elapsedSeconds / DRAW_SECONDS));
    strokesRef.current.forEach(({ lines, vertexCount }) => {
      const visibleSegments = Math.floor((drawProgress * vertexCount) / 2);
      lines.geometry.setDrawRange(0, visibleSegments * 2);
    });
    if (elapsedSeconds < DRAW_SECONDS) return;

    const fillProgress = Math.min(1, (elapsedSeconds - DRAW_SECONDS) / FILL_SECONDS);
    strokesRef.current.forEach(({ mesh }) => setMeshVisible(mesh, true));
    lineMaterial.opacity = 1 - fillProgress;
    if (fillProgress < 1) return;

    removeStrokes(strokesRef.current);
    strokesRef.current = [];
    isFinishedRef.current = true;
  });
}
