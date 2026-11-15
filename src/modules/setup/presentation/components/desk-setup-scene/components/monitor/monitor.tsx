import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { BoxGeometry, PlaneGeometry } from 'three';
import type { ArrangedMonitor } from '@/modules/setup/domain/types/monitor/arranged-monitor.type';
import {
  ARM_SCREEN_CLEARANCE_METERS,
  MONITOR_BEZEL_METERS,
  MONITOR_PANEL_DEPTH_METERS,
  MONITOR_PANEL_Z,
  STAND_SCREEN_CLEARANCE_METERS,
} from '@/modules/setup/presentation/constants/display-mounting.constant';
import { bendGeometryAroundY } from '@/modules/setup/presentation/geometry/bend-geometry-around-y';
import { useScreenTexture } from '@/modules/setup/presentation/hooks/use-screen-texture/use-screen-texture';
import { Webcam } from './components/webcam/webcam';

interface MonitorProps {
  readonly monitor: ArrangedMonitor;
  readonly isHighlighted?: boolean;
}

const CURVED_SEGMENTS = 64;
const MILLIMETERS_PER_METER = 1000;
const SCREEN_GLOW_COLOR = '#7f9cff';
const FRAME_COLOR = '#16161d';
const NORMAL_SCREEN_COLOR: [number, number, number] = [1, 1, 1];
const HIGHLIGHT_SCREEN_COLOR: [number, number, number] = [1.35, 1.3, 1.45];

function usePanelGeometries(width: number, height: number, curvatureRadius: number | undefined) {
  const geometries = useMemo(() => {
    const segments = curvatureRadius ? CURVED_SEGMENTS : 1;
    const shell = new BoxGeometry(
      width + MONITOR_BEZEL_METERS * 2,
      height + MONITOR_BEZEL_METERS * 2,
      MONITOR_PANEL_DEPTH_METERS,
      segments,
      1,
      1,
    );
    const screen = new PlaneGeometry(width, height, segments, 1).translate(0, 0, MONITOR_PANEL_DEPTH_METERS / 2 + 0.0006);
    if (!curvatureRadius) return { shell, screen };
    return { shell: bendGeometryAroundY(shell, curvatureRadius), screen: bendGeometryAroundY(screen, curvatureRadius) };
  }, [width, height, curvatureRadius]);

  useEffect(
    () => () => {
      geometries.shell.dispose();
      geometries.screen.dispose();
    },
    [geometries],
  );

  return geometries;
}

function MonitorStand({ panelCenterY }: { readonly panelCenterY: number }) {
  return (
    <>
      <RoundedBox args={[0.24, 0.012, 0.17]} radius={0.004} position={[0, 0.006, -0.03]} castShadow receiveShadow>
        <meshStandardMaterial color={FRAME_COLOR} metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, panelCenterY / 2, MONITOR_PANEL_Z - 0.03]} castShadow>
        <boxGeometry args={[0.045, panelCenterY, 0.02]} />
        <meshStandardMaterial color={FRAME_COLOR} metalness={0.5} roughness={0.4} />
      </mesh>
    </>
  );
}

export function Monitor({ monitor, isHighlighted = false }: MonitorProps) {
  const { spec, screenSize } = monitor;
  const isOnArm = spec.mount === 'arm';
  const curvatureRadius = spec.curvatureRadiusMillimeters
    ? spec.curvatureRadiusMillimeters / MILLIMETERS_PER_METER
    : undefined;
  const texture = useScreenTexture(spec.screen, screenSize);
  const { shell, screen } = usePanelGeometries(screenSize.width, screenSize.height, curvatureRadius);
  const clearance = isOnArm ? ARM_SCREEN_CLEARANCE_METERS : STAND_SCREEN_CLEARANCE_METERS;
  const panelCenterY = clearance + screenSize.height / 2;

  return (
    <group>
      {!isOnArm && <MonitorStand panelCenterY={panelCenterY} />}

      <group position={[0, panelCenterY, MONITOR_PANEL_Z]}>
        <mesh geometry={shell} castShadow>
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
        </mesh>
        <mesh geometry={screen}>
          <meshBasicMaterial map={texture} toneMapped={false} color={isHighlighted ? HIGHLIGHT_SCREEN_COLOR : NORMAL_SCREEN_COLOR} />
        </mesh>
        <mesh position={[0, 0, -MONITOR_PANEL_DEPTH_METERS / 2 - 0.012]} castShadow>
          <boxGeometry args={[0.2, 0.14, 0.024]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
        </mesh>
        {spec.hasWebcam && <Webcam position={[0, screenSize.height / 2 + MONITOR_BEZEL_METERS, 0]} />}
      </group>

      <pointLight position={[0, panelCenterY, 0.3]} color={SCREEN_GLOW_COLOR} intensity={0.35} distance={1.2} decay={2} />
    </group>
  );
}
