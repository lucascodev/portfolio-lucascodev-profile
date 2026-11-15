import type { CameraPose } from './camera-pose.type';

interface SeatedOverviewInput {
  readonly aspectRatio: number;
  readonly verticalFovDegrees: number;
  readonly deskHeight: number;
  readonly deskDepth: number;
  readonly parallaxX: number;
  readonly parallaxY: number;
}

const EYES_ABOVE_DESK = 0.47;
const DISTANCE_FROM_SCREEN = 1.35;
const SCREEN_Z = -0.1;
const COMFORTABLE_ASPECT_RATIO = 1.4;
const FRONT_EDGE_DROP = 0.025;
const LANDSCAPE_EDGE_FROM_BOTTOM = 0.08;
const PORTRAIT_EDGE_FROM_BOTTOM = 0.46;
const PORTRAIT_FULL_ASPECT = 0.6;
const MAX_VIEW_SHIFT = 0.08;
const VIEW_SHIFT_START_ASPECT = 1.2;
const VIEW_SHIFT_FULL_ASPECT = 1.6;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * Seated point of view: eyes a little above the desk, as close as the aspect ratio allows while
 * the whole desk still fits, tilted so the desk's front edge sits right at the bottom of the frame
 * (higher on portrait screens, leaving room for the intro text). Extra vertical room goes above the setup.
 */
export function calculateSeatedOverviewPose(input: SeatedOverviewInput): CameraPose {
  const { aspectRatio, verticalFovDegrees, deskHeight, deskDepth, parallaxX, parallaxY } = input;
  const distanceScale = Math.max(1, COMFORTABLE_ASPECT_RATIO / aspectRatio);
  const portraitAmount = clamp01((1 - aspectRatio) / (1 - PORTRAIT_FULL_ASPECT));
  const edgeFromBottom = LANDSCAPE_EDGE_FROM_BOTTOM + (PORTRAIT_EDGE_FROM_BOTTOM - LANDSCAPE_EDGE_FROM_BOTTOM) * portraitAmount;

  const position = {
    x: parallaxX,
    y: deskHeight + EYES_ABOVE_DESK * Math.sqrt(distanceScale) + parallaxY,
    z: SCREEN_Z + DISTANCE_FROM_SCREEN * distanceScale,
  };

  const frontEdge = { y: deskHeight - FRONT_EDGE_DROP, z: deskDepth / 2 };
  const angleToFrontEdge = Math.atan2(position.y - frontEdge.y, position.z - frontEdge.z);
  const halfFovTangent = Math.tan((verticalFovDegrees * Math.PI) / 360);
  const edgeAngleBelowCenter = Math.atan(halfFovTangent * (1 - 2 * edgeFromBottom));
  const pitchDown = angleToFrontEdge - edgeAngleBelowCenter;

  return {
    position,
    target: {
      x: parallaxX,
      y: position.y - Math.sin(pitchDown) * DISTANCE_FROM_SCREEN,
      z: position.z - Math.cos(pitchDown) * DISTANCE_FROM_SCREEN,
    },
    viewShift: MAX_VIEW_SHIFT * clamp01((aspectRatio - VIEW_SHIFT_START_ASPECT) / (VIEW_SHIFT_FULL_ASPECT - VIEW_SHIFT_START_ASPECT)),
  };
}
