"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/shared/lib/firebase/auth";
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  // 로그인 페이지는 별도 레이아웃 적용 (사이드바 없음)
  if (pathname === "/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
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
