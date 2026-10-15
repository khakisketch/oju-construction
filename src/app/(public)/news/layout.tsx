import { Metadata } from "next";

export const metadata: Metadata = {
  title: "소식",
  description: "오주건설(주)의 최신 소식. 회사 공지사항, 수주 소식, 업계 뉴스를 확인하세요.",
  keywords: ["오주건설소식", "공지사항", "회사뉴스", "수주소식", "건설뉴스"],
  openGraph: {
    title: "소식 | 오주건설(주)",
    description: "오주건설의 최신 공지사항과 뉴스를 확인하세요.",
    type: "website",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
