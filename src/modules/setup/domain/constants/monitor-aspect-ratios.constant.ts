import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { MonitorAspectRatio } from '@/modules/setup/domain/types/monitor/monitor-aspect-ratio.type';

export const MONITOR_ASPECT_RATIOS: Readonly<Record<MonitorAspectRatio, Dimensions>> = {
  '16:9': { width: 16, height: 9 },
  '16:10': { width: 16, height: 10 },
  '21:9': { width: 21, height: 9 },
  '32:9': { width: 32, height: 9 },
};
