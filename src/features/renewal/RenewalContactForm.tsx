"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import styles from "./renewal.module.css";

const inquiryTypes = [
  "발주처·사업주 문의",
  "협력업체 등록",
  "채용 지원",
  "자료 요청",
  "기타",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function RenewalContactForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    type: inquiryTypes[0],
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setError("");
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("담당자 성함을 입력해 주세요.");
      return;
    }
    if (!form.phone.trim()) {
      setError("연락처를 입력해 주세요.");
      return;
    }
    if (!form.consent) {
      setError("개인정보 수집·이용에 동의해 주세요.");
      return;
    }
    if (!isFirebaseConfigured) {
      setError("온라인 접수가 연결되지 않았습니다. 전화 043-265-6010으로 문의해 주세요.");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        subject: form.type,
        source: "renewal-home",
        status: "new",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm({
        name: "",
        company: "",
        phone: "",
        type: inquiryTypes[0],
        message: "",
        consent: false,
      });
    } catch {
      setStatus("error");
      setError("접수에 실패했습니다. 전화 043-265-6010으로 문의해 주세요.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="renewal-name">
          담당자 성함 *
        </label>
        <input
          id="renewal-name"
          className={styles.input}
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          autoComplete="name"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="renewal-company">
          회사·소속
        </label>
        <input
          id="renewal-company"
          className={styles.input}
          value={form.company}
          onChange={(event) => update("company", event.target.value)}
          autoComplete="organization"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="renewal-phone">
          연락처 *
        </label>
        <input
          id="renewal-phone"
          className={styles.input}
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          autoComplete="tel"
          inputMode="tel"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="renewal-type">
          문의 유형
        </label>
        <select
          id="renewal-type"
          className={styles.select}
          value={form.type}
          onChange={(event) => update("type", event.target.value)}
        >
          {inquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label className={styles.fieldLabel} htmlFor="renewal-message">
          현장·공사 범위
        </label>
        <textarea
          id="renewal-message"
          className={styles.textarea}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="현장 위치, 공종, 규모, 희망 시기 등을 적어 주세요."
        />
      </div>
      <label className={`${styles.fieldFull}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, lineHeight: 1.6, color: "var(--muted)" }}>
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--orange)" }}
        />
        <span>
          개인정보 수집·이용에 동의합니다. 상담 회신 목적으로만 사용하며, 목적 달성 후 파기합니다.
        </span>
      </label>
      <div className={styles.formStatus} role="status" aria-live="polite">
        {error ? (
          <span className={styles.formStatusError}>{error}</span>
        ) : status === "success" ? (
          <span className={styles.formStatusSuccess}>
            접수되었습니다. 영업일 1일 이내에 담당자가 연락드립니다.
          </span>
        ) : (
          <span>영업일 1일 이내 회신을 원칙으로 합니다.</span>
        )}
      </div>
      <button type="submit" className={styles.submit} disabled={status === "submitting"}>
        {status === "submitting" ? "접수 중…" : "문의 접수하기"}
      </button>
    </form>
  );
}
