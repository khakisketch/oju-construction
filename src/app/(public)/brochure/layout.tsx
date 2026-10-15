import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개서 | OJU건설",
  description: "OJU건설의 비전, 미션, 연혁 및 주요 사업 분야를 소개합니다.",
};

export default function BrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 전체 화면 모드를 위해 헤더/푸터 숨김 */}
      <style>{`
        header, footer, #skip-to-content {
          display: none !important;
        }
        main#main-content {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      {children}
    </>
  );
}
