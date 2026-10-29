// 시공실적 증거(게시 상태·필터·영상 검증) 순수 함수 테스트. 아래 레코드는 전부
// SIMULATED 데이터이며 실제 업체 실적과 무관합니다. 실행:
// node --test src/features/home/problems/*.test.mjs src/features/home/portfolio/*.test.mjs
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

const filters = await loadModule("portfolioFilters.ts");
const poster = await loadModule("videoPoster.ts");

const {
  EMPTY_PORTFOLIO_FILTER,
  filterProjects,
  getClientTypeOptions,
  getTradeOptions,
  isPublishedProject,
} = filters;
const { buildPortfolioVideoPath, validatePortfolioVideoFile } = poster;

// SIMULATED 목록 (테스트 전용 가상 데이터)
const SIMULATED_PROJECTS = [
  {
    id: "sim-1",
    title: "가상 아파트 주차장 포장 보수",
    trade: "지반조성포장",
    location: "가상시 가상공구",
    scope: "아스콘 덧씌우기 1,200㎡",
    clientType: "아파트 관리단",
    result: "평탄성 확인",
  },
  {
    id: "sim-2",
    title: "가상 단지 배수로 정비",
    trade: "토목",
    location: "가상시 배수구간",
    scope: "배수로 정비 300m",
    clientType: "공공기관",
    result: "통수 확인",
    videoUrl: "https://firebasestorage.example.com/cases/simulated-work.mp4",
    videoPoster: "https://firebasestorage.example.com/cases/simulated-poster.jpg",
  },
  {
    id: "sim-3",
    title: "가상 비공개 보수 기록",
    trade: "도장",
    location: "가상시 비공개구간",
    scope: "외벽 도장 500㎡",
    clientType: "아파트 관리단",
    result: "마감 확인",
    published: false,
  },
];

describe("portfolio published rule", () => {
  it("미정의/true는 공개, false만 비공개", () => {
    assert.equal(isPublishedProject({ id: "a", title: "가상" }), true);
    assert.equal(
      isPublishedProject({ id: "a", title: "가상", published: true }),
      true,
    );
    assert.equal(
      isPublishedProject({ id: "a", title: "가상", published: false }),
      false,
    );
  });

  it("filterProjects는 비공개 기록을 항상 제외한다", () => {
    const result = filterProjects(SIMULATED_PROJECTS, EMPTY_PORTFOLIO_FILTER);
    assert.deepEqual(
      result.map((p) => p.id),
      ["sim-1", "sim-2"],
    );
  });
});

describe("portfolio filterProjects", () => {
  it("공종 필터는 정확히 일치하는 기록만 남긴다", () => {
    const result = filterProjects(SIMULATED_PROJECTS, {
      ...EMPTY_PORTFOLIO_FILTER,
      trade: "토목",
    });
    assert.deepEqual(result.map((p) => p.id), ["sim-2"]);
  });

  it("발주처 유형 필터는 정확히 일치하는 기록만 남긴다", () => {
    const result = filterProjects(SIMULATED_PROJECTS, {
      ...EMPTY_PORTFOLIO_FILTER,
      clientType: "아파트 관리단",
    });
    assert.deepEqual(result.map((p) => p.id), ["sim-1"]);
  });

  it("텍스트 검색은 제목·위치·시공범위·확인된 결과를 대상으로 한다", () => {
    assert.deepEqual(
      filterProjects(SIMULATED_PROJECTS, {
        ...EMPTY_PORTFOLIO_FILTER,
        query: "주차장",
      }).map((p) => p.id),
      ["sim-1"],
    );
    assert.deepEqual(
      filterProjects(SIMULATED_PROJECTS, {
        ...EMPTY_PORTFOLIO_FILTER,
        query: "배수구간",
      }).map((p) => p.id),
      ["sim-2"],
    );
    assert.deepEqual(
      filterProjects(SIMULATED_PROJECTS, {
        ...EMPTY_PORTFOLIO_FILTER,
        query: "덧씌우기",
      }).map((p) => p.id),
      ["sim-1"],
    );
    assert.deepEqual(
      filterProjects(SIMULATED_PROJECTS, {
        ...EMPTY_PORTFOLIO_FILTER,
        query: "통수",
      }).map((p) => p.id),
      ["sim-2"],
    );
  });

  it("조건에 맞는 기록이 없으면 빈 배열을 반환한다", () => {
    const result = filterProjects(SIMULATED_PROJECTS, {
      ...EMPTY_PORTFOLIO_FILTER,
      query: "존재하지않는가상조건",
    });
    assert.deepEqual(result, []);
  });

  it("옵션은 값이 있는 것만 반환한다", () => {
    assert.deepEqual(getTradeOptions(SIMULATED_PROJECTS.filter(isPublishedProject)), [
      "지반조성포장",
      "토목",
    ]);
    assert.deepEqual(
      getClientTypeOptions(SIMULATED_PROJECTS.filter(isPublishedProject)),
      ["공공기관", "아파트 관리단"],
    );
    assert.deepEqual(getTradeOptions([]), []);
  });
});

describe("portfolio video validation", () => {
  it("MP4/WebM 외 MIME은 한국어 오류를 반환한다", () => {
    const message = validatePortfolioVideoFile({
      type: "video/avi",
      size: 1024,
    });
    assert.ok(typeof message === "string" && message.includes("MP4"));
  });

  it("30MB 초과는 한국어 오류를 반환하고 경계값은 통과한다", () => {
    const over = validatePortfolioVideoFile({
      type: "video/mp4",
      size: 30 * 1024 * 1024 + 1,
    });
    assert.ok(typeof over === "string" && over.includes("30MB"));
    assert.equal(
      validatePortfolioVideoFile({
        type: "video/mp4",
        size: 30 * 1024 * 1024,
      }),
      null,
    );
    assert.equal(
      validatePortfolioVideoFile({ type: "video/webm", size: 1024 }),
      null,
    );
  });

  it("업로드 경로는 portfolio/{id}/work-{timestamp}.{ext} 형식이다", () => {
    assert.equal(
      buildPortfolioVideoPath("sim-1", "site.mp4", 1700000000000),
      "portfolio/sim-1/work-1700000000000.mp4",
    );
    assert.equal(
      buildPortfolioVideoPath("sim-1", "site.webm", 1700000000000),
      "portfolio/sim-1/work-1700000000000.webm",
    );
    assert.equal(
      buildPortfolioVideoPath("sim-1", "site.avi", 1700000000000),
      "portfolio/sim-1/work-1700000000000.mp4",
    );
  });
});
