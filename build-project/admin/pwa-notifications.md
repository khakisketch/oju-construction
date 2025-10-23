# Admin PWA Push Notifications (관리자 푸시 알림)

## 개요

**관리자 전용 PWA Push Notification** 시스템으로, 새로운 문의/견적이 도착하면 즉시 관리자에게 알림을 보냅니다.

**핵심 특징**:
- 🔔 **실시간 알림**: 새 문의/견적 도착 즉시 알림
- 📱 **PWA 기반**: 브라우저 Push API 사용 (앱 설치 불필요)
- 🔐 **관리자 전용**: Admin 로그인 시에만 구독 가능
- 🎯 **자동 발송**: Firestore Trigger로 자동 알림 발송
- ⚙️ **설정 관리**: Admin Settings에서 알림 On/Off

---

## 알림 발송 시나리오

### 1. 새 문의 도착
```
1. 고객이 Home 페이지 Contact 폼 제출
   ↓
2. Firestore contacts/ 컬렉션에 저장
   ↓
3. Cloud Function (onContactCreate) 트리거
   ↓
4. 모든 구독된 관리자에게 Push 알림 발송
   ↓
5. 관리자 브라우저/모바일에서 알림 표시
```

**알림 내용**:
```
제목: 📧 새로운 문의가 도착했습니다
내용: [고객명]님이 문의를 남겼습니다.
클릭 시: /admin/contacts로 이동
```

---

### 2. 새 견적 요청 도착
```
1. 고객이 Home 페이지 Quote Modal 제출
   ↓
2. Firestore quotes/ 컬렉션에 저장
   ↓
3. Cloud Function (onQuoteCreate) 트리거
   ↓
4. 모든 구독된 관리자에게 Push 알림 발송
   ↓
5. 관리자 브라우저/모바일에서 알림 표시
```

**알림 내용**:
```
제목: 💼 새로운 견적 요청이 도착했습니다
내용: [고객명]님이 견적을 요청했습니다.
클릭 시: /admin/quotes로 이동
```

---

## 기술 아키텍처

### 1. Service Worker

**파일 위치**: `public/sw.js`

```javascript
// Service Worker 등록
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'default',
    data: {
      url: data.url || '/admin'
    },
    requireInteraction: true, // 사용자가 직접 닫을 때까지 표시
    vibrate: [200, 100, 200], // 진동 패턴 (모바일)
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 시 동작
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url;

  event.waitUntil(
    clients.openWindow(url)
  );
});
```

---

### 2. VAPID Keys 생성

**한 번만 실행** (프로젝트당 1회):

```bash
# web-push 라이브러리 설치
npm install web-push --save-dev

# VAPID keys 생성 스크립트 실행
npx web-push generate-vapid-keys
```

**출력 예시**:
```
=======================================
Public Key:
BF7zJ...공개키...xyz123

Private Key:
abc456...비밀키...789def
=======================================
```

**환경변수 저장** (`.env.local`):
```bash
# VAPID Keys (Push Notification)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BF7zJ...공개키...xyz123
VAPID_PRIVATE_KEY=abc456...비밀키...789def
```

⚠️ **중요**: Private Key는 절대 클라이언트에 노출하면 안 됨!

---

### 3. Firestore 데이터 모델

#### pushSubscriptions Collection

```typescript
interface PushSubscription {
  id: string                    // 문서 ID (자동 생성)
  userId: string                // Admin 사용자 UID
  endpoint: string              // Push Service endpoint
  keys: {
    p256dh: string              // 공개 키
    auth: string                // 인증 시크릿
  }
  userAgent: string             // 브라우저 정보
  createdAt: Timestamp          // 구독 시작 시간
  lastUsedAt?: Timestamp        // 마지막 알림 발송 시간
  enabled: boolean              // 알림 활성화 여부 (default: true)
}
```

**Firestore 경로**:
```
/pushSubscriptions/{subscriptionId}
```

**예시 데이터**:
```json
{
  "id": "sub_abc123",
  "userId": "user_xyz789",
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "BF7zJ...",
    "auth": "abc123..."
  },
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "createdAt": Timestamp,
  "lastUsedAt": Timestamp,
  "enabled": true
}
```

---

### 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Push Subscriptions: Admin만 자신의 구독 관리
    match /pushSubscriptions/{subscriptionId} {
      allow create: if isAdmin() && request.resource.data.userId == request.auth.uid;
      allow read: if isAdmin() && resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin() && resource.data.userId == request.auth.uid;
    }

    // Admin 권한 확인
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 클라이언트 구현 (Next.js)

### 1. Service Worker 등록

**파일**: `src/shared/lib/pwa/registerServiceWorker.ts`

```typescript
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker를 지원하지 않는 브라우저입니다.');
  }

  if (!('PushManager' in window)) {
    throw new Error('Push API를 지원하지 않는 브라우저입니다.');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('Service Worker 등록 성공:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker 등록 실패:', error);
    throw error;
  }
}
```

---

### 2. Push 구독 요청

**파일**: `src/features/admin/notifications/services/pushNotificationService.ts`

```typescript
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

// Base64 → Uint8Array 변환
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush(userId: string) {
  try {
    // 1. Service Worker 등록 확인
    const registration = await navigator.serviceWorker.ready;

    // 2. Push Manager 구독 요청
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // 3. Firestore에 구독 정보 저장
    const db = getFirestore();
    const subscriptionData = {
      userId,
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth'))
      },
      userAgent: navigator.userAgent,
      createdAt: new Date(),
      enabled: true
    };

    await addDoc(collection(db, 'pushSubscriptions'), subscriptionData);

    console.log('Push 구독 성공:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push 구독 실패:', error);
    throw error;
  }
}

export async function unsubscribeFromPush(userId: string) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();

      // Firestore에서 구독 정보 삭제
      const db = getFirestore();
      const q = query(
        collection(db, 'pushSubscriptions'),
        where('userId', '==', userId),
        where('endpoint', '==', subscription.endpoint)
      );
      const querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        await doc.ref.delete();
      }

      console.log('Push 구독 해제 성공');
    }
  } catch (error) {
    console.error('Push 구독 해제 실패:', error);
    throw error;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
```

---

### 3. 알림 권한 요청 UI

**파일**: `src/features/admin/notifications/components/NotificationPrompt.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToPush } from '../services/pushNotificationService';
import { Button } from '@/shared/components/ui/button';
import { BellIcon, BellOffIcon } from 'lucide-react';

export default function NotificationPrompt() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!user) return;

    // 현재 권한 상태 확인
    setPermission(Notification.permission);

    // 구독 상태 확인
    checkSubscription();

    // 로그인 후 5초 뒤에 프롬프트 표시 (권한이 없는 경우만)
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
    }
  }

  async function handleEnableNotifications() {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted' && user) {
        await subscribeToPush(user.uid);
        setIsSubscribed(true);
        setShowPrompt(false);
        alert('알림이 활성화되었습니다! 🎉');
      } else if (permission === 'denied') {
        alert('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      }
    } catch (error) {
      console.error('알림 활성화 실패:', error);
      alert('알림 활성화 중 오류가 발생했습니다.');
    }
  }

  function handleDismiss() {
    setShowPrompt(false);
    // 나중에 다시 표시 안 함 (로컬 스토리지)
    localStorage.setItem('notification-prompt-dismissed', 'true');
  }

  // 이미 권한이 있거나 이전에 닫았으면 표시 안 함
  if (permission !== 'default' || !showPrompt) {
    return null;
  }

  // localStorage에서 이전 닫기 기록 확인
  if (typeof window !== 'undefined') {
    const dismissed = localStorage.getItem('notification-prompt-dismissed');
    if (dismissed) return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <BellIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              알림 허용
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              새로운 문의나 견적 요청이 도착하면 즉시 알림을 받으시겠습니까?
            </p>
            <div className="flex gap-2">
              <Button onClick={handleEnableNotifications} className="flex-1">
                허용
              </Button>
              <Button onClick={handleDismiss} variant="outline" className="flex-1">
                나중에
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 4. Admin Settings 알림 설정

**파일**: `src/features/admin/settings/components/NotificationSettings.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToPush, unsubscribeFromPush } from '../../notifications/services/pushNotificationService';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { BellIcon, BellOffIcon } from 'lucide-react';

export default function NotificationSettings() {
  const { user } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPushSubscription();
  }, [user]);

  async function checkPushSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setPushEnabled(!!subscription);
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
    }
  }

  async function handleTogglePush(enabled: boolean) {
    if (!user) return;

    setLoading(true);
    try {
      if (enabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await subscribeToPush(user.uid);
          setPushEnabled(true);
          alert('푸시 알림이 활성화되었습니다! 🎉');
        } else {
          alert('알림 권한이 거부되었습니다.');
        }
      } else {
        await unsubscribeFromPush(user.uid);
        setPushEnabled(false);
        alert('푸시 알림이 비활성화되었습니다.');
      }
    } catch (error) {
      console.error('푸시 알림 설정 실패:', error);
      alert('설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">알림 설정</h3>

        {/* 푸시 알림 */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center gap-3">
            {pushEnabled ? (
              <BellIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <BellOffIcon className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900">푸시 알림</p>
              <p className="text-sm text-gray-500">
                새로운 문의/견적 도착 시 브라우저 알림
              </p>
            </div>
          </div>
          <Switch
            checked={pushEnabled}
            onCheckedChange={handleTogglePush}
            disabled={loading}
          />
        </div>

        {/* 이메일 알림 (기존) */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" /* 이메일 아이콘 */ />
            <div>
              <p className="font-medium text-gray-900">이메일 알림</p>
              <p className="text-sm text-gray-500">
                새로운 문의/견적 도착 시 이메일 발송
              </p>
            </div>
          </div>
          <Switch
            checked={true}
            disabled
          />
        </div>
      </div>

      {/* 브라우저 지원 여부 확인 */}
      {!('Notification' in window) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ 현재 브라우저는 푸시 알림을 지원하지 않습니다.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 서버 구현 (Cloud Functions)

### 1. Cloud Functions 설정

**파일**: `functions/src/index.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as webpush from 'web-push';

admin.initializeApp();

// VAPID 설정
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// 모든 관리자 구독 정보 가져오기
async function getAdminSubscriptions() {
  const subscriptionsSnapshot = await admin
    .firestore()
    .collection('pushSubscriptions')
    .where('enabled', '==', true)
    .get();

  return subscriptionsSnapshot.docs.map(doc => doc.data());
}

// Push 알림 발송
async function sendPushNotification(subscription: any, payload: any) {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }
  };

  try {
    await webpush.sendNotification(pushSubscription, JSON.stringify(payload));

    // lastUsedAt 업데이트
    await admin
      .firestore()
      .collection('pushSubscriptions')
      .doc(subscription.id)
      .update({
        lastUsedAt: admin.firestore.FieldValue.serverTimestamp()
      });
  } catch (error: any) {
    console.error('Push 알림 발송 실패:', error);

    // 410 Gone: 구독 만료됨 → 삭제
    if (error.statusCode === 410) {
      await admin
        .firestore()
        .collection('pushSubscriptions')
        .doc(subscription.id)
        .delete();
    }
  }
}

// 새 문의 도착 시 알림
export const onContactCreate = functions.firestore
  .document('contacts/{contactId}')
  .onCreate(async (snap, context) => {
    const contact = snap.data();

    const payload = {
      title: '📧 새로운 문의가 도착했습니다',
      body: `${contact.name}님이 문의를 남겼습니다.`,
      url: '/admin/contacts',
      tag: 'contact-new',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    };

    const subscriptions = await getAdminSubscriptions();

    await Promise.all(
      subscriptions.map(sub => sendPushNotification(sub, payload))
    );
  });

// 새 견적 요청 도착 시 알림
export const onQuoteCreate = functions.firestore
  .document('quotes/{quoteId}')
  .onCreate(async (snap, context) => {
    const quote = snap.data();

    const payload = {
      title: '💼 새로운 견적 요청이 도착했습니다',
      body: `${quote.name}님이 견적을 요청했습니다.`,
      url: '/admin/quotes',
      tag: 'quote-new',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    };

    const subscriptions = await getAdminSubscriptions();

    await Promise.all(
      subscriptions.map(sub => sendPushNotification(sub, payload))
    );
  });
```

---

### 2. Cloud Functions 배포

```bash
# functions 디렉토리로 이동
cd functions

# 의존성 설치
npm install

# VAPID 환경변수 설정
firebase functions:config:set \
  vapid.public_key="BF7zJ...공개키...xyz123" \
  vapid.private_key="abc456...비밀키...789def"

# Cloud Functions 배포
firebase deploy --only functions
```

---

## 통합 플로우

### Admin 로그인 시 알림 활성화

**파일**: `src/app/admin/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationPrompt from '@/features/admin/notifications/components/NotificationPrompt';
import { registerServiceWorker } from '@/shared/lib/pwa/registerServiceWorker';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Admin 로그인 시 Service Worker 등록
      registerServiceWorker().catch(console.error);
    }
  }, [user]);

  return (
    <>
      {children}
      {user && <NotificationPrompt />}
    </>
  );
}
```

---

## 테스트 가이드

### 1. 로컬 테스트

```bash
# HTTPS 필요 (Service Worker 요구사항)
npm run dev

# localhost는 HTTP여도 작동함
# 실제 배포 시에는 HTTPS 필수
```

### 2. 알림 테스트

```typescript
// Admin Dashboard에서 테스트 버튼 추가
async function sendTestNotification() {
  const registration = await navigator.serviceWorker.ready;

  registration.showNotification('테스트 알림', {
    body: '알림이 정상적으로 작동합니다!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'test',
  });
}
```

### 3. Cloud Function 테스트

```bash
# Firebase Emulator로 로컬 테스트
firebase emulators:start

# Firestore에 직접 문의 추가하여 알림 테스트
```

---

## 트러블슈팅

### 문제 1: Service Worker 등록 안 됨
**원인**: HTTPS 필요

**해결**:
- 로컬: localhost는 HTTP 허용
- 배포: Firebase Hosting은 자동 HTTPS

---

### 문제 2: 알림 권한 요청 안 뜸
**원인**: 브라우저가 차단함

**해결**:
- 브라우저 주소창 왼쪽 자물쇠 클릭
- 알림 권한을 "허용"으로 변경

---

### 문제 3: 알림이 안 옴
**원인**: 구독 정보가 Firestore에 없음

**해결**:
1. Firestore `pushSubscriptions` 컬렉션 확인
2. `enabled: true`인지 확인
3. Cloud Functions 로그 확인

---

## 다음 단계

- [Admin Overview](./overview.md)
- [표준 기능](./standard-features.md)
- [개발 체크리스트](../workflows/development-checklist.md)
