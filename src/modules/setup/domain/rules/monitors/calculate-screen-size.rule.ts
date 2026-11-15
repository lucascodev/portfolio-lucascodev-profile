import { MONITOR_ASPECT_RATIOS } from '@/modules/setup/domain/constants/monitor-aspect-ratios.constant';
import { METERS_PER_INCH } from '@/modules/setup/domain/constants/physical-units.constant';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { MonitorSpec } from '@/modules/setup/domain/types/monitor/monitor.type';

type ScreenPanel = Pick<MonitorSpec, 'diagonalInches' | 'aspectRatio' | 'orientation'>;

export function calculateScreenSize(monitor: ScreenPanel): Dimensions {
  const ratio = MONITOR_ASPECT_RATIOS[monitor.aspectRatio];
  const diagonalMeters = monitor.diagonalInches * METERS_PER_INCH;
  const ratioDiagonal = Math.hypot(ratio.width, ratio.height);
  const longSide = (diagonalMeters * ratio.width) / ratioDiagonal;
  const shortSide = (diagonalMeters * ratio.height) / ratioDiagonal;

  if (monitor.orientation === 'portrait') return { width: shortSide, height: longSide };
  return { width: longSide, height: shortSide };
}
