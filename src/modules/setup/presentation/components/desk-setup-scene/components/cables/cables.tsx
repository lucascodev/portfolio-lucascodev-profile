import type { CableRoute } from '@/modules/setup/presentation/geometry/cables/cable-route.type';
import { CableRouteMesh } from './components/cable-route-mesh/cable-route-mesh';

interface CablesProps {
  readonly routes: readonly CableRoute[];
  readonly fadedEndpoints: readonly string[];
}

export function Cables({ routes, fadedEndpoints }: CablesProps) {
  return (
    <group>
      {routes.map((route) => (
        <CableRouteMesh key={route.key} route={route} isFadedOut={route.connects.some((endpoint) => fadedEndpoints.includes(endpoint))} />
      ))}
    </group>
  );
}
