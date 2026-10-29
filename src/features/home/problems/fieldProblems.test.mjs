// fieldProblems 계약 회귀 테스트. 아래 레코드는 전부 SIMULATED 데이터이며
// 실제 업체 실적과 무관합니다. 실행: node --test src/features/home/problems/fieldProblems.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const dir = path.dirname(fileURLToPath(import.meta.url));

function loadHelper() {
  const source = readFileSync(path.join(dir, "fieldProblems.ts"), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  });
  return import(`data:text/javascript,${encodeURIComponent(outputText)}`);
}

const mod = await loadHelper();
const {
  FIELD_PROBLEMS,
  SAMPLE_PORTFOLIO_ID,
  getCaseDetailHref,
  getCaseExcerpt,
  getCaseImage,
  hasCuratedCaseIds,
  isBlockedCaseImage,
  toLinkedCaseRecord,
} = mod;

// SIMULATED 실제 기록 형태 (테스트 전용 가상 데이터)
const SIMULATED_REAL = {
  title: "가상 아파트 주차장 포장 보수",
  scope: "아스콘 덧씌우기 1,200㎡",
  description: "가상 설명 문구입니다.",
  imageAfter: "https://firebasestorage.example.com/cases/simulated-after.webp",
  images: ["https://firebasestorage.example.com/cases/simulated-1.webp"],
};

describe("fieldProblems curated contract", () => {
  it("두 문제 정의만 있고 ID는 비어 있다", () => {
    assert.equal(FIELD_PROBLEMS.length, 2);
    assert.deepEqual(
      FIELD_PROBLEMS.map((p) => p.id),
      ["paving", "drainage"],
    );
    for (const problem of FIELD_PROBLEMS) {
      assert.equal(problem.portfolioId, null);
    }
    assert.equal(hasCuratedCaseIds(), false);
  });

  it("SIMULATED 실제 기록은 정확한 ID URL·이미지·발췌를 만든다", () => {
    const record = toLinkedCaseRecord("simulated-doc-1", SIMULATED_REAL);
    assert.ok(record);
    assert.equal(record.id, "simulated-doc-1");
    assert.equal(record.title, SIMULATED_REAL.title);
    assert.equal(record.image, SIMULATED_REAL.imageAfter);
    assert.equal(record.excerpt, SIMULATED_REAL.scope);
    assert.equal(
      getCaseDetailHref(record.id),
      "/portfolio/detail?id=simulated-doc-1",
    );
  });

  it("발주처 유형과 확인된 결과는 실제 기록에서만 전달된다", () => {
    const record = toLinkedCaseRecord("simulated-doc-3", {
      ...SIMULATED_REAL,
      clientType: "아파트 관리단",
      result: "확인된 결과 문구",
    });
    assert.ok(record);
    assert.equal(record.clientType, "아파트 관리단");
    assert.equal(record.result, "확인된 결과 문구");

    const withoutExtra = toLinkedCaseRecord("simulated-doc-4", SIMULATED_REAL);
    assert.ok(withoutExtra);
    assert.equal(withoutExtra.clientType, undefined);
    assert.equal(withoutExtra.result, undefined);
  });

  it("data 내부 id는 문서 ID를 덮어쓰지 못한다", () => {
    const record = toLinkedCaseRecord("simulated-doc-9", {
      ...SIMULATED_REAL,
      id: "spoofed-id",
    });
    assert.ok(record);
    assert.equal(record.id, "simulated-doc-9");
  });

  it("예시 ID·예시/스톡 사진은 증빙으로 쓰지 않는다", () => {
    assert.equal(toLinkedCaseRecord(SAMPLE_PORTFOLIO_ID, SIMULATED_REAL), null);
    assert.equal(
      toLinkedCaseRecord("simulated-doc-2", {
        title: "가상 기록",
        scope: "가상 범위",
        imageAfter: "/images/portfolio/sample-parking-after.webp",
      }),
      null,
    );
    for (const stock of [
      "/images/portfolio/project1.jpg",
      "/images/portfolio/project2.webp",
      "/images/portfolio/project3.jpg",
      "/images/portfolio/project4.webp",
      "/images/methods/method-paving.webp",
      "/images/construction/civil.webp",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    ]) {
      assert.equal(isBlockedCaseImage(stock), true);
      assert.equal(
        toLinkedCaseRecord("simulated-doc-3", {
          title: "가상 기록",
          scope: "가상 범위",
          imageAfter: stock,
        }),
        null,
      );
    }
  });

  it("제목·사진·범위 중 하나라도 없으면 상담 대체(null)", () => {
    assert.equal(
      toLinkedCaseRecord("simulated-doc-4", { ...SIMULATED_REAL, title: " " }),
      null,
    );
    assert.equal(
      toLinkedCaseRecord("simulated-doc-5", {
        title: "가상 기록",
        scope: "가상 범위",
      }),
      null,
    );
    assert.equal(
      toLinkedCaseRecord("simulated-doc-6", {
        title: "가상 기록",
        imageAfter: "https://firebasestorage.example.com/cases/simulated.webp",
      }),
      null,
    );
    assert.equal(toLinkedCaseRecord("simulated-doc-7", null), null);
  });

  it("시안용 데모 미디어는 실제 증빙으로 쓰지 않는다", () => {
    for (const demo of [
      "/media/field-work/paving-demo.mp4",
      "/media/field-work/paving-poster.webp",
      "/media/field-work/civil-demo.mp4",
      "/media/field-work/civil-poster.webp",
    ]) {
      assert.equal(isBlockedCaseImage(demo), true);
      assert.equal(
        toLinkedCaseRecord("simulated-doc-8", {
          title: "가상 기록",
          scope: "가상 범위",
          imageAfter: demo,
        }),
        null,
      );
    }
  });

  it("발췌는 scope 우선, 길면 자른다", () => {
    assert.equal(getCaseExcerpt(SIMULATED_REAL), SIMULATED_REAL.scope);
    assert.equal(
      getCaseExcerpt({ description: "가상 설명" }),
      "가상 설명",
    );
    const long = getCaseExcerpt({ scope: `가${"나".repeat(200)}` }, 10);
    assert.ok(long.length <= 11);
    assert.ok(long.endsWith("…"));
  });

  it("images 배열 첫 실사진도 사용할 수 있다", () => {
    assert.equal(
      getCaseImage({
        images: [
          "/images/methods/method-walkway.webp",
          "https://firebasestorage.example.com/cases/simulated-2.webp",
        ],
      }),
      "https://firebasestorage.example.com/cases/simulated-2.webp",
    );
  });
});
