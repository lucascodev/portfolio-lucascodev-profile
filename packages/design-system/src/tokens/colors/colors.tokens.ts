export const colors = {
  bg: {
    base: '#000000',
    subtle: '#0A0A0A',
    muted: '#111111',
    elevated: '#1A1A1A',
    overlay: '#222222',
  },
  border: {
    subtle: '#2A2A2A',
    default: '#3D3D3D',
    strong: '#525252',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    muted: '#737373',
    disabled: '#404040',
  },
  accent: {
    primary: '#FFFFFF',
    hover: '#E5E5E5',
    highlight: '#6EE7B7',
  },
  state: {
    error: '#EF4444',
    success: '#22C55E',
    warning: '#EAB308',
    info: '#3B82F6',
  },
} as const;

export type Colors = typeof colors;
