# 미디어 출처 및 사용 조건 · 2026-10-29

이 저장소의 AI 이미지와 영상은 디자인·연구용 예시다. 실제 오주건설 현장이나
시공 실적, 엔지니어링 검증을 의미하지 않는다. 모델의 허용 설정을 확인한 것이
개별 결과물의 권리, 초상권, 상표권 또는 법적 적합성을 보증하지는 않는다.

## AI 모델

- **RealVisXL V5.0 — SG_161222**:
  [모델](https://civitai.com/models/139562)과
  [모델 API](https://civitai.com/api/v1/models/139562)는 2026-10-29 확인 시
  상업적 이미지 사용(`Image`)을 허용하고 출처 생략(`allowNoCredit`)을 허용하지
  않았다. 사용한 체크포인트 SHA-256은
  `6a35a7855770ae9820a3c931d4964c3817b6d9e3c6f9c4dabb5b3a94e5643b80`이며
  게시된 V5.0 파일과 일치한다. 이미지·시안 사용 시 제작자를 명시한다.
- **Juggernaut XL V9 + RunDiffusionPhoto 2 — KandooAI**:
  [모델](https://civitai.com/models/133005)과
  [모델 API](https://civitai.com/api/v1/models/133005)는 확인 시 상업적 이미지
  사용(`Image`)을 허용하고 출처 생략을 허용하지 않았다. 로컬 체크포인트 SHA-256
  `c9e3e68f89b8e38689e1097d4be4573cf308de4e3fd044c64ca697bdb4aa8bca`은
  게시된 V9 파일과 일치한다. `docs/images/ai-test/`의 초기 일부 이미지가 이
  모델을 사용한다. 실제 사용·배포 전 현행 조건을 다시 확인한다.
- **ControlNet Union SDXL — xinsir**:
  [모델 카드](https://huggingface.co/xinsir/controlnet-union-sdxl-1.0)는
  Apache-2.0을 표시한다. 일부 AI 정지 이미지에 사용됐다.
- **SDXL VAE — Stability AI**: [모델 카드](https://huggingface.co/stabilityai/sdxl-vae)는
  MIT를 표시한다. 자세한 체크포인트 식별과 작업 과정은
  [하이브리드 기록](paver-hybrid-provenance-2026-10-28.md)을 참조한다.
- **Wan 및 Mochi**: 모델 공급자·버전·해시·라이선스와 클립별 판정은
  [영상 실험 기록](paver-video-ai-provenance-2026-10-28.md)에 있다. Mochi의
  `LICENSE`와 `NOTICE`도 실험 디렉터리에 포함한다. 가중치는 포함하지 않는다.

## 참고 작업 영상

홈페이지에서 쓰는 참고 영상은 Pexels의 **Tom Shamberger**와 **K** 작품이다.
정확한 작품 링크·저작자와 표시 문구는
`src/features/home/problems/fieldWorkMedia.ts`에 기록되어 있다.
[Pexels 라이선스](https://www.pexels.com/license/)는 웹사이트 사용과 수정을
허용하지만 모델·상표의 지지 암시, 스톡 플랫폼 재배포 등은 제한한다. 이 영상은
오주건설 현장이 아니다.

## 주차장 전·후 예시

`public/images/portfolio/sample-parking-{before,after,hero}.webp` 세 장은 AI
목업이라는 기록은 있으나 제작 모델의 출처 정보는 남아 있지 않다. 2026-10-29
사용자가 이 세 이미지의 공개·배포 권한을 보유한다고 확인해 현재 디자인을 유지했다.
이는 독립적인 모델·제3자 권리 검증은 아니다. 실제 오주건설 시공 사진이 아니다.

기존 저장소에 이미 있던 사진·로고와 원본이 확인되지 않은 자료 전체에 대한
권리 검토는 아직 필요하다. 출처가 확인되지 않은 공법 예시 사진 두 장은 이번 공개
인계에 포함하지 않았으며 원래 컴퓨터에서 보존한다.
