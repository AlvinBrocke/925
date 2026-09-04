import { useEffect, useRef, type ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const panel = useRef<HTMLDivElement>(null);

  // The design-system original had no keyboard handling. A dialog that traps a
  // keyboard user with no way out is a real accessibility defect, so Escape and
  // initial focus are wired up here.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'var(--surface-overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--charcoal)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
          minWidth: 'min(340px, 100%)',
          boxShadow: 'var(--shadow-glow-sm)',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--chrome-100)', fontSize: '18px', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--chrome-500)', fontSize: '20px', lineHeight: 1, padding: 4 }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
