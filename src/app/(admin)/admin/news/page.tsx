"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Megaphone, FileText, Trophy, Plus, X, Edit2, Trash2 } from "lucide-react";
import { NewsTableSkeleton } from "@/shared/components/ui/Skeleton";
import Pagination from "@/shared/components/ui/Pagination";

interface NewsItem {
  id: string;
  category: "announcement" | "news" | "award";
  title: string;
  summary: string;
  content: string;
  isNew: boolean;
  createdAt: any;
  updatedAt?: any;
}

const newsCategories = {
  announcement: { label: "공지", icon: Megaphone, color: "bg-brand-100 text-brand-700" },
  news: { label: "뉴스", icon: FileText, color: "bg-green-100 text-green-700" },
  award: { label: "수상", icon: Trophy, color: "bg-yellow-100 text-yellow-700" },
};

const emptyFormData: {
  category: "announcement" | "news" | "award";
  title: string;
  summary: string;
  content: string;
  isNew: boolean;
} = {
  category: "news",
  title: "",
  summary: "",
  content: "",
  isNew: true,
};

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "announcement" | "news" | "award">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 검색 및 필터링된 목록
  const filteredNews = newsList.filter((news) => {
    const matchesSearch =
      searchQuery === "" ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || news.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 검색/필터 변경 시 페이지 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: "all" | "announcement" | "news" | "award") => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const newsData: NewsItem[] = [];

      querySnapshot.forEach((doc) => {
        newsData.push({
          id: doc.id,
          ...doc.data(),
        } as NewsItem);
      });

      setNewsList(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (news?: NewsItem) => {
    if (news) {
      setEditingNews(news);
      setFormData({
        category: news.category,
        title: news.title,
        summary: news.summary,
        content: news.content,
        isNew: news.isNew,
      });
    } else {
      setEditingNews(null);
      setFormData(emptyFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      if (editingNews) {
        // Update existing news
        await updateDoc(doc(db, "news", editingNews.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });

        setNewsList(newsList.map(n =>
          n.id === editingNews.id
            ? { ...n, ...formData, updatedAt: new Date() }
            : n
        ));
      } else {
        // Create new news
        const docRef = await addDoc(collection(db, "news"), {
          ...formData,
          createdAt: serverTimestamp(),
        });

        setNewsList([
          { id: docRef.id, ...formData, createdAt: new Date() } as NewsItem,
          ...newsList,
        ]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving news:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "news", id));
      setNewsList(newsList.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">뉴스/공지 관리</h1>
          <p className="text-gray-500 text-sm">회사 소식 및 공지사항을 관리합니다.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors font-medium min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          새 소식 작성
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="제목, 내용 검색..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "전체" },
            { key: "announcement", label: "공지" },
            { key: "news", label: "뉴스" },
            { key: "award", label: "수상" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleCategoryChange(filter.key as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all min-h-[44px] ${
                categoryFilter === filter.key
                  ? "bg-brand-700 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      {loading ? (
        <NewsTableSkeleton rows={5} />
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredNews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>등록된 소식이 없습니다.</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-brand-700 font-medium hover:underline"
            >
              첫 번째 소식을 작성해보세요
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">분류</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">작성일</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedNews.map((news) => {
                const category = newsCategories[news.category];
                const CategoryIcon = category.icon;

                return (
                  <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${category.color}`}>
                        <CategoryIcon className="w-3.5 h-3.5" />
                        {category.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{news.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-md">{news.summary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(news.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {news.isNew ? (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">NEW</span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(news)}
                          className="p-2 text-gray-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingNews ? "소식 수정" : "새 소식 작성"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">분류</label>
                  <div className="flex gap-3">
                    {Object.entries(newsCategories).map(([key, value]) => {
                      const Icon = value.icon;
                      const isSelected = formData.category === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: key as any })}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-brand-700 bg-brand-50 text-brand-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {value.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="소식 제목을 입력하세요"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
                  <input
                    type="text"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="목록에 표시될 요약문을 입력하세요"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">본문</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                    placeholder="상세 내용을 입력하세요"
                  />
                </div>

                {/* isNew Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isNew: !formData.isNew })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isNew ? "bg-brand-700" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.isNew ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">NEW 배지 표시</span>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-5 py-2.5 bg-brand-700 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
                >
                  {saving ? "저장 중..." : editingNews ? "수정" : "등록"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
