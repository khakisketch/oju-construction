import { Metadata } from "next";
import { BUSINESS_AREA_LIST, BUSINESS_AREA_NAMES } from "@/shared/config/businessAreas";

export const metadata: Metadata = {
  title: "건설사업",
  description: `오주건설(주)의 사업분야: ${BUSINESS_AREA_LIST}. 각 분야의 시공 범위를 확인하세요.`,
  keywords: [...BUSINESS_AREA_NAMES, "전문건설", "시공 분야"],
  openGraph: {
    title: "건설사업 | 오주건설(주)",
    description: `사업분야: ${BUSINESS_AREA_LIST}. 기본에 충실한 건설, 미래를 짓는 기술.`,
    type: "website",
  },
};

export default function ConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
