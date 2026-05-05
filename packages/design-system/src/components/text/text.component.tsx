import type { HTMLAttributes } from 'react';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'mono';
type TextColor = 'primary' | 'secondary' | 'muted' | 'highlight';
type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'code';

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  as?: TextTag;
}

const variantClasses: Record<TextVariant, string> = {
  h1: 'text-5xl font-bold leading-none tracking-tight',
  h2: 'text-4xl font-bold leading-tight tracking-tight',
  h3: 'text-2xl font-semibold leading-snug',
  h4: 'text-xl font-semibold leading-snug',
  body: 'text-base font-normal leading-relaxed',
  small: 'text-sm font-normal leading-normal',
  mono: 'font-mono text-sm leading-normal',
};

const colorClasses: Record<TextColor, string> = {
  primary: 'text-white',
  secondary: 'text-[#A3A3A3]',
  muted: 'text-[#737373]',
  highlight: 'text-[#6EE7B7]',
};

const defaultTags: Record<TextVariant, TextTag> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  small: 'span',
  mono: 'code',
};

export function Text({
  variant = 'body',
  color = 'primary',
  as,
  className = '',
  children,
  ...props
}: TextProps) {
  const Tag = as ?? defaultTags[variant];

  return (
    <Tag
      className={[variantClasses[variant], colorClasses[color], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
