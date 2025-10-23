# Admin Panel Overview

## 개요

Admin 패널은 외주 프로젝트에서 표준화되어 재사용 가능한 관리자 패널입니다.

**핵심 원칙**:
- 🎯 **표준화**: 모든 프로젝트에서 동일한 구조
- 🔄 **재사용성**: 코드 복사만으로 바로 사용 가능
- 🎨 **일관성**: shadcn/ui 기반 통일된 디자인
- 🔐 **보안**: Firebase Auth + Firestore Rules

---

## 아키텍처

### 1. 라우트 구조
```
/admin                      # 대시보드 (통계)
/admin/login                # 로그인 페이지
/admin/contacts             # 문의 관리
/admin/settings             # 사이트 설정
```

### 2. 인증 시스템
- **Firebase Authentication** (이메일/비밀번호)
- **AuthContext**로 전역 상태 관리
- **Route Protection**: 미인증 시 `/admin/login` 리다이렉트

### 3. 데이터 관리
- **Firestore Database**: 실시간 동기화
- **Firebase Storage**: 이미지 업로드
- **Optimistic UI**: 즉시 반영 + 에러 시 롤백

---

## 주요 기능

### 1. Dashboard (대시보드)
**경로**: `/admin`

**표시 정보**:
- 오늘의 문의 수
- 미처리 문의 수 (status: 'new')
- 진행중 문의 수 (status: 'in_progress')
- 최근 문의 5개 미리보기

**향후 추가**:
- 월간 문의 추이 그래프
- 인기 서비스 분석
- 방문자 통계 (GA4 연동)

---

### 2. Contacts (문의 관리)
**경로**: `/admin/contacts`

**기능**:
- ✅ 실시간 문의 목록 (Firestore onSnapshot)
- ✅ 상태 관리 (new, in_progress, completed)
- ✅ 필터링 (전체 / 신규 / 진행중 / 완료)
- ✅ 상세 보기 (모달)
- ✅ 삭제 (단일 / 다중 선택)
- ✅ Excel 내보내기

**데이터 흐름**:
```
1. Home 페이지 Contact 폼 제출
   ↓
2. Firestore contacts/ 컬렉션에 저장
   ↓
3. Admin Contacts 페이지에서 실시간 표시
   ↓
4. 관리자가 상태 변경 또는 삭제
```

---

### 3. Settings (설정 관리)
**경로**: `/admin/settings`

**5개 탭 구성**:

#### 3.1 General (일반 설정)
- 회사 정보 (사이트 이름, 회사명, 대표자명, 사업자등록번호)
- 연락처 정보 (이메일, 전화번호, 팩스)
- 주소 (도로명 주소, 상세 주소)
- SNS 링크 (Instagram, YouTube)
- 기타 (영업시간, 저작권 문구)

**적용 위치**: Footer, Contact 섹션

#### 3.2 SEO (검색 엔진 최적화)
- Meta Title (브라우저 탭, 검색 결과 제목)
- Meta Description (검색 결과 설명, 160자 권장)
- Meta Keywords (검색 키워드, 쉼표 구분)

**적용 위치**: `<head>` 태그 (`src/app/layout.tsx`)

#### 3.3 Media (미디어 관리)
- Favicon (32x32px, .ico 또는 .png)
- OG Image (1200x630px, SNS 공유 시 표시)
- Logo (선택, SVG 또는 PNG)

**기능**:
- 이미지 업로드 (Firebase Storage)
- 미리보기
- 자동 파일명 생성 (타임스탬프)

#### 3.4 Marketing Scripts (마케팅 스크립트)
- Google Analytics 4 (측정 ID)
- Meta Pixel (픽셀 ID)
- Naver Analytics (계정 ID)
- Custom Script (직접 입력)

**기능**:
- 스크립트 추가/수정/삭제
- 활성화/비활성화 토글
- 위치 선택 (head / body)
- 우선순위 설정

#### 3.5 Account (계정 관리)
- 프로필 정보 (이름, 이메일)
- 알림 설정
  - **PWA 푸시 알림** (브라우저 알림, 새 문의/견적 즉시 알림) ⭐ NEW
  - 이메일 알림 활성화/비활성화
- 비밀번호 변경
- 로그아웃

**PWA 알림 상세**: [Admin PWA Notifications](./pwa-notifications.md)

---

## 기술 스택

### Frontend
- **Next.js 15** (App Router)
- **TypeScript 5**
- **Tailwind CSS 3.4**
- **shadcn/ui** (추가 예정)

### Backend
- **Firebase Authentication** (이메일/비밀번호)
- **Firestore Database** (NoSQL 실시간 DB)
- **Firebase Storage** (파일 업로드)

### 상태 관리
- **React Context API**
  - AuthContext (인증 상태)
  - FirestoreContext (Firestore 인스턴스)

---

## 디렉토리 구조

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin 레이아웃 + 인증 가드
│   │   ├── page.tsx             # 대시보드
│   │   ├── login/
│   │   │   └── page.tsx         # 로그인 페이지
│   │   ├── contacts/
│   │   │   └── page.tsx         # 문의 관리 페이지
│   │   └── settings/
│   │       └── page.tsx         # 설정 페이지 (1217줄)
│   │
│   └── layout.tsx               # Root layout (Providers)
│
├── features/admin/              # (추후 리팩토링)
│   ├── contacts/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── settings/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── contexts/
│   ├── AuthContext.tsx          # Firebase Auth 상태 관리
│   └── FirestoreContext.tsx     # Firestore 인스턴스 제공
│
├── services/firebase/
│   ├── contactService.ts        # Contact CRUD
│   ├── adminSettingsService.ts  # Settings CRUD
│   ├── mediaService.ts          # Media 업로드
│   └── marketingScriptsService.ts  # Marketing Scripts CRUD
│
└── types/
    ├── contact.ts               # Contact 타입
    ├── adminSettings.ts         # Settings 타입
    └── marketingScripts.ts      # Marketing Scripts 타입
```

---

## 인증 & 권한

### 로그인 플로우
```
1. 사용자가 /admin 접속
   ↓
2. AuthGuard가 인증 상태 확인
   ↓
3. 미인증 시 /admin/login 리다이렉트
   ↓
4. Firebase Authentication 로그인
   ↓
5. 성공 시 /admin 접근 가능
```

### 권한 레벨
현재는 **단일 Admin 권한**만 지원
- role: 'admin' → 모든 기능 접근 가능

**향후 추가 가능**:
- Super Admin: 전체 권한
- Admin: 일반 관리 권한
- Editor: 콘텐츠 편집만 가능

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Admin 권한 확인
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Contacts: Public can create, Admin can CRUD
    match /contacts/{contactId} {
      allow create: if true;              // Contact 폼에서 생성
      allow read, update, delete: if isAdmin();
    }

    // Settings: Admin only
    match /siteSettings/{document=**} {
      allow read, write: if isAdmin();
    }

    // Users: Admin only
    match /users/{userId} {
      allow read, write: if isAdmin() || request.auth.uid == userId;
    }
  }
}
```

---

## UI/UX 가이드

### 디자인 원칙
1. **Simplicity**: 단순하고 직관적인 인터페이스
2. **Consistency**: 일관된 색상, 폰트, 간격
3. **Responsiveness**: 모바일, 태블릿, 데스크톱 대응
4. **Accessibility**: WCAG 2.1 AA 준수

### 색상 시스템 (tailwind.config.js)
```javascript
colors: {
  admin: {
    primary: '#3B82F6',    // 파란색 (버튼, 링크)
    success: '#10B981',    // 초록색 (성공 메시지)
    warning: '#F59E0B',    // 주황색 (경고)
    error: '#EF4444',      // 빨간색 (에러)
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      // ...
    }
  }
}
```

### 타이포그래피
- **제목**: text-2xl font-bold (24px, 700)
- **본문**: text-base font-normal (16px, 400)
- **캡션**: text-sm text-gray-500 (14px, 회색)

### 간격
- **섹션 여백**: py-12 (48px)
- **컴포넌트 간격**: gap-6 (24px)
- **컨테이너 패딩**: px-4 (16px)

---

## 개발 우선순위

### Phase 1: 현재 상태 (완료)
- ✅ 기본 인증 시스템
- ✅ Contacts 관리 (실시간 동기화)
- ✅ Settings 관리 (5개 탭)
- ✅ 마케팅 스크립트 관리

### Phase 2: 리팩토링 (진행 예정)
- [ ] shadcn/ui 통합
- [ ] settings/page.tsx 분리 (1217줄 → 컴포넌트화)
- [ ] features/admin/ 구조로 이동
- [ ] Hooks 분리 (useState → custom hooks)

### Phase 3: 기능 추가
- [ ] Dashboard 통계 그래프
- [ ] Contact 답변 이메일 발송
- [ ] Settings 버전 관리 (이전 버전으로 복구)
- [ ] Admin 활동 로그
- [ ] 다크 모드 지원

### Phase 4: 고급 기능
- [ ] 다중 관리자 권한 레벨
- [ ] 2FA (Two-Factor Authentication)
- [ ] Audit Trail (변경 이력 추적)
- [ ] 벌크 작업 (일괄 상태 변경, 일괄 삭제)

---

## 표준화 전략

### 1. 코드 재사용
- Admin 코드는 `features/admin/_standard/`에 보관
- 새 프로젝트 시작 시 전체 복사
- 고객사별 수정 최소화

### 2. 설정 관리
- `.env.local`로 프로젝트별 설정 관리
- Firebase 프로젝트 ID만 변경
- 나머지 코드는 동일

### 3. UI 컴포넌트
- shadcn/ui로 표준 컴포넌트 라이브러리
- 커스터마이징 최소화
- 테마 변경만으로 브랜딩 가능

---

## 테스트 전략

### 수동 테스트
- [ ] 로그인/로그아웃
- [ ] Contact CRUD (생성, 조회, 수정, 삭제)
- [ ] Settings 저장 및 로드
- [ ] 이미지 업로드
- [ ] 마케팅 스크립트 추가/삭제

### 자동 테스트 (향후 추가)
- [ ] E2E 테스트 (Playwright)
- [ ] 단위 테스트 (Vitest)
- [ ] 통합 테스트 (Firebase Emulator)

---

## 유지보수 가이드

### 일반적인 수정 사항

#### 1. 회사 정보 변경
```
Admin → Settings → General → 회사 정보 입력 → 저장
```

#### 2. 새로운 Contact 폼 필드 추가
```typescript
// 1. types/contact.ts에 필드 추가
interface ContactData {
  // 기존 필드
  company?: string  // 새 필드
}

// 2. Home Contact 폼 업데이트
// 3. Admin Contacts 페이지 업데이트
// 4. contactService.ts 업데이트
```

#### 3. 마케팅 스크립트 추가
```
Admin → Settings → Marketing Scripts → 새 스크립트 추가
→ 플랫폼 선택 (Google Analytics, Meta Pixel, Naver, Custom)
→ ID 입력 → 저장
```

---

## 트러블슈팅

### 문제 1: Admin 로그인 안 됨
**원인**: Firebase Authentication 설정 누락

**해결**:
1. Firebase Console → Authentication → Sign-in method
2. Email/Password 활성화
3. Users 탭에서 Admin 사용자 추가

### 문제 2: Contact 폼 제출 안 됨
**원인**: Firestore Security Rules

**해결**:
```javascript
// firestore.rules
match /contacts/{contactId} {
  allow create: if true;  // 이 규칙 확인
}
```

### 문제 3: Settings 저장 안 됨
**원인**: Admin 권한 없음

**해결**:
```javascript
// Firestore users/{uid} 문서 확인
{
  role: 'admin'  // 이 필드 확인
}
```

---

## 다음 단계

- [표준 기능 상세](./standard-features.md)
- [새 프로젝트 시작](../workflows/new-project-setup.md)
- [개발 워크플로우](../workflows/development-workflow.md)
