# Petrakous — Personal Research Lab

An interactive portfolio for Petros Koutroulis, built around a spatial avatar interface and evidence-backed project stories across computer vision, research tooling, 3D web, and distributed software.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server. A production build is created with:

```bash
npm run build
```

`pnpm install` and `pnpm run dev` work as equivalent commands.

## Structure

- `app/page.tsx` — interactive experience, avatar state machine, command palette, project chapters, and responsive fallbacks.
- `app/content.ts` — maintainable project, skills, and search-index content.
- `app/globals.css` — black/red visual system, procedural avatar rig, motion, responsive behavior, and reduced-motion support.
- `public/media/` — selected first-party project visuals.
- `public/avatar-manifest.json` — semantic anchor and animation-intent contract for replacing the placeholder avatar.
- `docs/ASSET_ATTRIBUTION.md` — source and attribution notes.

## Avatar replacement

V1 uses a lightweight procedural CSS humanoid so the first paint and navigation never depend on a heavy 3D download. To install the final avatar later:

1. Keep the existing `HeroMode` states and accessible hotspot buttons.
2. Replace `AvatarRig`'s visual body with a lazy-loaded mesh, splat, or custom renderer.
3. Map the renderer's head, hands, and torso to the anchors in `public/avatar-manifest.json`.
4. Map animation clips to `idle`, `look`, `presentRight`, `presentLeft`, and `identify`.
5. Keep the non-3D navigation and reduced-motion behavior intact.

## Intentional placeholders

- The humanoid is a procedural stand-in for Petros' future scanned or rigged avatar.
- The 3D Viewer Lab is represented through verified 3DHUA engineering details until a separate public repository or case study is available.
- No CV download is exposed because the supplied CV contains private address, phone, and biographical fields. Public content uses only professional contact links.

## Highest-value next improvements

1. Replace the procedural avatar with Petros' final optimized model and authored gesture clips.
2. Add short, compressed video loops for the 3DHUA and Aerial Detection Atlas interactions.
3. Confirm public usage rights for every research image and replace any restricted frame.
4. Add deeper per-project case-study routes as verified outcomes and process notes become available.
5. Add a privacy-preserving contact endpoint if email-only contact becomes limiting.
