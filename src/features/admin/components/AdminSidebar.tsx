"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/shared/lib/firebase/auth";
import { isFirebaseConfigured } from "@/shared/config/env";
import { LayoutDashboard, MessageSquare, Newspaper, Briefcase, Settings, LogOut, X, FileText, FileCheck } from "lucide-react";
import { useNewContacts } from "@/shared/hooks/useNewContacts";

const menuItems = [
  { name: "대시보드", href: "/admin", Icon: LayoutDashboard },
  { name: "문의 관리", href: "/admin/contacts", Icon: MessageSquare },
  { name: "뉴스/공지", href: "/admin/news", Icon: Newspaper },
  { name: "포트폴리오", href: "/admin/portfolio", Icon: Briefcase },
  { name: "회사소개서", href: "/admin/brochure", Icon: FileText },
  { name: "지명원", href: "/admin/nomination", Icon: FileCheck },
  { name: "설정", href: "/admin/settings", Icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { count: newContactsCount } = useNewContacts();

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(getFirebaseAuth());
      }
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Mobile Overlay
  const MobileOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
    />
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && <MobileOverlay />}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:block
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-700">OJU Admin</h1>
            <p className="text-xs text-gray-500 mt-1">관리자 전용</p>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
            aria-label="메뉴 닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl transition-all active:scale-[0.98] ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                }`}
              >
                <item.Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[15px]">{item.name}</span>
                {item.href === "/admin/contacts" && newContactsCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                    {newContactsCount > 99 ? "99+" : newContactsCount}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-brand-700 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t border-gray-200 bg-white safe-area-inset-bottom">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 min-h-[48px] text-gray-600 hover:bg-red-50 hover:text-red-600 active:bg-red-100 rounded-xl transition-colors active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-[15px]">로그아웃</span>
          </button>
        </div>
      </aside>
    </>
  );
}
