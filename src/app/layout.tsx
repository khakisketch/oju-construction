import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { env } from "@/shared/config/env";
import AnalyticsScripts from "@/shared/components/analytics/AnalyticsScripts";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const BASE_URL = env.site.url || "https://ojuec.co.kr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0e2f64",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${env.company.name} | 미래를 여는 건설`,
    template: `%s | ${env.company.name}`,
  },
  description: `${env.company.name}은 6개 전문건설 면허를 보유한 종합건설회사입니다. 토목공사, 지반조성포장, 조경공사, 방수공사, 도장공사, 시설 유지보수 서비스를 제공합니다.`,
  keywords: [
    "오주건설",
    "오주건설(주)",
    "청주 오주건설",
    "오주건설 청주",
    "청주 건설회사",
    "청주 건설사",
    "청주 건설업체",
    "청주 토목",
    "청주 토목공사",
    "청주 조경공사",
    "충북 건설회사",
    "충북 건설업체",
    "충북 토목공사",
    "토목공사",
    "지반조성포장",
    "조경공사",
    "방수공사",
    "도장공사",
    "시설물 유지보수",
    "청주 도로포장",
    "충북 방수공사",
    "세종 건설회사",
    "대전 건설업체",
  ],
  authors: [{ name: env.company.name }],
  creator: env.company.name,
  publisher: env.company.name,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: `${env.company.name} | 미래를 여는 건설`,
    description: `${env.company.name}은 6개 전문건설 면허를 보유한 종합건설회사입니다. 토목공사, 지반조성포장, 조경공사, 방수공사, 도장공사, 시설 유지보수 서비스를 제공합니다.`,
    url: BASE_URL,
    siteName: env.company.name,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: `${env.company.name} - 신뢰와 기술로 미래를 여는 건설`,
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${env.company.name} | 미래를 여는 건설`,
    description: `${env.company.name}은 전문건설 면허를 보유한 종합건설회사입니다.`,
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/ojuconstruction-logo.png", type: "image/png" },
    ],
    shortcut: "/images/ojuconstruction-logo.png",
    apple: "/images/ojuconstruction-logo.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "naver-site-verification": "5d4536d53db7eb17092f72fa56310f1672588ca7",
    },
  },
  category: "construction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body className="antialiased bg-white text-gray-900">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
