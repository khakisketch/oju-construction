"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const droneWorks = [
  {
    id: 1,
    title: "농지 항공 촬영",
    category: "항공 촬영",
    image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80",
  },
  {
    id: 2,
    title: "주택 및 건물 촬영",
    category: "건물 촬영",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 3,
    title: "토지 측량 및 현장 기록",
    category: "측량 · 기록",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80",
  }
];

const droneServices = [
  {
    title: "항공 촬영",
    description: "농지, 주택, 상가 등 항공 사진 및 영상 촬영",
    features: ["농지 전경 촬영", "주택 홍보 영상", "상가 건물 촬영", "고화질 항공 사진"]
  },
  {
    title: "토지 측량",
    description: "밭, 임야, 대지 등 토지 면적 정확한 측량",
    features: ["농지 면적 측량", "경계선 확인", "지형 높낮이", "토지 도면 제작"]
  },
  {
    title: "현장 기록",
    description: "공사 전후 비교, 진행 상황 기록 촬영",
    features: ["공사 전 현황", "진행 과정 촬영", "완공 후 기록", "비교 영상 제작"]
  }
];

const specifications = [
  { label: "촬영 해상도", value: "최대 8K", icon: "📷" },
  { label: "비행 시간", value: "최대 55분", icon: "⏱️" },
  { label: "측량 정확도", value: "±2cm", icon: "📏" },
  { label: "작업 고도", value: "최대 500m", icon: "✈️" },
];

const importantNotices = [
  {
    title: "촬영 전 준비사항",
    content: "촬영 목적, 원하는 앵글, 특정 강조 부분을 미리 정리해주시면 더 정확한 결과물을 받으실 수 있습니다.",
    icon: "📋"
  },
  {
    title: "날씨 영향",
    content: "비, 강풍 등 기상 상황에 따라 촬영이 연기될 수 있습니다. 안전을 최우선으로 진행합니다.",
    icon: "🌤️"
  },
  {
    title: "비행 허가",
    content: "비행 금지 구역이나 관제권 내 촬영은 사전 허가가 필요하며, 별도 협의가 필요합니다.",
    icon: "📄"
  }
];

export default function DroneSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="drone" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            전문 드론 촬영 서비스
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="h-px w-12 bg-brand-600"></div>
            <span className="text-sm font-semibold text-brand-700 uppercase tracking-wide">DRONE TECHNOLOGY</span>
            <div className="h-px w-12 bg-brand-600"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            농지, 주택, 건물 등 다양한 드론 촬영 및 측량 서비스를 제공합니다.<br className="hidden md:block" />
            청주 및 인근 지역 당일 방문 가능합니다.
          </motion.p>
        </div>

        {/* Main Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 mt-12">
          {droneWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-80 overflow-hidden rounded-xl shadow-lg cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${work.image})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-sm text-brand-300 font-semibold mb-1">{work.category}</div>
                <h3 className="text-2xl font-bold text-white">{work.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {specifications.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="text-4xl mb-3">{spec.icon}</div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{spec.label}</h4>
              <p className="text-lg font-bold text-brand-700">{spec.value}</p>
            </motion.div>
          ))}
        </motion.div>

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
                  <span>촬영 요청 전 확인사항</span>
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
              드론 촬영 의뢰 전 확인하면 좋은 사항들을 확인하세요
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
            {/* Service Details */}
            <div className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-center mb-4"
              >
                드론 촬영 서비스 안내
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-center mb-10 max-w-2xl mx-auto"
              >
                다양한 목적에 맞는 드론 촬영 및 측량 서비스를 제공합니다
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {droneServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                  >
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {service.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-brand-600 mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Important Notices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 md:p-8 mb-16"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                꼭 확인해주세요
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {importantNotices.map((notice, index) => (
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
