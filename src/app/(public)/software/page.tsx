"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SoftwarePage() {
  const [activeTab, setActiveTab] = useState<"web" | "app" | "custom">("web");

  return (
    <div>
      {/* Page Header Section - 검정 배경 */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* 코딩/개발 배경 이미지 */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80)'
            }}
          />
        </div>

        {/* 빛나는 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-700/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-brand-700/20 backdrop-blur-sm rounded-full text-brand-400 font-semibold text-sm uppercase tracking-wide mb-4 border border-brand-700/30"
            >
              Software Development
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4 text-white"
            >
              소프트웨어 개발
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-gradient-to-r from-brand-600 to-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              웹, 앱, 맞춤 소프트웨어 개발까지 20년 건설 경험을 바탕으로 한 IT 솔루션을 제공합니다
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="inline-flex flex-wrap gap-2 md:gap-3 p-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <button
                onClick={() => setActiveTab("web")}
                className={`
                  px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm md:text-base
                  transition-all duration-300
                  ${activeTab === "web"
                    ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                웹페이지 개발
              </button>
              <button
                onClick={() => setActiveTab("app")}
                className={`
                  px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm md:text-base
                  transition-all duration-300
                  ${activeTab === "app"
                    ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                앱 개발
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`
                  px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm md:text-base
                  transition-all duration-300
                  ${activeTab === "custom"
                    ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                맞춤 소프트웨어
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === "web" && <WebDevelopmentSection />}
      {activeTab === "app" && <AppDevelopmentSection />}
      {activeTab === "custom" && <CustomSoftwareSection />}
    </div>
  );
}

// 웹페이지 개발 섹션
function WebDevelopmentSection() {
  const [selectedPackage, setSelectedPackage] = useState<"STANDARD" | "DELUXE" | "PREMIUM">("STANDARD");

  const packages = [
    {
      name: "STANDARD",
      price: "799,000",
      priceUnit: "원~",
      badge: "가장 인기",
      badgeColor: "blue",
      colorTheme: "blue",
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#E0E7FF" />
          <path d="M32 12L40 24H24L32 12Z" fill="#6366F1" />
          <path d="M32 52L24 40H40L32 52Z" fill="#6366F1" />
          <path d="M16 32L28 24V40L16 32Z" fill="#818CF8" />
          <path d="M48 32L36 40V24L48 32Z" fill="#818CF8" />
        </svg>
      ),
      description: "랜딩페이지, 회사소개 등 심플한 웹사이트",
      features: [
        { label: "페이지 수", value: "메인 1P (기본 7섹션)" },
        { label: "제작기간", value: "5일 (영업일 기준)" },
        { label: "유지보수", value: "무제한 (1개월)" },
        { label: "섹션 추가", value: "1섹션 60,000원" },
        { label: "호스팅", value: "1개월 무료" },
        { label: "맞춤형 디자인", value: true },
        { label: "반응형 제작", value: true },
        { label: "기본 SEO 최적화", value: true },
        { label: "소스 코드 제공", value: "별도 문의" }
      ],
      recommended: true,
      ctaText: "무료 상담 신청"
    },
    {
      name: "DELUXE",
      price: "2,499,000",
      priceUnit: "원~",
      badge: null,
      badgeColor: null,
      colorTheme: "amber",
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#FEF3C7" />
          <path d="M32 8L36 24L52 24L39 34L44 50L32 40L20 50L25 34L12 24L28 24L32 8Z" fill="#F59E0B" />
          <circle cx="32" cy="32" r="6" fill="#FBBF24" />
        </svg>
      ),
      description: "쇼핑몰, 커뮤니티 등 다양한 기능의 웹사이트",
      features: [
        { label: "페이지 수", value: "메인 1P + 서브 5P" },
        { label: "제작기간", value: "14일 (영업일 기준)" },
        { label: "유지보수", value: "무제한 (1개월)" },
        { label: "페이지 추가", value: "1P 200,000원" },
        { label: "호스팅", value: "3개월 무료" },
        { label: "맞춤형 디자인", value: true },
        { label: "반응형 제작", value: true },
        { label: "고급 SEO 최적화", value: true },
        { label: "소스 코드 제공", value: "별도 문의" }
      ],
      recommended: false,
      ctaText: "인기 패키지 선택하기"
    },
    {
      name: "PREMIUM",
      price: "견적 문의",
      priceUnit: "",
      badge: null,
      badgeColor: null,
      colorTheme: "purple",
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#F3E8FF" />
          <path d="M16 42L20 22L32 30L44 22L48 42H16Z" fill="#9333EA" />
          <circle cx="20" cy="22" r="3" fill="#A855F7" />
          <circle cx="32" cy="18" r="3" fill="#A855F7" />
          <circle cx="44" cy="22" r="3" fill="#A855F7" />
          <rect x="16" y="42" width="32" height="4" fill="#7C3AED" />
        </svg>
      ),
      description: "포털, 플랫폼 등 복잡한 기능의 대규모 웹사이트",
      features: [
        { label: "페이지 수", value: "메인 1P + 서브 00P" },
        { label: "제작기간", value: "30일+ (영업일 기준)" },
        { label: "유지보수", value: "무제한 (1개월)" },
        { label: "페이지 추가", value: "1P 200,000원" },
        { label: "호스팅", value: "6개월 무료" },
        { label: "맞춤형 디자인", value: true },
        { label: "반응형 제작", value: true },
        { label: "전문 SEO 컨설팅", value: true },
        { label: "소스 코드 제공", value: "별도 문의" }
      ],
      recommended: false,
      ctaText: "맞춤 견적 받기"
    }
  ];

  const portfolio = [
    {
      title: "제조업체 홈페이지",
      category: "기업 웹사이트",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      tags: ["반응형", "CMS", "다국어"]
    },
    {
      title: "부동산 플랫폼",
      category: "서비스 웹사이트",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      tags: ["지도 API", "검색", "회원"]
    },
    {
      title: "교육 기관 포털",
      category: "포털 웹사이트",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
      tags: ["LMS", "대시보드", "관리자"]
    }
  ];

  return (
    <>
      {/* Packages Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              Custom Website
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            >
              맞춤형 홈페이지 제작
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              필요한 섹션 수와 페이지 수와 상황 등에 맞게 맞춤형 제작을 진행합니다
            </motion.p>
          </div>

          {/* Mobile Package Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:hidden flex justify-center mb-8"
          >
            <div className="inline-flex gap-2 p-1.5 bg-gray-100 rounded-xl">
              <button
                onClick={() => setSelectedPackage("STANDARD")}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all ${
                  selectedPackage === "STANDARD"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                STANDARD
              </button>
              <button
                onClick={() => setSelectedPackage("DELUXE")}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all ${
                  selectedPackage === "DELUXE"
                    ? "bg-white text-amber-600 shadow-md"
                    : "text-gray-500 hover:text-amber-600"
                }`}
              >
                DELUXE
              </button>
              <button
                onClick={() => setSelectedPackage("PREMIUM")}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all ${
                  selectedPackage === "PREMIUM"
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                PREMIUM
              </button>
            </div>
          </motion.div>

          {/* Desktop: Show all packages */}
          <div className="hidden lg:grid md:grid-cols-3 gap-8 items-center">
            {packages.map((pkg, idx) => {
              const getBadgeColor = (color: string) => {
                const colors = {
                  amber: "bg-gradient-to-r from-amber-500 to-orange-500",
                  purple: "bg-gradient-to-r from-purple-600 to-purple-700",
                  blue: "bg-gradient-to-r from-blue-600 to-blue-700"
                };
                return colors[color as keyof typeof colors] || "bg-brand-700";
              };

              const getRingColor = (color: string) => {
                const colors = {
                  amber: "ring-amber-500",
                  purple: "ring-purple-600",
                  blue: "ring-blue-600"
                };
                return colors[color as keyof typeof colors] || "ring-brand-700";
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative bg-white rounded-2xl p-6 transition-all duration-300 ${
                    pkg.recommended
                      ? `ring-2 ${getRingColor(pkg.colorTheme)} shadow-2xl md:scale-105 hover:-translate-y-2`
                      : "border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className={`${getBadgeColor(pkg.badgeColor || 'amber')} text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                        {pkg.badge}
                      </span>
                    </div>
                  )}


                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      pkg.name === "STANDARD" ? "text-blue-600" :
                      pkg.name === "DELUXE" ? "text-amber-600" :
                      pkg.name === "PREMIUM" ? "text-purple-600" : ""
                    }`}>{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                    {/* 가격 표시 */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                        <span className="text-lg text-gray-600">{pkg.priceUnit}</span>
                      </div>
                      {pkg.recommended && (
                        <p className="text-sm text-amber-600 font-semibold mt-1">가장 합리적인 선택</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        {feature.label === "소스 코드 제공" ? (
                          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {feature.value === true ? (
                          <span className="text-gray-700">{feature.label}</span>
                        ) : (
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{feature.label}</div>
                            <div className="text-gray-600 text-xs mt-0.5">{feature.value}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className={`block w-full text-center px-6 py-3.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
                      pkg.recommended
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {pkg.ctaText}
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: Show selected package only */}
          <div className="lg:hidden">
            {packages
              .filter(pkg => pkg.name === selectedPackage)
              .map((pkg, idx) => {
                const getBadgeColor = (color: string) => {
                  const colors = {
                    amber: "bg-gradient-to-r from-amber-500 to-orange-500",
                    purple: "bg-gradient-to-r from-purple-600 to-purple-700",
                    blue: "bg-gradient-to-r from-blue-600 to-blue-700"
                  };
                  return colors[color as keyof typeof colors] || "bg-brand-700";
                };

                const getRingColor = (color: string) => {
                  const colors = {
                    amber: "ring-amber-500",
                    purple: "ring-purple-600",
                    blue: "ring-blue-600"
                  };
                  return colors[color as keyof typeof colors] || "ring-brand-700";
                };

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-white rounded-2xl p-6 transition-all duration-300 ${
                      pkg.recommended
                        ? `ring-2 ${getRingColor(pkg.colorTheme)} shadow-2xl`
                        : "border border-gray-200 shadow-lg"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className={`${getBadgeColor(pkg.badgeColor || 'amber')} text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${
                        pkg.name === "STANDARD" ? "text-blue-600" :
                        pkg.name === "DELUXE" ? "text-amber-600" :
                        pkg.name === "PREMIUM" ? "text-purple-600" : ""
                      }`}>{pkg.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                      {/* 가격 표시 */}
                      <div className="mb-4">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                          <span className="text-lg text-gray-600">{pkg.priceUnit}</span>
                        </div>
                        {pkg.recommended && (
                          <p className="text-sm text-amber-600 font-semibold mt-1">가장 합리적인 선택</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          {feature.label === "소스 코드 제공" ? (
                            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {feature.value === true ? (
                            <span className="text-gray-700">{feature.label}</span>
                          ) : (
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{feature.label}</div>
                              <div className="text-gray-600 text-xs mt-0.5">{feature.value}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className={`block w-full text-center px-6 py-3.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
                        pkg.recommended
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {pkg.ctaText}
                    </a>
                  </motion.div>
                );
              })}
          </div>

          {/* 안내 문구 */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-gray-500 mt-8"
          >
            제시된 금액은 수정횟수, A/S 등이 포함된 최종 결제 가격입니다.
          </motion.p>

          {/* 제작 외 별도 비용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                <span className="text-brand-700">제작 외 별도 비용</span>
              </h3>
              <p className="text-gray-600">
                홈페이지 제작 시 꼭 필요한 필수 비용입니다. (1년 기준 약 272,000원)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-brand-700 text-white py-3 px-4 text-center font-semibold border border-brand-600">품목</th>
                    <th className="bg-brand-700 text-white py-3 px-4 text-center font-semibold border border-brand-600">내용</th>
                    <th className="bg-brand-700 text-white py-3 px-4 text-center font-semibold border border-brand-600">금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center border border-gray-200">도메인</td>
                    <td className="py-3 px-4 text-center border border-gray-200 text-gray-600">홈페이지 URL</td>
                    <td className="py-3 px-4 text-center border border-gray-200 font-medium">연 20,000원</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center border border-gray-200">호스팅</td>
                    <td className="py-3 px-4 text-center border border-gray-200 text-gray-600">온라인 서버 임대</td>
                    <td className="py-3 px-4 text-center border border-gray-200 font-medium">월 16,000원 +@</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center border border-gray-200">SSL</td>
                    <td className="py-3 px-4 text-center border border-gray-200 text-gray-600">개인정보보호인증서</td>
                    <td className="py-3 px-4 text-center border border-gray-200 font-medium">연 35,000원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            >
              웹페이지 포트폴리오
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              완성된 프로젝트를 확인해보세요
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-gray-300 mb-2">{project.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-brand-700 to-brand-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">프로젝트를 시작할 준비가 되셨나요?</h2>
            <p className="text-white/90 mb-8">전문가와 상담하고 맞춤 견적을 받아보세요</p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-white text-brand-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              무료 견적 상담 받기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// 앱 개발 섹션
function AppDevelopmentSection() {
  const portfolio = [
    {
      title: "물류 관리 앱",
      platform: "iOS / Android",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      tags: ["GPS", "실시간", "알림"]
    },
    {
      title: "헬스케어 앱",
      platform: "하이브리드",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      tags: ["데이터 분석", "차트", "백엔드"]
    },
    {
      title: "전자상거래 앱",
      platform: "iOS / Android",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      tags: ["결제", "푸시", "회원"]
    }
  ];

  return (
    <>
      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              Mobile App
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            >
              모바일 앱 개발
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              iOS, Android 네이티브부터 크로스플랫폼까지 프로젝트 요구사항에 맞는 최적의 솔루션을 제공합니다
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold mb-2">iOS 앱</h3>
              <p className="text-sm text-gray-600">Swift, SwiftUI로 제작하는 네이티브 iOS 앱</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold mb-2">Android 앱</h3>
              <p className="text-sm text-gray-600">Kotlin, Jetpack Compose 기반 Android 앱</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">하이브리드 앱</h3>
              <p className="text-sm text-gray-600">React Native, Flutter 크로스플랫폼</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            >
              앱 개발 포트폴리오
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              완성된 모바일 앱을 확인해보세요
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-gray-300 mb-2">{project.platform}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-brand-700 to-brand-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">앱 개발 견적이 필요하신가요?</h2>
            <p className="text-white/90 mb-8">프로젝트 상세 내용을 알려주시면 맞춤 견적을 제공해드립니다</p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-white text-brand-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              견적 문의하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// 맞춤 소프트웨어 섹션
function CustomSoftwareSection() {
  const services = [
    {
      icon: "🏢",
      title: "ERP 시스템",
      description: "전사적 자원 관리 시스템",
      features: ["재무/회계", "인사/급여", "생산관리", "구매/재고"]
    },
    {
      icon: "👥",
      title: "CRM",
      description: "고객 관계 관리 시스템",
      features: ["영업관리", "고객DB", "마케팅", "분석"]
    },
    {
      icon: "📦",
      title: "재고관리",
      description: "스마트 재고 관리 솔루션",
      features: ["입출고", "바코드", "재고분석", "발주자동화"]
    },
    {
      icon: "⚙️",
      title: "업무 자동화",
      description: "반복 업무 자동화 시스템",
      features: ["RPA", "워크플로우", "스케줄러", "API 연동"]
    }
  ];

  const portfolio = [
    {
      title: "제조업 ERP",
      category: "전사적 자원관리",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      tags: ["ERP", "재고", "생산"]
    },
    {
      title: "물류 관리 시스템",
      category: "물류/배송",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      tags: ["실시간", "GPS", "최적화"]
    },
    {
      title: "영업 CRM",
      category: "영업/마케팅",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
      tags: ["CRM", "분석", "대시보드"]
    }
  ];

  return (
    <>
      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              Custom Software
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            >
              맞춤 소프트웨어 개발
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              기업의 특수한 요구사항에 맞춘 전문 솔루션을 제공합니다
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            >
              맞춤 개발 포트폴리오
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-brand-700 mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              다양한 산업군의 맞춤 솔루션 구축 경험을 확인해보세요
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-gray-300 mb-2">{project.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-brand-700 to-brand-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">맞춤 솔루션이 필요하신가요?</h2>
            <p className="text-white/90 mb-8">업무 프로세스 분석부터 시스템 구축까지 전문가가 함께합니다</p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-white text-brand-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              프로젝트 상담하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
