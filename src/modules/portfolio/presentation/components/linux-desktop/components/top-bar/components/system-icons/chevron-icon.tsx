interface ChevronIconProps {
  readonly direction: 'left' | 'right';
}

const PATH_BY_DIRECTION: Readonly<Record<ChevronIconProps['direction'], string>> = {
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
};

export function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={PATH_BY_DIRECTION[direction]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
