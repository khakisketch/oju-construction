"use client";

import { Phone, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { env } from "@/shared/config/env";

export default function MobileCTA() {
  const pathname = usePathname();
  const isRenewalB = pathname === "/renewal-b";
  const [isEditingInquiry, setIsEditingInquiry] = useState(false);

  useEffect(() => {
    if (!isRenewalB) return;

    const isInInquiryForm = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest("#diagnosis-request form");
    const onFocusIn = (event: FocusEvent) => setIsEditingInquiry(isInInquiryForm(event.target));
    const onFocusOut = (event: FocusEvent) => setIsEditingInquiry(isInInquiryForm(event.relatedTarget));

    setIsEditingInquiry(isInInquiryForm(document.activeElement));
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [isRenewalB]);

  // Don't show on admin pages or contact page
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;
  if (isRenewalB && isEditingInquiry) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        <a
          href={`tel:${env.company.phone}`}
          className="flex min-h-14 items-center justify-center gap-2 py-3.5 text-base font-bold text-brand-700 active:bg-brand-50 transition-colors"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          전화 상담
        </a>
        <a
          href={isRenewalB ? "/renewal-b#diagnosis-request" : "/#contact"}
          className="flex items-center justify-center gap-2 py-3.5 bg-brand-700 text-white font-semibold text-sm active:bg-brand-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          {isRenewalB ? "현장 진단 요청" : "견적 문의"}
        </a>
      </div>
    </div>
  );
}
