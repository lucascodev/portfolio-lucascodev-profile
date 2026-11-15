import { routeCable } from '@/modules/setup/domain/rules/cables/route-cable.rule';
import { simulateCable } from '@/modules/setup/domain/rules/cables/simulate-cable.rule';
import type { CableEndpoint } from '@/modules/setup/domain/types/cables/cable-endpoint.type';
import type { CablePhysicsWorld } from '@/modules/setup/domain/types/cables/cable-physics-world.type';
import type { CableSpec } from '@/modules/setup/domain/types/cables/cable.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import type { CableAnchor } from './cable-anchor.type';
import type { CableAnchors } from './cable-anchors.type';
import type { CablePlug, CableRoute } from './cable-route.type';

const DEFAULT_CABLE_COLOR = '#141418';
const CHANNEL_INSET_FROM_DESK_BACK = 0.07;
const BEHIND_DESK_DROP = -0.35;
const BEHIND_DESK_GAP = 0.015;
const PLUG_LENGTH_METERS = 0.03;
const POWER_STRIP_SOCKET_SPACING = 0.055;
const POWER_STRIP_SOCKETS = 5;

const offset = (point: ScenePosition, direction: ScenePosition, distance: number): ScenePosition => ({
  x: point.x + direction.x * distance,
  y: point.y + direction.y * distance,
  z: point.z + direction.z * distance,
});

function powerStripSocket(anchor: CableAnchor, socketIndex: number): CableAnchor {
  const centeredIndex = (socketIndex % POWER_STRIP_SOCKETS) - (POWER_STRIP_SOCKETS - 1) / 2;
  return { ...anchor, position: { ...anchor.position, x: anchor.position.x + centeredIndex * POWER_STRIP_SOCKET_SPACING } };
}

function behindDesk(otherEnd: ScenePosition, deskDepth: number): CableAnchor {
  return { position: { x: otherEnd.x, y: BEHIND_DESK_DROP, z: -deskDepth / 2 - BEHIND_DESK_GAP }, exit: { x: 0, y: 1, z: 0 } };
}

function toPlug(anchor: CableAnchor): CablePlug {
  return { socket: anchor.position, tip: offset(anchor.position, anchor.exit, PLUG_LENGTH_METERS) };
}

export function buildCableRoutes(
  cables: readonly CableSpec[],
  anchors: CableAnchors,
  deskDepth: number,
  world: CablePhysicsWorld,
): CableRoute[] {
  const channelZ = -deskDepth / 2 + CHANNEL_INSET_FROM_DESK_BACK;
  let usedPowerSockets = 0;

  const resolveAnchor = (endpoint: CableEndpoint, otherEnd?: ScenePosition): CableAnchor | undefined => {
    if (endpoint === 'desk-back') return otherEnd && behindDesk(otherEnd, deskDepth);
    const anchor = anchors[endpoint];
    if (anchor && endpoint === 'power-strip') return powerStripSocket(anchor, usedPowerSockets++);
    return anchor;
  };

  return cables.flatMap((cable, index): CableRoute[] => {
    const start = resolveAnchor(cable.from);
    const end = start && resolveAnchor(cable.to, start.position);
    if (!start || !end) return [];

    const isLooseEnd = cable.to === 'desk-back';
    const startPlug = toPlug(start);
    const endPlug = isLooseEnd ? { socket: end.position, tip: end.position } : toPlug(end);
    const settled = simulateCable(routeCable(startPlug.tip, endPlug.tip, channelZ), world, [cable.from, cable.to]);

    return [
      {
        key: `${cable.from}-${cable.to}-${index}`,
        points: [startPlug.socket, ...settled, ...(isLooseEnd ? [] : [endPlug.socket])],
        plugs: isLooseEnd ? [startPlug] : [startPlug, endPlug],
        color: cable.color ?? DEFAULT_CABLE_COLOR,
        connects: [cable.from, cable.to],
      },
    ];
  });
}
