"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// 개발 서비스 영역
const serviceAreas = [
  {
    title: "웹 개발",
    description: "기업 웹사이트 및 웹 애플리케이션",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    title: "모바일 앱",
    description: "iOS/Android 네이티브 및 크로스플랫폼",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
  },
  {
    title: "시스템 구축",
    description: "업무 자동화 및 맞춤형 솔루션",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  },
  {
    title: "유지보수",
    description: "시스템 운영 및 지속적인 개선",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80"
  }
];

// 견적 요청 전 준비사항
const preparationGuide = [
  {
    title: "참고 사례 준비",
    description: "비슷한 서비스나 웹사이트 URL을 준비해주세요",
    icon: "🔗",
    details: ["원하는 디자인 스타일", "필요한 주요 기능", "레이아웃 구조 예시"]
  },
  {
    title: "기능 목록 정리",
    description: "필요한 기능들을 간단히 정리해주세요",
    icon: "📝",
    details: ["회원가입/로그인 여부", "결제 기능 필요 여부", "관리자 페이지 필요 여부"]
  },
  {
    title: "콘텐츠 자료",
    description: "사용할 텍스트, 이미지 등을 미리 준비해주시면 좋습니다",
    icon: "📁",
    details: ["회사/서비스 소개 텍스트", "로고 및 이미지 파일", "제품/서비스 사진"]
  },
  {
    title: "예산 및 일정",
    description: "대략적인 예산과 원하는 완료 시기를 알려주세요",
    icon: "📅",
    details: ["예산 범위", "오픈 희망 일정", "단계별 진행 가능 여부"]
  }
];

// 안내사항
const notices = [
  {
    title: "디자인 작업",
    content: "별도의 디자이너가 없어 기획서나 상세 디자인 시안은 제공되지 않습니다. 참고 사례를 기반으로 개발 과정에서 함께 조율합니다.",
    icon: "🎨"
  },
  {
    title: "개발 방식",
    content: "최신 웹 기술을 활용하여 반응형으로 제작되며, 모바일에서도 최적화된 화면을 제공합니다.",
    icon: "💻"
  },
  {
    title: "유지보수",
    content: "완료 후 3개월 무상 A/S가 제공되며, 이후 유지보수는 별도 계약으로 진행됩니다.",
    icon: "🔧"
  }
];

export default function SoftwareSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="software" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            전문 소프트웨어 개발
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="h-px w-12 bg-brand-600"></div>
            <span className="text-sm font-semibold text-brand-700 uppercase tracking-wide">SOFTWARE DEVELOPMENT</span>
            <div className="h-px w-12 bg-brand-600"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            최신 기술 스택과 검증된 개발 방법론으로 비즈니스 성공을 지원합니다.<br className="hidden md:block" />
            웹, 모바일, 시스템 개발부터 유지보수까지 전 과정을 책임집니다.
          </motion.p>
        </div>

        {/* Service Areas */}
        <div className="mb-16 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceAreas.map((area, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-64 overflow-hidden rounded-xl shadow-lg cursor-pointer"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${area.image})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold mb-2 text-white">
                    {area.title}
                  </h4>
                  <p className="text-gray-200 text-sm">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 blur-xl opacity-25 rounded-full"></div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <svg
                className="w-5 h-5 text-gray-100 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>

              {isExpanded ? (
                <>
                  <span>상세 안내 접기</span>
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>견적 요청 전 확인사항</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {!isExpanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-500 mt-3"
            >
              개발 의뢰 전 준비하면 좋은 사항들을 확인하세요
            </motion.p>
          )}
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Preparation Guide */}
            <div className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-center mb-4"
              >
                견적 요청 전 준비사항
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-center mb-10 max-w-2xl mx-auto"
              >
                아래 항목들을 미리 준비해주시면 더 정확한 견적과 빠른 진행이 가능합니다
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {preparationGuide.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{item.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </p>
                        <ul className="space-y-1">
                          {item.details.map((detail, i) => (
                            <li key={i} className="text-xs text-gray-500 flex items-start">
                              <span className="text-brand-600 mr-2">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Important Notices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 md:p-8"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                꼭 확인해주세요
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {notices.map((notice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-lg p-5 shadow-sm"
                  >
                    <div className="text-3xl mb-3">{notice.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{notice.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notice.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
