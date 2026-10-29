// FieldWorkShowcase SSR 표현 테스트. 아래 레코드는 전부 SIMULATED 데이터이며
// 실제 업체 실적·실제 백엔드 연동 검증이 아닙니다. 실행:
// node --test src/features/home/problems/FieldWorkShowcase.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const dir = path.dirname(fileURLToPath(import.meta.url));
const nodeModules = path.resolve(dir, "../../../../node_modules");
const toFileUrl = (p) => pathToFileURL(p).href;
const jsxRuntimeUrl = toFileUrl(path.join(nodeModules, "react", "jsx-runtime.js"));
const reactUrl = toFileUrl(path.join(nodeModules, "react", "index.js"));
const serverUrl = toFileUrl(path.join(nodeModules, "react-dom", "server.node.js"));
const reactSource = JSON.stringify(reactUrl);

function transpile(filename, options) {
  const source = readFileSync(path.join(dir, filename), "utf8");
  return ts.transpileModule(source, { compilerOptions: options }).outputText;
}

const dataUrl = (js) => `data:text/javascript,${encodeURIComponent(js)}`;

// SIMULATED 연결 기록 (테스트 전용 가상 데이터, 실제 실적 아님)
const SIMULATED_RECORD = {
  id: "simulated-doc-1",
  title: "가상 주차장 포장 보수",
  image: "https://firebasestorage.example.com/cases/simulated-after.webp",
  excerpt: "가상 시공 범위 1,200㎡",
};

const { FieldWorkShowcase } = await (async () => {
  const helperUrl = dataUrl(
    transpile("fieldProblems.ts", {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    }),
  );
  const mediaUrl = dataUrl(
    transpile("fieldWorkMedia.ts", {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    }),
  );
  const imageStub = dataUrl(
    `import { jsx as _jsx } from ${JSON.stringify(jsxRuntimeUrl)};\n` +
      `export default function Image(props) { return _jsx("img", { src: props.src, alt: props.alt }); }`,
  );
  const lucideStub = dataUrl(
    `import { jsx as _jsx } from ${JSON.stringify(jsxRuntimeUrl)};\n` +
      `const icon = (props) => _jsx("svg", { "aria-hidden": props["aria-hidden"], className: props.className });\n` +
      `export const ArrowRight = icon;\n` +
      `export const Play = icon;\n` +
      `export const RotateCcw = icon;`,
  );

  const videoUrl = dataUrl(
    transpile("FieldWorkVideo.tsx", {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    })
      .split('"react/jsx-runtime"')
      .join(JSON.stringify(jsxRuntimeUrl))
      .split('"react"')
      .join(reactSource)
      .split('"lucide-react"')
      .join(JSON.stringify(lucideStub))
      .split('"./fieldWorkMedia"')
      .join(JSON.stringify(mediaUrl)),
  );

  const cssStub = dataUrl(
    `export default new Proxy({}, { get: (_, p) => p });`,
  );

  let showcaseJs = transpile("FieldWorkShowcase.tsx", {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
  });
  showcaseJs = showcaseJs
    .split('"react/jsx-runtime"')
    .join(JSON.stringify(jsxRuntimeUrl))
    .split('"next/image"')
    .join(JSON.stringify(imageStub))
    .split('"lucide-react"')
    .join(JSON.stringify(lucideStub))
    .split('"../HomeSections.module.css"')
    .join(JSON.stringify(cssStub))
    .split('"./fieldProblems"')
    .join(JSON.stringify(helperUrl))
    .split('"./fieldWorkMedia"')
    .join(JSON.stringify(mediaUrl))
    .split('"./FieldWorkVideo"')
    .join(JSON.stringify(videoUrl));
  return import(dataUrl(showcaseJs));
})();

const React = (await import(reactUrl)).default;
const { renderToStaticMarkup } = await import(serverUrl);

const render = (props) =>
  renderToStaticMarkup(React.createElement(FieldWorkShowcase, props));

describe("FieldWorkShowcase presentation", () => {
  it("대표 포장 항목과 PC의 간결한 작업 순서만 보이고 분야 탭은 없다", () => {
    const html = render({});
    assert.ok(html.includes("주차장·진입로 포장 보수"));
    assert.ok(!html.includes("주차장·진입로가 갈라지고 패였나요?"));
    assert.ok(!html.includes('role="tablist"'));
    assert.ok(!html.includes('role="tab"'));
    assert.ok(!html.includes("field-work-tab-"));
    assert.ok(!html.includes("aria-selected"));
    const steps = html.match(/<ol[^>]*aria-label="작업 순서 예시"[^>]*>[\s\S]*?<\/ol>/);
    assert.ok(steps);
    assert.ok(steps[0].includes("hidden space-y-2 md:block"));
    assert.equal((steps[0].match(/<li\b/g) || []).length, 3);
    for (const title of ["파손 구간 확인", "기존 포장면 정리", "포장 보수·마감"]) {
      assert.ok(steps[0].includes(title));
    }
    assert.ok(!html.includes("작업 순서 설명"));
    assert.ok(!html.includes("일반적인 작업 순서 예시입니다"));
    assert.ok(html.includes('aria-label="포장면 정리 작업 재생"'));
    assert.ok(html.includes("예시 영상"));
    assert.ok(!html.includes(">예시</span>"));
    assert.ok(html.includes("실제 오주건설 현장이 아닙니다"));
    assert.ok(html.includes("영상 출처"));
    assert.ok(html.includes("/media/field-work/paving-preparation-demo.mp4"));
    assert.ok(html.includes("/media/field-work/paving-preparation-poster.webp"));
    assert.ok(html.includes("포장면 정리 작업"));
    assert.ok(!html.includes("포장면 정리 작업 참고 영상"));
    assert.ok(html.includes("약 11초"));
    const videoTag = html.match(/<video[^>]*>/);
    assert.ok(videoTag && !videoTag[0].includes("controls"));
    assert.ok(!html.includes("관련 시공사례 보기"));
    assert.ok(!html.includes("영상을 불러오지 못했습니다"));
    assert.ok(html.includes("intro_media"));
    assert.ok(html.includes("actions_media"));
    assert.ok(!html.includes("actions_steps"));
    assert.ok(html.includes("max-w-[64rem]"));
    assert.ok(html.includes("grid-rows-[auto_1fr]"));
    assert.ok(html.includes("min-h-[44px]"));
  });

  it("홈 액션은 시공실적 허브(1순위)와 사업분야 범위(2순위)로만 이어진다", () => {
    const html = render({});
    assert.ok(html.includes(">다른 현장 사례<"));
    assert.ok(html.includes('href="/portfolio"'));
    assert.ok(html.includes("전체 사업분야 보기"));
    assert.ok(html.includes('href="/construction"'));
    assert.ok(!html.includes("/#contact"));
    const videos = html.match(/<video[^>]*>/g) || [];
    assert.equal(videos.length, 1);
    assert.ok(!html.includes("civil-demo.mp4"));
  });

  it("SIMULATED 실제 기록은 사진·발췌만 보이고 데모·개별 링크가 없다", () => {
    const html = render({ cases: { paving: SIMULATED_RECORD } });
    assert.ok(html.includes(SIMULATED_RECORD.title));
    assert.ok(html.includes(SIMULATED_RECORD.image));
    assert.ok(html.includes(SIMULATED_RECORD.excerpt));
    assert.ok(!html.includes("/media/field-work/paving-preparation-demo.mp4"));
    assert.ok(!html.includes("/portfolio/detail?id=simulated-doc-1"));
    assert.ok(!html.includes("관련 시공사례 보기"));
    assert.ok(html.includes(">다른 현장 사례<"));
    assert.ok(html.includes('href="/portfolio"'));
    assert.ok(!html.includes("작업 순서 예시"));
  });

  it("featuredId로 다른 대표 항목을 지정할 수 있다", () => {
    const html = render({ featuredId: "drainage" });
    assert.ok(html.includes("/media/field-work/civil-demo.mp4"));
    assert.ok(html.includes("도로 보수 작업 참고 영상"));
    assert.ok(!html.includes("배수관시공영상"));
    assert.ok(!html.includes('role="tablist"'));
  });
});
