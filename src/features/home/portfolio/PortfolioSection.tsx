"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const categories = ["전체", "건설", "소프트웨어", "측량&촬영"];

const projects = [
  {
    id: 1,
    title: "청주 도로 확장공사",
    category: "건설",
    client: "청주시청",
    year: "2023",
    duration: "8개월",
    scale: "총 연장 2.5km",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80",
  },
  {
    id: 2,
    title: "대전 공공기관 신축공사",
    category: "건설",
    client: "대전광역시",
    year: "2022",
    duration: "12개월",
    scale: "연면적 5,000㎡",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
  },
  {
    id: 3,
    title: "천안 교량 보수공사",
    category: "건설",
    client: "한국도로공사",
    year: "2023",
    duration: "6개월",
    scale: "교량 길이 450m",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  },
  {
    id: 4,
    title: "세종 산업단지 진입로 공사",
    category: "건설",
    client: "세종시 개발공사",
    year: "2022",
    duration: "10개월",
    scale: "총 연장 3.2km",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  },
  {
    id: 5,
    title: "건설현장 관리 시스템",
    category: "소프트웨어",
    client: "오주건설(주)",
    year: "2023",
    duration: "4개월",
    scale: "Web & Mobile",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  },
  {
    id: 6,
    title: "드론 측량 및 3D 모델링",
    category: "측량&촬영",
    client: "충청남도",
    year: "2023",
    duration: "2개월",
    scale: "면적 50만㎡",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredProjects = activeCategory === "전체"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const currentProject = filteredProjects[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredProjects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredProjects.length - 1 ? 0 : prev + 1));
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
          >
            Our Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            주요 시공실적
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
            대표 프로젝트를 소개합니다.
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-8 md:mb-12"
        >
          <div className="inline-flex flex-wrap gap-2 md:gap-3 p-2 bg-gray-50 rounded-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`
                  px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm md:text-base
                  transition-all duration-300
                  ${activeCategory === category
                    ? 'bg-brand-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-brand-700 hover:bg-white'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Single Project Display with Animation */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer bg-white">
                  <div className="relative h-[420px] md:h-[480px] overflow-hidden">
                    <Image
                      src={currentProject.image}
                      alt={currentProject.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Base Gradient - Always Visible for Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Hover Gradient - Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Project Title - Always Visible */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                      <div className="max-w-4xl">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg transition-all duration-300 group-hover:mb-4 group-hover:md:mb-6"
                        >
                          {currentProject.title}
                        </motion.h3>

                        {/* Project Info - Only on Hover with Staggered Animation */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-out">
                          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                            <div className="text-xs md:text-sm text-gray-200 mb-1">발주처</div>
                            <div className="text-sm md:text-lg font-semibold">{currentProject.client}</div>
                          </div>
                          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                            <div className="text-xs md:text-sm text-gray-200 mb-1">완공연도</div>
                            <div className="text-sm md:text-lg font-semibold">{currentProject.year}년</div>
                          </div>
                          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-[225ms]">
                            <div className="text-xs md:text-sm text-gray-200 mb-1">공사기간</div>
                            <div className="text-sm md:text-lg font-semibold">{currentProject.duration}</div>
                          </div>
                          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-300">
                            <div className="text-xs md:text-sm text-gray-200 mb-1">공사규모</div>
                            <div className="text-sm md:text-lg font-semibold">{currentProject.scale}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls - Bottom Centered */}
          <div className="flex items-center justify-center gap-6 mt-8 md:mt-10">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-brand-700 border-2 border-gray-200 hover:border-brand-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="이전"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors hidden md:inline">이전</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${currentIndex === index ? 'bg-brand-700 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'}
                  `}
                  aria-label={`프로젝트 ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-brand-700 border-2 border-gray-200 hover:border-brand-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="다음"
            >
              <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors hidden md:inline">다음</span>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-sm text-gray-500 font-medium">
            {currentIndex + 1} / {filteredProjects.length}
          </div>
        </div>
      </div>
    </section>
  );
}
