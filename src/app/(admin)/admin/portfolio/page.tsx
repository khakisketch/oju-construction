"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  X,
  Edit2,
  Trash2,
  Calendar,
  ExternalLink,
  Search,
} from "lucide-react";
import { PortfolioGridSkeleton } from "@/shared/components/ui/Skeleton";
import ImageUpload from "@/shared/components/ui/ImageUpload";
import { uploadPortfolioImage } from "@/shared/lib/firebase/storage";
import Pagination from "@/shared/components/ui/Pagination";

const ITEMS_PER_PAGE = 9;

interface PortfolioItem {
  id: string;
  title: string;
  category: "construction";
  client: string;
  year: string;
  duration: string;
  scale: string;
  description: string;
  image: string;
  createdAt: any;
  updatedAt?: any;
}

const categories = {
  construction: { label: "건설", icon: Building2, color: "bg-brand-100 text-brand-700" },
};

const emptyFormData: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  category: "construction",
  client: "",
  year: new Date().getFullYear().toString(),
  duration: "",
  scale: "",
  description: "",
  image: "",
};

export default function AdminPortfolioPage() {
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "construction">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const fetchPortfolio = async () => {
    try {
      const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const portfolioData: PortfolioItem[] = [];

      querySnapshot.forEach((doc) => {
        portfolioData.push({
          id: doc.id,
          ...doc.data(),
        } as PortfolioItem);
      });

      setPortfolioList(portfolioData);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (portfolio?: PortfolioItem) => {
    if (portfolio) {
      setEditingPortfolio(portfolio);
      setFormData({
        title: portfolio.title,
        category: portfolio.category,
        client: portfolio.client,
        year: portfolio.year,
        duration: portfolio.duration,
        scale: portfolio.scale,
        description: portfolio.description,
        image: portfolio.image,
      });
    } else {
      setEditingPortfolio(null);
      setFormData(emptyFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPortfolio(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.client.trim()) {
      alert("프로젝트명과 발주처를 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      if (editingPortfolio) {
        await updateDoc(doc(db, "portfolio", editingPortfolio.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });

        setPortfolioList(
          portfolioList.map((p) =>
            p.id === editingPortfolio.id
              ? { ...p, ...formData, updatedAt: new Date() }
              : p
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "portfolio"), {
          ...formData,
          createdAt: serverTimestamp(),
        });

        setPortfolioList([
          { id: docRef.id, ...formData, createdAt: new Date() } as PortfolioItem,
          ...portfolioList,
        ]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "portfolio", id));
      setPortfolioList(portfolioList.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const filteredList = portfolioList.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.category === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
          <p className="text-gray-500 text-sm">시공 실적 및 프로젝트를 관리합니다.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors font-medium min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          새 프로젝트 추가
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="프로젝트명, 발주처로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all min-h-[44px] ${
            activeFilter === "all"
              ? "bg-brand-700 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          전체 ({portfolioList.length})
        </button>
        {Object.entries(categories).map(([key, value]) => {
          const count = portfolioList.filter((p) => p.category === key).length;
          const Icon = value.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all min-h-[44px] ${
                activeFilter === key
                  ? "bg-brand-700 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {value.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Portfolio Grid */}
      {loading ? (
        <PortfolioGridSkeleton items={6} />
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">등록된 프로젝트가 없습니다.</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-brand-700 font-medium hover:underline"
          >
            첫 번째 프로젝트를 추가해보세요
          </button>
        </div>
      ) : (
        <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedList.map((portfolio) => {
            const category = categories[portfolio.category];
            const CategoryIcon = category.icon;

            return (
              <motion.div
                key={portfolio.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {portfolio.image ? (
                    <img
                      src={portfolio.image}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CategoryIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenModal(portfolio)}
                      className="p-3 bg-white rounded-full text-gray-700 hover:text-brand-700 transition-colors"
                      title="수정"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(portfolio.id)}
                      className="p-3 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}
                    >
                      <CategoryIcon className="w-3 h-3" />
                      {category.label}
                    </span>
                    <span className="text-xs text-gray-400">{portfolio.year}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{portfolio.client}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{portfolio.duration}</span>
                    <span>{portfolio.scale}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        </>
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
                  {editingPortfolio ? "프로젝트 수정" : "새 프로젝트 추가"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5 overflow-y-auto flex-1"
              >
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {Object.entries(categories).map(([key, value]) => {
                      const Icon = value.icon;
                      const isSelected = formData.category === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, category: key as any })
                          }
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all min-h-[44px] ${
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트명 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="예: 청주 도로 확장공사"
                  />
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    발주처 *
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="예: 청주시청"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연도
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      placeholder="2024"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      공사기간
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      placeholder="예: 8개월"
                    />
                  </div>
                </div>

                {/* Scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    규모
                  </label>
                  <input
                    type="text"
                    value={formData.scale}
                    onChange={(e) =>
                      setFormData({ ...formData, scale: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="예: 총 연장 2.5km"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트 이미지
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    onUpload={(file) => uploadPortfolioImage(file, editingPortfolio?.id || `new-${Date.now()}`)}
                    placeholder="이미지를 업로드하세요"
                  />
                  <div className="mt-3">
                    <label className="text-xs text-gray-500 mb-1 block">또는 URL 직접 입력</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                    placeholder="프로젝트에 대한 간략한 설명을 입력하세요"
                  />
                </div>
              </form>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors min-h-[44px]"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-5 py-2.5 bg-brand-700 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  {saving ? "저장 중..." : editingPortfolio ? "수정" : "등록"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
