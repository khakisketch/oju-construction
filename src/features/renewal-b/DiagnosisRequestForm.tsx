"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { env, isFirebaseConfigured } from "@/shared/config/env";
import { buildDiagnosisInquiry, validateDiagnosisInquiry, type DiagnosisInquiry, type InquiryErrors, type InquiryField } from "./diagnosisInquiry";
import { getSymptom, symptomFromHash, SYMPTOM_SELECTION_EVENT } from "./symptomCases";
import { CHECKLIST_SYMPTOM_EVENT } from "./DiagnosisChecklist";
import styles from "./RenewalBDesign.module.css";

const symptoms = ["물 고임", "보도블럭 꺼짐", "배수구 막힘·냄새", "지하 누수", "포장 균열·침하", "기타"];
const emptyForm: DiagnosisInquiry = { name: "", phone: "", site: "", symptom: "", message: "", consent: false };

export default function DiagnosisRequestForm() {
  const [form, setForm] = useState<DiagnosisInquiry>(emptyForm);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [isDelayed, setIsDelayed] = useState(false);
  const [carriedSymptom, setCarriedSymptom] = useState<string | null>(null);
  const symptomTouched = useRef(false);
  const formRevision = useRef(0);

  useEffect(() => {
    const carry = (value: string) => {
      // Never overwrite a user's explicit choice.
      if (symptomTouched.current || !symptoms.includes(value)) return;
      formRevision.current += 1;
      setForm((previous) => {
        if (previous.symptom === value) return previous;
        return { ...previous, symptom: value };
      });
      setCarriedSymptom(value);
    };
    const initial = symptomFromHash(window.location.hash);
    if (initial) carry(getSymptom(initial).formValue);
    const onSelection = (event: Event) => {
      const value = (event as CustomEvent<unknown>).detail;
      if (typeof value === "string") carry(value);
    };
    const onHashChange = () => {
      const selected = symptomFromHash(window.location.hash);
      if (selected) carry(getSymptom(selected).formValue);
    };
    window.addEventListener(SYMPTOM_SELECTION_EVENT, onSelection);
    window.addEventListener(CHECKLIST_SYMPTOM_EVENT, onSelection);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener(SYMPTOM_SELECTION_EVENT, onSelection);
      window.removeEventListener(CHECKLIST_SYMPTOM_EVENT, onSelection);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (status !== "submitting") {
      setIsDelayed(false);
      return;
    }
    const timer = window.setTimeout(() => setIsDelayed(true), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  function update<K extends keyof DiagnosisInquiry>(key: K, value: DiagnosisInquiry[K]) {
    formRevision.current += 1;
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    // Keep a submission failure visible (with its telephone retry) until the
    // next submit; clear a prior success as soon as the user starts a new input.
    // Per-field errors above clear live as each field is fixed.
    if (status === "success") setStatus("idle");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFirebaseConfigured || status === "submitting") return;
    const nextErrors = validateDiagnosisInquiry(form);
    setErrors(nextErrors);
    const first = (Object.keys(nextErrors) as InquiryField[])[0];
    if (first) {
      document.getElementById(`diagnosis-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    const submittedRevision = formRevision.current;
    try {
      await addDoc(collection(db, "contacts"), {
        ...buildDiagnosisInquiry(form),
        createdAt: serverTimestamp(),
      });
      // Do not erase edits made while waiting for Firestore acknowledgement.
      if (formRevision.current === submittedRevision) {
        setForm(emptyForm);
        setCarriedSymptom(null);
        symptomTouched.current = false;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className={styles.unavailable}>
        온라인 접수가 연결되지 않았습니다. 현장 위치와 증상을 준비하신 뒤{" "}
        <a href={`tel:${env.company.phone}`}>{env.company.phone}</a>으로 전화해 주세요.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.formRow}>
        <label className={styles.field} htmlFor="diagnosis-name">
          담당자 성함 *
          <input id="diagnosis-name" value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" maxLength={50} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "diagnosis-name-error" : undefined} />
          {errors.name && <span id="diagnosis-name-error" className={styles.fieldError}>{errors.name}</span>}
        </label>
        <label className={styles.field} htmlFor="diagnosis-phone">
          연락처 *
          <input id="diagnosis-phone" type="tel" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" maxLength={20} required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "diagnosis-phone-error" : undefined} />
          {errors.phone && <span id="diagnosis-phone-error" className={styles.fieldError}>{errors.phone}</span>}
        </label>
      </div>
      <label className={styles.field} htmlFor="diagnosis-site">
        <span>현장 위치 <span className="font-normal">(선택)</span></span>
        <input id="diagnosis-site" value={form.site} onChange={(event) => update("site", event.target.value)} maxLength={100} placeholder="예: 청주시 아파트 주차장" aria-invalid={!!errors.site} aria-describedby={errors.site ? "diagnosis-site-error" : undefined} />
        {errors.site && <span id="diagnosis-site-error" className={styles.fieldError}>{errors.site}</span>}
      </label>
      <label className={styles.field} htmlFor="diagnosis-symptom">
        <span>주된 증상 <span className="font-normal">(선택)</span></span>
        <select id="diagnosis-symptom" value={form.symptom} onChange={(event) => { symptomTouched.current = true; setCarriedSymptom(null); update("symptom", event.target.value); }} aria-describedby={carriedSymptom ? "diagnosis-carried" : undefined}>
          <option value="">증상을 선택해 주세요</option>
          {symptoms.map((symptom) => <option key={symptom} value={symptom}>{symptom}</option>)}
        </select>
        {carriedSymptom && <span id="diagnosis-carried" className={styles.formHint}>선택한 증상을 반영했습니다. 다르면 바꿀 수 있습니다.</span>}
      </label>
      <label className={styles.field} htmlFor="diagnosis-message">
        <span>현장 상황 <span className="font-normal">(선택)</span></span>
        <textarea id="diagnosis-message" value={form.message} onChange={(event) => update("message", event.target.value)} maxLength={2000} placeholder="증상이 나타난 위치나 시기를 알려주세요." aria-invalid={!!errors.message} aria-describedby={errors.message ? "diagnosis-message-error" : undefined} />
        {errors.message && <span id="diagnosis-message-error" className={styles.fieldError}>{errors.message}</span>}
      </label>
      <div>
        <div className={styles.consent}>
          <input id="diagnosis-consent" type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "diagnosis-consent-error" : undefined} />
          <span>
            <label htmlFor="diagnosis-consent">상담 접수·회신을 위한 개인정보 수집·이용에 동의합니다. *</label>{" "}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">개인정보 처리방침 보기 (새 창)</Link>
          </span>
        </div>
        {errors.consent && <p id="diagnosis-consent-error" className={styles.fieldError}>{errors.consent}</p>}
      </div>
      <div className={`${styles.formStatus} ${status === "success" ? styles.formSuccess : ""}`} role="status" aria-live="polite">
        {status === "submitting" && isDelayed && <>연결이 지연되어 접수 여부를 아직 확인하지 못했습니다. 중복 요청을 피하려면 다시 보내지 말고 <a href={`tel:${env.company.phone}`}>{env.company.phone}</a>으로 전화해 확인해 주세요.</>}
        {status === "success" && "문의가 접수되었습니다. 담당자가 연락드리겠습니다."}
        {status === "error" && <>접수하지 못했습니다. 입력 내용은 유지되어 있습니다. 다시 시도하거나 <a href={`tel:${env.company.phone}`}>{env.company.phone}</a>으로 전화해 주세요.</>}
      </div>
      <button type="submit" disabled={status === "submitting"} className={styles.submitButton}>
        {status === "submitting" ? "접수 중…" : "현장 진단 요청"}
      </button>
      <p className={styles.formHint}>사진은 상담 시 별도로 안내드립니다.</p>
    </form>
  );
}
