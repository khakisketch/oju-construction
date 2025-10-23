"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/shared/config/env";

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

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
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* 회사 정보 */}
          <div>
            <div
              className="flex items-center gap-3 mb-4 cursor-pointer select-none"
              onClick={handleLogoClick}
            >
              <Image
                src="/images/ojuconstruction-logo.png"
                alt={`${env.company.name} 로고`}
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{env.company.name}</h3>
                <p className="text-xs text-gray-400">{env.company.nameEn}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {env.company.description}
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="text-lg font-bold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-400 hover:text-white transition">
                  사업분야
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-gray-400 hover:text-white transition">
                  시공실적
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 사업분야 */}
          <div>
            <h3 className="text-lg font-bold mb-4">사업분야</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">토목</li>
              <li className="text-gray-400">지반조성포장·토공</li>
              <li className="text-gray-400">조경 식재·시설물</li>
              <li className="text-gray-400">습식 방수·도장</li>
              <li className="text-gray-400">소프트웨어</li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-bold mb-4">연락처</h3>
            <ul className="space-y-3 text-sm">
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
                <span>{env.company.phone}</span>
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{env.company.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <span>&copy; {new Date().getFullYear()} {env.company.name}.</span>
              <span className="ml-2">All Rights Reserved.</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition">
                개인정보처리방침
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
