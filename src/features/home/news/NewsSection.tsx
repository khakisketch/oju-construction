"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Megaphone, FileText, Trophy } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import { newsFallbackItems, type NewsItem } from "./newsFallback";
import homeStyles from "../HomeSections.module.css";

const newsCategories = {
  announcement: { label: "공지", icon: Megaphone, color: "bg-brand-100 text-brand-700" },
  news: { label: "뉴스", icon: FileText, color: "bg-green-100 text-green-700" },
  award: { label: "수상", icon: Trophy, color: "bg-yellow-100 text-yellow-700" },
};

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(newsFallbackItems);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Firebase 연동 전에는 조회하지 않고 빈 상태를 유지합니다.
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);

        if (!isMounted) return;
        const fetchedItems = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as NewsItem)
        );
        if (fetchedItems.length > 0) setNewsItems(fetchedItems);
        setLoadError(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
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
    <section id="news" className="py-8 md:py-12 bg-[#f9fafb]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between ${homeStyles.header}`}>
          <header data-home-section-heading>
            <h2 className={homeStyles.title}>
              소식 및 공지
            </h2>
            <p className={homeStyles.description}>
              공지와 회사 소식을 확인하세요.
            </p>
          </header>
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

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-10 text-center">
            <p role="status" className="text-base text-gray-600">
              소식을 불러오고 있습니다.
            </p>
          </div>
        ) : (
          <>
            {loadError && (
              <p role="alert" className="mb-4 text-base text-amber-900">
                소식을 불러오지 못해 기본 안내를 표시합니다.
              </p>
            )}
            {newsItems.length === 0 ? (
              <div className="flex items-center gap-3 border-y border-gray-200 py-3">
                <FileText className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                <p className="text-base leading-relaxed text-gray-700">
                  <span className="font-bold text-gray-900">등록된 소식이 없습니다.</span>{" "}
                  공지와 회사 소식이 등록되면 이곳에서 안내합니다.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newsItems.map((item, idx) => {
                  const category = newsCategories[item.category];
                  const CategoryIcon = category.icon;

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${category.color}`}>
                          <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {category.label}
                        </span>
                        {item.isNew && (
                          <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-brand-700">
                        {item.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-base leading-relaxed text-gray-600">
                        {item.summary}
                      </p>
                      <div className="flex items-center gap-1.5 text-[15px] text-gray-500">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(item.createdAt)}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
