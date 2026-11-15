interface WifiIconProps {
  readonly isEnabled: boolean;
}

const DISABLED_WAVES_OPACITY = 0.35;

export function WifiIcon({ isEnabled }: WifiIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g opacity={isEnabled ? 1 : DISABLED_WAVES_OPACITY}>
        <path
          d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
      </g>
      {!isEnabled && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}
