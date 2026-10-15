"use client";

import { Phone, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { env } from "@/shared/config/env";

export default function MobileCTA() {
  const pathname = usePathname();

  // Don't show on admin pages or contact page
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        <a
          href={`tel:${env.company.phone}`}
          className="flex items-center justify-center gap-2 py-3.5 text-brand-700 font-semibold text-sm active:bg-brand-50 transition-colors"
        >
          <Phone className="w-4 h-4" />
          전화 상담
        </a>
        <a
          href="/#contact"
          className="flex items-center justify-center gap-2 py-3.5 bg-brand-700 text-white font-semibold text-sm active:bg-brand-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          견적 문의
        </a>
      </div>
    </div>
  );
}
