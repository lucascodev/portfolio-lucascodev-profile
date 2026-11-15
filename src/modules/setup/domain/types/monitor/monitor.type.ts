import type { MonitorAspectRatio } from './monitor-aspect-ratio.type';
import type { MonitorMount } from './monitor-mount.type';
import type { MonitorOrientation } from './monitor-orientation.type';
import type { ScreenContent } from './screen-content.type';

export interface MonitorSpec {
  readonly label: string;
  readonly diagonalInches: number;
  readonly aspectRatio: MonitorAspectRatio;
  readonly orientation: MonitorOrientation;
  readonly screen: ScreenContent;
  readonly isPrimary?: boolean;
  readonly mount?: MonitorMount;
  readonly curvatureRadiusMillimeters?: number;
  readonly hasWebcam?: boolean;
  readonly distanceFromDeskBackMeters?: number;
}
