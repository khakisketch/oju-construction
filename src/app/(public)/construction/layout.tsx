import { Metadata } from "next";

export const metadata: Metadata = {
  title: "건설사업",
  description: "오주건설(주)의 핵심 건설 서비스: 토목공사, 도로포장, 조경공사, 시설물 유지보수. 20년 노하우로 품질과 안전을 보장합니다.",
  keywords: ["토목공사", "도로포장", "조경공사", "유지보수", "전문건설", "아스팔트포장"],
  openGraph: {
    title: "건설사업 | 오주건설(주)",
    description: "토목·포장·조경·유지보수 전문. 기본에 충실한 건설, 미래를 짓는 기술.",
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
