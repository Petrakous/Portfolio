# Petrakous — Personal Research Lab

An interactive portfolio for Petros Koutroulis, built around a spatial avatar interface and evidence-backed project stories across computer vision, research tooling, 3D web, and research software.

## Run locally

Requires Node.js 22.13 or newer.

```powershell
cd C:\Users\peter\Documents\GitHub\Portfolio
npm install
npm run dev
```

Open `http://localhost:3000`. Changes in `app/` update automatically. Create a production build with `npm run build`.

## Structure

- `app/page.tsx` — interactive experience, avatar state machine, command palette, project chapters, and responsive fallbacks.
- `app/content.ts` — maintainable project, skills, and search-index content.
- `app/globals.css` — black/red visual system, 3D-stage integration, motion, responsive behavior, and reduced-motion support.
- `public/avatar/` — Three.js runtime, public CesiumMan fallback, and the animated point/splat proxy.
- `public/avatar-manifest.json` — renderer and interaction contract for replacing the sample avatar.
- `docs/HUMAN_SPLAT_CAPTURE_GUIDE.md` — practical capture and reconstruction plan for Petros' own avatar.
- `docs/ASSET_ATTRIBUTION.md` — source and attribution notes.

## Avatar status

The hero now loads an actual skinned 3D model and resamples its animated surface into soft point sprites. It provides the cinematic camera move, rotation, head tracking, and left/right presentation gestures needed to test the interaction design. It is intentionally a splat-like proxy, not a genuine Gaussian reconstruction.

When Petros' own reconstruction is ready, keep the `avatar-mode` and `avatar-view` browser events, replace the model/renderer, and preserve the CSS fallback and reduced-motion path.

## Intentional constraints

- CesiumMan is a temporary, openly licensed interaction prototype—not Petros' final likeness.
- The 3D Viewer Lab is represented through verified 3DHUA engineering details until a separate public repository or case study is available.
- StudyRooms is intentionally not featured yet.
- No CV download is exposed because the supplied CV contains private address, phone, and biographical fields. Public content uses only professional contact links.
