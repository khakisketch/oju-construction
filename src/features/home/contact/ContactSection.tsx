"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { env } from "@/shared/config/env";

// 장소별 작업 매핑
const placeOptions = [
  { label: "아파트 · 주거단지", value: "아파트" },
  { label: "도로 · 부지 · 산업단지", value: "도로·부지" },
  { label: "공공시설 · 관공서", value: "공공시설" },
  { label: "상업 · 사무용 건물", value: "상업건물" },
  { label: "기타", value: "기타" },
];

const workByPlace: Record<string, { label: string; value: string }[]> = {
  "아파트": [
    { label: "외벽 도장 (페인트)", value: "도장공사" },
    { label: "옥상 · 외벽 방수 (누수)", value: "방수공사" },
    { label: "조경 · 녹지 정비", value: "조경공사" },
    { label: "시설 유지보수 · 정기 관리", value: "시설유지보수" },
    { label: "기타 · 잘 모르겠어요", value: "기타" },
  ],
  "도로·부지": [
    { label: "도로 · 진입로 공사", value: "토목공사" },
    { label: "부지 조성 · 포장", value: "지반조성·포장" },
    { label: "조경 · 식재", value: "조경공사" },
    { label: "기타 · 잘 모르겠어요", value: "기타" },
  ],
  "공공시설": [
    { label: "토목 · 기반 시설 공사", value: "토목공사" },
    { label: "외벽 도장 · 방수", value: "도장공사" },
    { label: "시설 유지보수", value: "시설유지보수" },
    { label: "조경 · 녹지", value: "조경공사" },
    { label: "기타 · 잘 모르겠어요", value: "기타" },
  ],
  "상업건물": [
    { label: "외벽 도장 (페인트)", value: "도장공사" },
    { label: "방수 공사 (누수)", value: "방수공사" },
    { label: "시설 유지보수", value: "시설유지보수" },
    { label: "기타 · 잘 모르겠어요", value: "기타" },
  ],
  "기타": [
    { label: "토목 · 기반 공사", value: "토목공사" },
    { label: "방수 · 도장", value: "방수공사" },
    { label: "조경 · 포장", value: "조경공사" },
    { label: "시설 유지보수", value: "시설유지보수" },
    { label: "잘 모르겠어요", value: "기타" },
  ],
};

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: [] as string[],
    message: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.startsWith('02')) {
      if (numbers.length <= 6) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
      if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
    }
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setValidationError("이름을 입력해주세요."); return; }
    if (!formData.phone.trim()) { setValidationError("연락처를 입력해주세요."); return; }
    if (!/^0\d{1,2}-\d{3,4}-\d{4}$/.test(formData.phone)) { setValidationError("올바른 전화번호 형식이 아닙니다."); return; }
    if (!formData.consent) { setValidationError("개인정보 수집 및 이용에 동의해주세요."); return; }

    setValidationError("");
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await addDoc(collection(db, "contacts"), {
        place,
        ...formData,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setSubmitStatus("success");
      setFormData({ name: "", phone: "", category: [], message: "", consent: false });
      setPlace("");

      setTimeout(() => {
        setSubmitStatus("idle");
        setIsModalOpen(false);
        setCurrentStep(1);
      }, 2500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalSteps = () => 3;

  const selectPlace = (p: string) => {
    setPlace(p);
    setValidationError("");
    setTimeout(() => setCurrentStep(2), 150);
  };

  const toggleWork = (work: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(work)
        ? prev.category.filter((w) => w !== work)
        : [...prev.category, work],
    }));
    setValidationError("");
  };

  const prevStep = () => {
    setValidationError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setPlace("");
    setSubmitStatus("idle");
    setValidationError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); }
  };

  return (
    <>
      <section id="contact" className="relative py-16 md:py-24 overflow-hidden">
        {/* Multi-layer Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-800/50 via-transparent to-brand-600/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent" />

        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large Circle - Top Right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" />

          {/* Medium Circle - Bottom Left */}
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-brand-400/20 to-transparent rounded-full blur-2xl"
               style={{ animationDelay: '1s' }} />

          {/* Small Circle - Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"
               style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />
        </div>

        {/* Top Wave Decoration */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent" />

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Main CTA Content */}
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 font-medium text-sm mb-4"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                24시간 이내 답변 보장
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                지금 바로 시작하세요
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-100 max-w-2xl mx-auto mb-8"
              >
                무료 견적 상담으로 프로젝트의 첫 걸음을 내딛으세요.
                <br className="hidden md:block" />
                20년 경력의 전문가 팀이 최적의 솔루션을 제안해드립니다.
              </motion.p>

              {/* CTA Button with Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-8 py-4 bg-white text-brand-700 font-bold rounded-full shadow-2xl hover:shadow-brand-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    무료 견적 받기
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Flow Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop - desktop only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 hidden md:block"
            />

            {/* Fullscreen Mobile / Center Modal Desktop */}
            <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={resetModal}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-2xl md:shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {currentStep > 1 ? (
                    <button type="button" onClick={prevStep} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-5" />
                  )}
                  <span className="text-sm text-gray-400 font-semibold">{currentStep} / {getTotalSteps()}</span>
                </div>
                <button type="button" onClick={resetModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-5 flex-shrink-0">
                <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-700 rounded-full"
                    initial={false}
                    animate={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="min-h-full flex flex-col">
                  <div className="flex-1 flex items-center px-6 md:px-8">
                    <div className="w-full">
                    {validationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mt-4"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{validationError}</span>
                      </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                      {/* Step 1: 어디에 공사가 필요하신가요? */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.25 }}
                          className="py-8 md:py-10"
                        >
                          <h3 className="text-2xl md:text-[28px] font-extrabold text-gray-900 leading-tight mb-2">
                            어디에 공사가<br />필요하신가요?
                          </h3>
                          <p className="text-gray-400 text-sm mb-7">장소를 선택해주세요</p>

                          <div className="flex flex-col gap-2.5">
                            {placeOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => selectPlace(opt.value)}
                                className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all text-[15px] ${
                                  place === opt.value
                                    ? "border-brand-700 bg-brand-50 text-brand-700 font-semibold"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {place === opt.value && <span className="mr-1.5">✓</span>}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: 어떤 작업이 필요하신가요? */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.25 }}
                          className="py-8 md:py-10"
                        >
                          <h3 className="text-2xl md:text-[28px] font-extrabold text-gray-900 leading-tight mb-2">
                            어떤 작업이<br />필요하신가요?
                          </h3>
                          <p className="text-gray-400 text-sm mb-7">해당하는 항목을 선택해주세요</p>

                          <div className="flex flex-col gap-2.5">
                            {(workByPlace[place] ?? workByPlace["기타"]).map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggleWork(opt.value)}
                                className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all text-[15px] ${
                                  formData.category.includes(opt.value)
                                    ? "border-brand-700 bg-brand-50 text-brand-700 font-semibold"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {formData.category.includes(opt.value) ? <span className="mr-1.5">✓</span> : <span className="mr-1.5 opacity-0">✓</span>}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-3">여러 개 선택 가능합니다</p>
                        </motion.div>
                      )}

                      {/* Step 3: 연락처 + 메시지(선택) + 동의 + 제출 */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.25 }}
                          className="py-8 md:py-10"
                        >
                          <h3 className="text-2xl md:text-[28px] font-extrabold text-gray-900 leading-tight mb-2">
                            연락처를<br />남겨주세요
                          </h3>
                          <p className="text-gray-400 text-sm mb-7">빠른 시간 내 연락드리겠습니다</p>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                성함 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-[15px]"
                                placeholder="홍길동"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                연락처 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                onKeyDown={handleKeyDown}
                                maxLength={14}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-[15px]"
                                placeholder="010-0000-0000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                추가 요청사항 <span className="text-gray-400 font-normal">(선택)</span>
                              </label>
                              <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none transition-all text-[15px] leading-relaxed"
                                placeholder="추가로 전달할 내용이 있으면 적어주세요"
                              />
                            </div>

                            {/* 개인정보 동의 */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                              <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="mt-0.5 w-[18px] h-[18px] text-brand-700 border-gray-300 rounded focus:ring-brand-500 flex-shrink-0"
                              />
                              <label className="text-sm text-gray-600 leading-relaxed">
                                <span className="font-bold text-gray-900 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}>
                                  개인정보 수집 및 이용 동의
                                </span>{" "}
                                <span className="text-red-500">(필수)</span>
                                <br />
                                <button
                                  type="button"
                                  onClick={() => setIsPrivacyModalOpen(true)}
                                  className="text-brand-700 underline text-xs mt-0.5 hover:text-brand-800"
                                >
                                  자세히 보기
                                </button>
                              </label>
                            </div>
                          </div>

                          {submitStatus === "success" && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-center gap-3 mt-5"
                            >
                              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <div className="font-bold text-sm">문의가 접수되었습니다!</div>
                                <div className="text-xs">24시간 이내에 연락드리겠습니다.</div>
                              </div>
                            </motion.div>
                          )}

                          {submitStatus === "error" && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl mt-5"
                            >
                              <div className="font-bold text-sm">오류가 발생했습니다.</div>
                              <div className="text-xs">다시 시도해주시거나, {env.company.phone}로 연락주세요.</div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="px-6 md:px-8 pb-6 pt-3 flex-shrink-0">
                    {currentStep === 1 ? (
                      <p className="text-center text-xs text-gray-300">위에서 항목을 선택하세요</p>
                    ) : currentStep === 2 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.category.length === 0) {
                            setValidationError("작업을 하나 이상 선택해주세요.");
                            return;
                          }
                          setValidationError("");
                          setCurrentStep(3);
                        }}
                        className="w-full py-3.5 bg-brand-700 text-white font-bold text-sm rounded-xl hover:bg-brand-800 transition-all"
                      >
                        다음 →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.consent}
                        className="w-full py-3.5 bg-brand-700 text-white font-bold text-sm rounded-xl hover:bg-brand-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            제출 중...
                          </>
                        ) : (
                          "✓ 견적 문의하기"
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-brand-700 to-brand-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">개인정보 수집 및 이용 동의</h3>
                    <button
                      onClick={() => setIsPrivacyModalOpen(false)}
                      className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      오주건설(주) (이하 오주건설(주))는 견적을 신청하시는 분께 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령에 따라 개인정보의 수집·이용 목적, 수집하려는 개인정보의 항목, 개인정보의 보유 및 이용 기간에 대하여 안내드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                    </p>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <h4 className="text-lg font-bold text-gray-900">개인정보의 수집·이용 목적</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pl-10">
                        '오주건설(주)' 서비스 이용자의 서비스 등록 의사 확인, 이용자 본인 식별·인증, 상담 및 방문견적 등 각종 서비스 제공을 위한 '오주건설(주)' 운영자 및 협력 제휴사에 정보 제공, 당사자 간 계약이행사항 확인, 법령 및 이용약관을 위반에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재, 계정도용 및 부정거래 방지, 약관 개정 등의 고지사항 전달, 분쟁조정을 위한 기록 보존, 민원처리 등 이용자 보호 및 서비스 운영, 서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계, 서비스 분석 및 통계에 따른 맞춤 서비스 제공 및 광고 게재, 보안, 프라이버시, 안전 측면에서 이용자가 안심하고 이용할 수 있는 서비스 이용환경 구축 등
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <h4 className="text-lg font-bold text-gray-900">수집하려는 개인정보의 항목</h4>
                      </div>
                      <ul className="text-gray-700 text-sm leading-relaxed pl-10 space-y-1">
                        <li>• 이름</li>
                        <li>• 휴대폰번호</li>
                        <li>• 이메일</li>
                        <li>• 상세 요청 내용</li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                        <h4 className="text-lg font-bold text-gray-900">개인정보의 보유 및 이용 기간</h4>
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed pl-10 space-y-4">
                        <p>
                          원칙적으로 이용자의 해당 서비스의 견적신청 목적 달성 시 지체 없이 파기합니다. 단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우 또는 아래 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 동의 내용 또는 법령의 규정의 내용 및 목적에 맞게 개인정보를 안전하게 보관합니다.
                        </p>

                        <div>
                          <p className="font-semibold text-gray-900 mb-2">전자상거래 등에서 소비자 보호에 관한 법률</p>
                          <ul className="space-y-1">
                            <li>• 계약 또는 청약철회 등에 관한 기록: 5년</li>
                            <li>• 대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                            <li>• 소비자의 불만 및 분쟁처리에 관한 기록: 3년</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 mb-2">전자금융거래법</p>
                          <ul className="space-y-1">
                            <li>• 전자금융에 관한 기록: 5년</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 mb-2">통신비밀보호법</p>
                          <ul className="space-y-1">
                            <li>• 로그인 기록: 3개월</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-r-lg">
                      <h4 className="font-bold text-gray-900 mb-2">개인정보 수집·이용 동의 안내</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        위 개인정보 중 필수항목의 수집·이용에 관한 동의는 '오주건설(주)' 서비스 제공을 위해 필수적이므로 이에 동의하셔야 이후 절차를 진행할 수 있습니다. 원하지 않을 시 정보제공을 거부할 수 있습니다. 다만 동의하지 않으시는 경우 정상적인 '오주건설(주)'의 제휴사 서비스 이용이 불가합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => setIsPrivacyModalOpen(false)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    확인
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
