# Deployment Guide

## 개요

Firebase Hosting을 사용한 자동 배포 가이드입니다.

**목표**: 로컬 개발 → 프로덕션 배포 (5분 이내)

---

## 전제 조건

### 1. Firebase 프로젝트 생성
- Firebase Console에서 프로젝트 생성 완료
- Hosting, Firestore, Storage 활성화
- Firebase CLI 설치 및 로그인

### 2. 환경 변수 설정
- `.env.local` 파일 생성
- Firebase 설정 정보 입력
- 사이트 기본 정보 입력

### 3. 로컬 빌드 테스트
- `npm run build` 성공
- `npm run start`로 로컬 테스트 완료

---

## 배포 프로세스

### Step 1: 사전 검증

```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 검증
npm run lint

# 테스트 실행 (선택)
npm run test
```

**모든 검증 통과 확인** 후 다음 단계 진행

---

### Step 2: 프로덕션 빌드

```bash
# Next.js 프로덕션 빌드
npm run build
```

**빌드 출력 예시**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         92.1 kB
├ ○ /admin                               8.4 kB         95.3 kB
├ ○ /admin/contacts                      12.1 kB        99.0 kB
└ ○ /admin/settings                      15.3 kB        102.2 kB

○  (Static)  prerendered as static content
```

**빌드 성공 확인**:
- `.next/` 디렉토리 생성됨
- 빌드 에러 없음
- Bundle size 확인 (권장: First Load JS < 200KB)

---

### Step 3: 로컬에서 프로덕션 테스트

```bash
# 프로덕션 모드로 로컬 실행
npm run start
```

브라우저에서 http://localhost:3000 접속

**테스트 체크리스트**:
- [ ] Home 페이지 정상 렌더링
- [ ] Admin 로그인 성공
- [ ] Contact 폼 제출 작동
- [ ] 이미지 로딩 정상
- [ ] 반응형 레이아웃 확인

---

### Step 4: Firebase 배포

#### 옵션 A: 자동 배포 스크립트 (권장)

```bash
npm run deploy
```

**자동 실행 항목**:
1. Next.js 빌드
2. Firebase 인증 확인
3. Hosting 배포
4. Firestore 규칙 배포
5. Storage 규칙 배포

#### 옵션 B: 수동 배포

```bash
# 1. Next.js 빌드
npm run build

# 2. Firebase 배포
firebase deploy
```

**배포 출력 예시**:
```
=== Deploying to 'client-company-prod'...

i  deploying firestore, storage, hosting
i  firestore: reading indexes from firestore.indexes.json...
i  storage: reading storage.rules...
i  hosting[client-company-prod]: beginning deploy...
i  hosting[client-company-prod]: found 127 files in .next
✔  hosting[client-company-prod]: file upload complete
i  hosting[client-company-prod]: finalizing version...
✔  hosting[client-company-prod]: version finalized
i  hosting[client-company-prod]: releasing new version...
✔  hosting[client-company-prod]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/client-company-prod/overview
Hosting URL: https://client-company-prod.web.app
```

---

### Step 5: 배포 검증

#### 5.1 사이트 접속
```
https://your-project-id.web.app
```

#### 5.2 기능 테스트
- [ ] Home 페이지 로드
- [ ] Admin 로그인
- [ ] Contact 폼 제출
- [ ] 이미지 표시
- [ ] 반응형 확인 (모바일, 태블릿, 데스크톱)

#### 5.3 성능 테스트
```bash
# Lighthouse 실행
# Chrome DevTools → Lighthouse → Run
```

**목표 점수**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

#### 5.4 SEO 확인
- [ ] Meta Title 표시
- [ ] Meta Description 표시
- [ ] OG Image 표시 (카카오톡, 페이스북 공유)
- [ ] Favicon 표시

---

## Firebase 설정 파일

### firebase.json
```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### firestore.rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Admin 권한 확인 함수
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Contacts: Public can create, Admin can read/update/delete
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }

    // Site Settings: Admin only
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

### storage.rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public folder: Everyone can read, Admin can write
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Private folder: Admin only
    match /private/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

---

## 커스텀 도메인 연결

### Step 1: 도메인 준비
- 도메인 구매 (예: Gabia, Cafe24)
- DNS 관리 패널 접근 권한 확인

### Step 2: Firebase Hosting 설정
1. Firebase Console → Hosting → Add custom domain
2. 도메인 입력 (예: `www.client-company.com`)
3. TXT 레코드 복사

### Step 3: DNS 설정
도메인 관리 패널에서 다음 레코드 추가:

```
# TXT 레코드 (소유권 확인용)
Type: TXT
Name: @
Value: [Firebase에서 제공한 값]

# A 레코드 (IPv4)
Type: A
Name: @
Value: [Firebase에서 제공한 IP]

# A 레코드 (IPv4)
Type: A
Name: www
Value: [Firebase에서 제공한 IP]
```

### Step 4: SSL 인증서
Firebase가 자동으로 Let's Encrypt SSL 인증서 발급 (24-48시간 소요)

**확인**:
```
https://www.client-company.com
```

---

## 환경별 배포 전략

### 개발 환경 (Development)
```bash
# 로컬 개발 서버
npm run dev

# URL: http://localhost:5566
# 용도: 개발 및 테스트
```

### 스테이징 환경 (Staging)
```bash
# Firebase 스테이징 프로젝트로 배포
firebase use staging
firebase deploy

# URL: https://client-company-staging.web.app
# 용도: 고객 검토 및 최종 테스트
```

### 프로덕션 환경 (Production)
```bash
# Firebase 프로덕션 프로젝트로 배포
firebase use production
firebase deploy

# URL: https://client-company-prod.web.app
# 용도: 최종 배포 및 운영
```

---

## CI/CD 자동화 (선택)

### GitHub Actions 설정

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: client-company-prod
```

**설정 방법**:
1. Firebase Console → 프로젝트 설정 → 서비스 계정
2. 새 비공개 키 생성
3. GitHub Repository → Settings → Secrets → Add secret
4. `FIREBASE_SERVICE_ACCOUNT` 이름으로 JSON 내용 추가

---

## 배포 롤백

### 이전 버전으로 복구
```bash
# Firebase Hosting 버전 목록 확인
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION TARGET_SITE_ID

# 예시: 버전 abc123으로 롤백
firebase hosting:clone client-company-prod:abc123 client-company-prod
```

### Git으로 복구
```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push

# 자동 배포 트리거 (GitHub Actions 사용 시)
```

---

## 모니터링 및 로그

### Firebase Console
- **Hosting**: 배포 내역, 트래픽, 대역폭
- **Firestore**: 문서 수, 읽기/쓰기 횟수
- **Authentication**: 사용자 수, 로그인 횟수

### Google Analytics 4
```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
```

---

## 트러블슈팅

### 문제 1: 배포 실패 - "Authentication Error"
**증상**: Firebase 배포 시 인증 에러

**해결**:
```bash
firebase logout
firebase login
firebase use your-project-id
firebase deploy
```

### 문제 2: 배포 후 404 에러
**증상**: 특정 페이지에서 404 에러 발생

**원인**: firebase.json의 rewrites 설정 누락

**해결**:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 문제 3: 이미지 로딩 안 됨
**증상**: 배포 후 이미지가 표시되지 않음

**원인**: public/ 폴더가 빌드에 포함되지 않음

**해결**:
```bash
# public/ 폴더를 .next/에 복사
cp -r public .next/

# 재배포
firebase deploy
```

### 문제 4: 캐시 문제
**증상**: 배포했는데 변경사항이 반영되지 않음

**해결**:
```bash
# 브라우저 캐시 강제 새로고침
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# 또는 브라우저 캐시 삭제
```

### 문제 5: 빌드 메모리 부족
**증상**: `JavaScript heap out of memory` 에러

**해결**:
```bash
# Node.js 메모리 증가
export NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

---

## 성능 최적화

### 이미지 최적화
```typescript
// Next.js Image 사용
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
/>
```

### 코드 스플리팅
```typescript
// Dynamic import로 번들 크기 줄이기
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

### CDN 캐싱
```json
// firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

---

## 비용 관리

### Firebase 무료 한도 (Spark Plan)
- **Hosting**: 10GB 저장용량, 360MB/일 전송량
- **Firestore**: 1GB 저장용량, 50K 읽기/일, 20K 쓰기/일
- **Storage**: 5GB 저장용량, 1GB/일 다운로드

### 유료 플랜 (Blaze Plan)
- **종량제**: 사용량에 따라 과금
- **Hosting**: $0.026/GB (저장), $0.15/GB (전송)
- **Firestore**: $0.18/GB (저장), $0.06/100K (읽기), $0.18/100K (쓰기)

**권장사항**:
- 소규모 프로젝트는 Spark Plan 사용
- 트래픽 예상치 초과 시 Blaze Plan 전환
- Firebase Console에서 사용량 모니터링

---

## 배포 체크리스트

### 배포 전
- [ ] TypeScript 에러 없음
- [ ] Lint 에러 없음
- [ ] 로컬 빌드 성공
- [ ] 로컬 프로덕션 테스트 완료
- [ ] 환경 변수 확인
- [ ] Git 커밋 완료

### 배포 중
- [ ] Firebase 인증 성공
- [ ] Hosting 배포 성공
- [ ] Firestore 규칙 배포 성공
- [ ] Storage 규칙 배포 성공
- [ ] 배포 URL 확인

### 배포 후
- [ ] 사이트 접속 확인
- [ ] 모든 페이지 로드 테스트
- [ ] Admin 로그인 테스트
- [ ] Contact 폼 제출 테스트
- [ ] Lighthouse 점수 확인 (90+)
- [ ] OG 이미지 확인 (SNS 공유)
- [ ] 커스텀 도메인 작동 확인 (해당 시)

---

## 다음 단계

- [새 프로젝트 시작](./new-project-setup.md)
- [개발 워크플로우](./development-workflow.md)
- [Admin 표준 기능](../admin/standard-features.md)
