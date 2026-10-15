import { Metadata } from "next";

export const metadata: Metadata = {
  title: "시공실적",
  description: "오주건설(주)의 주요 시공실적. 토목공사, 도로포장, 조경공사, 시설물 유지보수 프로젝트를 확인하세요.",
  keywords: ["시공실적", "포트폴리오", "건설프로젝트", "공사실적", "토목공사실적"],
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
