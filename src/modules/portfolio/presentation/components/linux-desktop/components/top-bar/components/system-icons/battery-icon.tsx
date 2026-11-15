interface BatteryIconProps {
  readonly levelPercent: number;
  readonly isCharging: boolean;
}

const FILL_MAX_WIDTH = 13;
const FULL_PERCENT = 100;
const CHARGING_FILL_OPACITY = 0.35;

export function BatteryIcon({ levelPercent, isCharging }: BatteryIconProps) {
  const fillWidth = (FILL_MAX_WIDTH * Math.min(FULL_PERCENT, Math.max(0, levelPercent))) / FULL_PERCENT;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="4.5" y="9.5" width={fillWidth} height="5" rx="1" fill="currentColor" opacity={isCharging ? CHARGING_FILL_OPACITY : 1} />
      <path d="M22 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {isCharging && <path d="M12.5 8 9 12.5h3l-1 3.5 3.5-4.5h-3z" fill="currentColor" />}
    </svg>
  );
}
