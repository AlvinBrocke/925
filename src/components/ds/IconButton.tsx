import type { ReactNode } from 'react';

export function IconButton({ icon, label, onClick, active }: { icon?: ReactNode; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'var(--charcoal-2)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--teal)' : 'var(--border-hairline)'),
        borderRadius: 'var(--radius-sm)',
        color: active ? 'var(--teal)' : 'var(--chrome-300)',
        cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-standard)',
      }}
    >
      {icon}
    </button>
  );
}
