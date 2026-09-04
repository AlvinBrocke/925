import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Static by default — every page is prerendered to HTML at build time and served
// from the CDN, which is what carries the traffic spike when a drop is announced.
// Only the two files under src/pages/api opt into on-demand rendering (they set
// `export const prerender = false`), because the location gate has to consult the
// clock on the server. Swap the adapter for @astrojs/node to self-host; nothing
// else in the project needs to change.
export default defineConfig({
  output: 'static',
  adapter: vercel({ imageService: true }),
  integrations: [react()],
  image: { domains: [] },

  // access:'secret' means the value is read from the environment at REQUEST time.
  // Plain `import.meta.env.X` is statically inlined by Vite at build time, which
  // bakes the address into the deployment artifact and means changing the venue
  // needs a rebuild. Declared here, it stays out of the bundle entirely.
  env: {
    schema: {
      SHIFT_LOCATION: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      RSVP_AUDIENCE_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
