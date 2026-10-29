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
│   │   └── (admin)/      # Admin 페이지
│   ├── features/         # 비즈니스 기능
│   │   ├── home/         # Home 페이지 섹션
│   │   └── admin/        # Admin 기능
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
npm ci
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

위 `npm run dev`는 macOS/Linux용 셸 문법을 사용합니다. Windows PowerShell에서는
환경 변수를 설정한 뒤 `npx --no-install next dev -p 5566`을 실행하세요. 구체적인
명령과 Firebase 미연결 시의 동작은 [개발 인계 문서](docs/DEVELOPMENT-HANDOFF.md)를
참고하세요.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 🏗️ 현재 구현 상태

- `/`: 현재 홈페이지 개발 버전. `/renewal`, `/renewal-b`는 별도 리뉴얼 시안입니다.
- `/admin`: Firebase 인증·권한 설정이 필요합니다. 설정이 없으면 연결 안내가 나옵니다.
- Firebase 설정이 없는 개발 환경에서는 온라인 문의가 접수되지 않습니다. 실제 문의는
  **043-265-6010**으로 안내합니다.
- AI·스톡 자료는 실제 오주건설 현장이나 실적으로 간주하지 않습니다. 영상 실험
  51편은 미채택이며 실제 영상 기반 스크롤은 아직 완성되지 않았습니다.
- 현재 작업은 정적 export를 사용합니다. GitHub 반영은 운영 사이트 배포를 뜻하지 않습니다.

실행 방법, 검증 결과, 보안·배포 전 확인사항과 남은 작업은
[개발 인계 문서](docs/DEVELOPMENT-HANDOFF.md)에 정리했습니다.

## 🔥 Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 설정에서 웹 앱 추가
3. 설정값을 복사하여 `.env.local`에 입력

### 2. Firestore 및 Hosting

운영 Firebase 프로젝트의 데이터와 권한을 변경하기 전 소유자 승인과 규칙·기존
클라이언트 호환성 검토가 필요합니다. 테스트 모드나 기존 규칙을 임의로 게시하지
마세요. 개발·에뮬레이터 및 배포 주의사항은
[개발 인계 문서](docs/DEVELOPMENT-HANDOFF.md)를 참고하세요.

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.5.3, React 19, TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 11
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Forms**: React Hook Form + Zod
- **Utils**: date-fns, clsx, tailwind-merge

## 📖 문서

자세한 개발 가이드는 `build-project/` 디렉토리를 참고하세요:

- [개발 인계 및 현재 상태](docs/DEVELOPMENT-HANDOFF.md)
- [미디어 출처·사용 조건](docs/ASSET-PROVENANCE.md)
- `00-PROJECT-OVERVIEW.md` - 프로젝트 개요
- `01-TECH-STACK.md` - 기술 스택 설명
- `architecture/` - 아키텍처 문서
- `workflows/` - 개발 워크플로우

## 📝 라이선스

Copyright © 2025 오주건설. All rights reserved.
