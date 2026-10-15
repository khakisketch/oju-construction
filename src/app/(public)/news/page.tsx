"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Megaphone, FileText, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

interface NewsItem {
  id: string;
  category: "announcement" | "news" | "award";
  title: string;
  summary: string;
  content: string;
  isNew: boolean;
  createdAt: any;
}

const newsCategories = {
  all: { label: "전체", icon: FileText },
  announcement: { label: "공지", icon: Megaphone, color: "bg-brand-100 text-brand-700" },
  news: { label: "뉴스", icon: FileText, color: "bg-green-100 text-green-700" },
  award: { label: "수상", icon: Trophy, color: "bg-yellow-100 text-yellow-700" },
};

// 기본 더미 데이터 (Firestore 데이터가 없을 때 사용)
const defaultNewsItems: NewsItem[] = [
  {
    id: "1",
    category: "news",
    title: "2024년 상반기 신규 프로젝트 수주",
    summary: "청주시 도로 정비사업 및 세종시 산업단지 조성공사를 신규 수주하였습니다.",
    content: "오주건설(주)는 2024년 상반기에 청주시 도로 정비사업과 세종시 산업단지 조성공사를 신규 수주하였습니다. 이번 수주를 통해 회사의 기술력과 신뢰성을 다시 한번 입증하였으며, 성공적인 프로젝트 완수를 위해 최선을 다하겠습니다.",
    createdAt: new Date("2024-01-15"),
    isNew: true,
  },
  {
    id: "2",
    category: "announcement",
    title: "설 연휴 휴무 안내",
    summary: "2024년 설 연휴 기간(2/9~2/12) 동안 휴무입니다. 긴급 문의는 비상연락망을 이용해 주세요.",
    content: "2024년 설 연휴를 맞이하여 2월 9일(금)부터 2월 12일(월)까지 휴무합니다. 긴급한 문의사항은 비상연락망을 통해 연락 부탁드립니다. 새해 복 많이 받으세요.",
    createdAt: new Date("2024-01-10"),
    isNew: true,
  },
  {
    id: "3",
    category: "award",
    title: "2023년 우수 시공업체 선정",
    summary: "충청남도 건설협회로부터 2023년 우수 시공업체로 선정되었습니다.",
    content: "오주건설(주)가 충청남도 건설협회로부터 2023년 우수 시공업체로 선정되었습니다. 이번 선정은 그동안의 품질 경영과 안전 관리에 대한 노력을 인정받은 결과입니다.",
    createdAt: new Date("2023-12-20"),
    isNew: false,
  },
  {
    id: "4",
    category: "news",
    title: "스마트 건설 기술 도입",
    summary: "BIM 기반 스마트 건설 시스템을 도입하여 시공 품질과 효율성을 높이고 있습니다.",
    content: "오주건설(주)는 BIM(Building Information Modeling) 기반 스마트 건설 시스템을 본격적으로 도입합니다. 이를 통해 공사 효율성을 높이고 품질을 향상시킬 예정입니다.",
    createdAt: new Date("2023-12-05"),
    isNew: false,
  },
  {
    id: "5",
    category: "announcement",
    title: "2023년 연말 휴무 안내",
    summary: "2023년 연말연시 휴무 일정을 안내드립니다.",
    content: "2023년 12월 30일(토)부터 2024년 1월 1일(월)까지 연말연시 휴무입니다. 새해에도 변함없는 성원 부탁드립니다.",
    createdAt: new Date("2023-12-01"),
    isNew: false,
  },
  {
    id: "6",
    category: "news",
    title: "천안 교량 보수공사 완공",
    summary: "한국도로공사 발주 천안 교량 보수공사를 성공적으로 완공하였습니다.",
    content: "오주건설(주)는 한국도로공사에서 발주한 천안 교량 보수공사를 성공적으로 완공하였습니다. 총 6개월간의 공사 기간 동안 무재해로 공사를 마무리하였습니다.",
    createdAt: new Date("2023-11-15"),
    isNew: false,
  },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>(defaultNewsItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const newsData: NewsItem[] = [];
          querySnapshot.forEach((doc) => {
            newsData.push({
              id: doc.id,
              ...doc.data(),
            } as NewsItem);
          });
          setAllNewsItems(newsData);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        // Firestore 오류 시 기본 데이터 유지
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = activeCategory === "all"
    ? allNewsItems
    : allNewsItems.filter(item => item.category === activeCategory);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80)'
            }}
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <span className="inline-block px-4 py-1.5 bg-brand-700/80 text-white text-sm font-medium rounded-full mb-4">
              News & Notice
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              소식 및 공지
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              오주건설(주)의 최신 소식과 공지사항을 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-brand-700">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">소식 및 공지</span>
          </nav>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(newsCategories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  activeCategory === key
                    ? "bg-brand-700 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {value.label}
                {key !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    ({allNewsItems.filter(item => item.category === key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.map((item, idx) => {
              const category = newsCategories[item.category as keyof typeof newsCategories];

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Category Badge */}
                    <div className="flex items-center gap-3">
                      {"color" in category && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                          <category.icon className="w-3.5 h-3.5" />
                          {category.label}
                        </span>
                      )}
                      {item.isNew && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-brand-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {item.summary}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">등록된 소식이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
