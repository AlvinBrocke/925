import type { ReactNode } from 'react';

export function Tag({ children, active, onClick }: { children?: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '6px 14px',
        borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontWeight: 600,
        fontSize: '13px', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
        cursor: onClick ? 'pointer' : 'default',
        background: active ? 'var(--teal)' : 'transparent',
        color: active ? 'var(--accent-contrast)' : 'var(--chrome-300)',
        border: '1px solid ' + (active ? 'var(--teal)' : 'var(--border-hairline)'),
        transition: 'all var(--duration-fast) var(--ease-standard)',
      }}
    >
      {children}
    </span>
  );
}
