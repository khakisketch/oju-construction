# 🎨 Oju Construction 추가 이미지 생성 가이드

이미 프로젝트 폴더에 존재하는 이미지는 제외하고, **새로 생성하여 추가해야 할 이미지 리스트**입니다.
아래 가이드에 따라 이미지를 생성한 후, 지정된 경로에 저장해 주세요.

---

## 📁 1. 건설 페이지 (`public/images/construction/`)

| 파일명 | 용도 | 추천 프롬프트 (Midjourney/DALL-E) |
| :--- | :--- | :--- |
| `hero-main.jpg` | 메인 배경 | Cinematic wide shot of a major civil engineering construction site at golden hour, massive scale, professional atmosphere, high-tech machinery, dust particles in light rays, 8k resolution, photorealistic, dramatic lighting --ar 16:9 |

> *참고: `civil.jpg`, `paving.jpg`, `landscape.jpg`, `landscape-architecture.jpg`, `maintenance.jpg`, `waterproofing.png`는 이미 존재합니다.*

---

## 📁 2. 드론 페이지 (`public/images/drone/`)

| 파일명 | 용도 | 추천 프롬프트 |
| :--- | :--- | :--- |
| `hero-main.jpg` | 메인 배경 | Futuristic drone flying over a modern city skyline at sunset, capturing aerial data, digital overlay of topographic lines, high-tech surveillance concept, cinematic lighting, 8k --ar 16:9 |
| `equipment-phantom.jpg` | 장비 (측량용) | DJI Phantom 4 RTK drone hovering in mid-air, white background, clean product shot, high detail, professional camera gear --ar 4:3 |
| `equipment-mavic.jpg` | 장비 (점검용) | DJI Mavic 3 Enterprise drone, sleek design, folded arms partially visible, studio lighting, tech product photography --ar 4:3 |
| `equipment-inspire.jpg` | 장비 (촬영용) | DJI Inspire 3 drone in flight mode, aggressive and professional look, cinematic camera gimbal visible, motion blur background of sky --ar 4:3 |
| `portfolio-1.jpg` | 포트폴리오 (도시) | Breathtaking aerial drone shot of a busy intersection in Seoul at night, long exposure light trails of cars, cyberpunk vibe, high angle, sharp details --ar 4:3 |
| `portfolio-2.jpg` | 포트폴리오 (농지) | Aerial top-down view of organized green rice fields and farmlands, geometric patterns, morning mist, peaceful rural atmosphere, high resolution --ar 4:3 |
| `portfolio-3.jpg` | 포트폴리오 (건설) | Aerial view of a large construction site in progress, cranes, foundation work, grid layout visible, industrial scale, daytime --ar 4:3 |

---

## 📁 3. 소프트웨어 페이지 (`public/images/software/`)

| 파일명 | 용도 | 추천 프롬프트 |
| :--- | :--- | :--- |
| `web-dev.jpg` | 웹 개발 | Close-up of a modern computer monitor displaying clean HTML/CSS code and a sleek website interface design, developer hands typing on mechanical keyboard, bokeh background of office, soft lighting --ar 4:3 |
| `app-dev.jpg` | 앱 개발 | Smartphone floating in air displaying a modern UI/UX app interface, colorful icons, 3D glass elements, abstract mobile technology background, premium look --ar 4:3 |
| `custom-dev.jpg` | 맞춤 개발 | Futuristic dashboard interface on a large screen, data analytics charts, graphs, ERP system layout, corporate business technology, professional and clean --ar 4:3 |

> *참고: `hero-main.jpg`는 이미 존재합니다.*

---

## 📁 4. 회사소개 & 공통 (`public/images/about/`)

| 파일명 | 용도 | 추천 프롬프트 |
| :--- | :--- | :--- |
| `company-building.jpg` | 회사 전경 | Modern corporate office building exterior, glass facade reflecting the sky, green landscaping around, clean architectural design, successful business image --ar 16:9 |
| `team-meeting.jpg` | 팀워크 이미지 | Diverse group of professionals having a meeting in a modern conference room, discussing blueprints and digital screens, collaborative atmosphere, bright and energetic --ar 16:9 |

> *참고: `ceo.jpg`, `company.jpg`(소개이미지)는 이미 존재합니다.*

---

## 📁 5. 필수 시스템 이미지 (`public/`)

| 파일명 | 용도 | 권장 사양 |
| :--- | :--- | :--- |
| `favicon.ico` | 브라우저 탭 아이콘 | 32x32 또는 16x16 .ico 파일 |
| `apple-touch-icon.png` | iOS 홈 화면 아이콘 | 180x180 PNG, 투명 배경 없음 |
| `og-image.png` | 소셜 미디어 공유 이미지 | 1200x630 PNG, 회사 로고 + 슬로건 포함 |

> *현재 `icon.svg`와 `ojuconstruction-logo.png`가 임시 대체 중입니다.*

---

## 📁 6. PWA 아이콘 (`public/images/icons/`) - 선택사항

최적의 PWA 경험을 위해 다양한 크기의 아이콘이 필요합니다:

| 파일명 | 용도 |
| :--- | :--- |
| `icon-72x72.png` | 저해상도 기기 |
| `icon-96x96.png` | 숏컷 아이콘 |
| `icon-128x128.png` | 중간 해상도 |
| `icon-144x144.png` | Android 홈 화면 |
| `icon-152x152.png` | iPad |
| `icon-192x192.png` | Android 표준 |
| `icon-384x384.png` | 고해상도 |
| `icon-512x512.png` | 스플래시 화면 |

> 모든 아이콘은 정사각형 PNG, 회사 로고 중앙 배치, 배경색 `#0e2f64` 권장