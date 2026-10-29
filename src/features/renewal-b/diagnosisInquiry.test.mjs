// diagnosisInquiry + symptomCases pure-logic regression tests.
// All fixtures below are SYNTHETIC (가상) and never touch production.
// Run: node --test src/features/renewal-b/diagnosisInquiry.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const dir = path.dirname(fileURLToPath(import.meta.url));

function loadModule(filename) {
  const source = readFileSync(path.join(dir, filename), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  });
  return import(`data:text/javascript,${encodeURIComponent(outputText)}`);
}

const inquiry = await loadModule("diagnosisInquiry.ts");
const symptoms = await loadModule("symptomCases.ts");

const { validateDiagnosisInquiry, buildDiagnosisInquiry } = inquiry;
const { symptomFromHash, getSymptom, SYMPTOM_SELECTION_EVENT } = symptoms;

const ALLOWED_INQUIRY_TYPES = [
  "현장 공사 검토",
  "입찰 참가 요청",
  "업체 소개·자료 요청",
  "기타",
];

// Synthetic fixtures — clearly fake, no real personal data.
const SYNTHETIC_VALID = {
  name: "가상 담당자",
  phone: "010-0000-0000",
  site: "가상시 가상아파트 주차장",
  symptom: "물 고임",
  message: "가상 현장 상황 메모",
  consent: true,
};

// Mirror of firestore.rules isValidInquiry() for contacts (rule simulation only).
function simulatedRuleAllows(data) {
  if (typeof data.name !== "string" || data.name.length < 1 || data.name.length > 50)
    return false;
  if (typeof data.phone !== "string" || data.phone.length < 9 || data.phone.length > 20)
    return false;
  if (!ALLOWED_INQUIRY_TYPES.includes(data.inquiryType)) return false;
  if ("place" in data && !(typeof data.place === "string" && data.place.length <= 100))
    return false;
  if ("message" in data && !(typeof data.message === "string" && data.message.length <= 2000))
    return false;
  if ("status" in data && data.status !== "new") return false;
  if ("adminMemo" in data || "screening" in data) return false;
  return true;
}

describe("validateDiagnosisInquiry", () => {
  it("synthetic valid form has no errors", () => {
    assert.deepEqual(validateDiagnosisInquiry(SYNTHETIC_VALID), {});
  });

  it("requires name, phone, and consent with actionable Korean messages", () => {
    const errors = validateDiagnosisInquiry({
      ...SYNTHETIC_VALID,
      name: "   ",
      phone: "   ",
      consent: false,
    });
    assert.ok(errors.name?.includes("성함"));
    assert.ok(errors.phone?.includes("연락처") || errors.phone?.includes("전화번호"));
    assert.ok(errors.consent?.includes("동의"));
  });

  it("enforces boundary lengths matching Firestore rules (name 50 / phone 20 / place 100 / message 2000)", () => {
    const over = validateDiagnosisInquiry({
      ...SYNTHETIC_VALID,
      name: "가".repeat(51),
      phone: "0".repeat(21),
      site: "가".repeat(101),
      message: "가".repeat(2001),
    });
    assert.ok(over.name);
    assert.ok(over.phone);
    assert.ok(over.site);
    assert.ok(over.message);

    const atLimit = validateDiagnosisInquiry({
      ...SYNTHETIC_VALID,
      name: "가".repeat(50),
      phone: "010-0000-0000",
      site: "가".repeat(100),
      message: "가".repeat(2000),
    });
    assert.deepEqual(atLimit, {});
  });

  it("rejects non-phone input and too-short digit sequences", () => {
    for (const phone of ["021", "010-abc-0000", "010-12", "000-0000"]) {
      const errors = validateDiagnosisInquiry({ ...SYNTHETIC_VALID, phone });
      assert.ok(errors.phone, `expected phone error for: ${phone}`);
    }
  });

  it("accepts formatted Korean phone variants (spaces/dashes/parens/+)", () => {
    for (const phone of ["010-0000-0000", "010 0000 0000", "+82 10-0000-0000", "(010) 0000-0000"]) {
      const errors = validateDiagnosisInquiry({ ...SYNTHETIC_VALID, phone });
      assert.equal(errors.phone, undefined, `unexpected phone error for: ${phone}`);
    }
  });

  it("trims before measuring so padded input is judged fairly", () => {
    const errors = validateDiagnosisInquiry({
      ...SYNTHETIC_VALID,
      name: "   가상 담당자   ",
      phone: "   010-0000-0000   ",
    });
    assert.deepEqual(errors, {});
  });
});

describe("buildDiagnosisInquiry", () => {
  it("always sets the fixed allowed inquiryType (prior B payload omitted it)", () => {
    const payload = buildDiagnosisInquiry(SYNTHETIC_VALID);
    assert.equal(payload.inquiryType, "현장 공사 검토");
    assert.ok(ALLOWED_INQUIRY_TYPES.includes(payload.inquiryType));
  });

  it("passes the simulated Firestore contacts rule", () => {
    const withSymptom = buildDiagnosisInquiry(SYNTHETIC_VALID);
    assert.equal(simulatedRuleAllows(withSymptom), true);

    const withoutOptionals = buildDiagnosisInquiry({
      ...SYNTHETIC_VALID,
      site: "   ",
      symptom: "",
      message: "",
    });
    assert.equal(withoutOptionals.place, "미정");
    assert.deepEqual(withoutOptionals.category, []);
    assert.equal(withoutOptionals.subject, "현장 진단");
    assert.equal(simulatedRuleAllows(withoutOptionals), true);
  });

  it("trims B fields and maps place/category/subject for admin reads", () => {
    const payload = buildDiagnosisInquiry({
      ...SYNTHETIC_VALID,
      name: "  가상 담당자  ",
      phone: "  010-0000-0000  ",
      site: "  가상 현장  ",
      symptom: "지하 누수",
      message: "  가상 메모  ",
    });
    assert.equal(payload.name, "가상 담당자");
    assert.equal(payload.phone, "010-0000-0000");
    assert.equal(payload.site, "가상 현장");
    assert.equal(payload.symptom, "지하 누수");
    assert.equal(payload.message, "가상 메모");
    assert.equal(payload.place, "가상 현장");
    assert.deepEqual(payload.category, ["지하 누수"]);
    assert.equal(payload.subject, "현장 진단 · 지하 누수");
    assert.equal(payload.source, "renewal-b-diagnosis");
    assert.equal(payload.status, "new");
    assert.equal(payload.consent, true);
  });

  it("carries the actual consent input and still excludes admin-only fields", () => {
    const payload = buildDiagnosisInquiry(SYNTHETIC_VALID);
    // Established shape (prior B + ContactSection): actual consent is persisted.
    assert.equal(payload.consent, true);
    // Security policy: create must never include admin-only keys.
    assert.equal("adminMemo" in payload, false);
    assert.equal("screening" in payload, false);
  });

  it("does not fabricate consent: false input stays false and validator blocks it", () => {
    const blocked = validateDiagnosisInquiry({ ...SYNTHETIC_VALID, consent: false });
    assert.ok(blocked.consent);
    // Builder carries the input instead of inventing `true`, so a future caller
    // bypassing validation cannot create a misleading acknowledgement.
    assert.equal(buildDiagnosisInquiry({ ...SYNTHETIC_VALID, consent: false }).consent, false);
    // Real flow (DiagnosisRequestForm.handleSubmit) returns early on the above
    // error, so Firestore is only reached when consent is true.
    const allowed = validateDiagnosisInquiry(SYNTHETIC_VALID);
    assert.deepEqual(allowed, {});
    assert.equal(buildDiagnosisInquiry(SYNTHETIC_VALID).consent, true);
  });

  it("preserves B fields additively (site/symptom/message survive alongside rules fields)", () => {
    const payload = buildDiagnosisInquiry(SYNTHETIC_VALID);
    assert.equal(payload.site, SYNTHETIC_VALID.site);
    assert.equal(payload.symptom, SYNTHETIC_VALID.symptom);
    assert.equal(payload.message, SYNTHETIC_VALID.message);
    assert.ok(payload.place);
    assert.ok(payload.inquiryType);
  });
});

describe("symptomCases carry contract", () => {
  it("exposes the shared selection event name used by form + explorer", () => {
    assert.equal(SYMPTOM_SELECTION_EVENT, "oju:diagnosis-selection");
  });

  it("parses hash selections including legacy candidate aliases", () => {
    assert.equal(symptomFromHash("#cross-section/water"), "water");
    assert.equal(symptomFromHash("#cross-section/slope"), "water");
    assert.equal(symptomFromHash("#cross-section/compaction"), "pavers");
    assert.equal(symptomFromHash("#cross-section/joint"), "pavers");
    assert.equal(symptomFromHash("#cross-section/clog"), "drain");
    assert.equal(symptomFromHash("#cross-section/pipe"), "drain");
    assert.equal(symptomFromHash("#cross-section/leak"), "leak");
  });

  it("ignores non-selection hashes (form anchor, empty, unknown)", () => {
    assert.equal(symptomFromHash("#diagnosis-request"), null);
    assert.equal(symptomFromHash(""), null);
    assert.equal(symptomFromHash("#cross-section/unknown"), null);
  });

  it("resolves every carried id to a non-empty form value for the select", () => {
    for (const id of ["water", "pavers", "drain", "leak"]) {
      const symptom = getSymptom(id);
      assert.ok(symptom.formValue.length > 0);
    }
  });

  it("falls back to the first case for unknown ids instead of throwing", () => {
    assert.equal(getSymptom("nope").id, "water");
  });
});
