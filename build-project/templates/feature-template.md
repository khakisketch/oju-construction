# Feature Template

## 개요

새로운 기능을 추가할 때 사용하는 표준 템플릿입니다. 일관된 구조를 유지하여 유지보수성과 확장성을 보장합니다.

---

## 디렉토리 구조

```
src/features/<feature-name>/
├── components/              # UI 컴포넌트
│   ├── <Feature>Main.tsx    # 메인 컴포넌트
│   ├── <Feature>Card.tsx    # 하위 컴포넌트
│   └── <Feature>Modal.tsx   # 모달 컴포넌트 (선택)
│
├── hooks/                   # Custom Hooks
│   ├── use<Feature>.ts      # 메인 훅
│   └── use<Feature>Form.ts  # 폼 훅 (선택)
│
├── services/                # API/데이터 액세스
│   └── <feature>Service.ts  # Firestore CRUD
│
├── types/                   # TypeScript 타입
│   └── <feature>.types.ts   # 타입 정의
│
└── utils/                   # 유틸리티 (선택)
    └── <feature>Helpers.ts  # 헬퍼 함수
```

---

## 1. 타입 정의 (types/)

### 파일명: `<feature>.types.ts`

```typescript
// src/features/blog/types/blog.types.ts

/**
 * Blog 포스트 데이터 구조
 */
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  category: BlogCategory
  tags: string[]
  coverImage?: string
  status: BlogStatus
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

/**
 * Blog 카테고리
 */
export type BlogCategory = 'technology' | 'business' | 'design' | 'marketing'

/**
 * Blog 상태
 */
export type BlogStatus = 'draft' | 'published' | 'archived'

/**
 * Blog 폼 데이터
 */
export interface BlogFormData {
  title: string
  content: string
  excerpt: string
  category: BlogCategory
  tags: string[]
  coverImage?: File
}

/**
 * Blog 필터
 */
export interface BlogFilter {
  category?: BlogCategory
  status?: BlogStatus
  searchTerm?: string
}
```

**규칙**:
- ✅ JSDoc 주석으로 설명
- ✅ export로 외부에 공개
- ✅ Optional은 `?` 사용
- ✅ Date는 Date 타입 (Firestore Timestamp 아님)

---

## 2. 서비스 (services/)

### 파일명: `<feature>Service.ts`

```typescript
// src/features/blog/services/blogService.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/shared/lib/firebase/app'
import { BlogPost, BlogFormData, BlogFilter } from '../types/blog.types'

/**
 * Blog 포스트 목록 조회
 */
export const getBlogPosts = async (filter?: BlogFilter): Promise<BlogPost[]> => {
  try {
    let q = query(
      collection(db, 'blogPosts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    // 필터 적용
    if (filter?.category) {
      q = query(q, where('category', '==', filter.category))
    }
    if (filter?.status) {
      q = query(q, where('status', '==', filter.status))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      publishedAt: doc.data().publishedAt?.toDate()
    } as BlogPost))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error('Failed to fetch blog posts')
  }
}

/**
 * Blog 포스트 단일 조회
 */
export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, 'blogPosts', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
      publishedAt: docSnap.data().publishedAt?.toDate()
    } as BlogPost
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw new Error('Failed to fetch blog post')
  }
}

/**
 * Blog 포스트 생성
 */
export const createBlogPost = async (data: BlogFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'blogPosts'), {
      ...data,
      status: 'draft',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    return docRef.id
  } catch (error) {
    console.error('Error creating blog post:', error)
    throw new Error('Failed to create blog post')
  }
}

/**
 * Blog 포스트 수정
 */
export const updateBlogPost = async (id: string, data: Partial<BlogFormData>): Promise<void> => {
  try {
    const docRef = doc(db, 'blogPosts', id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    throw new Error('Failed to update blog post')
  }
}

/**
 * Blog 포스트 삭제
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'blogPosts', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting blog post:', error)
    throw new Error('Failed to delete blog post')
  }
}

/**
 * Blog 포스트 발행
 */
export const publishBlogPost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'blogPosts', id)
    await updateDoc(docRef, {
      status: 'published',
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error publishing blog post:', error)
    throw new Error('Failed to publish blog post')
  }
}
```

**규칙**:
- ✅ async/await 사용
- ✅ try-catch로 에러 처리
- ✅ JSDoc 주석으로 설명
- ✅ Timestamp → Date 변환
- ✅ 명확한 에러 메시지

---

## 3. Custom Hook (hooks/)

### 파일명: `use<Feature>.ts`

```typescript
// src/features/blog/hooks/useBlogPosts.ts

import { useState, useEffect } from 'react'
import { getBlogPosts } from '../services/blogService'
import { BlogPost, BlogFilter } from '../types/blog.types'

/**
 * Blog 포스트 목록 관리 훅
 */
export const useBlogPosts = (filter?: BlogFilter) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getBlogPosts(filter)
        setPosts(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [filter])

  return { posts, loading, error }
}
```

### 파일명: `use<Feature>Form.ts`

```typescript
// src/features/blog/hooks/useBlogForm.ts

import { useState } from 'react'
import { createBlogPost, updateBlogPost } from '../services/blogService'
import { BlogFormData, BlogPost } from '../types/blog.types'

/**
 * Blog 폼 관리 훅
 */
export const useBlogForm = (initialData?: BlogPost) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || 'technology',
    tags: initialData?.tags || []
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError(null)

      if (initialData?.id) {
        await updateBlogPost(initialData.id, formData)
      } else {
        await createBlogPost(formData)
      }

      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    saving,
    error
  }
}
```

**규칙**:
- ✅ useState로 상태 관리
- ✅ useEffect로 데이터 로딩
- ✅ loading, error 상태 제공
- ✅ 명확한 반환 객체

---

## 4. 컴포넌트 (components/)

### 파일명: `<Feature>Main.tsx`

```typescript
// src/features/blog/components/BlogList.tsx
'use client'

import { useBlogPosts } from '../hooks/useBlogPosts'
import { BlogCard } from './BlogCard'
import { BlogFilter } from '../types/blog.types'

interface BlogListProps {
  filter?: BlogFilter
}

export default function BlogList({ filter }: BlogListProps) {
  const { posts, loading, error } = useBlogPosts(filter)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Blog Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
```

### 파일명: `<Feature>Card.tsx`

```typescript
// src/features/blog/components/BlogCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '../types/blog.types'
import { formatDate } from '@/shared/utils/format'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {post.coverImage && (
          <div className="relative h-48">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="text-sm text-gray-500 mb-2">
            {post.category} • {formatDate(post.createdAt)}
          </div>

          <h3 className="text-xl font-bold mb-2">{post.title}</h3>

          <p className="text-gray-600 mb-4">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
```

**규칙**:
- ✅ 'use client' 필요 시 명시
- ✅ Props 인터페이스 정의
- ✅ 반응형 (mobile, tablet, desktop)
- ✅ 접근성 (시맨틱 HTML, alt 텍스트)
- ✅ Tailwind CSS 스타일링

---

## 5. App Router 페이지 (app/)

### 파일명: `app/blog/page.tsx`

```typescript
// src/app/blog/page.tsx
import BlogList from '@/features/blog/components/BlogList'

export const metadata = {
  title: 'Blog | Your Site Name',
  description: 'Latest blog posts and articles'
}

export default function BlogPage() {
  return <BlogList />
}
```

### 파일명: `app/blog/[id]/page.tsx`

```typescript
// src/app/blog/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getBlogPost } from '@/features/blog/services/blogService'
import BlogDetail from '@/features/blog/components/BlogDetail'

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  return <BlogDetail post={post} />
}
```

**규칙**:
- ✅ metadata 설정 (SEO)
- ✅ 컴포넌트는 features/에서 import
- ✅ 비즈니스 로직은 features/에 위임
- ✅ notFound() 처리

---

## 6. Firestore 데이터 구조

### Collection: `<feature>s`

```typescript
// blogPosts/{id}
{
  title: string
  content: string
  excerpt: string
  author: string
  category: 'technology' | 'business' | 'design' | 'marketing'
  tags: string[]
  coverImage?: string
  status: 'draft' | 'published' | 'archived'
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
}
```

---

## 7. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Blog posts: Public can read published, Admin can CRUD
    match /blogPosts/{postId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

---

## 8. 테스트 (선택)

### 파일명: `__tests__/<feature>.test.ts`

```typescript
// src/features/blog/__tests__/blogService.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getBlogPosts, createBlogPost } from '../services/blogService'

describe('blogService', () => {
  it('should fetch blog posts', async () => {
    const posts = await getBlogPosts()
    expect(posts).toBeInstanceOf(Array)
  })

  it('should create a blog post', async () => {
    const data = {
      title: 'Test Post',
      content: 'Test Content',
      excerpt: 'Test Excerpt',
      category: 'technology' as const,
      tags: ['test']
    }

    const id = await createBlogPost(data)
    expect(id).toBeTruthy()
  })
})
```

---

## Claude Code 사용 예시

### 새 기능 추가 요청

```
"build-project/templates/feature-template.md 참고해서
 Blog 기능을 features/blog/ 에 추가해줘.

 요구사항:
 - Blog 포스트 목록 (카테고리별 필터링)
 - Blog 포스트 상세 페이지
 - Admin에서 CRUD 가능
 - 반응형 디자인
 - SEO 최적화

 다음 파일 생성:
 - features/blog/types/blog.types.ts
 - features/blog/services/blogService.ts
 - features/blog/hooks/useBlogPosts.ts
 - features/blog/components/BlogList.tsx
 - features/blog/components/BlogCard.tsx
 - app/blog/page.tsx
 - app/blog/[id]/page.tsx"
```

---

## 체크리스트

새 기능 추가 시 확인 사항:

### 필수 파일
- [ ] types/<feature>.types.ts
- [ ] services/<feature>Service.ts
- [ ] hooks/use<Feature>.ts
- [ ] components/<Feature>Main.tsx
- [ ] app/<feature>/page.tsx

### 코드 품질
- [ ] TypeScript 타입 정의 완료
- [ ] JSDoc 주석 작성
- [ ] 에러 처리 구현
- [ ] 반응형 디자인 적용

### 기능 테스트
- [ ] 데이터 조회 테스트
- [ ] 데이터 생성 테스트
- [ ] 데이터 수정 테스트
- [ ] 데이터 삭제 테스트
- [ ] 에러 시나리오 테스트

### 성능 최적화
- [ ] useMemo/useCallback 적용
- [ ] 이미지 최적화 (Next.js Image)
- [ ] Lazy loading 적용

### 문서화
- [ ] README 업데이트
- [ ] API 문서 작성
- [ ] 사용 예시 작성

---

## 다음 단계

- [개발 워크플로우](../workflows/development-workflow.md)
- [Admin 표준 기능](../admin/standard-features.md)
- [테스트 전략](../workflows/testing.md)
