import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개",
  description: "오주건설(주)은 2006년 설립되어 도로포장, 토목, 조경, 시설물 유지보수 분야에서 신뢰받는 전문건설기업입니다. CEO 인사말과 회사 연혁을 확인하세요.",
  keywords: ["오주건설", "회사소개", "CEO인사말", "건설회사", "전문건설업"],
  openGraph: {
    title: "회사소개 | 오주건설(주)",
    description: "2006년 설립, 도로포장·토목·조경·유지보수 전문건설기업 오주건설을 소개합니다.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
