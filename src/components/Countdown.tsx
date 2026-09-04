import { useEffect, useState } from 'react';

interface Props {
  /** ISO 8601 instant the address unlocks. */
  revealAt: string;
}

interface Unit { value: string; label: string }

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

function split(msRemaining: number): Unit[] {
  const d = Math.max(0, msRemaining);
  return [
    { value: pad(Math.floor(d / 86_400_000)), label: 'DAYS' },
    { value: pad(Math.floor((d % 86_400_000) / 3_600_000)), label: 'HOURS' },
    { value: pad(Math.floor((d % 3_600_000) / 60_000)), label: 'MINUTES' },
    { value: pad(Math.floor((d % 60_000) / 1000)), label: 'SECONDS' },
  ];
}

/**
 * One of only two interactive islands on the page. Everything around it is
 * static HTML, so this is most of the JavaScript the visitor downloads.
 *
 * The server renders the countdown once so the boxes are painted and correctly
 * sized in the initial HTML — no layout shift when React takes over.
 */
export default function Countdown({ revealAt }: Props) {
  const target = new Date(revealAt).getTime();
  const [remaining, setRemaining] = useState(() => target - Date.now());
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  // Once the clock runs out, ask the server for the address. The server decides
  // whether to hand it over — reaching zero here is a prompt, not permission.
  useEffect(() => {
    if (remaining > 0 || address) return;
    let cancelled = false;
    fetch('/api/location')
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.revealed) setAddress(d.address); })
      .catch(() => { /* stay on the countdown; the door time has not moved */ });
    return () => { cancelled = true; };
  }, [remaining, address]);

  if (address) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: 'var(--teal)',
        letterSpacing: 'var(--tracking-wide)', textAlign: 'center', padding: 'var(--space-5)',
        border: '1px solid var(--teal)', borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-glow-md)', background: 'var(--charcoal)',
      }}>
        {address}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
      {split(remaining).map((u) => (
        <div key={u.label} style={{
          background: 'var(--charcoal)', border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-md)', padding: '16px 22px', minWidth: '88px',
          textAlign: 'center', boxShadow: '0 0 20px #00d2c333',
        }}>
          {/* The page is prerendered, so the server bakes in the value as of BUILD
              time while the client renders the value as of NOW. Those can never
              match, and without this React treats it as a hydration failure
              (error #418), throws away the server HTML for this subtree and logs
              in production. The mismatch is intentional here, so declare it. */}
          <div
            suppressHydrationWarning
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)',
              color: 'var(--teal)', textShadow: '0 0 14px var(--teal-glow)',
            }}
          >
            {u.value}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '10px',
            letterSpacing: 'var(--tracking-wider)', color: 'var(--chrome-500)', marginTop: '4px',
          }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
