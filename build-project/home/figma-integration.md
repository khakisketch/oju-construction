# Figma MCP Integration Guide

## 개요

Figma MCP (Model Context Protocol)를 사용하여 Figma 디자인을 Next.js 컴포넌트로 자동 변환하는 가이드입니다.

**목표**: Figma 디자인 파일 → `src/features/home/` 자동 생성 (30분 이내)

---

## 전제 조건

### 1. Figma 파일 준비
- Figma 디자인 완성 (고객 승인 완료)
- **명확한 섹션 구분** 필수
- 컴포넌트 네이밍 일관성
- 반응형 고려된 디자인

### 2. Figma MCP 설정
- Figma API 토큰 발급
- MCP 서버 설정
- 접근 권한 확인

---

## Figma 디자인 체크리스트

### 필수 섹션 구조
Home 페이지는 일반적으로 다음 섹션으로 구성:

```
1. Hero Section (히어로)
   - 대형 타이틀
   - 서브 타이틀
   - CTA 버튼 1-2개
   - 배경 이미지 또는 비디오

2. Services/Features Section (서비스 소개)
   - 3-6개 서비스 카드
   - 아이콘 + 제목 + 설명
   - 그리드 레이아웃

3. Portfolio/Projects Section (포트폴리오)
   - 프로젝트 카드 그리드
   - 이미지 + 타이틀 + 설명
   - 필터링 기능 (선택)

4. About Section (회사 소개)
   - 회사 소개 텍스트
   - 팀 사진 또는 오피스 사진
   - 핵심 가치 또는 연혁

5. Testimonials Section (고객 후기)
   - 고객 리뷰 카드
   - 고객 로고 또는 사진
   - 평점 또는 별점

6. Contact Section (문의)
   - 문의 폼
   - 연락처 정보
   - 지도 (선택)

7. CTA Section (행동 유도)
   - 강력한 메시지
   - CTA 버튼
   - 배경 이미지
```

### 네이밍 규칙
Figma 프레임 이름을 다음과 같이 지정:

```
✅ 좋은 예:
- Hero
- Services
- Portfolio
- About
- Contact
- CTA

❌ 나쁜 예:
- 섹션 1
- Frame 123
- 그룹 456
```

### 컴포넌트 구조
```
✅ 각 섹션은 독립적인 프레임으로 구성
✅ 반복되는 요소는 Figma 컴포넌트로 만들기
✅ Auto Layout 사용 (반응형 대응)
✅ 명확한 레이어 네이밍
```

---

## Claude Code로 Figma 읽기

### Step 1: Figma URL 준비
```
https://www.figma.com/file/FILE_ID/FILE_NAME
```

### Step 2: Claude Code에게 요청

#### 옵션 A: 전체 페이지 자동 생성
```
"Figma 디자인 [Figma URL] 읽어서
 src/features/home/ 폴더에 전체 구현해줘.

 섹션 구성:
 - Hero (대형 타이틀 + CTA)
 - Services (카드 형식)
 - Portfolio (그리드)
 - About (회사 소개)
 - Contact (폼)

 다음 사항 적용:
 - 반응형 디자인 (mobile, tablet, desktop)
 - Framer Motion 애니메이션
 - Tailwind CSS 스타일링
 - WCAG 접근성 준수
 - Next.js 15 App Router 구조

 build-project/home/figma-integration.md 참고해서 진행"
```

#### 옵션 B: 섹션별 생성
```
"Figma 디자인 [Figma URL]에서
 Hero 섹션만 읽어서
 src/features/home/hero/HeroSection.tsx로 구현해줘.

 요구사항:
 - 배경 이미지 또는 그라디언트
 - 타이틀, 서브타이틀, CTA 버튼 2개
 - 반응형 (모바일: 세로 배치, 데스크톱: 가로 배치)
 - Fade-in 애니메이션
 - 접근성 (h1 태그, alt 텍스트)"
```

---

## 생성된 파일 구조

### 예상 출력
```
src/features/home/
├── hero/
│   ├── HeroSection.tsx          # Hero 메인 컴포넌트
│   ├── HeroBackground.tsx       # 배경 이미지/비디오
│   └── HeroCTA.tsx              # CTA 버튼
│
├── services/
│   ├── ServicesSection.tsx      # Services 메인
│   ├── ServiceCard.tsx          # 개별 서비스 카드
│   └── services.data.ts         # 서비스 데이터
│
├── portfolio/
│   ├── PortfolioSection.tsx     # Portfolio 메인
│   ├── PortfolioCard.tsx        # 개별 프로젝트 카드
│   ├── PortfolioFilter.tsx      # 필터링 (선택)
│   └── portfolio.data.ts        # 프로젝트 데이터
│
├── about/
│   ├── AboutSection.tsx         # About 메인
│   └── about.data.ts            # 회사 정보 데이터
│
├── contact/
│   ├── ContactSection.tsx       # Contact 메인
│   ├── ContactForm.tsx          # 문의 폼
│   └── ContactInfo.tsx          # 연락처 정보
│
└── cta/
    └── CTASection.tsx           # CTA 섹션
```

---

## 품질 검증 체크리스트

### 1. 반응형 테스트
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
- Chrome DevTools (F12)
- Responsive Design Mode (Ctrl + Shift + M)
- Mobile (375px), Tablet (768px), Desktop (1920px)
```

**확인 사항**:
- [ ] 모바일: 세로 배치, 터치 가능한 버튼 크기
- [ ] 태블릿: 2열 그리드, 적절한 여백
- [ ] 데스크톱: 3-4열 그리드, 최대 너비 제한

### 2. 애니메이션 검증
```typescript
// Framer Motion 적용 확인
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {children}
</motion.div>
```

**확인 사항**:
- [ ] Fade-in 애니메이션 (스크롤 시)
- [ ] Hover 효과 (버튼, 카드)
- [ ] 부드러운 전환 (0.3-0.6초)

### 3. 접근성 검증
```bash
# Lighthouse 실행
npm run build
npm run start
# Chrome DevTools → Lighthouse → Accessibility
```

**확인 사항**:
- [ ] 시맨틱 HTML (h1, h2, section, article)
- [ ] Alt 텍스트 (모든 이미지)
- [ ] ARIA 속성 (폼, 버튼)
- [ ] 키보드 네비게이션 (Tab, Enter)
- [ ] 색상 대비 (WCAG AA 이상)

### 4. 이미지 최적화
```typescript
// Next.js Image 사용 확인
import Image from 'next/image'

<Image
  src="/images/hero-bg.jpg"
  alt="Hero Background"
  width={1920}
  height={1080}
  priority
/>
```

**확인 사항**:
- [ ] Next.js Image 컴포넌트 사용
- [ ] WebP 포맷 변환
- [ ] Lazy loading (priority 제외)
- [ ] 적절한 width/height 지정

### 5. 성능 검증
```bash
# Lighthouse Performance
npm run build
npm run start
# Chrome DevTools → Lighthouse → Performance
```

**목표 점수**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## 커스터마이징 가이드

### 색상 변경
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#your-color',    // 메인 색상
          secondary: '#your-color',  // 보조 색상
          accent: '#your-color',     // 강조 색상
        }
      }
    }
  }
}
```

### 폰트 변경
```typescript
// src/app/layout.tsx
import { Noto_Sans_KR, Montserrat } from 'next/font/google'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 텍스트 변경
```typescript
// src/features/home/hero/hero.data.ts
export const heroData = {
  title: "고객사별 타이틀",
  subtitle: "고객사별 서브타이틀",
  cta1: {
    text: "상담 신청",
    href: "#contact"
  },
  cta2: {
    text: "포트폴리오 보기",
    href: "#portfolio"
  }
}
```

---

## 트러블슈팅

### 문제 1: Figma MCP 연결 실패
**증상**: Figma 파일을 읽을 수 없음

**해결**:
```bash
# 1. Figma API 토큰 확인
# 2. Figma 파일 공유 설정 확인 (Anyone with the link)
# 3. MCP 서버 재시작
```

### 문제 2: 디자인이 코드와 다름
**증상**: 레이아웃, 색상, 간격이 Figma와 다름

**해결**:
```
"Figma 디자인과 정확히 일치하도록 수정해줘.
 특히 다음 사항:
 - Hero 타이틀 크기: Figma 72px → 현재 64px
 - Services 카드 간격: Figma 32px → 현재 24px
 - 색상: Figma #123456 → 현재 #654321"
```

### 문제 3: 반응형이 제대로 안 됨
**증상**: 모바일에서 레이아웃 깨짐

**해결**:
```
"모바일 반응형 개선해줘.
 - 768px 이하: 1열 배치
 - 버튼 크기 최소 44px (터치 가능)
 - 여백 좌우 16px"
```

### 문제 4: 이미지 로딩 느림
**증상**: 이미지 로딩에 시간이 오래 걸림

**해결**:
```bash
# 1. WebP 변환
npm install sharp
npm run optimize-images

# 2. Priority 설정 (Hero 이미지)
<Image priority src="/hero.jpg" ... />

# 3. Placeholder 추가
<Image placeholder="blur" blurDataURL="..." ... />
```

---

## Figma 디자인 시 권장 사항

### 개발자 친화적 디자인
1. **일관된 간격**: 8px 그리드 시스템
2. **명확한 컴포넌트**: 재사용 가능한 요소는 컴포넌트화
3. **실제 콘텐츠**: Lorem Ipsum 대신 실제 텍스트
4. **상태 표시**: Hover, Active, Disabled 상태
5. **반응형 가이드**: 모바일, 태블릿, 데스크톱 프레임 제공

### 개발 인계 시 제공
- [ ] Figma 파일 링크 (공유 설정: Anyone with the link)
- [ ] 컬러 팔레트 (Hex 코드)
- [ ] 폰트 리스트 (Google Fonts 권장)
- [ ] 아이콘 파일 (SVG)
- [ ] 이미지 에셋 (WebP, 2x 해상도)
- [ ] 디자인 스펙 문서 (간격, 크기, 애니메이션)

---

## 예제: 완성된 Hero 섹션

### Figma 디자인
```
┌─────────────────────────────────────┐
│                                     │
│     Your Business Growth Partner    │
│     ────────────────────────────    │
│     데이터 기반 마케팅으로           │
│     매출 성장을 만듭니다             │
│                                     │
│   [상담 신청]  [포트폴리오 보기]     │
│                                     │
└─────────────────────────────────────┘
```

### 생성된 코드 (예시)
```typescript
// src/features/home/hero/HeroSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold mb-6"
        >
          Your Business Growth Partner
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl mb-8"
        >
          데이터 기반 마케팅으로 매출 성장을 만듭니다
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Button size="lg" onClick={() => window.location.href = '#contact'}>
            상담 신청
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = '#portfolio'}>
            포트폴리오 보기
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 다음 단계

- [Home 커스터마이징](./customization.md)
- [Admin 표준 기능](../admin/standard-features.md)
- [배포 가이드](../workflows/deployment.md)
