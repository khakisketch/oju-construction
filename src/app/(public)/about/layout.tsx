import { Metadata } from "next";
import { BUSINESS_AREA_LIST } from "@/shared/config/businessAreas";

export const metadata: Metadata = {
  title: "회사소개",
  description: `오주건설(주)은 2004년 설립되어 ${BUSINESS_AREA_LIST} 분야의 공사를 수행하는 전문건설기업입니다. CEO 인사말과 회사 연혁을 확인하세요.`,
  keywords: ["오주건설", "회사소개", "CEO인사말", "건설회사", "전문건설업"],
  openGraph: {
    title: "회사소개 | 오주건설(주)",
    description: `2004년 설립, ${BUSINESS_AREA_LIST} 분야의 공사를 수행하는 오주건설(주)을 소개합니다.`,
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
