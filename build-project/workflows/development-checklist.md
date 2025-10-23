# Development Checklist (개발 기능 체크리스트)

## 개요

LLM이 개발 중 단계별로 기능을 구현하고, 검증하고, 테스트하는 **완전한 체크리스트**입니다.

**사용 방법**:
1. LLM이 각 Phase별로 순차 진행
2. 각 기능 구현 후 ✅ 체크
3. 테스트 항목 실행 후 검증
4. 모든 Phase 완료 시 배포 가능

---

## Phase 0: 프로젝트 초기화

### 📋 요구사항 수집 (사전 작업)

- [ ] `build-project/specs/requirements-checklist.md` 읽고 사용자에게 질문
  - [ ] 프로젝트 이름, 회사명
  - [ ] 연락처 정보 (이메일, 전화번호)
  - [ ] Firebase Project ID
  - [ ] Figma 디자인 여부 확인
  - [ ] 견적 모달 필요 여부 및 수집 항목 확정
  - [ ] Contact 폼 추가 필드 확인
  - [ ] 브랜드 컬러, 로고
  - [ ] 추가 페이지 (Blog, Portfolio 등)
  - [ ] 마케팅 스크립트 (GA4, Meta Pixel 등)

### 🔧 초기화 스크립트 실행

- [ ] `npm run init` 실행 (또는 `node build-project/scripts/init-project.js`)
  - [ ] 프로젝트 정보 입력 완료
  - [ ] `.env.local` 생성 확인
  - [ ] `package.json` name 변경 확인
  - [ ] `.firebaserc` 생성 확인

### 📦 패키지 설치

- [ ] `npm install` 실행
  - [ ] Firebase SDK 설치 확인 (`firebase`, `firebase-admin`)
  - [ ] Next.js 15.5.3 설치 확인
  - [ ] TypeScript 설치 확인
  - [ ] Tailwind CSS 설치 확인

- [ ] **shadcn/ui 초기화** ⚠️ **새 프로젝트 필수**
  - [ ] `npx shadcn@latest init` 실행
  - [ ] `components.json` 생성 확인
  - [ ] `src/shared/components/ui/` 디렉토리 생성 확인
  - [ ] 기본 컴포넌트 설치: `npx shadcn@latest add button input table dialog select tabs badge toast switch card`
  - **참고**: 템플릿은 순수 Tailwind CSS로 작성되어 있으나, 새 프로젝트 시작 시 shadcn/ui 설치 후 빠른 개발 가능

### ⚙️ Firebase 프로젝트 설정

- [ ] Firebase Console에서 프로젝트 생성
  - [ ] Firestore Database 활성화
  - [ ] Firebase Authentication 활성화 (Email/Password)
  - [ ] Firebase Storage 활성화
  - [ ] Firebase Hosting 활성화
- [ ] Firebase Config 복사
  - [ ] API Key, Project ID 등을 `.env.local`에 추가

### 🔐 Firestore Security Rules 배포

- [ ] `build-project/templates/config/firestore.rules` 복사 → 루트 `firestore.rules`
- [ ] `firebase deploy --only firestore:rules` 실행
- [ ] Rules 배포 확인

### 🗂️ Firestore Indexes 배포

- [ ] `build-project/templates/config/firestore.indexes.json` 복사 → 루트 `firestore.indexes.json`
- [ ] `firebase deploy --only firestore:indexes` 실행
- [ ] Indexes 배포 확인

### 🔐 Storage Rules 배포

- [ ] `build-project/templates/config/storage.rules` 복사 → 루트 `storage.rules`
- [ ] `firebase deploy --only storage` 실행
- [ ] Rules 배포 확인

### ✅ Phase 0 완료 검증

- [ ] `npm run dev` 실행하여 개발 서버 정상 작동 확인
- [ ] `.env.local` 모든 환경변수 설정 확인
- [ ] Firebase Console에서 프로젝트 정상 확인
- [ ] TypeScript 에러 없음 (`npm run build`)

---

## Phase 1: Core Infrastructure (핵심 인프라)

### 📁 디렉토리 구조 생성

- [ ] `src/app/` 생성
- [ ] `src/features/` 생성
- [ ] `src/shared/` 생성
- [ ] `src/core/` 생성

### ⚙️ Firebase 초기화

- [ ] `src/shared/lib/firebase/app.ts` 생성
  - [ ] `initializeApp()` with `.env.local` 환경변수
  - [ ] `getApp()` export
- [ ] `src/shared/lib/firebase/firestore.ts` 생성
  - [ ] `getFirestore()` export
- [ ] `src/shared/lib/firebase/storage.ts` 생성
  - [ ] `getStorage()` export
- [ ] `src/shared/lib/firebase/auth.ts` 생성
  - [ ] `getAuth()` export

### 🔌 Providers 생성

- [ ] `src/core/providers/AuthProvider.tsx` 생성
  - [ ] Firebase Auth 상태 관리
  - [ ] `useAuth()` hook export
- [ ] `src/core/providers/FirestoreProvider.tsx` 생성 (선택)
- [ ] `src/core/providers/ToastProvider.tsx` 생성
  - [ ] toast notification 시스템

### 📄 Root Layout

- [ ] `src/app/layout.tsx` 생성
  - [ ] HTML lang="ko"
  - [ ] Providers wrapping
  - [ ] Google Fonts (Noto Sans KR 등)
  - [ ] SEO meta tags
- [ ] `src/app/globals.css` 생성
  - [ ] Tailwind directives
  - [ ] CSS Variables (브랜드 컬러)

### ⚙️ Config 파일

- [ ] `src/shared/config/constants.ts` 생성
  - [ ] PROJECT_NAME, COMPANY_NAME 등
  - [ ] `process.env.NEXT_PUBLIC_*` 사용
- [ ] `src/shared/config/env.ts` 생성
  - [ ] 환경변수 검증 및 export
- [ ] `src/shared/config/navigation.ts` 생성
  - [ ] 메뉴 항목 정의
- [ ] `src/shared/config/seo.ts` 생성
  - [ ] 기본 SEO 설정

### 🧰 Utils 함수

- [ ] `src/shared/utils/format.ts` 생성
  - [ ] `formatDate()`, `formatPhone()`, `formatCurrency()`
- [ ] `src/shared/utils/validation.ts` 생성
  - [ ] `validateEmail()`, `validatePhone()`
- [ ] `src/shared/lib/utils/cn.ts` 생성
  - [ ] `cn()` for Tailwind class merging

### 🧪 Types

- [ ] `src/core/types/global.d.ts` 생성
- [ ] `src/core/types/env.d.ts` 생성

### ✅ Phase 1 완료 검증

- [ ] `npm run dev` 정상 작동
- [ ] Firebase 연결 테스트
- [ ] TypeScript 에러 없음
- [ ] Console 에러 없음

---

## Phase 2: Home Page (홈 페이지)

### 🎨 Figma 디자인 확인

- [ ] Figma URL 제공받음?
  - 예 → Figma MCP 사용
  - 아니오 → 기본 템플릿 사용

### 🏗️ Layout 컴포넌트

- [ ] `src/shared/components/layout/Header.tsx` 생성
  - [ ] 로고, 네비게이션 메뉴
  - [ ] 모바일 메뉴 토글
  - [ ] "견적 요청" 버튼 (QuoteModal 트리거)
- [ ] `src/shared/components/layout/MobileMenu.tsx` 생성
  - [ ] 모바일 메뉴 (Hamburger)
- [ ] `src/shared/components/layout/Footer.tsx` 생성
  - [ ] 연락처 정보, SNS 링크
  - [ ] Copyright

### 🎨 shadcn/ui 컴포넌트 설치

- [ ] `npx shadcn-ui@latest add button`
- [ ] `npx shadcn-ui@latest add input`
- [ ] `npx shadcn-ui@latest add textarea`
- [ ] `npx shadcn-ui@latest add dialog`
- [ ] `npx shadcn-ui@latest add card`
- [ ] `npx shadcn-ui@latest add badge`
- [ ] `npx shadcn-ui@latest add toast`
- [ ] 필요한 다른 컴포넌트들...

### 🌟 Hero Section

- [ ] `src/features/home/hero/HeroSection.tsx` 생성
  - [ ] 메인 헤드라인
  - [ ] 서브 텍스트
  - [ ] CTA 버튼 (QuoteModal 트리거)
  - [ ] 배경 이미지/비디오
- [ ] `src/features/home/hero/HeroBackground.tsx` 생성 (선택)
- [ ] `src/features/home/hero/HeroCTA.tsx` 생성 (선택)
- [ ] `src/features/home/hero/hero.data.ts` 생성
  - [ ] 텍스트 데이터 분리

### 💼 Quote Modal ⭐ 중요

- [ ] `src/features/home/hero/QuoteModal.tsx` 생성
  - [ ] **기본 필드**: 이름, 이메일, 전화번호, 설명
  - [ ] **고객 요구사항 반영** (requirements-checklist.md 참조):
    - [ ] 회사명 필드 (필요 시)
    - [ ] 서비스 종류 드롭다운 (필요 시)
    - [ ] 예산 범위 드롭다운 (필요 시)
    - [ ] 희망 일정 드롭다운 (필요 시)
    - [ ] 파일 첨부 (필요 시)
  - [ ] 폼 검증 (validation)
  - [ ] 제출 시 Firestore `quotes` collection 저장
  - [ ] 성공/실패 toast 알림
- [ ] `src/features/home/hero/quote.data.ts` 생성 (선택)
  - [ ] 드롭다운 옵션 데이터 (서비스 종류, 예산 등)

### 🎯 Services Section

- [ ] `src/features/home/services/ServicesSection.tsx` 생성
  - [ ] 서비스 목록 렌더링
- [ ] `src/features/home/services/ServiceCard.tsx` 생성
  - [ ] 서비스 카드 UI
- [ ] `src/features/home/services/ServiceIcon.tsx` 생성 (선택)
- [ ] `src/features/home/services/services.data.ts` 생성
  - [ ] 서비스 목록 데이터 (고객별 수정)

### 📁 Portfolio Section

- [ ] `src/features/home/portfolio/PortfolioSection.tsx` 생성
- [ ] `src/features/home/portfolio/PortfolioCard.tsx` 생성
- [ ] `src/features/home/portfolio/PortfolioFilter.tsx` 생성 (카테고리 필터)
- [ ] `src/features/home/portfolio/PortfolioModal.tsx` 생성 (상세 보기)
- [ ] `src/features/home/portfolio/portfolio.data.ts` 생성
  - [ ] 프로젝트 목록 데이터

### 🏢 About Section

- [ ] `src/features/home/about/AboutSection.tsx` 생성
- [ ] `src/features/home/about/AboutStats.tsx` 생성 (통계)
- [ ] `src/features/home/about/AboutTeam.tsx` 생성 (팀 소개, 선택)
- [ ] `src/features/home/about/about.data.ts` 생성

### 📞 Contact Section

- [ ] `src/features/home/contact/ContactSection.tsx` 생성
- [ ] `src/features/home/contact/ContactForm.tsx` 생성
  - [ ] **기본 필드**: 이름, 이메일, 메시지
  - [ ] **고객 요구사항 반영**:
    - [ ] 전화번호 (필요 시)
    - [ ] 회사명 (필요 시)
    - [ ] 서비스 종류 (필요 시)
  - [ ] 폼 검증
  - [ ] Firestore `contacts` collection 저장
- [ ] `src/features/home/contact/ContactInfo.tsx` 생성
  - [ ] 연락처 정보 표시
- [ ] `src/features/home/contact/ContactMap.tsx` 생성 (지도, 선택)

### 🎯 CTA Section

- [ ] `src/features/home/cta/CTASection.tsx` 생성
- [ ] `src/features/home/cta/cta.data.ts` 생성

### 🌟 Testimonials Section (선택)

- [ ] `src/features/home/testimonials/TestimonialsSection.tsx` 생성
- [ ] `src/features/home/testimonials/TestimonialCard.tsx` 생성
- [ ] `src/features/home/testimonials/testimonials.data.ts` 생성

### 📄 Home Page 통합

- [ ] `src/app/(public)/layout.tsx` 생성
  - [ ] Header, Footer 포함
- [ ] `src/app/(public)/page.tsx` 생성
  - [ ] 모든 섹션 import 및 렌더링
  - [ ] 순서: Hero → Services → Portfolio → About → Testimonials → Contact → CTA

### 🎬 Animations (선택)

- [ ] `src/shared/components/animations/FadeIn.tsx` 생성
- [ ] `src/shared/components/animations/SlideIn.tsx` 생성
- [ ] `src/shared/components/animations/ScrollReveal.tsx` 생성
- [ ] Framer Motion 설치 및 적용

### 🧰 Common Components

- [ ] `src/shared/components/common/Loading.tsx` 생성
- [ ] `src/shared/components/common/ErrorMessage.tsx` 생성
- [ ] `src/shared/components/common/EmptyState.tsx` 생成
- [ ] `src/shared/components/common/BackToTop.tsx` 생성

### 🪝 Custom Hooks

- [ ] `src/shared/hooks/useDebounce.ts` 생성
- [ ] `src/shared/hooks/useMediaQuery.ts` 생성
- [ ] `src/shared/hooks/useScrollPosition.ts` 생성
- [ ] `src/shared/hooks/useToggle.ts` 생성

### ✅ Phase 2 완료 검증

**수동 테스트**:
- [ ] Home 페이지 접속 (`http://localhost:3000`)
- [ ] 모든 섹션 정상 렌더링 확인
- [ ] Header 네비게이션 동작 확인
- [ ] 모바일 메뉴 동작 확인
- [ ] Quote Modal 열기/닫기 확인
- [ ] Quote Modal 폼 제출 테스트 (Firestore 저장 확인)
- [ ] Contact Form 제출 테스트 (Firestore 저장 확인)
- [ ] 반응형 레이아웃 확인 (모바일, 태블릿, 데스크톱)
- [ ] 애니메이션 동작 확인 (있는 경우)

**자동 테스트**:
- [ ] TypeScript 에러 없음 (`npm run build`)
- [ ] Console 에러 없음
- [ ] Lighthouse 점수 확인 (Performance, Accessibility, SEO)

**Firestore 데이터 확인**:
- [ ] Firebase Console → Firestore → `contacts` collection에 데이터 저장 확인
- [ ] Firebase Console → Firestore → `quotes` collection에 데이터 저장 확인

---

## Phase 3: Admin Panel (관리자 패널)

### 🔐 Admin 인증

#### Admin 계정 생성
- [ ] Firebase Console → Authentication → Add User
  - [ ] 이메일: (고객 제공)
  - [ ] 비밀번호: (강력한 비밀번호)
- [ ] Firestore → `users` collection 생성
  - [ ] 문서 ID: {user_uid}
  - [ ] 데이터: `{ email: "...", role: "admin", createdAt: Timestamp }`

#### Auth 컴포넌트
- [ ] `src/features/admin/auth/components/LoginForm.tsx` 생성
  - [ ] 이메일/비밀번호 입력
  - [ ] Firebase Auth 로그인
  - [ ] 에러 처리
- [ ] `src/features/admin/auth/components/AuthGuard.tsx` 생성
  - [ ] Admin 권한 체크
  - [ ] 비인증 시 `/admin/login` 리다이렉트
- [ ] `src/features/admin/auth/hooks/useLogin.ts` 생성
- [ ] `src/features/admin/auth/services/authService.ts` 생성
  - [ ] `signInWithEmailAndPassword()`
  - [ ] `signOut()`
  - [ ] `checkAdminRole()`

#### Login Page
- [ ] `src/app/admin/login/page.tsx` 생성
  - [ ] LoginForm 렌더링
  - [ ] 로그인 성공 시 `/admin` 리다이렉트

### 🏗️ Admin Layout

- [ ] `src/shared/components/layout/AdminLayout.tsx` 생성
  - [ ] Sidebar + Header + Content 구조
  - [ ] AuthGuard wrapping
- [ ] `src/shared/components/layout/AdminSidebar.tsx` 생성
  - [ ] 메뉴 항목: Dashboard, Contacts, Quotes, Settings
  - [ ] 로그아웃 버튼
- [ ] `src/shared/components/layout/AdminHeader.tsx` 생성
  - [ ] 사용자 정보, 로그아웃
- [ ] `src/app/admin/layout.tsx` 생성
  - [ ] AdminLayout wrapping

### 📊 Dashboard

- [ ] `src/features/admin/dashboard/components/DashboardStats.tsx` 생성
  - [ ] 통계 카드: 총 문의 수, 총 견적 수, 미처리 건수
- [ ] `src/features/admin/dashboard/components/RecentContacts.tsx` 생성
  - [ ] 최근 문의 목록 (5개)
- [ ] `src/features/admin/dashboard/components/RecentQuotes.tsx` 생성
  - [ ] 최근 견적 요청 목록 (5개)
- [ ] `src/features/admin/dashboard/hooks/useDashboardStats.ts` 생성
- [ ] `src/features/admin/dashboard/services/dashboardService.ts` 생성
- [ ] `src/app/admin/page.tsx` 생성
  - [ ] Dashboard 컴포넌트 렌더링

### 📧 Contacts Management

#### Types & Services
- [ ] `src/features/admin/contacts/types/contact.types.ts` 생성
  - [ ] `ContactData` interface
  - [ ] `ContactStatus` enum
- [ ] `src/features/admin/contacts/services/contactService.ts` 생성
  - [ ] `getContacts()` - Firestore 쿼리
  - [ ] `getContactById()`
  - [ ] `updateContactStatus()`
  - [ ] `deleteContact()`
- [ ] `src/features/admin/contacts/services/exportService.ts` 생성
  - [ ] `exportToCSV()`
  - [ ] `exportToExcel()`

#### Hooks
- [ ] `src/features/admin/contacts/hooks/useContacts.ts` 생성
  - [ ] Real-time Firestore listener
  - [ ] Pagination
  - [ ] Sorting
- [ ] `src/features/admin/contacts/hooks/useContactActions.ts` 생성
  - [ ] Update, Delete actions

#### Components
- [ ] `src/features/admin/contacts/components/ContactsManagement.tsx` 생성
  - [ ] 전체 Contacts 페이지
- [ ] `src/features/admin/contacts/components/ContactTable.tsx` 생성
  - [ ] 테이블 UI
  - [ ] 정렬, 필터링
- [ ] `src/features/admin/contacts/components/ContactDetailModal.tsx` 생성
  - [ ] 상세 정보 모달
- [ ] `src/features/admin/contacts/components/ContactFilters.tsx` 생성
  - [ ] 상태별 필터
- [ ] `src/features/admin/contacts/components/ContactStatusBadge.tsx` 생성
- [ ] `src/features/admin/contacts/components/ExportButton.tsx` 생성

#### Page
- [ ] `src/app/admin/contacts/page.tsx` 생성
  - [ ] ContactsManagement 렌더링

### 💼 Quotes Management (선택)

#### Types & Services
- [ ] `src/features/admin/quotes/types/quote.types.ts` 생성
  - [ ] `QuoteData` interface
  - [ ] `QuoteStatus` enum
- [ ] `src/features/admin/quotes/services/quoteService.ts` 생성
  - [ ] `getQuotes()`
  - [ ] `getQuoteById()`
  - [ ] `updateQuoteStatus()`
  - [ ] `deleteQuote()`
- [ ] `src/features/admin/quotes/services/uploadService.ts` 생성 (파일 첨부 시)
  - [ ] Firebase Storage 다운로드

#### Hooks
- [ ] `src/features/admin/quotes/hooks/useQuotes.ts` 생성
- [ ] `src/features/admin/quotes/hooks/useQuoteActions.ts` 생성

#### Components
- [ ] `src/features/admin/quotes/components/QuotesManagement.tsx` 생성
- [ ] `src/features/admin/quotes/components/QuoteTable.tsx` 생성
- [ ] `src/features/admin/quotes/components/QuoteDetailModal.tsx` 생성
- [ ] `src/features/admin/quotes/components/QuoteFilters.tsx` 생성
- [ ] `src/features/admin/quotes/components/QuoteStatusBadge.tsx` 생성

#### Page
- [ ] `src/app/admin/quotes/page.tsx` 생성

### ⚙️ Settings Management

#### Types & Services
- [ ] `src/features/admin/settings/types/settings.types.ts` 생成
  - [ ] `SiteSettings`, `MarketingScript` interfaces
- [ ] `src/features/admin/settings/services/settingsService.ts` 생성
  - [ ] CRUD for `siteSettings` collection
- [ ] `src/features/admin/settings/services/mediaService.ts` 생성
  - [ ] Firebase Storage 업로드/삭제
- [ ] `src/features/admin/settings/services/marketingScriptsService.ts` 생성
- [ ] `src/features/admin/settings/services/accountService.ts` 생성

#### Hooks
- [ ] `src/features/admin/settings/hooks/useGeneralSettings.ts` 생성
- [ ] `src/features/admin/settings/hooks/useSEOSettings.ts` 생성
- [ ] `src/features/admin/settings/hooks/useMediaSettings.ts` 생성
- [ ] `src/features/admin/settings/hooks/useMarketingScripts.ts` 생성
- [ ] `src/features/admin/settings/hooks/useAccountSettings.ts` 생성

#### Components
- [ ] `src/features/admin/settings/components/SettingsLayout.tsx` 생성
- [ ] `src/features/admin/settings/components/SettingsTabs.tsx` 생성
- [ ] `src/features/admin/settings/components/GeneralSettings.tsx` 생성
  - [ ] 회사명, 연락처, 주소 수정
- [ ] `src/features/admin/settings/components/SEOSettings.tsx` 생성
  - [ ] Meta Title, Description, Keywords
- [ ] `src/features/admin/settings/components/MediaSettings.tsx` 생성
  - [ ] 로고, Favicon, OG Image 업로드
- [ ] `src/features/admin/settings/components/ImageUpload.tsx` 생성
- [ ] `src/features/admin/settings/components/MarketingScriptsSettings.tsx` 생성
  - [ ] GA4, Meta Pixel 등 스크립트 관리
- [ ] `src/features/admin/settings/components/ScriptCard.tsx` 생성
- [ ] `src/features/admin/settings/components/ScriptModal.tsx` 생성
- [ ] `src/features/admin/settings/components/AccountSettings.tsx` 생성
  - [ ] PWA 푸시 알림 설정 ⭐ NEW
  - [ ] 이메일 알림 설정
  - [ ] 비밀번호 변경
- [ ] `src/features/admin/settings/components/PasswordChange.tsx` 생성
- [ ] `src/features/admin/settings/components/NotificationSettings.tsx` 생성
  - [ ] 푸시 알림 On/Off 토글
  - [ ] 알림 권한 요청

#### Page
- [ ] `src/app/admin/settings/page.tsx` 생성

### 🔔 PWA Push Notifications (관리자 알림) ⭐ NEW

#### Service Worker 및 PWA 설정
- [ ] `public/sw.js` 생성
  - [ ] Push 이벤트 리스너
  - [ ] Notification 클릭 핸들러
- [ ] `public/manifest.json` 생성 (PWA manifest)
- [ ] `public/icon-192x192.png` 추가
- [ ] `public/badge-72x72.png` 추가

#### VAPID Keys 생성
- [ ] `npx web-push generate-vapid-keys` 실행
- [ ] `.env.local`에 VAPID 키 추가
  - [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
  - [ ] `VAPID_PRIVATE_KEY` (서버 전용)

#### 클라이언트 구현
- [ ] `src/shared/lib/pwa/registerServiceWorker.ts` 생성
  - [ ] Service Worker 등록 함수
- [ ] `src/features/admin/notifications/services/pushNotificationService.ts` 생성
  - [ ] `subscribeToPush()` - 구독 요청
  - [ ] `unsubscribeFromPush()` - 구독 해제
  - [ ] Firestore에 구독 정보 저장
- [ ] `src/features/admin/notifications/components/NotificationPrompt.tsx` 생성
  - [ ] Admin 로그인 시 알림 권한 요청 프롬프트
  - [ ] "허용" / "나중에" 버튼

#### Admin Layout 통합
- [ ] `src/app/admin/layout.tsx` 업데이트
  - [ ] Service Worker 등록
  - [ ] NotificationPrompt 컴포넌트 추가

#### Cloud Functions (알림 발송)
- [ ] `functions/src/index.ts` 생성/업데이트
  - [ ] `onContactCreate` - 새 문의 도착 시 알림
  - [ ] `onQuoteCreate` - 새 견적 도착 시 알림
  - [ ] web-push 라이브러리 사용
- [ ] `functions/package.json` 업데이트
  - [ ] `web-push` 설치
- [ ] Firebase Functions 환경변수 설정
  - [ ] `firebase functions:config:set vapid.public_key="..." vapid.private_key="..."`
- [ ] Cloud Functions 배포
  - [ ] `firebase deploy --only functions`

#### Firestore pushSubscriptions Collection
- [ ] Firestore에 `pushSubscriptions` 컬렉션 자동 생성 (구독 시)
- [ ] Security Rules 업데이트 (Admin만 자신의 구독 관리)

#### 테스트
- [ ] Admin 로그인 시 알림 권한 요청 확인
- [ ] 알림 허용 후 구독 정보 Firestore 저장 확인
- [ ] Settings → Account에서 푸시 알림 On/Off 동작 확인
- [ ] Contact 폼 제출 → 푸시 알림 수신 확인
- [ ] Quote 폼 제출 → 푸시 알림 수신 확인
- [ ] 알림 클릭 시 Admin 페이지 이동 확인

**참고 문서**: [Admin PWA Notifications](../admin/pwa-notifications.md)

### 🧰 Admin Common Components

- [ ] `src/shared/components/common/Pagination.tsx` 생성
- [ ] `src/shared/components/common/SearchBar.tsx` 생성
- [ ] `src/shared/components/common/Breadcrumb.tsx` 생성

### ✅ Phase 3 완료 검증

**로그인 테스트**:
- [ ] `/admin/login` 접속
- [ ] 잘못된 이메일/비밀번호 입력 시 에러 표시
- [ ] 올바른 계정으로 로그인 성공
- [ ] `/admin` 리다이렉트 확인

**권한 테스트**:
- [ ] 비로그인 상태에서 `/admin` 접속 시 `/admin/login` 리다이렉트
- [ ] Admin role이 아닌 사용자는 접근 불가 (있는 경우)

**Dashboard 테스트**:
- [ ] 통계 카드 정상 표시
- [ ] 최근 문의/견적 목록 표시

**Contacts 관리 테스트**:
- [ ] Contacts 목록 로딩
- [ ] 상태별 필터링 동작
- [ ] 정렬 동작
- [ ] 상세 모달 열기
- [ ] 상태 변경 (pending → contacted → closed)
- [ ] CSV 내보내기
- [ ] 문의 삭제

**Quotes 관리 테스트** (있는 경우):
- [ ] Quotes 목록 로딩
- [ ] 필터링/정렬 동작
- [ ] 상세 모달 열기
- [ ] 첨부파일 다운로드 (있는 경우)
- [ ] 상태 변경
- [ ] 견적 삭제

**Settings 테스트**:
- [ ] 일반 설정 수정 및 저장
- [ ] SEO 설정 수정
- [ ] 로고 업로드 (Firebase Storage 확인)
- [ ] 마케팅 스크립트 추가/수정/삭제
- [ ] PWA 푸시 알림 On/Off 토글 동작 ⭐ NEW
- [ ] 비밀번호 변경

**자동 테스트**:
- [ ] TypeScript 에러 없음
- [ ] Console 에러 없음

---

## Phase 4: Blog (선택 기능)

### 📝 Blog Types & Services

- [ ] `src/features/blog/types/blog.types.ts` 생성
  - [ ] `BlogPost` interface
- [ ] `src/features/blog/services/blogService.ts` 생성
  - [ ] CRUD for `blogPosts` collection

### 🧩 Blog Components

- [ ] `src/features/blog/components/BlogList.tsx` 생성
- [ ] `src/features/blog/components/BlogCard.tsx` 생성
- [ ] `src/features/blog/components/BlogDetail.tsx` 생성
- [ ] `src/features/blog/components/BlogSidebar.tsx` 생성
- [ ] `src/features/blog/components/BlogSearch.tsx` 생성

### 🪝 Blog Hooks

- [ ] `src/features/blog/hooks/useBlogPosts.ts` 생성
- [ ] `src/features/blog/hooks/useBlogPost.ts` 생성

### 📄 Blog Pages

- [ ] `src/app/blog/page.tsx` 생성 (목록)
- [ ] `src/app/blog/[id]/page.tsx` 생성 (상세)

### 🔧 Admin Blog Management

- [ ] `src/app/admin/blog/page.tsx` 생성
- [ ] Admin Blog CRUD 컴포넌트 생성

### ✅ Phase 4 완료 검증

- [ ] Blog 목록 페이지 접속
- [ ] Blog 상세 페이지 접속
- [ ] Admin에서 Blog 포스트 생성/수정/삭제 테스트

---

## Phase 5: SEO & Meta Tags

### 📄 robots.txt

- [ ] `src/app/robots.ts` 생성
  - [ ] Allow: `/`, Disallow: `/admin`

### 🗺️ Sitemap

- [ ] `src/app/sitemap.ts` 생성
  - [ ] Home, Contact 등 정적 페이지
  - [ ] Blog 동적 페이지 (있는 경우)

### 🎯 Meta Tags

- [ ] 각 페이지 `metadata` export
  - [ ] Home: title, description, openGraph
  - [ ] Contact, Blog 등

### 🔍 Structured Data (선택)

- [ ] JSON-LD for Organization
- [ ] JSON-LD for WebSite

### ✅ Phase 5 완료 검증

- [ ] `/robots.txt` 접속 확인
- [ ] `/sitemap.xml` 접속 확인
- [ ] Lighthouse SEO 점수 확인 (90+)
- [ ] Open Graph 미리보기 (Facebook Debugger)

---

## Phase 6: Performance Optimization

### ⚡ Image Optimization

- [ ] `next/image` 사용 확인
- [ ] 이미지 압축 (TinyPNG 등)
- [ ] WebP 포맷 사용
- [ ] Lazy loading 적용

### 📦 Bundle Size

- [ ] `npm run build` 후 번들 크기 확인
- [ ] Dynamic import 적용 (필요 시)
- [ ] Tree shaking 확인

### 🚀 Performance Metrics

- [ ] Lighthouse Performance 점수 확인 (90+)
  - [ ] First Contentful Paint (FCP) < 1.8s
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] Time to Interactive (TTI) < 3.8s
  - [ ] Cumulative Layout Shift (CLS) < 0.1

### ✅ Phase 6 완료 검증

- [ ] Lighthouse Performance 90+ 달성
- [ ] PageSpeed Insights 테스트
- [ ] 모바일/데스크톱 성능 확인

---

## Phase 7: Accessibility (접근성)

### ♿ ARIA & Semantic HTML

- [ ] 모든 버튼에 aria-label 또는 텍스트
- [ ] 이미지에 alt 속성
- [ ] Form labels 연결
- [ ] Heading hierarchy (h1 → h2 → h3)

### ⌨️ Keyboard Navigation

- [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
- [ ] Focus visible 스타일 적용
- [ ] 모달 Escape 키로 닫기

### 🎨 Color Contrast

- [ ] WCAG AA 준수 (4.5:1 대비)
- [ ] 텍스트와 배경 대비 확인

### ✅ Phase 7 완료 검증

- [ ] Lighthouse Accessibility 점수 확인 (90+)
- [ ] axe DevTools 검사
- [ ] 키보드만으로 사이트 탐색 테스트

---

## Phase 8: Analytics & Marketing

### 📊 Google Analytics 4

- [ ] GA4 설치 (requirements-checklist 참조)
  - [ ] Measurement ID를 `.env.local`에 추가
- [ ] `src/shared/lib/analytics/gtag.ts` 생성
  - [ ] `gtag()` 함수
- [ ] `src/app/layout.tsx`에 GA4 script 추가
- [ ] 이벤트 추적 설정
  - [ ] Contact Form 제출
  - [ ] Quote Modal 제출
  - [ ] Button 클릭 (CTA)

### 📈 Meta Pixel (선택)

- [ ] Meta Pixel 설치 (requirements-checklist 참조)
- [ ] Pixel ID를 `.env.local`에 추가
- [ ] Conversion 이벤트 설정

### 🔍 기타 마케팅 스크립트 (선택)

- [ ] Naver Analytics
- [ ] Kakao Pixel
- [ ] 기타

### ✅ Phase 8 완료 검증

- [ ] GA4 실시간 보고서에서 페이지뷰 확인
- [ ] Contact Form 제출 시 이벤트 확인
- [ ] Meta Pixel 테스트 (Events Manager)

---

## Phase 9: Testing (테스트)

### 🧪 Unit Tests (선택)

- [ ] Vitest 설치 및 설정
- [ ] Utils 함수 테스트
  - [ ] `validation.ts` 테스트
  - [ ] `format.ts` 테스트
- [ ] Hooks 테스트
  - [ ] `useContacts.ts` 테스트

### 🎭 E2E Tests (선택)

- [ ] Playwright 설치 및 설정
- [ ] Home 페이지 테스트
  - [ ] Quote Modal 제출 flow
  - [ ] Contact Form 제출 flow
- [ ] Admin 테스트
  - [ ] 로그인 flow
  - [ ] Contacts 관리 flow

### ✅ Phase 9 완료 검증

- [ ] `npm run test` 모든 테스트 통과
- [ ] `npm run test:e2e` E2E 테스트 통과

---

## Phase 10: Deployment (배포)

### 🔥 Firebase Hosting

- [ ] `firebase login` (처음 한 번)
- [ ] `firebase init hosting` (이미 완료)
- [ ] `npm run build` 실행
  - [ ] 빌드 에러 없음
- [ ] `firebase deploy --only hosting` 실행
  - [ ] 배포 성공

### 🌐 Custom Domain (선택)

- [ ] Firebase Console → Hosting → Add custom domain
- [ ] DNS 설정 (A record, TXT record)
- [ ] SSL 인증서 자동 발급 확인

### 🔐 Environment Variables (Production)

- [ ] Firebase Console → Hosting → Environment configuration
- [ ] Production 환경변수 설정 (필요 시)

### 📊 배포 후 확인

- [ ] Production URL 접속 확인
- [ ] Home 페이지 정상 작동
- [ ] Admin 로그인 및 기능 테스트
- [ ] GA4 실시간 보고서 확인
- [ ] Firestore 데이터 저장 확인

### ✅ Phase 10 완료 검증

- [ ] Production 사이트 정상 작동
- [ ] Lighthouse 점수 확인 (Performance, Accessibility, SEO 모두 90+)
- [ ] 모든 기능 정상 작동
- [ ] Custom domain 연결 완료 (있는 경우)

---

## 최종 체크리스트

### 📋 기능 완성도

- [ ] Home 페이지 모든 섹션 구현 완료
- [ ] Quote Modal 고객 요구사항 반영 완료
- [ ] Contact Form 고객 요구사항 반영 완료
- [ ] Admin 패널 모든 기능 구현 완료
  - [ ] Dashboard
  - [ ] Contacts 관리
  - [ ] Quotes 관리 (있는 경우)
  - [ ] Settings 관리
- [ ] Blog 기능 (선택, 있는 경우)

### 🎨 디자인 & UX

- [ ] Figma 디자인 반영 완료 (있는 경우)
- [ ] 반응형 레이아웃 (모바일, 태블릿, 데스크톱)
- [ ] 브랜드 컬러 적용
- [ ] 로고 및 이미지 적용
- [ ] 애니메이션 적용 (있는 경우)

### 🔧 기술적 완성도

- [ ] TypeScript 에러 없음
- [ ] Console 에러 없음
- [ ] Firestore Security Rules 배포 완료
- [ ] Firebase Storage Rules 배포 완료
- [ ] SEO 최적화 완료
- [ ] Performance 최적화 완료
- [ ] Accessibility 준수

### 📊 Analytics & Marketing

- [ ] GA4 설치 완료
- [ ] 주요 이벤트 추적 설정
- [ ] Meta Pixel 설치 (있는 경우)
- [ ] 기타 마케팅 스크립트 설치 (있는 경우)

### 🚀 배포

- [ ] Firebase Hosting 배포 완료
- [ ] Custom domain 연결 완료 (있는 경우)
- [ ] SSL 인증서 발급 완료
- [ ] Production 사이트 정상 작동

### 📝 문서화

- [ ] Admin 사용 가이드 작성 (선택)
- [ ] 고객 인수인계 자료 작성

---

## 고객 인수인계 항목

### 🔑 계정 정보 전달

- [ ] Firebase Console 접근 권한 부여
- [ ] Admin 계정 이메일/비밀번호 전달
- [ ] GA4 계정 접근 권한 부여 (있는 경우)

### 📚 사용 가이드

- [ ] Admin 패널 사용법 설명
  - [ ] 문의 관리 방법
  - [ ] 견적 관리 방법
  - [ ] Settings 수정 방법
  - [ ] 마케팅 스크립트 관리 방법
- [ ] 콘텐츠 수정 방법 (data 파일)
- [ ] 이미지 교체 방법

### 📊 Analytics 설명

- [ ] GA4 보고서 보는 방법
- [ ] 주요 지표 설명 (페이지뷰, 이벤트, 전환)

### 🔧 유지보수

- [ ] 간단한 텍스트 수정 방법
- [ ] 긴급 문의 대응 방법
- [ ] 추가 개발 요청 프로세스

---

## LLM 사용 가이드

### 개발 시작 시

```
"build-project/workflows/development-checklist.md를 읽고,
 Phase 0부터 순차적으로 진행해줘.

 현재 단계: Phase 0 - 프로젝트 초기화
 사용자에게 requirements-checklist.md를 기반으로
 필요한 정보를 물어봐줘."
```

### 각 Phase 완료 시

```
"Phase 2 완료했어. 다음과 같이 검증해줘:

 1. 모든 체크 항목 완료 확인
 2. 수동 테스트 실행 및 결과 보고
 3. TypeScript 빌드 에러 확인
 4. Lighthouse 점수 확인

 검증 완료되면 Phase 3으로 진행."
```

### 진행 상황 확인

```
"development-checklist.md를 기반으로
 현재 개발 진행 상황을 요약해줘:

 - 완료된 Phase
 - 현재 진행 중인 Phase
 - 남은 작업 항목
 - 예상 완료 시간"
```

### 배포 전 최종 확인

```
"development-checklist.md의 최종 체크리스트를 기반으로
 배포 전 모든 항목을 검증해줘.

 특히:
 - 기능 완성도
 - 성능 점수
 - 접근성 준수
 - 배포 준비 상태"
```

---

## 다음 단계

- [요구사항 수집](../specs/requirements-checklist.md)
- [프로젝트 초기화](../scripts/init-project.js)
- [개발 워크플로우](./development-workflow.md)
- [배포 가이드](./deployment.md)
