import type { CSSProperties, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: '13px' },
  md: { padding: '12px 24px', fontSize: '15px' },
  lg: { padding: '16px 32px', fontSize: '17px' },
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: { background: 'var(--accent)', color: 'var(--accent-contrast)', boxShadow: 'var(--shadow-glow-sm)' },
  secondary: { background: 'transparent', color: 'var(--teal)', borderColor: 'var(--teal)' },
  ghost: { background: 'transparent', color: 'var(--chrome-100)', borderColor: 'var(--border-hairline)' },
};

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', children, disabled, type = 'button', onClick }: ButtonProps) {
  const base: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    letterSpacing: 'var(--tracking-wider)',
    textTransform: 'uppercase',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--duration-base) var(--ease-standard)',
    opacity: disabled ? 0.4 : 1,
    ...sizes[size],
  };
  return (
    <button type={type} style={{ ...base, ...variants[variant] }} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
