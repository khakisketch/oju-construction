# MCP Prompts Collection

## 개요

외주 프로젝트 템플릿 개발 시 Claude Code에게 사용할 **실제 프롬프트 모음**입니다.
복사해서 바로 사용하거나 상황에 맞게 수정하여 사용하세요.

---

## 📋 프로젝트 초기화

### 요구사항 수집 (대화형)

```
"build-project/specs/requirements-checklist.md를 읽고,
 새 프로젝트 시작을 위해 사용자에게 필요한 정보를 물어봐줘.

 대화형 질문 순서:
 1. 기본 정보 (프로젝트 이름, 회사명, Firebase ID)
 2. 연락처 (이메일, 전화번호, 주소)
 3. Figma 디자인 여부
 4. 견적 모달 필요 여부 ⭐
    - 필요하면: 수집할 데이터 항목 확인
 5. Contact 폼 추가 필드
 6. 추가 페이지 필요 여부
 7. 마케팅 스크립트 (GA4, Meta Pixel 등)
 8. 커스텀 도메인 사용 여부

 답변을 받으면 정리해서
 build-project/scripts/init-project.js를 실행할 수 있도록
 값을 준비해줘."
```

### 견적 모달 커스터마이징

```
"사용자가 견적 모달에서 수집하고 싶은 데이터를 물어봤어.

 수집 항목:
 - 이름 (필수)
 - 이메일 (필수)
 - 전화번호 (필수)
 - 회사명 (선택)
 - 서비스 종류 (필수, 드롭다운)
   옵션: ['웹 개발', '모바일 앱', '브랜딩', '마케팅']
 - 예산 범위 (선택, 드롭다운)
   옵션: ['500만원 이하', '500-1000만원', '1000-2000만원', '2000만원 이상']
 - 프로젝트 설명 (필수, textarea)

 build-project/templates/quote-modal-template.md를 참고해서
 QuoteModal.tsx를 생성하고,
 build-project/specs/data-models.md의 QuoteData 모델도 업데이트해줘.

 모달 트리거는 Hero 섹션 CTA 버튼에 추가."
```

### 새 프로젝트 시작 (정보 모두 확보 후)

```
"build-project/workflows/new-project-setup.md를 읽고,
 새 프로젝트 '클라이언트 컴퍼니'를 시작해줘.

 프로젝트 정보:
 - 회사명: 클라이언트 컴퍼니
 - Firebase Project ID: client-company-prod
 - 이메일: contact@client-company.com
 - 전화번호: 02-1234-5678

 견적 모달 필요: 예
 수집 항목: [이미 확정됨]

 다음 작업 수행:
 1. npm run init 실행 (대화형으로)
 2. Firebase 프로젝트 연결 안내
 3. 개발 서버 실행 테스트
 4. Admin 로그인 테스트"
```

### 환경 설정 확인

```
"build-project/templates/config/.env.example을 읽고,
 현재 .env.local 파일이 올바르게 설정되어 있는지 확인해줘.

 누락된 환경변수가 있으면 알려주고,
 Firebase Console에서 어떻게 찾는지 안내해줘."
```

---

## 🎨 Home 페이지 개발

### Figma 디자인 자동 생성

```
"build-project/home/figma-integration.md를 참고해서
 Figma 디자인 [https://www.figma.com/file/...] 읽어서
 src/features/home/ 폴더에 전체 구현해줘.

 섹션 구성:
 - Hero (대형 타이틀 + CTA 버튼 2개)
 - Services (4개 서비스 카드, 그리드)
 - Portfolio (6개 프로젝트, 3x2 그리드)
 - About (회사 소개 + 팀 사진)
 - Contact (폼: 이름, 이메일, 전화번호, 회사, 메시지)

 요구사항:
 - 반응형: 모바일(1열), 태블릿(2열), 데스크톱(3-4열)
 - Framer Motion 애니메이션 (Fade-in)
 - WCAG 2.1 AA 접근성 준수
 - Next.js Image 최적화
 - build-project/architecture/directory-structure.md 구조 준수"
```

### 기존 템플릿 텍스트 교체

```
"src/features/home/ 의 모든 섹션에서
 텍스트를 다음으로 교체해줘:

 Hero:
 - 타이틀: '클라이언트 컴퍼니'
 - 서브타이틀: '고객의 성공이 우리의 목표입니다'
 - CTA 1: '상담 신청'
 - CTA 2: '포트폴리오 보기'

 Services:
 - 서비스 1: 웹 개발
 - 서비스 2: 모바일 앱
 - 서비스 3: 브랜딩
 - 서비스 4: 마케팅

 About:
 - '우리는 고객의 비즈니스 성장을 위해 최선을 다합니다'

 텍스트만 교체하고 디자인/레이아웃은 유지해줘."
```

### Contact 폼 필드 추가

```
"src/features/home/contact/ContactForm.tsx에
 '회사명' 필드를 추가해줘.

 위치: 이메일 필드 다음
 필드명: company (선택)
 검증: 없음 (선택 필드)

 build-project/specs/data-models.md의 Contact 모델 참고해서
 Firestore 저장도 같이 수정해줘."
```

---

## 🔧 Admin 패널 커스터마이징

### Settings 페이지 분리

```
"build-project/admin/standard-features.md를 읽고,
 src/app/admin/settings/page.tsx (1217줄)를
 다음과 같이 분리해줘:

 목표 구조:
 features/admin/settings/
 ├── components/
 │   ├── SettingsTabs.tsx
 │   ├── GeneralSettings.tsx
 │   ├── SEOSettings.tsx
 │   ├── MediaSettings.tsx
 │   ├── MarketingScriptsSettings.tsx
 │   └── AccountSettings.tsx
 ├── hooks/
 │   ├── useGeneralSettings.ts
 │   ├── useSEOSettings.ts
 │   ├── useMediaSettings.ts
 │   └── useMarketingScripts.ts
 └── types/
     └── settings.types.ts

 app/admin/settings/page.tsx는
 컴포넌트들을 import하여 조합만 하도록 수정.

 build-project/templates/feature-template.md 구조 준수."
```

### Marketing Scripts 기능 제거

```
"Admin 패널에서 Marketing Scripts 기능을 완전히 제거해줘.

 제거할 항목:
 - src/app/admin/settings/page.tsx의 Marketing Scripts 탭
 - src/services/firebase/marketingScriptsService.ts
 - src/types/marketingScripts.ts
 - Firestore siteSettings/marketingScripts 문서 (데이터는 유지)

 Settings 페이지에서 해당 탭이 보이지 않도록 수정."
```

---

## ✨ 새 기능 추가

### Blog 기능 추가

```
"build-project/templates/feature-template.md를 참고해서
 Blog 기능을 features/blog/에 추가해줘.

 기능 요구사항:
 - Blog 포스트 목록 (카테고리별 필터링)
 - Blog 포스트 상세 페이지 (Markdown 렌더링)
 - Admin에서 CRUD 가능
 - 검색 기능 (제목, 내용)
 - 발행/비공개 상태 관리

 build-project/specs/data-models.md의 BlogPosts 모델 사용.

 생성할 파일:
 - features/blog/types/blog.types.ts
 - features/blog/services/blogService.ts
 - features/blog/hooks/useBlogPosts.ts
 - features/blog/components/BlogList.tsx
 - features/blog/components/BlogCard.tsx
 - features/blog/components/BlogDetail.tsx
 - app/blog/page.tsx
 - app/blog/[id]/page.tsx
 - app/admin/blog/page.tsx"
```

### 다국어 지원 추가

```
"next-intl을 사용해서 다국어 지원을 추가해줘.

 지원 언어: 한국어(기본), 영어
 번역 파일 위치: src/locales/

 적용 범위:
 - Home 페이지 전체
 - Admin 패널 UI (메뉴, 버튼 등)
 - Contact 폼 라벨 및 검증 메시지

 build-project/architecture/directory-structure.md 구조 유지."
```

---

## 🐛 버그 수정

### Contact 폼 제출 안 됨

```
"Contact 폼 제출이 안 되는 문제를 해결해줘.

 증상:
 - 폼 제출 시 에러: 'Failed to add document'
 - Console에 Firestore 권한 에러 표시

 확인할 사항:
 1. firestore.rules에서 contacts 권한 확인
 2. src/services/firebase/contactService.ts의 createContact 함수 확인
 3. .env.local의 Firebase 설정 확인

 build-project/specs/data-models.md와
 build-project/templates/config/firestore.rules 참고해서 수정."
```

### 이미지 로딩 느림

```
"Home 페이지 이미지 로딩이 느린 문제를 해결해줘.

 현재 상태:
 - <img> 태그 사용 중
 - 이미지 크기: 2-3MB

 개선 방안:
 1. Next.js Image 컴포넌트로 전환
 2. WebP 포맷 사용
 3. Priority 속성 추가 (Hero 이미지)
 4. Lazy loading 적용 (나머지 이미지)

 적용 범위: src/features/home/ 전체"
```

---

## 🚀 배포

### Firebase 배포

```
"build-project/workflows/deployment.md를 읽고,
 Firebase에 배포해줘.

 프로세스:
 1. TypeScript 타입 체크 (npm run type-check)
 2. ESLint 검증 (npm run lint)
 3. Next.js 빌드 (npm run build)
 4. Firebase 배포 (firebase deploy)

 배포 후 확인:
 - Home 페이지 로드 테스트
 - Admin 로그인 테스트
 - Contact 폼 제출 테스트

 문제 발생 시 troubleshooting 섹션 참고."
```

### Lighthouse 성능 개선

```
"Lighthouse Performance 점수를 90+ 로 개선해줘.

 현재 점수: 75
 주요 이슈:
 - LCP: 4.2s (목표: <2.5s)
 - FID: 150ms (목표: <100ms)
 - CLS: 0.15 (목표: <0.1)

 개선 방안:
 1. 이미지 최적화 (WebP, 압축)
 2. 코드 스플리팅
 3. 폰트 최적화 (font-display: swap)
 4. Unused CSS 제거

 build-project/01-TECH-STACK.md의 성능 목표 참고."
```

---

## 🔍 분석 및 검토

### 프로젝트 구조 검증

```
"build-project/architecture/directory-structure.md를 읽고,
 현재 src/ 디렉토리 구조가 올바른지 검증해줘.

 확인 항목:
 - app/ vs features/ 분리가 올바른지
 - shared/ 사용이 적절한지
 - Import 규칙 위반 여부
 - 파일 네이밍이 일관적인지

 문제가 있으면 개선안 제시해줘."
```

### 보안 취약점 검사

```
"build-project/specs/security-rules.md를 읽고,
 보안 취약점을 검사해줘.

 확인 항목:
 - Firestore Security Rules (firestore.rules)
 - Storage Rules (storage.rules)
 - .env.local의 민감 정보 노출 여부
 - XSS, CSRF 방어 코드
 - Admin 인증 로직

 발견된 취약점과 해결 방안을 알려줘."
```

---

## 💡 리팩토링

### shadcn/ui 통합

```
"Admin 패널에 shadcn/ui를 통합해줘.

 작업:
 1. shadcn/ui 설치 및 초기화
 2. 필요한 컴포넌트 추가:
    - Button, Input, Table, Dialog, Select, Tabs, Badge, Toast
 3. 기존 Admin UI 컴포넌트를 shadcn/ui로 교체:
    - app/admin/contacts/page.tsx
    - app/admin/settings/page.tsx

 디자인 일관성 유지하면서 교체."
```

### 코드 품질 개선

```
"src/features/admin/settings/ 폴더의 코드 품질을 개선해줘.

 개선 항목:
 - useState 남용 → Custom Hooks로 분리
 - 중복 코드 제거 (DRY 원칙)
 - 타입 안정성 강화
 - 에러 처리 개선
 - 주석 및 JSDoc 추가

 build-project/architecture/code-patterns.md 참고."
```

---

## 📝 문서화

### README 업데이트

```
"프로젝트 루트의 README.md를 업데이트해줘.

 포함 내용:
 - 프로젝트 소개
 - 기술 스택
 - 시작하기 (환경 설정, 설치, 실행)
 - 배포 방법
 - 프로젝트 구조 (간략)
 - 라이선스

 build-project/00-PROJECT-OVERVIEW.md 참고."
```

### API 문서 생성

```
"build-project/specs/api-specification.md를 생성해줘.

 문서화할 API:
 - Contact 폼 제출
 - Settings CRUD
 - Media 업로드
 - Marketing Scripts 관리

 각 API에 대해:
 - 엔드포인트 (Firestore 경로)
 - Request/Response 타입
 - 에러 코드
 - 예시

 build-project/specs/data-models.md 참고."
```

---

## 🎯 상황별 프롬프트 팁

### 명확한 지시

**❌ 나쁜 예**:
```
"페이지 좀 예쁘게 만들어줘"
```

**✅ 좋은 예**:
```
"Hero 섹션의 타이틀 크기를 72px로 키우고,
 CTA 버튼 색상을 #FF6B6B로 변경해줘.
 반응형도 고려해서 모바일에서는 타이틀 48px로."
```

### 문서 참조

**✅ 항상 관련 문서 명시**:
```
"build-project/templates/feature-template.md 참고해서..."
"build-project/specs/data-models.md의 Contact 모델 사용..."
```

### 구체적인 요구사항

**✅ 세부 사항 명시**:
```
"Portfolio 섹션에 필터링 기능 추가해줘.
 카테고리: 웹 개발, 모바일 앱, 브랜딩, 마케팅
 - 버튼 스타일: Tailwind bg-brand-500
 - 클릭 시 해당 카테고리만 표시
 - 'All' 버튼으로 전체 보기
 - Framer Motion으로 Fade 전환 효과"
```

### 단계적 작업

**✅ 복잡한 작업은 단계별로**:
```
"Blog 기능을 추가해줘. 다음 순서로 진행:

Step 1: 데이터 모델 및 타입 정의
Step 2: Firestore 서비스 함수 작성
Step 3: Custom Hooks 작성
Step 4: Blog 목록 컴포넌트
Step 5: Blog 상세 페이지
Step 6: Admin CRUD 페이지

각 단계 완료 후 다음 단계로 진행."
```

---

## 🔗 관련 문서

- [Figma MCP Integration](./figma-mcp-guide.md)
- [Context7 Guide](./context7-guide.md)
- [Data Models](../specs/data-models.md)
- [Feature Template](../templates/feature-template.md)
