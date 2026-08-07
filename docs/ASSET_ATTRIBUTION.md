# Asset and attribution notes

## Project imagery

The images under `public/media/` are selected from Petros Koutroulis' own local project workspaces and are used here as first-party portfolio material:

- `3dhua-campus.webp` and `3dhua-main-hall.webp`: 3DHUA / Harokopio University 3D Showcase thumbnails. The 3DHUA project credits the Harokopio University Computer Vision Group for capture contributions.
- `aerial-detection.jpg`: a smoke-detection result exported by the Aerial Detection Atlas D-Fire/YOLO pipeline.
- `triffid-frame-selection.png` and `triffid-crop-audit.png`: screenshots from the TRIFFID Review Studio workspace.

Before publishing to a different owner or domain, reconfirm that the underlying research imagery may be shown publicly. The site makes no claim that third-party source footage or datasets are owned by the portfolio author.

## Avatar prototype

The WebGL prototype uses **CesiumMan**, copyright Cesium GS, Inc., from the Khronos glTF Sample Assets repository under CC BY 4.0. Cesium trademarks are not licensed for promotional use. Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CesiumMan

The local renderer uses Three.js r160 modules under the MIT license. Source: https://github.com/mrdoob/three.js/tree/r160

The CSS humanoid is an original, dependency-free fallback. The point/splat appearance is generated at runtime from CesiumMan's skinned geometry; it is not a Gaussian-splat reconstruction.
