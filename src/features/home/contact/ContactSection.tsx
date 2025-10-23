"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    companyType: "", // "개인" | "법인"
    company: "",
    phone: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');

    // 길이에 따라 하이픈 삽입
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  // 전화번호 전용 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setValidationError("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setValidationError("");
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        consent: undefined,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        companyType: "",
        company: "",
        phone: "",
        email: "",
        category: "",
        subject: "",
        message: "",
        consent: false,
      });

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

  const nextStep = () => {
    setValidationError("");

    // Validation for each step
    if (currentStep === 1 && !formData.name.trim()) {
      setValidationError("이름을 입력해주세요.");
      return;
    }
    if (currentStep === 2) {
      if (!formData.phone.trim()) {
        setValidationError("연락처를 입력해주세요.");
        return;
      }
      // 전화번호 형식 검증 (010-XXXX-XXXX)
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        setValidationError("올바른 전화번호 형식이 아닙니다. (010-0000-0000)");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.companyType) {
        setValidationError("개인 또는 법인을 선택해주세요.");
        return;
      }
      if (formData.companyType === "법인" && !formData.company.trim()) {
        setValidationError("회사명을 입력해주세요.");
        return;
      }
    }
    if (currentStep === 4 && formData.email.trim()) {
      // 이메일이 입력된 경우에만 검증 (선택 사항이므로)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setValidationError("올바른 이메일 형식이 아닙니다.");
        return;
      }
    }
    if (currentStep === 5 && !formData.category) {
      setValidationError("문의 분야를 선택해주세요.");
      return;
    }
    if (currentStep === 6 && !formData.message.trim()) {
      setValidationError("문의 내용을 입력해주세요.");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setValidationError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getTotalSteps = () => 7;
  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "이름을 알려주세요";
      case 2: return "연락처를 알려주세요";
      case 3: return "소속을 알려주세요";
      case 4: return "이메일 주소가 있으신가요?";
      case 5: return "어떤 분야의 문의인가요?";
      case 6: return "프로젝트에 대해 자세히 알려주세요";
      case 7: return "개인정보 수집 및 이용 동의";
      default: return "";
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setSubmitStatus("idle");
    setValidationError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentStep < 7) {
      e.preventDefault();
      nextStep();
    }
  };

  // 분야별 맞춤 placeholder 반환
  const getMessagePlaceholder = () => {
    switch(formData.category) {
      case "토목 공사":
        return "예: 청주시 OO구 도로 확장 공사 예정입니다. 약 500m 구간이며, 예산은 협의 가능합니다. 다음달부터 시작 희망합니다.";
      case "소프트웨어":
        return "예: 재고관리 시스템 개발 의뢰드립니다. 웹 기반으로 30명 정도 사용 예정이며, 기존 엑셀 데이터 마이그레이션 필요합니다.";
      case "드론 촬영":
        return "예: 건설현장 항공 촬영 의뢰합니다. 약 10,000㎡ 규모이며, 매달 1회 정기 촬영 및 3D 모델링이 필요합니다.";
      case "기타":
        return "예: 프로젝트 상세 내용, 규모, 예산, 일정 등을 자유롭게 작성해주세요.";
      default:
        return "예: 프로젝트에 대해 자세히 알려주세요.";
    }
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

      {/* Enhanced Multi-Step Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header with Progress */}
                <div className="bg-gradient-to-r from-brand-700 to-brand-800 p-4 md:p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-1">견적 문의하기</h3>
                      <p className="text-white/80 text-xs md:text-sm">24시간 내 답변드립니다</p>
                    </div>
                    <button
                      onClick={resetModal}
                      className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-white/90 mb-2">
                      <span className="font-medium">{getStepTitle()}</span>
                      <span className="font-bold">{currentStep} / {getTotalSteps()}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8">
                  <form onSubmit={handleSubmit}>
                    {validationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-4"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{validationError}</span>
                      </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                      {/* Step 1: 이름 */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-8">
                            <div className="text-6xl mb-4">👋</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">안녕하세요!</h3>
                            <p className="text-gray-600">먼저 성함을 알려주세요</p>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-lg text-center"
                            placeholder="홍길동"
                          />
                        </motion.div>
                      )}

                      {/* Step 2: 연락처 */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-8">
                            <div className="text-6xl mb-4">📱</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.name}님, 반갑습니다!</h3>
                            <p className="text-gray-600">연락 가능한 번호를 알려주세요</p>
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onKeyDown={handleKeyDown}
                            maxLength={13}
                            autoFocus
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-lg text-center"
                            placeholder="010-0000-0000"
                          />
                          <p className="text-xs text-gray-500 mt-3 text-center">💬 견적 결과를 받으실 연락처입니다</p>
                        </motion.div>
                      )}

                      {/* Step 3: 소속 */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🏢</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">소속을 알려주세요</h3>
                            <p className="text-gray-600">개인이신가요, 법인이신가요?</p>
                          </div>

                          {!formData.companyType ? (
                            // 선택 전: 개인/법인 버튼
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, companyType: "개인", company: "개인" }))}
                                className="p-5 rounded-xl border-2 border-gray-200 hover:border-brand-300 hover:bg-gray-50 font-semibold transition-all text-lg"
                              >
                                개인
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, companyType: "법인", company: "" }))}
                                className="p-5 rounded-xl border-2 border-gray-200 hover:border-brand-300 hover:bg-gray-50 font-semibold transition-all text-lg"
                              >
                                법인
                              </button>
                            </div>
                          ) : formData.companyType === "개인" ? (
                            // 개인 선택 시
                            <div className="space-y-4">
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 px-6 py-5 rounded-xl text-center">
                                <div className="text-4xl mb-2">✓</div>
                                <div className="font-bold text-lg">개인으로 선택되었습니다</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, companyType: "", company: "" }))}
                                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
                              >
                                다시 선택하기
                              </button>
                            </div>
                          ) : (
                            // 법인 선택 시: 회사명 입력
                            <div className="space-y-4">
                              <div className="bg-blue-50 border-2 border-blue-200 px-4 py-3 rounded-xl text-center text-sm text-blue-800">
                                법인으로 선택되었습니다. 회사명을 입력해주세요.
                              </div>
                              <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-lg text-center"
                                placeholder="회사명 입력"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, companyType: "", company: "" }))}
                                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
                              >
                                다시 선택하기
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Step 4: 이메일 (선택) */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-8">
                            <div className="text-6xl mb-4">📧</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">이메일 주소가 있으신가요?</h3>
                            <p className="text-gray-600">선택 사항입니다. 없으시면 다음 버튼을 눌러주세요</p>
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-lg text-center"
                            placeholder="example@email.com"
                          />
                        </motion.div>
                      )}

                      {/* Step 5: 문의 분야 */}
                      {currentStep === 5 && (
                        <motion.div
                          key="step5"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-8">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">어떤 분야의 문의인가요?</h3>
                            <p className="text-gray-600">해당하는 분야를 선택해주세요</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {["토목 공사", "소프트웨어", "드론 촬영", "기타"].map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                className={`
                                  p-5 rounded-xl border-2 font-semibold transition-all text-lg
                                  ${formData.category === cat
                                    ? 'border-brand-700 bg-brand-50 text-brand-700 shadow-md scale-105'
                                    : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                                  }
                                `}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 6: 상세 내용 */}
                      {currentStep === 6 && (
                        <motion.div
                          key="step6"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-6">
                            <div className="text-6xl mb-4">✍️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">프로젝트에 대해 알려주세요</h3>
                            <p className="text-gray-600">규모, 예산, 일정 등 자세히 적어주시면 더 정확한 견적을 드립니다</p>
                          </div>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              // textarea에서는 Ctrl+Enter로 다음 단계
                              if (e.key === "Enter" && e.ctrlKey && currentStep < 7) {
                                e.preventDefault();
                                nextStep();
                              }
                            }}
                            autoFocus
                            rows={6}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none transition-all"
                            placeholder={getMessagePlaceholder()}
                          />
                          <p className="text-xs text-gray-500 mt-2 text-center">💡 Ctrl + Enter로 다음 단계로 이동</p>
                        </motion.div>
                      )}

                      {/* Step 7: 개인정보 동의 */}
                      {currentStep === 7 && (
                        <motion.div
                          key="step7"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="min-h-[280px] flex flex-col justify-center"
                        >
                          <div className="text-center mb-6">
                            <div className="text-6xl mb-4">🔒</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">마지막 단계입니다!</h3>
                            <p className="text-gray-600">개인정보 수집 및 이용에 동의해주세요</p>
                          </div>

                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 mb-6">
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="mt-1 mr-3 w-5 h-5 text-brand-700 border-gray-300 rounded focus:ring-brand-500"
                              />
                              <label className="text-sm text-gray-700 leading-relaxed">
                                <span className="font-bold text-gray-900 text-base cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}>
                                  개인정보 수집 및 이용에 동의합니다.
                                </span> <span className="text-red-500">(필수)</span>
                                <br />
                                <span className="text-xs text-gray-600 mt-2 block">
                                  입력하신 정보는 견적 상담 목적으로만 사용되며, 안전하게 보호됩니다.
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsPrivacyModalOpen(true);
                                    }}
                                    className="text-brand-700 underline ml-1 hover:text-brand-800"
                                  >
                                    자세히 보기
                                  </button>
                                </span>
                              </label>
                            </div>
                          </div>

                          {submitStatus === "success" && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 text-green-800 px-5 py-4 rounded-xl flex items-center gap-3"
                            >
                              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <div className="font-bold">문의가 성공적으로 제출되었습니다!</div>
                                <div className="text-sm">24시간 이내에 연락드리겠습니다.</div>
                              </div>
                            </motion.div>
                          )}

                          {submitStatus === "error" && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-red-50 border-2 border-red-400 text-red-800 px-5 py-4 rounded-xl"
                            >
                              <div className="font-bold">문의 제출 중 오류가 발생했습니다.</div>
                              <div className="text-sm">다시 시도해주시거나, 070-4260-7307로 연락주세요.</div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          이전
                        </button>
                      )}

                      {currentStep < 7 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          다음
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || !formData.consent}
                          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              제출 중...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              문의 제출하기
                            </>
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

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
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
