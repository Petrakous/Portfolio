# Petrakous — Personal Research Lab

An interactive portfolio for Petros Koutroulis, built around a fullscreen spatial avatar index and four concise card collections: Work, Credentials, Knowledge, and About.

## Run locally

Requires Node.js 22.13 or newer.

```powershell
cd C:\Users\peter\Documents\GitHub\Portfolio
npm install
npm run dev
```

Open `http://localhost:3000`. Changes in `app/` update automatically. Create a production build with `npm run build`.

## Edit the content

- `app/portfolio-data.ts` — the cards shown in every carousel and index page. Edit this first when adding or removing work, credentials, skills, or interests.
- `app/site-copy.ts` — the homepage name, role, hotspot labels, numbers, and panel sides.
- `app/page.tsx` — the fullscreen 3D index and card-wheel interaction.
- `app/section-page.tsx` — shared layout for `/work`, `/credentials`, `/knowledge`, and `/about`.
- `app/globals.css` — black/red visual system, carousel, card indexes, responsive behavior, and reduced-motion support.
- `public/avatar/viewer-config.js` — cinematic timing, orbit limits, camera sensitivity, and the GLB bone/offset mapping for every label.

## Avatar status

The homepage loads a skinned 3D placeholder and resamples its animated surface into a point/splat proxy. Drag to orbit, use the wheel to zoom, or interact during the intro to take control immediately.

When Petros' own reconstruction is ready, update the bone and label mapping in `public/avatar/viewer-config.js`, then replace the renderer/model behind the existing `avatar-mode` browser event.

## Content notes

- Work combines current research, flagship projects, selected systems coursework, an intentionally small early-years archive, and a compact “other experience” section.
- Early security/network experiments are described only as controlled learning artifacts; the portfolio does not expose operational details.
- No CV download is exposed because the supplied CV contains a private address, phone number, and biographical fields.
- CesiumMan is a temporary, openly licensed interaction prototype—not Petros' final likeness.
