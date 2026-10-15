import { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "오주건설(주)에 프로젝트를 문의하세요. 토목, 포장, 조경, 방수, 도장, 유지보수 상담 가능합니다. 전화: 070-4260-7307",
  keywords: ["오주건설문의", "건설문의", "견적상담", "프로젝트상담", "건설회사연락처"],
  openGraph: {
    title: "문의하기 | 오주건설(주)",
    description: "프로젝트 문의 및 견적 상담. 전화: 070-4260-7307",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
