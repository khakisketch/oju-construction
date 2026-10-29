"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { env, isFirebaseConfigured } from "@/shared/config/env";
import { BUSINESS_AREAS } from "@/shared/config/businessAreas";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [companyInfo, setCompanyInfo] = useState({
    name: env.company.name,
    nameEn: env.company.nameEn,
    description: env.company.description,
  });

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.companyInfo) {
            setCompanyInfo(prev => ({
              ...prev,
              name: data.companyInfo.name || prev.name,
              // nameEn, description은 관리자 페이지에 필드가 없다면 기존 env 값 유지
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5) {
      router.push("/admin");
      setClickCount(0);
    }

    // 3초 후 카운트 리셋
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-10">
          {/* 회사 정보 */}
          <div className="col-span-2 lg:col-span-1">
            <div
              className="flex items-center gap-3 mb-3 cursor-pointer select-none"
              onClick={handleLogoClick}
            >
              <Image
                src="/images/ojuconstruction-logo.png"
                alt={`${companyInfo.name} 로고`}
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{companyInfo.name}</h3>
                <p className="text-xs text-gray-400">{companyInfo.nameEn}</p>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed text-gray-300">
              {companyInfo.description}
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="text-base font-bold mb-2.5">바로가기</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/construction" className="text-gray-400 hover:text-white transition">
                  건설
                </Link>
              </li>
              <li>
                <Link href={pathname === "/renewal-b" ? "/renewal-b#diagnosis-request" : "/#contact"} className="text-gray-400 hover:text-white transition">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 사업분야 */}
          <div>
            <h3 className="text-base font-bold mb-2.5">사업분야</h3>
            <ul className="space-y-1.5 text-sm">
              {BUSINESS_AREAS.map((area) => (
                <li key={area.id}>
                  <Link
                    href="/construction"
                    className="text-gray-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-base font-bold mb-2.5">연락처</h3>
            <ul className="space-y-2 text-base">
              <li className="flex items-start text-gray-400">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{env.company.address}</span>
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${env.company.phone}`} className="text-lg font-bold tabular-nums text-white hover:underline underline-offset-2">
                  {env.company.phone}
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${env.company.email}`} className="break-all hover:text-white hover:underline underline-offset-2">
                  {env.company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-gray-800 mt-6 pt-5">
          <div className={`${pathname === "/renewal-b" ? "text-gray-400" : "text-gray-500"} text-xs leading-relaxed mb-3`}>
            <span>상호: {companyInfo.name}</span>
            <span className="mx-2">|</span>
            <span>대표: {env.company.ceo}</span>
            <span className="mx-2">|</span>
            <span>사업자등록번호: {env.company.businessNumber}</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-xs mb-2 md:mb-0 sm:text-sm">
              <span>&copy; {new Date().getFullYear()} {companyInfo.name}.</span>
              <span className="ml-2">All Rights Reserved.</span>
            </div>
            <div className="flex space-x-4 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
