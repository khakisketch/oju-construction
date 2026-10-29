"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  GripVertical,
  Check,
  Link as LinkIcon,
  Palette,
  Type,
  Globe,
  FileText,
} from "lucide-react";
import { useBrochureData } from "@/features/brochure/hooks/useBrochureData";
import DesignBrochureTab from "@/features/brochure/components/DesignBrochureTab";
import {
  HistoryEvent,
  CoreValue,
  Certification,
  CoverStyle,
} from "@/features/brochure/types";
import { SettingsFormSkeleton } from "@/shared/components/ui/Skeleton";
import dynamic from "next/dynamic";

const BrochurePDFDownload = dynamic(
  () => import("@/features/brochure/components/BrochureDownloadButton"),
  { ssr: false }
);

type TabType = "cover" | "history" | "vision" | "certifications" | "download" | "preview";

// 표지 스타일 미리보기 컴포넌트들
const CoverStylePreview = ({
  style,
  selected,
  onClick,
}: {
  style: CoverStyle;
  selected: boolean;
  onClick: () => void;
}) => {
  const styleConfig = {
    geometric: {
      label: "기하학 도형",
      description: "삼각형, 원 등 도형을 활용한 모던한 스타일",
      preview: (
        <div className="w-full h-full bg-[#172e4d] relative overflow-hidden">
          {/* Geometric shapes */}
          <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[80px] border-l-transparent border-r-transparent border-b-orange-600/30" />
          <div className="absolute top-2 right-4 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-orange-500/40" />
          <div className="absolute bottom-4 right-6 w-12 h-12 rounded-full bg-orange-600/30" />
          <div className="absolute top-6 left-6 w-6 h-6 rounded-full bg-white/10" />
          <div className="absolute top-4 right-8 w-8 h-8 bg-white/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-[10px] font-bold tracking-wider">OJU CONSTRUCTION</div>
              <div className="w-8 h-0.5 bg-orange-500 mx-auto my-1" />
              <div className="text-[6px] opacity-80">회사소개서</div>
            </div>
          </div>
        </div>
      ),
    },
    gradient: {
      label: "그라데이션",
      description: "부드러운 색상 전환으로 세련된 분위기",
      preview: (
        <div className="w-full h-full bg-gradient-to-br from-[#172e4d] via-[#1e3a5f] to-[#c94a25] relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-xl" />
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-300/10 rounded-full blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-[10px] font-bold tracking-wider">OJU CONSTRUCTION</div>
              <div className="w-8 h-0.5 bg-white/50 mx-auto my-1" />
              <div className="text-[6px] opacity-80">회사소개서</div>
            </div>
          </div>
        </div>
      ),
    },
    lines: {
      label: "라인 패턴",
      description: "직선 요소로 전문적이고 깔끔한 인상",
      preview: (
        <div className="w-full h-full bg-[#172e4d] relative overflow-hidden">
          {/* Horizontal lines */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white/10"
              style={{ top: `${10 + i * 12}%`, left: 0, right: 0 }}
            />
          ))}
          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-[10px] font-bold tracking-wider">OJU CONSTRUCTION</div>
              <div className="w-8 h-0.5 bg-orange-500 mx-auto my-1" />
              <div className="text-[6px] opacity-80">회사소개서</div>
            </div>
          </div>
        </div>
      ),
    },
    photo: {
      label: "사진 배경",
      description: "배경 이미지와 오버레이로 시각적 임팩트",
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 relative overflow-hidden">
          {/* Simulate photo with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172e4d] via-[#172e4d]/80 to-transparent" />
          {/* Grid pattern to simulate construction image */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 w-6 h-8 border border-white/30" />
            <div className="absolute top-2 left-12 w-4 h-10 border border-white/30" />
            <div className="absolute top-6 right-4 w-8 h-6 border border-white/30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-[10px] font-bold tracking-wider">OJU CONSTRUCTION</div>
              <div className="w-8 h-0.5 bg-orange-500 mx-auto my-1" />
              <div className="text-[6px] opacity-80">회사소개서</div>
            </div>
          </div>
        </div>
      ),
    },
  };

  const config = styleConfig[style];

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
        selected
          ? "border-brand-600 ring-2 ring-brand-600/30 scale-[1.02]"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Preview */}
      <div className="aspect-[16/9] w-full">{config.preview}</div>

      {/* Label */}
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{config.label}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
          </div>
          {selected && (
            <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default function BrochureAdminPage() {
  const { data, loading, saving, error, updateData, saveData } = useBrochureData();
  const [activeTab, setActiveTab] = useState<TabType>("cover");

  const handleSave = async () => {
    const success = await saveData();
    if (success) {
      alert("저장되었습니다.");
    }
  };

  // Cover style handler
  const updateCoverStyle = (style: CoverStyle) => {
    updateData({ coverStyle: style });
  };

  // History handlers
  const addHistoryYear = () => {
    const newHistory: HistoryEvent = {
      year: new Date().getFullYear().toString(),
      events: [""],
    };
    updateData({ history: [...data.history, newHistory] });
  };

  const updateHistoryYear = (index: number, year: string) => {
    const newHistory = [...data.history];
    newHistory[index] = { ...newHistory[index], year };
    updateData({ history: newHistory });
  };

  const addHistoryEvent = (yearIndex: number) => {
    const newHistory = [...data.history];
    newHistory[yearIndex].events.push("");
    updateData({ history: newHistory });
  };

  const updateHistoryEvent = (yearIndex: number, eventIndex: number, value: string) => {
    const newHistory = [...data.history];
    newHistory[yearIndex].events[eventIndex] = value;
    updateData({ history: newHistory });
  };

  const removeHistoryEvent = (yearIndex: number, eventIndex: number) => {
    const newHistory = [...data.history];
    newHistory[yearIndex].events.splice(eventIndex, 1);
    if (newHistory[yearIndex].events.length === 0) {
      newHistory.splice(yearIndex, 1);
    }
    updateData({ history: newHistory });
  };

  const removeHistoryYear = (yearIndex: number) => {
    const newHistory = [...data.history];
    newHistory.splice(yearIndex, 1);
    updateData({ history: newHistory });
  };

  // Core values handlers
  const addCoreValue = () => {
    const newValue: CoreValue = { title: "", description: "" };
    updateData({ coreValues: [...data.coreValues, newValue] });
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    const newValues = [...data.coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    updateData({ coreValues: newValues });
  };

  const removeCoreValue = (index: number) => {
    const newValues = [...data.coreValues];
    newValues.splice(index, 1);
    updateData({ coreValues: newValues });
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert: Certification = {
      name: "",
      issuer: "",
      date: "",
      imageUrl: "",
    };
    updateData({ certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const newCerts = [...data.certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    updateData({ certifications: newCerts });
  };

  const removeCertification = (index: number) => {
    const newCerts = [...data.certifications];
    newCerts.splice(index, 1);
    updateData({ certifications: newCerts });
  };

  if (loading) {
    return <SettingsFormSkeleton />;
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "cover", label: "표지", icon: <Palette className="w-4 h-4" /> },
    { id: "history", label: "연혁", icon: null },
    { id: "vision", label: "비전/미션", icon: null },
    { id: "certifications", label: "인증서/자격증", icon: null },
    { id: "download", label: "다운로드 파일", icon: <FileText className="w-4 h-4" /> },
    { id: "preview", label: "미리보기", icon: null },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회사소개서 관리</h1>
          <p className="text-gray-500 text-sm mt-1">
            회사소개서에 들어갈 내용을 편집합니다. 웹 뷰어 및 PDF 다운로드에 반영됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <BrochurePDFDownload data={data} mode="generated" />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                저장
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {error}
        </p>
      )}

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto border-b border-gray-200">
        <nav className="flex min-w-max gap-1" aria-label="회사소개서 관리 탭">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all sm:px-6 ${
                activeTab === tab.id
                  ? "border-brand-700 text-brand-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "cover" && (
            <section className="space-y-8">
              {/* Cover Style Selection */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-brand-600" />
                  표지 스타일 선택
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  회사소개서 PDF의 표지 디자인을 선택하세요
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <CoverStylePreview
                    style="geometric"
                    selected={data.coverStyle === "geometric"}
                    onClick={() => updateCoverStyle("geometric")}
                  />
                  <CoverStylePreview
                    style="gradient"
                    selected={data.coverStyle === "gradient"}
                    onClick={() => updateCoverStyle("gradient")}
                  />
                  <CoverStylePreview
                    style="lines"
                    selected={data.coverStyle === "lines"}
                    onClick={() => updateCoverStyle("lines")}
                  />
                  <CoverStylePreview
                    style="photo"
                    selected={data.coverStyle === "photo"}
                    onClick={() => updateCoverStyle("photo")}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Type className="w-5 h-5 text-brand-600" />
                  태그라인
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  표지에 표시될 회사 슬로건을 입력하세요
                </p>
                <input
                  type="text"
                  value={data.tagline || ""}
                  onChange={(e) => updateData({ tagline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="기술의 정교함, 신뢰의 견고함"
                />
              </div>

              {/* Website URL for QR Code */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-600" />
                  홈페이지 URL (QR코드)
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  회사소개서 마지막 페이지에 QR코드로 표시됩니다
                </p>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={data.websiteUrl || ""}
                    onChange={(e) => updateData({ websiteUrl: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="https://example.com"
                  />
                  {data.websiteUrl && (
                    <a
                      href={data.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      열기
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "history" && (
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">회사 연혁</h2>
                <button
                  onClick={addHistoryYear}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  연도 추가
                </button>
              </div>

              <div className="space-y-4">
                {data.history
                  .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                  .map((item, yearIndex) => (
                    <div
                      key={yearIndex}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateHistoryYear(yearIndex, e.target.value)}
                          className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg font-bold text-lg"
                          placeholder="연도"
                        />
                        <span className="text-gray-500 text-sm">년</span>
                        <button
                          onClick={() => removeHistoryYear(yearIndex)}
                          className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        {item.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />
                            <input
                              type="text"
                              value={event}
                              onChange={(e) => updateHistoryEvent(yearIndex, eventIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="주요 사건 입력"
                            />
                            <button
                              onClick={() => removeHistoryEvent(yearIndex, eventIndex)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addHistoryEvent(yearIndex)}
                          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-brand-500 hover:text-brand-600 transition-colors"
                        >
                          + 이벤트 추가
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {activeTab === "vision" && (
            <section className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">비전</h3>
                <textarea
                  value={data.vision}
                  onChange={(e) => updateData({ vision: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                  placeholder="회사의 비전을 입력하세요"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">미션</h3>
                <textarea
                  value={data.mission}
                  onChange={(e) => updateData({ mission: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                  placeholder="회사의 미션을 입력하세요"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">핵심 가치</h3>
                  <button
                    onClick={addCoreValue}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.coreValues.map((value, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg relative group"
                    >
                      <button
                        onClick={() => removeCoreValue(index)}
                        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => updateCoreValue(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold mb-2"
                        placeholder="가치 제목"
                      />
                      <textarea
                        value={value.description}
                        onChange={(e) => updateCoreValue(index, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                        placeholder="설명"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "certifications" && (
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">인증서/자격증</h2>
                <button
                  onClick={addCertification}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {data.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-4 relative group"
                  >
                    <button
                      onClick={() => removeCertification(index)}
                      className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                        placeholder="인증서명"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="발급기관"
                      />
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => updateCertification(index, "date", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="취득일 (예: 2024.01.15)"
                      />
                      <input
                        type="text"
                        value={cert.imageUrl || ""}
                        onChange={(e) => updateCertification(index, "imageUrl", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="이미지 URL (선택)"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {data.certifications.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">등록된 인증서가 없습니다</p>
                  <button
                    onClick={addCertification}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    첫 인증서 추가
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === "preview" && (
            <section className="space-y-6">
              {/* Cover Preview based on selected style */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="aspect-[16/9] relative">
                  {data.coverStyle === "geometric" && (
                    <div className="w-full h-full bg-[#172e4d] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[200px] border-r-[200px] border-b-[300px] border-l-transparent border-r-transparent border-b-orange-600/30" />
                      <div className="absolute top-8 right-16 w-0 h-0 border-l-[80px] border-r-[80px] border-b-[120px] border-l-transparent border-r-transparent border-b-orange-500/40" />
                      <div className="absolute bottom-16 right-24 w-40 h-40 rounded-full bg-orange-600/30" />
                      <div className="text-center text-white relative z-10">
                        <h2 className="text-4xl font-bold mb-4">OJU CONSTRUCTION</h2>
                        <div className="w-20 h-1 bg-orange-500 mx-auto mb-4" />
                        <p className="text-2xl opacity-90">회사소개서</p>
                        <p className="text-sm opacity-70 mt-4">{data.tagline || "기술의 정교함, 신뢰의 견고함"}</p>
                      </div>
                    </div>
                  )}
                  {data.coverStyle === "gradient" && (
                    <div className="w-full h-full bg-gradient-to-br from-[#172e4d] via-[#1e3a5f] to-[#c94a25] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
                      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl" />
                      <div className="text-center text-white relative z-10">
                        <h2 className="text-4xl font-bold mb-4">OJU CONSTRUCTION</h2>
                        <div className="w-20 h-1 bg-white/50 mx-auto mb-4" />
                        <p className="text-2xl opacity-90">회사소개서</p>
                        <p className="text-sm opacity-70 mt-4">{data.tagline || "기술의 정교함, 신뢰의 견고함"}</p>
                      </div>
                    </div>
                  )}
                  {data.coverStyle === "lines" && (
                    <div className="w-full h-full bg-[#172e4d] flex items-center justify-center relative overflow-hidden">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute h-px bg-white/10"
                          style={{ top: `${5 + i * 5}%`, left: 0, right: 0 }}
                        />
                      ))}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-orange-500 to-orange-600" />
                      <div className="text-center text-white relative z-10">
                        <h2 className="text-4xl font-bold mb-4">OJU CONSTRUCTION</h2>
                        <div className="w-20 h-1 bg-orange-500 mx-auto mb-4" />
                        <p className="text-2xl opacity-90">회사소개서</p>
                        <p className="text-sm opacity-70 mt-4">{data.tagline || "기술의 정교함, 신뢰의 견고함"}</p>
                      </div>
                    </div>
                  )}
                  {data.coverStyle === "photo" && (
                    <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#172e4d] via-[#172e4d]/80 to-transparent" />
                      <div className="text-center text-white relative z-10">
                        <h2 className="text-4xl font-bold mb-4">OJU CONSTRUCTION</h2>
                        <div className="w-20 h-1 bg-orange-500 mx-auto mb-4" />
                        <p className="text-2xl opacity-90">회사소개서</p>
                        <p className="text-sm opacity-70 mt-4">{data.tagline || "기술의 정교함, 신뢰의 견고함"}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 border-t text-center">
                  <span className="text-sm text-gray-500">
                    현재 선택된 표지 스타일:{" "}
                    <span className="font-medium text-brand-700">
                      {data.coverStyle === "geometric" && "기하학 도형"}
                      {data.coverStyle === "gradient" && "그라데이션"}
                      {data.coverStyle === "lines" && "라인 패턴"}
                      {data.coverStyle === "photo" && "사진 배경"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-brand-700 border-b-2 border-brand-500 pb-3 mb-6">
                  비전 & 미션
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-brand-50 p-6 rounded-lg">
                    <h4 className="font-bold text-brand-700 mb-2">비전</h4>
                    <p className="text-gray-700">{data.vision || "(미입력)"}</p>
                  </div>
                  <div className="bg-brand-50 p-6 rounded-lg">
                    <h4 className="font-bold text-brand-700 mb-2">미션</h4>
                    <p className="text-gray-700">{data.mission || "(미입력)"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-brand-700 border-b-2 border-brand-500 pb-3 mb-6">
                  회사 연혁
                </h3>
                <div className="space-y-4">
                  {data.history
                    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                    .map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <span className="font-bold text-brand-700 w-16">{item.year}</span>
                        <div className="space-y-1">
                          {item.events.map((event, eventIndex) => (
                            <p key={eventIndex} className="text-gray-700">
                              • {event || "(미입력)"}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="text-center text-gray-500 text-sm">
                위는 미리보기입니다. 실제 PDF는 더 정교한 레이아웃으로 생성됩니다.
              </div>
            </section>
          )}

          {activeTab === "download" && (
            <DesignBrochureTab data={data} updateData={updateData} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="h-16" />
    </div>
  );
}
