import type { Metadata } from "next";
import AdminAuthGuard from "@/features/admin/components/AdminAuthGuard";

export const metadata: Metadata = {
  title: "관리자 페이지 | 오주건설(주)",
  description: "오주건설(주) 관리자 페이지",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}