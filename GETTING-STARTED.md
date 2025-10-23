# 🚀 시작하기 - 오주건설 Next.js 프로젝트

## 📋 전제 조건

- Node.js 20 이상
- npm 또는 yarn
- Firebase 계정 (문의 폼 사용 시)

---

## 🎯 빠른 시작 (Firebase 없이)

Firebase 설정 없이도 프론트엔드만 확인 가능합니다!

### 1단계: 의존성 설치
```bash
npm install
```

### 2단계: 개발 서버 실행
```bash
npm run dev
```

### 3단계: 브라우저에서 확인
```
http://localhost:5566
```

**확인 가능한 기능**:
- ✅ Hero 슬라이더
- ✅ About 섹션
- ✅ Services 섹션
- ✅ CEO Message
- ✅ Timeline
- ✅ Portfolio
- ⚠️ Contact 폼 (Firebase 필요)

---

## 🔥 Firebase 설정 (문의 폼 활성화)

Contact 섹션의 문의 폼을 사용하려면 Firebase 설정이 필요합니다.

### 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `ojuconstruction` (자유롭게 설정)
4. Google Analytics: 선택사항 (비활성화 가능)

### 2단계: 웹 앱 추가

1. Firebase 프로젝트 → "웹 앱 추가" (</> 아이콘)
2. 앱 닉네임: `오주건설 웹사이트`
3. Firebase Hosting 설정: 나중에 체크
4. "앱 등록" 클릭

### 3단계: Firestore Database 활성화

1. Firebase Console → "Firestore Database"
2. "데이터베이스 만들기" 클릭
3. **보안 규칙**: "테스트 모드로 시작" 선택 (30일 제한)
4. 위치: `asia-northeast3` (서울)

### 4단계: 환경변수 설정

1. `.env.example` 복사:
```bash
cp .env.example .env.local
```

2. `.env.local` 파일 열고 Firebase 설정값 입력:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ojuconstruction.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ojuconstruction
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ojuconstruction.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
```

### 5단계: 개발 서버 재시작
```bash
npm run dev
```

### 6단계: Contact 폼 테스트

1. `http://localhost:5566` 접속
2. Contact 섹션으로 스크롤
3. 문의 폼 작성 및 제출
4. Firebase Console → Firestore → `contacts` 컬렉션 확인

---

## 🔒 Firestore 보안 규칙 (프로덕션용)

테스트 모드는 30일 후 만료됩니다. 프로덕션 환경에서는 아래 규칙을 사용하세요:

### Firestore Rules 설정

Firebase Console → Firestore Database → 규칙:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contacts: 모두 생성 가능, Admin만 읽기/수정/삭제
    match /contacts/{contactId} {
      allow create: if true;  // 누구나 문의 작성 가능
      allow read, update, delete: if request.auth != null;  // Admin만
    }
  }
}
```

**규칙 배포**:
1. Firebase Console → Firestore → 규칙 탭
2. 위 코드 복사-붙여넣기
3. "게시" 클릭

---

## 🌐 프로덕션 빌드 및 배포

### 1. 로컬 프로덕션 빌드 테스트

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

브라우저: `http://localhost:5566`

### 2. Firebase Hosting 배포 (권장)

#### 2.1 Firebase CLI 설치
```bash
npm install -g firebase-tools
```

#### 2.2 Firebase 로그인
```bash
firebase login
```

#### 2.3 Firebase 초기화
```bash
firebase init hosting
```

**설정**:
- Hosting 선택
- 프로젝트 선택: 위에서 만든 Firebase 프로젝트
- Public directory: `out`
- Single-page app: `Yes`
- GitHub actions: `No` (선택사항)

#### 2.4 next.config.js 수정

`next.config.js` 파일에 추가:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 정적 내보내기
  images: {
    unoptimized: true,  // Firebase Hosting용
  },
}

module.exports = nextConfig
```

#### 2.5 빌드 및 배포
```bash
# 정적 사이트 빌드
npm run build

# Firebase 배포
firebase deploy
```

#### 2.6 배포 완료!

터미널에 표시된 URL로 접속:
```
Hosting URL: https://ojuconstruction.web.app
```

### 3. Vercel 배포 (대안)

1. [Vercel](https://vercel.com) 가입
2. GitHub 리포지토리 연결
3. 자동 배포

**환경변수 설정**:
- Vercel Dashboard → Settings → Environment Variables
- `.env.local`의 모든 변수 추가

---

## 📁 파일 구조

```
ojuenc/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx     # Home 레이아웃
│   │   │   └── page.tsx       # Home 페이지
│   │   ├── layout.tsx         # Root 레이아웃
│   │   └── globals.css        # 전역 스타일
│   │
│   ├── features/home/
│   │   ├── hero/              # Hero 슬라이더
│   │   ├── about/             # About, CEO
│   │   ├── services/          # 사업분야
│   │   ├── timeline/          # 회사 연혁
│   │   ├── portfolio/         # 시공실적
│   │   └── contact/           # 문의 폼
│   │
│   └── shared/
│       ├── components/layout/ # Header, Footer
│       ├── lib/firebase/      # Firebase 설정
│       ├── lib/utils.ts       # 유틸리티
│       └── config/env.ts      # 환경변수
│
├── public/
│   └── images/                # 이미지 자산
│
└── package.json
```

---

## 🐛 문제 해결

### 1. npm install 오류
```bash
# Node.js 버전 확인 (20 이상 필요)
node -v

# npm 캐시 삭제 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Firebase 연결 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- Firebase 설정값에 따옴표 없이 입력했는지 확인
- 개발 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

### 3. Contact 폼 제출 실패
- Firestore Database가 활성화되어 있는지 확인
- Firestore 보안 규칙 확인 (테스트 모드 or 프로덕션 규칙)
- 브라우저 콘솔에서 에러 메시지 확인

### 4. 이미지 표시 안 됨
- `public/images/` 폴더에 모든 이미지 파일이 있는지 확인
- 개발 서버 재시작

---

## 📞 도움말

더 자세한 정보는 다음 문서를 참고하세요:

- [build-project/00-PROJECT-OVERVIEW.md](./build-project/00-PROJECT-OVERVIEW.md) - 프로젝트 개요
- [build-project/01-TECH-STACK.md](./build-project/01-TECH-STACK.md) - 기술 스택
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Firebase 공식 문서](https://firebase.google.com/docs)

---

## ✅ 체크리스트

### 개발 시작
- [ ] Node.js 20+ 설치 확인
- [ ] `npm install` 실행
- [ ] `npm run dev` 실행
- [ ] `http://localhost:5566` 접속

### Firebase 설정
- [ ] Firebase 프로젝트 생성
- [ ] Firestore Database 활성화
- [ ] `.env.local` 파일 생성 및 설정
- [ ] Contact 폼 테스트

### 프로덕션 배포
- [ ] `npm run build` 성공 확인
- [ ] Firebase CLI 설치 및 로그인
- [ ] `firebase deploy` 실행
- [ ] 배포된 URL 확인

---

🎉 **축하합니다! 오주건설 웹사이트가 준비되었습니다!**
