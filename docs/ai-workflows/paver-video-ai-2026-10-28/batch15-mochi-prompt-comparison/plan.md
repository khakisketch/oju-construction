# Preregistered Mochi prompt comparison

Surface-only diagnostic; never full surface-plus-subsurface explanation, real footage, simulated physics, field evidence, cause or diagnosis. Exactly two text-to-video outputs, same model/seed/scene prefix/sampler and only action text changes; output file prefix changes solely to avoid collisions. No reference image or guidance, so identical seeds do not guarantee same initial composition, and Mochi numeric seeds cannot be matched to Wan's noise. One seed and two prompts cannot establish general superiority. The text encoder has an empty negative, with no extra controls.

Scene (identical prefix): `A stationary tripod looks diagonally down at an ordinary outdoor pedestrian walkway of small, weathered gray rectangular concrete pavers in staggered rows. Soft overcast daylight, realistic full-size materials, no people or tools, a single fixed camera shot. `

M0 action: `A small group of pavers in the middle slowly settles a little, then stops.`

M1 action: `At first a small group of existing pavers near the middle is approximately level with its neighbors. The same recognizable pavers, retaining their surface marks and straight edges, slowly move a little lower than the stationary neighboring tops, then stop. The surrounding pavers remain still.`

Hypothesis: M1's visible relational change and identity may better describe movement than M0 without the earlier contradiction of staying flush throughout; it may instead make new raised blocks, morphs, holes or no movement. Initial scene may differ despite same seed: compare movement and observable identity within each clip rather than assume matched geometry. Gate: recognizable existing blocks descend relative to fixed neighbors through a coherent sustained motion; same surface marks and rigid straight outlines; no new/floating/raised block, exaggerated hole, changing texture or unstable camera. No claimed causal mechanism. Any surface-only result cannot pass original full explanation, and even a good surface result is not accepted without real human real-time playback and technical context.

한국어: 동일한 실외 보도·사선 고정 카메라 설정에서 M0은 작은 블록 무리가 천천히 내려앉고 멈춘다고만 지시한다. M1은 처음 이웃과 대략 같은 높이인 기존 블록들이 같은 표면 표시와 곧은 가장자리를 유지하면서 고정된 이웃보다 조금 낮아진 후 멈춘다고 명시한다. 목표는 새 판이나 과장된 구멍이 아닌 기존 블록의 읽을 수 있는 변화다. 실제 현장이나 하부 원인을 보여주는 영상은 아니다.

Mochi 1 Preview FP8; batch7 baseline 848×480, 49 frames, seed 2026102937, 30 steps, CFG 4.5, Euler/simple, denoise 1, empty negative, 24 fps. No guidance/control and no additional inference attempts. Apache-2.0 model and encoder with Genmo NOTICE and Google T5 attribution; commercial use subject to terms, not legal clearance.
