# Batch 13 — interrupted; no valid factorial result

**Prepared four hypotheses; submitted P0N0 only; zero completed videos.** Preflight found 112,668,140 KiB available and only the GNOME baseline. During P0N0 the monitor detected foreign GPU compute `1821465, /usr/share/rustdesk/rustdesk` at 74,205,100 KiB available and immediately terminated only the isolated ComfyUI PID 1800237. This was the foreign-compute trigger, not the 40 GiB memory trigger. No other process was signalled. It would be inappropriate to continue this run after the trigger even though the foreign process had vanished by the later post-cleanup check. Port 18413 was no longer listening; post-cleanup compute showed only GNOME baseline. See guard.log and server-interrupted.log. The resource monitor samples approximately every four seconds, so short activity between samples is not ruled out. No process, package, model or shared configuration was altered.

High- and low-noise sampling reached 10/10 each, but process interruption happened during image saving: 27 valid decoded PNGs and one incomplete PNG are present only under `/tmp/opencode/oju-batch13-q43dvsxs/output`, temporary and not durable. A 27-frame partial grid is saved as `P0N0-interrupted-27-frames.jpg`, with the unused grid cell black. There is **no completed 49-frame sequence, no MP4, no execution-success history**. The partial image shows recognizable pavement and approximately fixed view with no clear sustained settlement in the inspected prefix; this cannot be a verdict on the full P0N0 output or a comparison. The other three variants have not been submitted. None was reviewed as a full sequence. This surface-only experiment cannot meet the original complete subsurface-plus-surface goal in any case. No human real-time playback or technical field review occurred.

`P0N0.json` is the graph actually submitted, prompt id `05ae5e31-2dd8-4813-8aa8-c489ece93d78`. `P0N1-prepared.json`, `P1N0-prepared.json`, `P1N1-prepared.json` are planned only, never executed. `run.py` prepares exactly these inputs and sequentially submits all four on a fresh safe run; its `tempfile.mkdtemp` gives a new temporary base. It hard-codes the observed GNOME baseline PID 94107, so before reuse independently establish the current desktop baseline, verify the port is free and adapt the allowlist if necessary. Do not resume the interrupted process or assume GPU remains safe. Safety watcher remains active through local output preparation while server runs.

## Exact model text and Korean translation

English prompts are exact in the saved graphs and run.py; the Korean below is translation and was not model input.

**P0:** 같은 야외 콘크리트 포장 블록을 고정 카메라로 바라본다. 중앙 부근의 블록 하나가 천천히 조금 내려앉는다. 주변 포장은 움직이지 않는다.

**P1:** 같은 야외 콘크리트 포장 블록을 고정 카메라로 바라본다. 처음에는 중앙 부근의 표시가 있는 블록이 이웃 블록 옆에 있다. 천천히 동일한 표면 표시를 가진 동일한 블록이 이웃에 비해 조금 내려간 뒤, 이웃보다 약간 낮은 곳에서 멈춘다. 콘크리트는 단단하게 유지되고 윤곽과 표면 표시를 알아볼 수 있으며 블록과 이웃 사이에는 평범한 좁은 줄눈이 남는다. 주변 포장은 움직이지 않는다.

**N0:** 카메라 이동, 팬, 줌, 깜빡임, 사람, 글자, 로고, 만화, 장난감, CGI.

**N1:** 카메라 이동, 팬, 줌, 깜빡임, 사람, 글자, 로고, 만화, 장난감, CGI, 새로 생기는 판, 위로 들린 해치, 넓은 구덩이, 탄성 콘크리트, 곡선이거나 휘어진 포장 블록.

Negative prompts do not forbid ordinary narrow joints or a small height step. The marked central paver is a linguistic target, not a guaranteed unique mark in the source or a control mask; whether the model picks and preserves an identifiable one is untested. This is an intended wording ablation, not a validated physical representation. No measurements or mechanism are claimed.

## Provenance and terms

Original synthetic `reference-5.png` retained here, SHA-256 `fd92f161206e74619e1fa95330fc6d68af1ea8d99e95bebd8712e226dd73c793`, generated previously with RealVisXL V5.0 by **SG_161222**, whose attribution and commercial-use terms are documented in `docs/paver-hybrid-provenance-2026-10-28.md`; no Qwen edit. Wan2.2 I2V A14B [original card](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B) and [Comfy-Org repack pinned revision](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/tree/ee6f4a40737a995bf5818954cfce6d59443b0f04) state Apache-2.0, subject to its notice and other terms; no legal clearance or output-rights guarantee. Previously provider-LFS verified files rehashed this run: high expert `6122e79d55e0f235698d11d657f3b196c5273c830da00b2b013c5a048d5e6a42`, low expert `5471a457b6ac404202a5fbe6c11595a3d5641fc766b00f38763f72303fffc21e`, text encoder `c3355d30191f1f066b26d93fba017ae9809dce6c627dda5f6a66eaa651204f68`, VAE `2fc39d31359a4b0a64f55876d8ff7fa8d780956ae2cb13463b0223e15148976b`. Encoder/VAE are the previously verified Wan 2.1 Apache-2.0 files. No external inference or new model downloads were used.
