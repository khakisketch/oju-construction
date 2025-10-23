"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// 사업 영역
const businessAreas = [
  {
    title: "토목",
    subtitle: "전문적인 토목 시공으로",
    description: "완벽하게 구현합니다",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
    category: "토목공사"
  },
  {
    title: "지반조성포장",
    subtitle: "견고한 기반을",
    description: "조성합니다",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    category: "토공"
  },
  {
    title: "조경",
    subtitle: "자연과 조화로운",
    description: "공간을 창조합니다",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80",
    category: "식재 · 시설물"
  },
  {
    title: "습식",
    subtitle: "완벽한 방수로",
    description: "안전을 보장합니다",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    category: "방수"
  },
  {
    title: "도장",
    subtitle: "마무리까지 완벽한",
    description: "품질을 제공합니다",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    category: "도장"
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
        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            우리가 꿈꾸는 미래를 건설합니다.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="h-px w-12 bg-brand-600"></div>
            <span className="text-sm font-semibold text-brand-700 uppercase tracking-wide">OUR BUSINESS</span>
            <div className="h-px w-12 bg-brand-600"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            4차 산업혁명 시대에 필요한 선진기술 도입, 자체 기술 개발, 그리고 우수 인재를 보유하여 건축, 토목, 주택,<br className="hidden md:block" />
            플랜트 등 지속적인 사업영역 확장을 통해 고유기업으로 도약하고 있습니다.
          </motion.p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mt-12">
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
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${area.image})` }}
                      />

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
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {businessAreas.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-80 overflow-hidden rounded-lg shadow-lg"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${area.image})` }}
              />

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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
