"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Megaphone, FileText, Trophy } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

interface NewsItem {
  id: string;
  category: "announcement" | "news" | "award";
  title: string;
  summary: string;
  isNew: boolean;
  createdAt: any;
}

const newsCategories = {
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
    createdAt: new Date("2024-01-15"),
    isNew: true,
  },
  {
    id: "2",
    category: "announcement",
    title: "설 연휴 휴무 안내",
    summary: "2024년 설 연휴 기간(2/9~2/12) 동안 휴무입니다. 긴급 문의는 비상연락망을 이용해 주세요.",
    createdAt: new Date("2024-01-10"),
    isNew: true,
  },
  {
    id: "3",
    category: "award",
    title: "2023년 우수 시공업체 선정",
    summary: "충청남도 건설협회로부터 2023년 우수 시공업체로 선정되었습니다.",
    createdAt: new Date("2023-12-20"),
    isNew: false,
  },
  {
    id: "4",
    category: "news",
    title: "스마트 건설 기술 도입",
    summary: "BIM 기반 스마트 건설 시스템을 도입하여 시공 품질과 효율성을 높이고 있습니다.",
    createdAt: new Date("2023-12-05"),
    isNew: false,
  },
];

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNewsItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const newsData: NewsItem[] = [];
          querySnapshot.forEach((doc) => {
            newsData.push({
              id: doc.id,
              ...doc.data(),
            } as NewsItem);
          });
          setNewsItems(newsData);
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
    <section id="news" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
            >
              News & Notice
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2"
            >
              소식 및 공지
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-brand-700 font-medium hover:text-brand-800 transition-colors mt-4 md:mt-0"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, idx) => {
            const category = newsCategories[item.category as keyof typeof newsCategories];
            const CategoryIcon = category.icon;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-gray-50 hover:bg-white rounded-xl p-5 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Category & New Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {category.label}
                  </span>
                  {item.isNew && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                      NEW
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {item.summary}
                </p>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.createdAt)}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
