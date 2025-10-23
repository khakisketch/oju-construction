# Directory Structure

## 전체 구조

```
project-root/
├── build-project/              # 📚 개발 자동화 문서 (이 디렉토리)
│
├── public/                     # 정적 파일
│   ├── favicon.ico
│   └── images/
│
├── src/                        # 소스 코드
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (public)/           # 🎨 Home 영역 (라우트 그룹)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── (dashboard)/        # 🔧 Admin 영역 (라우트 그룹)
│   │   │   ├── layout.tsx
│   │   │   ├── contacts/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   ├── robots.ts           # SEO
│   │   └── sitemap.ts          # SEO
│   │
│   ├── features/               # 🎯 비즈니스 기능 (도메인별)
│   │   ├── home/               # Home 페이지 기능
│   │   │   ├── hero/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   └── QuoteModal.tsx
│   │   │   ├── portfolio/
│   │   │   │   └── PortfolioSection.tsx
│   │   │   └── contact/
│   │   │       └── ContactSection.tsx
│   │   │
│   │   └── admin/              # Admin 패널 기능
│   │       ├── contacts/
│   │       │   ├── components/
│   │       │   ├── hooks/
│   │       │   ├── services/
│   │       │   └── types/
│   │       ├── settings/
│   │       └── marketing-scripts/
│   │
│   ├── shared/                 # 🔧 공통 재사용 코드
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui 컴포넌트
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ...
│   │   │   └── layout/         # 레이아웃 컴포넌트
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   │
│   │   ├── hooks/              # 공통 Custom Hooks
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   │
│   │   ├── lib/                # 외부 라이브러리 초기화
│   │   │   └── firebase/
│   │   │       ├── app.ts
│   │   │       ├── firestore.ts
│   │   │       └── storage.ts
│   │   │
│   │   ├── utils/              # 순수 함수 (헬퍼)
│   │   │   ├── format.ts
│   │   │   └── validation.ts
│   │   │
│   │   └── config/             # 설정 파일
│   │       ├── constants.ts
│   │       └── env.ts
│   │
│   └── core/                   # 🏗️ 프레임워크 레벨
│       └── providers/
│           ├── AuthProvider.tsx
│           └── FirestoreProvider.tsx
│
├── scripts/                    # 🤖 자동화 스크립트
│   ├── init-project.js
│   └── deploy-firebase.js
│
├── .env.local                  # 환경변수 (Git 제외)
├── .env.example                # 환경변수 예시
├── package.json
└── next.config.js
```

## 디렉토리별 상세 설명

### 1. `src/app/` - Next.js App Router

**책임**: 라우팅과 레이아웃만 담당. 비즈니스 로직은 금지.

**라우트 그룹**:
- `(public)`: 인증 불필요 (Home 페이지)
- `(dashboard)`: 인증 필요 (Admin 패널)

**규칙**:
- ✅ 라우팅, 레이아웃만
- ❌ 비즈니스 로직, 복잡한 컴포넌트 금지
- ✅ `features/`에서 컴포넌트 import만

**예시**:
```typescript
// ✅ 좋은 예: app/(public)/page.tsx
import HeroSection from '@/features/home/hero/HeroSection'

export default function HomePage() {
  return <HeroSection />
}

// ❌ 나쁜 예: 비즈니스 로직 포함
export default function HomePage() {
  const [data, setData] = useState([])
  useEffect(() => { /* ... */ }, [])
  return <div>...</div>
}
```

---

### 2. `src/features/` - 비즈니스 기능

**책임**: 도메인별 비즈니스 로직 및 UI

**구조 패턴**:
```
features/<domain>/
├── components/         # UI 컴포넌트
├── hooks/             # 도메인 전용 훅
├── services/          # API/데이터 액세스
└── types/             # 타입 정의
```

**분리 원칙**:
- `features/home/`: 고객별 다름 (교체 용이)
- `features/admin/`: 표준화 (모든 프로젝트 동일)

**예시**:
```
features/admin/contacts/
├── components/
│   ├── ContactTable.tsx        # UI
│   └── ContactModal.tsx        # UI
├── hooks/
│   └── useContacts.ts          # 로직 (Firestore 연동)
├── services/
│   └── contactService.ts       # API
└── types/
    └── contact.types.ts        # 타입
```

**규칙**:
- ✅ 기능별 응집도 높게
- ❌ 다른 features/ 직접 참조 금지
- ✅ shared/만 참조 가능

---

### 3. `src/shared/` - 공통 코드

**책임**: 3번 이상 재사용되는 코드만

#### 3.1 `shared/components/ui/`
**shadcn/ui 컴포넌트**: 표준 UI 라이브러리
```
button.tsx, input.tsx, dialog.tsx, table.tsx, ...
```

**사용법**:
```typescript
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
```

#### 3.2 `shared/lib/`
**외부 라이브러리 초기화만**
```
lib/firebase/         # Firebase 설정
lib/analytics/        # GA4 설정 (선택)
```

#### 3.3 `shared/utils/`
**순수 함수만**
```typescript
// format.ts
export const formatDate = (date: Date) => {...}

// validation.ts
export const validateEmail = (email: string) => {...}
```

**규칙**:
- ✅ 순수 함수 (side effect 없음)
- ❌ React Hooks 금지 (→ shared/hooks/)
- ❌ 컴포넌트 금지 (→ shared/components/)

---

### 4. `src/core/` - 프레임워크 레벨

**책임**: 앱 전체에 영향을 주는 최상위 기능

```
core/providers/
├── AuthProvider.tsx          # Firebase Auth
└── FirestoreProvider.tsx     # Firestore Context
```

**규칙**:
- ✅ 앱 전체 Context
- ✅ Root layout에서만 사용
- ❌ 일반 컴포넌트는 여기 금지

---

## 파일 배치 결정 가이드

### 질문 1: "이 코드가 어디에 속하나요?"

```
Q: React 컴포넌트인가?
└─ Yes →
   Q: 특정 기능에만 사용되나?
   ├─ Yes → features/<domain>/components/
   └─ No → shared/components/

Q: 순수 함수인가?
└─ Yes → shared/utils/

Q: React Hook인가?
└─ Yes →
   Q: 특정 기능에만 사용되나?
   ├─ Yes → features/<domain>/hooks/
   └─ No → shared/hooks/

Q: 외부 라이브러리 초기화인가?
└─ Yes → shared/lib/

Q: 타입 정의인가?
└─ Yes →
   Q: 특정 기능에만 사용되나?
   ├─ Yes → features/<domain>/types/
   └─ No → shared/types/
```

---

## Import 규칙

### 허용된 Import 방향
```
app/ → features/ → shared/ → core/
     ↘           ↘
```

### 금지된 Import
```
❌ features/admin/ → features/home/
❌ shared/ → features/
❌ app/ → app/
```

### Import 경로 예시
```typescript
// ✅ 좋은 예
import { Button } from '@/shared/components/ui/button'
import { ContactTable } from '@/features/admin/contacts/components/ContactTable'

// ❌ 나쁜 예 (상대 경로)
import { Button } from '../../../shared/components/ui/button'

// ❌ 나쁜 예 (기능 간 참조)
import { UserData } from '@/features/admin/users/types'
```

---

## 네이밍 규칙

### 파일명
- **컴포넌트**: PascalCase `.tsx`
  - `ContactTable.tsx`, `HeroSection.tsx`
- **훅**: camelCase `.ts`
  - `useContacts.ts`, `useDebounce.ts`
- **유틸**: camelCase `.ts`
  - `format.ts`, `validation.ts`
- **서비스**: camelCase + `Service.ts`
  - `contactService.ts`, `authService.ts`
- **타입**: camelCase + `.types.ts`
  - `contact.types.ts`, `auth.types.ts`

### 폴더명
- **kebab-case**
  - `marketing-scripts/`, `home-sections/`

---

## 다음 단계

- [네이밍 규칙 상세](./naming-conventions.md)
- [기능 추가 가이드](../workflows/development-workflow.md)
