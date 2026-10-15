"use client";

import { cn } from "@/shared/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  );
}

// 카드 스켈레톤
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

// 포트폴리오 아이템 스켈레톤
export function PortfolioSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="h-64 w-full" />
      <div className="p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

// 뉴스 아이템 스켈레톤
export function NewsSkeleton() {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

// 섹션 헤더 스켈레톤
export function SectionHeaderSkeleton() {
  return (
    <div className="text-center mb-12">
      <Skeleton className="h-4 w-32 mx-auto mb-2" />
      <Skeleton className="h-8 w-48 mx-auto mb-4" />
      <Skeleton className="h-1 w-20 mx-auto mb-6" />
      <Skeleton className="h-4 w-96 max-w-full mx-auto" />
    </div>
  );
}

// 테이블 로우 스켈레톤
export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-8" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-48" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </td>
    </tr>
  );
}

// 전체 페이지 로딩 스켈레톤
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero 스켈레톤 */}
      <Skeleton className="h-[70vh] w-full" />

      {/* 섹션 스켈레톤 */}
      <div className="container mx-auto px-4 py-16">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Admin 페이지용 스켈레톤 =====

// 문의 목록 아이템 스켈레톤
export function ContactItemSkeleton() {
  return (
    <div className="p-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-3/4 mb-2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// 문의 상세 스켈레톤
export function ContactDetailSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      <div className="p-8 flex-1">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 mb-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 mb-4" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-5 w-24 mb-4" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}

// 뉴스 테이블 스켈레톤
export function NewsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex gap-8">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10 ml-auto" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-6 animate-pulse">
            <Skeleton className="h-6 w-14 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-10 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 설정 폼 스켈레톤
export function SettingsFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48 mt-1" />
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={i === 2 ? "md:col-span-2" : ""}>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  );
}

// 포트폴리오 그리드 스켈레톤 (Admin용)
export function PortfolioGridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
