import type { ImageMetadata } from 'astro';
import shift0101 from '../assets/gallery/shift-01-01.jpg';
import shift0102 from '../assets/gallery/shift-01-02.jpg';
import shift0103 from '../assets/gallery/shift-01-03.jpg';
import shift0104 from '../assets/gallery/shift-01-04.jpg';
import shift0105 from '../assets/gallery/shift-01-05.jpg';
import shift0106 from '../assets/gallery/shift-01-06.jpg';
import shift0107 from '../assets/gallery/shift-01-07.jpg';
import shift0108 from '../assets/gallery/shift-01-08.jpg';

/* PROVENANCE — do not lose this.
 *
 * All eight frames are from 925's first shift at Aria, Accra, published by the
 * client on Instagram as "QUARTERLY REVIEW: THE FIRST SHIFT" (August 2026).
 * Photographer: @mj.jpgs. Venue: @ariaaccra.
 *
 * The credit is contractual, not decorative — `Gallery.astro` renders it as a
 * mono caption under the strip. If these images are ever swapped out, swap the
 * credit with them; if they are removed, remove the credit too.
 */

export interface GalleryPhoto {
  image: ImageMetadata;
  /** Describes the scene, not the file. These are photographs of real people at
   *  a real party — "gallery image 3" tells a screen reader nothing. */
  alt: string;
}

/** Photo strip for the marquee. A typed module for the same reason as
 *  `events.ts`: it changes once a quarter, a missing file is a build error
 *  rather than a broken card, and `astro:assets` needs the static import to
 *  hash, resize and re-encode each frame at build time.
 *
 *  Order matters — `Gallery.astro` rotates and sizes cards by position, on an
 *  8-step cycle, so reordering reshuffles the scatter but never breaks it. */
export const galleryPhotos: GalleryPhoto[] = [
  {
    image: shift0101,
    alt: 'Seven friends packed shoulder to shoulder for the camera under purple light, throwing peace signs, one holding up a 925 clock-face paddle.',
  },
  {
    image: shift0102,
    alt: 'Black and white: a guest in a cap and varsity jacket tips back a drink at the bar, the room going on behind him.',
  },
  {
    image: shift0103,
    alt: 'Black and white: the room turned toward the DJ booth under a disco ball and hanging plants, heads and phones up.',
  },
  {
    image: shift0104,
    alt: 'A row of friends leaning into the frame on the dance floor, hands up, in front of a wall of fairy lights and neon signage.',
  },
  {
    image: shift0105,
    alt: 'A guest laughing as she holds a "925? Involve Me" paddle above the floor, camo netting strung across the ceiling behind her.',
  },
  {
    image: shift0106,
    alt: 'Dancers holding "This is my second job" and "Employee of the Month" paddles overhead, arms raised around them.',
  },
  {
    image: shift0107,
    alt: 'Black and white: a guest in sunglasses moving through the crowd with a printed 925 paddle held up beside her.',
  },
  {
    image: shift0108,
    alt: 'Four friends pressed together at the edge of the floor, smiling at the camera late in the night.',
  },
];

/** Rendered verbatim under the strip. */
export const galleryCredit = {
  shift: 'First Shift — Aria, Accra',
  photographer: '@mj.jpgs',
  venue: '@ariaaccra',
};
