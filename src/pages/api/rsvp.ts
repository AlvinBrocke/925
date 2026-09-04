import type { APIRoute } from 'astro';
import { RESEND_API_KEY, RSVP_AUDIENCE_ID } from 'astro:env/server';

export const prerender = false;

/**
 * RSVP capture — the "Clock In" list.
 *
 * Deliberately a stub: wiring a real provider needs an account and a key, which
 * is your call, not mine. Validation, the honeypot and the response shape the
 * client already expects are all real, so swapping in the provider is one
 * function body below.
 */
export const POST: APIRoute = async ({ request }) => {
  let email = '';
  let honeypot = '';

  try {
    const body = await request.json();
    email = String(body.email ?? '').trim().toLowerCase();
    honeypot = String(body.company ?? '');
  } catch {
    return json({ ok: false, error: 'Malformed request.' }, 400);
  }

  // Bots fill every field they find; humans never see this one.
  if (honeypot) return json({ ok: true });

  if (!isEmail(email)) {
    return json({ ok: false, error: 'That email does not look right.' }, 400);
  }

  try {
    await subscribe(email);
  } catch (err) {
    console.error('rsvp: subscribe failed', err);
    return json({ ok: false, error: 'Could not clock you in. Try again.' }, 502);
  }

  return json({ ok: true });
};

/**
 * TODO: connect the email service.
 *
 * The address needs to reach an actual list, because the drop gets *sent* to
 * these people — a form that only writes to a database still leaves you with no
 * way to mail them. With Resend (RESEND_API_KEY, RSVP_AUDIENCE_ID in .env):
 *
 *   const res = await fetch(
 *     `https://api.resend.com/audiences/${import.meta.env.RSVP_AUDIENCE_ID}/contacts`,
 *     {
 *       method: 'POST',
 *       headers: {
 *         authorization: `Bearer ${import.meta.env.RESEND_API_KEY}`,
 *         'content-type': 'application/json',
 *       },
 *       body: JSON.stringify({ email }),
 *     },
 *   );
 *   if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
 */
async function subscribe(email: string): Promise<void> {
  if (!RESEND_API_KEY || !RSVP_AUDIENCE_ID) {
    console.info('rsvp: no provider configured; would subscribe', email);
    return;
  }
  throw new Error('rsvp: provider keys are set but subscribe() is not implemented yet');
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
