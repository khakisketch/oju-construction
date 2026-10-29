"use client";

import { useState, useEffect, useRef } from "react";
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
import { deleteImage, uploadPortfolioImage, uploadPortfolioVideo } from "@/shared/lib/firebase/storage";
import {
  PORTFOLIO_VIDEO_ACCEPT_ATTR,
  captureVideoPoster,
  validatePortfolioVideoFile,
} from "@/features/home/portfolio/videoPoster";
import Pagination from "@/shared/components/ui/Pagination";

const ITEMS_PER_PAGE = 9;

interface PortfolioItem {
  id: string;
  title: string;
  category: "construction";
  trade?: string;
  location?: string;
  scope?: string;
  client: string;
  clientType?: string;
  result?: string;
  year: string;
  duration: string;
  scale: string;
  description: string;
  image?: string;
  images?: string[];
  imageBefore?: string;
  imageAfter?: string;
  published?: boolean;
  videoUrl?: string;
  videoPoster?: string;
  createdAt: any;
  updatedAt?: any;
}

interface PortfolioFormData {
  title: string;
  category: "construction";
  trade: string;
  location: string;
  scope: string;
  client: string;
  clientType: string;
  result: string;
  year: string;
  duration: string;
  scale: string;
  description: string;
  image: string;
  images: string[];
  imageBefore: string;
  imageAfter: string;
  published: boolean;
  videoUrl: string;
  videoPoster: string;
}

const tradeOptions = ["토목", "지반조성포장", "조경", "습식(방수)", "도장", "유지보수"];

const categories = {
  construction: { label: "건설", icon: Building2, color: "bg-brand-100 text-brand-700" },
};

const emptyFormData: PortfolioFormData = {
  title: "",
  category: "construction",
  trade: "",
  location: "",
  scope: "",
  client: "",
  clientType: "",
  result: "",
  year: "",
  duration: "",
  scale: "",
  description: "",
  image: "",
  images: [],
  imageBefore: "",
  imageAfter: "",
  published: true,
  videoUrl: "",
  videoPoster: "",
};

export default function AdminPortfolioPage() {
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<PortfolioFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageBeforeInputRef = useRef<HTMLInputElement>(null);
  const imageAfterInputRef = useRef<HTMLInputElement>(null);
  const [uploadingComparison, setUploadingComparison] = useState<"before" | "after" | null>(null);
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
      const images = Array.from(new Set([
        ...(Array.isArray(portfolio.images) ? portfolio.images.filter(Boolean) : []),
        ...(portfolio.image ? [portfolio.image] : []),
      ]));
      setEditingPortfolio(portfolio);
      setFormData({
        title: portfolio.title,
        category: portfolio.category || "construction",
        trade: portfolio.trade || "",
        location: portfolio.location || "",
        scope: portfolio.scope || portfolio.scale || "",
        client: portfolio.client || "",
        clientType: portfolio.clientType || "",
        result: portfolio.result || "",
        year: portfolio.year || "",
        duration: portfolio.duration || "",
        scale: portfolio.scale || "",
        description: portfolio.description || "",
        image: images[0] || "",
        images,
        imageBefore: portfolio.imageBefore || "",
        imageAfter: portfolio.imageAfter || "",
        published: portfolio.published !== false,
        videoUrl: portfolio.videoUrl || "",
        videoPoster: portfolio.videoPoster || "",
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
    setVideoError("");
    setUploadingVideo(false);
  };

  const updateImage = (index: number, value: string) => {
    setFormData((previous) => {
      const images = [...previous.images];
      images[index] = value;
      return { ...previous, images, image: images.find(Boolean) || "" };
    });
  };

  const removeImage = (index: number) => {
    setFormData((previous) => {
      const images = previous.images.filter((_, imageIndex) => imageIndex !== index);
      return { ...previous, images, image: images.find(Boolean) || "" };
    });
  };

  const handleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024);
    if (invalidFile) {
      alert("이미지 파일만 업로드할 수 있으며, 파일 크기는 각각 5MB 이하여야 합니다.");
      return;
    }

    setUploadingImages(true);
    try {
      const folderPrefix = editingPortfolio?.id || `new-${Date.now()}`;
      const uploadedImages = await Promise.all(files.map((file, index) =>
        uploadPortfolioImage(file, `${folderPrefix}-${Date.now()}-${index}`)
      ));
      setFormData((previous) => {
        const images = [...previous.images, ...uploadedImages];
        return { ...previous, images, image: images.find(Boolean) || "" };
      });
    } catch (error) {
      console.error("Portfolio image upload error:", error);
      alert("사진 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleComparisonImageUpload = async (
    field: "imageBefore" | "imageAfter",
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("이미지 파일만 업로드할 수 있으며, 파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploadingComparison(field === "imageBefore" ? "before" : "after");
    try {
      const folderPrefix = editingPortfolio?.id || `new-${Date.now()}`;
      const uploadedImage = await uploadPortfolioImage(file, `${folderPrefix}-${field}-${Date.now()}`);
      setFormData((previous) => ({ ...previous, [field]: uploadedImage }));
    } catch (error) {
      console.error("Portfolio comparison image upload error:", error);
      alert("비교 사진 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingComparison(null);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validatePortfolioVideoFile(file);
    if (validationError) {
      setVideoError(validationError);
      return;
    }

    setVideoError("");
    setUploadingVideo(true);
    try {
      const folderPrefix = editingPortfolio?.id || `new-${Date.now()}`;
      const uploadedUrl = await uploadPortfolioVideo(file, folderPrefix);
      const poster = await captureVideoPoster(file);
      setFormData((previous) => ({
        ...previous,
        videoUrl: uploadedUrl,
        videoPoster: poster,
      }));
    } catch (error) {
      console.error("Portfolio video upload error:", error);
      setVideoError("작업 영상 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleVideoDelete = async () => {
    const currentVideoUrl = formData.videoUrl.trim();
    if (currentVideoUrl) {
      try {
        await deleteImage(currentVideoUrl);
      } catch (error) {
        console.error("Portfolio video delete error:", error);
      }
    }
    setFormData((previous) => ({ ...previous, videoUrl: "", videoPoster: "" }));
    setVideoError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.trade.trim() || !formData.client.trim()) {
      alert("공사명, 공종, 발주처를 입력해주세요.");
      return;
    }

    setSaving(true);
    const scope = formData.scope.trim();
    const images = formData.images.map((image) => image.trim()).filter(Boolean);
    const imageBefore = formData.imageBefore.trim();
    const imageAfter = formData.imageAfter.trim();
    const portfolioData = {
      ...formData,
      scope,
      images,
      imageBefore,
      imageAfter,
      image: images[0] || formData.image.trim(),
      published: formData.published,
      videoUrl: formData.videoUrl.trim(),
      videoPoster: formData.videoPoster.trim(),
      scale: scope || (editingPortfolio?.scope?.trim() ? formData.scale.trim() : ""),
    };

    try {
      if (editingPortfolio) {
        await updateDoc(doc(db, "portfolio", editingPortfolio.id), {
          ...portfolioData,
          updatedAt: serverTimestamp(),
        });

        setPortfolioList(
          portfolioList.map((p) =>
            p.id === editingPortfolio.id
              ? { ...p, ...portfolioData, updatedAt: new Date() }
              : p
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "portfolio"), {
          ...portfolioData,
          createdAt: serverTimestamp(),
        });

        setPortfolioList([
          { id: docRef.id, ...portfolioData, createdAt: new Date() } as PortfolioItem,
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
            const category = categories[portfolio.category] || categories.construction;
            const CategoryIcon = category.icon;
            const coverImage = portfolio.images?.find(Boolean) || portfolio.image;

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
                  {coverImage ? (
                    <img
                      src={coverImage}
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
                      {portfolio.trade || category.label}
                    </span>
                    <span className="text-xs text-gray-400">{portfolio.year}</span>
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                        portfolio.published === false
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {portfolio.published === false ? "비공개" : "공개"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{portfolio.client}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{portfolio.duration}</span>
                    <span>{portfolio.scope || portfolio.scale}</span>
                  </div>
                  {portfolio.location && <p className="mt-2 text-xs text-gray-500">{portfolio.location}</p>}
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
                {/* Published toggle */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <input
                    id="portfolio-published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-5 w-5 shrink-0 accent-brand-700"
                  />
                  <label htmlFor="portfolio-published" className="text-sm font-medium text-gray-700">
                    홈·시공실적에 공개
                    <span className="mt-0.5 block text-xs font-normal text-gray-500">
                      해제하면 공개 목록·상세에서 보이지 않습니다.
                    </span>
                  </label>
                </div>

                {/* Trade */}
                <div>
                  <label htmlFor="portfolio-trade" className="mb-2 block text-sm font-medium text-gray-700">
                    공종 *
                  </label>
                  <select
                    id="portfolio-trade"
                    required
                    value={formData.trade}
                    onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">공종 선택</option>
                    {tradeOptions.map((trade) => <option key={trade} value={trade}>{trade}</option>)}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공사명 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="실제 공사명을 입력하세요"
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
                    placeholder="실제 발주처 또는 공개 가능한 유형"
                  />
                </div>

                {/* Client type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    발주처 유형
                  </label>
                  <input
                    type="text"
                    value={formData.clientType}
                    onChange={(e) =>
                      setFormData({ ...formData, clientType: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="예: 아파트 관리단, 공공기관"
                  />
                </div>

                {/* Confirmed result */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    확인된 결과
                  </label>
                  <textarea
                    value={formData.result}
                    onChange={(e) =>
                      setFormData({ ...formData, result: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-y"
                    placeholder="예: 확인된 결과만 입력"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">위치</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                    placeholder="공개 가능한 시·구 단위 위치"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      준공연도
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      placeholder="준공연도를 입력하세요"
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
                      placeholder="실제 공사기간을 입력하세요"
                    />
                  </div>
                </div>

                {/* New scope + legacy scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시공 범위</label>
                  <textarea
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                    placeholder="실제로 진행한 작업 범위를 입력하세요"
                  />
                </div>

                {/* Before / after comparison images */}
                <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <legend className="px-1 text-sm font-semibold text-gray-800">시공 전·후 사진</legend>
                  <p className="text-xs leading-5 text-gray-500">
                    실제 현장 사진만 등록해 주세요. 공개 가능한 사진 주소를 입력하거나 파일을 선택할 수 있습니다. 파일은 각각 5MB 이하여야 합니다.
                  </p>
                  {([
                    { field: "imageBefore" as const, label: "시공 전", ref: imageBeforeInputRef },
                    { field: "imageAfter" as const, label: "시공 후", ref: imageAfterInputRef },
                  ]).map(({ field, label, ref }) => (
                    <div key={field}>
                      <label htmlFor={`portfolio-${field}`} className="mb-2 block text-sm font-medium text-gray-700">
                        {label} 사진 주소
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          id={`portfolio-${field}`}
                          type="url"
                          value={formData[field]}
                          onChange={(event) => setFormData((previous) => ({ ...previous, [field]: event.target.value }))}
                          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                          placeholder="공개 가능한 사진 주소"
                        />
                        <input
                          ref={ref}
                          type="file"
                          accept="image/*"
                          aria-label={`${label} 사진 파일 선택`}
                          onChange={(event) => handleComparisonImageUpload(field, event)}
                          className="sr-only"
                        />
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          disabled={uploadingComparison !== null}
                          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {uploadingComparison === (field === "imageBefore" ? "before" : "after") ? "업로드 중..." : "파일 선택"}
                        </button>
                      </div>
                      {formData[field] && (
                        <img src={formData[field]} alt={`${label} 현장 사진 미리보기`} className="mt-2 h-28 w-40 rounded-lg border border-gray-200 object-cover" />
                      )}
                    </div>
                  ))}
                </fieldset>

                {/* Site images */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-gray-700">현장 사진</label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        aria-label="현장 사진 파일 선택"
                        onChange={handleImagesUpload}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImages}
                        className="inline-flex min-h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {uploadingImages ? "업로드 중..." : "사진 파일 선택"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((previous) => ({ ...previous, images: [...previous.images, ""] }))}
                        className="inline-flex min-h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        사진 URL 추가
                      </button>
                    </div>
                  </div>
                  <p className="mb-3 text-xs leading-5 text-gray-500">공개 가능한 현장 사진을 여러 장 등록할 수 있습니다. 파일은 각각 5MB 이하로 선택해 주세요.</p>
                  <div className="space-y-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <label htmlFor={`portfolio-image-${index}`} className="sr-only">현장 사진 URL {index + 1}</label>
                          <input
                            id={`portfolio-image-${index}`}
                            type="url"
                            value={image}
                            onChange={(e) => updateImage(index, e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                            placeholder="이미지 주소를 입력하세요"
                          />
                          {image && <img src={image} alt={`현장 사진 ${index + 1}`} className="mt-2 h-24 w-36 rounded-lg border border-gray-200 object-cover" />}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`현장 사진 ${index + 1} 제거`}
                          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work video */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <label htmlFor="portfolio-video" className="block text-sm font-medium text-gray-700">작업 영상</label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={videoInputRef}
                        id="portfolio-video"
                        type="file"
                        accept={PORTFOLIO_VIDEO_ACCEPT_ATTR}
                        aria-label="작업 영상 파일 선택"
                        onChange={handleVideoUpload}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploadingVideo}
                        className="inline-flex min-h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {uploadingVideo ? "업로드 중..." : "영상 파일 선택"}
                      </button>
                      {formData.videoUrl && (
                        <button
                          type="button"
                          onClick={handleVideoDelete}
                          disabled={uploadingVideo}
                          className="inline-flex min-h-10 items-center rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          영상 삭제
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mb-3 text-xs leading-5 text-gray-500">실제 현장 작업 영상만 등록해 주세요. MP4 또는 WebM 형식, 30MB 이하의 파일 1개.</p>
                  {videoError && (
                    <p role="alert" className="mb-3 text-sm font-medium text-red-600">{videoError}</p>
                  )}
                  {formData.videoUrl && (
                    <video
                      src={formData.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      poster={formData.videoPoster || undefined}
                      className="aspect-video w-full rounded-lg border border-gray-200 bg-black"
                    />
                  )}
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
                  disabled={saving || uploadingImages || uploadingComparison !== null || uploadingVideo}
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
