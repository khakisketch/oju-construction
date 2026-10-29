# Pavement cutaway STILLS (realism v1) · render notes

Date: 2026-10-28 (v1). Correction batch v2: same day, same exclusive files.
Correction batch v3: same day — final bounded repair per independent
review (see "v3 decisive fixes"); v2 is REJECTED (broken cube template,
circular audit). Owner of this asset: renderer subagent (comparison page,
integration, sharing and final product judgment belong to the parent
session).

## What this is

Two same-camera stills of one place — `normal.png` (supported pavement) and
`settled.png` (local settlement + ponding) — replacing the rejected
orthographic "miniature on a plinth" look. Near-frontal perspective cutaway:
a real pavement field continues past the left/right/top frame edges, with its
supporting layers exposed as a trial-pit style section.

This is **not** a field photo, **not** a scan, **not** a fluid/geotechnical
simulation, and **not** an engineering standard. Dimensions are
representative and technically unreviewed. Any caption must keep the existing
product guardrails: CGI is never presented as a real work, photo, or
technical simulation; pipe-related material loss stays ONE conditional
possibility, never a diagnosis.

## Files (this task only)

- NEW renderer: `docs/paver-realism-scene-2026-10-28.py` (reproducible,
  40040 bytes, no experimental bloat; temp drafts stayed under `/tmp/opencode`).
- NEW finals: `docs/images/paver-realism-v1/normal.png`,
  `docs/images/paver-realism-v1/settled.png` — both 1920×1080 PNG, sRGB.
- This notes file.

Untouched: `docs/paver-story-hybrid-scene-2026-10-28.py`,
`docs/images/paver-hybrid/*`, `docs/paver-hybrid-provenance-2026-10-28.md`,
all app routes, and every other uncommitted file in the repo.

## Exact render commands

Blender: `/tmp/opencode/oju-blender-arm64/root/usr/bin/blender`
`blender -b --version` → **4.0.2**, CPU CYCLES. This build has **no
OpenImageDenoiser** (`Build without OpenImageDenoiser`; the denoiser enum is
empty), so `scene.cycles.use_denoising = False` and grain is controlled with
samples instead.

```sh
cd /home/ksi/Desktop/SI-Projects/OJU-EC
PAVER_OUT_DIR=/tmp/opencode/paver-realism/final-normal \
  PAVER_STATE=normal PAVER_SAMPLES=384 PAVER_W=1920 PAVER_H=1080 \
  /tmp/opencode/oju-blender-arm64/root/usr/bin/blender \
  -b --factory-startup -P docs/paver-realism-scene-2026-10-28.py
# same with PAVER_STATE=settled and a fresh PAVER_OUT_DIR
```

Logged output (v3 final batch): `state=normal samples=384 size=1920x1080
tris=73433 seconds=136.1`, `state=settled samples=384 size=1920x1080
tris=75616 seconds=185.4` (20-core CPU machine).
Pixel-diff normal vs settled: dip-zone mean diff 24.1 — only the locally
affected support/pavement and the puddle differ. Far-field mean diff 1.2,
max 14, p99 6: independent-render Monte Carlo noise (Cycles seed not
pinned), not a framing difference — verified identical by inspection.
SHA-256 of raw v3 renders (pre-metadata, decoded-RGB reference):
`3eeb8f879efac6198dc80a0ced2172e365573535f081f5c0e803ce17e2153196` (normal), `d8dc874e4632a905ebaa8c4bf74c633a9fed1aff90423e8c909e0f43adfd70bf` (settled).
Raw files were copied into `docs/images/paver-realism-v1/`, then PNG
text metadata (source/params/origin) was embedded AFTER image review;
decoded RGB is unchanged (pixels_sha256 identical pre/post in
`.next/paver-realism-v1-acceptance/final-asset-hashes.json`). Delivery
file hashes therefore differ: normal
`77996b38029bf438db5ece826af337523985d325732ae5ee9096a7828ed0e058`,
settled
`6aa485045c501004d5e9d14f8f94952b10d9d0622bdc954b805ea2b961dbed3e`.

## Shared setup (identical for both states)

- Seed: fixed (`random.Random` streams 1101/2202/3303/4404/5505/6606 per
  subsystem); settled-only extras draw from their own streams, so shared
  geometry/material sampling is bit-identical between states.
- Camera (carried over from v2 into rejected-v2/final-v3; v2 itself is
  REJECTED — see below): perspective, 40 mm lens, position (0.35, −2.30, 1.05), aimed
  at (0.40, 0.55, −0.35). Tighter near-frontal crop on the dip/cavity/pipe
  zone (~2.8 m of section across the frame); pavement still exits
  left/right edges; thin road sliver + minimal sky at top, trench floor
  grounds the foreground. Verified legible at 960 and 480 px widths.
- Lights (overcast daylight): world background flat grey-blue
  (0.70–0.80 range, strength 1.05) with faint noise cloud mottling; key AREA
  380 W size 10 at (2.0, −3.5, 5.5); fill AREA 200 W size 12 at (−1.5, 1.5,
  6.0); SUN 0.6, angle 0.12; frontal face-lift AREA 130 W size 6 at
  (0.4, −3.0, 0.9) aimed at the section. No studio backdrop, no
  shallow-DOF trick.
- Render: 1920×1080, 384 spp, diffuse/glossy 4, transparent 8,
  `sample_clamp_indirect = 3.0`, AgX, exposure 0.
- Textures reused from the recorded RealVisXL workflow (see provenance doc):
  `docs/images/paver-hybrid/{concrete,aggregate,soil,sand}.png`,
  box-projected in-shader (never a generated video frame):
  concrete `a6fe6ca9…`, aggregate `7b07c31d…`, soil `01bdac82…`,
  sand `f9aae758…`. License/attribution requirement SG_161222 (commercial
  images allowed, credit required) carries over to any page that publishes
  these renders; SDXL VAE MIT. No new model downloads, no external APIs.

## Geometry (meters, real scale)

| Element | Construction |
|---|---|
| Pavers | 0.200 × 0.100 × 0.060 modules, 4 mm joints filled with sand-colored fill draped 6 mm below tops (follows the dip), running bond over x ±7 m / y 0–7 m; per-face-split corners so every end/top shades flat; field tone 0.93–1.00 + 4 % stains, ±0.001 rad jitter; sawn front row near-uniform (tone 0.92–0.94, zero random jitter/tilt, keeps rigid dip + tilt) |
| Bedding sand | nominal 40 mm; face top edge FOLLOWS the dipped block bottoms in settled state (support loss — bedding pinches out at dip center), fixed at −0.06 in normal; part of displaced cut-face grid |
| Base aggregate | 200 mm (−0.10…−0.30), wavy boundaries ±8/±20 mm |
| Subgrade | −0.30…−1.00, relief ±12 mm value-noise + jitter |
| Cut face | one 420×96 displaced grid, 3 material zones, smooth-shaded; ~210 half-embedded crushed stones (6–32 mm, largest in base). All box templates verified: 8 distinct corners, outward winding, coplanar nonzero-area quads (startup asserts) |
| Pipe | concrete pipe Ø220/Ø176 mm at (0.62, −0.50), 2 m tube into the ground, wall ring + dark interior + deep cap + dark soil gasket at the mouth; real hole cut in the face in BOTH states. Settled only: small conditional crown loss (~58 mm arc, segments 75–105° omitted) with spalled lips — intact in normal. No connector path is drawn anywhere |
| Void pocket (settled only) | genuine 180 mm-deep recessed shell (4 rings + back cap, dark gradient), 14 loose crumbs; hole edge STITCHED to a draped irregular collar (exact boundary walk → resampled bridge → draped outer loop), no grid staircase |
| Standing water (settled only) | approximately HORIZONTAL plane at −28 mm clipped to the actual depressed surface (kept where dip > 28 mm, ~12 mm deep at center); blocks above the level emerge; feathered alpha only at the exact waterline contact; darker saturated ring computed from the waterline contour + wide subtle damp halo |
| Settlement (settled only) | rigid per-paver dip, Gaussian σ 0.65 m, max 40 mm at x 0.35, fading by y 2.2 m, plus gradient tilt |
| Foreground/background | undulating trench floor (z −1.0) with 110 crumbs; concrete curb; asphalt plane to y 40 m |

## Verification performed

- Read the rejected renders (`.next/paver-hybrid-acceptance/desktop-settled.png`,
  `hybrid-render-v2/frames/frame_0050.png`): confirmed toy look — ortho,
  plinth, sticker pipe, painted cavity, cyan plate puddle.
- Inspected each preview at 1:1 crops (face, pipe, paver field, puddle):
  found and fixed (1) self-intersecting face quads causing zigzag stripes,
  (2) 2.5-stop overexposure of paver tops, (3) missing pipe hole (tube hidden
  behind face), (4) white halo around pipe mouth (added soil gasket),
  (5) face/floor gap dashes (extended floor behind face),
  (6) opaque-white puddle (darker base, patchy roughness, tighter feather).
- Compared normal vs settled at full res: identical framing/lighting; only
  the dip zone, cavity, and puddle differ.
- Teeth diagnosis (v2, evidence over theory): the mesh was audited in-build
  — every paver polygon's vertex set is exactly one rigid cube face (zero
  non-standard faces), corners split per face, flat shading, no custom
  normals; scanlines across front ends read uniform within ±4 %. The
  dominant artifact was a *construction* error, not topology: the first
  version's "joint fill" sat at paver-bottom level, leaving 60 mm-deep dark
  slots whose shaded walls + running-bond perspective read as sawteeth.
  THIS DIAGNOSIS WAS WRONG (see v3). It compared faces against the same
  broken template and mistook an audit tautology for geometry proof.
- No text/arrows/rain/sparkles in the image; no app files modified
  (`git status` shows only the two new paths plus this note).

## v3 decisive fixes (independent review — v2 REJECTED, do not use)

1. `UNIT_CUBE[5]` duplicated index 1 (`(.5,-.5,-.5)` twice); the
   upper-front-right corner was missing, so every box had 7 distinct
   corners, a twisted top quad, and two collapsed triangular side faces —
   the exact ~34° diagonal wedges on every block. Fixed the corner to
   `(.5,-.5,.5)`; faces re-wound consistently OUTWARD (verified by
   normal·(faceCenter−cubeCenter) > 0); curb's explicit face list and the
   pipe back-cap fan fixed the same way. Added startup asserts: 8 distinct
   corners, 4 distinct indices/quad, coplanarity < 1e-9, nonzero triangle
   areas, outward winding — the script aborts instead of rendering broken
   solids. The v2 "audit" is retained in this note only as a record of the
   error: it normalized face patterns by subtracting the minimum index,
   which maps the broken top face onto the bottom face's pattern, and
   compared everything to the same erroneous template.
2. Independent proof: a separate one-block untextured render with the same
   lights shows perfectly flat faces (scanline stdev 0.4–0.9 on face
   interiors; only edge AA deviates) — diagonal wedges gone. Full-scene
   section ends now read as clean rectangular block ends with thin joints.
3. Support contact: the cut-face top edge now follows the actual dipped
   block bottoms in settled state (`face_top(x)`, bedding pinches out at
   dip center = shown support loss) instead of a rigid edge cutting
   through dipped blocks; unchanged −0.06 in normal.
4. Standing water: replaced the draped coating with an approximately
   horizontal plane at −28 mm clipped to the real depressed surface
   (kept where dip > 28 mm, ~12 mm deep at center); blocks above the
   level emerge physically; alpha feathers only at the exact waterline
   contact. Saturated ring recomputed from the waterline contour
   (no fixed radii, no alternating-index band).
5. Rill REMOVED (was visually detached from the defect and implied a loss
   route the image must not claim). The void pocket and the small crown
   loss coexist with NO connector drawn — illustrative conditional defect
   only, matching the softened caption (this image cannot judge pipe
   damage or loss paths).
6. Verified: full-res both states + 960/480 px downscales; same camera/
   light/materials; normal intact (pipe whole, support continuous, no
   water/cavity).

## Honest remaining gaps (v3 — no self-certification beyond what was checked)

1. No denoiser in this Blender build: faint grain survives in flat areas at
   1:1 (invisible at normal web sizes); going beyond 384 spp was judged
   unnecessary for web use. Far-field pixel diff between the two states
   (mean 1.2, max 14) is independent-render Monte Carlo noise, not
   misalignment.
2. Per-block tone variation (±4 %) and running-bond joints remain visible
   on close zoom — real segmental-pavement behavior, not an artifact
   (proven by template asserts + one-block proof + uniform scanlines).
3. Layer boundaries can show ~1 cm grid steps on close zoom (96-row grid);
   the cavity rim itself is fully stitched and step-free.
4. Puddle is a bright sky-mirror by design (overcast); oblique close-ups would
   want true reflections of nearby objects — out of scope for this still.
5. Aggregate stones are jittered boxes (crushed look) rather than rounded
   gravel; soil is texture + displacement, not particles.
6. The small crown loss is ONE conditional illustration, not a diagnosis —
   page copy must keep the "one possibility, needs site investigation"
   framing (caption already softened accordingly).
7. Tested in Blender only; browser/page integration, captions, and alt text
   belong to the parent session.
