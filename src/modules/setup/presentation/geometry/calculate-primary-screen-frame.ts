import { arrangeMonitors } from '@/modules/setup/domain/rules/monitors/arrange-monitors.rule';
import type { DeskSetup } from '@/modules/setup/domain/types/desk-setup.type';
import {
  ARM_SCREEN_CLEARANCE_METERS,
  MONITOR_PANEL_DEPTH_METERS,
  MONITOR_PANEL_Z,
  STAND_SCREEN_CLEARANCE_METERS,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import type { ScreenFrame } from '@/modules/setup/presentation/types/screen-frame.type';
import { transformFromPlacement } from './transform-from-placement';

export function calculatePrimaryScreenFrame(setup: DeskSetup): ScreenFrame | undefined {
  const monitors = arrangeMonitors(setup.monitors, setup.desk.depthMeters);
  const primary = monitors.find((monitor) => monitor.spec.isPrimary) ?? monitors[0];
  if (!primary) return undefined;

  const clearance = primary.spec.mount === 'arm' ? ARM_SCREEN_CLEARANCE_METERS : STAND_SCREEN_CLEARANCE_METERS;
  const localCenter = { x: 0, y: clearance + primary.screenSize.height / 2, z: MONITOR_PANEL_Z + MONITOR_PANEL_DEPTH_METERS / 2 };
  const center = transformFromPlacement(primary.placement, localCenter);

  return {
    center: { ...center, y: center.y + setup.desk.heightMeters },
    width: primary.screenSize.width,
    height: primary.screenSize.height,
    rotationY: primary.placement.rotationY,
  };
}
