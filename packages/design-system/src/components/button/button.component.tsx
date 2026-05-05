import type { ButtonProps } from './button.types';

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-white text-black hover:bg-[#E5E5E5] border border-white focus-visible:ring-white',
  secondary:
    'bg-transparent text-white border border-[#3D3D3D] hover:border-[#525252] hover:bg-[#1A1A1A] focus-visible:ring-[#3D3D3D]',
  ghost:
    'bg-transparent text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] border border-transparent focus-visible:ring-[#3D3D3D]',
  danger:
    'bg-transparent text-[#EF4444] border border-[#EF4444] hover:bg-[#EF4444] hover:text-white focus-visible:ring-[#EF4444]',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? isLoading;

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
