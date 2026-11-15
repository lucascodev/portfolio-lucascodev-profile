import { useCallback, useEffect, useMemo } from 'react';
import { MeshStandardMaterial, type PlaneGeometry } from 'three';
import { METERS_PER_KEY_UNIT } from '@/modules/setup/domain/constants/physical-units.constant';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { KeyboardGeometry } from '@/modules/setup/domain/types/keyboard/keyboard-geometry.type';
import { createKeycapTopGeometry } from '@/modules/setup/presentation/geometry/create-keycap-top-geometry';
import { usePaintedTexture } from '@/modules/setup/presentation/hooks/use-painted-texture/use-painted-texture';
import { type KeycapLegendPalette, paintKeycapLegends } from '@/modules/setup/presentation/textures/paint-keycap-legends';

interface KeycapLegends {
  readonly material: MeshStandardMaterial;
  readonly topGeometries: readonly (PlaneGeometry | undefined)[];
}

const ATLAS_PIXELS_PER_KEY_UNIT = 64;
const KEYCAP_ROUGHNESS = 0.6;

export function useKeycapLegends(geometry: KeyboardGeometry, keycapGap: number, palette: KeycapLegendPalette): KeycapLegends {
  const atlasSize = useMemo<Dimensions>(
    () => ({
      width: Math.round((geometry.width / METERS_PER_KEY_UNIT) * ATLAS_PIXELS_PER_KEY_UNIT),
      height: Math.round((geometry.depth / METERS_PER_KEY_UNIT) * ATLAS_PIXELS_PER_KEY_UNIT),
    }),
    [geometry],
  );
  const paint = useCallback(
    (context: CanvasRenderingContext2D, size: Dimensions) => paintKeycapLegends(context, size, geometry, palette),
    [geometry, palette],
  );
  const atlas = usePaintedTexture(atlasSize, paint);

  const material = useMemo(() => new MeshStandardMaterial({ map: atlas, roughness: KEYCAP_ROUGHNESS }), [atlas]);
  useEffect(() => () => material.dispose(), [material]);

  const topGeometries = useMemo(
    () =>
      geometry.keys.map((key) =>
        key.legend
          ? createKeycapTopGeometry(key, geometry, { width: key.width - keycapGap, height: METERS_PER_KEY_UNIT - keycapGap })
          : undefined,
      ),
    [geometry, keycapGap],
  );
  useEffect(() => () => topGeometries.forEach((topGeometry) => topGeometry?.dispose()), [topGeometries]);

  return { material, topGeometries };
}
