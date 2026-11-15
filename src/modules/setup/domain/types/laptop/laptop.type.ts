import type { HorizontalSide } from '@/modules/setup/domain/types/geometry/horizontal-side.type';
import type { MonitorAspectRatio } from '@/modules/setup/domain/types/monitor/monitor-aspect-ratio.type';
import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import type { LaptopMount } from './laptop-mount.type';

export interface LaptopSpec {
  readonly label: string;
  readonly diagonalInches: number;
  readonly aspectRatio: MonitorAspectRatio;
  readonly side: HorizontalSide;
  readonly mount: LaptopMount;
  readonly bodyColor: string;
  readonly screen: ScreenContent;
}
