import { useEffect, useState } from 'react';
import { Button, Dialog, Input } from './ds';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export const CLOCK_IN_EVENT = 'clock-in:open';

/**
 * The second and last island.
 *
 * There are four "Clock In" triggers spread across the page (header, hero,
 * newsletter, and any future one). Hydrating four React buttons to open one
 * dialog would mean shipping React to four places. Instead the buttons stay
 * static HTML with `data-clock-in`, a two-line inline script dispatches a
 * window event, and only this dialog hydrates.
 */
export default function ClockInDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CLOCK_IN_EVENT, onOpen);
    return () => window.removeEventListener(CLOCK_IN_EVENT, onOpen);
  }, []);

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

  return (
    <Dialog open={open} onClose={() => setOpen(false)} title="Clock In">
      {status === 'sent' ? (
        <div style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', maxWidth: 320 }}>
          YOU'RE ON THE LIST. WATCH FOR THE DROP.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); void submit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 'min(300px, 100%)' }}>
          <div style={{ color: 'var(--chrome-300)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', maxWidth: 320 }}>
            Location drops 24hrs before doors. Clock in to get it first.
          </div>
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
            {status === 'sending' ? 'Clocking in…' : 'Confirm'}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
