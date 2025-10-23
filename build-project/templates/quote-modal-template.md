# Quote Modal Template (견적 모달 템플릿)

## 개요

Home 페이지에서 사용하는 **견적 요청 모달**의 표준 템플릿입니다.

**고객별로 수집 항목이 다르므로, 이 템플릿을 기반으로 커스터마이징합니다.**

---

## 기본 구조

### 파일 위치

```
src/features/home/hero/
├── HeroSection.tsx          # 모달 트리거
└── QuoteModal.tsx           # 견적 모달 (이 템플릿)

src/features/admin/quotes/
├── components/
│   └── QuotesManagement.tsx
├── services/
│   └── quoteService.ts
└── types/
    └── quote.types.ts
```

---

## 1. 타입 정의 (필수)

### `src/features/admin/quotes/types/quote.types.ts`

```typescript
import { Timestamp } from 'firebase/firestore'

/**
 * Firestore에 저장되는 견적 데이터
 */
export interface QuoteData {
  id: string

  // 기본 정보 (필수)
  name: string
  email: string
  phone: string

  // 프로젝트 정보 (고객별 커스터마이징)
  company?: string              // 회사명
  serviceType?: string          // 서비스 종류
  budget?: string               // 예산 범위
  timeline?: string             // 희망 일정
  description: string           // 프로젝트 설명

  // 첨부 파일 (선택)
  attachments?: string[]        // Firebase Storage URLs

  // 시스템 필드
  status: QuoteStatus
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export type QuoteStatus = 'new' | 'reviewing' | 'quoted' | 'accepted' | 'rejected'

/**
 * 폼에서 사용하는 데이터 (Timestamp 제외)
 */
export interface QuoteFormData {
  name: string
  email: string
  phone: string
  company?: string
  serviceType?: string
  budget?: string
  timeline?: string
  description: string
}
```

---

## 2. 서비스 함수 (필수)

### `src/features/admin/quotes/services/quoteService.ts`

```typescript
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/shared/lib/firebase/app'
import type { QuoteFormData, QuoteStatus } from '../types/quote.types'

/**
 * 견적 요청 생성 (Contact 폼 제출)
 */
export async function createQuote(data: QuoteFormData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...data,
      status: 'new',
      createdAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    console.error('Error creating quote:', error)
    throw new Error('견적 요청 제출에 실패했습니다.')
  }
}

/**
 * 견적 상태 변경 (Admin에서 사용)
 */
export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteStatus
): Promise<void> {
  try {
    await updateDoc(doc(db, 'quotes', quoteId), {
      status,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating quote status:', error)
    throw new Error('견적 상태 변경에 실패했습니다.')
  }
}

/**
 * 견적 삭제 (Admin에서 사용)
 */
export async function deleteQuote(quoteId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'quotes', quoteId))
  } catch (error) {
    console.error('Error deleting quote:', error)
    throw new Error('견적 삭제에 실패했습니다.')
  }
}
```

---

## 3. 견적 모달 컴포넌트

### `src/features/home/hero/QuoteModal.tsx`

#### 기본 버전 (최소 필드)

```typescript
'use client'

import { useState } from 'react'
import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { createQuote } from '@/features/admin/quotes/services/quoteService'
import type { QuoteFormData } from '@/features/admin/quotes/types/quote.types'

interface QuoteModalProps {
  open: boolean
  onClose: () => void
}

export default function QuoteModal({ open, onClose }: QuoteModalProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = (): boolean => {
    if (formData.name.length < 2) {
      setError('이름을 2자 이상 입력해주세요.')
      return false
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('유효한 이메일을 입력해주세요.')
      return false
    }

    if (!formData.phone.match(/^\d{2,3}-?\d{3,4}-?\d{4}$/)) {
      setError('유효한 전화번호를 입력해주세요.')
      return false
    }

    if (formData.description.length < 10) {
      setError('프로젝트 설명을 10자 이상 입력해주세요.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await createQuote(formData)

      alert('견적 요청이 접수되었습니다! 빠른 시일 내에 연락드리겠습니다.')
      onClose()

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
      })
    } catch (err) {
      setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">견적 요청</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="홍길동"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="hong@example.com"
              required
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="010-1234-5678"
              required
            />
          </div>

          {/* 프로젝트 설명 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              프로젝트 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border rounded-md p-2 min-h-[120px]"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="프로젝트에 대해 자세히 설명해주세요."
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? '제출 중...' : '견적 요청하기'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
```

---

## 4. 커스터마이징 가이드

### 옵션 1: 회사명 필드 추가

```typescript
// 1. 타입에 필드 추가
export interface QuoteFormData {
  name: string
  email: string
  phone: string
  company?: string      // 추가
  description: string
}

// 2. 초기 상태에 추가
const [formData, setFormData] = useState<QuoteFormData>({
  name: '',
  email: '',
  phone: '',
  company: '',        // 추가
  description: '',
})

// 3. 폼에 input 추가
<div>
  <label className="block text-sm font-medium mb-1">
    회사명 (선택)
  </label>
  <Input
    value={formData.company}
    onChange={(e) => handleChange('company', e.target.value)}
    placeholder="ABC 컴퍼니"
  />
</div>
```

### 옵션 2: 서비스 종류 드롭다운

```typescript
// 1. 타입에 필드 추가
export interface QuoteFormData {
  // ... 기존 필드
  serviceType?: string    // 추가
}

// 2. 서비스 옵션 정의
const SERVICE_OPTIONS = [
  { value: 'web', label: '웹 개발' },
  { value: 'mobile', label: '모바일 앱' },
  { value: 'branding', label: '브랜딩' },
  { value: 'marketing', label: '마케팅' },
]

// 3. 폼에 select 추가
<div>
  <label className="block text-sm font-medium mb-1">
    서비스 종류 <span className="text-red-500">*</span>
  </label>
  <select
    className="w-full border rounded-md p-2"
    value={formData.serviceType}
    onChange={(e) => handleChange('serviceType', e.target.value)}
    required
  >
    <option value="">선택해주세요</option>
    {SERVICE_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
```

### 옵션 3: 예산 범위 선택

```typescript
// 예산 옵션 정의
const BUDGET_OPTIONS = [
  { value: 'under-500', label: '500만원 이하' },
  { value: '500-1000', label: '500만원 ~ 1000만원' },
  { value: '1000-2000', label: '1000만원 ~ 2000만원' },
  { value: 'over-2000', label: '2000만원 이상' },
]

// 폼에 추가
<div>
  <label className="block text-sm font-medium mb-1">
    예산 범위 (선택)
  </label>
  <select
    className="w-full border rounded-md p-2"
    value={formData.budget}
    onChange={(e) => handleChange('budget', e.target.value)}
  >
    <option value="">선택해주세요</option>
    {BUDGET_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
```

### 옵션 4: 파일 첨부

```typescript
import { useState } from 'react'
import { uploadFile } from '@/features/admin/quotes/services/uploadService'

// 상태 추가
const [attachments, setAttachments] = useState<File[]>([])
const [uploading, setUploading] = useState(false)

// 파일 선택 핸들러
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files)
    setAttachments(files)
  }
}

// 제출 시 파일 업로드
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) return

  try {
    setSubmitting(true)

    // 파일 업로드
    let uploadedUrls: string[] = []
    if (attachments.length > 0) {
      setUploading(true)
      uploadedUrls = await Promise.all(
        attachments.map(file => uploadFile(file))
      )
      setUploading(false)
    }

    // 견적 요청 생성
    await createQuote({
      ...formData,
      attachments: uploadedUrls,
    })

    alert('견적 요청이 접수되었습니다!')
    onClose()
  } catch (error) {
    setError('제출 중 오류가 발생했습니다.')
  } finally {
    setSubmitting(false)
  }
}

// 폼에 파일 input 추가
<div>
  <label className="block text-sm font-medium mb-1">
    첨부 파일 (선택)
  </label>
  <input
    type="file"
    multiple
    accept=".pdf,.docx,.xlsx"
    onChange={handleFileChange}
    className="w-full border rounded-md p-2"
  />
  <p className="text-xs text-gray-500 mt-1">
    PDF, DOCX, XLSX 파일만 가능 (최대 5MB)
  </p>
</div>
```

---

## 5. 모달 트리거 (Hero Section)

### `src/features/home/hero/HeroSection.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import QuoteModal from './QuoteModal'

export default function HeroSection() {
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  return (
    <section className="relative h-screen flex items-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Your Business Growth Partner
        </h1>

        <p className="text-2xl mb-8">
          데이터 기반 마케팅으로 매출 성장을 만듭니다
        </p>

        <div className="flex gap-4 justify-center">
          {/* 견적 요청 버튼 */}
          <Button onClick={() => setShowQuoteModal(true)}>
            견적 요청
          </Button>

          <Button variant="outline" onClick={() => window.location.href = '#portfolio'}>
            포트폴리오 보기
          </Button>
        </div>
      </div>

      {/* 견적 모달 */}
      <QuoteModal
        open={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </section>
  )
}
```

---

## 6. Admin 관리 페이지 (선택)

### `src/app/admin/quotes/page.tsx`

```typescript
import QuotesManagement from '@/features/admin/quotes/components/QuotesManagement'

export const metadata = {
  title: 'Quotes | Admin',
}

export default function QuotesPage() {
  return <QuotesManagement />
}
```

### `src/features/admin/quotes/components/QuotesManagement.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { useFirestore } from '@/core/providers/FirestoreProvider'
import type { QuoteData } from '../types/quote.types'

export default function QuotesManagement() {
  const { db } = useFirestore()
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'quotes'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as QuoteData[]

      setQuotes(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [db])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">견적 요청 관리</h1>

      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">이름</th>
            <th className="p-3 text-left">이메일</th>
            <th className="p-3 text-left">전화번호</th>
            <th className="p-3 text-left">서비스 종류</th>
            <th className="p-3 text-left">상태</th>
            <th className="p-3 text-left">요청일</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map(quote => (
            <tr key={quote.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{quote.name}</td>
              <td className="p-3">{quote.email}</td>
              <td className="p-3">{quote.phone}</td>
              <td className="p-3">{quote.serviceType || '-'}</td>
              <td className="p-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {quote.status}
                </span>
              </td>
              <td className="p-3">
                {quote.createdAt.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 7. LLM 프롬프트 예시

### 기본 견적 모달 생성

```
"build-project/templates/quote-modal-template.md를 읽고,
 기본 버전의 견적 모달을 생성해줘.

 수집 항목:
 - 이름 (필수)
 - 이메일 (필수)
 - 전화번호 (필수)
 - 프로젝트 설명 (필수, textarea)

 파일 생성:
 - features/admin/quotes/types/quote.types.ts
 - features/admin/quotes/services/quoteService.ts
 - features/home/hero/QuoteModal.tsx

 HeroSection.tsx에 모달 트리거도 추가."
```

### 커스터마이징된 견적 모달

```
"build-project/templates/quote-modal-template.md를 읽고,
 다음 항목을 수집하는 견적 모달을 만들어줘:

 필수 항목:
 - 이름
 - 이메일
 - 전화번호
 - 서비스 종류 (드롭다운): ['웹 개발', '모바일 앱', '브랜딩', '마케팅']
 - 프로젝트 설명

 선택 항목:
 - 회사명
 - 예산 범위 (드롭다운): ['500만원 이하', '500-1000만원', '1000-2000만원', '2000만원 이상']

 build-project/specs/data-models.md의 QuoteData 모델도
 이에 맞게 업데이트해줘."
```

---

## 다음 단계

- [요구사항 체크리스트](../specs/requirements-checklist.md)
- [데이터 모델 명세](../specs/data-models.md)
- [MCP 프롬프트](../mcp/mcp-prompts.md)
