import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import { buildKeyboardGeometry } from '@/modules/setup/domain/rules/keyboard/build-keyboard-geometry.rule';
import type { CableEndpoint } from '@/modules/setup/domain/types/cables/cable-endpoint.type';
import type { CableObstacle } from '@/modules/setup/domain/types/cables/cable-obstacle.type';
import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import type { DeskMatSpec } from '@/modules/setup/domain/types/desk-items/desk-mat.type';
import type { DeskSpec } from '@/modules/setup/domain/types/desk-items/desk.type';
import type { MouseSpec } from '@/modules/setup/domain/types/desk-items/mouse.type';
import type { DeskPosition } from '@/modules/setup/domain/types/geometry/desk-position.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import type { KeyboardSpec } from '@/modules/setup/domain/types/keyboard/keyboard.type';
import type { ArrangedLaptop } from '@/modules/setup/domain/types/laptop/arranged-laptop.type';
import type { ArrangedMonitor } from '@/modules/setup/domain/types/monitor/arranged-monitor.type';
import { ACCESSORY_CABLE_ENDPOINTS } from '@/modules/setup/presentation/constants/accessory-cable-endpoints.constant';
import { ACCESSORY_COLLISION_HALF_SIZES } from '@/modules/setup/presentation/constants/accessory-collision-sizes.constant';
import { PHONE_STAND_POLE_HEIGHT_METERS } from '@/modules/setup/presentation/constants/accessory-dimensions.constant';
import {
  ARM_SCREEN_CLEARANCE_METERS,
  LAPTOP_TRAY_ELEVATION_METERS,
  MONITOR_BEZEL_METERS,
  MONITOR_PANEL_DEPTH_METERS,
  MONITOR_PANEL_Z,
  STAND_SCREEN_CLEARANCE_METERS,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import { transformFromPlacement } from '@/modules/setup/presentation/geometry/transform-from-placement';

interface CableObstacleSources {
  readonly desk: DeskSpec;
  readonly deskMat?: DeskMatSpec;
  readonly keyboard: KeyboardSpec;
  readonly mouse: MouseSpec;
  readonly monitors: readonly ArrangedMonitor[];
  readonly laptop?: ArrangedLaptop;
  readonly pcTowerPosition?: ScenePosition;
  readonly monitorArmClamp?: DeskPosition;
  readonly accessories: readonly AccessorySpec[];
  readonly peripheralsSurfaceY: number;
}

const DESK_TOP_THICKNESS = 0.035;
const MAT_THICKNESS = 0.003;
const KEYBOARD_HALF_HEIGHT = 0.018;
const KEYBOARD_CASE_PADDING = 0.012;
const MOUSE_HALF_SIZE = { x: 0.034, y: 0.019, z: 0.063 };
const CURVED_SCREEN_DEPTH_ALLOWANCE = 0.035;
const LAPTOP_TRAY_MARGIN = 0.025;
const ARM_POLE_HEIGHT = 0.42;

const box = (
  center: ScenePosition,
  halfSize: ScenePosition,
  rotationY = 0,
  owners?: readonly CableEndpoint[],
): CableObstacle => ({ center, halfSize, rotationY, owners });

const toRadians = (degrees = 0): number => (degrees * Math.PI) / 180;

function accessoryObstacles(accessory: AccessorySpec): CableObstacle[] {
  const halfSize = ACCESSORY_COLLISION_HALF_SIZES[accessory.kind];
  const owners = ACCESSORY_CABLE_ENDPOINTS[accessory.kind];
  const rotationY = toRadians(accessory.rotationDegrees);
  const { x, z } = accessory.position;

  if (accessory.kind === 'microphone' && accessory.mount?.kind === 'boom-arm') {
    return [box({ x, y: accessory.mount.heightMeters + halfSize.y * 0.7, z }, halfSize, rotationY, owners)];
  }
  if (accessory.kind === 'phone-stand') {
    const poleHalfHeight = PHONE_STAND_POLE_HEIGHT_METERS / 2;
    return [
      box({ x, y: halfSize.y, z }, halfSize, rotationY, owners),
      box({ x, y: poleHalfHeight, z }, { x: 0.008, y: poleHalfHeight, z: 0.008 }, rotationY, owners),
    ];
  }
  return [box({ x, y: halfSize.y, z }, halfSize, rotationY, owners)];
}

function monitorObstacle(monitor: ArrangedMonitor, isPrimary: boolean): CableObstacle {
  const clearance = monitor.spec.mount === 'arm' ? ARM_SCREEN_CLEARANCE_METERS : STAND_SCREEN_CLEARANCE_METERS;
  const depthAllowance = monitor.spec.curvatureRadiusMillimeters ? CURVED_SCREEN_DEPTH_ALLOWANCE : 0.01;
  return box(
    transformFromPlacement(monitor.placement, { x: 0, y: clearance + monitor.screenSize.height / 2, z: MONITOR_PANEL_Z }),
    {
      x: monitor.screenSize.width / 2 + MONITOR_BEZEL_METERS,
      y: monitor.screenSize.height / 2 + MONITOR_BEZEL_METERS,
      z: MONITOR_PANEL_DEPTH_METERS / 2 + depthAllowance,
    },
    monitor.placement.rotationY,
    isPrimary ? ['monitor', 'webcam'] : undefined,
  );
}

function laptopObstacle(laptop: ArrangedLaptop): CableObstacle {
  const elevation = laptop.spec.mount === 'arm-tray' ? LAPTOP_TRAY_ELEVATION_METERS : 0;
  return box(
    transformFromPlacement(laptop.placement, { x: 0, y: elevation + 0.015, z: 0 }),
    { x: laptop.bodySize.width / 2 + LAPTOP_TRAY_MARGIN, y: 0.03, z: laptop.bodySize.height / 2 + LAPTOP_TRAY_MARGIN },
    laptop.placement.rotationY,
    ['laptop'],
  );
}

export function buildCableObstacles(sources: CableObstacleSources): CableObstacle[] {
  const { desk, deskMat, keyboard, mouse, pcTowerPosition, monitorArmClamp, peripheralsSurfaceY } = sources;
  const keyboardGeometry = buildKeyboardGeometry(keyboard.layout);
  const primaryMonitor = sources.monitors.find((monitor) => monitor.spec.isPrimary) ?? sources.monitors[0];
  const obstacles: CableObstacle[] = [
    box({ x: 0, y: -DESK_TOP_THICKNESS / 2, z: 0 }, { x: desk.widthMeters / 2, y: DESK_TOP_THICKNESS / 2, z: desk.depthMeters / 2 }),
    box(
      { x: keyboard.position.x, y: peripheralsSurfaceY + KEYBOARD_HALF_HEIGHT, z: keyboard.position.z },
      {
        x: keyboardGeometry.width / 2 + KEYBOARD_CASE_PADDING,
        y: KEYBOARD_HALF_HEIGHT,
        z: keyboardGeometry.depth / 2 + KEYBOARD_CASE_PADDING,
      },
      0,
      ['keyboard'],
    ),
    box({ x: mouse.position.x, y: peripheralsSurfaceY + MOUSE_HALF_SIZE.y, z: mouse.position.z }, MOUSE_HALF_SIZE, 0, ['mouse']),
    ...sources.monitors.map((monitor) => monitorObstacle(monitor, monitor === primaryMonitor)),
    ...sources.accessories.flatMap(accessoryObstacles),
  ];

  if (deskMat) {
    obstacles.push(
      box(
        { x: deskMat.position.x, y: MAT_THICKNESS / 2, z: deskMat.position.z },
        { x: deskMat.widthMeters / 2, y: MAT_THICKNESS / 2, z: deskMat.depthMeters / 2 },
      ),
    );
  }
  if (sources.laptop) obstacles.push(laptopObstacle(sources.laptop));
  if (pcTowerPosition) {
    const half = { x: PC_CASE_DIMENSIONS.width / 2, y: PC_CASE_DIMENSIONS.height / 2, z: PC_CASE_DIMENSIONS.depth / 2 };
    obstacles.push(box({ ...pcTowerPosition, y: pcTowerPosition.y + half.y }, half, 0, ['pc-tower']));
  }
  if (monitorArmClamp) {
    obstacles.push(
      box({ x: monitorArmClamp.x, y: ARM_POLE_HEIGHT / 2, z: monitorArmClamp.z }, { x: 0.022, y: ARM_POLE_HEIGHT / 2, z: 0.022 }),
      box({ x: monitorArmClamp.x, y: 0.015, z: monitorArmClamp.z }, { x: 0.04, y: 0.015, z: 0.05 }),
    );
  }
  return obstacles;
}
