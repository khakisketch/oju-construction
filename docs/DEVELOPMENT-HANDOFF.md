# 개발 인계 · 2026-10-29

## 저장소와 상태

- GitHub: <https://github.com/khakisketch/oju-construction> (공개 저장소).
- 기본 브랜치는 `main`이 아니라 **`master`**다. 원격의 기본 브랜치를 임의로
  이름 변경하지 않았다.
- `/`는 개발 중인 홈페이지, `/renewal`과 `/renewal-b`는 별도 리뉴얼 시안이다.
  `docs/renewal-b-paver-hybrid-proposal-2026-10-28.html`은 별도 정적 보도블럭
  단면 시안이다. GitHub 반영은 운영 사이트나 Firebase 배포가 아니다.
- 실제 오주건설 현장 사진·도면·실적·기술 검수는 아직 확보되지 않았다. AI 이미지,
  참고 영상 및 단면 모식은 실적, 현장 증거 또는 검증된 물리 시뮬레이션이 아니다.
- 로컬 영상 **51편**을 생성했지만 자연스러운 완성 영상으로 채택된 것은 없다.
  최근 프롬프트 비교도 기각됐고, AI 영상 프레임을 B안 스크롤에 연결하지 않았다.
  전체 판정과 정확한 프롬프트·모델·설정은
  [영상 실험 기록](paver-video-ai-provenance-2026-10-28.md)에 있다.

## 다른 컴퓨터에서 시작

```bash
git clone https://github.com/khakisketch/oju-construction.git
cd oju-construction
npm ci
npm run dev
```

macOS/Linux에서는 <http://localhost:5566/> 및
<http://localhost:5566/renewal-b>를 연다. 웹 앱의 빌드·테스트는 Node.js 24에서
확인했다. `functions/package.json`의 엔진은 Node.js 20이다. Node.js, npm과 각
환경의 의존성은 별도로 설치해야 한다.

Cloud Functions 코드도 수정하려면 별도 패키지의 lockfile로 의존성을 설치한다.
설치·빌드는 로컬 작업이며 배포가 아니다.

```bash
npm ci --prefix functions
npm --prefix functions run build
```

현재 `npm run dev`의 환경 변수 지정은 POSIX 셸 문법이다. Windows PowerShell은
대신 아래처럼 실행한다. `.next-dev`는 개발 산출물이며 정적 빌드의 `.next`와 분리된다.

```powershell
$env:NEXT_DIST_DIR = '.next-dev'
npx --no-install next dev -p 5566
```

Firebase 없이도 프론트엔드를 볼 수 있다. 온라인 문의·관리자 접속을 쓰려면
프로젝트 소유자에게 승인된 설정을 별도로 받아 `.env.example`을 `.env.local`로
복사해 채운 뒤 서버를 재시작한다. 현재 점검 환경은 Firebase가 연결되지 않아
문의가 전송되지 않으며, 실제 문의는 **043-265-6010**이다. Firebase가 연결된
환경의 양식은 실제 데이터를 전송할 수 있다. 실제 문의로 시험하지 않는다.

`.env.local`, 인증서, 서비스 계정 키, SMTP 비밀번호와 실제 문의 데이터는 Git에
넣지 않는다. `NEXT_PUBLIC_` 값은 브라우저에 포함되는 웹 설정이며 비밀값 보관
장소가 아니다. Firebase 서비스·권한·데이터는 새 컴퓨터로 자동 복사되지 않는다.

## 별도 정적 시안 열기

저장소 루트에서 로컬 파일 서버를 실행하고 아래 경로를 연다. Python 설치가 필요하다.

```bash
python3 -m http.server 5578 --bind 127.0.0.1
```

- <http://127.0.0.1:5578/docs/renewal-b-paver-hybrid-proposal-2026-10-28.html>
- <http://127.0.0.1:5578/docs/paver-ai-video-fourth-review-2026-10-29.html>

시안의 문의 양식은 전송되지 않는다. 직접 `file://`로 열면 브라우저의 보안 정책으로
영상 로딩이 실패할 수 있다. 이전 Tailscale 임시 링크는 원래 컴퓨터·설정이 유지될
때만 사용 가능하며 저장소를 복제해도 자동 생성되지 않는다.

## 확인한 명령과 미확인 항목

2026-10-29 현재 체크아웃에서 실행했다. 빌드는 Firebase 미설정, Node.js 24 환경이다.

```bash
npm run type-check
node --test
npm run build
npm --prefix functions run build
```

- 네 명령이 통과했으며 `node --test`는 54개 성공이다. Firestore 규칙 관련 일부
  테스트는 **규칙 모의 검사**이며 Firebase 에뮬레이터나 운영 서비스 검증이 아니다.
- 별도 빈 디렉터리에 Git 인계 대상 트리를 복사해 `npm ci`, `npm ci --prefix functions`,
  위 빌드·테스트와 별도 loopback 개발 서버의 홈·B안·CSS/JS를 확인했다. Functions
  의존성 설치는 Node.js 24에서 엔진 경고가 발생했으며 Node.js 20에서는 미검증이다.
- 홈·B안과 정적 단면을 Chrome의 모바일 크기 모의 화면에서 확인했다. 실제 휴대전화,
  iOS Safari, 스크린리더, 실제 고객 및 현장 기술자의 검수는 미완료다.
- `npm run lint`는 ESLint 설정이 없어 대화형 설정을 요청하고 실패했다. 빌드 성공을
  별도의 lint 통과로 해석하지 말 것. 설정과 기존 오류를 다음 개발에서 검토한다.
- `npm audit --omit=dev`는 10개 취약점(그중 high 6개, critical 3개)을 보고했다.
  Next.js 15.5.3 등 의존성 경로·영향과 안전한 업데이트를 검토해야 한다. 감사 결과만으로
  각 취약점의 실제 악용 가능성이나 정적 배포의 영향을 단정하지 않는다.

## 운영 서비스 변경 전 필수 검토

**이 인계는 운영 배포, Firebase 규칙 적용이나 데이터 이전을 승인하지 않는다.**

1. `firestore.rules`의 새 문의 생성은 `inquiryType`을 요구한다. 저장소 기준 이전
   홈페이지의 문의 요청에는 이 필드가 없으므로 규칙만 먼저 적용하면 이전 클라이언트의
   문의가 거부될 수 있다. 기존 클라이언트·기존 데이터 및 롤백을 포함해 호환성을
   에뮬레이터와 승인된 테스트 환경에서 검증한다.
2. `storage.rules`는 현재 `request.auth != null`이면 지정된 공개 미디어 경로에
   업로드할 수 있다. 이것은 Firestore의 `admin` 클레임/`admins/{uid}` 관리자
   판정과 다르며, 일반 로그인 계정이 존재하면 미디어 덮어쓰기 위험이 있다. 실제
   인증 정책과 권한을 확인한 뒤 별도 승인·테스트를 거쳐 수정한다.
3. `functions/src/index.ts`는 문의에서 온 문자열을 HTML 알림에 직접 삽입한다.
   공개 문의를 통한 HTML 삽입 가능성을 검토하고 안전한 이스케이프와 테스트를
   적용하기 전까지 알림 기능을 배포 준비 완료로 간주하지 않는다.
4. `npm run deploy`, `firebase deploy`, rules 게시와 실데이터 시험은 별도 승인 후에만
   수행한다. 관리자 계정, 프로젝트, SMTP 비밀값과 실제 운영 상태는 여기서 검증하지 않았다.

## 파일·출처·인계 범위

- [미디어 출처와 조건](ASSET-PROVENANCE.md),
  [하이브리드 시안 출처](paver-hybrid-provenance-2026-10-28.md),
  [영상 실험 기록](paver-video-ai-provenance-2026-10-28.md)을 함께 읽는다.
- `docs/media/`와 `docs/ai-workflows/`의 영상·참고 이미지·프롬프트는 실패 및
  비교를 보존한 연구 자료다. 모델 가중치와 전체 원본 PNG 프레임은 포함되지 않는다.
  실행 스크립트에는 원래 기기의 절대 경로가 있어 수정과 환경 재구축이 필요하다.
- 테스트 서버 로그, 임시 브라우저 스냅샷 및 실행 시점 임시 정보는 공개 인계에서
  제외하고 원래 컴퓨터에 보존한다. 실험의 `SHA256SUMS`에는 제외된 파일이 포함될
  수 있다. 포함된 파일만 확인하려면 해당 디렉터리에서 GNU
  `sha256sum -c --ignore-missing SHA256SUMS`를 사용하고, 누락 파일은 검증된 것으로
  간주하지 않는다.
- 원본 출처가 확인되지 않은 `public/images/methods/method-paving.webp`와
  `method-walkway.webp`는 원래 컴퓨터에만 남겼다. 현재 사용되지 않는 공법 컴포넌트는
  출처가 기록된 AI 예시 이미지를 사용하도록 조정했다. 홈페이지의
  `sample-parking-*` 세 이미지는 공개·배포 권한을 보유하고 있다는 사용자의 확인을
  받아 포함했다. 제작 모델과 독립적인 권리 검증 기록은 없다. 내부 의사결정용 시장조사와
  기획 자료도 공개 저장소에 올리지 않았다.
- 로컬의 오래된 `redesign-wip`은 별도 백업 브랜치다. 현재 작업과 충돌할 수 있어
  기본 브랜치에 자동 병합하지 않았다. GitHub에 없는 로컬 전용 브랜치나 임시 디렉터리는
  복제만으로 다른 컴퓨터에 나타나지 않는다.

다음 작업은 믿을 만한 동일 구도의 전·후 자료를 확보하고, 현장 전문가와 사용권을
확인한 뒤 블럭 형태를 유지하는 영상을 다시 시험하는 것이다. 영상 합격 전에는 기존
시안에 연결하지 않는다.
