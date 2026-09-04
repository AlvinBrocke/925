/** The next shift. Everything here is safe to ship to the browser — note that
 *  the street address is NOT here. It lives in the SHIFT_LOCATION env var and is
 *  only ever read inside src/pages/api/location.ts. */
export interface Shift {
  id: string;
  title: string;
  /** ISO 8601, UTC. Doors open. */
  doorsAt: string;
  /** Shown before the reveal — a city, not an address. */
  teaseLocation: string;
  /** How long before doors the address unlocks. */
  revealHoursBefore: number;
}

export const nextShift: Shift = {
  id: 'shift-002',
  title: 'The Shift Continues',
  doorsAt: '2026-11-27T21:00:00Z',
  teaseLocation: 'Accra',
  revealHoursBefore: 24,
};

/** The instant the address unlocks. Derived in one place so the countdown, the
 *  copy and the server gate can never disagree with each other. */
export function revealAt(shift: Shift = nextShift): Date {
  return new Date(new Date(shift.doorsAt).getTime() - shift.revealHoursBefore * 3600_000);
}
