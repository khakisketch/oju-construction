import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import RenewalHeader from "@/features/renewal/RenewalHeader";
import RenewalFooter from "@/features/renewal/RenewalFooter";
import styles from "@/features/renewal/renewal.module.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f4f1ea",
};

export const metadata: Metadata = {
  title: {
    absolute: "오주건설(주) | 아파트 부대토목·포장·배수·조경·시설물",
  },
  description:
    "아파트 단지의 부대토목·포장·배수·조경·시설물을 한 계약으로 시공하는 오주건설(주). 2004년 설립, 충북 청주.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RenewalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${styles.page} ${archivo.variable}`}>
      <RenewalHeader />
      {children}
      <RenewalFooter />
    </div>
  );
}
