# Tech Stack

## 프레임워크 및 라이브러리

### Frontend Framework
- **Next.js 15.5.3** (App Router)
  - React 19 기반
  - Server Components 기본 사용
  - Route Groups: `(public)`, `(dashboard)`
  - 자동 코드 스플리팅
  - 이미지 최적화 (next/image)

### 스타일링
- **Tailwind CSS 3.4**
  - Utility-first CSS 프레임워크
  - 커스텀 색상 시스템
  - 반응형 디자인 (mobile-first)
  - 다크 모드 지원

- **shadcn/ui** ⚠️ **새 프로젝트 시작 시 설치 필수**
  - Admin 패널 표준 UI 컴포넌트
  - 재사용 가능한 컴포넌트 라이브러리
  - Radix UI 기반
  - Tailwind CSS 통합
  - **Phase 0에서 설치**: `npx shadcn@latest init`
  - **참고**: 현재 템플릿은 순수 Tailwind CSS로 작성되어 있으나, 새 프로젝트 시작 시 shadcn/ui 설치 후 점진적으로 교체 권장

### 언어
- **TypeScript 5**
  - Strict mode 활성화
  - 타입 안정성
  - IntelliSense 지원

---

## 백엔드 & 인프라

### Firebase (BaaS)
- **Firestore Database**
  - NoSQL 실시간 데이터베이스
  - 자동 확장
  - 오프라인 지원
  - 컬렉션: contacts, settings

- **Firebase Authentication**
  - 이메일/비밀번호 인증
  - Admin 전용 로그인
  - 세션 관리

- **Firebase Storage**
  - 파일 업로드 (이미지, 문서)
  - CDN 자동 배포
  - 보안 규칙

- **Firebase Hosting**
  - 무료 SSL 인증서
  - 글로벌 CDN
  - 자동 배포
  - 커스텀 도메인 지원

---

## 개발 도구

### 패키지 매니저
- **npm** (Node.js 20+)
  - 의존성 관리
  - 스크립트 실행

### 코드 품질
- **ESLint**
  - Next.js 기본 규칙
  - TypeScript 린팅
  - 커스텀 규칙 가능

### 버전 관리
- **Git**
  - 소스 코드 관리
  - 브랜치 전략

### IDE
- **VS Code** 권장
  - TypeScript 지원
  - Tailwind CSS IntelliSense
  - ESLint 통합

---

## 테스트 (추가 예정)

### 단위 테스트
- **Vitest**
  - 빠른 테스트 실행
  - Jest 호환 API
  - TypeScript 지원

### E2E 테스트
- **Playwright**
  - 크로스 브라우저 테스트
  - 자동화된 UI 테스트
  - 스크린샷/비디오 캡처

---

## 외부 서비스 통합

### MCP (Model Context Protocol)
- **Figma MCP**
  - Figma 디자인 → Next.js 컴포넌트 자동 생성
  - Home 페이지 개발 자동화

### 마케팅 스크립트
- **Google Analytics 4**
  - 사용자 행동 분석
  - 페이지뷰 추적

- **Meta Pixel**
  - Facebook/Instagram 광고 추적
  - 전환 이벤트

- **Naver Analytics**
  - 한국형 웹 분석

---

## 배포 전략

### 개발 환경
```bash
npm run dev  # localhost:5566
```

### 프로덕션 빌드
```bash
npm run build    # Next.js 빌드
npm run start    # 로컬에서 프로덕션 테스트
```

### Firebase 배포
```bash
firebase deploy  # Hosting + Firestore Rules + Storage Rules
```

### 환경 변수
- `.env.local`: 로컬 개발
- Firebase Console: 프로덕션 환경변수

---

## 성능 목표

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse 점수
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 번들 크기
- Initial JS: < 200KB (gzip)
- Total JS: < 500KB (gzip)

---

## 브라우저 지원

### 데스크톱
- Chrome (최신 2버전)
- Firefox (최신 2버전)
- Safari (최신 2버전)
- Edge (최신 2버전)

### 모바일
- iOS Safari (최신 2버전)
- Chrome Android (최신 2버전)
- Samsung Internet (최신 버전)

---

## 보안

### 인증 & 권한
- Firebase Authentication
- Admin 전용 라우트 보호
- Firestore Security Rules

### 데이터 보호
- HTTPS 강제 (Firebase Hosting)
- 환경 변수로 민감 정보 관리
- XSS 방지 (React 기본)
- CSRF 방지

---

## 의존성 버전 (package.json)

### 프로덕션 의존성
```json
{
  "next": "15.5.3",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "firebase": "^11.2.0",
  "tailwindcss": "^3.4.0"
}
```

### 개발 의존성
```json
{
  "typescript": "^5",
  "eslint": "^9",
  "@types/node": "^20",
  "@types/react": "^19"
}
```

---

## 다음 단계

- [디렉토리 구조](./architecture/directory-structure.md)
- [새 프로젝트 시작](./workflows/new-project-setup.md)
- [Admin 표준 기능](./admin/standard-features.md)
