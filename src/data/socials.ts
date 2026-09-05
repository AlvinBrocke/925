import type { ImageMetadata } from 'astro';
import instagramIcon from '../assets/icons/instagram-chrome.png';
import tiktokIcon from '../assets/icons/tiktok-chrome.png';

/** Real handles, pulled from the Passa listing — the placeholders this
 *  replaced (bare instagram.com / x.com) pointed nowhere near the event.
 *  There is no dedicated X account for 925 itself (x.com/passa_live is
 *  Passa's own), so TikTok takes the second slot instead of a fake one.
 *  Shared by Hero and Footer so the two can't drift apart. */
export interface Social {
  /** Full service name, for the accessible label. */
  name: string;
  /** Chrome-finish 3D glyph shown in the box. */
  icon: ImageMetadata;
  href: string;
}

export const socials: Social[] = [
  { name: 'Instagram', icon: instagramIcon, href: 'https://www.instagram.com/the925experience' },
  { name: 'TikTok', icon: tiktokIcon, href: 'https://www.tiktok.com/@the925experience' },
];
