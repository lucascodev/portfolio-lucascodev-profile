import type { InputProps } from './input.types';

export function Input({
  label,
  error,
  hint,
  leftAddon,
  rightAddon,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#A3A3A3]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && (
          <span className="absolute left-3 text-[#737373]">{leftAddon}</span>
        )}
        <input
          id={inputId}
          className={[
            'w-full rounded-lg border bg-[#111111] text-white placeholder:text-[#404040]',
            'h-10 px-3 text-sm',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black',
            hasError
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[#2A2A2A] focus:ring-[#6EE7B7] focus:border-[#6EE7B7]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            leftAddon ? 'pl-9' : '',
            rightAddon ? 'pr-9' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {rightAddon && (
          <span className="absolute right-3 text-[#737373]">{rightAddon}</span>
        )}
      </div>
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#737373]">{hint}</p>}
    </div>
  );
}
