type BadgeVariant = 'default' | 'highlight' | 'error' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#1A1A1A] text-[#A3A3A3] border border-[#2A2A2A]',
  highlight: 'bg-[#6EE7B7]/10 text-[#6EE7B7] border border-[#6EE7B7]/20',
  error: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
  success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20',
  warning: 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
