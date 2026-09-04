/** The next shift. Everything here is safe to ship to the browser — note that
 *  the street address is NOT here. It lives in the SHIFT_LOCATION env var and is
 *  only ever read inside src/pages/api/location.ts. The venue *name* is public
 *  (it is on the Passa listing and the shift log card); the door number is not. */
export interface Shift {
  id: string;
  title: string;
  /** ISO 8601, UTC. Doors open. Accra is GMT+0 year round, so UTC here is also
   *  the local wall clock and needs no conversion when formatting. */
  doorsAt: string;
  /** ISO 8601, UTC. Last call — the back half of the "9PM–5AM" line. */
  endsAt: string;
  /** Public venue name, as printed on the ticket. Not the address. */
  venue: string;
  /** Shown before the reveal — a city, not an address. */
  teaseLocation: string;
  /** How long before doors the address unlocks. */
  revealHoursBefore: number;
}

export const nextShift: Shift = {
  id: 'shift-002',
  title: 'The Shift Continues',
  doorsAt: '2026-09-25T21:00:00Z',
  endsAt: '2026-09-26T05:00:00Z',
  venue: 'Enzo, Accra',
  teaseLocation: 'Accra',
  revealHoursBefore: 24,
};

/** The instant the address unlocks. Derived in one place so the countdown, the
 *  copy and the server gate can never disagree with each other. */
export function revealAt(shift: Shift = nextShift): Date {
  return new Date(new Date(shift.doorsAt).getTime() - shift.revealHoursBefore * 3600_000);
}
