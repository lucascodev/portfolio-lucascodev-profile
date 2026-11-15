import type { DeskSpec } from '@/modules/setup/domain/types/desk-items/desk.type';
import type { RoomSpec } from '@/modules/setup/domain/types/desk-items/room.type';

interface RoomProps {
  readonly room: RoomSpec;
  readonly desk: DeskSpec;
}

const FLOOR_SIZE = 14;
const WALL_HEIGHT = 5;
const WALL_GAP_BEHIND_DESK = 0.12;
const LED_LIGHT_OFFSETS = [-0.33, 0, 0.33];

export function Room({ room, desk }: RoomProps) {
  const wallZ = -desk.depthMeters / 2 - WALL_GAP_BEHIND_DESK;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color={room.floorColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, wallZ]} receiveShadow>
        <planeGeometry args={[FLOOR_SIZE, WALL_HEIGHT]} />
        <meshStandardMaterial color={room.wallColor} roughness={0.95} />
      </mesh>

      {room.ledStripColor && (
        <group position={[0, desk.heightMeters - 0.015, -desk.depthMeters / 2 + 0.01]}>
          <mesh>
            <boxGeometry args={[desk.widthMeters * 0.94, 0.006, 0.006]} />
            <meshStandardMaterial color={room.ledStripColor} emissive={room.ledStripColor} emissiveIntensity={4} toneMapped={false} />
          </mesh>
          {LED_LIGHT_OFFSETS.map((offset) => (
            <pointLight
              key={offset}
              position={[offset * desk.widthMeters, -0.06, -0.08]}
              color={room.ledStripColor}
              intensity={2}
              distance={2}
              decay={2}
            />
          ))}
        </group>
      )}
    </group>
  );
}
