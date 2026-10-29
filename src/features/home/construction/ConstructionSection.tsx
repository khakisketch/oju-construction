"use client";

import { motion } from "framer-motion";
import styles from "./ConstructionSection.module.css";
import homeStyles from "../HomeSections.module.css";

// 사업 영역
const businessAreas = [
  {
    title: "토목",
    subtitle: "도로·배수로 정비가 필요하신가요?",
    description: "현장 조건에 맞는 공사 범위를 살펴봅니다.",
    image: "/images/construction/civil.webp",
    category: "토목공사"
  },
  {
    title: "지반조성포장",
    subtitle: "주차장·진입로 포장면이 파손되었나요?",
    description: "부지 조성과 포장 범위를 확인합니다.",
    image: "/images/construction/paving.webp",
    category: "토공"
  },
  {
    title: "조경",
    subtitle: "녹지 공간을 조성하거나 정비해야 하나요?",
    description: "식재와 조경시설 범위를 살펴봅니다.",
    image: "/images/construction/landscape.webp",
    category: "식재 · 시설물"
  },
  {
    title: "습식",
    subtitle: "옥상·외벽 누수가 반복되나요?",
    description: "누수 부위와 방수 범위를 검토합니다.",
    image: "/images/construction/waterproofing.webp",
    category: "방수"
  },
  {
    title: "도장",
    subtitle: "외벽 도장이나 시설물 표면 정비가 필요하신가요?",
    description: "현장 상태에 맞는 도장 범위를 살펴봅니다.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    category: "도장"
  },
  {
    title: "유지보수",
    subtitle: "노후 시설물 보수·복구가 필요하신가요?",
    description: "시설 상태와 필요한 보수 범위를 확인합니다.",
    image: "/images/construction/maintenance.webp",
    category: "시설관리"
  }
];

export default function ConstructionSection() {
  return (
    <section id="construction" className="py-8 md:py-12 bg-[#f9fafb]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <header data-home-section-heading className={homeStyles.header}>
          <h2 className={homeStyles.title}>
            사업분야
          </h2>
          <p className={homeStyles.description}>
            토목, 조경, 방수, 도장 등 다양한 전문 건설 분야에서 최고의 품질을 제공합니다.
          </p>
        </header>

        {/* Mobile: compact two-column overview so all six scopes can be scanned without swiping. */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {businessAreas.map((area) => (
            <a
              key={area.title}
              href="/construction"
              className="relative h-36 overflow-hidden rounded-lg shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
            >
              <img
                src={area.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <div className="text-[15px] font-medium text-gray-200">{area.category}</div>
                <h3 className="mt-0.5 text-base font-bold leading-tight text-white">{area.title}</h3>
                <p className="mt-1 text-base leading-snug text-gray-100">{area.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {businessAreas.map((area, idx) => (
            <motion.a
              key={idx}
              href="/construction"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group ${styles.card} relative h-64 overflow-hidden rounded-lg shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2`}
            >
              {/* Background Image */}
              <div className={`absolute inset-0 ${styles.zoom}`}>
                <img
                  src={area.image}
                  alt={area.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="text-[15px] text-gray-300 mb-1.5">{area.category}</div>
                <h3 className="text-2xl font-bold text-white mb-1.5">{area.title}</h3>
                <p className={`text-base leading-snug text-white ${styles.reveal}`}>
                  {area.subtitle}<br />
                  {area.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="mb-4 text-base text-gray-600">현장 조건과 발주 범위를 먼저 살펴보세요.</p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 transition-colors shadow-md"
          >
            공사 문의
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
