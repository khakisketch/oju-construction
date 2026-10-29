"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { env, isFirebaseConfigured } from "@/shared/config/env";
import homeStyles from "../HomeSections.module.css";

const inquiryOptions = [
  { title: "현장 공사 검토", description: "공사 범위를 함께 확인해요" },
  { title: "입찰 참가 요청", description: "입찰 절차를 상담해요" },
  { title: "업체 소개·자료 요청", description: "필요한 자료를 안내해요" },
  { title: "기타", description: "무엇이든 편하게 상담해요" },
];

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [place, setPlace] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    category: [] as string[],
    message: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const inquiryModalRef = useRef<HTMLDivElement>(null);
  const privacyModalRef = useRef<HTMLDivElement>(null);
  const modalTriggerRef = useRef<HTMLElement | null>(null);
  const privacyTriggerRef = useRef<HTMLButtonElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
    setValidationError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }));
    setValidationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryType) { setValidationError("원하시는 상담을 선택해주세요."); return; }
    if (!formData.name.trim()) { setValidationError("성함을 입력해주세요."); return; }
    if (!formData.phone.trim()) { setValidationError("연락처를 입력해주세요."); return; }
    if (!/^0\d{1,2}-\d{3,4}-\d{4}$/.test(formData.phone)) { setValidationError("올바른 전화번호 형식이 아닙니다."); return; }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setValidationError("이메일 주소를 확인해주세요."); return; }
    if (!formData.consent) { setValidationError("개인정보 수집 및 이용에 동의해주세요."); return; }

    setValidationError("");
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      if (!isFirebaseConfigured) {
        setSubmitStatus("error");
        return;
      }

      await addDoc(collection(db, "contacts"), {
        place: place || "미정",
        inquiryType,
        subject: inquiryType,
        trade: formData.category[0] ?? "미정",
        ...formData,
        category: formData.category ?? [],
        status: "new",
        createdAt: serverTimestamp(),
      });

      setSubmitStatus("success");
      setFormData({ name: "", phone: "", email: "", company: "", category: [], message: "", consent: false });
      setInquiryType("");
      setPlace("");

      setTimeout(() => {
        setSubmitStatus("idle");
        setIsModalOpen(false);
        setIsPrivacyModalOpen(false);
      }, 2500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectInquiryType = (type: string) => {
    if (inquiryType === type) return;
    setInquiryType(type);
    setValidationError("");
    setSubmitStatus("idle");
  };

  const handleRadioKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key !== "ArrowRight" &&
      e.key !== "ArrowDown" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowUp" &&
      e.key !== "Home" &&
      e.key !== "End"
    ) {
      return;
    }
    e.preventDefault();
    const radios = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="radio"]')
    );
    if (radios.length === 0) return;
    const activeIndex = radios.indexOf(document.activeElement as HTMLButtonElement);
    const selectedIndex = inquiryOptions.findIndex((option) => option.title === inquiryType);
    const current = activeIndex >= 0 ? activeIndex : selectedIndex >= 0 ? selectedIndex : 0;
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (current + 1) % radios.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (current - 1 + radios.length) % radios.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = radios.length - 1;
    }
    const nextTitle = inquiryOptions[next]?.title;
    if (nextTitle && nextTitle !== inquiryType) {
      setInquiryType(nextTitle);
      setValidationError("");
      setSubmitStatus("idle");
    }
    radios[next]?.focus();
  };

  const resetModal = useCallback(() => {
    setIsModalOpen(false);
    setInquiryType("");
    setPlace("");
    setSubmitStatus("idle");
    setIsPrivacyModalOpen(false);
    setValidationError("");
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      const trigger = modalTriggerRef.current;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("contact-step-heading")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isModalOpen]);

  useEffect(() => {
    if (!isPrivacyModalOpen) return;

    const frame = window.requestAnimationFrame(() => {
      privacyModalRef.current?.querySelector<HTMLElement>("h3")?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (document.getElementById("contact-step-heading")) {
        privacyTriggerRef.current?.focus();
      }
    };
  }, [isPrivacyModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (isPrivacyModalOpen) {
          setIsPrivacyModalOpen(false);
        } else {
          resetModal();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = isPrivacyModalOpen ? privacyModalRef.current : inquiryModalRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => document.removeEventListener("keydown", handleDialogKeyDown);
  }, [isModalOpen, isPrivacyModalOpen, resetModal]);

  const statusNode = (() => {
    if (validationError) {
      return (
        <div role="alert" aria-live="assertive" className="flex items-center gap-2 text-red-700">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold leading-5">{validationError}</span>
        </div>
      );
    }
    if (submitStatus === "success") {
      return (
        <div role="status" aria-live="polite" className="flex items-center gap-2 text-green-800">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold leading-5">접수되었습니다. 담당자가 직접 연락드리겠습니다.</span>
        </div>
      );
    }
    if (submitStatus === "error") {
      return (
        <div role="alert" aria-live="assertive" className="text-sm leading-5 text-red-800">
          <span className="font-semibold">
            {isFirebaseConfigured ? "제출에 실패했습니다. " : "온라인 접수가 연결되지 않았습니다. "}
          </span>
          <span>
            전화로 문의해 주세요:{" "}
            <a href={`tel:${env.company.phone}`} className="whitespace-nowrap font-semibold underline underline-offset-2">
              {env.company.phone}
            </a>
          </span>
        </div>
      );
    }
    if (!isFirebaseConfigured) {
      return (
        <div className="text-sm leading-5 text-gray-600">
          온라인 접수가 연결되지 않았습니다. 전화 상담:{" "}
          <a href={`tel:${env.company.phone}`} className="whitespace-nowrap font-semibold text-brand-700 underline underline-offset-2">
            {env.company.phone}
          </a>
        </div>
      );
    }
    return null;
  })();

  return (
    <>
      <section id="contact" className="relative scroll-mt-24 py-8 md:py-12 overflow-hidden bg-brand-900">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div>
            {/* Main CTA Content */}
            <header data-home-section-heading className={homeStyles.header}>
              <h2 className={homeStyles.titleOnDark}>
                상담을 신청해 주세요
              </h2>

              <p className={homeStyles.descriptionOnDark}>
                원하시는 상담을 고르고 성함과 연락처만 남겨주세요.
              </p>
            </header>

              {/* CTA Button with Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    modalTriggerRef.current = event.currentTarget;
                    setIsModalOpen(true);
                  }}
                  aria-haspopup="dialog"
                  aria-expanded={isModalOpen}
                  aria-controls="contact-inquiry-dialog"
                  className="group relative inline-flex min-h-14 items-center justify-center px-7 py-3 bg-white text-brand-700 font-bold rounded-full shadow-lg hover:shadow-brand-500/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    상담 신청하기
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
                <a
                  href={`tel:${env.company.phone}`}
                  aria-label={`전화 상담: ${env.company.phone}`}
                  className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border-2 border-white/50 bg-white/10 px-6 py-3 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="text-base font-semibold">전화 상담</span>
                  <span className="text-lg font-extrabold tabular-nums">{env.company.phone}</span>
                </a>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Single-screen inquiry modal */}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4" onClick={resetModal}>
            <motion.div
              ref={inquiryModalRef}
              id="contact-inquiry-dialog"
              role="dialog"
              aria-modal={!isPrivacyModalOpen}
              aria-labelledby="contact-step-heading"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="bg-white w-full h-full md:h-auto md:max-h-[100dvh] md:max-w-[560px] md:rounded-2xl md:shadow-2xl flex flex-col overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 pt-2 flex-shrink-0">
                <span className="px-1 text-sm font-semibold text-gray-500">상담 신청</span>
                <button
                  type="button"
                  onClick={resetModal}
                  aria-label="상담 신청 닫기"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col px-5 pb-4">
                <h3 id="contact-step-heading" tabIndex={-1} className="text-2xl font-extrabold leading-8 text-gray-900 focus:outline-none">
                  어떤 상담을 원하시나요?
                </h3>
                <p className="mb-2 mt-1 text-sm leading-5 text-gray-600">
                  담당자가 직접 연락드려 자세한 내용을 확인합니다.
                </p>

                <fieldset className="mb-2">
                  <legend className="sr-only">상담 종류 선택</legend>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="상담 종류" onKeyDown={handleRadioKeyDown}>
                    {inquiryOptions.map((option, index) => {
                      const selected = inquiryType === option.title;
                      const tabIndex = selected ? 0 : inquiryType === "" ? (index === 0 ? 0 : -1) : -1;
                      return (
                        <button
                          key={option.title}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          tabIndex={tabIndex}
                          onClick={() => selectInquiryType(option.title)}
                          className={`relative min-h-[88px] rounded-xl border-2 p-3 pr-9 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                            selected
                              ? "border-brand-700 bg-brand-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`block text-base font-bold leading-6 ${selected ? "text-brand-800" : "text-gray-800"}`}>
                            {option.title}
                          </span>
                          <span className="mt-0.5 block text-sm leading-5 text-gray-500">
                            {option.description}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              selected ? "border-brand-700 bg-brand-700 text-white" : "border-gray-300 text-transparent"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold leading-5 text-gray-700">
                      성함 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                      placeholder="성함을 입력해주세요"
                      className="h-11 w-full rounded-xl border-2 border-gray-200 px-4 text-base transition-colors placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 md:h-12"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold leading-5 text-gray-700">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      autoComplete="tel"
                      maxLength={14}
                      required
                      inputMode="tel"
                      placeholder="010-0000-0000"
                      className="h-11 w-full rounded-xl border-2 border-gray-200 px-4 text-base tabular-nums transition-colors placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 md:h-12"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-place" className="mb-1 block text-sm font-semibold leading-5 text-gray-700">
                      현장 위치 <span className="font-normal text-gray-500">(선택)</span>
                    </label>
                    <input
                      id="contact-place"
                      type="text"
                      name="place"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      autoComplete="off"
                      maxLength={60}
                      placeholder="○○아파트 주차장"
                      className="h-11 w-full rounded-xl border-2 border-gray-200 px-4 text-base transition-colors placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 md:h-12"
                    />
                  </div>
                </div>

                <div className="mt-2 flex min-h-[52px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2 pl-3">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="h-6 w-6 shrink-0 rounded border-gray-300 text-brand-700 focus:ring-brand-500"
                  />
                  <label htmlFor="contact-consent" className="flex-1 cursor-pointer text-sm font-semibold leading-5 text-gray-800">
                    개인정보 수집·이용에 동의합니다 <span className="text-red-500">(필수)</span>
                  </label>
                  <button
                    ref={privacyTriggerRef}
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="flex min-h-[44px] shrink-0 items-center px-2 text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                  >
                    자세히 보기
                  </button>
                </div>

                <div aria-live="polite" className="flex min-h-[52px] items-center px-1 py-1">
                  {statusNode}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      제출 중...
                    </>
                  ) : (
                    "상담 신청하기"
                  )}
                </button>
              </form>
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
                ref={privacyModalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-privacy-heading"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-brand-700 to-brand-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 id="contact-privacy-heading" tabIndex={-1} className="text-xl font-bold focus:outline-none">개인정보 수집 및 이용 동의</h3>
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(false)}
                      aria-label="동의 내용 닫기"
                      className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="prose prose-base max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      오주건설(주)(이하 &quot;회사&quot;)는 상담 접수 및 회신을 위해 아래와 같이 개인정보를 수집·이용합니다. 내용을 확인하신 후 동의해 주시기 바랍니다.
                    </p>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <h4 className="text-lg font-bold text-gray-900">수집·이용 목적</h4>
                      </div>
                      <ul className="space-y-1 pl-10 text-[15px] leading-relaxed text-gray-700">
                        <li>• 상담 접수 확인 및 담당자의 연락·회신</li>
                        <li>• 발주 주체·예산·지급 조건 등 상담에 필요한 범위에서의 확인</li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <h4 className="text-lg font-bold text-gray-900">수집 항목</h4>
                      </div>
                      <ul className="space-y-1 pl-10 text-[15px] leading-relaxed text-gray-700">
                        <li>• 필수: 성함, 연락처, 상담 종류</li>
                        <li>• 선택: 현장 위치</li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                        <h4 className="text-lg font-bold text-gray-900">보유 및 파기</h4>
                      </div>
                      <div className="space-y-4 pl-10 text-[15px] leading-relaxed text-gray-700">
                        <p>
                          상담 목적이 달성되면 지체 없이 파기합니다. 관련 법령에 따라 보존이 필요한 경우에는 해당 기간 동안 안전하게 보관합니다.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
                      <h4 className="font-bold text-gray-900 mb-2">동의 안내</h4>
                      <p className="text-[15px] leading-relaxed text-gray-700">
                        필수 항목의 수집·이용에 동의하셔야 상담 접수가 가능합니다. 동의를 거부하실 수 있으나, 이 경우 상담 접수가 제한됩니다. 선택 항목은 입력하지 않으셔도 상담 접수에 지장이 없습니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
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
