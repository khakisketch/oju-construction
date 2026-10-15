"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// 사업 영역
const businessAreas = [
  {
    title: "토목",
    subtitle: "전문적인 토목 시공으로",
    description: "완벽하게 구현합니다",
    image: "/images/construction/civil.webp",
    category: "토목공사"
  },
  {
    title: "지반조성포장",
    subtitle: "견고한 기반을",
    description: "조성합니다",
    image: "/images/construction/paving.webp",
    category: "토공"
  },
  {
    title: "조경",
    subtitle: "자연과 조화로운",
    description: "공간을 창조합니다",
    image: "/images/construction/landscape.webp",
    category: "식재 · 시설물"
  },
  {
    title: "습식",
    subtitle: "아파트·건물 완벽 방수로",
    description: "안전을 보장합니다",
    image: "/images/construction/waterproofing.webp",
    category: "방수"
  },
  {
    title: "도장",
    subtitle: "아파트 외벽·건물 도장",
    description: "품질을 제공합니다",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    category: "도장"
  },
  {
    title: "유지보수",
    subtitle: "아파트·시설물 체계적 관리로",
    description: "자산가치를 높입니다",
    image: "/images/construction/maintenance.webp",
    category: "시설관리"
  }
];

export default function ConstructionSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % businessAreas.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + businessAreas.length) % businessAreas.length);
  };

  return (
    <section id="construction" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
          >
            Our Business
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            사업분야
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-20 h-1 bg-brand-700 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            토목, 조경, 방수, 도장 등 다양한 전문 건설 분야에서 최고의 품질을 제공합니다.
          </motion.p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {businessAreas.map((area, idx) => (
                  <div key={idx} className="min-w-full">
                    <div className="group relative h-96 overflow-hidden rounded-lg shadow-lg mx-2">
                      {/* Background Image */}
                      <div className="absolute inset-0">
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
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="text-sm text-gray-300 mb-2">{area.category}</div>
                        <h3 className="text-3xl font-bold text-white mb-2">{area.title}</h3>
                        <p className="text-white text-sm leading-relaxed">
                          {area.subtitle}<br />
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {businessAreas.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === idx ? "bg-brand-700 w-8" : "bg-gray-300"
                  }`}
                  aria-label={`슬라이드 ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons & Counter */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={prevSlide}
                className="p-2 hover:bg-gray-100 rounded transition-all"
                aria-label="이전"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="text-sm text-gray-600 font-medium min-w-[3rem] text-center">
                {currentSlide + 1} / {businessAreas.length}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 hover:bg-gray-100 rounded transition-all"
                aria-label="다음"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessAreas.map((area, idx) => (
            <motion.a
              key={idx}
              href="/construction"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-80 overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
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
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-sm text-gray-300 mb-2">{area.category}</div>
                <h3 className="text-3xl font-bold text-white mb-2">{area.title}</h3>
                <p className="text-white text-sm leading-relaxed">
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
          className="text-center mt-12"
        >
          <p className="text-gray-500 mb-4 text-sm">6개 전문면허로 하도급 없이 원스톱 시공 — 비용과 공기를 절감합니다</p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            무료 견적 상담
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
