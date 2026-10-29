# Local AI video experiments — 2026-10-28

## Current aggregate status — 2026-10-29

**51 videos have actually been generated locally:** numbered candidates 1–38,
four separately named trajectory-guided videos in batches nine and ten, and
three named structured-prompt videos in batch twelve, and four named prompt
ablation retries in batch fourteen, and two Mochi prompt tests in batch fifteen.
None has been accepted as the complete scroll explanation; no video
has been connected to the B preview. Candidate 34 is a surface-water observation
only and cannot establish an underground cause. The following sections retain
their original per-batch findings; statements such as "four" refer only to
that batch, not the present total. Recorded reviews inspect frame sequences,
not human real-time playback. Technical field review and actual phone/Safari
testing remain open. All outputs are synthetic examples, not actual projects
or verified physical simulations.

## Result and limits

Four actual unguided text-to-video candidates were generated locally. **None is recommended for the complete scroll-interactive explanatory sequence.** None shows an intelligible support/layer/pipe/cavity mechanism; a surface-only image cannot establish the cause of a depression. These are AI illustrations, not field footage, a real project, physical simulations, or construction details. A cause, method, or diagnosis would need field investigation and technical review. No UI was changed.

Motion was assessed from all 49 sequential decoded frames arranged in `motion-grid-N.jpg` and nine larger sampled frames in `sheet-N.jpg`, not by a human viewing playback; subtle flicker and subjective motion quality remain unverified. MP4s are provided for independent real-time viewing. All four are failed as complete sequences, not blanket ratings of the model:

1. `candidate-1.mp4`: fixed-looking wet surface and moving ripple, but the white puddle contains an anomalous colored object; the ripple becomes a conspicuous circular vortex. No convincing localized settling or mechanism. Fail.
2. `candidate-2.mp4`: most plausible fixed surface at first glance, but a dark object materializes in the puddle and transforms into circular rings; no visible settling, and no mechanism. Fail as sequence; not an integration recommendation even as a surface loop without playback review.
3. `candidate-3.mp4`: coherent fixed paver field, but requested movement and puddle are barely evident; geometry is already irregular and changes insufficiently to communicate settlement. No mechanism. Fail.
4. `candidate-4.mp4`: iteration after examining candidate 1; removed rain/ripple and requested rigid blocks sinking. Instead a black rectangular hole opens beside the drain and a conspicuous white patch emerges. This does not read as gradual coherent settlement or a puddle. Fail.

Output previews and 49-frame sheets: `docs/media/paver-ai-candidates-2026-10-28/`. Full lossless generated PNG frames and logs are retained at `/tmp/opencode/oju-video-VSg1Xv/output/` and `/tmp/opencode/oju-video-VSg1Xv/`; temporary storage is not durable. No source images, guide video, Blender, control video, or external inference were used. Candidate 4's input was changed in response to candidate 1's actual output, not simply another seed. The 14B model is larger than the previously attempted 1.3B; no other larger or quantized model was evaluated in this run, so there is no comparative quality conclusion about alternatives.

## Reproduction and execution

Workflows `docs/ai-workflows/paver-video-ai-2026-10-28/candidate-{1,2,3,4}.json` contain exact prompts, negatives, seeds, model loader settings and nodes. Source is the earlier `docs/ai-workflows/paver-wan-vace-14b-test-2026-10-28.json` modified to omit image, Canny and reference controls. WanVaceToVideo is run with no reference or control: these are free-generation tests, **not** tests of a full animated guide. All 640×384, 49 frames, seed 2026102801–04, 20 steps, CFG 6, uni_pc/simple, denoise 1, shift 8, batch 1. PNG outputs encoded to H.264 CRF 20 yuv420p at 16 fps (3.0625s). The supplied scripts retain the original temporary paths and port and require adaptation to reproduce elsewhere.

ComfyUI commit `cdf272f3514353aab04dc2d9fceef57a260dc156`, Python 3.12, PyTorch 2.14.1+cu130, NVIDIA GB10, unified RAM 121 GiB. Separate local process PID 1651748, 127.0.0.1:18389, base `/tmp/opencode/oju-video-VSg1Xv`, disabled custom/partner API nodes; stopped after completion. Existing installation and shared models were not modified. Server execution times from history: 332.75, 308.13, 307.01, 308.88 seconds respectively. Candidate videos were composed from generated frames, not source video.

## Model provenance and terms

Local SHA-256 values independently recomputed and matched the original provider's [Comfy-Org/Wan-2.1 revision metadata](https://huggingface.co/api/models/Comfy-Org/Wan-2.1/revision/123acf1cc74bccbb9bfff8ac1ee72edc08c2341d?blobs=true). This repository labels its license Apache-2.0, as does the original [Wan-AI VACE 14B model card](https://huggingface.co/Wan-AI/Wan2.1-VACE-14B). Apache-2.0 permits commercial use subject to its terms, including applicable notice requirements; this is not legal clearance, an output-rights guarantee or advice.

- `split_files/diffusion_models/wan2.1_vace_14B_fp16.safetensors`: `f202a5c59b8a91ada1862c46a038214f1f7f216c61ec8350d25f69b919da4307`
- `split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors`: `c3355d30191f1f066b26d93fba017ae9809dce6c627dda5f6a66eaa651204f68`
- `split_files/vae/wan_2.1_vae.safetensors`: `2fc39d31359a4b0a64f55876d8ff7fa8d780956ae2cb13463b0223e15148976b`

No model weights or code were downloaded in this run. The existing local files above are identical to published provider LFS SHA-256 values. LTX-2.5 was not used due to unresolved company eligibility under its license.

## Second batch and follow-up iteration (2026-10-28/29 local time)

The first batch's negatives excluded both cross-sections and pipes; it **did not test** the feasibility of a cutaway. Eight new actual videos were generated across distinct approaches, plus three new locally generated RealVisXL still references. None is recommended as a complete scroll explanation. All are synthetic examples, not field evidence, a physical simulation, construction detail, or a verified diagnosis. The following is frame-sequence review at roughly page scale; no human real-time playback or technical construction review was performed. Complete frame grids and larger representative sheets are beside the MP4s.

| Candidate | Approach, observed motion and visual result | Complete-sequence assessment |
|---|---|---|
| 5 | VACE 14B unguided, cutaway explicitly requested. A pipe opening, top pavers and granular ground appear, but the dirt contains odd green rectangles and an unrelated gridded/tiled channel in front of the pipe; tiles/holes change across frames. Camera appears fixed; no meaningful paver settlement. | Fail: not a credible continuous structure. |
| 6 | VACE 14B unguided, excavated trench. Large pipe and overhanging paving with an implausibly enormous open unsupported cavity; scene is too diagrammatic and almost static. | Fail: layers and transition do not communicate credible settlement. |
| 7 | VACE 14B reference-conditioned on reference 3, **not a full animated guide**. A photographic path/trench appears; output changes the original blocks into larger flat plates and introduces dark thin lines in the paving. Framing approximately fixed; almost no useful transition. | Fail: no intelligible subsurface or settlement mechanism. |
| 8 | Wan 2.2 TI2V 5B I2V, same reference 3 as first-frame conditioning. Better surface likeness and apparent camera stability than 7, but little meaningful change; lacks visible subsurface and cause. | Fail as complete sequence; a surface-only test, not an engineering depiction. |
| 9 | Wan 2.2 TI2V 5B unguided cutaway after viewing 5, explicitly excludes the extraneous tiled floor. Readable paver strip, aggregate, soil and hollow pipe, camera nearly fixed, but very large sharply separated aggregate looks arranged/miniature-like; no intelligible cavity or settlement; ground changes slightly. | Fail: a more legible composition is not a plausible animated mechanism. |
| 10 | Higher-resolution TI2V prompt iteration after 9: larger visible pavers and soil, but pipe and clear separate gravel layer are missing; a dark vertical gap grows into an unnatural wedge between blocks rather than controlled settlement. | Fail. |
| 11 | TI2V I2V using reference 1. Camera and trench largely stable, but a dark circular opening in an oversized concrete wall rather than a pipe under sidewalk; no visible sidewalk or credible settlement. | Fail. |
| 12 | Higher-resolution TI2V surface-only attempt. A long straight reflective strip appears between rows of pavers, not a localized natural puddle; no meaningful visible settlement. | Fail. |

**Still reference evaluation:** `reference-1.png` has realistic granular textures and a dark concrete opening, but lacks visible pavers/layers and is structurally ambiguous. `reference-2.png` looks like a large pit, without useful pavers or a pipe cross-section. `reference-3.png` best represents the requested everyday paver surface and a shallow puddle, with a trench alongside, but **does not show a buried pipe or bedding layers**; it was selected for candidates 7 and 8 on surface realism only. Reference 1 was later tested in 11 as an alternate trench. No Blender images were used. Reference PNG SHA-256 in numeric order: `6d0d346a85b4a5dd1bb22169b4ac4038cdeb091f7881316ac96fc25f9c10a5bb`, `c4a216f0f5048998258df1ca19c5993f1da5365bac6dc03d4054244ba5771154`, `43f91434b055bd6096ab042d04c66cf8bc461393820c2159432bcc3612c10622`.

**Generation:** API workflows, exact prompts/negative prompts, seeds and execution histories for all references and candidates are under `docs/ai-workflows/paver-video-ai-2026-10-28/`; scripts retain temporary absolute paths and must be adapted to rerun. References use RealVisXL V5.0, SDXL VAE, 1024×640, 30 steps, CFG 5.5, dpmpp_2m/karras, seeds 2026102811–13. Candidates 5–7 are 640×384, 33 frames, 20 steps, CFG 6, uni_pc/simple, shift 8, seeds 2026102805–07, encoded at 16 fps (2.0625s). Candidate 7 passes a RealVis image via WanVaceToVideo's `reference_image`; this is not an animated video control. Candidates 8–9 use TI2V 5B, 640×384, 49 frames, 20 steps, CFG 5, uni_pc/simple, shift 8, seeds 2026102808–09; 8 uses `Wan22ImageToVideoLatent`'s start image and 9 leaves it empty. Encoded at 16 fps (3.0625s). Candidates 10–12 use the same TI2V node, 832×480, 81 frames, 25 steps, CFG 5, seeds 2026102810–12, encoded at 24 fps (3.375s); 11 uses reference 1, 10 and 12 have no image input. Videos encoded from original generated PNGs with H.264 CRF 20 yuv420p. The official ComfyUI 5B template is saved alongside workflows; it informed loader, node, sampler and shift selection; dimensions, prompts and frame counts were deliberately changed for pilots. Sampling is not guaranteed bit-identical across environments.

Execution times from server histories for 5–12 in seconds: 207.475, 204.563, 222.325, 30.519, 31.810, 87.299, 92.194, 87.054. Process PID 1922660 used isolated `/tmp/opencode/oju-video-batch2-Pz9zV5`, loopback port 18390, custom and API nodes disabled, and was stopped. Full generated PNGs, downloaded weights, server logs and intermediate execution files remain only in this temporary area (subject to cleanup). No global packages, custom nodes, external inference or shared settings were changed.

**Additional model licensing and exact files:** [Wan-AI/Wan2.2-TI2V-5B](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B) and [Comfy-Org/Wan_2.2_ComfyUI_Repackaged at revision ee6f4a40737a995bf5818954cfce6d59443b0f04](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/tree/ee6f4a40737a995bf5818954cfce6d59443b0f04) state Apache-2.0. Downloaded directly from that revision, local hashes matched provider LFS metadata: `split_files/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors` SHA-256 `456f901338bd9eadbded3828b819109a9b68e8a525ca5cf8d0049a69fcfeca1e`, `split_files/vae/wan2.2_vae.safetensors` SHA-256 `e40321bd36b9709991dae2530eb4ac303dd168276980d3e9bc4b6e2b75fed156`. UMT5 is the previously verified Comfy-Org Wan 2.1 file and hash above. RealVisXL V5.0 by **SG_161222** (attribution required according to the creator's Civitai API setting) and SDXL VAE origins and commercial-use conditions are documented in `docs/paver-hybrid-provenance-2026-10-28.md`; the local checkpoint and VAE were rehashed as `6a35a7855770ae9820a3c931d4964c3817b6d9e3c6f9c4dabb5b3a94e5643b80` and `63aeecb90ff7bc1c115395962d3e803571385b61938377bc7089b36e81e92e2e` respectively and matched those records. Terms may impose conditions; this is not legal clearance. No LTX model was used.

## Third experiment bundle (2026-10-29)

Nine additional actual clips, numbered 13–21, test Wan 2.2 native 14B image-to-video and text-to-video expert pairs. **No clip is recommended for the complete scroll sequence.** All are AI-generated illustrative experiments, not real project footage, measured ground response, physical simulation, validated construction details or diagnosis. Full sequential frame grids and MP4s are supplied; this assessment used the decoded frames at page-scale and larger sample sheets, not human real-time playback. Camera appears substantially fixed in these grids; subtle flicker requires independent playback inspection.

### References and temporal-control limitation

New RealVisXL references 4–8 were generated from text. Reference 4 is a reasonably photographic close surface with recognizable joints; reference 5 is a photographic grass-edged surface. References 6–8 **failed** to provide a credible pipe-plus-support section: 6 is a trench without pipe, 7 a road edge without pipe, 8 a block over gravel without a visible pipe. As an alternative, the first frame of previous candidate 9 was img2img-refined into references 9 and 10. These contain recognizable pavers, granular support, soil and pipe, but the aggregate is oversized, the layers look highly arranged and the reference does not show a convincing distinct cavity. They were used for exploratory local-support tests 16, 17 and 19, **not treated as validated or convincing construction sections**. There is no verified causal relation in them.

References 11 and 12 are img2img variations of 4, intended as possible matched after states. They largely preserve joints, but do not visibly show the requested local downward change; the states are not a credible before/after pair. Endpoints from the I2V results likewise either barely change or produce impossible raised blocks/hatches. Therefore **no matched-endpoint VACE temporal-conditioning video was run**, and neither its ability to respect the endpoint nor its motion is verified. This is a reference-quality blocker, not a claim that temporal conditioning is technically unavailable or that cutaways are impossible.

Core `comfy_extras/nodes_wan.py` `WanVaceToVideo` accepts `control_video` and `control_masks`. Its code pads short videos with neutral 0.5, pads short masks with 1, and forms inactive and reactive video channels using `1-mask` and `mask`; default mask is 1. Thus one could supply a full-length video containing known endpoint images, mask those regions 0 and set unknown in-between pixels 1. The node encodes those channels via temporal VAE and downsamples masks to latent time, so this is **conditioning, not proven exact endpoint clamping**; temporal receptive fields and interpolation would need a real test. No masks, pretend transitions, or claims of verified endpoint behavior were produced here.

### Actual results

| Clip | Input and single-event goal | Actual result, fail as sequence |
|---|---|---|
| 13 | I2V pilot, ref 4, center blocks lower | Fixed-looking paver field but nearly static; no clearly readable settlement. |
| 14 | I2V ref 5, three blocks lower | A rectangular slab emerges and turns upright instead of settling. |
| 15 | I2V ref 4, adjacent blocks tilt down | The center opens into a black hatch-like wedge; not ground subsidence. |
| 16 | I2V ref 9, local support shifts | Pipe and layout remain identifiable; a few fragments appear to fall, but no meaningful coherent support transition. Stylized oversize gravel persists. |
| 17 | I2V ref 10, a few gravel grains drop | Largely static; no obvious localized change at page scale. Same reference limitations. |
| 18 | I2V ref 5, refined prompt and negative forbidding lifted blocks | No raised slab this time, but little or no visible downward event. |
| 19 | I2V ref 9, small soil trickle | Small texture changes near pipe; no clear support loss or settlement and stylized section remains. |
| 20 | Native T2V A14B, a few pavers sink | A long diagonal strip of separated raised/offset blocks appears nearly from the start, not a small localized sink. Underlayer not shown. |
| 21 | Native T2V A14B, section with soil grains near pipe | Side wall, paver strip and pipe appear but earth is very dark, the tiny event is not intelligible and no clear cavity or settlement is shown. |

None warranted a high-fidelity finalist. A surface-only clip cannot establish subsurface causes; no output here should be presented as authoritative or site evidence.

### Setup, provenance and reproducibility

`candidate-13.json` through `candidate-21.json` plus matching history files and all still workflows are in `docs/ai-workflows/paver-video-ai-2026-10-28/`. Every MP4, selected-frame sheet, 33/49-frame grid and reference PNG is under `docs/media/paver-ai-candidates-2026-10-28/`; `batch3-references.sha256` records still and prior-frame source hashes. Reference 9/10's `section-seed.png` input is retained as `section-seed-candidate9.png` and must be renamed when reproducing. The scripts record absolute temporary paths and require adaptation, as do image file names in workflows.

13 is 512×320, 33 frames, 16fps (2.0625 s); 14–21 are 640×384, 49 frames, 16fps (3.0625 s); all batch 1, 20 steps, CFG 3.5, Euler/simple, flow shift 5, seeds 2026102913–21. I2V uses `WanImageToVideo` with one start image, high-noise expert steps 0–10 with leftover noise retained, low-noise expert steps 10–20 with no new noise; it is **not end-conditioned**. T2V uses `EmptyHunyuanLatentVideo` with the native T2V expert pair, same sampling split; it uses no image. MP4 encoding is H.264 CRF 20 yuv420p from original PNGs. 13–21 server elapsed seconds: 75.266, 180.834, 182.477, 183.863, 181.040, 181.529, 184.898, 181.962, 178.407. Reference text-to-image 4–8: 1024×640, 30 steps, CFG 5.5, dpmpp_2m/karras, seeds 2026102904–08; reference 9/10 img2img from candidate 9 first frame, denoise 0.36, seeds 2026102909–10; reference 11/12 img2img from ref 4, denoise 0.25/0.4, seeds 2026102911–12. Exact source/prompt/negative settings are in workflows.

I2V pilot memory sampling (`pilot-memory.log`, 3-second samples) showed minimum system `MemAvailable` 72,747,068 KiB (about 69.4 GiB); max server RSS about 3.06 GiB is **not** total GPU/unified allocation, and the sample does not establish a rigorous peak. GB10 has one 121 GiB unified memory pool, not separate GPU and system memory. Pilot succeeded in 75.266 s before expanding. I2V and T2V pairs ran sequentially; ComfyUI's own `/free` unloaded models before T2V. No other jobs were killed. Separate ComfyUI process PID 2110613 listened on 127.0.0.1:18391 with custom and API nodes disabled; it was stopped. Original PNG frames, downloaded weights and complete log remain under `/tmp/opencode/oju-video-batch3-5IiH3a/` temporarily. No global packages or shared settings were changed.

The official [I2V model card, revision 206a9ee1b7bfaaf8f7e4d81335650533490646a3](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B), [T2V model card, revision c8c270b13ee05bfa474194ac9fb07a5868a97cea](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B), and [Comfy-Org repack revision ee6f4a40737a995bf5818954cfce6d59443b0f04](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/tree/ee6f4a40737a995bf5818954cfce6d59443b0f04) state Apache-2.0. Repacked FP8 weights were downloaded directly from that revision and independently hashed against its Hugging Face LFS metadata:

- `wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors`: `6122e79d55e0f235698d11d657f3b196c5273c830da00b2b013c5a048d5e6a42`
- `wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors`: `5471a457b6ac404202a5fbe6c11595a3d5641fc766b00f38763f72303fffc21e`
- `wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors`: `cad711ae211c8b23455ec68cd6a190a33a3d874234a77eb57266d73f8f0e6c9f`
- `wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors`: `e71b96d7c82e638694c5e7fb98fac4bfb0e4ddc5fbbb4b1df40da8f0f1278a97`

Encoder `umt5_xxl_fp8_e4m3fn_scaled.safetensors` and `wan_2.1_vae.safetensors` are the exact previously verified Comfy-Org Wan 2.1 files and hashes listed above; the original ComfyUI I2V and T2V templates are copied alongside workflows. RealVisXL V5.0 by **SG_161222** and SDXL VAE provenance, attribution and terms are recorded above and in the hybrid provenance. Apache-2.0 commercial use is subject to its license terms and notices; these checks are not legal clearance. No external inference, Blender or LTX was used.

## Fourth batch: actual moving and temporal VACE control (2026-10-29)

Six new **model-inferred** Wan2.1 VACE 14B clips, 22–27, test moving or sparse temporal controls. These are not guide videos and are not Blender renders, field evidence, physical simulations, validated construction details, or diagnoses. None is recommended as the complete explanatory sequence. The PNGs used for all-frame grids and nine larger frames were inspected; human real-time playback and field/engineering validation were not performed. A surface-only candidate cannot explain a subsurface cause. All prior candidates are preserved.

### Control provenance and actual semantics

The pre-existing 61-frame Blender **guide only** `/tmp/opencode/oju-paver-wan-v1/input/full-guide.mp4` (SHA-256 `853d232d3acc01d6a8d64c4ed926fe5e1524b34f7afef6eec730b46e68ed4f06`) contains a developing shallow dip and a dark support gap. Its toy appearance and multiple events are limitations; it is not a simulation and must not be presented as a final or field footage. It was resampled to 33 frames at 640×384 and saved as `batch4-controls/moving-cutaway.mp4`; candidates 22/23 use its Canny sequence and 27 the actual RGB sequence. These are actual moving controls, unlike the earlier 14B still-guide test. References 9 and 10 are the imperfect RealVisXL-refined section images documented in batch three; they are not validated construction examples.

For controls 24–26, `create-controls.py` constructs a **deliberately approximate 2D warp**, not a physical model: it resizes RealVisXL reference 4 or 9 to 640×384, gradually displaces pixels vertically inside a smooth elliptical footprint, and leaves outside pixels unchanged. The surface maximum displacement parameter is 20 px around (300,180), section 14 px around (225,108); 28,273 and 15,541 endpoint pixels respectively change, and zero change outside their ellipses *before video encoding*, recorded in `measurements.json`. The rough surface endpoint visibly bends a joint: it is not a credible rigid-paver target and serves only to test temporal conditioning. The AI source references were made locally with RealVisXL V5.0 by **SG_161222**, whose attribution and terms are recorded above.

We inspected the installed `WanVaceToVideo` implementation before running: control video is scaled to output size and missing frames padded with gray 0.5; absent masks default to 1. For supplied masks, 0 places video pixels in the `inactive` (known) channel and 1 in the `reactive` (unknown) channel. Both are VAE-encoded, then the temporal mask is nearest-exact downsampled from 33 pixel frames to 9 latent frames; the temporal VAE has its own receptive field. `strength` applies conditioning weight; it does not guarantee exact input pixels, rigid shapes, simulated physics or frame clamping. 22/23/27 supply no explicit mask, so default 1 applies; 24 supplies full-frame black/0 for frames 0–3 and 29–32, white/1 for middle frames, with a sparse video of start image, neutral middle and rough end image; 25/26 use black/0 outside the warped ellipse and white/1 inside over **all 33 frames**, together with the moving RGB guide. Encoded guides and masks, start/end PNGs, generation script and their SHA-256 manifest are retained only as **internal conditioning evidence**, under `docs/ai-workflows/paver-video-ai-2026-10-28/batch4-controls/`, not as user-facing videos.

Control injection and a visible target-direction change were checked, not assumed: the workflow histories include `LoadVideo`, `GetVideoComponents` and, for masks, `ImageToMask` feeding `WanVaceToVideo`; the resampled guide has 33 decoded frames. For surface guidance, a simple darkest-joint-row measurement at x=270/300/330 found start `[203,203,203]` and rough guide end `[214,215,214]`; candidate 24 start/end `[203,203,203]` / `[214,215,214]`, candidate 25 `[203,203,203]` / `[213,215,214]`. This reflects a visible corresponding downward **bend**, not proof of rigid block movement or a causally isolated conditioning effect; no unguided same-seed ablation or exact per-pixel clamp test was run. Other generated image regions and timing may differ despite these selected coordinates. Measurements and scripts are reproducible evidence rather than engineering measurements.

### Results from actual outputs

| Candidate | Control and strength | Inspection of generated sequence; complete-sequence verdict |
|---|---|---|
| 22 | Moving Blender-derived **Canny** guide, reference 9, 0.60, default mask | Soil/aggregate disappears into a large growing black void and pipe becomes obscured; pavers form an unrealistic overhang instead of a small coherent settlement. Visible change but no trustworthy layers. Fail. |
| 23 | Same moving **Canny** guide, different reference 10 and seed, 0.30 | Reinterprets scene as a trench and detached slabs on its floor, pipe changes orientation/appearance; the target dip is not readable. Fail. |
| 24 | AI surface start + approximate end, 0/1 **sparse temporal mask**, strength 1.0 | Same camera and recognizable surface; central seam bends downward over the sequence in the same direction as the rough endpoint. The paver itself bends rather than remaining rigid, and there is no subsurface content. Fail as construction explanation; useful evidence of temporal conditioning, not exact physical control. |
| 25 | AI surface **moving RGB** guide, reactive ellipse / known surrounding area, 0.65 | Similar localized bending and stable-looking outer field, with a bright changing patch in the middle. Geometry deforms instead of rigid blocks settling; surface only. Fail. |
| 26 | AI section **moving RGB** guide, reactive ellipse / known surrounding area, 0.70 | Mostly preserves pipe and approximate section but local change is barely intelligible at page scale, and the starting aggregate/section is unrealistically stylized. Fail. |
| 27 | Full moving Blender-derived **RGB** guide, ref 10, 0.45 | Dark rectangular/plinth-like cutaway and morphing dark pipe/hole; implausible repeating textures. Fail. |

No 832×480 finalist was warranted by these results. The remaining material barrier is a credible, matched moving reference/target in which individual rigid blocks and a believable pipe/support stay identifiable, plus a model/control workflow that maintains those objects throughout motion. This batch does **not** prove that such an approach is impossible.

### Reproduction and runtime

`candidate-22.json`–`candidate-27.json` and execution histories, exact prompts, seeds 2026102922–27, scripts and controls are in `docs/ai-workflows/paver-video-ai-2026-10-28/`. Each 640×384, 33 frames, 20 steps, CFG 6, uni_pc/simple, denoise 1, flow shift 8, batch 1; output H.264 CRF 20 yuv420p at 16 fps (2.0625s). Reference PNG filenames in workflows resolve to previously retained `docs/media/paver-ai-candidates-2026-10-28/reference-{4,9,10}.png`; copy them and the appropriate controls to the isolated ComfyUI input directory when reproducing. Source script has original temporary paths and requires adaptation. Saved MP4s, 33-frame grids and sheets are in `docs/media/paver-ai-candidates-2026-10-28/`; full generated PNGs and server log remain temporarily in `/tmp/opencode/oju-video-batch4-natqw3/`.

Server execution seconds from histories 22–27: 234.298, 219.486, 222.023, 222.319, 222.827, 220.270. Isolated ComfyUI PID 2400483 used loopback 127.0.0.1:18392, custom and API nodes disabled, and was stopped. No shared settings, user jobs, global packages or external inference were touched. Local 14B VACE, UMT5 and Wan 2.1 VAE SHA-256 values were recomputed and matched the authoritative pinned provider LFS values documented earlier in this file; the Apache-2.0 terms and RealVisXL terms/attribution remain applicable. This is not legal clearance.

## Fifth batch: rigid raster-block controls (2026-10-29)

Four further **locally model-inferred** Wan2.1 VACE 14B videos, 28–31, test whether a control with a translated paver patch rather than a smoothly bent seam improves motion. No result is recommended as the complete explanatory sequence or claimed as real footage, verified construction, diagnosis or physics simulation. A surface-only result cannot establish subsurface causes. Review used full sequential frame grids plus larger sampled frames, not human real-time playback.

### Guide and its limits

Starting from the locally generated RealVisXL reference 4 (SG_161222 attribution and terms above), the 640×384 source was unchanged at frame 0. A single quadrilateral polygon approximately bounding the recognizable block right of center, `(326,119),(460,119),(478,204),(326,204)`, was copied as a whole raster patch and progressively translated **down 5 image pixels**. Only exposed source pixels were filled with dark approximate joint color; surrounding pixels outside the reactive neighborhood are unchanged before encoding. No mesh deformation, Blender, physical simulation or generated end-state is implied. The selected patch itself is translated rather than bent, but this remains a rough 2D composite: its dark gap, border alignment and slight overlap/occlusion with the neighboring paver are artificial, and its geometry is not an established physically coherent state. Full-size start, middle, end, polygon, mask and a web-scale nine-frame guide sheet were inspected; the guide is usable only as a limited conditioning probe, not a realistic final or validated target. The guide has obvious compositing limitations, so even a visually similar output cannot establish credible rigid-body settlement. See the retained files in `batch5-controls/`.

The 33-frame moving control uses lossless RGB H.264. For 29 and 31 a temporally varying union of the original and translated block mask is expanded by 14 pixels; 1 (white) marks its reactive/unknown neighborhood and 0 marks the known surroundings. For 30, the full image is known (mask 0) at frames 0–3 and 29–32, with unknown (mask 1) middle frames and neutral-gray middle control frames. The node VAE-encodes inactive/reactive video and downscales time to nine latent frames; temporal receptive field and conditioning strength mean masks do not guarantee pixel-identical endpoints or exact physical constraints. The full implementation semantics are documented in the preceding section.

Before encoding the endpoint comparison changed 13,246 pixels and zero outside the expanded reactive mask; the unmodified start exactly matches the resized input. A simple line probe in `joint-observations.json` is inconclusive at two of three sample x coordinates because the rough composite retains an old dark line as well as a shifted edge. Thus there is **no quantitative proof of an intact paver shifting as a rigid body**, even in the approximate guide. The controls are retained solely as internal research inputs; they must not be used as final user-facing footage.

### Outputs

| Candidate | Actual inference and result |
|---|---|
| 28 | Reference-image-only VACE comparison, **no control video or mask**, seed 2026102928, strength 1.0. Produces a conspicuously raised rectangular slab and stray dark artifacts, not local sinking. Fail. |
| 29 | Same seed/prompt/reference, moving rigid-raster control, reactive neighborhood mask, strength 0.7. Surroundings roughly fixed, but the target patch becomes noticeably lighter and seems to appear rather than clearly move down intact; no believable settlement. Fail. |
| 30 | Same seed/prompt/reference, sparse before/after temporal control, strength 1.0. The patch and relatively straight seams remain recognizable with a dark line emerging, but displacement is very subtle and a coherent rigid block lowering is not demonstrable at page scale. No subsurface. Fail as complete sequence; a limited surface-conditioning probe only. |
| 31 | Same seed/prompt/reference, full moving control, reactive neighborhood mask, strength 1.0. Top edge and changing bright/dark rectangular patch appear, but the event reads as a changing seam/texture rather than an identifiable rigid block moving down. Fail. |

This same-seed comparison isolates a **workflow/control change**, not a clean measurement of a single scalar: the presence of temporal video and mask changes the VACE conditioning in addition to strengths. It supports the observed contrast with the reference-only run but does not prove real-world rigid motion or generalize to other seeds. No section candidate was generated in this bundle: reference 9 has overly regular/oversized aggregate and its prospective top block is cropped by the image edge, so a convincing full-block motion guide that also preserves a credible pipe could not be constructed from it. That is an input-quality limitation, not a claim the section task is impossible.

### Reproduction and evidence

All four API workflows and histories, 33-frame grids, nine-frame sheets, MP4s, exact control videos, masks and source/reference are retained in the existing exclusive directories. `batch5-controls.sha256` contains their hashes; `create-rigid-controls.py` and `run-batch5.py` contain construction and submissions. `rigid-moving-mask.mp4` was a local symlink to `rigid-mask.mp4` during inference and is retained as actual bytes under its workflow filename. Copy controls into isolated ComfyUI input before rerunning; scripts carry the original temporary path and require adaptation. All are 640×384, 33 frames, 16fps (2.0625s), 20 steps, CFG 6, uni_pc/simple, denoise 1, shift 8, batch 1, same seed 2026102928; H.264 CRF20 yuv420p previews encoded from actual decoded PNGs. Server elapsed seconds 28–31: 232.710, 217.452, 218.949, 222.187. Original PNG frames and log are temporarily retained at `/tmp/opencode/oju-video-batch5-S9cGjk/`.

Isolated process PID 2560311 listened only at 127.0.0.1:18393 with custom and API nodes disabled and was stopped. No other process, shared service, global installation or external inference was touched. VACE 14B, UMT5 and Wan VAE are the previously verified Apache-2.0 files and hashes listed earlier; RealVisXL attribution and conditions remain applicable. This is not legal clearance.

### Fifth-batch direct review files

After reviewing the complete frame grids again, candidates 28–31 remain **unselected**:
28 raises a slab; 29–31 mostly reveal a bright patch or new seam rather than
demonstrating an intact block settling. Four new MP4 files, not a new page,
were added without replacing anything under the existing Tailscale-only
temporary preview. These files are AI-generated tests, not field recordings,
construction evidence or validated physical simulations. The source MP4 and
the entire HTTPS response matched SHA-256 for each file, and each returned 200;
the shared server also returned a valid 206 byte-range response for candidate
28. In an emulated 390×844 mobile context, system Google Chrome began playing
all four direct links (each passed 0.1 seconds) and also played candidate 28
embedded in the existing gallery page. This is not human real-time viewing or
real-device/Safari verification. The initially used bundled Playwright Chromium
headless shell stalled on both old candidate 24 and candidate 28; its embedded
test returned `NotSupportedError`, and `canPlayType` returned an empty string
for `avc1.64001f` while system Chrome returned `probably`. That tool/browser
codec difference explains the failed test setup, not guaranteed compatibility
for all browsers:

| Candidate | Direct tailnet-only review | SHA-256 |
|---|---|---|
| 28 | [MP4](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-28.mp4) | `f2852031af3a9b94658d9fa15ce01d671c8e097db117204911ceafa5f06c18a6` |
| 29 | [MP4](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-29.mp4) | `1bf0c37be4ed23a2ba7d1997b344ca6bd1f9f59d008bade54e7e59c56ce25151` |
| 30 | [MP4](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-30.mp4) | `7d253ecfbe6fd212096075dbaa332f877639b0227908fd81b4334da657680ef5` |
| 31 | [MP4](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-31.mp4) | `7e6cd19a3f0c1645fae420653837d614e345ed00919f10887e1f95bf016396ff` |

## Sixth-batch experiments (2026-10-29)

### Wan2.2 first/last condition versus first-only control

Candidates **35 and 36 were actually generated** locally using the already
verified Wan2.2 I2V A14B FP8 high/low experts. They are surface-only AI
illustrations, not actual footage, field diagnoses, construction records or
physical simulations. **Neither is recommended for the scroll sequence.**

- **35:** `WanFirstLastFrameToVideo` received both `rigid-start.png` and the
  approximate `rigid-end.png` from `batch5-controls/`. A rectangular joint
  appears near the center, but at page scale no coherent rigid block clearly
  lowers, and the starting/ending guide is itself a visibly imperfect 2D
  composite. Frame texture and joints also vary slightly. Fail.
- **36:** same `WanFirstLastFrameToVideo`, image, text, seed, models, sampler
  and settings but **no end image**. The candidate develops a conspicuous dark
  rectangular hole at the block edge. Fail. A script compared the API JSONs
  and verified that the sole graph differences are the end-image node/input
  and the output filename. The comparison isolates that workflow change for
  these inputs and seed, not a general causal or physical guarantee.

The complete 33-frame grids and larger nine-frame sheets were visually
inspected; no human real-time playback or field/technical validation was done.
Both videos are 640×384, 33 frames, 16 fps, 2.0625 s and video-only. MP4s
were encoded from the model's PNG frames with H.264 CRF 19; the source PNGs
remain in `/tmp/opencode/oju-paver-flf-DqaGbA/output/` (temporary). These are
not end-clamped pixel copies: the installed `WanFirstLastFrameToVideo` uses
encoded latent image/mask conditioning. The approximate target does not
establish a rigid-body 3D motion or a real pavement condition.

Seed `2026102928`, 20 steps, CFG 3.5, Euler/simple, shift 5, denoise 1,
batch 1. The high-noise expert runs steps 0–10 and the low-noise expert
10–20. The underlying start is the AI-generated RealVisXL V5.0 reference 4;
the creator **SG_161222** attribution and model terms described above apply.
Source input SHA-256: start
`5bfe3153683c1469eed4011b2638a05507febd498c17eea07e30695f8f6339fe`,
end `ae510d9db01b613d3c0625181434289318a37a4b435969fd0f0db15cc49892b4`.
Both are retained under `batch5-controls/`; exact API graphs and histories are
`candidate-{35,36}.json` and `candidate-{35,36}-history.json`. The pinned
[official FLF template](https://github.com/Comfy-Org/workflow_templates/blob/e7cd011d4ded3411c2f481200544f0be6fdc962e/templates/video_wan2_2_14B_flf2v.json),
verified model hashes, runner and server log are in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch6-wan22-flf/`. The exact
runner uses the original temporary paths and imports a safety module there;
the saved copies and paths need adaptation for reproduction elsewhere.

The four previously downloaded model files were independently rehashed and
matched the provider values in the third-batch section. ComfyUI commit
`cdf272f3514353aab04dc2d9fceef57a260dc156`, Python 3.12.13, PyTorch
2.14.1+cu130, NVIDIA GB10. Server-reported execution: 119.52 s and 111.86 s;
sampled minimum system `MemAvailable`: 68,560 MiB and 68,898 MiB respectively,
not rigorous peak total memory. The isolated process PID 2836726 listened
only on 127.0.0.1:33509 with custom/API nodes disabled and was stopped before
starting the separate Mochi process. No shared model, previous video, existing
preview page, global environment or official route was modified.

Both MP4s were added as new files to the existing Tailscale-only temporary
preview. HTTP responses were 200 and full response hashes matched local
originals. In a 390×844 emulated mobile context, **system Chrome** began
playing both (passed 0.1 s); actual mobile/Safari and whole-clip human viewing
remain unverified. Direct links have no separate comparison page, so the
accompanying message must retain the AI and rejection disclosures:

| Candidate | Direct review | SHA-256 |
|---|---|---|
| 35 | [Start and end conditions](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-35.mp4) | `96e0432d4d10b805a09898b08664e30eaa0fe0a783032ec8c12498042496a031` |
| 36 | [Start condition only](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-36.mp4) | `1f6f488d8d286eec3e290df61dac64776b093f6c97be433e62624fe148b17896` |

### Mochi 1 Preview (candidates 32–34)

- Mochi 1 Preview is a different **text-to-video** model, not a verified
  endpoint-control model. Its [original card at revision
  `cd1d0fe89aa8382fcd9ae760bc3d7afe6183579f`](https://huggingface.co/genmo/mochi-1-preview/tree/cd1d0fe89aa8382fcd9ae760bc3d7afe6183579f)
  and [Comfy-Org repack at revision
  `ed4b8585dc4d3204397291c35e100884686178d6`](https://huggingface.co/Comfy-Org/Mochi-Preview/tree/ed4b8585dc4d3204397291c35e100884686178d6)
  identify Apache-2.0. Genmo's [NOTICE](https://huggingface.co/genmo/mochi-1-preview/blob/cd1d0fe89aa8382fcd9ae760bc3d7afe6183579f/NOTICE)
  credits Google LLC and identifies the included T5 v1.1 XXL encoder/tokenizer
  as Apache-2.0. Commercial use remains subject to applicable terms and notices;
  this is not legal clearance or an output-rights guarantee.
- Three repacked FP8 files were actually downloaded into
  `/tmp/opencode/oju-paver-mochi-Wfsd9m/models/`; their full SHA-256 values
  matched the pinned provider LFS metadata: diffusion model
  `8a6475b5380c90461a40d5c08ad574a5ad5ac4e6047e5f5f3f294df363f50705`,
  T5 encoder `a498f0485dc9536735258018417c3fd7758dc3bccc0a645feaa472b34955557a`,
  and VAE `1be451cec94b911980406169286babc5269e7cf6a94bbbbdf45e8d3f2c961083`.

Three **actual local text-to-video inferences** followed, after the Wan2.2
process stopped. No reference image or video guide was used. All are AI
illustrations, not field evidence or physical simulations, and none is
recommended as the complete explanation:

| Candidate | Observed full-frame-sequence result | Scope |
|---|---|---|
| 32 | A large rectangular block begins conspicuously raised above the paving and becomes flatter, changing shape and brightness. It does not show adjacent flush pavers settling as rigid bodies. | Fail. |
| 33 | An exposed trench and apparent pipe appear, but separate paving and support layers are not clear; the pipe looks suspended across the excavation and meaningful granular motion is not obvious. | Fail. |
| 34 | A pre-existing surface puddle has visible ripples; this does not show settlement, the subsurface or a cause. The puddle and joint edges are imperfect. | Surface-observation test only; not the complete scroll explanation or an approved final asset. |

The 49 decoded frames and nine larger samples for each candidate were inspected
as grids, not by a human watching full-speed playback; subtle flicker and
subjective realism remain unverified. The videos are 640×384, 49 frames,
24 fps, 2.041667 s, H.264 CRF 19 and contain no audio. Seeds 2026102932–34;
30 steps, CFG 4.5, Euler/simple, denoise 1, batch 1. The
[official ComfyUI Mochi example](https://comfyanonymous.github.io/ComfyUI_examples/mochi/)
provided the starting graph and 30-step settings; the resolution, length,
prompts, seeds, FP8 weights and PNG output were changed. The example API
graph extracted from its animated WebP is preserved in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch6-mochi-preview/` alongside
the exact executed runner, weights download helper, Genmo LICENSE and NOTICE,
server log and synthetic-only safety tests. Exact candidate API graphs and
histories are `candidate-{32,33,34}.json` and `candidate-{32,33,34}-history.json`;
complete grids, sample sheets and MP4s are in
`docs/media/paver-ai-candidates-2026-10-28/`. Original PNGs and model files
are in `/tmp/opencode/oju-paver-mochi-Wfsd9m/` and may be removed by temp
cleanup. Reproduction scripts require their temporary paths to be adapted.

ComfyUI commit `cdf272f3514353aab04dc2d9fceef57a260dc156`, Python 3.12.13,
PyTorch 2.14.1+cu130 and NVIDIA GB10. Server-reported execution was 143.92,
137.29 and 137.49 s; sampled minimum system `MemAvailable` was 63,150,
62,065 and 62,313 MiB respectively. These are samples, not rigorous peak
total memory. Isolated server PID 2858095 on 127.0.0.1:49883 had custom/API
nodes disabled and was stopped. No global install, shared configuration,
external inference or previous video was changed.

Each MP4 was added with a new filename to the existing Tailscale-only preview;
HTTPS returned 200 and full response SHA-256 matched local originals. System
Chrome in a 390×844 simulated mobile context began playing each (>0.1 s).
This is not full human playback, Safari or real-device validation. Direct file
links have no embedded disclosure page; identify them as unselected AI tests
whenever sharing:

| Candidate | Direct review | MP4 SHA-256 |
|---|---|---|
| 32 | [Surface movement](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-32.mp4) | `01984949c3472e95c95f59508c32e555143128e1539b8ecfea6583aca0ad56ca` |
| 33 | [Trench and pipe](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-33.mp4) | `cb53b331806338176d177873fd478d2afef1ea396c6371b47001a308c3ca579c` |
| 34 | [Surface puddle](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-34.mp4) | `63aa5e711bbe5803f8c0fbb56f71e21c3b2c25c86e7f05818e6f9b8099d9c144` |

### Mochi 480p follow-up (candidates 37–38)

After inspecting 32–34, two additional **actual local inferences** used revised
single-event prompts at 848×480, near the model's stated 480p target. They
remain AI illustrations and **neither is selected**:

- **37:** the paving has repeated unnatural white marks, and its center becomes
  a dark square opening rather than a coherent rigid-block depression.
- **38:** a pipe and bright paving-like blocks are recognizable, and material
  appears to fall out of the pipe, but the pipe seems embedded directly in an
  oversized block rather than clearly beneath paving layers. The result does
  not show the requested conditional path of material entering a pipe gap,
  nor coherent surface settlement. It is not a realistic construction detail.

Assessment used all 49 sequential frames plus larger samples, not a human
watching real-time playback. Both MP4s are video-only H.264 CRF 19 at 24 fps,
2.041667 s. Seeds 2026102937–38; 30 steps, CFG 4.5, Euler/simple, denoise 1,
batch 1; same source model and verified FP8 files as 32–34 above. The 848×480
frame sheets preserve the actual aspect ratio with letterboxing rather than
stretching. Synthetic-only tests separately verified this encoding path.
The exact graphs/histories are `candidate-{37,38}.json` and
`candidate-{37,38}-history.json`. MP4s, nine-frame and all-frame sheets are
in `docs/media/paver-ai-candidates-2026-10-28/`; the executed updated runner,
review helper, safety tests and combined server log are in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch7-mochi-480p/`.

Server-reported execution was 258.97 and 255.66 s; sampled system
`MemAvailable` minima were 57,205 and 51,610 MiB, not rigorous peak total
memory. The isolated ComfyUI process PID 2906071 on 127.0.0.1:45369 disabled
custom/API nodes and was stopped. Its monitor was configured to stop its own
server if another GPU compute job appeared or shared-memory headroom fell
below its safety floor. The original PNG frames remain only in temporary
`/tmp/opencode/oju-paver-mochi-Wfsd9m/output/`.

Both videos were added only as new files to the existing Tailscale-only preview;
HTTP responses were 200 and full response SHA-256 matched local originals.
System Chrome in a 390×844 simulated mobile context began playing both (>0.1 s).
Actual phones, Safari and human full-speed viewing remain unverified. The
direct file links have no embedded disclosure page and must be described as
unselected AI tests when shared:

| Candidate | Direct review | MP4 SHA-256 |
|---|---|---|
| 37 | [Surface movement](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-37.mp4) | `a7e8f3f23b22f4f25f32a0f7cdf2ed7e7b68895e084f2a6a54b8327f4118050d` |
| 38 | [Pipe and material](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-candidates-2026-10-28/candidate-38.mp4) | `3b82110d1f62a2be736986a098aa6316f1b5edeeb0277979e6a3d9fc5cb1f848` |

### Qwen same-view controlled-input investigation

At the time of this Qwen study, the first 38 generated clips had not yielded an approved scroll sequence. A
remaining within-scope experiment is to seek a more coherent **same-view
before/after pair** with a local image-edit model, then evaluate a newly
generated video between those states. The images are internal conditions,
not a replacement final still-image deliverable or a verified 3D/physical
simulation. Four edits were completed and reviewed as described below; none
was suitable as a video endpoint, so no video was generated from them.

The original [Qwen-Image-Edit-2511 card, revision
`6f3ccc0b56e431dc6a0c2b2039706d7d26f22cb9`](https://huggingface.co/Qwen/Qwen-Image-Edit-2511/tree/6f3ccc0b56e431dc6a0c2b2039706d7d26f22cb9),
[Comfy-Org edit repack revision
`f68ace85e60b4a02a323e394253731947657b7d2`](https://huggingface.co/Comfy-Org/Qwen-Image-Edit/tree/f68ace85e60b4a02a323e394253731947657b7d2),
[Comfy-Org Qwen image encoder/VAE repack revision
`1f12b17be14c89b026c51a91d67c32f84bb047bc`](https://huggingface.co/Comfy-Org/Qwen-Image/tree/1f12b17be14c89b026c51a91d67c32f84bb047bc),
and the [Qwen2.5-VL-7B-Instruct card](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct)
state Apache-2.0. Conditions and any applicable attribution/notice must still
be followed; this is not legal clearance or a guarantee of output rights.
The three pinned FP8-mixed model, FP8 text-vision encoder and VAE files total
about 30.2 GB. Download into isolated
`/tmp/opencode/oju-paver-qwen-edit-hgGgFI/models/` completed; all three files
matched their pinned provider LFS SHA-256: image-edit model
`c9fdc158e46d3b61ef75f21ae866ca2fe808bf4a53643120d1c1e87c19280a4e`,
text-vision encoder `cb5636d852a0ea6a9075ab1bef496c0db7aef13c02350571e388aea959c5c0b4`,
and VAE `a70580f0213e67967ee9c95f05bb400e8fb08307e017a924bf3441223e023d1f`.
The installed core includes
`TextEncodeQwenImageEditPlus`; native-node presence alone does not prove a
successful run or that a matched physically credible pair can be produced.
An isolated model-free ComfyUI preflight verified that the current API accepts
the required native node input schemas and `qwen_image` text-encoder type;
its loopback server was stopped. The first four-case exploratory input-edit
run began case A and reached 32/40 sampling steps, but a new RustDesk GPU
compute process appeared. The resource guard stopped **only the isolated
ComfyUI server** (PID 3077450) as designed. No completed edited image or
video resulted; the preprocessed input and interrupted log remain under
`/tmp/opencode/oju-paver-qwen-edit-hgGgFI/`.

At a later snapshot that compute process was no longer listed, so one retry
was launched in `/tmp/opencode/oju-paver-qwen-retry-0cuDUY/`, with the
original evidence preserved, the verified weight files referenced from the
first temporary directory, and the **same** resource guard. Resource guard unit
checks and the comparison helper's tests used synthetic fixtures only.

The retry actually completed all four edits, reverified all three model hashes,
and stopped its isolated server (PID 3112142, 127.0.0.1:55327). Each result
was visually compared with the exact scaled input at 1328×800, including an
enlarged center; **none passed the realistic matched-endpoint gate**:

| Edit | Input and intended change | Observed result |
|---|---|---|
| A | RealVisXL reference 4; lower two central pavers without changing the rest | Two clean, smoother, differently proportioned blocks appear with conspicuously dark seams; the existing block identities and material texture do not persist. |
| B | Same reference plus batch-5 rough target as a second guide | The center block is raised like a slab, with a large black gap and changed surface texture. |
| C | RealVisXL reference 5, lower two pavers in the grassy walkway | The model produces an overly deep, neat rectangular pit with new blocks, not a subtle settled patch. |
| D | Reference 9, improve the unrealistically large aggregate in the section | The aggregate becomes an artificial, sharply bounded field of small uniform grains; the underlying layers and pipe arrangement are still not a trustworthy section. This was only a possible section *start*, not an after state. |

Pixel-difference metrics in the review JSONs only describe visual changes and
do not establish 3D displacement or physical correctness. The model was not
asked to diagnose a site. Since no pair met the quality gate, the prepared
Wan first/last video runner was **not executed** and no model-generated
numbered candidates 39–40 were produced by that runner. The separately named
trajectory experiments below are additional videos, not those prepared tests.
This does not establish that the image-edit or video models can never
produce a credible transition under different inputs.

The input images derive from RealVisXL V5.0 by **SG_161222**; the recorded
attribution and conditions still apply. Exact input hashes, prompts, seeds
2026102941–44, API graphs, output hashes, processed inputs, edited PNGs,
side-by-side review sheets and model hashes are retained under
`docs/ai-workflows/paver-video-ai-2026-10-28/batch8-qwen-control-study/`.
The original unchanged inputs remain in the earlier media/control directories.
The process used the official Qwen editing workflow structure, no extra LoRA,
40 steps, CFG 4, Euler/simple, shift 3.1 and batch 1. Server-reported
execution was 259.36, 416.51, 257.28 and 257.69 seconds; sampled system
`MemAvailable` minima were 77,047, 76,323, 76,752 and 76,757 MiB, not rigorous
peak total memory. Reproduction scripts retain temporary absolute paths and
need adaptation. No output was used in a site, no shared configuration or
model was changed, and no external inference was used.

The four input-versus-edit comparison sheets were later added as **new files**
to the existing Tailscale-only temporary preview, without changing earlier
shared pages. In each sheet the left side is the scaled AI input and the right
side is the rejected edit; the lower row magnifies the same area. These are
research inputs, not generated videos or approved footage. Each HTTPS response
returned 200 as `image/jpeg` and its full SHA-256 matched the project original:

| Study | Direct comparison | JPEG SHA-256 |
|---|---|---|
| A | [Two paving blocks](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-qwen-control-study-2026-10-29/compare-A.jpg) | `aa992f882b9da3306cbed90740c2582a98941939650bcb85a0915a6c74645712` |
| B | [Rough target guide](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-qwen-control-study-2026-10-29/compare-B.jpg) | `40c9528bc2cd376e32d46ed151668c593335396cf90ed93f4bc7ecc6f89c2e85` |
| C | [Grassy walkway](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-qwen-control-study-2026-10-29/compare-C.jpg) | `31aec80696dc67d0e8c849a62e2aab1ce2b3690b7f2929f3c73975adb6376765` |
| D | [Section start image](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-qwen-control-study-2026-10-29/compare-D.jpg) | `7b91107328cdfb84ee6cf32943cc11a0f02d7616335f1ba511763c14c8a8fe46` |

## Ninth batch: Wan-Move trajectory control (2026-10-29)

Two **additional actual local model-inferred videos**, `move-12.mp4` and
`move-24.mp4`, explore a different control method, bringing the total at that
stage to 40 model-generated clips across the first 38 numbered files and these
two named files. They are not the prepared but unexecuted Qwen endpoint candidates 39–40.
Both show only an AI-generated surface, not a real site, a verified physical
simulation or evidence for any underground structure or cause. Neither is
accepted for the scroll sequence.

Native Wan-Move nodes propagate the reference image along manually defined
point tracks; nine points moved by 12 or 24 pixels down the screen and nine
surrounding points were held stationary as conditioning. Same model, input,
prompt, seed and sampling were verified in the saved graphs; the track motion
and output names differ. Track instructions are not exact physical constraints.
The input is an AI-generated RealVisXL reference 4, not any rejected Qwen
edit. The nine moving tracks start within one visible block; some 24-pixel
endpoints cross its original lower joint. The view is nearly overhead, so
screen-down motion cannot establish physical vertical settlement. An endpoint
crossing the original boundary is not in itself proof that the guide is wrong;
these facts limit what can be concluded about the method as a whole.

- **12-pixel guide:** a dark slit develops; no convincing rigid block lowering
  is clearly visible.
- **24-pixel guide:** a larger black gap opens and the surrounding joints
  change, reading as separation rather than credible settlement.

Both full 49-frame grids and representative original-size frames were
inspected, not human real-time playback. Videos are 640×400, 49 frames,
16 fps, 3.0625 s, H.264, without audio. Exact prompts, coordinates, graphs,
histories, image grids, selected frames, logs, hashes and limitations are in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch9-trajectory-study/`.
The full frames and weights are temporarily in
`/tmp/opencode/oju-trajectory-kgbPwB/` and may be cleaned up. The isolated
server was stopped after sequential generation; no shared package or other
process was modified.

The [pinned Kijai FP8 repack](https://huggingface.co/Kijai/WanVideo_comfy_fp8_scaled/tree/033a4e487f60220b3d6e469599a6aebc46e13cee/WanMove)
lists Apache-2.0 and provider LFS SHA-256 for the used checkpoint is
`88aa449ce87dae29f3e6c1ec1c6107ba1a2d5057e6547ac1720d75c71eac32e9`;
the local checkpoint was reported to match it. The
[upstream Wan-Move card at revision `63a21fd3f4f1e6c6104e29f6b8d9b8ce3d635456`](https://huggingface.co/Ruihang/Wan-Move-14B-480P/blob/63a21fd3f4f1e6c6104e29f6b8d9b8ce3d635456/README.md)
also labels the model Apache-2.0 but contains additional responsible-use
language. Review the card, license, notices and image source terms before
commercial distribution; these records do not constitute legal clearance.
RealVisXL V5.0 creator **SG_161222** attribution and earlier conditions apply.

New files were added without overwriting the Tailscale-only preview. Each HTTPS
response returned 200 and its full SHA-256 matched the local MP4. In a 390×844
simulated mobile context, system Chrome began playing each (>0.1 s); this is
not real-device/Safari testing or human assessment of the full motion:

| Video | Direct review | MP4 SHA-256 |
|---|---|---|
| 12-pixel path | [AI trajectory test](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-trajectory-2026-10-29/move-12.mp4) | `794737cd84919637647d80ad2f27b163e61208786b462706e0df203c93285ccb` |
| 24-pixel path | [AI trajectory test](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-trajectory-2026-10-29/move-24.mp4) | `46f2ac7de05454bb4348bce0f680426ff3512342a1092ad3f73047dc719028c2` |

## Tenth batch: refined trajectory controls (2026-10-29)

Two **additional local Wan-Move model inferences**, `move-8.mp4` and
`move-16.mp4`, bring the total to **42 actual generated videos**: the first
38 numbered files and four separately named trajectory tests. These were
generated from the previously documented AI RealVisXL reference 5, not any
rejected Qwen image. Both remain **unselected surface-only tests**, not real
footage, physical simulations, construction details, evidence of subsurface
features or a diagnosis.

The more oblique grassy walkway reference and six moving points inside one
identifiable paver were visually reviewed before inference, with eight fixed
anchors outside. The saved input `guide.png` shows the 16-pixel condition;
the second uses 8 pixels. These are screen-space instructions, not a calibrated
projection of physical settling or rigid-body constraints. The saved API
graphs were independently compared: the graphs, models, seed, prompts and
sampling are identical apart from trajectory coordinates and output names.

- **8-pixel guide:** a smooth new slab grows and moves above the paving,
  rather than an existing block settling.
- **16-pixel guide:** a similar raised slab appears and changes shape and
  size; the neighboring paving also changes.

Each result was inspected via all 49 reduced-size frames and representative
full-size frames, not by human real-time playback. These two trials do not
prove all trajectory control is impossible. Patch similarity estimates in
`measure.json` do not prove rigid displacement, since the tracked texture is
changed or obscured by the generated slab.

The videos are 640×400, 49 frames, 16 fps, 3.0625 s, H.264, without audio.
Exact graphs, histories, guide coordinates, visualizations, measurements,
source, logs and hashes are under
`docs/ai-workflows/paver-video-ai-2026-10-28/batch10-trajectory-refined/`.
Full generated frames remain temporarily under
`/tmp/opencode/oju-trajectory-refined-8v2DSu/`. The same Wan-Move checkpoint
and component licenses, source attribution and caveats as the ninth batch
apply; the checkpoint was independently rehashed by the runner. The owned
server stopped after sequential generation, without killing other processes.

Both MP4s were added as new files to the existing Tailscale-only preview.
HTTPS returned 200 and each full response SHA-256 matched the project original;
system Chrome in a 390×844 simulated mobile context began playing each (>0.1 s).
This is not real-device or iOS Safari validation, nor human whole-clip review.

| Video | Direct review | MP4 SHA-256 |
|---|---|---|
| 8-pixel path | [AI trajectory test](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-trajectory-refined-2026-10-29/move-8.mp4) | `75aefd8c3b7d01fb59205325c5f8cf04d7bf05e18bb6137f538bf79be9bcbb89` |
| 16-pixel path | [AI trajectory test](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-trajectory-refined-2026-10-29/move-16.mp4) | `e7f37425fc4033e54396489ccfff1aff61348122e61b3c794c05af27f3349b8f` |

## Twelfth batch: structured prompt scene tests (2026-10-29)

Three further **actual local model inferences** explored deliberately planned
scene geometry, action timing and material language with the verified Wan2.2
TI2V 5B T2V graph. The video is AI-generated illustration, not actual footage,
engineering evidence or physical simulation. None is accepted for the full
scroll sequence. At this checkpoint the aggregate is 45 videos: 38 numbered,
four named trajectory tests and these three named prompt tests.

The pre-inference `plan.md` specifies a locked camera, an already-exposed
inspection trench, scale, light, material continuity, an initial hold, gradual
group settling and an ending hold. A uses an oblique surface-plus-trench view,
B a near-horizontal exposed section, and C surface-only as a diagnostic.
There is deliberately no pipe or water in these tests; not seeing a pipe means
the video cannot establish a pipe mechanism. The exact English prompts and
common negative are in the API JSONs; Korean translations and assessments
are in `results.md`.

| Test | Observed sequence | Verdict |
|---|---|---|
| A · oblique trench | An isolated row of oversized blocks borders gravel and a trench; a continuous paved surface, support layers and settlement are not apparent. | Fail |
| B · exposed section | Fragmented paving and a soil bank appear, but they do not read as a connected section under a coherent paved field; little controlled motion is visible. | Fail |
| C · surface control | More recognizable surface but no clear settling and no subsurface. | Diagnostic only; not a complete sequence |

All used Wan2.2 TI2V 5B, 640×384, 49 frames, 16 fps, seed 2026102912,
20 steps, CFG 5, uni_pc/simple, shift 8. H.264 MP4s were encoded from the 49
model-decoded PNGs. The same model/seed/sampler do not make this a one-factor
comparison: scene geometry, framing and wording also changed. Full grids and
sample frames were visually inspected, not human real-time playback; no
expert field review occurred. Details, translations, histories, guard log,
reproduction and SHA-256 manifest are in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch12-structured-prompts/`.
The recorded Apache-2.0 model/component licenses and their notice conditions
apply; this is not legal clearance. The owned GPU server was stopped after
generation; no shared packages or other process were changed.

Each result was added as a new file to the existing Tailscale-only preview.
Full HTTPS responses returned 200 with `video/mp4` and SHA-256 matched local
originals. Once the resource-guarded GPU comparison had stopped, system Chrome
in a 390×844 simulated mobile context began playing each (>0.1 s); actual
phones, Safari and human whole-clip review remain unverified. Links are direct
files with no embedded disclosure; share only as unselected AI tests:

| Test | Direct review | MP4 SHA-256 |
|---|---|---|
| A | [Oblique trench](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-structured-prompts-2026-10-29/A-oblique.mp4) | `c72e5b429b77ea21b1e1e1a598144722bbe47923b01351130dd3ddaf23ec9bf5` |
| B | [Exposed section](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-structured-prompts-2026-10-29/B-section.mp4) | `e6e74fcf7352c6f444dfbd88377dd72b4288760fb7fd7577fe2868531812b3a4` |
| C | [Surface diagnostic](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-structured-prompts-2026-10-29/C-surface.mp4) | `f2c70c21691a9052b3651b8b4771560a44c6839ad124f3971a99bc796211b7b6` |

## Thirteenth batch: prompt ablation interrupted (2026-10-29)

A 2×2 surface-only prompt study was prepared to separate the effect of
ordinary "sinking" wording from a description of the **same** marked paver
ending slightly below its neighbors, and ordinary style negatives from
targeted exclusions for newly appearing slabs, hatches and wide pits. All four
planned runs use the same synthetic reference 5, Wan2.2 I2V A14B experts,
seed, settings and conditioning. Ordinary narrow joints and a small height
step are not forbidden. This is a diagnostic of wording and not a complete
surface-plus-subsurface explanation.

Only P0N0 was submitted. While PNG frames were being saved, the sampled
resource guard detected a new RustDesk GPU compute process and stopped **only
the isolated ComfyUI server**. There were 27 valid PNG frames, an incomplete
PNG and no successful 49-frame history or MP4. The other three graphs were
prepared but never submitted. **No new completed video or factorial comparison
was produced.** The partial grid cannot establish full-sequence quality.
The actual submitted graph, prepared graphs, guard/interrupted logs, partial
grid, seed and exact English text and Korean translations are in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch13-prompt-ablation/`.
This preserves the interruption record and does not alter the 45-video total.

The foreign process had disappeared from a later snapshot and the owned port
was closed. A single fresh retry was subsequently executed with the same
resource guard and preserved prior evidence; its results are in batch fourteen
below. No other process was terminated or shared
configuration changed. The guard is sampled, so it cannot guarantee that no
short-lived foreign activity occurred between samples.

## Fourteenth batch: controlled prompt retry (2026-10-29)

The fresh isolated retry **completed four actual local model inferences**,
P0N0, P0N1, P1N0 and P1N1. These are surface-only synthetic tests and all fail
the realistic surface-motion gate and the original complete explanation gate;
they are not actual project footage, physical simulations, construction
measurements or diagnoses. The separate interrupted batch thirteen remains
incomplete and is not counted as a video. The total is now 49: 38 numbered
clips, four named trajectory tests, three batch-twelve scene tests and these
four named ablations.

The same AI-generated reference 5, model, seed `2026103013`, frame size and
sampler were used in all four runs. An independent graph comparison confirmed
that **only positive text, negative text and output filename differ**, and
that the saved retry graphs match the original planned graphs. P0 is the short
"a paver gently sinks" prompt; P1 describes initial state, the same marked
paver moving lower than neighbors, persistence of its outline and marks, and
the final state. N0 contains style/framing negatives; N1 adds newly appearing
slab, raised hatch, wide pit, elastic concrete and curved pavers. Neither
negative forbids normal narrow joints or a small height step. The source
image has no guaranteed unique target mark; using the word "marked" does not
ensure identity or a mask. P1 changes several instructions as a package, and
the study uses one image and one seed, so it does not isolate any single word
or establish a general ranking across seeds and models.

| Run | Positive | Negative | Observed result |
|---|---|---|---|
| P0N0 | Short | Style/framing | Mostly static; grass and a dark gap change. No clear rigid descent. |
| P0N1 | Short | Targeted | Mostly static; a dark spot appears. No clear rigid descent. |
| P1N0 | Detailed | Style/framing | A slab rises, stretches and merges back into the paving. |
| P1N1 | Detailed | Targeted | A slab rises and changes size and layout despite the targeted negatives. |

Thus in this specific comparison more detailed instructions increased visible
change, but did **not** produce the requested movement, and targeted negatives
did not prevent the raised-slab artifact. Complete 49-frame grids and nine
full-size samples for each were inspected, not human real-time playback or
expert technical review. Exact prompts and Korean translations are retained
in batch thirteen; outputs, graphs, successful histories, logs, safety
samples, settings and hashes are in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch14-prompt-ablation-retry/`.
Each MP4 is 640×384, 49 frames, 16 fps, 3.0625 s, H.264, without audio. The
same recorded Wan Apache-2.0 terms and RealVisXL creator **SG_161222**
attribution apply; this is not legal clearance. The owned process stopped,
and the guard did not observe foreign GPU compute or insufficient memory at
its samples; it cannot prove absence between samples.

The four MP4s were added under new names to the existing Tailscale-only preview.
Full HTTPS responses returned 200 with `video/mp4` and matched local SHA-256.
In a simulated 390×844 mobile context, system Chrome began playing each
(>0.1 s). This is not real-phone, Safari or human whole-clip validation.
Direct files have no embedded disclosure; share them only as unselected AI
tests:

| Run | Direct review | MP4 SHA-256 |
|---|---|---|
| P0N0 | [Short prompt · basic negative](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-prompt-ablation-2026-10-29/P0N0.mp4) | `c51f4740f9d1a902b16ab350752c394450726dfecf1ab8663eb131422ef21d4c` |
| P0N1 | [Short prompt · targeted negative](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-prompt-ablation-2026-10-29/P0N1.mp4) | `0b47c9aafbb41bfdecab6e663a8b8b85c15b76beccf24155aed27d17bcff7e0d` |
| P1N0 | [Detailed prompt · basic negative](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-prompt-ablation-2026-10-29/P1N0.mp4) | `218f487b344baa37ac61b4d8f32a26963eb327fb9bf678e5da39078085c5e155` |
| P1N1 | [Detailed prompt · targeted negative](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-prompt-ablation-2026-10-29/P1N1.mp4) | `f8644073bdb500824bf79c49cbedb9ff75f1ccb009cf0259a30c944c7acfb152` |

## Fifteenth batch: Mochi action wording comparison (2026-10-29)

Two **actual local model-inferred** Mochi T2V videos compare a short action
instruction to a more explicit relative-height and identity instruction.
Both fail even the surface-only motion gate and remain **unselected**. These
are synthetic experiments, not field footage, physical simulations,
measurements or evidence of a subsurface cause. The aggregate is now 51
completed videos. The interrupted batch thirteen's partial PNGs are not
counted.

The same scene paragraph, model, seed, dimensions and sampling were used:
M0 requests that a small group of pavers settles; M1 describes the same
recognizable pavers and surface marks going from approximately level to
slightly below their fixed neighbors, then stopping. The exact prompts were
written before inference and appear with Korean rationale in
`docs/ai-workflows/paver-video-ai-2026-10-28/batch15-mochi-prompt-comparison/plan.md`.
The saved planned/submitted graphs were independently compared and only their
positive text and output prefixes differ; the negative prompt is empty. This
T2V model has no input image, and the two outputs **start with different
compositions**, so it is not an identical-scene comparison. A single seed
does not prove general prompt or cross-model superiority.

| Test | Observed result |
|---|---|
| M0 · short action | A pale, faintly paved surface with a changing white pile and thin upright feature; no identifiable block group sinks. |
| M1 · relative height | More legible seams, but a pale center paver appears raised and neighboring outlines change. No coherent same-block descent. |

All 49 decoded frames and nine full-size samples for each were visually
inspected, not human real-time playback. Both are 848×480, 49 frames, 24 fps,
2.041667 s, H.264 without audio; Mochi Preview FP8, seed 2026102937, 30 steps,
CFG 4.5, Euler/simple and empty negative. Graphs, successful histories,
framesheets, hashes, licenses, notices, runner and resource logs are retained
in `batch15-mochi-prompt-comparison/`; full PNG frames remain temporary at
`/tmp/opencode/oju-batch15-bgrwzajb/`. The model and component hashes matched
the previously pinned Apache-2.0 sources; Genmo's NOTICE credits Google T5.
Conditions and attribution remain applicable, not legal clearance.

The owned server stopped after inference. At 4-second guard samples, the
minimum available system memory was about **41.79 GiB**, only about 1.79 GiB
above the 40 GiB stop floor; sampling does not establish the true minimum or
guarantee no foreign activity between samples. This limited headroom is a
material consideration before running further shared-GPU jobs; no safeguard
was relaxed.

Both videos were added as new files to the existing Tailscale-only preview.
HTTPS returned 200 and full responses matched the original SHA-256; system
Chrome in a 390×844 simulated mobile context began playing each (>0.1 s).
Actual devices, Safari and human whole-clip viewing remain unverified. Direct
links contain no disclosure, so share only as unselected AI tests:

| Test | Direct review | MP4 SHA-256 |
|---|---|---|
| M0 | [Short movement prompt](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-mochi-prompts-2026-10-29/M0.mp4) | `13010c42be63e837b084fb29e666e5cc6f6e507c76aeabd3b72e24d96b28b10d` |
| M1 | [Relative-height prompt](https://dgx-spark-1.tailda9552.ts.net:10021/media/paver-ai-mochi-prompts-2026-10-29/M1.mp4) | `18c54bf8074cb6232971e41c4e03ae8d350ddc975209c6198dcf5604b29c533f` |
