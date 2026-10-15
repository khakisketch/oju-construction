"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, Eye, FileDown } from "lucide-react";
import { useNominationData } from "@/features/nomination/hooks/useNominationData";
import { License, Technician, Equipment } from "@/features/nomination/types";
import { SettingsFormSkeleton } from "@/shared/components/ui/Skeleton";
import dynamic from "next/dynamic";

const NominationPDFDownload = dynamic(
  () => import("@/features/nomination/components/NominationDownloadButton"),
  { ssr: false }
);

type TabType = "licenses" | "technicians" | "equipment" | "credit";

export default function NominationAdminPage() {
  const { data, loading, saving, updateData, saveData } = useNominationData();
  const [activeTab, setActiveTab] = useState<TabType>("licenses");

  const handleSave = async () => {
    const success = await saveData();
    if (success) {
      alert("저장되었습니다.");
    } else {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // License handlers
  const addLicense = () => {
    const newLicense: License = {
      id: Date.now().toString(),
      name: "",
      number: "",
      issueDate: "",
      expiryDate: "",
      issuingAuthority: "",
      capacity: "",
    };
    updateData({ licenses: [...data.licenses, newLicense] });
  };

  const updateLicense = (index: number, field: keyof License, value: string) => {
    const newLicenses = [...data.licenses];
    newLicenses[index] = { ...newLicenses[index], [field]: value };
    updateData({ licenses: newLicenses });
  };

  const removeLicense = (index: number) => {
    const newLicenses = [...data.licenses];
    newLicenses.splice(index, 1);
    updateData({ licenses: newLicenses });
  };

  // Technician handlers
  const addTechnician = () => {
    const newTech: Technician = {
      id: Date.now().toString(),
      name: "",
      position: "",
      qualification: "",
      licenseNumber: "",
      experienceYears: 0,
    };
    updateData({ technicians: [...data.technicians, newTech] });
  };

  const updateTechnician = (index: number, field: keyof Technician, value: string | number) => {
    const newTechs = [...data.technicians];
    newTechs[index] = { ...newTechs[index], [field]: value };
    updateData({ technicians: newTechs });
  };

  const removeTechnician = (index: number) => {
    const newTechs = [...data.technicians];
    newTechs.splice(index, 1);
    updateData({ technicians: newTechs });
  };

  // Equipment handlers
  const addEquipment = () => {
    const newEquip: Equipment = {
      id: Date.now().toString(),
      name: "",
      model: "",
      quantity: 1,
      condition: "양호",
      registrationNumber: "",
    };
    updateData({ equipment: [...data.equipment, newEquip] });
  };

  const updateEquipment = (index: number, field: keyof Equipment, value: string | number) => {
    const newEquip = [...data.equipment];
    newEquip[index] = { ...newEquip[index], [field]: value };
    updateData({ equipment: newEquip });
  };

  const removeEquipment = (index: number) => {
    const newEquip = [...data.equipment];
    newEquip.splice(index, 1);
    updateData({ equipment: newEquip });
  };

  // Credit rating handler
  const updateCreditRating = (field: string, value: string) => {
    updateData({
      creditRating: {
        ...data.creditRating,
        [field]: value,
      },
    });
  };

  if (loading) {
    return <SettingsFormSkeleton />;
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: "licenses", label: "면허/등록현황" },
    { id: "technicians", label: "기술자 명단" },
    { id: "equipment", label: "보유 장비" },
    { id: "credit", label: "신용평가" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">지명원 관리</h1>
          <p className="text-gray-500 text-sm mt-1">
            입찰 및 제출용 지명원 데이터를 관리합니다.
          </p>
        </div>
        <div className="flex gap-3">
          <NominationPDFDownload data={data} />
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-brand-700 text-brand-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
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
          {activeTab === "licenses" && (
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">면허/등록현황</h2>
                <button
                  onClick={addLicense}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  면허 추가
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">면허/등록명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">등록번호</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">발급기관</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">취득일</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">만료일</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">시공능력</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.licenses.map((license, index) => (
                      <tr key={license.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={license.name}
                            onChange={(e) => updateLicense(index, "name", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="면허명"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={license.number}
                            onChange={(e) => updateLicense(index, "number", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="등록번호"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={license.issuingAuthority}
                            onChange={(e) => updateLicense(index, "issuingAuthority", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="발급기관"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={license.issueDate}
                            onChange={(e) => updateLicense(index, "issueDate", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="YYYY.MM.DD"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={license.expiryDate}
                            onChange={(e) => updateLicense(index, "expiryDate", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="YYYY.MM.DD"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={license.capacity || ""}
                            onChange={(e) => updateLicense(index, "capacity", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="시공능력"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => removeLicense(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.licenses.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">등록된 면허가 없습니다</p>
                  <button
                    onClick={addLicense}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    첫 면허 추가
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === "technicians" && (
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">기술자 명단</h2>
                <button
                  onClick={addTechnician}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  기술자 추가
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">성명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">직위</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">자격/면허</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">자격번호</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">경력(년)</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.technicians.map((tech, index) => (
                      <tr key={tech.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={tech.name}
                            onChange={(e) => updateTechnician(index, "name", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="성명"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={tech.position}
                            onChange={(e) => updateTechnician(index, "position", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="직위"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={tech.qualification}
                            onChange={(e) => updateTechnician(index, "qualification", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="자격/면허"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={tech.licenseNumber}
                            onChange={(e) => updateTechnician(index, "licenseNumber", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="자격번호"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={tech.experienceYears}
                            onChange={(e) => updateTechnician(index, "experienceYears", parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => removeTechnician(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.technicians.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">등록된 기술자가 없습니다</p>
                  <button
                    onClick={addTechnician}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    첫 기술자 추가
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === "equipment" && (
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">보유 장비</h2>
                <button
                  onClick={addEquipment}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  장비 추가
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">장비명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">모델/규격</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">수량</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">등록번호</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.equipment.map((equip, index) => (
                      <tr key={equip.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={equip.name}
                            onChange={(e) => updateEquipment(index, "name", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="장비명"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={equip.model}
                            onChange={(e) => updateEquipment(index, "model", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="모델/규격"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={equip.quantity}
                            onChange={(e) => updateEquipment(index, "quantity", parseInt(e.target.value) || 1)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={equip.condition}
                            onChange={(e) => updateEquipment(index, "condition", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="양호">양호</option>
                            <option value="보통">보통</option>
                            <option value="수리필요">수리필요</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={equip.registrationNumber || ""}
                            onChange={(e) => updateEquipment(index, "registrationNumber", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="등록번호"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => removeEquipment(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.equipment.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">등록된 장비가 없습니다</p>
                  <button
                    onClick={addEquipment}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    첫 장비 추가
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === "credit" && (
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">신용평가등급</h2>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      신용등급
                    </label>
                    <input
                      type="text"
                      value={data.creditRating.grade}
                      onChange={(e) => updateCreditRating("grade", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="예: A+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      평가기관
                    </label>
                    <input
                      type="text"
                      value={data.creditRating.agency}
                      onChange={(e) => updateCreditRating("agency", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="예: 한국기업평가"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      평가일
                    </label>
                    <input
                      type="text"
                      value={data.creditRating.evaluationDate}
                      onChange={(e) => updateCreditRating("evaluationDate", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="YYYY.MM.DD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      유효기간
                    </label>
                    <input
                      type="text"
                      value={data.creditRating.validUntil}
                      onChange={(e) => updateCreditRating("validUntil", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="YYYY.MM.DD"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="h-16" />
    </div>
  );
}
