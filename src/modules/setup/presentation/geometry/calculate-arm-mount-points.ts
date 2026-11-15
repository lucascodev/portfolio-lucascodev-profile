import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import type { ArrangedLaptop } from '@/modules/setup/domain/types/laptop/arranged-laptop.type';
import type { ArrangedMonitor } from '@/modules/setup/domain/types/monitor/arranged-monitor.type';
import {
  ARM_SCREEN_CLEARANCE_METERS,
  LAPTOP_TRAY_ELEVATION_METERS,
  MONITOR_PANEL_DEPTH_METERS,
  MONITOR_PANEL_Z,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import { transformFromPlacement } from './transform-from-placement';

const VESA_PLATE_OFFSET = 0.024;
const TRAY_JOINT_BELOW = 0.02;

export function calculateArmMountPoints(monitors: readonly ArrangedMonitor[], laptop: ArrangedLaptop | undefined): ScenePosition[] {
  const monitorMounts = monitors
    .filter((monitor) => monitor.spec.mount === 'arm')
    .map((monitor) =>
      transformFromPlacement(monitor.placement, {
        x: 0,
        y: ARM_SCREEN_CLEARANCE_METERS + monitor.screenSize.height / 2,
        z: MONITOR_PANEL_Z - MONITOR_PANEL_DEPTH_METERS / 2 - VESA_PLATE_OFFSET,
      }),
    );

  if (laptop?.spec.mount !== 'arm-tray') return monitorMounts;

  const trayMount = transformFromPlacement(laptop.placement, { x: 0, y: LAPTOP_TRAY_ELEVATION_METERS - TRAY_JOINT_BELOW, z: 0 });
  return [...monitorMounts, trayMount];
}
