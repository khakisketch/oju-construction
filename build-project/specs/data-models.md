# Data Models Specification

## 개요

Firestore 데이터 모델 상세 명세입니다. LLM이 자동으로 코드를 생성할 때 이 명세를 참고합니다.

---

## 1. Contacts (문의 데이터)

### Collection: `contacts/{contactId}`

**용도**: Home 페이지 Contact 폼 제출 데이터

**접근 권한**:
- CREATE: Public (누구나)
- READ/UPDATE/DELETE: Admin only

### 데이터 구조

```typescript
interface ContactData {
  // 필수 필드
  id: string                      // Firestore 자동 생성 ID
  name: string                    // 이름 (2-50자)
  email: string                   // 이메일 (유효성 검증)
  message: string                 // 문의 내용 (10-1000자)

  // 선택 필드
  phone?: string                  // 전화번호 (010-1234-5678 형식)
  company?: string                // 회사명

  // 시스템 필드
  status: ContactStatus           // 'new' | 'in_progress' | 'completed'
  createdAt: Timestamp            // 생성 일시
  updatedAt?: Timestamp           // 최종 수정 일시 (상태 변경 시)

  // 메타데이터 (선택)
  source?: string                 // 유입 경로 (예: 'homepage', 'landing-page')
  userAgent?: string              // 사용자 브라우저 정보
  ip?: string                     // IP 주소 (개인정보 주의)
}

type ContactStatus = 'new' | 'in_progress' | 'completed'
```

### 인덱스

```json
{
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

### 예시 데이터

```json
{
  "id": "abc123def456",
  "name": "홍길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "company": "ABC 컴퍼니",
  "message": "웹사이트 제작 견적 문의드립니다.",
  "status": "new",
  "createdAt": "2025-01-15T10:30:00Z",
  "source": "homepage"
}
```

---

## 2. SiteSettings (사이트 설정)

### Collection: `siteSettings/{settingId}`

**용도**: 사이트 전역 설정 (회사 정보, SEO, 미디어)

**접근 권한**:
- READ: Public (모두)
- WRITE: Admin only

### 2.1 General Settings

**Document ID**: `general`

```typescript
interface GeneralSettings {
  // 회사 정보
  siteName: string                // 사이트 이름 (예: "클라이언트 컴퍼니")
  companyName: string             // 회사명 (예: "주식회사 ABC")
  ceoName?: string                // 대표자명
  businessNumber?: string         // 사업자등록번호

  // 주소
  address?: string                // 도로명 주소
  addressDetail?: string          // 상세 주소

  // 연락처
  contactEmail: string            // 대표 이메일
  contactPhone: string            // 대표 전화번호
  contactFax?: string             // 팩스

  // SNS
  instagramUrl?: string           // Instagram URL
  youtubeUrl?: string             // YouTube URL
  facebookUrl?: string            // Facebook URL
  linkedinUrl?: string            // LinkedIn URL

  // 기타
  businessHours?: string          // 영업시간 (예: "평일 09:00 - 18:00")
  copyrightText: string           // 저작권 문구

  // 시스템
  updatedAt: Timestamp            // 최종 수정 일시
  updatedBy?: string              // 수정한 Admin UID
}
```

### 2.2 SEO Settings

**Document ID**: `seo`

```typescript
interface SEOSettings {
  metaTitle: string               // Meta Title (50-60자 권장)
  metaDescription: string         // Meta Description (150-160자 권장)
  metaKeywords?: string           // Meta Keywords (쉼표 구분)

  // Open Graph
  ogTitle?: string                // OG Title (기본: metaTitle)
  ogDescription?: string          // OG Description (기본: metaDescription)
  ogImageUrl?: string             // OG Image URL (1200x630px)

  // Twitter Card
  twitterCard?: 'summary' | 'summary_large_image'
  twitterSite?: string            // Twitter @username

  // 시스템
  updatedAt: Timestamp
  updatedBy?: string
}
```

### 2.3 Media Settings

**Document ID**: `media`

```typescript
interface MediaSettings {
  faviconUrl: string              // Favicon URL (32x32px)
  ogImageUrl: string              // OG Image URL (1200x630px)
  logoUrl?: string                // Logo URL (SVG 또는 PNG)
  logoLightUrl?: string           // Logo (Light mode)
  logoDarkUrl?: string            // Logo (Dark mode)

  // 시스템
  updatedAt: Timestamp
  updatedBy?: string
}
```

### 2.4 Marketing Scripts Settings

**Document ID**: `marketingScripts`

```typescript
interface MarketingScriptsSettings {
  scripts: MarketingScript[]      // 마케팅 스크립트 배열

  // 시스템
  updatedAt: Timestamp
  updatedBy?: string
}

interface MarketingScript {
  id: string                      // 고유 ID
  platform: ScriptPlatform        // 플랫폼 타입
  name: string                    // 스크립트 이름
  scriptId?: string               // GA4 ID, Pixel ID 등
  code?: string                   // Custom script code
  position: 'head' | 'body'       // 삽입 위치
  enabled: boolean                // 활성화 여부
  priority: number                // 우선순위 (낮을수록 먼저 실행)
  createdAt: Timestamp
  updatedAt: Timestamp
}

type ScriptPlatform =
  | 'google_analytics'
  | 'meta_pixel'
  | 'naver_analytics'
  | 'kakao_pixel'
  | 'custom'
```

---

## 3. Users (관리자 정보)

### Collection: `users/{userId}`

**용도**: Admin 사용자 정보

**접근 권한**:
- READ: Admin only
- WRITE: Admin (자신의 정보만) 또는 Super Admin

```typescript
interface User {
  uid: string                     // Firebase Auth UID
  email: string                   // 이메일
  name?: string                   // 이름
  role: UserRole                  // 권한 레벨

  // 프로필
  photoURL?: string               // 프로필 사진 URL
  phoneNumber?: string            // 전화번호

  // 알림 설정
  emailNotifications: boolean     // 이메일 알림 수신 여부

  // 시스템
  createdAt: Timestamp
  lastLoginAt?: Timestamp
  updatedAt?: Timestamp
}

type UserRole = 'admin' | 'super_admin' | 'editor' | 'viewer'
```

---

## 4. AdminSettings (관리자 개인 설정)

### Collection: `adminSettings/{userId}`

**용도**: Admin 개인별 설정 (알림, 테마 등)

**접근 권한**:
- READ/WRITE: Owner (자신의 설정만)

```typescript
interface AdminSettings {
  userId: string                  // User UID

  // 알림 설정
  emailNotifications: boolean     // 이메일 알림
  pushNotifications?: boolean     // 푸시 알림 (향후)

  // UI 설정
  theme?: 'light' | 'dark' | 'auto'
  language?: 'ko' | 'en'

  // 대시보드 설정
  defaultView?: string            // 기본 보기 (예: 'contacts', 'dashboard')

  // 시스템
  updatedAt: Timestamp
}
```

---

## 5. Quotes (견적 요청) - 선택 기능

### Collection: `quotes/{quoteId}`

**용도**: 견적 요청 폼 제출 데이터

**접근 권한**:
- CREATE: Public
- READ/UPDATE/DELETE: Admin only

```typescript
interface QuoteData {
  id: string

  // 기본 정보
  name: string
  email: string
  phone: string
  company?: string

  // 견적 정보
  serviceType: string             // 서비스 종류
  budget?: string                 // 예산
  timeline?: string               // 희망 일정
  description: string             // 상세 내용

  // 첨부 파일
  attachments?: string[]          // Firebase Storage URLs

  // 시스템
  status: QuoteStatus
  createdAt: Timestamp
  updatedAt?: Timestamp
}

type QuoteStatus = 'new' | 'reviewing' | 'quoted' | 'accepted' | 'rejected'
```

---

## 6. BlogPosts (블로그) - 선택 기능

### Collection: `blogPosts/{postId}`

**용도**: Blog 포스트 데이터

**접근 권한**:
- READ: Public (published만) 또는 Admin (모두)
- CREATE/UPDATE/DELETE: Admin only

```typescript
interface BlogPost {
  id: string

  // 콘텐츠
  title: string                   // 제목 (5-100자)
  content: string                 // 본문 (Markdown)
  excerpt: string                 // 요약 (150자)

  // 메타데이터
  author: string                  // 작성자 UID
  category: BlogCategory          // 카테고리
  tags: string[]                  // 태그

  // 미디어
  coverImage?: string             // 커버 이미지 URL

  // 상태
  status: BlogStatus              // 발행 상태

  // SEO
  slug: string                    // URL slug (고유)
  metaTitle?: string
  metaDescription?: string

  // 시스템
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp

  // 통계 (향후)
  viewCount?: number
  likeCount?: number
}

type BlogCategory = 'technology' | 'business' | 'design' | 'marketing' | 'other'
type BlogStatus = 'draft' | 'published' | 'archived'
```

---

## 데이터 검증 규칙

### 공통 규칙

1. **문자열 길이**:
   - name: 2-50자
   - email: 유효한 이메일 형식
   - message/content: 10-1000자
   - phone: 010-XXXX-XXXX 또는 02-XXXX-XXXX 형식

2. **타임스탬프**:
   - 모든 생성/수정 시간은 `serverTimestamp()` 사용
   - 클라이언트 시간 사용 금지

3. **Status Enum**:
   - 정의된 값만 허용
   - 기본값 설정 필수

### Contact 폼 검증

```typescript
// 클라이언트 검증
const validateContactForm = (data: ContactFormData) => {
  if (data.name.length < 2 || data.name.length > 50) {
    throw new Error('이름은 2-50자로 입력해주세요')
  }

  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('유효한 이메일을 입력해주세요')
  }

  if (data.message.length < 10 || data.message.length > 1000) {
    throw new Error('문의 내용은 10-1000자로 입력해주세요')
  }

  // ... 추가 검증
}
```

---

## 7. PushSubscriptions (PWA 푸시 알림 구독) ⭐ NEW

### Collection: `pushSubscriptions/{subscriptionId}`

**용도**: 관리자 PWA 푸시 알림 구독 정보 저장

**접근 권한**:
- CREATE: Admin only (자신의 구독만)
- READ: Admin only (자신의 구독만)
- UPDATE/DELETE: Admin only (자신의 구독만)

### 데이터 구조

```typescript
interface PushSubscription {
  // 필수 필드
  id: string                      // Firestore 자동 생성 ID
  userId: string                  // Admin 사용자 UID
  endpoint: string                // Push Service endpoint URL

  // Push Subscription keys
  keys: {
    p256dh: string                // 공개 키 (Base64)
    auth: string                  // 인증 시크릿 (Base64)
  }

  // 메타데이터
  userAgent: string               // 브라우저 정보
  createdAt: Timestamp            // 구독 시작 시간
  lastUsedAt?: Timestamp          // 마지막 알림 발송 시간

  // 설정
  enabled: boolean                // 알림 활성화 여부 (default: true)
}
```

### 인덱스

```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "enabled", "order": "ASCENDING" }
  ]
}
```

### 예시 데이터

```json
{
  "id": "sub_abc123xyz",
  "userId": "admin_user_uid_123",
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "BF7zJ3A8cTk...",
    "auth": "abc123def456..."
  },
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
  "createdAt": "2025-01-15T14:30:00Z",
  "lastUsedAt": "2025-01-15T16:45:00Z",
  "enabled": true
}
```

### Security Rules

```javascript
// pushSubscriptions: Admin만 자신의 구독 관리
match /pushSubscriptions/{subscriptionId} {
  allow create: if isAdmin() && request.resource.data.userId == request.auth.uid;
  allow read: if isAdmin() && resource.data.userId == request.auth.uid;
  allow update, delete: if isAdmin() && resource.data.userId == request.auth.uid;
}
```

### 사용 예시

```typescript
// 푸시 구독 저장
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

async function savePushSubscription(userId: string, subscription: PushSubscription) {
  const db = getFirestore();

  const data = {
    userId,
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth'))
    },
    userAgent: navigator.userAgent,
    createdAt: Timestamp.now(),
    enabled: true
  };

  await addDoc(collection(db, 'pushSubscriptions'), data);
}
```

### Cloud Functions 연동

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as webpush from 'web-push';

// 새 문의 도착 시 푸시 알림 발송
export const onContactCreate = functions.firestore
  .document('contacts/{contactId}')
  .onCreate(async (snap, context) => {
    const contact = snap.data();

    // 모든 활성화된 구독 정보 가져오기
    const subscriptionsSnapshot = await admin
      .firestore()
      .collection('pushSubscriptions')
      .where('enabled', '==', true)
      .get();

    const payload = {
      title: '📧 새로운 문의가 도착했습니다',
      body: `${contact.name}님이 문의를 남겼습니다.`,
      url: '/admin/contacts',
      icon: '/icon-192x192.png'
    };

    // 모든 구독자에게 알림 발송
    await Promise.all(
      subscriptionsSnapshot.docs.map(async (doc) => {
        const sub = doc.data();
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: sub.keys
        };

        try {
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          // lastUsedAt 업데이트
          await doc.ref.update({
            lastUsedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (error: any) {
          // 410 Gone: 구독 만료됨 → 삭제
          if (error.statusCode === 410) {
            await doc.ref.delete();
          }
        }
      })
    );
  });
```

**관련 문서**: [Admin PWA Notifications](../admin/pwa-notifications.md)

---

## 마이그레이션 가이드

### 기존 데이터 마이그레이션

새 프로젝트에서 기존 데이터를 가져올 경우:

```bash
# Firestore 데이터 내보내기
firebase firestore:export gs://OLD_PROJECT.appspot.com/backup

# Firestore 데이터 가져오기
firebase firestore:import gs://OLD_PROJECT.appspot.com/backup
```

### 스키마 변경 시 주의사항

1. **필수 필드 추가**: 기존 문서에 기본값 설정 필요
2. **필드 이름 변경**: 마이그레이션 스크립트 작성
3. **타입 변경**: 점진적 마이그레이션 권장

---

## 다음 단계

- [API Specification](./api-specification.md)
- [Security Rules](./security-rules.md)
- [Feature Requirements](./feature-requirements.md)
