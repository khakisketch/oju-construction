export interface DiagnosisInquiry {
  name: string;
  phone: string;
  site: string;
  symptom: string;
  message: string;
  consent: boolean;
}

export type InquiryField = "name" | "phone" | "site" | "message" | "consent";
export type InquiryErrors = Partial<Record<InquiryField, string>>;

/** Match the existing contacts rules without changing collection policy.
 *  - `inquiryType` must be one of the fixed list in firestore.rules
 *    ("현장 공사 검토" is the B equivalent of a site-review request).
 *  - `name` 1–50, `phone` 9–20 (raw length), optional `place` <=100,
 *    optional `message` <=2000, optional `status` must be "new".
 *  - Never include `adminMemo` / `screening` (create would be rejected).
 *  - `consent` acknowledgement is carried from the input, matching the prior B
 *    writer and ContactSection stored shape; `validateDiagnosisInquiry`
 *    gates submission so only `true` reaches Firestore in normal flow.
 */
export function validateDiagnosisInquiry(form: DiagnosisInquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = form.name.trim();
  const phone = form.phone.trim();
  const digits = phone.replace(/\D/g, "");

  if (!name) errors.name = "담당자 성함을 입력해 주세요.";
  else if (name.length > 50) errors.name = "성함은 50자 이내로 입력해 주세요.";

  if (!phone) errors.phone = "연락처를 입력해 주세요.";
  else if (!/^[+()\d\s-]+$/.test(phone) || phone.length > 20 || digits.length < 9 || digits.length > 15) {
    errors.phone = "연락 가능한 전화번호를 입력해 주세요.";
  }

  if (form.site.trim().length > 100) errors.site = "현장 위치는 100자 이내로 입력해 주세요.";
  if (form.message.trim().length > 2000) errors.message = "현장 상황은 2,000자 이내로 입력해 주세요.";
  if (!form.consent) errors.consent = "개인정보 수집·이용에 동의해 주세요.";
  return errors;
}

/** Keep the B fields while also supplying fields consumed by existing rules/admin.
 *  Explicit shape (no spread) so a future form field can never leak
 *  `adminMemo`/`screening` into a create. `consent` carries `form.consent`
 *  (prior B + ContactSection both persist it) without fabricating `true`;
 *  callers must run `validateDiagnosisInquiry` first, which blocks `false`,
 *  so a misleading acknowledgement cannot be created by bypassing validation
 *  (see DiagnosisRequestForm.handleSubmit).
 */
export function buildDiagnosisInquiry(form: DiagnosisInquiry) {
  const name = form.name.trim();
  const phone = form.phone.trim();
  const site = form.site.trim();
  const symptom = form.symptom.trim();
  const message = form.message.trim();
  return {
    name,
    phone,
    site,
    symptom,
    message,
    consent: form.consent,
    inquiryType: "현장 공사 검토" as const,
    place: site || "미정",
    category: symptom ? [symptom] : [],
    subject: symptom ? `현장 진단 · ${symptom}` : "현장 진단",
    source: "renewal-b-diagnosis",
    status: "new" as const,
  };
}
