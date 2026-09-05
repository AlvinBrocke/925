import { useState } from 'react';
import { Button, Input } from './ds';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The inline "clock in" form for the CTA section. Renders directly in the
 * page flow — no dialog, no open/close state — since this is the one place
 * on the page the form is meant to live.
 */
export default function RsvpForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function submit() {
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, company: '' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not clock you in.');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not clock you in.');
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', maxWidth: 320 }}>
        YOU'RE ON THE LIST. WATCH FOR THE DROP.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); void submit(); }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: 'min(340px, 100%)' }}
    >
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@shift.com"
        value={email}
        required
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
      {error && (
        <div role="alert" style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          {error}
        </div>
      )}
      <Button type="submit" variant="primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Clocking in…' : 'Clock In'}
      </Button>
    </form>
  );
}
