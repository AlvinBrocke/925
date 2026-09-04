import type { ImageMetadata } from 'astro';
import posterSecondShift from '../assets/event-poster-second-shift-aria.png';
import posterLockup from '../assets/social-logo-lockup.png';

export interface EventEntry {
  title: string;
  date: string;
  venue: string;
  image: ImageMetadata;
  status: string;
  tone: 'accent' | 'neutral';
}

/** Shift log. This changes a handful of times a year, so a typed module is the
 *  right weight — no CMS to run, no build step to learn, and a typo is a build
 *  error rather than a broken card. Move to a content collection if a
 *  non-developer ever needs to edit it. */
export const events: EventEntry[] = [
  {
    title: 'Second Shift',
    date: '23 MAY 2026',
    venue: 'Aria, Accra',
    image: posterSecondShift,
    status: 'Past',
    tone: 'neutral',
  },
  {
    title: 'The Shift Continues',
    date: 'TBA',
    venue: 'Enzo',
    image: posterLockup,
    status: 'Location Locked',
    tone: 'accent',
  },
];
