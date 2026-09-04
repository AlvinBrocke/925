import type { ChangeEvent } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string;
  required?: boolean;
  autoComplete?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ label, placeholder, type = 'text', name, value, required, autoComplete, onChange }: InputProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-body)' }}>
      {label && (
        <span style={{ fontSize: '12px', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--chrome-300)' }}>
          {label}
        </span>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={onChange}
        style={{
          background: 'var(--charcoal)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          color: 'var(--chrome-100)',
          fontSize: '15px',
          fontFamily: 'var(--font-body)',
          outline: 'none',
        }}
      />
    </label>
  );
}
