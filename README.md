# 오주건설 웹사이트 (Next.js 15)

Next.js 15 + Firebase 기반의 오주건설 공식 웹사이트입니다.

## 🎯 프로젝트 구조

```
ojuenc/
├── build-project/         # 개발 문서 및 가이드
├── legacy-backup/         # 레거시 HTML/CSS/JS 백업
├── public/                # 정적 파일 (이미지)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (public)/     # Home 페이지
│   │   └── admin/        # Admin 패널 (구현 예정)
│   ├── features/         # 비즈니스 기능
│   │   ├── home/         # Home 페이지 섹션
│   │   └── admin/        # Admin 기능 (구현 예정)
│   ├── shared/           # 공통 코드
│   │   ├── components/   # 공통 컴포넌트
│   │   ├── lib/          # 라이브러리
│   │   ├── utils/        # 유틸리티
│   │   └── config/       # 설정
│   └── core/             # 프레임워크 레벨
└── package.json
```

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 Firebase 설정값을 입력하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5566` 접속

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 🏗️ 현재 구현 상태

### ✅ 완료
- [x] Next.js 15 프로젝트 설정
- [x] Tailwind CSS 설정
- [x] Firebase 초기화
- [x] Header & Footer
- [x] Hero 섹션 (2개 슬라이더, 자동 전환)
- [x] About 섹션 (회사 소개, 통계)
- [x] CEO Message 섹션 (대표 인사말)
- [x] Services 섹션 (5개 사업분야)
- [x] Timeline 섹션 (회사 연혁)
- [x] Portfolio 섹션 (4개 시공실적)
- [x] Contact 섹션 (Firestore 연동 문의 폼)

### 🔨 진행 예정
- [ ] Admin 패널 (문의 관리, 설정)
- [ ] Firebase Hosting 배포
- [ ] 반응형 최적화
- [ ] 성능 최적화

## 🎯 구현된 기능

### Home 페이지 섹션 (7개)
1. **Hero** - 자동 슬라이더 (2개 슬라이드, 5초 간격)
2. **About** - 회사 소개, 이미지, 통계 (15+ 면허, 200+ 프로젝트)
3. **Services** - 5개 사업분야 그리드
4. **CEO Message** - 대표 인사말
5. **Timeline** - 회사 연혁 (2004~2022)
6. **Portfolio** - 4개 주요 시공실적
7. **Contact** - Firestore 연동 문의 폼

### 공통 기능
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ Framer Motion 애니메이션
- ✅ Firebase Firestore 연동
- ✅ 스크롤 애니메이션
- ✅ 이미지 최적화 (Next.js Image)

## 🔥 Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 설정에서 웹 앱 추가
3. 설정값을 복사하여 `.env.local`에 입력

### 2. Firestore Database 생성
1. Firestore Database 활성화
2. 테스트 모드로 시작

### 3. Firebase Hosting 설정 (선택)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.5.3, React 19, TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 11
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Forms**: React Hook Form + Zod
- **Utils**: date-fns, clsx, tailwind-merge

## 📖 문서

자세한 개발 가이드는 `build-project/` 디렉토리를 참고하세요:

- `00-PROJECT-OVERVIEW.md` - 프로젝트 개요
- `01-TECH-STACK.md` - 기술 스택 설명
- `architecture/` - 아키텍처 문서
- `workflows/` - 개발 워크플로우

## 📝 라이선스

Copyright © 2025 오주건설. All rights reserved.
