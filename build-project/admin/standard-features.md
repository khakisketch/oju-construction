# Admin 표준 기능

## 개요

Admin 패널은 **모든 외주 프로젝트에서 동일하게 사용**되는 표준화된 기능입니다. 고객사별 커스터마이징 없이 그대로 복사하여 사용할 수 있습니다.

**표준화 원칙**:
- shadcn/ui 기반 일관된 UI
- Firestore 기반 데이터 관리
- Firebase Auth 기반 인증
- 반응형 디자인 (모바일 지원)

---

## 1. Contacts (문의 관리)

**경로**: `/admin/contacts`
**용도**: Home 페이지 Contact 폼을 통해 들어온 문의를 관리

### 주요 기능

#### 1.1 실시간 문의 목록
- Firestore `onSnapshot`으로 실시간 동기화
- 최근 100개 문의 표시 (페이지네이션 추가 가능)
- 생성일 기준 내림차순 정렬

**데이터 구조**:
```typescript
interface ContactData {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  status: 'new' | 'in_progress' | 'completed'
  createdAt: Timestamp
}
```

#### 1.2 상태 관리
- **new** (신규): 아직 확인하지 않은 문의
- **in_progress** (진행중): 검토 중이거나 답변 준비 중
- **completed** (완료): 처리 완료된 문의

**기능**:
- 클릭으로 상태 변경
- 낙관적 UI 업데이트 (즉시 반영 + 에러 시 롤백)
- 실시간 상태 카운트 표시

#### 1.3 필터링
- 전체 / 신규 / 진행중 / 완료 탭
- useMemo로 최적화된 필터링

#### 1.4 상세 보기
- 모달로 문의 상세 내용 표시
- 연락처 정보 (이름, 이메일, 전화번호, 회사)
- 문의 내용 전체 보기
- 생성일시

#### 1.5 삭제 기능
- 개별 삭제
- 다중 선택 삭제 (체크박스)
- 삭제 확인 모달

#### 1.6 Excel 내보내기
- 필터링된 문의 목록을 Excel로 다운로드
- 파일명: `contacts_YYYYMMDD_HHmmss.xlsx`
- 포함 정보: 이름, 이메일, 전화번호, 회사, 메시지, 상태, 생성일

**파일 위치**:
```
src/
├── app/admin/contacts/page.tsx              # 메인 페이지
├── services/firebase/contactService.ts      # Firestore CRUD
├── types/contact.ts                         # 타입 정의
└── utils/
    ├── dateFormatter.ts                     # 날짜 포맷팅
    └── statusHelpers.ts                     # 상태 관련 유틸
```

---

## 2. Settings (설정 관리)

**경로**: `/admin/settings`
**용도**: 사이트 전체 설정 관리 (5개 탭)

### 2.1 General (일반 설정)

#### 회사 정보
- **사이트 이름**: 고객사 이름 (Home 헤더, 푸터에 표시)
- **회사명**: 정식 회사명
- **대표자명**: (선택)
- **사업자등록번호**: (선택)
- **주소**: 도로명 주소
- **상세 주소**: 건물명, 층수 등

#### 연락처 정보
- **이메일**: 대표 이메일 (Footer 표시)
- **전화번호**: 대표 전화번호 (Footer 표시)
- **팩스**: (선택)

#### SNS 링크
- **Instagram**: 인스타그램 프로필 URL
- **YouTube**: 유튜브 채널 URL

#### 기타
- **영업시간**: 예) 평일 09:00 - 18:00
- **저작권 문구**: Footer 하단 표시

**Firestore 문서**: `siteSettings/general`

---

### 2.2 SEO (검색 엔진 최적화)

#### 메타 태그
- **Meta Title**: 브라우저 탭, 검색 결과 제목
- **Meta Description**: 검색 결과 설명 (160자 권장)
- **Meta Keywords**: 검색 키워드 (쉼표 구분)

**적용 위치**: `src/app/layout.tsx`의 metadata

**Firestore 문서**: `siteSettings/seo`

---

### 2.3 Media (미디어 관리)

#### 사이트 아이콘 및 이미지
- **Favicon**: 브라우저 탭 아이콘 (32x32px)
- **OG Image**: 카카오톡, 페이스북 공유 시 표시될 이미지 (1200x630px 권장)
- **Logo**: 사이트 로고 (선택)

**기능**:
- 이미지 업로드 (Firebase Storage)
- 미리보기
- 자동 파일명 생성 (타임스탬프)

**Storage 경로**: `public/`

**Firestore 문서**: `siteSettings/media`

---

### 2.4 Marketing Scripts (마케팅 스크립트)

**용도**: Google Analytics, Meta Pixel, Naver Analytics 등 마케팅 추적 코드 관리

#### 지원 플랫폼
1. **Google Analytics 4**
   - Measurement ID 입력
   - 자동 스크립트 생성

2. **Meta Pixel** (Facebook/Instagram)
   - Pixel ID 입력
   - 자동 스크립트 생성

3. **Naver Analytics**
   - Account ID 입력
   - 자동 스크립트 생성

4. **Custom Script**
   - 직접 스크립트 코드 입력

#### 기능
- 스크립트 추가/수정/삭제
- 활성화/비활성화 토글
- 위치 선택 (head / body)
- 우선순위 설정
- 스크립트 미리보기

**주의사항**:
- 스크립트는 `<head>` 또는 `<body>` 마지막에 자동 삽입
- XSS 방지를 위한 검증 필요
- 크롤러 감지를 위해 `<noscript>` 태그 포함

**Firestore 문서**: `siteSettings/marketingScripts`

---

### 2.5 Account (계정 관리)

#### 프로필 정보
- **이름**: 관리자 이름
- **이메일**: 로그인 이메일 (Firebase Auth)
- **역할**: Admin (고정)

#### 알림 설정
- **이메일 알림**: 새 문의 발생 시 이메일 수신 (활성화/비활성화)

#### 보안
- **비밀번호 변경**: Firebase Auth 이메일 인증 방식
- **로그아웃**: 세션 종료

**Firestore 문서**: `users/{uid}`

---

## 3. Dashboard (대시보드)

**경로**: `/admin` (루트)
**용도**: 주요 지표 한눈에 보기

### 표시 정보
- **오늘의 문의**: 금일 접수된 문의 수
- **미처리 문의**: status가 'new'인 문의 수
- **진행중 문의**: status가 'in_progress'인 문의 수
- **최근 문의**: 최근 5개 문의 목록 (미리보기)

**향후 추가 가능**:
- 월간 문의 추이 그래프
- 인기 서비스 분석
- 방문자 통계 (GA4 연동)

---

## 4. 인증 시스템

### 로그인
**경로**: `/admin/login`

**기능**:
- Firebase Email/Password 인증
- "로그인 상태 유지" 옵션
- 에러 메시지 표시

**보안**:
- Admin 계정만 로그인 가능 (일반 사용자 X)
- 세션 타임아웃 (30분)
- 자동 로그아웃

### 라우트 보호
**구현 위치**: `src/app/admin/layout.tsx`

```typescript
// AuthGuard로 Admin 영역 전체 보호
if (!user) {
  redirect('/admin/login')
}
```

**보호 대상**:
- `/admin` (대시보드)
- `/admin/contacts`
- `/admin/settings`

---

## 5. UI 컴포넌트 (shadcn/ui 표준)

### 추가 예정
- **Button**: 일관된 버튼 스타일
- **Input**: 폼 입력 필드
- **Table**: 문의 목록 테이블
- **Dialog**: 모달 (상세보기, 삭제 확인)
- **Select**: 드롭다운 (상태 선택)
- **Tabs**: 설정 페이지 탭
- **Badge**: 상태 뱃지 (new, in_progress, completed)
- **Toast**: 알림 메시지

**설치**:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input table dialog select tabs badge toast
```

---

## 6. Firestore 데이터 구조

### Collections

#### `contacts/`
```typescript
{
  id: string (자동 생성)
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  status: 'new' | 'in_progress' | 'completed'
  createdAt: Timestamp
}
```

#### `siteSettings/general`
```typescript
{
  siteName: string
  companyName: string
  ceoName?: string
  businessNumber?: string
  address?: string
  addressDetail?: string
  contactEmail: string
  contactPhone: string
  contactFax?: string
  instagramUrl?: string
  youtubeUrl?: string
  businessHours: string
  copyrightText: string
  updatedAt: Timestamp
}
```

#### `siteSettings/seo`
```typescript
{
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  updatedAt: Timestamp
}
```

#### `siteSettings/media`
```typescript
{
  faviconUrl: string
  ogImageUrl: string
  logoUrl?: string
  updatedAt: Timestamp
}
```

#### `siteSettings/marketingScripts`
```typescript
{
  scripts: Array<{
    id: string
    platform: 'google_analytics' | 'meta_pixel' | 'naver_analytics' | 'custom'
    name: string
    scriptId?: string      // GA4 ID, Pixel ID, Naver ID
    code?: string          // Custom script code
    position: 'head' | 'body'
    enabled: boolean
    priority: number
    createdAt: Timestamp
    updatedAt: Timestamp
  }>
}
```

#### `users/{uid}`
```typescript
{
  uid: string
  email: string
  name?: string
  role: 'admin'
  emailNotifications: boolean
  createdAt: Timestamp
}
```

---

## 7. Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Admin only
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Contacts: Admin can CRUD, Public can create only
    match /contacts/{contactId} {
      allow read, update, delete: if isAdmin();
      allow create: if true; // Contact 폼에서 생성
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

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public folder: Admin can upload, everyone can read
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 8. 표준화 체크리스트

새 프로젝트에서 Admin을 사용하기 위한 체크리스트:

### 초기 설정
- [ ] Firebase 프로젝트 생성
- [ ] Authentication 활성화 (이메일/비밀번호)
- [ ] Firestore Database 생성
- [ ] Storage 생성
- [ ] Admin 사용자 생성 (Firebase Console)

### 코드 복사
- [ ] `src/app/admin/` 전체 복사
- [ ] `src/services/firebase/` Admin 관련 서비스 복사
- [ ] `src/contexts/` AuthContext, FirestoreContext 복사
- [ ] `src/types/` Admin 관련 타입 복사

### 설정
- [ ] `.env.local`에 Firebase 설정 추가
- [ ] Firestore Security Rules 배포
- [ ] Storage Rules 배포

### 테스트
- [ ] Admin 로그인 테스트
- [ ] Contacts CRUD 테스트
- [ ] Settings 저장 테스트
- [ ] 미디어 업로드 테스트
- [ ] 마케팅 스크립트 테스트

---

## 9. 향후 개선 계획

### 추가 기능
- [ ] Dashboard 통계 그래프
- [ ] 문의 답변 이메일 발송
- [ ] 파일 첨부 기능
- [ ] 문의 검색 기능
- [ ] 관리자 권한 레벨 (Super Admin, Admin, Editor)

### UI/UX 개선
- [ ] shadcn/ui 전환 완료
- [ ] 다크 모드 지원
- [ ] 모바일 최적화

### 성능 최적화
- [ ] 문의 목록 페이지네이션 (무한 스크롤)
- [ ] 이미지 최적화 (압축, 리사이징)
- [ ] Firestore 인덱스 최적화

---

## 다음 단계

- [Admin 컴포넌트 가이드](./component-guide.md)
- [새 프로젝트 시작](../workflows/new-project-setup.md)
- [배포 가이드](../workflows/deployment.md)
