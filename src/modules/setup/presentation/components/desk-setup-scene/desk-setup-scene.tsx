import { useMemo, useState } from 'react';
import { arrangeLaptop } from '@/modules/setup/domain/rules/laptop/arrange-laptop.rule';
import { arrangeMonitors } from '@/modules/setup/domain/rules/monitors/arrange-monitors.rule';
import { resolveAccessoryElevation } from '@/modules/setup/domain/rules/accessories/resolve-accessory-elevation.rule';
import { resolvePcTowerPosition } from '@/modules/setup/domain/rules/pc-tower/resolve-pc-tower-position.rule';
import type { DeskSetup } from '@/modules/setup/domain/types/desk-setup.type';
import { SetupItem } from '@/modules/setup/presentation/components/setup-item/setup-item';
import {
  ARM_SCREEN_CLEARANCE_METERS,
  LAPTOP_TRAY_ELEVATION_METERS,
  STAND_SCREEN_CLEARANCE_METERS,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import { ACCESSORY_CABLE_ENDPOINTS } from '@/modules/setup/presentation/constants/accessory-cable-endpoints.constant';
import { calculatePrimaryScreenFrame } from '@/modules/setup/presentation/geometry/calculate-primary-screen-frame';
import { isBlockingScreenView } from '@/modules/setup/presentation/geometry/is-blocking-screen-view';
import { calculateArmMountPoints } from '@/modules/setup/presentation/geometry/calculate-arm-mount-points';
import { buildCableAnchors } from '@/modules/setup/presentation/geometry/cables/build-cable-anchors';
import { buildCableObstacles } from '@/modules/setup/presentation/geometry/cables/build-cable-obstacles';
import { buildCableRoutes } from '@/modules/setup/presentation/geometry/cables/build-cable-routes';
import { AccessoryModel } from './components/accessories/accessory-model/accessory-model';
import { Cables } from './components/cables/cables';
import { DeskMat } from './components/desk-mat/desk-mat';
import { Desk } from './components/desk/desk';
import { EnterBeacon } from './components/enter-beacon/enter-beacon';
import { Keyboard } from './components/keyboard/keyboard';
import { Laptop } from './components/laptop/laptop';
import { MonitorArm } from './components/monitor-arm/monitor-arm';
import { Monitor } from './components/monitor/monitor';
import { Mouse } from './components/mouse/mouse';
import { PcTower } from './components/pc-tower/pc-tower';
import { ACCESSORY_TOOLTIP_HEIGHTS } from './constants/accessory-tooltip-heights.constant';

interface DeskSetupSceneProps {
  readonly setup: DeskSetup;
  readonly isFocusedOnScreen: boolean;
  readonly onPrimaryMonitorSelect: () => void;
}

const FIRST_REVEAL_SECONDS = 0.3;
const SECONDS_BETWEEN_REVEALS = 0.35;
const PC_TOWER_TOOLTIP_HEIGHT = 0.5;
const DISPLAY_TOOLTIP_MARGIN = 0.06;
const ARM_CLAMP_INSET_FROM_DESK_BACK = 0.06;
const MAT_THICKNESS = 0.003;
const CABLES_LABEL = 'Cabos';
const BEACON_ABOVE_SCREEN_METERS = 0.11;
const BEACON_DELAY_AFTER_REVEAL_SECONDS = 2.2;

const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const revealDelay = (order: number): number => FIRST_REVEAL_SECONDS + order * SECONDS_BETWEEN_REVEALS;

export function DeskSetupScene({ setup, isFocusedOnScreen, onPrimaryMonitorSelect }: DeskSetupSceneProps) {
  const isInteractive = !isFocusedOnScreen;
  const [isPrimaryMonitorHovered, setIsPrimaryMonitorHovered] = useState(false);
  const { desk, deskMat, keyboard, mouse, pcTower, accessories, monitorArm } = setup;
  const deskTop = desk.heightMeters;
  const peripheralsY = deskTop + (deskMat ? MAT_THICKNESS : 0);
  const monitors = useMemo(() => arrangeMonitors(setup.monitors, desk.depthMeters), [setup.monitors, desk.depthMeters]);
  const screenFrame = useMemo(() => calculatePrimaryScreenFrame(setup), [setup]);
  const fadedAccessories = useMemo(
    () =>
      isFocusedOnScreen && screenFrame
        ? accessories.filter((accessory) => isBlockingScreenView(accessory, screenFrame, deskTop))
        : [],
    [isFocusedOnScreen, screenFrame, accessories, deskTop],
  );
  const fadedEndpoints = fadedAccessories.flatMap((accessory) => ACCESSORY_CABLE_ENDPOINTS[accessory.kind] ?? []);
  const primaryMonitor = monitors.find((monitor) => monitor.spec.isPrimary) ?? monitors[0];
  const laptop = useMemo(() => (setup.laptop ? arrangeLaptop(setup.laptop, monitors) : undefined), [setup.laptop, monitors]);
  const armMountPoints = useMemo(() => calculateArmMountPoints(monitors, laptop), [monitors, laptop]);
  const armClamp = useMemo(
    () => ({ x: monitorArm?.clampX ?? 0, z: -desk.depthMeters / 2 + ARM_CLAMP_INSET_FROM_DESK_BACK }),
    [monitorArm, desk.depthMeters],
  );
  const towerPosition = useMemo(
    () => (pcTower ? resolvePcTowerPosition(pcTower.placement, desk, pcTower.position) : undefined),
    [pcTower, desk],
  );
  const cableRoutes = useMemo(() => {
    const peripheralsSurfaceY = peripheralsY - deskTop;
    const pcTowerPosition = towerPosition && { ...towerPosition, y: towerPosition.y - deskTop };
    const anchors = buildCableAnchors({ keyboard, mouse, monitors, laptop, accessories, peripheralsSurfaceY, pcTowerPosition });
    const obstacles = buildCableObstacles({
      desk,
      deskMat,
      keyboard,
      mouse,
      monitors,
      laptop,
      accessories,
      peripheralsSurfaceY,
      pcTowerPosition,
      monitorArmClamp: monitorArm ? armClamp : undefined,
    });
    return buildCableRoutes(setup.cables ?? [], anchors, desk.depthMeters, { obstacles, floorY: -deskTop });
  }, [desk, deskMat, keyboard, mouse, monitors, laptop, accessories, peripheralsY, deskTop, towerPosition, monitorArm, armClamp, setup.cables]);

  let revealOrder = 1;
  const deskMatOrder = deskMat ? revealOrder++ : revealOrder;
  const armOrder = monitorArm ? revealOrder++ : revealOrder;
  const monitorsOrder = revealOrder;
  revealOrder += monitors.length;
  const laptopOrder = laptop ? revealOrder++ : revealOrder;
  const keyboardOrder = revealOrder++;
  const mouseOrder = revealOrder++;
  const towerOrder = pcTower ? revealOrder++ : revealOrder;
  const accessoriesOrder = revealOrder;

  return (
    <group>
      <SetupItem isInteractive={isInteractive} label={desk.label} revealDelaySeconds={revealDelay(0)} tooltipPosition={[0, deskTop + 0.02, desk.depthMeters / 2]}>
        <Desk desk={desk} />
      </SetupItem>

      {deskMat && (
        <SetupItem
          isInteractive={isInteractive}
          label={deskMat.label}
          revealDelaySeconds={revealDelay(deskMatOrder)}
          position={[deskMat.position.x, deskTop, deskMat.position.z]}
          tooltipPosition={[0, 0.02, deskMat.depthMeters / 2]}
        >
          <DeskMat deskMat={deskMat} />
        </SetupItem>
      )}

      {monitorArm && armMountPoints.length > 0 && (
        <SetupItem
          isInteractive={isInteractive}
          label={monitorArm.label}
          revealDelaySeconds={revealDelay(armOrder)}
          position={[0, deskTop, 0]}
          tooltipPosition={[armClamp.x, 0.48, armClamp.z]}
        >
          <MonitorArm clamp={armClamp} mountPoints={armMountPoints} color={monitorArm.color} />
        </SetupItem>
      )}

      {monitors.map((monitor, index) => {
        const clearance = monitor.spec.mount === 'arm' ? ARM_SCREEN_CLEARANCE_METERS : STAND_SCREEN_CLEARANCE_METERS;
        return (
          <SetupItem
            isInteractive={isInteractive}
            key={`${monitor.spec.label}-${index}`}
            label={monitor.spec.label}
            revealDelaySeconds={revealDelay(monitorsOrder + index)}
            position={[monitor.placement.x, deskTop, monitor.placement.z]}
            rotationY={monitor.placement.rotationY}
            tooltipPosition={[0, clearance + monitor.screenSize.height + DISPLAY_TOOLTIP_MARGIN, 0]}
            hasTooltip={monitor !== primaryMonitor}
            onSelect={monitor === primaryMonitor ? onPrimaryMonitorSelect : undefined}
            onHoverChange={monitor === primaryMonitor ? setIsPrimaryMonitorHovered : undefined}
          >
            <Monitor monitor={monitor} isHighlighted={monitor === primaryMonitor && isPrimaryMonitorHovered && isInteractive} />
          </SetupItem>
        );
      })}

      {screenFrame && (
        <EnterBeacon
          position={{ ...screenFrame.center, y: screenFrame.center.y + screenFrame.height / 2 + BEACON_ABOVE_SCREEN_METERS }}
          appearAfterSeconds={revealDelay(monitorsOrder) + BEACON_DELAY_AFTER_REVEAL_SECONDS}
          isHidden={isFocusedOnScreen}
          isEmphasized={isPrimaryMonitorHovered}
          onSelect={onPrimaryMonitorSelect}
        />
      )}

      {laptop && (
        <SetupItem
          isInteractive={isInteractive}
          label={laptop.spec.label}
          revealDelaySeconds={revealDelay(laptopOrder)}
          position={[
            laptop.placement.x,
            deskTop + (laptop.spec.mount === 'arm-tray' ? LAPTOP_TRAY_ELEVATION_METERS : 0),
            laptop.placement.z,
          ]}
          rotationY={laptop.placement.rotationY}
          tooltipPosition={[0, laptop.screenSize.height + DISPLAY_TOOLTIP_MARGIN, -laptop.bodySize.height / 2]}
          isLiftable={laptop.spec.mount === 'desk'}
        >
          <Laptop laptop={laptop} />
        </SetupItem>
      )}

      <SetupItem
        isInteractive={isInteractive}
        label={keyboard.label}
        revealDelaySeconds={revealDelay(keyboardOrder)}
        position={[keyboard.position.x, peripheralsY, keyboard.position.z]}
        tooltipPosition={[0, 0.08, 0]}
        isLiftable
      >
        <Keyboard keyboard={keyboard} />
      </SetupItem>

      <SetupItem
        isInteractive={isInteractive}
        label={mouse.label}
        revealDelaySeconds={revealDelay(mouseOrder)}
        position={[mouse.position.x, peripheralsY, mouse.position.z]}
        tooltipPosition={[0, 0.08, 0]}
        isLiftable
      >
        <Mouse mouse={mouse} />
      </SetupItem>

      {pcTower && towerPosition && (
        <SetupItem
          isInteractive={isInteractive}
          label={pcTower.label}
          revealDelaySeconds={revealDelay(towerOrder)}
          position={[towerPosition.x, towerPosition.y, towerPosition.z]}
          tooltipPosition={[0, PC_TOWER_TOOLTIP_HEIGHT, 0]}
        >
          <PcTower pcTower={pcTower} outerSide={towerPosition.x < 0 ? -1 : 1} />
        </SetupItem>
      )}

      {accessories.map((accessory, index) => (
        <SetupItem
          isInteractive={isInteractive}
          key={`${accessory.kind}-${accessory.label}`}
          label={accessory.label}
          revealDelaySeconds={revealDelay(accessoriesOrder + index * 0.5)}
          position={[accessory.position.x, deskTop + resolveAccessoryElevation(accessory), accessory.position.z]}
          rotationY={degreesToRadians(accessory.rotationDegrees ?? 0)}
          tooltipPosition={[0, ACCESSORY_TOOLTIP_HEIGHTS[accessory.kind], 0]}
          isLiftable={resolveAccessoryElevation(accessory) === 0}
          isFadedOut={fadedAccessories.includes(accessory)}
        >
          <AccessoryModel accessory={accessory} />
        </SetupItem>
      ))}

      {cableRoutes.length > 0 && (
        <SetupItem
          isInteractive={isInteractive}
          label={CABLES_LABEL}
          revealDelaySeconds={revealDelay(accessoriesOrder + accessories.length * 0.5)}
          position={[0, deskTop, 0]}
          tooltipPosition={[0, 0.04, -desk.depthMeters / 2 + 0.05]}
        >
          <Cables routes={cableRoutes} fadedEndpoints={fadedEndpoints} />
        </SetupItem>
      )}
    </group>
  );
}
