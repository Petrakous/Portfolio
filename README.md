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
- The external Unsplash URLs in `demoImages` are temporary visual references. Replace each card's `image` and `imageAlt` when final project photography is ready.
- `app/site-copy.ts` — the homepage name, role, hotspot labels, numbers, and panel sides.
- `app/page.tsx` — the fullscreen 3D index and card-wheel interaction.
- `app/section-page.tsx` — shared layout for `/work`, `/credentials`, `/knowledge`, and `/about`.
- `app/globals.css` — black/red visual system, carousel, card indexes, responsive behavior, and reduced-motion support.
- `public/avatar/viewer-config.js` — SOG model path/alignment, cinematic timing, orbit limits, camera sensitivity, and label anchors.

## Avatar status

The homepage loads Petros' reconstructed Gaussian Splat from `public/avatar/models/petros-koutroulis.sog` through the Spark renderer. Drag to orbit, use the wheel to zoom, or interact during the intro to take control immediately.

The lightweight CesiumMan GLB remains only as a fallback if the SOG cannot load or render. Because this reconstruction is static, the old skeletal arm and head animations apply only to that fallback model.

## Content notes

- Work combines current research, flagship projects, selected systems coursework, an intentionally small early-years archive, and a compact “other experience” section.
- Early security/network experiments are described only as controlled learning artifacts; the portfolio does not expose operational details.
- No CV download is exposed because the supplied CV contains a private address, phone number, and biographical fields.
- Spark and Three.js are vendored under their MIT licenses in `public/avatar/vendor/`.
