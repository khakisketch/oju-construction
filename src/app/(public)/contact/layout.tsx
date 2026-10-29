import type { Metadata } from "next";
import { env } from "@/shared/config/env";
import { BUSINESS_AREA_LIST } from "@/shared/config/businessAreas";

export const metadata: Metadata = {
  title: "문의하기",
  description: `오주건설(주)에 프로젝트를 문의하세요. 사업분야: ${BUSINESS_AREA_LIST}. 전화: ${env.company.phone}`,
  keywords: ["오주건설문의", "건설문의", "견적상담", "프로젝트상담", "건설회사연락처"],
  openGraph: {
    title: "문의하기 | 오주건설(주)",
    description: `프로젝트 문의 및 견적 상담. 전화: ${env.company.phone}`,
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
