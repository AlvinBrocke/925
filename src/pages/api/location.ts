import type { APIRoute } from 'astro';
import { SHIFT_LOCATION } from 'astro:env/server';
import { nextShift, revealAt } from '../../data/shift';

// On-demand rendered. This is the one route that genuinely cannot be static:
// the answer depends on the wall clock at request time.
export const prerender = false;

/**
 * The location gate.
 *
 * The whole point is that the address is never in anything the browser can read
 * early. It is not in the repo, not in the bundle, and not in this response
 * until the reveal window opens — so "view source" and "read the JSON" both come
 * up empty. A client-side time check would not survive a changed system clock;
 * this one is evaluated on the server.
 */
export const GET: APIRoute = async () => {
  const opensAt = revealAt();
  const revealed = Date.now() >= opensAt.getTime();

  if (!revealed) {
    return json({ revealed: false, revealAt: opensAt.toISOString() });
  }

  const address = SHIFT_LOCATION;
  if (!address) {
    // Fail loud rather than leaking an empty string into the UI as if it were
    // the address.
    console.error('SHIFT_LOCATION is unset; cannot reveal location for', nextShift.id);
    return json({ revealed: false, revealAt: opensAt.toISOString(), error: 'unavailable' }, 503);
  }

  return json({ revealed: true, address, doorsAt: nextShift.doorsAt });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // Never let a CDN cache a gate whose answer changes with time.
      'cache-control': 'no-store',
    },
  });
}
