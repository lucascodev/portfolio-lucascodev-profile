import type { VolumeLevel } from '@/modules/portfolio/domain/types/desktop/volume-level.type';

interface VolumeIconProps {
  readonly level: VolumeLevel;
}

const WAVES_BY_LEVEL: Readonly<Record<VolumeLevel, string>> = {
  muted: 'M16.5 9.5l5 5M21.5 9.5l-5 5',
  low: 'M16 10.5a2 2 0 0 1 0 3',
  medium: 'M16 9a4 4 0 0 1 0 6',
  high: 'M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
};

export function VolumeIcon({ level }: VolumeIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <path d={WAVES_BY_LEVEL[level]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
