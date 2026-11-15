import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';
import type { MonitorSpec } from './monitor.type';

export interface ArrangedMonitor {
  readonly spec: MonitorSpec;
  readonly screenSize: Dimensions;
  readonly placement: DisplayPlacement;
}
