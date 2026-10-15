"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand-700 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      본문으로 바로가기
    </a>
  );
}
