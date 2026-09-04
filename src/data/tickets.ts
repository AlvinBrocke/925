/** Ticketing lives on Passa. Nothing on this site takes a payment — every
 *  ticket button hands off to the hosted checkout, which is where the money,
 *  the QR codes and the door list actually live.
 *
 *  The tiers below mirror that page. They are here so the site can show the
 *  ladder and the sell-outs without a round trip to Passa on every render, but
 *  they are marketing copy, not the source of truth: when a phase sells out or
 *  a new one opens on Passa, edit this file too. The board carries a line
 *  saying Passa is authoritative, so a tier that goes stale for an afternoon
 *  reads as out of date rather than as a broken promise. */
export interface Tier {
  name: string;
  /** Passa's own bracket text — "Phase 2", "Group Ticket". Carried rather than
   *  derived from position: the phases do not run 1..n on the board, because
   *  the early-bird tier is not "Phase 0" and the group tier is not a phase at
   *  all. Numbering these by index quietly renames the tiers Passa is selling. */
  label: string;
  /** In whole cedis — no tier has ever been priced in pesewas. */
  price: number;
  /** How many people the ticket admits. */
  admits: number;
  /** Sold-out tiers stay on the board: the ladder is the pitch. */
  soldOut?: boolean;
}

export const PASSA_DROP_URL = 'https://passa.live/drop/925-the-shift-continues';

/** Deep link past the flyer, straight to tier selection. This is the one every
 *  "Get Tickets" on the site points at — the visitor starts the purchase here
 *  and lands on Passa already choosing, not reading. */
export const PASSA_CHECKOUT_URL = `${PASSA_DROP_URL}/checkout`;

export const CURRENCY = 'GHS';

export const tiers: Tier[] = [
  { name: 'The Intern', label: 'Early Bird', price: 85, admits: 1, soldOut: true },
  { name: 'NSS Employee', label: 'Phase 1', price: 100, admits: 1, soldOut: true },
  { name: 'Senior Associate', label: 'Phase 2', price: 120, admits: 1 },
  { name: 'HR Department', label: 'Group Ticket', price: 300, admits: 3 },
];

export const ticketsAvailable = tiers.some((t) => !t.soldOut);

export function formatPrice(tier: Tier): string {
  return `${CURRENCY} ${tier.price}`;
}
