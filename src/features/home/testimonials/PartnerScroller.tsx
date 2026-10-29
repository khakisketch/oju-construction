"use client";

import type { KeyboardEvent, ReactNode } from "react";

interface PartnerScrollerProps {
  children: ReactNode;
}

export default function PartnerScroller({ children }: PartnerScrollerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const step = Math.round(container.clientWidth * 0.7);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      container.scrollLeft += step;
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      container.scrollLeft -= step;
    } else if (event.key === "Home") {
      event.preventDefault();
      container.scrollLeft = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      container.scrollLeft = container.scrollWidth;
    }
  };

  return (
    <div
      className="-mx-4 overflow-x-auto px-4 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700 xl:mx-0 xl:px-0"
      role="region"
      aria-label="주요 협력기관 목록, 모바일에서는 가로로 스크롤할 수 있습니다"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
