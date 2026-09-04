import type { CSSProperties, ReactNode } from 'react';

export type BadgeTone = 'accent' | 'danger' | 'warn' | 'neutral';

const tones: Record<BadgeTone, CSSProperties> = {
  accent: { background: 'var(--teal)', color: 'var(--accent-contrast)' },
  danger: { background: 'var(--danger)', color: '#1a0000' },
  warn: { background: 'var(--warn)', color: '#1a1200' },
  neutral: { background: 'var(--chrome-700)', color: 'var(--chrome-100)' },
};

export function Badge({ children, tone = 'accent' }: { children?: ReactNode; tone?: BadgeTone }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-mono)', fontSize: '11px',
      letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', ...tones[tone],
    }}>
      {children}
    </span>
  );
}
