# 보도블럭 단면 · AI 재질 시험 기록

## 목적과 한계

별도 B안의 보도블럭 설명 장면을 개선하는 디자인 시험이다. 실제 현장 사진이나
현장 스캔, 검증된 유체·지반 해석이 아니다. 침하, 관로 틈, 빈 공간, 물과 입자의
움직임은 설명을 위해 단순화·과장한 조건부 예시다. 실제 구조·원인·보수 방법은
현장 조사와 기술자의 검토가 필요하다.

공식 `/`, `/renewal-b`와 이전 시안은 변경하지 않는다. 완성된 별도 시안도 공식
배포물이 아니며 온라인 문의는 전송되지 않는다. 실제 문의는 043-265-6010이다.

## 모델과 사용 조건 (2026-10-28 확인)

- **완성 장면의 질감:** [RealVisXL V5.0](https://huggingface.co/SG161222/RealVisXL_V5.0),
  모델 카드의 `openrail++` 표시. 사용하는 체크포인트의 SHA-256은
  `6a35a7855770ae9820a3c931d4964c3817b6d9e3c6f9c4dabb5b3a94e5643b80`으로 해당 공식
  모델 파일의 게시값과 일치했다. 모델 카드가 연결한 제작자 [Civitai 모델 페이지](https://civitai.com/models/139562?modelVersionId=789646)의
  [API](https://civitai.com/api/v1/models/139562)에서도 동일한 SHA-256의 V5.0 파일과
  제작자 `SG_161222`, 기본 모델 SDXL 1.0을 확인했다. API는 상업적 이미지 이용을
  허용(`allowCommercialUse`에 `Image`)하고 무표기는 허용하지 않는 설정
  (`allowNoCredit: false`)을 나타낸다. 따라서 시안 푸터에 제작자와 모델을 명시했다.
  기본 모델의 [CreativeML Open RAIL++-M 원문](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/blob/main/LICENSE.md)은
  사용 제한 준수를 조건으로 상업적 사용을 일률적으로 금지하지 않으며 출력의 사용에
  대한 책임은 사용자에게 있다. RealVisXL 저장소에서는 `openrail++` 표기는 확인되지만
  독립된 전문 라이선스 파일은 확인되지 않았다. 공개 전 현행 조건과 권리 관계를 재확인한다.
- **VAE:** [Stability AI SDXL VAE](https://huggingface.co/stabilityai/sdxl-vae), 카드의 MIT
  표시. `sdxl_vae.safetensors`의 SHA-256
  `63aeecb90ff7bc1c115395962d3e803571385b61938377bc7089b36e81e92e2e`가 게시값과 일치했다.
- **기각한 영상 실험:** [Wan2.1 VACE 1.3B](https://huggingface.co/Wan-AI/Wan2.1-VACE-1.3B),
  모델 카드와 제공자 저장소가 Apache-2.0을 명시. ComfyUI용 재포장 모델과 UMT5
  텍스트 인코더·VAE의 출처는 [Comfy-Org/Wan-2.1](https://huggingface.co/Comfy-Org/Wan-2.1/tree/123acf1cc74bccbb9bfff8ac1ee72edc08c2341d)이다.
  세 파일의 SHA-256은 각각 `640ccc0577e6a5d4bb15cd91b11b699ef914fc55f126c5a1c544e152130784f2`,
  `c3355d30191f1f066b26d93fba017ae9809dce6c627dda5f6a66eaa651204f68`,
  `2fc39d31359a4b0a64f55876d8ff7fa8d780956ae2cb13463b0223e15148976b`이며 게시값과 일치했다.
  [VACE 14B](https://huggingface.co/Wan-AI/Wan2.1-VACE-14B) 모델 카드도 Apache-2.0을 명시한다.
  같은 Comfy-Org 저장소의 14B 재포장 파일 SHA-256은
  `f202a5c59b8a91ada1862c46a038214f1f7f216c61ec8350d25f69b919da4307`으로 게시값과 일치했다.
- **LTX-2.5는 사용하지 않았다.** [공식 라이선스](https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x)는
  일정 매출 이상 법인의 상업적 사용에 별도 유료 계약을 요구한다. 해당 조건을
  확인하지 못했으므로 이 시안에 사용하지 않았다.

모델 라이선스 확인은 해당 결과물의 무침해, 실제 현장 자료의 권리, 전체 사이트의
법률 준수 또는 기술적 정확성을 보증하지 않는다. 이전 B안에서 물려받은 사진·로고·
AI 예시도 각각의 출처와 사용 권한을 공개 전 별도로 확인해야 한다. 이는 법률 자문이 아니다.

## 실제 수행한 시험

1. `docs/paver-story-wan-guide-2026-10-28.py`로 원래 여섯 개의 큰 블럭 대신 작은
   블럭과 인접한 하부·관로의 움직임을 담은 Blender 안내 프레임을 렌더했다.
2. 별도 로컬 ComfyUI 0.42.0에서 `docs/ai-workflows/paver-wan-vace-still-test-2026-10-28.json`을
   실행했다. 기준 정지 프레임을 17프레임 영상으로 만든 뒤 Canny 가이드와 참고
   이미지로 넣었다. 832×480, 20 steps, seed 20261028. 외부 생성 API는 사용하지 않았다.
   결과는 관로 아래에 없던 구조물을 만들고 지층을 바꿔 **채택하지 않았다**.
   기각 예시: `docs/images/paver-hybrid/wan-vace-rejected-20261028.png`.
3. 같은 정지 가이드와 파라미터로 `docs/ai-workflows/paver-wan-vace-14b-test-2026-10-28.json`을
   실행했다. 구조를 거의 그대로 보존했지만 이번 시험에서는 시각적 개선이 뚜렷하지
   않아 완성 영상에 채택하지 않았다. 비교 프레임:
   `docs/images/paver-hybrid/wan-vace-14b-comparison-20261028.png`. 이는 정지 가이드에
   대한 단일 시험 결과이며 움직이는 가이드에서의 성능 평가는 아니다.
4. `docs/ai-workflows/paver-materials-realvis-2026-10-28.json`으로 콘크리트·골재·흙·
   모래 이미지를 각각 1024×1024로 생성했다. 30 steps, CFG 5.5, DPM++ 2M/Karras,
   seed 2026102801–2026102804. 콘크리트 결과의 원하지 않은 줄눈을 피하기 위해
   200×200 영역 `(430,520)`을 잘라 512×512로 확대했고, 나머지는 512×512로 축소했다.
   사용 파일은 `docs/images/paver-hybrid/{concrete,aggregate,soil,sand}.png`다.
5. `docs/paver-story-hybrid-scene-2026-10-28.py`가 위 질감을 입힌 장면을 렌더한다.
   블럭·모래·기층의 움직임은 Blender에서 제어하며, 물은 물리 시뮬레이션이 아니라
   작은 입자와 물 고임을 이용한 모식이다. AI가 만든 영상 전체를 그대로 사용하지 않았다.

전체 원본 생성 결과는 이 작업의 임시 로컬 ComfyUI 출력에 있었다. 저장한 워크플로,
시드, 사용 질감 이미지와 Blender 소스로 제작 과정을 추적할 수 있지만 하드웨어와
소프트웨어 차이에 따른 생성 결과의 픽셀 동일성은 보장하지 않는다.

## 최종 산출물 및 검증 (2026-10-28)

- 별도 시안: `docs/renewal-b-paver-hybrid-proposal-2026-10-28.html`.
  무음 사전 렌더 영상 `docs/paver-hybrid-settlement-2026-10-28.mp4`는 960×540,
  24fps, 61프레임이다. 대표 화면은 `docs/paver-hybrid-poster-2026-10-28.jpg`다.
  회전 가능한 실시간 3D, 실제 현장 스캔 또는 유체·지반 시뮬레이션이 아니다.
- Chrome 155 및 Firefox 150.0.2에서 1440×900과 390×844 모의 화면의 스크롤 정·역방향,
  설명·영상 배치, 실패·지연·15초 중단·디코딩 오류, 짧은 화면 및 무스크립트
  정지 화면을 확인했다. 페이지 복원은 실제 bfcache가 아니라 이벤트를 **모의**했다.
- Linux Playwright WebKit 26.4에서 영상 디코더 초기화가 간헐적으로 오류 4를 반환했다.
  같은 바이트를 연속 버퍼로 복사하고 처음 오류에는 짧은 간격으로 최대 두 번
  재시도하도록 보완했다. 최종 전체 회귀와 한두 번의 **모의** 초기 오류에서 복구,
  세 번의 모의 오류에서 정지 화면 전환을 확인했다. 이전 한 번 재시도 버전에서는
  실제 재시도도 실패한 사례가 있어 근본 원인과 모든 환경에서의 재생은 미확인이다.
  재시도가 실패하거나 15초 이상 다운로드가 정지하면 전체 설명과 정지 화면을 제공한다.
  macOS/iOS Safari와 실제 휴대전화에서는 시험하지 않았다.
- Chrome 자동 접근성 검사에서는 위반이 없었지만 12개 대비 항목과 무음 영상 자막
  1개 항목은 자동 판정이 미완료였다. 키보드 비교 막대와 움직임 줄이기 모드를
  확인했으며, 실제 스크린리더와 고객 사용성 시험은 하지 않았다.
- 기존 10021번 Tailscale **tailnet 전용** 임시 공유에 새 이름으로 추가했다. 공식 배포가
  아니며 기존 파일·서비스 설정은 보존했다. HTTPS의 시안·영상·포스터 해시와 로컬
  원본이 일치했고, Chrome 모의 모바일에서 스크롤 및 문의 미전송 안내를 확인했다.
  공유 링크는 임시 경로가 유지되는 동안 같은 tailnet에서만 접근할 수 있다.

실제 현장 사진·도면 및 기술자의 구조·원인·공법 검수, B안의 기존 사진·로고·AI
이미지 전체의 권리 검토는 남아 있다. 이 기록은 법률 자문이나 현장 진단이 아니다.
