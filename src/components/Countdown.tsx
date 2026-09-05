import { Fragment, useEffect, useRef, useState } from 'react';

interface Props {
  /** ISO 8601 instant the address unlocks. */
  revealAt: string;
}

interface Unit { value: string; label: string; roll?: boolean }

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

function split(msRemaining: number): Unit[] {
  const d = Math.max(0, msRemaining);
  return [
    { value: pad(Math.floor(d / 86_400_000)), label: 'DAYS' },
    { value: pad(Math.floor((d % 86_400_000) / 3_600_000)), label: 'HOURS' },
    { value: pad(Math.floor((d % 3_600_000) / 60_000)), label: 'MINUTES' },
    { value: pad(Math.floor((d % 60_000) / 1000)), label: 'SECONDS', roll: true },
  ];
}

/**
 * One digit slot of the seconds pair. The outgoing character is kept around for
 * the length of one CSS animation so it can slide up and out while the new one
 * slides in — the same treatment as the reference countdown. Keying on the
 * character means a digit that did not change (the tens, most of the time) is
 * not remounted and does not animate.
 *
 * `suppressHydrationWarning` has to live on this span rather than on the box:
 * it covers only the element's own text, and the text is what differs between
 * the build-time render and the client's first render.
 */
function RollingDigit({ char }: { char: string }) {
  const previous = useRef(char);
  const outgoing = previous.current === char ? null : previous.current;
  previous.current = char;

  return (
    <span className="cd-roll">
      {outgoing !== null && (
        <span key={`out-${char}`} className="cd-out" aria-hidden="true">{outgoing}</span>
      )}
      <span key={`in-${char}`} className="cd-in" suppressHydrationWarning>{char}</span>
    </span>
  );
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
    // Layout lives in global.css rather than inline, because the four chips wrap
    // 3+1 on a narrow phone — which reads as a bug, not a choice — and an inline
    // style can't carry the media query that turns them into a 2x2.
    <div className="cd-grid">
      {split(remaining).map((u, i) => (
        <Fragment key={u.label}>
          <div style={{ textAlign: 'center' }}>
            {/* The page is prerendered, so the server bakes in the value as of BUILD
                time while the client renders the value as of NOW. Those can never
                match, and without this React treats it as a hydration failure
                (error #418), throws away the server HTML for this subtree and logs
                in production. The mismatch is intentional here, so declare it. */}
            <div
              suppressHydrationWarning={!u.roll}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 'clamp(56px, 11vw, 150px)',
                lineHeight: 1, color: 'var(--chrome-100)', textShadow: '0 2px 24px #00000080',
              }}
            >
              {u.roll
                ? [...u.value].map((c, idx) => <RollingDigit key={idx} char={c} />)
                : u.value}
            </div>
            {/* Mono, matching the digits above: the reference treats the whole
                countdown as one block rather than two typefaces stacked. */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1.2vw, 13px)',
              letterSpacing: 'var(--tracking-wider)', color: 'var(--chrome-500)', marginTop: '4px',
            }}>
              {u.label}
            </div>
          </div>
          {i < 3 && <span className="cd-colon" aria-hidden="true">:</span>}
        </Fragment>
      ))}
    </div>
  );
}
