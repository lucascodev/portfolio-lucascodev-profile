import { PC_CASE_DIMENSIONS } from '@/modules/setup/domain/constants/pc-case-dimensions.constant';
import { buildKeyboardGeometry } from '@/modules/setup/domain/rules/keyboard/build-keyboard-geometry.rule';
import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import type { MouseSpec } from '@/modules/setup/domain/types/desk-items/mouse.type';
import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import type { KeyboardSpec } from '@/modules/setup/domain/types/keyboard/keyboard.type';
import type { ArrangedLaptop } from '@/modules/setup/domain/types/laptop/arranged-laptop.type';
import type { ArrangedMonitor } from '@/modules/setup/domain/types/monitor/arranged-monitor.type';
import {
  DRAWING_TABLET_SIZE,
  PHONE_SIZE,
  PHONE_STAND_POLE_HEIGHT_METERS,
  POWER_STRIP_SIZE,
} from '@/modules/setup/presentation/constants/accessory-dimensions.constant';
import {
  ARM_SCREEN_CLEARANCE_METERS,
  LAPTOP_DECK_THICKNESS_METERS,
  LAPTOP_TRAY_ELEVATION_METERS,
  LAPTOP_TRAY_THICKNESS_METERS,
  LAPTOP_TRAY_TILT_RADIANS,
  MONITOR_PANEL_Z,
  STAND_SCREEN_CLEARANCE_METERS,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import { transformFromPlacement } from '@/modules/setup/presentation/geometry/transform-from-placement';
import type { CableAnchor } from './cable-anchor.type';
import type { CableAnchors } from './cable-anchors.type';

interface CableAnchorSources {
  readonly keyboard: KeyboardSpec;
  readonly mouse: MouseSpec;
  readonly monitors: readonly ArrangedMonitor[];
  readonly laptop?: ArrangedLaptop;
  readonly pcTowerPosition?: ScenePosition;
  readonly accessories: readonly AccessorySpec[];
  readonly peripheralsSurfaceY: number;
}

const KEYBOARD_CASE_PADDING = 0.012;
const DEVICE_PORT_HEIGHT = 0.01;
const PC_REAR_PORT_HEIGHT = 0.06;
const MONITOR_PORT_ABOVE_BOTTOM = 0.05;
const MONITOR_PORT_BEHIND_PANEL = 0.03;
const MOUSE_CABLE_SETBACK = 0.06;
const LAPTOP_PORT_DEPTH_RATIO = 0.2;

const UP: ScenePosition = { x: 0, y: 1, z: 0 };
const DOWN: ScenePosition = { x: 0, y: -1, z: 0 };
const BACK: ScenePosition = { x: 0, y: 0, z: -1 };

const toRadians = (degrees = 0): number => (degrees * Math.PI) / 180;

function rotateDirection(direction: ScenePosition, rotationY: number): ScenePosition {
  const origin = transformFromPlacement({ x: 0, z: 0, rotationY }, { x: 0, y: 0, z: 0 });
  const rotated = transformFromPlacement({ x: 0, z: 0, rotationY }, direction);
  return { x: rotated.x - origin.x, y: direction.y, z: rotated.z - origin.z };
}

function anchorOn(placement: DisplayPlacement, localPosition: ScenePosition, localExit: ScenePosition): CableAnchor {
  return {
    position: transformFromPlacement(placement, localPosition),
    exit: rotateDirection(localExit, placement.rotationY),
  };
}

function accessoryPlacement(accessory: AccessorySpec): DisplayPlacement {
  return { x: accessory.position.x, z: accessory.position.z, rotationY: toRadians(accessory.rotationDegrees) };
}

function resolveMonitorAnchors(monitors: readonly ArrangedMonitor[]): Pick<CableAnchors, 'monitor' | 'webcam'> {
  const primary = monitors.find((monitor) => monitor.spec.isPrimary) ?? monitors[0];
  if (!primary) return {};

  const clearance = primary.spec.mount === 'arm' ? ARM_SCREEN_CLEARANCE_METERS : STAND_SCREEN_CLEARANCE_METERS;
  const behindPanelZ = MONITOR_PANEL_Z - MONITOR_PORT_BEHIND_PANEL;
  const monitor = anchorOn(primary.placement, { x: 0, y: clearance + MONITOR_PORT_ABOVE_BOTTOM, z: behindPanelZ }, DOWN);
  if (!primary.spec.hasWebcam) return { monitor };

  const webcam = anchorOn(primary.placement, { x: 0, y: clearance + primary.screenSize.height, z: behindPanelZ }, BACK);
  return { monitor, webcam };
}

function resolveAccessoryAnchor(accessory: AccessorySpec): CableAnchors {
  const placement = accessoryPlacement(accessory);

  switch (accessory.kind) {
    case 'microphone':
      if (accessory.mount?.kind === 'boom-arm') {
        return { microphone: { position: { x: accessory.position.x, y: accessory.mount.heightMeters - 0.02, z: accessory.position.z }, exit: DOWN } };
      }
      return { microphone: anchorOn(placement, { x: 0, y: DEVICE_PORT_HEIGHT, z: -0.05 }, BACK) };
    case 'drawing-tablet':
      return {
        'drawing-tablet': anchorOn(placement, { x: 0, y: DRAWING_TABLET_SIZE.thickness / 2, z: -DRAWING_TABLET_SIZE.depth / 2 }, BACK),
      };
    case 'phone-stand': {
      if (!accessory.phone) return {};
      const phoneBottom = PHONE_STAND_POLE_HEIGHT_METERS + 0.037 - PHONE_SIZE.height / 2;
      return { phone: anchorOn(placement, { x: 0, y: phoneBottom, z: 0.018 }, DOWN) };
    }
    case 'power-strip':
      return { 'power-strip': anchorOn(placement, { x: 0, y: POWER_STRIP_SIZE.height, z: 0 }, UP) };
    default:
      return {};
  }
}

/** The side port sits on the deck edge; on a tray the whole laptop is tilted, so the port is tilted too. */
function resolveLaptopAnchor(laptop: ArrangedLaptop | undefined): CableAnchor | undefined {
  if (!laptop) return undefined;
  const isOnTray = laptop.spec.mount === 'arm-tray';
  const tilt = isOnTray ? LAPTOP_TRAY_TILT_RADIANS : 0;
  const portHeight = (isOnTray ? LAPTOP_TRAY_THICKNESS_METERS : 0) + LAPTOP_DECK_THICKNESS_METERS / 2;
  const portDepth = -laptop.bodySize.height * LAPTOP_PORT_DEPTH_RATIO;
  const outward = laptop.spec.side === 'right' ? 1 : -1;

  return anchorOn(
    laptop.placement,
    {
      x: (outward * laptop.bodySize.width) / 2,
      y: (isOnTray ? LAPTOP_TRAY_ELEVATION_METERS : 0) + portHeight * Math.cos(tilt) - portDepth * Math.sin(tilt),
      z: portHeight * Math.sin(tilt) + portDepth * Math.cos(tilt),
    },
    { x: outward, y: 0, z: 0 },
  );
}

export function buildCableAnchors(sources: CableAnchorSources): CableAnchors {
  const { keyboard, mouse, pcTowerPosition, peripheralsSurfaceY } = sources;
  const keyboardDepth = buildKeyboardGeometry(keyboard.layout).depth + KEYBOARD_CASE_PADDING * 2;

  return {
    keyboard: {
      position: { x: keyboard.position.x, y: peripheralsSurfaceY + DEVICE_PORT_HEIGHT, z: keyboard.position.z - keyboardDepth / 2 },
      exit: BACK,
    },
    mouse: {
      position: { x: mouse.position.x, y: peripheralsSurfaceY + 0.004, z: mouse.position.z - MOUSE_CABLE_SETBACK },
      exit: BACK,
    },
    laptop: resolveLaptopAnchor(sources.laptop),
    'pc-tower': pcTowerPosition && {
      position: {
        x: pcTowerPosition.x,
        y: pcTowerPosition.y + PC_REAR_PORT_HEIGHT,
        z: pcTowerPosition.z - PC_CASE_DIMENSIONS.depth / 2 - 0.005,
      },
      exit: BACK,
    },
    ...resolveMonitorAnchors(sources.monitors),
    ...Object.assign({}, ...sources.accessories.map(resolveAccessoryAnchor)),
  };
}
