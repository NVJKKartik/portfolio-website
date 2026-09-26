# N.V.J.K Kartik: the hall

The personal site of N.V.J.K Kartik, after Lina Bo Bardi's glass easels at MASP (1968). One open room: every piece of work stands on its own glass easel at the same height, the front row is the newest work and the back wall the oldest. Click a work to walk to it; turn it around to read what Kartik did and who made it with him. Scrolling lifts the roof off and cranes the camera straight up until it looks down on a drawn plan of the room (the corner plan takes you there too), then a plain catalogue.

## Run it

Requires Node ≥ 20.11 (tested on 22).

```bash
cd site
npm install
npm run dev          # http://localhost:3000
```

Production build (static export to `out/`) and checks:

```bash
npm run build
npm run check        # internal links, anchors, hall hashes, titles, descriptions, OG images on every page
npm run lint
npx serve out        # preview the exact files that get deployed
```

## Deploy (not done — waiting on you)

`netlify.toml` at the repo root builds `site/` and publishes `site/out`. Any static host works: upload `out/`.

## Where things live

| Want to change…                                                      | Edit                                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Name, role, wall text, bio, links                                    | `content/profile.ts`                                                                 |
| A work (its easel, label and record)                                 | `content/work.ts` — the label is derived from it, so it can’t disagree with the page |
| Papers and the patent                                                | `content/research.ts`                                                                |
| Talks, experiments                                                   | `content/more.ts`                                                                    |
| What hangs in the hall, and row sizes                                | `content/hall.ts` (derived from the files above; newest first)                       |
| Easel positions and the plan's on-screen box (shared by 3D and plan) | `components/hall/layout.ts`                                                          |
| The room itself (light, glass, camera)                               | `components/hall/engine.ts`                                                          |
| Wall text, labels, controls, crane                                   | `components/hall/Hall.tsx`                                                           |
| The painted walls (credits at the exit, places on the back wall)     | `components/hall/walls.ts`, data in `content/hall.ts`                                |
| Record pages                                                         | `app/work/[slug]`, `app/research/[slug]`, styles in `components/record/`             |
| Interface studies (Nexus, Centio.AI, Alumni Connect)                 | `components/studies/*.js`, wrapped by `Study.tsx`                                    |
| Journey (roles, dates)                                               | `content/journey.ts`, shown on About                                                 |
| Writing                                                              | `npm run snapshot:writing` (pulls DEV + Medium into `content/writing/posts.json`)    |
| Every factual source                                                 | `content/sources.ts` (rendered at `/receipts/`) and `docs/SOURCES.md`                |

## Media

- `npm run plates` draws the illustrative plates (`scripts/plates/draw.js`) into `public/media/plates/`. They illustrate ideas; they are never data.
- `npm run media` crops the real captures in `media-src/` into `public/media/work/`.
- `npm run brand` (with the site running on :3000, or pass a URL) renders the hall posters, the social image, the three interface-study stills and the icons from the live site, in installed Chrome.

## Stack

Next.js 16 (App Router, static export) · three.js for the hall (loaded only when the hall is on screen; ambient occlusion, a fading floor reflection and shadows on capable devices, a lighter mode on phones) · React 19 `<ViewTransition>` for page transitions. No other runtime dependencies.

## Accessibility & motion

- Everything readable is HTML: the wall text, labels, catalogue, plan and records. The canvas is decorative.
- `prefers-reduced-motion`: no WebGL, no crane. The home page is the still of the hall and the catalogue; every work links straight to its record.
- “Pause motion” in the hall stops the idle drift and grain (remembered per browser). The room only renders while something moves.
- Keyboard: skip link, visible focus, arrow keys walk between works, R turns a work around, Escape returns to the entrance.
