import type { VolumeLevel } from '@/modules/portfolio/domain/types/desktop/volume-level.type';

const LOW_VOLUME_MAX = 33;
const MEDIUM_VOLUME_MAX = 66;

export function getVolumeLevel(volume: number): VolumeLevel {
  if (volume <= 0) return 'muted';
  if (volume <= LOW_VOLUME_MAX) return 'low';
  if (volume <= MEDIUM_VOLUME_MAX) return 'medium';
  return 'high';
}
