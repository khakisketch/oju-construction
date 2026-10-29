"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/shared/lib/firebase/auth";
import { isFirebaseConfigured } from "@/shared/config/env";
import AdminSidebar from "@/features/admin/components/AdminSidebar";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (pathname === "/login") {
          router.push("/admin");
        }
      } else {
        setIsAuthenticated(false);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // 로그인 페이지는 별도 레이아웃 적용 (사이드바 없음)
  if (pathname === "/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">
            관리자 기능이 아직 연결되지 않았습니다
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Firebase 연동 정보가 없어 관리자 페이지를 표시할 수 없습니다.
            <br />
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">.env.local</code>에{" "}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_FIREBASE_*</code>{" "}
            값을 설정하면 활성화됩니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl transition-colors"
          >
            홈페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  // 비로그인 상태에서 로그인 페이지가 아닌 곳 접근 시 (리다이렉트 중 잠시 빈 화면)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 p-3 safe-area-inset-top">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 min-w-[48px] min-h-[48px] bg-white rounded-xl shadow-lg text-gray-600 hover:text-brand-700 active:bg-gray-100 active:scale-95 transition-all flex items-center justify-center"
          aria-label="메뉴 열기"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-0 min-h-screen transition-all duration-300 w-full">
        <div className="p-4 md:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
