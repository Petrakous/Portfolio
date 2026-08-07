# Human splat capture plan

## Decide which result you need

There are two different workflows that are easy to confuse:

1. **A photoreal static person:** keep completely still while the camera moves around you. A conventional 3D Gaussian Splatting workflow can reconstruct the appearance very well, but the resulting splat is not naturally animatable.
2. **An animatable digital human:** record a carefully controlled monocular or multi-camera sequence and fit a body model such as SMPL. Research systems such as Apple's HUGS can produce an animatable human Gaussian avatar, but this is a more experimental pipeline than a normal static splat.

The current website prototype is neither of those: it is an animated, rigged GLB shown as soft points so that camera motion, rotation, gestures, layout, and fallback behavior can be tested now.

## Recommended first capture

- Use soft, even, diffuse lighting and keep it unchanged throughout the recording.
- Lock exposure, focus, shutter speed, and white balance. Avoid automatic camera changes.
- Wear matte, fitted clothing with visible texture. Avoid glossy, transparent, very loose, or uniformly black fabric. Keep hair controlled.
- Keep your whole body in frame, including shoes, with margin around the silhouette.
- For a static splat, hold a relaxed A-pose and do not move while another person makes a smooth 360° orbit.
- Record 4K if available. A 20–40 second orbit with high frame overlap is more useful than a long, shaky recording.
- Capture one level orbit, one slightly higher orbit, and one slightly lower orbit. Move steadily; avoid sudden changes in distance.
- Put textured, non-moving detail in the background so camera poses can be solved. Avoid mirrors, moving screens, crowds, and large blank walls.
- Place a measured reference object nearby, then remove it from the final crop if needed.
- Separately record neutral stance and the exact presentation gestures you want. Those clips are useful references even if the first reconstruction is static.

For a HUGS-style animatable experiment, record a clean monocular sequence with visible pose variation rather than walking the camera around a frozen pose. The official project reports reconstruction from roughly 50–100 monocular frames, but still depends on body-pose fitting and research code.

## Practical pipeline

1. Extract sharp frames from the video; discard motion-blurred and near-duplicate frames.
2. Solve camera poses and sparse geometry with COLMAP or the reconstruction tool's bundled pose pipeline.
3. Train the Gaussian splat and inspect floaters, incomplete limbs, and background leakage.
4. Clean/crop the result in SuperSplat.
5. Convert the working PLY to SOG for compact web delivery with `splat-transform`.
6. Replace the sample avatar path and renderer, while retaining the site's `avatar-mode` and `avatar-view` events plus the non-WebGL fallback.

## Public tools and references

- Apple HUGS, animatable human Gaussian splats: https://github.com/apple/ml-hugs
- PlayCanvas SuperSplat editor: https://github.com/playcanvas/supersplat
- PlayCanvas `splat-transform` CLI and SOG conversion: https://github.com/playcanvas/splat-transform
- Khronos CesiumMan fallback model: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CesiumMan

Before production, test the final asset on a mid-range phone and provide a compressed mesh/video fallback. Human splats can be visually strong while still being too large or too GPU-heavy for every visitor.
