# New Project Setup

## 개요

템플릿으로 새 외주 프로젝트를 시작하는 전체 프로세스입니다.
**소요 시간**: 약 5-10분

---

## Step 1: 템플릿 복제

```bash
# 1. 템플릿 저장소 복제
git clone https://github.com/your-org/project-template.git client-company-name
cd client-company-name

# 2. Git 히스토리 초기화 (선택)
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"
```

---

## Step 2: 프로젝트 초기화

```bash
# 1. 의존성 설치
npm install

# 2. 초기화 스크립트 실행
npm run init
```

### 초기화 대화형 질문:

```
? 프로젝트 이름 (영문): client-company
? 고객사 이름 (한글): 클라이언트 컴퍼니
? Firebase Project ID: client-company-prod
? 대표 이메일: contact@client-company.com
? 대표 전화번호: 02-1234-5678
? Analytics 기능 포함? (y/N): n
```

### 자동으로 수행되는 작업:

1. ✅ `.env.local` 파일 생성
2. ✅ `package.json` name 업데이트
3. ✅ `src/shared/config/constants.ts` 업데이트
4. ✅ 불필요한 기능 제거 (Analytics 등)

---

## Step 3: Firebase 프로젝트 설정

### 3.1 Firebase Console에서 프로젝트 생성

1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 ID: `client-company-prod` (Step 2에서 입력한 것)
4. Google Analytics: 선택 해제 (불필요)

### 3.2 Firebase 서비스 활성화

```
Firebase Console → 프로젝트 설정
```

**필수 서비스**:
- ✅ Authentication (이메일/비밀번호 활성화)
- ✅ Firestore Database (프로덕션 모드로 시작)
- ✅ Storage (기본 규칙으로 시작)
- ✅ Hosting (나중에 배포 시 자동 활성화)

### 3.3 Firebase Admin 계정 생성

```bash
# Firebase CLI 설치 (최초 1회)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 설정
firebase use client-company-prod
```

### 3.4 Admin 사용자 생성

```
Firebase Console → Authentication → Users → Add User

Email: admin@client-company.com
Password: (강력한 비밀번호 생성)
```

---

## Step 4: 로컬 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:5566 확인

### 테스트 체크리스트:

- [ ] Home 페이지 렌더링 정상
- [ ] `/admin` 로그인 페이지 접근 가능
- [ ] Admin 로그인 성공 (Step 3.4에서 생성한 계정)
- [ ] Admin 대시보드 접근 가능

---

## Step 5: Home 페이지 개발

### 옵션 A: Figma 디자인이 있는 경우

```
Claude Code에게 요청:

"Figma 디자인 [Figma URL] 읽어서
 src/features/home/ 폴더에 전체 구현해줘.

 섹션 구성:
 - Hero (대형 타이틀 + CTA)
 - Services (카드 형식)
 - Portfolio (그리드)
 - Contact (폼)

 build-project/home/figma-integration.md 참고해서
 반응형, 애니메이션, 접근성 모두 적용"
```

**소요 시간**: 30분

### 옵션 B: Figma 없이 기본 템플릿 사용

기본 디자인 그대로 사용하고, 텍스트와 이미지만 교체:

```
Claude Code에게 요청:

"src/features/home/ 의 모든 섹션에서
 텍스트를 다음으로 교체해줘:

 - 회사명: 클라이언트 컴퍼니
 - 슬로건: [새로운 슬로건]
 - 서비스 항목: [새 항목]

 이미지는 public/images/ 에 넣으면
 자동으로 읽어서 사용하게 해줘"
```

**소요 시간**: 10분

---

## Step 6: Admin 기능 확인 및 커스터마이징

Admin은 표준화되어 있어 대부분 수정 불필요. 확인만 진행:

### 6.1 표준 기능 테스트

- [ ] **Contacts**: 문의 목록 조회, 상태 변경, 삭제
- [ ] **Settings**:
  - General (회사 정보)
  - SEO (메타 태그)
  - Media (파비콘, OG 이미지)
  - Marketing Scripts (픽셀, 애널리틱스)
  - Account (관리자 정보)

### 6.2 불필요한 기능 제거 (선택)

```
Claude Code에게 요청:

"build-project/admin/standard-features.md 확인하고
 다음 기능 제거해줘:
 - Marketing Scripts 기능 전체"
```

---

## Step 7: 환경변수 최종 확인

### `.env.local` 파일 검증:

```bash
# 필수 환경변수 확인
cat .env.local

# 다음 항목들이 있어야 함:
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_SITE_NAME
✅ NEXT_PUBLIC_CONTACT_EMAIL
✅ NEXT_PUBLIC_CONTACT_PHONE
```

### Firebase 설정 업데이트:

```
Firebase Console → 프로젝트 설정 → 일반 → 웹 앱 추가

→ Firebase SDK 구성 정보 복사
→ .env.local에 추가:

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## Step 8: 빌드 및 배포

### 8.1 로컬 빌드 테스트

```bash
# TypeScript 검증
npm run type-check

# Lint 검증
npm run lint

# 프로덕션 빌드
npm run build

# 빌드된 결과 로컬 테스트
npm run start
```

브라우저에서 http://localhost:3000 확인

### 8.2 Firebase 배포

```bash
# 자동 배포 스크립트 실행
npm run deploy
```

**배포 프로세스**:
1. ✅ Next.js 프로덕션 빌드
2. ✅ Firebase 인증 확인
3. ✅ Firebase Hosting 배포
4. ✅ Firestore 규칙 배포
5. ✅ Storage 규칙 배포

**배포 완료**:
```
✅ 배포 완료!
🌐 URL: https://client-company-prod.web.app
```

---

## Step 9: 고객 확인

### 9.1 고객에게 전달할 정보:

```
프로젝트: 클라이언트 컴퍼니 웹사이트

URL: https://client-company-prod.web.app

Admin 패널:
- URL: https://client-company-prod.web.app/admin
- Email: admin@client-company.com
- Password: [안전하게 전달]

다음 항목 확인 부탁드립니다:
1. Home 페이지 디자인 및 내용
2. 반응형 (모바일, 태블릿)
3. Contact 폼 작동
4. Admin 패널 접근 및 기능
```

### 9.2 피드백 수정

```
Claude Code에게 요청:

"고객 피드백:
 - Hero 버튼 색상 변경
 - Portfolio 카드 간격 조정
 - Footer 연락처 정보 수정

 build-project/workflows/development-workflow.md 참고해서
 수정해줘"
```

수정 후 재배포:
```bash
npm run deploy
```

---

## Step 10: 최종 인도

### 10.1 인도 체크리스트:

- [ ] 모든 기능 정상 작동
- [ ] 반응형 디자인 확인 (모바일, 태블릿, 데스크톱)
- [ ] SEO 메타 태그 확인
- [ ] OG 이미지 확인 (카카오톡, 페이스북 공유)
- [ ] Contact 폼 이메일 수신 확인
- [ ] Admin 패널 모든 기능 확인
- [ ] 성능 테스트 (Lighthouse 90+ 목표)

### 10.2 고객에게 전달할 문서:

1. **로그인 정보**
   - Admin 이메일/비밀번호
   - Firebase Console 접근 권한

2. **사용 가이드**
   - Admin 패널 사용법
   - 문의 관리 방법
   - 설정 변경 방법

3. **유지보수 안내**
   - 호스팅 비용 (Firebase 무료 한도)
   - 도메인 연결 방법
   - 추가 기능 개발 문의

---

## 트러블슈팅

### 문제 1: Firebase 배포 실패

```bash
# Firebase 재로그인
firebase logout
firebase login

# 프로젝트 재설정
firebase use client-company-prod

# 재배포
npm run deploy
```

### 문제 2: Admin 로그인 안 됨

```
Firebase Console → Authentication → Users
→ 사용자 확인 및 비밀번호 재설정
```

### 문제 3: 빌드 에러

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 검증
npm run type-check

# 에러 확인 및 수정
```

---

## 다음 단계

- [개발 워크플로우](./development-workflow.md)
- [배포 가이드](./deployment.md)
- [테스트 전략](./testing.md)
