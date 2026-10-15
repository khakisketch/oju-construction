"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { PortfolioSkeleton } from "@/shared/components/ui/Skeleton";
import {
  X,
  Building2,
  Calendar,
  Users,
  Ruler,
  Clock,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "construction";
  client: string;
  year: string;
  duration: string;
  scale: string;
  description?: string;
  image: string;
}

// 카테고리 매핑
const categoryMap: Record<string, string> = {
  construction: "건설",
};

const categoryInfo = {
  construction: {
    label: "건설",
    icon: Building2,
    bgColor: "bg-brand-50",
    textColor: "text-brand-700",
  },
};

// 폴백 정적 데이터
const fallbackProjects: PortfolioItem[] = [
  {
    id: "1",
    title: "청주 도로 확장공사",
    category: "construction",
    client: "청주시청",
    year: "2023",
    duration: "8개월",
    scale: "총 연장 2.5km",
    image: "/images/portfolio/project1.webp",
  },
  {
    id: "2",
    title: "대전 공공기관 신축공사",
    category: "construction",
    client: "대전광역시",
    year: "2022",
    duration: "12개월",
    scale: "연면적 5,000㎡",
    image: "/images/portfolio/project2.webp",
  },
  {
    id: "3",
    title: "청주 아파트 외벽 방수공사",
    category: "construction",
    client: "청주시 아파트 관리단",
    year: "2024",
    duration: "4개월",
    scale: "아파트 3개동 외벽 전체",
    image: "/images/portfolio/project3.webp",
  },
  {
    id: "4",
    title: "세종 산업단지 진입로 공사",
    category: "construction",
    client: "세종시 개발공사",
    year: "2022",
    duration: "10개월",
    scale: "총 연장 3.2km",
    image: "/images/portfolio/project4.webp",
  },
  {
    id: "5",
    title: "충북 아파트 단지 도장공사",
    category: "construction",
    client: "충북혁신도시 관리사무소",
    year: "2024",
    duration: "3개월",
    scale: "5개동 외부도장",
    image: "/images/portfolio/project1.webp",
  },
  {
    id: "6",
    title: "충북 관공서 방수·도장공사",
    category: "construction",
    client: "충청북도",
    year: "2024",
    duration: "3개월",
    scale: "연면적 6,500㎡",
    image: "/images/portfolio/project2.webp",
  },
];

export default function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioItem[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        if (!db) throw new Error("Firestore not initialized");
        const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"), limit(12));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const portfolioData: PortfolioItem[] = [];
          querySnapshot.forEach((doc) => {
            portfolioData.push({
              id: doc.id,
              ...doc.data(),
            } as PortfolioItem);
          });
          setProjects(portfolioData);
        }
      } catch {
        // Firestore 미활성화 또는 네트워크 에러 시 fallback 데이터 유지
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleProjectClick = (project: PortfolioItem) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = "unset";
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
            토목, 조경, 방수, 도장 등 다양한 건설 분야의 대표 프로젝트를 소개합니다.
          </motion.p>
        </div>

        {/* Grid Gallery */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleProjectClick(project)}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-white"
            >
              {/* Image Container */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-700 text-xs font-semibold rounded-full">
                    {categoryMap[project.category] || project.category}
                  </span>
                </div>

                {/* Year Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-brand-700/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {project.year}
                  </span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-brand-200 transition-colors">
                    {project.title}
                  </h3>

                  {/* Details - Always visible on mobile, hover on desktop */}
                  <div className="grid grid-cols-2 gap-2 max-h-24 md:max-h-0 md:group-hover:max-h-24 overflow-hidden transition-all duration-500">
                    <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <div className="text-xs text-gray-300">발주처</div>
                      <div className="text-sm font-medium">{project.client}</div>
                    </div>
                    <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      <div className="text-xs text-gray-300">공사규모</div>
                      <div className="text-sm font-medium">{project.scale}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-700 text-brand-700 font-semibold rounded-full hover:bg-brand-700 hover:text-white transition-all duration-300"
          >
            전체 프로젝트 보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-4 md:inset-8 lg:inset-12 bg-white rounded-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>

              <div className="flex-1 overflow-y-auto">
                {/* Hero Image */}
                <div className="relative h-64 md:h-80 lg:h-96 bg-gray-100">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 ${categoryInfo.construction.textColor}`}>
                      {(() => {
                        const Icon = categoryInfo.construction.icon;
                        return <Icon className="w-4 h-4" />;
                      })()}
                      {categoryInfo.construction.label}
                    </span>
                  </div>

                  {/* Year Badge */}
                  <div className="absolute top-6 right-16">
                    <span className="px-4 py-2 bg-brand-700/90 text-white rounded-full font-semibold">
                      {selectedProject.year}
                    </span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="text-lg text-white/80">{selectedProject.client}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 lg:p-12">
                  {/* Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className={`p-4 rounded-xl ${categoryInfo.construction.bgColor}`}>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">발주처</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedProject.client}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${categoryInfo.construction.bgColor}`}>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">연도</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedProject.year}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${categoryInfo.construction.bgColor}`}>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">공사기간</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedProject.duration || "-"}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${categoryInfo.construction.bgColor}`}>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Ruler className="w-4 h-4" />
                        <span className="text-sm">규모</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedProject.scale || "-"}</p>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProject.description && (
                    <div className="border-t border-gray-100 pt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">프로젝트 개요</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {selectedProject.description}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="border-t border-gray-100 pt-8 mt-8">
                    <div className="bg-brand-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          비슷한 프로젝트가 필요하신가요?
                        </h3>
                        <p className="text-gray-600 text-sm">
                          오주건설이 고객의 요구에 맞는 최적의 솔루션을 제공합니다.
                        </p>
                      </div>
                      <a
                        href="/contact"
                        className="whitespace-nowrap px-6 py-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 transition-colors"
                      >
                        문의하기
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
