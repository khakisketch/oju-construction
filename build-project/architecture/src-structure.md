# src/ 최종 구조 (개발 완료 후)

## 개요

LLM이 개발을 완료한 후 실제로 생성되는 **완전한 src/ 디렉토리 구조**입니다.

**색상 구분**:
- 🎨 **커스텀 (고객별 교체)**: Home 페이지 관련
- 🔧 **표준 (재사용)**: Admin 패널, Shared 컴포넌트
- ⚙️ **설정 (프로젝트 공통)**: Core, Config

---

## 전체 트리 구조

```
src/
├── app/                                    # Next.js App Router (34개 파일)
│   ├── (public)/                           # 🎨 Home 영역
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── admin/                              # 🔧 Admin 영역
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Dashboard
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── contacts/
│   │   │   └── page.tsx
│   │   ├── quotes/                         # 견적 관리 (선택)
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── layout.tsx                          # Root Layout
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
│
├── features/                               # 비즈니스 기능 (120개 파일)
│   │
│   ├── home/                               # 🎨 Home 기능 (고객별 교체)
│   │   ├── hero/                           # Hero 섹션
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroBackground.tsx
│   │   │   ├── HeroCTA.tsx
│   │   │   ├── QuoteModal.tsx              # 견적 모달 ⭐
│   │   │   └── hero.data.ts
│   │   │
│   │   ├── services/                       # Services 섹션
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceIcon.tsx
│   │   │   └── services.data.ts
│   │   │
│   │   ├── portfolio/                      # Portfolio 섹션
│   │   │   ├── PortfolioSection.tsx
│   │   │   ├── PortfolioCard.tsx
│   │   │   ├── PortfolioFilter.tsx
│   │   │   ├── PortfolioModal.tsx
│   │   │   └── portfolio.data.ts
│   │   │
│   │   ├── about/                          # About 섹션
│   │   │   ├── AboutSection.tsx
│   │   │   ├── AboutStats.tsx
│   │   │   ├── AboutTeam.tsx
│   │   │   └── about.data.ts
│   │   │
│   │   ├── testimonials/                   # 고객 후기 (선택)
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   └── testimonials.data.ts
│   │   │
│   │   ├── contact/                        # Contact 섹션
│   │   │   ├── ContactSection.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── ContactInfo.tsx
│   │   │   └── ContactMap.tsx
│   │   │
│   │   └── cta/                            # CTA 섹션
│   │       ├── CTASection.tsx
│   │       └── cta.data.ts
│   │
│   ├── admin/                              # 🔧 Admin 기능 (표준, 재사용)
│   │   │
│   │   ├── dashboard/                      # 대시보드
│   │   │   ├── components/
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── RecentContacts.tsx
│   │   │   │   └── RecentQuotes.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── services/
│   │   │       └── dashboardService.ts
│   │   │
│   │   ├── contacts/                       # 문의 관리
│   │   │   ├── components/
│   │   │   │   ├── ContactsManagement.tsx
│   │   │   │   ├── ContactTable.tsx
│   │   │   │   ├── ContactDetailModal.tsx
│   │   │   │   ├── ContactFilters.tsx
│   │   │   │   ├── ContactStatusBadge.tsx
│   │   │   │   └── ExportButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useContacts.ts
│   │   │   │   └── useContactActions.ts
│   │   │   ├── services/
│   │   │   │   ├── contactService.ts
│   │   │   │   └── exportService.ts
│   │   │   └── types/
│   │   │       └── contact.types.ts
│   │   │
│   │   ├── quotes/                         # 견적 관리 (선택)
│   │   │   ├── components/
│   │   │   │   ├── QuotesManagement.tsx
│   │   │   │   ├── QuoteTable.tsx
│   │   │   │   ├── QuoteDetailModal.tsx
│   │   │   │   ├── QuoteFilters.tsx
│   │   │   │   └── QuoteStatusBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useQuotes.ts
│   │   │   │   └── useQuoteActions.ts
│   │   │   ├── services/
│   │   │   │   ├── quoteService.ts
│   │   │   │   └── uploadService.ts
│   │   │   └── types/
│   │   │       └── quote.types.ts
│   │   │
│   │   ├── settings/                       # 설정 관리
│   │   │   ├── components/
│   │   │   │   ├── SettingsLayout.tsx
│   │   │   │   ├── SettingsTabs.tsx
│   │   │   │   ├── GeneralSettings.tsx
│   │   │   │   ├── SEOSettings.tsx
│   │   │   │   ├── MediaSettings.tsx
│   │   │   │   ├── ImageUpload.tsx
│   │   │   │   ├── MarketingScriptsSettings.tsx
│   │   │   │   ├── ScriptCard.tsx
│   │   │   │   ├── ScriptModal.tsx
│   │   │   │   ├── AccountSettings.tsx
│   │   │   │   └── PasswordChange.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useGeneralSettings.ts
│   │   │   │   ├── useSEOSettings.ts
│   │   │   │   ├── useMediaSettings.ts
│   │   │   │   ├── useMarketingScripts.ts
│   │   │   │   └── useAccountSettings.ts
│   │   │   ├── services/
│   │   │   │   ├── settingsService.ts
│   │   │   │   ├── mediaService.ts
│   │   │   │   ├── marketingScriptsService.ts
│   │   │   │   └── accountService.ts
│   │   │   └── types/
│   │   │       ├── settings.types.ts
│   │   │       └── marketingScripts.types.ts
│   │   │
│   │   └── auth/                           # 인증
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   └── AuthGuard.tsx
│   │       ├── hooks/
│   │       │   └── useLogin.ts
│   │       └── services/
│   │           └── authService.ts
│   │
│   └── blog/                               # 🎨 Blog 기능 (선택)
│       ├── components/
│       │   ├── BlogList.tsx
│       │   ├── BlogCard.tsx
│       │   ├── BlogDetail.tsx
│       │   ├── BlogSidebar.tsx
│       │   └── BlogSearch.tsx
│       ├── hooks/
│       │   ├── useBlogPosts.ts
│       │   └── useBlogPost.ts
│       ├── services/
│       │   └── blogService.ts
│       └── types/
│           └── blog.types.ts
│
├── shared/                                 # 🔧 공통 재사용 (85개 파일)
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── label.tsx
│   │   │   └── separator.tsx
│   │   │
│   │   ├── layout/                         # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   └── AdminMobileMenu.tsx
│   │   │
│   │   ├── common/                         # 공통 컴포넌트
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── BackToTop.tsx
│   │   │   └── Breadcrumb.tsx
│   │   │
│   │   └── animations/                     # 애니메이션 컴포넌트
│   │       ├── FadeIn.tsx
│   │       ├── SlideIn.tsx
│   │       └── ScrollReveal.tsx
│   │
│   ├── hooks/                              # 공통 Custom Hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useScrollPosition.ts
│   │   ├── useClickOutside.ts
│   │   ├── useToggle.ts
│   │   ├── useWindowSize.ts
│   │   ├── useCopyToClipboard.ts
│   │   └── useIntersectionObserver.ts
│   │
│   ├── lib/                                # 외부 라이브러리 초기화
│   │   ├── firebase/
│   │   │   ├── app.ts
│   │   │   ├── firestore.ts
│   │   │   ├── storage.ts
│   │   │   └── auth.ts
│   │   ├── analytics/
│   │   │   └── gtag.ts
│   │   └── utils/
│   │       └── cn.ts                       # Tailwind class merge
│   │
│   ├── utils/                              # 순수 함수 (헬퍼)
│   │   ├── format.ts                       # 포맷팅 (날짜, 전화번호, 통화)
│   │   ├── validation.ts                   # 검증 (이메일, 전화번호)
│   │   ├── date.ts                         # 날짜 유틸
│   │   ├── string.ts                       # 문자열 유틸
│   │   ├── array.ts                        # 배열 유틸
│   │   ├── file.ts                         # 파일 유틸
│   │   └── url.ts                          # URL 유틸
│   │
│   └── config/                             # 설정 파일
│       ├── constants.ts                    # 상수
│       ├── env.ts                          # 환경변수
│       ├── navigation.ts                   # 네비게이션 메뉴
│       └── seo.ts                          # SEO 기본값
│
└── core/                                   # ⚙️ 프레임워크 레벨 (6개 파일)
    ├── providers/
    │   ├── AuthProvider.tsx
    │   ├── FirestoreProvider.tsx
    │   └── ToastProvider.tsx
    └── types/
        ├── global.d.ts
        └── env.d.ts
```

---

## 파일 개수 통계

| 디렉토리 | 파일 개수 | 비고 |
|---------|----------|------|
| **app/** | 14 | 라우팅만 |
| **features/home/** | 28 | 🎨 고객별 교체 |
| **features/admin/** | 65 | 🔧 표준 재사용 |
| **features/blog/** | 12 | 🎨 선택 기능 |
| **shared/components/** | 45 | 🔧 공통 UI |
| **shared/hooks/** | 9 | 🔧 공통 Hooks |
| **shared/lib/** | 5 | ⚙️ 라이브러리 초기화 |
| **shared/utils/** | 7 | 🔧 헬퍼 함수 |
| **shared/config/** | 4 | ⚙️ 설정 |
| **core/** | 6 | ⚙️ 프레임워크 |
| **총계** | **~195개 파일** | |

---

## 고객별 교체 vs 표준 재사용

### 🎨 커스텀 영역 (고객별 교체) - 40개 파일

**features/home/** (28개):
```
hero/
├── HeroSection.tsx
├── HeroBackground.tsx
├── HeroCTA.tsx
├── QuoteModal.tsx          # 수집 항목 커스터마이징
└── hero.data.ts            # 텍스트만 변경

services/
├── ServicesSection.tsx
├── ServiceCard.tsx
├── ServiceIcon.tsx
└── services.data.ts        # 서비스 목록 변경

portfolio/
├── PortfolioSection.tsx
├── PortfolioCard.tsx
├── PortfolioFilter.tsx
├── PortfolioModal.tsx
└── portfolio.data.ts       # 프로젝트 목록 변경

about/
├── AboutSection.tsx
├── AboutStats.tsx
├── AboutTeam.tsx
└── about.data.ts           # 회사 소개 변경

testimonials/               # 선택
├── TestimonialsSection.tsx
├── TestimonialCard.tsx
└── testimonials.data.ts

contact/
├── ContactSection.tsx
├── ContactForm.tsx         # 필드 커스터마이징 가능
├── ContactInfo.tsx
└── ContactMap.tsx

cta/
├── CTASection.tsx
└── cta.data.ts
```

**features/blog/** (12개, 선택):
- 필요한 경우에만 추가
- Admin에서 CRUD 관리

**Header/Footer** (2개):
- `shared/components/layout/Header.tsx` - 메뉴 항목 변경
- `shared/components/layout/Footer.tsx` - 연락처 정보 변경

---

### 🔧 표준 영역 (재사용) - 155개 파일

**features/admin/** (65개):
- Contacts 관리: 15개
- Quotes 관리: 15개 (선택)
- Settings 관리: 25개
- Dashboard: 5개
- Auth: 5개

**특징**:
- **모든 프로젝트에서 동일**
- 복사해서 바로 사용
- 커스터마이징 불필요

**shared/** (70개):
- UI 컴포넌트 (shadcn/ui): 18개
- Layout 컴포넌트: 7개
- Common 컴포넌트: 8개
- Animations: 3개
- Hooks: 9개
- Utils: 7개
- Lib: 5개
- Config: 4개

**특징**:
- **모든 기능에서 공유**
- 한 번 만들면 계속 재사용

---

## 개발 완료 시점별 파일 현황

### Phase 1: 프로젝트 초기화 (npm run init 후)

```
src/
├── app/
│   ├── layout.tsx                 # 생성됨
│   ├── globals.css                # 생성됨
│   └── page.tsx                   # 임시 (교체 예정)
├── shared/
│   ├── lib/firebase/
│   │   ├── app.ts                 # 생성됨 (.env.local 사용)
│   │   └── firestore.ts           # 생성됨
│   └── config/
│       ├── constants.ts           # 생성됨 (프로젝트 정보)
│       └── env.ts                 # 생성됨
└── core/
    └── providers/
        ├── AuthProvider.tsx       # 생성됨
        └── FirestoreProvider.tsx  # 생성됨
```

**파일 수**: ~10개

---

### Phase 2: Home 페이지 개발 (Figma MCP 또는 수동)

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx             # 생성됨
│   │   └── page.tsx               # 생성됨
│   ├── layout.tsx
│   ├── globals.css
│   ├── robots.ts                  # 생성됨
│   └── sitemap.ts                 # 생성됨
│
├── features/home/
│   ├── hero/                      # 6개 파일 생성
│   ├── services/                  # 4개 파일 생성
│   ├── portfolio/                 # 5개 파일 생성
│   ├── about/                     # 4개 파일 생성
│   ├── contact/                   # 4개 파일 생성
│   └── cta/                       # 2개 파일 생성
│
├── shared/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui 18개 생성
│   │   ├── layout/
│   │   │   ├── Header.tsx         # 생성됨
│   │   │   └── Footer.tsx         # 생성됨
│   │   └── common/                # 8개 생성
│   ├── hooks/                     # 9개 생성
│   └── utils/                     # 7개 생성
│
└── [기존 core/]
```

**추가 파일 수**: ~80개
**누적 파일 수**: ~90개

---

### Phase 3: Admin 패널 개발

```
src/
├── app/admin/
│   ├── layout.tsx                 # 생성됨
│   ├── page.tsx                   # 생성됨
│   ├── login/page.tsx             # 생성됨
│   ├── contacts/page.tsx          # 생성됨
│   ├── quotes/page.tsx            # 생성됨 (선택)
│   └── settings/page.tsx          # 생성됨
│
├── features/admin/
│   ├── dashboard/                 # 5개 생성
│   ├── contacts/                  # 15개 생성
│   ├── quotes/                    # 15개 생성 (선택)
│   ├── settings/                  # 25개 생성
│   └── auth/                      # 5개 생성
│
├── shared/components/layout/
│   ├── AdminLayout.tsx            # 생성됨
│   ├── AdminSidebar.tsx           # 생성됨
│   └── AdminHeader.tsx            # 생성됨
│
└── [기존 home/, shared/, core/]
```

**추가 파일 수**: ~75개
**누적 파일 수**: ~165개

---

### Phase 4: Blog 기능 추가 (선택)

```
src/
├── app/blog/
│   ├── page.tsx                   # 생성됨
│   └── [id]/page.tsx              # 생성됨
│
├── app/admin/blog/
│   └── page.tsx                   # 생성됨
│
└── features/blog/
    ├── components/                # 5개 생성
    ├── hooks/                     # 2개 생성
    ├── services/                  # 1개 생성
    └── types/                     # 1개 생성
```

**추가 파일 수**: ~12개
**누적 파일 수**: ~177개

---

### Phase 5: 최종 완료 (추가 기능 및 최적화)

```
src/
├── shared/
│   ├── components/
│   │   └── animations/            # 3개 생성
│   ├── hooks/                     # 추가 hooks
│   └── utils/                     # 추가 utils
│
└── [모든 기존 파일]
```

**최종 파일 수**: **~195개**

---

## 견적 모달 관련 파일 (중요!)

### 기본 구성

```
features/home/hero/
└── QuoteModal.tsx                 # 견적 모달 컴포넌트

features/admin/quotes/
├── components/
│   ├── QuotesManagement.tsx       # 견적 관리 메인
│   ├── QuoteTable.tsx
│   ├── QuoteDetailModal.tsx
│   ├── QuoteFilters.tsx
│   └── QuoteStatusBadge.tsx
├── hooks/
│   ├── useQuotes.ts
│   └── useQuoteActions.ts
├── services/
│   ├── quoteService.ts            # Firestore CRUD
│   └── uploadService.ts           # 파일 업로드 (선택)
└── types/
    └── quote.types.ts             # QuoteData, QuoteFormData
```

### 커스터마이징 시나리오

**시나리오 1**: 기본 필드만 (이름, 이메일, 전화번호, 설명)
- `QuoteModal.tsx`: 1개 파일
- `quote.types.ts`: 기본 필드만

**시나리오 2**: 드롭다운 추가 (서비스 종류, 예산)
- `QuoteModal.tsx`: 드롭다운 로직 추가
- `quote.types.ts`: 필드 추가
- `quote.data.ts`: 드롭다운 옵션 데이터 파일 추가 (선택)

**시나리오 3**: 파일 첨부 기능
- `QuoteModal.tsx`: 파일 input 추가
- `uploadService.ts`: Firebase Storage 업로드 로직
- `storage.rules`: 업로드 경로 권한 설정

---

## LLM 개발 프롬프트 예시

### 1. 프로젝트 초기화

```
"build-project/architecture/src-structure-detailed.md를 읽고,
 다음 파일들을 생성해줘:

 Phase 1 (프로젝트 초기화):
 - app/layout.tsx
 - app/globals.css
 - shared/lib/firebase/app.ts
 - shared/config/constants.ts
 - core/providers/AuthProvider.tsx
 - core/providers/FirestoreProvider.tsx

 .env.local의 환경변수를 사용하고,
 build-project/templates/config/ 템플릿 참고."
```

### 2. Home 페이지 생성 (Figma MCP)

```
"build-project/home/figma-integration.md를 읽고,
 Figma [URL]에서 디자인을 읽어서
 features/home/ 전체 구조를 생성해줘.

 섹션: Hero, Services, Portfolio, About, Contact, CTA

 build-project/architecture/src-final-structure.md의
 Home 영역 구조를 정확히 따라서 생성.

 견적 모달은 다음 항목 수집:
 - 이름, 이메일, 전화번호 (필수)
 - 서비스 종류 (드롭다운)
 - 예산 범위 (드롭다운)
 - 프로젝트 설명 (textarea)

 build-project/templates/quote-modal-template.md 참고."
```

### 3. Admin 패널 생성

```
"build-project/admin/standard-features.md를 읽고,
 build-project/architecture/src-final-structure.md의
 Admin 영역 구조대로 features/admin/ 전체를 생성해줘.

 기능:
 - Dashboard (통계)
 - Contacts 관리
 - Quotes 관리
 - Settings 관리
 - Auth (로그인)

 build-project/templates/feature-template.md 구조 준수."
```

### 4. 최종 검증

```
"build-project/architecture/src-final-structure.md와
 현재 src/ 디렉토리를 비교해서
 누락된 파일이나 구조 차이를 알려줘.

 특히 다음 확인:
 - features/home/ 모든 섹션 존재
 - features/admin/ 모든 기능 존재
 - shared/components/ui/ shadcn/ui 컴포넌트
 - 파일 위치가 올바른지"
```

---

## 파일 네이밍 규칙 요약

### 컴포넌트
- **PascalCase**: `HeroSection.tsx`, `ContactForm.tsx`
- **접미사**: `Section`, `Card`, `Modal`, `Form`, `Button`

### Hooks
- **camelCase**: `useContacts.ts`, `useDebounce.ts`
- **접두사**: `use`

### Services
- **camelCase + Service**: `contactService.ts`, `quoteService.ts`

### Types
- **camelCase + .types**: `contact.types.ts`, `quote.types.ts`

### Data
- **camelCase + .data**: `hero.data.ts`, `services.data.ts`

### Utils
- **camelCase**: `format.ts`, `validation.ts`

---

## 다음 단계

- [디렉토리 구조 상세](./directory-structure.md)
- [src/ 구조 상세](./src-structure-detailed.md)
- [요구사항 체크리스트](../specs/requirements-checklist.md)
- [프로젝트 초기화 프롬프트](../mcp/mcp-prompts.md)
