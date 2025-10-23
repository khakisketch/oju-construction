# Project Overview

## 프로젝트 정의

**외주 프로젝트 템플릿**은 한국 중소기업 웹사이트 + Admin 패널을 빠르게 개발하기 위한 템플릿입니다.

## 핵심 목표

1. **빠른 개발**: 새 프로젝트 시작 → 배포까지 1-2일
2. **LLM 친화적**: Claude Code가 문서만 보고 개발 가능
3. **재사용성**: Home은 커스텀, Admin은 표준화하여 재사용
4. **자동화**: 초기화, 배포, 테스트 모두 자동화

## 프로젝트 구성

### Home 영역 (고객별 커스텀)
- **목적**: 고객사별 브랜딩 및 비즈니스 특성 반영
- **개발 방식**: Figma MCP → 자동 생성 또는 커스텀 개발
- **위치**: `src/features/home/`
- **특징**:
  - 디자인, 색상, 레이아웃 모두 다름
  - 섹션 구성 자유롭게 변경 가능
  - 반응형, 애니메이션, SEO 최적화

### Admin 영역 (표준화, 재사용)
- **목적**: 모든 프로젝트에서 동일한 Admin 기능 제공
- **개발 방식**: 표준 컴포넌트 복사 사용
- **위치**: `src/features/admin/`
- **특징**:
  - shadcn/ui 기반 일관된 UI
  - 표준 기능: Contacts, Settings, Marketing Scripts
  - 거의 수정 없이 재사용

## 기술 스택

- **프레임워크**: Next.js 15.5.3 (App Router)
- **언어**: TypeScript 5
- **스타일**: Tailwind CSS 3.4, shadcn/ui
- **백엔드**: Firebase (Firestore, Storage, Auth)
- **배포**: Firebase Hosting
- **테스트**: Vitest + Playwright

## 외주 워크플로우

```
1. 템플릿 복제
   ↓
2. npm run init (프로젝트 초기화)
   ↓
3. Figma MCP → Home 페이지 자동 생성
   ↓
4. Admin 표준 기능 활성화
   ↓
5. npm run deploy (Firebase 자동 배포)
   ↓
6. 고객 검토 및 피드백
   ↓
7. 미세 조정
   ↓
8. 최종 배포 및 인도
```

## 디렉토리 구조 (개요)

```
project-root/
├── build-project/          # 📚 개발 자동화 문서
├── src/
│   ├── app/               # Next.js 라우팅
│   │   ├── (public)/      # Home 영역
│   │   └── (dashboard)/   # Admin 영역
│   │
│   ├── features/          # 비즈니스 기능
│   │   ├── home/          # Home 관련 (교체 용이)
│   │   └── admin/         # Admin 관련 (표준)
│   │
│   └── shared/            # 공통 코드
│       ├── components/ui/ # shadcn/ui
│       ├── hooks/
│       ├── lib/
│       └── utils/
│
└── scripts/               # 자동화 스크립트
    ├── init-project.js
    └── deploy-firebase.js
```

## 개발 원칙

### 1. 명확한 책임 분리
- Home: 커스텀 (고객별 다름)
- Admin: 표준 (모두 동일)
- Shared: 공통 (모든 곳에서 사용)

### 2. LLM 친화적 구조
- 예측 가능한 파일 위치
- 일관된 네이밍 규칙
- 상세한 문서화

### 3. 자동화 우선
- 수동 작업 최소화
- 스크립트로 반복 제거
- 테스트 자동화

## Claude Code 사용 가이드

### 프로젝트 이해하기
```
"build-project/00-PROJECT-OVERVIEW.md 읽고,
 이 프로젝트의 목적과 구조 설명해줘"
```

### 새 기능 추가하기
```
"build-project/templates/feature-template.md 참고해서
 features/blog/ 기능 추가해줘"
```

### 배포하기
```
"build-project/workflows/deployment.md 따라서
 Firebase에 배포해줘"
```

## 다음 단계

1. [기술 스택 상세](./01-TECH-STACK.md)
2. [아키텍처 설명](./architecture/directory-structure.md)
3. [새 프로젝트 시작](./workflows/new-project-setup.md)
