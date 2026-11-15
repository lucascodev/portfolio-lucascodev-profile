import { useRef } from 'react';
import type { Group } from 'three';
import { Cable } from '@/modules/setup/presentation/components/cable/cable';
import type { CableRoute } from '@/modules/setup/presentation/geometry/cables/cable-route.type';
import { useFadeVisibility } from '@/modules/setup/presentation/hooks/use-fade-visibility/use-fade-visibility';

interface CableRouteMeshProps {
  readonly route: CableRoute;
  readonly isFadedOut: boolean;
}

const PLUG_RADIUS_METERS = 0.0045;
const PLUG_COLOR = '#2a2a31';

export function CableRouteMesh({ route, isFadedOut }: CableRouteMeshProps) {
  const groupRef = useRef<Group>(null);
  useFadeVisibility(groupRef, !isFadedOut);

  return (
    <group ref={groupRef}>
      <Cable points={route.points} color={route.color} />
      {route.plugs.map((plug) => (
        <Cable
          key={`${plug.socket.x}-${plug.socket.y}-${plug.socket.z}`}
          points={[plug.socket, plug.tip]}
          color={PLUG_COLOR}
          radius={PLUG_RADIUS_METERS}
        />
      ))}
    </group>
  );
}
