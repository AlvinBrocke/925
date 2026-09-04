# 925 — Official Website

Event site for 925. Astro, static-first, with React islands for the two pieces
that actually need to be interactive.

```bash
pnpm install
cp .env.example .env    # fill in SHIFT_LOCATION
pnpm dev                # http://localhost:4321
pnpm build              # static pages + serverless functions
pnpm check              # typecheck .astro and .tsx
```

Astro 7 / React 19 / Vite 8. Node >= 22.12 is required (Astro 7's engine floor).

`pnpm-workspace.yaml` approves the `esbuild` and `sharp` postinstall scripts.
pnpm blocks build scripts by default, and without those two the Vite build and
`astro:assets` image optimization fail — approving them in the file keeps
`pnpm install` non-interactive on CI.

## Why this shape

The site is ~95% static content wrapped around three moving parts: a countdown,
an email capture, and a location that unlocks 24 hours before doors. Traffic is
flat for weeks and then spikes when a drop goes out, and a large share of the
audience is on mobile data in Accra. So: prerender everything to the CDN, and
hydrate as little as possible.

Every page is static HTML. Only two components ship JavaScript:

| Island | Directive | Why |
|---|---|---|
| `Countdown.tsx` | `client:load` | Above the fold, must tick immediately |
| `ClockInDialog.tsx` | `client:idle` | Nobody opens it in the first 200ms |

The four "Clock In" buttons are **not** islands. They are static HTML with a
`data-clock-in` attribute; one delegated listener in `Base.astro` dispatches a
window event that the single dialog island listens for. Hydrating four React
buttons to open one dialog would have meant shipping React to four places.

## The location gate

`src/pages/api/location.ts` is the one route that cannot be static, because the
answer depends on the wall clock at request time.

The address is never in the repo, the bundle, or the response until the reveal
window opens. It is read at request time from `SHIFT_LOCATION` via
`astro:env/server` with `access: 'secret'` — plain `import.meta.env.X` is
statically inlined by Vite at build time, which would bake the address into the
deployment artifact and mean changing the venue needs a rebuild.

The countdown hitting zero is a prompt to ask the server, not permission. A
client-side time check would not survive a changed system clock.

Verify it stays out of the client:

```bash
pnpm build && grep -rl "<your address>" dist/ .vercel/   # expect no matches
```

## Layout

```
src/
├── assets/          Posters and logos (see "Assets" below)
├── components/
│   ├── ds/          Design system primitives, ported from the Claude Design project
│   ├── *.astro      Static sections — zero JS
│   ├── Countdown.tsx      island
│   └── ClockInDialog.tsx  island
├── data/
│   ├── shift.ts     Next shift. Doors time and reveal window — no address
│   └── events.ts    Shift log entries
├── pages/
│   ├── index.astro
│   └── api/         The only on-demand routes
└── styles/
    ├── tokens.css   From the design system, minus the Google Fonts @import
    ├── global.css
    └── chrome.css   The floating chrome objects
```

## Design system

`src/components/ds/` is a 1:1 port of the `925 Design System` project's
`components/*.jsx` — same tokens, same visual output, converted from
`React.createElement` to typed TSX. Two deliberate changes:

- `Dialog` gained Escape-to-close, focus management and `aria-modal`. The
  original trapped keyboard users with no way out.
- `Card` was not ported. The shift log renders it as static markup in
  `ShiftLog.astro` so it can use `astro:assets` and cost no JavaScript.

The card hover lift uses a real CSS `:hover` in `global.css`. The design
template expressed it as `style-hover`, which the DC runtime never implemented,
so it was dead in the design file.

## Assets

`src/assets/poster-after-hours-glass.webp` is the real asset.

**The other four are placeholders.** They could not be pulled from the design
project — its file API caps reads at 256 KiB and the originals are larger, so
they arrive truncated. Export them from Claude Design and overwrite, keeping the
filenames:

- `logo-mark-vertical.png`
- `logo-horizontal-chrome.png`
- `social-logo-lockup.png`
- `event-poster-second-shift-aria.png`

Dimensions and aspect ratios already match the originals, so nothing else needs
to change. `astro:assets` handles format conversion and responsive `srcset`.

## Fonts

Orbitron, Rajdhani and Share Tech Mono are self-hosted via `@fontsource`, subset
to the weights actually used. The design system's `tokens/fonts.css` pulls all
three from Google Fonts over the network, which is a render-blocking round trip
on mobile — that import is deliberately not carried over.

## Still to wire

1. **`subscribe()` in `src/pages/api/rsvp.ts`** is a stub. Validation, the
   honeypot and the response shape are real; the provider call is one function
   body. Resend is sketched in the comment. The list needs to be somewhere you
   can actually *send* from — the drop gets mailed to these people.
2. **Deployment target.** `@astrojs/vercel`. Swap for `@astrojs/node` to
   self-host; nothing else changes.
3. **Set `SHIFT_LOCATION` in the host's dashboard**, not in a committed file.

## Upgrading Astro

Two things bit during the 5 -> 7 upgrade, both worth knowing:

1. **Clear the caches.** Upgrading in place leaves stale Vite pre-bundled deps
   behind, and Vite's own re-optimization does not fully invalidate them. The
   symptom is `TypeError: _jsxDEV is not a function` at hydration — every island
   silently fails while the build reports success. Fix:
   ```bash
   rm -rf node_modules/.vite .astro dist .vercel && pnpm install
   ```
2. **Check the production console, not just the build.** `astro preview` does
   not work with the Vercel adapter, so it is easy to skip. Serve the real
   output instead:
   ```bash
   pnpm build && (cd .vercel/output/static && python3 -m http.server 4325)
   ```

Relevant breaking changes that this project happened to be clear of: legacy
content collections removed, `Astro.glob()` removed, `<ViewTransitions />`
renamed to `<ClientRouter />`, Zod 4, and the new default
`compressHTML: 'jsx'` (which strips whitespace between adjacent inline
elements — verify copy still reads correctly if you add any).

Images no longer upscale past the source width, so a `widths` entry larger than
the asset is silently dropped from the `srcset`.

## Design source

`templates/event-site/EventSite.dc.html` is the Claude Design canvas template
and stays in sync with the design project. It is a design artifact, not a build
input — this Astro app is what ships.
