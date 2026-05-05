import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-6',
        hoverable
          ? 'cursor-pointer transition-colors duration-200 hover:border-[#3D3D3D] hover:bg-[#111111]'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
