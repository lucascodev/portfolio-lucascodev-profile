import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { type Camera, Fog, PerspectiveCamera, Vector3 } from 'three';
import type { CameraPose } from '@/modules/setup/presentation/geometry/camera/camera-pose.type';
import { calculateSeatedOverviewPose } from '@/modules/setup/presentation/geometry/camera/calculate-seated-overview-pose';
import { interpolateCameraFlight } from '@/modules/setup/presentation/geometry/camera/interpolate-camera-flight';
import type { ScreenFrame } from '@/modules/setup/presentation/types/screen-frame.type';
import { usePrefersReducedMotion } from '@/shared/presentation/hooks/use-prefers-reduced-motion/use-prefers-reduced-motion';

interface CameraRigProps {
  readonly deskHeight: number;
  readonly deskDepth: number;
  readonly focusFrame?: ScreenFrame;
  readonly isFocused: boolean;
  readonly onSettled: (isFocused: boolean) => void;
}

interface CameraFlight {
  readonly from: CameraPose;
  readonly startedAtSeconds: number;
  readonly isTowardScreen: boolean;
  hasNotified: boolean;
}

const PARALLAX_HORIZONTAL_METERS = 0.2;
const PARALLAX_VERTICAL_METERS = 0.07;
const OVERVIEW_EASING_SPEED = 2.5;
const SCREEN_COVER_FACTOR = 0.97;
const ENTER_FLIGHT_SECONDS = 2;
const LEAVE_FLIGHT_SECONDS = 1.6;
const ENTER_ARC_LIFT_METERS = 0.1;
const LEAVE_ARC_LIFT_METERS = 0.1;
// The desktop starts fading in before the camera stops, so the hand-off feels continuous.
const ENTER_HANDOFF_PROGRESS = 0.8;
const VIEW_SHIFT_EPSILON_PX = 0.5;
const FOG_START_BEHIND_TARGET = 1.2;
const FOG_END_BEHIND_TARGET = 6;

const toVector = (position: { x: number; y: number; z: number }) => new Vector3(position.x, position.y, position.z);

/** Puts the camera where the screen covers the whole viewport, so the desktop UI can take over seamlessly. */
function screenPose(frame: ScreenFrame, camera: PerspectiveCamera, aspectRatio: number): CameraPose {
  const halfFovTangent = Math.tan((camera.fov * Math.PI) / 360);
  const fitHeight = frame.height / 2 / halfFovTangent;
  const fitWidth = frame.width / 2 / (halfFovTangent * aspectRatio);
  const distance = Math.min(fitHeight, fitWidth) * SCREEN_COVER_FACTOR;

  return {
    target: frame.center,
    position: {
      x: frame.center.x + Math.sin(frame.rotationY) * distance,
      y: frame.center.y,
      z: frame.center.z + Math.cos(frame.rotationY) * distance,
    },
    viewShift: 0,
  };
}

function applyPose(camera: Camera, target: Vector3, pose: CameraPose): void {
  camera.position.set(pose.position.x, pose.position.y, pose.position.z);
  target.set(pose.target.x, pose.target.y, pose.target.z);
}

export function CameraRig({ deskHeight, deskDepth, focusFrame, isFocused, onSettled }: CameraRigProps) {
  const isMotionReduced = usePrefersReducedMotion();
  const targetRef = useRef<Vector3 | null>(null);
  const viewShiftRef = useRef(0);
  const flightRef = useRef<CameraFlight | null>(null);
  const wasFocusedRef = useRef(false);
  const appliedViewOffsetKeyRef = useRef('');

  useFrame(({ camera, clock, pointer, scene, size }, deltaSeconds) => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const aspectRatio = size.width / size.height;
    const isFocusActive = isFocused && focusFrame !== undefined;
    const now = clock.getElapsedTime();
    const overviewPose = (parallaxX: number, parallaxY: number) =>
      calculateSeatedOverviewPose({ aspectRatio, verticalFovDegrees: camera.fov, deskHeight, deskDepth, parallaxX, parallaxY });
    targetRef.current ??= toVector(overviewPose(0, 0).target);
    const target = targetRef.current;

    if (wasFocusedRef.current !== isFocusActive) {
      wasFocusedRef.current = isFocusActive;
      flightRef.current = {
        from: { position: camera.position.clone(), target: target.clone(), viewShift: viewShiftRef.current },
        startedAtSeconds: now,
        isTowardScreen: isFocusActive,
        hasNotified: false,
      };
    }

    const flight = flightRef.current;
    const parallaxX = isMotionReduced || flight ? 0 : pointer.x * PARALLAX_HORIZONTAL_METERS;
    const parallaxY = isMotionReduced || flight ? 0 : pointer.y * PARALLAX_VERTICAL_METERS;
    const destination =
      isFocusActive && focusFrame
        ? screenPose(focusFrame, camera, aspectRatio)
        : overviewPose(parallaxX, parallaxY);

    if (flight) {
      const duration = flight.isTowardScreen ? ENTER_FLIGHT_SECONDS : LEAVE_FLIGHT_SECONDS;
      const progress = isMotionReduced ? 1 : (now - flight.startedAtSeconds) / duration;
      const arcLift = flight.isTowardScreen ? ENTER_ARC_LIFT_METERS : LEAVE_ARC_LIFT_METERS;
      const pose = interpolateCameraFlight(flight.from, destination, progress, arcLift);
      applyPose(camera, target, pose);
      viewShiftRef.current = pose.viewShift;

      const handoffProgress = flight.isTowardScreen ? ENTER_HANDOFF_PROGRESS : 1;
      if (!flight.hasNotified && progress >= handoffProgress) {
        flight.hasNotified = true;
        onSettled(flight.isTowardScreen);
      }
      if (progress >= 1) flightRef.current = null;
    } else if (isFocusActive) {
      applyPose(camera, target, destination);
      viewShiftRef.current = 0;
    } else {
      const easing = isMotionReduced ? 1 : 1 - Math.exp(-deltaSeconds * OVERVIEW_EASING_SPEED);
      camera.position.lerp(toVector(destination.position), easing);
      target.lerp(toVector(destination.target), easing);
      viewShiftRef.current += (destination.viewShift - viewShiftRef.current) * easing;
    }
    camera.lookAt(target);

    const viewOffsetX = -viewShiftRef.current * size.width;
    const viewOffsetKey = `${size.width}x${size.height}:${Math.round(viewOffsetX / VIEW_SHIFT_EPSILON_PX)}`;
    if (appliedViewOffsetKeyRef.current !== viewOffsetKey) {
      camera.setViewOffset(size.width, size.height, viewOffsetX, 0, size.width, size.height);
      appliedViewOffsetKeyRef.current = viewOffsetKey;
    }

    if (scene.fog instanceof Fog) {
      const cameraDistance = camera.position.distanceTo(target);
      scene.fog.near = cameraDistance + FOG_START_BEHIND_TARGET;
      scene.fog.far = cameraDistance + FOG_END_BEHIND_TARGET;
    }
  });

  return null;
}
