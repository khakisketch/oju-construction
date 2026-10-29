import { Metadata } from "next";
import { BUSINESS_AREA_LIST, BUSINESS_AREA_NAMES } from "@/shared/config/businessAreas";

export const metadata: Metadata = {
  title: "시공실적",
  description: `오주건설(주)의 사업분야: ${BUSINESS_AREA_LIST}. 등록된 시공 정보를 확인하세요.`,
  keywords: ["시공실적", "포트폴리오", "건설프로젝트", "공사실적", ...BUSINESS_AREA_NAMES],
  openGraph: {
    title: "시공실적 | 오주건설(주)",
    description: "오주건설의 대표 시공실적과 프로젝트를 소개합니다.",
    type: "website",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
