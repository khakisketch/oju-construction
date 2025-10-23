import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { env } from "@/shared/config/env";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${env.company.name} | 미래를 여는 건설`,
  description: `${env.company.name}은 전문건설 면허를 보유하고 있으며, 토목공사 및 시설물 유지보수를 전문으로 하는 종합건설회사입니다.`,
  keywords: `오주건설, ${env.company.name}, 토목공사, 시설물 유지보수, 건설회사, 조경, 소프트웨어`,
  openGraph: {
    title: `${env.company.name} | 미래를 여는 건설`,
    description: `${env.company.name}은 전문건설 면허를 보유하고 있으며, 토목공사 및 시설물 유지보수를 전문으로 하는 종합건설회사입니다.`,
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
