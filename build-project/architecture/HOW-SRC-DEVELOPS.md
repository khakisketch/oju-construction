# src/ 디렉토리가 개발되는 과정

## 📌 핵심 요약

LLM이 개발하면 **src/ 디렉토리는 Phase별로 점진적으로 생성**됩니다.

**최종 결과**: 약 **195개 파일** 생성

---

## 🎯 개발 단계별 src/ 생성 과정

### Phase 0: 프로젝트 초기화 (`npm run init` 후)

**파일 수**: 0개 (아직 src/ 생성 안 됨)

```
project-root/
├── build-project/              # 문서 (이미 존재)
├── public/                     # 정적 파일
├── .env.local                  # 생성됨 ✅
├── package.json                # 생성됨 ✅
├── firebase.json               # 생성됨 ✅
└── .firebaserc                 # 생성됨 ✅

src/ 디렉토리는 아직 생성 안 됨
```

---

### Phase 1: Core Infrastructure (핵심 인프라)

**파일 수**: ~10개

LLM이 생성하는 파일:

```
src/
├── app/
│   ├── layout.tsx              # ✅ Root Layout
│   ├── globals.css             # ✅ Tailwind CSS
│   └── page.tsx                # ✅ 임시 페이지 (나중에 교체)
│
├── shared/
│   ├── lib/
│   │   └── firebase/
│   │       ├── app.ts          # ✅ Firebase 초기화
│   │       └── firestore.ts    # ✅ Firestore 연결
│   └── config/
│       ├── constants.ts        # ✅ 프로젝트 상수
│       └── env.ts              # ✅ 환경변수 검증
│
└── core/
    └── providers/
        ├── AuthProvider.tsx    # ✅ 인증 Provider
        └── FirestoreProvider.tsx # ✅ Firestore Provider
```

**이 시점에서**:
- `npm run dev` 실행 가능
- Firebase 연결 완료
- 아직 UI는 없음 (빈 페이지)

---

### Phase 2: Home Page (홈 페이지)

**파일 수**: ~10개 → **~90개** (+80개)

LLM이 생성하는 파일:

```
src/
├── app/
│   ├── (public)/               # ✅ Public 라우트 그룹
│   │   ├── layout.tsx          # ✅ Header/Footer 포함
│   │   └── page.tsx            # ✅ Home 페이지
│   ├── layout.tsx
│   ├── globals.css
│   ├── robots.ts               # ✅ SEO
│   └── sitemap.ts              # ✅ SEO
│
├── features/
│   └── home/                   # ✅ Home 기능 (28개 파일)
│       ├── hero/
│       │   ├── HeroSection.tsx
│       │   ├── QuoteModal.tsx  # ⭐ 견적 모달
│       │   └── hero.data.ts
│       ├── services/
│       │   ├── ServicesSection.tsx
│       │   ├── ServiceCard.tsx
│       │   └── services.data.ts
│       ├── portfolio/
│       │   ├── PortfolioSection.tsx
│       │   └── portfolio.data.ts
│       ├── about/
│       ├── contact/
│       │   └── ContactForm.tsx # 문의 폼
│       └── cta/
│
├── shared/
│   ├── components/
│   │   ├── ui/                 # ✅ shadcn/ui (18개)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/             # ✅ Layout (3개)
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   └── common/             # ✅ 공통 (8개)
│   │       ├── Loading.tsx
│   │       └── ...
│   ├── hooks/                  # ✅ Custom Hooks (9개)
│   │   ├── useDebounce.ts
│   │   └── ...
│   └── utils/                  # ✅ 헬퍼 함수 (7개)
│       ├── format.ts
│       ├── validation.ts
│       └── ...
│
└── [기존 core/]
```

**이 시점에서**:
- Home 페이지 완전히 동작
- Hero, Services, Portfolio, About, Contact, CTA 섹션 모두 표시
- Quote Modal 동작 (Firestore에 저장)
- Contact Form 동작 (Firestore에 저장)

---

### Phase 3: Admin Panel (관리자 패널)

**파일 수**: ~90개 → **~165개** (+75개)

LLM이 생성하는 파일:

```
src/
├── app/
│   ├── admin/                  # ✅ Admin 라우트 그룹
│   │   ├── layout.tsx          # ✅ Admin Layout
│   │   ├── page.tsx            # ✅ Dashboard
│   │   ├── login/
│   │   │   └── page.tsx        # ✅ 로그인 페이지
│   │   ├── contacts/
│   │   │   └── page.tsx        # ✅ 문의 관리
│   │   ├── quotes/
│   │   │   └── page.tsx        # ✅ 견적 관리
│   │   └── settings/
│   │       └── page.tsx        # ✅ 설정 관리
│   └── [기존 app/]
│
├── features/
│   ├── admin/                  # ✅ Admin 기능 (65개 파일)
│   │   ├── dashboard/          # 5개
│   │   │   ├── components/
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── RecentContacts.tsx
│   │   │   │   └── RecentQuotes.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── services/
│   │   │       └── dashboardService.ts
│   │   │
│   │   ├── contacts/           # 15개
│   │   │   ├── components/
│   │   │   │   ├── ContactsManagement.tsx
│   │   │   │   ├── ContactTable.tsx
│   │   │   │   ├── ContactDetailModal.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   │   ├── useContacts.ts
│   │   │   │   └── useContactActions.ts
│   │   │   ├── services/
│   │   │   │   ├── contactService.ts
│   │   │   │   └── exportService.ts
│   │   │   └── types/
│   │   │       └── contact.types.ts
│   │   │
│   │   ├── quotes/             # 15개 (선택)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── settings/           # 25개
│   │   │   ├── components/
│   │   │   │   ├── GeneralSettings.tsx
│   │   │   │   ├── SEOSettings.tsx
│   │   │   │   ├── MediaSettings.tsx
│   │   │   │   ├── MarketingScriptsSettings.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   │
│   │   └── auth/               # 5개
│   │       ├── components/
│   │       ├── hooks/
│   │       └── services/
│   │
│   └── [기존 home/]
│
├── shared/
│   └── components/
│       └── layout/
│           ├── AdminLayout.tsx     # ✅ 추가
│           ├── AdminSidebar.tsx    # ✅ 추가
│           ├── AdminHeader.tsx     # ✅ 추가
│           └── [기존 Header, Footer]
│
└── [기존 shared/, core/]
```

**이 시점에서**:
- Admin 로그인 가능
- Dashboard에서 통계 확인
- Contacts 관리 (상태 변경, 삭제, CSV 내보내기)
- Quotes 관리 (있는 경우)
- Settings에서 사이트 설정 변경 가능

---

### Phase 4: Blog (선택 기능)

**파일 수**: ~165개 → **~177개** (+12개)

필요한 경우에만 생성:

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx            # ✅ Blog 목록
│   │   └── [id]/
│   │       └── page.tsx        # ✅ Blog 상세
│   └── admin/blog/
│       └── page.tsx            # ✅ Admin Blog 관리
│
└── features/
    └── blog/                   # ✅ 12개 파일
        ├── components/
        ├── hooks/
        ├── services/
        └── types/
```

---

### Phase 5-10: 최종 완료

**파일 수**: ~177개 → **~195개** (+18개)

추가되는 파일:
- Animations 컴포넌트 (3개)
- 추가 Hooks (일부)
- 추가 Utils (일부)

---

## 📊 최종 src/ 구조 (개발 완료 후)

```
src/                            # 총 ~195개 파일
├── app/                        # 14개 - Next.js 라우팅
├── features/                   # 105개 - 비즈니스 로직
│   ├── home/                   # 28개 (🎨 고객별 교체)
│   ├── admin/                  # 65개 (🔧 표준 재사용)
│   └── blog/                   # 12개 (선택)
├── shared/                     # 70개 - 공통 재사용
│   ├── components/             # 45개
│   ├── hooks/                  # 9개
│   ├── lib/                    # 5개
│   ├── utils/                  # 7개
│   └── config/                 # 4개
└── core/                       # 6개 - 프레임워크
    ├── providers/              # 3개
    └── types/                  # 3개
```

---

## 🎨 커스텀 vs 표준

### 🎨 커스텀 영역 (고객별 교체) - 40개 파일

**features/home/** (28개):
- Hero 섹션 (텍스트, 이미지, CTA)
- Services 섹션 (서비스 목록 변경)
- Portfolio 섹션 (프로젝트 목록 변경)
- About 섹션 (회사 소개 변경)
- Contact 섹션 (연락처 정보)
- **QuoteModal** ⭐ (수집 항목 커스터마이징)

**Header/Footer** (2개):
- 메뉴 항목
- 연락처 정보

**Blog** (12개, 선택):
- 필요한 경우에만 추가

**특징**:
- 고객마다 **완전히 다른 내용**
- Figma 디자인 반영
- 데이터 파일(`.data.ts`)만 수정하면 됨

---

### 🔧 표준 영역 (재사용) - 155개 파일

**features/admin/** (65개):
- Dashboard, Contacts, Quotes, Settings, Auth
- **모든 프로젝트에서 동일**
- 복사해서 바로 사용

**shared/** (70개):
- UI 컴포넌트 (shadcn/ui)
- Layout 컴포넌트
- Custom Hooks
- Utils 함수
- **모든 기능에서 공유**

**core/** (6개):
- Providers
- Types

**특징**:
- 프로젝트마다 **완전히 동일**
- 한 번 만들면 계속 재사용
- 커스터마이징 불필요

---

## 🚀 LLM이 개발하는 방법

### 1. 전체 프로젝트 개발

```
"build-project/workflows/development-checklist.md를 읽고,
 Phase 0부터 순차적으로 개발 진행해줘.

 Phase 1 완료 후 검증하고,
 Phase 2, Phase 3... 순차 진행."
```

LLM이 자동으로:
1. Phase 1: Core Infrastructure 생성 (~10개 파일)
2. Phase 2: Home Page 생성 (~90개 파일)
3. Phase 3: Admin Panel 생성 (~165개 파일)
4. Phase 4-10: 최종 완료 (~195개 파일)

---

### 2. 특정 Phase만 개발

```
"development-checklist.md의 Phase 2 (Home Page)만 개발해줘.

 다음 요구사항 반영:
 - 견적 모달 수집 항목: 이름, 이메일, 전화번호, 서비스 종류, 예산 범위
 - Contact Form 추가 필드: 회사명, 전화번호"
```

---

### 3. 진행 상황 확인

```
"architecture/src-structure.md를 읽고,
 현재 src/ 디렉토리와 비교해서
 완료된 Phase와 남은 작업을 알려줘."
```

LLM이 자동으로:
- 현재 파일 수 확인
- Phase별 완료 여부 판단
- 누락된 파일 목록 제공

---

## 📋 체크리스트로 개발 관리

`development-checklist.md`를 사용하면:

✅ **Phase 0**: 프로젝트 초기화
- [ ] npm run init 실행
- [ ] Firebase 프로젝트 생성
- [ ] Security Rules 배포

✅ **Phase 1**: Core Infrastructure
- [ ] Firebase 초기화 (10개 파일)
- [ ] npm run dev 정상 작동 확인

✅ **Phase 2**: Home Page
- [ ] Hero 섹션 생성
- [ ] QuoteModal 생성 ⭐
- [ ] Contact Form 생성
- [ ] shadcn/ui 설치
- [ ] 모든 섹션 동작 확인 (90개 파일)

✅ **Phase 3**: Admin Panel
- [ ] Admin 로그인 생성
- [ ] Dashboard 생성
- [ ] Contacts 관리 생성
- [ ] Quotes 관리 생성
- [ ] Settings 관리 생성 (165개 파일)

✅ **Phase 4-10**: 최종 완료 (195개 파일)

---

## 💡 핵심 포인트

### src/가 개발되는 과정:

1. **Phase 1** → 기본 인프라 (10개)
2. **Phase 2** → Home 페이지 추가 (90개)
3. **Phase 3** → Admin 패널 추가 (165개)
4. **Phase 4-10** → 최종 완료 (195개)

### 각 Phase마다:
- ✅ 파일 생성
- ✅ 기능 구현
- ✅ 검증 테스트
- ✅ 다음 Phase 진행

### LLM은:
- `development-checklist.md` 읽고
- Phase별로 순차 실행
- 체크 항목 하나씩 완료
- 검증 후 다음 Phase 진행

---

## 📂 참고 문서

- [src/ 완전 구조](./src-structure.md) - 195개 파일 전체 목록
- [개발 체크리스트](../workflows/development-checklist.md) - Phase별 상세 가이드
- [디렉토리 구조](./directory-structure.md) - 전체 프로젝트 구조
