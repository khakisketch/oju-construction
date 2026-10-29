"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Megaphone, FileText, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import { newsFallbackItems, type NewsItem } from "@/features/home/news/newsFallback";

const newsCategories = {
  all: { label: "전체", icon: FileText },
  announcement: { label: "공지", icon: Megaphone, color: "bg-brand-100 text-brand-700" },
  news: { label: "뉴스", icon: FileText, color: "bg-green-100 text-green-700" },
  award: { label: "수상", icon: Trophy, color: "bg-yellow-100 text-yellow-700" },
};

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>(newsFallbackItems);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Firebase 미설정 시에는 기본 안내 항목을 표시합니다.
    if (!isFirebaseConfigured) return;

    let isMounted = true;
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (!isMounted) return;
        const fetchedItems = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as NewsItem)
        );
        if (fetchedItems.length > 0) setAllNewsItems(fetchedItems);
        setLoadError(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        if (isMounted) setLoadError(true);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
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
              backgroundImage: 'url(/images/construction/hero-main.webp)'
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
                {key !== "all" && allNewsItems.length > 0 && (
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
                       <p className="line-clamp-2 text-base leading-relaxed text-gray-600">
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

          {/* 기본 안내는 유지하고, 실시간 조회가 실패한 경우만 알립니다. */}
          {loadError && (
            <div role="alert" className="mb-4 text-base text-amber-900">
              <p>소식을 불러오지 못해 기본 안내를 표시합니다.</p>
            </div>
          )}

          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-500">
                {allNewsItems.length === 0
                  ? "등록된 소식이 없습니다."
                  : "선택한 분류에 등록된 소식이 없습니다."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
