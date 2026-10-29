# Blender 제작 기록 (실제 수행) · 2026-10-28

실행 파일: `/tmp/opencode/oju-blender-arm64/root/usr/bin/blender` (제공 래퍼, 수정 없음).
작업 디렉터리: `/tmp/opencode/paver-fix/` — `scene.py`가 유일한 생성 소스(수정판; 초판은 `/tmp/opencode/paver-blender/`에 보존, 참조용).
**재현용 소스는 프로젝트 안에 보존됨: `docs/paver-story-scene-2026-10-28.py`.** 위 작업본과 렌더 구성은 같고 사용법 주석만 정리했습니다.
산출물(아래 `docs/`에 배치): `paver-story-settlement-2026-10-28.mp4` (194KB, H.264 yuv420p 960×540 61프레임 2.54초, 무음, faststart),
`paver-story-poster-2026-10-28.jpg` (프레임 46 = 침하+고임 대표 장면, 115KB).

## 렌더 스펙 (실측)

- Blender 4.0.2, 백그라운드, Cycles CPU, 샘플 64, 960×540, 61프레임(0–60, 24fps ≈ 2.54초).
- `scene.cycles.use_denoising=False` + `view_layer.cycles.use_denoising=False` (OIDN 없음).
- 재질 전부 Procedural(Principled + Noise/Voronoi 계열 Bump, Wave 기반 비·흐름) + 전면 배치 자갈 90개.
  외부 이미지·폰트·HDR 없음. 한글 자막은 렌더에 없음(HTML 오버레이).
- 인코딩: ffmpeg 6.1.1 H.264(yuv420p, CRF 23, +faststart), 무음.

## 장면 대응 (고정 카메라, 정면 약간 상부)

- 좌표: x −5.2…5.2, 지반 z 0–2 / 기층 2–2.8 / 모래 2.8–3.1 / 블럭 6장 z 3.1–3.65.
- 관로: Y축 원통(중심 x 3.2, z 1.0, r 0.55, 화면 안에 전부) + 전면 링 2개(115°–155° 틈) + 틈 주황 림 + 내부 암색 디스크.
  표면 배수구 기둥은 그리지 않음 — 연결되지 않은 구조물을 암시하지 않기 위해, 조건부 예시는 매설된 손상 관로 하나로만 표현.
- 프레임 맵: 비 0–24 / 유출·스밈 0–40 / 세립분 흐름·입자 8–36 / 공동 14–52(후반 약간 축소, 가장자리 낙반석 8개)
  / 침하 28–42(최대 −0.42) / 고임 34–48 / A·B·C 구역 51–60.
- 함정 기록: `primitive_circle_add`에는 `fill` 인자가 없어(4.0) 초기에 면 없는 엣지만 생겨
  고임이 렌더에 안 보였음. 얇은 capped cylinder로 교체해 해결.

## 재생 방식 (Range 미지원 서버 대응 포함)

- 영상은 JS가 같은 경로에서 `fetch`로 받아 Blob object URL로 `<video>`에 연결합니다(외부 요청 없음).
  바이트 상한 25MB, 15초 타임아웃, 중단 시 타임아웃·실패 폴백, 토큰 기반 경쟁 방지, pagehide 시 중단·URL 해제,
  bfcache 복귀(pageshow persisted) 시 재로딩합니다.
- 영상이 준비되기 전에는 자막·칩·탐색 모두 1단계에 고정됩니다. 첫 프레임과 다른 자막이 짝지어지지 않습니다.
- 실패(404·중단·디코딩 실패·시간초과) 시: 영상·칩·진행바 대신 대표 정지 화면과 실패 안내를 표시하고,
  단계 버튼과 긴 고정 스크롤은 해제해 전체 글·그림을 바로 읽을 수 있습니다. no-JS에서는 정적 SVG 1개와 전체 목록으로 봅니다.
- 재현: Blender 4.0.2 백그라운드에서 보존된 `docs/paver-story-scene-2026-10-28.py`를 실행하면
  `PAVER_OUT_DIR` 아래 `frames/frame_####.png` 61장이 나오고, ffmpeg 인코딩과 프레임 46 JPG 추출로 같은 구성의 산출물을 만듭니다.
  렌더는 같은 이름의 프레임을 덮어쓸 수 있으므로 반드시 새로운 빈 출력 디렉터리를 지정합니다.
  HTML은 이 `.py`에 의존하지 않습니다(문서 전용).
- 동일성: 2026-10-28에 보존본으로 프레임 46을 별도 경로에 재렌더하여 출하 프레임과 비교 — 픽셀 동일(평균·최대 차이 0). 이후 사용법 주석만 수정했습니다.
  PNG 컨테이너 바이트는 다를 수 있습니다. 출하 영상 자체는 덮어쓰지 않았습니다.
- 검증 상태(2026-10-28): Range 미지원 서버의 Chrome 155에서 정·역방향 탐색 6/6 통과(1440×900·390×844).
  Firefox 1522·Linux WebKit 2287 모의 화면에서도 정·역방향 탐색, 390px 문서폭, 비교 막대 키보드를 확인했습니다.
  1440×900/768, 320/390px과 짧은 가로 화면 568×320·844×390의 화면을 확인했습니다.
  404·손상 영상 폴백, JavaScript 비활성·움직임 줄이기, 비활성 문의와 전화 안내를 확인했습니다.
  Chrome에서 영상 응답을 지연해 스크롤한 뒤 도착하는 경우와 15초 응답 정지, 준비된 뒤의 **모의** 디코딩 오류를 시험했습니다.
  실제 bfcache 복원은 관측하지 못했으며 복원 이벤트를 **모의**하여 로딩 상태와 재동기화를 확인했습니다.
  자동 접근성 검사에서는 위반이 발견되지 않았지만 대비·일부 ARIA·영상 자막은 자동 판정이 미완료입니다.
  실제 휴대전화·스크린리더·고객 사용성 시험, 현장 기술 검수와 AI 이미지의 상업적 사용 조건 확인은 남아 있습니다.
- Impeccable 기계 검사에서는 전체 폭 배경 구역의 바깥 래퍼와 기존 B안의 일부 경계·11px 보조 텍스트에 경고가 나왔습니다.
  전체 폭 배경은 내부 `.wrap`이 좌우 여백을 제공하며, 새 장면의 모바일 범례와 단계 표기는 검사 후 12px로 조정했습니다.
  기존 B안의 작은 배지 등은 보존했으므로 실제 기기 가독성 확인이 필요하며, 기계 검사만으로 디자인 수용을 뜻하지 않습니다.
- 한계: 물리 시뮬레이션이 아니라 이해를 돕는 모식이며, 특정 현장 진단이 아닙니다. 기술적 타당성 검토는 별도 필요합니다.

예를 들어 Blender와 ffmpeg가 설치된 Linux 환경에서 프로젝트 루트에서 실행할 수 있습니다.
`/tmp/opencode`가 없는 환경에서는 임시 디렉터리 경로를 환경에 맞게 바꿉니다.

```sh
export PAVER_OUT_DIR="$(mktemp -d -p /tmp/opencode paver-repro-XXXXXXXX)"
blender -b --factory-startup -P docs/paver-story-scene-2026-10-28.py
ffmpeg -n -framerate 24 -i "$PAVER_OUT_DIR/frames/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart "$PAVER_OUT_DIR/paver-story-settlement.mp4"
ffmpeg -n -i "$PAVER_OUT_DIR/frames/frame_0046.png" -q:v 3 "$PAVER_OUT_DIR/paver-story-poster.jpg"
```

- Blender가 애니메이션 전부 담당: 비·유출·스밈·입자·공동·침하·고임·A/B/C 구역.
- 브라우저 오버레이: 짧은 한글 칩 7개(단계·A/B/C별 표시/숨김; 작은 화면에선 숨김), 2줄 자막, 진행바, 단계 버튼 5개와 범례. 작은 화면의 마지막 장면에는 A/B/C 색 범례를 그림 밖에 표시합니다.
- 스크롤이 Blob 영상의 `video.currentTime`을 앞뒤로 직접 설정(일시정지 상태 탐색). 자동재생 없음.

## 브라우저 회귀 확인

프로젝트 루트에서 Range 요청에 200을 반환하는 서버(예: `python3 -m http.server 5577 --bind 127.0.0.1`)를 띄운 뒤,
별도로 설치된 `playwright-cli`의 Chrome 세션에서 다음 파일을 실행합니다. 프로젝트 의존성은 추가하지 않았습니다.

```sh
playwright-cli -s=paver-regression open about:blank
playwright-cli --raw -s=paver-regression run-code --filename=docs/paver-story-browser-regression-2026-10-28.js
```

스크립트는 새 브라우저 컨텍스트에서 정·역방향 탐색, 404·지연·응답 정지, 준비 후 모의 오류,
모의 bfcache 이벤트, 짧은 가로 화면과 휴대전화 크기의 색 범례를 확인합니다. 실제 기기 검증을 대체하지 않습니다.
